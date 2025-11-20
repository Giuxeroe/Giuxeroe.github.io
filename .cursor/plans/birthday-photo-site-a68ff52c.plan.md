<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 7437637c-0952-4316-8959-4c5397fe30f7 -->
# Make Photos Larger and Show Messages

## Issues Identified

1. **Photos could be larger**: Currently photos use the full container, but the floating panel (280px wide) visually blocks part of the view
2. **Messages not showing**: Messages are cleared on regular slides (line 501 in main.js), only shown on intro slides

## Solutions

### 1. Make Floating Panel Smaller (`chiara/assets/css/style.css`)

- Reduce panel width from 280px to 220px for more photo space
- Reduce padding and font sizes slightly to fit content
- This gives photos more visual presence

### 2. Show Messages in Floating Panel (`chiara/assets/js/main.js`)

- On regular photo/video slides, display the user's message in the floating panel
- Change line 501 from `slideshowMessage.textContent = '';` to `slideshowMessage.textContent = slide.message || '';`
- Keep message visible during person's photos
- Hide message only on intro slides (where it's shown large in main area)

## Key Changes

CSS:

```css
.slideshow-floating-panel {
    width: 220px;  /* Was 280px */
    padding: 12px;  /* Was 15px */
}
```

JavaScript:

```javascript
// Show message on regular slides (not just intro)
slideshowMessage.textContent = slide.message || '';
```

This achieves:

- More screen space for photos (60px wider visible area)
- Messages visible throughout person's slides
- Better user experience

### To-dos

- [ ] Fix modal-content to 100vw x 100vh, remove max-width/max-height
- [ ] Make slideshow-container 100% x 100%, remove conflicting vh values
- [ ] Ensure floating panel has pointer-events auto and proper z-index