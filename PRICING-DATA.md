# pricing-data.json — how to edit prices

Johan edits this file by hand. The pricing page reads it in the browser (no build step).

## Fields
- `usd_to_zar` — exchange rate used for Rand display (e.g. 16.5 means R16.50 per $1).
- `items` — each product/add-on/bundle:
  - `usd` — 1-year (or once-off / free) price in US dollars
  - `usd_2y` / `usd_3y` — total price for 2-year / 3-year prepaid terms (when sold)
  - `billing` — `free` | `once` | `year` | `total` (hint for formatting)
  - `label` — human name (documentation only)

## Rand formula (in the browser)
ZAR = ceil(usd × usd_to_zar / 5) × 5
Always rounds UP to the nearest R5. Example: $5 × 16.50 = 82.50 → R85; $50 → R825.

## Do not
- Put Rand amounts in this file (they are calculated).
- Leave hard-coded R… or $… in the HTML for live prices — use `data-price` keys instead.

Source of USD list: APEX pricing PDF (USD) + live site structure. Starting rate 16.50 matches the ZAR reference PDF.

## Currency default (client-side, free, no API)

- If `localStorage` has `apex-currency` = `ZAR` or `USD`, that choice always wins.
- Else treat the visitor as South Africa (default **ZAR**) when:
  - `Intl.DateTimeFormat().resolvedOptions().timeZone === 'Africa/Johannesburg'`, or
  - any entry in `navigator.languages` contains `-ZA` (e.g. `en-ZA`).
- Everyone else defaults to **USD**.
- No IP geolocation, no third-party calls, no API keys (GitHub Pages stays free/static).
- VPN, travel, or a mis-set device timezone can change the default — that is why the ZAR/USD toggle stays visible.

