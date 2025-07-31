# Deep Web Mining Collective - ARG Development Guide

## 🎯 **Obiettivo del Progetto**
Trasformare il sito https://giuxeroe.github.io/ in un'esperienza ARG (Alternate Reality Game) ispirata a "Welcome to the Game 2", integrata con Minecraft tramite immagini contenenti QR codes e indizi nascosti.

## 📋 **Panoramica dell'Esperienza**

### **Concept Generale**
I giocatori scoprono "The Deep Web Mining Collective" - un'organizzazione segreta che usa server Minecraft per nascondere dati del deep web. Le foto in-game sono "nodi di rete" contenenti frammenti di informazioni che portano a sezioni nascoste del sito web.

### **Target**
- 7 giocatori simultanei
- Durata: Multiple sessioni (3-5 giorni)
- Difficoltà: Progressiva da principiante a esperto

## 🏗️ **Struttura del Progetto**

```
deep-web-mining/
├── index.html                    # Homepage corrotta con glitch effects
├── assets/
│   ├── css/
│   │   ├── glitch.css           # Effetti di corruzione visiva
│   │   ├── terminal.css         # Stile terminale hacker
│   │   └── deep-web.css         # Dark theme per sezioni nascoste
│   ├── js/
│   │   ├── glitch-effects.js    # Animazioni di corruzione
│   │   ├── terminal-sim.js      # Simulatore terminale
│   │   ├── timer-system.js      # Sistema countdown tensione
│   │   └── progress-tracker.js  # Tracciamento avanzamento giocatori
│   ├── images/
│   │   ├── qr-codes/           # QR generati per Minecraft
│   │   ├── corrupted/          # Immagini con steganografia
│   │   └── ascii-art/          # Arte ASCII per terminali
│   └── sounds/
│       ├── typing.mp3          # Suoni di digitazione
│       ├── error.mp3           # Suoni di errore sistema
│       └── access-granted.mp3  # Suono accesso autorizzato
├── phases/
│   ├── surface/
│   │   ├── entry-point.html    # Prima pagina accessibile
│   │   └── corrupted-blog.html # Blog corrotto con indizi
│   ├── breach/
│   │   ├── terminal.html       # Terminale di accesso
│   │   ├── network-map.html    # Mappa nodi Minecraft
│   │   └── encrypted-files.html# File criptati da decodificare
│   ├── deep/
│   │   ├── irc-chat.html       # Chat IRC simulata
│   │   ├── missing-persons.html# Database persone scomparse
│   │   └── live-streams.html   # Fake streaming con coordinate
│   └── red-room/
│       ├── final-access.html   # Accesso finale
│       └── revelation.html     # Rivelazione finale del mistero
├── minecraft-assets/
│   ├── phase1-images/          # Immagini per Fase 1
│   ├── phase2-images/          # Immagini per Fase 2
│   ├── phase3-images/          # Immagini per Fase 3
│   └── final-images/           # Immagini finali
└── documentation/
    ├── admin-panel.html        # Pannello per monitorare progressi
    ├── solution-guide.md       # Guida soluzioni per admin
    └── placement-guide.md      # Guida posizionamento immagini Minecraft
```

## 🎮 **Fasi dell'Esperienza**

### **FASE 1: "Surface Discovery"** (Giorni 1-2)
**Obiettivo**: Introdurre i giocatori al mistero e alle meccaniche base

**Trigger di Avvio**:
- QR code nascosto in un'immagine "innocua" allo spawn di Minecraft
- QR porta alla homepage corrotta del sito

**Meccaniche**:
- Homepage normale con glitch effects che si intensificano
- Password nascosta in codice ASCII nell'immagine Minecraft
- Accesso a sezione "Surface Web" del sito

**Deliverables**:
- [ ] Homepage corrotta con CSS glitch animations
- [ ] Sistema di password con 3 tentativi massimi
- [ ] Prima immagine Minecraft con QR + codice ASCII
- [ ] Pagina "Surface Web" con 3 indizi per Fase 2

### **FASE 2: "First Breach"** (Giorni 2-3)
**Obiettivo**: Introdurre meccaniche di hacking e coordinate Minecraft

**Trigger**:
- Risoluzione puzzle steganografico da Fase 1
- Coordinate che portano a bunker nascosto in Minecraft

**Meccaniche**:
- Terminale simulato con comandi fake ma funzionali
- Sistema di "bruteforce" password con timer
- Immagini in bunker Minecraft formano mappa quando assemblate
- "Network intrusion" con falsi avvisi di tracciamento IP

**Deliverables**:
- [ ] Terminal simulator con 15+ comandi funzionali
- [ ] Sistema coordinate → location Minecraft
- [ ] 5 immagini che formano mappa quando unite
- [ ] Timer di "sicurezza" che aggiunge tensione
- [ ] Fake IP tracking con countdown

