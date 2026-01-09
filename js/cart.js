const CART_KEY="cutieficCart";

function getCart(){
  return JSON.parse(localStorage.getItem(CART_KEY))||[];
}
function saveCart(c){
  localStorage.setItem(CART_KEY,JSON.stringify(c));
}

function addToCart(sku,name,image){
  const cart=getCart();
  const item=cart.find(i=>i.sku===sku);
  const qty=parseInt(document.getElementById("qty-"+sku).innerText);

  if(item) item.qty+=qty;
  else cart.push({sku,name,image,qty});

  saveCart(cart);
  alert("Added to cart");
}

function changeQty(sku,delta){
  const el=document.getElementById("qty-"+sku);
  let q=parseInt(el.innerText)+delta;
  if(q<1) q=1;
  el.innerText=q;
}

function renderCart(){
  const cart=getCart();
  const box=document.getElementById("cartItems");
  if(!box) return;

  box.innerHTML="";
  cart.forEach(i=>{
    box.innerHTML+=`
      <div class="cart-item">
        <b>${i.name}</b><br>
        Qty: ${i.qty}
      </div>`;
  });
}
renderCart();
