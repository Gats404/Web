// validate-html5.js — ЛР 18, задание 2, способ 1: проверку выполняет браузер по атрибутам HTML5.
// Скрипт только показывает результат: сообщения браузера (validationMessage) и состояние validity.

(() => {
    const form = document.getElementById('form-html5');
    const out = document.getElementById('out-html5');

    function report() {
        const bad = [...form.elements].filter((el) => el.willValidate && !el.validity.valid);
        if (!bad.length) return;
        out.textContent = 'Браузер не отправил форму:\n' + bad.map((el) => {
            const v = el.validity; // объект ValidityState: какие именно правила нарушены
            const why = ['valueMissing', 'typeMismatch', 'patternMismatch', 'tooShort', 'tooLong', 'rangeUnderflow', 'rangeOverflow']
                .filter((k) => v[k]).join(', ');
            return `• ${el.name}: ${el.validationMessage} [${why}]`;
        }).join('\n');
    }

    // invalid приходит для каждого неверного поля при попытке отправки
    form.addEventListener('invalid', () => {
        form.classList.add('was-submitted');
        clearTimeout(report.t);
        report.t = setTimeout(report); // собрать все поля после серии событий invalid
    }, true);

    // submit срабатывает, только если ВСЕ поля прошли проверку браузера
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        out.textContent = `✓ form.checkValidity() = ${form.checkValidity()} — все атрибуты HTML5 выполнены, форму можно отправлять.`;
    });
})();
