<?php
session_start();
include "connection.php";

if (!isset($_SESSION['empid'])) {
    header("Location: http://127.0.0.1:5501/HTML/login.html");
    exit();
}

$emp_id = $_SESSION['empid'];

$sql = "SELECT * FROM STORE_LOGIN WHERE EMP_ID = :empid";
$stid = oci_parse($connection, $sql);
oci_bind_by_name($stid, ":empid", $emp_id);
oci_execute($stid);

$row = oci_fetch_assoc($stid);
?>

<!DOCTYPE html>
<html>
<head>
    <title>Profile</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body{
            font-family: 'Poppins', sans-serif;
            background: #f1f8e9;
            margin: 0;
            padding: 20px;
        }

        .title {
            text-align: center;
            color: #1b5e20;
            font-size: 36px;
            margin-bottom: 20px;
        }

        .profile-card {
            width: 450px;
            margin: auto;
            background: #fff;
            padding: 25px;
            border-radius: 16px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: flex;
            justify-content: center;
            animation: fadeSlideUp 0.8s ease-out;
        }

        @keyframes fadeSlideUp {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                tranform: translateY(0);
            }
        }

        .profile-img {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            display: block;
            margin: auto;
            border: 4px solid #a5d6a7;
        }

        .profile-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }

        .profile-table tr {
            height: 50px;
        }

        .profile-table th {
            background: #c8e6c9;
            color: #1b5e20;
            border-radius: 8px;
        }

        .back-btn {
            margin-top: 25px;
            width: 100%;
            padding: 12px;
            background: #4caf50;
            color: #fff;
            font-size: 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: 0.3s;
        }

        .back-btn:hover {
            background: #1b5e20;
        }
    </style>
</head>
<body>
    <h1 class="title">User Profile</h1>

    <div id="profile-card">
        <div class="profile-left">
            <img class="profile-img" src="" alt="">

            <table class="profile-table" border="0">
                <tr>
                    <th>Employee ID</th>
                    <td> </td>
                    <th><?php echo $row['EMP_ID']; ?></th>
                </tr>
                <tr style="height: 10px;"></tr>
                <tr>
                    <th>Role</th>
                    <td> </td>
                    <th><?php echo $row['ROLE']; ?></th>
                </tr>
            </table>

            <button class="back-btn" onclick="history.back()">Back</button>
        </div>
    </div>
</body>
</html>
