const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB ||
    window.shimIndexedDB;


const request = indexedDB.open("TeaShopDatabase",1);

request.onerror = function (event) {
    console.error("An error occured with IndexedDB");
    console.error(event);
};


request.onupgradeneeded = function (){
    const db = request.result;
    const store = db.createObjectStore("teas", {keyPath: "id"});
    store.createIndex("tea_type_and_name", ["caffeine", "name"], {unique:false});
};

request.onsuccess = function () {
    const db = request.result;
    const transaction = db.transaction("teas", "readwrite");
}