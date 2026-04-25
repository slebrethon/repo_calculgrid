<?php

$file = 'json_scores.json';

if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}

$scores = json_decode(file_get_contents($file), true);

echo json_encode($scores);