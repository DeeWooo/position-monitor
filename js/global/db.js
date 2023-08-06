// 导出数据库对象
const db = new Dexie("PositionDatabase");

db.version(3).stores({
  position:
    "++id, code, name, buy_in_date, buy_in_price, status, number, portfolio, sell_in_date",
  realQuote: "++id, code, name, price", // 你可以根据实际需要调整这个表结构
});

export function addPosition(position) {
  return db.position
    .add(position)
    .catch((error) => console.error("An error occurred:", error));
}

export function updatePosition(id, position) {
  return db.position.update(id, position);
}

export function getValidPositions() {
  return db.position.where("status").equals(1).toArray();
}
