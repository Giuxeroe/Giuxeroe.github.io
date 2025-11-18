// Upload Foto - Gestione caricamento foto su Firebase

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const nameInput = document.getElementById('friendName');
    const photoInput = document.getElementById('photos');
    const messageInput = document.getElementById('message');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressBar = document.getElementById('progressBar');
    const statusMessage = document.getElementById('statusMessage');
    const previewContainer = document.getElementById('previewContainer');

    // Preview foto selezionate
    photoInput.addEventListener('change', function(e) {
        previewContainer.innerHTML = '';
        const files = Array.from(e.target.files);

        files.forEach((file, index) => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.className = 'photo-preview';
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <span>${file.name}</span>
                    `;
                    previewContainer.appendChild(preview);
                };
                reader.readAsDataURL(file);
            }
        });
    });

    // Gestione submit form
    uploadForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const friendName = nameInput.value.trim();
        const message = messageInput.value.trim();
        const photos = Array.from(photoInput.files);

        if (!friendName) {
            showStatus('Inserisci il tuo nome!', 'error');
            return;
        }

        if (photos.length === 0) {
            showStatus('Seleziona almeno una foto!', 'error');
            return;
        }

        // Disabilita il bottone durante l'upload
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Caricamento in corso...';
        progressBar.style.display = 'block';
        progressBar.value = 0;

        try {
            const timestamp = Date.now();
            const uploadPromises = [];
            const photoUrls = [];

            // Upload ogni foto
            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];
                const photoId = `${timestamp}_${i}_${photo.name}`;
                const storageRef = storage.ref(`photos/${friendName}/${photoId}`);

                const uploadTask = storageRef.put(photo);

                uploadPromises.push(
                    new Promise((resolve, reject) => {
                        uploadTask.on(
                            'state_changed',
                            (snapshot) => {
                                // Aggiorna progress bar
                                const progress = ((i + snapshot.bytesTransferred / snapshot.totalBytes) / photos.length) * 100;
                                progressBar.value = progress;
                            },
                            (error) => {
                                console.error('Errore upload:', error);
                                reject(error);
                            },
                            async () => {
                                // Upload completato, ottieni URL
                                const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                                photoUrls.push({
                                    url: downloadURL,
                                    name: photo.name
                                });
                                resolve();
                            }
                        );
                    })
                );
            }

            // Aspetta che tutti gli upload siano completati
            await Promise.all(uploadPromises);

            // Salva metadati nel database
            const userRef = database.ref(`users/${friendName}`);
            const userData = await userRef.once('value');
            const existingData = userData.val() || { photos: [], messages: [] };

            // Aggiungi nuove foto
            photoUrls.forEach(photoData => {
                existingData.photos.push({
                    url: photoData.url,
                    name: photoData.name,
                    timestamp: timestamp
                });
            });

            // Aggiungi messaggio se presente
            if (message) {
                existingData.messages.push({
                    text: message,
                    timestamp: timestamp
                });
            }

            // Salva nome utente
            existingData.name = friendName;
            existingData.lastUpdate = timestamp;

            await userRef.set(existingData);

            // Successo!
            showStatus(`Perfetto! ${photos.length} foto caricate con successo! 🎉`, 'success');
            progressBar.value = 100;

            // Reset form dopo 2 secondi
            setTimeout(() => {
                uploadForm.reset();
                previewContainer.innerHTML = '';
                progressBar.style.display = 'none';
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Carica Foto';
                showStatus('', '');
            }, 3000);

        } catch (error) {
            console.error('Errore:', error);
            showStatus('Errore durante il caricamento. Riprova!', 'error');
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Carica Foto';
            progressBar.style.display = 'none';
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = message ? 'block' : 'none';
    }
});

