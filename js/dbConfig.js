// import { Dexie } from "./dexie.min.js";

// 导出数据库对象
export const db = new Dexie("PositionDatabase");

db.version(2).stores({
  position:
    "++id, code, name, buy_in_date, buy_in_price, status, number, portfolio, sell_in_date",
});
