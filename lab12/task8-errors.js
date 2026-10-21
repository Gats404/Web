// Задание 6 — обработка ошибок fs (имя файла task8-errors.js — как в задании).
// Запуск: node task8-errors.js   (или npm run task6)
// Каждая ошибочная ситуация вызывается специально, ловится try/catch и разбирается по err.code.

const fsp = require('fs/promises');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const BOX = path.join(__dirname, 'data', 'errors-lab'); // «песочница» для опытов
const file = path.join(BOX, 'plain.txt');
const secret = path.join(BOX, 'secret.txt');
const fullDir = path.join(BOX, 'full-dir');

// Понятные объяснения для кодов ошибок
const EXPLAIN = {
  ENOENT: 'нет такого файла или каталога',
  EACCES: 'нет прав доступа (Linux/macOS)',
  EPERM: 'операция запрещена (Windows: доступ запрещён ACL)',
  EISDIR: 'ожидался файл, а это каталог',
  ENOTDIR: 'ожидался каталог, а это файл',
  EEXIST: 'файл уже существует',
  ENOTEMPTY: 'каталог не пуст',
};

const results = [];

async function attempt(title, expected, action) {
  console.log(`\n▶ ${title}`);
  try {
    await action();
    console.log('  ошибки не произошло');
    results.push({ 'Ситуация': title, 'Ожидали': expected.join('/'), 'Получили': '—', 'Итог': 'нет ошибки' });
  } catch (err) {
    const ok = expected.includes(err.code);
    console.log(`  поймано: ${err.code} — ${EXPLAIN[err.code] || 'неизвестная ошибка'}`);
    const where = err.path ? path.relative(__dirname, err.path).split(path.sep).join('/') : '(не указан)';
    console.log(`  syscall: ${err.syscall}, errno: ${err.errno}, path: ${where}`);
    results.push({ 'Ситуация': title, 'Ожидали': expected.join('/'), 'Получили': err.code, 'Итог': ok ? 'обработано' : 'другая ошибка' });
  }
}

// chmod 000 — «нет прав ни у кого». На Windows chmod меняет только атрибут «только чтение»,
// поэтому запрет чтения ставим через ACL: icacls файл /deny пользователь:(R)
async function denyRead(f) {
  await fsp.chmod(f, 0o000);
  if (process.platform === 'win32') {
    execFileSync('icacls', [f, '/deny', `${os.userInfo().username}:(R)`], { stdio: 'ignore' });
  }
}
async function restoreRead(f) {
  if (process.platform === 'win32') {
    execFileSync('icacls', [f, '/remove:d', os.userInfo().username], { stdio: 'ignore' });
  }
  await fsp.chmod(f, 0o644);
}

async function main() {
  await fsp.mkdir(path.join(fullDir, 'inner'), { recursive: true });
  await fsp.writeFile(file, 'обычный файл');
  await fsp.writeFile(secret, 'секретные цены поставщиков');
  await fsp.writeFile(path.join(fullDir, 'inner', 'data.txt'), '1');

  try {
    await attempt('1. Чтение несуществующего файла', ['ENOENT'], () =>
      fsp.readFile(path.join(BOX, 'no-such-file.txt'), 'utf8'));

    await denyRead(secret);
    await attempt('2. Чтение файла без прав (chmod 000)', ['EACCES', 'EPERM'], () => fsp.readFile(secret, 'utf8'));

    await attempt('3. Чтение каталога как файла', ['EISDIR'], () => fsp.readFile(fullDir, 'utf8'));

    await attempt('4а. Файл как каталог: readdir(plain.txt)', ['ENOTDIR'], () => fsp.readdir(file));
    // Linux/macOS вернут ENOTDIR, Windows — ENOENT (путь «внутри» файла просто не найден)
    await attempt('4б. Путь внутрь файла: plain.txt/inner.txt', ['ENOTDIR', 'ENOENT'], () =>
      fsp.readFile(path.join(file, 'inner.txt'), 'utf8'));

    await attempt("5. Создание файла с флагом 'wx', когда он уже есть", ['EEXIST'], () =>
      fsp.writeFile(file, 'новое содержимое', { flag: 'wx' }));

    await attempt('6. rmdir непустого каталога', ['ENOTEMPTY', 'EEXIST'], () => fsp.rmdir(fullDir));
  } finally {
    // Возвращаем права и убираем песочницу, даже если что-то пошло не так
    await restoreRead(secret).catch(() => {});
    await fsp.rm(BOX, { recursive: true, force: true });
  }

  console.log('\n=== Сводка ===');
  console.table(results);
  console.log('Программа не упала ни разу: каждая ошибка поймана и обработана.');
}

main().catch((err) => {
  console.error(`Необработанная ошибка (${err.code}): ${err.message}`);
  process.exit(1);
});
