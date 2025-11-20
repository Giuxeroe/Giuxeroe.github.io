<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 6fff1b1c-03bf-4c6d-a4f9-6631f0f481c9 -->
# Floating Control Panel Layout

## Overview

Convert slideshow to fullscreen photos with a compact floating control panel overlaid on top.

## Implementation Steps

### 1. Update HTML Structure (`chiara/index.html`)

- Revert `.slideshow-wrapper` to single fullscreen container
- Remove `.slideshow-media` and `.slideshow-sidebar` divs
- Create `.slideshow-floating-panel` with all controls and info inside
- Position panel to overlay on top of photos

### 2. Update CSS Layout (`chiara/assets/css/style.css`)

- Make slideshow container fullscreen (100% width/height)
- Position photos to fill entire area
- Style `.slideshow-floating-panel`:
- Position: absolute, bottom right (or top right)
- Semi-transparent background
- Compact size (e.g., 250px wide)
- Fixed position so it doesn't shift
- Contains: info (name, counter, message), controls (prev/play/next), speed slider, person navigation
- Add subtle shadow/border for visibility
- Ensure panel stays on top (z-index)

### 3. Update JavaScript (`chiara/assets/js/main.js`)

- Update DOM queries to target fullscreen container
- Append photos/videos directly to main container (not inside panel)
- Panel remains fixed overlay, never gets removed/recreated
- Simplify display logic since layout won't shift

### 4. Mobile Responsive

- On mobile, move panel to bottom center
- Make it horizontally scrollable or stack vertically if needed

## Key Benefits

- Photos get full attention (entire modal)
- No layout shifting (panel is fixed overlay)
- Compact controls don't distract from content
- Modern floating UI pattern

### To-dos

- [x] 
- [x] 
- [x] 