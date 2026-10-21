// principles.js — ЛР 17: примеры принципов ООП на классах магазина (код + результат на странице).

const PRINCIPLES = [
    {
        title: '1. Класс и объект: создание через new',
        run(log) {
            // Класс — шаблон, объект — конкретный экземпляр, созданный по шаблону
            const phone = new Smartphone({
                id: 101, name: 'Behoof Phone X', brand: 'Behoof', price: 24990, discount: 10,
                screen: 6.5, storage: 256, camera: 64, has5G: true,
            });
            log('typeof Smartphone →', typeof Smartphone, '(класс — это особая функция)');
            log('phone →', phone);
            log('phone.name =', phone.name, '| phone.finalPrice =', phone.finalPrice);
            log('phone.getInfo() →', phone.getInfo());
            log('phone.constructor.name →', phone.constructor.name);

            // Объекты одного класса независимы: у каждого свои значения полей
            const other = Product.fromJSON(window.BEHOOF_PRODUCTS[1]);
            log('other.constructor.name →', other.constructor.name, '|', other.getInfo());
        },
    },
    {
        title: '2. Инкапсуляция: приватные поля, геттеры и сеттеры',
        run(log) {
            const p = catalog.getById(5); // Samsung Galaxy A54 5G
            log('p.price (геттер) =', p.price, '| p.discount =', p.discount, '| p.finalPrice =', p.finalPrice);

            p.discount = 20; // сеттер проверил значение и записал в приватное #discount
            log('p.discount = 20 → finalPrice =', p.finalPrice);

            try {
                p.price = -500; // сеттер не пропустит неверное значение
            } catch (e) {
                log('p.price = -500 →', `${e.name}: ${e.message}`);
            }
            try {
                p.discount = 95;
            } catch (e) {
                log('p.discount = 95 →', `${e.name}: ${e.message}`);
            }

            p.finalPrice = 1; // у finalPrice нет сеттера — присваивание игнорируется
            log('p.finalPrice = 1 → p.finalPrice всё равно', p.finalPrice);

            // Приватных полей нет среди ключей объекта; в JSON цена попадает только через метод toJSON()
            log("'#price' in Object.keys(p) →", Object.keys(p).includes('#price'), '| ключи:', Object.keys(p));
            try {
                new Function('p', 'return p.#price');
            } catch (e) {
                log('Обращение p.#price вне класса →', `${e.name}: ${e.message}`);
            }
            log('JSON.stringify(p) →', JSON.stringify(p));
            p.discount = 10; // вернуть как было
        },
    },
    {
        title: '3. Наследование: extends и super',
        run(log) {
            const phone = catalog.getById(4); // iPhone 13 — объект Smartphone
            log('phone instanceof Smartphone →', phone instanceof Smartphone);
            log('phone instanceof Product →', phone instanceof Product, '(наследник — тоже Product)');
            log('phone instanceof Speaker →', phone instanceof Speaker);

            // Цепочка прототипов: объект → Smartphone.prototype → Product.prototype → Object.prototype
            const chain = [];
            for (let o = Object.getPrototypeOf(phone); o; o = Object.getPrototypeOf(o)) chain.push(o.constructor.name);
            log('Цепочка прототипов:', chain.join(' → '));

            // Методы родителя доступны наследнику без копирования кода
            log("phone.hasOwnProperty('render') →", phone.hasOwnProperty('render'),
                "| 'render' in phone →", 'render' in phone, '(унаследован от Product)');
            log("Object.getOwnPropertyNames(Smartphone.prototype) →", Object.getOwnPropertyNames(Smartphone.prototype));

            // super.badges() внутри Smartphone: значки родителя + свои
            log('phone.badges() →', phone.badges());
            log('Product.prototype.badges.call(phone) →', Product.prototype.badges.call(phone), '(только родительская часть)');
        },
    },
    {
        title: '4. Полиморфизм: один вызов — разное поведение',
        run(log) {
            // Смешанный список: смартфоны и колонки. Вызываем ОДИН и тот же метод getInfo()
            const mixed = [catalog.getById(2), catalog.getById(5), catalog.getById(8), catalog.getById(10)];
            for (const item of mixed) {
                log(`${item.constructor.name.padEnd(10)} → ${item.getInfo()}`);
            }

            // Базовый Product без переопределения — своя, «общая» версия метода
            const gift = new Product({ id: 900, name: 'Подарочная карта Behoof', brand: 'Behoof', price: 3000 });
            log(`${gift.constructor.name.padEnd(10)} → ${gift.getInfo()}`);

            // Код страницы не знает, какой именно товар перед ним, — просто вызывает render()
            const html = mixed.map((p) => p.render());
            log('render() вернул разметку для', html.length, 'карточек разных классов');
        },
    },
    {
        title: '5. Статические поля и методы (static)',
        run(log) {
            // static — принадлежит самому классу, а не объектам
            log('Product.created (static get) →', Product.created, 'объектов Product создано');
            log('Product.CURRENCY →', Product.CURRENCY);
            log('Product.format(123456) →', Product.format(123456));

            const data = { id: 777, name: 'Яндекс Станция Лайт', brand: 'Яндекс', category: 'speaker', price: 4990, assistant: 'Алиса', power: 5 };
            const fromJson = Product.fromJSON(data); // фабрика сама выбрала нужный класс
            log('Product.fromJSON({ category: "speaker", … }) →', fromJson.constructor.name);

            const cheapFirst = catalog.all.sort(Product.compareByPrice).slice(0, 3).map((p) => p.name);
            log('catalog.all.sort(Product.compareByPrice) →', cheapFirst);

            const restored = Cart.fromJSON([{ id: 3, qty: 2 }, { id: 11, qty: 1 }], catalog);
            log('Cart.fromJSON([...]) → count =', restored.count, ', total =', Product.format(restored.total));

            const phone = catalog.getById(1);
            log('phone.fromJSON →', phone.fromJSON, '(у объектов статических методов нет)');
        },
    },
    {
        title: '6. Корзина: приватный Map, геттеры, цепочка вызовов, Order',
        run(log) {
            const demoCart = new Cart();
            demoCart.add(catalog.getById(5)).add(catalog.getById(11), 2); // add возвращает this
            log('cart.count =', demoCart.count, '| cart.total =', Product.format(demoCart.total));
            log('cart.toJSON() →', demoCart.toJSON());
            try {
                demoCart.add({ id: 1, name: 'просто объект' });
            } catch (e) {
                log('cart.add(не Product) →', `${e.name}: ${e.message}`);
            }
            try {
                demoCart.add(catalog.getById(6)); // Galaxy M14 нет в наличии
            } catch (e) {
                log('cart.add(нет в наличии) →', `${e.name}: ${e.message}`);
            }
            const order = new Order(demoCart, 'Иван Иванов');
            log(order.summary);
            try {
                new Order(new Cart(), 'Иван Иванов');
            } catch (e) {
                log('new Order(пустая корзина) →', `${e.name}: ${e.message}`);
            }
        },
    },
];

