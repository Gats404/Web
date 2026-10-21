// Задание 2 — анализ текстового файла: чтение → подсчёт статистики → запись отчёта.
// Запуск: node task2-analyze.js [путь]   (по умолчанию data/text.txt)
// Если файла нет — сообщение и выход с кодом 1 (проверка: node task2-analyze.js data/nope.txt).

const fsp = require('fs/promises');
const path = require('path');

const input = process.argv[2] ? path.resolve(process.argv[2]) : path.join(__dirname, 'data', 'text.txt');
const reportPath = path.join(__dirname, 'data', 'report.txt');

// Слово — дробное число (1,8 / 6.4) или последовательность букв/цифр любого алфавита
// с дефисом/апострофом внутри (Wi-Fi). Пробелы и знаки препинания — разделители.
const WORD_RE = /\p{N}+(?:[.,]\p{N}+)+|[\p{L}\p{N}]+(?:[-'’][\p{L}\p{N}]+)*/gu;
const toPosix = (p) => p.split(path.sep).join('/');

function analyze(raw) {
  const text = raw.replace(/^﻿/, ''); // убираем BOM, если файл сохранён «UTF-8 с BOM»
  const lines = text.split(/\r?\n/);
  if (text.endsWith('\n')) lines.pop(); // перевод строки в конце файла не создаёт новую строку

  const words = text.match(WORD_RE) || [];
  const noBreaks = text.replace(/\r?\n/g, '');

  // Частота слов длиной от 4 букв (без учёта регистра)
  const freq = {};
  for (const w of words) {
    const k = w.toLowerCase();
    if (k.length >= 4) freq[k] = (freq[k] || 0) + 1;
  }
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const longest = lines.reduce((a, b) => (b.length > a.length ? b : a), '');

  return {
    lines: lines.length,
    emptyLines: lines.filter((l) => l.trim() === '').length,
    words: words.length,
    charsWithSpaces: noBreaks.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    avgWord: words.length ? words.join('').length / words.length : 0,
    longest,
    top,
  };
}

function formatReport(file, s) {
  const row = (name, value) => `${name.padEnd(34, '.')} ${value}`;
  return [
    'ОТЧЁТ ПО ТЕКСТОВОМУ ФАЙЛУ',
    `Файл: ${toPosix(path.relative(__dirname, file)) || file}`,
    `Дата анализа: ${new Date().toLocaleString('ru-RU')}`,
    '-'.repeat(46),
    row('Количество строк', s.lines),
    row('  из них пустых', s.emptyLines),
    row('  непустых', s.lines - s.emptyLines),
    row('Количество слов', s.words),
    row('Символов с пробелами', s.charsWithSpaces),
    row('Символов без пробелов', s.charsNoSpaces),
    '-'.repeat(46),
    row('Средняя длина слова', s.avgWord.toFixed(2)),
    row('Самая длинная строка (символов)', s.longest.length),
    `Топ-5 слов (от 4 букв): ${s.top.map(([w, n]) => `${w} (${n})`).join(', ')}`,
    '',
    'Примечание: символы считаются без переводов строк; «без пробелов» — без любых пробельных символов.',
  ].join('\n');
}

async function main() {
  let raw;
  try {
    raw = await fsp.readFile(input, 'utf8');
  } catch (err) {
    if (err.code === 'ENOENT') console.error(`Файл не найден: ${input}`);
    else console.error(`Не удалось прочитать файл (${err.code}): ${err.message}`);
    console.error('Анализ невозможен, программа завершается с кодом 1.');
    process.exit(1);
  }

  const report = formatReport(input, analyze(raw));
  await fsp.writeFile(reportPath, report + '\n', 'utf8');
  console.log(report);
  console.log(`\nОтчёт записан в ${toPosix(path.relative(__dirname, reportPath))}`);
}

main();
