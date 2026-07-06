<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

$title = trim($_POST['title'] ?? '');
$description = trim($_POST['description'] ?? '');

if (empty($title)) {
    jsonResponse(['success' => false, 'message' => 'Judul wajib diisi'], 400);
}

if (!isset($_FILES['award_file']) || $_FILES['award_file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'Gagal mengupload file'], 400);
}

$file = $_FILES['award_file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
    jsonResponse(['success' => false, 'message' => 'Hanya file gambar (JPG, PNG, GIF, WebP) yang diizinkan'], 400);
}

if ($file['size'] > MAX_FILE_SIZE) {
    jsonResponse(['success' => false, 'message' => 'Ukuran file maksimal 5MB'], 400);
}

$filename = sanitizeFilename($file['name']);
$dest = UPLOAD_PATH_AWARDS . $filename;

if (!move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(['success' => false, 'message' => 'Gagal menyimpan file'], 500);
}

// Simpan metadata
$metadataFile = UPLOAD_PATH_AWARDS . 'metadata.json';
$metadata = [];
if (file_exists($metadataFile)) {
    $metadata = json_decode(file_get_contents($metadataFile), true) ?? [];
}

$metadata[] = [
    'id' => uniqid(),
    'filename' => $filename,
    'title' => $title,
    'description' => $description,
    'uploaded_at' => date('Y-m-d H:i:s'),
];

file_put_contents($metadataFile, json_encode($metadata, JSON_PRETTY_PRINT));

jsonResponse(['success' => true, 'message' => 'Penghargaan berhasil diupload']);
