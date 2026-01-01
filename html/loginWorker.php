<?php
//use Workers\database;
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");

    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
    
function cors() {
    
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
            // may also be using PUT, PATCH, HEAD etc
            header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
            header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
        exit(0);
    }

}
cors();
$payload = json_decode(file_get_contents('php://input'),1);
if($payload){
    $db = new Workers\database();
    if(isset($payload["doviz"])){
        $data = $db->getTcmbData();
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["giris"])){
        header('Content-Type: application/json; charset=utf-8');
        $data = $db->validateLoginJWT($payload["email"], $payload["password"]);
       
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["cikis"])){
        $data = $db->kullaniciCikis($_COOKIE['sirketID'],$_COOKIE['userID'],$_COOKIE['yetki']);
        echo json_encode($data,TRUE);
        return;
    }

}
else{
    
    $ret = array("status"=>0,"message"=>"no payload","header"=>"hata","data"=>"");
    echo json_encode($ret,TRUE);
    return;
}

//var_dump($_POST);
