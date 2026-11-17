#!/usr/bin/env python3
"""
Generate WhatsApp/social OG PNGs + short static share HTML for every calculator.

Public share URL shape: https://www.anupaatnivesh.com/s/{shortId}
(file on disk: public/s/{shortId}/index.html — works on CRA + Hostinger DirectoryIndex)

WhatsApp crawlers do not run React JS, so each share URL must be a real HTML
file with og:* tags pointing at a 1200×630 PNG.
"""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META_PATH = ROOT / "src" / "data" / "calculatorShare.json"
OG_DIR = ROOT / "public" / "og" / "calculators"
SHORT_DIR = ROOT / "public" / "s"
LEGACY_DIR = ROOT / "public" / "share" / "calculators"
SITE = "https://www.anupaatnivesh.com"
VENV = Path(__file__).resolve().parent / ".venv-share"


def ensure_pillow():
    try:
        from PIL import Image, ImageDraw, ImageFont  # noqa: F401

        return
    except ImportError:
        pass

    if not VENV.exists():
        subprocess.check_call([sys.executable, "-m", "venv", str(VENV)])
    pip = VENV / "bin" / "pip"
    py = VENV / "bin" / "python"
    subprocess.check_call([str(pip), "install", "pillow", "-q"])
    subprocess.check_call([str(py), str(Path(__file__).resolve()), *sys.argv[1:]])
    sys.exit(0)


def hex_to_rgb(hex_color: str):
    h = hex_color.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def load_font(size: int):
    from PIL import ImageFont

    candidates = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            try:
                return ImageFont.truetype(path, size=size)
            except OSError:
                continue
    return ImageFont.load_default()


def wrap_text(draw, text, font, max_width):
    words = text.split()
    lines = []
    current = ""
    for word in words:
        trial = f"{current} {word}".strip()
        if draw.textlength(trial, font=font) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def make_png(item: dict, out_path: Path):
    from PIL import Image, ImageDraw

    W, H = 1200, 630
    accent = hex_to_rgb(item.get("accent", "#0B6E4F"))
    bg = (15, 23, 42)
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, 18, H], fill=accent)
    draw.rectangle([18, 0, W, 8], fill=accent)

    brand_font = load_font(28)
    title_font = load_font(64)
    body_font = load_font(30)
    cta_font = load_font(28)

    draw.text((64, 48), "ANUPAAT NIVESH", font=brand_font, fill=(148, 163, 184))

    title_lines = wrap_text(draw, item["label"], title_font, W - 140)
    y = 140
    for line in title_lines[:2]:
        draw.text((64, y), line, font=title_font, fill=(248, 250, 252))
        y += 74

    desc_lines = wrap_text(draw, item["description"], body_font, W - 160)
    y += 12
    for line in desc_lines[:3]:
        draw.text((64, y), line, font=body_font, fill=(203, 213, 225))
        y += 40

    cta = "Open calculator →"
    pad_x, pad_y = 28, 16
    tw = draw.textlength(cta, font=cta_font)
    chip_w, chip_h = int(tw + pad_x * 2), 56
    chip_x, chip_y = 64, H - 110
    draw.rounded_rectangle(
        [chip_x, chip_y, chip_x + chip_w, chip_y + chip_h],
        radius=14,
        fill=accent,
    )
    draw.text((chip_x + pad_x, chip_y + pad_y), cta, font=cta_font, fill=(255, 255, 255))

    out_path.parent.mkdir(parents=True, exist_ok=True)
    img.save(out_path, "PNG", optimize=True)


def make_html(item: dict, out_path: Path, share_url: str):
    calc_id = item["id"]
    title = item["ogTitle"]
    desc = item["description"]
    redirect = item["redirect"]
    image = f"{SITE}/og/calculators/{calc_id}.png"
    has_query = "?" in redirect

    html = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="robots" content="index, follow" />
    <title>{title}</title>
    <meta name="description" content="{desc}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Anupaat Nivesh" />
    <meta property="og:locale" content="en_IN" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{desc}" />
    <meta property="og:url" content="{share_url}" />
    <meta property="og:image" content="{image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="{item['label']}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{desc}" />
    <meta name="twitter:image" content="{image}" />

    <link rel="canonical" href="{SITE}{redirect.split('?')[0]}" />
    <link rel="icon" href="/favicon.ico" />
    <style>
      html, body {{ margin: 0; min-height: 100%; font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; background: #f8fafc; color: #0f172a; }}
      .wrap {{ min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1.5rem; text-align: center; }}
      a {{ color: #0b6e4f; font-weight: 600; }}
    </style>
    <script>
      (function () {{
        var base = {json.dumps(redirect)};
        var q = window.location.search || '';
        var h = window.location.hash || '';
        var target = base;
        if (q) {{
          target = base + ({json.dumps(has_query)} ? '&' + q.slice(1) : q);
        }}
        window.location.replace(target + h);
      }})();
    </script>
  </head>
  <body>
    <div class="wrap">
      <p>Opening {item['label']}… <a id="continue" href="{redirect}">Continue</a></p>
    </div>
    <script>
      (function () {{
        var base = {json.dumps(redirect)};
        var q = window.location.search || '';
        var h = window.location.hash || '';
        var href = base;
        if (q) {{
          href = base + ({json.dumps(has_query)} ? '&' + q.slice(1) : q);
        }}
        document.getElementById('continue').href = href + h;
      }})();
    </script>
  </body>
</html>
"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")


def make_legacy_redirect(to_short_url: str, out_path: Path):
    html = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="refresh" content="0;url={to_short_url}" />
    <link rel="canonical" href="{to_short_url}" />
    <script>
      (function () {{
        var dest = {json.dumps(to_short_url)};
        window.location.replace(dest + (window.location.search || '') + (window.location.hash || ''));
      }})();
    </script>
    <title>Redirecting…</title>
  </head>
  <body>
    <p>Redirecting to <a href="{to_short_url}">{to_short_url}</a>…</p>
  </body>
</html>
"""
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(html, encoding="utf-8")


def main():
    ensure_pillow()
    items = json.loads(META_PATH.read_text(encoding="utf-8"))
    OG_DIR.mkdir(parents=True, exist_ok=True)
    SHORT_DIR.mkdir(parents=True, exist_ok=True)
    LEGACY_DIR.mkdir(parents=True, exist_ok=True)

    for item in items:
        short = item.get("shortId") or item["id"]
        short_url = f"{SITE}/s/{short}"
        png = OG_DIR / f"{item['id']}.png"
        short_html = SHORT_DIR / short / "index.html"
        make_png(item, png)
        make_html(item, short_html, short_url)
        # Legacy long paths keep working
        make_legacy_redirect(short_url, LEGACY_DIR / f"{item['id']}.html")
        print(f"wrote /s/{short}/ + og/{item['id']}.png")

    # Extra legacy aliases
    edu2 = next(i for i in items if i["id"] == "education-v2")
    short_edu2 = f"{SITE}/s/{edu2.get('shortId') or edu2['id']}"
    make_legacy_redirect(short_edu2, ROOT / "public" / "share" / "child-education-v2.html")
    print("wrote legacy aliases")


if __name__ == "__main__":
    main()
