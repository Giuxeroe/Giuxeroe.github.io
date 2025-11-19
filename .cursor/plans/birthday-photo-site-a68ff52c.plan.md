<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 73dbb9aa-cf5f-4682-b39a-7619dd53dd04 -->
# Preload Slideshow Images

## Problem

Photos load on-demand during slideshow transitions, causing visible delays. This creates a poor user experience.

## Solution

Preload all images before starting the slideshow, showing a loading progress indicator.

## Implementation

### 1. Add Loading Indicator to HTML

In `chiara/index.html`, add a loading overlay inside the slideshow modal (around line 46, before slideshow-container):

```html
<div id="slideshowLoading" style="display: none;">
    <div class="loading-spinner"></div>
    <p>Caricamento foto e video...</p>
    <div class="loading-progress">
        <div id="loadingProgressBar"></div>
        <span id="loadingProgressText">0%</span>
    </div>
</div>
```

### 2. Add Preloading Logic to JavaScript

In `chiara/assets/js/main.js`, modify `startFullSlideshow()` function (around line 191):

**a) Add preloading function before startFullSlideshow:**

```javascript
// Precarica tutte le immagini prima di avviare lo slideshow
function preloadImages(slideshowData) {
    return new Promise((resolve, reject) => {
        const imagesToLoad = slideshowData.filter(item => !item.isVideo);
        
        if (imagesToLoad.length === 0) {
            resolve();
            return;
        }

        let loadedCount = 0;
        const totalImages = imagesToLoad.length;
        const loadingProgressBar = document.getElementById('loadingProgressBar');
        const loadingProgressText = document.getElementById('loadingProgressText');

        imagesToLoad.forEach((item) => {
            const img = new Image();
            
            img.onload = () => {
                loadedCount++;
                const progress = Math.round((loadedCount / totalImages) * 100);
                
                if (loadingProgressBar) {
                    loadingProgressBar.style.width = progress + '%';
                }
                if (loadingProgressText) {
                    loadingProgressText.textContent = progress + '%';
                }
                
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            
            img.onerror = () => {
                loadedCount++;
                console.warn('Errore caricamento immagine:', item.url);
                
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            
            img.src = item.url;
        });
    });
}
```

**b) Modify startFullSlideshow to use preloading:**

Replace the current implementation after line 217 (after showing the modal) with:

```javascript
// Mostra slideshow modal
const slideshowModal = document.getElementById('slideshowModal');
slideshowModal.style.display = 'flex';

// Mostra loading overlay
const slideshowLoading = document.getElementById('slideshowLoading');
const slideshowContainer = document.querySelector('.slideshow-container');
const slideshowControls = document.querySelector('.slideshow-controls');
const personControls = document.querySelector('.person-controls');

if (slideshowLoading) {
    slideshowLoading.style.display = 'flex';
}
if (slideshowContainer) {
    slideshowContainer.style.display = 'none';
}
if (slideshowControls) {
    slideshowControls.style.display = 'none';
}
if (personControls) {
    personControls.style.display = 'none';
}

// Precarica tutte le immagini
preloadImages(slideshowData).then(() => {
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

    // Avvia slideshow
    currentSlideshow = {
        photos: slideshowData,
        currentIndex: 0,
        isPlaying: true,
        intervalId: null,
        videoTimeoutId: null
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

### 3. Add Loading Indicator Styles to CSS

In `chiara/assets/css/style.css`, add styles for the loading indicator (after slideshow styles):

```css
/* Loading overlay per slideshow */
#slideshowLoading {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 10;
}

#slideshowLoading p {
    color: white;
    font-size: 1.2rem;
    margin: 20px 0;
}

.loading-spinner {
    border: 4px solid rgba(255,255,255,0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-progress {
    width: 300px;
    background: rgba(255,255,255,0.2);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    height: 30px;
    margin-top: 10px;
}

#loadingProgressBar {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
    width: 0%;
}

#loadingProgressText {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: 0.9rem;
}
```

## Result

- All images will be preloaded before the slideshow starts
- Users see a progress bar showing loading status
- No delays between photo transitions
- Videos are not preloaded (too large), but images load instantly
- Smooth, professional slideshow experience

### To-dos

- [ ] Add loading indicator HTML to slideshow modal
- [ ] Implement image preloading logic in main.js
- [ ] Add loading indicator styles to style.css