import { getValidPositions, updatePosition } from "./service/db.js";
import { today } from "./service/tools.js";

import { getRealQuote } from "./service/quote.js";

// 现在你可以使用db变量来访问你的数据库

var counter = 0; // 初始值为 0
setInterval(function () {
  counter++; // 每秒钟加 1
  document.getElementById("seconds").innerHTML = counter; // 更新显示的值
}, 1000);

export function refreshRealPositonList() {
  getValidPositions()
    .then(async (positions) => {
      // 创建一个新的 Promise 列表
      const promises = positions.map(async (position) => {
        const code = position.code;

        const realQuote = await getRealQuote(code);
        const number = parseFloat(position.number);
        const realPrice = realQuote.realPrice;
        const buyInPrice = parseFloat(position.buy_in_price);
        const profitLoss = ((realPrice - buyInPrice) * number).toFixed(4);

        const profitLossRate = (realPrice - buyInPrice) / buyInPrice;

        // 如果你希望结果保留6位小数，可以使用 toFixed 方法
        const profitLossRateRounded = profitLossRate.toFixed(4);

        const profit10 = parseFloat(position.buy_in_price * 1.1).toFixed(4);
        const profit20 = parseFloat(position.buy_in_price * 1.2).toFixed(4);

        // 为每个位置对象添加新字段
        return {
          ...position, // 拷贝原始对象的所有属性
          currentPrice: realPrice, // 添加 "currentPrice" 字段
          profitLossRate: profitLossRateRounded, // 添加 "profitLossRate" 字段
          profitLoss: profitLoss,
          profit10: profit10,
          profit20: profit20,
          // 这里可以添加更多字段...
        };
      });

      // 使用 Promise.all 等待所有 Promise 完成，并返回新的位置列表
      return Promise.all(promises);
    })
    .then((updatedPositions) => {
      // 排序
      updatedPositions.sort((a, b) => b.profitLossRate - a.profitLossRate);

      // console.log(updatedPositions);

      const positonListElement = document.getElementById("real-position");

      // 清空列表
      positonListElement.innerHTML = "";

      let statistics = {
        totalCost: 0, // 持仓总成本
        totalProfitLoss: 0, // 持仓总盈亏
        totalProfitLossRate: 0, // 持仓总盈亏比
      };

      for (let position of updatedPositions) {
        // console.log(position);
        const listItem = createTr(position);
        positonListElement.appendChild(listItem);

        const cost = position.buy_in_price * position.number; // 计算每个position的成本
        const profitLoss = position.profitLoss; // 盈亏

        // 累加统计数据
        statistics.totalCost += cost;
        statistics.totalProfitLoss += parseFloat(position.profitLoss);
      }
      // 计算平均盈亏比
      statistics.totalProfitLossRate =
        statistics.totalProfitLoss / statistics.totalCost;

      const totalPositionCost = document.getElementById("totalPositionCost");
      totalPositionCost.textContent = statistics.totalCost;

      const sumProfitLosses = document.getElementById("sumProfitLosses");
      sumProfitLosses.textContent = statistics.totalProfitLoss;
      updateStyle(sumProfitLosses, statistics.totalProfitLoss);

      const totalProfitLosseRate = document.getElementById(
        "totalProfitLosseRate"
      );
      totalProfitLosseRate.textContent = statistics.totalProfitLossRate;
      updateStyle(totalProfitLosseRate, statistics.totalProfitLossRate);
    })
    .catch((error) => {
      console.error(error);
      // ...在这里处理错误...
    });
}

const deletePosition = function (id) {
  updatePosition(id, {
    status: 0,
    sell_in_date: today(),
  }).then(refreshRealPositonList);
};

function createTr(position) {
  const listItem = document.createElement("tr");

  // 写html
  // code
  let item = document.createElement("td");
  item.textContent = position.code;
  listItem.appendChild(item);

  // name
  item = document.createElement("td");
  item.textContent = position.name;
  listItem.appendChild(item);

  // 盈亏
  item = document.createElement("td");
  item.textContent = position.profitLoss;
  updateStyle(item, position.profitLoss);
  listItem.appendChild(item);

  // 盈亏比
  item = document.createElement("td");
  item.textContent = position.profitLossRate;
  updateStyle(item, position.profitLoss);
  listItem.appendChild(item);

  // 数量
  item = document.createElement("td");
  item.textContent = position.number;
  listItem.appendChild(item);

  // 当前价格
  item = document.createElement("td");
  item.textContent = position.currentPrice;
  item.style.color = "orange"; // 将字体颜色设置为橙色
  listItem.appendChild(item);

  // 买入价格
  item = document.createElement("td");
  item.textContent = position.buy_in_price;
  listItem.appendChild(item);

  // 盈10%
  item = document.createElement("td");
  item.textContent = position.profit10;
  listItem.appendChild(item);

  // 盈20%
  item = document.createElement("td");
  item.textContent = position.profit20;
  listItem.appendChild(item);

  // 买入日期
  item = document.createElement("td");
  item.textContent = position.buy_in_date;
  listItem.appendChild(item);

  // 平仓按钮
  item = document.createElement("td");

  let button = document.createElement("button");
  button.textContent = "平仓"; // 设置按钮的文本
  button.onclick = function () {
    // 设置按钮的点击事件处理函数
    deletePosition(parseInt(position.id));
  };

  item.appendChild(button);
  listItem.appendChild(item);

  return listItem;
}

window.onload = refreshRealPositonList;

function updateStyle(item, profitLoss) {
  if (profitLoss > 0) {
    item.style.color = "red"; // 将字体颜色设置为红色
    item.style.fontWeight = "bold"; // 将字体设置为粗体
  } else if (profitLoss < 0) {
    item.style.color = "green"; // 将字体颜色设置为绿色
    item.style.fontWeight = "bold"; // 将字体设置为粗体
  } else {
    item.style.color = "black"; // 将字体颜色设置为黑色
    item.style.fontWeight = "normal"; // 将字体设置为正常
  }
}
