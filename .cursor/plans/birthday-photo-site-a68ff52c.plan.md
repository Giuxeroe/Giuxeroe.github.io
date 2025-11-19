<!-- a68ff52c-4ebc-40fd-b48d-a899bfc27a7c 5a344ebb-cc75-4006-b468-b14b1ce488ce -->
# Controllo Velocità Slideshow e Messaggio Visibile

## Modifiche da fare

### 1. Aggiorna `index.html`

- Aggiungi uno slider per la velocità sotto i controlli dello slideshow
- Range: da 1 secondo a 10 secondi (default 5 secondi)
- Mostra il valore corrente dello slider (es: "5s")
- Il messaggio della persona è già presente, assicuriamoci che sia sempre visibile

### 2. Aggiorna `main.js`

- Aggiungi variabile per la velocità dello slideshow (default 5000ms)
- Listener per lo slider che aggiorna la velocità
- Quando cambia la velocità, riavvia l'autoplay con il nuovo intervallo
- Assicurati che il messaggio della persona sia sempre mostrato nello slideshow (non solo quando presente)
- Per i video, il messaggio deve rimanere visibile durante la riproduzione

### 3. Aggiorna `style.css`

- Stili per lo slider della velocità
- Assicura che il messaggio sia sempre visibile e leggibile
- Migliora il layout dei controlli per includere lo slider

### 4. Comportamento

- Lo slider funziona solo per le foto (i video hanno durata propria)
- Quando l'utente cambia la velocità, l'effetto è immediato
- Il valore è salvato durante la sessione
- Il messaggio della persona è sempre visibile sotto il nome

### To-dos

- [ ] Aggiungere slider velocità in index.html
- [ ] Implementare controllo velocità e messaggio sempre visibile
- [ ] Stilizzare slider e migliorare layout