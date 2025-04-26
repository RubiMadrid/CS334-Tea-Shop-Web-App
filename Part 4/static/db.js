// db.js

const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;

let db;

const request = indexedDB.open("TeaShopDB", 2);

request.onerror = function (event) {
  console.error("An error occurred with TeaShopDB", event.target.error);
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

  if (!db.objectStoreNames.contains("storeOrders")) {
    db.createObjectStore("storeOrders", { keyPath: "id" });
  }

  if (!db.objectStoreNames.contains("admins")) {
    const objectStore = db.createObjectStore("admins", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("email", "email", { unique: true });
}
};

request.onsuccess = function () {
  db = request.result;

  window.db = db; 
  document.dispatchEvent(new Event("dbReady"));

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

  store.put({ id: 1, name: "Green Tea", price: 2.55, oz:8, createdDate: "12/01/2024", image: "../src/img/green-tea-001.png" });
  store.put({ id: 2, name: "Green Tea", price: 3.99, oz:16, createdDate: "03/01/2024", image: "../src/img/green-tea-001.png" });
  store.put({ id: 3, name: "Green Tea", price: 5.99, oz:32, createdDate: "03/05/2024", image: "../src/img/green-tea-001.png" });
  store.put({ id: 4, name: "Black Tea", price: 2.55, oz:8, createdDate: "03/08/2024", image: "../src/img/black-tea-001.png" });
  store.put({ id: 5, name: "Black Tea", price: 3.99, oz:16, createdDate: "03/10/2024", image: "../src/img/black-tea-001.png" });
  store.put({ id: 6, name: "Black Tea", price: 5.99, oz:32, createdDate: "03/10/2024", image: "../src/img/black-tea-001.png" });
  store.put({ id: 7, name: "Matcha Tea", price: 2.55, oz:8, createdDate: "03/12/2024", image: "../src/img/matcha-tea-001.png" });
  store.put({ id: 8, name: "Matcha Tea", price: 3.99, oz:16, createdDate: "03/15/2024", image: "../src/img/matcha-tea-001.png" });
  store.put({ id: 9, name: "Matcha Tea", price: 5.99, oz:32, createdDate: "03/16/2024", image: "../src/img/matcha-tea-001.png" });
  store.put({ id: 10, name: "Chia Tea", price: 2.55, oz:8, createdDate: "03/19/2024", image: "../src/img/img-tea-3.png" });
  store.put({ id: 11, name: "Chia Tea", price: 3.99, oz:16, createdDate: "03/24/2024", image: "../src/img/img-tea-3.png" });
  store.put({ id: 12, name: "Chia Tea", price: 5.99, oz:32, createdDate: "03/24/2024", image: "../src/img/img-tea-3.png" });
  store.put({ id: 13, name: "Herbal Tea", price: 2.55, oz:8, createdDate: "03/29/2024", image: "../src/img/img-tea-2.png" });
  store.put({ id: 14, name: "Herbal Tea", price: 3.99, oz:16, createdDate: "04/01/2024", image: "../src/img/img-tea-2.png" });
  store.put({ id: 15, name: "Herbal Tea", price: 5.99, oz:32, createdDate: "04/08/2024", image: "../src/img/img-tea-2.png" });
  store.put({ id: 16, name: "Jasmine Tea", price: 2.55, oz:8, createdDate: "04/10/2024", image: "../src/img/jasmine-tea-001.png" });
  store.put({ id: 17, name: "Jasmine Tea", price: 3.99, oz:16, createdDate: "04/11/2024", image: "../src/img/jasmine-tea-001.png" });
  store.put({ id: 17, name: "Jasmine Tea", price: 5.99, oz:32, createdDate: "04/11/2024", image: "../src/img/jasmine-tea-001.png" });
}
