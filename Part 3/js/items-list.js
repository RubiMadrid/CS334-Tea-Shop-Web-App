// Waits for DOM Content to load
document.addEventListener('DOMContentLoaded', function () {
    // IndexdDB
    let db;
    const indexedDB =
        window.indexedDB ||
        window.mozIndexedDB ||
        window.webkitIndexedDB ||
        window.msIndexedDB ||
        window.shimIndexedDB;
        
    // Opend IndexDB Connection
    const request = indexedDB.open("TeaShopDB", 1);

    // Error handler
    request.onerror = function (event) {
        alert("An error occurred with TeaShopDB");
        console.error(event);
    };

    // Success handler
    request.onsuccess = (event) => {
        db = event.target.result;
        loadItems();
    }

    function loadItems() {
            const transaction = db.transaction("storeItems", "readonly");
            const store = transaction.objectStore("storeItems");
            const getAll = store.getAll();
    
            getAll.onsuccess = function () {
                const items = getAll.result;
                const tbody = document.getElementById("items-list");
                tbody.innerHTML = "";
    
                if (items.length === 0) {
                    tbody.innerHTML = "<tr><td colspan='10' class='text-center'>No teas found.</td></tr>";
                    return;
                }

                let htmlText = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
            
                // Sort items list by createdDate
                items.sort((a, b) => a.oz - b.oz);

                items.forEach(item => {
                    htmlText += `
                        <div class="col">
                            <div id="${item.id}" class="card h-100 bg-colore text-white">
                                <img class="h-100" src="${item.image}" alt="banner">
                                <div class="p-3">
                                    <h3 class="card-title"><strong>${item.name}</strong></h3>
                                    <div><span class="h5">$${item.price}</span><s class="text-light p-2"></s></div>
                                    <p class="card-text">
                                        &emsp;Proin sed justo non leo dignissim gravida. Integer nec felis id lectus efficitur accumsan quis vel lacus.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <br>
                    `;
                });
                htmlText += `</div>`;

                tbody.innerHTML = htmlText;

                let cards = document.getElementsByClassName("card");
                console.log(cards)
                for (let i = 0; i < cards.length; i++) {
                    cards[i].addEventListener("click", () => {
                        window.location.href = "./item2-details.html?itemID=" + cards[i].id;
                    });
                }
            };
    
            getAll.onerror = function () {
                console.error("[ItemsList] Failed to retrieve items");
                alert("Could not load items.");
            };
    }
});