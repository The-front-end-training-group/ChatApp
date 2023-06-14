<?php
    $conn = mysqli_connect("localhost", "root", "", "chat", "3306");
    if(!$conn){
        echo "Database connected".mysqli_connext_error();
    }
?>