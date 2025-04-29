document.addEventListener("DOMContentLoaded", function () {
    let db;

    const request = indexedDB.open("TeaShopDB", 2);
    request.onerror = () => alert("Failed to open TeaShopDB");
    request.onsuccess = (event) => {
        db = event.target.result;
        loadItems();
    };

    // Load all items into the table
    function loadItems() {
        const transaction = db.transaction("storeItems", "readonly");
        const store = transaction.objectStore("storeItems");
        const request = store.getAll();

        request.onsuccess = function () {
            const items = request.result;
            const tbody = document.querySelector("tbody");
            tbody.innerHTML = "";

            items.forEach(item => {
                tbody.innerHTML += `
                    <tr data-id="${item.id}">
                        <td>${item.name}</td>
                        <td>$${item.price}</td>
                        <td>${item.stock || 0}</td>
                        <td>
                            <button class='btn btn-warning btn-sm' onclick='editItem(${item.id})'>Edit</button>
                            <button class='btn btn-danger btn-sm' onclick='deleteItem(${item.id})'>Delete</button>
                        </td>
                    </tr>
                `;
            });
        };
    }

    // Add item
    window.addItem = function () {
        const name = document.querySelector("input[placeholder='Enter tea name']").value;
        const price = parseFloat(document.querySelector("input[placeholder='Enter price']").value);
        const stock = parseInt(document.querySelector("input[placeholder='Enter stock quantity']").value);

        if (!name || isNaN(price) || isNaN(stock)) return alert("Fill all fields");

        const transaction = db.transaction("storeItems", "readwrite");
        const store = transaction.objectStore("storeItems");

        const id = Date.now(); // Unique key
        const newItem = { id, name, price, stock, image: "/static/img/default-tea.png" };

        const request = store.put(newItem);
        request.onsuccess = () => {
            loadItems();
            document.querySelector("form").reset();
        };
    };

    // Delete item
    window.deleteItem = function (id) {
        const transaction = db.transaction("storeItems", "readwrite");
        const store = transaction.objectStore("storeItems");
        store.delete(id).onsuccess = loadItems;
    };

    // Edit item 
    window.editItem = function (id) {
        const transaction = db.transaction("storeItems", "readonly");
        const store = transaction.objectStore("storeItems");
        const request = store.get(id);

        request.onsuccess = function () {
            const item = request.result;
            document.querySelector("input[placeholder='Enter tea name']").value = item.name;
            document.querySelector("input[placeholder='Enter price']").value = item.price;
            document.querySelector("input[placeholder='Enter stock quantity']").value = item.stock;
            deleteItem(item.id);
        };
    };
});
