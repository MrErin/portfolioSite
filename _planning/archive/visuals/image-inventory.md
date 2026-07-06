# Image Inventory

Current placeholders that need real images, ordered by priority.

---

## 1. Project Card Thumbnails

**File:** `src/components/projects/ProjectCard.tsx:40-41`
**What:** Preview thumbnail for each project card (4 cards total)
**Current:** Gradient div, `aria-hidden`
**Dimensions:** 160px tall (`h-40`) x full card width (responsive)
**Whimsy behavior:** Stops 0–1 show looking glass frame overlay; stop 2 shows clean image (replaces old grey gradient swap)
**Recommended source size:** ~800x320px (landscape, ~2.5:1 ratio) to cover card widths up to 2x on retina
**Generate with:** Google Gemini (100 free/day) or ChatGPT free tier — best for detailed raster art

## 2. Project Modal Header Image

**File:** `src/components/projects/ProjectModal.tsx:68-71`
**What:** Hero/header image inside the project detail modal
**Current:** Gradient div, `aria-hidden`
**Dimensions:** 128px tall (`h-32`) x full modal width (max `max-w-2xl` = 672px)
**Whimsy behavior:** None (always purple gradient)
**Recommended source size:** ~1344x256px (or same image as thumbnail, cropped)
**Note:** Reuses project thumbnail image — no separate asset needed

## 3. Profile Photo

**File:** `src/components/about/AboutPanel.tsx:9-13`
**What:** Circular avatar in the About panel
**Current:** Circular gradient div, `role="img"`, `aria-label="Profile photo placeholder"`
**Dimensions:** 128x128px (`w-32 h-32`), clipped to circle (`rounded-full`)
**Whimsy behavior:** None
**Recommended source size:** 256x256px square (retina)
**Generate with:** Existing photograph — crop to square

## 4. Demo Placeholder (Modal)

**File:** `src/components/projects/ProjectModal.tsx:91-93`
**What:** Content area for demo embed/video/screenshot inside the modal
**Current:** Text "Demo placeholder" in a bordered box
**Dimensions:** Full modal content width, height is content-driven (no fixed height)
**Whimsy behavior:** None
**Recommended source size:** ~1344x800px if using screenshots (flexible)

---

## 5. Looking Glass Frame Overlay(s)

