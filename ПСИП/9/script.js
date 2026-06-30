// script.js — интерактив статического лендинга (ЛР9).
document.addEventListener('DOMContentLoaded', () => {

    // Инициализация тултипов Bootstrap
    document.querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach(el => new bootstrap.Tooltip(el));

    // Подстановка названия товара в модальное окно заказа
    const orderModal = document.getElementById('orderModal');
    if (orderModal) {
        orderModal.addEventListener('show.bs.modal', event => {
            const product = event.relatedTarget?.getAttribute('data-product') || '';
            const field = orderModal.querySelector('#orderProduct');
            if (field) field.value = product;
        });
    }

    // Toast при отправке заявки
    const toastEl = document.getElementById('liveToast');
    const toast = toastEl ? new bootstrap.Toast(toastEl) : null;

    const showToast = e => { if (e) e.preventDefault(); if (toast) toast.show(); };

    document.getElementById('showToastBtn')?.addEventListener('click', showToast);
    document.getElementById('feedbackForm')?.addEventListener('submit', e => { e.preventDefault(); showToast(); e.target.reset(); });
    document.getElementById('orderForm')?.addEventListener('submit', e => {
        e.preventDefault();
        bootstrap.Modal.getInstance(orderModal)?.hide();
        showToast();
    });

    // Подписка (демо без бэкенда)
    document.getElementById('subscribeBtn')?.addEventListener('click', () => {
        alert('Вы подписались на рассылку скидок Behoof!');
    });
});
