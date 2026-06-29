// ============================================
// SWAD RESTRO - LOADER WITH COFFEE FILL & GRINDER
// ============================================

class Loader {
    constructor() {
        this.loaderWrapper = document.getElementById('loader');
        this.coffeeFill = document.getElementById('coffeeFill');
        this.loaderBar = document.getElementById('loaderBar');
        this.coffeeGrinder = document.getElementById('coffeeGrinder');
        this.progress = 0;
        this.init();
    }

    init() {
        this.animateLoader();
        this.simulateLoading();
    }

    animateLoader() {
        // Grinder rotation animation
        let angle = 0;
        setInterval(() => {
            if (this.coffeeGrinder) {
                angle += 15;
                this.coffeeGrinder.style.transform = `rotate(${angle}deg)`;
            }
        }, 100);
    }

    simulateLoading() {
        const interval = setInterval(() => {
            this.progress += Math.random() * 15;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(interval);
                this.complete();
            }

            this.updateProgress();
        }, 200);
    }

    updateProgress() {
        // Update coffee fill
        if (this.coffeeFill) {
            this.coffeeFill.style.height = `${this.progress}%`;
        }

        // Update progress bar
        if (this.loaderBar) {
            this.loaderBar.style.width = `${this.progress}%`;
        }
    }

    complete() {
        setTimeout(() => {
            this.loaderWrapper.classList.add('hidden');
            
            // Remove loader from DOM after animation
            setTimeout(() => {
                this.loaderWrapper.style.display = 'none';
            }, 500);
        }, 300);
    }
}

// Initialize loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Loader();
});