# Deep Web Mining Collective - Quick Start Guide

Guida rapida per avviare l'ARG e testare tutte le funzionalità.

## 🚀 Avvio Rapido (5 minuti)

### 1. Setup Server
```bash
# Opzione A: Python
python -m http.server 8000

# Opzione B: Node.js
npx serve .

# Opzione C: PHP
php -S localhost:8000
```

### 2. Test delle Fasi

**Homepage Corrotta**
- Vai su `http://localhost:8000`
- Password: `SURFACE_BREACH_2024`
- Cerca il testo nascosto con opacity 0.1

**Fase Surface**
- Accedi a `phases/surface/entry-point.html`
- Clicca sui 3 indizi per completare la fase
- Monitora la barra di progresso

**Fase Breach**
- Vai su `phases/breach/terminal.html`
- Comandi da testare:
  - `help` - Lista comandi
  - `netstat` - Stato rete
  - `crack passwords.enc` - Cracking password
  - `scan network` - Scansione rete

**Fase Deep Web**
- IRC Chat: `phases/deep/irc-chat.html`
  - Comandi: `/help`, `/decrypt IRC_DEEP_KEY_2024`
- Database: `phases/deep/missing-persons.html`
  - Clicca sui profili per dettagli
- Streams: `phases/deep/live-streams.html`
  - Clicca sui video per tracciare coordinate

**Fase Finale**
- Red Room: `phases/red-room/final-access.html`
- Revelation: `phases/red-room/revelation.html`

### 3. Generazione QR Codes
```
http://localhost:8000/qr-generator.html
```
- Seleziona fase
- Clicca "Generate Phase QR Codes"
- Download immagini per Minecraft

## 🎮 Test Rapido Completo

### Debug Console Commands
Apri la console del browser (F12) e testa:

```javascript
// Sblocca tutte le fasi
debugUnlockAll();

// Mostra progresso
progressTracker.debugShowProgress();

// Effetti speciali
glitchEffects.intensifyGlitches();

// Reset completo
progressTracker.debugResetProgress();
```

### Konami Code
Sequenza: ↑↑↓↓←→←→BA per modalità debug

### Test Password
- Homepage: `SURFACE_BREACH_2024`
- Terminal: `TERMINAL_ACCESS_7791`
- Deep Web: `DEEP_WEB_MINING_COLLECTIVE`
- IRC: `IRC_DEEP_KEY_2024`

## 📱 Test Responsività

### Desktop (Ottimale)
- Risoluzione: 1920x1080+
- Browser: Chrome/Firefox latest

### Tablet
- Risoluzione: 1024x768+
- Layout si adatta automaticamente

### Mobile
- Risoluzione: 375x667+
- Funzionalità ridotte ma funzionali

## 🔊 Test Audio (Opzionale)

I file audio sono placeholder. Per test completo:

1. Sostituisci i file in `assets/sounds/`
2. Testa su ogni pagina:
   - Click = typing sound
   - Errore = error sound
   - Successo = success sound
   - Allarme = alert sound

## 🎯 Checklist Pre-Launch

### Funzionalità Core
- [ ] Homepage glitch effects funzionano
- [ ] Sistema password accetta codici corretti
- [ ] Progress tracking salva in localStorage
- [ ] Terminal simulator risponde ai comandi
- [ ] QR generator crea codici validi
- [ ] Tutte le fasi si sbloccano in sequenza

### Visual Effects
- [ ] Animazioni CSS funzionano smooth
- [ ] Glitch effects si attivano correttamente
- [ ] Responsive design su mobile/tablet
- [ ] Font monospace caricano correttamente

### User Experience
- [ ] Navigazione intuitiva tra fasi
- [ ] Feedback visivo per azioni utente
- [ ] Messaggi di errore chiari
- [ ] Loading states appropriati

## 🐛 Troubleshooting Comuni

### "LocalStorage non funziona"
**Causa**: File:// protocol
**Soluzione**: Usa HTTP server

### "QR codes non si generano"
**Causa**: Libreria non caricata
**Soluzione**: Verifica connessione internet

### "Console errors"
**Causa**: Paths relativi sbagliati
**Soluzione**: Verifica struttura directory

### "Styles non caricano"
**Causa**: CSS paths incorretti
**Soluzione**: Controlla link href in HTML

## 🎪 Demo Mode

Per dimostrazioni rapide:

```javascript
// Auto-complete tutte le fasi (console)
['surface', 'breach', 'deep'].forEach(phase => {
    progressTracker.debugUnlockPhase(phase);
});

// Mostra tutti gli effetti
setInterval(() => {
    glitchEffects.triggerScreenGlitch();
}, 2000);
```

## 📊 Analytics & Monitoring

### Progress Monitoring
```javascript
// Vedi progresso corrente
console.log(localStorage.getItem('dwmc_progress'));

// Vedi tutti gli storage keys
Object.keys(localStorage).filter(k => k.includes('dwmc'));
```

### Performance
- Monitora FPS durante glitch effects
- Verifica memoria usage con dev tools
- Test su browser diversi

## 🎁 Easter Eggs

### Hidden Features
- Konami code per debug mode
- Triple-click su logo per instant unlock
- Hover su testi trasparenti per reveal
- Pattern specifici in terminal per unlock anticipato

### Secret Commands
Terminal nascosti:
- `matrix` - Attiva matrix rain
- `ghost` - Modalità spettro
- `reveal` - Mostra tutti i segreti

---

**Happy Gaming! 🎮**

Per supporto completo consulta `README.md` e `documentazione.md`.