// Задание 1 (promise) — промис-API: require('fs/promises') + async/await.
// Запуск: node task1-promise.js   (или npm run task1:promise)
// Код выглядит как синхронный, но не блокирует поток; ошибки ловятся try/catch.

const fsp = require('fs/promises');
const path = require('path');

const DATA = path.join(__dirname, 'data');

async function processFile(src, dst) {
  const text = await fsp.readFile(src, 'utf8');
  await fsp.writeFile(dst, text.toUpperCase(), 'utf8');
  return text.length;
}

async function main() {
  console.log('=== Promise API: fs/promises + async/await ===');

  // 1. Основной файл
  console.time('promise: input.txt');
  const len = await processFile(path.join(DATA, 'input.txt'), path.join(DATA, 'output-promise.txt'));
  console.timeEnd('promise: input.txt');
  console.log(`  input.txt → output-promise.txt (${len} симв.)`);

  // 2. Три файла параллельно: Promise.all ждёт, пока выполнятся все промисы
  console.time('promise: 3 файла в цикле');
  const jobs = [1, 2, 3].map(async (i) => {
    const label = `  promise: input${i}.txt`;
    console.time(label);
    await processFile(path.join(DATA, `input${i}.txt`), path.join(DATA, `output-promise-${i}.txt`));
    console.timeEnd(label);
  });
  await Promise.all(jobs);
  console.timeEnd('promise: 3 файла в цикле');
}

main().catch((err) => {
  console.error(`Ошибка (${err.code}): ${err.message}`);
  process.exit(1);
});

console.log('main() запущена, синхронный код закончился — await-ы продолжатся позже...');
