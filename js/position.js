// Initialize Dexie
const db = new Dexie("MyDatabase");

db.version(1).stores({
  position: "++id, name, age",
});

// CREATE TABLE `position` (
//     `id` int NOT NULL AUTO_INCREMENT,
//     `code` varchar(10) DEFAULT NULL COMMENT '股票代码',
//     `name` varchar(10) DEFAULT NULL COMMENT '股票名称',
//     `buy_in_date` date DEFAULT NULL COMMENT '买入日期',
//     `buy_in_price` float DEFAULT NULL COMMENT '买入价',
//     `status` tinyint DEFAULT NULL COMMENT '持仓1/平仓0',
//     `number` int DEFAULT NULL COMMENT '买入数量',
//     `portfolio` tinyint DEFAULT NULL COMMENT '投资组合',
//     PRIMARY KEY (`id`)
//   ) ENGINE=InnoDB AUTO_INCREMENT=549 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='持仓情况';
