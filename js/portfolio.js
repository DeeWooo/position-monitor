import { getValidPositions } from "./service/db.js";
import { TargetProfitLoss, PositionProfitLoss } from "./service/type.js";
import { getRealQuote, FULL_POSITION } from "./service/quote.js";
import { styleProcess, styleTradingSignal } from "./service/tools.js";

function refreshPage() {
  showData();
}

async function calculateTargetProfitLoss(positions) {
  // Group by code
  let codeMap = new Map();
  positions.forEach((position) => {
    let code = position.code;
    if (!codeMap.has(code)) {
      codeMap.set(code, []);
    }
    codeMap.get(code).push(position);
  });
  // console.log("codeMap is ");
  // console.log(codeMap);

  let codeKeySet = Array.from(codeMap.keys());

  // console.log(codeKeySet);

  let targetProfitLossList = await Promise.all(
    codeKeySet.map(async (codeItem) => {
      // console.log(codeItem);
      let targetProfitLoss = new TargetProfitLoss();

      targetProfitLoss.code = codeItem;

      getRealQuote(codeItem).then((realQuote) => {
        targetProfitLoss.name = realQuote.name;
        targetProfitLoss.realPrice = realQuote.realPrice;
      });
      let positionList = codeMap.get(codeItem);
      // console.log(positionList);

      const positionProfitLosses = await Promise.all(
        positionList.map(async (e) => {
          return await convertPosition2ProfitLoss(e);
        })
      );

      const sortedPositionProfitLosses = positionProfitLosses.sort(
        (a, b) => b.buyInDateShow - a.buyInDateShow
      );

      // console.log("positionProfitLosses are");
      // console.log(sortedPositionProfitLosses);

      targetProfitLoss.positionProfitLosses = sortedPositionProfitLosses;

      const costPosition = sortedPositionProfitLosses.reduce((sum, element) => {
        return sum + element.positionCost;
      }, 0);

      targetProfitLoss.costPositionRate = (
        costPosition / FULL_POSITION
      ).toFixed(4);

      const currentNumber = sortedPositionProfitLosses.reduce(
        (sum, positionProfitLoss) =>
          sum + parseInt(positionProfitLoss.position.number),
        0
      );
      // console.log("currentNumber");
      // console.log(currentNumber);

      const currentPosition = targetProfitLoss.realPrice * currentNumber;

      // console.log("currentPosition");
      // console.log(currentPosition);

      targetProfitLoss.currentPositionRate = (
        currentPosition / FULL_POSITION
      ).toFixed(4);

      const profitLoss = sortedPositionProfitLosses.reduce(
        (sum, pl) => sum + parseFloat(pl.profitLoss),
        0.0
      );

      targetProfitLoss.targetProfitLoss = profitLoss.toFixed(4);

      const profitLossRate =
        costPosition === 0 ? 0 : (profitLoss / costPosition).toFixed(4);

      targetProfitLoss.targetProfitLossRate = profitLossRate;

      targetProfitLoss.pLStyle = styleProcess(profitLoss, profitLossRate);

      let lastBuyIn = 0;
      for (let i of sortedPositionProfitLosses) {
        if (i.position.buy_in_price > 0) {
          lastBuyIn = i.position.buy_in_price;
          break;
        }
      }

      const buyIn = lastBuyIn * 0.9;

      const saleOut = lastBuyIn * 1.1;

      targetProfitLoss.recommendedBuyInPoint = buyIn.toFixed(4);
      targetProfitLoss.recommendedSaleOutPoint = saleOut.toFixed(4);

      const tsStyle = styleTradingSignal(
        targetProfitLoss.realPrice,
        buyIn,
        saleOut
      );
      targetProfitLoss.tsStyle = tsStyle;

      console.log("targetProfitLoss");

      console.log(targetProfitLoss);

      return targetProfitLoss;
    })
  );

  console.log("targetProfitLossList");
  console.log(targetProfitLossList);

  return targetProfitLossList;
}

async function convertPosition2ProfitLoss(position) {
  console.log(position.code);
  let positionProfitLoss = new PositionProfitLoss();
  positionProfitLoss.position = position;
  //买入日期显示
  positionProfitLoss.buyInDateShow = position.buy_in_date;
  const realPrice = await getCurrentPrice(position.code);
  positionProfitLoss.realPrice = realPrice;
  const profitLoss = (realPrice - position.buy_in_price) * position.number;
  positionProfitLoss.profitLoss = profitLoss;

  let profitLossRate = 0;
  if (position.buy_in_price != 0) {
    profitLossRate =
      (realPrice - position.buy_in_price) / position.buy_in_price;
  }
  positionProfitLoss.profitLossRate = profitLossRate;

  positionProfitLoss.profitLossRateShow = profitLossRate.toFixed(4);

  const positionCost = position.buy_in_price * position.number;
  positionProfitLoss.positionCost = positionCost;

  positionProfitLoss.positionName = position.name;

  //前端样式控制
  styleProcess(positionProfitLoss);

  return positionProfitLoss;
}

const getTargetProfitLoss = async function () {
  const positions = await getValidPositions();
  const targetProfitLossList = await calculateTargetProfitLoss(positions);

  return targetProfitLossList;
};

const getCurrentPrice = async function (code) {
  const quote = await getRealQuote(code);

  return quote.realPrice;
};

