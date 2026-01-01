<?php
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");

function logout(){
    //$landing=$_SERVER['DOCUMENT_ROOT']."/giris.php";
	header("location:https://".$_SERVER['SERVER_NAME']."/landing"); die("403");
}
$debug=true;
//$debug=0;
$version="v=1.1.6";
$email = "";
$userID ="";
$sirketID =1;
$yetki="0";
$kullaniciAdi="-";
$relogin=0;
if(isset($_COOKIE['userID']) && !empty($_COOKIE['userID'])){$userID=$_COOKIE['userID'];}else{$relogin=1;}
if(isset($_COOKIE['sirketID']) && !empty($_COOKIE['sirketID'])){$sirketID=$_COOKIE['sirketID'];}else{$relogin=2;}
if(isset($_COOKIE['email']) && !empty($_COOKIE['email'])){$email=$_COOKIE['email'];}else{$relogin=4;}
if(isset($_COOKIE['yetki']) && !empty($_COOKIE['yetki'])){$yetki=$_COOKIE['yetki'];}else{$relogin=6;}
if(isset($_COOKIE['kullaniciAdi']) && !empty($_COOKIE['kullaniciAdi'])){$kullaniciAdi=$_COOKIE['kullaniciAdi'];}else{$relogin=7;}
if($relogin!=0){
	print_r($_COOKIE);
	echo "relogin:".$relogin."--";
	//logout();
}
