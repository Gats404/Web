<?php
// subscribe.php — подписка на рассылку через PHPMailer (Gmail SMTP).

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Неверный метод']);
    exit;
}

$email = trim($_POST['email'] ?? '');

if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Введите корректный email']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = '';   // ваш Gmail
    $mail->Password   = '';   // пароль приложения
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('no-reply@behoof.ru', 'Behoof — Рассылка');
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = '🔔 Подписка на скидки оформлена';
    $mail->Body    =
        "<div style='font-family:Arial,sans-serif;text-align:center;padding:20px;'>"
        . "<h2 style='color:#7000ff;'>Вы подписались на скидки Behoof!</h2>"
        . "<p style='font-size:18px;font-weight:bold;'>Спасибо!</p>"
        . "<p>Теперь вы первыми узнаёте о лучших ценах на электронику.</p>"
        . "<hr><small style='color:#888;'>Команда Behoof</small>"
        . "</div>";
    $mail->AltBody = 'Вы подписались на рассылку Behoof.';

    $mail->send();
    echo json_encode(['status' => 'success', 'message' => 'Проверьте почту!']);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка отправки. Попробуйте позже.']);
}
?>
