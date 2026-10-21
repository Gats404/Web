// regexp.js — ЛР 18, задание 3: объект RegExp, флаги, методы test/exec и методы строк split/match/search/replace.

/* ---------- 3.1. Тестер регулярных выражений ---------- */
(() => {
    const { $, esc } = Behoof;
    const pattern = $('#re-pattern');
    const text = $('#re-text');

    text.value = [
        'Заказ №1001 от 21.10.2026: Samsung Galaxy A54 5G — 31 491 ₽, Яндекс Станция Мини 2 — 6 291 ₽.',
        'Заказ №1002 от 22.10.2026: Apple iPhone 15 — 83 691 ₽.',
        'Менеджер Анна: +7 900 111-22-33, a.smirnova@behoof.ru',
        'Поддержка: 8 (495) 000-00-00, help@behoof.ru',
        'Промокоды: BEHOOF500, SALE2026, behoof100',
    ].join('\n');

    const PRESETS = [
        { label: 'Цены в рублях', re: '(\\d{1,3}(?: \\d{3})*)\\s?₽', flags: 'g' },
        { label: 'Телефоны', re: '(?:\\+7|8)[\\s(]*\\d{3}[\\s)]*\\d{3}-\\d{2}-\\d{2}', flags: 'g' },
        { label: 'Email', re: '[\\w.+-]+@[\\w-]+\\.[a-z]{2,}', flags: 'gi' },
        { label: 'Даты (именованные группы)', re: '(?<day>\\d{2})\\.(?<month>\\d{2})\\.(?<year>\\d{4})', flags: 'g' },
        { label: 'Слова с заглавной (\\p{Lu}, флаг u)', re: '(?<!\\p{L})\\p{Lu}\\p{Ll}+', flags: 'gu' },
        { label: 'Строки «Заказ…» (^ и $, флаг m)', re: '^Заказ.*$', flags: 'gm' },
        { label: 'Промокоды без учёта регистра (i)', re: '\\bbehoof\\d+\\b', flags: 'gi' },
        { label: 'Sticky: цифры строго подряд (y)', re: '\\d', flags: 'y' },
    ];
    $('#re-presets').innerHTML = PRESETS.map((p, i) => `<button class="tag" data-i="${i}">${esc(p.label)}</button>`).join('');
    $('#re-presets').addEventListener('click', (e) => {
        const p = PRESETS[e.target.dataset.i];
        if (!p) return;
        pattern.value = p.re;
        document.querySelectorAll('#re-flags input').forEach((cb) => (cb.checked = p.flags.includes(cb.value)));
        if (p.flags === 'y') text.value = '2026 год, заказ 1001';
        run();
    });

    function run() {
        const flags = [...document.querySelectorAll('#re-flags input:checked')].map((cb) => cb.value).join('');
        let re;
        try {
            re = new RegExp(pattern.value, flags); // объект RegExp из строки шаблона и строки флагов
        } catch (err) {
            $('#re-view').textContent = text.value;
            $('#re-out').textContent = `Ошибка в шаблоне: ${err.message}`;
            return;
        }
        const src = text.value;
        // Все совпадения через exec(): при флаге g или y поиск продолжается с re.lastIndex
        const matches = [];
        let m;
        if (re.global || re.sticky) {
            while ((m = re.exec(src)) !== null) {
                matches.push(m);
                if (m[0] === '') re.lastIndex++; // защита от вечного цикла на пустом совпадении
            }
        } else if ((m = re.exec(src))) matches.push(m);

        // Подсветка совпадений
        let html = '';
        let last = 0;
        for (const x of matches) {
            html += esc(src.slice(last, x.index)) + `<mark>${esc(x[0])}</mark>`;
            last = x.index + x[0].length;
        }
        $('#re-view').innerHTML = html + esc(src.slice(last));

        const testRe = new RegExp(re.source, re.flags.replace(/[gy]/g, '')); // test без g — без побочного lastIndex
        $('#re-out').textContent =
            `const re = ${re};   // source: ${re.source}, flags: "${re.flags || '—'}"\n` +
            `re.test(text) → ${testRe.test(src)},  совпадений: ${matches.length}\n` +
            matches.slice(0, 12).map((x, i) => {
                const groups = x.groups ? ` groups: ${JSON.stringify(x.groups)}` : x.length > 1 ? ` $1: «${x[1]}»` : '';
                return `${String(i + 1).padStart(2)}. «${x[0]}» index=${x.index}${groups}`;
            }).join('\n') +
            (matches.length > 12 ? `\n… и ещё ${matches.length - 12}` : '');
    }
    [pattern, text].forEach((el) => el.addEventListener('input', run));
    $('#re-flags').addEventListener('change', run);
    run();
})();

