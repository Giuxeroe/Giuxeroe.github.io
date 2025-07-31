/* Deep Web Mining Collective - Progress Tracking System */

class ProgressTracker {
    constructor() {
        this.phases = {
            surface: {
                completed: false,
                clues: [],
                surface_password: null,
                access_time: null
            },
            breach: {
                completed: false,
                coordinates: [],
                terminal_password: null,
                passwords_decrypted: false,
                network_mapped: false
            },
            deep: {
                completed: false,
                keys: [],
                irc_connected: false,
                missing_persons_accessed: false,
                dark_web_reputation: 0
            },
            final: {
                completed: false,
                participants: [],
                final_keys_collected: 0,
                revelation_unlocked: false
            }
        };

        this.loadProgress();
        this.initializeEventListeners();
        this.startProgressMonitoring();
    }

    loadProgress() {
        const saved = localStorage.getItem('dwmc_progress');
        if (saved) {
            this.phases = { ...this.phases, ...JSON.parse(saved) };
        }
        this.saveProgress();
    }

    saveProgress() {
        localStorage.setItem('dwmc_progress', JSON.stringify(this.phases));
        this.broadcastProgress();
    }

    initializeEventListeners() {
        // Listen for custom progress update events
        window.addEventListener('progressUpdate', (e) => {
            this.updateProgress(e.detail);
        });

        // Listen for phase completion events
        window.addEventListener('phaseComplete', (e) => {
            this.completePhase(e.detail.phase, e.detail.data);
        });

        // Listen for clue discovery events
        window.addEventListener('clueDiscovered', (e) => {
            this.addClue(e.detail.phase, e.detail.clue);
        });

        // Listen for key collection events
        window.addEventListener('keyCollected', (e) => {
            this.addKey(e.detail.phase, e.detail.key);
        });
    }

    updateProgress(phase, data) {
        if (typeof phase === 'object') {
            // Bulk update
            this.phases = { ...this.phases, ...phase };
        } else {
            // Single phase update
            this.phases[phase] = { ...this.phases[phase], ...data };
        }

        this.checkPhaseCompletion(phase);
        this.saveProgress();
    }

    completePhase(phase, data = {}) {
        this.phases[phase] = {
            ...this.phases[phase],
            ...data,
            completed: true,
            completion_time: Date.now()
        };

        this.unlockNextPhase(phase);
        this.saveProgress();

        // Trigger completion event
        this.showPhaseCompletionNotification(phase);
    }

    addClue(phase, clue) {
        if (!this.phases[phase].clues.includes(clue)) {
            this.phases[phase].clues.push(clue);
            this.saveProgress();

            // Show clue discovered notification
            this.showClueNotification(clue);
        }
    }

    addKey(phase, key) {
        if (!this.phases[phase].keys.includes(key)) {
            this.phases[phase].keys.push(key);
            this.saveProgress();

            // Show key collected notification
            this.showKeyNotification(key);
        }
    }

    checkPhaseCompletion(phase) {
        switch (phase) {
            case 'surface':
                if (this.phases.surface.surface_password && this.phases.surface.clues.length >= 3) {
                    this.completePhase('surface');
                }
                break;

            case 'breach':
                if (this.phases.breach.terminal_password &&
                    this.phases.breach.passwords_decrypted &&
                    this.phases.breach.coordinates.length >= 3) {
                    this.completePhase('breach');
                }
                break;

            case 'deep':
                if (this.phases.deep.irc_connected &&
                    this.phases.deep.missing_persons_accessed &&
                    this.phases.deep.keys.length >= 5) {
                    this.completePhase('deep');
                }
                break;

            case 'final':
                if (this.phases.final.participants.length >= 7 &&
                    this.phases.final.final_keys_collected >= 7) {
                    this.completePhase('final');
                }
                break;
        }
    }

    unlockNextPhase(completedPhase) {
        const phaseOrder = ['surface', 'breach', 'deep', 'final'];
        const currentIndex = phaseOrder.indexOf(completedPhase);

        if (currentIndex < phaseOrder.length - 1) {
            const nextPhase = phaseOrder[currentIndex + 1];
            this.showPhaseUnlockedNotification(nextPhase);
        }
    }

    getCurrentPhase() {
        if (this.phases.final.completed) return 'completed';
        if (this.phases.deep.completed || this.phases.deep.keys.length > 0) return 'final';
        if (this.phases.breach.completed || this.phases.breach.terminal_password) return 'deep';
        if (this.phases.surface.completed || this.phases.surface.surface_password) return 'breach';
        return 'surface';
    }

