// edit.js — ЛР 14, раздел 4: создание, добавление, замена, удаление элементов и управление атрибутами.

(() => {
    const { $, $$, rub, fillTable } = Behoof;
    const shelf = $('#my-shelf');
    let selected = null; // карточка, выбранная для работы с атрибутами
    let counter = 0;

    /* ---------- 4.1. Создание карточки через createElement ---------- */
    function createCard({ title, price, discount, image }) {
        const card = document.createElement('article'); // новый узел, пока вне документа
        card.className = 'p-card';
        card.id = `my-card-${++counter}`;
        card.setAttribute('data-price', price);
        card.dataset.discount = discount; // то же самое, что setAttribute('data-discount', …)

        const imgBox = document.createElement('div');
        imgBox.className = 'p-card__img';
        const img = document.createElement('img');
        img.src = `../assets/img/${image}`;
        img.alt = title;
        imgBox.append(img);

        const badge = document.createElement('span');
        badge.className = 'p-card__badge';
        badge.textContent = `−${discount}%`;

        const h4 = document.createElement('h4');
        h4.className = 'p-card__title';
        h4.textContent = title; // textContent безопасен: HTML-теги не выполнятся

        const priceEl = document.createElement('div');
        priceEl.className = 'p-card__price';
        priceEl.textContent = rub(price * (1 - discount / 100));

        const actions = document.createElement('div');
        actions.className = 'p-card__actions';
        actions.innerHTML = '<button type="button" data-act="replace">Продано</button><button type="button" data-act="remove">Удалить</button>';

        card.append(imgBox, badge, h4, priceEl, actions); // сразу несколько потомков
        return card;
    }

    $('#builder').addEventListener('click', (e) => {
        const place = e.target.dataset.place;
        if (!place) return;
        e.preventDefault();
        const form = $('#builder');
        if (!form.reportValidity()) return;
        const data = Object.fromEntries(new FormData(form));
        if (place === 'append') shelf.append(createCard(data)); // в конец
        if (place === 'prepend') shelf.prepend(createCard(data)); // в начало
        if (place === 'clone') {
            // глубокая копия первой карточки витрины вместе с потомками
            const copy = document.getElementById('card-3').cloneNode(true);
            copy.id = `my-card-${++counter}`;
            copy.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id')); // id должны быть уникальны
            copy.classList.remove('is-cursor', 'is-found');
            copy.insertAdjacentHTML('beforeend', '<div class="p-card__actions"><button type="button" data-act="replace">Продано</button><button type="button" data-act="remove">Удалить</button></div>');
            shelf.append(copy);
        }
        updateCount();
    });

    /* ---------- 4.2. Замена и удаление (делегирование событий) ---------- */
    shelf.addEventListener('click', (e) => {
        const card = e.target.closest('.p-card');
        const act = e.target.dataset.act;
        if (act === 'replace') {
            const sold = document.createElement('div');
            sold.className = 'sold';
            sold.textContent = 'Продано';
            card.replaceWith(sold); // узел заменён на новый
            if (card === selected) select(null);
        } else if (act === 'remove') {
            card.remove(); // узел удалён из документа
            if (card === selected) select(null);
        } else if (card) {
            select(card);
        }
        updateCount();
    });

    $('#shelf-clear').addEventListener('click', () => {
        // классический способ: пока есть первый потомок — удаляем его через родителя
        while (shelf.firstChild) shelf.removeChild(shelf.firstChild);
        select(null);
        updateCount();
    });

    function updateCount() {
        $('#shelf-count').textContent = `shelf.children.length = ${shelf.children.length}`;
    }

    /* ---------- 4.3. Атрибуты выбранной карточки ---------- */
    function select(card) {
        if (selected) selected.classList.remove('is-selected');
        selected = card;
        if (card) card.classList.add('is-selected');
        $('#attr-target').textContent = card ? `#${card.id}` : '—';
        showAttrs();
    }
    function showAttrs(note = '') {
        if (!selected) {
            $('#attr-table').innerHTML = '';
            $('#attr-out').textContent = 'Кликните по карточке в «Моей витрине».';
            return;
        }
        // el.attributes — коллекция всех атрибутов элемента
        fillTable($('#attr-table'), [...selected.attributes].map((a) => [a.name, a.value]), ['Атрибут', 'Значение']);
        $('#attr-out').textContent = (note ? note + '\n' : '') +
            `hasAttribute('data-hit') → ${selected.hasAttribute('data-hit')}\n` +
            `getAttribute('data-price') → ${selected.getAttribute('data-price')}\n` +
            `dataset → ${JSON.stringify({ ...selected.dataset })}`;
    }
    const need = (fn) => () => (selected ? fn() : showAttrs());

    $('#attr-hit').addEventListener('click', need(() => {
        selected.setAttribute('data-hit', 'true');
        showAttrs("setAttribute('data-hit', 'true') — CSS-правило [data-hit] показало значок «ХИТ»");
    }));
    $('#attr-unhit').addEventListener('click', need(() => {
        selected.removeAttribute('data-hit');
        showAttrs("removeAttribute('data-hit')");
    }));
    $('#attr-title').addEventListener('click', need(() => {
        selected.title = 'Наведите — это всплывающая подсказка из атрибута title';
        showAttrs('selected.title = … (свойство и атрибут title связаны)');
    }));
    $('#attr-img').addEventListener('click', need(() => {
        const img = selected.querySelector('img');
        const files = ['p1.png', 'p2.png', 'p3.png', 'p4.png', 'p5.png', 'p6.png'];
        const now = img.getAttribute('src').split('/').pop();
        const next = files[(files.indexOf(now) + 1) % files.length];
        img.setAttribute('src', `../assets/img/${next}`);
        showAttrs(`img.getAttribute('src'): ${now} → ${next}`);
    }));

    // Стартовое наполнение, чтобы витрина не была пустой
    shelf.append(createCard({ title: 'Xiaomi Redmi 10C', price: 9990, discount: 18, image: 'p1.png' }));
    shelf.append(createCard({ title: 'Sber SberBoom', price: 7990, discount: 20, image: 'p2.png' }));
    updateCount();
    showAttrs();
})();
