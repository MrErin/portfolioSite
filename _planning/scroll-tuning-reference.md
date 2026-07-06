# Scroll Tuning Reference

Every variable that controls scroll-linked animation in the Projects section. Organized by element, with current values, computed results, and the effect of increasing/decreasing each number.

All scroll progress values are fractions of 0-1, where 0 = section enters viewport from below, 1 = section exits viewport above.

---

## 0. Cards vs. Objects — Side-by-Side Comparison

Both components use the same pattern: `useTransform(scrollYProgress, [scrollStart, scrollEnd], outputRange)`. The structure is identical; only the numbers differ.

### Scroll-linked transforms

| Property | Cards (ParallaxCard.tsx) | Objects (FallingObjects.tsx) | Same pattern? |
|---|---|---|---|
| Window source | `getCardScrollWindow` (WINDOW_RATIO = 0.5) | `getObjectScrollWindow` (OBJECT_WINDOW_RATIO = 0.18, constrained to card range) | Same underlying function, different ratio + range |
| Fade margins | 15% of window | 15% of window | Identical |
| Max opacity | **1.0** | **0.2** | Different constant |
| translateY | **[1000, -2000]** asymmetric | **[1200, -1200]** symmetric | Same pattern, different numbers |
| scale | **[0.9, 1.1]** | **[0.85, 1.0]** | Same pattern, different numbers |
| rotate | scroll-linked **[-20, 20]** | static (set once on mount) | Different approach |
| translateX | scroll-linked **[-120, 120]**, alternating by index | none | Cards only |

### What this means in practice

- **Card translateY is asymmetric** `[1000, -2000]`: cards drift up slowly from below, then accelerate past. The -2000 exit is twice the 1000 entry, creating a "falling away" feel.
- **Object translateY is symmetric** `[1200, -1200]`: objects move at constant speed through the viewport. No acceleration effect.
- **Card opacity peaks at 1.0**, objects peak at **0.2** — objects are always faint/ghostly.
- **Cards rotate as they scroll** (tumbling); objects have a **fixed rotation** assigned on mount.
- **Cards drift horizontally** (alternating left/right); objects have **no horizontal scroll movement**.

### Raw transform code (for quick reference)

**ParallaxCard.tsx (lines 38-68):**
```
scrollWindow  -> getCardScrollWindow(index, totalCards)
opacity       -> useTransform(progress, [s, s+fade, e-fade, e], [0, 1, 1, 0])
translateY    -> useTransform(progress, [s, e], [1000, -2000])
rotate        -> useTransform(progress, [s, e], [-20, 20])
scale         -> useTransform(progress, [s, e], [0.9, 1.1])
translateX    -> useTransform(progress, [s, e], [-120, 120])   // negated for odd cards
```

**FallingObject in FallingObjects.tsx (lines 81-95):**
```
scrollWindow  -> getObjectScrollWindow(index, totalSlots, projects.length)
opacity       -> useTransform(progress, [s, s+fade, e-fade, e], [0, 0.2, 0.2, 0])
translateY    -> useTransform(progress, [s, e], [1200, -1200])
scale         -> useTransform(progress, [s, e], [0.85, 1.0])
(no scroll-linked rotate — rotation is static from slot)
(no translateX)
```

---

## 1. Section & Scroll System

All in `animationConfig.ts` unless noted.

### SECTION_HEIGHT_VH = 400

Total height of the `<section>` element in vh units. This is the scroll runway — a taller section means more physical scrolling before the section ends.

- **Increase**: more scroll distance, all animations play out slower relative to scroll
- **Decrease**: less scroll distance, everything compresses and plays faster

### VIEWPORT_VH = 100 (hardcoded)

Represents the browser viewport height. Used to calculate when the sticky container pins/unpins. Not tunable.

### TOTAL_SCROLL_VH = SECTION_HEIGHT_VH + VIEWPORT_VH = 500

Total scroll distance from section-enter to section-leave. Derived, not directly set.

