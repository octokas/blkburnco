<?php
    $from = 'nK Contact Form';
    $to = 'nkdevinfo@gmail.com';
    $subject = 'Message from nK contact form';

    function errorHandler ($message) {
        die(json_encode(array(
            'type'     => 'error',
            'response' => $message
        )));
    }

    function successHandler ($message) {
        die(json_encode(array(
            'type'     => 'success',
            'response' => $message
        )));
    }

    // remove it if your php finally configured
    successHandler('This is demo message from PHP');

    if ( isset( $_SERVER['HTTP_X_REQUESTED_WITH'] ) && 'XMLHttpRequest' === $_SERVER['HTTP_X_REQUESTED_WITH']) {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $message = $_POST['message'];

        // sanitize fields
        $name = filter_var($name, FILTER_SANITIZE_STRING);
        $email = filter_var($email, FILTER_SANITIZE_EMAIL);
        $message = nl2br($message, false); // false gives <br>, true gives <br />
		$message_arr = explode('<br>', $message);
		$message = '';
		foreach ( $message_arr as $key => $val ) {
	        $val = urldecode($val);
	        $val = filter_var($val, FILTER_SANITIZE_STRING);
	        $val = filter_var($val, FILTER_SANITIZE_SPECIAL_CHARS);
	        $message .= $val . '<br>';
		}

        $pattern = '/[\r\n]|Content-Type:|Bcc:|Cc:/i';
        if ( preg_match($pattern, $name) || preg_match($pattern, $email) ) {
            errorHandler('Header injection detected.');
        }

        // Check if name has been entered
        if ( ! $name ) {
            errorHandler('Please enter your name.');
        }

        // Check if email has been entered and is valid
        if ( ! $email ) {
            errorHandler('Please enter a valid email address.');
        }

        // Check if message has been entered
        if ( ! $message ) {
            errorHandler('Please enter your message.');
        }

        // prepare headers
        $headers  = 'MIME-Version: 1.1' . PHP_EOL;
        $headers .= 'Content-type: text/html; charset=utf-8' . PHP_EOL;
        $headers .= "From: $name <$email>" . PHP_EOL;
        $headers .= "Return-Path: $to" . PHP_EOL;
        $headers .= "Reply-To: $email" . PHP_EOL;
        $headers .= "X-Mailer: PHP/". phpversion() . PHP_EOL;

        // prepare body
        $body = "From: $name<br> E-Mail: $email<br> Message:<br> $message";

        // If there are no errors, send the email
        $result = @mail($to, $subject, $body, $headers);
        if ( $result ) {
            successHandler('Thank You! I will be in touch');
        } else {
            errorHandler('Sorry there was an error sending your message. Please check server PHP mail configuration.');
        }
    } else {
        errorHandler('Allowed only XMLHttpRequest.');
    }
?>
