var counter = 0; // 初始值为 0
setInterval(function () {
  counter++; // 每秒钟加 1
  document.getElementById("seconds").innerHTML = counter; // 更新显示的值
}, 1000);

const db = new Dexie("PositionDatabase");

db.version(1).stores({
  position:
    "++id, code, name, buy_in_date, buy_in_price, status, number, portfolio",
});

const refreshRealPositonList = function () {
  // function refreshRealPositonList() {
  db.position.toArray().then(function (positions) {
    const positonListElement = document.getElementById("real-position");

    // 清空列表
    positonListElement.innerHTML = "";

    // 为每个朋友创建一个列表项
    for (let position of positions) {
      const listItem = createTr(position);

      positonListElement.appendChild(listItem);
    }
  });
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

  return listItem;
}

window.onload = refreshRealPositonList;

// setInterval(function () {
//   refreshRealPositonList;
// }, 1000);
