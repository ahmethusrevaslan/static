/* ANYWAY App Logic */

// Component Loader - Vanilla JS include system
async function loadComponent(elementId, componentPath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const response = await fetch(componentPath);
        if (response.ok) {
            element.innerHTML = await response.text();
        }
    } catch (e) {
        console.warn('Component load failed:', componentPath, e);
    }
}

// Initialize app after components are loaded
async function bootstrapApp() {
    // Load shared components if placeholders exist
    await Promise.all([
        loadComponent('site-header', 'components/header.html'),
        loadComponent('site-footer', 'components/footer.html')
    ]);

    // Now initialize app logic
    initApp();
}

document.addEventListener('DOMContentLoaded', () => {
    bootstrapApp();
});

// Safe LocalStorage Access
const getSafeLocalStorage = (key) => {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (e) {
        console.warn('LocalStorage access denied via file protocol', e);
        return [];
    }
};

const state = {
    cart: getSafeLocalStorage('anyway_cart'),
    filter: 'all'
};

function initApp() {
    // Determine page kind
    const path = window.location.pathname;

    // Always init global components
    initCartDrawer();
    updateCartCount();
    initNavigation();
    initPageTransitions();
    initSearch(); // Added Search



    if (document.getElementById('detail-title')) {
        renderProductDetail();
    }

    if (document.getElementById('featured-grid')) {
        renderFeatured();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container') || createNotificationContainer();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;

    container.appendChild(toast);

    // Animate In
    requestAnimationFrame(() => toast.classList.add('show'));

    // Remove after 3s
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function createNotificationContainer() {
    const div = document.createElement('div');
    div.id = 'notification-container';
    div.className = 'notification-container';
    document.body.appendChild(div);
    return div;
}

/* ================= SEARCH LOGIC ================= */
function initSearch() {
    const searchBtn = document.getElementById('btn-search');
    const closeBtn = document.getElementById('close-search');
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    const resultsContainer = document.querySelector('.search-results');

    if (!searchBtn || !overlay || !input) return;

    searchBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        input.focus();
    });

    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
        input.value = '';
        resultsContainer.innerHTML = '';
    });

    // Search Logic
    input.addEventListener('keyup', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (query.length < 2) {
            resultsContainer.innerHTML = '';
            return;
        }

        // Filter Products (Global 'products' from data.js)
        const matched = typeof products !== 'undefined' ? products.filter(p =>
            p.title.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        ) : [];

        renderSearchResults(matched, resultsContainer);
    });
}

function renderSearchResults(items, container) {
    if (items.length === 0) {
        container.innerHTML = '<div class="no-results">Sonuç bulunamadı.</div>';
        return;
    }

    container.innerHTML = items.map(p => `
        <a href="product-detail.html?id=${p.id}" class="search-item">
            <img src="${p.image}" alt="${p.title}" loading="lazy">
            <div>
                <h4>${p.title}</h4>
                <p>${p.category}</p>
            </div>
            <span>${p.price} TL</span>
        </a>
    `).join('');
}

/* ================= COLLECTION PAGE ================= */
function renderCollection() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear

    const filtered = state.filter === 'all'
        ? products
        : products.filter(p => p.category === state.filter);

    filtered.forEach((product, i) => {
        // Editorial randomized classes for visual rhythm
        let gridClass = 'editorial-item';
        // Simple deterministic pattern based on index to create "magazine" feel
        if (i % 7 === 0) gridClass += ' large';
        else if (i % 5 === 0) gridClass += ' wide';
        else if (i % 9 === 0) gridClass += ' tall';

        const card = createProductCard(product, gridClass);
        grid.appendChild(card);
    });

    // Update count if element exists
    const countEl = document.getElementById('product-count');
    if (countEl) countEl.textContent = filtered.length;

    // Animate items in
    // Animate items in (Simplifying to CSS only or visible by default)
    // Removed JS opacity toggle to prevent visibility issues
    const cards = grid.querySelectorAll('.product-card');
    cards.forEach((card, i) => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
}

function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // UI Update
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');

            // Logic Update
            state.filter = e.target.dataset.filter;
            renderCollection();
        });
    });
}

