<?php
header('Content-Type: application/json');

$baseUrl = '/Portofolio/uploads/profile/';
$files = glob(__DIR__ . '/../uploads/profile/profile.*');

$profileFiles = array_filter($files, function ($f) {
    return is_file($f) && !str_ends_with($f, '.gitkeep');
});

if (empty($profileFiles)) {
    echo json_encode(['success' => false, 'has_photo' => false]);
    exit;
}

$latest = end($profileFiles);
$filename = basename($latest);

echo json_encode([
    'success' => true,
    'has_photo' => true,
    'url' => $baseUrl . $filename,
]);
