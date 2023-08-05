import { db } from "./dbConfig.js";
import { baseUrl, getStockRealPrice } from "./stock.js";

// 使用这个函数来初始化securitiesMap
export let securitiesMap = {};

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
  securitiesMap = initializeSecuritiesMap();
  // 这里你可以处理初始化后的securitiesMap
  console.log(securitiesMap);
});

// 定义一个函数来更新securitiesMap中的realPrice
const updateRealPrices = function () {
  // 循环遍历securitiesMap中的每个证券
  for (const code in securitiesMap) {
    // 使用你的方法获取每个证券的实时价格，例如使用fetch
    const stockUrl = baseUrl + `/q=${code}`;
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

        const realPrice = parseFloat(list[3]);

        // securitiesMap[code].name = list[1];
        // 更新securitiesMap中的实时价格
        // 四舍五入
        const roundedRealPrice = parseFloat(realPrice.toFixed(4));
        securitiesMap[code].realPrice = roundedRealPrice;
      })
      .catch((error) => console.error("An error occurred:", error));
  }
};

// 每20秒调用updateRealPrices来更新securitiesMap
setInterval(updateRealPrices, 20000);
