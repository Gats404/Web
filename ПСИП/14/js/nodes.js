// nodes.js — ЛР 14, раздел 3: объект Node — дерево узлов, навигация, прямое и последовательное обращение.

(() => {
    const { $, $$, esc, fillTable } = Behoof;

    /* ---------- 3.1. Дерево узлов карточки ---------- */
    const TYPES = { 1: 'ELEMENT_NODE', 3: 'TEXT_NODE', 8: 'COMMENT_NODE' };

    // Рекурсивно обходим childNodes и строим вложенный список <ul>
    function buildTree(node, showWs) {
        let label;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const attrs = [...node.attributes].map((a) => ` <span class="t-attr">${a.name}="${esc(a.value)}"</span>`).join('');
            label = `<span class="t-el">&lt;${node.tagName.toLowerCase()}&gt;</span>${attrs}`;
        } else if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue.trim();
            if (!text && !showWs) return '';
            label = `<span class="t-text">#text ${text ? '«' + esc(text) + '»' : '(пробелы и перенос строки)'}</span>`;
        } else if (node.nodeType === Node.COMMENT_NODE) {
            label = `<span class="t-comment">#comment «${esc(node.nodeValue.trim())}»</span>`;
        } else return '';
        const kids = [...node.childNodes].map((n) => buildTree(n, showWs)).join('');
        return `<li>${label}<span class="t-type">${node.nodeType} ${TYPES[node.nodeType]}</span>${kids ? `<ul>${kids}</ul>` : ''}</li>`;
    }
    function renderTree() {
        const card = document.getElementById($('#tree-card').value);
        $('#tree').innerHTML = `<ul>${buildTree(card, $('#tree-ws').checked)}</ul>`;
    }
    $('#tree-card').addEventListener('change', renderTree);
    $('#tree-ws').addEventListener('change', renderTree);
    renderTree();

    /* ---------- 3.2. Навигатор по узлам ---------- */
    const start = document.getElementById('card-3');
    let current = start;

    function showNode(note = '') {
        $$('.is-cursor, .is-found').forEach((el) => el.classList.remove('is-cursor', 'is-found'));
        current.classList.add('is-cursor');
        fillTable($('#node-info'), [
            ['nodeName', current.nodeName],
            ['nodeType', `${current.nodeType} (${TYPES[current.nodeType]})`],
            ['id / className', `${current.id || '—'} / ${current.className || '—'}`],
            ['parentNode', current.parentNode.nodeName + (current.parentNode.id ? '#' + current.parentNode.id : '')],
            ['childNodes / children', `${current.childNodes.length} узлов / ${current.children.length} элементов`],
            ['textContent', current.textContent.trim().replace(/\s+/g, ' ').slice(0, 60) || '(пусто)'],
            ['Последний шаг', note || 'старт: document.getElementById("card-3")'],
        ], ['Свойство узла', 'Значение']);
    }
    document.querySelector('.nav-pad').addEventListener('click', (e) => {
        const step = e.target.dataset.go;
        if (!step) return;
        if (step === 'reset') {
            current = start;
            return showNode();
        }
        const next = current[step];
        // Не выходим за пределы витрины и не теряем узел, если соседа нет (null)
        if (!next || next === document.body || !next.closest('main')) return showNode(`${step} = null — дальше идти некуда`);
        current = next;
        showNode(`current = current.${step}`);
    });
    showNode();

    /* ---------- 3.3. Прямое и последовательное обращение ---------- */
    $('#access-run').addEventListener('click', () => {
        const direct = document.getElementById('price-3'); // прямое: сразу по id
        const showcase = document.querySelector('#showcase');
        const sequential = showcase.firstElementChild // #card-1
            .nextElementSibling // #card-2
            .nextElementSibling // #card-3
            .children[4]; // 0 div.img, 1 badge, 2 h4, 3 specs, 4 price
        const viaNodes = showcase.childNodes[5].childNodes[11]; // с учётом текстовых узлов и комментария
        $('#access-out').textContent =
            `Прямое:          document.getElementById('price-3') → «${direct.textContent}»\n` +
            `Последовательное: showcase.firstElementChild.nextElementSibling\n` +
            `                   .nextElementSibling.children[4] → «${sequential.textContent}»\n` +
            `Через childNodes: showcase.childNodes[5].childNodes[11] → «${viaNodes.textContent}»\n` +
            `direct === sequential → ${direct === sequential}, direct === viaNodes → ${direct === viaNodes}`;
        $$('.is-found').forEach((el) => el.classList.remove('is-found'));
        direct.classList.add('is-found');
    });
})();
