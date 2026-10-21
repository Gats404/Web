# ЛР 17. ООП в JavaScript — классы интернет-магазина «Behoof»

Страница `index.html` — каталог и корзина, полностью построенные на классах из `js/models.js`.
Те же классы подключаются в ЛР 19–20 (`../17/js/models.js`): каталог там загружается из JSON-файла через `Catalog.load()`, а корзина сохраняется в Local Storage через `Cart.toJSON()` / `Cart.fromJSON()`.

## Файлы

| Файл | Назначение |
|---|---|
| `js/models.js` | классы предметной области: `Product`, `Smartphone`, `Speaker`, `Catalog`, `Cart`, `Order` |
| `js/shop.js` | страница магазина: поиск, фильтр, сортировка, корзина, оформление заказа — только через методы классов |
| `js/principles.js` | шесть примеров принципов ООП (код и результат выводятся на страницу и в консоль) |

## Классы и связи между ними

```
              Product  (базовый)
        static #created, static CURRENCY
        #price, #discount, _category
        get/set price, get/set discount, get finalPrice
        getInfo(), badges(), render(), toJSON()
        static fromJSON(), format(), compareByPrice(), get created
             ▲                         ▲
     extends │                         │ extends
     Smartphone                     Speaker
  screen, storage, camera, has5G   assistant, power, smartHome
  getInfo() — своя версия          getInfo() — своя версия
  badges()  — super.badges() + 5G  badges()  — super.badges() + помощник

  Catalog ──содержит──▶ Product[]      Cart ──содержит──▶ { product, qty }      Order ◀──создаётся из── Cart
  #products                            #items (Map), #listeners, #emit()         static #lastNumber
  getById(), query()                   add(), setQty(), remove(), clear()         get summary
  static fromJSON(), static async load()  get items / count / total
                                       onChange(), toJSON(), static fromJSON()
```

| Класс | Зачем нужен |
|---|---|
| `Product` | общий товар: название, бренд, рейтинг, цена и скидка. Цена и скидка хранятся в **приватных** полях `#price`, `#discount` и меняются только через **сеттеры** с проверкой (отрицательная цена или скидка больше 90 % → `RangeError`). `finalPrice` — геттер без сеттера, т. е. только для чтения. |
| `Smartphone extends Product` | смартфон: экран, память, камера, 5G. Вызывает `super(data)` в конструкторе, **переопределяет** `getInfo()` и дополняет `badges()` через `super.badges()`. |
| `Speaker extends Product` | умная колонка: голосовой помощник, мощность, умный дом. Своя версия `getInfo()` и `badges()`. |
| `Catalog` | список товаров каталога: `getById()`, `query({ text, category, sort })`. `static fromJSON(array)` превращает массив из JSON в объекты нужных классов, `static async load(url)` загружает JSON с сервера. |
| `Cart` | корзина: приватный `Map` позиций, методы `add/setQty/remove/clear` (возвращают `this` — можно цепочкой), геттеры `items`, `count`, `total`, подписка `onChange()` с приватным методом `#emit()`, сохранение `toJSON()` и восстановление `static fromJSON()`. |
| `Order` | заказ, оформленный из корзины: номер берётся из приватного статического счётчика `static #lastNumber`; пустую корзину оформить нельзя. |

## Где какой принцип

- **Инкапсуляция** — `#price`, `#discount`, `#items`, `#listeners`, `#emit()`, `static #created`; доступ — через `get`/`set` и методы. Поле `_category` — «защищённое» по соглашению: его задают наследники.
- **Наследование** — `Smartphone` и `Speaker` расширяют `Product` (`extends`, `super(...)`, `super.badges()`, `super.toJSON()`).
- **Полиморфизм** — страница вызывает у любого товара одни и те же `render()` и `getInfo()`, а результат зависит от класса объекта.
- **Статические члены** — `Product.fromJSON()` (фабрика), `Product.format()`, `Product.compareByPrice()`, `Product.created`, `Catalog.fromJSON()`, `Catalog.load()`, `Cart.fromJSON()`.

## Запуск

Открыть `index.html` в браузере (сервер не нужен — данные берутся из `../assets/data/products.js`).