### STICKY_START = VIEWPORT_VH / TOTAL_SCROLL_VH = 0.20

Scroll progress when the sticky container first pins to the viewport. Before this, the section is still scrolling into view.

- Derived from SECTION_HEIGHT_VH. Cannot be set independently.

### STICKY_END = SECTION_HEIGHT_VH / TOTAL_SCROLL_VH = 0.80

Scroll progress when the sticky container unpins. After this, the section scrolls away.

- Derived from SECTION_HEIGHT_VH. Cannot be set independently.

### stickyRange = STICKY_END - STICKY_START = 0.60

The fraction of scroll progress during which the sticky viewport is pinned. All card and object animations happen within this range. Derived.

### INNER_PAD_RATIO = 0.01

Buffer inside the sticky range so animations don't start/end at the exact pin/unpin moments.

- **Increase**: larger dead zone at start/end of sticky range, usable animation range shrinks
- **Decrease**: animations start/end closer to the pin/unpin boundary

### Computed range bounds (with 0.01 pad)

- **rangeStart** = STICKY_START + stickyRange * 0.01 = **0.206**
- **rangeEnd** = STICKY_END - stickyRange * 0.01 = **0.794**

These are the actual start/end points for card distribution (and formerly objects too).

### useScroll offset (ProjectsSection.tsx:42)

```ts
offset: ['start end', 'end start']
```

- `'start end'`: scrollYProgress = 0 when section's top edge reaches viewport's bottom edge
- `'end start'`: scrollYProgress = 1 when section's bottom edge reaches viewport's top edge

This is what makes scrollYProgress span the full journey of the section through the viewport.

---

## 2. Project Cards

### WINDOW_RATIO = 0.5 (animationConfig.ts)

Fraction of the sticky range that each card's scroll window occupies. Controls how long each card is "active" (receiving scroll-linked transforms).

- **Increase**: each card has a longer window, more overlap between consecutive cards, cards coexist longer
- **Decrease**: shorter windows, cards cycle faster, less overlap

### Computed card values (5 cards, WINDOW_RATIO = 0.5)

| Derived value | Formula | Result |
|---|---|---|
| cardWindowSize | stickyRange * 0.5 | **0.30** |
| cardStagger | (rangeEnd - rangeStart - 0.30) / 4 | **0.072** |
| Card 0 window | | 0.206 - 0.506 |
| Card 1 window | | 0.278 - 0.578 |
| Card 2 window | | 0.350 - 0.650 |
| Card 3 window | | 0.422 - 0.722 |
| Card 4 window | | 0.494 - 0.794 |

### Card opacity (animationConfig.ts getOpacityRange)

Uses 15% fade margins (hardcoded in `getOpacityRange`).

```
fadeMargin = cardWindowSize * 0.15 = 0.045
```

Opacity keyframes for each card over its window:

| Scroll position | Opacity | What's happening |
|---|---|---|
| scrollStart | 0 | invisible |
| scrollStart + 0.045 | 1 | fully faded in |
| scrollEnd - 0.045 | 1 | still fully visible |
| scrollEnd | 0 | fully faded out |

Card 4 example: opacity goes 0 at 0.494, reaches 1 at 0.539, stays 1 until 0.749, fades to 0 at 0.794.

### PARALLAX_CONFIG.translateYOutput = [1000, -2000] (animationConfig.ts)

Vertical travel in pixels, mapped to each card's [scrollStart, scrollEnd].

- **[0] = 1000**: Starting Y offset in px. Card begins 1000px below its natural position (off-screen below viewport center).
  - Increase: card starts further below, enters viewport later in its window
  - Decrease: card starts closer to center, enters sooner
- **[1] = -2000**: Ending Y offset in px. Card ends 2000px above its natural position (off-screen above).
  - More negative: card exits viewport sooner in its window, moves faster upward
  - Less negative: card lingers longer near viewport center

