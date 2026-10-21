// profile-form.js — ЛР 19–20: общая работа с формой личных данных (используется на страницах cookie и storage).

const ProfileForm = {
    form: document.getElementById('profile-form'),

    // Форма → объект (флажки увлечений собираются в массив)
    read() {
        const fd = new FormData(this.form);
        return {
            fio: fd.get('fio').trim(),
            email: fd.get('email').trim(),
            phone: fd.get('phone').trim(),
            birth: fd.get('birth'),
            place: fd.get('place').trim(),
            hobbies: fd.getAll('hobbies'),
            category: fd.get('category'),
        };
    },

    // Объект → форма
    fill(data) {
        const el = this.form.elements;
        for (const key of ['fio', 'email', 'phone', 'birth', 'place', 'category']) el[key].value = data[key] ?? '';
        el.hobbies.forEach((cb) => (cb.checked = (data.hobbies || []).includes(cb.value)));
    },

    // Демо-данные (вымышленный покупатель) для проверки
    example() {
        this.fill({
            fio: 'Иванов Иван Иванович', email: 'ivanov@example.com', phone: '+7 900 123-45-67',
            birth: '2007-05-14', place: 'г. Москва', hobbies: ['гаджеты', 'музыка', 'путешествия'], category: 'Смартфоны',
        });
    },

    labels: { fio: 'ФИО', email: 'Электронная почта', phone: 'Телефон', birth: 'Дата рождения', place: 'Место рождения', hobbies: 'Увлечения', category: 'Любимая категория' },

    // Возраст по дате рождения
    age(birth) {
        if (!birth) return null;
        const b = new Date(birth);
        const now = new Date();
        let a = now.getFullYear() - b.getFullYear();
        if (now < new Date(now.getFullYear(), b.getMonth(), b.getDate())) a--;
        return a;
    },
};

document.getElementById('example').addEventListener('click', () => ProfileForm.example());
