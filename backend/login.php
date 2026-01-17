<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

include "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$username = $data["username"];
$password = $data["password"];

$query = $conn->query(
    "SELECT * FROM users WHERE username='$username' AND password='$password'"
);

echo json_encode([
    "success" => $query->num_rows > 0
]);
?>
