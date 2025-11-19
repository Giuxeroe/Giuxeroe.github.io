// Main JavaScript - Gestione gallerie e slideshow (Storage-only con supporto video)

let allUsersData = {};
let currentSlideshow = null;
let backgroundMusic = null;
let currentVideoElement = null;
let slideshowSpeed = 5000; // Velocità slideshow in millisecondi (default 5 secondi)

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
            } catch (e) {
                // Nessun messaggio o errore lettura
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
    } catch (error) {
        console.error('Errore caricamento dati:', error);
        const usersGrid = document.getElementById('usersGrid');
        if (usersGrid) {
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

// Avvia slideshow completo
function startFullSlideshow() {
    // Prepara array di tutte le foto e video raggruppate per persona
    const slideshowData = [];

    Object.keys(allUsersData).forEach(userName => {
        const userData = allUsersData[userName];

        if (userData.photos && userData.photos.length > 0) {
            const message = userData.message || '';

            userData.photos.forEach(media => {
                slideshowData.push({
                    url: media.url,
                    userName: userName,
                    message: message,
                    isVideo: media.isVideo
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

    // Rimuovi elemento precedente
    const oldMedia = slideshowContainer.querySelector('#slideshowImage, #slideshowVideo');
    if (oldMedia) {
        oldMedia.remove();
    }

    if (slide.isVideo) {
        // Crea elemento video
        const videoElement = document.createElement('video');
        videoElement.id = 'slideshowVideo';
        videoElement.src = slide.url;
        videoElement.autoplay = true;
        videoElement.controls = false;
        videoElement.style.maxWidth = '100%';
        videoElement.style.maxHeight = '70vh';
        videoElement.style.objectFit = 'contain';
        videoElement.style.borderRadius = '10px';

        // Inserisci video prima dell'info
        const infoDiv = slideshowContainer.querySelector('.slideshow-info');
        slideshowContainer.insertBefore(videoElement, infoDiv);

        currentVideoElement = videoElement;

        // Quando il video finisce, passa alla slide successiva
        videoElement.addEventListener('ended', handleVideoEnded);

        // Ferma autoplay normale per i video
        stopSlideshowAutoPlay();
    } else {
        // Crea elemento immagine
        const imgElement = document.createElement('img');
        imgElement.id = 'slideshowImage';
        imgElement.src = slide.url;
        imgElement.alt = 'Slideshow';
        imgElement.style.maxWidth = '100%';
        imgElement.style.maxHeight = '70vh';
        imgElement.style.objectFit = 'contain';
        imgElement.style.borderRadius = '10px';

        // Inserisci immagine prima dell'info
        const infoDiv = slideshowContainer.querySelector('.slideshow-info');
        slideshowContainer.insertBefore(imgElement, infoDiv);

        // Riprendi autoplay normale per le foto
        // Ferma prima l'autoplay esistente per evitare intervalli multipli
        stopSlideshowAutoPlay();
        if (currentSlideshow.isPlaying) {
            startSlideshowAutoPlay();
        }
    }

    slideshowUserName.textContent = slide.isVideo ? `Video con ${slide.userName}` : `Foto con ${slide.userName}`;

    // Mostra sempre il messaggio (anche se vuoto)
    if (slide.message && slide.message.trim()) {
        slideshowMessage.textContent = `"${slide.message}"`;
    } else {
        slideshowMessage.textContent = ''; // Nessun messaggio
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
