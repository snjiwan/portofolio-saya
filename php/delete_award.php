<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$id = $_POST['id'] ?? '';

if (empty($id)) {
    jsonResponse(['success' => false, 'message' => 'ID required'], 400);
}

$metadataFile = UPLOAD_PATH_AWARDS . 'metadata.json';

if (!file_exists($metadataFile)) {
    jsonResponse(['success' => false, 'message' => 'No data'], 404);
}

$metadata = json_decode(file_get_contents($metadataFile), true) ?? [];
$found = false;

foreach ($metadata as $k => $item) {
    if ($item['id'] === $id) {
        $filePath = UPLOAD_PATH_AWARDS . $item['filename'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }
        unset($metadata[$k]);
        $found = true;
        break;
    }
}

if (!$found) {
    jsonResponse(['success' => false, 'message' => 'Data not found'], 404);
}

file_put_contents($metadataFile, json_encode(array_values($metadata), JSON_PRETTY_PRINT));

jsonResponse(['success' => true, 'message' => 'Penghargaan berhasil dihapus']);
