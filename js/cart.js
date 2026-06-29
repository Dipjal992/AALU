// ============================================
// SWAD RESTRO - SHOPPING CART
// ============================================

let cart = [];
let orderType = 'pickup';

class Cart {
    constructor() {
        this.loadCart();
        this.init();
    }

    init() {
        this.updateCartUI();
        this.setupEventListeners();
    }

    loadCart() {
        const savedCart = localStorage.getItem('swad-cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
        }
    }

    saveCart() {
        localStorage.setItem('swad-cart', JSON.stringify(cart));
    }

    addItem(itemId) {
        const item = menuData.find(i => i.id === itemId);
        if (!item) return;

        const existingItem = cart.find(i => i.id === itemId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showAddAnimation(item.name);
        
        // Play sound
        if (typeof soundEffects !== 'undefined') {
            soundEffects.play('addToCart');
        }
    }

    removeItem(itemId) {
        cart = cart.filter(i => i.id !== itemId);
        this.saveCart();
        this.updateCartUI();
        
        if (typeof soundEffects !== 'undefined') {
            soundEffects.play('remove');
        }
    }

    updateQuantity(itemId, change) {
        const item = cart.find(i => i.id === itemId);
        if (!item) return;

        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeItem(itemId);
        } else {
            this.saveCart();
            this.updateCartUI();
        }
    }

    getTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }

    updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const cartCount = document.getElementById('cartCount');
        const cartTotal = document.getElementById('cartTotal');
        const cartFooter = document.getElementById('cartFooter');

        // Update cart count
        if (cartCount) {
            const count = this.getItemCount();
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }

        // Update cart items
        if (cartItems) {
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
                if (cartFooter) cartFooter.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=100'">
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <p>NPR ${item.price}</p>
                        </div>
                        <div class="cart-item-qty">
                            <button class="qty-btn" onclick="cartInstance.updateQuantity(${item.id}, -1)">−</button>
                            <span>${item.quantity}</span>
                            <button class="qty-btn" onclick="cartInstance.updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="cart-item-remove" onclick="cartInstance.removeItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
                
                if (cartFooter) cartFooter.style.display = 'block';
            }
        }

        // Update total
        if (cartTotal) {
            cartTotal.textContent = `NPR ${this.getTotal()}`;
        }
    }

    showAddAnimation(itemName) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-success';
        toast.innerHTML = `<i class="fas fa-check-circle"></i> ${itemName} added to cart!`;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }

    setupEventListeners() {
        const cartBtn = document.getElementById('cartBtn');
        const cartSidebar = document.getElementById('cartSidebar');
        const cartOverlay = document.getElementById('cartOverlay');
        const cartClose = document.getElementById('cartClose');
        
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                cartSidebar.classList.add('open');
            });
        }

        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
            });
        }

        if (cartOverlay) {
            cartOverlay.addEventListener('click', () => {
                cartSidebar.classList.remove('open');
            });
        }

        // Order type buttons
        document.querySelectorAll('.order-type-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.order-type-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                orderType = e.target.getAttribute('data-type');
                
                const deliveryAddress = document.getElementById('deliveryAddress');
                if (deliveryAddress) {
                    deliveryAddress.style.display = orderType === 'delivery' ? 'block' : 'none';
                }
            });
        });

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }

    checkout() {
        if (cart.length === 0) {
            this.showError('Your cart is empty!');
            return;
        }

        if (orderType === 'delivery') {
            const addressInput = document.getElementById('addressInput');
            if (!addressInput || !addressInput.value.trim()) {
                this.showError('Please enter delivery address!');
                return;
            }
        }

        // Store order details for eSewa
        const orderDetails = {
            items: cart,
            total: this.getTotal(),
            orderType: orderType,
            address: orderType === 'delivery' ? document.getElementById('addressInput')?.value : 'Pickup',
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('swad-pending-order', JSON.stringify(orderDetails));
        
        // Initiate eSewa payment
        if (typeof eSewaPayment !== 'undefined') {
            eSewaPayment.initiatePayment(this.getTotal());
        }
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-error';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    clearCart() {
        cart = [];
        this.saveCart();
        this.updateCartUI();
        document.getElementById('cartSidebar').classList.remove('open');
    }
}

// Global function for menu card buttons
function addToCart(itemId) {
    if (typeof cartInstance !== 'undefined') {
        cartInstance.addItem(itemId);
    }
}

// Initialize cart
let cartInstance;
document.addEventListener('DOMContentLoaded', () => {
    cartInstance = new Cart();
});