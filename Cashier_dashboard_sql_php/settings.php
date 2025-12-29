<?php
session_start();
if (!isset($_SESSION['empid'])) {
    header("Location: http://127.0.0.1:5501/HTML/login.html");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head><title>Settings</title></head>
<body>
    <h1>Settings</h1>

    <ul>
        <li>Change Password</li>
        <li>Change Theme</li>
        <li>Preferences</li>
    </ul>

    <button onclick="window.location.href='dashboard.php'">Back</button>
</body>
</html>