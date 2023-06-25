// 获取按钮元素
let createDBButton = document.getElementById("createDB");

// 添加点击事件监听器
createDBButton.addEventListener("click", createDB);

let addDataButton = document.getElementById("addData");
addDataButton.addEventListener("click", addData);

let db;

function createDB() {
  let request = window.indexedDB.open("myDatabase", 1);
  request.onerror = function (event) {
    console.log("Failed to open database");
  };
  request.onupgradeneeded = function (event) {
    db = event.target.result;
    var objectStore = db.createObjectStore("myTable", { keyPath: "id" });
    objectStore.createIndex("data", "data", { unique: false });
  };
  request.onsuccess = function (event) {
    db = event.target.result;
  };
}

function addData() {
  let transaction = db.transaction("myTable", "readwrite");
  let objectStore = transaction.objectStore("myTable");
  let request = objectStore.add({ id: 1, data: "myData" });
  request.onerror = function (event) {
    console.log("Failed to add data");
  };
  transaction.oncomplete = function (event) {
    console.log("Data added successfully");
  };
}

function query() {
  let transaction = db.transaction("myTable");
  let objectStore = transaction.objectStore("myTable");
  let request = objectStore.get(1);
  request.onerror = function (event) {
    console.log("Failed to get data");
  };
  request.onsuccess = function (event) {
    console.log(event.target.result.data);
  };
}