/* ================= PRODUCT DETAIL ================= */
function renderProductDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const product = products.find(p => p.id === id);

    if (!product) {
        // Handle 404 or redirect
        window.location.href = 'products.html';
        return;
    }

    // Populate Data
    setText('detail-title', product.title);
    setText('detail-price', formatPrice(product.price));
    setText('detail-desc', product.description);
    setText('bread-category', product.category);

    // Specs
    setText('spec-dim', product.dimensions);
    setText('spec-mat', product.material);
    setText('spec-frame', product.frame);
    setText('spec-status', product.status);

    // Images
    const visuals = document.getElementById('visuals-container');
    if (visuals) {
        visuals.innerHTML = `<img src="${product.image}" class="product-visual-image full-h-image">`;
    }

    // Add to Cart Button Logic
    const addBtn = document.getElementById('add-to-cart-btn');
    if (addBtn) {
        if (product.status !== 'Available') {
            addBtn.textContent = 'SATILDI';
            addBtn.disabled = true;
            addBtn.style.opacity = 0.5;
            addBtn.style.cursor = 'not-allowed';
        } else {
            addBtn.onclick = (e) => {
                e.preventDefault();
                addToCart(product);
                openCart();
            };
        }
    }
}

/* ================= HOMEPAGE ================= */
function renderFeatured() {
    const container = document.getElementById('featured-grid');
    if (!container) return;

    const featured = products.filter(p => p.featured).slice(0, 3);

    // Clear in case of re-render
    container.innerHTML = '';

    featured.forEach(product => {
        const card = createProductCard(product);
        container.appendChild(card);
    });
}

/* ================= SHARED COMPONENT: PRODUCT CARD ================= */
function createProductCard(product, extraClass = '') {
    const a = document.createElement('a');
    a.href = `product-detail.html?id=${product.id}`;
    a.className = `product-card ${extraClass}`;
    a.dataset.category = product.category;

    // Status Badge Logic
    // Status Badge Logic
    const badge = product.status !== 'Available'
        ? `<span class="product-badge sold">${product.status.toUpperCase()}</span>`
        : product.featured
            ? `<span class="product-badge featured">FEATURED</span>`
            : '';

    a.innerHTML = `
        <div class="card-image-wrapper">
            ${badge}
            <img src="${product.image}" class="card-image" alt="${product.title} - ${product.material}" loading="lazy">
        </div>
        <div class="card-info">
            <div class="card-header">
                <h3 class="card-title">${product.title}</h3>
                <p class="card-meta">${product.category}</p>
            </div>
            <div class="card-footer">
                <span class="card-price">${formatPrice(product.price)}</span>
                <span class="btn-card-action">İncele</span>
            </div>
        </div>
    `;
    return a;
}

/* ================= CART LOGIC ================= */
function addToCart(product) {
    // Check if already in cart
    const existing = state.cart.find(item => item.id === product.id);
    if (existing) return; // Simple unique item cart for art

    state.cart.push(product);
    localStorage.setItem('anyway_cart', JSON.stringify(state.cart));
    updateCartUI();
    updateCartCount();
}

function removeFromCart(id) {
    state.cart = state.cart.filter(p => p.id !== id);
    localStorage.setItem('anyway_cart', JSON.stringify(state.cart));
    updateCartUI();
    updateCartCount();
}

