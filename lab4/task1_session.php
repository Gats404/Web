<?php
/**
 * Задание 1: Демонстрация механизма работы с сессиями.
 * Страница 1 из 3 — счётчик посещений хранится в сессии.
 */
session_start(); // обязательно ДО любого вывода

$sessionName = session_name(); // обычно PHPSESSID
$sessionId   = session_id();   // уникальный идентификатор сессии

// Сброс счётчика по ссылке ?action=clear
if (isset($_GET['action']) && $_GET['action'] === 'clear') {
    unset($_SESSION['page_views']);
    header('Location: task1_session.php');
    exit;
}

// Инициализация и увеличение счётчика
if (!isset($_SESSION['page_views'])) {
    $_SESSION['page_views'] = 0;
}
$_SESSION['page_views']++;
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Задание 1 — Сессии (страница 1)</title>
    <style>
        body { font-family: Arial; margin: 30px; line-height: 1.6; background:#f4f4f4; }
        .info { background:#e8f4f8; padding:15px; border-radius:6px; margin:10px 0; }
        .nav a { margin-right:12px; padding:6px 12px; background:#c0392b; color:#fff;
                 text-decoration:none; border-radius:4px; }
        .nav a:hover { background:#a93226; }
        code { background:#ddd; padding:1px 5px; border-radius:3px; }
    </style>
</head>
<body>
    <h1>Задание 1: работа с сессиями — страница 1</h1>

    <div class="info">
        <h3>Информация о текущей сессии</h3>
        <p><strong>Имя сессии (session_name):</strong> <?= htmlspecialchars($sessionName) ?></p>
        <p><strong>ID сессии (session_id):</strong> <?= htmlspecialchars($sessionId) ?></p>
        <p><strong>Эту страницу вы открыли:</strong> <?= $_SESSION['page_views'] ?> раз(а)</p>
        <p><strong>Время визита:</strong> <?= date('Y-m-d H:i:s') ?></p>
    </div>

    <div class="nav">
        <a href="task1_session.php">Обновить</a>
        <a href="?action=clear">Сбросить счётчик</a>
        <a href="task1_page2.php">На страницу 2 →</a>
    </div>

    <hr>
    <h3>Что демонстрирует скрипт</h3>
    <ul>
        <li><code>session_start()</code> — открытие/возобновление сессии</li>
        <li><code>session_id()</code> — уникальный идентификатор</li>
        <li><code>session_name()</code> — имя сессии (PHPSESSID)</li>
        <li><code>$_SESSION</code> — суперглобальный массив данных сессии</li>
        <li>Счётчик сохраняется между запросами</li>
    </ul>
    <p><a href="../index.html">← К оглавлению</a></p>
</body>
</html>
