// validate-js.js — ЛР 18, задание 2, способ 2: все проверки написаны на JavaScript (без RegExp),
// у формы атрибут novalidate. Правило возвращает текст ошибки или пустую строку.

(() => {
    const form = document.getElementById('form-js');
    const out = document.getElementById('out-js');
    const isDigit = (c) => c >= '0' && c <= '9';
    const isLatin = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');

    const rules = {
        login(v) {
            if (!v) return 'Поле не может быть пустым';
            if (v.length < 3 || v.length > 16) return `Длина от 3 до 16 символов (сейчас ${v.length})`;
            if (![...v].every((c) => isLatin(c) || isDigit(c) || c === '_')) return 'Только латинские буквы, цифры и _';
            if (isDigit(v[0])) return 'Логин не может начинаться с цифры';
            return '';
        },
        email(v) {
            if (!v) return 'Введите email';
            const at = v.indexOf('@');
            if (at < 1 || at !== v.lastIndexOf('@')) return 'В адресе должен быть ровно один символ @ после имени';
            const domain = v.slice(at + 1);
            if (!domain.includes('.') || domain.startsWith('.') || domain.endsWith('.')) return 'После @ нужен домен вида example.com';
            if (v.includes(' ')) return 'Email не может содержать пробелы';
            return '';
        },
        phone(v) {
            if (!v) return 'Введите номер телефона';
            const digits = [...v].filter(isDigit).join('');
            if (digits.length !== 11) return `Нужно 11 цифр, введено ${digits.length}`;
            if (digits[0] !== '7' && digits[0] !== '8') return 'Номер должен начинаться с +7 или 8';
            return '';
        },
        site(v) {
            if (!v) return ''; // необязательное поле
            if (!v.startsWith('http://') && !v.startsWith('https://')) return 'Адрес должен начинаться с http:// или https://';
            try {
                new URL(v); // встроенный разбор URL выбросит ошибку на неверном адресе
            } catch {
                return 'Некорректный URL';
            }
            return '';
        },
        age(v) {
            if (!v) return 'Укажите возраст';
            const n = Number(v);
            if (!Number.isInteger(n)) return 'Возраст — целое число';
            if (n < 14 || n > 100) return 'Возраст должен быть от 14 до 100 лет';
            return '';
        },
        password(v) {
            if (!v) return 'Придумайте пароль';
            if (v.length < 8) return `Минимум 8 символов (сейчас ${v.length})`;
            if (![...v].some(isDigit) || ![...v].some((c) => c.toLowerCase() !== c.toUpperCase())) return 'Нужны и буквы, и цифры';
            return '';
        },
        password2(v, all) {
            if (!v) return 'Повторите пароль';
            if (v !== all.password) return 'Пароли не совпадают';
            return '';
        },
        agree(_, all, el) {
            return el.checked ? '' : 'Нужно согласие с правилами';
        },
    };

    const values = () => Object.fromEntries([...form.elements].filter((el) => el.name).map((el) => [el.name, el.value.trim()]));

    function check(el) {
        const error = rules[el.name](el.value.trim(), values(), el);
        const box = el.closest('label').querySelector('.err');
        box.textContent = error;
        el.classList.toggle('is-error', !!error);
        el.classList.toggle('is-ok', !error && (el.type === 'checkbox' || el.value !== ''));
        el.dataset.checked = '1';
        return !error;
    }

    // Проверка поля при уходе с него и «живая» перепроверка, если в поле уже была ошибка
    form.addEventListener('focusout', (e) => rules[e.target.name] && check(e.target));
    form.addEventListener('input', (e) => {
        if (e.target.dataset.checked) check(e.target);
        if (e.target.name === 'password' && form.elements.password2.dataset.checked) check(form.elements.password2);
    });
    form.addEventListener('change', (e) => e.target.type === 'checkbox' && check(e.target));

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const fields = Object.keys(rules).map((name) => form.elements[name]);
        const failed = fields.filter((el) => !check(el));
        if (failed.length) {
            failed[0].focus();
            out.textContent = `Найдено ошибок: ${failed.length}\n` + failed.map((el) => `• ${el.name}: ${el.closest('label').querySelector('.err').textContent}`).join('\n');
        } else {
            const v = values();
            out.textContent = `✓ Все проверки пройдены.\nЛогин: ${v.login}, email: ${v.email}, возраст: ${v.age}`;
        }
    });
})();
