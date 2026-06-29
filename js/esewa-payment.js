// ============================================
// SWAD RESTRO - ESEWA PAYMENT INTEGRATION
// For Nepal-based payments
// ============================================

class EsewaPayment {
    constructor() {
        this.esewaConfig = {
            // eSewa Merchant ID (replace with actual)
            merchantId: 'EP01TEST',
            // eSewa endpoints
            testUrl: 'https://uat.esewa.com.np/epay/main',
            liveUrl: 'https://esewa.com.np/epay/main',
            // Use test mode for development
            isTestMode: true
        };
        
        this.init();
    }

    init() {
        this.setupPaymentListeners();
    }

    setupPaymentListeners() {
        // Listen for eSewa payment response
        window.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'esewa_payment_response') {
                this.handlePaymentResponse(event.data);
            }
        });

        // Handle page return from eSewa
        this.checkReturnFromEsewa();
    }

    initiatePayment(amount, orderId = null) {
        const order = JSON.parse(localStorage.getItem('swad-pending-order') || '{}');
        
        if (!orderId) {
            orderId = 'SWAD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
        }

        // Store order reference
        order.orderId = orderId;
        localStorage.setItem('swad-pending-order', JSON.stringify(order));
        localStorage.setItem('swad-order-id', orderId);

        // Calculate tax and service charge
        const tax = Math.round(amount * 0.13); // 13% VAT
        const serviceCharge = Math.round(amount * 0.10); // 10% service charge
        const totalAmount = amount + tax + serviceCharge;

        // eSewa payment form parameters
        const params = new URLSearchParams({
            amt: amount,
            psc: serviceCharge,
            pdc: 0,
            txAmt: tax,
            tAmt: totalAmount,
            pid: orderId,
            scd: this.esewaConfig.merchantId,
            su: window.location.origin + '/payment-success.html',
            fu: window.location.origin + '/payment-failed.html'
        });

        const paymentUrl = (this.esewaConfig.isTestMode ? this.esewaConfig.testUrl : this.esewaConfig.liveUrl) + '?' + params.toString();

        // Open eSewa in popup or redirect
        if (window.innerWidth > 768) {
            this.openPopup(paymentUrl);
        } else {
            window.location.href = paymentUrl;
        }
    }

    openPopup(url) {
        const width = 500;
        const height = 700;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        
        const popup = window.open(
            url,
            'eSewa Payment',
            `width=${width},height=${height},left=${left},top=${top},scrollbars=yes`
        );

        // Check if popup closed
        const checkPopup = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(checkPopup);
                this.checkPaymentStatus();
            }
        }, 1000);
    }

    handlePaymentResponse(response) {
        if (response.status === 'success') {
            this.onPaymentSuccess(response);
        } else {
            this.onPaymentFailed(response);
        }
    }

    checkReturnFromEsewa() {
        const urlParams = new URLSearchParams(window.location.search);
        const status = urlParams.get('status');
        const refId = urlParams.get('refId');
        const orderId = urlParams.get('oid');

        if (status === 'success' && refId && orderId) {
            this.onPaymentSuccess({ refId, orderId });
        } else if (status === 'failed') {
            this.onPaymentFailed({ message: 'Payment was not completed' });
        }
    }

    onPaymentSuccess(data) {
        const order = JSON.parse(localStorage.getItem('swad-pending-order') || '{}');
        
        // Update order with payment info
        order.paymentStatus = 'paid';
        order.paymentRef = data.refId;
        order.paymentDate = new Date().toISOString();

        // Send order to backend
        this.sendOrderToBackend(order);

        // Clear cart
        if (typeof cartInstance !== 'undefined') {
            cartInstance.clearCart();
        }

        // Add loyalty points (1 point per NPR 10)
        if (typeof loyaltyProgram !== 'undefined') {
            loyaltyProgram.addPoints(Math.floor(order.total / 10));
        }

        // Clear pending order
        localStorage.removeItem('swad-pending-order');
        localStorage.removeItem('swad-order-id');

        // Show success
        this.showPaymentSuccess(order);
    }

    onPaymentFailed(data) {
        const toast = document.createElement('div');
        toast.className = 'toast toast-error';
        toast.textContent = 'Payment failed. Please try again.';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 5000);
    }

    async sendOrderToBackend(order) {
        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                console.error('Failed to save order to backend');
            }
        } catch (error) {
            console.error('Error sending order:', error);
            // Store locally if backend is unreachable
            const offlineOrders = JSON.parse(localStorage.getItem('swad-offline-orders') || '[]');
            offlineOrders.push(order);
            localStorage.setItem('swad-offline-orders', JSON.stringify(offlineOrders));
        }
    }

    showPaymentSuccess(order) {
        const successHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;">
                <div style="background:var(--bg-primary);padding:40px;border-radius:20px;text-align:center;max-width:400px;width:90%;">
                    <div style="font-size:4rem;color:#4CAF50;margin-bottom:20px;">✓</div>
                    <h2 style="margin-bottom:10px;color:var(--text-primary);">Payment Successful!</h2>
                    <p style="color:var(--text-secondary);margin-bottom:5px;">Order ID: ${order.orderId}</p>
                    <p style="color:var(--text-secondary);margin-bottom:15px;">Total: NPR ${order.total}</p>
                    <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:20px;">
                        ${order.orderType === 'delivery' ? 'Your order will be delivered to your address.' : 'Your order will be ready for pickup in 20-30 minutes.'}
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" style="padding:12px 30px;background:var(--accent);color:white;border:none;border-radius:25px;cursor:pointer;font-weight:600;">
                        Continue Shopping
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', successHTML);
    }

    checkPaymentStatus() {
        // Verify payment with backend
        const orderId = localStorage.getItem('swad-order-id');
        if (!orderId) return;

        fetch(`/api/payment-status/${orderId}`)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'paid') {
                    this.onPaymentSuccess(data);
                }
            })
            .catch(err => console.log('Payment status check failed:', err));
    }
}

// Initialize eSewa payment
let eSewaPayment;
document.addEventListener('DOMContentLoaded', () => {
    eSewaPayment = new EsewaPayment();
});