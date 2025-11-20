// Main JavaScript - Gestione gallerie e slideshow (Storage-only con supporto video)

let allUsersData = {};
let currentSlideshow = null;
let backgroundMusic = null;
let currentVideoElement = null;
let slideshowSpeed = 5000; // Velocità slideshow in millisecondi (default 5 secondi)
let photoScale = 1.0; // Scala foto/video (default 100%)

// Helper: determina se un file è un video basato sul nome
function isVideo(fileName) {
    const videoExtensions = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.flv', '.wmv', '.m4v'];
    const lowerName = fileName.toLowerCase();
    return videoExtensions.some(ext => lowerName.endsWith(ext));
}

document.addEventListener('DOMContentLoaded', function() {
    // Carica dati utenti da Storage
    loadUsersData();

    // Setup musica di sottofondo
    setupBackgroundMusic();

    // Setup controlli slideshow
    setupSlideshowControls();
});

// Carica tutti i dati degli utenti da Storage
async function loadUsersData() {
    const mainLoading = document.getElementById('mainLoading');
    const usersGrid = document.getElementById('usersGrid');

    // Mostra loading
    if (mainLoading) mainLoading.style.display = 'flex';
    if (usersGrid) usersGrid.style.display = 'none';

    try {
        const photosRef = storage.ref('photos');
        const folders = await photosRef.listAll();

        allUsersData = {};

        // Per ogni cartella (utente)
        for (const folder of folders.prefixes) {
            const userName = folder.name;
            const userFiles = await folder.listAll();

            // Filtra file multimediali (escludi message.txt)
            const mediaFiles = userFiles.items
                .filter(item => item.name !== 'message.txt')
                .map(item => ({
                    url: null, // Sarà popolato dopo
                    name: item.name,
                    ref: item,
                    isVideo: isVideo(item.name)
                }));

            // Leggi message.txt se esiste
            let message = '';
            const messageRef = folder.child('message.txt');
            try {
                const messageUrl = await messageRef.getDownloadURL();
                const response = await fetch(messageUrl);
                message = await response.text();
                console.log(`User: ${userName}, Message: "${message}"`);
            } catch (e) {
                // Nessun messaggio o errore lettura
                console.log(`User: ${userName}, No message file or error:`, e);
            }

            // Ottieni URL per ogni file
            for (let i = 0; i < mediaFiles.length; i++) {
                try {
                    mediaFiles[i].url = await mediaFiles[i].ref.getDownloadURL();
                } catch (e) {
                    console.error('Errore ottenendo URL per', mediaFiles[i].name, e);
                }
            }

            allUsersData[userName] = {
                name: userName,
                photos: mediaFiles.filter(f => f.url), // Solo file con URL valido
                message: message
            };
        }

        renderUserCards();

        // Nascondi loading
        if (mainLoading) mainLoading.style.display = 'none';
        if (usersGrid) usersGrid.style.display = 'grid';
    } catch (error) {
        console.error('Errore caricamento dati:', error);
        if (mainLoading) mainLoading.style.display = 'none';
        if (usersGrid) {
            usersGrid.style.display = 'block';
            usersGrid.innerHTML = '<p class="no-users">Errore nel caricamento delle foto. Ricarica la pagina.</p>';
        }
    }
}

// Renderizza le card degli utenti
function renderUserCards() {
    const usersGrid = document.getElementById('usersGrid');
    if (!usersGrid) return;

    usersGrid.innerHTML = '';

    const users = Object.keys(allUsersData);

    if (users.length === 0) {
        usersGrid.innerHTML = '<p class="no-users">Nessuna foto caricata ancora. Condividi il link di upload con i tuoi amici!</p>';
        return;
    }

    users.forEach(userName => {
        const userData = allUsersData[userName];
        const mediaCount = userData.photos ? userData.photos.length : 0;
        const photoCount = userData.photos ? userData.photos.filter(p => !p.isVideo).length : 0;
        const videoCount = userData.photos ? userData.photos.filter(p => p.isVideo).length : 0;

        const card = document.createElement('div');
        card.className = 'user-card';

        let countText = '';
        if (photoCount > 0 && videoCount > 0) {
            countText = `${photoCount} ${photoCount === 1 ? 'foto' : 'foto'}, ${videoCount} ${videoCount === 1 ? 'video' : 'video'}`;
        } else if (photoCount > 0) {
            countText = `${photoCount} ${photoCount === 1 ? 'foto' : 'foto'}`;
        } else if (videoCount > 0) {
            countText = `${videoCount} ${videoCount === 1 ? 'video' : 'video'}`;
        }

        card.innerHTML = `
            <div class="user-card-content">
                <h3>${userName}</h3>
                <p class="photo-count">${countText}</p>
            </div>
        `;

        card.addEventListener('click', () => {
            showUserGallery(userName, userData);
        });

        usersGrid.appendChild(card);
    });
}