**Used on:** Project card thumbnails (items #1 above)
**What:** Ornate Victorian mirror/picture frame overlay — semi-transparent PNG positioned over project thumbnails to reinforce the "peering into this project" Alice theme
**Implementation:** Absolutely-positioned layer on the thumbnail container
**Dimensions:** Must match thumbnail dimensions — ~800x320px (same as item #1)
**Format:** PNG with transparency (frame edges opaque/decorative, center fully transparent)
**Quantity:** Start with 1 universal frame. Optionally 2–3 variants for visual variety — test whether multiple frames add interest or look too busy.
**Whimsy behavior:**
- **Stops 0–1:** Overlay visible on card thumbnails
- **Stop 2:** No overlay — clean image
- **Modal:** Overlay always removed — user sees the project image clearly regardless of whimsy level

**Design notes:**
- Frame should feel gothic/Victorian — ornate but not heavy enough to obscure the project image
- Vignette darkening at edges can help sell depth
- If using multiple frames, they should feel like a cohesive set (same style, different shapes/details)

**AI art prompt (single frame):**
> An ornate Victorian mirror frame viewed straight-on, landscape orientation. The frame is richly detailed with gothic flourishes — scrollwork, filigree, and subtle floral or vine motifs. Dark aged metal or dark wood appearance (gunmetal, tarnished silver, or near-black). The center of the frame is completely empty/transparent — this is a border element only. Flat front-facing perspective, no 3D angle or tilt. Solid frame on a transparent background. Aspect ratio 2.5:1 (e.g. 800x320). The frame border should be roughly 30–50px thick at the edges, thicker at corners with decorative details. Style: dark fantasy, gothic, antique. No text, no reflections, no glass effect.

**AI art prompt (variant set of 3):**
> Three distinct ornate Victorian mirror frames in landscape orientation, each shown separately on a transparent background. All share a cohesive dark gothic aesthetic (tarnished metal, aged dark wood) but differ in shape and ornamental details: one with pointed gothic arch corners, one with flowing Art Nouveau curves, one with rigid geometric Victorian ironwork. Frames are borders only — centers are completely empty/transparent. Flat front-facing perspective. Each frame at 2.5:1 aspect ratio (e.g. 800x320). Frame borders roughly 30–50px thick, thicker at corners. No text, no reflections, no characters.

**Generate with:** ChatGPT free or Google Gemini (handle ornate/Victorian styles well). Then run through a free background remover (remove.bg, Adobe Express) to get transparency. Alternatively try Recraft (30 free SVG generations/day) to get vector frames directly.
**Post-processing:** If raster, export at 2x (1600x640) for retina sharpness.

## 6. Hero Ground Silhouette

**File:** `src/components/core/Hero.tsx`
**What:** Dark silhouette of earth, roots, and irregular ground anchored to the bottom of the hero viewport — establishes the "underground" atmosphere immediately
**Current:** No image — just gradient background and particles
**Format:** SVG (solid silhouette, scales perfectly, tiny file size)
**Dimensions:** Full viewport width, roughly 200–400px tall at the bottom edge
**Implementation:** CSS background or inline SVG, positioned `bottom center`, width 100%. Particles float above it for layered depth.
**Whimsy behavior:**
- **Stops 0–1:** Visible
- **Stop 2:** Could hide or keep (silhouette is subtle enough to survive "professional" mode — decide during build)
**Responsive:** SVG scales naturally with `width: 100%` and `preserveAspectRatio`. Organic/irregular edges mean side cropping is invisible.
**Generate with:** Try Claude artifacts first (can write SVG code directly). If too simplistic, generate raster with Gemini/ChatGPT then convert to SVG via Vectorizer.ai or Recraft's converter.

**AI art prompt:**
> A wide horizontal silhouette of underground earth viewed from below, looking up. Irregular ground surface along the top edge with dangling roots, small rocks, and organic tendrils reaching downward. The silhouette is solid black on a transparent background. Gothic and slightly fantastical — the roots should feel old and gnarled, not botanical. No text, no characters, no objects above the ground line. Flat vector style suitable for SVG conversion. Aspect ratio 4:1 (e.g. 2560x640). The bottom 30–40% of the image should be solid black (underground mass), with the top edge being the irregular, detailed ground line and root structures trailing off into transparency.

## 7. Falling Object SVGs (Parallax Background)

**Used in:** `src/components/projects/ProjectsSection.tsx` (stop 0 only, behind project cards)
**What:** Simple line-drawing SVG illustrations of Alice in Wonderland objects that drift past in the background as the user scrolls, reinforcing the "falling down the rabbit hole" scene
**Format:** SVG — black stroke on transparent background, line-drawing style (not filled/solid)
**Dimensions:** Each roughly 120–200px rendered size. Source SVGs should be ~200x200px viewBox (square-ish, actual shape varies)
**Quantity:** 6 items, randomly selected during scroll so variety emerges naturally
**Whimsy behavior:**
- **Stop 0:** Visible (parallax mode only)
- **Stops 1–2:** Hidden (grid layout, no parallax)
- Respect `prefers-reduced-motion` — hidden when reduced motion is on

**Rendering rules:**
- Opacity: 15–25% — atmospheric, not competing with project cards
- Scale: Smaller than project cards
- Scroll speed: Different from cards (faster or slower) to create depth separation
- Density: 1–2 visible at any given time, max
- Randomly assigned from the set per scroll position

**The six objects:**
1. **Armchair** — overstuffed Victorian armchair, slightly tilted
2. **Teacup and saucer** — Mad Tea Party, recognizable silhouette
3. **Pocket watch** — open-faced, chain trailing, White Rabbit's signature item
4. **Skeleton key** — ornate old key, Alice motif of locked doors
5. **Playing card** — single card, slightly rotated (Queen of Hearts)
6. **Open book** — pages mid-flutter, Alice was reading before she fell

**AI art prompt (generate individually, one per prompt):**
> A simple line drawing of [OBJECT] in a sketchy hand-drawn illustration style. Black ink strokes on a transparent/white background. No fill, no shading, no color — outlines and minimal interior detail only. The style should feel like a quick ink sketch in the margin of a Victorian storybook. Slight imperfection in the lines (not perfectly geometric). Object should be slightly tilted or tumbling as if falling through the air. Square composition. No text, no background elements, no shadows.
>
> Replace [OBJECT] with:
> - "an overstuffed Victorian armchair with curved legs and tufted back"
> - "a teacup sitting on a saucer, both slightly tilted, tea splashing out"
> - "an open-faced pocket watch with a trailing chain, hands at different positions"
> - "an ornate skeleton key with a decorative bow, Victorian style"
> - "a single playing card (Queen of Hearts) seen at a three-quarter angle, slightly bent"
> - "an open book with pages fluttering as if caught in wind"

**Generate with:** Claude artifacts (best option — writes SVG code directly, no conversion needed). These are simple line drawings, exactly what Claude handles well. Paste prompts one at a time. If results need more detail, fall back to Recraft (30 free SVG generations/day).
**Post-processing:** If generated as raster, trace to SVG via Vectorizer.ai or Recraft converter. Set `fill="none" stroke="currentColor"` so color can be controlled via CSS.

---

## Not Image Placeholders (Decorative Only)

These are gradient elements that serve as design, not placeholders for real images:

- **Hero accent bar** (`Hero.tsx:14-17`) — 1px gold gradient line, decorative divider
- **Hero background** (`Hero.tsx:7`) — full-viewport gradient background

---

## Data Model Gap

The `Project` interface (`src/components/projects/types.ts`) has **no image fields**. Adding images will require extending it — e.g., `thumbnailUrl`, `modalImageUrl`, or a single `imageUrl` field.

## Whimsy Considerations

The `boringImages` config flag will be repurposed. Instead of swapping to grey gradients, it now controls the looking glass frame overlay visibility:
- `boringImages: false` (stops 0–1) → frame overlay visible on thumbnails
- `boringImages: true` (stop 2) → no overlay, clean project image
- Modal always shows clean image regardless of whimsy level
