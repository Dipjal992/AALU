// ============================================
// SWAD RESTRO - ADMIN PANEL JAVASCRIPT
// ============================================

class AdminPanel {
    constructor() {
        this.currentPage = 'dashboard';
        this.apiBase = '/api';
        this.token = localStorage.getItem('swad-admin-token');
        
        this.init();
    }

    init() {
        this.checkAuth();
        this.setupNavigation();
        this.setupLogout();
    }

    // ============ AUTHENTICATION ============
    checkAuth() {
        if (!this.token) {
            this.showLogin();
        } else {
            this.loadPage('dashboard');
        }
    }

    showLogin() {
        const adminContent = document.getElementById('adminContent');
        if (!adminContent) return;

        adminContent.innerHTML = `
            <div style="max-width:400px;margin:100px auto;padding:40px;background:var(--admin-card);border-radius:15px;text-align:center;">
                <img src="https://scontent.fbir1-1.fna.fbcdn.net/v/t39.30808-6/698504344_122097109131319702_8429580545516771912_n.jpg?stp=dst-jpg_tt6&cstp=mx1254x1254&ctp=s1254x1254&_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=PvD1CAXnWBQQ7kNvwFWk1vY&_nc_oc=AdqgKTmpi9T53tNGn6mm5JWZ5q3y0ENrlwxGnXNbHBDcaSWsth6dt1AFMoZgn9sYHxhXMhER9bIoYgFAzm5DNZPh&_nc_zt=23&_nc_ht=scontent.fbir1-1.fna&_nc_gid=43qTCwIFFCnyRs5WoMX4Mw&_nc_ss=7b2a8&oh=00_Af_YzRlXIDTUO5ZLCL13Or7QamSV2hXtjKBUTQhonHZ-qw&oe=6A41AC0E" alt="Swad Logo" style="width:80px;height:80px;border-radius:50%;margin-bottom:20px;">
                <h2 style="margin-bottom:10px;color:var(--accent);">Swad Admin</h2>
                <p style="color:var(--admin-muted);margin-bottom:30px;">Sign in to manage your restaurant</p>
                <form id="loginForm">
                    <div style="margin-bottom:15px;">
                        <input type="text" id="adminUsername" placeholder="Username" style="width:100%;padding:12px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-bg);color:var(--admin-text);font-family:'Poppins',sans-serif;" required>
                    </div>
                    <div style="margin-bottom:20px;">
                        <input type="password" id="adminPassword" placeholder="Password" style="width:100%;padding:12px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-bg);color:var(--admin-text);font-family:'Poppins',sans-serif;" required>
                    </div>
                    <button type="submit" style="width:100%;padding:14px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:1rem;">
                        <i class="fas fa-sign-in-alt"></i> Sign In
                    </button>
                </form>
                <p style="margin-top:20px;font-size:0.8rem;color:var(--admin-muted);">
                    Default: admin / swadrestro2024
                </p>
            </div>
        `;

        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login(
                document.getElementById('adminUsername').value,
                document.getElementById('adminPassword').value
            );
        });
    }

    async login(username, password) {
        // Demo login (replace with actual API call)
        if (username === 'admin' && password === 'swadrestro2024') {
            this.token = 'demo-token-' + Date.now();
            localStorage.setItem('swad-admin-token', this.token);
            this.showToast('Login successful!', 'success');
            this.loadPage('dashboard');
        } else {
            this.showToast('Invalid credentials!', 'error');
        }
    }

    setupLogout() {
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('swad-admin-token');
                this.token = null;
                this.showLogin();
            });
        }
    }

    // ============ NAVIGATION ============
    setupNavigation() {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.getAttribute('data-page');
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                
                this.loadPage(page);
            });
        });
    }

    loadPage(page) {
        this.currentPage = page;
        document.getElementById('pageTitle').textContent = page.charAt(0).toUpperCase() + page.slice(1);
        
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'orders':
                this.loadOrders();
                break;
            case 'menu':
                this.loadMenuManagement();
                break;
            case 'reservations':
                this.loadReservations();
                break;
            case 'loyalty':
                this.loadLoyalty();
                break;
            default:
                this.loadDashboard();
        }
    }

    // ============ DASHBOARD ============
    loadDashboard() {
        const adminContent = document.getElementById('adminContent');
        
        // Demo data
        const stats = {
            totalOrders: 156,
            totalRevenue: 45250,
            totalReservations: 42,
            totalMembers: 89
        };

        const recentOrders = [
            { orderId: 'SWAD-20241215-001', items: 'Cappuccino, Croissant', total: 450, type: 'pickup', status: 'ready' },
            { orderId: 'SWAD-20241215-002', items: 'Latte, Tiramisu', total: 670, type: 'delivery', status: 'pending' },
            { orderId: 'SWAD-20241215-003', items: 'Espresso x2', total: 360, type: 'dine-in', status: 'paid' },
            { orderId: 'SWAD-20241215-004', items: 'Mocha Frappe, Danish', total: 580, type: 'pickup', status: 'confirmed' },
            { orderId: 'SWAD-20241215-005', items: 'Masala Chai x3', total: 450, type: 'dine-in', status: 'ready' }
        ];

        adminContent.innerHTML = `
            <!-- Stats Cards -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <i class="fas fa-shopping-bag"></i>
                    <h4>Total Orders</h4>
                    <span>${stats.totalOrders}</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-money-bill-wave"></i>
                    <h4>Revenue (NPR)</h4>
                    <span>${stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-calendar-check"></i>
                    <h4>Reservations</h4>
                    <span>${stats.totalReservations}</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <h4>Loyalty Members</h4>
                    <span>${stats.totalMembers}</span>
                </div>
            </div>

            <!-- Quick Actions -->
            <div style="display:flex;gap:15px;margin-bottom:30px;">
                <button class="action-btn" style="background:var(--accent);color:white;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;" onclick="adminPanel.loadPage('orders')">
                    <i class="fas fa-plus"></i> New Order
                </button>
                <button class="action-btn" style="background:var(--info);color:white;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;" onclick="adminPanel.loadPage('menu')">
                    <i class="fas fa-utensils"></i> Manage Menu
                </button>
                <button class="action-btn" style="background:var(--success);color:white;padding:10px 20px;border:none;border-radius:8px;cursor:pointer;" onclick="adminPanel.loadPage('reservations')">
                    <i class="fas fa-calendar"></i> View Reservations
                </button>
            </div>

            <!-- Recent Orders Table -->
            <div class="table-container">
                <h3>Recent Orders</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${recentOrders.map(order => `
                            <tr>
                                <td>${order.orderId}</td>
                                <td>${order.items}</td>
                                <td>NPR ${order.total}</td>
                                <td><span style="text-transform:capitalize;">${order.type}</span></td>
                                <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                                <td>
                                    <button class="action-btn btn-accept" onclick="adminPanel.updateOrderStatus('${order.orderId}', 'ready')">
                                        <i class="fas fa-check"></i>
                                    </button>
                                    <button class="action-btn btn-reject" onclick="adminPanel.updateOrderStatus('${order.orderId}', 'cancelled')">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    // ============ ORDERS MANAGEMENT ============
    loadOrders() {
        const adminContent = document.getElementById('adminContent');
        
        const allOrders = [
            { orderId: 'SWAD-001', customer: 'Sita Sharma', items: 'Cappuccino, Croissant', total: 450, type: 'pickup', status: 'pending', date: '2024-12-15' },
            { orderId: 'SWAD-002', customer: 'Ram Thapa', items: 'Latte, Tiramisu, Danish', total: 900, type: 'delivery', status: 'confirmed', date: '2024-12-15' },
            { orderId: 'SWAD-003', customer: 'Hari Adhikari', items: 'Espresso x2, Cinnamon Roll', total: 610, type: 'dine-in', status: 'preparing', date: '2024-12-15' },
            { orderId: 'SWAD-004', customer: 'Gita Poudel', items: 'Mocha Frappe, Cheesecake', total: 730, type: 'pickup', status: 'ready', date: '2024-12-14' },
            { orderId: 'SWAD-005', customer: 'Krishna Rai', items: 'Masala Chai x3, Samosa', total: 550, type: 'dine-in', status: 'delivered', date: '2024-12-14' },
        ];

        adminContent.innerHTML = `
            <div style="display:flex;gap:15px;margin-bottom:25px;flex-wrap:wrap;">
                <select id="orderFilter" style="padding:10px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-card);color:var(--admin-text);" onchange="adminPanel.filterOrders()">
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                </select>
                <select style="padding:10px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-card);color:var(--admin-text);">
                    <option value="all">All Types</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery</option>
                    <option value="dine-in">Dine-in</option>
                </select>
                <input type="date" style="padding:10px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-card);color:var(--admin-text);">
            </div>
            <div class="table-container">
                <h3>All Orders</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="ordersTableBody">
                        ${allOrders.map(order => `
                            <tr>
                                <td><strong>${order.orderId}</strong></td>
                                <td>${order.customer}</td>
                                <td>${order.items}</td>
                                <td>NPR ${order.total}</td>
                                <td><span style="text-transform:capitalize;">${order.type}</span></td>
                                <td>
                                    <select class="status-select" onchange="adminPanel.updateOrderStatus('${order.orderId}', this.value)" 
                                        style="padding:5px 10px;border-radius:5px;border:1px solid var(--admin-border);background:var(--admin-card);color:var(--admin-text);">
                                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                                        <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                                        <option value="preparing" ${order.status === 'preparing' ? 'selected' : ''}>Preparing</option>
                                        <option value="ready" ${order.status === 'ready' ? 'selected' : ''}>Ready</option>
                                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                    </select>
                                </td>
                                <td>${order.date}</td>
                                <td>
                                    <button class="action-btn btn-accept" title="Accept"><i class="fas fa-check"></i></button>
                                    <button class="action-btn btn-reject" title="Cancel"><i class="fas fa-times"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    updateOrderStatus(orderId, newStatus) {
        this.showToast(`Order ${orderId} status updated to ${newStatus}`, 'success');
        console.log(`Updating ${orderId} to ${newStatus}`);
        // In production: fetch(`/api/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
    }

    // ============ MENU MANAGEMENT ============
    loadMenuManagement() {
        const adminContent = document.getElementById('adminContent');
        
        const menuItems = [
            { id: 1, name: 'Classic Espresso', category: 'coffee', price: 180, available: true },
            { id: 2, name: 'Creamy Cappuccino', category: 'coffee', price: 250, available: true },
            { id: 3, name: 'Butter Croissant', category: 'pastry', price: 200, available: true },
            { id: 4, name: 'Tiramisu', category: 'dessert', price: 350, available: false },
            { id: 5, name: 'Masala Chai', category: 'beverage', price: 150, available: true },
        ];

        adminContent.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;">
                <h3 style="color:var(--admin-text);">Menu Items (${menuItems.length})</h3>
                <button class="action-btn" style="background:var(--accent);color:white;padding:12px 25px;border:none;border-radius:8px;cursor:pointer;font-weight:600;" onclick="adminPanel.showAddMenuItemForm()">
                    <i class="fas fa-plus"></i> Add New Item
                </button>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price (NPR)</th>
                            <th>Available</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${menuItems.map(item => `
                            <tr>
                                <td>${item.id}</td>
                                <td><div style="width:50px;height:50px;background:var(--admin-border);border-radius:8px;"></div></td>
                                <td><strong>${item.name}</strong></td>
                                <td><span style="text-transform:capitalize;">${item.category}</span></td>
                                <td>NPR ${item.price}</td>
                                <td>
                                    <label class="toggle-switch">
                                        <input type="checkbox" ${item.available ? 'checked' : ''} onchange="adminPanel.toggleItemAvailability(${item.id}, this.checked)">
                                        <span class="toggle-slider"></span>
                                    </label>
                                </td>
                                <td>
                                    <button class="action-btn btn-edit" onclick="adminPanel.editMenuItem(${item.id})"><i class="fas fa-edit"></i></button>
                                    <button class="action-btn btn-reject" onclick="adminPanel.deleteMenuItem(${item.id})"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            <style>
                .toggle-switch { position:relative; display:inline-block; width:50px; height:26px; }
                .toggle-switch input { opacity:0; width:0; height:0; }
                .toggle-slider { position:absolute; cursor:pointer; top:0;left:0;right:0;bottom:0; background:#555; border-radius:26px; transition:0.3s; }
                .toggle-slider:before { content:""; position:absolute; height:20px; width:20px; left:3px; bottom:3px; background:white; border-radius:50%; transition:0.3s; }
                input:checked + .toggle-slider { background:var(--success); }
                input:checked + .toggle-slider:before { transform:translateX(24px); }
            </style>
        `;
    }

    showAddMenuItemForm() {
        const modal = document.createElement('div');
        modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;';
        modal.innerHTML = `
            <div style="background:var(--admin-card);padding:30px;border-radius:15px;width:500px;max-width:90%;">
                <h3 style="margin-bottom:20px;color:var(--accent);">Add New Menu Item</h3>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;color:var(--admin-muted);">Item Name</label>
                    <input type="text" id="newItemName" style="width:100%;padding:12px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-bg);color:var(--admin-text);">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;color:var(--admin-muted);">Category</label>
                    <select id="newItemCategory" style="width:100%;padding:12px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-bg);color:var(--admin-text);">
                        <option value="coffee">Coffee & Espresso</option>
                        <option value="pastry">Pastries</option>
                        <option value="dessert">Desserts</option>
                        <option value="beverage">Beverages</option>
                    </select>
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;color:var(--admin-muted);">Price (NPR)</label>
                    <input type="number" id="newItemPrice" style="width:100%;padding:12px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-bg);color:var(--admin-text);">
                </div>
                <div style="margin-bottom:15px;">
                    <label style="display:block;margin-bottom:5px;color:var(--admin-muted);">Description</label>
                    <textarea id="newItemDesc" rows="3" style="width:100%;padding:12px;border:1px solid var(--admin-border);border-radius:8px;background:var(--admin-bg);color:var(--admin-text);resize:vertical;"></textarea>
                </div>
                <div style="display:flex;gap:10px;justify-content:flex-end;">
                    <button onclick="this.closest('[style*=fixed]').remove()" style="padding:10px 20px;border:1px solid var(--admin-border);border-radius:8px;background:transparent;color:var(--admin-text);cursor:pointer;">Cancel</button>
                    <button onclick="adminPanel.saveNewItem();this.closest('[style*=fixed]').remove();" style="padding:10px 20px;background:var(--accent);color:white;border:none;border-radius:8px;cursor:pointer;">Save Item</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
    }

    saveNewItem() {
        const name = document.getElementById('newItemName')?.value;
        const category = document.getElementById('newItemCategory')?.value;
        const price = document.getElementById('newItemPrice')?.value;
        const desc = document.getElementById('newItemDesc')?.value;
        
        if (name && price) {
            this.showToast(`Item "${name}" added successfully!`, 'success');
            // In production: POST to /api/menu
        } else {
            this.showToast('Please fill name and price!', 'error');
        }
    }

    editMenuItem(id) {
        this.showToast(`Editing item #${id}`, 'success');
    }

    deleteMenuItem(id) {
        if (confirm('Are you sure you want to delete this item?')) {
            this.showToast(`Item #${id} deleted`, 'success');
        }
    }

    toggleItemAvailability(id, available) {
        this.showToast(`Item #${id} is now ${available ? 'available' : 'unavailable'}`, 'success');
    }

    // ============ RESERVATIONS ============
    loadReservations() {
        const adminContent = document.getElementById('adminContent');
        
        const reservations = [
            { id: 1, name: 'Anita Gurung', phone: '+977 9841234567', date: '2024-12-16', time: '18:00', guests: 4, occasion: 'Birthday', status: 'confirmed' },
            { id: 2, name: 'Bikash Shrestha', phone: '+977 9851234567', date: '2024-12-16', time: '19:30', guests: 2, occasion: 'Anniversary', status: 'pending' },
            { id: 3, name: 'Chetan Rana', phone: '+977 9861234567', date: '2024-12-17', time: '12:00', guests: 6, occasion: 'Business Meeting', status: 'pending' },
            { id: 4, name: 'Deepa Lama', phone: '+977 9871234567', date: '2024-12-18', time: '20:00', guests: 3, occasion: 'Casual Dining', status: 'confirmed' },
        ];

        adminContent.innerHTML = `
            <div class="table-container">
                <h3>Reservations (${reservations.length})</h3>
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Guest Name</th>
                            <th>Phone</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Guests</th>
                            <th>Occasion</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${reservations.map(res => `
                            <tr>
                                <td>${res.id}</td>
                                <td><strong>${res.name}</strong></td>
                                <td>${res.phone}</td>
                                <td>${res.date}</td>
                                <td>${res.time}</td>
                                <td>${res.guests}</td>
                                <td>${res.occasion}</td>
                                <td><span class="status-badge status-${res.status}">${res.status}</span></td>
                                <td>
                                    ${res.status === 'pending' ? `
                                        <button class="action-btn btn-accept" onclick="adminPanel.confirmReservation(${res.id})"><i class="fas fa-check"></i> Confirm</button>
                                        <button class="action-btn btn-reject" onclick="adminPanel.cancelReservation(${res.id})"><i class="fas fa-times"></i> Cancel</button>
                                    ` : `
                                        <button class="action-btn btn-edit"><i class="fas fa-edit"></i></button>
                                    `}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    confirmReservation(id) {
        this.showToast(`Reservation #${id} confirmed!`, 'success');
        this.loadReservations();
    }

    cancelReservation(id) {
        if (confirm('Cancel this reservation?')) {
            this.showToast(`Reservation #${id} cancelled`, 'error');
            this.loadReservations();
        }
    }

    // ============ LOYALTY ============
    loadLoyalty() {
        const adminContent = document.getElementById('adminContent');
        
        const members = [
            { phone: '+977 9841111111', name: 'Regular Customer 1', points: 750, tier: 'Silver', visits: 15 },
            { phone: '+977 9842222222', name: 'Regular Customer 2', points: 320, tier: 'Bronze', visits: 8 },
            { phone: '+977 9843333333', name: 'VIP Customer', points: 2100, tier: 'Gold', visits: 42 },
            { phone: '+977 9844444444', name: 'New Member', points: 120, tier: 'Bronze', visits: 3 },
        ];

        adminContent.innerHTML = `
            <div class="dashboard-stats" style="margin-bottom:30px;">
                <div class="stat-card">
                    <i class="fas fa-users"></i>
                    <h4>Total Members</h4>
                    <span>${members.length}</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-star"></i>
                    <h4>Total Points Issued</h4>
                    <span>${members.reduce((sum, m) => sum + m.points, 0)}</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-crown"></i>
                    <h4>Gold Members</h4>
                    <span>${members.filter(m => m.tier === 'Gold').length}</span>
                </div>
                <div class="stat-card">
                    <i class="fas fa-chart-line"></i>
                    <h4>Avg Points/Member</h4>
                    <span>${Math.round(members.reduce((sum, m) => sum + m.points, 0) / members.length)}</span>
                </div>
            </div>
            <div class="table-container">
                <h3>Loyalty Members</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Phone</th>
                            <th>Name</th>
                            <th>Points</th>
                            <th>Tier</th>
                            <th>Visits</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${members.map(m => `
                            <tr>
                                <td>${m.phone}</td>
                                <td><strong>${m.name}</strong></td>
                                <td>${m.points}</td>
                                <td>
                                    <span style="color:${m.tier === 'Gold' ? '#FFD700' : m.tier === 'Silver' ? '#C0C0C0' : '#CD7F32'};font-weight:600;">
                                        <i class="fas ${m.tier === 'Gold' ? 'fa-crown' : m.tier === 'Silver' ? 'fa-medal' : 'fa-mug-hot'}"></i> ${m.tier}
                                    </span>
                                </td>
                                <td>${m.visits}</td>
                                <td>
                                    <button class="action-btn btn-edit" onclick="adminPanel.addPoints('${m.phone}')"><i class="fas fa-plus"></i> Add Points</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    addPoints(phone) {
        const points = prompt('Enter points to add:');
        if (points && !isNaN(points)) {
            this.showToast(`Added ${points} points to ${phone}`, 'success');
        }
    }

    // ============ UTILITIES ============
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        `;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.3s';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    filterOrders() {
        this.showToast('Filters applied', 'success');
    }
}

// Initialize admin panel
let adminPanel;
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});