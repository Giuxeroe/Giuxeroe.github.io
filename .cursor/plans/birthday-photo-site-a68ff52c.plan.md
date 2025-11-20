<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 6fff1b1c-03bf-4c6d-a4f9-6631f0f481c9 -->
# Fullscreen Photo with Side Controls

## New Design Approach

Instead of stacking elements vertically (photo, info, controls), we'll use a horizontal layout:

- **Left side (80%)**: Fullscreen photo/video
- **Right side (20%)**: Sidebar with all info and controls

This solves all issues:

- No layout shifting (sidebar has fixed width)
- No controls covering anything (they're beside, not on top)
- More space for photos
- Cleaner, more modern interface

## Implementation

### 1. HTML Structure (`chiara/index.html`)

Keep the modal but restructure the content to have two main sections side by side.

Current structure:

```
slideshow-container (photo + info below)
slideshow-controls (buttons)
person-controls (buttons)
```

New structure:

```
slideshow-wrapper (flexbox horizontal)
  ├── slideshow-media (left, 80%, just photo/video)
  └── slideshow-sidebar (right, 20%, all controls and info)
      ├── slideshow-info (name, counter)
      ├── slideshow-controls (buttons, speed)
      └── person-controls (person navigation)
```

### 2. CSS Changes (`chiara/assets/css/style.css`)

```css
#slideshowModal .modal-content {
    max-width: 98%;
    max-height: 98vh;
    padding: 0;
    background: #000;
    color: white;
    display: flex;
    flex-direction: column;
}

/* New wrapper for horizontal layout */
.slideshow-wrapper {
    display: flex;
    width: 100%;
    height: 90vh;
    gap: 0;
}

/* Left side - Photo/Video area */
.slideshow-media {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
    position: relative;
    overflow: hidden;
}

#slideshowImage,
#slideshowVideo {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
    object-fit: contain;
}

/* Intro slides in media area */
.slideshow-intro {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

/* Right sidebar - All controls */
.slideshow-sidebar {
    width: 300px;
    min-width: 300px;
    background: rgba(0,0,0,0.95);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}

/* Info section in sidebar */
.slideshow-info {
    padding: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}

#slideshowUserName {
    font-size: 1.1rem;
    margin-bottom: 8px;
    word-wrap: break-word;
}

#slideCounter {
    font-size: 0.9rem;
    opacity: 0.7;
}

/* Progress bar at top of sidebar */
#slideshowProgress {
    width: 100%;
    height: 4px;
}

/* Controls in sidebar */
.slideshow-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
    border-bottom: 1px solid rgba(255,255,255,0.2);
}

.slideshow-controls button {
    width: 100%;
    padding: 12px;
    font-size: 0.9rem;
}

.speed-control {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 12px;
}

#speedSlider {
    width: 100%;
}

/* Person navigation in sidebar */
.person-controls {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 20px;
}

.person-controls button {
    width: 100%;
    padding: 12px;
    font-size: 0.9rem;
}

/* Close button */
.close-btn {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 100;
}

/* Responsive */
@media (max-width: 768px) {
    .slideshow-wrapper {
        flex-direction: column;
    }
    
    .slideshow-media {
        height: 60vh;
    }
    
    .slideshow-sidebar {
        width: 100%;
        max-height: 40vh;
    }
}
```

### 3. JavaScript Changes (`chiara/assets/js/main.js`)

Minimal changes needed:

- Update DOM queries to find elements in new structure
- `.slideshow-container` becomes `.slideshow-media`
- Keep all existing logic for intro slides, navigation, etc.

### 4. HTML Update Details

Wrap existing slideshow-container content:

```html
<div class="slideshow-wrapper">
    <!-- Left: Photo/Video area -->
    <div class="slideshow-media">
        <!-- Photos/videos/intro slides go here dynamically -->
    </div>
    
    <!-- Right: Sidebar with all controls -->
    <div class="slideshow-sidebar">
        <progress id="slideshowProgress" value="0" max="100"></progress>
        
        <div class="slideshow-info">
            <h3 id="slideshowUserName"></h3>
            <div id="slideCounter"></div>
            <p id="slideshowMessage"></p>
        </div>
        
        <div class="slideshow-controls">
            <button id="prevBtn">⏮️ Precedente</button>
            <button id="playPauseBtn">⏸️ Pausa</button>
            <button id="nextBtn">⏭️ Successiva</button>
            <div class="speed-control">
                <label for="speedSlider">Velocità: <span id="speedValue">5s</span></label>
                <input type="range" id="speedSlider" min="1" max="10" value="5" step="1">
            </div>
        </div>
        
        <div class="person-controls">
            <button id="prevPersonBtn">⏪ Persona Precedente</button>
            <button id="nextPersonBtn">Persona Successiva ⏩</button>
        </div>
    </div>
</div>
```

## Benefits

1. **No layout shifting**: Sidebar has fixed width
2. **No overlay issues**: Controls are beside photo, not on top
3. **More photo space**: Photo can use full left area
4. **Better UX**: All controls in one place, easy to find
5. **Cleaner design**: Modern sidebar layout
6. **Responsive**: Can stack vertically on mobile

## Files to Modify

1. `chiara/index.html` - Restructure slideshow modal
2. `chiara/assets/css/style.css` - New layout styles
3. `chiara/assets/js/main.js` - Update DOM queries to match new structure

### To-dos

- [ ] Restructure slideshow modal HTML with wrapper and sidebar
- [ ] Implement new horizontal layout with sidebar styles
- [ ] Update JavaScript DOM queries for new structure