**Visual entry/exit timing for Card 4** (natural position ~ viewport center at ~450px):
- Enters viewport bottom (~900px) when translateY ~ 450: scroll **~0.549**
- At viewport center (translateY ~ 0): scroll **~0.594**
- Exits viewport top (~0px) when translateY ~ -450: scroll **~0.639**
- Card is off-screen from **0.639** onward but opacity doesn't reach 0 until **0.794**

This gap (0.639 to 0.794) is the "dead tail" — the card is invisible because it's off-screen, but its scroll window hasn't ended yet.

### PARALLAX_CONFIG.rotateOutput = [-20, 20] (animationConfig.ts)

Rotation in degrees over each card's scroll window.

- **[0] = -20**: Starting rotation (counterclockwise tilt)
- **[1] = 20**: Ending rotation (clockwise tilt)
- Wider range: more dramatic tumbling
- Narrower range: subtler, more upright cards

### PARALLAX_CONFIG.scaleOutput = [0.9, 1.1] (animationConfig.ts)

Scale factor over each card's scroll window.

- **[0] = 0.9**: Starts at 90% size (slightly shrunk, depth effect)
- **[1] = 1.1**: Ends at 110% size (slightly enlarged)
- Wider range: more dramatic size change
- Narrower range: subtler depth effect

### PARALLAX_CONFIG.translateXOutput = [-120, 120] (animationConfig.ts)

Horizontal drift in pixels. Even-indexed cards use this directly; odd-indexed cards get negated values (drift in opposite direction).

- **[0] = -120**: Start X offset (120px left of natural)
- **[1] = 120**: End X offset (120px right of natural)
- Wider: more dramatic diagonal drift
- Narrower: more vertical, less diagonal

### Card horizontal positioning (ParallaxCard.tsx:73-75)

```
Even cards: left-[5%] md:left-[25%] lg:left-[35%]
Odd cards:  right-[5%] md:right-[25%] lg:right-[35%]
```

Static horizontal anchor. The translateX drift is applied on top of this.

---

## 3. Falling Objects

### FALLING_SLOT_COUNT = 24 (FallingObjects.tsx)

Number of objects rendered in falling/parallax mode (stop 2).

- **Increase**: more objects, tighter stagger between them, more visible simultaneously
- **Decrease**: fewer objects, wider stagger, fewer simultaneous

### STATIC_SLOT_COUNT = 6 (FallingObjects.tsx)

Number of objects in static mode (stop 1). Not relevant to scroll tuning.

### OBJECT_WINDOW_RATIO = 0.18 (animationConfig.ts)

Fraction of the **sticky range** that each object's scroll window occupies. This determines how long each individual object is "active" during scrolling.

- **Increase**: each object is active longer, more objects overlap, objects travel slower through viewport
- **Decrease**: each object is active shorter, faster cycling, fewer simultaneous

**Important**: This ratio is always multiplied by `stickyRange` (0.60), NOT by the custom object range. So `objectWindowSize = 0.60 * 0.18 = 0.108` regardless of the object distribution range.

### Object distribution range (animationConfig.ts getObjectScrollWindow)

Currently constrained to the card visual range:

```ts
range.start = firstCard.start = 0.206
range.end   = (lastCard.start + lastCard.end) / 2 = (0.494 + 0.794) / 2 = 0.644
```

This is the range across which all objects are distributed. Previously this was the full rangeStart-rangeEnd (0.206-0.794).

To change where objects start/end, edit the `range` calculation in `getObjectScrollWindow`.

### Computed object values (24 objects, range 0.206-0.644)

| Derived value | Formula | Result |
|---|---|---|
| objectWindowSize | stickyRange * 0.18 | **0.108** |
| available span | 0.644 - 0.206 | **0.438** |
| objectStagger | (0.438 - 0.108) / 23 | **0.01435** |
| Object 0 window | | 0.206 - 0.314 |
| Object 12 window | | 0.378 - 0.486 |
| Object 23 window | | 0.536 - 0.644 |
| Simultaneous objects | 0.108 / 0.01435 | **~7.5** |

