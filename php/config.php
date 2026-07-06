<?php
// Konfigurasi Upload
define('UPLOAD_PATH_CV', __DIR__ . '/../uploads/cv/');
define('UPLOAD_PATH_AWARDS', __DIR__ . '/../uploads/awards/');
define('ALLOWED_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx']);
define('MAX_FILE_SIZE', 5 * 1024 * 1024); // 5MB

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function sanitizeFilename($filename) {
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $name = pathinfo($filename, PATHINFO_FILENAME);
    $name = preg_replace('/[^a-zA-Z0-9_-]/', '_', $name);
    $name = substr($name, 0, 50);
    return $name . '_' . time() . '.' . $ext;
}
