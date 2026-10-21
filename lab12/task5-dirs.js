// Задание 5 — работа с директориями: создание, чтение содержимого, рекурсивный обход, удаление.
// Запуск: node task5-dirs.js   (или npm run task5)
// Строим «склад» магазина Behoof в data/shop/, обходим его и удаляем.

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const ROOT = path.join(__dirname, 'data', 'shop');
const rel = (p) => path.relative(__dirname, p).split(path.sep).join('/');

// Рекурсивный обход: для каталога вызываем функцию снова, рисуем дерево
async function walk(dir, prefix = '', stats = { dirs: 0, files: 0, bytes: 0 }) {
  const entries = await fsp.readdir(dir, { withFileTypes: true });
  entries.sort((a, b) => b.isDirectory() - a.isDirectory() || a.name.localeCompare(b.name));
  for (const [i, e] of entries.entries()) {
    const last = i === entries.length - 1;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      stats.dirs++;
      console.log(`${prefix}${last ? '└── ' : '├── '}${e.name}/`);
      await walk(full, prefix + (last ? '    ' : '│   '), stats);
    } else {
      const { size } = await fsp.stat(full);
      stats.files++;
      stats.bytes += size;
      console.log(`${prefix}${last ? '└── ' : '├── '}${e.name} (${size} Б)`);
    }
  }
  return stats;
}

async function main() {
  await fsp.rm(ROOT, { recursive: true, force: true }); // чистый старт

  // 1. Создание: recursive: true создаёт всю цепочку папок сразу (как mkdir -p)
  console.log('1) mkdir { recursive: true }');
  for (const d of ['catalog/smartphones', 'catalog/speakers', 'orders/2026/10', 'empty']) {
    await fsp.mkdir(path.join(ROOT, d), { recursive: true });
    console.log(`   создан ${rel(path.join(ROOT, d))}/`);
  }
  const files = {
    'readme.txt': 'Склад интернет-магазина Behoof',
    'catalog/smartphones/samsung-m32.json': JSON.stringify({ name: 'Samsung Galaxy M32', price: 28990 }),
    'catalog/smartphones/iphone-13.json': JSON.stringify({ name: 'Apple iPhone 13', price: 69990 }),
    'catalog/speakers/station-max.json': JSON.stringify({ name: 'Яндекс Станция Макс', price: 19990 }),
    'orders/2026/10/order-1001.txt': 'Заказ №1001: Realme C33 — 11 990 руб.',
    'orders/2026/10/order-1002.txt': 'Заказ №1002: SberBoom — 7 990 руб.',
  };
  for (const [name, content] of Object.entries(files)) await fsp.writeFile(path.join(ROOT, name), content);
  console.log(`   + записано файлов: ${Object.keys(files).length}`);

  // 2. Чтение содержимого каталога: просто имена
  console.log('\n2) readdir(data/shop) — только имена:');
  console.log('   ', await fsp.readdir(ROOT));

  // 3. withFileTypes: объекты Dirent — сразу видно, папка это или файл
  console.log('\n3) readdir(data/shop, { withFileTypes: true }):');
  for (const e of await fsp.readdir(ROOT, { withFileTypes: true })) {
    console.log(`   ${e.isDirectory() ? '[папка]' : '[файл] '} ${e.name}`);
  }

  // 4. Рекурсивный обход собственной функцией
  console.log('\n4) Рекурсивный обход (своя функция walk):');
  console.log('shop/');
  const s = await walk(ROOT);
  console.log(`   Итого: папок ${s.dirs}, файлов ${s.files}, объём ${s.bytes} Б`);

  // 5. Встроенный рекурсивный режим readdir (Node.js 18.17+ / 20+)
  console.log('\n5) readdir(data/shop, { recursive: true }) — встроенный обход:');
  const all = await fsp.readdir(ROOT, { recursive: true });
  console.log('   ' + all.map((p) => p.split(path.sep).join('/')).sort().join('\n   '));

  // 6. Удаление
  console.log('\n6) Удаление:');
  await fsp.rmdir(path.join(ROOT, 'empty')); // rmdir удаляет только ПУСТУЮ папку
  console.log('   rmdir(empty) — пустая папка удалена');
  try {
    await fsp.rmdir(path.join(ROOT, 'orders'));
  } catch (err) {
    console.log(`   rmdir(orders) — ошибка ${err.code}: в папке есть файлы, rmdir так не умеет`);
  }
  await fsp.rm(path.join(ROOT, 'orders'), { recursive: true }); // rm + recursive удаляет со всем содержимым
  console.log('   rm(orders, { recursive: true }) — удалена вместе с вложенными папками и файлами');
  console.log('   Осталось в shop/:', await fsp.readdir(ROOT));
  await fsp.rm(ROOT, { recursive: true, force: true });
  console.log(`   rm(shop, { recursive, force }) — существует ли data/shop? ${fs.existsSync(ROOT) ? 'да' : 'нет'}`);
}

main().catch((err) => {
  console.error(`Ошибка (${err.code}): ${err.message}`);
  process.exit(1);
});
