<?php
// reviews.php — хранение отзывов в текстовом файле (JSON).
// Подключается из index.php; читает существующие и принимает новые отзывы.

$filename = __DIR__ . '/reviews.txt';
$messages = [];

// Чтение существующих отзывов
if (file_exists($filename)) {
    $content = file_get_contents($filename);
    if ($content !== '') {
        $messages = json_decode($content, true);
        if (!is_array($messages)) {
            $messages = [];
        }
    }
}

// Обработка нового отзыва
if ($_SERVER['REQUEST_METHOD'] === 'POST'
    && isset($_POST['review_name'], $_POST['review_text'])) {

    $name = htmlspecialchars(trim($_POST['review_name']));
    $text = htmlspecialchars(trim($_POST['review_text']));

    if ($name !== '' && $text !== '') {
        array_unshift($messages, [
            'name' => $name,
            'text' => $text,
            'date' => date('d.m.Y H:i'),
        ]);

        // Храним последние 50
        if (count($messages) > 50) {
            $messages = array_slice($messages, 0, 50);
        }

        file_put_contents($filename,
            json_encode($messages, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        // Redirect-after-POST, чтобы избежать повторной отправки при F5
        header("Location: index.php#reviews");
        exit;
    }
}
?>
