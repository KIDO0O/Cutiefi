let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* + - quantity control */
function changePreviewQty(id, change) {
  const span = document.getElementById(`preview-${id}`);
  if (!span) return;

  let qty = parseInt(span.innerText);
  qty += change;
  if (qty < 1) qty = 1;
  span.innerText = qty;
}

/* ADD TO CART */
function addToCart(id, name, image) {
  const qtySpan = document.getElementById(`preview-${id}`);
  const qty = qtySpan ? parseInt(qtySpan.innerText) : 1;

  if (!cart[id]) {
    cart[id] = {
      id,
      name,
      image,
      qty
    };
  } else {
    cart[id].qty += qty;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  alert(`${name} added to cart!`);
}

/* LOAD CART PAGE */
function loadCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  container.innerHTML = "";
  let totalQty = 0;

  Object.values(cart).forEach(item => {
    totalQty += item.qty;

    container.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}" class="cart-img">
        <div class="cart-name">${item.name}</div>
        <div class="cart-qty">Qty: ${item.qty}</div>
      </div>
    `;
  });

  const totalSpan = document.getElementById("total-qty");
  if (totalSpan) totalSpan.innerText = totalQty;
}

document.addEventListener("DOMContentLoaded", loadCart);

function sendToWhatsApp() {
  let message = "*New Cutiefic Order*%0A%0A";

  const name = document.getElementById("custName").value;
  const company = document.getElementById("company").value;
  const phone = document.getElementById("phone").value;
  const transport = document.getElementById("transport").value;

  message += `Name: ${name}%0A`;
  message += `Company: ${company}%0A`;
  message += `Phone: ${phone}%0A`;
  message += `Transport: ${transport}%0A%0A`;

  Object.values(cart).forEach(item => {
    message += `• ${item.name}%0A`;
    message += `  Qty: ${item.qty}%0A%0A`;
  });

  window.open(
    `https://wa.me/9020902902?text=${message}`,
    "_blank"
  );
}
