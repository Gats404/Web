// models.js — ЛР 17: классы предметной области интернет-магазина «Behoof».
// Используются на странице ЛР 17 и в каталоге с корзиной ЛР 19–20 (подключаются оттуда как ../17/js/models.js).
//
//   Product ─┬─ Smartphone   (наследование: extends + super, полиморфизм: свой getInfo/badges)
//            └─ Speaker
//   Cart     — корзина: приватный Map с позициями, геттеры total/count, static fromJSON
//   Catalog  — список товаров: поиск, фильтры, сортировка, static fromJSON / load
//   Order    — заказ, оформленный из корзины: static-счётчик номеров
//
// Обозначения доступа: #поле — приватное (только внутри класса), _поле — «защищённое» по соглашению
// (для класса и наследников), остальное — публичное.

/* ===================== Товар (базовый класс) ===================== */
class Product {
    static #created = 0; // приватное статическое поле: сколько товаров создано
    static CURRENCY = '₽'; // публичное статическое поле

    #price; // приватные поля: снаружи изменить можно только через сеттеры с проверкой
    #discount = 0;

    constructor({ id, name, brand, price, discount = 0, rating = 0, reviews = 0, inStock = true, image = 'p1.png', specs = '' }) {
        this.id = id;
        this.name = name;
        this.brand = brand;
        this.rating = rating;
        this.reviews = reviews;
        this.inStock = inStock;
        this.image = image;
        this.specs = specs;
        this._category = 'product'; // «защищённое»: наследники переопределяют
        this.price = price; // вызов сеттера — значение пройдёт проверку
        this.discount = discount;
        Product.#created++;
    }

    // Геттер и сеттер цены — инкапсуляция: нельзя записать отрицательную или нечисловую цену
    get price() {
        return this.#price;
    }
    set price(value) {
        if (!Number.isFinite(value) || value <= 0) throw new RangeError(`Цена должна быть положительным числом, получено: ${value}`);
        this.#price = Math.round(value);
    }

    get discount() {
        return this.#discount;
    }
    set discount(value) {
        if (value < 0 || value > 90) throw new RangeError(`Скидка должна быть от 0 до 90 %, получено: ${value}`);
        this.#discount = value;
    }

