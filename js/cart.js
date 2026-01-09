const cart = JSON.parse(localStorage.getItem("cart")) || [];
const container = document.getElementById("cart-items");

if (cart.length === 0) {
  container.innerHTML = "<p>Your cart is empty</p>";
}

cart.forEach(item => {
  const div = document.createElement("div");
  div.className = "cart-item";
  div.innerText = item;
  container.appendChild(div);
});
