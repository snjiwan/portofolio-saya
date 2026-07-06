<?php
require_once 'config.php';

header('Content-Type: application/json');

$files = glob(UPLOAD_PATH_CV . '*');
$cvFiles = array_filter($files, function ($f) {
    return is_file($f) && !str_ends_with($f, '.gitkeep');
});

if (empty($cvFiles)) {
    echo json_encode(['success' => false, 'message' => 'Belum ada CV']);
    exit;
}

// Ambil file terbaru
$latest = end($cvFiles);
$filename = basename($latest);
$url = '/Portofolio/uploads/cv/' . rawurlencode($filename);

echo json_encode([
    'success' => true,
    'filename' => $filename,
    'url' => $url,
]);
