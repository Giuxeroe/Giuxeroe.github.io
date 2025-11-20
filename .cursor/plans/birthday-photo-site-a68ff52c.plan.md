<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 1dff7dfe-3749-4a40-8614-c6100d1ac857 -->
# Fix Slideshow Layout Issues v2

## Problems Identified

1. Photos are cut off screen - losing information
2. "Foto con x" text disappears when photos are large
3. Message is not being displayed
4. Need intro slide with message when switching person

## Root Cause

The flexbox approach with `flex: 1 1 auto`, `min-height: 0`, and `overflow: hidden` is causing the container to collapse and cut off images. The slideshow-info is inside the container competing for space.

## Solution Strategy

### 1. Revert to Stable Layout (`chiara/assets/css/style.css`)

**Modal Content:**

- Keep flexbox but remove overflow issues
- Use `overflow-y: auto` instead of `overflow: hidden` to allow scrolling if needed
- Ensure proper height calculations

**Slideshow Container:**

- Revert to simpler approach with `height: 70vh` or similar
- Remove problematic `flex: 1 1 auto` and `min-height: 0`
- Keep controls outside the image area

**Images:**

- Use `max-height: 60vh` to leave room for info and controls
- Keep `max-width: 100%` and `object-fit: contain`
- Ensure centering with `margin: auto` and proper display

**Info Section:**

- Keep it positioned outside the main image flex area
- Ensure it's always visible with proper positioning

### 2. Add Message Intro Slides (`chiara/assets/js/main.js`)

Modify `startFullSlideshow()` to insert intro slides:

- For each person, add a special "intro" slide before their photos
- Intro slide shows: person name + full message
- Regular photo slides show: "Foto con [name]" without message

Update `displaySlide()` to handle intro slides:

- Detect if slide is intro type (`isIntro: true`)
- Display large message centered instead of photo
- Skip intro slides during autoplay but show for person navigation

### 3. Update Person Navigation

Modify person navigation to jump to intro slides:

- When clicking "Persona Precedente/Successiva", go to that person's intro slide
- Intro slide pauses autoplay to let user read message
- User can manually advance or autoplay continues after delay

## Implementation Details

### CSS Changes (chiara/assets/css/style.css)

```css
#slideshowModal .modal-content {
    max-width: 95%;
    max-height: 95vh;
    padding: 0;
    background: #000;
    color: white;
    display: flex;
    flex-direction: column;
}

.slideshow-container {
    position: relative;
    width: 100%;
    height: 70vh;  /* Fixed height that works */
    display: flex;
    align-items: center;
    justify-content: center;
    background: #000;
}

#slideshowImage,
#slideshowVideo {
    max-width: 90%;
    max-height: 60vh;  /* Leave room for info below */
    width: auto;
    height: auto;
    object-fit: contain;
    border-radius: 10px;
}

.slideshow-info {
    text-align: center;
    padding: 15px 20px;
    background: rgba(0,0,0,0.9);
    width: 100%;
    position: relative;
    border-top: 1px solid rgba(255,255,255,0.2);
}

/* Intro slide styling */
.slideshow-intro {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    text-align: center;
    height: 100%;
}

.slideshow-intro h2 {
    font-size: 2.5rem;
    margin-bottom: 30px;
    color: #ff6b6b;
}

.slideshow-intro p {
    font-size: 1.5rem;
    line-height: 1.8;
    max-width: 800px;
    font-style: italic;
}
```

### JS Changes (chiara/assets/js/main.js)

In `startFullSlideshow()`, modify data preparation:

```javascript
Object.keys(allUsersData).forEach(userName => {
    const userData = allUsersData[userName];
    
    if (userData.photos && userData.photos.length > 0) {
        const message = userData.message || '';
        
        // Add intro slide first
        slideshowData.push({
            isIntro: true,
            userName: userName,
            message: message,
            url: null,
            isVideo: false
        });
        
        // Then add all photos/videos
        userData.photos.forEach(media => {
            slideshowData.push({
                url: media.url,
                userName: userName,
                message: message,
                isVideo: media.isVideo,
                isIntro: false
            });
        });
    }
});
```

In `displaySlide()`, handle intro slides:

```javascript
if (slide.isIntro) {
    // Show intro slide with message
    slideshowContainer.innerHTML = `
        <div class="slideshow-intro">
            <h2>${slide.userName}</h2>
            ${slide.message ? `<p>${slide.message}</p>` : '<p>Nessun messaggio</p>'}
        </div>
    `;
    slideshowUserName.textContent = '';
    slideshowMessage.textContent = '';
    // Pause autoplay for intro slides
    stopSlideshowAutoPlay();
} else {
    // Show regular photo/video (existing code)
    // ...
}
```

Update `findPersonBoundary()` to find intro slides instead of first photo.

## Files to Modify

1. `chiara/assets/css/style.css` - Fix layout constraints
2. `chiara/assets/js/main.js` - Add intro slides and handle them in display logic

### To-dos

- [x] 
- [x] 
- [x] 
- [x] 