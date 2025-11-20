<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 1dff7dfe-3749-4a40-8614-c6100d1ac857 -->
# Fix Slideshow Layout Issues

## Problem Analysis

1. **Vertical photos not centered**: Images need proper horizontal centering
2. **Layout shifts cover controls**: When photos are large, the modal content shifts and dark overlay covers buttons/slider
3. **Loading text invisible**: White text on white background in main page loading

## Changes Required

### 1. Fix Vertical Photo Centering (`chiara/assets/css/style.css`)

Update `.slideshow-container` to ensure proper centering:

- Add `align-items: center` and `justify-content: center` to container
- Ensure images don't have fixed width that prevents centering

### 2. Fix Layout Structure to Prevent Controls Overlay (`chiara/assets/css/style.css`)

Restructure the slideshow modal layout:

- Change `#slideshowModal .modal-content` to use flexbox with `flex-direction: column`
- Make `.slideshow-container` flexible to take available space
- Ensure `.slideshow-controls` and `.person-controls` stay at bottom with higher z-index
- Remove padding from modal-content that might cause overflow
- Adjust slideshow-container height to account for controls space

Current structure that needs fixing:

```css
#slideshowModal .modal-content {
    max-width: 95%;
    max-height: 95vh;
    padding: 0;
}

.slideshow-container {
    height: 80vh;  /* This can cause overflow */
}
```

### 3. Fix Loading Indicator Visibility (`chiara/assets/css/style.css`)

Change `#mainLoading` styling:

- Add semi-transparent dark background
- Or change text to darker color with text shadow
- Or add backdrop behind the text

### 4. Update JavaScript Image Styling (`chiara/assets/js/main.js`)

In `displaySlide()` function, ensure images don't have conflicting width styles that prevent centering. Currently sets:

```javascript
imgElement.style.maxWidth = '100%';
imgElement.style.maxHeight = '70vh';
```

These are fine, but ensure no width is set that would prevent centering.

## Files to Modify

1. `chiara/assets/css/style.css` - Fix all three CSS issues
2. Verify `chiara/assets/js/main.js` - Check if image creation needs adjustment (likely no changes needed)

### To-dos

- [ ] Update #mainLoading styles for better visibility against white background
- [ ] Restructure slideshow modal layout to prevent controls overlay
- [ ] Ensure vertical photos are properly centered in slideshow
- [ ] Verify displaySlide image creation doesn't conflict with centering