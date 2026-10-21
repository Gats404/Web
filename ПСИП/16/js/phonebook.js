// phonebook.js — ЛР 16, задание 6: телефонный справочник сотрудников и партнёров Behoof.
// Хранилище — обычный объект-словарь { id: контакт }, поэтому в работе все изученные операции:
// создание объектов, методы с this, delete, in, hasOwnProperty, for…in, Object.entries, вложенные объекты.

const PhoneBook = {
    contacts: {}, // словарь контактов: ключ — id, значение — объект контакта
    nextId: 1,
    depts: { sales: 'Продажи', support: 'Поддержка', delivery: 'Доставка', partners: 'Партнёры' },

    add({ name, dept, mobile, work, email, city }) {
        const id = 'c' + this.nextId++;
        this.contacts[id] = {
            id,
            name: name.trim(),
            dept,
            phones: { mobile, work: work || null }, // вложенный объект
            email: email || null,
            address: { city: city || 'Москва' }, // ещё один вложенный объект
            added: Date.now() + this.nextId, // + id, чтобы порядок был стабильным при одинаковом времени
        };
        return this.contacts[id];
    },

    update(id, data) {
        if (!(id in this.contacts)) throw new Error(`Контакта ${id} нет`);
        const c = this.contacts[id];
        c.name = data.name.trim();
        c.dept = data.dept;
        Object.assign(c.phones, { mobile: data.mobile, work: data.work || null });
        c.email = data.email || null;
        c.address.city = data.city || c.address.city;
        return c;
    },

    remove(id) {
        if (!this.contacts.hasOwnProperty(id)) return false;
        return delete this.contacts[id]; // удаляем свойство-контакт из словаря
    },

    has(id) {
        return id in this.contacts;
    },

    // Поиск по имени, телефонам и email (обход вложенного объекта phones через Object.values)
    search(query) {
        const q = query.trim().toLowerCase();
        const digits = q.replace(/\D/g, '');
        return Object.values(this.contacts).filter((c) =>
            !q ||
            c.name.toLowerCase().includes(q) ||
            (c.email || '').toLowerCase().includes(q) ||
            (digits.length >= 3 && Object.values(c.phones).some((p) => p && p.replace(/\D/g, '').includes(digits))));
    },

    groupByDept(list) {
        const groups = {};
        for (const c of list) (groups[c.dept] ??= []).push(c);
        return groups;
    },

    stats() {
        const byDept = {};
        let withWork = 0;
        for (const id in this.contacts) {
            const c = this.contacts[id];
            byDept[c.dept] = (byDept[c.dept] || 0) + 1;
            if (c.phones.work) withWork++;
        }
        return { total: Object.keys(this.contacts).length, byDept, withWork };
    },
};

