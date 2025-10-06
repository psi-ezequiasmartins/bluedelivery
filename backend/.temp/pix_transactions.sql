CREATE TABLE `pix_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `orderId` int NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `payload` text,
  `status` enum('PENDING','GENERATED','PAID','EXPIRED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `txid` varchar(255) NOT NULL,
  `paidAt` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `txid_UNIQUE` (`txid`),
  KEY `fk_pix_order_idx` (`orderId`),
  CONSTRAINT `fk_pix_order` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;