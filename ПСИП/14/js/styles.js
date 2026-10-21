// styles.js — ЛР 14, раздел 5: изменение стилей — element.style, classList, getComputedStyle, CSS-переменные.

(() => {
    const { $, $$ } = Behoof;
    const preview = $('#preview');
    const title = $('#preview-title');

    /* ---------- 5.1. Свойство style (инлайн-стили) ---------- */
    function applyStyle() {
        title.style.fontSize = $('#st-size').value + 'px'; // CSS font-size → JS fontSize (camelCase)
        preview.style.borderRadius = $('#st-radius').value + 'px';
        preview.style.backgroundColor = $('#st-bg').value;
        $('#st-size-v').textContent = $('#st-size').value;
        $('#st-radius-v').textContent = $('#st-radius').value;
        $('#st-out').textContent =
            `title.style.fontSize = "${title.style.fontSize}"\n` +
            `preview.style.cssText = "${preview.style.cssText}"`;
    }
    ['#st-size', '#st-radius', '#st-bg'].forEach((s) => $(s).addEventListener('input', applyStyle));
    applyStyle();

    /* ---------- 5.2. classList ---------- */
    function showClasses(action) {
        $('#cls-out').textContent =
            `${action}\npreview.className = "${preview.className}"\n` +
            `classList.contains('is-sale') → ${preview.classList.contains('is-sale')}`;
    }
    $$('[data-cls]').forEach((btn) =>
        btn.addEventListener('click', () => {
            const on = preview.classList.toggle(btn.dataset.cls); // добавит, если нет; уберёт, если есть
            if (btn.dataset.cls === 'is-dark') preview.style.removeProperty('background-color'); // инлайн-фон перебил бы класс
            showClasses(`classList.toggle('${btn.dataset.cls}') → ${on}`);
        })
    );
    showClasses('Начальное состояние:');

    /* ---------- 5.3. CSS-переменные и getComputedStyle ---------- */
    const root = document.documentElement;
    $('#swatches').addEventListener('click', (e) => {
        const color = e.target.dataset.color;
        if (!color) return;
        root.style.setProperty('--brand', color); // переменная на <html> перекрашивает всё, что её использует
        $$('#swatches button').forEach((b) => b.classList.toggle('is-active', b === e.target));
        readComputed();
    });
    function readComputed() {
        const btn = $('#comp-run');
        const cs = getComputedStyle(btn); // итоговые значения после применения всех CSS-правил
        $('#comp-out').textContent =
            `getComputedStyle(root).getPropertyValue('--brand') = "${getComputedStyle(root).getPropertyValue('--brand').trim()}"\n` +
            `кнопка: background-color = ${cs.backgroundColor}\n` +
            `        font-size = ${cs.fontSize}, padding = ${cs.padding}\n` +
            `        border-radius = ${cs.borderRadius}, display = ${cs.display}`;
    }
    $('#comp-run').addEventListener('click', readComputed);
    $('#swatches button').classList.add('is-active');
})();
