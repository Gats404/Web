// tasks.js — ЛР 16, задания 1–5. Каждое задание — функция; её исходный код выводится на страницу,
// а результат — в блок «Результат» и в консоль браузера.

const TASKS = [
    {
        title: 'Задание 1. Создание объекта и доступ к свойствам',
        goal: 'Литеральная нотация, точечная и скобочная запись доступа к свойствам.',
        run(log) {
            // Литеральная нотация: объект описывается в фигурных скобках
            const product = {
                title: 'Samsung Galaxy A54 5G',
                brand: 'Samsung',
                year: 2023,
                category: 'Смартфоны',
                'цена, ₽': 34990, // ключ с пробелом и запятой — только в кавычках
            };

            log('— Точечная нотация —');
            log('product.title    =', product.title);
            log('product.brand    =', product.brand);
            log('product.year     =', product.year);
            log('product.category =', product.category);

            log('— Скобочная нотация —');
            log("product['title']    =", product['title']);
            log("product['brand']    =", product['brand']);
            log("product['year']     =", product['year']);
            log("product['category'] =", product['category']);
            log("product['цена, ₽']  =", product['цена, ₽'], '← через точку так нельзя');

            // Имя свойства в переменной — тоже только скобки
            for (const key of ['title', 'year']) log(`product[key], key = '${key}' →`, product[key]);

            // Изменение и добавление свойств
            product.year = 2024;
            product['color'] = 'лаймовый';
            log('После изменения:', product);
            log('Несуществующее свойство product.weight =', product.weight);

            // Другой способ создания — конструктор Object
            const speaker = new Object();
            speaker.title = 'Яндекс Станция Мини 2';
            speaker.price = 6990;
            log('new Object() →', speaker);
        },
    },
    {
        title: 'Задание 2. Методы объекта и this',
        goal: 'Функции внутри объекта; this указывает на объект, у которого вызван метод.',
        run(log) {
            const cartItem = {
                title: 'Яндекс Станция Макс',
                price: 19990,
                discount: 8, // %
                qty: 1,
                // Метод — функция в свойстве объекта
                finalPrice() {
                    return Math.round(this.price * (1 - this.discount / 100));
                },
                total() {
                    return this.finalPrice() * this.qty;
                },
                setQty(n) {
                    if (n < 1) throw new RangeError('Количество должно быть не меньше 1');
                    this.qty = n;
                    return this; // возвращаем сам объект — методы можно вызывать цепочкой
                },
                describe() {
                    return `${this.title}: ${this.qty} шт. × ${this.finalPrice()} ₽ = ${this.total()} ₽`;
                },
            };

            log(cartItem.describe());
            log(cartItem.setQty(3).describe()); // цепочка вызовов
            cartItem.discount = 15;
            log('Скидка 15% →', cartItem.describe());
            try {
                cartItem.setQty(0);
            } catch (e) {
                log('setQty(0) →', `${e.name}: ${e.message}`);
            }

            // Метод, взятый отдельно от объекта, теряет this
            const lost = cartItem.finalPrice;
            log('lost() без объекта →', lost());
            const bound = cartItem.finalPrice.bind(cartItem); // привязываем this навсегда
            log('bind(cartItem)() →', bound());

            // У стрелочной функции нет своего this — она берёт его снаружи
            const arrow = { price: 100, get: () => this?.price };
            log('стрелочная функция-метод: this.price →', arrow.get());
        },
    },
    {
        title: 'Задание 3. Удаление и проверка свойств',
        goal: 'Оператор delete, оператор in, методы hasOwnProperty() и Object.hasOwn().',
        run(log) {
            const order = { id: 1001, customer: 'Иван Иванов', promo: 'BEHOOF500', comment: undefined, items: 2 };
            log('Исходный заказ:', order);
            log("'promo' in order →", 'promo' in order);
            log("order.hasOwnProperty('promo') →", order.hasOwnProperty('promo'));

            delete order.promo; // свойство удаляется целиком (вместе с ключом)
            log('После delete order.promo:', order);
            log("'promo' in order →", 'promo' in order, '| order.promo →', order.promo);

            // Свойство есть, но значение undefined: сравнение обманывает, in — нет
            log('order.comment === undefined →', order.comment === undefined);
            log("'comment' in order →", 'comment' in order);

            // in видит и унаследованные свойства, hasOwnProperty — только собственные
            log("'toString' in order →", 'toString' in order);
            log("order.hasOwnProperty('toString') →", order.hasOwnProperty('toString'));
            log("Object.hasOwn(order, 'id') →", Object.hasOwn(order, 'id'));

            // Объект-наследник через прототип
            const vipOrder = Object.create(order);
            vipOrder.priority = 'срочно';
            log("'customer' in vipOrder →", 'customer' in vipOrder,
                "| vipOrder.hasOwnProperty('customer') →", vipOrder.hasOwnProperty('customer'));

            // delete возвращает true/false; у замороженного объекта удалить свойство нельзя
            const frozen = Object.freeze({ sku: 'A54-256' });
            log('delete frozen.sku →', delete frozen.sku, '| frozen.sku =', frozen.sku);
        },
    },
    {
        title: 'Задание 4. Перебор свойств объекта',
        goal: 'for…in, Object.keys(), Object.values(), Object.entries() и Object.fromEntries().',
        run(log) {
            const specs = { экран: '6.4" AMOLED', память: '8/256 ГБ', камера: '50 Мп', аккумулятор: '5000 мА·ч', вес: '202 г' };

            log('— for…in —');
            for (const key in specs) log(`  ${key}: ${specs[key]}`);

            log('Object.keys   →', Object.keys(specs));
            log('Object.values →', Object.values(specs));
            log('Object.entries →', Object.entries(specs));

            log('— entries + деструктуризация —');
            Object.entries(specs).forEach(([k, v], i) => log(`  ${i + 1}. ${k} — ${v}`));

            // Практика: сумма корзины и цены со скидкой
            const cart = { 'Galaxy A54': 31491, 'Станция Мини 2': 6291, 'Redmi 10C': 8192 };
            const sum = Object.values(cart).reduce((a, b) => a + b, 0);
            log('Сумма корзины:', sum, '₽, позиций:', Object.keys(cart).length);
            const sale = Object.fromEntries(Object.entries(cart).map(([name, price]) => [name, Math.round(price * 0.9)]));
            log('Распродажа −10%:', sale);

            // for…in перебирает и унаследованные свойства — поэтому проверяют hasOwnProperty
            const child = Object.create({ inherited: 'из прототипа' });
            child.own = 'своё';
            for (const k in child) log(`  for…in: ${k}${child.hasOwnProperty(k) ? '' : ' (унаследовано)'}`);
            log('Object.keys(child) →', Object.keys(child), '— только собственные');
        },
    },
    {
        title: 'Задание 5. Вложенные объекты',
        goal: 'Доступ к глубоко вложенным свойствам, ?., деструктуризация, копирование, рекурсивный обход.',
        run(log) {
            const customer = {
                name: 'Иван Иванов',
                contacts: { phone: '+7 900 123-45-67', email: 'ivanov@example.com' },
                address: {
                    city: 'Москва',
                    street: 'ул. Примерная, 1',
                    geo: { lat: 55.7558, lon: 37.6173 },
                },
                orders: [
                    { id: 1001, total: 31491, items: [{ title: 'Galaxy A54', qty: 1 }] },
                    { id: 1002, total: 12582, items: [{ title: 'Станция Мини 2', qty: 2 }] },
                ],
            };

            log('customer.address.city =', customer.address.city);
            log("customer['address']['geo']['lat'] =", customer['address']['geo']['lat']);
            log('customer.orders[1].items[0].title =', customer.orders[1].items[0].title);

            // Опциональная цепочка ?. — undefined вместо ошибки, если промежуточного объекта нет
            log('customer.passport?.number =', customer.passport?.number);
            try {
                customer.passport.number;
            } catch (e) {
                log('Без ?. →', `${e.name}: ${e.message}`);
            }

            // Деструктуризация вложенных свойств
            const { address: { city, geo: { lat, lon } } } = customer;
            log(`Деструктуризация: city = ${city}, lat = ${lat}, lon = ${lon}`);

            // Изменение и добавление на глубине
            customer.address.geo.lat = 55.76;
            customer.contacts.telegram = '@ivanov_shop';
            log('contacts после добавления:', customer.contacts);
            log('Сумма всех заказов:', customer.orders.reduce((s, o) => s + o.total, 0), '₽');

            // Копирование: spread — поверхностное, structuredClone — глубокое
            const shallow = { ...customer };
            const deep = structuredClone(customer);
            shallow.address.city = 'Минск'; // вложенный объект общий у оригинала и поверхностной копии!
            log('shallow.address.city = "Минск" → customer.address.city =', customer.address.city, '| deep.address.city =', deep.address.city);

            // Рекурсивный обход вложенного объекта
            function walk(obj, path) {
                for (const [k, v] of Object.entries(obj)) {
                    const p = Array.isArray(obj) ? `${path}[${k}]` : `${path}.${k}`;
                    if (v && typeof v === 'object') walk(v, p);
                    else log(`  ${p} = ${v}`);
                }
            }
            log('— Рекурсивный обход deep.address и deep.orders —');
            walk(deep.address, 'address');
            walk(deep.orders, 'orders');
        },
    },
];

