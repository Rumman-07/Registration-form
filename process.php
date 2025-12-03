<?php
header('Content-Type: application/json; charset=utf-8');
$raw = file_get_contents('php://input');
if(!$raw){ echo json_encode(['ok'=>false,'error'=>'No input']); exit; }
$data = json_decode($raw, true);
if(!$data){ echo json_encode(['ok'=>false,'error'=>'Invalid JSON']); exit; }
$errs = [];
if(empty($data['fullname'])) $errs[]='fullname';
if(empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) $errs[]='email';
if(empty($data['phone']) || strlen(preg_replace('/\D/','',$data['phone']))<10) $errs[]='phone';
if(count($errs)){ echo json_encode(['ok'=>false,'fields'=>$errs]); exit; }
$log = date('c') . ' | ' . json_encode($data, JSON_UNESCAPED_SLASHES) . PHP_EOL;
@file_put_contents(__DIR__.'/submissions.log', $log, FILE_APPEND | LOCK_EX);
echo json_encode(['ok'=>true,'saved'=>true]);
exit;
?>