/* ================= COLLECTION PAGE LOGIC ================= */
// Independent script to ensure robust rendering and no conflicts

document.addEventListener('DOMContentLoaded', () => {
    console.log('Collection script loaded');
    initCollection();
});

const collectionState = {
    filter: 'all',
    sort: 'newest'
};

function initCollection() {
    // 1. Render Initial
    renderGrid();
    initFilterTabs();
    initSortDropdown();
}

function renderGrid() {
    const grid = document.getElementById('product-grid');
    if (!grid) {
        console.error('Product Grid element not found!');
        return;
    }

    if (typeof products === 'undefined') {
        console.error('Products data not loaded!');
        return;
    }

    // A. Filter
    let items = collectionState.filter === 'all'
        ? [...products]
        : products.filter(p => p.category === collectionState.filter);

    // B. Sort
    if (collectionState.sort === 'price-low') {
        items.sort((a, b) => a.price - b.price);
    } else if (collectionState.sort === 'price-high') {
        items.sort((a, b) => b.price - a.price);
    }
    // 'newest' is default array order (assuming data is sorted by date or id)

    // C. Render
    grid.innerHTML = items.map((p, i) => {
        // Standard Grid pattern (Uniform)
        let gridClass = 'editorial-item';

        const badge = p.status !== 'Available'
            ? `<span class="product-badge sold" style="position:absolute; top:12px; left:12px; padding:6px 12px; font-size:10px; font-weight:600; text-transform:uppercase; background:#333; color:#888; z-index:2;">${p.status.toUpperCase()}</span>`
            : p.featured ? `<span class="product-badge" style="position:absolute; top:12px; left:12px; padding:6px 12px; font-size:10px; font-weight:600; text-transform:uppercase; background:#fff; color:#000; z-index:2;">FEATURED</span>` : '';

        // NO lazy loading, NO opacity animations. Pure render.
        return `
            <a href="product-detail.html?id=${p.id}" class="product-card ${gridClass}" data-category="${p.category}" style="opacity: 1; transform: none;">
                <div class="card-image-wrapper">
                    ${badge}
                    <img src="${p.image}" class="card-image" alt="${p.title}">
                </div>
                <div class="card-info">
                    <div class="card-left">
                        <h3 class="card-title">${p.title}</h3>
                        <p class="card-meta">${p.category}</p>
                    </div>
                    <div class="card-price">${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(p.price)}</div>
                </div>
            </a>
        `;
    }).join('');

    // D. Update Count
    const countEl = document.getElementById('product-count');
    if (countEl) countEl.textContent = items.length;
}

function initFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update UI
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update State
            collectionState.filter = tab.dataset.filter;
            renderGrid();
        });
    });
}

function initSortDropdown() {
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            collectionState.sort = e.target.value;
            renderGrid();
        });
    }
}