### **FASE 3: "Deep Web Access"** (Giorni 3-4)
**Obiettivo**: Simulare accesso al deep web con meccaniche complesse

**Trigger**:
- Completamento mappa da Fase 2
- Accesso a "Deep Web Terminal"

**Meccaniche**:
- Chat IRC simulata con bot che danno indizi criptici
- Database "Missing Persons" con vittime collegate a location Minecraft
- Live streaming fake che mostra coordinate in tempo reale
- Sistema di reputazione "Dark Web" che sblocca contenuti

**Deliverables**:
- [ ] IRC chat simulator con 5+ bot interattivi
- [ ] Database ricercabile con 10+ profili fake
- [ ] Sistema streaming con coordinate che cambiano ogni 30min
- [ ] Puzzle di decrittazione con chiavi multiple
- [ ] "Marketplace" dark web con indizi nascosti negli annunci

### **FASE 4: "Red Room Finale"** (Giorni 4-5)
**Obiettivo**: Climax finale con rivelazione del mistero

**Trigger**:
- Raccolta di 7 "keys" sparse nelle fasi precedenti
- Accesso simultaneo di tutti i giocatori

**Meccaniche**:
- "Red Room" che richiede presenza di tutti i 7 giocatori
- Puzzle finale che combina tutti gli indizi raccolti
- Rivelazione che tutto era un "test" del collettivo
- Finale alternativo basato sulle scelte dei giocatori

**Deliverables**:
- [ ] Sistema multi-giocatore per accesso finale
- [ ] Puzzle combinatorio con tutti gli elementi precedenti
- [ ] 3 finali alternativi basati su scelte fatte
- [ ] Certificato finale "Deep Web Mining Operative"

## 🔧 **Implementazione Tecnica**

### **Stack Tecnologico**
- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Styling**: CSS Grid/Flexbox, CSS Animations, Google Fonts
- **Interactivity**: Vanilla JavaScript (no frameworks per compatibilità)
- **QR Generation**: qrcode.js library
- **Persistence**: LocalStorage per progress tracking
- **Audio**: Web Audio API per effetti sonori

### **Specifiche Tecniche**

#### **Sistema di Glitch Effects**
```css
/* Implementare in glitch.css */
.glitch-text {
  animation: glitch 2s infinite;
  text-shadow: 0.05em 0 0 #00ffff, -0.03em -0.04em 0 #ff00ff;
}

@keyframes glitch {
  15%, 65% { transform: translate(-0.02em, 0); }
  20%, 50% { transform: translate(0.01em, 0); }
  35% { transform: translate(-0.01em, -0.02em); }
  70% { transform: translate(0.02em, 0.01em); }
  75% { transform: translate(0, -0.01em); }
}
```

#### **Terminal Simulator**
```javascript
// Implementare in terminal-sim.js
class TerminalSimulator {
  constructor(element) {
    this.element = element;
    this.commands = {
      'help': () => this.showCommands(),
      'ls': () => this.listFiles(),
      'cat': (file) => this.readFile(file),
      'crack': (target) => this.crackPassword(target),
      'trace': (ip) => this.traceIP(ip)
    };
  }

  processCommand(input) {
    const [cmd, ...args] = input.split(' ');
    if (this.commands[cmd]) {
      return this.commands[cmd](...args);
    }
    return `Command not found: ${cmd}`;
  }
}
```

#### **Progress Tracking System**
```javascript
// Implementare in progress-tracker.js
class ProgressTracker {
  constructor() {
    this.phases = {
      surface: { completed: false, clues: [] },
      breach: { completed: false, coordinates: [] },
      deep: { completed: false, keys: [] },
      final: { completed: false, participants: [] }
    };
  }

  updateProgress(phase, data) {
    this.phases[phase] = { ...this.phases[phase], ...data };
    localStorage.setItem('dwmc_progress', JSON.stringify(this.phases));
    this.checkPhaseCompletion(phase);
  }
}
```

### **QR Code Generation**
```javascript
// Script per generare QR codes
function generateQRCode(data, filename) {
  const qr = qrcode(0, 'M');
  qr.addData(data);
  qr.make();

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Render QR code
  const modules = qr.modules;
  const tileW = canvas.width / modules.length;
  const tileH = canvas.height / modules.length;

  for (let row = 0; row < modules.length; row++) {
    for (let col = 0; col < modules.length; col++) {
      ctx.fillStyle = modules[row][col] ? '#000' : '#fff';
      ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
    }
  }

  // Download
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL();
  link.click();
}
```

## 🎨 **Asset Requirements**

### **Immagini per Minecraft**

#### **Fase 1 - Surface Discovery**
- **spawn_welcome.png**: Immagine apparentemente normale con QR nascosto in corner
- **ascii_terminal.png**: Arte ASCII che rivela prima password
- **corrupted_map.png**: Mappa con coordinate offuscate

