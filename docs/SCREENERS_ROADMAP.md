# Screeners hub — implementation roadmap

Live data is proxied from **NSE India** (`/api/screeners/hub`, `/api/corporate-actions`). No Moneycontrol API (no stable public feed).

## Status

| Section | Status | NSE source | Notes |
|--------|--------|------------|--------|
| Market Breadth | **Live** | `allIndices` (advances/declines/unchanged) | A-D ratio & sentiment derived |
| Market Overview | **Live** | `allIndices` (NIFTY 50, NIFTY NEXT 50) | Open/high/low/30D/365D |
| Recent Big Buys | **Live** | Bulk + block deals | Sorted by value (Cr) |
| Recent Bets | **Live** | Deals (promoter/DII heuristic) | Party filter dropdown |
| Stock Updates Insights | **Live** | Aggregated deals | Top stocks, insiders, MF investors |
| Delivery Insights | **Live (proxy)** | Deal qty by symbol | Not true delivery % — labeled in UI |
| Corporate Actions | **Live** | `corporates-corporateActions` | Splits / bonus / dividend |
| All Deals | **Live** | `snapshot-capital-market-largedeal` | Filters + value Cr calc |
| Promoter / FII / DII / MF tables | **Live** | Same deals, party classifier | Heuristic names — verify filings |
| Order Book Updates | **Live** | `corporate-announcements` (keyword filter) | Purchase order / contract filings |
| IPO / Right Issues | **Live** | `ipo-current-issue`, `all-upcoming-issues` | Empty when NSE has no open IPOs |
| Index ticker row (hero) | Static | — | Phase 2: wire `allIndices` |
| Stock/MF screener cards | Static links | — | MF cards → `/invest?preset=…` (shared filters) |
| MF explorer filters | **Live** | mfapi.in + shared `marketInsights` UI | Same filter bar as All Deals |

## Calculations

- **Deal value (Cr):** `(quantity × weighted avg price) / 10,000,000`
- **Market breadth %:** `count / (advances + declines + unchanged) × 100`
- **Advance–decline ratio:** `advances / declines`
- **Sentiment label:** ratio thresholds (≥1.2 Bullish, ≥1.05 Mildly Bullish, etc.)
- **% of equity (holdings):** not available from bulk deals — column omitted until shareholding API added

## Phase 2 (backlog)

1. **%AGE column** — NSE shareholding / market-cap per symbol
2. **True delivery breakout** — NSE security-wise delivery or CM delivery file
3. **Date range filters** on deal tables (query param → refetch)
4. **IPO enrichment** — `ipo-detail?symbol=&series=EQ` when list non-empty
5. **ESOP badge** — map from `remarks` when NSE provides it
6. **Caching tiers** — breadth 60s, deals 90s, announcements 5m
7. **Moneycontrol fallback** — only if NSE blocks server IP (scraping not preferred)

## Shared UI (`src/shared/marketInsights/`)

- `MarketInsightsFilterBar` — All Deals–style filter row (screeners + MF explorer)
- `MarketInsightsPanelShell` — white card + left accent + MARKET INSIGHTS subtitle
- `mfExplorerConfig.js` — presets, URL query keys, `buildMfExplorerPath()`
- `MfExplorerShortcuts` — pill shortcuts on `/invest`

## API

- `GET /api/screeners/hub` — aggregated payload (~90s cache)
- `GET /api/corporate-actions?limit=5` — corporate actions columns

## Local dev

```bash
npm run server   # port 8000
npm run start    # CRA proxies /api → 8000
```

Open `/screeners` and ensure sections load (not “Failed to load market data”).
