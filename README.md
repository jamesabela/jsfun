# ReadMe

This started as just a place to put a few JS tricks, but now has an entire IDE in it and many more helpful teaching tools. To make the tools easy enough to get around here is the Website:

* [General Website](https://jamesabela.github.io/jsfun/)
* [Computing Tools](https://jamesabela.github.io/jsfun/computing.html)

It also includes resources from various teachers and friends.

You can also get straight to the biggest tool: [Python Code Lab](https://jamesabela.github.io/jsfun/pythoncopy.html)


## Site icon, footer and privacy on new pages

All existing pages already use the shared privacy controls. For each new HTML page, add the following shared elements; do not copy the analytics implementation or add GoatCounter's original tracking script.

Early in `<head>`, before external resources:

```html
<meta name="referrer" content="no-referrer">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
```

Use the shared blue puzzle-piece icon unless the page has an intentional tool-specific icon. The SVG stays sharp at different sizes; the ICO provides a browser fallback. Both are served locally.

Include this support message and Privacy Notice link in the footer:

```html
<footer>
  <p>
    Made with ❤️ for better thinking. If it helped you, support the project.
    <a href="https://wise.com/pay/me/jamesphilipj" target="_blank" rel="noopener noreferrer"><strong>Buy me a tea</strong></a>.
  </p>
  <p><a href="privacy.html">Privacy Notice</a></p>
</footer>
```

Do not add a Creative Commons licence notice (including CC BY-SA or CC BY-NC-SA) by default. Pages and resources may have different licences. Add a licence notice only when it applies to that page, and preserve any required existing attribution.

Before `</body>`:

```html
<script src="privacy.js" data-page="/my-new-tool.html" defer></script>
```

Replace `my-new-tool.html` with the new page's actual repository-relative path. Keep it a fixed identifier: never insert a visitor's name, work or URL parameters. There is no per-page registration needed in GoatCounter.

For a page at `lessons/my-new-tool.html`, use:

```html
<!-- In <head> -->
<link rel="icon" href="../favicon.ico" sizes="any">
<link rel="icon" type="image/svg+xml" href="../favicon.svg">

<!-- In the footer and before </body>, respectively -->
<a href="../privacy.html">Privacy Notice</a>
<script src="../privacy.js" data-page="/lessons/my-new-tool.html" defer></script>
```

Keep the same support message and Buy me a tea link in nested pages; the favicon paths, relative privacy link and script path change. The referrer meta tag stays the same. For deeper folders, adjust the relative links accordingly.

`privacy.js` reads the visitor's browser preference and only sends a basic page count when allowed. It also honours browser privacy signals and prepares click-to-load controls for external iframes marked with `data-private-src` instead of `src`. It sends no analytics on local previews. The preference on a local preview is separate from the live website's preference. This control does not block hosting requests, other external resources or user-directed sharing.

Run `node tests/privacy.mjs` before pushing. It checks tracked and untracked non-ignored HTML pages, including the new page's integration and fixed identifier. See [AGENTS.md](AGENTS.md) for development requirements and [PDPA.md](PDPA.md) for the internal privacy record.
