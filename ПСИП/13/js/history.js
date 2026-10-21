// history.js — ЛР 13, объект history: переходы, состояния одной страницы (pushState/popstate), replaceState.

(() => {
    const { $, $$ } = Behoof;

    /* ---------- Пример 1. Переходы по истории ---------- */
    const showLength = () => ($('#h-length').textContent = history.length);
    showLength();
    $('#h-back').addEventListener('click', () => history.back());
    $('#h-forward').addEventListener('click', () => history.forward());
    $('#h-go').addEventListener('click', () => history.go(-2));

    /* ---------- Пример 4 и 3. Состояние страницы: шаг заказа + вкладка товара ---------- */
    const STEPS = {
        1: '🛒 В корзине 2 товара: Samsung Galaxy A54 5G и Яндекс Станция Мини 2 — на сумму 37 782 ₽.',
        2: '🚚 Доставка курьером завтра с 10:00 до 14:00, Москва, ул. Примерная, 1.',
        3: '💳 Оплата картой онлайн или при получении. После оплаты придёт SMS с номером заказа.',
    };
    const TABS = {
        desc: 'Samsung Galaxy A54 5G — смартфон с AMOLED-экраном 120 Гц и защитой IP67.',
        specs: 'Экран 6.4", 8/256 ГБ, камера 50 Мп, аккумулятор 5000 мА·ч, 5G, NFC.',
        reviews: '★★★★★ «Отличный экран и камера» — Алексей · ★★★★☆ «Батареи хватает на день» — Мария',
    };

    // Текущее состояние хранится в history.state, а для наглядности — и в hash адреса
    const state = { step: 1, tab: 'desc' };
    const urlFor = (s) => `#step=${s.step}&tab=${s.tab}`;

    function render() {
        $$('#h-steps li').forEach((li) => {
            const n = +li.dataset.step;
            li.classList.toggle('is-active', n === state.step);
            li.classList.toggle('is-done', n < state.step);
        });
        $('#h-step-body').textContent = STEPS[state.step];
        $('#h-next').textContent = state.step === 3 ? 'Оформить ✓' : 'Далее →';
        $$('#h-tabs button').forEach((b) => b.classList.toggle('is-active', b.dataset.tab === state.tab));
        $('#h-tab-body').textContent = TABS[state.tab];
        $('#h-state').textContent = `history.state = ${JSON.stringify(history.state)}\nhistory.length = ${history.length}`;
        showLength();
    }

    // Восстановление при загрузке: из history.state (обновили страницу) или из hash (открыли по ссылке)
    const fromHash = Object.fromEntries(new URLSearchParams(location.hash.slice(1)));
    if (history.state?.step) Object.assign(state, history.state);
    else if (STEPS[fromHash.step]) Object.assign(state, { step: +fromHash.step, tab: TABS[fromHash.tab] ? fromHash.tab : 'desc' });
    history.replaceState({ ...state }, ''); // привязываем состояние к текущей записи, URL не меняется
    render();

    $('#h-next').addEventListener('click', () => {
        if (state.step === 3) return Behoof.toast('Заказ оформлен! (демо)');
        state.step++;
        history.pushState({ ...state }, '', urlFor(state)); // НОВАЯ запись в истории
        render();
    });
    $('#h-prev').addEventListener('click', () => history.back());

    // «Назад»/«Вперёд» в браузере или history.back()/forward() → событие popstate
    window.addEventListener('popstate', (e) => {
        if (e.state?.step) Object.assign(state, e.state);
        else Object.assign(state, { step: 1, tab: 'desc' });
        render();
    });

    $('#h-tabs').addEventListener('click', (e) => {
        const tab = e.target.dataset.tab;
        if (!tab) return;
        state.tab = tab;
        history.replaceState({ ...state }, '', urlFor(state)); // ЗАМЕНА записи: length не растёт
        render();
    });
})();
