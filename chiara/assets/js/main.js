// Main JavaScript - Gestione gallerie e slideshow (Storage-only)

let allUsersData = {};
let currentSlideshow = null;
let backgroundMusic = null;

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

            // Filtra solo le foto (escludi message.txt)
            const photos = userFiles.items
                .filter(item => item.name !== 'message.txt')
                .map(item => ({
                    url: null, // Sarà popolato dopo
                    name: item.name,
                    ref: item
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

            // Ottieni URL per ogni foto
            for (let i = 0; i < photos.length; i++) {
                try {
                    photos[i].url = await photos[i].ref.getDownloadURL();
                } catch (e) {
                    console.error('Errore ottenendo URL per', photos[i].name, e);
                }
            }

            allUsersData[userName] = {
                name: userName,
                photos: photos.filter(p => p.url), // Solo foto con URL valido
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
        const photoCount = userData.photos ? userData.photos.length : 0;

        const card = document.createElement('div');
        card.className = 'user-card';
        card.innerHTML = `
            <div class="user-card-content">
                <h3>${userName}</h3>
                <p class="photo-count">${photoCount} ${photoCount === 1 ? 'foto' : 'foto'}</p>
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

    galleryTitle.textContent = `Foto con ${userName}`;
    galleryPhotos.innerHTML = '';

    // Mostra messaggio se presente
    if (userData.message) {
        galleryMessage.textContent = `"${userData.message}"`;
        galleryMessage.style.display = 'block';
    } else {
        galleryMessage.style.display = 'none';
    }

    // Mostra foto
    if (userData.photos && userData.photos.length > 0) {
        userData.photos.forEach((photo, index) => {
            const photoItem = document.createElement('div');
            photoItem.className = 'gallery-photo-item';
            photoItem.innerHTML = `
                <img src="${photo.url}" alt="Foto ${index + 1}" loading="lazy">
            `;
            galleryPhotos.appendChild(photoItem);
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
    // Prepara array di tutte le foto raggruppate per persona
    const slideshowData = [];

    Object.keys(allUsersData).forEach(userName => {
        const userData = allUsersData[userName];

        if (userData.photos && userData.photos.length > 0) {
            const message = userData.message || '';

            userData.photos.forEach(photo => {
                slideshowData.push({
                    url: photo.url,
                    userName: userName,
                    message: message
                });
            });
        }
    });

    if (slideshowData.length === 0) {
        alert('Nessuna foto disponibile per lo slideshow!');
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
        intervalId: null
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

    const slide = currentSlideshow.photos[index];
    const slideshowImage = document.getElementById('slideshowImage');
    const slideshowUserName = document.getElementById('slideshowUserName');
    const slideshowMessage = document.getElementById('slideshowMessage');
    const slideshowProgress = document.getElementById('slideshowProgress');

    slideshowImage.src = slide.url;
    slideshowUserName.textContent = `Foto con ${slide.userName}`;

    if (slide.message) {
        slideshowMessage.textContent = `"${slide.message}"`;
        slideshowMessage.style.display = 'block';
    } else {
        slideshowMessage.style.display = 'none';
    }

    // Aggiorna progress bar
    const progress = ((index + 1) / currentSlideshow.photos.length) * 100;
    slideshowProgress.value = progress;

    // Aggiorna indicatore foto
    const slideCounter = document.getElementById('slideCounter');
    if (slideCounter) {
        slideCounter.textContent = `${index + 1} / ${currentSlideshow.photos.length}`;
    }
}

// Avvia autoplay slideshow
function startSlideshowAutoPlay() {
    if (!currentSlideshow || !currentSlideshow.isPlaying) return;

    // Cambia slide ogni 5 secondi
    currentSlideshow.intervalId = setInterval(() => {
        if (currentSlideshow.isPlaying) {
            currentSlideshow.currentIndex++;
            if (currentSlideshow.currentIndex >= currentSlideshow.photos.length) {
                currentSlideshow.currentIndex = 0; // Loop
            }
            displaySlide(currentSlideshow.currentIndex);
        }
    }, 5000);
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
}

// Toggle play/pause slideshow
function toggleSlideshow() {
    if (!currentSlideshow) return;

    currentSlideshow.isPlaying = !currentSlideshow.isPlaying;
    const playPauseBtn = document.getElementById('playPauseBtn');

    if (currentSlideshow.isPlaying) {
        playPauseBtn.textContent = '⏸️ Pausa';
        startSlideshowAutoPlay();
    } else {
        playPauseBtn.textContent = '▶️ Play';
        stopSlideshowAutoPlay();
    }
}

// Chiudi slideshow
function closeSlideshow() {
    const slideshowModal = document.getElementById('slideshowModal');
    slideshowModal.style.display = 'none';

    stopSlideshowAutoPlay();

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
