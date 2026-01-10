// Cart Management Functions

function getCart() {
    const cart = localStorage.getItem('cutieficCart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cutieficCart', JSON.stringify(cart));
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += product.quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price,
            image: product.image,
            quantity: product.quantity
        });
    }
    
    saveCart(cart);
    updateCartCount();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

function clearCart() {
    localStorage.removeItem('cutieficCart');
    updateCartCount();
}

// Initialize cart count on page load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        updateCartCount();
    });
}