// Mostra galleria di un singolo utente
function showUserGallery(userName, userData) {
    const galleryModal = document.getElementById('galleryModal');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryPhotos = document.getElementById('galleryPhotos');
    const galleryMessage = document.getElementById('galleryMessage');

    galleryTitle.textContent = `Foto e video con ${userName}`;
    galleryPhotos.innerHTML = '';

    // Mostra messaggio se presente
    if (userData.message) {
        galleryMessage.textContent = `"${userData.message}"`;
        galleryMessage.style.display = 'block';
    } else {
        galleryMessage.style.display = 'none';
    }

    // Mostra foto e video
    if (userData.photos && userData.photos.length > 0) {
        userData.photos.forEach((media, index) => {
            const mediaItem = document.createElement('div');
            mediaItem.className = 'gallery-photo-item';

            if (media.isVideo) {
                mediaItem.innerHTML = `
                    <video src="${media.url}" controls class="gallery-video" loading="lazy"></video>
                `;
            } else {
                mediaItem.innerHTML = `
                    <img src="${media.url}" alt="Foto ${index + 1}" loading="lazy">
                `;
            }
            galleryPhotos.appendChild(mediaItem);
        });
    }

    galleryModal.style.display = 'flex';
}

// Chiudi galleria
function closeGallery() {
    const galleryModal = document.getElementById('galleryModal');
    galleryModal.style.display = 'none';
}

// Setup musica di sottofondo
function setupBackgroundMusic() {
    backgroundMusic = document.getElementById('backgroundMusic');
    if (!backgroundMusic) return;

    // Loop infinito
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.5; // 50% volume
}

