document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "/api/orders";

    function loadOrders() {
        fetch(API_URL)
            .then(res => res.json())
            .then(orders => {
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
            })
            .catch(error => {
                console.error("[OrdersManager] Failed to load orders:", error);
                alert("Could not load orders.");
            });
    }

    window.updateStatus = function (id) {
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Shipped" })
        })
            .then(() => loadOrders())
            .catch(err => console.error("Update failed", err));
    };

    window.deleteOrder = function (id) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        })
            .then(() => loadOrders())
            .catch(err => console.error("Delete failed", err));
    };

    loadOrders();
});

