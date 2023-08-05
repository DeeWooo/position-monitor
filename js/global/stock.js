export const baseUrl = `http://qt.gtimg.cn`;

export const getStockRealPrice = function (code) {
  const stockUrl = baseUrl + `/q=${code}`;

  console.log(stockUrl);
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

// 示例：用于从API获取证券数据的函数
export const fetchSecurityData = function (code) {
  const stockUrl = baseUrl + `/q=${code}`; // 请根据实际情况更新此URL

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
};
