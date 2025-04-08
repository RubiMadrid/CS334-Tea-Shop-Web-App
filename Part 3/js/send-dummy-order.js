document.addEventListener("DOMContentLoaded", () => {
    const dummyBtn = document.createElement("button");
    dummyBtn.textContent = "Send Dummy Order";
    dummyBtn.className = "btn btn-secondary mt-4 w-100";
    dummyBtn.onclick = sendDummyOrder;

    document.getElementById("body").appendChild(dummyBtn);
});

function sendDummyOrder() {
    const dbRequest = indexedDB.open("storeOrders", 1);

    dbRequest.onsuccess = function (event) {
        const db = event.target.result;
        const tx = db.transaction("orders", "readwrite");
        const store = tx.objectStore("orders");

        const dummyOrder = {
            id: Date.now(),
            customerName: "Test User",
            address: "123 Test Ave",
            phone: "5551234567",
            teaName: "Green Tea",
            quantity: 2,
            total: 5.10,
            paymentMethod: "credit-card",
            status: "Processing"
        };

        store.put(dummyOrder).onsuccess = function () {
            setTimeout(() => {
                window.location.href = "orders-manager.html";
            }, 300);
        };
    };

    dbRequest.onerror = function (e) {
        console.error("Failed to open storeOrders DB for dummy order", e);
    };
}
