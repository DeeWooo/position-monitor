import { db } from "./dbConfig.js";
import { baseUrl, getStockRealPrice } from "./stock.js";

// 使用这个函数来初始化securitiesMap
export let securitiesMap = {};

const initializeSecuritiesMap = function () {
  // 创建一个空的对象来存储证券信息
  let map = {};

  // 从position表中获取所有条目
  return db.position
    .where("status")
    .equals(1)
    .toArray()
    .then((positions) => {
      // 遍历每个位置，从中提取代码并将其添加到securitiesMap
      positions.forEach((position) => {
        map[position.code] = {
          code: position.code,
          name: position.name, // 你可以根据实际数据结构进行调整
          realPrice: getStockRealPrice(position.code),
        };
      });
      return map;
    })
    .catch((error) => {
      console.error("An error occurred:", error);
      return map; // 如果出现错误，返回空的securitiesMap
    });
};

initializeSecuritiesMap().then((resolvedSecuritiesMap) => {
  securitiesMap = resolvedSecuritiesMap;
  // 在这里处理初始化后的securitiesMap
  console.log(securitiesMap);
});

// 定义一个函数来更新securitiesMap中的realPrice
const updateRealPrices = function () {
  // 循环遍历securitiesMap中的每个证券
  for (const code in securitiesMap) {
    securitiesMap[code].realPrice = getStockRealPrice(code);
  }
};

// 每15秒调用updateRealPrices来更新securitiesMap
setInterval(updateRealPrices, 15000);
