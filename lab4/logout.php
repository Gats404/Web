<?php
/**
 * Задание 3: выход из системы — очистка сессии и удаление cookies.
 */
session_start();

// Очищаем массив сессии
$_SESSION = array();

// Удаляем cookie сессии
if (ini_get('session.use_cookies')) {
    $p = session_get_cookie_params();
    setcookie(session_name(), '', time() - 3600,
        $p['path'], $p['domain'], $p['secure'], $p['httponly']);
}

// Удаляем cookie «запомнить меня»
setcookie('remember_token', '', time() - 3600, '/', '', false, true);

// Уничтожаем сессию
session_destroy();

header('Location: login.php?logout=1');
exit;
?>
