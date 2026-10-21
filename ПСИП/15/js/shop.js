// shop.js — ЛР 15: данные и действия магазина (каталог, корзина, избранное).
// Сами события подключаются в mouse.js, keyboard.js, dragdrop.js, pointer.js, scroll.js, touch.js, timers.js.

const Shop = (() => {
    const { $, rub, finalPrice, esc, toast } = Behoof;
    const products = window.BEHOOF_PRODUCTS;
    const byId = (id) => products.find((p) => p.id === +id);

    const cart = new Map(); // id → количество
    const fav = new Set();
    const filter = { cat: '', maxPrice: 90000 };
    const PAGE = 6; // сколько карточек показывать сразу, остальные — автоподгрузкой при прокрутке
    let shown = 0;
    const grid = $('#grid');

    const visible = () => products.filter((p) => (!filter.cat || p.category === filter.cat) && finalPrice(p) <= filter.maxPrice);

    function cardHTML(p) {
        return `
            <div class="product-card" draggable="true" data-id="${p.id}">
                <button class="product-card__fav ${fav.has(p.id) ? 'is-on' : ''}" title="В избранное">♡</button>
                <div class="product-card__img-box"><img src="../assets/img/${p.image}" alt="${esc(p.name)}" class="product-card__img" draggable="false"></div>
                <span class="product-card__discount">−${p.discount}%</span>
                <h3 class="product-card__title">${esc(p.name)}</h3>
                <p class="product-card__specs">${esc(p.specs)}</p>
                <div class="product-card__price"><span class="price-now">${rub(finalPrice(p))}</span><span class="price-old">${rub(p.price)}</span></div>
                <button class="product-card__btn ${cart.has(p.id) ? 'is-added' : ''}">${cart.has(p.id) ? 'В корзине ✓' : 'В корзину'}</button>
            </div>`;
    }

    // Показать первые PAGE карточек (при смене фильтра) или добавить следующую порцию (loadMore)
    function render(reset = true) {
        const list = visible();
        if (reset) {
            shown = Math.min(PAGE, list.length);
            grid.innerHTML = list.slice(0, shown).map(cardHTML).join('') || '<p class="catalog__empty">Нет товаров в этом диапазоне цен</p>';
        }
        const more = $('#more');
        more.classList.toggle('is-done', shown >= list.length);
        more.textContent = shown >= list.length ? `Показаны все товары: ${list.length}` : `Показано ${shown} из ${list.length} — прокрутите ниже, подгрузим ещё`;
    }
    function loadMore() {
        const list = visible();
        if (shown >= list.length) return false;
        const next = list.slice(shown, shown + 3);
        grid.insertAdjacentHTML('beforeend', next.map(cardHTML).join(''));
        shown += next.length;
        render(false);
        return true;
    }

    function updateBadges() {
        const count = [...cart.values()].reduce((a, b) => a + b, 0);
        for (const [id, value] of [['#cart-count', count], ['#fav-count', fav.size]]) {
            const badge = $(id);
            badge.textContent = value;
            badge.classList.remove('is-bump');
            void badge.offsetWidth; // перезапуск CSS-анимации
            badge.classList.add('is-bump');
        }
    }

    // «Полёт» картинки товара в корзину
    function fly(fromImg) {
        if (!fromImg) return;
        const a = fromImg.getBoundingClientRect();
        const b = $('#cart-btn').getBoundingClientRect();
        const img = fromImg.cloneNode();
        img.className = 'fly';
        Object.assign(img.style, { left: a.left + 'px', top: a.top + 'px' });
        document.body.append(img);
        requestAnimationFrame(() => Object.assign(img.style, { left: b.left + 'px', top: b.top + 'px', width: '20px', height: '20px', opacity: '.3' }));
        img.addEventListener('transitionend', () => img.remove(), { once: true });
    }

    function addToCart(id, fromImg) {
        const p = byId(id);
        cart.set(p.id, (cart.get(p.id) || 0) + 1);
        fly(fromImg);
        updateBadges();
        const btn = grid.querySelector(`[data-id="${p.id}"] .product-card__btn`);
        if (btn) {
            btn.classList.add('is-added');
            btn.textContent = 'В корзине ✓';
        }
        toast(`🛒 ${p.name} — в корзине (${cart.get(p.id)} шт.)`);
        renderDrawer();
    }

    function toggleFav(id, force) {
        const p = byId(id);
        const on = force ?? !fav.has(p.id);
        on ? fav.add(p.id) : fav.delete(p.id);
        grid.querySelector(`[data-id="${p.id}"] .product-card__fav`)?.classList.toggle('is-on', on);
        updateBadges();
        toast(on ? `♡ ${p.name} — в избранном` : `${p.name} убран из избранного`);
    }

    function renderDrawer() {
        const items = [...cart].map(([id, qty]) => ({ p: byId(id), qty }));
        $('#drawer-list').innerHTML = items.length
            ? items.map(({ p, qty }) => `<li><img src="../assets/img/${p.image}" alt=""><span>${esc(p.name)} × ${qty}</span><b>${rub(finalPrice(p) * qty)}</b></li>`).join('')
            : '<li class="drawer__empty">Корзина пуста — перетащите сюда товар или нажмите «В корзину»</li>';
        const total = items.reduce((s, { p, qty }) => s + finalPrice(p) * qty, 0);
        $('#drawer-total').textContent = `Итого: ${rub(total)}`;
    }

    function setCategory(cat) {
        filter.cat = cat;
        render();
    }
    function setMaxPrice(v) {
        filter.maxPrice = v;
        render();
    }

    // Найти товар на странице: сбросить фильтры, показать все карточки, прокрутить и подсветить
    function reveal(id) {
        filter.cat = '';
        filter.maxPrice = 90000;
        document.querySelectorAll('.tag-btn').forEach((b) => b.classList.toggle('active', b.dataset.cat === ''));
        if (typeof PriceRange !== 'undefined') PriceRange.set(90000, false); // ползунок из pointer.js
        render();
        while (loadMore());
        const card = grid.querySelector(`[data-id="${id}"]`);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('is-hover');
        setTimeout(() => card.classList.remove('is-hover'), 2000);
    }

    render();
    renderDrawer();
    return { products, byId, addToCart, toggleFav, setCategory, setMaxPrice, loadMore, reveal, renderDrawer };
})();
