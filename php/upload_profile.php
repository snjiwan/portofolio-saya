<?php
session_start();
require_once 'config.php';

define('UPLOAD_PATH_PROFILE', __DIR__ . '/../uploads/profile/');

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!isset($_FILES['profile_file']) || $_FILES['profile_file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'Gagal mengupload file'], 400);
}

$file = $_FILES['profile_file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
    jsonResponse(['success' => false, 'message' => 'Hanya file gambar (JPG, PNG, GIF, WebP) yang diizinkan'], 400);
}

if ($file['size'] > MAX_FILE_SIZE) {
    jsonResponse(['success' => false, 'message' => 'Ukuran file maksimal 5MB'], 400);
}

// Hapus foto profil lama
$oldFiles = glob(UPLOAD_PATH_PROFILE . '*');
foreach ($oldFiles as $old) {
    if (is_file($old) && !str_ends_with($old, '.gitkeep')) unlink($old);
}

$filename = 'profile.' . $ext;
$dest = UPLOAD_PATH_PROFILE . $filename;

if (move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(['success' => true, 'message' => 'Foto profil berhasil diupload']);
} else {
    jsonResponse(['success' => false, 'message' => 'Gagal menyimpan file'], 500);
}
