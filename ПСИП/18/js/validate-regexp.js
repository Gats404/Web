// validate-regexp.js — ЛР 18, задание 2, способ 3: валидация регулярными выражениями при вводе.

(() => {
    const form = document.getElementById('form-re');
    const out = document.getElementById('out-re');

    const RULES = {
        // Имя: с заглавной, кириллица, допускается двойное через дефис (Анна-Мария)
        name: { re: /^[А-ЯЁ][а-яё]+(?:-[А-ЯЁ][а-яё]+)?$/, hint: 'Кириллица, первая буква заглавная' },
        // Телефон в любом из форматов: +7 900 123-45-67, 8(900)1234567, +79001234567
        phone: { re: /^(?:\+7|8)[\s(-]*(\d{3})[\s)-]*(\d{3})[\s-]*(\d{2})[\s-]*(\d{2})$/, hint: '+7 или 8 и 10 цифр' },
        email: { re: /^[\w.+-]+@[a-z\d-]+(?:\.[a-z\d-]+)*\.[a-z]{2,}$/i, hint: 'имя@домен.зона' },
        zip: { re: /^\d{6}$/, hint: 'ровно 6 цифр' },
        promo: { re: /^[A-Z]{4,10}\d{2,4}$/, hint: '4–10 заглавных латинских букв и 2–4 цифры' },
    };

    // Правила сложности пароля — по отдельному выражению на каждое
    const PASSWORD = { len: /.{8,}/, lower: /[a-zа-яё]/, upper: /[A-ZА-ЯЁ]/, digit: /\d/, special: /[^\w\s]/ };

    function checkField(input) {
        const hint = input.closest('label').querySelector('.re');
        const value = input.value.trim();
        if (input.name === 'password') return checkPassword(input, hint);
        const { re } = RULES[input.name];
        const ok = re.test(value); // RegExp.prototype.test → true / false
        input.classList.toggle('is-ok', ok);
        input.classList.toggle('is-error', !ok && value !== '');
        hint.className = 're ' + (value ? (ok ? 'is-good' : 'is-bad') : '');
        hint.textContent = value ? `${re}.test() → ${ok}` : RULES[input.name].hint;
        // Нормализация телефона группами захвата: $1..$4 из выражения
        if (ok && input.name === 'phone') hint.textContent += ` → ${value.replace(re, '+7 ($1) $2-$3-$4')}`;
        return ok;
    }

    function checkPassword(input, hint) {
        const v = input.value;
        let score = 0;
        for (const [rule, re] of Object.entries(PASSWORD)) {
            const ok = re.test(v);
            if (ok) score++;
            document.querySelector(`#pw-rules [data-rule=${rule}]`).classList.toggle('is-ok', ok);
        }
        const levels = ['', 'очень слабый', 'слабый', 'средний', 'хороший', 'надёжный'];
        const colors = ['', '#ff5151', '#ff8a3d', '#f5c400', '#7ccf5a', '#2ecc71'];
        const bar = document.getElementById('pw-meter');
        bar.style.width = (score / 5) * 100 + '%';
        bar.style.background = colors[score];
        hint.className = 're ' + (score >= 4 ? 'is-good' : v ? 'is-bad' : '');
        hint.textContent = v ? `Пароль: ${levels[score]} (${score} из 5 правил)` : 'не менее 4 правил из 5';
        input.classList.toggle('is-ok', score >= 4);
        input.classList.toggle('is-error', !!v && score < 4);
        return score >= 4;
    }

    form.addEventListener('input', (e) => e.target.dataset.re && checkField(e.target));
    form.querySelectorAll('[data-re]').forEach((input) => (input.closest('label').querySelector('.re').textContent = RULES[input.name]?.hint || 'не менее 4 правил из 5'));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const results = [...form.querySelectorAll('[data-re]')].map((input) => [input.name, checkField(input)]);
        const bad = results.filter(([, ok]) => !ok).map(([n]) => n);
        out.textContent = bad.length ? `Не прошли проверку: ${bad.join(', ')}` : '✓ Все поля соответствуют регулярным выражениям';
    });
})();
