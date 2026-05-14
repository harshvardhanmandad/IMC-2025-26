# IMC 2025-26 Rankings — Website

Official finalist rankings page for the **International Math Challenge 2025-26**, built on the MathAI design system.

**Live:** _(add your GitHub Pages URL here once deployed)_

---

## Files

| File | Purpose |
|---|---|
| `index.html` | The page itself (single scrollable view) |
| `mai-tokens.css` | MathAI design tokens (colors, type, spacing) |
| `app.js` | Vanilla-JS interactivity (grade tabs, search, FAQ, show-more) |
| `data.js` | Rankings data — 8 grades × 50 finalists |

No build step. No frameworks. ~150 KB total transfer.

---

## Deploy to GitHub Pages

1. Create a new repo on github.com (any name, e.g. `imc-results-2025-26`).
2. Upload all four files to the repo root (`Add file → Upload files`, drag them in, commit).
3. Go to **Settings → Pages**.
4. Under **Source**, pick **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
5. Wait ~30 seconds. Your URL appears at the top of the Pages page: `https://<user>.github.io/<repo>/`.

### Custom domain (optional)

To serve at e.g. `results.mathai.ai`:

1. Add a `CNAME` file to the repo root containing just the domain:
   ```
   results.mathai.ai
   ```
2. In your DNS provider, add a CNAME record:
   `results` → `<user>.github.io`
3. Back in **Settings → Pages**, enter the domain in **Custom domain**.
4. Wait for the TLS cert (~10 min), then enable **Enforce HTTPS**.

---

## Updating the rankings

To change names, ranks, or schools: edit `data.js`. Each grade is an array of `{ rank, recognition, name, school }` objects. Commit and push — Pages redeploys in ~30 seconds.

To change the topper highlights shown above the rankings: edit the `TOPPERS` array at the top of `app.js`.

To change the FAQ, foreword, or 10x band copy: edit `index.html`.

---

## License

© 2026 Infybytes AI Labs Pvt Ltd · MathAI