### Comparison: if objects used full range (0.206-0.794)

| Derived value | Result |
|---|---|
| available span | **0.588** |
| objectStagger | **0.0209** |
| Object 23 window | 0.686 - 0.794 |
| Simultaneous objects | **~5.2** |

### Object slot positions (FallingObjects.tsx generateSlots, falling mode)

Each object gets random values on mount:

- **left**: `Math.random() * 80 + 5` → **5% to 85%** horizontal
- **top**: `Math.random() * 85 + 5` → **5% to 90%** vertical (the "home" position around which translateY oscillates)
- **rotation**: `Math.random() * 80 - 60` → **-60 to +20 degrees**
- **size**: random pick from `['w-48', 'w-56', 'w-64', 'w-80']`
- **src**: random pick from 6 SVG silhouettes

### Object translateY = [1200, -1200] (FallingObjects.tsx:94)

Vertical travel in pixels, mapped to each object's [scrollStart, scrollEnd]. The object's actual screen position = `top` + `translateY`.

- **[0] = 1200**: Starting Y offset. Object begins 1200px below its `top` position.
  - Increase: starts further below viewport, enters later in its scroll window
  - Decrease: starts closer to `top`, enters sooner
  - At 1200: object at top=5% (45px) is at 1245px → below a 1080p viewport but inside a 1440p one
- **[1] = -1200**: Ending Y offset. Object ends 1200px above its `top` position.
  - More negative: exits further above viewport, leaves sooner in its window
  - Less negative: lingers longer, exits later

**How long each object is in the viewport** (assuming ~900px viewport height):
- Total travel: 2400px (from 1200 to -1200)
- Viewport height: ~900px
- Fraction of window spent crossing viewport: 900 / 2400 = **37.5%**
- In scroll progress: 0.108 * 0.375 = **0.0405**
- In vh of scrolling: 0.0405 * 500 = **~20vh**

So each object is visible for about 20vh of scroll distance. The user must scroll ~20% of the viewport height to see an object cross from bottom to top.

### Object scale = [0.85, 1.0] (FallingObjects.tsx:95)

- **[0] = 0.85**: starts at 85% size
- **[1] = 1.0**: ends at full size

### Object opacity (FallingObjects.tsx:89-93)

```
fadeMargin = objectWindowSize * 0.15 = 0.108 * 0.15 = 0.0162
```

| Scroll position | Opacity | Note |
|---|---|---|
| scrollStart | 0 | invisible |
| scrollStart + 0.0162 | 0.2 | faded in |
| scrollEnd - 0.0162 | 0.2 | still visible |
| scrollEnd | 0 | faded out |

**Max opacity is 0.2** — objects are always faint/ghostly. This is hardcoded in the `[0, 0.2, 0.2, 0]` array on line 92.

### GLOW_INTERVAL_MS = 3500 (FallingObjects.tsx)

Milliseconds between glow switches in static mode. Not relevant to scroll-linked behavior.

---

## 4. Cave Floor

### CAVE_FLOOR_DECORATIVE height: h-[25vh] (ProjectsSection.tsx:14)

Height of the cave floor element. 25% of viewport height.

- **Increase**: taller floor graphic
- **Decrease**: shorter floor graphic

### caveFloorY (ProjectsSection.tsx:47)

```ts
useTransform(scrollYProgress, [0.50, 0.60], ['100%', '0%'])
```

Controls the cave floor's vertical slide-in animation.

- **Input [0] = 0.50**: Scroll progress when the floor starts sliding up
  - Increase: floor appears later in the scroll
  - Decrease: floor appears earlier
- **Input [1] = 0.60**: Scroll progress when the floor finishes sliding in
  - Increase: slower slide-in (wider gap between start/end)
  - Decrease: faster slide-in
  - Must be > input[0]
