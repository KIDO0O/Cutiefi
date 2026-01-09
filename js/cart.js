const CART_KEY = "cutieficCart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(sku, name, image) {
  let cart = getCart();
  let item = cart.find(p => p.sku === sku);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({
      sku,
      name,
      image, // MUST be like images/xxx.jpg
      qty: 1
    });
  }

  saveCart(cart);
  alert("Added to cart ✅");
}

function changeQty(index, delta) {
  let cart = getCart();
  cart[index].qty += delta;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  renderCart();
}

function renderCart() {
  const cart = getCart();
  const box = document.getElementById("cartItems");

  if (!box) return;

  box.innerHTML = "";

  if (cart.length === 0) {
    box.innerHTML = "<p class='empty'>Cart is empty 🛒</p>";
    return;
  }

  cart.forEach((item, index) => {
    box.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div class="cart-info">
          <b>${item.name}</b>
          <div>SKU: ${item.sku}</div>

          <div class="qty-control">
            <button onclick="changeQty(${index},-1)">−</button>
            <span>${item.qty}</span>
            <button onclick="changeQty(${index},1)">+</button>
          </div>
        </div>
      </div>
    `;
  });
}

function sendToWhatsApp() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  const name = document.getElementById("custName").value;
  const company = document.getElementById("company").value;
  const phone = document.getElementById("phone").value;
  const transport = document.getElementById("transport").value;

  let msg = `*Cutiefic Order*%0A%0A`;
  msg += `Name: ${name}%0A`;
  msg += `Company: ${company}%0A`;
  msg += `Phone: ${phone}%0A`;
  msg += `Transport: ${transport}%0A%0A`;

  cart.forEach(item => {
    msg += `${item.name}%0A`;
    msg += `Qty: ${item.qty}%0A%0A`;
  });

  window.open(
    `https://wa.me/9020902902?text=${msg}`,
    "_blank"
  );
}

renderCart();
