document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkout-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        console.log("[Checkout] Submit triggered");

        const fullName = `${document.getElementById("first").value} ${document.getElementById("last").value}`;
        const address = document.getElementById("address").value;
        const phone = document.getElementById("phone-number").value;
        const cardName = document.getElementById("card-name").value;
        const cardNumber = document.getElementById("card-number").value;
        const expiry = document.getElementById("expiry").value;
        const cvv = document.getElementById("cvv").value;
        const paymentMethod = document.getElementById("payment-method").value;

        console.log("[Checkout] Opening TeaShopDB version 2");
        const request = indexedDB.open("TeaShopDB", 2);

        request.onerror = function (event) {
            console.error("[Checkout] Failed to open TeaShopDB", event);
            alert("Failed to open database.");
        };

        request.onsuccess = function (event) {
            console.log("[Checkout] DB opened successfully");
            const db = event.target.result;

            if (!db.objectStoreNames.contains("cartItems")) {
                console.error("[Checkout] ❌ Object store 'cartItems' is missing.");
                alert("Cart data is unavailable. Please return to the cart page.");
                return;
            }

            if (!db.objectStoreNames.contains("storeOrders")) {
                console.error("[Checkout] ❌ Object store 'storeOrders' is missing.");
                alert("Order storage is not available. Please contact support.");
                return;
            }

            const cartTx = db.transaction("cartItems", "readonly");
            const cartStore = cartTx.objectStore("cartItems");
            const getCartItems = cartStore.getAll();

            getCartItems.onerror = function () {
                console.error("[Checkout] Failed to retrieve cart items.");
                alert("There was a problem retrieving your cart. Please try again.");
            };

            getCartItems.onsuccess = function () {
                const cartItems = getCartItems.result;
                console.log("[Checkout] Retrieved cart items:", cartItems);

                if (!cartItems || cartItems.length === 0) {
                    alert("Your cart is empty. Please add items before checking out.");
                    return;
                }

                const orderTx = db.transaction("storeOrders", "readwrite");
                const orderStore = orderTx.objectStore("storeOrders");

                cartItems.forEach(item => {
                    const order = {
                        id: Date.now() + Math.floor(Math.random() * 1000),
                        customerName: fullName,
                        address,
                        phone,
                        cardName,
                        cardNumber,
                        expiry,
                        cvv,
                        paymentMethod,
                        teaName: item.name,
                        quantity: item.quantity,
                        total: parseFloat((item.price * item.quantity).toFixed(2)),
                        status: "Processing"
                    };

                    console.log("[Checkout] Saving order:", order);
                    const putRequest = orderStore.put(order);
                    putRequest.onerror = (e) => console.error("[Checkout] Error saving order", e);
                    putRequest.onsuccess = () => console.log("[Checkout] Order saved successfully");
                });

                orderTx.oncomplete = function () {
                    console.log("[Checkout] Order transaction complete");

                    const clearTx = db.transaction("cartItems", "readwrite");
                    clearTx.objectStore("cartItems").clear();

                    console.log("[Checkout] Cart cleared");
                    window.location.href = "confirmation.html";
                };

                orderTx.onerror = function (e) {
                    console.error("[Checkout] Order transaction failed", e);
                    alert("Failed to complete your order. Please try again.");
                };
            };
        };
    });
});