// Precarica tutte le immagini prima di avviare lo slideshow
function preloadImages(slideshowData) {
    return new Promise((resolve, reject) => {
        const imagesToLoad = slideshowData.filter(item => !item.isVideo && !item.isIntro && item.url);

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

// Avvia slideshow completo
function startFullSlideshow() {
    // Prepara array di tutte le foto e video raggruppate per persona
    const slideshowData = [];

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

    if (slideshowData.length === 0) {
        alert('Nessuna foto o video disponibile per lo slideshow!');
        return;
    }

    // Mostra slideshow modal
    const slideshowModal = document.getElementById('slideshowModal');
    slideshowModal.style.display = 'flex';

    // Mostra loading overlay
    const slideshowLoading = document.getElementById('slideshowLoading');
    const slideshowContainer = document.querySelector('.slideshow-container');

    if (slideshowLoading) {
        slideshowLoading.style.display = 'flex';
    }
    if (slideshowContainer) {
        slideshowContainer.style.display = 'none';
    }

    // Precarica tutte le immagini
    preloadImages(slideshowData).then((imageCache) => {
        // Nascondi loading, mostra slideshow
        if (slideshowLoading) {
            slideshowLoading.style.display = 'none';
        }
        if (slideshowContainer) {
            slideshowContainer.style.display = 'flex';
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
}

// Trova l'indice della slide introduttiva della persona precedente/successiva
function findPersonBoundary(currentIndex, direction) {
    if (!currentSlideshow || !currentSlideshow.photos.length) return currentIndex;

    const currentSlide = currentSlideshow.photos[currentIndex];
    const currentPerson = currentSlide.userName;
    let newIndex = currentIndex;

    if (direction === 'next') {
        // Trova la slide introduttiva della persona successiva
        for (let i = currentIndex + 1; i < currentSlideshow.photos.length; i++) {
            if (currentSlideshow.photos[i].isIntro &&
                currentSlideshow.photos[i].userName !== currentPerson) {
                newIndex = i;
                break;
            }
        }
        // Se non trovata, torna all'inizio (prima intro slide)
        if (newIndex === currentIndex) {
            for (let i = 0; i < currentSlideshow.photos.length; i++) {
                if (currentSlideshow.photos[i].isIntro) {
                    newIndex = i;
                    break;
                }
            }
        }
    } else if (direction === 'prev') {
        // Trova la slide introduttiva della persona precedente
        for (let i = currentIndex - 1; i >= 0; i--) {
            if (currentSlideshow.photos[i].isIntro &&
                currentSlideshow.photos[i].userName !== currentPerson) {
                newIndex = i;
                break;
            }
        }
        // Se non trovata, vai all'ultima intro slide
        if (newIndex === currentIndex) {
            for (let i = currentSlideshow.photos.length - 1; i >= 0; i--) {
                if (currentSlideshow.photos[i].isIntro) {
                    newIndex = i;
                    break;
                }
            }
        }
    }

    return newIndex;
}

// Applica la scala alla foto/video corrente
function applyPhotoScale() {
    const slideshowImage = document.getElementById('slideshowImage');
    const slideshowVideo = document.getElementById('slideshowVideo');

    if (slideshowImage) {
        slideshowImage.style.transform = `scale(${photoScale})`;
    }
    if (slideshowVideo) {
        slideshowVideo.style.transform = `scale(${photoScale})`;
    }
}

// Mostra slide corrente
function displaySlide(index) {
    if (!currentSlideshow || index < 0 || index >= currentSlideshow.photos.length) return;

    // Ferma video precedente se presente
    if (currentVideoElement) {
        currentVideoElement.pause();
        currentVideoElement.removeEventListener('ended', handleVideoEnded);
        currentVideoElement = null;
    }

    // Cancella timeout precedente se presente
    if (currentSlideshow.videoTimeoutId) {
        clearTimeout(currentSlideshow.videoTimeoutId);
        currentSlideshow.videoTimeoutId = null;
    }

    const slide = currentSlideshow.photos[index];
    const slideshowContainer = document.querySelector('.slideshow-container');
    const slideshowUserName = document.getElementById('slideshowUserName');
    const slideshowMessage = document.getElementById('slideshowMessage');
    const slideshowProgress = document.getElementById('slideshowProgress');

    // Rimuovi elemento precedente (media o intro)
    const oldMedia = slideshowContainer.querySelector('#slideshowImage, #slideshowVideo, .slideshow-intro');
    if (oldMedia) {
        oldMedia.remove();
    }

    // Handle intro slides
    if (slide.isIntro) {
        console.log('Intro slide:', slide.userName, 'Message:', slide.message, 'Type:', typeof slide.message);
        // Show intro slide with message
        const introDiv = document.createElement('div');
        introDiv.className = 'slideshow-intro';
        introDiv.innerHTML = `
            <h2>${slide.userName}</h2>
            ${slide.message && slide.message.trim() ? `<p>${slide.message}</p>` : '<p style="opacity: 0.5;">Nessun messaggio</p>'}
        `;
        slideshowContainer.appendChild(introDiv);

        // Clear info section
        slideshowUserName.textContent = '';
        slideshowMessage.textContent = '';

        // Pause autoplay for intro slides - user can manually advance
        stopSlideshowAutoPlay();

        // Auto-advance after 3 seconds if playing
        if (currentSlideshow.isPlaying) {
            setTimeout(() => {
                if (currentSlideshow && currentSlideshow.currentIndex === index) {
                    currentSlideshow.currentIndex++;
                    if (currentSlideshow.currentIndex >= currentSlideshow.photos.length) {
                        currentSlideshow.currentIndex = 0; // Loop
                    }
                    displaySlide(currentSlideshow.currentIndex);
                }
            }, 3000);
        }

        // Update progress
        const progress = ((index + 1) / currentSlideshow.photos.length) * 100;
        slideshowProgress.value = progress;

        return;
    }

    if (slide.isVideo) {
        // Crea elemento video
        const videoElement = document.createElement('video');
        videoElement.id = 'slideshowVideo';
        videoElement.src = slide.url;
        videoElement.autoplay = true;
        videoElement.controls = false;
        // Append video to container
        slideshowContainer.appendChild(videoElement);

        currentVideoElement = videoElement;

        // Applica scala al video
        applyPhotoScale();

        // Quando il video finisce, passa alla slide successiva
        videoElement.addEventListener('ended', handleVideoEnded);

        // Ferma autoplay normale per i video
        stopSlideshowAutoPlay();
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

        // Append image to container
        slideshowContainer.appendChild(imgElement);

        // Applica scala all'immagine
        applyPhotoScale();

        // Riprendi autoplay normale per le foto
        // Ferma prima l'autoplay esistente per evitare intervalli multipli
        stopSlideshowAutoPlay();
        if (currentSlideshow.isPlaying) {
            startSlideshowAutoPlay();
        }
    }

    slideshowUserName.textContent = slide.isVideo ? `Video con ${slide.userName}` : `Foto con ${slide.userName}`;

    // Don't show message on regular slides (only on intro slides)
    slideshowMessage.textContent = '';
    slideshowMessage.style.display = 'block';

    // Aggiorna progress bar
    const progress = ((index + 1) / currentSlideshow.photos.length) * 100;
    slideshowProgress.value = progress;

    // Aggiorna indicatore
    const slideCounter = document.getElementById('slideCounter');
    if (slideCounter) {
        slideCounter.textContent = `${index + 1} / ${currentSlideshow.photos.length}`;
    }
}

// Gestisce la fine di un video nello slideshow
function handleVideoEnded() {
    if (!currentSlideshow) return;

    // Passa alla slide successiva
    currentSlideshow.currentIndex++;
    if (currentSlideshow.currentIndex >= currentSlideshow.photos.length) {
        currentSlideshow.currentIndex = 0; // Loop
    }
    displaySlide(currentSlideshow.currentIndex);
}

// Avvia autoplay slideshow (solo per foto)
function startSlideshowAutoPlay() {
    if (!currentSlideshow || !currentSlideshow.isPlaying) return;

    // SEMPRE fermare l'intervallo esistente prima di crearne uno nuovo
    stopSlideshowAutoPlay();

    // Se la slide corrente è un video, non usare autoplay
    if (currentSlideshow.photos[currentSlideshow.currentIndex]?.isVideo) {
        return;
    }

    // Cambia slide usando la velocità impostata (solo per foto)
    currentSlideshow.intervalId = setInterval(() => {
        if (currentSlideshow && currentSlideshow.isPlaying) {
            // Controlla se la slide corrente è un video
            if (currentSlideshow.photos[currentSlideshow.currentIndex]?.isVideo) {
                stopSlideshowAutoPlay();
                return;
            }

            currentSlideshow.currentIndex++;
            if (currentSlideshow.currentIndex >= currentSlideshow.photos.length) {
                currentSlideshow.currentIndex = 0; // Loop
            }
            displaySlide(currentSlideshow.currentIndex);
        }
    }, slideshowSpeed);
}

// Ferma autoplay slideshow
function stopSlideshowAutoPlay() {
    if (currentSlideshow && currentSlideshow.intervalId) {
        clearInterval(currentSlideshow.intervalId);
        currentSlideshow.intervalId = null;
    }
}

// Setup controlli slideshow
function setupSlideshowControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const closeSlideshowBtn = document.getElementById('closeSlideshowBtn');
    const speedSlider = document.getElementById('speedSlider');
    const speedValue = document.getElementById('speedValue');

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', toggleSlideshow);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (!currentSlideshow) return;
            currentSlideshow.currentIndex--;
            if (currentSlideshow.currentIndex < 0) {
                currentSlideshow.currentIndex = currentSlideshow.photos.length - 1;
            }
            displaySlide(currentSlideshow.currentIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (!currentSlideshow) return;
            currentSlideshow.currentIndex++;
            if (currentSlideshow.currentIndex >= currentSlideshow.photos.length) {
                currentSlideshow.currentIndex = 0;
            }
            displaySlide(currentSlideshow.currentIndex);
        });
    }

    if (closeSlideshowBtn) {
        closeSlideshowBtn.addEventListener('click', closeSlideshow);
    }

    // Listener per lo slider della velocità
    if (speedSlider && speedValue) {
        speedSlider.addEventListener('input', (e) => {
            const seconds = parseInt(e.target.value);
            slideshowSpeed = seconds * 1000; // Converti in millisecondi
            speedValue.textContent = `${seconds}s`;

            // Se lo slideshow è attivo e sta riproducendo foto, riavvia con la nuova velocità
            if (currentSlideshow && currentSlideshow.isPlaying) {
                const isCurrentPhoto = !currentSlideshow.photos[currentSlideshow.currentIndex]?.isVideo;
                if (isCurrentPhoto) {
                    stopSlideshowAutoPlay();
                    startSlideshowAutoPlay();
                }
            }
        });
    }

    // Listener per lo slider della dimensione
    const sizeSlider = document.getElementById('sizeSlider');
    const sizeValue = document.getElementById('sizeValue');

    if (sizeSlider && sizeValue) {
        sizeSlider.addEventListener('input', (e) => {
            const percentage = parseInt(e.target.value);
            photoScale = percentage / 100; // Converti percentuale in scala (es. 100 -> 1.0, 150 -> 1.5)
            sizeValue.textContent = `${percentage}%`;
            applyPhotoScale();
        });
    }

    // Listener per navigazione tra persone
    const prevPersonBtn = document.getElementById('prevPersonBtn');
    const nextPersonBtn = document.getElementById('nextPersonBtn');

    if (prevPersonBtn) {
        prevPersonBtn.addEventListener('click', () => {
            if (!currentSlideshow) return;
            currentSlideshow.currentIndex = findPersonBoundary(currentSlideshow.currentIndex, 'prev');
            displaySlide(currentSlideshow.currentIndex);
        });
    }

    if (nextPersonBtn) {
        nextPersonBtn.addEventListener('click', () => {
            if (!currentSlideshow) return;
            currentSlideshow.currentIndex = findPersonBoundary(currentSlideshow.currentIndex, 'next');
            displaySlide(currentSlideshow.currentIndex);
        });
    }
}

// Toggle play/pause slideshow
function toggleSlideshow() {
    if (!currentSlideshow) return;

    currentSlideshow.isPlaying = !currentSlideshow.isPlaying;
    const playPauseBtn = document.getElementById('playPauseBtn');

    if (currentSlideshow.isPlaying) {
        playPauseBtn.textContent = '⏸️ Pausa';
        // Se è un video, non riprendere autoplay
        if (!currentSlideshow.photos[currentSlideshow.currentIndex]?.isVideo) {
            startSlideshowAutoPlay();
        }
    } else {
        playPauseBtn.textContent = '▶️ Play';
        stopSlideshowAutoPlay();
        if (currentVideoElement) {
            currentVideoElement.pause();
        }
    }
}

// Chiudi slideshow
function closeSlideshow() {
    const slideshowModal = document.getElementById('slideshowModal');
    slideshowModal.style.display = 'none';

    stopSlideshowAutoPlay();

    // Ferma video se presente
    if (currentVideoElement) {
        currentVideoElement.pause();
        currentVideoElement.removeEventListener('ended', handleVideoEnded);
        currentVideoElement = null;
    }

    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }

    currentSlideshow = null;
}

// Chiudi modali cliccando fuori
window.addEventListener('click', function(e) {
    const galleryModal = document.getElementById('galleryModal');
    const slideshowModal = document.getElementById('slideshowModal');

    if (e.target === galleryModal) {
        closeGallery();
    }
    if (e.target === slideshowModal) {
        closeSlideshow();
    }
});
