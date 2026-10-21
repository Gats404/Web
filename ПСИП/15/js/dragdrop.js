// dragdrop.js — ЛР 15, Drag & Drop: перетаскивание карточки товара в корзину или избранное.
// Порядок событий: dragstart (источник) → dragenter / dragover / dragleave (цель) → drop (цель) → dragend (источник).

(() => {
    const grid = document.getElementById('grid');
    const dock = document.getElementById('drop-dock');
    const zones = [...document.querySelectorAll('.drop-zone'), document.getElementById('cart-btn')];
    let dragged = null;

    grid.addEventListener('dragstart', (e) => {
        dragged = e.target.closest('.product-card');
        if (!dragged) return;
        e.dataTransfer.setData('text/plain', dragged.dataset.id); // что переносим
        e.dataTransfer.effectAllowed = 'copy';
        dragged.classList.add('is-dragging');
        dock.classList.add('is-visible'); // показываем зоны сброса
        EventLog.add('dragstart', `берём «${Shop.byId(dragged.dataset.id).name}»`);
    });

    grid.addEventListener('dragend', (e) => {
        dragged?.classList.remove('is-dragging');
        dock.classList.remove('is-visible');
        EventLog.add('dragend', `dropEffect=${e.dataTransfer.dropEffect}`);
        dragged = null;
    });

    for (const zone of zones) {
        zone.addEventListener('dragenter', (e) => {
            e.preventDefault();
            zone.classList.add('is-over');
            EventLog.add('dragenter', zone.dataset.zone || 'cart-btn');
        });
        zone.addEventListener('dragover', (e) => {
            e.preventDefault(); // без этого drop не сработает: по умолчанию сброс запрещён
            e.dataTransfer.dropEffect = 'copy';
            EventLog.add('dragover', `над зоной ${zone.dataset.zone || 'cart-btn'}`, 700);
        });
        zone.addEventListener('dragleave', (e) => {
            if (zone.contains(e.relatedTarget)) return; // ушли на дочерний элемент — это не выход
            zone.classList.remove('is-over');
            EventLog.add('dragleave', zone.dataset.zone || 'cart-btn');
        });
        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.classList.remove('is-over');
            const id = e.dataTransfer.getData('text/plain');
            if (!id) return;
            if (zone.dataset.zone === 'fav') Shop.toggleFav(id, true);
            else Shop.addToCart(id, grid.querySelector(`[data-id="${id}"] img`));
            EventLog.add('drop', `«${Shop.byId(id).name}» → ${zone.dataset.zone === 'fav' ? 'избранное' : 'корзина'}`);
        });
    }
})();
