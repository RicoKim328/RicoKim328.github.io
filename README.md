# RicoKim328.github.io

Personal blog (Jekyll + GitHub Pages).

## Publish flow

1. Morning drafts land in `_drafts/` (not published).
2. To publish: move the file into `_posts/YYYY-MM-DD-slug.md`.
3. Commit & push `main` → GitHub Pages builds the site.

Local draft preview:

```bash
docker run --rm -p 4000:4000 -v "$PWD:/srv/jekyll" jekyll/jekyll:4.2.2 jekyll serve --drafts --host 0.0.0.0
```

Production-like build (drafts excluded):

```bash
docker run --rm -v "$PWD:/srv/jekyll" -e JEKYLL_ENV=production jekyll/jekyll:4.2.2 jekyll build
```

## Content

- Published posts: `_posts/`
- Drafts: `_drafts/` (template: `_drafts/.template-market-brief.md`)
- Images: `Picture/`, `assets/market-news/`
- Categories come from post front matter (`category`)