(() => {
    const { $, esc, toast } = Behoof;
    const form = $('#pb-form');
    const logBox = $('#pb-log');
    let fresh = null; // id только что добавленного контакта (для анимации)

    const log = (line) => {
        logBox.textContent = `${new Date().toLocaleTimeString('ru-RU')}  ${line}\n` + logBox.textContent;
        console.log(line);
    };

    // Стартовые данные справочника (вымышленные сотрудники магазина)
    [
        { name: 'Смирнова Анна', dept: 'sales', mobile: '+7 900 111-22-33', work: '+7 495 000-00-00, доб. 101', email: 'a.smirnova@behoof.ru', city: 'Москва' },
        { name: 'Козлов Дмитрий', dept: 'sales', mobile: '+7 900 222-33-44', work: '', email: 'd.kozlov@behoof.ru', city: 'Москва' },
        { name: 'Орлова Мария', dept: 'support', mobile: '+7 900 333-44-55', work: '+7 495 000-00-00, доб. 200', email: 'help@behoof.ru', city: 'Казань' },
        { name: 'Волков Сергей', dept: 'delivery', mobile: '+7 900 444-55-66', work: '', email: 'logistics@behoof.ru', city: 'Москва' },
        { name: 'ООО «ТехноСклад»', dept: 'partners', mobile: '+7 900 555-66-77', work: '+7 812 000-00-00', email: 'opt@example.com', city: 'Санкт-Петербург' },
        { name: 'Лебедева Ольга', dept: 'support', mobile: '+7 900 666-77-88', work: '', email: 'o.lebedeva@behoof.ru', city: 'Москва' },
    ].forEach((c) => PhoneBook.add(c));
    log(`Загружено контактов: ${Object.keys(PhoneBook.contacts).length} → Object.keys(PhoneBook.contacts)`);

    function render() {
        const q = $('#pb-search').value;
        const list = PhoneBook.search(q);
        const sort = $('#pb-sort').value;
        list.sort((a, b) => (sort === 'added' ? b.added - a.added : sort === 'dept' ? a.dept.localeCompare(b.dept) : a.name.localeCompare(b.name, 'ru')));
        const mark = (s) => (q.trim() ? esc(s).replace(new RegExp(esc(q.trim()).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig'), (m) => `<mark>${m}</mark>`) : esc(s));

        const groups = PhoneBook.groupByDept(list);
        $('#pb-list').innerHTML = Object.keys(groups).length
            ? Object.entries(groups)
                  .map(([dept, items]) => `
                    <div class="group"><h4>${PhoneBook.depts[dept]} · ${items.length}</h4><div class="contacts">
                    ${items.map((c) => `
                        <article class="contact ${c.id === fresh ? 'is-new' : ''}">
                            <div class="contact__head"><span class="avatar">${esc(c.name.replace(/[«»"]/g, '').trim()[0])}</span>
                                <div><div class="contact__name">${mark(c.name)}</div><div class="contact__meta">${c.id} · ${esc(c.address.city)}</div></div></div>
                            <div>📱 <a href="tel:${c.phones.mobile.replace(/[^\d+]/g, '')}">${mark(c.phones.mobile)}</a></div>
                            ${c.phones.work ? `<div>☎ ${mark(c.phones.work)}</div>` : ''}
                            ${c.email ? `<div>✉ ${mark(c.email)}</div>` : ''}
                            <div class="contact__actions">
                                <button class="btn btn--sm btn--ghost" data-edit="${c.id}">Изменить</button>
                                <button class="btn btn--sm btn--accent" data-del="${c.id}">Удалить</button>
                            </div>
                        </article>`).join('')}
                    </div></div>`).join('')
            : '<p class="empty">Ничего не найдено</p>';

        const s = PhoneBook.stats();
        $('#pb-stats').innerHTML =
            `<span class="tag">всего: ${s.total}</span>` +
            Object.entries(s.byDept).map(([d, n]) => `<span class="tag tag--green">${PhoneBook.depts[d]}: ${n}</span>`).join('') +
            `<span class="tag">с рабочим телефоном: ${s.withWork}</span>` +
            (q.trim() ? `<span class="tag tag--red">найдено: ${list.length}</span>` : '');
    }

    // Выход из режима редактирования (скрытое поле id кнопка «Очистить» не сбрасывает)
    function leaveEditMode() {
        form.elements.id.value = '';
        $('#pb-form-title').textContent = 'Новый контакт';
        $('#pb-save').textContent = 'Добавить';
    }
    function resetForm() {
        form.reset(); // событие reset само вызовет leaveEditMode
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form)); // поля формы → объект
        if (data.id) {
            PhoneBook.update(data.id, data);
            log(`PhoneBook.update('${data.id}', {...}) → изменены name, phones.mobile, phones.work, address.city`);
            toast(`Контакт ${data.name} сохранён`);
        } else {
            const c = PhoneBook.add(data);
            fresh = c.id;
            log(`PhoneBook.add({...}) → contacts.${c.id} = { name: '${c.name}', phones: { mobile: '${c.phones.mobile}' }, … }`);
            toast(`Добавлен контакт ${c.name}`);
        }
        resetForm();
        render();
    });
    form.addEventListener('reset', leaveEditMode);

    $('#pb-list').addEventListener('click', (e) => {
        const { edit, del } = e.target.dataset;
        if (edit) {
            const c = PhoneBook.contacts[edit];
            for (const [k, v] of Object.entries({ id: c.id, name: c.name, dept: c.dept, mobile: c.phones.mobile, work: c.phones.work || '', email: c.email || '', city: c.address.city })) {
                form.elements[k].value = v;
            }
            $('#pb-form-title').textContent = `Изменение: ${c.id}`;
            $('#pb-save').textContent = 'Сохранить';
            form.elements.name.focus();
            log(`Редактирование: PhoneBook.contacts['${edit}'] → форма заполнена через Object.entries`);
        }
        if (del) {
            const name = PhoneBook.contacts[del].name;
            const ok = PhoneBook.remove(del);
            log(`delete PhoneBook.contacts.${del} → ${ok}; '${del}' in PhoneBook.contacts → ${PhoneBook.has(del)}`);
            toast(`Удалён контакт ${name}`);
            render();
        }
    });

    $('#pb-search').addEventListener('input', render);
    $('#pb-sort').addEventListener('change', render);
    render();
})();
