<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

// Handle preflight (Chrome sends OPTIONS first)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$raw = file_get_contents("php://input");
file_put_contents("debug_raw.txt", $raw);

$data = json_decode($raw, true);
file_put_contents("debug.txt", print_r($data, true));

include "connection.php";

$sql = "INSERT INTO BILLS (CUSTOMER_NAME, CUSTOMER_PHONE, SUBTOTAL, GST, GRAND_TOTAL)
        VALUES (:cname, :cphone, :subtotal, :gst, :grandtotal)
        RETURNING BILL_ID INTO :bill_id";

$stid = oci_parse($connection, $sql);

oci_bind_by_name($stid, ":cname", $data["customer_name"]);
oci_bind_by_name($stid, ":cphone", $data["customer_phone"]);
oci_bind_by_name($stid, ":subtotal", $data["subtotal"]);
oci_bind_by_name($stid, ":gst", $data["gst"]);
oci_bind_by_name($stid, ":grandtotal", $data["grand_total"]);

oci_bind_by_name($stid, ":bill_id", $bill_id, 40);

oci_execute($stid);

foreach($data["items"] as $item) {
    $sqlItem = "INSERT INTO BILL_ITEMS (BILL_ID, PRODUCT_NAME, QUANTITY, PRICE, TOTAL)
                VALUES (:bid, :pname, :qty, :price, :total)";
    
    $stidItem = oci_parse($connection, $sqlItem);

    oci_bind_by_name($stidItem, ":bid", $bill_id);
    oci_bind_by_name($stidItem, ":pname", $item["product_name"]);
    oci_bind_by_name($stidItem, ":qty", $item["quantity"]);
    oci_bind_by_name($stidItem, ":price", $item["price"]);
    oci_bind_by_name($stidItem, ":total", $item["total"]);

    oci_execute($stidItem);
}

oci_close($connection);

echo "Bill saved with ID: $bill_id";
?>
