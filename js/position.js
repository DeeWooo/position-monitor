// Initialize Dexie
const db = new Dexie("PositionDatabase");

db.version(1).stores({
  position:
    "++id, code, name, buy_in_date, buy_in_price, status, number, portfolio",
});

document.getElementById("open-positon").addEventListener("click", function () {
  const div = document.getElementById("edit-buy");

  if (div.style.display === "none") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
});

document.getElementById("save-record").addEventListener("click", function () {
  const code = document.getElementById("codeInput").value;
  const name = document.getElementById("nameInput").value;
  const price = document.getElementById("priceInput").value;
  const number = document.getElementById("numberInput").value;

  let now = new Date();
  let year = now.getFullYear(); // 获取年份
  let month = ("0" + (now.getMonth() + 1)).slice(-2); // 获取月份并确保两位数
  let day = ("0" + now.getDate()).slice(-2); // 获取日期并确保两位数
  let dateStr = year + "-" + month + "-" + day;

  db.position
    .add({
      code: code,
      name: name,
      buy_in_price: price,
      number: number,
      buy_in_date: dateStr,
      status: 1,
    })
    // .then(refreshPositonList)
    .then(reloadRealPosition);
});

document.getElementById("real-price").addEventListener("click", function () {
  const code = document.getElementById("code").value;
  getStockRealPrice(code).then((price) => {
    console.log(price);
  });
});

const getStockRealPrice = function (code) {
  const stockUrl = `http://qt.gtimg.cn/q=${code}`;
  const headers = {
    // "Referer": "https://finance.sina.com.cn/",
  };

  // Assuming you use a library like axios or fetch for HTTP requests
  return fetch(stockUrl, {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.text())
    .then((result) => {
      const pattern = /\"(.*?)\"/g;
      let values = "";
      let match = pattern.exec(result);

      while (match != null) {
        values = match[0].replace('"', "");
        match = pattern.exec(result);
      }

      const list = values.split("~");
      const realPrice = list[3];

      return parseFloat(realPrice);
    })
    .catch((error) => console.error("An error occurred:", error));
};

//   position:
// "++id, code, name, buy_in_date, buy_in_price, status, number, portfolio",

function refreshPositonList() {
  db.position.toArray().then(function (positions) {
    const positonListElement = document.getElementById("positonList");

    // 清空列表
    positonListElement.innerHTML = "";

    // 为每个朋友创建一个列表项
    for (let position of positions) {
      const listItem = document.createElement("li");
      listItem.textContent = `${position.code},${position.name}`;

      positonListElement.appendChild(listItem);
    }
  });
}
function reloadRealPosition() {
  // 获取iframe元素
  var iframe = document.getElementById("rp-iframe");

  // 保存当前的src
  var currentSrc = iframe.src;

  // 将src设置为空字符串，然后立即设置回来
  iframe.src = "";
  iframe.src = currentSrc;
}

// 页面加载完成时，刷新列表
// window.onload = refreshPositonList;

setInterval(function () {
  reloadRealPosition();
}, 20000);
