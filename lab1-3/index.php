<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>ЛР 1-3 — Основы PHP | Behoof</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 30px; line-height: 1.6; background:#f4f4f7; color:#2a2f45; }
        h2 { color:#7000ff; border-bottom:1px solid #e3e3ea; padding-bottom:6px; }
        a { color:#7000ff; }
        code, .out { background:#1c1c1c; padding:2px 6px; border-radius:4px; }
        .nav a { display:inline-block; margin:4px 10px 4px 0; }
    </style>
</head>
<body>
    <!-- ===== Ссылки-якоря на разделы скрипта ===== -->
    <h2>Лабораторная работа 1-3. Основы PHP</h2>
    <div class="nav">
        <a href="#info">Информация о PHP</a>
        <a href="#hello">Приветствие</a>
        <a href="#echo">echo и print</a>
        <a href="#var">Переменные</a>
        <a href="#const">Константы</a>
    </div>

    <!-- ===== Задание: phpinfo() ===== -->
    <h2 id="info">Информация о PHP (phpinfo)</h2>
    <?php
    // Полная информация о конфигурации интерпретатора PHP
    phpinfo();
    ?>

    <!-- ===== Задание: вывод приветствия и служебных данных ===== -->
    <h2 id="hello">Приветствие и данные разработчика</h2>
    <?php
    echo "<h3>Добро пожаловать в интернет-магазин Behoof!</h3>";

    $student = "Серёга";              // строка
    $group   = "ПЗ-42";               // строка
    $date    = date("d.m.Y");         // текущая дата

    echo "Разработчик: " . $student . "<br>";
    print "Группа: " . $group . "<br>";          // print вместо echo
    echo "Дата сборки: " . $date . "<br>";

    // Магические константы
    echo "__DIR__: "  . __DIR__  . "<br>";
    echo "__FILE__: " . __FILE__ . "<br>";
    echo "__LINE__: " . __LINE__ . "<br>";

    // Предопределённая переменная сервера — IP клиента
    echo "Ваш IP (вы — это ваш IP): " . $_SERVER['REMOTE_ADDR'] . "<br>";
    ?>

    <!-- ===== Задание: echo vs print ===== -->
    <h2 id="echo">echo и print</h2>
    <?php
    echo "echo может выводить ", "несколько ", "аргументов через запятую.<br>";
    print "print принимает только один аргумент и возвращает 1.<br>";
    $res = print("Возвращаемое значение print = ");
    echo $res . "<br>";
    ?>

    <!-- ===== Задание: переменные разных типов ===== -->
    <h2 id="var">Переменные разных типов</h2>
    <?php
    // String
    $name = "Samsung Galaxy M32";
    echo "Строка (string): " . $name . "<br>";

    // Integer
    $stock = 42;
    echo "Целое (int): на складе " . $stock . " шт.<br>";

    // Float
    $price = 28990.00;
    echo "Дробное (float): цена = " . $price . " ₽<br>";

    // Boolean
    $inStock = true;
    echo "Логическое (bool): в наличии — " . ($inStock ? "да" : "нет") . "<br>";

    // Array
    $catalog = array("Смартфоны", "Ноутбуки", "Умные колонки");
    echo "Массив (array): категория 1 — " . $catalog[0] . "; категория 2 — " . $catalog[1] . "<br>";

    // NULL
    $promo = null;
    echo "NULL: переменная \$promo пуста — " . var_export(is_null($promo), true) . "<br>";

    // Проверка типов
    echo "<br><b>gettype():</b><br>";
    echo "\$name → "    . gettype($name)    . "<br>";
    echo "\$stock → "   . gettype($stock)   . "<br>";
    echo "\$price → "   . gettype($price)   . "<br>";
    echo "\$inStock → " . gettype($inStock) . "<br>";
    echo "\$catalog → " . gettype($catalog) . "<br>";

    // Предопределённые (суперглобальные) переменные
    echo "<br><b>Предопределённые переменные \$_SERVER:</b><br>";
    echo "PHP_SELF: "       . $_SERVER['PHP_SELF']       . "<br>";
    echo "SERVER_NAME: "    . $_SERVER['SERVER_NAME']    . "<br>";
    echo "REQUEST_METHOD: " . $_SERVER['REQUEST_METHOD'] . "<br>";
    echo "HTTP_USER_AGENT: " . htmlspecialchars($_SERVER['HTTP_USER_AGENT'] ?? '—') . "<br>";
    ?>

    <!-- ===== Задание: константы ===== -->
    <h2 id="const">Константы</h2>
    <?php
    // Пользовательские константы
    define("SITE", "Behoof");
    define("FOUNDER", "Команда Behoof");
    const YEAR = 2023;

    echo "SITE: "    . SITE    . "<br>";
    echo "FOUNDER: " . FOUNDER . "<br>";
    echo "YEAR: "    . YEAR    . "<br>";
    echo "Константа определена (defined): " . var_export(defined("SITE"), true) . "<br>";

    // Предопределённые константы PHP
    echo "<br><b>Предопределённые константы PHP:</b><br>";
    echo "PHP_VERSION: " . PHP_VERSION . "<br>";
    echo "PHP_OS: "      . PHP_OS      . "<br>";
    echo "PHP_INT_MAX: " . PHP_INT_MAX . "<br>";
    echo "PHP_EOL (как код): " . bin2hex(PHP_EOL) . "<br>";
    ?>

    <hr>
    <p><a href="../index.html">← К оглавлению</a></p>
</body>
</html>
