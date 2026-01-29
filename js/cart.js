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
        alert('Pricing unlocked! You can now set prices.');
    } else {
        alert('Invalid code.');
    }
}

function renderCart() {
    const cart = getCart();
    const emptyDiv = document.getElementById('emptyCart');
    const contentDiv = document.getElementById('cartContent');
    const itemsDiv = document.getElementById('cartItems');
    const totalSection = document.getElementById('totalSection');
    const pricingUnlocked = isPricingUnlocked();

    if (cart.length === 0) {
        emptyDiv.style.display = 'block';
        contentDiv.style.display = 'none';
        return;
    }

    emptyDiv.style.display = 'none';
    contentDiv.style.display = 'block';

    itemsDiv.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                <p>SKU: ${item.sku}</p>
            </div>
            <div class="cart-item-controls">
                <div class="quantity-control">
                    <button class="qty-btn" onclick="changeQty('${item.id}', -1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                </div>
                ${pricingUnlocked ? `
                    <input type="number" 
                           class="price-input" 
                           placeholder="Price per unit" 
                           value="${item.price || ''}"
                           onchange="updatePrice('${item.id}', this.value)"
                           min="0">
                ` : ''}
            </div>
        </div>
    `).join('');

    if (pricingUnlocked) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
        document.getElementById('grandTotal').textContent = '₹' + total;
        totalSection.style.display = total > 0 ? 'flex' : 'none';
    } else {
        totalSection.style.display = 'none';
    }
}

function changeQty(id, change) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            const filtered = cart.filter(i => i.id !== id);
            saveCart(filtered);
        } else {
            saveCart(cart);
        }
        renderCart();
    }
}

function updatePrice(id, price) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.price = parseFloat(price) || 0;
        saveCart(cart);
        renderCart();
    }
}

function openCheckout() {
    const cart = getCart();
    const pricingUnlocked = isPricingUnlocked();
    
    if (pricingUnlocked) {
        const allPriced = cart.every(item => item.price > 0);
        if (!allPriced) {
            alert('Please set prices for all products before checkout.');
            return;
        }
    }
    
    document.getElementById('cartContent').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'block';
}

function closeCheckout() {
    document.getElementById('cartContent').style.display = 'block';
    document.getElementById('checkoutSection').style.display = 'none';
}

if (document.getElementById('checkoutForm')) {
    document.getElementById('checkoutForm').onsubmit = function(e) {
        e.preventDefault();
        
        const cart = getCart();
        const name = document.getElementById('customerName').value;
        const phone = document.getElementById('customerPhone').value;
        const address = document.getElementById('customerAddress').value;
        const transport = document.getElementById('transportName').value;
        const pricingUnlocked = isPricingUnlocked();

        let msg = '*New Order - Cutiefic*\n\n';
        msg += '*Customer Details*\n';
        msg += 'Name: ' + name + '\n';
        msg += 'Phone: ' + phone + '\n';
        msg += 'Address: ' + address + '\n';
        if (transport) msg += 'Transport: ' + transport + '\n';
        msg += '\n*Order Details*\n';

        let grandTotal = 0;

        cart.forEach(item => {
            msg += item.name + ' (' + item.sku + ')\n';
            if (pricingUnlocked && item.price > 0) {
                const itemTotal = item.price * item.quantity;
                grandTotal += itemTotal;
                msg += 'Qty ' + item.quantity + ' × Rs.' + item.price + ' = Rs.' + itemTotal + '\n\n';
            } else {
                msg += 'Qty: ' + item.quantity + '\n\n';
            }
        });

        if (pricingUnlocked && grandTotal > 0) {
            msg += '*Grand Total: Rs.' + grandTotal + '*';
        }

        window.open('https://wa.me/919020902902?text=' + encodeURIComponent(msg), '_blank');
        
        saveCart([]);
        localStorage.removeItem('pricingUnlocked');
        closeCheckout();
        renderCart();
    };
}

if (document.getElementById('cartItems')) {
    renderCart();
}

updateCartCount();