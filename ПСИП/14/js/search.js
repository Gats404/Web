// search.js — ЛР 14, раздел 2: поиск элементов на странице.

(() => {
    const { $, $$ } = Behoof;
    const showcase = $('#showcase');

    function highlight(els) {
        $$('.is-found').forEach((el) => el.classList.remove('is-found'));
        els.forEach((el) => el.classList.add('is-found'));
        if (els[0]) els[0].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
    const describe = (el) =>
        `<${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + String(el.className).trim().split(/\s+/).join('.') : ''}>` +
        (el.textContent.trim() ? ` «${el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)}»` : '');

    /* ---------- 2.1. Методы поиска ---------- */
    const methods = {
        id: () => [document.getElementById('card-2')],
        class: () => document.getElementsByClassName('p-card__price'),
        tag: () => showcase.getElementsByTagName('img'),
        name: () => document.getElementsByName('sort'),
        qs: () => [document.querySelector('.p-card__badge')], // только ПЕРВЫЙ подходящий
        qsa: () => document.querySelectorAll('[data-category="smartphone"]'),
        closest: () => [showcase.querySelector('img[alt*="iPhone"]').closest('.p-card')], // ближайший предок
    };
    $('#search-methods').addEventListener('click', (e) => {
        const key = e.target.dataset.m;
        if (!key) return;
        $$('#search-methods button').forEach((b) => b.classList.toggle('is-active', b === e.target));
        const result = methods[key]();
        const list = [...result];
        $('#search-out').textContent =
            `${e.target.textContent}\nТип результата: ${result.constructor.name}, найдено: ${list.length}\n` +
            list.map(describe).join('\n');
        highlight(list);
    });

    /* ---------- 2.2. Свой CSS-селектор ---------- */
    function runSelector() {
        const sel = $('#sel-input').value.trim();
        try {
            const found = [...showcase.querySelectorAll(sel)];
            $('#sel-out').textContent = `showcase.querySelectorAll('${sel}') → ${found.length} шт.\n` + found.map(describe).join('\n');
            highlight(found);
        } catch (err) {
            // неверный селектор → SyntaxError (DOMException)
            $('#sel-out').textContent = `Ошибка: ${err.name} — «${sel}» не является корректным CSS-селектором`;
        }
    }
    $('#sel-run').addEventListener('click', runSelector);
    $('#sel-input').addEventListener('keydown', (e) => e.key === 'Enter' && runSelector());
    $('#sel-presets').addEventListener('click', (e) => {
        if (!e.target.dataset.sel) return;
        $('#sel-input').value = e.target.dataset.sel;
        runSelector();
    });

    /* ---------- 2.3. Живая HTMLCollection и статичный NodeList ---------- */
    const live = showcase.getElementsByClassName('p-card'); // обновляется сама
    const frozen = showcase.querySelectorAll('.p-card'); // снимок на момент вызова
    const report = (action) =>
        ($('#live-out').textContent =
            `${action}\nHTMLCollection (getElementsByClassName).length = ${live.length}\n` +
            `NodeList (querySelectorAll, получен при загрузке).length = ${frozen.length}`);
    report('При загрузке страницы:');

    $('#live-add').addEventListener('click', () => {
        const card = document.createElement('article');
        card.className = 'p-card p-card--temp';
        card.innerHTML = '<h4 class="p-card__title">Новый товар</h4><p class="p-card__specs">добавлен скриптом</p>';
        showcase.append(card);
        report('Добавлена карточка:');
    });
    $('#live-remove').addEventListener('click', () => {
        $$('.p-card--temp', showcase).forEach((c) => c.remove());
        report('Добавленные карточки удалены:');
    });
})();
