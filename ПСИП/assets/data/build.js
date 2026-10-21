// Пересобирает products.js из products.json.
// Запуск из папки ПСИП: node assets/data/build.js
// products.js нужен страницам, открытым двойным кликом (file://): там fetch к локальному JSON запрещён.

const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, 'products.json');
const data = JSON.parse(fs.readFileSync(src, 'utf8'));
const out =
  '// Копия products.json для страниц, открытых через file:// (там fetch к локальному JSON запрещён).\n' +
  '// Не редактировать вручную: правьте products.json и запускайте node assets/data/build.js\n' +
  `window.BEHOOF_PRODUCTS = ${JSON.stringify(data, null, 2)};\n`;

fs.writeFileSync(path.join(__dirname, 'products.js'), out, 'utf8');
console.log(`products.js обновлён: ${data.length} товаров`);
