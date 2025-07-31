# Deep Web Mining Collective - ARG Implementation

Un'esperienza ARG (Alternate Reality Game) completa ispirata a "Welcome to the Game 2", progettata per 7 giocatori simultanei con integrazione Minecraft.

## 🎯 Panoramica

Il **Deep Web Mining Collective** è un ARG multi-fase che simula l'infiltrazione di un'organizzazione segreta attraverso una serie di siti web interattivi, puzzle di decrittazione, e sfide di hacking simulate. I giocatori utilizzano QR codes nascosti in immagini di Minecraft per accedere a diversi livelli dell'esperienza.

## 🚀 Installazione e Setup

### Requisiti
- Server web (Apache, Nginx, o semplicemente `python -m http.server`)
- Browser moderno con supporto JavaScript ES6+
- Minecraft per l'integrazione QR codes (opzionale ma consigliato)

### Setup Rapido
1. Clona o scarica il repository
2. Avvia un server web nella directory principale
3. Accedi a `index.html` per iniziare l'esperienza
4. (Opzionale) Usa `qr-generator.html` per generare QR codes per Minecraft

```bash
# Setup con Python
python -m http.server 8000

# Setup con Node.js
npx serve .

# Setup con PHP
php -S localhost:8000
```

## 🎮 Struttura dell'Esperienza

### Fase 1: Surface Discovery
- **Punto di ingresso**: `index.html`
- **Password**: `SURFACE_BREACH_2024` (nascosta nella homepage)
- **Obiettivo**: Raccogliere 3 indizi dal livello superficie
- **Durata**: 30-60 minuti

### Fase 2: First Breach
- **Accesso**: `phases/breach/terminal.html`
- **Password**: `TERMINAL_ACCESS_7791`
- **Obiettivo**: Completare 4 obiettivi di hacking nel terminale
- **Durata**: 45-90 minuti

### Fase 3: Deep Web Access
- **Pagine**: IRC Chat, Missing Persons, Live Streams
- **Obiettivo**: Raccogliere 5+ chiavi di decrittazione
- **Funzionalità**: Chat IRC simulata, database persone scomparse, streaming live
- **Durata**: 60-120 minuti

### Fase 4: Red Room Finale
- **Accesso**: `phases/red-room/final-access.html`
- **Requisiti**: Completamento di tutte le fasi precedenti + 7 partecipanti
- **Finale**: `phases/red-room/revelation.html` con 3 finali alternativi
- **Durata**: 30-45 minuti

## 🔧 Funzionalità Tecniche

### Sistema di Progresso
- **LocalStorage**: Tracciamento progresso persistente
- **Progress Tracker**: Sistema di notifiche e achievement
- **Multi-fase**: Sblocco progressivo dei contenuti

### Effetti Speciali
- **Glitch Effects**: Corruzione visiva e animazioni CSS
- **Terminal Simulator**: 15+ comandi funzionali
- **Timer System**: Countdown di tensione con falsi avvisi IP
- **Audio System**: Effetti sonori per immersione (placeholder)

### Integrazione Minecraft
- **QR Generator**: `qr-generator.html` per creare QR codes
- **Coordinate System**: Sistema di coordinate per posizionamento
- **Image Generation**: Immagini 128x128 ottimizzate per Minecraft

## 📋 Coordinate Minecraft

| Fase | Immagine | Coordinate | Descrizione |
|------|----------|------------|-------------|
| 1 | spawn_welcome.png | 0, 64, 0 | QR di benvenuto allo spawn |
| 1 | ascii_terminal.png | 50, 70, -30 | Primo terminale |
| 2 | bunker_entrance.png | -247, 45, 892 | Accesso bunker principale |
| 2 | network_node_1.png | 156, 78, -334 | Nodo Alpha |
| 2 | network_node_2.png | -89, 82, 445 | Nodo Beta |
| 2 | network_node_3.png | 334, 91, -178 | Nodo Gamma |
| 3 | missing_person_*.png | Varie | Database persone scomparse |
| 4 | revelation.png | 0, 100, 0 | Accesso finale |

## 🎨 Personalizzazione

### Stili CSS
- `assets/css/deep-web.css`: Tema dark web principale
- `assets/css/glitch.css`: Effetti di corruzione e glitch
- `assets/css/terminal.css`: Stili terminale hacker

