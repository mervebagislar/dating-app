<?php
//use Workers\database;
include_once($_SERVER['DOCUMENT_ROOT']."/vendor/autoload.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");
include_once($_SERVER['DOCUMENT_ROOT']."/classes/Workers/SimpleXLSX.php");
use PhpOffice\PhpSpreadsheet\Spreadsheet;
//if($debug){
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_WARNING);
//}
header('Content-Type: application/json; charset=utf-8');
$payload = json_decode(file_get_contents("php://input"),TRUE);
if($payload){
    $db = new Workers\database();
    if(isset($payload["kullaniciYarat"])){
        $data = $db->createUser(1,0,999,$payload["eposta"],$payload["sifre"],$payload["kullaniciAdi"],$payload["yetki"]);
        echo json_encode($data,TRUE);
        return;
    }
    if(isset($payload["resetPass"])){
        $db-> adminPassReset($sirketID,$userID,$payload["yeniSifre"]); 
        echo json_encode(array("status"=>"1","message"=>"pass changed"),TRUE);
        return;
    }

    if(isset($payload["newPass"])){
        $newPassWord = password_hash($payload["yeniSifre"], PASSWORD_DEFAULT);
        echo json_encode(array("status"=>"1","message"=>$newPassWord),TRUE);
        return;
    }
    if(isset($payload["excell"])){
        if($payload["excell"]=="acenta"){
            $inputFileName = $_SERVER['DOCUMENT_ROOT'].'/assets/listeler/AcentaBilgi.xlsx';
            $inputFileType = 'Xlsx';
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
            /** Load $inputFileName to a Spreadsheet Object  **/
            $spreadsheet = $reader->load($inputFileName);
            $sheet = $spreadsheet->getSheet(0);

            $nb = 1;

            foreach ($sheet->getRowIterator() as $row) {
                $acentaAdi = $sheet->getCell("A$nb")->getValue();
                echo   "strLen: ".strlen($acentaAdi);
                echo $acentaAdi;
                if(strlen($acentaAdi)<1){break;}
                $acenta = array(
                    "acentaAdi"=>$acentaAdi,
                    "acentaAdresi"=>$sheet->getCell("B$nb")->getValue(),
                    "acentaTelefonu"=>$sheet->getCell("C$nb")->getValue(),
                    "acentaFaturaBaslik"=>$sheet->getCell("D$nb")->getValue(),
                    "acentaVergiDairesi"=>$sheet->getCell("E$nb")->getValue(),
                    "acentaVergiNo" => $sheet->getCell("F$nb")->getValue()
                );
                
                $data =$db->acentaEkle("1","1","99",$acenta);
                print_r($data);
                echo "<hr>";
                
                $nb++;
            }
        }
        if($payload["excell"]=="calisan"){
            $inputFileName = $_SERVER['DOCUMENT_ROOT'].'/assets/listeler/MalzemeBirimListe.xlsx';
            $inputFileType = 'Xlsx';
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
            /** Load $inputFileName to a Spreadsheet Object  **/
            $spreadsheet = $reader->load($inputFileName);
            $sheet = $spreadsheet->getSheet(0);

            $nb = 1;

            foreach ($sheet->getRowIterator() as $row) {
                $AcentaID = $sheet->getCell("A$nb")->getValue();
                $calisanAdi = $sheet->getCell("B$nb")->getValue();
                $calisanTelefon = $sheet->getCell("C$nb")->getValue();
                $calisanMail = $sheet->getCell("D$nb")->getValue();
                $calisanNot = $sheet->getCell("E$nb")->getValue();
                $calisanAktifmi = $sheet->getCell("F$nb")->getValue();
                //echo   "strLen: ".strlen($calisanAdi);
                //echo $calisanAdi;
                if(strlen($calisanAdi)<1){break;}
                $calisan = array(
                    "acentaID"=>$AcentaID,
                    "calisanEkleAdi"=>$calisanAdi,
                    "calisanEkleTelefon"=>str_replace(" ","",$calisanTelefon),
                    "calisanEkleEposta"=> $calisanMail ,
                    "calisanEkleNot"=>$calisanNot,
                    "calisanEkleDurum" =>$calisanAktifmi
                );/**/
                
                $data =$db->acentaCalisanEkle("1","1","99",$calisan);
                print_r($data);
                echo "<hr>";
                
                $nb++;
            }
        }
        if($payload["excell"]=="hizmet"){
            $inputFileName = $_SERVER['DOCUMENT_ROOT'].'/assets/listeler/MalzemeBirimListe.xlsx';
            $inputFileType = 'Xlsx';
            $reader = \PhpOffice\PhpSpreadsheet\IOFactory::createReader($inputFileType);
            /** Load $inputFileName to a Spreadsheet Object  **/
            $spreadsheet = $reader->load($inputFileName);
            $sheet = $spreadsheet->getSheet(0);

            $nb = 1;

            foreach ($sheet->getRowIterator() as $row) {
                $hizmetEkleAdi = $sheet->getCell("A$nb")->getValue();
                $hizmetEkleGrupAra = $sheet->getCell("B$nb")->getValue();
                $hizmetEkleFiyat = $sheet->getCell("C$nb")->getValue();
                $hizmetEkleNot = $sheet->getCell("D$nb")->getValue();
               
                //echo   "strLen: ".strlen($calisanAdi);
                //echo $calisanAdi;
                if(strlen($hizmetEkleAdi)<1){break;}
                $hizmet = array(
                    "hizmetEkleAdi"=>$hizmetEkleAdi,
                    "hizmetEkleGrupAra"=>$hizmetEkleGrupAra,
                    "hizmetEkleFiyat"=>$hizmetEkleFiyat,
                    "hizmetEkleNot"=>$hizmetEkleNot
                );/**/
                
                $data =$db->hizmetEkle("1","1","99",$hizmet);
                print_r($data);
                echo "<hr>";
                
                $nb++;
            }
        }
        return;
    }

}
else{
    
    $ret = array("status"=>0,"message"=>"no payload","header"=>"hata","data"=>"");
    echo json_encode($ret,TRUE);
    return;
}

//var_dump($_POST);
//echo '<pre>'.print_r($payload).'</pre>';