#### **Fase 2 - First Breach**
- **bunker_entrance.png**: Coordinate per bunker principale
- **network_node_1.png** to **network_node_5.png**: Pezzi di mappa da assemblare
- **terminal_access.png**: Codici per accesso terminale

#### **Fase 3 - Deep Web**
- **missing_person_1.png** to **missing_person_7.png**: Profili con indizi location
- **irc_logs.png**: Screenshot chat con coordinate temporali
- **streaming_coords.png**: QR che porta a live stream

#### **Fase 4 - Finale**
- **key_fragment_1.png** to **key_fragment_7.png**: Pezzi chiave finale
- **revelation.png**: Immagine finale con messaggio del collettivo

### **Specifiche Immagini**
- **Risoluzione**: 128x128 pixel (ottimale per Minecraft)
- **Formato**: PNG con trasparenza dove necessario
- **QR Codes**: Minimo 21x21 modules per leggibilità
- **Steganografia**: Usare LSB (Least Significant Bit) per nascondere dati

## 🔐 **Sistema di Sicurezza e Progression**

### **Password e Codici**
- **Fase 1**: `SURFACE_BREACH_2024`
- **Fase 2**: `TERMINAL_ACCESS_7791`
- **Fase 3**: `DEEP_WEB_MINING_COLLECTIVE`
- **Fase 4**: Combinazione di tutti i "keys" raccolti

### **Coordinate Minecraft**
```
Fase 1 Spawn: 0, 64, 0
Bunker Principale: -247, 45, 892
Network Node Alpha: 156, 78, -334
Network Node Beta: -89, 82, 445
Network Node Gamma: 334, 91, -178
IRC Server Room: -445, 23, 267
Missing Persons Archive: 678, 67, -123
Red Room Entrance: 0, 100, 0 (sopra spawn)
```

### **Timer e Tensione**
- **Soft Timer**: 30 minuti per fase (no conseguenze)
- **Hard Timer**: "IP Tracking" - 10 minuti per lasciare sezione
- **Cooldown**: 2 ore tra tentativi falliti per aumentare tensione

## 📊 **Testing e Debugging**

### **Admin Panel Features**
- Visualizzazione progress di tutti i giocatori
- Reset progress individuale o globale
- Generazione nuovi QR codes
- Log di tutti gli accessi e tentativi
- Simulazione fasi per testing

### **Debug Commands (Terminal)**
```bash
debug_unlock_phase <1-4>    # Sblocca fase specifica
debug_show_progress         # Mostra stato avanzamento
debug_generate_qr <data>    # Genera nuovo QR code
debug_reset_player         # Reset progress giocatore
debug_show_coordinates     # Mostra tutte le coordinate
```

### **Testing Checklist**
- [ ] Tutti i QR codes sono leggibili e funzionanti
- [ ] Password funzionano correttamente
- [ ] Timer si comportano come previsto
- [ ] Progress tracking salva/carica correttamente
- [ ] Tutti i link interni sono funzionanti
- [ ] Audio si riproduce su tutti i browser
- [ ] Responsive design per mobile (giocatori potrebbero usare telefoni)

## 🚀 **Deployment e Launch**

### **Pre-Launch Checklist**
- [ ] Test completo di tutte le fasi
- [ ] Backup di tutti gli asset
- [ ] Documentazione completa per admin
- [ ] Guide di placement per immagini Minecraft
- [ ] Verifica compatibilità browser
- [ ] Test di carico per 7+ giocatori simultanei

### **Launch Day**
1. Deploy del sito aggiornato
2. Posizionamento immagini in Minecraft secondo placement-guide.md
3. Brief iniziale ai giocatori (senza spoiler)
4. Attivazione monitoring admin panel
5. Inizio esperienza con prima immagine allo spawn

### **Post-Launch Support**
- Monitoring attivo durante le prime 24h
- Support channel Discord per problemi tecnici
- Raccolta feedback per iterazioni future
- Documentazione lessons learned

## 📚 **Risorse e Riferimenti**

### **Welcome to the Game 2 - Elementi da Emulare**
- Tensione crescente con timer
- Falsi avvisi di "tracciamento"
- Terminali con comandi realistici
- Estetica dark web autentica
- Progression gating con puzzle
- Elementi di paranoia e suspense

### **Tools Consigliati**
- **QR Generator**: qrcode.js o qr-server.com
- **Steganography**: OpenStego per nascondere dati in immagini
- **ASCII Art**: Text to ASCII Art Generator
- **Color Palette**: Dracula theme o similari per estetica dark
- **Fonts**: 'Courier New', 'Fira Code', 'Source Code Pro'

### **Librerie JavaScript**
```html
<!-- QR Code Generation -->
<script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>

<!-- Terminal Effects -->
<script src="https://unpkg.com/typewriter-effect@latest/dist/core.js"></script>

<!-- Audio Management -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>
```

---