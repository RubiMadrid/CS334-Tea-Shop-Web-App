// displayItem.js

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  function displayItem(itemID) {
    fetch(`/api/storeitems/${itemID}`)
      .then(r => r.json())
      .then(item => {
        if (!item) {
          console.error("No item found for ID:", itemID);
          return;
        }
  
        document.getElementById("mainImage").src         = item.image;
        document.getElementById("itemTitle").textContent = item.name;
        document.getElementById("itemPrice").textContent = `$${item.price}`;
        document.getElementById("itemSize").textContent  = `Size: ${item.oz} ounces`;
        document.getElementById("itemDescription").textContent =
          "This tea is exquisitely blended to deliver a refreshing and aromatic experience.";
        document.getElementById("itemTagline").textContent     = "Caffeine-free and invigorating";
        document.getElementById("itemIngredients").textContent =
          "Tea leaves, natural flavors, and water";
  
        const tastingNotes = ["Vanilla", "Chamomile", "Lemon", "Herbal"];
        document.getElementById("itemTastingNotes").innerHTML =
          tastingNotes.map(n => `<li>${n}</li>`).join("");
  
        document.getElementById("addToCartButton").onclick = () => {
          addToCart(item.id);
          addedToCartAlert();
        };
  
        console.log("Loaded item:", item);
      })
      .catch(err => {
        console.error("Failed to load item:", err);
      });
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