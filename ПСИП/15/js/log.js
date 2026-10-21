// log.js — ЛР 15: журнал событий. Каждый сценарий сообщает сюда тип события и подробности,
// чтобы на защите было видно, какое событие сработало и что в нём пришло (объект Event).

const EventLog = (() => {
    const box = document.getElementById('event-log');
    const list = document.getElementById('log-list');
    const counter = document.getElementById('log-count');
    const lastTime = {}; // для частых событий (mousemove, scroll) — не чаще раза в N мс
    let total = 0;

    function add(type, detail = '', throttleMs = 0) {
        const now = performance.now();
        if (throttleMs && now - (lastTime[type] || 0) < throttleMs) return;
        lastTime[type] = now;
        const li = document.createElement('li');
        const time = new Date().toLocaleTimeString('ru-RU');
        li.innerHTML = `<i>${time}</i><b>${type}</b><span></span>`;
        li.querySelector('span').textContent = detail;
        list.prepend(li); // свежие сверху
        while (list.children.length > 40) list.lastElementChild.remove();
        counter.textContent = ++total;
    }

    document.getElementById('log-toggle').addEventListener('click', () => box.classList.toggle('is-open'));
    return { add };
})();
