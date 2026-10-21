// Задание 4 — управление файлами: запись, дозапись, копирование, переименование, удаление.
// Запуск: node task4-fileops.js   (или npm run task4)
// После каждой операции выводится список файлов в data/ (файлы notes* отмечены стрелкой).

const fsp = require('fs/promises');
const path = require('path');

const DATA = path.join(__dirname, 'data');
const notes = path.join(DATA, 'notes.txt');
const backup = path.join(DATA, 'notes-backup.txt');
const renamed = path.join(DATA, 'notes-2026-10-04.txt'); // имя по заданию

async function listData(step) {
  const entries = await fsp.readdir(DATA, { withFileTypes: true });
  const files = entries.filter((e) => e.isFile()).map((e) => e.name).sort();
  console.log(`   Файлы в data/ после шага ${step} (${files.length}):`);
  const cells = files.map((f) => (f.startsWith('notes') ? `→ ${f}` : `  ${f}`).padEnd(25));
  for (let i = 0; i < cells.length; i += 4) console.log('   ' + cells.slice(i, i + 4).join('').trimEnd());
}

async function main() {
  // Подготовка: убираем следы прошлого запуска, чтобы результат был повторяемым
  await fsp.rm(renamed, { force: true });

  console.log('1) writeFile: создаём notes.txt с текстом «Первая запись»');
  await fsp.writeFile(notes, 'Первая запись\n', 'utf8'); // флаг 'w' — создать или перезаписать
  await listData(1);

  console.log('\n2) appendFile: дописываем две строки с текущей датой');
  const now = () => new Date().toLocaleString('ru-RU');
  await fsp.appendFile(notes, `Вторая запись — ${now()}\n`, 'utf8'); // флаг 'a' — дописать в конец
  await fsp.appendFile(notes, `Третья запись — ${now()}\n`, 'utf8');
  console.log('   Содержимое notes.txt:\n' + (await fsp.readFile(notes, 'utf8')).trimEnd().replace(/^/gm, '     | '));
  await listData(2);

  console.log('\n3) copyFile: notes.txt → notes-backup.txt');
  await fsp.copyFile(notes, backup);
  await listData(3);

  console.log('\n4) rename: notes-backup.txt → notes-2026-10-04.txt');
  await fsp.rename(backup, renamed);
  await listData(4);

  console.log('\n5) unlink: удаляем notes.txt');
  await fsp.unlink(notes);
  await listData(5);

  console.log('\nИтог — содержимое notes-2026-10-04.txt:');
  console.log((await fsp.readFile(renamed, 'utf8')).trimEnd().replace(/^/gm, '     | '));
}

main().catch((err) => {
  console.error(`Ошибка (${err.code}): ${err.message}`);
  process.exit(1);
});
