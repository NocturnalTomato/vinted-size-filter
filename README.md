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

## Using it on a phone (any browser)

No mainstream mobile browser reliably supports loading unpacked extensions anymore
(Kiwi Browser's extension support has broken down), so mobile works via a
**bookmarklet** instead: a bookmark whose URL is JavaScript instead of a link. Tap it
while on a Vinted seller page and it injects the exact same filter bar as the
extension. It works in Chrome, Brave, Firefox, Samsung Internet — any browser that
lets you edit a bookmark's URL — but you tap it manually each time instead of it
running automatically.

The bookmarklet itself is short — it's just a loader that fetches the real,
always-up-to-date script from this repo (which is why the repo needs to be public):

1. Open [`bookmarklet/loader.txt`](bookmarklet/loader.txt) in this repo and copy its
   entire contents (one line starting with `javascript:`).
2. On your phone, bookmark any page, then edit that bookmark: set the **name** to
   something like "Vinted Size Filter" and replace the **URL** with what you copied.
   (In Chrome/Brave for Android: Bookmarks → the new bookmark → ⋮ → Edit.)
3. Go to a Vinted seller page, open your bookmarks, tap "Vinted Size Filter". The
   filter bar appears the same as the desktop extension.
4. If you navigate to a different seller page, tap the bookmarklet again — it doesn't
   persist across page loads the way an installed extension does.

`bookmarklet/inline.js` (what the loader fetches) is generated from
`extension/content.js` and `extension/content.css` via `node bookmarklet/build.js`, so
it always matches the extension's behavior. If you change either source file, rerun
that command and push — the loader bookmarklet on your phone never needs to change,
since it just fetches whatever's currently in the repo.

## Sharing it with someone else

Since this isn't published to the Chrome Web Store, the easiest way to hand it to
someone is to zip the `extension/` folder and send them the zip:

1. Zip the `extension/` folder (just that folder, not the whole repo).
2. Send them the zip file.
3. They unzip it anywhere on their PC, then follow the **Install** steps above,
   pointing "Load unpacked" at the unzipped `extension` folder.

No account, build step, or Chrome Web Store review needed — it's the same unpacked
install either of you would do, just starting from a zip instead of a git clone.
Chrome will keep re-enabling Developer mode warnings on restart for unpacked
extensions; that's normal.

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
