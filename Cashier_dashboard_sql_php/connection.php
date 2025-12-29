<?php
$username = "*******";
$password = "*********";
$connection_string = "//*********:****/**";

$connection = oci_connect($username, $password, $connection_string);

if(!$connection) {
    $e = oci_error();
    die("Oracle Connection Failed: " . $e['message']);
}
// else {
//     echo "Connection Successful";
// }
?>