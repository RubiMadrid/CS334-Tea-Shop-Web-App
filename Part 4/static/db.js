// db.js (Cart-Only Version)

const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

let db;

const request = indexedDB.open("TeaShopDB", 3); // 🔁 use version 3 to force upgrade

request.onerror = function (event) {
    console.error("⚠️ Could not open TeaShopDB", event.target.error);
};

request.onupgradeneeded = function (event) {
    db = event.target.result;

    // Only recreate cartItems
    if (!db.objectStoreNames.contains("cartItems")) {
        db.createObjectStore("cartItems", { keyPath: "id" });
    }
};

request.onsuccess = function (event) {
    db = event.target.result;
    window.db = db;
    document.dispatchEvent(new Event("dbReady"));
};
