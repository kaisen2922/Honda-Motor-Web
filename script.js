document.addEventListener('DOMContentLoaded', () => {
    // Scroll Reveal Intersection Observer
    const revealElements = [
        ...document.querySelectorAll('.reveal-up'),
        ...document.querySelectorAll('.reveal-fade'),
        ...document.querySelectorAll('.reveal-left'),
        ...document.querySelectorAll('.reveal-right'),
        ...document.querySelectorAll('.reveal-text'),
        ...document.querySelectorAll('.reveal-text-slow')
    ];

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Nav Background on Scroll
    const nav = document.querySelector('.glass-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.style.background = 'hsla(0, 0%, 2%, 0.95)';
                nav.style.paddingBlock = '10px';
                nav.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
            } else {
                nav.style.background = 'hsla(0, 0%, 2%, 0.7)';
                nav.style.paddingBlock = '0';
                nav.style.boxShadow = 'none';
            }
        });
    }

    // Modal Global Utils
    window.closeAllModals = () => {
        const overlays = document.querySelectorAll('.modal-overlay');
        overlays.forEach(o => o.style.display = 'none');
        const success = document.querySelector('.booking-success-overlay');
        if (success) success.remove();
        document.body.style.overflow = 'auto';
    };

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            closeAllModals();
        }
    });

    // Bike Data and Modal
    const bikeData = {
        cbr: {
            title: 'CBR1000RR-R Fireblade SP',
            cat: 'sport',
            price: 2363275,
            specs: ['215 HP / 14,500 RPM', 'Carbon Fiber Aerodynamics', 'Öhlins Smart EC 2.0 Suspension', 'Brembo Stylema calipers'],
            desc: 'Born from MotoGP technology. The Fireblade SP is our most powerful and technologically advanced superbike ever.'
        },
        cbr500: {
            title: 'CBR500R Sport',
            cat: 'sport',
            price: 489000,
            specs: ['471cc Liquid Cooled', 'Parallel-Twin Engine', 'Slipper Clutch', 'Dual Disk Front Brakes'],
            desc: 'The ultimate mid-weight sport bike. Aggressive styling and approachable power for every rider.'
        },
        goldwing: {
            title: 'Goldwing Tour DCT',
            cat: 'cruiser',
            price: 3920000,
            specs: ['1833cc 6-Cylinder Engine', '7-Speed DCT Transmission', 'Apple CarPlay/Android Auto', 'Integrated Navigation'],
            desc: 'The gold standard of luxury touring. Experience unmatched comfort and technology on the open road.'
        },
        cb500x: {
            title: 'CB500X / NX500 Adventure',
            cat: 'adventure',
            price: 687000,
            specs: ['471cc Adventure Engine', 'Tall Windscreen', 'Long Travel Suspension', 'TFT Connectivity'],
            desc: 'Versatile, capable, and ready for any journey. From city commutes to off-road trails.'
        },
        africa: {
            title: 'CRF1100L Africa Twin',
            cat: 'adventure',
            price: 1601500,
            specs: ['1084cc Parallel Twin', 'Unicam Head Design', 'Showa EERA™ Suspension', 'Dual Clutch Transmission (DCT)'],
            desc: 'Built to conquer the toughest terrain. The legend of the Dakar rally, now available for your adventures.'
        },
        cb1000: {
            title: 'CB1000R Black Edition',
            cat: 'sport',
            price: 1446000,
            specs: ['998cc DOHC Engine', 'Neo Sports Café Design', 'Quickshifter as Standard', 'Full Blacked-out Finish'],
            desc: 'The epitome of sophisticated naked performance. A design that stands out in any crowd.'
        }
    };

    const modalContainer = document.getElementById('modal-container');
    const modalBody = document.getElementById('modal-body');

    window.openModal = (id) => {
        if (!modalBody) return;
        const bike = bikeData[id];
        modalBody.innerHTML = `
            <h2 style="font-family: 'Orbitron'; color: #cc0000; margin-bottom: 20px;">${bike.title}</h2>
            <p style="margin-bottom: 30px; font-size: 1.1rem; color: #a0a0a0;">${bike.desc}</p>
            <ul style="list-style: none; margin-bottom: 40px;">
                ${bike.specs.map(spec => `<li style="margin-bottom: 10px; border-left: 2px solid #cc0000; padding-left: 15px;">${spec}</li>`).join('')}
            </ul>
            <div style="display: flex; gap: 20px;">
                <button class="primary-btn-red modal-book-trigger" onclick="openBooking('${bike.title}')" style="width: 200px; padding: 15px;">Book Test Ride</button>
                <button class="secondary-btn-outline" style="width: 200px; padding: 15px;">Configure</button>
            </div>
        `;
        modalContainer.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    // Category Filtering with Active State
    const catLinks = document.querySelectorAll('.category-nav a[data-cat]');
    catLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = link.getAttribute('data-cat');

            // Update Active Class
            catLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            filterBikes(cat);
        });
    });

    const filterBikes = (cat) => {
        const cards = document.querySelectorAll('.model-card');
        cards.forEach(card => {
            const cardCat = card.getAttribute('data-cat');
            if (cat === 'all' || cardCat === cat) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
        // Scroll to section
        document.getElementById('models').scrollIntoView({ behavior: 'smooth' });
    };

    // Booking Logic
    const bookingModal = document.getElementById('booking-modal');
    const bookingForm = document.getElementById('bike-booking-form');
    const bookingBikeName = document.getElementById('booking-bike-name');

    window.openBooking = (modelName) => {
        if (modalContainer) modalContainer.style.display = 'none';
        if (bookingBikeName) bookingBikeName.textContent = `Booking: ${modelName}`;
        if (bookingModal) {
            bookingModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const bikeName = bookingBikeName.textContent.replace('Booking: ', '');
            const name = document.getElementById('user-name').value;

            const content = bookingForm.closest('.modal-content');
            const successOverlay = document.createElement('div');
            successOverlay.className = 'booking-success-overlay';
            successOverlay.innerHTML = `
                <h3>BOOKING CONFIRMED</h3>
                <p>Thank you, ${name}. Your request for the <strong>${bikeName}</strong> has been received.</p>
                <button class="primary-btn-red" style="margin-top: 30px;" onclick="closeAllModals()">Close</button>
            `;
            content.appendChild(successOverlay);
            bookingForm.reset();
        });
    }

    // Search Engine
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    const equipmentData = [
        { name: 'Carbon Fiber Pro Helmet', price: '₹45,999', link: 'equipment.html' },
        { name: 'Speed Demons Jacket', price: '₹28,499', link: 'equipment.html' },
        { name: 'Pro Track Boots', price: '₹18,999', link: 'equipment.html' },
        { name: 'Apex Racing Gloves', price: '₹7,499', link: 'equipment.html' }
    ];

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (!query) {
                searchResults.style.display = 'none';
                return;
            }

            const bikeMatches = Object.values(bikeData).filter(b => b.title.toLowerCase().includes(query));
            const equipMatches = equipmentData.filter(e => e.name.toLowerCase().includes(query));

            const totalMatches = [...bikeMatches.map(b => ({ ...b, type: 'Bike' })), ...equipMatches.map(e => ({ ...e, type: 'Gear', title: e.name }))];

            if (totalMatches.length > 0) {
                searchResults.innerHTML = totalMatches.map(item => `
                    <div class="search-result-item" onclick="handleSearchClick('${item.title}', '${item.type}')">
                        <span>${item.title}</span><br>
                        <small style="color:var(--primary); font-size: 0.6rem;">${item.type}</small>
                    </div>
                `).join('');
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
                searchResults.style.display = 'block';
            }
        });
    }

    window.handleSearchClick = (title, type) => {
        if (type === 'Bike') {
            const bikeId = Object.keys(bikeData).find(key => bikeData[key].title === title);
            openModal(bikeId);
        } else {
            window.location.href = 'equipment.html';
        }
        searchInput.value = '';
        searchResults.style.display = 'none';
    };

    // Profile System
    const profileToggle = document.getElementById('profile-toggle');
    const profileModal = document.getElementById('profile-modal');
    const loginView = document.getElementById('login-view');
    const profileView = document.getElementById('profile-view');
    const logoutBtn = document.getElementById('logout-btn');

    let isLoggedIn = localStorage.getItem('honda_logged_in') === 'true';

    const updateProfileUI = () => {
        if (isLoggedIn) {
            loginView.style.display = 'none';
            profileView.style.display = 'block';
        } else {
            loginView.style.display = 'block';
            profileView.style.display = 'none';
        }
    };

    if (profileToggle) {
        profileToggle.addEventListener('click', () => {
            window.location.href = 'profile.html';
        });
    }

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            isLoggedIn = true;
            localStorage.setItem('honda_logged_in', 'true');
            updateProfileUI();
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            isLoggedIn = false;
            localStorage.setItem('honda_logged_in', 'false');
            updateProfileUI();
        });
    }

    // Cart Manager
    class CartManager {
        constructor() {
            this.cart = JSON.parse(localStorage.getItem('honda_cart')) || [];
            this.init();
        }

        init() {
            this.updateCounter();
            this.renderCart();
            this.setupListeners();
        }

        setupListeners() {
            const toggle = document.getElementById('cart-toggle');
            const sidebar = document.getElementById('cart-sidebar');
            const closeCart = document.getElementById('close-cart');

            if (toggle) toggle.addEventListener('click', () => sidebar.classList.add('open'));
            if (closeCart) closeCart.addEventListener('click', () => sidebar.classList.remove('open'));

            document.querySelectorAll('.gear-card .primary-btn-red').forEach(btn => {
                btn.addEventListener('click', () => {
                    const card = btn.closest('.gear-card');
                    const item = {
                        id: Date.now(),
                        name: card.querySelector('h3').textContent,
                        price: card.querySelector('.price').textContent,
                        img: card.querySelector('img').src
                    };
                    this.addItem(item);
                });
            });
        }

        addItem(item) {
            this.cart.push(item);
            this.save();
            this.updateCounter();
            this.renderCart();
            document.getElementById('cart-sidebar').classList.add('open');
        }

        removeItem(id) {
            this.cart = this.cart.filter(item => item.id !== id);
            this.save();
            this.updateCounter();
            this.renderCart();
        }

        save() {
            localStorage.setItem('honda_cart', JSON.stringify(this.cart));
        }

        updateCounter() {
            const countEl = document.querySelectorAll('#cart-count');
            countEl.forEach(el => el.textContent = this.cart.length);
        }

        renderCart() {
            const container = document.getElementById('cart-items');
            const totalVal = document.getElementById('cart-total-val');
            if (!container) return;

            if (this.cart.length === 0) {
                container.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
                if (totalVal) totalVal.textContent = '0';
                return;
            }

            container.innerHTML = this.cart.map(item => `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="item-price">${item.price}</div>
                        <button class="remove-item" onclick="cartManager.removeItem(${item.id})">Remove</button>
                    </div>
                </div>
            `).join('');

            const total = this.cart.reduce((sum, item) => {
                const priceNum = parseInt(item.price.replace(/[₹,]/g, ''));
                return sum + priceNum;
            }, 0);
            if (totalVal) totalVal.textContent = total.toLocaleString('en-IN');
        }
    }

    // --- NEW PREMIUM FEATURES ---

    // GSAP Card Stagger on Load
    if (window.gsap) {
        gsap.from('.model-card', {
            duration: 1,
            y: 100,
            opacity: 0,
            stagger: 0.15,
            ease: 'power4.out',
            scrollTrigger: {
                trigger: '.model-grid',
                start: 'top 85%'
            }
        });
    }

    // Hover Tilt Effect (Perspective)
    const cards = document.querySelectorAll('.model-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const dx = x - xc;
            const dy = y - yc;
            
            const rotateX = (dy / yc) * -5; // Max 5deg
            const rotateY = (dx / xc) * 5;  // Max 5deg
            
            card.style.transform = `perspective(1000px) translateY(-12px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });

    // Ripple Click Effect
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('ripple-trigger') || e.target.closest('.ripple-trigger')) {
            const btn = e.target.classList.contains('ripple-trigger') ? e.target : e.target.closest('.ripple-trigger');
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            btn.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        }
    });

    // Wishlist Toggle
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            const svg = this.querySelector('svg');
            if (this.classList.contains('active')) {
                svg.setAttribute('fill', 'var(--primary)');
                svg.style.color = 'var(--primary)';
            } else {
                svg.setAttribute('fill', 'none');
                svg.style.color = 'white';
            }
        });
    });

    // Initialize Cart
    window.cartManager = new CartManager();

    // Cart Manager Extension for Bikes
    document.querySelectorAll('.overlay-btn.cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = btn.closest('.model-card');
            const item = {
                id: Date.now(),
                name: card.querySelector('h3').textContent,
                price: card.querySelector('.price').textContent,
                img: card.querySelector('.model-img img').src
            };
            window.cartManager.addItem(item);
        });
    });

    // Locators
    document.querySelectorAll('.loc-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const city = this.closest('.showroom-card').querySelector('h3').textContent;
            alert(`Locating Dealers in ${city}...`);
        });
    });

    // Checkout
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cartManager.cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }
            alert("Proceeding to secure Indian payment gateway... This is a simulated checkout.");
        });
    }

});
