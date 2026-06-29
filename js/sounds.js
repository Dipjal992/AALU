// ============================================
// SWAD RESTRO - CLICK & HOVER SOUND EFFECTS
// ============================================

class SoundEffects {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.init();
    }

    init() {
        // Create audio context on first user interaction
        document.addEventListener('click', () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.createSounds();
            }
        }, { once: true });

        this.attachSoundEvents();
    }

    createSounds() {
        // Hover sound - soft click
        this.sounds.hover = this.createOscillatorSound(600, 0.05, 'sine', 0.1);
        
        // Click sound - sharper click
        this.sounds.click = this.createOscillatorSound(800, 0.08, 'sine', 0.15);
        
        // Add to cart sound - pleasant ding
        this.sounds.addToCart = this.createOscillatorSound(1000, 0.1, 'triangle', 0.2);
        
        // Checkout sound - success chime
        this.sounds.checkout = this.createOscillatorSound([523, 659, 784], 0.15, 'sine', 0.25);
        
        // Remove item sound
        this.sounds.remove = this.createOscillatorSound(300, 0.08, 'sawtooth', 0.1);
    }

    createOscillatorSound(frequency, duration, type, volume) {
        return { frequency, duration, type, volume };
    }

    play(soundName) {
        if (!this.enabled || !this.audioContext || !this.sounds[soundName]) return;

        const sound = this.sounds[soundName];
        const frequencies = Array.isArray(sound.frequency) ? sound.frequency : [sound.frequency];

        frequencies.forEach((freq, index) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.type = sound.type;
            oscillator.frequency.setValueAtTime(freq, this.audioContext.currentTime + index * 0.1);

            gainNode.gain.setValueAtTime(sound.volume, this.audioContext.currentTime + index * 0.1);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + sound.duration + index * 0.1);

            oscillator.start(this.audioContext.currentTime + index * 0.1);
            oscillator.stop(this.audioContext.currentTime + sound.duration + index * 0.1);
        });
    }

    attachSoundEvents() {
        document.addEventListener('mouseover', (e) => {
            // Play hover sound on buttons and links
            if (e.target.matches('button, a, .menu-card, .cat-btn, .btn')) {
                this.play('hover');
            }
        });

        document.addEventListener('click', (e) => {
            // Play click sound on buttons
            if (e.target.matches('button, .btn')) {
                this.play('click');
            }
            // Play add to cart sound
            if (e.target.matches('.add-to-cart-btn')) {
                setTimeout(() => this.play('addToCart'), 100);
            }
            // Play checkout sound
            if (e.target.matches('#checkoutBtn')) {
                setTimeout(() => this.play('checkout'), 100);
            }
            // Play remove sound
            if (e.target.matches('.cart-item-remove')) {
                setTimeout(() => this.play('remove'), 100);
            }
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// Initialize sounds
const soundEffects = new SoundEffects();