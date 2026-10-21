// form-data.js — ЛР 18, задание 1: получение данных из полей формы заказа и вывод на страницу / в диалог.

(() => {
    const { $, $$, rub, finalPrice, fillTable, esc } = Behoof;
    const form = document.forms.order; // доступ к форме по имени через коллекцию document.forms
    const products = window.BEHOOF_PRODUCTS;

    // Список товаров с группами <optgroup>
    const groups = { smartphone: 'Смартфоны', speaker: 'Умные колонки' };
    $('#order-product').innerHTML = Object.entries(groups)
        .map(([cat, label]) => `<optgroup label="${label}">` +
            products.filter((p) => p.category === cat && p.inStock)
                .map((p) => `<option value="${p.id}">${esc(p.name)} — ${rub(finalPrice(p))}</option>`).join('') + '</optgroup>')
        .join('');

    // Дата доставки: не раньше завтрашнего дня
    const day = (offset) => {
        const d = new Date();
        d.setDate(d.getDate() + offset);
        return d.toISOString().slice(0, 10);
    };
    form.elements.date.min = day(1);
    form.elements.date.value = day(2);

    $('#order-example').addEventListener('click', () => {
        const el = form.elements;
        el.fio.value = 'Иванов Иван Иванович';
        el.phone.value = '+7 900 123-45-67';
        el.email.value = 'ivanov@example.com';
        el.city.value = 'Москва';
        el.product.value = '5';
        el.qty.value = 2;
        el.delivery.value = 'Пункт выдачи'; // RadioNodeList: выбирает нужный переключатель
        el.extras.forEach((cb) => (cb.checked = cb.value !== 'Настройка устройства'));
        [...el.accessories.options].forEach((o) => (o.selected = ['Чехол', 'Защитное стекло'].includes(o.text)));
        el.comment.value = 'Позвонить за час до доставки';
    });

    // Сбор данных тремя способами
    function collect() {
        const el = form.elements;
        // 1) form.elements: каждое поле по имени
        const product = products.find((p) => p.id === Number(el.product.value));
        const qty = el.qty.valueAsNumber || 1;
        // 2) FormData: удобно для нескольких флажков / множественного списка — getAll()
        const fd = new FormData(form);
        // 3) querySelectorAll(':checked') и selectedOptions
        const extras = $$('[name=extras]:checked', form).map((cb) => cb.value);
        const accessories = [...el.accessories.selectedOptions].map((o) => o.text);

        const deliveryCost = el.delivery.value === 'Курьер' ? 390 : 0;
        return {
            fio: el.fio.value.trim(),
            phone: el.phone.value.trim(),
            email: el.email.value.trim(),
            city: el.city.value,
            product: product.name,
            price: finalPrice(product),
            qty,
            date: el.date.value ? new Date(el.date.value).toLocaleDateString('ru-RU') : '',
            delivery: fd.get('delivery'),
            extras: fd.getAll('extras'),
            extrasChecked: extras, // то же самое, но через :checked
            accessories,
            comment: fd.get('comment').trim(),
            news: el.news.checked,
            total: finalPrice(product) * qty + deliveryCost,
        };
    }

    function show(data) {
        fillTable($('#order-table'), [
            ['fio.value', data.fio || '—'],
            ['phone.value', data.phone || '—'],
            ['email.value', data.email || '—'],
            ['city.value (select)', data.city],
            ['product (optgroup)', `${data.product} — ${rub(data.price)}`],
            ['qty.valueAsNumber', data.qty],
            ['date.value', data.date || '—'],
            ["fd.get('delivery') (radio)", data.delivery],
            ["fd.getAll('extras') (checkbox)", data.extras.join(', ') || 'нет'],
            ['selectedOptions (multiple)', data.accessories.join(', ') || 'нет'],
            ['comment (textarea)', data.comment || '—'],
            ['news.checked', data.news ? 'да' : 'нет'],
            ['Итого', rub(data.total)],
        ], ['Поле → способ чтения', 'Значение']);
        $('#order-json').textContent = 'JSON.stringify(data):\n' + JSON.stringify(data, null, 2);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // не перезагружать страницу
        const data = collect();
        show(data);
        $('#dialog-out').textContent =
            `${data.fio || 'Покупатель'}, спасибо!\n${data.product} × ${data.qty}\n` +
            `Доставка: ${data.delivery}, ${data.city}, ${data.date}\n` +
            (data.extras.length ? `Дополнительно: ${data.extras.join(', ')}\n` : '') +
            `К оплате: ${rub(data.total)}`;
        $('#order-dialog').showModal(); // диалоговое окно <dialog>
    });

    $('#order-alert').addEventListener('click', () => {
        const d = collect();
        show(d);
        alert(`Заказ: ${d.product} × ${d.qty}\nДоставка: ${d.delivery}\nИтого: ${rub(d.total)}`); // стандартное окно alert
    });

    form.addEventListener('reset', () => setTimeout(() => {
        form.elements.date.value = day(2);
        $('#order-table').innerHTML = '';
        $('#order-json').textContent = '';
    }));
})();
