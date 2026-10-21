// touch.js — ЛР 15, события сенсорного экрана: свайп промо-слайдера пальцем.
// touchstart — палец коснулся, touchmove — ведём, touchend — отпустили. Координаты — в e.touches / e.changedTouches.

const Slider = (() => {
    const slider = document.getElementById('slider');
    const track = document.getElementById('slider-track');
    const dotsBox = document.getElementById('slider-dots');
    const count = track.children.length;
    let index = 0;
    let startX = 0, startY = 0, dx = 0, swiping = false;

    dotsBox.innerHTML = [...Array(count)].map((_, i) => `<button data-i="${i}" aria-label="Слайд ${i + 1}"></button>`).join('');

    function go(i) {
        index = (i + count) % count;
        track.style.transform = `translateX(-${index * 100}%)`;
        dotsBox.querySelectorAll('button').forEach((b, n) => b.classList.toggle('is-active', n === index));
    }

    slider.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        dx = 0;
        swiping = true;
        track.classList.add('is-dragging'); // без плавности — слайд идёт ровно за пальцем
        EventLog.add('touchstart', `касаний: ${e.touches.length}, x=${Math.round(startX)}`);
    }, { passive: true });

    slider.addEventListener('touchmove', (e) => {
        if (!swiping) return;
        const t = e.touches[0];
        dx = t.clientX - startX;
        if (Math.abs(t.clientY - startY) > Math.abs(dx)) return; // вертикальный жест — это прокрутка страницы
        track.style.transform = `translateX(calc(-${index * 100}% + ${dx}px))`;
        EventLog.add('touchmove', `сдвиг ${Math.round(dx)}px`, 200);
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        if (!swiping) return;
        swiping = false;
        track.classList.remove('is-dragging');
        const endX = e.changedTouches[0].clientX; // в touches отпущенного пальца уже нет
        dx = endX - startX;
        if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1)); // свайп влево → следующий слайд
        else go(index); // короткое движение — возвращаемся
        EventLog.add('touchend', `dx=${Math.round(dx)}px → слайд ${index + 1} из ${count}`);
    });
    slider.addEventListener('touchcancel', () => {
        swiping = false;
        track.classList.remove('is-dragging');
        go(index);
    });

    // Кнопки и точки — для мыши
    document.getElementById('slide-prev').addEventListener('click', () => go(index - 1));
    document.getElementById('slide-next').addEventListener('click', () => go(index + 1));
    dotsBox.addEventListener('click', (e) => e.target.dataset.i && go(+e.target.dataset.i));

    go(0);
    return { next: () => go(index + 1), get index() { return index; }, element: slider };
})();
