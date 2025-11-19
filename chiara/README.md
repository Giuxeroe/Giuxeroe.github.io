# Sito Compleanno - Galleria Foto Interattiva

Un sito web interattivo per celebrare il compleanno con foto caricate dagli amici, slideshow automatico e musica di sottofondo.

**Nota**: Questo sito usa solo Firebase Storage (non serve Realtime Database). Le foto sono organizzate in cartelle per persona.

## 🚀 Setup Firebase

### 1. Crea un progetto Firebase

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Clicca su "Aggiungi progetto" o "Add project"
3. Inserisci un nome per il progetto (es: "birthday-photos-2024")
4. Segui la procedura guidata (disabilita Google Analytics se non necessario)

### 2. Abilita Firebase Storage

1. Nel menu laterale, vai su **Storage**
2. Clicca su "Inizia" o "Get started"
3. Scegli "Inizia in modalità test" (per iniziare rapidamente)
4. Scegli una location per il tuo storage (es: europe-west)

**⚠️ IMPORTANTE**: Non serve abilitare Realtime Database! Il sito usa solo Storage.

### 3. Configura le regole di sicurezza Storage

⚠️ **IMPORTANTE**: Firebase ti avviserà che le regole sono pubbliche. Questo è normale per il funzionamento del sito.

**Storage Rules (Storage > Rules)** - Copia e incolla questo:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      // Tutti possono leggere
      allow read: if true;

      // Chiunque può caricare foto e video, ma con limitazioni:
      // - Foto: max 10MB
      // - Video: max 50MB
      // - Solo file immagine o video
      allow write: if request.resource.size < 50 * 1024 * 1024
                   && (request.resource.contentType.startsWith('image/')
                       || request.resource.contentType.startsWith('video/'));

      // Permetti anche message.txt
      match /photos/{userId}/message.txt {
        allow read: if true;
        allow write: if request.resource.size < 10240; // Max 10KB per messaggio
      }
    }
  }
}
```

**Cosa fanno queste regole:**
- ✅ Permettono lettura a tutti (necessario per visualizzare)
- ✅ Permettono upload di immagini < 10MB e video < 50MB
- ✅ Supportano tutti i formati video comuni (MP4, MOV, WebM, AVI, ecc.)
- ✅ Permettono salvare `message.txt` per i messaggi
- ✅ Mantengono la funzionalità (chiunque può caricare foto e video)

**Nota**: L'avviso di sicurezza di Firebase è normale. Le regole devono essere pubbliche per permettere agli amici di caricare foto senza autenticazione.

### 4. Ottieni le credenziali Firebase

1. Vai su **Project Settings** (icona ingranaggio in alto a sinistra)
2. Scorri fino a "Your apps"
3. Clicca sull'icona web `</>`
4. Inserisci un nickname per l'app (es: "Birthday Site")
5. **IMPORTANTE**: Quando ti chiede se vuoi usare Firebase Hosting, seleziona **"Use a &lt;script&gt; tag"** (NON "Use npm")
   - ⚠️ **NON** abilitare Firebase Hosting - stiamo usando GitHub Pages per l'hosting
   - Firebase Hosting è un servizio separato che NON serve per questo progetto
6. Copia il codice di configurazione che appare (il blocco `firebaseConfig`)

### 5. Configura il sito

1. Apri `assets/js/firebase-config.js`
2. Sostituisci tutti i valori `YOUR_*` con quelli copiati dalla console Firebase:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 6. Firebase SDK

Il sito usa Firebase SDK tramite CDN (già incluso negli HTML). Solo Storage SDK è necessario (non Database).

## 📁 Struttura File

```
chiara/
├── index.html              # Pagina principale con gallerie
├── upload.html             # Pagina per caricare foto
├── assets/
│   ├── css/
│   │   └── style.css       # Stili del sito
│   ├── js/
│   │   ├── firebase-config.js  # Configurazione Firebase
│   │   ├── main.js         # Logica principale e slideshow
│   │   └── upload.js       # Logica upload foto
│   └── music/
│       └── background.mp3  # Musica di sottofondo (aggiungi il tuo file)
├── firebase-rules.md       # Regole di sicurezza Firebase
└── README.md
```

## 🎵 Aggiungi Musica

1. Metti il tuo file MP3 in `assets/music/background.mp3`
2. Oppure modifica il percorso in `main.js` se usi un file diverso

## 🌐 Deploy su GitHub Pages

1. Fai commit di tutti i file:
   ```bash
   git add .
   git commit -m "Aggiunto sito compleanno"
   git push origin main
   ```

2. Vai su GitHub > Settings > Pages
3. Scegli branch `main` e cartella `/chiara`
4. Il sito sarà disponibile su `https://Giuxeroe.github.io/chiara`

