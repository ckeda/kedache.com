# Keda Che Personal Website

Static personal portfolio site for Keda Che.

## Structure

- `index.html` - page content and SEO metadata
- `assets/css/styles.css` - site styling
- `assets/js/main.js` - small homepage interaction script
- `assets/site-version.json` - current deployed release version for cache refresh checks
- `assets/images/` - portraits, project cards, and social preview image
- `assets/docs/` - public downloadable documents
- `robots.txt` and `sitemap.xml` - search engine crawl configuration
- `CNAME` - GitHub Pages custom domain configuration for `kedache.com`

## Cache Busting

- Local static assets are versioned with a `?v=...` query so browsers fetch the latest CSS, JS, images, and PDF after each release.
- `index.html` also checks `assets/site-version.json` at runtime; if an older HTML document is cached, the page forces one clean reload to the newest release.
- When shipping future asset changes, bump the shared release token in `index.html`, `assets/css/styles.css`, and `assets/site-version.json`.
