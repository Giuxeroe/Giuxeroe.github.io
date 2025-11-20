<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 7437637c-0952-4316-8959-4c5397fe30f7 -->
# Fix Floating Panel Implementation

## Issues Identified

1. Floating panel blocks photo interaction (z-index and positioning)
2. Container size mismatch causes content shifting (100vh vs 98vh)
3. Panel needs pointer-events management

## Solution

### 1. Fix Modal Content Size (`chiara/assets/css/style.css`)

- Set `.modal-content` to fixed size: `width: 100vw; height: 100vh`
- Remove `max-width` and `max-height` to prevent shifting
- Ensure `.slideshow-container` fills parent: `width: 100%; height: 100%`

### 2. Fix Floating Panel Interaction

- Panel needs `pointer-events: auto` so it's clickable
- Panel should not block photos behind it (already has transparent background)
- Ensure panel is properly positioned relative to container

### 3. Ensure Fixed Layout

- Remove conflicting height values
- Make sure photos scale within fixed container
- Panel stays in bottom-right, fixed position

## Key Changes

```css
/* Modal fixed size - no shifting */
#slideshowModal .modal-content {
    width: 100vw;
    height: 100vh;
    padding: 0;
    background: #000;
    position: relative;
    overflow: hidden;
}

/* Container fills modal */
.slideshow-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    position: relative;
}

/* Panel clickable, not blocking */
.slideshow-floating-panel {
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 280px;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    z-index: 50;
    pointer-events: auto;
}
```

This ensures:

- No content shifting (fixed 100vw x 100vh)
- Panel is clickable
- Photos fill available space
- No layout jumping when photos change

### To-dos

- [ ] Fix modal-content to 100vw x 100vh, remove max-width/max-height
- [ ] Make slideshow-container 100% x 100%, remove conflicting vh values
- [ ] Ensure floating panel has pointer-events auto and proper z-index