# Vinted Size Filter

A small browser extension that adds a size filter to Vinted **seller/member pages**.

Vinted's general catalog search lets you filter by size, but that filter disappears once
you're browsing a specific seller's closet — so buying, say, kids' clothing in a specific
size means scrolling through everything that seller has listed. This extension adds that
filter back on member pages.

## How it works

It's a plain content script that runs only on `vinted.<tld>/member/*` pages. It reads the
size/condition text already rendered in each item card in your browser (the same data
Vinted's own page displays), and hides cards that don't match the size you type or pick.
Nothing is scraped, sent to a server, or stored — it's a client-side DOM filter over your
own already-loaded page.

Since a seller's items load via infinite scroll, there's also a "Load full closet" button
that scrolls the page for you to pull in all their listings before filtering, so you don't
have to scroll manually to find matches further down.

## Install (unpacked, for personal use)

1. Open `chrome://extensions` (or the equivalent in your Chromium-based browser).
2. Enable **Developer mode** (top right).
3. Click **Load unpacked** and select the `extension/` folder in this repo.
4. Visit any Vinted seller page, e.g. `https://www.vinted.nl/member/<id>`. A filter bar
   appears above their listed items.

## Supported domains

The extension is scoped to the Vinted country domains listed in `extension/manifest.json`
(`vinted.com`, `vinted.nl`, `vinted.de`, `vinted.fr`, etc). If your country's domain is
missing, add a matching entry to the `matches` array and reload the extension.

## Limitations

- Relies on Vinted's current page markup (`data-testid` attributes on item cards). If
  Vinted changes their frontend, the selectors in `extension/content.js` may need updating.
- Size matching works off the size text Vinted already shows on each card (e.g. `104`,
  `XL / 42 / 14`, `36.5`). Items with no size shown (accessories, "Universal", etc.) are
  excluded whenever a size filter is active.

## Disclaimer

Not affiliated with or endorsed by Vinted. For personal use only.
