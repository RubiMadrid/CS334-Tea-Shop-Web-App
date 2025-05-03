document.addEventListener('DOMContentLoaded', () => {
    loadItems();
});

function loadItems() {
    const container = document.getElementById('items-list');

    fetch('/api/storeitems')
        .then(response => response.json())
        .then(items => {
            if (!Array.isArray(items) || items.length === 0) {
                container.innerHTML = '<p class="text-center">No teas found.</p>';
                return;
            }

            container.innerHTML = `
                <div class="row row-cols-1 row-cols-md-4 g-4">
                    ${items.map(item => `
                        <div class="col">
                            <div id="${item.id}" class="card h-100 bg-colore text-white">
                                <img class="h-100" src="${item.image}" alt="${item.name}">
                                <div class="p-3">
                                    <h3 class="card-title"><strong>${item.name}</strong></h3>
                                    <div><span class="h5">$${item.price.toFixed(2)}</span></div>
                                    <p class="card-text">Proin sed justo non leo…</p>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>`;

            document.querySelectorAll('.card').forEach(card => {
                card.addEventListener('click', () => {
                    window.location.href = `/item?itemID=${card.id}`;
                });
            });
        })
        .catch(err => {
            console.error("Error loading items:", err);
            container.innerHTML = '<p class="text-danger">Failed to load items.</p>';
        });
}
