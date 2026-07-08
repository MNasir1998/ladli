# Yeh Kahani, Tumhari Hai 💌

A personal romantic reveal website — QR scan → tap to open → name → a long
love letter → reasons → your real story timeline → a series of heartfelt
questions → proposal → celebration, with your song playing throughout.

## How to put this live on GitHub Pages (free, ~3 minutes)

1. Create a new repository on GitHub (e.g. `yeh-kahani-tumhari-hai`). Keep it **Public**
   (GitHub Pages on the free plan needs a public repo).
2. Upload **all files in this folder** (`index.html`, `style.css`, `script.js`,
   the `assets` folder with `song.mp3` and `photos`, this `README.md`) to the
   repository — either by dragging them into the GitHub web UI ("Add file" →
   "Upload files") or via git:
   ```bash
   git init
   git add .
   git commit -m "Yeh Kahani, Tumhari Hai"
   git branch -M main
   git remote add origin https://github.com/<your-username>/yeh-kahani-tumhari-hai.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch
   **main**, folder **/ (root)**. Save.
5. Wait ~1 minute. Your site will be live at:
   `https://<your-username>.github.io/yeh-kahani-tumhari-hai/`
6. Turn that link into a QR code (e.g. at https://www.qr-code-generator.com or
   any free QR generator) and share/print the QR — scanning it opens the site.

## Personalizing it

There are no photos in this version — everything is told through words instead.
To edit the words:

- **Song**: already wired up as `assets/song.mp3`. To swap it, replace that file
  with your own (keep the same filename) or edit the `src` on the `<audio>` tag
  at the bottom of `index.html`.
- **Nicknames & reasons**: edit the `NICKNAMES` and `REASONS` arrays near the
  top of `script.js`.
- **The love letter**: edit `LETTER_TEMPLATE` in `script.js` — it's a template
  literal, so line breaks and spacing there are exactly what shows on screen.
- **The many questions**: edit the `QUESTIONS` array in `script.js` — add,
  remove, or reorder as many as you like; the dots and "Agla sawaal" button
  adjust automatically.
- **Your real story timeline**: edit the `<ol class="timeline">` items
  directly in `index.html`.
- **The final proposal lines**: edit the text inside
  `<h2 class="title-lg propose-q">` in `index.html`.
- **Colors/fonts**: all design tokens are CSS variables at the top of
  `style.css` (`:root { ... }`).

## Notes on the music

- Mobile browsers block audio with sound from autoplaying until someone taps
  the screen — that's why there's a "Kholo" (Open) button on the first screen;
  tapping it starts the song.
- There's also a small round 🎵 button fixed in the bottom-right corner on
  every screen. If the browser ever blocks the automatic start, it turns into
  a ▶ so she can tap it once to start the song manually — the same button lets
  her pause/resume any time.
- Everything is plain HTML/CSS/JS — no build step, no dependencies beyond two
  Google Fonts loaded from a CDN, so it works exactly as-is on GitHub Pages.
