/* Deep Web Mining Collective - Timer System */

class TimerSystem {
    constructor() {
        this.timers = new Map();
        this.intervals = new Map();
        this.callbacks = new Map();

        this.initializeDefaultTimers();
        this.startSystemMonitoring();
    }

    initializeDefaultTimers() {
        // Phase-based soft timers (no real consequences)
        this.createTimer('phase_soft', 30 * 60 * 1000, () => {
            this.showTimeWarning('Recommended phase completion time exceeded');
        });

        // Hard security timer (creates tension)
        this.createTimer('security_trace', 10 * 60 * 1000, () => {
            this.triggerSecurityAlert();
        });

        // Activity timeout
        this.createTimer('activity_timeout', 20 * 60 * 1000, () => {
            this.handleInactivityTimeout();
        });

        // Connection stability timer
        this.createTimer('connection_unstable', 5 * 60 * 1000, () => {
            this.simulateConnectionIssues();
        });
    }

    createTimer(name, duration, callback, options = {}) {
        const timer = {
            name,
            duration,
            startTime: Date.now(),
            endTime: Date.now() + duration,
            callback,
            isActive: true,
            isPaused: false,
            remainingTime: duration,
            ...options
        };

        this.timers.set(name, timer);
        this.callbacks.set(name, callback);

        // Start countdown interval
        const interval = setInterval(() => {
            this.updateTimer(name);
        }, 1000);

        this.intervals.set(name, interval);

        // Create visual timer if requested
        if (options.showVisual) {
            this.createVisualTimer(timer);
        }

        return timer;
    }

    updateTimer(name) {
        const timer = this.timers.get(name);
        if (!timer || !timer.isActive || timer.isPaused) return;

        const now = Date.now();
        timer.remainingTime = Math.max(0, timer.endTime - now);

        // Update visual timer if it exists
        this.updateVisualTimer(name, timer);

        // Check if timer expired
        if (timer.remainingTime <= 0) {
            this.expireTimer(name);
        } else if (timer.remainingTime <= 60000 && !timer.warningShown) {
            // Show warning at 1 minute remaining
            timer.warningShown = true;
            this.showTimerWarning(name, timer);
        }
    }

    expireTimer(name) {
        const timer = this.timers.get(name);
        const callback = this.callbacks.get(name);

        if (timer && callback) {
            callback(timer);
        }

        this.stopTimer(name);
    }

    stopTimer(name) {
        const interval = this.intervals.get(name);
        if (interval) {
            clearInterval(interval);
            this.intervals.delete(name);
        }

        const timer = this.timers.get(name);
        if (timer) {
            timer.isActive = false;
        }

        // Remove visual timer
        this.removeVisualTimer(name);
    }

    pauseTimer(name) {
        const timer = this.timers.get(name);
        if (timer && timer.isActive) {
            timer.isPaused = true;
            timer.pausedAt = Date.now();
        }
    }

    resumeTimer(name) {
        const timer = this.timers.get(name);
        if (timer && timer.isPaused) {
            const pauseDuration = Date.now() - timer.pausedAt;
            timer.endTime += pauseDuration;
            timer.isPaused = false;
            delete timer.pausedAt;
        }
    }

    resetTimer(name, newDuration = null) {
        this.stopTimer(name);

        const timer = this.timers.get(name);
        if (timer) {
            const duration = newDuration || timer.duration;
            this.createTimer(name, duration, this.callbacks.get(name), timer);
        }
    }

    createVisualTimer(timer) {
        // Create timer display element
        const timerElement = document.createElement('div');
        timerElement.id = `timer-${timer.name}`;
        timerElement.className = 'visual-timer';

        timerElement.innerHTML = `
            <div class="timer-header">
                <span class="timer-label">${this.getTimerLabel(timer.name)}</span>
                <span class="timer-status">ACTIVE</span>
            </div>
            <div class="timer-display">
                <span class="timer-time">--:--</span>
            </div>
            <div class="timer-progress">
                <div class="timer-progress-bar"></div>
            </div>
        `;

        // Add styles if not present
        if (!document.querySelector('#timer-styles')) {
            this.addTimerStyles();
        }

        // Add to timer container or create one
        let container = document.querySelector('.timer-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'timer-container';
            document.body.appendChild(container);
        }

        container.appendChild(timerElement);
    }

