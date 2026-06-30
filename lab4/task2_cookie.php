<?php
/**
 * Задание 2: работа с cookies.
 * Создание/удаление нескольких cookie с уникальными именами.
 */
$message = '';

// Установка новой cookie
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['set_cookie'])) {
    $name  = trim($_POST['cookie_name'] ?? '');
    $value = trim($_POST['cookie_value'] ?? '');
    $days  = (int)($_POST['expire_days'] ?? 1);

    if ($name !== '' && $value !== '') {
        setcookie($name, $value, time() + $days * 24 * 3600, '/', '', false, true);
        $message = "✅ Cookie «$name» установлена со значением: " . htmlspecialchars($value);
    } else {
        $message = "⚠️ Заполните имя и значение cookie";
    }
}

// Удаление одной cookie
if (isset($_POST['delete_cookie']) && isset($_POST['cookie_to_delete'])) {
    $name = $_POST['cookie_to_delete'];
    setcookie($name, '', time() - 3600, '/');
    $message = "🗑️ Cookie «$name» удалена (обновите страницу)";
}

// Удаление всех cookie
if (isset($_POST['delete_all_cookies'])) {
    foreach ($_COOKIE as $n => $v) {
        setcookie($n, '', time() - 3600, '/');
    }
    $message = "🗑️ Все cookie удалены (обновите страницу)";
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Задание 2 — Cookies</title>
    <style>
        body { font-family: Arial; margin: 30px; line-height: 1.6; }
        .container { max-width: 900px; margin: 0 auto; }
        .info { background:#e8f4f8; padding:15px; border-radius:6px; margin:10px 0; }
        .warning { background:#fff3cd; padding:15px; border-radius:6px; margin:10px 0;
                   border-left:4px solid #ffc107; }
        .success { background:#d4edda; padding:10px; border-radius:6px; margin:10px 0; color:#155724; }
        .form-group { margin:14px 0; }
        input, select, button { padding:8px; margin:4px 0; }
        button { background:#28a745; color:#fff; border:none; border-radius:4px; cursor:pointer; }
        .delete-btn { background:#dc3545; }
        .cookie-item { background:#f8f9fa; padding:8px; margin:6px 0; border:1px solid #ddd;
                       border-radius:4px; display:flex; justify-content:space-between; align-items:center; }
        .cookie-name { font-weight:bold; color:#c0392b; }
        .delete-single { background:#dc3545; color:#fff; border:none; padding:3px 8px;
                         border-radius:3px; cursor:pointer; font-size:12px; }
    </style>
</head>
<body>
<div class="container">
    <h1>🍪 Задание 2: работа с Cookies</h1>

    <?php if ($message): ?>
        <div class="success"><?= $message ?></div>
    <?php endif; ?>

    <div class="warning">
        <p><strong>Каждая cookie имеет уникальное имя.</strong> Создание cookie с уже
        существующим именем перезапишет старое значение. Для хранения нескольких значений
        используйте разные имена: <code>member_name</code>, <code>theme</code>, <code>last_visit</code>.</p>
    </div>

    <div class="info">
        <h3>📊 Текущие cookies (<?= count($_COOKIE) ?> шт.)</h3>
        <?php if (empty($_COOKIE)): ?>
            <p><em>Нет установленных cookies</em></p>
        <?php else: ?>
            <?php foreach ($_COOKIE as $name => $value): ?>
                <div class="cookie-item">
                    <div>
                        <span class="cookie-name"><?= htmlspecialchars($name) ?></span>:
                        <span><?= htmlspecialchars($value) ?></span>
                    </div>
                    <form method="POST" style="margin:0;">
                        <input type="hidden" name="cookie_to_delete" value="<?= htmlspecialchars($name) ?>">
                        <button type="submit" name="delete_cookie" class="delete-single">Удалить</button>
                    </form>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>

    <h3>✏️ Создать новую cookie</h3>
    <form method="POST">
        <div class="form-group">
            <label><strong>Имя:</strong></label><br>
            <input type="text" name="cookie_name" placeholder="member_name, theme, last_visit"
                   style="width:320px;" required>
        </div>
        <div class="form-group">
            <label><strong>Значение:</strong></label><br>
            <input type="text" name="cookie_value" placeholder="значение" style="width:320px;" required>
        </div>
        <div class="form-group">
            <label><strong>Срок действия:</strong></label><br>
            <select name="expire_days">
                <option value="1">1 день</option>
                <option value="7">7 дней</option>
                <option value="30">30 дней</option>
                <option value="365">1 год</option>
            </select>
        </div>
        <button type="submit" name="set_cookie">➕ Создать cookie</button>
        <button type="submit" name="delete_all_cookies" class="delete-btn"
                onclick="return confirm('Удалить ВСЕ cookie?')">🗑️ Удалить все</button>
    </form>

    <h3 style="margin-top:25px;">💡 Примеры для проверки</h3>
    <ul>
        <li><code>member_name</code> = <code>Рассказчик</code></li>
        <li><code>theme</code> = <code>dark</code></li>
        <li><code>last_visit</code> = <code><?= date('Y-m-d') ?></code></li>
    </ul>

    <p>
        <a href="task2_view_cookies.php">🔍 Подробный просмотр всех cookies</a> |
        <a href="../index.html">← К оглавлению</a>
    </p>
</div>
</body>
</html>
