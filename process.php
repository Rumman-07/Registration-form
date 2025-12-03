<?php
// process.php — minimal JSON receiver
header('Content-Type: application/json');

$input = file_get_contents('php://input');
if (!$input) {
    echo json_encode(['ok'=>false,'error'=>'No JSON received']);
    exit;
}

$data = json_decode($input, true);
if (!$data) {
    echo json_encode(['ok'=>false,'error'=>'Invalid JSON']);
    exit;
}

// do server-side validation (very light)
$required = ['fullName','email','phone','dob','address','course','bio'];
foreach($required as $k){
    if (empty($data[$k])) {
        echo json_encode(['ok'=>false,'error'=>"Missing $k"]);
        exit;
    }
}

// Example: you could append to CSV here, or save to DB.
// For now return the received payload as confirmation.
echo json_encode(['ok'=>true,'received'=>$data]);
