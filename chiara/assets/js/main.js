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

// Helper: inizializza video di caricamento
function initLoadingVideo(container) {
    if (!container) return;
    const video = container.querySelector('.loading-video');
    if (video) {
        video.currentTime = 0;
        video.play().catch(e => {
            console.log('Autoplay video bloccato:', e);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize interactive features first
    lightboxManager = new LightboxManager();
    animationController = new AnimationController();

    // Celebrate on page load
    setTimeout(() => {
        ParticleEffects.celebrate();
    }, 500);

    // Inizializza video di caricamento principale
    const mainLoading = document.getElementById('mainLoading');
    if (mainLoading && mainLoading.style.display !== 'none') {
        initLoadingVideo(mainLoading);
    }

    // Carica dati utenti da Storage
    loadUsersData();

    // Setup musica di sottofondo
    setupBackgroundMusic();

    // Setup controlli slideshow
    setupSlideshowControls();

    // Easter egg - click on Chiara's name
    const chiaraName = document.getElementById('chiaraName');
    if (chiaraName) {
        chiaraName.addEventListener('click', () => {
            openEasterEgg('assets/images/chiara-placeholder.jpg', 'Questo sono io mentre programmavo il sito (non è vero)');
        });
    }

    // Easter egg - click on secret "non"
    const secretNon = document.getElementById('secretNon');
    if (secretNon) {
        secretNon.addEventListener('click', () => {
            openEasterEgg('assets/images/andrea-placeholder.jpg', "L'artificialmente inseminato");
        });
    }
});

// Carica tutti i dati degli utenti da Storage
async function loadUsersData() {
    const mainLoading = document.getElementById('mainLoading');
    const usersGrid = document.getElementById('usersGrid');

    // Mostra loading iniziale
    if (mainLoading) {
        mainLoading.style.display = 'flex';
        initLoadingVideo(mainLoading);
    }

    // Mostra grid immediatamente per rendering progressivo
    if (usersGrid) {
        usersGrid.style.display = 'grid';
        usersGrid.innerHTML = ''; // Clear any existing content
    }

    try {
        const photosRef = storage.ref('photos');
        const folders = await photosRef.listAll();

        allUsersData = {};

        // Ordina le cartelle per mostrare "Giuseppe🥸" per ultima
        const foldersArray = Array.from(folders.prefixes);
        const giuseppeIndex = foldersArray.findIndex(f => f.name === 'Giuseppe🥸');
        if (giuseppeIndex !== -1) {
            const giuseppe = foldersArray.splice(giuseppeIndex, 1)[0];
            foldersArray.push(giuseppe);
        }

        // Per ogni cartella (utente) - rendering progressivo
        for (const folder of foldersArray) {
            const userName = folder.name;
            const userFiles = await folder.listAll();

            // Filtra file multimediali (escludi message.txt)
            // Store refs instead of URLs for lazy loading
            const mediaFiles = userFiles.items
                .filter(item => item.name !== 'message.txt')
                .map(item => ({
                    url: null, // Will be fetched on-demand
                    name: item.name,
                    ref: item,
                    isVideo: isVideo(item.name)
                }));

            // Leggi message.txt se esiste
            let message = '';
            const messageRef = folder.child('message.txt');
            try {
                const messageUrl = await messageRef.getDownloadURL();
                try {
                    const response = await fetch(messageUrl);
                    message = await response.text();
                    message = message.trim();
                    console.log(`User: ${userName}, Message: "${message}"`);
                } catch (fetchError) {
                    console.log(`User: ${userName}, CORS or fetch error - file exists but can't be read:`, fetchError);
                }
            } catch (e) {
                console.log(`User: ${userName}, No message file:`, e.code);
            }

            // Store data with refs (URLs will be fetched lazily)
            allUsersData[userName] = {
                name: userName,
                photos: mediaFiles, // Store all files with refs, not just those with URLs
                message: message,
                urlsLoaded: false // Flag to track if URLs have been fetched
            };

            // Render card immediately for this user (progressive rendering)
            renderSingleUserCard(userName, allUsersData[userName]);
        }

        // Nascondi loading dopo che tutte le cartelle sono state processate
        if (mainLoading) mainLoading.style.display = 'none';

        // Avvia caricamento URL in background (non-blocking)
        fetchAllUserUrls().then(() => {
            console.log('✅ URL foto/video precaricati');
        }).catch(err => {
            console.warn('⚠️ Errore precaricamento URL:', err);
        });

        // Animate cards entrance with IntersectionObserver
        if (usersGrid && Object.keys(allUsersData).length > 0) {
            setTimeout(() => {
                if (animationController) {
                    animationController.observeAll('.user-card');
                }
            }, 100);
        } else if (usersGrid && Object.keys(allUsersData).length === 0) {
            usersGrid.innerHTML = '<p class="no-users">Nessuna foto caricata ancora. Condividi il link di upload con i tuoi amici!</p>';
        }
    } catch (error) {
        console.error('Errore caricamento dati:', error);
        if (mainLoading) mainLoading.style.display = 'none';
        if (usersGrid) {
            usersGrid.style.display = 'block';
            usersGrid.innerHTML = '<p class="no-users">Errore nel caricamento delle foto. Ricarica la pagina.</p>';
        }
    }
}

// Renderizza una singola card utente (per rendering progressivo)
function renderSingleUserCard(userName, userData) {
    const usersGrid = document.getElementById('usersGrid');
    if (!usersGrid) return;

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
        // Celebrate with particles
        ParticleEffects.burst(
            card.getBoundingClientRect().left + card.offsetWidth / 2,
            card.getBoundingClientRect().top + card.offsetHeight / 2
        );
        showUserGallery(userName, userData);
    });

    usersGrid.appendChild(card);
}

