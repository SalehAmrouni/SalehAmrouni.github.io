"""Shrinks project images for the web and points each meta.json at the results.

For every folder listed in projects/projects.json:
  - thumbnail.png  -> thumbnail.webp (max 960px wide), meta "thumbnail" updated
  - images/*.png over 300 KB -> .webp (max 1920px wide), meta "images" updated

Originals are left in place so nothing is lost; delete them once you're happy.
Also writes og-image.jpg (1200x630 link preview) from the featured project.

Usage (needs Pillow):  py tools/optimize_images.py
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PROJECTS = ROOT / "projects"
BIG_IMAGE_BYTES = 300 * 1024


def to_webp(src: Path, dst: Path, max_width: int, quality: int = 82) -> None:
    im = Image.open(src)
    if im.width > max_width:
        im = im.resize((max_width, round(im.height * max_width / im.width)), Image.LANCZOS)
    im.save(dst, "WEBP", quality=quality, method=6)
    print(f"  {src.relative_to(ROOT)} {src.stat().st_size // 1024} KB -> {dst.name} {dst.stat().st_size // 1024} KB")


def write_og_image(src: Path) -> None:
    im = Image.open(src).convert("RGB")
    target = 1200 / 630
    if im.width / im.height > target:
        w = round(im.height * target)
        im = im.crop(((im.width - w) // 2, 0, (im.width + w) // 2, im.height))
    else:
        h = round(im.width / target)
        im = im.crop((0, (im.height - h) // 2, im.width, (im.height + h) // 2))
    im.resize((1200, 630), Image.LANCZOS).save(ROOT / "og-image.jpg", "JPEG", quality=85)
    print(f"  og-image.jpg from {src.relative_to(ROOT)}")


def main() -> None:
    folders = json.loads((PROJECTS / "projects.json").read_text(encoding="utf-8"))
    featured_thumb = None

    for folder in folders:
        base = PROJECTS / folder
        meta_path = base / "meta.json"
        meta = json.loads(meta_path.read_text(encoding="utf-8"))
        print(folder)

        thumb_png = base / "thumbnail.png"
        if thumb_png.exists():
            to_webp(thumb_png, base / "thumbnail.webp", 960)
            meta["thumbnail"] = "thumbnail.webp"
            if meta.get("featured") or featured_thumb is None:
                featured_thumb = thumb_png

        images = []
        for name in meta.get("images", []):
            src = base / "images" / name
            if src.suffix.lower() == ".png" and src.exists() and src.stat().st_size > BIG_IMAGE_BYTES:
                dst = src.with_suffix(".webp")
                to_webp(src, dst, 1920, quality=88)
                images.append(dst.name)
            else:
                images.append(name)
        meta["images"] = images

        meta_path.write_text(json.dumps(meta, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    if featured_thumb:
        write_og_image(featured_thumb)


if __name__ == "__main__":
    main()
