// Audio system for Deep Web Mining Collective ARG
// Simula suoni senza file audio reali usando Web Audio API

class ARGSoundSystem {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.volume = 0.3;
        this.enabled = true;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // Genera suono di typing
    generateTypingSound() {
        if (!this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 800 + Math.random() * 200;
        oscillator.type = 'square';

        gainNode.gain.value = this.volume * 0.1;
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    // Genera suono di errore
    generateErrorSound() {
        if (!this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 200;
        oscillator.type = 'sawtooth';

        gainNode.gain.value = this.volume * 0.2;
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.5);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    // Genera suono di accesso riuscito
    generateSuccessSound() {
        if (!this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 600;
        oscillator.type = 'sine';

        gainNode.gain.value = this.volume * 0.15;
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.3);
    }

    // Genera suono di allarme
    generateAlarmSound() {
        if (!this.enabled) return;

        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);

                oscillator.frequency.value = 1000;
                oscillator.type = 'square';

                gainNode.gain.value = this.volume * 0.3;
                gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

                oscillator.start();
                oscillator.stop(this.audioContext.currentTime + 0.2);
            }, i * 300);
        }
    }

    // Genera suono ambientale di mining
    generateMiningSound() {
        if (!this.enabled) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.frequency.value = 100 + Math.random() * 50;
        oscillator.type = 'sawtooth';

        filter.type = 'lowpass';
        filter.frequency.value = 300;

        gainNode.gain.value = this.volume * 0.05;
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 2);

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 2);
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Inizializza sistema audio globale
window.ARGSounds = new ARGSoundSystem();

// Event listeners per suoni automatici
document.addEventListener('keydown', (e) => {
    if (e.target.classList.contains('terminal-input')) {
        window.ARGSounds.generateTypingSound();
    }
});

// Esporta per uso in Node.js se necessario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ARGSoundSystem;
}