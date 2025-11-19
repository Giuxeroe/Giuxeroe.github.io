// Main JavaScript - Gestione gallerie e slideshow

let allUsersData = {};
let currentSlideshow = null;
let backgroundMusic = null;

document.addEventListener('DOMContentLoaded', function() {
    // Carica dati utenti dal database
    loadUsersData();

    // Setup musica di sottofondo
    setupBackgroundMusic();

    // Setup controlli slideshow
    setupSlideshowControls();
});

// Carica tutti i dati degli utenti dal database
function loadUsersData() {
    const usersRef = database.ref('users');

    usersRef.on('value', (snapshot) => {
        allUsersData = snapshot.val() || {};
        renderUserCards();
    });
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

        // Converti photos in array se è un oggetto
        let photos = userData.photos || [];
        if (!Array.isArray(photos)) {
            photos = Object.values(photos);
        }
        const photoCount = photos.length;

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

    // Converti messages in array se è un oggetto
    let messages = userData.messages || [];
    if (!Array.isArray(messages)) {
        messages = Object.values(messages);
    }

    // Mostra messaggi se presenti
    if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        galleryMessage.textContent = `"${lastMessage.text}"`;
        galleryMessage.style.display = 'block';
    } else {
        galleryMessage.style.display = 'none';
    }

    // Converti photos in array se è un oggetto
    let photos = userData.photos || [];
    if (!Array.isArray(photos)) {
        photos = Object.values(photos);
    }

    // Mostra foto
    if (photos.length > 0) {
        photos.forEach((photo, index) => {
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

        // Converti photos in array se è un oggetto
        let photos = userData.photos || [];
        if (!Array.isArray(photos)) {
            photos = Object.values(photos);
        }

        if (photos.length > 0) {
            // Converti messages in array se è un oggetto
            let messages = userData.messages || [];
            if (!Array.isArray(messages)) {
                messages = Object.values(messages);
            }

            const lastMessage = messages.length > 0 ? messages[messages.length - 1].text : '';

            photos.forEach(photo => {
                slideshowData.push({
                    url: photo.url,
                    userName: userName,
                    message: lastMessage
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