### JavaScript
- `assets/js/progress-tracker.js`: Sistema di progresso
- `assets/js/terminal-sim.js`: Simulatore terminale
- `assets/js/glitch-effects.js`: Effetti visivi
- `assets/js/timer-system.js`: Sistema timer e tensione
- `assets/js/qr-generator.js`: Generazione QR codes

### Audio (Placeholder)
Sostituisci i file in `assets/sounds/` con:
- `typing.mp3`: Suoni di digitazione
- `error.mp3`: Suoni di errore
- `access-granted.mp3`: Suoni di successo
- `glitch.mp3`: Effetti di corruzione
- `alert.mp3`: Allarmi di sicurezza

## 🔐 Password e Codici

| Fase | Password/Codice | Utilizzo |
|------|----------------|----------|
| Surface | `SURFACE_BREACH_2024` | Accesso homepage |
| Breach | `TERMINAL_ACCESS_7791` | Accesso terminale |
| Deep | `DEEP_WEB_MINING_COLLECTIVE` | Accesso deep web |
| IRC | `IRC_DEEP_KEY_2024` | Chiave IRC profonda |

## 🛠 Debug e Testing

### Comandi Console
```javascript
// Sblocca tutte le fasi
debugUnlockAll();

// Reset progresso
progressTracker.debugResetProgress();

// Mostra progresso attuale
progressTracker.debugShowProgress();

// Genera QR codes
qrGenerator.generateAllQRCodes();

// Attiva effetti intensi
glitchEffects.intensifyGlitches();
```

### Konami Code
Inserisci la sequenza ↑↑↓↓←→←→BA per attivare la modalità debug con comandi aggiuntivi.

## 📱 Compatibilità

### Browser Supportati
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dispositivi
- Desktop (esperienza ottimale)
- Tablet (funzionale)
- Mobile (supporto limitato)

### Requisiti JavaScript
- ES6+ features
- LocalStorage
- Web Audio API (opzionale)
- Canvas API (per QR generation)

## 🎯 Suggerimenti per Game Master

### Pre-Launch
1. Testa tutte le fasi in sequenza
2. Genera tutti i QR codes necessari
3. Posiziona le immagini in Minecraft secondo le coordinate
4. Prepara i file audio per l'immersione
5. Crea un canale Discord per supporto

### Durante l'Esperienza
1. Monitora il progresso tramite console debug
2. Fornisci hint sottili se i giocatori si bloccano
3. Usa `glitchEffects.showSystemAlert()` per messaggi drammatici
4. Regola i timer con `timerSystem.debugAddTime()` se necessario

### Post-Game
1. Raccogli feedback dai giocatori
2. Documenta eventuali bug o miglioramenti
3. Salva le statistiche finali per analisi

## 🔮 Espansioni Future

### Contenuti Aggiuntivi
- Nuove fasi con puzzle più complessi
- Sistema multiplayer reale
- Integrazione con social media
- Elementi di realtà aumentata

### Miglioramenti Tecnici
- Backend per sincronizzazione multi-giocatore
- Database persistente
- Sistema di ranking
- Analytics avanzate

## 📄 Licenza e Crediti

Questo ARG è ispirato a "Welcome to the Game 2" e progettato per scopi educativi e di intrattenimento.

### Tecnologie Utilizzate
- Vanilla JavaScript ES6+
- CSS3 con animazioni avanzate
- QRCode.js per generazione QR
- Web Audio API per effetti sonori

### Contributi
- Design e sviluppo: [Il tuo nome]
- Ispirazione: "Welcome to the Game 2"
- Testing: Community di giocatori ARG

## 🆘 Supporto e Troubleshooting

### Problemi Comuni

**LocalStorage non funziona**
- Verifica che il sito sia servito via HTTP/HTTPS, non file://
- Controlla le impostazioni privacy del browser

**QR codes non si generano**
- Assicurati che la libreria QRCode.js sia caricata
- Verifica la connessione internet per le CDN

**Audio non funziona**
- I browser richiedono interazione utente prima di riprodurre audio
- Clicca sulla pagina prima che l'audio inizi

**Effetti glitch non appaiono**
- Verifica che CSS animations siano abilitate
- Controlla le performance del browser

### Contatti
Per supporto tecnico o domande sull'implementazione, consulta la documentazione completa in `documentazione.md` o apri un issue nel repository.

---

**Buona fortuna, operativi. La verità vi aspetta nel Deep Web Mining Collective.**