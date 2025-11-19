<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 5a344ebb-cc75-4006-b468-b14b1ce488ce -->
# Fix Firebase Storage Rules for Video Upload

## Problem

The current Firebase Storage rules have two issues:

1. Nested `match /photos/{userId}/message.txt` inside `match /photos/{allPaths=**}` causes path conflicts
2. The rules only allow `image/*` and `video/*` content types, but `message.txt` is `text/plain`, so it gets rejected

## Solution

Update `chiara/firebase-rules.md` to use a single, simplified rule that allows:

- Images up to 10MB
- Videos up to 50MB  
- Text files (message.txt) up to 10KB

Replace the Storage Rules section (lines 10-33) with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{allPaths=**} {
      // Tutti possono leggere
      allow read: if true;

      // Chiunque può caricare foto, video e messaggi
      allow write: if (
        // Immagini: max 10MB
        (request.resource.contentType.startsWith('image/') && request.resource.size < 10 * 1024 * 1024)
        ||
        // Video: max 50MB
        (request.resource.contentType.startsWith('video/') && request.resource.size < 50 * 1024 * 1024)
        ||
        // File di testo (message.txt): max 10KB
        (request.resource.contentType.startsWith('text/') && request.resource.size < 10240)
      );
    }
  }
}
```

Also update `chiara/README.md` Firebase Storage rules section (around line 110-140) with the same corrected rules.

## User Action Required

After the files are updated, the user must manually apply these rules in Firebase Console:

1. Go to Firebase Console > Storage > Rules
2. Copy and paste the new rules
3. Click "Publish"

### To-dos

- [ ] Aggiungere slider velocità in index.html
- [ ] Implementare controllo velocità e messaggio sempre visibile
- [ ] Stilizzare slider e migliorare layout