/* ---------- 3.2. Методы RegExp и String ---------- */
const RE_METHODS = [
    {
        title: 'RegExp.test() — есть ли совпадение (true / false)',
        run(log) {
            const isEmail = /^[\w.+-]+@[\w-]+\.[a-z]{2,}$/i;
            for (const s of ['help@behoof.ru', 'ivanov@example', 'Анна@почта.рф', 'a.smirnova@BEHOOF.RU']) {
                log(`${isEmail}.test('${s}') → ${isEmail.test(s)}`);
            }
            // Ловушка: у выражения с флагом g test() запоминает позицию в lastIndex
            const g = /\d/g;
            log('С флагом g: test("7") →', g.test('7'), '; ещё раз →', g.test('7'), '(lastIndex =', g.lastIndex + ')');
        },
    },
    {
        title: 'RegExp.exec() — подробности совпадения и цикл по всем совпадениям',
        run(log) {
            const text = 'Galaxy A54 — 31 491 ₽, Станция Мини 2 — 6 291 ₽, Redmi 10C — 8 192 ₽';
            const price = /(?<name>[^,—]+?)\s—\s(?<sum>[\d ]+)\s₽/g;
            let m;
            let total = 0;
            while ((m = price.exec(text)) !== null) {
                const sum = Number(m.groups.sum.replace(/\s/g, ''));
                total += sum;
                log(`index ${m.index}: name = «${m.groups.name.trim()}», sum = ${sum}, lastIndex → ${price.lastIndex}`);
            }
            log('Итого по найденным ценам:', total, '₽');
            log('exec() без совпадений →', /iPhone/.exec(text));
        },
    },
    {
        title: 'String.split() — разбиение строки по регулярному выражению',
        run(log) {
            const tags = 'смартфон, 5G;NFC ;  AMOLED,128 ГБ';
            log('split(/\\s*[,;]\\s*/) →', tags.split(/\s*[,;]\s*/));
            log("split(/\\s+/, 3) → первые 3 слова:", 'Умная колонка с голосовым помощником Алиса'.split(/\s+/, 3));
            // Скобки в выражении: разделители тоже попадают в результат
            log('split(/([+\\-*/])/) →', '28990+6990-500'.split(/([+\-*/])/));
            log("Номер по цифрам: '+7 (900) 123-45-67'.split(/\\D+/) →", '+7 (900) 123-45-67'.split(/\D+/).filter(Boolean));
        },
    },
    {
        title: 'String.match() и matchAll() — получить совпадения',
        run(log) {
            const text = 'Скидки: 12%, 8%, 15% и 20% на колонки';
            const first = text.match(/\d+%/); // без g — как exec(): совпадение + index, input, groups
            log('match(/\\d+%/) без g →', first[0], '| index =', first.index, '| groups =', first.groups);
            log('match(/\\d+%/g) с g → массив всех совпадений:', text.match(/\d+%/g));
            const percents = text.match(/\d+(?=%)/g).map(Number); // (?=%) — «впереди %», сам % не берём
            log('Максимальная скидка:', Math.max(...percents) + '%');
            log("match(/iPhone/) → нет совпадений:", text.match(/iPhone/));
            for (const m of 'SALE10 BEHOOF500 VIP25'.matchAll(/([A-Z]+)(\d+)/g)) {
                log(`matchAll: код ${m[0]} → слово ${m[1]}, число ${m[2]}`);
            }
        },
    },
    {
        title: 'String.search() — позиция первого совпадения',
        run(log) {
            const msg = 'Звоните в поддержку Behoof: +7 495 000-00-00 или пишите help@behoof.ru';
            log('search(/\\+7/) →', msg.search(/\+7/), '— с этой позиции начинается телефон');
            log('search(/@/) →', msg.search(/@/));
            log('search(/behoof/i) →', msg.search(/behoof/i), '(без учёта регистра — первое «Behoof»)');
            log('search(/iPhone/) →', msg.search(/iPhone/), '— не найдено');
            log('Телефон из строки:', msg.slice(msg.search(/\+7/), msg.search(/\+7/) + 16));
        },
    },
    {
        title: 'String.replace() / replaceAll() — замена по шаблону',
        run(log) {
            const phone = '+7 900 123-45-67';
            log('Маска телефона:', phone.replace(/\d(?=.*\d{2}$)/g, '*').replace(/^\+\*/, '+7'));
            log('Лишние пробелы:', '«Яндекс    Станция   Макс»'.replace(/\s+/g, ' '));
            // $1, $2… — подстановка групп; формат даты ДД.ММ.ГГГГ → ГГГГ-ММ-ДД
            log('Дата:', '21.10.2026'.replace(/(\d{2})\.(\d{2})\.(\d{4})/, '$3-$2-$1'));
            log('Именованные группы:', '21.10.2026'.replace(/(?<d>\d{2})\.(?<m>\d{2})\.(?<y>\d{4})/, '$<d>/$<m>/$<y>'));
            // Функция вместо строки замены: каждую цену уменьшаем на 10 %
            const sale = 'Galaxy A54 — 34990 ₽, Станция Мини 2 — 6990 ₽'.replace(/(\d+) ₽/g, (all, sum) => `${Math.round(sum * 0.9)} ₽`);
            log('Скидка 10 % через функцию:', sale);
            log('replaceAll:', 'behoof, Behoof, BEHOOF'.replaceAll(/behoof/gi, 'Behoof'));
        },
    },
];

(() => {
    const { esc, fmt, highlight, source } = Behoof;
    const root = document.getElementById('re-methods');
    RE_METHODS.forEach((d, i) => {
        root.insertAdjacentHTML('beforeend', `
            <div class="method" id="m${i + 1}">
                <article class="demo"><h3><small>Код</small>${esc(d.title)}</h3><pre class="code">${highlight(source(d.run))}</pre></article>
                <article class="demo"><h3><small>Результат</small>Вывод</h3><div class="out" id="mout-${i}"></div></article>
            </div>`);
        const out = document.getElementById(`mout-${i}`);
        const log = (...args) => {
            console.log(...args);
            out.textContent += args.map((a) => fmt(a)).join(' ') + '\n';
        };
        try {
            d.run(log);
        } catch (e) {
            log(`Ошибка: ${e.name}: ${e.message}`);
        }
    });
})();
