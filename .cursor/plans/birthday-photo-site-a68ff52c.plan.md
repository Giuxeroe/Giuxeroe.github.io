<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 334fd5b7-b241-48a1-9b43-b2c88acd489d -->
# Fix Loading and Preloading Issues

## Problems Identified

1. **Initial page load**: No loading indicator while fetching photos from Firebase (takes ~30 seconds)
2. **Slideshow preloading broken**: Images are preloaded but NOT reused - `displaySlide()` creates new `<img>` elements, causing the browser to fetch again

## Solutions

### 1. Add Loading Indicator for Initial Data Load

**Update HTML** (`chiara/index.html`):

Add loading indicator before the users grid (around line 23, before `<div id="usersGrid">`):

```html
<div id="mainLoading" style="display: flex;">
    <div class="loading-spinner"></div>
    <p>Caricamento gallerie...</p>
</div>
<div id="usersGrid" class="users-grid" style="display: none;"></div>
```

**Update JavaScript** (`chiara/assets/js/main.js`):

In `loadUsersData()` function, show/hide loading at start and end (around lines 28 and 77):

```javascript
async function loadUsersData() {
    const mainLoading = document.getElementById('mainLoading');
    const usersGrid = document.getElementById('usersGrid');
    
    // Mostra loading
    if (mainLoading) mainLoading.style.display = 'flex';
    if (usersGrid) usersGrid.style.display = 'none';
    
    try {
        // ... existing code ...
        
        renderUserCards();
        
        // Nascondi loading
        if (mainLoading) mainLoading.style.display = 'none';
        if (usersGrid) usersGrid.style.display = 'grid';
    } catch (error) {
        // ... existing error handling ...
        if (mainLoading) mainLoading.style.display = 'none';
        if (usersGrid) usersGrid.style.display = 'block';
    }
}
```

**Update CSS** (`chiara/assets/css/style.css`):

Add styles for main loading indicator (after the hero section styles):

```css
/* Loading indicator per pagina principale */
#mainLoading {
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    color: white;
}

#mainLoading p {
    color: white;
    font-size: 1.2rem;
    margin-top: 20px;
}

#mainLoading .loading-spinner {
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}
```

### 2. Fix Slideshow Preloading - Use Cached Images

**Problem**: We preload images but create new `<img>` elements in `displaySlide()`, so browser fetches again.

**Solution**: Store preloaded Image objects in `currentSlideshow` and reuse them.

**Update `preloadImages()` function** (around line 190):

Modify to return a map of preloaded Image objects:

```javascript
function preloadImages(slideshowData) {
    return new Promise((resolve, reject) => {
        const imagesToLoad = slideshowData.filter(item => !item.isVideo);
        
        if (imagesToLoad.length === 0) {
            resolve({});
            return;
        }

        let loadedCount = 0;
        const totalImages = imagesToLoad.length;
        const loadingProgressBar = document.getElementById('loadingProgressBar');
        const loadingProgressText = document.getElementById('loadingProgressText');
        const imageCache = {}; // Store preloaded images

        imagesToLoad.forEach((item) => {
            const img = new Image();
            
            img.onload = () => {
                loadedCount++;
                imageCache[item.url] = img; // Cache the loaded image
                
                const progress = Math.round((loadedCount / totalImages) * 100);
                
                if (loadingProgressBar) {
                    loadingProgressBar.style.width = progress + '%';
                }
                if (loadingProgressText) {
                    loadingProgressText.textContent = progress + '%';
                }
                
                if (loadedCount === totalImages) {
                    resolve(imageCache);
                }
            };
            
            img.onerror = () => {
                loadedCount++;
                console.warn('Errore caricamento immagine:', item.url);
                
                if (loadedCount === totalImages) {
                    resolve(imageCache);
                }
            };
            
            img.src = item.url;
        });
    });
}
```

**Update `startFullSlideshow()` to store image cache** (around line 289):

```javascript
// Precarica tutte le immagini
preloadImages(slideshowData).then((imageCache) => {
    // Nascondi loading, mostra slideshow
    if (slideshowLoading) {
        slideshowLoading.style.display = 'none';
    }
    if (slideshowContainer) {
        slideshowContainer.style.display = 'block';
    }
    if (slideshowControls) {
        slideshowControls.style.display = 'flex';
    }
    if (personControls) {
        personControls.style.display = 'flex';
    }

    // Avvia slideshow with cached images
    currentSlideshow = {
        photos: slideshowData,
        currentIndex: 0,
        isPlaying: true,
        intervalId: null,
        videoTimeoutId: null,
        imageCache: imageCache  // Store the cached images
    };

    displaySlide(currentSlideshow.currentIndex);
    startSlideshowAutoPlay();

    // Avvia musica se disponibile
    if (backgroundMusic) {
        backgroundMusic.play().catch(e => {
            console.log('Autoplay bloccato dal browser:', e);
        });
    }
});
```

**Update `displaySlide()` to use cached images** (around line 395-410):

Replace the image creation part:

```javascript
if (slide.isVideo) {
    // ... existing video code ...
} else {
    // Use cached image if available, otherwise create new one
    let imgElement;
    
    if (currentSlideshow.imageCache && currentSlideshow.imageCache[slide.url]) {
        // Clone the cached image
        imgElement = currentSlideshow.imageCache[slide.url].cloneNode(true);
        imgElement.id = 'slideshowImage';
    } else {
        // Fallback: create new image
        imgElement = document.createElement('img');
        imgElement.id = 'slideshowImage';
        imgElement.src = slide.url;
    }
    
    imgElement.alt = 'Slideshow';
    imgElement.style.maxWidth = '100%';
    imgElement.style.maxHeight = '70vh';
    imgElement.style.objectFit = 'contain';
    imgElement.style.borderRadius = '10px';

    // Inserisci immagine prima dell'info
    const infoDiv = slideshowContainer.querySelector('.slideshow-info');
    slideshowContainer.insertBefore(imgElement, infoDiv);

    // Riprendi autoplay normale per le foto
    stopSlideshowAutoPlay();
    if (currentSlideshow.isPlaying) {
        startSlideshowAutoPlay();
    }
}
```

## Result

1. Users see a loading spinner while photos load initially
2. Slideshow has ZERO delay between photos - cached images are reused instantly
3. Professional, smooth user experience throughout

### To-dos

- [ ] Add loading indicator HTML to main page
- [ ] Update loadUsersData to show/hide loading
- [ ] Add CSS styles for main loading indicator
- [ ] Update preloadImages to return cached Image objects
- [ ] Update displaySlide to use cached images