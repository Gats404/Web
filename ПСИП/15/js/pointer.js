// pointer.js — ЛР 15, события указателя: ползунок «Цена до».
// Pointer Events объединяют мышь, палец и перо: один код для всех устройств (e.pointerType).

const PriceRange = (() => {
    const MIN = 5000, MAX = 90000, STEP = 1000;
    const track = document.getElementById('range-track');
    const thumb = document.getElementById('range-thumb');
    const fill = document.getElementById('range-fill');
    const label = document.getElementById('range-value');
    let value = MAX;
    let dragging = false;

    function set(v, notify = true) {
        value = Math.min(MAX, Math.max(MIN, Math.round(v / STEP) * STEP));
        const pct = ((value - MIN) / (MAX - MIN)) * 100;
        thumb.style.left = pct + '%';
        fill.style.width = pct + '%';
        label.textContent = Behoof.rub(value);
        if (notify) Shop.setMaxPrice(value);
    }
    const fromX = (clientX) => {
        const r = track.getBoundingClientRect();
        return MIN + ((clientX - r.left) / r.width) * (MAX - MIN);
    };

    track.addEventListener('pointerdown', (e) => {
        dragging = true;
        // Захват указателя: pointermove будет приходить, даже если курсор/палец уйдёт с ползунка
        track.setPointerCapture(e.pointerId);
        thumb.classList.add('is-active');
        set(fromX(e.clientX));
        EventLog.add('pointerdown', `pointerType=${e.pointerType}, id=${e.pointerId}, pressure=${e.pressure.toFixed(2)}`);
    });
    track.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        set(fromX(e.clientX));
        EventLog.add('pointermove', `x=${Math.round(e.clientX)} → ${Behoof.rub(value)}`, 250);
    });
    const stop = (e) => {
        if (!dragging) return;
        dragging = false;
        thumb.classList.remove('is-active');
        EventLog.add(e.type, `итог: цена до ${Behoof.rub(value)}`);
    };
    track.addEventListener('pointerup', stop);
    track.addEventListener('pointercancel', stop); // например, браузер забрал жест себе

    // Доступность: ползунок управляется и стрелками клавиатуры
    thumb.addEventListener('keydown', (e) => {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        set(value + (e.key === 'ArrowRight' ? STEP * 5 : -STEP * 5));
        EventLog.add('keydown', `${e.key} → ${Behoof.rub(value)}`);
    });

    set(MAX, false);
    return { set };
})();
