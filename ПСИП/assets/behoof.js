// behoof.js — общие помощники для JS-лабораторных 13–20.
// Подключается обычным <script> до скриптов лабораторной, всё лежит в глобальном объекте Behoof.

const Behoof = {
    // Короткие имена для поиска элементов
    $: (sel, root = document) => root.querySelector(sel),
    $$: (sel, root = document) => [...root.querySelectorAll(sel)],

    // 28990 → «28 990 ₽»
    rub(n) {
        return new Intl.NumberFormat('ru-RU').format(Math.round(n)) + ' ₽';
    },

    // Цена со скидкой
    finalPrice(p) {
        return Math.round(p.price * (1 - p.discount / 100));
    },

    // Экранирование текста перед вставкой через innerHTML
    esc(s) {
        return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
    },

    // Заполнить <table> парами [название, значение]
    fillTable(table, rows, head = ['Свойство', 'Значение']) {
        table.innerHTML =
            `<tr><th>${head[0]}</th><th>${head[1]}</th></tr>` +
            rows.map(([k, v]) => `<tr><td>${Behoof.esc(k)}</td><td>${Behoof.esc(v)}</td></tr>`).join('');
    },

    // Всплывающее уведомление в правом нижнем углу (исчезает само)
    toast(text, ms = 3000) {
        let box = document.getElementById('toasts');
        if (!box) {
            box = document.createElement('div');
            box.id = 'toasts';
            box.className = 'toast-box';
            document.body.append(box);
        }
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = text;
        box.append(t);
        setTimeout(() => t.remove(), ms);
    },

    // Значение → строка «как в консоли»: строки в кавычках внутри объектов, функции — ƒ имя()
    fmt(v, nested = false) {
        if (typeof v === 'string') return nested ? `'${v}'` : v;
        if (typeof v === 'function') return /^class\s/.test(Function.prototype.toString.call(v)) ? `class ${v.name}` : `ƒ ${v.name || 'anonymous'}()`;
        if (v === null || typeof v !== 'object') return String(v);
        if (Array.isArray(v)) return `[${v.map((x) => Behoof.fmt(x, true)).join(', ')}]`;
        const key = (k) => (/^[\p{L}_$][\p{L}\p{N}_$]*$/u.test(k) ? k : `'${k}'`);
        const name = v.constructor && v.constructor !== Object ? v.constructor.name + ' ' : '';
        return `${name}{ ${Object.entries(v).map(([k, x]) => `${key(k)}: ${Behoof.fmt(x, true)}`).join(', ')} }`;
    },

    // Подсветка синтаксиса JS: комментарии, строки, ключевые слова, числа
    highlight(code) {
        const TOKENS = /(\/\/.*$)|('(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`|"(?:[^"\\\n]|\\.)*")|\b(const|let|function|return|for|of|in|if|else|try|catch|throw|new|delete|this|true|false|undefined|null|class|extends|super|static|get|set|typeof|instanceof)\b|\b(\d+(?:\.\d+)?)\b/gm;
        let html = '';
        let last = 0;
        for (const m of code.matchAll(TOKENS)) {
            html += Behoof.esc(code.slice(last, m.index));
            const cls = m[1] ? 'c' : m[2] ? 's' : m[3] ? 'k' : 'n';
            html += `<span class="${cls}">${Behoof.esc(m[0])}</span>`;
            last = m.index + m[0].length;
        }
        return html + Behoof.esc(code.slice(last));
    },

    // Тело функции без первой и последней строки, с убранным общим отступом
    source(fn) {
        const lines = fn.toString().split('\n').slice(1, -1);
        const indent = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
        return lines.map((l) => l.slice(indent)).join('\n');
    },

    // Карточка товара (разметка общая для всех лабораторных)
    productCard(p, extra = '') {
        const img = `../assets/img/${p.image}`;
        return `
            <article class="p-card" data-id="${p.id}">
                <div class="p-card__img"><img src="${img}" alt="${Behoof.esc(p.name)}"></div>
                <span class="p-card__badge">−${p.discount}%</span>
                <h4 class="p-card__title">${Behoof.esc(p.name)}</h4>
                <p class="p-card__specs">${Behoof.esc(p.specs)}</p>
                <div class="p-card__price">${Behoof.rub(Behoof.finalPrice(p))}<s>${Behoof.rub(p.price)}</s></div>
                ${extra}
            </article>`;
    },
};
