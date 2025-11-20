<!-- dd472352-fc2a-401b-b87e-d79997c7d190 63ba1dec-56e1-48b5-bd32-ca37b30e51d5 -->
# Add Photo Size Slider Control

## Implementation Approach

Add a new slider control in the floating panel that allows users to dynamically adjust the size of photos and videos from 50% to 150% of their current display size.

## Changes Required

### 1. Add Size Slider UI (`index.html`)

Add a new size control slider after the speed control (around line 79):

```html
<div class="size-control">
    <label for="sizeSlider">Dimensione: <span id="sizeValue">100%</span></label>
    <input type="range" id="sizeSlider" min="50" max="150" value="100" step="5">
</div>
```

### 2. Add Size Control Styling (`style.css`)

Add styling for `.size-control` similar to `.speed-control` (around line 408-417). Use the same styling pattern.

### 3. Add JavaScript Logic (`main.js`)

- Add a global variable `photoScale = 1.0` at the top with other globals (around line 7)
- Add event listener for the size slider in `setupSlideshowControls()` (around line 620)
- Apply the scale transform to `#slideshowImage` and `#slideshowVideo` when displaying slides
- Update the scale dynamically when the slider changes

The scale will be applied using CSS transform: `transform: scale(${photoScale})`

## Files to Modify

- `chiara/index.html` - Add size slider HTML
- `chiara/assets/css/style.css` - Add size control styling
- `chiara/assets/js/main.js` - Add scale variable and slider logic