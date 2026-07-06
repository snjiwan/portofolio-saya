<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

$messagesFile = __DIR__ . '/../uploads/messages/messages.json';

if (!file_exists($messagesFile)) {
    echo json_encode(['success' => true, 'messages' => []]);
    exit;
}

$messages = json_decode(file_get_contents($messagesFile), true) ?? [];

echo json_encode(['success' => true, 'messages' => $messages]);
