// shop.js — ЛР 19–20, задание 1: каталог загружается из JSON-файла (AJAX), корзина хранится в localStorage.
// Классы Catalog / Product / Cart / Order — из ЛР 17 (../17/js/models.js).

(async () => {
    const { $, esc, toast } = Behoof;
    const JSON_URL = 'data/products.json';
    const CART_KEY = 'behoof-cart';
    const PROMO_KEY = 'behoof-promo';
    const PROMOS = { BEHOOF500: { sum: 500, min: 5000 }, SALE10: { percent: 10, min: 0 } };

    let catalog;
    let cart;

    /* ---------- Загрузка JSON: fetch (Promise) и XMLHttpRequest (события) ---------- */
    async function loadWithFetch() {
        const t0 = performance.now();
        const response = await fetch(JSON_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text(); // сырой текст ответа
        const data = JSON.parse(text); // строка JSON → массив объектов
        return { data, text, ms: performance.now() - t0, how: 'fetch()' };
    }

    function loadWithXHR() {
        return new Promise((resolve, reject) => {
            const t0 = performance.now();
            const xhr = new XMLHttpRequest();
            xhr.open('GET', JSON_URL);
            xhr.responseType = 'text';
            xhr.onload = () => (xhr.status === 200
                ? resolve({ data: JSON.parse(xhr.responseText), text: xhr.responseText, ms: performance.now() - t0, how: 'XMLHttpRequest' })
                : reject(new Error(`HTTP ${xhr.status}`)));
            xhr.onerror = () => reject(new Error('сетевая ошибка'));
            xhr.send();
        });
    }

    async function load(loader) {
        try {
            const { data, text, ms, how } = await loader();
            showStatus(`<span class="tag tag--green">✓ ${data.length} товаров загружено из ${JSON_URL}</span>
                        <span class="tag">${how} · ${Math.round(ms)} мс · ${new Blob([text]).size} байт</span>`);
            $('#raw-json').textContent = text;
            return Catalog.fromJSON(data);
        } catch (err) {
            // Открыто двойным кликом (file://) — браузер не даёт fetch читать локальные файлы
            showStatus(`<span class="tag tag--red">Не удалось загрузить ${JSON_URL}: ${esc(err.message)}</span>
                        <span class="tag">Использована резервная копия assets/data/products.js. Откройте через Live Server / http.</span>`);
            $('#raw-json').textContent = JSON.stringify(window.BEHOOF_PRODUCTS, null, 2);
            return Catalog.fromJSON(window.BEHOOF_PRODUCTS);
        }
    }
    const showStatus = (html) => ($('#status').innerHTML = html);

    /* ---------- Корзина в localStorage ---------- */
    function restoreCart() {
        let saved = [];
        try {
            saved = JSON.parse(localStorage.getItem(CART_KEY)) || []; // null → []
        } catch {
            localStorage.removeItem(CART_KEY); // повреждённые данные — удаляем
        }
        const restored = Cart.fromJSON(saved, catalog);
        restored.onChange(() => {
            localStorage.setItem(CART_KEY, JSON.stringify(restored)); // вызовет cart.toJSON()
            renderCart();
            renderCatalog();
        });
        return restored;
    }

    function promoDiscount(total) {
        const code = localStorage.getItem(PROMO_KEY);
        const p = PROMOS[code];
        if (!p || total < p.min) return 0;
        return p.sum || Math.round((total * p.percent) / 100);
    }

    function renderCatalog() {
        const list = catalog.query({ text: $('#q').value, category: $('#cat').value, sort: $('#sort').value });
        const inCart = new Set(cart.items.map((i) => i.product.id));
        $('#grid').innerHTML = list.map((p) => p.render()).join('') || '<p class="hint">Ничего не найдено</p>';
        inCart.forEach((id) => $(`#grid [data-id="${id}"]`)?.classList.add('is-in-cart'));
    }

    function renderCart() {
        $('#cart-list').innerHTML = cart.items.length
            ? cart.items.map(({ product: p, qty, sum }) => `
                <li><img src="../assets/img/${p.image}" alt="">
                    <div><b>${esc(p.name)}</b>
                        <div class="qty"><button data-id="${p.id}" data-d="-1">−</button>${qty}<button data-id="${p.id}" data-d="1">+</button>
                        <button class="del" data-id="${p.id}" data-d="del" title="Удалить">✕</button></div></div>
                    <span>${Product.format(sum)}</span></li>`).join('')
            : '<li class="cart__empty">Корзина пуста</li>';
        const discount = promoDiscount(cart.total);
        $('#sum-count').textContent = cart.count;
        $('#sum-goods').textContent = Product.format(cart.total);
        $('#sum-promo').textContent = discount ? `−${Product.format(discount)} (${localStorage.getItem(PROMO_KEY)})` : '—';
        $('#sum-total').textContent = Product.format(cart.total - discount);
        $('#raw-storage').textContent =
            `localStorage.getItem('${CART_KEY}') →\n${localStorage.getItem(CART_KEY) ?? 'null'}\n\n` +
            `localStorage.getItem('${PROMO_KEY}') → ${localStorage.getItem(PROMO_KEY) ?? 'null'}\n` +
            `localStorage.length = ${localStorage.length}`;
    }

    /* ---------- Старт ---------- */
    catalog = await load(loadWithFetch);
    cart = restoreCart();
    if (cart.count) toast(`Корзина восстановлена из localStorage: ${cart.count} шт.`);
    renderCatalog();
    renderCart();

    /* ---------- События ---------- */
    ['#q', '#cat', '#sort'].forEach((s) => $(s).addEventListener('input', renderCatalog));

    $('#grid').addEventListener('click', (e) => {
        const id = e.target.dataset.add;
        if (!id) return;
        const p = catalog.getById(id);
        cart.add(p);
        toast(`🛒 ${p.name} — в корзине`);
    });

    $('#cart-list').addEventListener('click', (e) => {
        const { id, d } = e.target.dataset;
        if (!id) return;
        if (d === 'del') return cart.remove(Number(id));
        const item = cart.items.find((i) => i.product.id === Number(id));
        cart.setQty(Number(id), item.qty + Number(d));
    });

    $('#promo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const code = $('#promo').value.trim().toUpperCase();
        if (!PROMOS[code]) return toast('Такого промокода нет');
        localStorage.setItem(PROMO_KEY, code);
        renderCart();
        toast(`Промокод ${code} применён`);
    });

    $('#clear').addEventListener('click', () => {
        cart.clear();
        localStorage.removeItem(PROMO_KEY);
        renderCart();
    });

    $('#checkout').addEventListener('click', () => {
        try {
            const order = new Order(cart, 'Покупатель Behoof');
            const discount = promoDiscount(cart.total);
            $('#order-out').textContent = order.summary + '\n' +
                order.lines.map((l) => `• ${l.name} × ${l.qty} = ${Product.format(l.sum)}`).join('\n') +
                (discount ? `\nСкидка по промокоду: −${Product.format(discount)}\nК оплате: ${Product.format(order.total - discount)}` : '');
            $('#order-dialog').showModal();
            cart.clear();
            localStorage.removeItem(PROMO_KEY);
            renderCart();
        } catch (err) {
            toast(err.message);
        }
    });

    $('#reload-xhr').addEventListener('click', async () => {
        catalog = await load(loadWithXHR);
        const saved = cart.toJSON();
        cart = restoreCart(); // пересоздаём корзину с новыми объектами товаров
        if (!cart.count && saved.length) saved.forEach(({ id, qty }) => cart.add(catalog.getById(id), qty));
        renderCatalog();
        renderCart();
        toast('Каталог перезагружен через XMLHttpRequest');
    });
})();
