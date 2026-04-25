<?php

header("Content-Type: application/json");

// Lire données
$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["score"])) {
    echo json_encode(["status" => "error", "message" => "no data"]);
    exit;
}

$file = 'json_scores.json';

// Lire fichier
if (file_exists($file)) {
    $content = file_get_contents($file);
    $scores = json_decode($content, true);
    if (!is_array($scores)) $scores = [];
} else {
    $scores = [];
}

// Ajouter score
$scores[] = [
    "score" => intval($data["score"]),
    "date" => date("Y-m-d H:i:s")
];

// Trier
usort($scores, function($a, $b) {
    return $b['score'] - $a['score'];
});

// Limite
$scores = array_slice($scores, 0, 50);

// Sauvegarde
if (file_put_contents($file, json_encode($scores, JSON_PRETTY_PRINT), LOCK_EX)) {
    echo json_encode(["status" => "ok"]);
} else {
    echo json_encode(["status" => "error", "message" => "write failed"]);
}