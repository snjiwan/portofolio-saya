<?php
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    jsonResponse(['success' => false, 'message' => 'Semua field wajib diisi'], 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['success' => false, 'message' => 'Email tidak valid'], 400);
}

$messagesDir = __DIR__ . '/../uploads/messages/';
if (!is_dir($messagesDir)) {
    mkdir($messagesDir, 0777, true);
}

$messagesFile = $messagesDir . 'messages.json';
$messages = [];
if (file_exists($messagesFile)) {
    $messages = json_decode(file_get_contents($messagesFile), true) ?? [];
}

$newMessage = [
    'id' => uniqid(),
    'name' => htmlspecialchars($name),
    'email' => htmlspecialchars($email),
    'subject' => htmlspecialchars($subject),
    'message' => nl2br(htmlspecialchars($message)),
    'received_at' => date('Y-m-d H:i:s'),
    'read' => false,
];

array_unshift($messages, $newMessage);

file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT));

jsonResponse(['success' => true, 'message' => 'Pesan berhasil dikirim!']);
