<?php
/**
 * Задание 1: страница 3 из 3 — завершение сессии.
 * Демонстрирует unset(), очистку $_SESSION, удаление cookie и session_destroy().
 */
session_start();

// Запоминаем данные ДО уничтожения, чтобы показать их
$sessionData = $_SESSION;

// 1) Удаляем конкретную переменную
unset($_SESSION['username']);

// 2) Очищаем весь массив сессии
$_SESSION = array();

// 3) Удаляем cookie сессии (устанавливаем срок в прошлом)
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 3600,
        $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}

// 4) Уничтожаем сессию на сервере
session_destroy();
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Задание 1 — Сессии (страница 3)</title>
    <style>
        body { font-family: Arial; margin: 30px; line-height: 1.6; background:#f4f4f4; }
        .info { background:#f8e8e8; padding:15px; border-radius:6px; margin:10px 0; }
        .nav a { margin-right:12px; padding:6px 12px; background:#c0392b; color:#fff;
                 text-decoration:none; border-radius:4px; }
        pre { background:#222; color:#0f0; padding:12px; border-radius:6px; overflow:auto; }
    </style>
</head>
<body>
    <h1>Задание 1: сессии — страница 3 (завершение)</h1>

    <div class="info">
        <h3>Данные сессии ДО уничтожения:</h3>
        <pre><?php print_r($sessionData); ?></pre>

        <h3>Выполнено:</h3>
        <ul>
            <li><code>unset($_SESSION['username'])</code> — удалена одна переменная</li>
            <li><code>$_SESSION = array()</code> — очищен массив</li>
            <li><code>setcookie(session_name(), '', time()-3600)</code> — удалена cookie</li>
            <li><code>session_destroy()</code> — сессия уничтожена</li>
        </ul>

        <p style="color:#c0392b;"><strong>Сессия уничтожена.</strong> Текущее состояние $_SESSION:</p>
        <pre><?php var_dump($_SESSION); ?></pre>
    </div>

    <div class="nav">
        <a href="task1_session.php">Начать новую сессию →</a>
    </div>
    <p><a href="../index.html">← К оглавлению</a></p>
</body>
</html>