// Renderizza tutte le card degli utenti (legacy, mantenuta per compatibilità)
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
        renderSingleUserCard(userName, allUsersData[userName]);
    });
}

// Mostra galleria di un singolo utente
async function showUserGallery(userName, userData) {
    const galleryModal = document.getElementById('galleryModal');
    const galleryTitle = document.getElementById('galleryTitle');
    const galleryPhotos = document.getElementById('galleryPhotos');
    const galleryMessage = document.getElementById('galleryMessage');

    galleryTitle.textContent = `Foto e video con ${userName}`;

    // Show loading state if URLs need to be fetched
    if (!userData.urlsLoaded && userData.photos && userData.photos.length > 0) {
        galleryPhotos.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; gap: 20px;">
                <video autoplay loop muted playsinline class="loading-video">
                    <source src="assets/images/Video WhatsApp 2025-11-22 ore 16.20.14_69b654bf.mp4" type="video/mp4">
                </video>
                <p>Caricamento foto e video...</p>
            </div>
        `;
        // Inizializza il video
        const loadingContainer = galleryPhotos.querySelector('div');
        if (loadingContainer) {
            initLoadingVideo(loadingContainer);
        }
    } else {
        galleryPhotos.innerHTML = '';
    }

    // Mostra messaggio se presente
    if (userData.message && userData.message.trim()) {
        galleryMessage.textContent = `"${userData.message}"`;
        galleryMessage.style.opacity = '1';
        galleryMessage.style.fontStyle = 'normal';
    } else {
        galleryMessage.textContent = 'Nessun messaggio';
        galleryMessage.style.opacity = '0.7';
        galleryMessage.style.fontStyle = 'italic';
    }
    galleryMessage.style.display = 'block';

    // Show modal immediately
    galleryModal.style.display = 'flex';
    galleryModal.classList.add('show');

    // Fetch URLs on-demand if not already loaded
    if (!userData.urlsLoaded && userData.photos && userData.photos.length > 0) {
        try {
            // Fetch URLs for all media files
            for (let i = 0; i < userData.photos.length; i++) {
                if (!userData.photos[i].url && userData.photos[i].ref) {
                    try {
                        userData.photos[i].url = await userData.photos[i].ref.getDownloadURL();
                    } catch (e) {
                        console.error('Errore ottenendo URL per', userData.photos[i].name, e);
                    }
                }
            }
            userData.urlsLoaded = true; // Mark as loaded
        } catch (error) {
            console.error('Errore caricamento URL:', error);
            galleryPhotos.innerHTML = '<p class="no-users">Errore nel caricamento delle foto. Riprova.</p>';
            return;
        }
    }

    // Clear loading and render photos/videos
    galleryPhotos.innerHTML = '';

    // Mostra foto e video
    if (userData.photos && userData.photos.length > 0) {
        // Filter out items without URLs
        const validPhotos = userData.photos.filter(p => p.url);

        if (validPhotos.length === 0) {
            galleryPhotos.innerHTML = '<p class="no-users">Nessuna foto disponibile.</p>';
            return;
        }

        validPhotos.forEach((media, index) => {
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

            // Add click handler to open lightbox
            mediaItem.addEventListener('click', () => {
                if (lightboxManager) {
                    const mediaItems = validPhotos.map(p => ({
                        url: p.url,
                        isVideo: p.isVideo
                    }));
                    lightboxManager.open(mediaItems, index);
                    ParticleEffects.burst(window.innerWidth / 2, window.innerHeight / 2);
                }
            });

            galleryPhotos.appendChild(mediaItem);
        });
    }

    // Celebrate opening gallery
    ParticleEffects.hearts();
}

// Chiudi galleria
function closeGallery() {
    const galleryModal = document.getElementById('galleryModal');
    galleryModal.style.display = 'none';
    galleryModal.classList.remove('show');
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

// Fetch URLs for all users that haven't been loaded yet
async function fetchAllUserUrls() {
    const usersToLoad = Object.keys(allUsersData).filter(
        userName => !allUsersData[userName].urlsLoaded &&
                   allUsersData[userName].photos &&
                   allUsersData[userName].photos.length > 0
    );

    if (usersToLoad.length === 0) {
        return; // All URLs already loaded
    }

    const loadingProgressBar = document.getElementById('loadingProgressBar');
    const loadingProgressText = document.getElementById('loadingProgressText');

    let totalFiles = 0;
    let loadedFiles = 0;

    // Count total files to load
    usersToLoad.forEach(userName => {
        totalFiles += allUsersData[userName].photos.length;
    });

    // Fetch URLs for each user
    for (const userName of usersToLoad) {
        const userData = allUsersData[userName];

        for (let i = 0; i < userData.photos.length; i++) {
            if (!userData.photos[i].url && userData.photos[i].ref) {
                try {
                    userData.photos[i].url = await userData.photos[i].ref.getDownloadURL();
                    loadedFiles++;

                    // Update progress
                    const progress = Math.round((loadedFiles / totalFiles) * 100);
                    if (loadingProgressBar) {
                        loadingProgressBar.style.width = progress + '%';
                    }
                    if (loadingProgressText) {
                        loadingProgressText.textContent = progress + '%';
                    }
                } catch (e) {
                    console.error('Errore ottenendo URL per', userData.photos[i].name, e);
                    loadedFiles++; // Count errors too to keep progress accurate
                }
            }
        }

        userData.urlsLoaded = true; // Mark as loaded
    }
}

// Avvia slideshow completo
async function startFullSlideshow() {
    // Celebrate starting slideshow
    ParticleEffects.stars();

    // Mostra slideshow modal
    const slideshowModal = document.getElementById('slideshowModal');
    slideshowModal.style.display = 'flex';

    // Mostra loading overlay
    const slideshowLoading = document.getElementById('slideshowLoading');
    const slideshowContainer = document.querySelector('.slideshow-container');

    if (slideshowLoading) {
        slideshowLoading.style.display = 'flex';
        initLoadingVideo(slideshowLoading);
    }
    if (slideshowContainer) {
        slideshowContainer.style.display = 'none';
    }

    // Update loading text
    const loadingText = slideshowLoading?.querySelector('p');

    try {
        // Check if URLs are already loaded
        const needsUrlFetch = Object.keys(allUsersData).some(
            userName => !allUsersData[userName].urlsLoaded &&
                       allUsersData[userName].photos &&
                       allUsersData[userName].photos.length > 0
        );

        if (needsUrlFetch) {
            if (loadingText) {
                loadingText.textContent = 'Caricamento URL foto e video...';
            }
            // Fetch URLs on-demand if needed
            await fetchAllUserUrls();
        }

        // Always show image preloading step
        if (loadingText) {
            loadingText.textContent = 'Caricamento foto e video...';
        }

        // Prepara array di tutte le foto e video raggruppate per persona
        const slideshowData = [];

        Object.keys(allUsersData).forEach(userName => {
            const userData = allUsersData[userName];

            if (userData.photos && userData.photos.length > 0) {
                const message = userData.message || '';

                // Filter out items without URLs
                const validPhotos = userData.photos.filter(p => p.url);

                if (validPhotos.length > 0) {
                    // Add intro slide first
                    slideshowData.push({
                        isIntro: true,
                        userName: userName,
                        message: message,
                        url: null,
                        isVideo: false
                    });

                    // Then add all photos/videos
                    validPhotos.forEach(media => {
                        slideshowData.push({
                            url: media.url,
                            userName: userName,
                            message: message,
                            isVideo: media.isVideo,
                            isIntro: false
                        });
                    });
                }
            }
        });

        if (slideshowData.length === 0) {
            Toast.error('Nessuna foto o video disponibile per lo slideshow!');
            if (slideshowLoading) {
                slideshowLoading.style.display = 'none';
            }
            slideshowModal.style.display = 'none';
            return;
        }

        // Reset progress bar for image preloading
        const loadingProgressBar = document.getElementById('loadingProgressBar');
        const loadingProgressText = document.getElementById('loadingProgressText');
        if (loadingProgressBar) {
            loadingProgressBar.style.width = '0%';
        }
        if (loadingProgressText) {
            loadingProgressText.textContent = '0%';
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

            // Sincronizza slider con i valori delle variabili
            const speedSlider = document.getElementById('speedSlider');
            const speedValue = document.getElementById('speedValue');
            const sizeSlider = document.getElementById('sizeSlider');
            const sizeValue = document.getElementById('sizeValue');

            if (speedSlider && speedValue) {
                const currentSeconds = slideshowSpeed / 1000; // Converti da ms a secondi
                speedSlider.value = currentSeconds;
                speedValue.textContent = `${currentSeconds}s`;
            }

            if (sizeSlider && sizeValue) {
                const currentPercentage = Math.round(photoScale * 100); // Converti da scala a percentuale
                sizeSlider.value = currentPercentage;
                sizeValue.textContent = `${currentPercentage}%`;
            }

            displaySlide(currentSlideshow.currentIndex);
            startSlideshowAutoPlay();

            // Avvia musica se disponibile
            if (backgroundMusic) {
                backgroundMusic.play().catch(e => {
                    console.log('Autoplay bloccato dal browser:', e);
                });
            }
        });
    } catch (error) {
        console.error('Errore caricamento slideshow:', error);
        Toast.error('Errore nel caricamento dello slideshow. Riprova.');
        if (slideshowLoading) {
            slideshowLoading.style.display = 'none';
        }
        slideshowModal.style.display = 'none';
    }
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

        // Clear user name but keep message visible in panel
        slideshowUserName.textContent = '';
        // Show message in panel during intro slides too
        if (slide.message && slide.message.trim()) {
            slideshowMessage.textContent = `"${slide.message}"`;
            slideshowMessage.style.opacity = '1';
            slideshowMessage.style.fontStyle = 'italic';
        } else {
            slideshowMessage.textContent = 'Nessun messaggio';
            slideshowMessage.style.opacity = '0.5';
            slideshowMessage.style.fontStyle = 'italic';
        }
        slideshowMessage.style.display = 'block';

        // Celebrate intro slide with confetti
        ParticleEffects.celebrate();

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

    // Show message during all slides for the current person
    if (slide.message && slide.message.trim()) {
        slideshowMessage.textContent = `"${slide.message}"`;
        slideshowMessage.style.opacity = '1';
        slideshowMessage.style.fontStyle = 'italic';
    } else {
        slideshowMessage.textContent = 'Nessun messaggio';
        slideshowMessage.style.opacity = '0.5';
        slideshowMessage.style.fontStyle = 'italic';
    }
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
    const slideshowContainer = document.querySelector('.slideshow-container');

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

    // Add swipe gestures to slideshow
    if (slideshowContainer) {
        new SwipeGestureHandler(slideshowContainer, {
            onSwipeLeft: () => {
                if (nextBtn) nextBtn.click();
            },
            onSwipeRight: () => {
                if (prevBtn) prevBtn.click();
            },
            onSwipeDown: () => {
                closeSlideshow();
            }
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

// ============================================
// NEW INTERACTIVE FEATURES
// ============================================

// Particle Effects Manager
class ParticleEffects {
    static celebrate() {
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    static burst(x, y) {
        if (typeof confetti !== 'undefined') {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: x / window.innerWidth, y: y / window.innerHeight },
                colors: ['#667eea', '#764ba2', '#ff6b6b', '#ffd93d']
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: x / window.innerWidth, y: y / window.innerHeight },
                colors: ['#667eea', '#764ba2', '#ff6b6b', '#ffd93d']
            });
        }
    }

    static hearts() {
        if (typeof confetti !== 'undefined') {
            const heart = '❤️';
            const emoji = heart;
            confetti({
                emoji: [emoji],
                emojiSize: 50,
                particleCount: 30,
                spread: 60,
                origin: { y: 0.6 }
            });
        }
    }

    static stars() {
        if (typeof confetti !== 'undefined') {
            const star = '⭐';
            confetti({
                emoji: [star],
                emojiSize: 50,
                particleCount: 30,
                spread: 60,
                origin: { y: 0.6 }
            });
        }
    }
}

// Lightbox Manager with Zoom and Pan
class LightboxManager {
    constructor() {
        this.currentIndex = 0;
        this.mediaItems = [];
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.modal = null;
        this.content = null;
        this.image = null;
        this.video = null;
        this.init();
    }

    init() {
        this.modal = document.getElementById('lightboxModal');
        this.content = this.modal.querySelector('.lightbox-content');
        this.image = document.getElementById('lightboxImage');
        this.video = document.getElementById('lightboxVideo');
        const counter = this.modal.querySelector('.lightbox-counter');
        const zoomText = this.modal.querySelector('.lightbox-zoom-text');

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'flex' || this.modal.classList.contains('show')) {
                if (e.key === 'Escape') this.close();
                if (e.key === 'ArrowLeft') this.prev();
                if (e.key === 'ArrowRight') this.next();
                if (e.key === '+' || e.key === '=') this.zoomIn();
                if (e.key === '-') this.zoomOut();
                if (e.key === '0') this.resetZoom();
            }
        });

        // Mouse wheel zoom
        this.content.addEventListener('wheel', (e) => {
            e.preventDefault();
            const delta = e.deltaY > 0 ? -0.1 : 0.1;
            this.zoomLevel = Math.max(0.5, Math.min(5, this.zoomLevel + delta));
            this.applyTransform();
            if (zoomText) zoomText.textContent = Math.round(this.zoomLevel * 100) + '%';
        });

        // Pan with mouse drag
        this.content.addEventListener('mousedown', (e) => {
            if (this.zoomLevel > 1) {
                this.isDragging = true;
                this.startX = e.clientX - this.panX;
                this.startY = e.clientY - this.panY;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging && this.zoomLevel > 1) {
                this.panX = e.clientX - this.startX;
                this.panY = e.clientY - this.startY;
                this.applyTransform();
            }
        });

        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });

        // Touch gestures
        let touchStartX = 0;
        let touchStartY = 0;
        let touchStartTime = 0;

        this.content.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchStartTime = Date.now();
            if (this.zoomLevel > 1) {
                this.isDragging = true;
                this.startX = touchStartX - this.panX;
                this.startY = touchStartY - this.panY;
            }
        });

        this.content.addEventListener('touchmove', (e) => {
            if (this.isDragging && this.zoomLevel > 1) {
                e.preventDefault();
                this.panX = e.touches[0].clientX - this.startX;
                this.panY = e.touches[0].clientY - this.startY;
                this.applyTransform();
            }
        });

        this.content.addEventListener('touchend', (e) => {
            this.isDragging = false;
            const touchEndX = e.changedTouches[0].clientX;
            const touchEndY = e.changedTouches[0].clientY;
            const touchDuration = Date.now() - touchStartTime;
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            // Swipe detection
            if (touchDuration < 300 && distance > 50) {
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    if (deltaX > 0) {
                        this.prev();
                    } else {
                        this.next();
                    }
                } else if (deltaY > 50) {
                    this.close();
                }
            }
        });
    }

    open(mediaItems, startIndex = 0) {
        this.mediaItems = mediaItems;
        this.currentIndex = startIndex;
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.showMedia();
        this.modal.style.display = 'flex';
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        this.updateCounter();
    }

    close() {
        this.modal.style.display = 'none';
        this.modal.classList.remove('show');
        document.body.style.overflow = '';
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();
    }

    showMedia() {
        const item = this.mediaItems[this.currentIndex];
        if (!item) return;

        if (item.isVideo) {
            this.image.style.display = 'none';
            this.video.style.display = 'block';
            this.video.src = item.url;
            this.video.load();
        } else {
            this.video.style.display = 'none';
            this.image.style.display = 'block';
            this.image.src = item.url;
        }
        this.resetZoom();
        this.updateCounter();
    }

    next() {
        if (this.currentIndex < this.mediaItems.length - 1) {
            this.currentIndex++;
        } else {
            this.currentIndex = 0;
        }
        this.showMedia();
        ParticleEffects.burst(window.innerWidth / 2, window.innerHeight / 2);
    }

    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            this.currentIndex = this.mediaItems.length - 1;
        }
        this.showMedia();
        ParticleEffects.burst(window.innerWidth / 2, window.innerHeight / 2);
    }

    zoomIn() {
        this.zoomLevel = Math.min(5, this.zoomLevel + 0.25);
        this.applyTransform();
        const zoomText = this.modal.querySelector('.lightbox-zoom-text');
        if (zoomText) zoomText.textContent = Math.round(this.zoomLevel * 100) + '%';
    }

    zoomOut() {
        this.zoomLevel = Math.max(0.5, this.zoomLevel - 0.25);
        this.applyTransform();
        const zoomText = this.modal.querySelector('.lightbox-zoom-text');
        if (zoomText) zoomText.textContent = Math.round(this.zoomLevel * 100) + '%';
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.panX = 0;
        this.panY = 0;
        this.applyTransform();
        const zoomText = this.modal.querySelector('.lightbox-zoom-text');
        if (zoomText) zoomText.textContent = '100%';
    }

    applyTransform() {
        const transform = `scale(${this.zoomLevel}) translate(${this.panX / this.zoomLevel}px, ${this.panY / this.zoomLevel}px)`;
        if (this.image.style.display !== 'none') {
            this.image.style.transform = transform;
        }
        if (this.video.style.display !== 'none') {
            this.video.style.transform = transform;
        }
    }

    updateCounter() {
        const counter = this.modal.querySelector('.lightbox-counter');
        if (counter) {
            counter.textContent = `${this.currentIndex + 1} / ${this.mediaItems.length}`;
        }
    }
}

// Swipe Gesture Handler
class SwipeGestureHandler {
    constructor(element, callbacks) {
        this.element = element;
        this.callbacks = callbacks;
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
        this.threshold = 50;
        this.restraint = 100;
        this.allowedTime = 300;
        this.init();
    }

    init() {
        this.element.addEventListener('touchstart', (e) => {
            this.startX = e.touches[0].clientX;
            this.startY = e.touches[0].clientY;
            this.startTime = Date.now();
        });

        this.element.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();
            const deltaX = endX - this.startX;
            const deltaY = endY - this.startY;
            const deltaTime = endTime - this.startTime;

            if (deltaTime <= this.allowedTime) {
                if (Math.abs(deltaX) >= this.threshold && Math.abs(deltaY) <= this.restraint) {
                    if (deltaX > 0 && this.callbacks.onSwipeRight) {
                        this.callbacks.onSwipeRight();
                    } else if (deltaX < 0 && this.callbacks.onSwipeLeft) {
                        this.callbacks.onSwipeLeft();
                    }
                } else if (Math.abs(deltaY) >= this.threshold && Math.abs(deltaX) <= this.restraint) {
                    if (deltaY > 0 && this.callbacks.onSwipeDown) {
                        this.callbacks.onSwipeDown();
                    } else if (deltaY < 0 && this.callbacks.onSwipeUp) {
                        this.callbacks.onSwipeUp();
                    }
                }
            }
        });
    }
}

// Animation Controller with Intersection Observer
class AnimationController {
    constructor() {
        this.observer = null;
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in-up');
                        // Keep observing to allow re-animation if needed
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
        }
    }

    observe(element) {
        if (this.observer && element) {
            this.observer.observe(element);
        }
    }

    observeAll(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => this.observe(el));
    }
}

// Toast Notification System
class Toast {
    static show(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('fade-out');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }

    static success(message, duration = 3000) {
        this.show(message, 'success', duration);
    }

    static error(message, duration = 3000) {
        this.show(message, 'error', duration);
    }

    static info(message, duration = 3000) {
        this.show(message, 'info', duration);
    }
}

// Initialize global instances (will be set in DOMContentLoaded)
let lightboxManager;
let animationController;

// Easter egg open function
function openEasterEgg(imageSrc, captionText) {
    const modal = document.getElementById('easterEggModal');
    const photo = document.getElementById('easterEggPhoto');
    const caption = document.querySelector('.easter-egg-caption');

    if (photo) {
        photo.src = imageSrc;
    }
    if (caption) {
        caption.textContent = captionText;
    }
    if (modal) {
        modal.style.display = 'block';
    }
}

// Easter egg close function
function closeEasterEgg() {
    document.getElementById('easterEggModal').style.display = 'none';
}
