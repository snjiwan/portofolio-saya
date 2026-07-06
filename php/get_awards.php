<?php
require_once 'config.php';

header('Content-Type: application/json');

$metadataFile = UPLOAD_PATH_AWARDS . 'metadata.json';
$baseUrl = '/Portofolio/uploads/awards/';

if (!file_exists($metadataFile)) {
    echo json_encode(['success' => true, 'awards' => []]);
    exit;
}

$metadata = json_decode(file_get_contents($metadataFile), true) ?? [];

$awards = array_map(function ($item) use ($baseUrl) {
    return [
        'id' => $item['id'],
        'title' => htmlspecialchars($item['title']),
        'description' => htmlspecialchars($item['description'] ?? ''),
        'file_url' => $baseUrl . rawurlencode($item['filename']),
        'filename' => $item['filename'],
        'uploaded_at' => $item['uploaded_at'],
    ];
}, $metadata);

// Urutkan dari yang terbaru
$awards = array_reverse($awards);

echo json_encode(['success' => true, 'awards' => $awards]);