    getPhaseProgress(phase) {
        const phaseData = this.phases[phase];
        if (!phaseData) return 0;

        if (phaseData.completed) return 100;

        switch (phase) {
            case 'surface':
                let surfaceProgress = 0;
                if (phaseData.surface_password) surfaceProgress += 50;
                surfaceProgress += (phaseData.clues.length / 3) * 50;
                return Math.min(surfaceProgress, 99);

            case 'breach':
                let breachProgress = 0;
                if (phaseData.terminal_password) breachProgress += 30;
                if (phaseData.passwords_decrypted) breachProgress += 30;
                breachProgress += (phaseData.coordinates.length / 3) * 40;
                return Math.min(breachProgress, 99);

            case 'deep':
                let deepProgress = 0;
                if (phaseData.irc_connected) deepProgress += 25;
                if (phaseData.missing_persons_accessed) deepProgress += 25;
                deepProgress += (phaseData.keys.length / 5) * 50;
                return Math.min(deepProgress, 99);

            case 'final':
                let finalProgress = 0;
                finalProgress += (phaseData.participants.length / 7) * 50;
                finalProgress += (phaseData.final_keys_collected / 7) * 50;
                return Math.min(finalProgress, 99);

            default:
                return 0;
        }
    }

    getOverallProgress() {
        const phases = ['surface', 'breach', 'deep', 'final'];
        const totalProgress = phases.reduce((sum, phase) => {
            return sum + this.getPhaseProgress(phase);
        }, 0);

        return Math.round(totalProgress / phases.length);
    }

    showPhaseCompletionNotification(phase) {
        const messages = {
            surface: 'Surface level breached! Terminal access unlocked.',
            breach: 'System compromised! Deep web access available.',
            deep: 'Deep web infiltrated! Final phase accessible.',
            final: 'Mission complete! Welcome to the Collective.'
        };

        this.showNotification(messages[phase], 'success');
        this.playSuccessSound();
    }

    showPhaseUnlockedNotification(phase) {
        const messages = {
            breach: 'New area unlocked: Terminal Access',
            deep: 'New area unlocked: Deep Web Portal',
            final: 'New area unlocked: Red Room Entrance'
        };

        this.showNotification(messages[phase], 'info');
    }

    showClueNotification(clue) {
        this.showNotification(`Clue discovered: ${clue}`, 'clue');
    }

    showKeyNotification(key) {
        this.showNotification(`Key collected: ${key}`, 'key');
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #1a1a1a;
                    border: 2px solid #00ff00;
                    color: #ffffff;
                    padding: 15px;
                    border-radius: 0;
                    z-index: 10000;
                    animation: notification-slide-in 0.3s ease;
                    max-width: 300px;
                    box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
                }
                .notification-success { border-color: #00ff00; }
                .notification-info { border-color: #00ffff; }
                .notification-clue { border-color: #ffff00; }
                .notification-key { border-color: #ff00ff; }
                .notification-error { border-color: #ff0000; }
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: inherit;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: 10px;
                }
                @keyframes notification-slide-in {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes notification-slide-out {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        // Add event listeners
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notification);
        });

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            this.removeNotification(notification);
        }, 5000);
    }

    removeNotification(notification) {
        notification.style.animation = 'notification-slide-out 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    startProgressMonitoring() {
        // Monitor progress every 5 seconds
        setInterval(() => {
            this.monitorTimers();
            this.checkAchievements();
        }, 5000);
    }

    monitorTimers() {
        // Check for expired timers or time-based events
        const now = Date.now();

        // Example: Check if player has been idle too long
        const lastActivity = localStorage.getItem('dwmc_last_activity');
        if (lastActivity && now - parseInt(lastActivity) > 1800000) { // 30 minutes
            this.showNotification('Extended inactivity detected. Security protocols activated.', 'warning');
        }
    }

    checkAchievements() {
        // Check for special achievements
        const achievements = JSON.parse(localStorage.getItem('dwmc_achievements') || '[]');

        // Speed achievement
        if (this.phases.surface.completed &&
            this.phases.surface.completion_time - this.phases.surface.access_time < 600000 && // 10 minutes
            !achievements.includes('speed_hacker')) {
            achievements.push('speed_hacker');
            this.showNotification('Achievement unlocked: Speed Hacker', 'success');
        }

        // Persistence achievement
        if (this.phases.deep.keys.length >= 5 && !achievements.includes('key_collector')) {
            achievements.push('key_collector');
            this.showNotification('Achievement unlocked: Key Collector', 'success');
        }

        localStorage.setItem('dwmc_achievements', JSON.stringify(achievements));
    }

    broadcastProgress() {
        // Send progress to any listening components
        window.dispatchEvent(new CustomEvent('progressBroadcast', {
            detail: {
                phases: this.phases,
                currentPhase: this.getCurrentPhase(),
                overallProgress: this.getOverallProgress()
            }
        }));
    }

    playSuccessSound() {
        const audio = document.querySelector('#success-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        }
    }

    // Debug methods
    debugUnlockPhase(phase) {
        this.completePhase(phase);
    }

    debugResetProgress() {
        localStorage.removeItem('dwmc_progress');
        localStorage.removeItem('dwmc_achievements');
        this.loadProgress();
    }

    debugShowProgress() {
        console.log('Current Progress:', this.phases);
        console.log('Overall Progress:', this.getOverallProgress() + '%');
        console.log('Current Phase:', this.getCurrentPhase());
    }
}

// Initialize progress tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.progressTracker = new ProgressTracker();
});

// Export for manual initialization
window.ProgressTracker = ProgressTracker;