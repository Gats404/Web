<?php
/**
 * Задание 1: страница 2 из 3.
 * Показывает, что данные сессии доступны на разных страницах,
 * и позволяет записать имя пользователя в сессию.
 */
session_start();

// Сохранение имени в сессию
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['username'])) {
    $_SESSION['username'] = htmlspecialchars(trim($_POST['username']));
    header('Location: task1_page2.php');
    exit;
}

$username = $_SESSION['username'] ?? 'гость';
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Задание 1 — Сессии (страница 2)</title>
    <style>
        body { font-family: Arial; margin: 30px; line-height: 1.6; background:#f4f4f4; }
        .info { background:#e8f4f8; padding:15px; border-radius:6px; margin:10px 0; }
        .nav a { margin-right:12px; padding:6px 12px; background:#c0392b; color:#fff;
                 text-decoration:none; border-radius:4px; }
        input, button { padding:8px; }
        button { background:#c0392b; color:#fff; border:none; border-radius:4px; cursor:pointer; }
    </style>
</head>
<body>
    <h1>Задание 1: сессии — страница 2</h1>

    <div class="info">
        <p><strong>Привет, <?= htmlspecialchars($username) ?>!</strong></p>
        <p><strong>ID сессии:</strong> <?= session_id() ?></p>
        <p><strong>Счётчик просмотров страницы 1:</strong> <?= $_SESSION['page_views'] ?? 0 ?> раз(а)</p>
    </div>

    <h3>Записать имя пользователя в сессию</h3>
    <form method="POST">
        <input type="text" name="username" placeholder="Введите имя" required>
        <button type="submit">Сохранить</button>
    </form>

    <div class="nav" style="margin-top:20px;">
        <a href="task1_session.php">← Страница 1</a>
        <a href="task1_page3.php">Страница 3 (завершение) →</a>
    </div>
    <p><a href="../index.html">← К оглавлению</a></p>
</body>
</html>
