document.addEventListener("DOMContentLoaded", function () {
    let db;
    const request = indexedDB.open("TeaShopDB", 2); // ✅ Correct DB name and version

    request.onerror = function (event) {
        console.error("[OrdersManager] Failed to open TeaShopDB", event.target.error);
        alert("Failed to open database.");
    };

    request.onsuccess = function (event) {
        db = event.target.result;

        if (!db.objectStoreNames.contains("storeOrders")) {
            console.error("[OrdersManager] ❌ Object store 'storeOrders' is missing.");
            alert("Orders cannot be displayed because 'storeOrders' does not exist.");
            return;
        }

        loadOrders();
    };

    function loadOrders() {
        const transaction = db.transaction("storeOrders", "readonly");
        const store = transaction.objectStore("storeOrders");
        const getAll = store.getAll();

        getAll.onsuccess = function () {
            const orders = getAll.result;
            const tbody = document.getElementById("orders-tbody");
            tbody.innerHTML = "";

            if (orders.length === 0) {
                tbody.innerHTML = "<tr><td colspan='10' class='text-center'>No orders found.</td></tr>";
                return;
            }

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

        getAll.onerror = function () {
            console.error("[OrdersManager] Failed to retrieve orders");
            alert("Could not load orders.");
        };
    }

    window.updateStatus = function (id) {
        const transaction = db.transaction("storeOrders", "readwrite");
        const store = transaction.objectStore("storeOrders");
        const getReq = store.get(id);

        getReq.onsuccess = function () {
            const order = getReq.result;
            order.status = "Shipped";
            const updateReq = store.put(order);
            updateReq.onsuccess = loadOrders;
        };
    };

    window.deleteOrder = function (id) {
        const transaction = db.transaction("storeOrders", "readwrite");
        const store = transaction.objectStore("storeOrders");
        const deleteReq = store.delete(id);
        deleteReq.onsuccess = loadOrders;
    };
});
