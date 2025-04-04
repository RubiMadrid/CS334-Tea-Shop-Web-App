//db.js

const indexedDB = window.indexedDB;

const request = indexedDB.open("TeaShopDB", 1);

let db;

request.onerror = function (event) {
    console.error("An error occurred with TeaShopDB")
    console.error(event)
};

request.onupgradeneeded = function () {
    db = request.result;
    db.createObjectStore("storeItems", { keyPath: "id" });
    db.createObjectStore("cartItems", { keyPath: "id" });
  };

  request.onsuccess = function () {
    db = request.result;
  
    //Check if storeItems is empty, then initialize
    const txn = db.transaction("storeItems", "readonly");
    const store = txn.objectStore("storeItems");
    const checkRequest = store.getAll();
  
    checkRequest.onsuccess = function () {
      if (checkRequest.result.length === 0) {
        addInitialStoreItems();
      }
    };
  };
  

  function addInitialStoreItems() {
    const transaction = db.transaction("storeItems", "readwrite");
    const store = transaction.objectStore("storeItems");

    store.put({ id: 1, name: "Green Tea", price: 2.55, image: "../src/img/img-tea-1.png"});
    store.put({ id: 2, name: "Black Tea", price: 2.55, image: "../src/img/img-tea-2.png"});
    store.put({ id: 3, name: "Sweat Tea", price: 3.99, image: "../src/img/img-tea-3.png"})

  }
  