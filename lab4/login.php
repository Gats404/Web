<?php
/**
 * Задание 3: авторизация доступа с помощью сессий.
 * Форма входа. Пароли проверяются через password_verify() (bcrypt).
 *
 * Тестовые учётные данные:
 *   admin   / admin123    (роль admin)
 *   manager / manager123  (роль user)
 */
session_start();

// Уже авторизован — сразу в админ-панель
if (isset($_SESSION['user'])) {
    header('Location: admin.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $login    = trim($_POST['login'] ?? '');
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']);

    // Загрузка пользователей из JSON
    $usersFile = __DIR__ . '/users.json';
    $users = file_exists($usersFile)
        ? json_decode(file_get_contents($usersFile), true)
        : [];

    if (isset($users[$login]) && password_verify($password, $users[$login]['password_hash'])) {
        // Пересоздаём ID сессии для защиты от фиксации
        session_regenerate_id(true);

        $_SESSION['user']      = $login;
        $_SESSION['role']      = $users[$login]['role'];
        $_SESSION['name']      = $users[$login]['name'];
        $_SESSION['logged_at'] = time();

        // «Запомнить меня» — долгоживущая cookie с токеном
        if ($remember) {
            $token = bin2hex(random_bytes(32));
            $_SESSION['remember_token'] = $token;
            setcookie('remember_token', $token, time() + 30 * 24 * 3600, '/', '', false, true);
        }

        header('Location: admin.php');
        exit;
    }
    $error = 'Неверный логин или пароль';
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <title>Вход — Личный кабинет Behoof</title>
    <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family:'Segoe UI', Arial, sans-serif;
               background:linear-gradient(135deg, #7000ff 0%, #9a4dff 100%);
               min-height:100vh; display:flex; justify-content:center; align-items:center; }
        .login-container { background:#fff; border-radius:10px; box-shadow:0 15px 35px rgba(0,0,0,.4);
                           width:400px; padding:40px; }
        h2 { text-align:center; margin-bottom:25px; color:#222; }
        .form-group { margin-bottom:18px; }
        label { display:block; margin-bottom:5px; color:#666; font-weight:500; }
        input { width:100%; padding:12px; border:1px solid #ddd; border-radius:5px; font-size:16px; }
        input:focus { outline:none; border-color:#7000ff; }
        .checkbox-group { display:flex; align-items:center; margin-bottom:18px; }
        .checkbox-group input { width:auto; margin-right:10px; }
        button { width:100%; padding:12px; background:linear-gradient(135deg,#7000ff,#5a00cc);
                 color:#fff; border:none; border-radius:5px; font-size:16px; cursor:pointer; }
        button:hover { opacity:.92; }
        .error { background:#f8d7da; color:#721c24; padding:10px; border-radius:5px;
                 margin-bottom:18px; text-align:center; }
        .test-credentials { background:#f0f0f0; padding:10px; border-radius:5px; font-size:12px;
                            margin-top:20px; }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>🔐 Вход в личный кабинет Behoof</h2>

        <?php if ($error): ?>
            <div class="error"><?= htmlspecialchars($error) ?></div>
        <?php endif; ?>

        <form method="POST">
            <div class="form-group">
                <label>Логин</label>
                <input type="text" name="login" required autofocus>
            </div>
            <div class="form-group">
                <label>Пароль</label>
                <input type="password" name="password" required>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" name="remember" id="remember">
                <label for="remember" style="margin:0;">Запомнить меня</label>
            </div>
            <button type="submit">Войти</button>
        </form>

        <div class="test-credentials">
            <strong>📝 Тестовые данные:</strong><br>
            admin / admin123 (администратор)<br>
            manager / manager123 (пользователь)
        </div>
    </div>
</body>
</html>
