<?php

    class server {

        private function spamcheck( $field )
        {
            $field = filter_var( $field, FILTER_SANITIZE_EMAIL );
            return filter_var( $field, FILTER_VALIDATE_EMAIL );
        }

        public function sendMail($customerMail, $mailContent, $locale) {

            if ( !$this->spamcheck( $customerMail )
                || !isset( $mailContent )
                || empty( $mailContent ) )
            {
                return array(
                    'msg' => 'spamcheckfailed'
                );
            } else {
                $to         = "mamut.delaunay@gmail.com";
                $subject    = "FSCOT Booking - " . $customerMail;
                $body       = $mailContent;
                $headers    = 'From: ' . $customerMail . "\r\n";

                ini_set('sendmail_from', 'me@domain.com'); //Suggested by "Some Guy"

                if ( mail( $to, $subject, $body, $headers ) )
                {
                    return array(
                        'msg' => 'mailsuccess'
                    );
                    return "mailsuccess";
                } else {
                    return array(
                        'msg' => 'mailerror'
                    );
                }
            }
        }
    }
?>