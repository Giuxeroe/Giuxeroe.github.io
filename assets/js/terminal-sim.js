/* Deep Web Mining Collective - Terminal Simulator */

class TerminalSimulator {
    constructor(element) {
        this.element = element;
        this.output = element.querySelector('.terminal-output');
        this.input = element.querySelector('.terminal-input');
        this.prompt = '[$] ';
        this.history = [];
        this.historyIndex = -1;
        this.currentPhase = this.getPhase();

        // Initialize commands based on phase
        this.commands = {
            'help': () => this.showCommands(),
            'ls': () => this.listFiles(),
            'cat': (file) => this.readFile(file),
            'clear': () => this.clearTerminal(),
            'whoami': () => this.showUser(),
            'pwd': () => this.showDirectory(),
            'cd': (dir) => this.changeDirectory(dir),
            'ps': () => this.showProcesses(),
            'netstat': () => this.showConnections(),
            'crack': (target) => this.crackPassword(target),
            'trace': (ip) => this.traceIP(ip),
            'decrypt': (file) => this.decryptFile(file),
            'scan': (target) => this.scanNetwork(target),
            'connect': (server) => this.connectToServer(server),
            'hack': (target) => this.hackTarget(target)
        };

        this.fileSystem = this.generateFileSystem();
        this.initializeTerminal();
    }

    initializeTerminal() {
        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        this.displayWelcomeMessage();
        this.playTypingSound();
    }

    getPhase() {
        const progress = JSON.parse(localStorage.getItem('dwmc_progress') || '{}');
        if (progress.final?.completed) return 4;
        if (progress.deep?.completed) return 3;
        if (progress.breach?.completed) return 2;
        return 1;
    }

    generateFileSystem() {
        const baseFiles = {
            'readme.txt': 'Welcome to Deep Web Mining Collective Terminal v2.3.1\nUnauthorized access is strictly prohibited.',
            'system.log': 'ERROR: Multiple failed authentication attempts detected\nWARNING: Intrusion detection system active',
            'users.db': 'ACCESS DENIED - Insufficient privileges'
        };

        if (this.currentPhase >= 2) {
            baseFiles['network.map'] = 'Node locations discovered:\n- Alpha: -247, 45, 892\n- Beta: 156, 78, -334\n- Gamma: -89, 82, 445';
            baseFiles['passwords.enc'] = 'Encrypted password database\nUse: decrypt passwords.enc';
        }

        if (this.currentPhase >= 3) {
            baseFiles['missing_persons.db'] = 'Database of missing individuals\nConnected to mining operations';
            baseFiles['irc_logs.txt'] = 'IRC chat logs from #deepweb\nContains operational coordinates';
        }

        return baseFiles;
    }

    displayWelcomeMessage() {
        const messages = [
            '=== DEEP WEB MINING COLLECTIVE ===',
            'Secure Terminal Access Point',
            'Unauthorized access will be traced and prosecuted',
            '',
            'Type "help" for available commands',
            ''
        ];

        messages.forEach((msg, index) => {
            setTimeout(() => {
                this.addOutput(msg, 'terminal-success');
            }, index * 300);
        });
    }

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            this.input.value = '';

            if (command) {
                this.history.push(command);
                this.historyIndex = this.history.length;
                this.processCommand(command);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        }

