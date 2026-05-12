<?php

// config file include
require 'config.php';

if(isset($_POST['submit'])){

    // Form Data Collect
    $full_name  = $_POST['name'];
    $mobile_number  = $_POST['mobile'];
    $email_id = $_POST['email'];
    $address = $_POST['address'];
    $service_select = $_POST['service'];
    $message = $_POST['message'];
    $payment_status = $_POST['payment'];

    // Insert Query
    $sql = "INSERT INTO booking_detail (full_name, mobile_number, email_id, address, service_select, message, payment_status)
            VALUES (:name, :mobile, :email, :address, :service, :message, :payment)";

    $stmt = $pdo->prepare($sql);

    $stmt->execute([
        ':name'  => $full_name,
        ':mobile'=> $mobile_number,
        ':email' => $email_id,
        ':address' => $address,
        ':service' => $service_select,
        ':phone' => $phone,
        ':message' => $message,
        ':payment' => $payment_status,
        
    ]);

    echo "✅ Data Saved Successfully!";
}
?>
