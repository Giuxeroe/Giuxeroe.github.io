# Deep Web Mining Collective - ARG Documentation

## 📖 Overview
"Deep Web Mining Collective" è un Alternate Reality Game (ARG) ispirato a "Welcome to the Game 2" che trasforma il sito GitHub Pages in un'esperienza immersiva dark web/hacker.

## 🚀 Come Iniziare

### 1. Accesso Iniziale
- Visita la homepage corrotta: `index.html`
- La pagina apparirà glitchata con effetti di corruzione
- Cerca i metodi di accesso nascosti

### 2. Password di Accesso
**Password principale**: `DEEP_MINING_777`
- Può essere ottenuta tramite:
  - Click sull'area nascosta in fondo alla homepage
  - Prompt "UNAUTHORIZED ACCESS DETECTED" (codice: `BREACH_PROTOCOL`)
  - Entry "DEEP_WEB_TERMINAL" > "EMERGENCY_ACCESS"

### 3. Terminal Access
Una volta inserita la password corretta, accederai al terminal principale (`terminal.html`)

## 🎮 Comandi Terminal Disponibili

### Comandi Base
- `help` - Mostra tutti i comandi disponibili
- `status` - Informazioni sistema e progresso utente
- `ls` - Lista file e directory
- `clear` - Pulisce schermo terminal
- `exit` - Torna alla homepage

### Comandi Mining
- `mine` - Avvia operazione mining (30 secondi)
- `scan` - Scansiona vulnerabilità di rete (aumenta user level)
- `connect <node_id>` - Connettiti a nodi mining remoti
- `trace` - Traccia connessioni attive

### Comandi Avanzati
- `decrypt` - Decripta file (richiede user level 1+)
- `breach` - Protocollo breach sicurezza (richiede user level 2+)

### Sistema QR Minecraft
- `qr spawn` - Genera QR per coordinate spawn (5 blocchi richiesti)
- `qr base` - Genera QR per base segreta (10 blocchi richiesti)
- `qr secret` - Genera QR per location classificata (20 blocchi richiesti)

## 🎯 Sistema Progressione

### Livelli Utente
- **Livello 0**: Accesso base terminal
- **Livello 1**: Unlock comando `decrypt` (completa `scan`)
- **Livello 2**: Unlock comando `breach` (requisiti avanzati)

### Mining Progress
- **5 blocchi**: Sblocca coordinate spawn Minecraft
- **10 blocchi**: Sblocca base segreta
- **20 blocchi**: Sblocca location classificata

### Reward Minecraft
I QR code generati contengono:
- Coordinate precise (X, Y, Z)
- Comandi Minecraft pronti all'uso (`/tp @p X Y Z`)
- ASCII art per immersione visiva

## 🔧 Caratteristiche Tecniche

### Effetti Visivi
- Scanlines CRT animate
- Glitch effects casuali
- Corruzione testo con caratteri █
- Colori hacker: verde, rosso, cyan, giallo
- Font monospace (Courier Prime)

### Sistema Audio
- Suoni typing procedurali
- Effetti errore/successo
- Allarmi di sicurezza
- Ambientazione mining
- Volume regolabile

### Persistenza Dati
Utilizza localStorage per salvare:
- Blocchi minati totali
- Livello utente corrente
- QR codes generati
- Accessi trackati

### Struttura File
```
Giuxeroe.github.io/
├── index.html              # Homepage corrotta
├── terminal.html            # Terminal principale
├── assets/
│   ├── sounds.js           # Sistema audio procedurale
│   └── style.css           # Stili condivisi ARG
├── scripts/
│   └── qr_generator.js     # Generatore QR Minecraft
└── data/
    ├── mining_logs.txt     # Log mining finti
    └── spawn_coordinates.dat # Coordinate Minecraft
```

## 🎨 Design Patterns

### Estetica Dark Web
- Background nero assoluto (#000000)
- Testo verde matrix (#00ff00)
- Accenti rossi per errori (#ff0000)
- Cyan per link/info (#00ffff)
- Giallo per warning (#ffff00)

### User Experience
- Typing effects realistici
- Timer di tensione con "IP tracking"
- Falsi allarmi di sicurezza
- Progressione basata su azioni
- Feedback audio immediato

## 🎯 Easter Eggs e Segreti

### Access Points Nascosti
- Area invisibile fondo homepage
- Console log mining operations
- Prompt autorizzazione multipli
- Entry corrupted speciale

### Minecraft Integration
- Coordinate reali utilizzabili
- Comandi teleport pronti
- QR scannable con app mobile
- Location tematiche ARG

## 📱 Compatibilità

### Browser Supportati
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

### Dispositivi
- Desktop (esperienza ottimale)
- Tablet (layout adattivo)
- Mobile (versione compatta)

### API Utilizzate
- Web Audio API (per suoni)
- localStorage (persistenza)
- CSS Animations (effetti)
- Canvas 2D (futuro: QR visuali)

## 🔐 Security Features (Simulate)

### Falsi Sistemi Sicurezza
- IP tracking timer
- Threat level monitoring
- Breach detection alerts
- Access logs simulati

### Passwording System
- Password principale: `DEEP_MINING_777`
- Codice breach: `BREACH_PROTOCOL`
- Livelli accesso progressivi
- Session timeout simulato

## 🚨 Troubleshooting

### Problemi Comuni
1. **Audio non funziona**: Interagire prima con la pagina (limitazione browser)
2. **Progress perso**: localStorage disabilitato/cancellato
3. **QR non genera**: Insufficienti blocchi minati
4. **Glitch eccessivi**: Ridurre animazioni CSS

### Reset ARG
Per resettare completamente l'esperienza:
```javascript
localStorage.clear();
location.reload();
```

## 🎪 Modalità Demo
Per testare rapidamente tutte le features:
```javascript
localStorage.setItem('dwmc_blocks_mined', '25');
localStorage.setItem('dwmc_user_level', '2');
location.reload();
```

## 📞 Contatti
Creato da: Giuxeroe
Repository: https://github.com/Giuxeroe/Giuxeroe.github.io
ARG Version: 1.0.0
Ultima Update: 2025

---
**⚠️ DISCLAIMER**: Questo è un gioco di finzione. Nessuna attività illegale reale è coinvolta.