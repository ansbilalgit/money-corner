<?php
function connect() {
    // $connection = new mysqli("localhost", 'root', '', 'mornie4j_mcndb');
    // $connection = new mysqli("208.91.198.197:3306", 'mcornertech_user', 'VJ1VMsq{07h!', 'mornie4j_mcndb');
    //  $connection = new mysqli("localhost", 'u286598295_findstockuser', 'LJ^uTHC^1Pf', 'u286598295_findstockdb');
       $connection = new mysqli("localhost", 'root', '', 'money-technologies');
    if ($connection->connect_error) {
        die("Connection failed: " . $connection->connect_error);
    }
    return $connection;
}
$conn = connect();
?>