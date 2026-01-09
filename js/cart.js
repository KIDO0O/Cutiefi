const CART_KEY = "cutieficCart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(sku, name, image) {
  let cart = getCart();
  let item = cart.find(i => i.sku === sku);

  if (item) item.qty++;
  else cart.push({ sku, name, image, qty: 1 });

  saveCart(cart);
  alert("Added to cart ✅");
}

function changeQty(i, d) {
  let cart = getCart();
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i, 1);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  const box = document.getElementById("cartItems");
  if (!box) return;

  let cart = getCart();
  box.innerHTML = "";

  if (!cart.length) {
    box.innerHTML = "<p>Cart is empty</p>";
    return;
  }

  cart.forEach((p, i) => {
    box.innerHTML += `
    <div class="cart-item">
      <img src="${p.image}">
      <div>
        <b>${p.name}</b><br>
        Qty:
        <button onclick="changeQty(${i},-1)">−</button>
        ${p.qty}
        <button onclick="changeQty(${i},1)">+</button>
      </div>
    </div>`;
  });
}

function sendToWhatsApp() {
  let cart = getCart();
  if (!cart.length) return alert("Cart empty");

  let msg = "*Cutiefic Order*%0A%0A";
  cart.forEach(p => {
    msg += `${p.name} x ${p.qty}%0A`;
  });

  window.open(
    "https://wa.me/9020902902?text=" + msg,
    "_blank"
  );
}

renderCart();
