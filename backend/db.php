<?php
$conn = new mysqli("localhost", "root", "", "tictactoe");
if ($conn->connect_error) {
    die("Database connection failed");
}
?>
