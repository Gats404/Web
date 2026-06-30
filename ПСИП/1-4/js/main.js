// main.js — небольшой скрипт для страницы товара Behoof.

document.addEventListener('DOMContentLoaded', () => {
    // Плавная прокрутка по якорным ссылкам меню
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', e => {
            const id = link.getAttribute('href');
            if (id.length > 1) {
                const target = document.querySelector(id);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Подтверждение перед отправкой формы вступления
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', e => {
            if (!confirm('Отправить вопрос о товаре?')) {
                e.preventDefault();
            }
        });
    }
});
