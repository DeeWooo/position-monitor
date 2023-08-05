// 导入从dbConfig.js文件
import { today } from "./global/common.js";
import { db } from "./global/dbConfig.js";
import { securitiesMap } from "./global/global-data.js";
import { fetchSecurityData } from "./global/stock.js";

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

  db.position
    .add({
      code: code,
      name: name,
      buy_in_price: price,
      number: number,
      buy_in_date: today,
      status: 1,
    })
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

function reloadRealPosition() {
  // 获取iframe元素
  var iframe = document.getElementById("rp-iframe");

  // 保存当前的src
  var currentSrc = iframe.src;

  // 将src设置为空字符串，然后立即设置回来
  iframe.src = "";
  iframe.src = currentSrc;
}

setInterval(function () {
  reloadRealPosition();
}, 20000);
