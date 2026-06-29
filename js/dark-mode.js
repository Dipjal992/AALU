// ============================================
// SWAD RESTRO - DARK/LIGHT MODE TOGGLE
// ============================================

class DarkMode {
    constructor() {
        this.toggleBtn = document.getElementById('darkToggle');
        this.body = document.body;
        this.icon = this.toggleBtn.querySelector('i');
        this.init();
    }

    init() {
        // Check saved preference
        const savedMode = localStorage.getItem('swad-dark-mode');
        if (savedMode === 'dark') {
            this.enableDarkMode();
        }

        // Toggle on click
        this.toggleBtn.addEventListener('click', () => this.toggle());

        // Add transition class after page load
        setTimeout(() => {
            this.body.style.transition = 'background-color 0.4s, color 0.4s';
        }, 100);
    }

    toggle() {
        if (this.body.classList.contains('dark-mode')) {
            this.disableDarkMode();
        } else {
            this.enableDarkMode();
        }
    }

    enableDarkMode() {
        this.body.classList.add('dark-mode');
        this.icon.classList.remove('fa-moon');
        this.icon.classList.add('fa-sun');
        localStorage.setItem('swad-dark-mode', 'dark');
        this.showToast('Dark mode activated 🌙');
    }

    disableDarkMode() {
        this.body.classList.remove('dark-mode');
        this.icon.classList.remove('fa-sun');
        this.icon.classList.add('fa-moon');
        localStorage.setItem('swad-dark-mode', 'light');
        this.showToast('Light mode activated ☀️');
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialize dark mode
document.addEventListener('DOMContentLoaded', () => {
    new DarkMode();
});