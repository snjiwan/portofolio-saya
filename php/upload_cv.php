<?php
session_start();
require_once 'config.php';

if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    jsonResponse(['success' => false, 'message' => 'Unauthorized'], 401);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'Method not allowed'], 405);
}

if (!isset($_FILES['cv_file']) || $_FILES['cv_file']['error'] !== UPLOAD_ERR_OK) {
    jsonResponse(['success' => false, 'message' => 'Gagal mengupload file'], 400);
}

$file = $_FILES['cv_file'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

if (!in_array($ext, ['pdf', 'doc', 'docx'])) {
    jsonResponse(['success' => false, 'message' => 'Hanya file PDF/DOC/DOCX yang diizinkan'], 400);
}

if ($file['size'] > MAX_FILE_SIZE) {
    jsonResponse(['success' => false, 'message' => 'Ukuran file maksimal 5MB'], 400);
}

// Hapus CV lama
$oldFiles = glob(UPLOAD_PATH_CV . '*');
foreach ($oldFiles as $old) {
    if (is_file($old)) unlink($old);
}

$filename = sanitizeFilename($file['name']);
$dest = UPLOAD_PATH_CV . $filename;

if (move_uploaded_file($file['tmp_name'], $dest)) {
    jsonResponse(['success' => true, 'message' => 'CV berhasil diupload', 'filename' => $filename]);
} else {
    jsonResponse(['success' => false, 'message' => 'Gagal menyimpan file'], 500);
}
