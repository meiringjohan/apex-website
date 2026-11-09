# APEX website (Soft Modern preview)

**Status:** local preview only. Not pushed to `meiringjohan/apex-website`. Live site unchanged until Johan gives the go.

Design: Option 3 Soft Modern (soft bento). Home hero shows the APEX logo badge. Neutral white cards, dark slate type, APEX green (#8dc63f) accents only — pill nav, light split hero (no splash banner).

## Pages (18)

| File | Role |
|------|------|
| `index.html` | Home |
| `timing.html` | How timing works |
| `pricing.html` | Editions & pricing (URL kept) |
| `hardware.html` | Hardware & lap counters |
| `screens.html` | Screens & streaming |
| `faq.html` | FAQ |
| `contact.html` | Contact + Keep me posted |
| `add-ons/*.html` | 11 add-on detail pages |

## Edit prices (no build step)

1. Open `pricing-data.json`.
2. Change a product’s `usd` (and `usd_2y` / `usd_3y` for multi-year totals).
3. Change `usd_to_zar` when the exchange rate moves (e.g. `16.5`).
4. Save. Refresh the pricing page.

**Rand formula (in the browser):** `ZAR = ceil(usd × usd_to_zar / 5) × 5` — always rounds **up** to the nearest R5.

Bundle “separately” figures and best-value savings are **computed** from each bundle’s `includes` list — do not hard-code Rand or Dollar amounts in the HTML.

Currency default: `localStorage['apex-currency']` wins; else ZAR if timezone is `Africa/Johannesburg` or any `navigator.languages` entry contains `-ZA`; else USD. Toggle always visible in the nav (and on the pricing page). No IP API.

See also `PRICING-DATA.md`.

## Screenshots

App captures under `screens/`. See `SCREENSHOTS.md` for capture dates and the list to re-shoot after the UI freeze.

## Keep me posted / contact

Same behaviour as today’s live site: `mailto:info@apexslotcarsystems.co.za` with the Keep me posted subject and privacy line. No third-party form.

## Local preview

```bash
cd /workspace/site-build-soft
python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

## Hosting

Static files for GitHub Pages. English only. `.nojekyll` and `CNAME` preserved from the live repo.
