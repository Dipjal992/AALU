// ============================================
// SWAD RESTRO - TABLE RESERVATION SYSTEM
// ============================================

class ReservationSystem {
    constructor() {
        this.init();
    }

    init() {
        this.setupForm();
        this.setMinDate();
    }

    setMinDate() {
        const dateInput = document.getElementById('resDate');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }

    setupForm() {
        const form = document.getElementById('reservationForm');
        if (!form) return;

        form.addEventListener('submit', (e) => this.handleReservation(e));
    }

    async handleReservation(e) {
        e.preventDefault();

        const reservation = {
            name: document.getElementById('resName')?.value,
            phone: document.getElementById('resPhone')?.value,
            date: document.getElementById('resDate')?.value,
            time: document.getElementById('resTime')?.value,
            guests: document.getElementById('resGuests')?.value,
            occasion: document.getElementById('resOccasion')?.value,
            requests: document.getElementById('resRequests')?.value,
            timestamp: new Date().toISOString(),
            status: 'pending'
        };

        // Validate
        if (!reservation.name || !reservation.phone || !reservation.date || !reservation.time) {
            this.showMessage('Please fill all required fields!', 'error');
            return;
        }

        // Validate phone (Nepal format)
        const phoneRegex = /^(\+977[-\s]?)?9[78]\d{8}$/;
        if (!phoneRegex.test(reservation.phone.replace(/[\s-]/g, ''))) {
            this.showMessage('Please enter a valid Nepal phone number!', 'error');
            return;
        }

        // Check if date is not in the past
        const selectedDate = new Date(reservation.date + 'T' + reservation.time);
        if (selectedDate < new Date()) {
            this.showMessage('Please select a future date and time!', 'error');
            return;
        }

        try {
            // Send to backend
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reservation)
            });

            if (response.ok) {
                this.showConfirmation(reservation);
                document.getElementById('reservationForm').reset();
            } else {
                throw new Error('Reservation failed');
            }
        } catch (error) {
            // Store offline
            this.saveOffline(reservation);
            this.showConfirmation(reservation);
        }
    }

    saveOffline(reservation) {
        const offlineReservations = JSON.parse(localStorage.getItem('swad-reservations') || '[]');
        offlineReservations.push(reservation);
        localStorage.setItem('swad-reservations', JSON.stringify(offlineReservations));
    }

    showConfirmation(reservation) {
        const confirmationHTML = `
            <div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;">
                <div style="background:var(--bg-primary);padding:40px;border-radius:20px;text-align:center;max-width:450px;width:90%;">
                    <div style="font-size:4rem;color:var(--accent);margin-bottom:20px;">🍽️</div>
                    <h2 style="margin-bottom:15px;color:var(--text-primary);">Reservation Confirmed!</h2>
                    <div style="background:var(--bg-secondary);padding:20px;border-radius:10px;margin-bottom:20px;text-align:left;">
                        <p style="margin-bottom:8px;"><strong>Name:</strong> ${reservation.name}</p>
                        <p style="margin-bottom:8px;"><strong>Date:</strong> ${reservation.date}</p>
                        <p style="margin-bottom:8px;"><strong>Time:</strong> ${reservation.time}</p>
                        <p style="margin-bottom:8px;"><strong>Guests:</strong> ${reservation.guests}</p>
                        ${reservation.occasion !== 'Casual Dining' ? `<p style="margin-bottom:8px;"><strong>Occasion:</strong> ${reservation.occasion}</p>` : ''}
                    </div>
                    <p style="color:var(--text-muted);font-size:0.9rem;margin-bottom:20px;">
                        We'll send a confirmation to your phone. Please arrive 5 minutes early.
                    </p>
                    <button onclick="this.parentElement.parentElement.remove()" style="padding:12px 30px;background:var(--accent);color:white;border:none;border-radius:25px;cursor:pointer;font-weight:600;">
                        Done
                    </button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', confirmationHTML);
    }

    showMessage(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
}

// Initialize reservation system
document.addEventListener('DOMContentLoaded', () => {
    new ReservationSystem();
});