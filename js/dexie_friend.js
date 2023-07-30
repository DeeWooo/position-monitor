// Initialize Dexie
const db = new Dexie("MyDatabase");

db.version(1).stores({
  friends: "++id, name, age",
});

document
  .getElementById("addFriendButton")
  .addEventListener("click", function () {
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;

    db.friends
      .add({
        name: name,
        age: age,
      })
      .then(refreshFriendList);
  });

function refreshFriendList() {
  db.friends.toArray().then(function (friends) {
    const friendListElement = document.getElementById("friendList");

    // 清空列表
    friendListElement.innerHTML = "";

    // 为每个朋友创建一个列表项
    for (let friend of friends) {
      const listItem = document.createElement("li");
      listItem.textContent = `${friend.name}, ${friend.age}`;

      friendListElement.appendChild(listItem);
    }
  });
}

// 页面加载完成时，刷新朋友列表
window.onload = refreshFriendList;
