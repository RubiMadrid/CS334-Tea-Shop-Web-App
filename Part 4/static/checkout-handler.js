document.getElementById("checkout-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const fullName = `${document.getElementById("first").value.trim()} ${document.getElementById("last").value.trim()}`;
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const phone = document.getElementById("phone-number").value.trim();
    const paymentMethod = document.getElementById("payment-method").value;

    const request = indexedDB.open("TeaShopDB", 3);
    request.onsuccess = function (event) {
        const db = event.target.result;
        const tx = db.transaction("cartItems", "readonly");
        const store = tx.objectStore("cartItems");
        const getCartItems = store.getAll();

        getCartItems.onsuccess = function () {
            const cartItems = getCartItems.result;
            console.log("[Checkout] Retrieved cart items:", cartItems);

            if (!cartItems || cartItems.length === 0) {
                alert("Your cart is empty. Please add items before checking out.");
                return;
            }

            let ordersProcessed = 0;

            cartItems.forEach(item => {
                const order = {
                    customerName: fullName,
                    email,
                    address,
                    phone,
                    teaName: item.name,
                    quantity: item.quantity,
                    total: parseFloat((item.price * item.quantity).toFixed(2)),
                    paymentMethod,
                    status: "Processing"
                };

                fetch("/api/orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(order)
                })
                    .then(async res => {
                        if (!res.ok) throw new Error(await res.text() || res.status);
                        return res.json();
                    })
                    .then(data => {
                        console.log("[Checkout] Order saved:", data);
                        ordersProcessed++;

                        if (ordersProcessed === cartItems.length) {
                            const clearTx = db.transaction("cartItems", "readwrite");
                            clearTx.objectStore("cartItems").clear();

                            console.log("[Checkout] Cart cleared");
                            window.location.href = "/confirmation";
                        }
                    })
                    .catch(err => {
                        console.error("[Checkout] Order submission failed", err);
                        alert("Order failed. Please try again.");
                    });
            });
        };
    };
});
