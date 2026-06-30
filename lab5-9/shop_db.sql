-- ============================================================
--  shop_db.sql — база данных каталога интернет-магазина «Behoof»
--  Импорт: phpMyAdmin → Импорт, либо:
--      mysql -u root -p < shop_db.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS shop_db
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE shop_db;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)   NOT NULL,
    description VARCHAR(255)   NOT NULL,
    price       DECIMAL(12,2)  NOT NULL,
    discount    INT            NOT NULL DEFAULT 0,   -- скидка, %
    rating      DECIMAL(2,1)   NOT NULL DEFAULT 0,
    reviews     INT            NOT NULL DEFAULT 0,
    category    VARCHAR(50)    NOT NULL,             -- smartphone | speaker
    image_path  VARCHAR(255)   NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO products (name, description, price, discount, rating, reviews, category, image_path) VALUES
('Samsung Galaxy M32 128GB',  '6.4" Super AMOLED, 6/128 ГБ, 64 Мп, 5000 мА·ч',          28990.00, 12, 4.4, 5447, 'smartphone', 'img/p1.png'),
('Яндекс Станция Макс',       'Умная колонка с Zigbee, голосовой помощник Алиса',       19990.00,  8, 4.7, 1203, 'speaker',    'img/p2.png'),
('Realme C33 4/128GB',        '6.5" IPS, 4/128 ГБ, 50 Мп, 5000 мА·ч, чёрный',           11990.00, 15, 4.4, 2849, 'smartphone', 'img/p3.png'),
('Apple iPhone 13 128GB',     '6.1" OLED, A15 Bionic, 12 Мп, IP68, тёмная ночь',        69990.00,  5, 4.9, 8421, 'smartphone', 'img/p4.png'),
('Samsung Galaxy A54 5G',     '6.4" Super AMOLED 120 Гц, 8/256 ГБ, 50 Мп, 5G',          34990.00, 10, 4.6, 3310, 'smartphone', 'img/p5.png'),
('Samsung Galaxy M14 5G',     '6.6" PLS LCD, 4/128 ГБ, 50 Мп, 6000 мА·ч',               15490.00,  9, 4.3, 1876, 'smartphone', 'img/p6.png'),
('Xiaomi Redmi 10C 128GB',    '6.71" IPS, 4/128 ГБ, 50 Мп, 5000 мА·ч, синий',            9990.00, 18, 4.5, 4102, 'smartphone', 'img/p1.png'),
('Sber SberBoom',             'Умная колонка с голосовым помощником Салют',              7990.00, 20, 4.2, 980,  'speaker',    'img/p2.png');
