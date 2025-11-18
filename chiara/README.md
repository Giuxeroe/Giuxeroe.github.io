# Sito Compleanno - Galleria Foto Interattiva

Un sito web interattivo per celebrare il compleanno con foto caricate dagli amici, slideshow automatico e musica di sottofondo.

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

### 3. Abilita Realtime Database

1. Nel menu laterale, vai su **Realtime Database**
2. Clicca su "Crea database"
3. Scegli "Inizia in modalità test" (per iniziare rapidamente)
4. Scegli una location (preferibilmente la stessa dello Storage)

### 4. Configura le regole di sicurezza

⚠️ **IMPORTANTE**: Firebase ti avviserà che le regole sono pubbliche. Questo è normale per il funzionamento del sito, ma possiamo migliorare la sicurezza.

#### Opzione A: Regole Base (Funzionano subito, meno sicure)
Per iniziare rapidamente, usa queste regole semplici:

**Storage Rules (Storage > Rules)**
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

**Database Rules (Realtime Database > Rules)**
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

#### Opzione B: Regole Migliorate (Consigliate - Più sicure)
Per una sicurezza migliore mantenendo la funzionalità, usa le regole nel file `firebase-rules.md`:

1. Apri il file `firebase-rules.md` nella root del progetto
2. Copia le regole Storage e incollale in **Storage > Rules**
3. Copia le regole Database e incollale in **Realtime Database > Rules**
4. Clicca **Pubblica** per entrambe

**Cosa migliorano le regole avanzate:**
- ✅ Limitano la dimensione dei file (max 10MB)
- ✅ Permettono solo file immagine
- ✅ Validano i dati inseriti nel database
- ✅ Prevengono dati malformati
- ✅ Mantengono la funzionalità (chiunque può ancora caricare foto)

**Nota**: L'avviso di sicurezza di Firebase è normale. Le regole devono essere pubbliche per permettere agli amici di caricare foto senza autenticazione. Le regole migliorate limitano comunque gli abusi.

### 5. Ottieni le credenziali Firebase

1. Vai su **Project Settings** (icona ingranaggio in alto a sinistra)
2. Scorri fino a "Your apps"
3. Clicca sull'icona web `</>`
4. Inserisci un nickname per l'app (es: "Birthday Site")
5. **IMPORTANTE**: Quando ti chiede se vuoi usare Firebase Hosting, seleziona **"Use a &lt;script&gt; tag"** (NON "Use npm")
   - ⚠️ **NON** abilitare Firebase Hosting - stiamo usando GitHub Pages per l'hosting
   - Firebase Hosting è un servizio separato che NON serve per questo progetto
6. Copia il codice di configurazione che appare (il blocco `firebaseConfig`)

### 6. Configura il sito

1. Apri `assets/js/firebase-config.js`
2. Sostituisci tutti i valori `YOUR_*` con quelli copiati dalla console Firebase:
   - `apiKey`
   - `authDomain`
   - `databaseURL`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

### 7. Aggiungi Firebase SDK

Il sito usa Firebase SDK tramite CDN (già incluso negli HTML). Se preferisci, puoi installarlo via npm, ma per GitHub Pages il CDN è più semplice.

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

### Per gli amici (caricare foto):
1. Vai su `Giuxeroe.github.io/chiara/upload.html`
2. Inserisci il tuo nome
3. Seleziona una o più foto
4. Aggiungi un messaggio/dedica (opzionale)
5. Clicca "Carica Foto"

### Per visualizzare:
1. Vai su `Giuxeroe.github.io/chiara`
2. Clicca su una card per vedere le foto di quella persona
3. Clicca "Avvia Slideshow Completo" per vedere tutte le foto in sequenza con musica

## 🎨 Personalizzazione

- Modifica i colori in `assets/css/style.css`
- Cambia il messaggio di benvenuto in `index.html`
- Aggiungi più funzionalità modificando i file JavaScript

## ⚠️ Note Importanti

- Firebase Storage gratuito: 5GB di storage, 1GB di download/giorno
- Firebase Realtime Database gratuito: 1GB di storage, 10GB di trasferimento/mese
- Per sicurezza, considera di limitare l'accesso dopo il compleanno modificando le regole Firebase

## 🐛 Troubleshooting

**Le foto non si caricano?**
- Controlla che le credenziali Firebase siano corrette
- Verifica le regole di Storage nel Firebase Console

**Il database non funziona?**
- Controlla che Realtime Database sia abilitato
- Verifica le regole del database

**La musica non parte?**
- Assicurati che il file MP3 esista in `assets/music/`
- Alcuni browser bloccano l'autoplay audio - l'utente deve interagire prima

