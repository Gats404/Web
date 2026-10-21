// Задание 3 — метаданные файла: размер, даты создания/изменения, права доступа, существование.
// Запуск: node task3-meta.js <путь к файлу>     например: node task3-meta.js data/text.txt

const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const target = process.argv[2];
if (!target) {
  console.log('Использование: node task3-meta.js <путь к файлу>');
  process.exit(1);
}
const full = path.resolve(target);

// 0o644 → "rw-r--r--"
function modeToString(mode) {
  const bits = ['r', 'w', 'x'];
  let s = '';
  for (let i = 8; i >= 0; i--) s += mode & (1 << i) ? bits[(8 - i) % 3] : '-';
  return s;
}

function humanSize(bytes) {
  const units = ['Б', 'КБ', 'МБ', 'ГБ'];
  let n = bytes;
  let u = 0;
  while (n >= 1024 && u < units.length - 1) {
    n /= 1024;
    u++;
  }
  return `${u ? n.toFixed(2) : n} ${units[u]}`;
}

// Может ли текущий пользователь читать/писать/выполнять файл
async function can(mode) {
  try {
    await fsp.access(full, mode);
    return 'да';
  } catch {
    return 'нет';
  }
}

async function main() {
  const date = (d) => d.toLocaleString('ru-RU');
  const row = (name, value) => console.log(`${name.padEnd(28, '.')} ${value}`);

  console.log(`=== Метаданные: ${target} ===`);

  // Проверка существования: синхронно (existsSync) и асинхронно (access с F_OK)
  const exists = fs.existsSync(full);
  row('Существует (existsSync)', exists ? 'да' : 'нет');
  row('Существует (access F_OK)', await can(fs.constants.F_OK));
  if (!exists) {
    console.log(`\nФайл "${target}" не найден — метаданные получить нельзя.`);
    process.exit(1);
  }

  const st = await fsp.stat(full);
  const lst = await fsp.lstat(full); // lstat не переходит по символической ссылке
  const type = lst.isSymbolicLink() ? 'символическая ссылка' : st.isDirectory() ? 'каталог' : st.isFile() ? 'файл' : 'другое';

  row('Полный путь', full);
  row('Имя / расширение', `${path.basename(full)} / ${path.extname(full) || '(нет)'}`);
  row('Тип', type);
  row('Размер', `${st.size} байт (${humanSize(st.size)})`);
  row('Создан (birthtime)', date(st.birthtime));
  row('Изменён (mtime)', date(st.mtime));
  row('Последний доступ (atime)', date(st.atime));
  row('Изменены метаданные (ctime)', date(st.ctime));
  const perm = st.mode & 0o777;
  row('Права (mode)', `${perm.toString(8).padStart(3, '0')} → ${modeToString(perm)}`);
  row('Чтение (R_OK)', await can(fs.constants.R_OK));
  row('Запись (W_OK)', await can(fs.constants.W_OK));
  row('Выполнение (X_OK)', await can(fs.constants.X_OK));

  if (process.platform === 'win32') {
    console.log('\nWindows: права эмулируются — 666 (обычный файл) или 444 («только чтение»), X_OK = F_OK.');
  }
}

main().catch((err) => {
  console.error(`Ошибка (${err.code}): ${err.message}`);
  process.exit(1);
});
