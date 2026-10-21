// Задание 1 (callback) — асинхронный API модуля fs на колбэках: fs.readFile / fs.writeFile.
// Запуск: node task1-callback.js   (или npm run task1:callback)
// Операция уходит в фон (пул потоков libuv), результат приходит в колбэк (err, data).

const fs = require('fs');
const path = require('path');

const DATA = path.join(__dirname, 'data');

console.log('=== Callback API: fs.readFile / fs.writeFile ===');

// Чтение → верхний регистр → запись. done(err) вызывается, когда файл записан.
function processFile(src, dst, done) {
  fs.readFile(src, 'utf8', (err, text) => {
    if (err) return done(err); // ошибка всегда приходит ПЕРВЫМ аргументом
    fs.writeFile(dst, text.toUpperCase(), 'utf8', (err2) => {
      if (err2) return done(err2);
      done(null, text.length);
    });
  });
}

// 1. Основной файл
console.time('callback: input.txt');
processFile(path.join(DATA, 'input.txt'), path.join(DATA, 'output-callback.txt'), (err, len) => {
  if (err) return console.error(`Ошибка (${err.code}): ${err.message}`);
  console.timeEnd('callback: input.txt');
  console.log(`  input.txt → output-callback.txt (${len} симв.)`);

  // 2. Три файла запускаем ОДНОВРЕМЕННО, считаем, сколько ещё не закончилось
  console.time('callback: 3 файла в цикле');
  let pending = 3;
  for (let i = 1; i <= 3; i++) {
    const label = `  callback: input${i}.txt`;
    console.time(label);
    processFile(path.join(DATA, `input${i}.txt`), path.join(DATA, `output-callback-${i}.txt`), (e) => {
      if (e) console.error(`Ошибка (${e.code}): ${e.message}`);
      else console.timeEnd(label); // порядок завершения может отличаться от порядка запуска
      if (--pending === 0) {
        console.timeEnd('callback: 3 файла в цикле');
        console.log('Все колбэки отработали.');
      }
    });
  }
});

// Эта строка выполнится РАНЬШЕ любого колбэка, хотя написана в конце файла
console.log('Операции запущены, синхронный код закончился — ждём колбэки...');
