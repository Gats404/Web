// scroll.js — ЛР 15, события прокрутки: прогресс-бар, компактная шапка, кнопка «Наверх»,
// автоподгрузка товаров («бесконечная лента») и запуск счётчиков статистики.

(() => {
    const progress = document.getElementById('progress');
    const header = document.getElementById('header');
    const toTop = document.getElementById('to-top');
    const more = document.getElementById('more');
    const stats = document.getElementById('about');
    let ticking = false;
    let countersStarted = false;

    function onScroll() {
        const max = document.documentElement.scrollHeight - innerHeight;
        const pct = max > 0 ? (scrollY / max) * 100 : 0;
        progress.style.width = pct + '%';
        header.classList.toggle('is-compact', scrollY > 60);
        toTop.classList.toggle('is-visible', scrollY > 600);

        // Низ каталога показался на экране → подгружаем следующую порцию товаров
        if (more.getBoundingClientRect().top < innerHeight + 80 && Shop.loadMore()) {
            EventLog.add('scroll', `подгружены товары (scrollY=${Math.round(scrollY)})`);
        }
        // Блок статистики появился → запускаем счётчики (один раз)
        if (!countersStarted && stats.getBoundingClientRect().top < innerHeight * 0.85) {
            countersStarted = true;
            stats.querySelectorAll('[data-count]').forEach((el) => countUp(el)); // из timers.js
            EventLog.add('scroll', 'блок статистики на экране → счётчики');
        }
        EventLog.add('scroll', `scrollY=${Math.round(scrollY)}px, прочитано ${Math.round(pct)}%`, 600);
        ticking = false;
    }

    // scroll срабатывает десятки раз в секунду — обрабатываем не чаще одного раза за кадр
    window.addEventListener('scroll', () => {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    window.addEventListener('load', onScroll); // если страница открылась уже прокрученной

    toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        EventLog.add('click', 'кнопка «Наверх»');
    });
})();
