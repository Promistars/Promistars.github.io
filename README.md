# Promistars.github.io

Personal website for Chenzhang Mu, built with Hexo 8.

## Local Development

```bash
npm install
npm run server
```

Open `http://localhost:4000/`.

## Build

```bash
npm run build
```

To also sync the generated homepage assets into the repository root for `main / root` GitHub Pages publishing:

```bash
npm run deploy:root
```

## Content

Profile content lives in `source/_data/profile.json`.

Theme files live in `themes/promistars/`.

## GitHub Pages

This repository includes `.github/workflows/pages.yml` for GitHub Actions Pages deployment. It can also be served directly from `main / root` because the root `index.html`, `css/site.css`, and `js/site.js` are generated from the Hexo theme.
