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
        // Update quantity if product already exists
        existingItem.quantity += product.quantity;
    } else {
        // Add new product
        cart.push(product);
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