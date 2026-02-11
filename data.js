window.products = [
    // 1. Urban Triptych
    {
        id: "urban-triptych",
        title: "Urban Triptych",
        price: 125000,
        currency: "₺",
        category: "Mixed Media",
        dimensions: "80 x 240 cm (Total)",
        material: "Skateboards, Acrylic, Ink",
        frame: "None",
        status: "Available",
        description: "A trilogy of street culture meets high art. Three skateboard decks serve as the canvas for a chaotic yet harmonious expression of urban energy.",
        image: "img/works/collage-skate.jpg",
        featured: true
    },
    // 2. Crystal Void
    {
        id: "crystal-void",
        title: "Crystal Void",
        price: 165000,
        currency: "₺",
        category: "Mirror",
        dimensions: "180 x 90 cm",
        material: "Crystal, Mirror, Steel",
        frame: "Illuminated Crystal",
        status: "Available",
        description: "An infinite regression of light and form. The crystal border refracts the surroundings, creating a portal-like effect that transforms the space.",
        image: "img/works/mirror-gold.jpg",
        featured: true
    },
    // 3. Cobalt Fluidity
    {
        id: "cobalt-fluidity",
        title: "Cobalt Fluidity",
        price: 145000,
        currency: "₺",
        category: "Mirror",
        dimensions: "120 x 80 cm",
        material: "Sculpted Resin, Mirror",
        frame: "Blue Polyurethane",
        status: "Available",
        description: "Organic forms arrested in motion. The deep blue frame appears to be melting, challenging the rigid nature of the reflection it holds.",
        image: "img/works/mirror-blue.jpg",
        featured: false
    },
    // 4. Magenta Flow
    {
        id: "magenta-flow",
        title: "Magenta Flow",
        price: 145000,
        currency: "₺",
        category: "Mirror",
        dimensions: "100 x 90 cm",
        material: "Mirror Tiles, Resin",
        frame: "Pink Mosaic",
        status: "Available",
        description: "A disco-inspired distortion. Thousands of tiny mirror tiles create a fluid, shimmering surface that plays with light in unexpected ways.",
        image: "img/works/red-glass.jpg",
        featured: false
    },
    // 5. The Ace (was Inferno Glass)
    {
        id: "the-ace",
        title: "The Ace",
        price: 185000,
        currency: "₺",
        category: "Mixed Media",
        dimensions: "120 x 90 cm",
        material: "Glass, Resin, Ink",
        frame: "Black Matte",
        status: "Available",
        description: "A bold statement of risk and reward. The iconic spade symbol is reimagined through shattered glass and dark resin.",
        image: "img/works/ace-spades.jpg",
        featured: true
    },
    // 6. Shattered Ambition (Restored)
    {
        id: "shattered-ambition",
        title: "Shattered Ambition",
        price: 185000,
        currency: "₺",
        category: "Canvas",
        dimensions: "90 x 120 cm",
        material: "Resin, Glass, Gold Leaf",
        frame: "Black Matte",
        status: "Available",
        description: "A striking commentary on luxury and fragility. The iconic form is deconstructed and frozen in time.",
        image: "img/works/art-ace.jpg",
        featured: true
    },
    // 7. Elevate (Restored)
    {
        id: "elevate",
        title: "Elevate",
        price: 95000,
        currency: "₺",
        category: "Canvas",
        dimensions: "70 x 90 cm",
        material: "Resin, Glass, Pigment",
        frame: "Gold Leaf Wood",
        status: "Available",
        description: "Rising above the noise. A vertical composition that balances gravity and suspension.",
        image: "img/works/art-avion.jpg",
        featured: true
    },
    // 8. Vintage Chaos (Restored)
    {
        id: "vintage-chaos",
        title: "Vintage Chaos",
        price: 165000,
        currency: "₺",
        category: "Mixed Media",
        dimensions: "80 x 100 cm",
        material: "Resin, Vintage Bottle Fragments",
        frame: "Shadow Box (Black)",
        status: "Available",
        description: "Historical luxury meets entropy. Authentic vintage fragments are suspended in high-clarity resin.",
        image: "img/works/art-dom.jpg",
        featured: false
    },
    // 9. Grand Prix (New)
    {
        id: "grand-prix",
        title: "Grand Prix",
        price: 135000,
        currency: "₺",
        category: "Mixed Media",
        dimensions: "20 x 80 cm (x3)",
        material: "Skateboards, Decals",
        frame: "Wall Mount",
        status: "Available",
        description: "Speed captured in wood and ink. Inspired by the Monaco racing heritage.",
        image: "img/works/monaco-skate.jpg",
        featured: false
    },
    // 10. 911 Heritage (New)
    {
        id: "911-heritage",
        title: "911 Heritage",
        price: 145000,
        currency: "₺",
        category: "Canvas",
        dimensions: "100 x 100 cm",
        material: "Oil, Acrylic",
        frame: "Aluminum",
        status: "Available",
        description: "Automotive excellence translated into fine art. A tribute to timeless design.",
        image: "img/works/porsche-canvas.jpg",
        featured: false
    }
];

// Helper to format currency
const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
};
