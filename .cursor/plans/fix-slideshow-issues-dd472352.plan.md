<!-- dd472352-fc2a-401b-b87e-d79997c7d190 750a67db-4b25-404e-9db9-db9ef879df7a -->
# Make Control Panel Compact on Mobile

## Problem

The control panel takes too much vertical space on mobile, causing it to overlap photos even with the bottom padding. Need to make it more compact.

## Solution

Add mobile-specific CSS rules to make the panel smaller and more compact:

1. Reduce panel padding
2. Reduce gaps between sections
3. Make buttons smaller
4. Reduce font sizes
5. Make control elements more compact
6. Adjust container padding to match new panel height

## Changes Required

### `style.css` - Add mobile panel styles (inside @media max-width: 768px, after line 796)

After the `.slideshow-floating-panel` mobile styles, add:

```css
.slideshow-floating-panel {
    bottom: 10px;
    right: 10px;
    left: 10px;
    width: auto;
    max-width: none;
    padding: 8px;
    gap: 6px;
    border-radius: 10px;
}

.slideshow-info h3,
#slideshowUserName {
    font-size: 0.75rem;
    margin-bottom: 3px;
}

#slideCounter {
    font-size: 0.7rem;
    margin-bottom: 4px;
}

#slideshowMessage {
    font-size: 0.7rem;
}

.slideshow-controls {
    gap: 5px;
}

.slideshow-controls button {
    padding: 6px 8px;
    font-size: 0.7rem;
    border-radius: 15px;
    border-width: 1px;
}

.person-controls {
    gap: 5px;
}

.person-controls button {
    padding: 6px 8px;
    font-size: 0.7rem;
    border-radius: 15px;
}

.speed-control,
.size-control {
    padding: 6px;
    gap: 4px;
}

.speed-control label,
.size-control label {
    font-size: 0.75rem;
}

#speedValue,
#sizeValue {
    font-size: 0.75rem;
}

#speedSlider,
#sizeSlider {
    height: 4px;
}

#speedSlider::-webkit-slider-thumb,
#sizeSlider::-webkit-slider-thumb {
    width: 14px;
    height: 14px;
}

#speedSlider::-moz-range-thumb,
#sizeSlider::-moz-range-thumb {
    width: 14px;
    height: 14px;
}
```

Also update the container padding to match smaller panel (around line 801):

```css
padding-bottom: 180px; /* Adjusted for smaller panel */
```

## File to Modify

- `chiara/assets/css/style.css` - Add compact mobile styles for control panel