<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

header('Content-Type: text/plain; charset=utf-8');

// Only allow POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo "Method Not Allowed";
  exit;
}

// Load secrets from a server-only config file (NOT committed to GitHub)
// Option A (recommended): outside public web root (edit this path to match your host)
$configPath = __DIR__ . '/../../../private/mail_config.php';

// Option B (if you must keep config under public_html):
// $configPath = __DIR__ . '/config/mail_config.php';

if (!file_exists($configPath)) {
  http_response_code(500);
  echo "Server misconfiguration (missing mail config).";
  exit;
}
$config = require $configPath;

// Read inputs (use POST)
$name    = trim($_POST['name'] ?? '');
$email   = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? '');
$message = trim($_POST['message'] ?? '');

// Basic validation
if ($name === '' || $email === '' || $subject === '' || $message === '') {
  http_response_code(400);
  echo "Please fill in all fields.";
  exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo "Invalid email address.";
  exit;
}
// Prevent header injection
if (preg_match("/[\r\n]/", $email)) {
  http_response_code(400);
  echo "Invalid email address.";
  exit;
}

// Simple length limits (avoid abuse)
if (strlen($name) > 100 || strlen($subject) > 150 || strlen($message) > 5000) {
  http_response_code(400);
  echo "Message too long.";
  exit;
}

$mail = new PHPMailer(true);

try {
  $mail->isSMTP();
  $mail->Host       = $config['host'];
  $mail->SMTPAuth   = true;
  $mail->Username   = $config['username'];
  $mail->Password   = $config['password'];

  // SSL for 465, TLS for 587
  if (($config['secure'] ?? '') === 'ssl') {
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
  } else {
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  }
  $mail->Port = (int)$config['port'];

  // IMPORTANT: keep verification ON in production
  // (Do NOT disable verify_peer / allow_self_signed unless you truly have to)

  $mail->setFrom($config['from_email'], $config['from_name']);
  $mail->addAddress($config['to_email']);
  $mail->addReplyTo($email, $name);

  $mail->isHTML(false);
  $mail->Subject = 'Portfolio Contact: ' . $subject;
  $mail->Body =
    "You have a new message from your portfolio site.\n\n" .
    "Name: {$name}\n" .
    "Email: {$email}\n\n" .
    "Message:\n{$message}\n";

  // No debug output in production
  $mail->SMTPDebug = 0;

  $mail->send();
  echo "OK";

} catch (Exception $e) {
  // Log server-side only; don’t reveal SMTP details to visitors
  error_log("Mailer Error: " . $mail->ErrorInfo);
  http_response_code(500);
  echo "ERROR";
}
