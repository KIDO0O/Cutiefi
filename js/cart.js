/* =========================
   CUTIEFIC CART (STABLE)
   ========================= */

const CART_KEY = 'cutieficCart';
const MARKETING_KEY = 'marketingCode';
const MARKETING_SECRET = 'CUTIE2025';

/* ---------- Storage ---------- */
function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

/* ---------- Cart Actions ---------- */
function addToCart(product) {
  if (!product || !product.id) return;

  const cart = getCart();
  const existing = cart.find(i => i.id === product.id);

  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity: product.quantity || 1,
      price: product.price || 0
    });
  }

  saveCart(cart);
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
}

function changeQty(id, delta) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }

  saveCart(cart);
  renderCart();
}

/* ---------- Marketing Mode ---------- */
function isMarketingMode() {
  return localStorage.getItem(MARKETING_KEY) === MARKETING_SECRET;
}

function unlockMarketing() {
  const input = document.getElementById('marketingCodeInput');
  if (!input) return;

  if (input.value.trim() === MARKETING_SECRET) {
    localStorage.setItem(MARKETING_KEY, MARKETING_SECRET);
    alert('Marketing mode activated');
    renderCart();
  } else {
    alert('Wrong code');
  }
}

/* ---------- UI ---------- */
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = total;
}

/* ---------- CART RENDER ---------- */
function renderCart() {
  const cart = getCart();
  const container = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');

  if (!container) return;

  container.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const itemTotal = item.quantity * (item.price || 0);
    total += itemTotal;

    const div = document.createElement('div');
    div.className = 'cart-item';

    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-info">
        <h4>${item.name}</h4>

        <div class="qty-control">
          <button onclick="changeQty('${item.id}', -1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQty('${item.id}', 1)">+</button>
        </div>

        ${
          isMarketingMode()
            ? `<input type="number" class="price-input"
                 value="${item.price}"
                 onchange="updatePrice('${item.id}', this.value)">`
            : `<p class="price">Price hidden</p>`
        }

        <button class="remove-btn" onclick="removeFromCart('${item.id}')">
          Remove
        </button>
      </div>
    `;

    container.appendChild(div);
  });

  if (totalEl) {
    totalEl.textContent = isMarketingMode()
      ? `₹${total}`
      : 'Unlock marketing to see total';
  }
}

/* ---------- Price Update ---------- */
function updatePrice(id, value) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.price = Number(value) || 0;
  saveCart(cart);
  renderCart();
}

/* ---------- Init ---------- */
updateCartCount();
document.addEventListener('DOMContentLoaded', renderCart);