    updateVisualTimer(name, timer) {
        const element = document.querySelector(`#timer-${name}`);
        if (!element) return;

        const timeDisplay = element.querySelector('.timer-time');
        const progressBar = element.querySelector('.timer-progress-bar');
        const status = element.querySelector('.timer-status');

        if (timeDisplay) {
            timeDisplay.textContent = this.formatTime(timer.remainingTime);
        }

        if (progressBar) {
            const progress = ((timer.duration - timer.remainingTime) / timer.duration) * 100;
            progressBar.style.width = `${progress}%`;

            // Change color based on remaining time
            if (timer.remainingTime <= 60000) {
                progressBar.style.background = '#ff0000';
                element.classList.add('timer-critical');
            } else if (timer.remainingTime <= 300000) {
                progressBar.style.background = '#ffff00';
                element.classList.add('timer-warning');
            }
        }

        if (status) {
            if (timer.isPaused) {
                status.textContent = 'PAUSED';
                status.style.color = '#ffff00';
            } else if (timer.remainingTime <= 60000) {
                status.textContent = 'CRITICAL';
                status.style.color = '#ff0000';
            } else {
                status.textContent = 'ACTIVE';
                status.style.color = '#00ff00';
            }
        }
    }

    removeVisualTimer(name) {
        const element = document.querySelector(`#timer-${name}`);
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    getTimerLabel(name) {
        const labels = {
            'phase_soft': 'Phase Timer',
            'security_trace': 'Security Trace',
            'activity_timeout': 'Activity Monitor',
            'connection_unstable': 'Connection Status'
        };

        return labels[name] || name.toUpperCase();
    }

    formatTime(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    startSystemMonitoring() {
        // Monitor for user activity
        let lastActivity = Date.now();

        const updateActivity = () => {
            lastActivity = Date.now();
            localStorage.setItem('dwmc_last_activity', lastActivity.toString());
        };

        // Track various user interactions
        ['click', 'keydown', 'mousemove', 'scroll'].forEach(event => {
            document.addEventListener(event, updateActivity, { passive: true });
        });

        // Check activity every 30 seconds
        setInterval(() => {
            const timeSinceActivity = Date.now() - lastActivity;

            if (timeSinceActivity > 10 * 60 * 1000) { // 10 minutes
                this.handleInactivityTimeout();
            }
        }, 30000);
    }

    triggerSecurityAlert() {
        const messages = [
            'WARNING: Unauthorized access detected',
            'ALERT: Security breach in progress',
            'CRITICAL: IP trace initiated',
            'URGENT: Connection being monitored'
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];

        // Show dramatic security alert
        if (window.glitchEffects) {
            window.glitchEffects.showSystemAlert(message, 'error');
            window.glitchEffects.intensifyGlitches();
        }

        // Start fake IP trace timer
        this.startIPTrace();

        // Play alert sound
        this.playAlertSound();
    }

    startIPTrace() {
        let traceProgress = 0;
        const traceTimer = this.createTimer('ip_trace', 5 * 60 * 1000, () => {
            this.completeIPTrace();
        }, { showVisual: true });

        // Show trace progress updates
        const traceInterval = setInterval(() => {
            traceProgress += 10 + Math.random() * 15;

            if (traceProgress >= 100) {
                this.showTraceComplete();
                clearInterval(traceInterval);
            } else {
                this.showTraceProgress(traceProgress);
            }
        }, 10000);
    }

    showTraceProgress(progress) {
        const messages = [
            `Tracing IP address... ${Math.floor(progress)}%`,
            `Analyzing network packets... ${Math.floor(progress)}%`,
            `Identifying ISP location... ${Math.floor(progress)}%`,
            `Cross-referencing databases... ${Math.floor(progress)}%`
        ];

        const message = messages[Math.floor(progress / 25)] || messages[0];

        if (window.progressTracker) {
            window.progressTracker.showNotification(message, 'warning');
        }
    }

    completeIPTrace() {
        const fakeIPs = [
            '192.168.1.100',
            '10.0.0.15',
            '172.16.0.23',
            '203.0.113.45'
        ];

        const fakeIP = fakeIPs[Math.floor(Math.random() * fakeIPs.length)];

        if (window.glitchEffects) {
            window.glitchEffects.showSystemAlert(
                `IP TRACE COMPLETE: ${fakeIP}\nLOCATION: [CLASSIFIED]\nRECOMMENDATION: DISCONNECT IMMEDIATELY`,
                'error'
            );
        }

        // Reset trace timer
        this.resetTimer('security_trace', 15 * 60 * 1000); // 15 minutes next time
    }

    handleInactivityTimeout() {
        if (window.progressTracker) {
            window.progressTracker.showNotification(
                'Extended inactivity detected. Session may be compromised.',
                'warning'
            );
        }

        // Simulate connection degradation
        this.simulateConnectionIssues();
    }

    simulateConnectionIssues() {
        const issues = [
            'Connection unstable - packet loss detected',
            'Network latency increased - possible monitoring',
            'Proxy tunnel compromised - switching routes',
            'Deep web node unresponsive - finding alternative'
        ];

        const issue = issues[Math.floor(Math.random() * issues.length)];

        if (window.progressTracker) {
            window.progressTracker.showNotification(issue, 'warning');
        }

        // Briefly show connection problems
        this.showConnectionGlitch();
    }

    showConnectionGlitch() {
        document.body.style.filter = 'blur(1px) brightness(0.8)';

        setTimeout(() => {
            document.body.style.filter = '';
        }, 1000 + Math.random() * 2000);

        if (window.glitchEffects) {
            window.glitchEffects.triggerScreenGlitch();
        }
    }

    showTimeWarning(message) {
        if (window.progressTracker) {
            window.progressTracker.showNotification(message, 'warning');
        }
    }

    showTimerWarning(name, timer) {
        const warningMessages = {
            'security_trace': 'WARNING: Security trace almost complete!',
            'activity_timeout': 'WARNING: Activity timeout imminent!',
            'connection_unstable': 'WARNING: Connection becoming unstable!'
        };

        const message = warningMessages[name] || `Timer ${name} expiring soon!`;
        this.showTimeWarning(message);
    }

    addTimerStyles() {
        const styles = document.createElement('style');
        styles.id = 'timer-styles';
        styles.textContent = `
            .timer-container {
                position: fixed;
                top: 20px;
                left: 20px;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .visual-timer {
                background: #1a1a1a;
                border: 2px solid #00ff00;
                color: #ffffff;
                padding: 15px;
                min-width: 200px;
                font-family: 'Courier New', monospace;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
            }

            .visual-timer.timer-warning {
                border-color: #ffff00;
                box-shadow: 0 0 10px rgba(255, 255, 0, 0.3);
            }

            .visual-timer.timer-critical {
                border-color: #ff0000;
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
                animation: timer-pulse 1s infinite;
            }

            .timer-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                font-size: 0.8em;
            }

            .timer-label {
                color: #cccccc;
                text-transform: uppercase;
            }

            .timer-status {
                color: #00ff00;
                font-weight: bold;
            }

            .timer-display {
                text-align: center;
                margin-bottom: 10px;
            }

            .timer-time {
                font-size: 1.5em;
                font-weight: bold;
                color: #00ff00;
                text-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
            }

            .timer-progress {
                height: 4px;
                background: #333333;
                border: 1px solid #666666;
                overflow: hidden;
            }

            .timer-progress-bar {
                height: 100%;
                background: #00ff00;
                transition: width 0.5s ease;
                box-shadow: 0 0 5px rgba(0, 255, 0, 0.5);
            }

            @keyframes timer-pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }

            @media (max-width: 768px) {
                .timer-container {
                    top: 10px;
                    left: 10px;
                    right: 10px;
                }

                .visual-timer {
                    min-width: auto;
                    padding: 10px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    playAlertSound() {
        const audio = document.querySelector('#alert-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 0.6;
            audio.play().catch(() => {});
        }
    }

    // Public API methods
    getTimer(name) {
        return this.timers.get(name);
    }

    getAllTimers() {
        return Array.from(this.timers.values());
    }

    isTimerActive(name) {
        const timer = this.timers.get(name);
        return timer && timer.isActive && !timer.isPaused;
    }

    getRemainingTime(name) {
        const timer = this.timers.get(name);
        return timer ? timer.remainingTime : 0;
    }

    // Debug methods
    debugAddTime(name, additionalTime) {
        const timer = this.timers.get(name);
        if (timer) {
            timer.endTime += additionalTime;
            timer.remainingTime += additionalTime;
        }
    }

    debugExpireTimer(name) {
        this.expireTimer(name);
    }

    destroy() {
        // Clean up all timers and intervals
        this.intervals.forEach(interval => clearInterval(interval));
        this.intervals.clear();
        this.timers.clear();
        this.callbacks.clear();

        // Remove timer container
        const container = document.querySelector('.timer-container');
        if (container) {
            container.remove();
        }
    }
}

// Initialize timer system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timerSystem = new TimerSystem();
});

// Export for manual initialization
window.TimerSystem = TimerSystem;