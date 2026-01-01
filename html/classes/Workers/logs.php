<?php

namespace Workers;
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/credits.php");
use \PDO;
use \PDOException;
class logs{
	private $logBase="";
	private $db="";
	private $ipAdress="";
	private $dbname;
	private $dbuser;
	private $dbpass;
	private $dbhost;

	public $dbl;
	function __construct(){
		//(debug, info, notice, warning, error, critical, alert, emergency)
		$dbCredit = dbCredits();
		$this->dbname =$dbCredit["dbname"];
		$this->dbuser =$dbCredit["dbuser"];
		$this->dbpass =$dbCredit["dbpass"];
		$this->dbhost =$dbCredit["host"];
		
		$this->dbl = new PDO('mysql:host='.$this->dbhost.';dbname='.$this->dbname, $this->dbuser, $this->dbpass);
		$this->dbl -> exec("set names utf8");
		$this->logBase = $_SERVER['DOCUMENT_ROOT']."/assets/logs/";
		$this->ipAdress = getUserIP();
	}

	private function debugFile(){
		$logFolder = $this->logBase."debugErrors";
		if (!file_exists($logFolder)) {
			mkdir($logFolder, 0777, true);
			chmod($logFolder, 0777);
		}
		$debugFile=$logFolder."/".date("Y.m.d")."_logErrors.txt";
		if(file_exists($debugFile)){ 
			chmod($debugFile, 0666); 
		}
		else{
			touch($debugFile); 
			chmod($debugFile, 0666);
		}
		return $debugFile;
	}
	private function userErrorFile(){
		$logFolder = $this->logBase."userErrors";
		if (!file_exists($logFolder)) {
			mkdir($logFolder, 0777, true);
			chmod($logFolder, 0777);
		}
		$debugFile=$logFolder."/".date("Y.m.d")."_userSQLErrors.txt";
		if(file_exists($debugFile)){ 
			//chmod($debugFile, 0666); 
		}
		else{
			touch($debugFile); 
			chmod($debugFile, 0666);
		}
		return $debugFile;
	}
	private function writeError($debugMessage){
		$file = $this->debugFile();
		$fp = fopen($file, 'a');
		$time = date("Y.m.d H:i:s");
		$writeMessage="$time => $debugMessage \n";
		fwrite($fp, $writeMessage);
		fclose($fp);
		chmod($file, 0664);
	}
	

	private function debugWrite($sirketID,$userID,$status,$level,$debugMessage,$ip){
		try {
			$sql = "INSERT INTO `logs` 
			(`ID`,`sirketID`,`kullaniciID`,`tarih`,`saat`,`ipAdresi`,`durum`,`seviye`,`mesaj`) 
			VALUES (NULL,'$sirketID','$userID','".date("Y-m-d")."','".date("H:i:s")."','$ip','$status','$level','$debugMessage')";
			$this->dbl->query($sql);
		}
		catch(PDOException $e ) { 
			$this->writeError("logDebugWrite => $sql sorgusu yapılırken pdo hatası oluştu. " . $e->getMessage());
			return;
		}
		
	}
	private function writeToDataBase($sql){
		try {
			$this->dbl->query($sql);
		}
		catch(PDOException $e ) { 
			$this->writeError("logWriteToDataBase => $sql sorgusu yapılırken pdo hatası oluştu. " . $e->getMessage());
			return;
		}
	}
	public function getAllSqlResults($sql){
		try {
			$veri = $this->dbl->prepare($sql);
			$veri->execute();
			return $veri->fetchAll(PDO::FETCH_ASSOC);
		}
		catch(PDOException $e ) { 
			$this->writeError("logGetAllSqlResults => $sql sorgusu yapılırken pdo hatası oluştu. " . $e->getMessage());
			return;
		}
	}
	private function getSqlResults($sql){
		try {
			$veri = $this->dbl->prepare($sql);
			$veri->execute();
			return $veri->fetch(PDO::FETCH_ASSOC);
		}
		catch(PDOException $e ) { 
			$this->writeError("logGetSqlResults => $sql sorgusu yapılırken pdo hatası oluştu. " . $e->getMessage());
			return -1;
		}
	}
	private function updateSql($sql){
		try {
			$veri = $this->dbl->prepare($sql);
			$veri->execute();
			
		}
		catch(PDOException $e ) { 
			$this->writeError("logUpdateSql => $sql sorgusu yapılırken pdo hatası oluştu. " . $e->getMessage());
			return -1;
		}
	}
	
	private function returnIDifRowExist($sql){
		try {
			$result = $this->getSqlResults($sql);
			if (!$result) {
				return -1;
			}
			if ($result == -1) {
				return -1;
			}
			if (!count($result)) {
				return -1;
			}
			return $result["ID"];
		}
		catch(PDOException $e ) { 
			$this->writeError("logReturnIDifRowExist => $sql sorgusu yapılırken pdo hatası oluştu. " . $e->getMessage());
			return -1;
		}
	}
	public function writeUserError($debugMessage){
		$file = $this->userErrorFile();
		$fp = fopen($file, 'a');
		$time = date("Y.m.d H:i:s");
		$writeMessage="$time => $debugMessage \n";
		fwrite($fp, $writeMessage);
		fclose($fp);
		//chmod($file, 0664);
	}
	public function debug($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"debug",$level,$debugMessage,$ip);
	}
	public function info($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"info",$level,$debugMessage,$ip);
	}
	public function notice($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"notice",$level,$debugMessage,$ip);
	}
	public function warning($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"warning",$level,$debugMessage,$ip);
	}
	public function error($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"error",$level,$debugMessage,$ip);
	}
	public function critical($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"critical",$level,$debugMessage,$ip);
	}
	public function alert($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"alert",$level,$debugMessage,$ip);
	}
	public function emergency($sirketID=0,$userID=0,$level="",$debugMessage="",$ip=""){
		$this->debugWrite($sirketID,$userID,"emergency",$level,$debugMessage,$ip);
	}

}




?>