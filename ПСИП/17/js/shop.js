// shop.js — ЛР 17: страница магазина работает только через объекты классов из models.js.

const catalog = Catalog.fromJSON(window.BEHOOF_PRODUCTS); // 12 объектов Smartphone / Speaker
const cart = new Cart();

(() => {
    const { $, esc, toast } = Behoof;

    function renderCatalog() {
        const list = catalog.query({ text: $('#q').value, category: $('#cat').value, sort: $('#sort').value });
        // Полиморфизм: у всех один вызов render(), а getInfo()/badges() внутри — свои у каждого класса
        $('#grid').innerHTML = list.map((p) => p.render()).join('');
        $('#found').textContent = `catalog.query(…) → ${list.length} из ${catalog.size} · Product.created = ${Product.created}`;
    }

    function renderCart() {
        $('#cart-list').innerHTML = cart.items.length
            ? cart.items.map(({ product: p, qty, sum }) => `
                <li><img src="../assets/img/${p.image}" alt="">
                    <div><b>${esc(p.name)}</b><div class="qty">
                        <button data-qty="${p.id}" data-d="-1">−</button>${qty}<button data-qty="${p.id}" data-d="1">+</button></div></div>
                    <span>${Product.format(sum)}</span></li>`).join('')
            : '<li class="cart__empty">Пусто. Нажмите «В корзину» на карточке.</li>';
        $('#cart-count').textContent = cart.count; // геттер count
        $('#cart-total').textContent = Product.format(cart.total); // геттер total
    }

    // Корзина сама сообщает об изменениях — подписываемся один раз
    cart.onChange(renderCart);

    $('#grid').addEventListener('click', (e) => {
        const id = e.target.dataset.add;
        if (!id) return;
        const product = catalog.getById(id);
        try {
            cart.add(product);
            toast(`cart.add(${product.constructor.name}) → ${product.name}`);
        } catch (err) {
            toast(`${err.name}: ${err.message}`);
        }
    });
    $('#cart-list').addEventListener('click', (e) => {
        const id = Number(e.target.dataset.qty);
        if (!id) return;
        const item = cart.items.find((i) => i.product.id === id);
        cart.setQty(id, item.qty + Number(e.target.dataset.d));
    });
    $('#clear').addEventListener('click', () => cart.clear());

    $('#checkout').addEventListener('click', () => {
        try {
            const order = new Order(cart, 'Иван Иванов');
            $('#order-out').textContent = order.summary + '\n\n' +
                order.lines.map((l) => `• ${l.name} × ${l.qty} = ${Product.format(l.sum)}`).join('\n');
            $('#order-dialog').showModal();
            cart.clear();
        } catch (err) {
            toast(`${err.name}: ${err.message}`);
        }
    });

    ['#q', '#cat', '#sort'].forEach((s) => $(s).addEventListener('input', renderCatalog));
    renderCatalog();
    renderCart();
})();