- **Output ['100%'] = starting position**: 100% of its own height below its anchor (hidden below viewport bottom)
- **Output ['0%'] = ending position**: at its natural position (visible, anchored to bottom of sticky container)

### Cave floor CSS position (ProjectsSection.tsx:118)

```
absolute bottom-0 left-0 w-full
```

Anchored to the bottom of the sticky viewport container.

### Render order in sticky container (ProjectsSection.tsx:114-138)

Elements paint in DOM order. Later = on top.

1. **Cave floor** (behind everything)
2. **FallingObjects** (on top of floor)
3. **ParticleField**
4. **"Projects" heading** (z-10)
5. **ParallaxCards** (on top of everything)

If objects are visible when the floor is visible, they will paint ON TOP of the floor.

---

## 5. Timeline

What happens at each scroll progress value with current settings (5 cards, 24 objects):

| Progress | Event |
|---|---|
| 0.000 | Section enters viewport from below |
| 0.200 | Sticky container pins (STICKY_START) |
| 0.206 | First card window begins. First object window begins. |
| ~0.26 | First card visually enters viewport (translateY crosses ~450px) |
| 0.314 | First object window ends |
| 0.494 | Last card (card 4) window begins |
| 0.500 | Cave floor starts sliding in |
| 0.536 | Last object (object 23) window begins |
| ~0.55 | Last card visually enters viewport |
| 0.600 | Cave floor fully visible |
| ~0.64 | Last card visually exits viewport (translateY crosses ~-450px) |
| 0.644 | Last object window ends. **All objects done.** |
| 0.749 | Last card opacity starts fading (end - fadeMargin) |
| 0.794 | Last card opacity reaches 0. Last card window ends. |
| 0.800 | Sticky container unpins (STICKY_END) |
| 1.000 | Section exits viewport above |

### Key gaps / overlaps

- **Objects vs. cards**: Objects end at 0.644. Last card is visually off-screen by ~0.64 but its opacity tail runs to 0.794. Objects and cards are visually concurrent.
- **Objects vs. cave floor**: Cave floor is fully visible at 0.60. Last object ends at 0.644. There is a **0.044 overlap** (0.60-0.644) where objects and the floor are both visible. Objects paint on top of the floor.
- **Dead scroll after objects**: From 0.644 to 0.794 (0.15 = 75vh of scroll), only the cave floor, particles, and card opacity tails are active. No objects.
- **Dead scroll after cards**: From 0.794 to 0.80 (0.006 = 3vh), nothing animates before unpin.

---

## 6. Quick-Tuning Cheat Sheet

| Goal | What to change |
|---|---|
| Objects last longer per-object | Increase `OBJECT_WINDOW_RATIO` |
| Objects appear/end earlier or later | Edit `range.start` / `range.end` in `getObjectScrollWindow` |
| Objects spread across full sticky range | Remove `customRange` arg, revert to `getScrollWindowForRatio(index, totalObjects, OBJECT_WINDOW_RATIO)` |
| Objects brighter/more visible | Change `0.2` in opacity output array `[0, 0.2, 0.2, 0]` |
| Objects travel further (faster through viewport) | Increase spread of `translateY` array (e.g., `[1500, -1500]`) |
| Objects travel less (slower, linger in viewport) | Decrease spread of `translateY` array (e.g., `[800, -800]`) |
| Objects start from further off-screen | Increase `translateY[0]` |
| Objects behind the cave floor | Move `<FallingObjects>` BEFORE the cave floor `<motion.div>` in JSX |
| Cave floor appears earlier/later | Change `caveFloorY` input array `[0.50, 0.60]` |
| More/fewer total objects | Change `FALLING_SLOT_COUNT` |
| More scroll runway for everything | Increase `SECTION_HEIGHT_VH` |
| Cards stay visible longer | Increase `WINDOW_RATIO` |
| Cards travel faster through viewport | Increase spread of `PARALLAX_CONFIG.translateYOutput` |
