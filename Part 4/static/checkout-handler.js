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
            .then(res => res.json())
            .then(data => {
                console.log("[Checkout] Order saved:", data);
                ordersProcessed++;

                if (ordersProcessed === cartItems.length) {
                    const clearTx = db.transaction("cartItems", "readwrite");
                    clearTx.objectStore("cartItems").clear();

                    console.log("[Checkout] Cart cleared");
                    window.location.href = "confirmation.html";
                }
            })
            .catch(err => {
                console.error("[Checkout] Order submission failed", err);
                alert("Order failed. Please try again.");
            });
    });
};

