document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("checkout-form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const fullName = `${document.getElementById("first").value} ${document.getElementById("last").value}`;
        const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

        const request = indexedDB.open("storeOrders", 1);

        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains("orders")) {
                db.createObjectStore("orders", { keyPath: "id" });
            }
        };

        request.onerror = function () {
            alert("Failed to open database.");
        };

        request.onsuccess = function (event) {
            const db = event.target.result;
            const tx = db.transaction("orders", "readwrite");
            const store = tx.objectStore("orders");

            cartItems.forEach(item => {
                const order = {
                    id: Date.now() + Math.floor(Math.random() * 1000),
                    customerName: fullName,
                    address: document.getElementById("address").value,
                    phone: document.getElementById("phone-number").value,
                    teaName: item.name,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                    paymentMethod: document.getElementById("payment-method").value,
                    status: "Processing"
                };
                store.put(order);
            });

            tx.oncomplete = function () {
                localStorage.removeItem("cart");
                setTimeout(() => {
                    window.location.href = "confirmation.html";
                }, 250);
            };
        };
    });
});
