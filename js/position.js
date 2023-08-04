// Initialize Dexie
const db = new Dexie("PositionDatabase");

db.version(2).stores({
  position:
    "++id, code, name, buy_in_date, buy_in_price, status, number, portfolio,sell_in_date",
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
      const realPrice = parseFloat(list[3]);
      const roundedRealPrice = parseFloat(realPrice.toFixed(4));

      return roundedRealPrice;
    })
    .catch((error) => console.error("An error occurred:", error));
};

const initializeSecuritiesMap = function () {
  // 创建一个空的对象来存储证券信息
  const securitiesMap = {};

  // 从position表中获取所有条目
  return db.position
    .where("status")
    .equals(1)
    .toArray()
    .then((positions) => {
      // 遍历每个位置，从中提取代码并将其添加到securitiesMap
      positions.forEach((position) => {
        securitiesMap[position.code] = {
          code: position.code,
          name: position.name, // 你可以根据实际数据结构进行调整
          realPrice: getStockRealPrice(position.code),
        };
      });
      return securitiesMap;
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      return securitiesMap; // 如果出现错误，返回空的securitiesMap
    });
};

// 调用函数并处理返回的Promise
initializeSecuritiesMap().then((securitiesMap) => {
  // 这里你可以处理初始化后的securitiesMap
  console.log(securitiesMap);
});

// 使用这个函数来初始化securitiesMap
const securitiesMap = initializeSecuritiesMap();

// 定义一个函数来更新securitiesMap中的realPrice
function updateRealPrices() {
  // 循环遍历securitiesMap中的每个证券
  for (const code in securitiesMap) {
    // 使用你的方法获取每个证券的实时价格，例如使用fetch
    const stockUrl = `http://qt.gtimg.cn/q=${code}`;
    fetch(stockUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        const decoder = new TextDecoder("GBK"); // 假设响应是GBK编码的
        const uint8Array = new Uint8Array(arrayBuffer);
        const resultDecode = decoder.decode(uint8Array);

        const pattern = /\"(.*?)\"/g;
        let values = "";
        let match = pattern.exec(resultDecode);

        while (match != null) {
          values = match[0].replace('"', "");
          match = pattern.exec(resultDecode);
        }

        const list = values.split("~");
        const name = list[1];
        const realPrice = parseFloat(list[3]);

        securitiesMap[code].name = name;
        // 更新securitiesMap中的实时价格
        // 四舍五入
        const roundedRealPrice = parseFloat(realPrice.toFixed(4));
        securitiesMap[code].realPrice = roundedRealPrice;
      })
      .catch((error) => console.error("An error occurred:", error));
  }
}

// 每20秒调用updateRealPrices来更新securitiesMap
setInterval(updateRealPrices, 20000);

// 示例：用于从API获取证券数据的函数
function fetchSecurityData(code) {
  const stockUrl = `http://qt.gtimg.cn/q=${code}`; // 请根据实际情况更新此URL

  return fetch(stockUrl)
    .then((response) => response.arrayBuffer())
    .then((arrayBuffer) => {
      const decoder = new TextDecoder("GBK"); // 假设响应是GBK编码的
      const uint8Array = new Uint8Array(arrayBuffer);
      const resultDecode = decoder.decode(uint8Array);

      const pattern = /\"(.*?)\"/g;
      let values = "";
      let match = pattern.exec(resultDecode);

      while (match != null) {
        values = match[0].replace('"', "");
        match = pattern.exec(resultDecode);
      }

      const list = values.split("~");
      const name = list[1];
      const realPrice = parseFloat(list[3]);

      // 更新securitiesMap中的实时价格
      // 四舍五入
      const roundedRealPrice = parseFloat(realPrice.toFixed(4));

      return {
        name: name,
        realPrice: roundedRealPrice,
      };
    })
    .catch((error) => console.error("An error occurred:", error));
}

document.getElementById("open-positon").addEventListener("click", function () {
  const div = document.getElementById("edit-buy");

  if (div.style.display === "none") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
});

document.getElementById("codeInput").addEventListener("input", function () {
  const codeInput = this.value;

  // 使用正则表达式来检查codeInput是否符合要求的模式
  const pattern = /^(sz|sh)\d{6}$/;
  if (pattern.test(codeInput)) {
    if (securitiesMap[codeInput]) {
      // 如果在securitiesMap中找到了相应的证券数据，则设置nameInput的值
      const nameInput = securitiesMap[codeInput].name;
      const priceInput = securitiesMap[codeInput].realPrice;
      document.getElementById("nameInput").value = nameInput;
      document.getElementById("priceInput").value = priceInput;
    } else {
      // 在securitiesMap中找不到相应的证券数据，因此调用API来获取
      fetchSecurityData(codeInput).then((data) => {
        // 将新获取的证券数据添加到securitiesMap中
        securitiesMap[codeInput] = {
          code: codeInput,
          name: data.name,
          realPrice: data.realPrice,
        };

        // 更新nameInput和priceInput的值
        document.getElementById("nameInput").value = data.name;
        document.getElementById("priceInput").value = data.realPrice;
      });
    }
  } else {
    // 清空名称输入框和价格输入框，因为证券代码不符合所需的模式
    document.getElementById("nameInput").value = "";
    document.getElementById("priceInput").value = "";
  }
});

document.getElementById("save-record").addEventListener("click", function () {
  const code = document.getElementById("codeInput").value;
  const name = document.getElementById("nameInput").value;
  const price = document.getElementById("priceInput").value;
  const number = document.getElementById("numberInput").value;

  // code 校验
  // 正则表达式用于检查code是否以"sz"或"sh"开头，后跟6位数字
  const pattern = /^(sz|sh)\d{6}$/;

  if (!pattern.test(code)) {
    alert("输入的股票代码不合法，必须以'sz'或'sh'开头，后跟6位数字。");
    return;
  }

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

// document.getElementById("real-price").addEventListener("click", function () {
//   const code = document.getElementById("code").value;

//   // 正则表达式用于检查code是否以"sz"或"sh"开头，后跟6位数字
//   const pattern = /^(sz|sh)\d{6}$/;

//   if (!pattern.test(code)) {
//     alert("输入的股票代码不合法，必须以'sz'或'sh'开头，后跟6位数字。");
//     return;
//   }

//   getStockRealPrice(code).then((price) => {
//     console.log(price);
//   });
// });

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
