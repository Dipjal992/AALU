// ============================================
// SWAD RESTRO - MAIN JAVASCRIPT
// ============================================

class SwadRestro {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupSmoothScroll();
        this.setupActiveNavOnScroll();
        this.setupMobileMenu();
        this.setupQRCode();
        this.setupForms();
        this.setupImageFallbacks();
        console.log('🍽️ Swad Restro - Ready to serve!');
    }

    setupNavigation() {
        const navbar = document.getElementById('navbar');
        
        // Shrink navbar on scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    document.getElementById('navLinks')?.classList.remove('active');
                    document.getElementById('hamburger')?.classList.remove('active');

                    const offset = 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 150;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');

        if (hamburger && navLinks) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navLinks.classList.toggle('active');
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                }
            });
        }
    }

    setupQRCode() {
        const qrCode = document.getElementById('qrCode');
        if (qrCode) {
            // Generate QR code for table ordering
            const qrCanvas = document.createElement('canvas');
            qrCanvas.width = 150;
            qrCanvas.height = 150;
            const ctx = qrCanvas.getContext('2d');
            
            // Simple QR-like pattern (replace with actual QR library in production)
            ctx.fillStyle = '#3C2415';
            ctx.fillRect(0, 0, 150, 150);
            ctx.fillStyle = '#FAF7F2';
            
            // Draw QR pattern
            for (let i = 0; i < 7; i++) {
                for (let j = 0; j < 7; j++) {
                    if ((i + j) % 3 !== 0) {
                        ctx.fillRect(15 + i * 18, 15 + j * 18, 12, 12);
                    }
                }
            }
            
            // Corner markers
            const corners = [[10, 10], [110, 10], [10, 110]];
            corners.forEach(([x, y]) => {
                ctx.fillStyle = '#FAF7F2';
                ctx.fillRect(x, y, 30, 30);
                ctx.fillStyle = '#3C2415';
                ctx.fillRect(x + 5, y + 5, 20, 20);
            });
            
            qrCode.innerHTML = '';
            qrCode.appendChild(qrCanvas);
        }
    }

    setupForms() {
        // Contact form
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
                contactForm.reset();
            });
        }
    }

    setupImageFallbacks() {
        // Add error handling for images
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', function() {
                this.src = 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400';
                this.onerror = null;
            });
        });
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SwadRestro();
});

// Handle page visibility for Three.js performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause heavy animations
        console.log('Page hidden - pausing animations');
    } else {
        // Resume animations
        console.log('Page visible - resuming animations');
    }
});

// Service Worker Registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // navigator.serviceWorker.register('/sw.js').catch(err => {
        //     console.log('ServiceWorker registration failed:', err);
        // });
    });
}