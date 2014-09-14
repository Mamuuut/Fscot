<?php

    function spamcheck( $field )
    {
        $field = filter_var( $field, FILTER_SANITIZE_EMAIL );
        return filter_var( $field, FILTER_VALIDATE_EMAIL );
    }

    $result .= $_POST['phpLocale'];

    if ( !spamcheck( $_REQUEST['customerMail'] )
        || !isset( $_POST['mailContent'] )
        || empty( $_POST['mailContent'] ) )
    {
        $result .= "spamcheck";
    } else {
        $to = "contact@fscot.com, mamut.delaunay@gmail.com";
        $subject = "FSCOT Booking - " . $_POST['customerName'];
        $body = $_POST['mailContent'];
        $headers = 'From: ' . $_POST['customerMail'] . "\r\n";

        ini_set('sendmail_from', 'me@domain.com'); //Suggested by "Some Guy"

        if ( mail( $to, $subject, $body, $headers ) )
        {
            $result .= "success";
        } else {
            $result .= "error";
        }
    }
    print_r( $result); echo "\n";
    exit();
?>