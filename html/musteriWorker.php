<?php
use Workers\database;
use Workers\musteriDatabase;

include_once($_SERVER['DOCUMENT_ROOT']."/vendor/autoload.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");




if($debug == 1){
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

header('Content-Type: application/json; charset=utf-8');
$reqContent = file_get_contents('php://input');
$payload = json_decode($reqContent,1);
if($payload){
    $ret = array("status"=>0,"message"=>"no payload","header"=>"hata","data"=>"");
    $db = new musteriDatabase();
    if(isset($payload["epostaDogrulama"])){
        $tekrarYolla=FALSE;
        if(isset($payload["tekrarYolla"])){
            $tekrarYolla=TRUE;
        }
        $data = $db->epostaDogrulama($payload["epostaDogrulama"],$payload["teklifUUID"],$tekrarYolla);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["kodDogrulama"])){
        $data = $db->kodDogrulama($payload["kodMail"],$payload["teklifUUID"],$payload["kodDogrulama"]);
        echo json_encode($data,TRUE);
        return;
    }
    echo json_encode($ret,TRUE);
    return;
    
}
else{
    $ret = array("status"=>0,"message"=>"İstem YOK","header"=>"Info","data"=>$reqContent);
    
    echo json_encode($ret,TRUE);
    return;
}

function formatPrice($price,$currency){
    $price = floatval($price);
    $fmt = new NumberFormatter( 'tr_TR', NumberFormatter::CURRENCY );
    $prcFormatted = $fmt->formatCurrency($price, $currency);
    return $prcFormatted;
}

function yaziDuzelt($yazi){
    if($yazi){
        $yazi=str_replace("u015f","ş",$yazi);
        $yazi=str_replace("u00f6","ö",$yazi);
        $yazi=str_replace("u00fc", "ü",$yazi);
        $yazi=str_replace("u011f", "ğ",$yazi);
        $yazi=str_replace("u00dc", "Ü",$yazi);
        $yazi=str_replace("u00d6", "Ö",$yazi);
        $yazi=str_replace("u015e", "Ş",$yazi);
        $yazi=str_replace("u011e", "Ğ",$yazi);
        $yazi=str_replace("u0130", "I",$yazi);
        $yazi=str_replace("u0131", "ı",$yazi);
        $yazi=str_replace("u00e7", "ç",$yazi);
        $yazi=str_replace("u00c7", "Ç",$yazi);
        $yazi=str_replace("&#039;", "'",$yazi);
        
    }
    return $yazi;
}