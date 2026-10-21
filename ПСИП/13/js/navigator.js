// navigator.js — ЛР 13, объект navigator: сведения о браузере, сеть, буфер обмена, язык, геолокация.

(() => {
    const { $, fillTable, toast } = Behoof;

    // Название браузера: современный userAgentData (Chromium) или разбор строки userAgent
    function browserName() {
        const brands = navigator.userAgentData?.brands?.filter((b) => !/Not.?A.?Brand|Chromium/i.test(b.brand));
        if (brands?.length) return brands.map((b) => `${b.brand} ${b.version}`).join(', ');
        const ua = navigator.userAgent;
        const m = ua.match(/(Edg|OPR|YaBrowser|Firefox|Chrome|Safari)\/([\d.]+)/);
        const names = { Edg: 'Microsoft Edge', OPR: 'Opera', YaBrowser: 'Яндекс Браузер' };
        return m ? `${names[m[1]] || m[1]} ${m[2].split('.')[0]}` : 'не определён';
    }

    /* ---------- Пример 2. Информация о браузере и системе ---------- */
    document.addEventListener('DOMContentLoaded', () => {
        fillTable($('#n-browser'), [
            ['Браузер', browserName()],
            ['userAgent', navigator.userAgent],
            ['platform', navigator.userAgentData?.platform || navigator.platform],
            ['language / languages', `${navigator.language} / ${navigator.languages.join(', ')}`],
            ['cookieEnabled', navigator.cookieEnabled ? 'да' : 'нет'],
            ['onLine', navigator.onLine ? 'да' : 'нет'],
            ['hardwareConcurrency', `${navigator.hardwareConcurrency} логических ядер`],
            ['deviceMemory', navigator.deviceMemory ? `≈ ${navigator.deviceMemory} ГБ` : 'не поддерживается'],
            ['maxTouchPoints', navigator.maxTouchPoints],
            ['pdfViewerEnabled', navigator.pdfViewerEnabled ? 'да' : 'нет'],
        ]);
        fillTable($('#n-screen'), [
            ['Разрешение экрана', `${screen.width} × ${screen.height}`],
            ['Доступная область', `${screen.availWidth} × ${screen.availHeight}`],
            ['Окно браузера', `${innerWidth} × ${innerHeight}`],
            ['Глубина цвета', `${screen.colorDepth} бит`],
            ['Плотность пикселей', `× ${devicePixelRatio}`],
        ], ['Экран', 'Значение']);
    });

    /* ---------- Пример 2.1. Онлайн / офлайн ---------- */
    function showNet(event) {
        const on = navigator.onLine;
        const net = $('#n-net');
        net.classList.toggle('is-off', !on);
        const c = navigator.connection; // Network Information API (есть не во всех браузерах)
        net.textContent = on ? `В сети${c ? ` · ${c.effectiveType}, ~${c.downlink} Мбит/с` : ''}` : 'Нет подключения';
        if (event) {
            $('#n-net-log').textContent += `${new Date().toLocaleTimeString('ru-RU')} — событие ${event.type}\n`;
            toast(on ? 'Соединение восстановлено' : 'Пропало соединение — корзина сохранится');
        }
    }
    showNet();
    window.addEventListener('online', showNet);
    window.addEventListener('offline', showNet);

    /* ---------- Пример 2.2. Буфер обмена, язык, геолокация ---------- */
    const greetings = { ru: 'Здравствуйте', en: 'Hello', de: 'Guten Tag', fr: 'Bonjour', be: 'Добры дзень' };
    const lang = navigator.language.slice(0, 2);
    $('#n-out').textContent = `navigator.language = «${navigator.language}» → ${greetings[lang] || greetings.en}!`;

    $('#n-copy').addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText('BEHOOF500');
            $('#n-out').textContent = 'Промокод BEHOOF500 скопирован в буфер обмена (navigator.clipboard.writeText).';
            toast('Промокод скопирован');
        } catch (err) {
            $('#n-out').textContent = `Буфер обмена недоступен: ${err.name}`;
        }
    });

    // Пункты выдачи заказов (координаты условные — центр Москвы)
    const points = [
        { name: 'ПВЗ «Тверская, 7»', lat: 55.7577, lon: 37.6131 },
        { name: 'ПВЗ «Арбат, 24»', lat: 55.7499, lon: 37.5925 },
        { name: 'ПВЗ «Новослободская, 16»', lat: 55.7801, lon: 37.5997 },
    ];
    // Расстояние по поверхности Земли (формула гаверсинусов), км
    function distanceKm(a, b) {
        const R = 6371, rad = (d) => (d * Math.PI) / 180;
        const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    }
    $('#n-geo').addEventListener('click', () => {
        if (!('geolocation' in navigator)) return ($('#n-out').textContent = 'Геолокация не поддерживается');
        $('#n-out').textContent = 'Запрашиваем координаты (браузер спросит разрешение)…';
        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const me = { lat: coords.latitude, lon: coords.longitude };
                const list = points.map((p) => ({ ...p, km: distanceKm(me, p) })).sort((a, b) => a.km - b.km);
                $('#n-out').textContent =
                    `Ваши координаты: ${me.lat.toFixed(4)}, ${me.lon.toFixed(4)} (±${Math.round(coords.accuracy)} м)\n` +
                    list.map((p, i) => `${i ? '  ' : '★ '}${p.name} — ${p.km.toFixed(1)} км`).join('\n');
            },
            (err) => ($('#n-out').textContent = `Не удалось определить местоположение (код ${err.code}): ${err.message}`),
            { timeout: 10000 }
        );
    });
})();
