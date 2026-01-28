/* =========================
   CART CORE (NO GHOST BUGS)
   ========================= */

const CART_KEY = 'cutieficCart';
const MARKETING_KEY = 'marketingCode';
const MARKETING_SECRET = 'CUTIE2025';

/* ---------- Storage helpers ---------- */
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

/* ---------- Cart actions ---------- */
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
  const cart = getCart().filter(item => item.id !== id);
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

/* ---------- Marketing mode ---------- */
function isMarketingMode() {
  return localStorage.getItem(MARKETING_KEY) === MARKETING_SECRET;
}

function setMarketingCode(code) {
  if (code === MARKETING_SECRET) {
    localStorage.setItem(MARKETING_KEY, code);
    renderCart();
    return true;
  }
  return false;
}

/* ---------- UI helpers ---------- */
function updateCartCount() {
  const cart = getCart();
  const total = cart.reduce((s, i) => s + i.quantity, 0);
  const el = document
