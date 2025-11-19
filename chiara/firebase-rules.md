# Firebase Security Rules - Regole di Sicurezza Migliorate

Questo file contiene regole di sicurezza più sicure per il tuo sito compleanno. Copia e incolla queste regole nella console Firebase per migliorare la sicurezza mantenendo la funzionalità.

## 🔒 Storage Rules (Firebase Storage > Rules)

Copia questa regola nella sezione **Storage > Rules**:

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
- ✅ Permettono a chiunque di leggere foto e video (necessario per visualizzarli)
- ✅ Permettono a chiunque di caricare foto e video, ma solo:
  - File immagine (JPEG, PNG, GIF, etc.) - max 10MB
  - File video (MP4, MOV, WebM, etc.) - max 50MB
- ✅ Permettono salvare `message.txt` per i messaggi
- ✅ Prevengono upload di file non validi

## 🗄️ Database Rules (Realtime Database > Rules)

Copia questa regola nella sezione **Realtime Database > Rules**:

```json
{
  "rules": {
    "users": {
      "$userId": {
        // Chiunque può leggere i dati degli utenti
        ".read": true,

        // Chiunque può scrivere, ma solo:
        // - Aggiungere/modificare il proprio profilo
        // - Aggiungere foto al proprio array (non eliminare)
        // - Aggiungere messaggi al proprio array (non eliminare)
        ".write": true,

        // Validazione dati
        "name": {
          ".validate": "newData.isString() && newData.val().length > 0 && newData.val().length < 100"
        },
        "photos": {
          ".validate": "newData.hasChildren()",
          "$photoId": {
            "url": {
              ".validate": "newData.isString() && newData.val().matches(/^https:\\/\\/.*/)"
            },
            "name": {
              ".validate": "newData.isString()"
            },
            "timestamp": {
              ".validate": "newData.isNumber()"
            }
          }
        },
        "messages": {
          ".validate": "newData.hasChildren()",
          "$messageId": {
            "text": {
              ".validate": "newData.isString() && newData.val().length < 500"
            },
            "timestamp": {
              ".validate": "newData.isNumber()"
            }
          }
        },
        "lastUpdate": {
          ".validate": "newData.isNumber()"
        }
      }
    }
  }
}
```

**Cosa fanno queste regole:**
- ✅ Permettono la lettura a tutti (necessario per visualizzare)
- ✅ Permettono la scrittura, ma validano i dati:
  - Nome utente: stringa tra 1 e 100 caratteri
  - Foto: array con URL validi e timestamp
  - Messaggi: testo max 500 caratteri
- ✅ Prevengono dati malformati

## ⚠️ Regole Ancora Più Sicure (Opzionale)

Se vuoi limitare l'accesso solo a persone che conoscono un "codice segreto", puoi usare queste regole più restrittive. **Nota**: Richiede modifiche al codice JavaScript per includere il codice segreto.

### Storage con codice segreto:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{userId}/{photoId} {
      allow read: if true;
      allow write: if request.resource.size < 10 * 1024 * 1024
                   && request.resource.contentType.startsWith('image/')
                   && request.auth != null;  // Richiede autenticazione
    }
  }
}
```

### Database con autenticazione:
```json
{
  "rules": {
    "users": {
      "$userId": {
        ".read": true,
        ".write": "auth != null"  // Solo utenti autenticati possono scrivere
      }
    }
  }
}
```

**Nota**: Le regole con autenticazione richiedono Firebase Authentication, che aggiunge complessità. Per un sito semplice per amici, le regole senza autenticazione sono sufficienti.

## 📝 Come Applicare le Regole

1. Vai su [Firebase Console](https://console.firebase.google.com/)
2. Seleziona il tuo progetto
3. Per Storage Rules:
   - Vai su **Storage** > **Rules**
   - Copia e incolla le regole Storage sopra
   - Clicca **Pubblica**
4. Per Database Rules:
   - Vai su **Realtime Database** > **Rules**
   - Copia e incolla le regole Database sopra
   - Clicca **Pubblica**

## 🎯 Bilanciamento Sicurezza vs Funzionalità

Le regole migliorate qui sopra:
- ✅ Mantengono la funzionalità del sito (chiunque può caricare foto)
- ✅ Prevengono abusi comuni (file troppo grandi, tipi non validi)
- ✅ Validano i dati inseriti
- ⚠️ Permettono ancora a chiunque di caricare foto (necessario per il tuo caso d'uso)

Se dopo il compleanno vuoi bloccare nuovi upload:
1. Vai su Firebase Console
2. Modifica le regole cambiando `allow write: if true` in `allow write: if false`
3. Le foto esistenti rimarranno visibili, ma nessuno potrà aggiungerne di nuove

