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
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

**Cosa fanno queste regole:**
- ✅ Permettono a chiunque di leggere e scrivere qualsiasi file
- ✅ Semplice e funzionale per un sito tra amici
- ✅ Supporta foto, video e messaggi senza restrizioni
- ⚠️ Perfetto per il tuo caso d'uso (compleanno con amici)

**Nota**: L'avviso di sicurezza di Firebase è normale. Le regole devono essere pubbliche per permettere agli amici di caricare foto senza autenticazione. Se dopo il compleanno vuoi bloccare nuovi upload, cambia `allow read, write: if true;` in `allow read: if true; allow write: if false;`

### 3.5. Configura CORS per i messaggi (IMPORTANTE)

Per permettere la lettura dei file `message.txt` da GitHub Pages, devi configurare CORS su Firebase Storage usando **Google Cloud Shell** (il modo più semplice - tutto già installato):

#### Usando Google Cloud Shell (CONSIGLIATO)

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Seleziona il tuo progetto Firebase (es: "compleanno-chiara")
3. **Apri Cloud Shell**: Clicca sull'icona del terminale in alto a destra (icona `>_`)
   - Cloud Shell si apre in basso nella pagina
   - È già autenticato e ha gsutil pre-installato!

4. **Crea il file CORS** nel Cloud Shell:
   ```bash
   cat > cors.json << 'EOF'
   [
     {
       "origin": ["https://giuxeroe.github.io"],
       "method": ["GET"],
       "maxAgeSeconds": 3600
     }
   ]
   EOF
   ```

5. **Applica la configurazione CORS**:
   ```bash
   gsutil cors set cors.json gs://compleanno-chiara.firebasestorage.app
   ```
   ⚠️ **Sostituisci** `compleanno-chiara.firebasestorage.app` con il tuo storage bucket se diverso

6. **Verifica che sia applicato**:
   ```bash
   gsutil cors get gs://compleanno-chiara.firebasestorage.app
   ```
   Dovresti vedere il JSON con la configurazione CORS.

**Nota**: Se il tuo dominio GitHub Pages è diverso da `https://giuxeroe.github.io`, modifica l'URL nel file JSON al passo 4.

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

**I messaggi mostrano "Nessun messaggio" anche se esistono?**
- Questo è un problema di CORS (Cross-Origin Resource Sharing)
- Configura CORS per Firebase Storage usando il file `cors.json` nella root del progetto:
  1. Installa Google Cloud SDK se non l'hai già fatto
  2. Esegui: `gsutil cors set cors.json gs://compleanno-chiara.firebasestorage.app`
  3. Sostituisci `compleanno-chiara.firebasestorage.app` con il tuo storage bucket se diverso

**I video non si caricano?**
- Verifica che il video non superi 50MB
- Controlla che il formato video sia supportato (MP4 consigliato)
- Verifica le regole Storage permettono upload video (`video/*`)

**I video non partono nello slideshow?**
- Alcuni browser bloccano l'autoplay video - potrebbe essere necessario cliccare play manualmente
- Assicurati che il formato video sia compatibile con il browser (MP4 è il più compatibile)

