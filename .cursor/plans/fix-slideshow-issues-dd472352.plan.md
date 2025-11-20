<!-- dd472352-fc2a-401b-b87e-d79997c7d190 420116b9-c436-468a-b294-73b864448e91 -->
# Fix Mobile Slideshow Layout

## Problem

On mobile, the floating control panel spans the full width at the bottom, but the slideshow container still has `padding-right: 300px` from desktop styles, causing photos to be pushed left and the panel to overlap them.

Additionally, there are CSS syntax errors (duplicate closing brace at line 807).

## Solution

Update the mobile media query to:

1. Remove padding-right from `.slideshow-container` on mobile
2. Adjust photo/video max-width to use full viewport width
3. Reduce photo max-height to account for the panel at bottom
4. Fix CSS syntax errors

## Changes Required

### `style.css` - Update mobile media query (lines 789-807)

Inside the `@media (max-width: 768px)` block:

1. Update `.slideshow-container` to remove the padding and use full width:
```css
.slideshow-container {
    padding-right: 0;
    height: 100%;
}
```

2. Add mobile-specific styles for images/videos to use full viewport and leave space for bottom panel:
```css
#slideshowImage,
#slideshowVideo {
    max-width: 100vw;
    max-height: calc(100vh - 200px); /* Leave space for bottom panel */
}
```

3. Fix the duplicate closing brace and move the stray `#slideshowImage` rule inside the media query or remove it

## File to Modify

- `chiara/assets/css/style.css` - Fix mobile responsive styles