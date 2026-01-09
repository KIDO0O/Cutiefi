const CART_KEY = "cutieficCart";
const SECRET = "Cutiefic@2232";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function changePreviewQty(sku, delta) {
  const el = document.getElementById("preview-" + sku);
  let qty = parseInt(el.innerText);
  qty = Math.max(1, qty + delta);
  el.innerText = qty;
}

function addToCart(sku, name, image) {
  const qty = parseInt(document.getElementById("preview-" + sku).innerText);
  const cart = getCart();

  const existing = cart.find(i => i.sku === sku);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ sku, name, image, qty, price: "" });
  }

  saveCart(cart);
  alert("Added to cart ✅");
}

function renderCart() {
  const cart = getCart();
  const box = document.getElementById("cartItems");
  if (!box) return;

  box.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;

  const name = document.getElementById("customerName")?.value || "";
  const isMarketing = name.includes(SECRET);

  cart.forEach((item, i) => {
    totalQty += item.qty;
    totalPrice += (item.price || 0) * item.qty;

    box.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div>
          <b>${item.name}</b><br>
          SKU: ${item.sku}
          <div class="qty-control">
            <button onclick="updateQty(${i},-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${i},1)">+</button>
          </div>
          ${isMarketing ? `
            <input placeholder="Price"
              value="${item.price}"
              onchange="setPrice(${i},this.value)">
          ` : ``}
        </div>
      </div>
    `;
  });

  document.getElementById("totalQty").innerText =
    "Total Quantity: " + totalQty;

  document.getElementById("totalPrice").innerText =
    isMarketing ? "Total Price: ₹" + totalPrice : "";
}

function updateQty(i, d) {
  const cart = getCart();
  cart[i].qty += d;
  if (cart[i].qty <= 0) cart.splice(i,1);
  saveCart(cart);
  renderCart();
}

function setPrice(i, val) {
  const cart = getCart();
  cart[i].price = val;
  saveCart(cart);
}

function sendToWhatsApp() {
  const cart = getCart();
  if (!cart.length) return alert("Cart empty");

  const nameRaw = customerName.value;
  const isMarketing = nameRaw.includes(SECRET);
  const name = nameRaw.replace(SECRET,"").trim();

  let msg = `*New Cutiefic Order*%0A`;
  msg += `Name: ${name}%0A`;
  msg += `Company: ${companyName.value}%0A`;
  msg += `Address: ${address.value}%0A`;
  msg += `Transport: ${transport.value}%0A%0A`;

  cart.forEach(i=>{
    msg += `${i.name} (SKU:${i.sku})%0AQty:${i.qty}%0A`;
    if (isMarketing && i.price) msg += `Price: ₹${i.price}%0A`;
    msg += `%0A`;
  });

  window.open(`https://wa.me/9020902902?text=${msg}`,"_blank");
}

document.addEventListener("input", renderCart);
renderCart();
