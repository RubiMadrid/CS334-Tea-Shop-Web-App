// Waits for DOM Content to load
document.addEventListener('DOMContentLoaded', function () {

    fetch('/api/storeitems')
      .then(r => r.json())
      .then(items => {

        loadPopularItems(items);
        loadNewItems(items);
      });

    function loadPopularItems(items) {
        const tbody = document.getElementById("popular-items-list");
        tbody.innerHTML = "";

        if (items.length === 0) {
            tbody.innerHTML = "<tr><td colspan='10' class='text-center'>No teas found.</td></tr>";
            return;
        }

        let htmlText = `<div class="row row-cols-1 row-cols-md-4 g-4">`;
        
        // Sort items list by createdDate
        items.sort((a, b) => a.oz - b.oz);

        for (let i = 0; i < 4; i++) {
            const item = items[i];
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
        }

        // Close row div
        htmlText += `</div>`;

        // Assign Inner HTML
        tbody.innerHTML = htmlText;

        // Add element listener to cards
        let cards = document.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener("click", () => {
                window.location.href = "/item?itemID=" + cards[i].id;
            });
        }
    }

    function loadNewItems(items) {
        const tbody = document.getElementById("new-items-list");
        tbody.innerHTML = "";

        if (items.length === 0) {
            tbody.innerHTML = "<tr><td colspan='10' class='text-center'>No teas found.</td></tr>";
            return;
        }

        let htmlText = `<div class="row row-cols-1 row-cols-md-4 g-4">`;

        // Sort items list by createdDate
        items.sort((a, b) => a.price - b.price);

        for (let i = 0; i < 4; i++) {
            const item = items[i];
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
        }

        // Close row div
        htmlText += `</div>`;

        // Assign Inner HTML
        tbody.innerHTML = htmlText;

        // Add element listener to cards
        let cards = document.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener("click", () => {
                window.location.href = "/item?itemID=" + cards[i].id;
            });
        }
    }
});