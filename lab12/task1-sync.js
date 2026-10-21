// Задание 1 (sync) — синхронный API модуля fs: readFileSync / writeFileSync.
// Запуск: node task1-sync.js   (или npm run task1:sync)
// Каждая операция БЛОКИРУЕТ поток: пока файл читается, Node.js больше ничего не делает.

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, 'data');

console.log('=== Синхронный API: fs.readFileSync / fs.writeFileSync ===');

try {
  // 1. Основной файл: input.txt → верхний регистр → output-sync.txt
  console.time('sync: input.txt');
  const text = fs.readFileSync(path.join(DATA, 'input.txt'), 'utf8');
  fs.writeFileSync(path.join(DATA, 'output-sync.txt'), text.toUpperCase(), 'utf8');
  console.timeEnd('sync: input.txt');
  console.log(`  input.txt → output-sync.txt (${text.length} симв.)`);

  // 2. Цикл по трём файлам: следующий файл начнётся только после того, как закончится предыдущий
  console.time('sync: 3 файла в цикле');
  for (let i = 1; i <= 3; i++) {
    const label = `  sync: input${i}.txt`;
    console.time(label);
    const t = fs.readFileSync(path.join(DATA, `input${i}.txt`), 'utf8');
    fs.writeFileSync(path.join(DATA, `output-sync-${i}.txt`), t.toUpperCase(), 'utf8');
    console.timeEnd(label);
  }
  console.timeEnd('sync: 3 файла в цикле');
} catch (err) {
  // Ошибки синхронного API ловятся обычным try/catch
  console.error(`Ошибка (${err.code}): ${err.message}`);
  process.exit(1);
}

console.log('Эта строка напечатана ПОСЛЕ всех операций — код ждал каждую из них.');
