# APEX Slotcar Systems website

The public website for APEX Slotcar Systems and APEX Race Control, at
**https://apexslotcarsystems.co.za**.

It's a plain static site: one HTML page and one stylesheet, with no build step and no framework.

## How it's served

- GitHub Pages publishes this repository's `main` branch from the root folder.
- `CNAME` holds the custom domain. Don't edit or remove it, or the domain stops working.
- `.nojekyll` turns Jekyll off, so files are served exactly as they are. This README isn't turned
  into a page, but it can be opened as a plain file at `/README.md`, so keep it free of anything
  private.

## Folders

| Path | What it is |
| --- | --- |
| `index.html` | The home page (the whole site) |
| `style.css` | All styles |
| `fonts/` | Web fonts used by the page |
| `img/` | Logo, favicon and splash image |
| `assets/` | Files offered for download (brochure, launch image) |
| `CNAME` | Custom domain for GitHub Pages |
| `.nojekyll` | Tells GitHub Pages not to run Jekyll |

## Editing and publishing

1. Edit the files and open `index.html` in a browser to check the result.
2. Commit to `main` and push. GitHub Pages republishes the site within a few minutes.
3. Hard-refresh the browser if the old version still shows.

## Rules for this repository

- It's **public**: everything here, including its history, is visible to everyone.
- No personal data (email addresses, mailing lists, names), passwords, keys or tokens.
- No real event, club, venue or third-party brand names in site text unless they're needed and
  carry a trademark notice.
