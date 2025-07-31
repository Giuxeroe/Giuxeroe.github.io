/* Deep Web Mining Collective - Glitch Effects System */

class GlitchEffects {
    constructor() {
        this.isActive = true;
        this.corruptionLevel = 1;
        this.effects = [];
        this.intervals = [];

        this.initializeEffects();
        this.startCorruptionCycle();
    }

    initializeEffects() {
        // Create corruption overlay
        this.createCorruptionOverlay();

        // Initialize matrix rain effect
        this.createMatrixRain();

        // Setup random glitch triggers
        this.setupRandomGlitches();

        // Initialize text corruption
        this.initializeTextCorruption();
    }

    createCorruptionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'corruption-overlay';
        overlay.id = 'corruption-overlay';
        document.body.appendChild(overlay);

        // Initially hidden
        overlay.style.display = 'none';
    }

    createMatrixRain() {
        const matrixContainer = document.createElement('div');
        matrixContainer.className = 'matrix-rain';
        matrixContainer.id = 'matrix-rain';
        document.body.appendChild(matrixContainer);

        // Create falling columns of matrix text
        for (let i = 0; i < 15; i++) {
            this.createMatrixColumn(matrixContainer, i);
        }
    }

    createMatrixColumn(container, index) {
        const column = document.createElement('div');
        column.className = 'matrix-column';

        // Generate random matrix characters
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        let text = '';
        for (let i = 0; i < 20; i++) {
            text += chars[Math.floor(Math.random() * chars.length)] + '<br>';
        }
        column.innerHTML = text;

        // Random positioning and timing
        column.style.left = (index * 7) + '%';
        column.style.animationDuration = (Math.random() * 3 + 2) + 's';
        column.style.animationDelay = (Math.random() * 2) + 's';

        container.appendChild(column);

        // Recreate column when animation ends
        column.addEventListener('animationend', () => {
            setTimeout(() => {
                this.createMatrixColumn(container, index);
                container.removeChild(column);
            }, Math.random() * 5000);
        });
    }

    setupRandomGlitches() {
        // Random screen glitches
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.1 * this.corruptionLevel) {
                this.triggerScreenGlitch();
            }
        }, 1000));

        // Random text corruptions
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.05 * this.corruptionLevel) {
                this.corruptRandomText();
            }
        }, 2000));

        // Random color shifts
        this.intervals.push(setInterval(() => {
            if (Math.random() < 0.08 * this.corruptionLevel) {
                this.triggerColorShift();
            }
        }, 1500));
    }

    triggerScreenGlitch() {
        const overlay = document.getElementById('corruption-overlay');
        if (overlay) {
            overlay.style.display = 'block';
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 100 + Math.random() * 200);
        }

        // Add temporary distortion to body
        document.body.style.transform = `skew(${(Math.random() - 0.5) * 2}deg)`;
        document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;

        setTimeout(() => {
            document.body.style.transform = '';
            document.body.style.filter = '';
        }, 50 + Math.random() * 100);

        this.playGlitchSound();
    }

    corruptRandomText() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
        const element = textElements[Math.floor(Math.random() * textElements.length)];

        if (element && element.textContent.length > 5) {
            const originalText = element.textContent;
            const corruptedText = this.corruptText(originalText);

            element.textContent = corruptedText;
            element.classList.add('glitch-text');

            setTimeout(() => {
                element.textContent = originalText;
                element.classList.remove('glitch-text');
            }, 500 + Math.random() * 1000);
        }
    }

    corruptText(text) {
        const corruptChars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
        const glitchChars = '█▓▒░▄▀■□▪▫∎∏≡≢≣≤≥≦≧≨≩⊂⊃⊆⊇⊈⊉⊊⊋';

        let corrupted = '';
        for (let i = 0; i < text.length; i++) {
            if (Math.random() < 0.1) {
                if (Math.random() < 0.5) {
                    corrupted += corruptChars[Math.floor(Math.random() * corruptChars.length)];
                } else {
                    corrupted += glitchChars[Math.floor(Math.random() * glitchChars.length)];
                }
            } else {
                corrupted += text[i];
            }
        }
        return corrupted;
    }

    triggerColorShift() {
        const hue = Math.random() * 360;
        document.body.style.filter = `hue-rotate(${hue}deg) saturate(1.5)`;

        setTimeout(() => {
            document.body.style.filter = '';
        }, 200 + Math.random() * 300);
    }

    initializeTextCorruption() {
        // Find elements with data-glitch attribute and animate them
        const glitchElements = document.querySelectorAll('[data-glitch]');
        glitchElements.forEach(element => {
            this.animateGlitchText(element);
        });
    }

    animateGlitchText(element) {
        const originalText = element.textContent;
        const glitchTexts = [
            'ERROR_404_REALITY_NOT_FOUND',
            'ACCESS_DENIED_INSUFFICIENT_CLEARANCE',
            'UNAUTHORIZED_INTRUSION_DETECTED',
            'TRACING_IP_ADDRESS_STANDBY',
            'CORRUPTION_LEVEL_CRITICAL',
            'SYSTEM_BREACH_IMMINENT'
        ];

        setInterval(() => {
            if (Math.random() < 0.05) {
                const glitchText = glitchTexts[Math.floor(Math.random() * glitchTexts.length)];
                element.textContent = glitchText;
                element.classList.add('text-corruption');

                setTimeout(() => {
                    element.textContent = originalText;
                    element.classList.remove('text-corruption');
                }, 1000 + Math.random() * 2000);
            }
        }, 3000);
    }

    startCorruptionCycle() {
        // Gradually increase corruption level over time
        this.intervals.push(setInterval(() => {
            this.corruptionLevel = Math.min(this.corruptionLevel + 0.1, 3);
            this.updateCorruptionVisuals();
        }, 30000)); // Every 30 seconds
    }

    updateCorruptionVisuals() {
        const body = document.body;

        // Adjust matrix rain opacity
        const matrixRain = document.getElementById('matrix-rain');
        if (matrixRain) {
            matrixRain.style.opacity = Math.min(this.corruptionLevel * 0.2, 0.6);
        }

        // Adjust overall visual corruption
        if (this.corruptionLevel > 2) {
            body.style.textShadow = '0 0 3px #ff0000, 0 0 6px #00ff00';
        }
    }

    intensifyGlitches() {
        // Temporary effect for high-tension moments
        this.corruptionLevel = 5;

        // Rapid fire glitches
        const rapidGlitch = setInterval(() => {
            this.triggerScreenGlitch();
        }, 100);

        setTimeout(() => {
            clearInterval(rapidGlitch);
            this.corruptionLevel = 1;
        }, 3000);
    }

    showSystemAlert(message, type = 'error') {
        const alert = document.createElement('div');
        alert.className = `system-alert alert-${type}`;
        alert.innerHTML = `
            <div class="alert-header">
                <span class="alert-icon">⚠</span>
                <span class="alert-title">SYSTEM ALERT</span>
            </div>
            <div class="alert-message">${message}</div>
            <div class="alert-footer">
                <button class="alert-dismiss">ACKNOWLEDGED</button>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#alert-styles')) {
            const styles = document.createElement('style');
            styles.id = 'alert-styles';
            styles.textContent = `
                .system-alert {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #1a1a1a;
                    border: 3px solid #ff0000;
                    color: #ffffff;
                    padding: 20px;
                    z-index: 20000;
                    min-width: 400px;
                    font-family: 'Courier New', monospace;
                    box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
                    animation: alert-entrance 0.5s ease;
                }
                .alert-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 15px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #ff0000;
                }
                .alert-icon {
                    font-size: 24px;
                    color: #ff0000;
                    animation: alert-pulse 1s infinite;
                }
                .alert-title {
                    font-weight: bold;
                    color: #ff0000;
                    text-transform: uppercase;
                }
                .alert-message {
                    margin: 15px 0;
                    line-height: 1.5;
                }
                .alert-footer {
                    text-align: center;
                    margin-top: 15px;
                }
                .alert-dismiss {
                    background: #ff0000;
                    color: #ffffff;
                    border: none;
                    padding: 10px 20px;
                    cursor: pointer;
                    font-family: inherit;
                    text-transform: uppercase;
                }
                @keyframes alert-entrance {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes alert-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add dismiss handler
        alert.querySelector('.alert-dismiss').addEventListener('click', () => {
            document.body.removeChild(alert);
        });

        document.body.appendChild(alert);
        this.playAlertSound();

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                document.body.removeChild(alert);
            }
        }, 10000);
    }

    createLoadingGlitch(container, text = 'LOADING') {
        const loading = document.createElement('div');
        loading.className = 'loading-glitch';
        loading.textContent = text;

        // Animate loading text corruption
        const corruptTexts = [`L04D1NG`, `L0@D!NG`, `L#@&*NG`, `ERR0R`, text];
        let index = 0;

        const loadingInterval = setInterval(() => {
            loading.textContent = corruptTexts[index % corruptTexts.length];
            index++;
        }, 200);

        container.appendChild(loading);

        return {
            element: loading,
            stop: () => {
                clearInterval(loadingInterval);
                if (loading.parentNode) {
                    loading.parentNode.removeChild(loading);
                }
            }
        };
    }

    playGlitchSound() {
        const audio = document.querySelector('#glitch-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.3;
            audio.play().catch(() => {});
        }
    }

    playAlertSound() {
        const audio = document.querySelector('#alert-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.5;
            audio.play().catch(() => {});
        }
    }

    destroy() {
        // Clean up intervals and effects
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals = [];

        // Remove overlay elements
        const overlay = document.getElementById('corruption-overlay');
        const matrix = document.getElementById('matrix-rain');

        if (overlay) overlay.remove();
        if (matrix) matrix.remove();

        // Reset body styles
        document.body.style.transform = '';
        document.body.style.filter = '';
        document.body.style.textShadow = '';
    }
}

// Initialize glitch effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.glitchEffects = new GlitchEffects();
});

// Export for manual control
window.GlitchEffects = GlitchEffects;