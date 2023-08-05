/* <tr
th:each="entityItem:${targetitem.positionProfitLosses}"
>
<td th:text="${entityItem.buyInDateShow}"></td>
<td th:text="${entityItem.position.buyInPrice}"></td>
<td th:text="${entityItem.position.number}"></td>
<td
  th:text="${entityItem.profitLoss}"
  th:style="${entityItem.positionTablePLStyle}"
></td>
<td
  th:text="${entityItem.profitLossRateShow}"
  th:style="${entityItem.positionTablePLStyle}"
></td>
</tr> */

const reversalTab = document.getElementById("reversal-tab");

const showHead = function () {
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
  item.textContent = "买入价格";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "盈亏";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "盈亏比";
  tr.appendChild(item);

  reversalTab.appendChild(tr);
};

const showBody = function () {
  let tr = document.createElement("tr");
  let item = document.createElement("th");
  item.textContent = "rsaarew";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "123412343";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "dsgdgdfg";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "hjhjgjh";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "tryuytuty";
  tr.appendChild(item);

  item = document.createElement("th");
  item.textContent = "oiuioykhg";
  tr.appendChild(item);

  reversalTab.appendChild(tr);
};

const show = function () {
  showHead();
  showBody();
};

// 页面加载完成时，刷新列表
window.onload = show;
