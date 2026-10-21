// mouse.js — ЛР 15, события мыши: click, dblclick, mouseenter/mouseleave, mousemove, contextmenu.

(() => {
    const grid = document.getElementById('grid');
    const menu = document.getElementById('ctx-menu');
    const lightbox = document.getElementById('lightbox');
    let menuTarget = null; // id товара, по которому открыто контекстное меню

    /* click: кнопки на карточках (делегирование — один обработчик на всю сетку) */
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        if (e.target.closest('.product-card__btn')) {
            Shop.addToCart(card.dataset.id, card.querySelector('img'));
            EventLog.add('click', `«В корзину», кнопка ${e.button}, x=${e.clientX} y=${e.clientY}`);
        } else if (e.target.closest('.product-card__fav')) {
            Shop.toggleFav(card.dataset.id);
            EventLog.add('click', 'избранное ♡');
        }
    });

    /* click: фильтр по категориям */
    document.getElementById('tags').addEventListener('click', (e) => {
        const btn = e.target.closest('.tag-btn');
        if (!btn) return;
        document.querySelectorAll('.tag-btn').forEach((b) => b.classList.toggle('active', b === btn));
        Shop.setCategory(btn.dataset.cat);
        EventLog.add('click', `категория «${btn.textContent}»`);
    });

    /* dblclick: увеличить фото товара */
    function zoom(id) {
        const p = Shop.byId(id);
        document.getElementById('lightbox-img').src = `../assets/img/${p.image}`;
        document.getElementById('lightbox-cap').textContent = p.name;
        lightbox.hidden = false;
    }
    grid.addEventListener('dblclick', (e) => {
        const img = e.target.closest('.product-card__img-box');
        if (!img) return;
        zoom(img.closest('.product-card').dataset.id);
        EventLog.add('dblclick', `увеличение фото, detail=${e.detail}`);
    });
    lightbox.addEventListener('click', () => {
        lightbox.hidden = true;
        EventLog.add('click', 'закрыто увеличенное фото');
    });

    /* mouseenter / mouseleave: подсветка карточки.
       Эти события не всплывают, поэтому слушаем на сетке в фазе ПЕРЕХВАТА (третий аргумент true) */
    grid.addEventListener('mouseenter', (e) => {
        if (!e.target.classList?.contains('product-card')) return;
        e.target.classList.add('is-hover');
        EventLog.add('mouseenter', e.target.querySelector('h3').textContent, 300);
    }, true);
    grid.addEventListener('mouseleave', (e) => {
        if (!e.target.classList?.contains('product-card')) return;
        e.target.classList.remove('is-hover');
    }, true);

    /* mousemove: световое пятно следует за курсором в баннере */
    const hero = document.getElementById('hero');
    hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        hero.style.setProperty('--x', `${x}px`);
        hero.style.setProperty('--y', `${y}px`);
        EventLog.add('mousemove', `баннер: x=${Math.round(x)} y=${Math.round(y)}`, 500);
    });

    /* contextmenu: своё меню вместо стандартного */
    grid.addEventListener('contextmenu', (e) => {
        const card = e.target.closest('.product-card');
        if (!card) return;
        e.preventDefault(); // отменяем стандартное меню браузера
        menuTarget = card.dataset.id;
        menu.hidden = false;
        const x = Math.min(e.clientX, innerWidth - menu.offsetWidth - 10);
        const y = Math.min(e.clientY, innerHeight - menu.offsetHeight - 10);
        Object.assign(menu.style, { left: x + 'px', top: y + 'px' });
        EventLog.add('contextmenu', `правая кнопка: ${Shop.byId(menuTarget).name}`);
    });
    menu.addEventListener('click', (e) => {
        const act = e.target.dataset.act;
        if (act === 'cart') Shop.addToCart(menuTarget, grid.querySelector(`[data-id="${menuTarget}"] img`));
        if (act === 'fav') Shop.toggleFav(menuTarget, true);
        if (act === 'zoom') zoom(menuTarget);
        menu.hidden = true;
    });
    // клик в любом другом месте закрывает меню
    document.addEventListener('click', (e) => {
        if (!menu.hidden && !menu.contains(e.target)) menu.hidden = true;
    });

    /* click: корзина в шапке */
    document.getElementById('cart-btn').addEventListener('click', () => {
        document.getElementById('drawer').hidden = false;
        EventLog.add('click', 'открыта корзина');
    });
    document.getElementById('drawer-close').addEventListener('click', () => (document.getElementById('drawer').hidden = true));
})();
