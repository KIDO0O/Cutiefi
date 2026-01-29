const CART_KEY = "cutieficCart";
const MARKETING_KEY = "cutieficMarketing";
const SECRET_CODE = "CUTIE2025";

/* ---------------- CART STORAGE ---------------- */
function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = getCart().reduce((s, i) => s + i.quantity, 0);
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}

/* ---------------- MARKETING MODE ---------------- */
function isMarketingUnlocked() {
  return localStorage.getItem(MARKETING_KEY) === "true";
}

function unlockMarketing(code) {
  if (code === SECRET_CODE) {
    localStorage.setItem(MARKETING_KEY, "true");
    renderCart();
    alert("Marketing mode unlocked");
  } else {
    alert("Wrong code");
  }
}

/* ---------------- CART ACTIONS ---------------- */
function addToCart(product) {
  const cart = getCart();
  const found = cart.find(i => i.id === product.id);

  if (found) {
    found.quantity += product.quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      image: product.image,
      quantity: product.quantity,
      price: 0
    });
  }

  saveCart(cart);
}

function changeQty(id, delta) {
  let cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  saveCart(cart);
  renderCart();
}

function updatePrice(id, value) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.price = Number(value) || 0;
  saveCart(cart);
}