function initCartDrawer() {
    // Inject Cart HTML if not present
    if (!document.getElementById('cart-drawer')) {
        const drawer = document.createElement('div');
        drawer.id = 'cart-drawer';
        drawer.className = 'cart-drawer';
        drawer.innerHTML = `
            <div class="cart-header">
                <h2 class="cart-title">Sepet</h2>
                <button class="cart-close" onclick="closeCart()">×</button>
            </div>
            <div class="cart-items" id="cart-items">
                <!-- Items go here -->
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Toplam</span>
                    <span id="cart-total-price">0.00</span>
                </div>
                <button class="btn-checkout" onclick="window.location.href='checkout.html'">Ödemeye Geç</button>
            </div>
        `;
        document.body.appendChild(drawer);

        // Add overlay
        const overlay = document.createElement('div');
        overlay.id = 'cart-overlay';
        overlay.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:1500; opacity:0; pointer-events:none; transition:opacity 0.3s;';
        overlay.onclick = closeCart;
        document.body.appendChild(overlay);
    }
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    container.innerHTML = '';

    let total = 0;

    if (state.cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; opacity:0.7; margin-top:40px; padding: 0 24px;"><p style="margin-bottom: 16px; font-size: 15px;">Sepetiniz boş.</p><a href="products.html" class="btn-outline" style="display: inline-block; padding: 12px 24px; margin-top: 8px;">Koleksiyonu Keşfedin</a></div>';
    } else {
        state.cart.forEach(item => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.image}" class="cart-item-img" alt="${item.title}" loading="lazy">
                <div class="cart-item-details">
                    <div>
                        <div style="font-weight:500; font-size:14px;">${item.title}</div>
                        <div style="font-size:12px; opacity:0.6;">${item.category}</div>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                        <span style="font-size:14px;">${formatPrice(item.price)}</span>
                        <button class="cart-remove" onclick="removeFromCart('${item.id}')">Kaldır</button>
                    </div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    setText('cart-total-price', formatPrice(total));
}

function updateCartCount() {
    const el = document.getElementById('cart-count');
    if (el) el.textContent = `(${state.cart.length})`;
}

/* ================= UTILS ================= */
function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Global scope for HTML onclick access
window.openCart = function () {
    document.getElementById('cart-drawer').classList.add('open');
    const overlay = document.getElementById('cart-overlay');
    overlay.style.opacity = 1;
    overlay.style.pointerEvents = 'auto';
    updateCartUI();
};

window.closeCart = function () {
    document.getElementById('cart-drawer').classList.remove('open');
    const overlay = document.getElementById('cart-overlay');
    overlay.style.opacity = 0;
    overlay.style.pointerEvents = 'none';
};

window.removeFromCart = removeFromCart;

function initNavigation() {
    // Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            if (navLinks.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // Navigation scroll behavior
    const nav = document.querySelector('.nav');
    if (nav) {
        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.scrollY;

            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            if (currentScroll > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }

            // Removed auto-hide behavior to fix user report
            // nav.classList.remove('hidden');

            lastScroll = currentScroll;
        });
    }
}

// Word Rotator Animation
document.addEventListener('DOMContentLoaded', () => {
    console.log("Animated Hero Init");
    const rotators = document.querySelectorAll('.word-rotator');

    rotators.forEach(rotator => {
        const words = rotator.querySelectorAll('.word');
        if (words.length === 0) return;

        let currentIndex = 0;

        // Ensure first word is active
        words[0].classList.add('active');

        setInterval(() => {
            const currentWord = words[currentIndex];
            const nextIndex = (currentIndex + 1) % words.length;
            const nextWord = words[nextIndex];

            // Exit current
            currentWord.classList.remove('active');
            currentWord.classList.add('exit');

            // Enter next
            nextWord.classList.remove('exit');
            nextWord.classList.add('active');

            // Cleanup exit class after transition
            setTimeout(() => {
                currentWord.classList.remove('exit');
            }, 600); // Match CSS transition duration

            currentIndex = nextIndex;
        }, 2500); // 2.5s interval
    });
});

/* =========================================
   Search & Wishlist Logic
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    // Search Overlay
    const searchBtn = document.getElementById('btn-search');
    const closeSearchBtn = document.getElementById('close-search');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');

    if (searchBtn && searchOverlay) {
        searchBtn.addEventListener('click', () => {
            searchOverlay.classList.add('open');
            setTimeout(() => searchInput.focus(), 100);
        });

        if (closeSearchBtn) {
            closeSearchBtn.addEventListener('click', () => {
                searchOverlay.classList.remove('open');
            });
        }

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && searchOverlay.classList.contains('open')) {
                searchOverlay.classList.remove('open');
            }
        });

        // Search Redirect
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    if (query) {
                        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                    }
                }
            });
        }
    }

    // Wishlist Drawer
    const wishlistBtn = document.getElementById('btn-wishlist');
    const closeWishlistBtn = document.getElementById('close-wishlist');
    const wishlistDrawer = document.getElementById('wishlist-drawer');

    if (wishlistBtn && wishlistDrawer) {
        wishlistBtn.addEventListener('click', () => {
            wishlistDrawer.classList.add('open');
        });

        if (closeWishlistBtn) {
            closeWishlistBtn.addEventListener('click', () => {
                wishlistDrawer.classList.remove('open');
            });
        }
    }
});
