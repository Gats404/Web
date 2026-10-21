// catalog.js — ЛР 13, пример 7: каталог читает GET-параметры из URL (location.search) и фильтрует товары.

(() => {
    const { $, fillTable, productCard, finalPrice, esc } = Behoof;
    const products = window.BEHOOF_PRODUCTS;

    // 1. Читаем параметры адреса: ?category=smartphone&maxPrice=30000 → объект URLSearchParams
    const params = new URLSearchParams(location.search);
    const f = {
        q: (params.get('q') || '').trim().toLowerCase(),
        category: params.get('category') || '',
        brand: params.get('brand') || '',
        minPrice: Number(params.get('minPrice')) || 0,
        maxPrice: Number(params.get('maxPrice')) || Infinity,
        sort: params.get('sort') || '',
        inStock: params.get('inStock') === '1',
    };

    // 2. Заполняем форму значениями из URL, чтобы фильтры «помнили» выбор
    const brands = [...new Set(products.map((p) => p.brand))].sort();
    $('#brand-select').innerHTML += brands.map((b) => `<option>${esc(b)}</option>`).join('');
    const form = $('#filters');
    for (const [key, value] of params) {
        const el = form.elements[key];
        if (!el) continue;
        if (el.type === 'checkbox') el.checked = value === '1';
        else el.value = value;
    }

    // 3. Фильтрация и сортировка (цена — с учётом скидки)
    let list = products.filter((p) =>
        (!f.q || p.name.toLowerCase().includes(f.q)) &&
        (!f.category || p.category === f.category) &&
        (!f.brand || p.brand === f.brand) &&
        finalPrice(p) >= f.minPrice && finalPrice(p) <= f.maxPrice &&
        (!f.inStock || p.inStock));
    const sorters = {
        'price-asc': (a, b) => finalPrice(a) - finalPrice(b),
        'price-desc': (a, b) => finalPrice(b) - finalPrice(a),
        rating: (a, b) => b.rating - a.rating,
        discount: (a, b) => b.discount - a.discount,
    };
    if (sorters[f.sort]) list = [...list].sort(sorters[f.sort]);

    // 4. Вывод
    const names = { smartphone: 'Смартфоны', speaker: 'Умные колонки' };
    $('#title').textContent = names[f.category] || (f.brand ? `Товары ${f.brand}` : 'Весь каталог');
    $('#count').textContent = `найдено: ${list.length} из ${products.length}`;
    $('#grid').innerHTML = list.length
        ? list.map((p) => productCard(p, p.inStock ? '' : '<span class="tag tag--red">нет в наличии</span>')).join('')
        : '<div class="empty">По этим фильтрам ничего не найдено — <a href="catalog.html">сбросить</a></div>';
    list.forEach((p) => !p.inStock && $(`[data-id="${p.id}"]`).classList.add('is-out'));

    // 5. «Чипсы» активных фильтров: ссылка = текущий URL без одного параметра
    const labels = { q: 'поиск', category: 'категория', brand: 'бренд', minPrice: 'от', maxPrice: 'до', sort: 'сортировка', inStock: 'в наличии' };
    const chips = [...params].filter(([, v]) => v).map(([k, v]) => {
        const rest = new URLSearchParams(params);
        rest.delete(k);
        const href = 'catalog.html' + (rest.size ? '?' + rest : '');
        return `<a class="tag" href="${href}" title="Убрать фильтр">${labels[k] || k}: ${esc(v)} ✕</a>`;
    });
    $('#chips').innerHTML = chips.length ? 'Активные фильтры: ' + chips.join('') : '<span class="hint">Фильтры не заданы — показан весь каталог</span>';

    // 6. Таблица: что именно пришло в location.search
    fillTable($('#params'), [
        ['location.search', location.search || '(пусто)'],
        ...[...params].map(([k, v]) => [`params.get('${k}')`, v]),
    ], ['Выражение', 'Значение']);
})();
