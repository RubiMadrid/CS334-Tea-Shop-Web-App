// displayItem.js

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  function displayItem(itemID) {
    const id = parseInt(itemID, 10);
  
    const transaction = window.db.transaction("storeItems", "readonly");
    const store = transaction.objectStore("storeItems");
    const request = store.get(id);
  
    request.onsuccess = function () {
      const item = request.result;
      if (item) {
        //inject data from IndexedDB into the page
        document.getElementById("mainImage").src = item.image;
        document.getElementById("itemTitle").textContent = item.name;
        document.getElementById("itemPrice").textContent = `$${item.price}`;
        document.getElementById("itemSize").textContent = `Size: ${item.oz} ounces`;
        document.getElementById("itemDescription").textContent =
          "This tea is exquisitely blended to deliver a refreshing and aromatic experience.";
        document.getElementById("itemTagline").textContent = "Caffeine-free and invigorating";
        document.getElementById("itemIngredients").textContent =
          "Tea leaves, natural flavors, and water";
  
        const tastingNotes = ["Vanilla", "Chamomile", "Lemon", "Herbal"];
        let tastingNotesHTML = "";
        tastingNotes.forEach(note => {
          tastingNotesHTML += `<li>${note}</li>`;
        });
        document.getElementById("itemTastingNotes").innerHTML = tastingNotesHTML;
  
        const addToCartButton = document.getElementById("addToCartButton");
        addToCartButton.onclick = function () {
          addToCart(item.id);
          addedToCartAlert();
        };
  
        console.log("Loaded item:", item);
      } else {
        console.error("No item found for ID:", id);
      }
    };
  
    request.onerror = function (event) {
      console.error("Error retrieving the item:", event.target.error);
    };
  }
  
  function runDisplay() {
    const itemID = getQueryParam("itemID");
    if (itemID) {
      displayItem(itemID);
    } else {
      console.error("No itemID parameter found in the URL.");
    }
  }
  document.addEventListener("DOMContentLoaded", function () {
    if (window.db) {
      runDisplay();
    } else {
      document.addEventListener("dbReady", runDisplay);
    }
  });  