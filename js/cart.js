let cart = JSON.parse(localStorage.getItem("cart")) || {};

/* + - preview qty */
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
  alert("Added to cart");
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
        <img src="${item.image}" style="height:60px">
        <div>${item.name}</div>
        <div>Qty: ${item.qty}</div>
      </div>
    `;
  });

  document.getElementById("total-qty").innerText = totalQty;
}

document.addEventListener("DOMContentLoaded", loadCart);