    // Вычисляемое свойство только для чтения (есть геттер, нет сеттера)
    get finalPrice() {
        return Math.round(this.#price * (1 - this.#discount / 100));
    }

    get category() {
        return this._category;
    }

    // Метод для переопределения в наследниках (полиморфизм)
    getInfo() {
        return `${this.name} — ${Product.format(this.finalPrice)}`;
    }

    // Значки на карточке; наследники дополняют список через super.badges()
    badges() {
        const list = [];
        if (this.#discount) list.push(`−${this.#discount}%`);
        if (!this.inStock) list.push('нет в наличии');
        return list;
    }

    // Общая разметка карточки — у всех классов одна, а содержимое getInfo()/badges() у каждого своё
    render() {
        const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
        return `
            <article class="p-card oop-card oop-card--${this.category}" data-id="${this.id}">
                <span class="oop-card__class">${this.constructor.name}</span>
                <div class="p-card__img"><img src="../assets/img/${this.image}" alt="${esc(this.name)}"></div>
                <div class="oop-card__badges">${this.badges().map((b) => `<span class="tag">${esc(b)}</span>`).join('')}</div>
                <h4 class="p-card__title">${esc(this.name)}</h4>
                <p class="p-card__specs">${esc(this.getInfo())}</p>
                <div class="p-card__price">${Product.format(this.finalPrice)}<s>${Product.format(this.price)}</s></div>
                <button class="btn btn--sm" data-add="${this.id}" ${this.inStock ? '' : 'disabled'}>В корзину</button>
            </article>`;
    }

    // Для JSON.stringify: приватные поля сами в JSON не попадают, поэтому собираем объект вручную
    toJSON() {
        return { id: this.id, name: this.name, brand: this.brand, category: this.category, price: this.price, discount: this.discount };
    }

    /* ----- статические методы: вызываются у класса, а не у объекта ----- */

    // Фабрика: по полю category создаёт объект нужного класса
    static fromJSON(data) {
        if (data.category === 'smartphone') return new Smartphone(data);
        if (data.category === 'speaker') return new Speaker(data);
        return new Product(data);
    }

    static format(sum) {
        return new Intl.NumberFormat('ru-RU').format(sum) + ' ' + Product.CURRENCY;
    }

    static compareByPrice(a, b) {
        return a.finalPrice - b.finalPrice;
    }

    static get created() {
        return Product.#created;
    }
}

/* ===================== Смартфон (наследник) ===================== */
class Smartphone extends Product {
    constructor(data) {
        super(data); // сначала конструктор родителя — он создаст id, name, цену…
        this.screen = data.screen;
        this.storage = data.storage;
        this.camera = data.camera;
        this.has5G = Boolean(data.has5G);
        this._category = 'smartphone';
    }

    // Переопределение метода родителя — полиморфизм
    getInfo() {
        return `📱 ${this.screen}" · ${this.storage} ГБ · ${this.camera} Мп${this.has5G ? ' · 5G' : ''}`;
    }

    badges() {
        const list = super.badges(); // результат родительского метода + своё
        if (this.has5G) list.push('5G');
        if (this.storage >= 256) list.push('256 ГБ');
        return list;
    }

    toJSON() {
        return { ...super.toJSON(), screen: this.screen, storage: this.storage, camera: this.camera, has5G: this.has5G };
    }
}

/* ===================== Умная колонка (наследник) ===================== */
class Speaker extends Product {
    constructor(data) {
        super(data);
        this.assistant = data.assistant;
        this.power = data.power;
        this.smartHome = Boolean(data.smartHome);
        this._category = 'speaker';
    }

    getInfo() {
        return `🔊 помощник ${this.assistant} · ${this.power} Вт${this.smartHome ? ' · умный дом' : ''}`;
    }

    badges() {
        const list = super.badges();
        list.push(this.assistant);
        return list;
    }

    toJSON() {
        return { ...super.toJSON(), assistant: this.assistant, power: this.power, smartHome: this.smartHome };
    }
}

/* ===================== Корзина ===================== */
class Cart {
    #items = new Map(); // приватно: id товара → { product, qty }
    #listeners = [];

    add(product, qty = 1) {
        if (!(product instanceof Product)) throw new TypeError('В корзину можно положить только объект Product');
        if (!product.inStock) throw new Error(`«${product.name}» нет в наличии`);
        const item = this.#items.get(product.id);
        if (item) item.qty += qty;
        else this.#items.set(product.id, { product, qty });
        this.#emit();
        return this; // для цепочки cart.add(a).add(b)
    }

    setQty(id, qty) {
        if (!this.#items.has(id)) return this;
        if (qty <= 0) this.#items.delete(id);
        else this.#items.get(id).qty = qty;
        this.#emit();
        return this;
    }

    remove(id) {
        this.#items.delete(id);
        this.#emit();
        return this;
    }

    clear() {
        this.#items.clear();
        this.#emit();
        return this;
    }

    get items() {
        return [...this.#items.values()].map(({ product, qty }) => ({ product, qty, sum: product.finalPrice * qty }));
    }

    get count() {
        return this.items.reduce((n, i) => n + i.qty, 0);
    }

    get total() {
        return this.items.reduce((s, i) => s + i.sum, 0);
    }

    // Подписка на изменения: страница перерисовывает корзину, хранилище сохраняет её
    onChange(fn) {
        this.#listeners.push(fn);
    }

    #emit() {
        // приватный метод
        this.#listeners.forEach((fn) => fn(this));
    }

    toJSON() {
        return this.items.map(({ product, qty }) => ({ id: product.id, qty }));
    }

    // Восстановление корзины из сохранённых данных [{ id, qty }] и каталога
    static fromJSON(data, catalog) {
        const cart = new Cart();
        for (const { id, qty } of data || []) {
            const p = catalog.getById(id);
            if (p && p.inStock) cart.add(p, qty);
        }
        return cart;
    }
}

/* ===================== Каталог ===================== */
class Catalog {
    #products;

    constructor(products) {
        this.#products = products;
    }

    get all() {
        return [...this.#products];
    }

    get size() {
        return this.#products.length;
    }

    getById(id) {
        return this.#products.find((p) => p.id === Number(id));
    }

    // Поиск + фильтр + сортировка в одном методе
    query({ text = '', category = '', maxPrice = Infinity, sort = '' } = {}) {
        const q = text.trim().toLowerCase();
        const list = this.#products.filter(
            (p) => (!q || p.name.toLowerCase().includes(q)) && (!category || p.category === category) && p.finalPrice <= maxPrice
        );
        if (sort === 'price') list.sort(Product.compareByPrice);
        if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
        return list;
    }

    static fromJSON(array) {
        return new Catalog(array.map((item) => Product.fromJSON(item)));
    }

    // Асинхронная загрузка JSON-файла с сервера (AJAX через fetch) — используется в ЛР 19–20
    static async load(url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status} при загрузке ${url}`);
        return Catalog.fromJSON(await response.json());
    }
}

/* ===================== Заказ ===================== */
class Order {
    static #lastNumber = 1000;

    constructor(cart, customer) {
        if (!cart.count) throw new Error('Корзина пуста — оформлять нечего');
        this.number = ++Order.#lastNumber;
        this.date = new Date();
        this.customer = customer;
        this.lines = cart.items.map(({ product, qty, sum }) => ({ name: product.name, qty, sum }));
        this.total = cart.total;
    }

    get summary() {
        return `Заказ №${this.number} от ${this.date.toLocaleString('ru-RU')}: ${this.lines.length} поз., ${Product.format(this.total)}`;
    }
}