function showDiv(targetProfitLoss, element) {
  element.id = targetProfitLoss.code;
  // element.textContent = targetProfitLoss.name;
  element.className = "layui-row";

  let hr = document.createElement("hr");
  hr.style = "border: 1 dashed #987cb9";
  hr.width = "80%";
  hr.color = "#987cb9";
  hr.size = "1";

  element.appendChild(hr);

  //第一列
  let col1 = document.createElement("div");
  col1.className = "layui-col-xs2";
  element.appendChild(col1);

  let elementCode = document.createElement("div");
  elementCode.textContent = targetProfitLoss.code;
  col1.appendChild(elementCode);

  let elementName = document.createElement("div");
  elementName.textContent =
    targetProfitLoss.name + "(" + targetProfitLoss.code + ")";
  col1.appendChild(elementName);

  let col1Hr = document.createElement("hr");
  col1Hr.align = "center";
  col1Hr.color = "#987cb9";
  col1Hr.size = "1";
  col1.appendChild(col1Hr);

  let currentPriceTitle = document.createElement("div");
  currentPriceTitle.textContent = "当前价格";
  col1.appendChild(currentPriceTitle);

  let currentPriceDiv = document.createElement("div");
  currentPriceDiv.textContent = targetProfitLoss.realPrice;
  currentPriceDiv.style = targetProfitLoss.tsStyle + "font-size:20px";
  col1.appendChild(currentPriceDiv);

  //第二列
  let col2 = document.createElement("div");
  col2.className = "layui-col-xs2";
  element.appendChild(col2);

  let currentPositionRateDiv = document.createElement("div");
  currentPositionRateDiv.textContent =
    "当前仓位: " + targetProfitLoss.currentPositionRate;
  col2.appendChild(currentPositionRateDiv);

  let costPositionRateDiv = document.createElement("div");
  costPositionRateDiv.textContent =
    "成本仓位: " + targetProfitLoss.costPositionRate;
  col2.appendChild(costPositionRateDiv);

  let col2Hr1 = document.createElement("hr");
  col2Hr1.align = "center";
  col2Hr1.color = "#987cb9";
  col2Hr1.size = "1";
  col2.appendChild(col2Hr1);

  let targetProfitLossDiv = document.createElement("div");
  const profitLoss = targetProfitLoss.targetProfitLoss;
  targetProfitLossDiv.textContent = "盈亏: " + profitLoss;
  targetProfitLossDiv.style = targetProfitLoss.pLStyle;
  col2.appendChild(targetProfitLossDiv);

  let targetProfitLossRateDiv = document.createElement("div");
  const profitLossRate = targetProfitLoss.targetProfitLossRate;
  targetProfitLossRateDiv.textContent = "盈亏比: " + profitLossRate;
  targetProfitLossRateDiv.style = targetProfitLoss.pLStyle;
  col2.appendChild(targetProfitLossRateDiv);

  let col2Hr2 = document.createElement("hr");
  col2Hr2.align = "center";
  col2Hr2.color = "#987cb9";
  col2Hr2.size = "1";
  col2.appendChild(col2Hr2);

  let recommendedBuyInPointDiv = document.createElement("div");
  recommendedBuyInPointDiv.textContent =
    "建议买入区间(-10%)<" + targetProfitLoss.recommendedBuyInPoint;
  col2.appendChild(recommendedBuyInPointDiv);

  let recommendedSaleOutPointDiv = document.createElement("div");
  recommendedSaleOutPointDiv.textContent =
    "建议卖出区间(10%)>" + targetProfitLoss.recommendedSaleOutPoint;
  col2.appendChild(recommendedSaleOutPointDiv);
}

function showTable(targetProfitLoss, element) {
  showTableHead(element);
  showTableBody(targetProfitLoss, element);
}

function showTableHead(element) {
  let tr = document.createElement("tr");

  let item = document.createElement("th");
  item.textContent = "买入日期";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "买入价格";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "数量";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "盈亏";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "盈亏比";
  tr.appendChild(item);

  element.appendChild(tr);
}

// 完善表格内容
function showTableBody(targetProfitLoss, element) {
  const positionProfitLosses = targetProfitLoss.positionProfitLosses;
  console.log(positionProfitLosses);
  let tr;

  for (let positionProfitLoss of positionProfitLosses) {
    tr = document.createElement("tr");
    let item = document.createElement("th");
    item.textContent = positionProfitLoss.buyInDateShow;
    tr.appendChild(item);

    item = document.createElement("th");
    item.textContent = positionProfitLoss.position.buy_in_price;
    tr.appendChild(item);

    item = document.createElement("th");
    item.textContent = positionProfitLoss.position.number;
    tr.appendChild(item);

    item = document.createElement("th");
    item.textContent = positionProfitLoss.profitLoss.toFixed(4);
    item.style = positionProfitLoss.positionTablePLStyle;
    tr.appendChild(item);

    item = document.createElement("th");
    item.textContent = positionProfitLoss.profitLossRateShow;
    item.style = positionProfitLoss.positionTablePLStyle;
    tr.appendChild(item);

    element.appendChild(tr);
  }
}

async function showData() {
  //造数据
  const targetProfitLossList = await getTargetProfitLoss();

  const targetListDiv = document.getElementById("targetProfitLossList");

  // targetProfitLossList 循环画表格
  for (let targetProfitLoss of targetProfitLossList) {
    console.log(targetProfitLoss);
    let targetitem = document.createElement("div");

    targetListDiv.appendChild(targetitem);

    showDiv(targetProfitLoss, targetitem);

    //table列
    let tableCol = document.createElement("div");
    targetitem.appendChild(tableCol);

    //定义table
    let reversalTable = document.createElement("table");
    reversalTable.className = "reversal";
    tableCol.appendChild(reversalTable);

    //画table
    showTable(targetProfitLoss, reversalTable);
  }
}

const show = async function () {
  await showData();
  const refresh_icon = document.getElementById("refresh-icon");
  refresh_icon.addEventListener("click", refreshPage);
};

// 页面加载完成时，刷新列表
window.onload = show;
