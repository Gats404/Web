<?php
// send_mail.php — отправка заявки с формы через PHPMailer (Gmail SMTP).
// Письмо менеджеру + автоответ клиенту + поддержка вложения.

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

$name    = trim(htmlspecialchars($_POST['name']    ?? ''));
$phone   = trim(htmlspecialchars($_POST['phone']   ?? ''));
$email   = trim(htmlspecialchars($_POST['email']   ?? ''));
$message = trim(htmlspecialchars($_POST['message'] ?? ''));

if ($name === '' || $phone === '') {
    echo json_encode(['status' => 'error', 'message' => 'Заполните имя и телефон']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // ===== НАСТРОЙКИ SMTP (GMAIL) =====
    // Впишите свой Gmail и «пароль приложения» (App Password) Google.
    $mail->isSMTP();
    $mail->Host       = 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = '';   // ваш Gmail, напр. you@gmail.com
    $mail->Password   = '';   // пароль приложения (16 символов)
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    // ===== ПИСЬМО МЕНЕДЖЕРУ =====
    $mail->setFrom('no-reply@behoof.ru', 'Behoof');
    $mail->addAddress('support@behoof.ru', 'Поддержка');

    $mail->isHTML(true);
    $mail->Subject = '🧼 Новая заявка от ' . $name;
    $mail->Body    =
        "<h2>Новая заявка с сайта</h2>"
        . "<p><strong>Имя:</strong> $name</p>"
        . "<p><strong>Телефон:</strong> $phone</p>"
        . "<p><strong>Email:</strong> $email</p>"
        . "<p><strong>Сообщение:</strong> $message</p>";

    // Вложение (если приложено)
    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $mail->addAttachment($_FILES['attachment']['tmp_name'], $_FILES['attachment']['name']);
    }

    $mail->send();

    // ===== АВТООТВЕТ КЛИЕНТУ =====
    if ($email !== '' && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mail->clearAddresses();
        $mail->clearAttachments();
        $mail->addAddress($email, $name);
        $mail->Subject = '✅ Ваше обращение принято | Behoof';
        $mail->Body    =
            "<div style='font-family:Arial,sans-serif;color:#333;'>"
            . "<h2 style='color:#7000ff;'>Здравствуйте, $name!</h2>"
            . "<p>Благодарим за обращение в сервис <strong>Behoof</strong>.</p>"
            . "<p>Мы получили ваш вопрос и свяжемся с вами по номеру <strong>$phone</strong>.</p>"
            . "<hr><p style='font-size:12px;color:#888;'>Behoof — поиск и сравнение электроники.</p>"
            . "</div>";
        $mail->AltBody = "Здравствуйте, $name! Ваше обращение принято.";
        $mail->send();
    }

    echo json_encode(['status' => 'success', 'message' => 'Заявка отправлена! Проверьте почту.']);

} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Ошибка отправки: ' . $mail->ErrorInfo]);
}
?>
