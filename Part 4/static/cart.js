// cart.js

document.addEventListener("dbReady", () => displayCartItems());

function addToCart(itemId, inputQuantity = 1) {
  const storeTxn = db.transaction("storeItems", "readonly");
  const store = storeTxn.objectStore("storeItems");
  const request = store.get(itemId);

  request.onsuccess = function () {
    const item = request.result;
    if (item) {
      const cartTxn = db.transaction("cartItems", "readwrite");
      const cart = cartTxn.objectStore("cartItems");

      const cartRequest = cart.get(itemId);
      cartRequest.onsuccess = function () {
        let cartItem = cartRequest.result;
        if (cartItem) {
          cartItem.quantity += inputQuantity;
        } else {
          cartItem = { ...item, quantity: inputQuantity };
        }
        cart.put(cartItem).onsuccess = displayCartItems;
      };
    }
  };
}

function displayCartItems() {
  const txn = db.transaction("cartItems", "readonly");
  const cart = txn.objectStore("cartItems");

  cart.getAll().onsuccess = function (event) {
    const items = event.target.result;
    const tbody = document.getElementById("cart-table-body");
    tbody.innerHTML = "";

    let totalPrice = 0;

    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      tbody.innerHTML += `
        <tr>
          <td class="p-4">
            <div class="media align-items-center">
              <img src="${item.image}" class="d-block ui-w-40 ui-bordered mr-4" alt="${item.name}">
              <div class="media-body">
                <a href="/item?itemID=${item.id}" class="d-block text-dark">${item.name}</a>
              </div>
            </div>
          </td>
          <td class="text-right font-weight-semibold align-middle p-4">$${item.price.toFixed(2)}</td>
          <td class="align-middle p-4">
            <input type="number" class="form-control text-center" value="${item.quantity}" min="1"
              onchange="updateQuantity(${item.id}, this.value)">
          </td>
          <td class="text-right font-weight-semibold align-middle p-4">$${itemTotal.toFixed(2)}</td>
          <td class="text-center align-middle px-0">
            <a href="#" class="shop-tooltip close float-none text-danger" title="Remove"
              onclick="removeFromCart(${item.id})">×</a>
          </td>
        </tr>
      `;
    });

    document.getElementById("total").innerHTML = `<strong>$${totalPrice.toFixed(2)}</strong>`;
  };
}

function updateQuantity(itemId, newQuantity) {
  const qty = parseInt(newQuantity);
  if (isNaN(qty) || qty < 1) return;

  const txn = db.transaction("cartItems", "readwrite");
  const store = txn.objectStore("cartItems");

  store.get(itemId).onsuccess = function (event) {
    const item = event.target.result;
    if (item) {
      item.quantity = qty;
      store.put(item).onsuccess = displayCartItems;
    }
  };
}

function removeFromCart(itemId) {
  const txn = db.transaction("cartItems", "readwrite");
  const store = txn.objectStore("cartItems");

  store.delete(itemId).onsuccess = displayCartItems;
}

function clearCart() {
  const txn = db.transaction("cartItems", "readwrite");
  const store = txn.objectStore("cartItems");
  store.clear().onsuccess = displayCartItems;
}

function addedToCartAlert() {
  alert("✅ Added to Cart");
}
