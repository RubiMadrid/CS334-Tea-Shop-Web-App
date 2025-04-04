// cart.js
function addToCart(itemId, inputQuantity = 1) {
    const storeTxn = db.transaction("storeItems", "readonly");
    const store = storeTxn.objectStore("storeItems");
    const request = store.get(itemId);
  
    request.onsuccess = function () {
      const item = request.result;
      //if item exists then continue.
      if (item) {
        const cartTxn = db.transaction("cartItems", "readwrite");
        const cart = cartTxn.objectStore("cartItems");
  
        const cartRequest = cart.get(itemId);
        cartRequest.onsuccess = function () {
          let cartItem = cartRequest.result;
          //increment quantity by 1 if item found.
          if (cartItem) {
            cartItem.quantity += inputQuantity;
          } else {
            cartItem = { ...item, quantity: inputQuantity };
          }
          //updates quantity or creats a new item in cart.
          cart.put(cartItem);
          displayCartItems();
        };
      }
    };
}

function displayCartItems() {
    const txn = db.transaction("cartItems", "readonly");
    const cart = txn.objectStore("cartItems");
  
    const request = cart.getAll();
    request.onsuccess = function () {
      const cart = request.result;
      const tbody = document.getElementById("cart-table-body");
      tbody.innerHTML = "";
  
      let totalPrice = 0;
  
      cart.forEach(function(item){
        const itemTotal = (item.price * item.quantity).toFixed(2);
        totalPrice += parseFloat(itemTotal);
  
        const row = `
          <tr>
            <td class="p-4">
              <div class="media align-items-center">
                <img src="${item.image}" class="d-block ui-w-40 ui-bordered mr-4" alt="${item.name}">
                <div class="media-body">
                  <a href="#" class="d-block text-dark">${item.name}</a>
                </div>
              </div>
            </td>
            <td class="text-right font-weight-semibold align-middle p-4">$${item.price.toFixed(2)}</td>
            <td class="align-middle p-4">
              <input type="number" class="form-control text-center" value="${item.quantity}" min="1"
                onchange="updateQuantity(${item.id}, this.value)">
            </td>
            <td class="text-right font-weight-semibold align-middle p-4">$${itemTotal}</td>
            <td class="text-center align-middle px-0">
              <a href="#" class="shop-tooltip close float-none text-danger" title="Remove"
                onclick="removeFromCart(${item.id})">×</a>
            </td>
          </tr>
        `;
  
        tbody.innerHTML += row;
      });
  
      document.getElementById("total").innerHTML = `<strong>$${totalPrice.toFixed(2)}</strong>`;
    };
}

function updateQuantity(itemId, newQuantity) {
    const txn = db.transaction("cartItems", "readwrite");
    const store = txn.objectStore("cartItems");
  
    const request = store.get(itemId);
    request.onsuccess = function () {
      const item = request.result;
      if (item) {
        item.quantity = parseInt(newQuantity);
        store.put(item);
        displayCartItems();
      }
    };
}

function removeFromCart(itemId) {
    const txn = db.transaction("cartItems", "readwrite");
    const store = txn.objectStore("cartItems");
  
    store.delete(itemId).onsuccess = function () {
      displayCartItems();
    };
}
  
  
  
  