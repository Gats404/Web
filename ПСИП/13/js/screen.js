// screen.js — ЛР 13, объект screen: дашборд параметров экрана, тип устройства, подстройка под экран.

(() => {
    const { $, fillTable } = Behoof;

    /* ---------- Пример 5. Дашборд характеристик экрана ---------- */
    function dashboard() {
        const o = screen.orientation;
        fillTable($('#s-table'), [
            ['screen.width × height', `${screen.width} × ${screen.height} px`],
            ['availWidth × availHeight', `${screen.availWidth} × ${screen.availHeight} px`],
            ['Панель задач / док', `${screen.height - screen.availHeight} px`],
            ['colorDepth / pixelDepth', `${screen.colorDepth} / ${screen.pixelDepth} бит`],
            ['orientation.type', o ? `${o.type} (${o.angle}°)` : 'не поддерживается'],
            ['devicePixelRatio', devicePixelRatio],
            ['Физическое разрешение', `${Math.round(screen.width * devicePixelRatio)} × ${Math.round(screen.height * devicePixelRatio)} px`],
            ['Соотношение сторон', aspect(screen.width, screen.height)],
            ['isExtended (2+ монитора)', 'isExtended' in screen ? (screen.isExtended ? 'да' : 'нет') : 'не поддерживается'],
        ], ['Параметр', 'Значение']);

        // Схема: экран → доступная область → окно браузера (в масштабе)
        const k = 260 / screen.width;
        const viz = $('#s-viz');
        Object.assign(viz.querySelector('.screen-viz__screen').style, { width: screen.width * k + 'px', height: screen.height * k + 'px' });
        Object.assign(viz.querySelector('.screen-viz__avail').style, { width: screen.availWidth * k + 'px', height: screen.availHeight * k + 'px' });
        Object.assign(viz.querySelector('.screen-viz__win').style, {
            width: Math.min(outerWidth, screen.availWidth) * k + 'px',
            height: Math.min(outerHeight, screen.availHeight) * k + 'px',
            left: Math.max(0, screenX) * k + 'px',
            top: Math.max(0, screenY) * k + 'px',
        });
    }
    function aspect(w, h) {
        const gcd = (a, b) => (b ? gcd(b, a % b) : a);
        const g = gcd(w, h);
        return `${w / g}:${h / g} (${(w / h).toFixed(2)})`;
    }

    /* ---------- Пример 6. Тип устройства по screen + navigator ---------- */
    function detectDevice() {
        const ua = navigator.userAgent;
        const w = Math.min(screen.width, innerWidth); // окно может быть уже экрана
        const touch = navigator.maxTouchPoints > 0;
        const reasons = [`ширина экрана ${screen.width}px, окна ${innerWidth}px`, `точек касания: ${navigator.maxTouchPoints}`];
        let type;
        if (/iPhone|Android.+Mobile|Mobi/i.test(ua)) {
            type = 'phone';
            reasons.push('userAgent содержит признак мобильного телефона');
        } else if (/iPad|Tablet|Android/i.test(ua) || (/Macintosh/.test(ua) && touch)) {
            type = 'tablet';
            reasons.push('userAgent указывает на планшет');
        } else if (w < 768) {
            type = 'phone';
            reasons.push('userAgent настольный, но ширина < 768px — показываем мобильную версию');
        } else if (w < 1024 && touch) {
            type = 'tablet';
            reasons.push('ширина 768–1023px и сенсорный экран');
        } else {
            type = 'desktop';
            reasons.push('userAgent настольный и ширина ≥ 768px');
        }
        const view = {
            desktop: ['🖥️', 'Десктоп', 'Доступна полная версия каталога со сравнением товаров.'],
            tablet: ['📱', 'Планшет', 'Включена планшетная раскладка: 2 колонки и крупные кнопки.'],
            phone: ['📲', 'Телефон', 'Рекомендуем приложение Behoof: так удобнее следить за ценами.'],
        }[type];
        $('#s-device').innerHTML =
            `<div class="device device--${type}"><span class="device__icon">${view[0]}</span>` +
            `<div><b>${view[1]}</b>${view[2]}</div></div>`;
        $('#s-reasons').innerHTML = reasons.map((r) => `<li>${r}</li>`).join('');
    }

    /* ---------- Пример 5.1. Подстройка магазина под экран ---------- */
    function adapt() {
        const physical = screen.width * devicePixelRatio;
        const banner = [640, 1280, 1920, 2560, 3840].find((s) => s >= physical) || 3840;
        const columns = Math.max(1, Math.min(6, Math.floor((screen.availWidth - 40) / 230)));
        fillTable($('#s-adapt'), [
            ['Баннер для загрузки', `banner-${banner}w.webp (экран ${Math.round(physical)}px)`],
            ['Колонок каталога', `${columns} (availWidth ${screen.availWidth}px / 230px на карточку)`],
            ['Цветопередача', screen.colorDepth >= 30 ? 'HDR-фото товаров' : 'обычные sRGB-фото'],
            ['Ориентация', screen.orientation?.type.startsWith('portrait') ? 'портретная — карточки в 1 столбец' : 'альбомная — сетка'],
        ], ['Решение', 'Почему']);
    }

    function update() {
        dashboard();
        detectDevice();
        adapt();
    }
    update();
    window.addEventListener('resize', update);
    screen.orientation?.addEventListener('change', update);
})();
