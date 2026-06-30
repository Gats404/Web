<?php
/**
 * Задание 2: вспомогательная страница — подробный просмотр всех cookies.
 */
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Просмотр всех Cookies</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background:#f5f5f5; margin:30px; line-height:1.6; }
        .container { max-width:800px; margin:0 auto; background:#fff; border-radius:8px;
                     padding:30px; box-shadow:0 5px 15px rgba(0,0,0,.1); }
        h1 { color:#333; border-bottom:2px solid #c0392b; padding-bottom:10px; }
        table { width:100%; border-collapse:collapse; margin-top:20px; }
        th, td { border:1px solid #ddd; padding:12px; text-align:left; }
        th { background:#c0392b; color:#fff; }
        tr:nth-child(even) { background:#f9f9f9; }
        .empty { text-align:center; color:#666; padding:40px; }
        .back-link { display:inline-block; margin-top:20px; padding:10px 20px; background:#c0392b;
                     color:#fff; text-decoration:none; border-radius:5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🍪 Все cookies на этом сайте</h1>

        <?php if (empty($_COOKIE)): ?>
            <div class="empty">
                <p>На этом сайте пока нет cookies.</p>
                <p>Вернитесь на <a href="task2_cookie.php">страницу задания 2</a> и создайте cookie.</p>
            </div>
        <?php else: ?>
            <table>
                <thead>
                    <tr><th>Имя</th><th>Значение</th><th>Длина (символов)</th></tr>
                </thead>
                <tbody>
                    <?php foreach ($_COOKIE as $name => $value): ?>
                        <tr>
                            <td><strong><?= htmlspecialchars($name) ?></strong></td>
                            <td><?= htmlspecialchars($value) ?></td>
                            <td><?= strlen($value) ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
            <p style="margin-top:15px;">
                Всего cookies: <strong><?= count($_COOKIE) ?></strong>,
                общий объём: ~<strong><?= array_sum(array_map('strlen', $_COOKIE)) ?></strong> байт
            </p>
        <?php endif; ?>

        <a href="task2_cookie.php" class="back-link">← Назад к заданию 2</a>
    </div>
</body>
</html>
