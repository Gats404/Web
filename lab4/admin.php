<?php
/**
 * Задание 3: защищённая админ-панель.
 * Доступна только авторизованным; поддерживает «запомнить меня» и таймаут бездействия.
 */
session_start();

// Проверка авторизации
if (!isset($_SESSION['user'])) {
    if (isset($_COOKIE['remember_token'])) {
        // Демонстрация восстановления по cookie (в реальном проекте — сверка токена с БД)
        $_SESSION['user']     = 'admin';
        $_SESSION['role']     = 'admin';
        $_SESSION['name']     = 'Администратор';
        $_SESSION['restored'] = true;
        $_SESSION['logged_at'] = time();
    } else {
        header('Location: login.php');
        exit;
    }
}

// Таймаут бездействия — 15 минут
$timeout = 900;
if (isset($_SESSION['logged_at']) && (time() - $_SESSION['logged_at']) > $timeout) {
    header('Location: logout.php?expired=1');
    exit;
}
$_SESSION['logged_at'] = time();

$isAdmin = ($_SESSION['role'] === 'admin');
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Личный кабинет — Behoof</title>
    <style>
        body { font-family:'Segoe UI', Arial, sans-serif; background:#f5f5f5; margin:0; padding:20px; }
        .container { max-width:1100px; margin:0 auto; }
        .header { background:#fff; padding:20px; border-radius:8px; margin-bottom:20px;
                  box-shadow:0 2px 5px rgba(0,0,0,.1); display:flex;
                  justify-content:space-between; align-items:center; }
        .user-info { background:linear-gradient(135deg,#7000ff,#5a00cc); color:#fff;
                     padding:18px 25px; border-radius:8px; margin-bottom:20px; }
        .cards { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr));
                 gap:20px; margin-bottom:20px; }
        .card { background:#fff; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,.1); }
        .card h3 { margin-top:0; color:#7000ff; }
        .logout-btn { background:#dc3545; color:#fff; padding:10px 20px; text-decoration:none; border-radius:5px; }
        .stats { font-size:14px; color:#666; }
        table { width:100%; border-collapse:collapse; margin-top:15px; }
        th, td { border:1px solid #ddd; padding:10px; text-align:left; }
        th { background:#7000ff; color:#fff; }
        .badge { display:inline-block; padding:3px 8px; border-radius:3px; font-size:12px; font-weight:bold; color:#fff; }
        .badge-admin { background:#dc3545; }
        .badge-user { background:#28a745; }
        .restored-notice { background:#ffc107; color:#333; padding:10px; border-radius:5px;
                           margin-bottom:15px; text-align:center; }
    </style>
</head>
<body>
    <div class="container">
        <?php if (!empty($_SESSION['restored'])): ?>
            <div class="restored-notice">🔄 Сессия восстановлена по cookie «Запомнить меня»</div>
            <?php unset($_SESSION['restored']); ?>
        <?php endif; ?>

        <div class="header">
            <h1>🛡️ Админ-панель</h1>
            <a href="logout.php" class="logout-btn">Выйти</a>
        </div>

        <div class="user-info">
            <h2>Добро пожаловать, <?= htmlspecialchars($_SESSION['name']) ?>!</h2>
            <p><strong>Логин:</strong> <?= htmlspecialchars($_SESSION['user']) ?></p>
            <p><strong>Роль:</strong>
                <span class="badge <?= $isAdmin ? 'badge-admin' : 'badge-user' ?>">
                    <?= $isAdmin ? 'Администратор' : 'Пользователь' ?>
                </span>
            </p>
            <p><strong>Время входа:</strong> <?= date('Y-m-d H:i:s', $_SESSION['logged_at']) ?></p>
        </div>

        <div class="cards">
            <div class="card">
                <h3>📊 Статистика сессии</h3>
                <div class="stats">
                    <p><strong>ID сессии:</strong> <?= session_id() ?></p>
                    <p><strong>Имя сессии:</strong> <?= session_name() ?></p>
                    <p><strong>Таймаут бездействия:</strong> 15 минут</p>
                </div>
            </div>
            <div class="card">
                <h3>🍪 Cookie</h3>
                <div class="stats">
                    <p><strong>Session cookie:</strong> <?= isset($_COOKIE[session_name()]) ? 'установлена' : 'нет' ?></p>
                    <p><strong>Remember token:</strong> <?= isset($_COOKIE['remember_token']) ? 'установлен' : 'нет' ?></p>
                </div>
            </div>
            <div class="card">
                <h3>🔐 Безопасность</h3>
                <div class="stats">
                    <p>✅ session_regenerate_id()</p>
                    <p>✅ Хеширование паролей (bcrypt)</p>
                    <p>✅ Таймаут бездействия</p>
                    <p>✅ HttpOnly cookies</p>
                </div>
            </div>
        </div>

        <?php if ($isAdmin): ?>
            <div class="card">
                <h3>👥 Управление пользователями (только для администратора)</h3>
                <table>
                    <tr><th>Логин</th><th>Роль</th><th>Имя</th></tr>
                    <?php
                    $usersFile = __DIR__ . '/users.json';
                    if (file_exists($usersFile)) {
                        $users = json_decode(file_get_contents($usersFile), true);
                        foreach ($users as $login => $data):
                    ?>
                        <tr>
                            <td><?= htmlspecialchars($login) ?></td>
                            <td><?= htmlspecialchars($data['role']) ?></td>
                            <td><?= htmlspecialchars($data['name']) ?></td>
                        </tr>
                    <?php endforeach; } ?>
                </table>
            </div>
        <?php endif; ?>
    </div>
</body>
</html>
