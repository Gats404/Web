// script.js — задания 2-5 (объект Date — в HEAD на странице).
document.addEventListener('DOMContentLoaded', () => {

    // --- ЗАДАНИЕ 2: цикл for (вывод имени 35 раз) ---
    document.getElementById('btn-task2').addEventListener('click', () => {
        let output = '';
        for (let i = 1; i <= 35; i++) {
            output += `${i}. Серёга, магазин Behoof\n`;  // подставьте своё ФИО
        }
        document.getElementById('res-2').innerText = output;
    });

    // --- ЗАДАНИЕ 3: массив (сумма чётных элементов) ---
    document.getElementById('btn-task3').addEventListener('click', () => {
        const arr = [12, 7, 24, 3, 18, 9, 42];
        let sum = 0;
        for (const num of arr) {
            if (num % 2 === 0) sum += num;
        }
        document.getElementById('res-3').innerHTML =
            `Массив: [${arr}]\nСумма чётных: <b>${sum}</b>`;
    });

    // --- ЗАДАНИЕ 4: Math (формула) ---
    // Формула: (b + sqrt(b^2 + 4ac)) / (a*c + b^2)
    document.getElementById('btn-task4').addEventListener('click', () => {
        const a = 2, b = 5, c = 3;
        const denominator = (a * c) + Math.pow(b, 2);
        const rootVal = Math.sqrt(Math.pow(b, 2) + (4 * a * c));
        let result = 'Ошибка вычисления';
        if (denominator !== 0) {
            result = ((b + rootVal) / denominator).toFixed(4);
        }
        document.getElementById('res-4').innerHTML =
            `a=${a}, b=${b}, c=${c}\nРезультат: <b>${result}</b>`;
    });

    // --- ЗАДАНИЕ 5: строки (длина, вставка пробела, замена) ---
    document.getElementById('btn-task5').addEventListener('click', () => {
        const s1 = 'SAMSUNGGALAXY';             // исходная строка S1
        const len = s1.length;                  // 1) длина
        const s2 = s1.slice(0, 7) + ' ' + s1.slice(7); // 2) вставка пробела между словами
        const s3 = s2.replace('SAMSUNG', 'Apple'); // 3) замена подстроки
        document.getElementById('res-5').innerHTML =
            `Длина S1: ${len}\nS2 с пробелом: "${s2}"\nЗамена: "${s3}"`;
    });

});
