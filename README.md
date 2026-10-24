# SalehAmrouni.github.io

Retro-desktop portfolio. Plain HTML/CSS/JS, no build step; GitHub Pages serves it as-is.

## Adding a project

1. Create `projects/<id>/` (lowercase letters, numbers, `-` or `_`).
2. Add `thumbnail.png`, and optionally `hover.mp4`, `images/*`, `videos/*`, `download/download.zip`.
3. Add `projects/<id>/meta.json`:

```json
{
  "title": "My Project",
  "description": "What it is. Line breaks become paragraphs.",
  "tags": ["C", "PHYSICS"],
  "featured": false,
  "howItWorks": "Optional section.",
  "run": "Optional section: how to run it.",
  "requirements": "Optional section.",
  "thumbnail": "thumbnail.png",
  "githubUrl": "",
  "liveUrl": "",
  "hasHoverVideo": false,
  "hasDownload": false,
  "images": ["1.png"],
  "videos": ["1.mp4"]
}
```

4. Add `<id>` to `projects/projects.json` (the order there is the order on the site).
5. Optional: run `py tools/optimize_images.py` (needs Pillow) to make WebP thumbnails and shrink big screenshots.

Only one project should have `"featured": true`; it gets the big card and a desktop icon.

## Running locally

```
py -m http.server 8123
```

then open http://127.0.0.1:8123/ (opening `index.html` directly won't work, since the site fetches JSON).