## 📱 Come Usare

### Per gli amici (caricare foto e video):
1. Vai su `Giuxeroe.github.io/chiara/upload.html`
2. Inserisci il tuo nome
3. Seleziona una o più foto e/o video (puoi mescolarli insieme)
4. Aggiungi un messaggio/dedica (opzionale)
5. Clicca "Carica File"

### Per visualizzare:
1. Vai su `Giuxeroe.github.io/chiara`
2. Clicca su una card per vedere le foto e video di quella persona
3. Clicca "Avvia Slideshow Completo" per vedere tutte le foto e video in sequenza con musica
   - Le foto vengono mostrate per 5 secondi
   - I video partono automaticamente e passano alla slide successiva quando finiscono

## 🎥 Supporto Video

Il sito supporta sia foto che video:

**Formati video supportati:**
- MP4 (consigliato - compatibilità migliore)
- MOV, WebM, AVI, MKV, FLV, WMV, M4V

**Limitazioni:**
- Foto: massimo 10MB per file
- Video: massimo 50MB per file
- Puoi caricare foto e video insieme nello stesso upload

**Comportamento nello slideshow:**
- Foto: mostrate per 5 secondi, poi passa automaticamente alla successiva
- Video: riproduzione automatica, passa alla slide successiva quando il video finisce
- Puoi usare i controlli per navigare manualmente (precedente/successiva, play/pause)

**Note browser:**
- I video MP4 sono supportati da tutti i browser moderni
- Alcuni browser potrebbero richiedere interazione utente prima di riprodurre video automaticamente

## 🎨 Personalizzazione

- Modifica i colori in `assets/css/style.css`
- Cambia il messaggio di benvenuto in `index.html`
- Aggiungi più funzionalità modificando i file JavaScript

## ⚠️ Note Importanti

- Firebase Storage gratuito: 5GB di storage, 1GB di download/giorno
- **Non serve Realtime Database** - il sito usa solo Storage
- Per sicurezza, considera di limitare l'accesso dopo il compleanno modificando le regole Firebase (cambia `allow write: if ...` in `allow write: if false`)

## 🐛 Troubleshooting

**Le foto non si caricano?**
- Controlla che le credenziali Firebase siano corrette in `firebase-config.js`
- Verifica le regole di Storage nel Firebase Console
- Assicurati che Storage sia abilitato nel progetto Firebase

**Le foto non appaiono nella galleria?**
- Controlla la console del browser per errori (F12)
- Verifica che le foto siano state caricate correttamente in Storage
- Assicurati che le regole Storage permettano la lettura (`allow read: if true`)

**La musica non parte?**
- Assicurati che il file MP3 esista in `assets/music/background.mp3`
- Alcuni browser bloccano l'autoplay audio - l'utente deve interagire prima (cliccare play)

**Il messaggio non viene salvato?**
- Verifica che le regole Storage permettano di salvare `message.txt`
- Controlla che il messaggio non superi 10KB

**I video non si caricano?**
- Verifica che il video non superi 50MB
- Controlla che il formato video sia supportato (MP4 consigliato)
- Verifica le regole Storage permettono upload video (`video/*`)

**I video non partono nello slideshow?**
- Alcuni browser bloccano l'autoplay video - potrebbe essere necessario cliccare play manualmente
- Assicurati che il formato video sia compatibile con il browser (MP4 è il più compatibile)

