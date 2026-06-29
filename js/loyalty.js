// ============================================
// SWAD RESTRO - LOYALTY POINTS PROGRAM
// ============================================

class LoyaltyProgram {
    constructor() {
        this.points = 0;
        this.memberName = 'Guest';
        this.tiers = {
            bronze: { min: 0, max: 499, name: 'Bronze', discount: 5, icon: 'fa-mug-hot', color: '#CD7F32' },
            silver: { min: 500, max: 1499, name: 'Silver', discount: 10, icon: 'fa-medal', color: '#C0C0C0' },
            gold: { min: 1500, max: Infinity, name: 'Gold', discount: 15, icon: 'fa-crown', color: '#FFD700' }
        };
        
        this.init();
    }

    init() {
        this.loadLoyaltyData();
        this.updateUI();
        this.setupListeners();
    }

    loadLoyaltyData() {
        const savedData = localStorage.getItem('swad-loyalty');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.points = data.points || 0;
            this.memberName = data.name || 'Guest';
        }
    }

    saveLoyaltyData() {
        localStorage.setItem('swad-loyalty', JSON.stringify({
            points: this.points,
            name: this.memberName
        }));
    }

    addPoints(amount) {
        this.points += amount;
        this.saveLoyaltyData();
        this.updateUI();
        this.showPointsAnimation(amount);
    }

    redeemPoints(amount) {
        if (amount > this.points) {
            return false;
        }
        this.points -= amount;
        this.saveLoyaltyData();
        this.updateUI();
        return true;
    }

    getTier() {
        if (this.points >= this.tiers.gold.min) return 'gold';
        if (this.points >= this.tiers.silver.min) return 'silver';
        return 'bronze';
    }

    getDiscount() {
        const tier = this.getTier();
        return this.tiers[tier].discount;
    }

    updateUI() {
        const tier = this.getTier();
        const tierData = this.tiers[tier];

        // Update points display
        const memberPoints = document.getElementById('memberPoints');
        const memberName = document.getElementById('memberName');
        const loyaltyPoints = document.getElementById('loyaltyPoints');

        if (memberPoints) memberPoints.textContent = this.points;
        if (memberName) memberName.textContent = this.memberName;
        if (loyaltyPoints) loyaltyPoints.textContent = this.points;

        // Highlight active tier
        document.querySelectorAll('.tier').forEach(el => {
            el.style.borderColor = 'var(--border)';
            el.style.transform = 'scale(1)';
        });

        const activeTier = document.querySelector(`.tier.${tier}`);
        if (activeTier) {
            activeTier.style.borderColor = tierData.color;
            activeTier.style.transform = 'scale(1.05)';
            activeTier.style.boxShadow = `0 8px 30px ${tierData.color}33`;
        }

        // Update loyalty card
        const loyaltyCard = document.getElementById('loyaltyCard');
        if (loyaltyCard) {
            loyaltyCard.style.background = tier === 'gold' 
                ? 'linear-gradient(135deg, #FFD700, #FFA500)'
                : tier === 'silver'
                ? 'linear-gradient(135deg, #C0C0C0, #A0A0A0)'
                : 'var(--gradient-warm)';
        }
    }

    showPointsAnimation(points) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `🎉 Earned <strong>${points}</strong> loyalty points!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }

    setupListeners() {
        const loyaltyBtn = document.getElementById('loyaltyBtn');
        if (loyaltyBtn) {
            loyaltyBtn.addEventListener('click', () => {
                document.getElementById('loyalty').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}

// Initialize loyalty program
let loyaltyProgram;
document.addEventListener('DOMContentLoaded', () => {
    loyaltyProgram = new LoyaltyProgram();
});