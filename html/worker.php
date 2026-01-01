<?php
include_once($_SERVER['DOCUMENT_ROOT']."/vendor/autoload.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");
//include_once($_SERVER['DOCUMENT_ROOT']."/session.php");
//include_once($_SERVER['DOCUMENT_ROOT']."/writeExcell.php");
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

// Hata yakalama ve JSON dönüş için ayarlar
error_reporting(E_ALL);
ini_set('display_errors', 0); // Hataları JSON'a dahil etmemek için 0 yapın

// JSON header'ını en başta ayarla
header('Content-Type: application/json; charset=utf-8');

// Hata yakalama fonksiyonu
function handleFatalError() {
    $error = error_get_last();
    if ($error !== NULL && $error['type'] === E_ERROR) {
        $response = array(
            'status' => 0,
            'message' => 'PHP Fatal Error: ' . $error['message'],
            'file' => $error['file'],
            'line' => $error['line']
        );
        echo json_encode($response);
        exit();
    }
}

// Fatal error handler'ı kaydet
register_shutdown_function('handleFatalError');

// Exception handler
set_exception_handler(function($exception) {
    $response = array(
        'status' => 0,
        'message' => 'PHP Exception: ' . $exception->getMessage(),
        'file' => $exception->getFile(),
        'line' => $exception->getLine()
    );
    echo json_encode($response);
    exit();
});

$debug=true;
//$debug=0;
$version="v=1.1.6";

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