        this.playTypingSound();
    }

    processCommand(input) {
        this.addOutput(`${this.prompt}${input}`, 'terminal-command');

        const [cmd, ...args] = input.toLowerCase().split(' ');

        if (this.commands[cmd]) {
            const result = this.commands[cmd](...args);
            if (result) {
                this.addOutput(result, 'terminal-response');
            }
        } else {
            this.addOutput(`Command not found: ${cmd}`, 'terminal-error');
            this.playErrorSound();
        }

        this.scrollToBottom();
    }

    addOutput(text, className = 'terminal-response') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.textContent = text;
        this.output.appendChild(line);
    }

    showCommands() {
        const basicCommands = [
            'help     - Show this help message',
            'ls       - List files in current directory',
            'cat      - Read file contents',
            'clear    - Clear terminal screen',
            'whoami   - Show current user',
            'pwd      - Show current directory'
        ];

        const advancedCommands = [
            'crack    - Attempt to crack password',
            'trace    - Trace IP address',
            'decrypt  - Decrypt encrypted files',
            'scan     - Scan network for targets',
            'connect  - Connect to remote server',
            'hack     - Attempt to hack target'
        ];

        this.addOutput('Available Commands:', 'terminal-success');
        basicCommands.forEach(cmd => this.addOutput(cmd));

        if (this.currentPhase >= 2) {
            this.addOutput('\nAdvanced Commands:', 'terminal-warning');
            advancedCommands.forEach(cmd => this.addOutput(cmd));
        }
    }

    listFiles() {
        this.addOutput('Files in current directory:');
        Object.keys(this.fileSystem).forEach(file => {
            this.addOutput(`  ${file}`);
        });
    }

    readFile(filename) {
        if (!filename) {
            return 'Usage: cat <filename>';
        }

        if (this.fileSystem[filename]) {
            this.addOutput(`Contents of ${filename}:`, 'terminal-success');
            this.addOutput(this.fileSystem[filename]);
        } else {
            this.addOutput(`File not found: ${filename}`, 'terminal-error');
        }
    }

    clearTerminal() {
        this.output.innerHTML = '';
    }

    showUser() {
        const users = ['anonymous', 'root', 'miner_07', 'deep_access', 'collective_admin'];
        const user = users[Math.floor(Math.random() * users.length)];
        return `Current user: ${user}`;
    }

    showDirectory() {
        const dirs = ['/home/collective', '/var/mining/data', '/opt/deepweb', '/tmp/secure'];
        const dir = dirs[this.currentPhase - 1] || dirs[0];
        return `Current directory: ${dir}`;
    }

    changeDirectory(dir) {
        if (!dir) {
            return 'Usage: cd <directory>';
        }
        return `Changed directory to: ${dir}`;
    }

    showProcesses() {
        const processes = [
            'PID  COMMAND',
            '1234 mining_daemon',
            '5678 network_scanner',
            '9012 encryption_service',
            '3456 deep_web_crawler',
            '7890 steganography_tool'
        ];

        processes.forEach(proc => this.addOutput(proc));
    }

    showConnections() {
        const connections = [
            'Active Network Connections:',
            'tcp  0.0.0.0:22    0.0.0.0:*     LISTENING',
            'tcp  127.0.0.1:3306 0.0.0.0:*    LISTENING',
            'tcp  192.168.1.100:8080  ESTABLISHED'
        ];

        if (this.currentPhase >= 2) {
            connections.push('tcp  10.0.0.1:6667    CONNECTED (IRC)');
            connections.push('tcp  172.16.0.5:443   CONNECTED (DEEP WEB)');
        }

        connections.forEach(conn => this.addOutput(conn));
    }

    crackPassword(target) {
        if (!target) {
            return 'Usage: crack <target>';
        }

        this.addOutput(`Initiating brute force attack on ${target}...`, 'terminal-warning');

        setTimeout(() => {
            const progress = ['[████████████████████████████████████████] 100%'];
            progress.forEach(p => this.addOutput(p, 'terminal-success'));

            if (target === 'surface_portal') {
                this.addOutput('Password cracked: SURFACE_BREACH_2024', 'terminal-success');
                this.updateProgress('surface', { surface_password: 'SURFACE_BREACH_2024' });
            } else if (target === 'terminal_access' && this.currentPhase >= 2) {
                this.addOutput('Password cracked: TERMINAL_ACCESS_7791', 'terminal-success');
                this.updateProgress('breach', { terminal_password: 'TERMINAL_ACCESS_7791' });
            } else {
                this.addOutput('Access denied. Insufficient privileges.', 'terminal-error');
            }
        }, 2000);
    }

    traceIP(ip) {
        if (!ip) {
            return 'Usage: trace <ip_address>';
        }

        this.addOutput(`Tracing route to ${ip}...`, 'terminal-warning');

        const traceSteps = [
            `1  192.168.1.1      1.234 ms`,
            `2  10.0.0.1         5.678 ms`,
            `3  172.16.0.1       12.345 ms`,
            `4  ${ip}            ???.??? ms`
        ];

        traceSteps.forEach((step, index) => {
            setTimeout(() => {
                this.addOutput(step);
                if (index === traceSteps.length - 1) {
                    this.addOutput('WARNING: Counter-trace initiated!', 'terminal-error');
                    this.addOutput('Recommendation: Disconnect immediately!', 'terminal-error');
                }
            }, (index + 1) * 800);
        });
    }

    decryptFile(filename) {
        if (!filename) {
            return 'Usage: decrypt <filename>';
        }

        if (filename === 'passwords.enc' && this.currentPhase >= 2) {
            this.addOutput('Decrypting file...', 'terminal-warning');
            setTimeout(() => {
                this.addOutput('Decryption successful!', 'terminal-success');
                this.addOutput('admin:DEEP_WEB_MINING_COLLECTIVE');
                this.addOutput('guest:NETWORK_NODE_ACCESS');
                this.updateProgress('breach', { passwords_decrypted: true });
            }, 1500);
        } else {
            this.addOutput(`Cannot decrypt ${filename}: File not found or access denied`, 'terminal-error');
        }
    }

    scanNetwork(target) {
        if (!target) {
            return 'Usage: scan <target>';
        }

        this.addOutput(`Scanning ${target}...`, 'terminal-warning');

        setTimeout(() => {
            const results = [
                'Port 22:  OPEN  (SSH)',
                'Port 80:  OPEN  (HTTP)',
                'Port 443: OPEN  (HTTPS)',
                'Port 6667: OPEN (IRC)',
                'Port 8080: FILTERED'
            ];

            results.forEach(result => this.addOutput(result));

            if (this.currentPhase >= 3) {
                this.addOutput('Hidden service detected: .onion address found', 'terminal-success');
            }
        }, 1200);
    }

    connectToServer(server) {
        if (!server) {
            return 'Usage: connect <server>';
        }

        this.addOutput(`Connecting to ${server}...`, 'terminal-warning');

        setTimeout(() => {
            if (server.includes('irc') && this.currentPhase >= 3) {
                this.addOutput('Connected to IRC server', 'terminal-success');
                this.addOutput('Joined channel: #deepweb', 'terminal-success');
            } else {
                this.addOutput('Connection failed: Access denied', 'terminal-error');
            }
        }, 1000);
    }

    hackTarget(target) {
        if (!target) {
            return 'Usage: hack <target>';
        }

        this.addOutput(`Initiating hack on ${target}...`, 'terminal-warning');

        setTimeout(() => {
            if (Math.random() < 0.3) {
                this.addOutput('Hack successful! Access granted.', 'terminal-success');
            } else {
                this.addOutput('Hack failed. Target secured.', 'terminal-error');
                this.addOutput('WARNING: Intrusion detected. Trace initiated!', 'terminal-error');
            }
        }, 2000);
    }

    updateProgress(phase, data) {
        const progress = JSON.parse(localStorage.getItem('dwmc_progress') || '{}');
        progress[phase] = { ...progress[phase], ...data };
        localStorage.setItem('dwmc_progress', JSON.stringify(progress));

        // Trigger progress update event
        window.dispatchEvent(new CustomEvent('progressUpdate', { detail: progress }));
    }

    playTypingSound() {
        // Play typing sound effect if available
        const audio = document.querySelector('#typing-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {}); // Ignore errors
        }
    }

    playErrorSound() {
        // Play error sound effect if available
        const audio = document.querySelector('#error-sound');
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(() => {}); // Ignore errors
        }
    }

    scrollToBottom() {
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// Auto-initialize terminals when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const terminals = document.querySelectorAll('.terminal-container');
    terminals.forEach(terminal => {
        new TerminalSimulator(terminal);
    });
});

// Export for manual initialization
window.TerminalSimulator = TerminalSimulator;