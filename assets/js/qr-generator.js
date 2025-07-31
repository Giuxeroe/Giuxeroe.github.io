/* Deep Web Mining Collective - QR Code Generator */

class QRGenerator {
    constructor() {
        this.qrLib = null;
        this.loadQRLibrary();
        this.initializeGenerator();
    }

    async loadQRLibrary() {
        // Load QR code library dynamically
        if (typeof QRCode === 'undefined') {
            await this.loadScript('https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js');
        }
        this.qrLib = QRCode;
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    initializeGenerator() {
        this.phaseData = {
            phase1: {
                spawn_welcome: {
                    url: `${window.location.origin}/`,
                    coordinates: '0, 64, 0',
                    hint: 'SURFACE_BREACH_2024'
                },
                ascii_terminal: {
                    url: `${window.location.origin}/phases/surface/entry-point.html`,
                    coordinates: '50, 70, -30',
                    hint: 'First gateway discovered'
                },
                corrupted_map: {
                    url: `${window.location.origin}/phases/breach/network-map.html`,
                    coordinates: '120, 65, 80',
                    hint: 'Network topology revealed'
                }
            },
            phase2: {
                bunker_entrance: {
                    url: `${window.location.origin}/phases/breach/terminal.html`,
                    coordinates: '-247, 45, 892',
                    hint: 'TERMINAL_ACCESS_7791'
                },
                network_node_1: {
                    url: `${window.location.origin}/phases/breach/encrypted-files.html?node=1`,
                    coordinates: '156, 78, -334',
                    hint: 'Alpha node coordinates'
                },
                network_node_2: {
                    url: `${window.location.origin}/phases/breach/encrypted-files.html?node=2`,
                    coordinates: '-89, 82, 445',
                    hint: 'Beta node coordinates'
                },
                network_node_3: {
                    url: `${window.location.origin}/phases/breach/encrypted-files.html?node=3`,
                    coordinates: '334, 91, -178',
                    hint: 'Gamma node coordinates'
                },
                terminal_access: {
                    url: `${window.location.origin}/phases/deep/irc-chat.html`,
                    coordinates: '-445, 23, 267',
                    hint: 'Deep web access unlocked'
                }
            },
            phase3: {
                missing_person_1: {
                    url: `${window.location.origin}/phases/deep/missing-persons.html?id=1`,
                    coordinates: '678, 67, -123',
                    hint: 'Subject 001 - Location confirmed'
                },
                missing_person_2: {
                    url: `${window.location.origin}/phases/deep/missing-persons.html?id=2`,
                    coordinates: '-234, 89, 567',
                    hint: 'Subject 002 - Last seen mining'
                },
                missing_person_3: {
                    url: `${window.location.origin}/phases/deep/missing-persons.html?id=3`,
                    coordinates: '789, 45, -890',
                    hint: 'Subject 003 - Signal lost'
                },
                irc_logs: {
                    url: `${window.location.origin}/phases/deep/live-streams.html`,
                    coordinates: '123, 78, 456',
                    hint: 'IRC communications intercepted'
                },
                streaming_coords: {
                    url: `${window.location.origin}/phases/red-room/final-access.html`,
                    coordinates: '0, 100, 0',
                    hint: 'Final location revealed'
                }
            },
            final: {
                key_fragment_1: {
                    url: `${window.location.origin}/phases/red-room/revelation.html?key=1`,
                    coordinates: '111, 111, 111',
                    hint: 'Key fragment Alpha'
                },
                key_fragment_2: {
                    url: `${window.location.origin}/phases/red-room/revelation.html?key=2`,
                    coordinates: '222, 222, 222',
                    hint: 'Key fragment Beta'
                },
                key_fragment_3: {
                    url: `${window.location.origin}/phases/red-room/revelation.html?key=3`,
                    coordinates: '333, 333, 333',
                    hint: 'Key fragment Gamma'
                },
                revelation: {
                    url: `${window.location.origin}/phases/red-room/revelation.html`,
                    coordinates: '0, 100, 0',
                    hint: 'The truth revealed'
                }
            }
        };
    }

    async generateQRCode(data, options = {}) {
        if (!this.qrLib) {
            console.error('QR library not loaded');
            return null;
        }

        const defaultOptions = {
            width: 256,
            height: 256,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            },
            errorCorrectionLevel: 'M'
        };

        const qrOptions = { ...defaultOptions, ...options };

        try {
            // Generate QR code as data URL
            const dataURL = await this.qrLib.toDataURL(data, qrOptions);
            return dataURL;
        } catch (error) {
            console.error('QR generation error:', error);
            return null;
        }
    }

    async generatePhaseQRCodes(phase) {
        const phaseInfo = this.phaseData[`phase${phase}`] || this.phaseData.final;
        const qrCodes = {};

        for (const [imageName, data] of Object.entries(phaseInfo)) {
            // Create QR data with embedded information
            const qrData = JSON.stringify({
                url: data.url,
                phase: phase,
                coordinates: data.coordinates,
                hint: data.hint,
                timestamp: Date.now(),
                checksum: this.generateChecksum(data.url + data.hint)
            });

            const qrCodeDataURL = await this.generateQRCode(qrData, {
                width: 128,
                height: 128,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });

            if (qrCodeDataURL) {
                qrCodes[imageName] = {
                    dataURL: qrCodeDataURL,
                    data: data,
                    qrData: qrData
                };
            }
        }

        return qrCodes;
    }

