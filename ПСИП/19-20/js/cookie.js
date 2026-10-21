// cookie.js — ЛР 19–20, задание 2: сохранить личные данные в cookie, прочитать их и очистить.

/* ---------- Функции для работы с cookie ---------- */
const PREFIX = 'bh_'; // все cookie этой страницы начинаются с bh_ — так их легко найти и удалить

// Записать одну cookie. Значение кодируется: в cookie нельзя пробелы, ; , = и кириллицу «как есть»
function setCookie(name, value, days = 7) {
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; max-age=${days * 24 * 60 * 60}; path=/; samesite=lax`;
}

// Прочитать все cookie в объект: "a=1; b=2" → { a: '1', b: '2' }
function getCookies() {
    const result = {};
    if (!document.cookie) return result;
    for (const pair of document.cookie.split('; ')) {
        const i = pair.indexOf('=');
        result[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent(pair.slice(i + 1));
    }
    return result;
}

function getCookie(name) {
    return getCookies()[name] ?? null;
}

// Удалить cookie: та же запись с истёкшим сроком (max-age=0) и тем же path
function deleteCookie(name) {
    document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=/`;
}

/* ---------- Страница ---------- */
(() => {
    const { $, fillTable, toast, esc } = Behoof;

    function show(note) {
        const all = getCookies();
        const mine = Object.entries(all).filter(([k]) => k.startsWith(PREFIX));
        const labels = { ...ProfileForm.labels, saved: 'Сохранено', days: 'Срок хранения, дней' };
        fillTable($('#cookie-table'),
            mine.length ? mine.map(([k, v]) => [`${k} (${labels[k.slice(PREFIX.length)] || ''})`, v]) : [['—', 'cookie нет']],
            ['Имя cookie', 'Значение']);
        $('#cookie-raw').textContent = document.cookie ? document.cookie.split('; ').join(';\n') : '(пусто)';
        $('#cookie-info').textContent = (note ? note + ' · ' : '') +
            `document.cookie: ${document.cookie.length} символов, cookie на странице: ${Object.keys(all).length}` +
            (location.protocol === 'file:' ? ' · ВНИМАНИЕ: на file:// Chrome не сохраняет cookie — откройте через http (Live Server)' : '');

        const fio = getCookie(PREFIX + 'fio');
        const age = ProfileForm.age(getCookie(PREFIX + 'birth'));
        $('#greeting').innerHTML = fio
            ? `<div class="alert alert--ok">👋 С возвращением, ${esc(fio.split(' ')[1] || fio)}!${age !== null ? ` Вам ${age} лет.` : ''}
               Данные взяты из cookie, сохранённых ${esc(getCookie(PREFIX + 'saved') || '')}.</div>`
            : '<div class="alert alert--info">Cookie пока нет — заполните форму и нажмите «Сохранить в cookie».</div>';
    }

    // Сохранить
    ProfileForm.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = ProfileForm.read();
        const days = Number(ProfileForm.form.elements.days.value);
        for (const [key, value] of Object.entries(data)) {
            setCookie(PREFIX + key, Array.isArray(value) ? value.join(', ') : value, days);
        }
        setCookie(PREFIX + 'saved', new Date().toLocaleString('ru-RU'), days);
        setCookie(PREFIX + 'days', days, days);
        show(`Записано ${Object.keys(data).length + 2} cookie на ${days} дн.`);
        toast('Данные сохранены в cookie');
    });

    // Получить
    $('#load').addEventListener('click', () => {
        const all = getCookies();
        if (!all[PREFIX + 'fio']) return toast('В cookie нет сохранённых данных');
        ProfileForm.fill({
            fio: all[PREFIX + 'fio'], email: all[PREFIX + 'email'], phone: all[PREFIX + 'phone'],
            birth: all[PREFIX + 'birth'], place: all[PREFIX + 'place'], category: all[PREFIX + 'category'],
            hobbies: (all[PREFIX + 'hobbies'] || '').split(', ').filter(Boolean),
        });
        show('Форма заполнена значениями из cookie');
        toast('Данные получены из cookie');
    });

    // Очистить
    $('#clear').addEventListener('click', () => {
        const names = Object.keys(getCookies()).filter((k) => k.startsWith(PREFIX));
        names.forEach(deleteCookie);
        ProfileForm.form.reset();
        show(`Удалено cookie: ${names.length}`);
        toast('Cookie очищены');
    });

    show();
})();
