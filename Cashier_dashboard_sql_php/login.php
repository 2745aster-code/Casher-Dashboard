<?php
session_start();
include "connection.php"; // must define $conn

// Get role from GET parameter
$role = $_GET['role'] ?? "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $emp_id = trim($_POST['empid']);
    $password = trim($_POST['password']);
    $role = trim($_POST['role']);

    // Validation
    if ($emp_id === "" || $password === "" || $role === "") {
        echo "<script>alert('All fields are required!'); window.history.back();</script>";
        exit();
    }

    // Secure SQL query
    $sql = "SELECT EMP_ID, PASSWORD, ROLE FROM STORE_LOGIN WHERE EMP_ID = :empid";

    $stid = oci_parse($connection, $sql);
    oci_bind_by_name($stid, ":empid", $emp_id);
    oci_execute($stid);

    $row = oci_fetch_assoc($stid);

    if (!$row) {
        echo "<script>alert('Employee ID not found'); window.history.back();</script>";
        exit();
    }

    // Check role
    if ($row['ROLE'] !== $role) {
        echo "<script>alert('Invalid role selected'); window.history.back();</script>";
        exit();
    }

    // Check password hash
    if ($password !== $row['PASSWORD']) {
        echo "<script>alert('Incorrect password'); window.history.back();</script>";
        exit();
    }

    // Store session and redirect
    $_SESSION['empid'] = $row['EMP_ID'];
    $_SESSION['role'] = $row['ROLE'];

    if ($role === "store_manager") {
        header("Location: http://127.0.0.1:5501/HTML/login.html");
        echo "<script>alert('Welcome Store Manager to the store.');</script>";
    }

    exit();
}
?>
