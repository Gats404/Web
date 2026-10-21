// timers.js — ЛР 15, события, связанные с таймером: обратный отсчёт акции, печатная машинка,
// автосмена слайдов, анимация счётчиков. setInterval — повтор, setTimeout — однократный вызов.

/* Анимация числа от 0 до data-count за ~1.2 с (вызывается из scroll.js) */
function countUp(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const steps = 40;
    let step = 0;
    const id = setInterval(() => {
        step++;
        const v = Math.round((target * step) / steps);
        el.textContent = (target >= 1e6 ? (v / 1e6).toFixed(1).replace('.0', '') + ' млн' : v.toLocaleString('ru-RU')) + suffix;
        if (step >= steps) clearInterval(id); // остановить повторы
    }, 30);
}

(() => {
    /* 1. Обратный отсчёт до конца дня — setInterval раз в секунду */
    const out = document.getElementById('countdown');
    function tick() {
        const now = new Date();
        const end = new Date(now);
        end.setHours(23, 59, 59, 999);
        const s = Math.max(0, Math.floor((end - now) / 1000));
        const pad = (n) => String(n).padStart(2, '0');
        out.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
    }
    tick();
    setInterval(tick, 1000);
    EventLog.add('setInterval', 'обратный отсчёт акции запущен (1000 мс)');

    /* 2. Печатная машинка — цепочка setTimeout: печатаем, ждём, стираем, следующая фраза */
    const phrases = ['Найди, сравни, выбери лучшую цену на электронику', 'Смартфоны от 8 192 ₽', 'Умные колонки со скидкой до 20%'];
    const el = document.getElementById('typewriter');
    let p = 0, i = 0, erasing = false;
    function type() {
        const text = phrases[p];
        i += erasing ? -1 : 1;
        el.textContent = text.slice(0, i);
        let delay = erasing ? 25 : 55;
        if (!erasing && i === text.length) {
            delay = 2200; // фраза напечатана — пауза
            erasing = true;
        } else if (erasing && i === 0) {
            erasing = false;
            p = (p + 1) % phrases.length;
            delay = 400;
        }
        setTimeout(type, delay);
    }
    setTimeout(type, 600);

    /* 3. Автосмена слайдов каждые 5 секунд, пауза при наведении и касании */
    let auto = null;
    const start = () => {
        clearInterval(auto);
        auto = setInterval(() => {
            Slider.next();
            EventLog.add('setInterval', `автосмена → слайд ${Slider.index + 1}`);
        }, 5000);
    };
    const stop = () => clearInterval(auto);
    Slider.element.addEventListener('mouseenter', stop);
    Slider.element.addEventListener('mouseleave', start);
    Slider.element.addEventListener('touchstart', stop, { passive: true });
    Slider.element.addEventListener('touchend', () => setTimeout(start, 3000));
    start();

    /* 4. Уведомление-подсказка через 4 секунды после загрузки — однократный setTimeout */
    setTimeout(() => {
        Behoof.toast('💡 Перетащите товар мышью прямо в корзину!', 4000);
        EventLog.add('setTimeout', 'подсказка показана через 4000 мс');
    }, 4000);
})();
