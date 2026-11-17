#!/usr/bin/env python3
"""
Generate WhatsApp/social OG PNGs + short static share HTML for every calculator.

All calculator share links use the SAME preview:
  - Anupaat Nivesh website logo (src/assets/logo.webp)
  - Title text: Investment Planner

Public share URL shape: https://www.anupaatnivesh.com/s/{shortId}
(file on disk: public/s/{shortId}/index.html)
"""

from __future__ import annotations

import json
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
META_PATH = ROOT / "src" / "data" / "calculatorShare.json"
OG_DIR = ROOT / "public" / "og" / "calculators"
SHARED_OG_NAME = "investment-planner.png"
SHORT_DIR = ROOT / "public" / "s"
LEGACY_DIR = ROOT / "public" / "share" / "calculators"
SITE = "https://www.anupaatnivesh.com"
VENV = Path(__file__).resolve().parent / ".venv-share"

SHARED_OG_TITLE = "Investment Planner"
SHARED_OG_DESCRIPTION = (
    "Free investment planners from Anupaat Nivesh — SIPs, goals, education, and more. "
    "Mobile-friendly educational calculators."
)
SHARED_ACCENT = "#E11D48"


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


def load_site_logo():
    """Same logo asset used on the website navbar."""
    from PIL import Image

    for candidate in (
        ROOT / "src" / "assets" / "logo.webp",
        ROOT / "src" / "assets" / "logo.png",
    ):
        if candidate.exists():
            return Image.open(candidate).convert("RGBA")
    return None


def make_shared_investment_planner_png(out_path: Path):
    """
    Unified WhatsApp preview card:
    dark navy + left accent + website logo + “Investment Planner”.
    """
    from PIL import Image, ImageDraw

    W, H = 1200, 630
    accent = hex_to_rgb(SHARED_ACCENT)
    bg = (15, 23, 42)
    img = Image.new("RGB", (W, H), bg)
    draw = ImageDraw.Draw(img)

    # Left accent bar (matches reference card style)
    draw.rectangle([0, 0, 18, H], fill=accent)
    draw.rectangle([18, 0, W, 8], fill=accent)

    logo = load_site_logo()
    y = 56
    if logo is not None:
        # Same logo as website navbar — sit on a light plate so dark “Nivesh” stays readable
        max_w, max_h = 520, 100
        ratio = min(max_w / logo.width, max_h / logo.height)
        lw = max(1, int(logo.width * ratio))
        lh = max(1, int(logo.height * ratio))
        logo = logo.resize((lw, lh), Image.Resampling.LANCZOS)
        pad_x, pad_y = 28, 18
        plate = [
            64 - pad_x,
            y - pad_y,
            64 + lw + pad_x,
            y + lh + pad_y,
        ]
        draw.rounded_rectangle(plate, radius=18, fill=(255, 255, 255))
        img.paste(logo, (64, y), logo)
        y = y + lh + pad_y + 40
    else:
        brand_font = load_font(28)
        draw.text((64, y), "ANUPAAT NIVESH", font=brand_font, fill=(148, 163, 184))
        y = y + 56

    title_font = load_font(64)
    body_font = load_font(30)
    cta_font = load_font(28)

    draw.text((64, y), SHARED_OG_TITLE, font=title_font, fill=(248, 250, 252))
    y += 86

    for line in wrap_text(draw, SHARED_OG_DESCRIPTION, body_font, W - 160)[:3]:
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
    redirect = item["redirect"]
    image = f"{SITE}/og/calculators/{SHARED_OG_NAME}"
    has_query = "?" in redirect
    title = SHARED_OG_TITLE
    desc = SHARED_OG_DESCRIPTION

    html = f"""<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="robots" content="index, follow" />
    <title>{title} | Anupaat Nivesh</title>
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
    <meta property="og:image:alt" content="Anupaat Nivesh — Investment Planner" />

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
        var map = {{ age: 'a', target: 't', lump: 'l', sip: 'm', sipYears: 'y', rate: 'r' }};
        var src = new URLSearchParams(window.location.search || '');
        var out = new URLSearchParams();
        src.forEach(function (value, key) {{
          out.set(map[key] || key, value);
        }});
        var q = out.toString();
        var base = {json.dumps(redirect)};
        var joiner = {json.dumps('&' if has_query else '?')};
        var target = q ? (base + joiner + q) : base;
        window.location.replace(target + (window.location.hash || ''));
      }})();
    </script>
  </head>
  <body>
    <div class="wrap">
      <p>Opening Investment Planner… <a id="continue" href="{redirect}">Continue</a></p>
    </div>
    <script>
      (function () {{
        var map = {{ age: 'a', target: 't', lump: 'l', sip: 'm', sipYears: 'y', rate: 'r' }};
        var src = new URLSearchParams(window.location.search || '');
        var out = new URLSearchParams();
        src.forEach(function (value, key) {{
          out.set(map[key] || key, value);
        }});
        var q = out.toString();
        var base = {json.dumps(redirect)};
        var joiner = {json.dumps('&' if has_query else '?')};
        var href = q ? (base + joiner + q) : base;
        document.getElementById('continue').href = href + (window.location.hash || '');
      }})();
    </script>
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

    shared_png = OG_DIR / SHARED_OG_NAME
    make_shared_investment_planner_png(shared_png)
    print(f"wrote shared OG {shared_png.relative_to(ROOT)}")

    for item in items:
        # Keep per-id PNGs as copies of the shared card so old image URLs still work
        per_id = OG_DIR / f"{item['id']}.png"
        shutil.copyfile(shared_png, per_id)

        short = item.get("shortId") or item["id"]
        short_url = f"{SITE}/s/{short}"
        legacy_url = f"{SITE}/share/calculators/{item['id']}.html"
        make_html(item, SHORT_DIR / short / "index.html", short_url)
        make_html(item, LEGACY_DIR / f"{item['id']}.html", legacy_url)
        print(f"wrote /s/{short}/ + legacy share (shared Investment Planner preview)")

    edu2 = next(i for i in items if i["id"] == "education-v2")
    make_html(
        edu2,
        ROOT / "public" / "share" / "child-education-v2.html",
        f"{SITE}/share/child-education-v2.html",
    )
    print("wrote legacy aliases")


if __name__ == "__main__":
    main()
