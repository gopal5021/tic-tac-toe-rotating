<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$username = $data["username"];
$stars = $data["stars"];
$feedback = $data["feedback"];

$stmt = $conn->prepare(
    "INSERT INTO ratings (username, stars, feedback) VALUES (?, ?, ?)"
);
$stmt->bind_param("sis", $username, $stars, $feedback);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false]);
}
?>