    async generateAllQRCodes() {
        const allQRCodes = {};

        // Generate QR codes for all phases
        for (let phase = 1; phase <= 4; phase++) {
            allQRCodes[`phase${phase}`] = await this.generatePhaseQRCodes(phase);
        }

        return allQRCodes;
    }

    generateChecksum(data) {
        // Simple checksum for data integrity
        let hash = 0;
        for (let i = 0; i < data.length; i++) {
            const char = data.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }

    async createMinecraftImages(phase) {
        const qrCodes = await this.generatePhaseQRCodes(phase);
        const images = {};

        for (const [imageName, qrInfo] of Object.entries(qrCodes)) {
            const canvas = await this.createMinecraftImageCanvas(qrInfo);
            if (canvas) {
                images[imageName] = {
                    canvas: canvas,
                    dataURL: canvas.toDataURL('image/png'),
                    filename: `${imageName}.png`,
                    coordinates: qrInfo.data.coordinates,
                    hint: qrInfo.data.hint
                };
            }
        }

        return images;
    }

    async createMinecraftImageCanvas(qrInfo) {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');

        // Create base image with QR code
        const qrImage = new Image();

        return new Promise((resolve) => {
            qrImage.onload = () => {
                // Fill background
                ctx.fillStyle = '#f0f0f0';
                ctx.fillRect(0, 0, 128, 128);

                // Draw QR code (smaller, in corner)
                ctx.drawImage(qrImage, 80, 80, 48, 48);

                // Add decorative border
                ctx.strokeStyle = '#333333';
                ctx.lineWidth = 2;
                ctx.strokeRect(0, 0, 128, 128);

                // Add subtle pattern to make it look like Minecraft artwork
                this.addMinecraftTexture(ctx);

                // Add coordinate hint (very subtle)
                ctx.fillStyle = '#cccccc';
                ctx.font = '8px monospace';
                ctx.fillText(qrInfo.data.coordinates, 4, 12);

                resolve(canvas);
            };

            qrImage.src = qrInfo.dataURL;
        });
    }

    addMinecraftTexture(ctx) {
        // Add subtle pixelated texture
        const imageData = ctx.getImageData(0, 0, 128, 128);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
            // Add slight noise
            const noise = (Math.random() - 0.5) * 10;
            data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
        }

        ctx.putImageData(imageData, 0, 0);

        // Add grid overlay for minecraft feel
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;

        for (let x = 0; x < 128; x += 8) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 128);
            ctx.stroke();
        }

        for (let y = 0; y < 128; y += 8) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(128, y);
            ctx.stroke();
        }
    }

    downloadImage(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async downloadAllImages(phase) {
        const images = await this.createMinecraftImages(phase);

        for (const [imageName, imageInfo] of Object.entries(images)) {
            this.downloadImage(imageInfo.canvas, imageInfo.filename);

            // Small delay between downloads
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return images;
    }

    createQRGeneratorInterface() {
        const container = document.createElement('div');
        container.id = 'qr-generator-interface';
        container.innerHTML = `
            <div class="qr-generator-panel">
                <h3>QR Code Generator - Deep Web Mining Collective</h3>
                <div class="generator-controls">
                    <label for="phase-select">Select Phase:</label>
                    <select id="phase-select">
                        <option value="1">Phase 1 - Surface Discovery</option>
                        <option value="2">Phase 2 - First Breach</option>
                        <option value="3">Phase 3 - Deep Web Access</option>
                        <option value="4">Phase 4 - Red Room Finale</option>
                    </select>

                    <button id="generate-phase-btn" class="generator-btn">Generate Phase QR Codes</button>
                    <button id="download-images-btn" class="generator-btn">Download Minecraft Images</button>
                    <button id="generate-all-btn" class="generator-btn">Generate All QR Codes</button>
                </div>

                <div class="qr-preview" id="qr-preview">
                    <!-- Generated QR codes will appear here -->
                </div>

                <div class="coordinates-list" id="coordinates-list">
                    <h4>Minecraft Coordinates:</h4>
                    <div id="coordinates-display"></div>
                </div>
            </div>
        `;

        // Add styles
        if (!document.querySelector('#qr-generator-styles')) {
            const styles = document.createElement('style');
            styles.id = 'qr-generator-styles';
            styles.textContent = `
                .qr-generator-panel {
                    background: #1a1a1a;
                    border: 2px solid #00ff00;
                    color: #ffffff;
                    padding: 20px;
                    margin: 20px;
                    font-family: 'Courier New', monospace;
                }

                .generator-controls {
                    margin-bottom: 20px;
                }

                .generator-controls label {
                    display: block;
                    margin-bottom: 5px;
                    color: #00ff00;
                }

                .generator-controls select {
                    background: #000000;
                    border: 1px solid #00ff00;
                    color: #ffffff;
                    padding: 5px;
                    margin-bottom: 10px;
                    width: 100%;
                    max-width: 300px;
                }

                .generator-btn {
                    background: #000000;
                    border: 2px solid #00ff00;
                    color: #00ff00;
                    padding: 10px 15px;
                    margin: 5px;
                    cursor: pointer;
                    font-family: inherit;
                    transition: all 0.3s ease;
                }

                .generator-btn:hover {
                    background: #00ff00;
                    color: #000000;
                }

                .qr-preview {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 15px;
                    margin-bottom: 20px;
                }

                .qr-item {
                    text-align: center;
                    border: 1px solid #333333;
                    padding: 10px;
                }

                .qr-item img {
                    max-width: 100%;
                    height: auto;
                    border: 1px solid #666666;
                }

                .qr-item .qr-label {
                    color: #00ff00;
                    font-size: 0.8em;
                    margin-top: 5px;
                }

                .coordinates-list {
                    background: rgba(0, 0, 0, 0.5);
                    padding: 15px;
                    border: 1px solid #333333;
                }

                .coordinate-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                    padding: 5px;
                    border-left: 3px solid #00ff00;
                    padding-left: 10px;
                }

                .coordinate-location {
                    color: #00ffff;
                }
            `;
            document.head.appendChild(styles);
        }

        return container;
    }

    initializeInterface() {
        const interface = this.createQRGeneratorInterface();
        document.body.appendChild(interface);

        // Bind event listeners
        document.getElementById('generate-phase-btn').addEventListener('click', () => {
            const phase = document.getElementById('phase-select').value;
            this.displayPhaseQRCodes(phase);
        });

        document.getElementById('download-images-btn').addEventListener('click', () => {
            const phase = document.getElementById('phase-select').value;
            this.downloadAllImages(phase);
        });

        document.getElementById('generate-all-btn').addEventListener('click', () => {
            this.displayAllQRCodes();
        });
    }

    async displayPhaseQRCodes(phase) {
        const preview = document.getElementById('qr-preview');
        const coordinatesDisplay = document.getElementById('coordinates-display');

        preview.innerHTML = '<div class="loading">Generating QR codes...</div>';
        coordinatesDisplay.innerHTML = '';

        try {
            const qrCodes = await this.generatePhaseQRCodes(phase);
            preview.innerHTML = '';

            for (const [imageName, qrInfo] of Object.entries(qrCodes)) {
                const qrItem = document.createElement('div');
                qrItem.className = 'qr-item';
                qrItem.innerHTML = `
                    <img src="${qrInfo.dataURL}" alt="${imageName}">
                    <div class="qr-label">${imageName}</div>
                `;
                preview.appendChild(qrItem);

                // Add to coordinates list
                const coordItem = document.createElement('div');
                coordItem.className = 'coordinate-item';
                coordItem.innerHTML = `
                    <span>${imageName}</span>
                    <span class="coordinate-location">${qrInfo.data.coordinates}</span>
                `;
                coordinatesDisplay.appendChild(coordItem);
            }
        } catch (error) {
            preview.innerHTML = '<div class="error">Error generating QR codes</div>';
            console.error('QR generation error:', error);
        }
    }

    async displayAllQRCodes() {
        const preview = document.getElementById('qr-preview');
        preview.innerHTML = '<div class="loading">Generating all QR codes...</div>';

        try {
            const allQRCodes = await this.generateAllQRCodes();
            preview.innerHTML = '';

            for (const [phase, qrCodes] of Object.entries(allQRCodes)) {
                const phaseHeader = document.createElement('h4');
                phaseHeader.textContent = phase.toUpperCase();
                phaseHeader.style.color = '#00ff00';
                phaseHeader.style.gridColumn = '1 / -1';
                preview.appendChild(phaseHeader);

                for (const [imageName, qrInfo] of Object.entries(qrCodes)) {
                    const qrItem = document.createElement('div');
                    qrItem.className = 'qr-item';
                    qrItem.innerHTML = `
                        <img src="${qrInfo.dataURL}" alt="${imageName}">
                        <div class="qr-label">${imageName}</div>
                    `;
                    preview.appendChild(qrItem);
                }
            }
        } catch (error) {
            preview.innerHTML = '<div class="error">Error generating QR codes</div>';
            console.error('QR generation error:', error);
        }
    }
}

// Export for use
window.QRGenerator = QRGenerator;

// Auto-initialize if we're on a generator page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('qr-generator') ||
        window.location.search.includes('generator=true')) {
        window.qrGenerator = new QRGenerator();

        // Wait for QR library to load before initializing interface
        setTimeout(() => {
            if (window.qrGenerator) {
                window.qrGenerator.initializeInterface();
            }
        }, 1000);
    }
});

// Console helper for manual QR generation
console.log('QR Generator loaded. Use window.qrGenerator to generate QR codes manually.');
console.log('Available methods:');
console.log('- generatePhaseQRCodes(phase): Generate QR codes for specific phase');
console.log('- downloadAllImages(phase): Download Minecraft images for phase');
console.log('- initializeInterface(): Show QR generator interface');