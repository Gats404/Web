// script.js — JavaScript для интернет-магазина Behoof.
// Демонстрация: способы внедрения JS, операторы, диалоговые окна, fetch (AJAX).

// ===== 1. СПОСОБЫ ВНЕДРЕНИЯ JS =====

// Способ 1: внешний файл (этот файл подключён через <script src>)
console.log("JS подключён как внешний файл");

// Способ 2: обработка события загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM загружен");
    initOrderButtons();
    initContactForm();
    initSubscribeForm();
});

// Способ 3: прямое назначение обработчика (onclick)
const consultBtn = document.querySelector('.btn--accent[data-bs-toggle="tooltip"]');
if (consultBtn) {
    consultBtn.onclick = () => alert("Поможем подобрать товар за 5 минут");
}

// ===== 2. ДИАЛОГОВЫЕ ОКНА (alert / confirm / prompt) =====
function handleOrder(e) {
    const card = e.target.closest('.product-card');
    const name = card ? card.querySelector('.product-card__name').innerText : 'Товар';

    if (confirm(`Добавить «${name}» в корзину?`)) {
        const qty = prompt("Укажите количество:", "1");
        if (qty && Number(qty) > 0) {
            alert(`${qty} шт. «${name}» добавлено в корзину!`);
        }
    }
}

// Способ 4: addEventListener (современный стандарт)
function initOrderButtons() {
    document.querySelectorAll('.btn--order').forEach(btn => {
        btn.addEventListener('click', handleOrder);
    });
}

// ===== 3. ОПЕРАТОРЫ JS (демонстрационные функции) =====

// if / тернарный
function checkStock(qty) {
    return qty > 0 ? "В наличии" : "Нет в наличии";
}

// switch
function categoryName(cat) {
    switch (cat) {
        case "smartphone": return "Смартфоны";
        case "speaker":    return "Умные колонки";
        case "laptop":     return "Ноутбуки";
        default:           return "Прочее";
    }
}

// for
function priceList() {
    const res = [];
    for (let i = 1; i <= 3; i++) res.push(`Товар ${i}: ${i * 9990} руб.`);
    return res;
}

// while
function countStock() {
    let n = 0;
    while (n < 5) n++;
    return `Товаров на складе: ${n}`;
}

// do...while
function checkOrders() {
    let c = 0;
    do { c++; } while (c < 10);
    return `Обработано заказов: ${c}`;
}

// break / continue
function filterGoods(list) {
    const good = [];
    for (const item of list) {
        if (item === "снят с продажи") break;     // прерывание
        if (item === "нет в наличии") continue;   // пропуск итерации
        good.push(item);
    }
    return good;
}

// return
function total(price, qty) {
    return price * qty;
}

// ===== 4. AJAX: форма обратной связи (fetch -> send_mail.php) =====
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const responseDiv = document.getElementById('formResponse');
    const submitBtn   = document.getElementById('submitBtn');
    const spinner     = submitBtn.querySelector('.spinner-border');

    form.addEventListener('submit', e => {
        e.preventDefault();
        submitBtn.disabled = true;
        spinner.classList.remove('d-none');
        responseDiv.classList.add('d-none');

        fetch('send_mail.php', { method: 'POST', body: new FormData(form) })
            .then(r => r.json())
            .then(data => {
                responseDiv.classList.remove('d-none', 'alert-success', 'alert-danger');
                responseDiv.classList.add(data.status === 'success' ? 'alert-success' : 'alert-danger');
                responseDiv.textContent = data.message;
                if (data.status === 'success') form.reset();
            })
            .catch(() => {
                responseDiv.classList.remove('d-none');
                responseDiv.classList.add('alert-danger');
                responseDiv.textContent = 'Ошибка сети. Попробуйте позже.';
            })
            .finally(() => {
                submitBtn.disabled = false;
                spinner.classList.add('d-none');
            });
    });
}

// ===== 5. AJAX: подписка (fetch -> subscribe.php) =====
function initSubscribeForm() {
    const form = document.getElementById('subscribeForm');
    if (!form) return;

    const resp = document.getElementById('subResponse');

    form.addEventListener('submit', e => {
        e.preventDefault();
        const emailInput = form.querySelector('input[name="email"]');
        const btn = form.querySelector('button[type="submit"]');
        if (!emailInput.value) return;

        btn.disabled = true;
        btn.textContent = '...';
        resp.textContent = '';
        resp.className = 'small mt-1 text-muted';

        const fd = new FormData();
        fd.append('email', emailInput.value);

        fetch('subscribe.php', { method: 'POST', body: fd })
            .then(r => r.json())
            .then(data => {
                resp.classList.add(data.status === 'success' ? 'text-success' : 'text-danger');
                resp.textContent = data.message;
                if (data.status === 'success') emailInput.value = '';
            })
            .catch(() => {
                resp.classList.add('text-danger');
                resp.textContent = 'Ошибка сети';
            })
            .finally(() => {
                btn.disabled = false;
                btn.textContent = 'OK';
            });
    });
}
