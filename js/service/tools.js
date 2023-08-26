export const today = function () {
  let now = new Date();
  let year = now.getFullYear(); // 获取年份
  let month = ("0" + (now.getMonth() + 1)).slice(-2); // 获取月份并确保两位数
  let day = ("0" + now.getDate()).slice(-2); // 获取日期并确保两位数
  return year + "-" + month + "-" + day;
};

export const styleProcess = function (profitLoss, profitLossRate) {
  //字体控制
  const colorStyle = "color:";
  const fontWeightStyle = "font-weight:bold;";

  let pLStyle = "";

  //颜色
  const compareColor = profitLoss;

  if (compareColor > 0) {
    pLStyle = colorStyle + "red;";
  } else if (compareColor < 0) {
    pLStyle = colorStyle + "green;";
  }

  //粗体
  const compareBold = Math.abs(profitLossRate * 100);
  if (compareBold > 10) {
    pLStyle += fontWeightStyle;
  }

  return pLStyle;
};

export const styleTradingSignal = function (price, buyIn, saleOut) {
  //        字体控制
  const colorStyle = "color:";
  //        String fontWeightStyle = "font-weight:bold;";

  let tsStyle = "";

  //卖出区间
  const compareUp = price - saleOut;
  //买入区间
  const compareDown = price - buyIn;

  if (compareUp >= 0 || compareDown <= 0) {
    tsStyle = colorStyle + "orange;";
  }

  return tsStyle;
};
