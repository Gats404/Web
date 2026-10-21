// window.js — ЛР 13, объект window: межоконное взаимодействие, таймеры, размеры окна, диалоги.
// Каждый файл ЛР 13 обёрнут в IIFE, чтобы его переменные не пересекались с соседними скриптами.

(() => {
const { $, rub, finalPrice, fillTable, toast } = Behoof;
const products = window.BEHOOF_PRODUCTS;

// На file:// у страниц «пустой» origin ('null'), поэтому адресат postMessage — '*'
const TARGET_ORIGIN = location.origin === 'null' ? '*' : location.origin;

/* ---------- Пример 1. Межоконное взаимодействие ---------- */
let child = null; // ссылка на дочернее окно, которую возвращает window.open()

$('#w-product').innerHTML = products
    .map((p) => `<option value="${p.id}">${p.name} — ${rub(finalPrice(p))}</option>`)
    .join('');

$('#w-open').addEventListener('click', () => {
    // 3-й аргумент — размеры: без него браузер откроет вкладку, а не отдельное окно
    child = window.open('child.html', 'behoof-order', 'width=520,height=640,left=120,top=80');
    if (!child) {
        $('#w-out').textContent = 'Браузер заблокировал всплывающее окно — разрешите pop-up для этой страницы.';
        return;
    }
    $('#w-out').textContent = 'Окно открыто, ждём, пока оно загрузится…';
});

$('#w-close').addEventListener('click', () => {
    if (child && !child.closed) {
        child.close();
        $('#w-out').textContent = 'Дочернее окно закрыто методом child.close(). child.closed = ' + child.closed;
    } else {
        $('#w-out').textContent = 'Дочернее окно не открыто.';
    }
});

// Сообщения из дочернего окна
window.addEventListener('message', (e) => {
    if (!child || e.source !== child) return; // принимаем только от «своего» окна
    const msg = e.data;
    if (msg.type === 'ready') {
        // Окно загрузилось — отправляем ему данные заказа
        const product = products.find((p) => p.id === +$('#w-product').value);
        child.postMessage({ type: 'order', customer: $('#w-customer').value, product }, TARGET_ORIGIN);
        $('#w-out').textContent = `→ Отправлено в окно «${child.name}»: ${product.name}, покупатель ${$('#w-customer').value}`;
    }
    if (msg.type === 'reply') {
        $('#w-out').textContent +=
            `\n← Ответ из окна: доставка — ${msg.delivery}, комментарий — «${msg.comment || 'нет'}»` +
            `\n   Заказ подтверждён ${msg.time}`;
        toast('Заказ подтверждён в дочернем окне');
    }
});

/* ---------- Пример 3. Таймер на странице, переход, обновление ---------- */
const startedAt = Date.now();
function tick() {
    const s = Math.floor((Date.now() - startedAt) / 1000);
    $('#w-timer').textContent = `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
setInterval(tick, 1000); // каждую секунду

$('#w-go').addEventListener('click', () => {
    window.open('../pr1/index.html', '_blank'); // новая вкладка — таймер здесь продолжит идти
});
$('#w-reload').addEventListener('click', () => location.reload());

let promoTimer = null;
$('#w-promo').addEventListener('click', () => {
    clearTimeout(promoTimer);
    $('#w-timer-out').textContent = 'setTimeout запущен: уведомление через 3 секунды…';
    promoTimer = setTimeout(() => {
        toast('🔥 Только сегодня: −20% на умные колонки!');
        $('#w-timer-out').textContent = 'Уведомление показано (сработал setTimeout).';
    }, 3000);
});
$('#w-promo-cancel').addEventListener('click', () => {
    clearTimeout(promoTimer);
    $('#w-timer-out').textContent = 'clearTimeout: уведомление отменено.';
});

/* ---------- Пример 3.1. Размеры окна и диалоги ---------- */
function showSize() {
    fillTable($('#w-size'), [
        ['innerWidth × innerHeight', `${innerWidth} × ${innerHeight} px`],
        ['outerWidth × outerHeight', `${outerWidth} × ${outerHeight} px`],
        ['screenX, screenY', `${screenX}, ${screenY}`],
        ['scrollY', `${Math.round(scrollY)} px`],
        ['devicePixelRatio', devicePixelRatio],
    ]);
}
showSize();
window.addEventListener('resize', showSize);
window.addEventListener('scroll', showSize, { passive: true });

$('#w-confirm').addEventListener('click', () => {
    const yes = confirm('Подписаться на рассылку скидок Behoof?');
    $('#w-dialog-out').textContent = `confirm() вернул ${yes} → ${yes ? 'подписка оформлена' : 'подписка отменена'}`;
});
$('#w-prompt').addEventListener('click', () => {
    const city = prompt('В каком городе вы живёте?', 'Москва');
    $('#w-dialog-out').textContent =
        city === null ? 'prompt() вернул null — нажата «Отмена»' : `prompt() вернул «${city}» → цены для города ${city}`;
});
$('#w-top').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
