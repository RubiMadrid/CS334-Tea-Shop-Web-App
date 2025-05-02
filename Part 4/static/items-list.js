// Waits for DOM Content to load
document.addEventListener('DOMContentLoaded', () => {
    loadItems();
  });
  
  function loadItems() {
    const container = document.getElementById('items-list');
  
    fetch('/api/storeitems')
      .then(r => r.json())
      .then(items => {
        if (!items.length) {
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
                    <div><span class="h5">$${item.price}</span></div>
                    <p class="card-text">Proin sed justo non leo…</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>`;
  
        let cards = document.getElementsByClassName("card");
        for (let i = 0; i < cards.length; i++) {
          cards[i].addEventListener("click", () => {
            window.location.href = "/item?itemID=" + cards[i].id;
          });
        }
      })
      .catch(err => {
        console.error(err);
        container.innerHTML = '<p class="text-danger">Failed to load items.</p>';
      });
  }
  