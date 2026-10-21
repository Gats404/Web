// Задание 1 (дополнительно) — сравнение скорости трёх API и демонстрация блокировки event loop.
// Запуск: node task1-compare.js   (или npm run task1:compare)
// 1) маленькие файлы: каждый способ прогоняется много раз, считается среднее время;
// 2) большой файл: пока идёт чтение, тикает таймер — видно, кто «замораживает» программу.

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');
const { performance } = require('perf_hooks');

const DATA = path.join(__dirname, 'data');
const FILES = [1, 2, 3].map((i) => path.join(DATA, `input${i}.txt`));
const OUT = path.join(DATA, 'output-compare.txt');
const RUNS = 200;

const syncOnce = () => {
  for (const f of FILES) fs.writeFileSync(OUT, fs.readFileSync(f, 'utf8').toUpperCase());
};

const callbackOnce = () =>
  new Promise((resolve, reject) => {
    let pending = FILES.length;
    for (const f of FILES) {
      fs.readFile(f, 'utf8', (err, t) => {
        if (err) return reject(err);
        fs.writeFile(OUT, t.toUpperCase(), (e) => (e ? reject(e) : --pending === 0 && resolve()));
      });
    }
  });

// Promise последовательно: файлы по одному, как в sync — честное сравнение «операция к операции»
const promiseSeqOnce = async () => {
  for (const f of FILES) await fsp.writeFile(OUT, (await fsp.readFile(f, 'utf8')).toUpperCase());
};

// Promise параллельно: все три файла одновременно в пуле потоков libuv
const promiseOnce = () =>
  Promise.all(FILES.map(async (f) => fsp.writeFile(OUT, (await fsp.readFile(f, 'utf8')).toUpperCase())));

async function measure(name, fn) {
  await fn(); // прогрев: первый вызов дольше из-за загрузки кода
  const start = performance.now();
  for (let i = 0; i < RUNS; i++) await fn();
  const avg = (performance.now() - start) / RUNS;
  return { 'Способ': name, 'Среднее на 3 файла, мс': +avg.toFixed(3) };
}

// Сколько раз успеет сработать таймер (раз в 1 мс), пока выполняется чтение большого файла
async function ticksDuring(name, readFn) {
  let ticks = 0;
  const timer = setInterval(() => ticks++, 1);
  await new Promise((r) => setTimeout(r, 5)); // дать таймеру запуститься
  ticks = 0;
  const start = performance.now();
  await readFn();
  const ms = performance.now() - start;
  const result = ticks;
  clearInterval(timer);
  return { 'Чтение большого файла': name, 'Время, мс': +ms.toFixed(1), 'Тиков таймера за это время': result };
}

async function main() {
  console.log(`=== 1. Маленькие файлы (input1-3.txt), ${RUNS} прогонов каждого способа ===`);
  const rows = [
    await measure('sync (по очереди)', async () => syncOnce()),
    await measure('promise (по очереди, await в цикле)', promiseSeqOnce),
    await measure('callback (параллельно)', callbackOnce),
    await measure('promise (параллельно, Promise.all)', promiseOnce),
  ];
  console.table(rows);
  console.log('По очереди sync быстрее: нет передачи задачи в пул потоков и возврата через event loop.');
  console.log('Параллельный async выигрывает за счёт одновременной обработки нескольких файлов.');

  // Большой файл ~20 МБ создаётся на время замера и в конце удаляется
  const big = path.join(DATA, 'big-input.txt');
  fs.writeFileSync(big, fs.readFileSync(path.join(DATA, 'input.txt'), 'utf8').repeat(56000));
  const sizeMb = (fs.statSync(big).size / 1024 / 1024).toFixed(1);

  console.log(`\n=== 2. Большой файл big-input.txt (${sizeMb} МБ): блокируется ли event loop? ===`);
  console.table([
    await ticksDuring('sync (readFileSync)', async () => fs.readFileSync(big)),
    await ticksDuring('callback (readFile)', () => new Promise((r, j) => fs.readFile(big, (e) => (e ? j(e) : r())))),
    await ticksDuring('promise (fs/promises)', () => fsp.readFile(big)),
  ]);
  console.log('0 тиков у sync = всё это время программа не могла ответить ни на один запрос/таймер.');
  await fsp.unlink(OUT);
  await fsp.unlink(big); // большой файл больше не нужен
}

main().catch((err) => {
  console.error(`Ошибка (${err.code}): ${err.message}`);
  process.exit(1);
});
