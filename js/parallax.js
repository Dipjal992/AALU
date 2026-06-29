// ============================================
// SWAD RESTRO - PARALLAX SCROLLING EFFECTS
// ============================================

class ParallaxEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupParallaxLayers();
        this.setupFloatingElements();
        this.setupCounterAnimation();
    }

    setupScrollAnimations() {
        // Register ScrollTrigger
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Animate section headers on scroll
        document.querySelectorAll('.section-header').forEach(header => {
            this.observeElement(header, () => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            });
            header.style.opacity = '0';
            header.style.transform = 'translateY(30px)';
            header.style.transition = 'all 0.8s ease';
        });

        // Animate cards on scroll
        document.querySelectorAll('.menu-card, .event-card, .blog-card, .info-card').forEach(card => {
            this.observeElement(card, () => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 0.1);
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    }

    setupParallaxLayers() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Parallax for hero section
            const heroContent = document.querySelector('.hero-content');
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            }

            // Parallax for about image
            const aboutImg = document.querySelector('.about-main-img');
            if (aboutImg) {
                const aboutSection = document.querySelector('.about-section');
                if (aboutSection) {
                    const sectionTop = aboutSection.offsetTop;
                    const relativeScroll = scrolled - sectionTop;
                    if (relativeScroll > -500 && relativeScroll < 500) {
                        aboutImg.style.transform = `translateY(${relativeScroll * 0.1}px) scale(1.05)`;
                    }
                }
            }

            // Parallax for floating card
            const floatingCard = document.querySelector('.about-floating-card');
            if (floatingCard) {
                floatingCard.style.transform = `translateY(${Math.sin(scrolled * 0.005) * 10}px)`;
            }
        });
    }

    setupFloatingElements() {
        // Floating animation for particles container
        const particlesContainer = document.getElementById('particlesContainer');
        if (particlesContainer) {
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement('div');
                particle.style.cssText = `
                    position: absolute;
                    width: ${4 + Math.random() * 8}px;
                    height: ${4 + Math.random() * 8}px;
                    background: var(--accent);
                    border-radius: 50%;
                    opacity: ${0.1 + Math.random() * 0.2};
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: floatParticle ${3 + Math.random() * 5}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 3}s;
                `;
                particlesContainer.appendChild(particle);
            }
        }

        // Add float animation style
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% { transform: translateY(0) translateX(0) scale(1); }
                25% { transform: translateY(-20px) translateX(10px) scale(1.2); }
                50% { transform: translateY(-10px) translateX(-10px) scale(0.8); }
                75% { transform: translateY(-30px) translateX(5px) scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }

    setupCounterAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            if (!target) return;

            this.observeElement(stat, () => {
                this.animateCounter(stat, target);
            });
        });
    }

    animateCounter(element, target) {
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            
            element.textContent = current + '+';
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        };

        requestAnimationFrame(update);
    }

    observeElement(element, callback, threshold = 0.2) {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        callback();
                        observer.unobserve(element);
                    }
                });
            }, { threshold });

            observer.observe(element);
        } else {
            // Fallback
            callback();
        }
    }
}

// Initialize parallax
document.addEventListener('DOMContentLoaded', () => {
    new ParallaxEffects();
});