if($debug == 1){
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

if($debug == 0){
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}
$email = "";
$userID ="";
$sirketID =1;
$yetki="0";
$kullaniciAdi="-";

function getJWTUser() {
    $headers = getallheaders();
    if (!isset($headers['Authorization'])) return false;
    $authHeader = $headers['Authorization'];
    if (strpos($authHeader, 'Bearer ') !== 0) return false;
    $jwt = substr($authHeader, 7);
    $secretKey = getenv('JWT_SECRET') ?: 'your_secret_key';
    try {
        $decoded = JWT::decode($jwt, new Key($secretKey, 'HS256'));
        return (array)$decoded;
    } catch (Exception $e) {
        return false;
    }
}

function parseAndValidateJWT() {
    $headers = getallheaders();
    header('Content-Type: application/json; charset=utf-8');
    $relogin=0;
    if (!isset($headers['Authorization'])) {
        //error_log("JWT header yok");
        $ret = array("status"=>-99,"message"=>"JWT header yok","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return false;
    }
    $authHeader = $headers['Authorization'];
    if (strpos($authHeader, 'Bearer ') !== 0) {
        //error_log("JWT Bearer formatı hatalı");
        $ret = array("status"=>-99,"message"=>"JWT Bearer formatı hatalı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
        return false;
    }
    $jwt = substr($authHeader, 7);
    $secretKey = getenv('JWT_SECRET') ?: 'your_secret_key';
    try {
        $decoded = \Firebase\JWT\JWT::decode($jwt, new \Firebase\JWT\Key($secretKey, 'HS256'));
        return $decoded;
    } catch (Exception $e) {
        return false;
    }

   
}
// JWT ile kullanıcı bilgisi al

//$jwtUser = getJWTUser();
$jwtUser = parseAndValidateJWT();
$relogin=0;
if ($jwtUser) {
    $sirketID = $jwtUser->sirketID ?:false;
    $userID   = $jwtUser->userID ?:false;
    $yetki    = $jwtUser->yetki ?: 0;
    $kullaniciAdi = $jwtUser->kullaniciAdi ?:false;
    $email    = $jwtUser->email ?:false;
} else {
    $relogin=1;
}


if($relogin!=0){
    header('Content-Type: application/json; charset=utf-8');
    $db = new Workers\database();
    $db->kullaniciCikis(0,0,0);
    $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
    echo json_encode($ret,TRUE);
    return;
	//echo "relogin:".$relogin."--";
	//logout();
}
if(isset($_POST["takvimFilter"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    $start= $_POST["start"];
    $end = $_POST["end"];
    if($_POST["takvimFilter"]=="classes" || $_POST["takvimFilter"]=="events"){
        $data = $db->takvimGetData($sirketID,$userID,$yetki,$start,$end);
        echo json_encode($data,TRUE);
        return;
    }
    
}
header('Content-Type: application/json; charset=utf-8');
if(isset($_FILES["masrafEklefile"])) {
    $return = array("status"=>0,"message"=>"","data"=>array());
    try {

         if (
                !isset($_FILES['masrafEklefile']['error']) ||
                is_array($_FILES['masrafEklefile']['error'])
            ) {
                throw new RuntimeException('Geçersiz dosya yükleme parametresi.');
            }
        switch ($_FILES['masrafEklefile']['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new RuntimeException('Yüklenecek dosya bulunamadı');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $maxSize = (int)ini_get("upload_max_filesize");
                throw new RuntimeException("Dosya boyut limiti aşıldı. Max boyut = $maxSize Mb");
            default:
                throw new RuntimeException('Bilinmeyen hata oluştu.');
        }


        $target_dir = "assets/faturalar/";
        $target_file = $target_dir . basename($_FILES["masrafEklefile"]["name"]);
        $targetToSend = "../../".$target_file;
        $return["data"]["target"]=$targetToSend;
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        $return["data"]["type"]=$imageFileType;
        // Check if file already exists
        if (file_exists($target_file)) {
            $return["message"].= "Dosya zaten mevcut.";
            $uploadOk = 2;
        }


        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "pdf" ) {
            $return["message"].= "Dosya jpg, png ya da pdf olmalı.";
            $uploadOk = 0;
        }
        $return["status"]=$uploadOk;

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 1) {
            if (move_uploaded_file($_FILES["masrafEklefile"]["tmp_name"], $target_file)) {
                $return["message"]= htmlspecialchars( basename( $_FILES["masrafEklefile"]["name"])). " dosyası yüklendi.";
            } else {
                $return["message"].= htmlspecialchars( basename( $_FILES["masrafEklefile"]["name"]))." dosya yüklenirken hata oluştu";
            }
        }
        if($uploadOk==2){
            $return["status"]=1;
        }
        echo json_encode($return,TRUE);
        return;
    } catch (RuntimeException $e) {
        $return["status"]=0;
        $return["message"]=$e->getMessage();
        $return["data"]="";
        echo json_encode($return,TRUE);
        return;

    }
}
if(isset($_FILES["mutabakatfile"])) {
    $return = array("status"=>0,"message"=>"","data"=>array());
    try {

         if (
                !isset($_FILES['mutabakatfile']['error']) ||
                is_array($_FILES['mutabakatfile']['error'])
            ) {
                throw new RuntimeException('Geçersiz dosya yükleme parametresi.');
            }
        switch ($_FILES['mutabakatfile']['error']) {
            case UPLOAD_ERR_OK:
                break;
            case UPLOAD_ERR_NO_FILE:
                throw new RuntimeException('Yüklenecek dosya bulunamadı');
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $maxSize = (int)ini_get("upload_max_filesize");
                throw new RuntimeException("Dosya boyut limiti aşıldı. Max boyut = $maxSize Mb");
            default:
                throw new RuntimeException('Bilinmeyen hata oluştu.');
        }


        $target_dir = "assets/mutabakatlar/";
        $target_file = $target_dir . basename($_FILES["mutabakatfile"]["name"]);
        $targetToSend = "../../".$target_file;
        if (!is_dir($_SERVER["DOCUMENT_ROOT"]."/".$target_dir)){
            mkdir($_SERVER["DOCUMENT_ROOT"]."/".$target_dir, 0775, true);
        }
        $return["data"]["target"]=$targetToSend;
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
        $return["data"]["type"]=$imageFileType;
        // Check if file already exists
        if (file_exists($target_file)) {
            $return["message"].= "Dosya zaten mevcut.";
            $uploadOk = 2;
        }


        // Allow certain file formats
        if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "pdf" && $imageFileType != "xls" && $imageFileType != "xlsx" ) {
            $return["message"].= "Dosya jpg, png ya da pdf olmalı.";
            $uploadOk = 0;
        }
        $return["status"]=$uploadOk;

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 1) {
            if (move_uploaded_file($_FILES["mutabakatfile"]["tmp_name"], $target_file)) {
                $return["message"]= htmlspecialchars( basename( $_FILES["mutabakatfile"]["name"])). " dosyası yüklendi.";
            } else {
                $return["message"].= htmlspecialchars( basename( $_FILES["mutabakatfile"]["name"]))." dosya yüklenirken hata oluştu";
            }
        }
        if($uploadOk==2){
            $return["status"]=1;
        }
        echo json_encode($return,TRUE);
        return;
    } catch (RuntimeException $e) {
        $return["status"]=0;
        $return["message"]=$e->getMessage();
        $return["data"]="";
        echo json_encode($return,TRUE);
        return;

    }
}
$reqContent = file_get_contents('php://input');
$payload = json_decode($reqContent,1);
if($payload){
    $ret = array("status"=>0,"message"=>"no payload","header"=>"hata","data"=>"");
    $db = new Workers\database();
    if(isset($payload["doviz"])){
        $data = $db->getTcmbData();
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["bul"])){
        if($payload["bul"] == "acentaBul"){
            $db = new Workers\database();
            $data = $db->acentaSelectListe($sirketID,$userID,$yetki,$payload["q"]);
            echo json_encode($data,TRUE);
            return;
        }
        if($payload["bul"] == "calisanBul"){
            $db = new Workers\database();
            $data = $db->acentaCalisanSelectListe($sirketID,$userID,$yetki,$payload["acentaID"],$payload["q"]);
            echo json_encode($data,TRUE);
            return;
        }
      
    }

    if(isset($payload["wait"])){
       $return = array("status"=>0,"message"=>"Bekleme Tamamlandı","header"=>"Veri yok!","data"=>"");
       sleep(10);
        echo json_encode($return,TRUE);
        return;
    }
    #region Acenta
    //AcentaEkleGrupLoad($sirketID,$userID,$yetki,$query)
    
    if(isset($payload["acentaEkleGrupLoad"])){
        if(isset($payload["q"])){
            $data = $db->AcentaEkleGrupLoad($sirketID,$userID,$yetki,$payload["q"]);
        }
        else{
            $data = $db->AcentaEkleGrupLoad($sirketID,$userID,$yetki,"");
        }
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaEkle"])){
       $data = $db->acentaEkle($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaSil"])){
        $data = $db->acentaSil($sirketID,$userID,$yetki,$payload["acentaSil"]);
         echo json_encode($data,TRUE);
         return;
     }
    if(isset($payload["acentaListele"])){
        $db = new Workers\database();
        $data = $db->acentaListele($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaDuzenleVeri"])){
        $db = new Workers\database();
        $data = $db->acentaDuzenleVeri($sirketID,$userID,$yetki,$payload["acentaDuzenleVeri"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaDuzenleKaydet"])){
        $db = new Workers\database();
        $data = $db->acentaDuzenleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaAdiBak"])){
        $db = new Workers\database();
        $data = $db->acentaAdiBak($sirketID,$userID,$yetki,$payload["acentaAdiBak"]);
        echo json_encode($data,TRUE);
        return;
    }
    #endregion
    
    #region Acenta Çalışan
    if(isset($payload["calisanEkle"])){
        
        $db = new Workers\database();
        $data = $db->acentaCalisanEkle($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaCalisanAdiBak"])){
        $db = new Workers\database();
        $data = $db->acentaCalisanAdiBak($sirketID,$userID,$yetki,$payload["acentaCalisanAdiBak"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaCalisanListele"])){
        $db = new Workers\database();
        $data = $db->acentaCalisanListele($sirketID,$userID,$yetki,$payload["acentaCalisanListele"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaCalisanSil"])){
        $db = new Workers\database();
        $data = $db->acentaCalisanSil($sirketID,$userID,$yetki,$payload["acentaCalisanSil"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaCalisanDuzenleVeri"])){
        $db = new Workers\database();
        $data = $db->acentaCalisanDuzenleVeri($sirketID,$userID,$yetki,$payload["acentaCalisanDuzenleVeri"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["acentaCalisanDuzenleKaydet"])){
        $db = new Workers\database();
        $data = $db->acentaCalisanDuzenleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    #endregion
    
    #region PERSONEL

    //personelDepartmanAra
    if(isset($payload["personelDepartmanAra"])){
        if($payload["personelDepartmanAra"]==0){
            $db = new Workers\database();
            $data = $db->personelDepartmanAra($sirketID,$userID,$yetki,$payload["personelDepartmanAra"]);
            echo json_encode($data,TRUE);
            return;
        }
        
    }
    if(isset($payload["personelGorevAra"])){
        if($payload["personelGorevAra"]==0){
            $db = new Workers\database();
            $data = $db->personelGorevAra($sirketID,$userID,$yetki,$payload["personelGorevAra"]);
            echo json_encode($data,TRUE);
            return;
        }
        $db = new Workers\database();
        $data = $db->personelGorevAra($sirketID,$userID,$yetki,$payload["personelGorevAra"]);
        echo json_encode($data,TRUE);
        return;
        
    }


    if(isset($payload["personelEkle"])){
            $db = new Workers\database();
            $data = $db->personelEkle($sirketID,$userID,$yetki,$payload);
            echo json_encode($data,TRUE);
            return;
        
    }
    if(isset($payload["personelListele"])){
        $db = new Workers\database();
        $data = $db->personelListele($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["personelListele"])){
        $db = new Workers\database();
        $data = $db->personelListele($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["personelDuzenleVeri"])){
        $db = new Workers\database();
        $data = $db->personelDuzenleVeri($sirketID,$userID,$yetki,$payload["personelDuzenleVeri"]);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["personelDuzenleKaydet"])){
        $db = new Workers\database();
        $data = $db->personelDuzenleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    //
    #endregion

    #region KASA
    if(isset($payload["kasaEkle"])){
            $db = new Workers\database();
            $data = $db->kasaEkle($sirketID,$userID,$yetki,$payload);
            echo json_encode($data,TRUE);
            return;
        
    }

    if(isset($payload["kasaListele"])){
        $db = new Workers\database();
        $data = $db->kasaListele($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["kasaDuzenleVeri"])){
        $db = new Workers\database();
        $data = $db->kasaDuzenleVeri($sirketID,$userID,$yetki,$payload["kasaDuzenleVeri"]);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["kasaDuzenleKaydet"])){
        $db = new Workers\database();
        $data = $db->kasaDuzenleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    } 
    if(isset($payload["OdemeEkleKasaAra"])){
        $db = new Workers\database();
        $data = $db->kasaList($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["kasaSil"])){
        $db = new Workers\database();
        $data = $db->kasaSil($sirketID,$userID,$yetki,$payload["kasaSil"]);
        echo json_encode($data,TRUE);
        return;
    }
    //
    #endregion

    #region Ödeme
    if(isset($payload["odemeTuruKaydet"])){
        $db = new Workers\database();
        $data = $db->odemeTuruKaydet($sirketID,$userID,$yetki,$payload["odemeTuruKaydet"]);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["OdemeCesidiEkleAra"])){
        $db = new Workers\database();
        
        $data = $db->OdemeCesidiEkleAra($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    
    if(isset($payload["odemeCesidiEkleKaydet"])){
        $db = new Workers\database();
        $data = $db->odemeCesidiKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["odemeCesidiListe"])){
        $db = new Workers\database();
        $data = $db->odemeCesidiListe($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["odemeCesidiDuzenleVeri"])){
        $db = new Workers\database();
        $data = $db->odemeCesidiDuzenleVeri($sirketID,$userID,$yetki,$payload["odemeCesidiDuzenleVeri"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["odemeCesidiDuzenleKaydet"])){
        $db = new Workers\database();
        $data = $db->odemeCesidiDuzenleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    } 

    if(isset($payload["OdemeTuruAra"])){
        $db = new Workers\database();
        $data = $db->OdemeTuruAra($sirketID,$userID,$yetki,$payload["OdemeTuruAra"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["odemeEkleKaydet"])){
            $db = new Workers\database();
            $data = $db->odemeEkle($sirketID,$userID,$yetki,$payload);
            echo json_encode($data,TRUE);
            return;
        
    }

    if(isset($payload["odemeGuncelle"])){
            $db = new Workers\database();
            $data = $db->odemeGuncelle($sirketID,$userID,$yetki,$payload);
            echo json_encode($data,TRUE);
            return;
    }

    if(isset($payload["odemeSil"])){
        $db = new Workers\database();
        $data = $db->odemeSil($sirketID,$userID,$yetki,$payload["odemeSil"]);
        echo json_encode($data,TRUE);
        return;
    }
    //
    #endregion

    #region Masraf Kartı
    if(isset($payload["masrafEkleIsListe"])){
        $db = new Workers\database();
        $data = $db->masrafEkleIsListe($sirketID,$userID,$yetki,$payload["masrafEkleIsListe"]);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["masrafKartiEkleKaydet"])){
        $db = new Workers\database();
        $data = $db->masrafKartiEkleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
   
    if(isset($payload["masrafListele"])){
        $db = new Workers\database();
        $data = $db->masrafListele($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["masrafDuzenleVeri"])){
        $db = new Workers\database();
        $data = $db->masrafDuzenleVeri($sirketID,$userID,$yetki,$payload["masrafDuzenleVeri"]);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["masrafDuzenleKaydet"])){
        $db = new Workers\database();
        $data = $db->masrafDuzenleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }

    if(isset($payload["masrafDetay"])){
        $db = new Workers\database();
        $data = $db->masrafDetay($sirketID,$userID,$yetki,$payload["masrafDetay"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["masrafSil"])){
        $db = new Workers\database();
        $data = $db->masrafKartiSil($sirketID,$userID,$yetki,$payload["masrafSil"]);
        echo json_encode($data,TRUE);
        return;
    }

    //kasaSil
    
    #endregion

    #region Mutabakat
    if(isset($payload["sonMutabakatBak"])){
        $db = new Workers\database();
        $data = $db->mutabakatBak($sirketID,$userID,$yetki,$payload["sonMutabakatBak"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["mutabakatDosyaUpdate"])){
        $db = new Workers\database();
        $data = $db->mutabakatDosyaUpdate($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["sonMutabakatEkle"])){
        $db = new Workers\database();
        $data = $db->sonMutabakatEkle($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    
    #endregion

    #region Tahsilat Kartı

    if(isset($payload["tasilatKartiOlustur"])){
        $db = new Workers\database();
        if($payload["tasilatKartiOlustur"]=="1"){
            $data = $db->tahsilatKartiEkle($sirketID,$userID,$yetki,$payload);
        }
        else{
            $data = $db->tahsilatKartiEkle($sirketID,$userID,$yetki,NULL,$payload["tasilatKartiOlustur"]);
        }
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["tahsilatListesiBak"])){
        $db = new Workers\database();
        $data = $db->tahsilatListesiBak($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }

    
    #endregion

    #region Hizmet
    if(isset($payload["hizmetEkleGrupLoad"])){
        $db = new Workers\database();
        if(isset($payload["q"])){
            $data = $db->hizmetEkleGrupLoad($sirketID,$userID,$yetki,$payload["q"]);
        }
        else{
            $data = $db->hizmetEkleGrupLoad($sirketID,$userID,$yetki,"");
        }

        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hizmetEkle"])){
        $db = new Workers\database();
        $data = $db->hizmetEkle($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hizmetSil"])){
        $db = new Workers\database();
        $data = $db->hizmetSil($sirketID,$userID,$yetki,$payload["hizmetSil"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hizmetListele"])){
        $db = new Workers\database();
        $data = $db->hizmetListele($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hizmetFiltreButtonlar"])){
        $db = new Workers\database();
        $data = $db->hizmetFiltreButtonlar($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hizmetDuzenle"])){
        $db = new Workers\database();
        $data = $db->hizmethizmetDuzenleVeri($sirketID,$userID,$yetki,$payload["hizmetDuzenle"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hizmetDuzenleKaydet"])){
        $db = new Workers\database();
        $data = $db->hizmethizmetDuzenleKaydet($sirketID,$userID,$yetki,$payload);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hizmetlerTablosu"])){
        $db = new Workers\database();
        $data = $db->hizmetlerTablosu($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    #endregion

    #region Teklif
    if(isset($payload["teklifHizmetlerButton"])){
        $db = new Workers\database();
        $data = $db->teklifHizmetlerButton($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["taslakTeklifKaydet"])){
        $teklif = $payload["teklifData"];
        $db = new Workers\database();
        $data = $db->teklifKaydet($sirketID,$userID,$yetki,$teklif);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["teklifVeriBul"])){
        $search =  $payload["search"];
        $query = $payload["query"];
        
        $db = new Workers\database();
        $data = $db->teklifVeriBul($sirketID,$userID,$yetki,$search,$query);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["teklifListe"])){
        $db = new Workers\database();
        if($payload["teklifListe"]=="-1"){
            if(isset($payload["teklifYil"])){
                $data = $db->teklifListesiTum($sirketID,$userID,$yetki,$payload["teklifListe"],$payload["teklifYil"]); 
                echo json_encode($data,TRUE);
                return;
            }
            $data = $db->teklifListesiTum($sirketID,$userID,$yetki,$payload["teklifListe"]); 
            echo json_encode($data,TRUE);
            return;
        }
        $data = $db->teklifListesiOlustur($sirketID,$userID,$yetki,$payload["teklifListe"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["teklifRevizeOlustur"])){
        $query = $payload["query"];
        
        $db = new Workers\database();
        $data = $db->teklifRevizeOlustur($sirketID,$userID,$yetki,$query);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["teklifExcelYaz"])){

        $db = new Workers\database();
        $writer = new Workers\excelwriter();
        $data = $db->teklifVeriBul($sirketID,$userID,$yetki,"uuid",$payload["teklifExcelYaz"]);
        if($data["status"]==1){
            $sablonData = $db->ayarGetData($sirketID,$userID,$yetki,"excelSablon");
            $sablonlar = json_decode($sablonData["data"]["ayarDegeri"],1);

            //$fileReturn =writeExcell($sirketID,$data["result"][0],true,true,true,$payload["filtre"]);
            $sablon = 0;
            if(isset($payload["sablon"])){$sablon=$payload["sablon"];}
            $fileReturn =  $writer->createExcel($sirketID,$data["result"][0],$sablonlar,$payload["filtre"],$sablon);
            $data["dosyaAdi"]=$fileReturn;
            echo json_encode($data,TRUE);
        }else{
            echo json_encode($data,TRUE);
        }
        //echo $payload["teklifExcelYaz"];
        return;
    }
    if(isset($payload["teklifMailGonder"])){

        $db = new Workers\database();
        $excelwriter = new Workers\excelwriter();
        $mailer = new Workers\mailWriter();
        $teklifData = $db->teklifVeriBul($sirketID,$userID,$yetki,"uuid",$payload["teklifMailGonder"]);
        if($teklifData["status"]==1){
          
            //CREATE EXCEL
            $sablonData = $db->ayarGetData($sirketID,$userID,$yetki,"excelSablon");
            $sablonlar = json_decode($sablonData["data"]["ayarDegeri"],1);
            $sablon = 0;
            $musteriNoMail="";
            if(isset($payload["sablon"])){$sablon=$payload["sablon"];}
            $fileReturn =  $excelwriter->createExcel($sirketID,$teklifData["result"][0],$sablonlar,$payload["filtre"],$sablon);
            $teklifData["dosyaAdi"]=$fileReturn;
           // echo json_encode($teklifData,TRUE);
           // return;
            //SEND EMAİL
            $mailSablon="0";
            if(isset($payload["musteriNoMail"])){$musteriNoMail=$payload["musteriNoMail"];}
            $mailReturn = $mailer->createMail($sirketID,$userID,$yetki,$teklifData,$mailSablon,$musteriNoMail,$payload["filtre"]);
            echo json_encode($mailReturn,TRUE);

        }else{
           
           
           
           
            //echo json_encode($teklifData,TRUE);
        }
        //echo $payload["teklifExcelYaz"];
        return;
    }
    if(isset($payload["taslakTeklifDurumGuncelle"])){

        $db = new Workers\database();
        $data = $db->taslakTeklifDurumGuncelle($sirketID,$userID,$yetki,$payload["teklifID"],$payload["teklifDurum"]);
        echo json_encode($data,TRUE);
        
        //echo $payload["teklifExcelYaz"];
        return;
    }
    if(isset($payload["taslakTeklifSil"])){

        $db = new Workers\database();
        $data = $db->taslakTeklifSil($sirketID,$userID,$yetki,$payload["taslakTeklifSil"]);
        echo json_encode($data,TRUE); 
        
        //echo $payload["teklifExcelYaz"];
        return;
    }
    if(isset($payload["taslakTeklifGuncelle"])){

        $db = new Workers\database();
        $data = $db->teklifIcerikGuncelle($sirketID,$userID,$yetki,$payload["teklifData"]);
        echo json_encode($data,TRUE);  
        
        //echo $payload["teklifExcelYaz"];
        return;
    }
    #endregion 
    
    #region Kullanıcı
    if(isset($payload["resetPass"])){
        
        $newPassWord = password_hash($payload["yeniSifre"], PASSWORD_DEFAULT);
        echo $newPassWord;
    }
    if(isset($payload["kullaniciHesapBak"])){

        $db = new Workers\database();
        $data = $db->kullaniciHesapBak($sirketID,$userID,$yetki);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["hesapSifreDegistir"])){

        $db = new Workers\database();
        $data = $db->kullaniciSifreDegistir($sirketID,$userID,$yetki,$payload["eskiSifre"],$payload["yeniSifre"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["testEposta"])){
        
        $mailer = new Workers\mailWriter();
        $mailAyar= json_decode($payload["mailAyar"],1);
        $data = $mailer->testMail($sirketID,$userID,$yetki,$mailAyar);
        echo json_encode($data,TRUE);
        //echo json_encode($mailAyar,TRUE);
        return;
    }
    #endregion
    if($ret["status"]==0){
        
        writeRequestLog($payload);
    }
    echo json_encode($ret,TRUE);
    return;
    
}
else{
    //$ret = array("status"=>0,"message"=>"İstem YOK","header"=>"Info","data"=>$reqContent);
    $ret = array("status"=>0,"message"=>"İstem YOK","header"=>"Info","data"=>$_POST);
    
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
#region RAPOR İŞLEMLERİ

// Aylık rapor getir
if(isset($_POST["aylikRaporGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $yil = $_POST["yil"];
    $ay = $_POST["ay"];
    
    $data = $db->aylikRaporGetir($sirketID, $yil, $ay);
    echo json_encode($data,TRUE);
    return;
}

// Yıllık trend getir
if(isset($_POST["yillikTrendGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $yil = $_POST["yil"];
    
    $data = $db->yillikTrendGetir($sirketID, $yil);
    echo json_encode($data,TRUE);
    return;
}

// Müşteri analiz raporu getir
if(isset($_POST["musteriAnalizRaporuGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $baslangicTarihi = $_POST["baslangicTarihi"];
    $bitisTarihi = $_POST["bitisTarihi"];
    
    $data = $db->musteriAnalizRaporuGetir($sirketID, $baslangicTarihi, $bitisTarihi);
    echo json_encode($data,TRUE);
    return;
}

// Hizmet kategori analizi getir
if(isset($_POST["hizmetKategoriAnaliziGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $baslangicTarihi = $_POST["baslangicTarihi"];
    $bitisTarihi = $_POST["bitisTarihi"];
    
    $data = $db->hizmetKategoriAnaliziGetir($sirketID, $baslangicTarihi, $bitisTarihi);
    echo json_encode($data,TRUE);
    return;
}

// Haftalık rapor getir
if(isset($_POST["haftalikRaporGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $baslangicTarihi = $_POST["baslangicTarihi"];
    $bitisTarihi = $_POST["bitisTarihi"];
    
    $data = $db->haftalikRaporGetir($sirketID, $baslangicTarihi, $bitisTarihi);
    echo json_encode($data,TRUE);
    return;
}

// Performans özeti getir
if(isset($_POST["performansOzetiGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $data = $db->performansOzetiGetir($sirketID);
    echo json_encode($data,TRUE);
    return;
}

#endregion

#region Cari Rapor İşlemleri

// Cari hareketleri getir
if(isset($_POST["cariHareketleriGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $filtreler = array();
    if(isset($_POST["tarih_baslangic"])) $filtreler['tarih_baslangic'] = $_POST["tarih_baslangic"];
    if(isset($_POST["tarih_bitis"])) $filtreler['tarih_bitis'] = $_POST["tarih_bitis"];
    if(isset($_POST["musteri"])) $filtreler['musteri'] = json_decode($_POST["musteri"], true);
    if(isset($_POST["durum"])) $filtreler['durum'] = json_decode($_POST["durum"], true);
    if(isset($_POST["para_birimi"])) $filtreler['para_birimi'] = json_decode($_POST["para_birimi"], true);
    if(isset($_POST["hizmet_turu"])) $filtreler['hizmet_turu'] = json_decode($_POST["hizmet_turu"], true);
    if(isset($_POST["min_tutar"])) $filtreler['min_tutar'] = $_POST["min_tutar"];
    if(isset($_POST["max_tutar"])) $filtreler['max_tutar'] = $_POST["max_tutar"];
    if(isset($_POST["vade_durumu"])) $filtreler['vade_durumu'] = $_POST["vade_durumu"];
    if(isset($_POST["tutar_araligi"])) $filtreler['tutar_araligi'] = $_POST["tutar_araligi"];
    if(isset($_POST["siralama"])) $filtreler['siralama'] = $_POST["siralama"];
    
    $data = $db->cariHareketleriGetir($filtreler);
    echo json_encode($data,TRUE);
    return;
}

// Cari özet getir
if(isset($_POST["cariOzetGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $filtreler = array();
    if(isset($_POST["tarih_baslangic"])) $filtreler['tarih_baslangic'] = $_POST["tarih_baslangic"];
    if(isset($_POST["tarih_bitis"])) $filtreler['tarih_bitis'] = $_POST["tarih_bitis"];
    
    $data = $db->cariOzetGetir($filtreler);
    echo json_encode($data,TRUE);
    return;
}

// Müşteri listesi getir
if(isset($_POST["musteriListesiGetir"])){
    $db = new Workers\database();
    if($sirketID==0){
        $ret = array("status"=>-99,"message"=>"Giriş yapılmadı","header"=>"Giriş yapılmadı","data"=>$relogin);
        echo json_encode($ret,TRUE);
        return;
    }
    
    $data = $db->musteriListesiGetir();
    echo json_encode($data,TRUE);
    return;
}
function writeRequestLog($data){
    $logFile = fopen($_SERVER['DOCUMENT_ROOT']."/assets/request.log","a");
    fwrite($logFile,date("Y-m-d H:i:s")."\n"."-------------------\n".json_encode($data,TRUE)."\n-------------------\n");
    fclose($logFile);
}
#endregion

#endregion
