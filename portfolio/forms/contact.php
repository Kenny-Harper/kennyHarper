<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

header('Content-Type: text/plain; charset=utf-8');

// if ($_SERVER["REQUEST_METHOD"] !== "POST") {
//   http_response_code(405);
//   echo "Method Not Allowed";
//   exit;
// }

$name    = trim($_REQUEST["name"] ?? "");
$email   = trim($_REQUEST["email"] ?? "");
$subject = trim($_REQUEST["subject"] ?? "");
$message = trim($_REQUEST["message"] ?? "");

if ($name === "" || $email === "" || $subject === "" || $message === "") {
  http_response_code(400);
  echo "Please fill in all fields.";
  exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "Invalid email address.";
  exit;
}

// ---- LOG FILE (so we can see what happened even if the page hides it)
$logFile = __DIR__ . '/mail_debug.log';
file_put_contents($logFile, "\n---- " . date('Y-m-d H:i:s') . " ----\n", FILE_APPEND);

$mail = new PHPMailer(true);

$mail->SMTPOptions = array(
    'ssl' => array(
        'verify_peer' => false,
        'verify_peer_name' => false,
        'allow_self_signed' => true
    )
); 

try {
  $mail->isSMTP();
  $mail->Host       = 'smtp.gmail.com';
  $mail->SMTPAuth   = true;
  $mail->Username   = 'kennyharper02@gmail.com';

  // IMPORTANT: app password with NO spaces
  $mail->Password   = '';

  $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
  $mail->Port       = 465;

  // Debug output goes to log file
  $mail->SMTPDebug = 2;
  $mail->Debugoutput = function($str, $level) use ($logFile) {
    file_put_contents($logFile, "DEBUG[$level]: $str\n", FILE_APPEND);
  };

  $mail->setFrom('kennyharper02@gmail.com', 'Portfolio Contact');
  $mail->addReplyTo($email, $name);
  $mail->addAddress('kennyharper02@gmail.com');

  $mail->isHTML(false);
  $mail->Subject = 'Portfolio Contact: ' . $subject;
  $mail->Body =
    "You have a new message from your portfolio site.\n\n" .
    "Name: {$name}\n" .
    "Email: {$email}\n\n" .
    "Message:\n{$message}\n";

  $mail->send();

  echo "OK";
} catch (Exception $e) {
  http_response_code(500);
  $msg = "Mailer Error: " . $mail->ErrorInfo;
  file_put_contents($logFile, $msg . "\n", FILE_APPEND);
  echo $msg;
}
