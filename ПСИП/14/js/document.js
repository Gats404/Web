// document.js — ЛР 14, раздел 1: свойства объекта document и его коллекции links, anchors, images, forms.

(() => {
    const { $, fillTable } = Behoof;

    /* ---------- 1.1. Свойства document ---------- */
    function showProps() {
        fillTable($('#doc-props'), [
            ['document.title', document.title],
            ['document.URL', decodeURI(document.URL)],
            ['document.domain', document.domain || '(пусто — файл с диска)'],
            ['document.referrer', document.referrer ? decodeURI(document.referrer) : '(переход не по ссылке)'],
            ['document.lastModified', document.lastModified],
            ['document.readyState', document.readyState],
            ['document.characterSet', document.characterSet],
            ['document.contentType', document.contentType],
            ['document.doctype.name', document.doctype.name],
            ['document.documentElement', `<${document.documentElement.tagName.toLowerCase()} lang="${document.documentElement.lang}">`],
            ['document.head / body', `${document.head.children.length} / ${document.body.children.length} дочерних элементов`],
        ]);
    }
    showProps();
    // readyState меняется: loading → interactive → complete
    document.addEventListener('readystatechange', showProps);

    const originalTitle = document.title;
    $('#doc-title').addEventListener('click', () => {
        document.title = '🔥 Скидки до 20% — Behoof';
        showProps();
    });
    $('#doc-title-reset').addEventListener('click', () => {
        document.title = originalTitle;
        showProps();
    });

    /* ---------- 1.2. Коллекции документа ---------- */
    const out = $('#doc-out');
    const flash = (els) => {
        document.querySelectorAll('.is-found').forEach((el) => el.classList.remove('is-found'));
        [...els].forEach((el) => el.classList.add('is-found'));
    };

    $('#doc-links').addEventListener('click', () => {
        // links — все <a href> и <area href> документа
        const links = document.links;
        out.textContent = `document.links.length = ${links.length}\n` +
            [...links].slice(0, 12).map((a, i) => `${i}: «${a.textContent.trim()}» → ${decodeURI(a.getAttribute('href'))}`).join('\n') +
            (links.length > 12 ? `\n… и ещё ${links.length - 12}` : '');
        flash(links);
    });

    $('#doc-anchors').addEventListener('click', () => {
        // anchors — только <a> с атрибутом name (устаревшие «якоря»)
        const anchors = document.anchors;
        out.textContent = `document.anchors.length = ${anchors.length}\n` +
            [...anchors].map((a) => `<a name="${a.name}">`).join('\n') +
            '\nПереход к якорю: location.hash = "#" + anchors[1].name';
    });

    $('#doc-images').addEventListener('click', () => {
        const images = document.images;
        out.textContent = `document.images.length = ${images.length}\n` +
            [...images].map((img, i) => `${i}: alt="${img.alt}", ${img.naturalWidth}×${img.naturalHeight}, ${img.getAttribute('src')}`).join('\n');
        flash(images);
    });

    $('#doc-forms').addEventListener('click', () => {
        const forms = document.forms;
        // к форме можно обратиться по имени: document.forms.sortForm, к полю — form.elements.sort
        const chosen = forms.sortForm.elements.sort.value;
        out.textContent = `document.forms.length = ${forms.length}\n` +
            [...forms].map((f, i) => `${i}: name="${f.name || '(нет)'}", id="${f.id || '(нет)'}", полей: ${f.elements.length}`).join('\n') +
            `\ndocument.forms.sortForm.elements.sort.value = "${chosen}"`;
        flash(forms);
    });
})();
