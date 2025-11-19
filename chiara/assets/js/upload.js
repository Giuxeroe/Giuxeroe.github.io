// Upload Foto e Video - Gestione caricamento su Firebase Storage

document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const nameInput = document.getElementById('friendName');
    const photoInput = document.getElementById('photos');
    const messageInput = document.getElementById('message');
    const uploadBtn = document.getElementById('uploadBtn');
    const progressBar = document.getElementById('progressBar');
    const statusMessage = document.getElementById('statusMessage');
    const previewContainer = document.getElementById('previewContainer');

    // Preview file selezionati (foto e video)
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
            } else if (file.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.createElement('div');
                    preview.className = 'photo-preview';
                    preview.innerHTML = `
                        <video src="${e.target.result}" controls style="width: 100%; height: 150px; object-fit: cover;"></video>
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
        const files = Array.from(photoInput.files);

        if (!friendName) {
            showStatus('Inserisci il tuo nome!', 'error');
            return;
        }

        if (files.length === 0) {
            showStatus('Seleziona almeno un file!', 'error');
            return;
        }

        // Valida dimensione file
        const maxSize = 50 * 1024 * 1024; // 50MB
        const invalidFiles = files.filter(file => file.size > maxSize);
        if (invalidFiles.length > 0) {
            showStatus(`Alcuni file superano 50MB: ${invalidFiles.map(f => f.name).join(', ')}`, 'error');
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

            // Upload ogni file (foto o video)
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileId = `${timestamp}_${i}_${file.name}`;
                const storageRef = storage.ref(`photos/${friendName}/${fileId}`);

                const uploadTask = storageRef.put(file);

                uploadPromises.push(
                    new Promise((resolve, reject) => {
                        uploadTask.on(
                            'state_changed',
                            (snapshot) => {
                                // Aggiorna progress bar
                                const progress = ((i + snapshot.bytesTransferred / snapshot.totalBytes) / files.length) * 100;
                                progressBar.value = progress;
                            },
                            (error) => {
                                console.error('Errore upload:', error);
                                reject(error);
                            },
                            () => {
                                resolve();
                            }
                        );
                    })
                );
            }

            // Aspetta che tutti gli upload siano completati
            await Promise.all(uploadPromises);

            // Salva messaggio se presente
            if (message) {
                const messageRef = storage.ref(`photos/${friendName}/message.txt`);
                const messageBlob = new Blob([message], { type: 'text/plain' });
                await messageRef.put(messageBlob);
            }

            // Successo!
            const photoCount = files.filter(f => f.type.startsWith('image/')).length;
            const videoCount = files.filter(f => f.type.startsWith('video/')).length;
            let successMsg = `Perfetto! `;
            if (photoCount > 0 && videoCount > 0) {
                successMsg += `${photoCount} ${photoCount === 1 ? 'foto' : 'foto'} e ${videoCount} ${videoCount === 1 ? 'video' : 'video'} caricati con successo! 🎉`;
            } else if (photoCount > 0) {
                successMsg += `${photoCount} ${photoCount === 1 ? 'foto' : 'foto'} caricata con successo! 🎉`;
            } else {
                successMsg += `${videoCount} ${videoCount === 1 ? 'video' : 'video'} caricato con successo! 🎉`;
            }
            showStatus(successMsg, 'success');
            progressBar.value = 100;

            // Reset form dopo 3 secondi
            setTimeout(() => {
                uploadForm.reset();
                previewContainer.innerHTML = '';
                progressBar.style.display = 'none';
                uploadBtn.disabled = false;
                uploadBtn.textContent = 'Carica File';
                showStatus('', '');
            }, 3000);

        } catch (error) {
            console.error('Errore:', error);
            showStatus('Errore durante il caricamento. Riprova!', 'error');
            uploadBtn.disabled = false;
            uploadBtn.textContent = 'Carica File';
            progressBar.style.display = 'none';
        }
    });

    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type}`;
        statusMessage.style.display = message ? 'block' : 'none';
    }
});
