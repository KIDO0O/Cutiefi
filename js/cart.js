function getCart() {
    const cart = localStorage.getItem('cutieficCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cutieficCart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    
    if (existing) {
        existing.quantity += product.quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            sku: product.sku,
            image: product.image,
            quantity: product.quantity,
            price: 0
        });
    }
    
    saveCart(cart);
}

function updateCartCount() {
    const cart = getCart();
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const elem = document.getElementById('cartCount');
    if (elem) elem.textContent = total;
}

function isPricingUnlocked() {
    return localStorage.getItem('pricingUnlocked') === 'true';
}

function unlockPricing() {
    const code = document.getElementById('marketingCode').value;
    if (code === 'CUTIE2025') {
        localStorage.setItem('pricingUnlocked', 'true');
        renderCart();
        alert('Pricing unlocked!');
    } else {
        alert('Invalid code.');
    }
}

function renderCart() {
    const cart = getCart();
    const emptyDiv = document.getElementById('emptyCart');
    const contentDiv = document.getElementById('cartContent');
    const itemsDiv = document.getElement
