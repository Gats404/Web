// location.js — ЛР 13, объект location: части URL, GET-параметры каталога, методы навигации.

(() => {
    const { $, fillTable } = Behoof;

    /* ---------- Пример 1. Разбор адреса страницы ---------- */
    function showLocation() {
        fillTable($('#l-table'), [
            ['href', location.href],
            ['protocol', location.protocol],
            ['host', location.host || '(пусто — файл открыт с диска)'],
            ['hostname', location.hostname || '(пусто)'],
            ['port', location.port || '(по умолчанию)'],
            ['pathname', decodeURI(location.pathname)],
            ['search', location.search || '(нет параметров)'],
            ['hash', location.hash || '(нет)'],
            ['origin', location.origin],
        ]);
    }
    showLocation();
    window.addEventListener('hashchange', showLocation);

    /* ---------- Пример 7. Формируем адрес каталога из формы ---------- */
    const form = $('#l-form');
    function previewUrl() {
        const params = new URLSearchParams();
        for (const [k, v] of new FormData(form)) if (v) params.set(k, v); // пустые поля в URL не нужны
        $('#l-url').textContent = 'Будет открыт адрес:\ncatalog.html' + (params.size ? '?' + params : '');
    }
    form.addEventListener('input', previewUrl);
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        for (const [k, v] of new FormData(form)) if (v) params.set(k, v);
        location.href = 'catalog.html' + (params.size ? '?' + params : ''); // переход = запись в истории
    });
    previewUrl();

    /* ---------- Пример 2. assign / replace / hash ---------- */
    $('#l-hash').addEventListener('click', () => {
        location.hash = '#screen'; // прокрутка к якорю, новая запись в истории, событие hashchange
        $('#l-nav-out').textContent = `hash изменён → ${location.hash}, history.length = ${history.length}`;
    });
    $('#l-assign').addEventListener('click', () => location.assign('catalog.html?category=speaker'));
    $('#l-replace').addEventListener('click', () => location.replace('catalog.html?brand=Apple'));
})();
