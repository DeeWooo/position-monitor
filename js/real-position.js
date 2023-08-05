import { db } from "./dbConfig.js";
import { today } from "./common.js";

// 现在你可以使用db变量来访问你的数据库

var counter = 0; // 初始值为 0
setInterval(function () {
  counter++; // 每秒钟加 1
  document.getElementById("seconds").innerHTML = counter; // 更新显示的值
}, 1000);

const refreshRealPositonList = function () {
  // function refreshRealPositonList() {
  db.position
    .where("status")
    .equals(1)
    .toArray()
    .then(function (positions) {
      const positonListElement = document.getElementById("real-position");

      // 清空列表
      positonListElement.innerHTML = "";

      for (let position of positions) {
        const listItem = createTr(position);

        positonListElement.appendChild(listItem);
      }
    });
};

const deletePosition = function (id) {
  // deleteDBPosition(id);
  // alert(id);

  db.position
    .update(id, {
      status: 0,
      sell_in_date: today,
    })
    .then(refreshRealPositonList);

  // db.position.get(id).then(function (record) {
  //   if (record) {
  //     console.log("Record exists with id: ", id);
  //   } else {
  //     console.log("No record exists with id: ", id);
  //   }
  // });

  // db.position.update(id, { status: 1 }).then(function (updated) {
  //   if (updated) {
  //     console.log("The record was updated");
  //   } else {
  //     console.log("The record was NOT updated");
  //   }
  // });
};

function createTr(position) {
  const listItem = document.createElement("tr");

  // code
  let item = document.createElement("td");
  item.textContent = `${position.code}`;
  listItem.appendChild(item);

  // name
  item = document.createElement("td");
  item.textContent = `${position.name}`;
  listItem.appendChild(item);

  // 盈亏
  item = document.createElement("td");
  // item.textContent = `${position.name}`;
  listItem.appendChild(item);

  // 盈亏比
  item = document.createElement("td");
  // item.textContent = `${position.name}`;
  listItem.appendChild(item);

  // 数量
  item = document.createElement("td");
  item.textContent = `${position.number}`;
  listItem.appendChild(item);

  // 当前价格
  item = document.createElement("td");
  // item.textContent = `${position.current_price}`;
  listItem.appendChild(item);

  // 买入价格
  item = document.createElement("td");
  item.textContent = `${position.buy_in_price}`;
  listItem.appendChild(item);

  // 盈10%
  item = document.createElement("td");
  item.textContent = `${position.buy_in_price * 1.1}`;
  listItem.appendChild(item);

  // 盈20%
  item = document.createElement("td");
  item.textContent = `${position.buy_in_price * 1.2}`;
  listItem.appendChild(item);

  // 买入日期
  item = document.createElement("td");
  item.textContent = `${position.buy_in_date}`;
  listItem.appendChild(item);

  // 平仓按钮
  item = document.createElement("td");

  let button = document.createElement("button");
  button.textContent = "平仓"; // 设置按钮的文本
  button.onclick = function () {
    // 设置按钮的点击事件处理函数
    deletePosition(parseInt(`${position.id}`));
  };

  item.appendChild(button);
  listItem.appendChild(item);

  return listItem;
}

window.onload = refreshRealPositonList;
