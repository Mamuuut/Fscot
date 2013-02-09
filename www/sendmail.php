<?php

    function spamcheck( $field )
    {
        $field = filter_var( $field, FILTER_SANITIZE_EMAIL );
        return filter_var( $field, FILTER_VALIDATE_EMAIL );
    }
    
    $location = "Location: ./";
    $location .= "?ul=" . $_POST['phpLocale'];
    
    if ( !spamcheck( $_REQUEST['customerMail'] )
        || !isset( $_POST['mailContent'] ) 
        || empty( $_POST['mailContent'] ) ) 
    {
        $location .= "&mr=error";
    } else {
        $to = "contact@fscot.com, mamut.delaunay@gmail.com";
        $subject = "FSCOT Booking - " . $_POST['customerName'];
        $body = $_POST['mailContent'];  
        $headers = 'From: ' . $_POST['customerMail'] . "\r\n" .
        $headers .= 'Content-type: text/html; charset=UTF-8' . "\r\n" . 
        $headers .= 'Reply-To: ' . $_POST['customerMail'] . "\r\n" .
        $headers .= 'X-Mailer: PHP/' . phpversion();
        
        if ( mail( $to, $subject, $body, $headers ) ) 
        {
            $location .= "&mr=success";
        } else {
            $location .= "&mr=error";
        }
    }
    
    header( $location );
    exit();
?>