(() => {
    const { esc, fmt, highlight, source } = Behoof;
    const root = document.getElementById('demos');

    PRINCIPLES.forEach((d, i) => {
        root.insertAdjacentHTML('beforeend', `
            <div class="principle" id="p${i + 1}">
                <article class="demo"><h3><small>Код</small>${esc(d.title)}</h3><pre class="code">${highlight(source(d.run))}</pre></article>
                <article class="demo"><h3><small>Результат</small>Вывод</h3>
                    <button class="btn btn--sm" data-run="${i}">▶ Выполнить ещё раз</button>
                    <div class="out" id="pout-${i}"></div></article>
            </div>`);
    });

    function run(i) {
        const out = document.getElementById(`pout-${i}`);
        out.textContent = '';
        console.group(PRINCIPLES[i].title);
        const log = (...args) => {
            console.log(...args);
            out.textContent += args.map((a) => fmt(a)).join(' ') + '\n';
        };
        try {
            PRINCIPLES[i].run(log);
        } catch (e) {
            log(`Ошибка: ${e.name}: ${e.message}`);
        }
        console.groupEnd();
    }
    root.addEventListener('click', (e) => e.target.dataset.run && run(+e.target.dataset.run));
    PRINCIPLES.forEach((_, i) => run(i));
})();
