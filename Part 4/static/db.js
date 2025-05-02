// // db.js

// // const indexedDB =
// //     window.indexedDB ||
// //     window.mozIndexedDB ||
// //     window.webkitIndexedDB ||
// //     window.msIndexedDB ||
// //     window.shimIndexedDB;

// // let db;

// // const request = indexedDB.open("TeaShopDB", 2);

// request.onerror = function (event) {
//   console.error("An error occurred with TeaShopDB", event.target.error);
//   console.error(event);
// };

// request.onupgradeneeded = function () {
//   db = request.result;

//   if (!db.objectStoreNames.contains("storeItems")) {
//     db.createObjectStore("storeItems", { keyPath: "id" });
//   }

//   if (!db.objectStoreNames.contains("cartItems")) {
//     db.createObjectStore("cartItems", { keyPath: "id" });
//   }

//   if (!db.objectStoreNames.contains("storeOrders")) {
//     db.createObjectStore("storeOrders", { keyPath: "id" });
//   }

//   if (!db.objectStoreNames.contains("admins")) {
//     const objectStore = db.createObjectStore("admins", { keyPath: "id", autoIncrement: true });
//     objectStore.createIndex("email", "email", { unique: true });
// }
// };

// request.onsuccess = function () {
//   db = request.result;

//   window.db = db; 
//   document.dispatchEvent(new Event("dbReady"));

//   const txn = db.transaction("storeItems", "readonly");
//   const store = txn.objectStore("storeItems");
//   const checkRequest = store.getAll();

//   checkRequest.onsuccess = function () {
//       addInitialStoreItems();
//   };
// };

// function addInitialStoreItems() {
//   fetch('/api/storeitems')
//     .then(function(response) {
//       return response.json();  
//     })
//     .then(function(items) {
//       const transaction = db.transaction("storeItems", "readwrite");
//       const store = transaction.objectStore("storeItems");

//       const clearRequest = store.clear();

//       clearRequest.onsuccess = function () {
//         for (let i = 0; i < items.length; i++) {
//           store.put(items[i]);
//         }

//         transaction.oncomplete = function() {
//           console.log("All items refreshed in IndexedDB.");
//         };

//         transaction.onerror = function() {
//           console.error("Failed to refresh items in IndexedDB.");
//         };
//       };

//       clearRequest.onerror = function () {
//         console.error("Failed to clear storeItems before refresh.");
//       };
//     })
//     .catch(function(error) {
//       console.error("Error fetching store items:", error);
//     });
// }