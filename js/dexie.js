var url = "https://unpkg.com/dexie/dist/dexie.min.js";
window.onload = function () {
  document.write("<script language=javascript src=" + url + "></script>");
};
var db = new Dexie("myDatabase");
db.version(1).stores({
  myData: "++id, name, age",
});

var data = { name: "John", age: 30 };
db.myData
  .add(data)
  .then(function () {
    console.log("Data stored");
  })
  .catch(function (error) {
    console.log("Error: " + error);
  });

db.myData
  .get(1)
  .then(function (data) {
    console.log(data);
  })
  .catch(function (error) {
    console.log("Error: " + error);
  });

//   const db = new Dexie('myDatabase');
// db.version(1).stores({
//     friends: 'name, age'
// });

// db.friends.add({name: 'Joseph', age: 21}).then(function() {
//     return db.friends.where('age').above(20).toArray();
// }).then(function(youngFriends) {
//     console.log("Young friends: ", youngFriends);
// }).catch(function(error) {
//     console.error("Oops: " + error);
// });
