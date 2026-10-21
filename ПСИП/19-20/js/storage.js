// storage.js — ЛР 19–20, задание 3: те же личные данные, но в постоянном хранилище localStorage.
// Дополнительно — sessionStorage (черновик формы и счётчик посещений вкладки) и событие storage.

(() => {
    const { $, fillTable, toast, esc } = Behoof;
    const KEY = 'behoof-profile';
    const DRAFT = 'behoof-profile-draft';

    function show(note) {
        const raw = localStorage.getItem(KEY); // строка или null
        const data = raw ? JSON.parse(raw) : null; // строка JSON → объект
        fillTable($('#ls-table'),
            data
                ? Object.entries(ProfileForm.labels).map(([k, label]) => [label, Array.isArray(data[k]) ? data[k].join(', ') || '—' : data[k] || '—'])
                    .concat([['Сохранено', data.saved]])
                : [['—', `ключа '${KEY}' нет`]],
            ['Поле', 'Значение']);
        $('#ls-raw').textContent = raw ? JSON.stringify(JSON.parse(raw), null, 2) : 'null';
        $('#ls-info').textContent = (note ? note + ' · ' : '') + `размер записи: ${raw ? raw.length : 0} символов, ключей в localStorage: ${localStorage.length}`;

        // Все ключи хранилища: key(i) + getItem
        const rows = [];
        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            rows.push([k, `${localStorage.getItem(k).length} символов`]);
        }
        fillTable($('#ls-keys'), rows.length ? rows : [['—', 'хранилище пусто']], ['localStorage.key(i)', 'Значение']);

        const age = data ? ProfileForm.age(data.birth) : null;
        $('#greeting').innerHTML = data
            ? `<div class="alert alert--ok">👋 Здравствуйте, ${esc(data.fio.split(' ')[1] || data.fio)}!${age !== null ? ` Вам ${age} лет.` : ''}
               Профиль загружен из localStorage — он хранится бессрочно, даже после закрытия браузера.</div>`
            : '<div class="alert alert--info">В localStorage профиля пока нет — заполните форму и нажмите «Сохранить в localStorage».</div>';
    }

    // Сохранить: объект → JSON-строка → setItem
    ProfileForm.form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = { ...ProfileForm.read(), saved: new Date().toLocaleString('ru-RU') };
        localStorage.setItem(KEY, JSON.stringify(data));
        sessionStorage.removeItem(DRAFT); // черновик больше не нужен
        show('setItem выполнен');
        toast('Данные сохранены в localStorage');
    });

    // Получить: getItem → JSON.parse → форма
    $('#load').addEventListener('click', () => {
        const raw = localStorage.getItem(KEY);
        if (!raw) return toast('В localStorage нет сохранённого профиля');
        ProfileForm.fill(JSON.parse(raw));
        show('Форма заполнена из localStorage');
        toast('Данные получены из localStorage');
    });

    // Очистить: removeItem (только наш ключ; localStorage.clear() стёр бы и корзину из задания 1)
    $('#clear').addEventListener('click', () => {
        localStorage.removeItem(KEY);
        ProfileForm.form.reset();
        show(`removeItem('${KEY}') выполнен`);
        toast('Профиль удалён из localStorage');
    });

    /* ---------- sessionStorage ---------- */
    const visits = Number(sessionStorage.getItem('behoof-visits') || 0) + 1;
    sessionStorage.setItem('behoof-visits', visits);
    $('#ss-visits').innerHTML = `<b>${visits}</b> — столько раз эта страница открывалась в текущей вкладке`;

    function showDraft(note = '') {
        const draft = sessionStorage.getItem(DRAFT);
        $('#ss-out').textContent = (note ? note + '\n' : '') + `sessionStorage.getItem('${DRAFT}') →\n${draft ? JSON.stringify(JSON.parse(draft), null, 1) : 'null'}`;
    }
    const savedDraft = sessionStorage.getItem(DRAFT);
    if (savedDraft) {
        ProfileForm.fill(JSON.parse(savedDraft));
        showDraft('Черновик восстановлен после перезагрузки');
    } else showDraft();

    ProfileForm.form.addEventListener('input', () => {
        sessionStorage.setItem(DRAFT, JSON.stringify(ProfileForm.read()));
        showDraft('Черновик обновлён (событие input)');
    });
    ProfileForm.form.addEventListener('change', () => sessionStorage.setItem(DRAFT, JSON.stringify(ProfileForm.read())));
    $('#ss-clear').addEventListener('click', () => {
        sessionStorage.clear();
        showDraft('sessionStorage.clear() — черновик и счётчик удалены');
    });

    /* ---------- Событие storage: изменение хранилища в ДРУГОЙ вкладке ---------- */
    window.addEventListener('storage', (e) => {
        if (e.storageArea !== localStorage) return;
        $('#ls-event').textContent = `storage: ключ «${e.key}» изменён в другой вкладке (${new Date().toLocaleTimeString('ru-RU')})`;
        show('Данные обновлены из другой вкладки');
    });

    show();
})();