/* ---------- Отрисовка: код задания + результат ---------- */
(() => {
    const { esc, fmt, highlight, source } = Behoof; // общие помощники из assets/behoof.js

    const root = document.getElementById('tasks');
    TASKS.forEach((task, i) => {
        const n = i + 1;
        root.insertAdjacentHTML('beforeend', `
            <section class="section" id="t${n}">
                <h2 class="section__title">${esc(task.title)}</h2>
                <p class="section__lead">${esc(task.goal)}</p>
                <div class="task">
                    <article class="demo"><h3><small>Код</small>js/tasks.js</h3><pre class="code">${highlight(source(task.run))}</pre></article>
                    <article class="demo"><h3><small>Результат</small>Вывод программы</h3>
                        <button class="btn btn--sm" data-run="${i}">▶ Выполнить ещё раз</button>
                        <div class="out" id="out-${n}"></div></article>
                </div>
            </section>`);
    });

    function run(i) {
        const out = document.getElementById(`out-${i + 1}`);
        out.textContent = '';
        console.group(TASKS[i].title);
        const log = (...args) => {
            console.log(...args);
            out.textContent += args.map((a) => fmt(a)).join(' ') + '\n';
        };
        try {
            TASKS[i].run(log);
        } catch (e) {
            log(`Ошибка: ${e.name}: ${e.message}`);
        }
        console.groupEnd();
    }
    root.addEventListener('click', (e) => e.target.dataset.run && run(+e.target.dataset.run));
    TASKS.forEach((_, i) => run(i));
})();
