// db.js

const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

const request = indexedDB.open("TeaShopDB", 1);

request.onerror = function (event) {
  console.error("An error occurred with TeaShopDB");
  console.error(event);
};

request.onupgradeneeded = function () {
  db = request.result;

  if (!db.objectStoreNames.contains("storeItems")) {
    db.createObjectStore("storeItems", { keyPath: "id" });
  }

  if (!db.objectStoreNames.contains("cartItems")) {
    db.createObjectStore("cartItems", { keyPath: "id" });
  }

  
};

request.onsuccess = function () {
  db = request.result;

  const txn = db.transaction("storeItems", "readonly");
  const store = txn.objectStore("storeItems");
  const checkRequest = store.getAll();

  checkRequest.onsuccess = function () {
    if (checkRequest.result.length === 0) {
      addInitialStoreItems();
    }
  };

  // This runs only after DB is ready
  displayCartItems();
};

function addInitialStoreItems() {
  const transaction = db.transaction("storeItems", "readwrite");
  const store = transaction.objectStore("storeItems");

  store.put({ id: 1, name: "Green Tea", price: 2.55, image: "../src/img/img-tea-1.png" });
  store.put({ id: 2, name: "Black Tea", price: 2.55, image: "../src/img/img-tea-2.png" });
  store.put({ id: 3, name: "Sweat Tea", price: 3.99, image: "../src/img/img-tea-3.png" });
}
