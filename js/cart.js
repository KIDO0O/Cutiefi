// Get cart from localStorage
function getCart() {
    const cart = localStorage.getItem('cutieficCart');
    return cart ? JSON.parse(cart) : [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem('cutieficCart', JSON.stringify(cart));
    updateCartCount();
}

// Add product to cart
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
            image: product.image, // always stored
            price: product.price || 0,
            quantity: product.quantity
        });
    }

    saveCart(cart);
}

// Update cart count display
function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        countElement.textContent = totalItems;
    }
}

// Initialize cart count on page load
updateCartCount();