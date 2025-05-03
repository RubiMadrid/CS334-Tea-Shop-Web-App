document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "/api/storeitems";

    function loadItems() {
        fetch(API_URL)
            .then(res => res.json())
            .then(items => {
                const tbody = document.querySelector("tbody");
                tbody.innerHTML = "";

                items.forEach(item => {
                    tbody.innerHTML += `
                        <tr data-id="${item.id}">
                            <td>${item.name}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>${item.oz}</td>
                            <td>
                                <button class="btn btn-warning btn-sm" onclick="editItem(${item.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id})">Delete</button>
                            </td>
                        </tr>`;
                });
            })
            .catch(err => console.error("Error loading items:", err));
    }

    window.addItem = () => {
        const name = document.querySelector("input[placeholder='Enter tea name']").value;
        const price = parseFloat(document.querySelector("input[placeholder='Enter price']").value);
        const oz = parseInt(document.querySelector("input[placeholder='Enter stock quantity']").value);

        if (!name || isNaN(price) || isNaN(oz)) {
            alert("Please fill in all fields correctly.");
            return;
        }

        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, oz, image: "/static/img/default-tea.png" })
        })
            .then(res => res.json())
            .then(() => {
                loadItems();
                document.querySelector("form").reset();
            })
            .catch(err => console.error("Error adding item:", err));
    };

    window.deleteItem = id => {
        fetch(`${API_URL}/${id}`, { method: "DELETE" })
            .then(res => res.json())
            .then(() => loadItems())
            .catch(err => console.error("Error deleting item:", err));
    };

    window.editItem = id => {
        fetch(`${API_URL}/${id}`)
            .then(res => res.json())
            .then(item => {
                document.querySelector("input[placeholder='Enter tea name']").value = item.name;
                document.querySelector("input[placeholder='Enter price']").value = item.price;
                document.querySelector("input[placeholder='Enter stock quantity']").value = item.oz;
                deleteItem(item.id); // Re-adds updated version on submit
            })
            .catch(err => console.error("Error editing item:", err));
    };

    loadItems();
});

