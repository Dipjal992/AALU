// ============================================
// SWAD RESTRO - MENU DATA & 3D FLIP CARDS
// ============================================

const menuData = [
    // COFFEE & ESPRESSO
    {
        id: 1,
        name: "Classic Espresso",
        category: "coffee",
        description: "Rich and intense single-origin espresso shot",
        price: 180,
        image: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400",
        badge: "bestseller",
        details: "Single origin Arabica beans from Ethiopia. Bold, smooth, with notes of dark chocolate."
    },
    {
        id: 2,
        name: "Creamy Cappuccino",
        category: "coffee",
        description: "Velvety steamed milk with perfect foam",
        price: 250,
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?w=400",
        badge: "bestseller",
        details: "Equal parts espresso, steamed milk, and foam. Our most popular coffee drink."
    },
    {
        id: 3,
        name: "Caramel Latte",
        category: "coffee",
        description: "Smooth latte with house-made caramel",
        price: 320,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
        badge: "bestseller",
        details: "Espresso with steamed milk, topped with our signature house-made caramel sauce."
    },
    {
        id: 4,
        name: "Mocha Frappe",
        category: "coffee",
        description: "Blended chocolate coffee indulgence",
        price: 350,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400",
        badge: "new",
        details: "A refreshing blend of coffee, chocolate, milk, and ice. Topped with whipped cream."
    },
    {
        id: 5,
        name: "Vanilla Cold Brew",
        category: "coffee",
        description: "12-hour steeped cold brew with vanilla",
        price: 280,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400",
        details: "Slow-steeped for 12 hours for a smooth, naturally sweet cold coffee experience."
    },
    {
        id: 6,
        name: "Hazelnut Americano",
        category: "coffee",
        description: "Classic Americano with hazelnut twist",
        price: 220,
        image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
        details: "Espresso shots poured over hot water with a hint of hazelnut syrup."
    },
    {
        id: 7,
        name: "Affogato",
        category: "coffee",
        description: "Espresso poured over vanilla gelato",
        price: 380,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
        badge: "new",
        details: "The perfect dessert-coffee hybrid. Hot espresso meets cold creamy gelato."
    },
    {
        id: 8,
        name: "Matcha Latte",
        category: "coffee",
        description: "Premium Japanese matcha green tea latte",
        price: 300,
        image: "https://images.unsplash.com/photo-1515823064-d6e0c04653a7?w=400",
        details: "Ceremonial grade matcha whisked with steamed milk for a vibrant, earthy drink."
    },

    // PASTRIES
    {
        id: 9,
        name: "Butter Croissant",
        category: "pastry",
        description: "Flaky, golden, 27-layer French croissant",
        price: 200,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400",
        badge: "bestseller",
        details: "Made fresh daily with European butter. 27 layers of flaky perfection."
    },
    {
        id: 10,
        name: "Chocolate Danish",
        category: "pastry",
        description: "Buttery Danish with rich chocolate filling",
        price: 230,
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400",
        details: "Flaky pastry wrapped around premium Belgian chocolate. A customer favorite."
    },
    {
        id: 11,
        name: "Cinnamon Roll",
        category: "pastry",
        description: "Warm cinnamon roll with cream cheese frosting",
        price: 250,
        image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400",
        details: "Soft, gooey cinnamon roll topped with house-made cream cheese frosting."
    },
    {
        id: 12,
        name: "Almond Croissant",
        category: "pastry",
        description: "Twice-baked with almond cream",
        price: 280,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400",
        badge: "bestseller",
        details: "Day-old croissant filled with frangipane, topped with sliced almonds and powdered sugar."
    },
    {
        id: 13,
        name: "Pain au Chocolat",
        category: "pastry",
        description: "French chocolate-filled pastry",
        price: 220,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400",
        details: "Classic French viennoiserie with two batons of dark chocolate baked inside."
    },
    {
        id: 14,
        name: "Blueberry Muffin",
        category: "pastry",
        description: "Bursting with fresh blueberries",
        price: 180,
        image: "https://images.unsplash.com/photo-1558401391-7899b4bd5bbf?w=400",
        details: "Moist, tender muffin loaded with fresh blueberries and topped with streusel."
    },

    // DESSERTS
    {
        id: 15,
        name: "Tiramisu",
        category: "dessert",
        description: "Classic Italian coffee dessert",
        price: 350,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
        badge: "bestseller",
        details: "Layers of espresso-soaked ladyfingers with mascarpone cream, dusted with cocoa."
    },
    {
        id: 16,
        name: "New York Cheesecake",
        category: "dessert",
        description: "Creamy, dense classic cheesecake",
        price: 380,
        image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=400",
        details: "Rich, velvety cheesecake on a graham cracker crust. Served with berry compote."
    },
    {
        id: 17,
        name: "Chocolate Lava Cake",
        category: "dessert",
        description: "Warm cake with molten chocolate center",
        price: 400,
        image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
        badge: "new",
        details: "Baked to order with a gooey chocolate center. Served with vanilla ice cream."
    },
    {
        id: 18,
        name: "Macaron Collection",
        category: "dessert",
        description: "6 assorted French macarons",
        price: 450,
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=400",
        details: "Pistachio, Raspberry, Vanilla, Chocolate, Lemon, and Salted Caramel."
    },
    {
        id: 19,
        name: "Crème Brûlée",
        category: "dessert",
        description: "Classic French custard with caramelized top",
        price: 320,
        image: "https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400",
        details: "Silky vanilla custard with a perfectly caramelized sugar crust."
    },
    {
        id: 20,
        name: "Red Velvet Cake",
        category: "dessert",
        description: "Moist red velvet with cream cheese",
        price: 350,
        image: "https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400",
        details: "Three layers of moist red velvet cake with cream cheese frosting."
    },

    // BEVERAGES
    {
        id: 21,
        name: "Fresh Lemonade",
        category: "beverage",
        description: "Hand-squeezed lemonade with mint",
        price: 180,
        image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400",
        details: "Freshly squeezed lemons with a hint of mint. Refreshing and all-natural."
    },
    {
        id: 22,
        name: "Berry Smoothie",
        category: "beverage",
        description: "Mixed berry blend with yogurt",
        price: 300,
        image: "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?w=400",
        badge: "new",
        details: "Strawberries, blueberries, raspberries blended with Greek yogurt and honey."
    },
    {
        id: 23,
        name: "Masala Chai",
        category: "beverage",
        description: "Traditional Nepali spiced tea",
        price: 150,
        image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=400",
        badge: "bestseller",
        details: "Black tea simmered with cardamom, ginger, cinnamon, and cloves. Served with milk."
    },
    {
        id: 24,
        name: "Hot Chocolate",
        category: "beverage",
        description: "Rich Belgian hot chocolate",
        price: 280,
        image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400",
        details: "Made with real Belgian chocolate and steamed milk. Topped with marshmallows."
    },
    {
        id: 25,
        name: "Mango Lassi",
        category: "beverage",
        description: "Creamy yogurt-based mango drink",
        price: 250,
        image: "https://images.unsplash.com/photo-1553530666-ba11a90bb0ae?w=400",
        details: "Alphonso mangoes blended with yogurt and a touch of cardamom."
    }
];

