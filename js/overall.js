// 导入从dbConfig.js文件
import { today } from "./service/tools.js";
import { addPosition } from "./service/db.js";

import { fetchSecurityData } from "./service/api.js";
import { getRealQuote } from "./service/quote.js";
import { saveFile, openFile } from "./service/file.js";

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

document.getElementById("open-positon").addEventListener("click", function () {
  const div = document.getElementById("edit-buy");

  if (div.style.display === "none") {
    div.style.display = "block";
  } else {
    div.style.display = "none";
  }
});

document
  .getElementById("codeInput")
  .addEventListener("input", async function () {
    const codeInput = this.value;
    // console.log(codeInput);
    const pattern = /^(sz|sh)\d{6}$/;
    if (pattern.test(codeInput)) {
      try {
        const quote = await getRealQuote(codeInput);
        // console.log(quote);
        if (quote) {
          const nameInput = quote.name;
          const priceInput = quote.realPrice;
          document.getElementById("nameInput").value = nameInput;
          document.getElementById("priceInput").value = priceInput;
        } else {
          const data = await fetchSecurityData(codeInput);
          securitiesMap[codeInput] = {
            code: codeInput,
            name: data.name,
            realPrice: data.realPrice,
          };
          document.getElementById("nameInput").value = data.name;
          document.getElementById("priceInput").value = data.realPrice;
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      document.getElementById("nameInput").value = "";
      document.getElementById("priceInput").value = "";
    }
  });

document.getElementById("save-record").addEventListener("click", function () {
  const code = document.getElementById("codeInput").value;
  const name = document.getElementById("nameInput").value;
  const price = parseFloat(document.getElementById("priceInput").value);
  const number = parseFloat(document.getElementById("numberInput").value);
  const buyInDate = document.getElementById("buyInDateInput").value;
  const buy_in_date = buyInDate === "" ? today() : buyInDate;
  console.log(
    code + "--" + name + "--" + price + "--" + number + "---" + buy_in_date
  );

  // code 校验
  // 正则表达式用于检查code是否以"sz"或"sh"开头，后跟6位数字
  const pattern = /^(sz|sh)\d{6}$/;

  if (!pattern.test(code)) {
    alert("输入的股票代码不合法，必须以'sz'或'sh'开头，后跟6位数字。");
    return;
  }

  // price 校验
  if (isNaN(price) || price <= 0) {
    alert("请输入有效的价格（必须是大于0的数字）");
    priceElement.focus();
    return;
  }

  // number 校验
  if (isNaN(number) || number <= 0) {
    alert("请输入有效的数量（必须是大于0的数字）");
    numberElement.focus();
    return;
  }

  addPosition({
    code: code,
    name: name,
    buy_in_price: price,
    number: number,
    buy_in_date: buy_in_date,
    status: 1,
  }).then(reloadRealPosition);
});

let fileHandle = null;

document.getElementById("fileRead").addEventListener("click", async () => {
  const shouldOpenFile = confirm("是否要打开持仓记录文件？");
  if (shouldOpenFile) {
    await openFile();
    reloadRealPosition();
  }
});

document
  .getElementById("fileWrite")
  .addEventListener("click", async function () {
    await saveFile();
  });
window.addEventListener("beforeunload", function (event) {
  event.preventDefault();

  event.returnValue =
    "亲爱的小伙伴，如果尚未保存持仓数据，请点击“取消”，并在页面上找到“保存持仓数据”按钮来保存持仓数据。如果已经保存，请点击“确认”离开～";
});

window.onbeforeunload = function (event) {
  event.preventDefault();
};
