import { fetchSecurityData } from "./api.js";

// 导出数据库对象
const db = new Dexie("PositionDatabase");

db.version(4).stores({
  position:
    "++id, code, name, buy_in_date, buy_in_price, status, number, portfolio, sell_in_date",
  realQuote: "++id, code, name, realPrice",
});

// 处理position
export function addPosition(position) {
  return db.position
    .add(position)
    .catch((error) => console.error("An error occurred:", error));
}

export function updatePosition(id, position) {
  return db.position
    .update(id, position)
    .catch((error) => console.error("An error occurred:", error));
}

export function getValidPositions() {
  return db.position.where("status").equals(1).toArray();
}

// 处理realQuote
export function addRealQuote(realQuote) {
  return db.realQuote
    .add(realQuote)
    .catch((error) => console.error("An error occurred:", error));
}

export function updateRealQuote(id, realQuote) {
  return db.realQuote
    .update(id, realQuote)
    .catch((error) => console.error("An error occurred:", error));
}

export function getFirstRealQuote(code) {
  return db.realQuote
    .where("code")
    .equals(code)
    .first()
    .catch((error) => console.error("An error occurred:", error));
}

export function getRealQuotes() {
  return db.realQuote
    .toArray()
    .catch((error) => console.error("An error occurred:", error));
}