class MenuDisplay {
    constructor() {
        this.menuGrid = document.getElementById('menuGrid');
        this.categoryBtns = document.querySelectorAll('.cat-btn');
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.renderMenu(this.currentCategory);
        this.setupCategoryFilters();
    }

    renderMenu(category) {
        if (!this.menuGrid) return;

        const filteredItems = category === 'all' 
            ? menuData 
            : menuData.filter(item => item.category === category);

        this.menuGrid.innerHTML = '';

        filteredItems.forEach(item => {
            const card = this.createMenuCard(item);
            this.menuGrid.appendChild(card);
        });

        // Animate cards on render
        this.animateCards();
    }

    createMenuCard(item) {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.setAttribute('data-category', item.category);
        card.setAttribute('data-id', item.id);

        card.innerHTML = `
            <div class="menu-card-inner">
                <div class="menu-card-front">
                    ${item.badge ? `<span class="menu-card-badge badge-${item.badge}">${item.badge.toUpperCase()}</span>` : ''}
                    <img src="${item.image}" alt="${item.name}" class="menu-card-img" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400'">
                    <div class="menu-card-front-content">
                        <h4>${item.name}</h4>
                        <p class="menu-card-desc">${item.description}</p>
                        <p class="menu-card-price">NPR ${item.price}</p>
                    </div>
                </div>
                <div class="menu-card-back">
                    <h4>${item.name}</h4>
                    <p>${item.details}</p>
                    <p style="font-size:1.3rem;font-weight:700;">NPR ${item.price}</p>
                    <button class="add-to-cart-btn" onclick="addToCart(${item.id})">
                        <i class="fas fa-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    setupCategoryFilters() {
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Filter menu
                const category = btn.getAttribute('data-cat');
                this.currentCategory = category;
                this.renderMenu(category);
            });
        });
    }

    animateCards() {
        const cards = document.querySelectorAll('.menu-card');
        
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = `all 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.05}s`;
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 50);
        });
    }
}

// Initialize menu
document.addEventListener('DOMContentLoaded', () => {
    new MenuDisplay();
});