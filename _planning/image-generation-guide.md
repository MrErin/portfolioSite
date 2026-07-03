# Image Generation Guide

Quick reference for generating the assets in `image-inventory.md` without paid subscriptions.

---

## Your Assets by Type

| Asset | Format | Best Tool |
|-------|--------|-----------|
| Project thumbnails (x4) | Raster (PNG/JPG) | ChatGPT free, Google Gemini, or Microsoft Designer |
| Profile photo (x1) | Raster (PNG/JPG) | Already have (photograph) |
| Looking glass frames (1-3) | PNG with transparency | ChatGPT/Gemini + background removal |
| Hero ground silhouette (x1) | SVG | Recraft (generate) or Claude artifacts (hand-build) |
| Falling objects (x6) | SVG line drawings | Claude artifacts (best for simple SVGs) or Recraft |

---

## Recommended Tools

### For Raster Images (thumbnails, frames)

**Google Gemini** (free, browser-based)
- 100 free images/day — most generous free tier
- Good quality, no signup beyond Google account
- Caveat: transparent backgrounds may need post-processing

**ChatGPT Free Tier** (free, browser-based)
- Access to GPT Image 1.5 with daily limits
- Strong prompt adherence, good for specific compositions
- Good at Victorian/ornate styles

**Microsoft Designer** (free, browser-based)
- DALL-E 3 quality, completely free
- Easiest entry point, no subscription

**For transparent backgrounds:** Generate the image, then use a free background remover (remove.bg, Adobe Express, or Canva's one free removal) to get the PNG with transparency. This is relevant for the looking glass frames.

### For SVG Assets (silhouette, falling objects)

**Claude Artifacts** (free tier available)
- Claude can generate SVG code directly in artifacts
- Best for simple, clean shapes — line drawings, silhouettes, geometric forms
- You describe what you want and Claude writes the SVG paths
- Perfect for the falling objects (simple ink-sketch style) and possibly the ground silhouette
- No raster-to-vector conversion needed — outputs clean SVG code directly
- Limitation: complex organic/detailed illustrations may look simplistic

**Recraft** (free, browser-based)
- 30 free SVG generations/day
- Produces clean, editable vector paths
- Better than Claude for more detailed/artistic SVGs
- Good fallback if Claude's SVG output isn't detailed enough for the silhouette

### For Raster-to-SVG Conversion (if needed)

If you generate a raster image and need to convert to SVG:
- **Vectorizer.ai** — best quality, slower
- **Recraft's converter** — free, decent quality
- **VectoSolve** — 1 free conversion, highest quality output

---

## Suggested Workflow

### 1. Falling Objects (x6 SVGs) — Start here, lowest risk
Use **Claude artifacts** on claude.ai. Paste the prompts from the image inventory one at a time. Claude will generate SVG code you can save directly. These are simple line drawings so Claude should handle them well. If a result isn't right, iterate in the same conversation.

### 2. Hero Ground Silhouette (x1 SVG)
Try **Claude artifacts** first — describe the underground earth/roots silhouette. If the result is too simplistic, generate a raster version with Gemini or ChatGPT, then trace to SVG with Vectorizer.ai or Recraft's converter.

### 3. Project Thumbnails (x4 rasters)
Use **Google Gemini** or **ChatGPT free**. These are the most complex images (AI art, screenshots, etc.) so a dedicated image generator will produce better results. Use the prompts from the inventory as starting points.

### 4. Looking Glass Frames (1-3 PNGs)
Generate with **ChatGPT or Gemini** (they handle ornate/Victorian styles well), then run through a **free background remover** to get transparency. Alternatively, try **Recraft** to get them directly as SVGs with transparency built in.

### 5. Profile Photo
You likely already have this — just crop to square.

---

## Tips for Reducing Churn

- **Be specific in prompts** — the prompts in image-inventory.md are already detailed, use them as-is
- **Iterate in the same conversation** — "make the roots more gnarled" rather than starting over
- **Generate 3-4 variations** and pick the best, rather than trying to perfect one
- **Don't over-refine** — these images will be viewed at small sizes (160px tall thumbnails) or low opacity (15-25% falling objects). Minor imperfections won't be visible.
