// keyboard.js — ЛР 15, события клавиатуры: горячая клавиша «/», поиск с подсказками, стрелки, Enter, Escape.

(() => {
    const input = document.getElementById('search-input');
    const box = document.getElementById('suggest');
    const { rub, finalPrice, esc } = Behoof;
    let items = []; // найденные товары
    let active = -1; // выбранная стрелками подсказка

    /* Глобальные клавиши на документе */
    document.addEventListener('keydown', (e) => {
        const typing = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
        // «/» или Ctrl+K — фокус в поиск (как на больших сайтах)
        if ((e.key === '/' && !typing) || (e.ctrlKey && e.code === 'KeyK')) {
            e.preventDefault(); // иначе «/» напечатается в поле
            input.focus();
            input.classList.add('is-flash');
            setTimeout(() => input.classList.remove('is-flash'), 600);
            EventLog.add('keydown', `key="${e.key}" code=${e.code} ctrl=${e.ctrlKey} → фокус в поиск`);
        }
        // Escape закрывает всё открытое
        if (e.key === 'Escape') {
            const opened = ['suggest', 'lightbox', 'ctx-menu', 'drawer'].map((id) => document.getElementById(id)).filter((el) => !el.hidden);
            opened.forEach((el) => (el.hidden = true));
            if (opened.length) EventLog.add('keydown', `Escape → закрыто: ${opened.map((el) => el.id).join(', ')}`);
        }
    });

    /* input: подсказки при каждом изменении текста */
    function renderSuggest() {
        const q = input.value.trim().toLowerCase();
        if (!q) return (box.hidden = true);
        items = Shop.products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)).slice(0, 6);
        active = items.length ? 0 : -1;
        const mark = (name) => esc(name).replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'), '<mark>$1</mark>');
        box.innerHTML = items.length
            ? items.map((p, i) => `<li data-i="${i}" class="${i === active ? 'is-active' : ''}">${mark(p.name)}<span>${rub(finalPrice(p))}</span></li>`).join('') +
              '<li class="suggest__hint">↑ ↓ — выбор · Enter — открыть · Esc — закрыть</li>'
            : '<li class="suggest__empty">Ничего не найдено</li>';
        box.hidden = false;
    }
    input.addEventListener('input', (e) => {
        renderSuggest();
        EventLog.add('input', `value="${input.value}" (${e.inputType})`);
    });

    function highlight() {
        box.querySelectorAll('li[data-i]').forEach((li) => li.classList.toggle('is-active', +li.dataset.i === active));
    }
    function choose(i) {
        const p = items[i];
        if (!p) return;
        box.hidden = true;
        input.value = p.name;
        input.blur();
        Shop.reveal(p.id);
        EventLog.add('keydown', `Enter → открыт товар «${p.name}»`);
    }

    /* keydown внутри поля: навигация по подсказкам */
    input.addEventListener('keydown', (e) => {
        if (box.hidden || !items.length) return;
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault(); // не двигать курсор в поле
            active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
            highlight();
            EventLog.add('keydown', `${e.key} → подсказка ${active + 1} из ${items.length}`);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            choose(active);
        }
    });
    box.addEventListener('mousedown', (e) => {
        const li = e.target.closest('li[data-i]');
        if (li) choose(+li.dataset.i);
    });
    input.addEventListener('focus', renderSuggest);
    input.addEventListener('blur', () => setTimeout(() => (box.hidden = true), 150));
    document.getElementById('search-btn').addEventListener('click', () => (items.length ? choose(Math.max(active, 0)) : input.focus()));
})();
