export class TargetProfitLoss {
  constructor() {
    this.positionProfitLosses = []; // 持仓记录
    this.code = ""; // 标的代码
    this.name = ""; // 标的名称
    this.realPrice = 0.0; // 实时价格
    this.currentPositionRate = 0.0; // 当前仓位
    this.costPositionRate = 0.0; // 成本仓位
    this.targetProfitLoss = 0.0; // 标的盈亏
    this.targetProfitLossRate = 0.0; // 标的盈亏比
    this.pLStyle = ""; // 盈亏字体样式
    this.recommendedBuyInPoint = 0.0; // 建议买入点
    this.recommendedSaleOutPoint = 0.0; // 建议卖出点
    this.tsStyle = ""; // 交易信号字体
  }
}

export class PositionProfitLoss {
  constructor() {
    this.position = null; // Assuming PositionEntity would have been some kind of object
    this.realPrice = 0.0; // 实时价格
    this.profitLoss = 0.0; // 盈亏
    this.profitLossRate = 0.0; // 盈亏比
    this.profitLossRateShow = "";
    this.buyInDateShow = ""; // 买入日期显示
    this.positionCost = 0.0; // 持仓成本
    this.positionTablePLStyle = ""; // 实时持仓页面盈亏字体
    this.positionName = ""; // 名称
    // this.portfolioShow = null; // 投资组合显示
  }
}
