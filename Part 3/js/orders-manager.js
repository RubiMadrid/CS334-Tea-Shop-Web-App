document.addEventListener("DOMContentLoaded", function () {
    let db;
    const request = indexedDB.open("storeOrders", 1); // ✅ Updated DB name

    request.onupgradeneeded = function (event) {
        db = event.target.result;
        if (!db.objectStoreNames.contains("orders")) {
            db.createObjectStore("orders", { keyPath: "id" });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        loadOrders();
    };

    function loadOrders() {
        const transaction = db.transaction("orders", "readonly");
        const store = transaction.objectStore("orders");
        const getAll = store.getAll();

        getAll.onsuccess = function () {
            const orders = getAll.result;
            const tbody = document.getElementById("orders-tbody");
            tbody.innerHTML = "";

            orders.forEach(order => {
                tbody.innerHTML += `
                    <tr data-id="${order.id}">
                        <td>#${order.id}</td>
                        <td>${order.customerName}</td>
                        <td>${order.address || ''}</td>
                        <td>${order.phone || ''}</td>
                        <td>${order.teaName}</td>
                        <td>${order.quantity}</td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td>${order.paymentMethod || ''}</td>
                        <td>${order.status}</td>
                        <td>
                            ${order.status === "Processing" ? `<button class='btn btn-success btn-sm' onclick='updateStatus(${order.id})'>Mark as Shipped</button>` : ""}
                            <button class='btn btn-danger btn-sm' onclick='deleteOrder(${order.id})'>Delete</button>
                        </td>
                    </tr>
                `;
            });
        };
    }

    window.updateStatus = function (id) {
        const transaction = db.transaction("orders", "readwrite");
        const store = transaction.objectStore("orders");
        const getReq = store.get(id);

        getReq.onsuccess = function () {
            const order = getReq.result;
            order.status = "Shipped";
            const updateReq = store.put(order);
            updateReq.onsuccess = loadOrders;
        };
    };

    window.deleteOrder = function (id) {
        const transaction = db.transaction("orders", "readwrite");
        const store = transaction.objectStore("orders");
        const deleteReq = store.delete(id);
        deleteReq.onsuccess = loadOrders;
    };
});
