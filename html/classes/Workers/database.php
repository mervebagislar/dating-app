<?php
namespace Workers;
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/credits.php");
include_once($_SERVER['DOCUMENT_ROOT']."/vendor/autoload.php");

use \PDO;
use \PDOException;
use \DateTime;
use \Exception;
use \NumberFormatter;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Workers\logs as log;
class database{

	#region Class Varaibles
	private $dbname;
	private $dbuser;
	private $dbpass;
	private $dbhost;
	public $dbc;
	private $log;
	private $ipAdress="*";
	private $yetkiler= array(
		"yetkisiz"=>0,
		"calisan"=>10,
		"satisSorumlusu"=>18,
		"satisMuduru"=>19,
		"yonetici"=>20,
		"superAdmin"=>999);

	const TYPE_ALIS = "ForexBuying";
	const TYPE_EFEKTIFALIS = "BanknoteBuying";
	const TYPE_SATIS = "ForexSelling";
	const TYPE_EFEKTIFSATIS = "BanknoteSelling";
    private $loginSuresi;
	#endregion

	function __construct(){
		$this->log = new log;
		$this->ipAdress = getUserIP();
		$dbCredit = dbCredits();
		$this->dbname =$dbCredit["dbname"];
		$this->dbuser =$dbCredit["dbuser"];
		$this->dbpass =$dbCredit["dbpass"];
		$this->dbhost =$dbCredit["host"];
        $this->loginSuresi=$dbCredit["loginTime"];
		$this->dbc = new PDO('mysql:host='.$this->dbhost.';dbname='.$this->dbname, $this->dbuser, $this->dbpass);
		$this->dbc -> exec("set names utf8");
	}
	public function reConnect(){
		$dbCredit = dbCredits();
		$this->dbname =$dbCredit["dbname"];
		$this->dbuser =$dbCredit["dbuser"];
		$this->dbpass =$dbCredit["dbpass"];
		$this->dbhost =$dbCredit["host"];
        $this->loginSuresi=$dbCredit["loginTime"];
		$this->dbc = new PDO('mysql:host='.$this->dbhost.';dbname='.$this->dbname, $this->dbuser, $this->dbpass);
		$this->dbc -> exec("set names utf8");
		
	}
	#region SQL Functions
	private function getAllSqlResults($sql){
		try {
			$veri = $this->dbc->prepare($sql);
			$veri->execute();
			return $veri->fetchAll(PDO::FETCH_ASSOC);
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("getAllSqlResults-> $sql sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
			return -1;
		}
	}
	private function getSqlResult($sql){
		try {
			$veri = $this->dbc->prepare($sql);
			$veri->execute();
			$sqlreturn = $veri->fetch(PDO::FETCH_ASSOC);
			return $sqlreturn;
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("getSqlResult-> $sql sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
			return -1;
		}
	}
	private function insertIfNotExistReturnID($varmi,$ekle){
		try {
			$veri = $this->dbc->query($varmi);
			if($veri->rowCount()>0){
				$sqlreturn = $veri->fetch(PDO::FETCH_ASSOC);
				return $sqlreturn["ID"];
			}
			return $this->insertReturnID($ekle);
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("insertIfNotExistReturnID-> $varmi sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
			return -1;
		}
	}

	private function insertOrUpdateReturnID($varmi,$ekle,$update){
		try {
			$veri = $this->dbc->query($varmi);
			if($veri->rowCount()>0){
				$sqlreturn = $veri->fetch(PDO::FETCH_ASSOC);
				return $this->updateReturnID($update,$sqlreturn["ID"]);
			}
			return $this->insertReturnID($ekle);
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("insertOrUpdateReturnID-> $varmi sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
			return -1;
		}
	}
	private function insertReturnID($sql){
		try {
			$this->dbc->query($sql);
			return $this->dbc->lastInsertId();
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("insertReturnID-> $sql sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
			return -1;
		}
	}
	private function updateReturnID($sql,$id=0){
		try {
			$this->dbc->query($sql);
			return $id;
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("updateReturnID-> $sql sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
			return 0;
		}
	}
	private function deleteRecord($sql){
		try {
			$this->dbc->query($sql);
			return 1;
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("deleteRecord-> $sql sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
			return 0;
		}
	}
	private function countReturnInt($sql){
		try {
			$veri = $this->dbc->query($sql);
			$sqlreturn = $veri->fetch();
            if($sqlreturn){return intVal($sqlreturn[0]);}
            else{return 0;}
			
		}
		catch(PDOException $e ) { 
			$this->log->writeUserError("countReturnInt-> $sql sorgusu yapılırken pdo hatası oluştu. ".$e->getMessage());
            return -1;
		}
	}
	#endregion
    
	#region General Functions
	private function isValidEmail($email){
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
		  return false;
		}
		return true;
	}
	private function changeLog($sirketID,$userID,$table,$id){
		try{
			$sql = "SELECT * FROM `$table` WHERE `ID` = $id";
			$result =  $this->getSqlResult($sql);
			$json =json_encode($result);
			$today = date("Y-m-d H:i:s");
			$sqlInsert="INSERT INTO `changeLogs`(
				`ID`,
				`sirketID`,
				`userID`,
				`date`,
				`tableEffected`,
				`rowEffected`,
				`oldData`
			)
			VALUES(NULL, '$sirketID', '$userID', '$today', '$table','$id','$json');";
			$this->insertReturnID($sqlInsert);
		} catch(PDOException $e ) { 
        	$this->log->writeUserError("changeLog->".$e->getMessage());

        }
	}

	private function deleteLog($sirketID,$userID,$table,$search){
		try{
			$sql = "SELECT * FROM `$table` WHERE $search";
			//$result =  $this->getSqlResult($sql);
			$result =  $this->getAllSqlResults($sql);
			$fmt = new NumberFormatter( 'de_DE', NumberFormatter::DECIMAL );
			if(is_array($result)&&count($result)>0){
				foreach($result as $veri){
			
			
					$json =json_encode($veri);
					$today = date("Y-m-d H:i:s");
					$sqlInsert="INSERT INTO `deleteLogs`(
						`ID`,
						`sirketID`,
						`userID`,
						`date`,
						`tableEffected`,
						`rowEffected`,
						`oldData`
					)
					VALUES(NULL, '$sirketID', '$userID', '$today', '$table','".$veri["ID"]."','$json');";
					$this->insertReturnID($sqlInsert);
				}
			}


		} catch(PDOException $e ) { 
        	$this->log->writeUserError("deleteLog->".$e->getMessage());

        }
	}
	public function yaziDuzelt($yazi){
		if($yazi != null || $yazi != ""){
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
		}
		return $yazi;
	}
	public function humanDate($originalDate){
		//
		if($originalDate==""){
			return "-";
		}
		$date=date_create($originalDate);
		$humanDate= date_format($date,"d.m.Y");
		return $humanDate;
	}
	public function humanDateTime($originalDate){
		//
		if($originalDate==""){
			return "-";
		}
		$date=date_create($originalDate);
		$humanDate= date_format($date,"d.m.Y H:i");
		return $humanDate;
	}
	public function paraSembol($sembol){
		if($sembol == "try"){ return "₺";}
		if($sembol == "usd"){ return "$";}
		if($sembol == "eur"){ return "€";}
		return;
	}
    public function noUse($sirketID,$userID,$yetki){
		$return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
		$sql = "";
        $id = $this->insertReturnID($sql);
        $this->log->info($sirketID,$userID,"ekipmanEkle","(id:) -  envantere eklendi.",$this->ipAdress);
		return $return;
		
	}
	#endregion

    #region KULLANICI İŞLEMLERİ
    public function createUser($sirketID,$userID,$yetki,$email,$pass,$kullaniciAdi,$userYetki=10){
        $return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
        $email = htmlspecialchars(strtolower(trim($email)), ENT_QUOTES); 
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Yeni kullanıcı ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"createUser","kullanıcı tarafından yetkisiz kullanıcı oluşturma isteği geldi ($email)(sifre:$pass)",$this->ipAdress);
            return $return;
        }
        if($this-> isValidEmail($email)==false){
            $return = array("status"=>0,"message"=>"Lütfen girdiğiniz eposta adresini kontrol ediniz","header"=>"Geçersiz eposta","data"=>"");
            $this->log->alert($userID,"createUser","Geçersiz eposta ile kayıt yapılmaya çalışıldı ($email)(sifre:$pass)",$this->ipAdress);
            return $return;
        }


        $sql = "SELECT `ID` FROM `kullanicilar` WHERE `kullaniciEposta` LIKE '$email' AND `sirketID` = $sirketID";
		$isUserExist = $this-> countReturnInt($sql);
        if($isUserExist > 0){
            $return = array("status"=>0,"message"=>"Bu kullanıcı epostası zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut kullanıcı","data"=>"");
            $this->log->alert($userID,"createUser","mevcut kullanıcı için yeni kayıt açılmaya çalışıldı ($email)(sifre:$pass)",$this->ipAdress);
            return $return;
        }
        if( strlen($pass) <8){
            $return = array("status"=>0,"message"=>"Şifre alanı 8 karakterden az olamaz","header"=>"Şifre hatası","data"=>"");
            $this->log->alert($userID,"createUser","geçersiz şifre ile kayıt oluşturulmaya çalışıldı ($email)(sifre:$pass)",$this->ipAdress);
            return $return;
        }
        $email = htmlspecialchars(strtolower(trim($email)), ENT_QUOTES); 
        try {
            $passHash= password_hash($pass, PASSWORD_DEFAULT);
            $sql = "INSERT INTO `kullanicilar`(
                    `ID`,
                    `sirketID`,
                    `kullaniciAdi`,
                    `kullaniciEposta`,
                    `kullaniciSifre`,
                    `kullaniciYetki`,
                    `kullaniciAktifmi`
                )
                VALUES(
                    NULL,
                    '$sirketID',
                    '$kullaniciAdi',
                    '$email',
                    '$passHash',
                    '$userYetki',
                    '1'
                );";
            $returnID = $this->insertReturnID($sql);
            $return = array("status"=>1,"message"=>"$email Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"register","(Kullanıcı:$email) (userID:$returnID) (Yetki:$userYetki) (ilksifre:$pass) değerleri ile yeni kullanıcı eklendi. ",$this->ipAdress);
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>"$email veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("register->  Kullanıcı:$email (userID:$userID) Yetki:$yetki değerleri ile yeni kullanıcı kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }


	}
    public function validateLogin($email,$sifre){
		$return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
        $email = htmlspecialchars(strtolower(trim($email)), ENT_QUOTES); 
		if( $this->isValidEmail($email)==false){
            $return = array("status"=>2,"message"=>"hatalı eposta","header"=>"Eksik veri","data"=>"");
            $this->log->error(0,"validateLogin","hatalı eposta ($email)(sifre:$sifre)",$this->ipAdress);
            return $return;
        }
		try {
			//email ile kullanıcı adı sorgusu yapıyoruz
			
			$sql = "SELECT * FROM `kullanicilar` WHERE `kullanicilar`.`kullaniciEposta` LIKE '$email'";
			$veri = $this->getSqlResult($sql);
			if(!$veri || $veri == -1){
                $return = array("status"=>3,"message"=>"Bu eposta adresi için kayıt bulunamadı","header"=>"Kayıtsız Eposta","data"=>"");
                $this->log->error(0,0,"validateLogin","kullanıcı bulunamadı ($email)(sifre:$sifre)",$this->ipAdress);
                return $return;
            }
            
            if (!password_verify($sifre, $veri["kullaniciSifre"])) {
                $return = array("status"=>4,"message"=>"Lütfen şifrenizi kontol edip tekrar deneyiniz","header"=>"Hatalı şifre","data"=>"");
                $this->log->error(0,0,"validateLogin","Hatalı şifre ($email)(sifre:$sifre)",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>"","header"=>"","data"=>"../");
            setcookie("email", $email, time()+($this->loginSuresi*3600),'/');
            setcookie("email", $email, time()+($this->loginSuresi*3600),'/');
            setcookie("userID", $veri["ID"], time()+($this->loginSuresi*3600),'/');
            setcookie("yetki", $veri["kullaniciYetki"], time()+($this->loginSuresi*3600),'/');
            setcookie("kullaniciAdi", $veri["kullaniciAdi"], time()+($this->loginSuresi*3600),'/');
            setcookie("sirketID", $veri["sirketID"], time()+($this->loginSuresi*3600),'/');
            $this->log->info($veri["sirketID"],$veri["ID"],"login","$email ile başarılı giriş yapıldı.",$this->ipAdress);
			$veri=array("email"=>$email,"userID"=>$veri["ID"],"yetki"=> $veri["kullaniciYetki"],"kullaniciAdi"=> $veri["kullaniciAdi"],"sirketID"=> $veri["sirketID"]);
			$return = array("status"=>1,"message"=>"","header"=>"","data"=>"../","result"=>$veri);
            //$return = array("status"=>1,"message"=>"","header"=>"","data"=>"../");
            return $return; 
            /*
            
            if($veri->execute()){
				//eğer sorgu başarılıysa devam ediyoruz
				if($veri->rowCount()!=0){
					//eğer sorgu sonucu boş değilse devam ediyoruz
					//sorgu sonucunu değişkene atıyoruz
					$sqlreturn = $veri->fetch(PDO::FETCH_ASSOC);
					if (password_verify($sifre, $sqlreturn["kullaniciSifre"])) {
						//eğer şifre girilen şifre ile uyuşuyorsa devam ediyoruz
						
						
						
						
						//cookieleri yerleştiriyoruz
						setcookie("email", $email, time()+($this->loginSuresi*3600),'/');
						setcookie("userID", $sqlreturn["ID"], time()+($this->loginSuresi*3600),'/');
						setcookie("yetki", $sqlreturn["yetki"], time()+($this->loginSuresi*3600),'/');
						setcookie("kullaniciAdi", $sqlreturn["kullaniciAdi"], time()+($this->loginSuresi*3600),'/');
						
						//giriş yapıldığında veritabanını güncelleyip loglayarak devam ediyoruz
						$update = $this->dbc->prepare("UPDATE `kullanicilar` SET `ipAdres` = '".$this->ipAdress."',`sonGiris` = '".date("Y-m-d H:s:i")."',`loginAuth` = '$tanimlayici' WHERE `kullanicilar`.`ID` = ".$sqlreturn["ID"].";");
						
						//getUserIP()
						$update->execute();
						$this->log->info($sqlreturn["sirketID"],$sqlreturn["ID"],"login","$email ile başarılı giriş yapıldı.",$this->ipAdress);
						
						$return["status"]=1; 
						$return["kalanGun"]=$kalanGun;
						$return["redirectTo"]="index";
						return $return;
					}
					else {
						//eğer şifre uyuşmazsa login işlemini hata bildirimi ile sonlandırıp logluyoruz
						$return["status"]=-95; $return["message"]="Hatalı Şifre!";
						$this->log->notice(0,0,"login","$email ile giriş yapılırken hatalı şifre kullanıldı.",$this->ipAdress);
						return $return;
					}
				}
				else{
					//eğer sorgu sonucu boş dönerse login işlemini hata bildirimi ile sonlandırıp logluyoruz
					$return["status"]=-96; $return["message"]="E-posta bulunamadı!";
					$this->log->notice(0,0,"login","$email ile giriş yapılırken hatalı eposta kullanıldı.",$this->ipAdress);
					return $return;
				}
			}
			else{
				//eğer sorguda hata oluştuysa negatif cevap dönerek login işlemini durduruyoruz
				$return["message"]="Sorgu Yapılamadı!";
				$return["status"]=-97; 
				return $return;
			}*/
		}
		catch(PDOException $e ){ 
			$return = array("status"=>5,"message"=>"Sunucu tarafında oluşan bir hatadan dolayı giriş yapılamadı","header"=>"Veritabanı hatası","data"=>"");
			$this->log->writeUserError("login-> $email ile giriş yapılırken pdo hatası oluştu. $sql ".$e->getMessage()." -> $this->ipAdress");
			return $return; 
		}
	}
	public function validateLoginJWT($email, $sifre) {
		$return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
		$email = htmlspecialchars(strtolower(trim($email)), ENT_QUOTES); 
		if ($this->isValidEmail($email) == false) {
			$return = array("status"=>2,"message"=>"hatalı eposta","header"=>"Eksik veri","data"=>"");
			$this->log->error(0,"validateLoginJWT","hatalı eposta ($email)(sifre:$sifre)",$this->ipAdress);
			return $return;
		}
		try {
			$sql = "SELECT * FROM `kullanicilar` WHERE `kullanicilar`.`kullaniciEposta` LIKE '$email'";
			$veri = $this->getSqlResult($sql);
			if (!$veri || $veri == -1) {
				$return = array("status"=>3,"message"=>"Bu eposta adresi için kayıt bulunamadı","header"=>"Kayıtsız Eposta","data"=>"");
				$this->log->error(0,0,"validateLoginJWT","kullanıcı bulunamadı ($email)(sifre:$sifre)",$this->ipAdress);
				return $return;
			}
			if (!password_verify($sifre, $veri["kullaniciSifre"])) {
				$return = array("status"=>4,"message"=>"Lütfen şifrenizi kontol edip tekrar deneyiniz","header"=>"Hatalı şifre","data"=>"");
				$this->log->error(0,0,"validateLoginJWT","Hatalı şifre ($email)(sifre:$sifre)",$this->ipAdress);
				return $return;
			}
			// JWT oluştur
			$secretKey = getenv('JWT_SECRET') ?: 'your_secret_key';
			$payload = [
				"email" => $email,
				"userID" => $veri["ID"],
				"yetki" => $veri["kullaniciYetki"],
				"kullaniciAdi" => $veri["kullaniciAdi"],
				"sirketID" => $veri["sirketID"],
				"iat" => time(),
				"exp" => time() + ($this->loginSuresi * 3600)
			];
			$jwt = JWT::encode($payload, $secretKey, 'HS256');
			$this->log->info($veri["sirketID"],$veri["ID"],"login","$email ile başarılı JWT giriş yapıldı.",$this->ipAdress);
			$return = array(
				"status"=>1,
				"message"=>"Giriş başarılı",
				"header"=>"",
				"token"=>$jwt,
				"data"=>"../"
			);
			return $return;
		} catch(PDOException $e) { 
			$return = array("status"=>5,"message"=>"Sunucu tarafında oluşan bir hatadan dolayı giriş yapılamadı","header"=>"Veritabanı hatası","data"=>"");
			$this->log->writeUserError("loginJWT-> $email ile giriş yapılırken pdo hatası oluştu. $sql ".$e->getMessage()." -> $this->ipAdress");
			return $return; 
		}
	}
    public function kullaniciCikis($sirketID,$userID,$yetki){
        $return = array("status"=>1,"message"=>"","header"=>"","data"=>"../../giris");
        setcookie("email", "", time() - 3600,'/');
        setcookie("userID", "", time() - 3600,'/');
        setcookie("yetki", "", time() - 3600,'/');
        setcookie("kullaniciAdi", "", time() - 3600,'/');
        setcookie("sirketID", "", time() - 3600,'/');
        $this->log->info($sirketID,$userID,"logout","$userID çıkış yaptı.",$this->ipAdress);
        return $return;
    }
    function updateSession($sirketID,$userID,$tanimlayici){
		/*$return = array();
		$sql="SELECT `kullanicilar`.`ID`,`kullanicilar`.`kullaniciMail`, `kullanicilar`.`kullaniciSifre`, `kullanicilar`.`loginAuth`, `kullanicilar`.`yetki`, `kullanicilar`.`kullaniciAdi`,`kullanicilar`.`sirketID`,`sirket`.`sirketAdi` FROM `kullanicilar` LEFT JOIN `sirket` ON `kullanicilar`.`sirketID` = `sirket`.`ID` WHERE `kullanicilar`.`ID` = '$userID';";
		try {
			
			$veri = $this->dbc->prepare($sql);
			if($veri->execute()){
				//eğer sorgu başarılıysa devam ediyoruz
				if($veri->rowCount()!=0){
					//eğer sorgu sonucu boş değilse devam ediyoruz
					//sorgu sonucunu değişkene atıyoruz
					$sqlreturn = $veri->fetch(PDO::FETCH_ASSOC);
					if ( $sqlreturn["loginAuth"] == $tanimlayici) {
						//eğer şifre girilen şifre ile uyuşuyorsa devam ediyoruz
						$sirketAdi =$sqlreturn["sirketAdi"];
						
						//cookieleri yerleştiriyoruz
						setcookie("email", $sqlreturn["kullaniciMail"], time()+(48*3600),'/');
						setcookie("userID", $sqlreturn["ID"], time()+(48*3600),'/');
						setcookie("sirketID", $sqlreturn["sirketID"], time()+(48*3600),'/');
						setcookie("yetki", $sqlreturn["yetki"], time()+(48*3600),'/');
						setcookie("kullaniciAdi", $sqlreturn["kullaniciAdi"], time()+(48*3600),'/');
						setcookie("sirketAdi", $sirketAdi, time()+(48*3600),'/');
						setcookie("tanimlayici", $tanimlayici, time()+(48*3600),'/');
						$return["status"]=true; 
						return $return;
					}
					else {
						//eğer şifre uyuşmazsa login işlemini hata bildirimi ile sonlandırıp logluyoruz
						$return["status"]=false; $return["message"]="Hatalı Şifre!";
						$this->log->info(0,0,"updateSession","(userID:$userID) tanımlayıcı uyuşmazlığından oturum sonlandırıldı.",$this->ipAdress);
					}
				}
				else{
					//eğer sorgu sonucu boş dönerse login işlemini hata bildirimi ile sonlandırıp logluyoruz
					$return["status"]=false; $return["message"]="E-posta bulunamadı!";
					$this->log->notice(0,0,"updateSession","(userID:$userID) oturum güncellenirken hatalı id kullanıldı.",$this->ipAdress);
				}
			}
			else{
				//eğer sorguda hata oluştuysa negatif cevap dönerek login işlemini durduruyoruz
				$this->log->writeUserError("updateSession-> $userID hatalı sorgu oluştu. $sql -> $this->ipAdress");
				$return["status"]=false; 
				return $return;
			}
			
		}
		catch(PDOException $e ){ 
			//bir pdo hatası oluştuysa bu hatayı loglayıp login işlemini duruduyoruz
			//$this->log->alert(0,0,"updateSession","$userID ile oturum güncellenirken pdo hatası oluştu. ".$e->getMessage(),$this->ipAdress);
			$this->log->writeUserError("updateSession-> $userID ile oturum güncellenirken pdo hatası oluştu. $sql ".$e->getMessage()." -> $this->ipAdress");
			$return["status"]=false; 
			return $return; 
		}*/
	}
    function kullaniciSifreDegistir($sirketID,$userID,$yetki,$eskiSifre,$yeniSifre){
		$return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
		$sql="SELECT * FROM `kullanicilar` WHERE `ID` = $userID AND `sirketID` = $sirketID";
		$sqlreturn = $this->getSqlResult($sql);

		if (password_verify($eskiSifre, $sqlreturn["kullaniciSifre"])) {
			$newPassWord = password_hash($yeniSifre, PASSWORD_DEFAULT);
			$sqlUpdate = "UPDATE `kullanicilar` SET `kullaniciSifre` = '$newPassWord' WHERE `kullanicilar`.`ID` = $userID AND `sirketID`=$sirketID;";
			
			$veriUpdate = $this->dbc->prepare($sqlUpdate);
			$veriUpdate->execute();
			$return["status"]=1;
			$return["header"]="Başarılı";
			$return["message"]="Şifremiz değiştirildi";
			$this->log->info($sirketID,$userID,"kullaniciSifreDegistir","Kullanıcı şifre değişikliği yaptı.Eski şifre:($eskiSifre) - Yeni Şifre($yeniSifre)",$this->ipAdress);
		}
		else{
			$return["status"]=0;
			$return["header"]="Hatalı şifre";
			$return["message"]="Eski şifreniz hatalıdır, şifre değişikliği yapılamadı!";
			$this->log->alert($sirketID,$userID,"kullaniciSifreDegistir","Hatalı eski şifre ile şifre değişikliği denemesi.Eski şifre:($eskiSifre) - Yeni Şifre($yeniSifre)",$this->ipAdress);
		}			
		return $return;
			
		
	}
    function adminPassReset($sirketID,$userID,$yeniSifre){

        $newPassWord = password_hash($yeniSifre, PASSWORD_DEFAULT);
        $sqlUpdate = "UPDATE `kullanicilar` SET `kullaniciSifre` = '$newPassWord' WHERE `kullanicilar`.`ID` = $userID AND `sirketID`=$sirketID;";
        $veriUpdate = $this->dbc->prepare($sqlUpdate);
        $veriUpdate->execute();
    }
	public function kullaniciHesapBak($sirketID,$userID,$yetki){
		$return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
		$sql="SELECT `kullaniciAdi`,`kullaniciEposta`,`kullaniciYetki`,`kullaniciAktifmi` FROM `kullanicilar` WHERE `ID`=$userID;";
		$result =$this->getSqlResult($sql);
		if(!$result){
			$return["status"]=0;
			$return["header"]="Hata";
			$return["message"]="Kullanıcı bilgileri bakılırken hata oluştu";
			$this->log->alert($sirketID,$userID,"kullaniciHesapBak","kullanıcı hesap bilgileri sorgulanırken hata oluştu ($userID)",$this->ipAdress);
			return $return;
		}
		switch ($result["kullaniciYetki"]) {
			case "0":
				$result["kullaniciYetki"]="yetkisiz";
			  break;
			case "10":
				$result["kullaniciYetki"]="calisan";
			  break;
			case "18":
				$result["kullaniciYetki"]="satisSorumlusu";
			break;
			case "19":
				$result["kullaniciYetki"]="satisMuduru";
			break;
			case "20":
				$result["kullaniciYetki"]="yonetici";
			break;
			case "999":
				$result["kullaniciYetki"]="superAdmin";
			break;
			default:
			$result["kullaniciYetki"]="Bilinmeyen";
		  }
		$return["status"]=1;
		$return["header"]="Başarılı";
		$return["message"]="Kullanıcı verileri alındı";
		$return["data"]=$result;
		return $return;

	}
	public function kullaniciMailBak($sirketID,$userID,$yetki){
		$sql = "SELECT `ayarDegeri` FROM `ayarlar` WHERE `sirketID` = $sirketID AND `userID` = $userID AND `ayarAdi` LIKE 'mailAyar'";
		$rawData = $this->getSqlResult($sql);
		if($rawData!= -1){
			if(isset($rawData["ayarDegeri"])){

				$data = json_decode($rawData["ayarDegeri"],1);
				return $data;
			}
			else{return false;}
		}
		else{
			return false;
		}
		
		
	}
    #endregion

    #region ACENTA  İŞLEMLERİ
    public function acentaEkle($sirketID,$userID,$yetki,$acenta){
        $return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
        $acentaAdi = htmlspecialchars(trim($acenta["acentaAdi"]), ENT_QUOTES); 
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Acenta ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaEkle","kullanıcı tarafından yetkisiz Acenta oluşturma isteği geldi ($acentaAdi)",$this->ipAdress);
            return $return;
        }
        $sql = "SELECT `ID` FROM `acentalar` WHERE `acentaAdi` LIKE '$acentaAdi' AND `sirketID` = $sirketID";
		$isAcentaExist = $this-> countReturnInt($sql);
        if($isAcentaExist > 0){
            $return = array("status"=>0,"message"=>"Bu acenta (".$acenta["acentaAdi"].") zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut acenta","data"=>"");
            $this->log->info($sirketID,$userID,"acentaEkle","mevcut acenta için yeni kayıt açılmaya çalışıldı ($acentaAdi)",$this->ipAdress);
            return $return;
        }
        try {
            $acentaTel = intVal($acenta["acentaTelefonu"]);
            $acentaVergiNo = intVal($acenta["acentaVergiNo"]);
            $AcentaEkleGrupAra = intVal($acenta["AcentaEkleGrupAra"]);
            $sql = "INSERT INTO `acentalar`(
                `ID`,
                `sirketID`,
                `acentaAdi`,
                `acentaAdresi`,
                `acentaTelefon`,
                `acentaFaturaBaslik`,
                `acentaVergiDairesi`,
                `acentaVergiNo`,
				`acentaGrubu`,
				`acentaIl`,
				`acentaIlce`,
				`acentaWeb`,
				`acentaEposta`
            )
            VALUES(
                NULL, 
                '$sirketID',
                '$acentaAdi', 
                '".htmlspecialchars(trim($acenta["acentaAdresi"]), ENT_QUOTES)."', 
                '".htmlspecialchars(trim($acenta["acentaTelefonu"]), ENT_QUOTES)."', 
                '".htmlspecialchars(trim($acenta["acentaFaturaBaslik"]), ENT_QUOTES)."', 
                '".htmlspecialchars(trim($acenta["acentaVergiDairesi"]), ENT_QUOTES)."', 
                '$acentaVergiNo',
                '$AcentaEkleGrupAra',
				'".htmlspecialchars(trim($acenta["acentaIl"]), ENT_QUOTES)."',
				'".htmlspecialchars(trim($acenta["acentaIlce"]), ENT_QUOTES)."',
				'".htmlspecialchars(trim($acenta["acentaWeb"]), ENT_QUOTES)."',
				'".htmlspecialchars(trim($acenta["acentaEposta"]), ENT_QUOTES)."'
				);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>$acenta["acentaAdi"]." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"acentaEkle","(id:$returnID) $acentaAdi  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>$acenta["acentaAdi"]." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"acentaEkle","(id:$returnID) $acentaAdi değerleri ile yeni acenta eklendi. ",$this->ipAdress);
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$acenta["acentaAdi"]." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("acentaEkle->  ".$acenta["acentaAdi"]." değerleri ile yeni acenta kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
        /*

        */
    }
	public function acentaSil($sirketID,$userID,$yetki,$acenta){
        $return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Acenta Silme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaSil","kullanıcı tarafından yetkisiz Acenta silme isteği geldi ($acenta)",$this->ipAdress);
            return $return;
        }
        try {
            
            $sql = "DELETE FROM `acentalar` WHERE `acentalar`.`ID` = $acenta;";
            $returnID = $this->deleteRecord($sql);
			if($returnID == 1){
				$return = array("status"=>1,"message"=>"Acenta Silindi","header"=>"İşlem Başarılı","data"=>"");
				$this->log->info($sirketID,$userID,"acentaSil","(id:$acenta) acenta Silindi. ",$this->ipAdress);
			}
			else{
				$return = array("status"=>0,"message"=>"Acenta silinirken bir Hata oluştu","header"=>"İşlem başarısız","data"=>"");
				$this->log->info($sirketID,$userID,"acentaSil","(id:$acenta) acenta silinemedi. ",$this->ipAdress);
			}            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$acenta." veritabanından silinirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("acentaSil->  ".$acenta." değerleri ile silinirken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
    }
    public function acentaListele($sirketID,$userID,$yetki,$limit=""){
        $return = array("status"=>0,"message"=>"","draw"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"data"=>array());
		
		$ekleLimit="";
		if($limit){ $ekleLimit="LIMIT 10"; }
		
		$sql="SELECT
				`acentalar`.`ID`,
                `acentalar`.`acentaAdi`,
                `acentalar`.`acentaAdresi`,
                `acentalar`.`acentaTelefon`,
                `acentalar`.`acentaFaturaBaslik`,
                `acentalar`.`acentaVergiDairesi`,
                `acentalar`.`acentaVergiNo`,
                `acentalar`.`acentaGrubu`,
                `acentalar`.`acentaIl`,
                `acentalar`.`acentaIlce`,
                `acentalar`.`acentaWeb`,
                `acentalar`.`acentaEposta`,
                `acentaGrup`.`grupAdi`,
				CONCAT('act', `acentalar`.`ID`) AS `DT_RowId`
			FROM
				`acentalar`
				 LEFT JOIN `acentaGrup` ON `acentaGrup`.`ID` = `acentalar`.`acentaGrubu`
			WHERE
				`sirketID` = $sirketID $ekleLimit";
		$result =  $this->getAllSqlResults($sql);
		if(count($result)>0){
			foreach($result as $veri){
				$editButton ="";
				$calisanButton ="";
                $sendIslem="";
				if($yetki >=$this->yetkiler["yonetici"]){ 
					$editButton ='<button type="button" class="btn btn-outline-warning btn-sm ml-2 "  onClick="acentaDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Acenta düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="acentaSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Acenta Sil"><i class="fa-solid fa-trash"></i></button>';
                   $calisanButton .='<button type="button" class="btn btn-outline-success btn-sm ml-2"  onClick="acentaCalisanEkle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Çalışan Ekle"><i class="fa-solid fa-person-circle-plus"></i></button>';
					
                }
                $calisanButton .='<button type="button" class="btn btn-outline-primary btn-sm ml-2"  onClick="acentaCalisanListe('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Çalışan listesi"><i class="fa-solid fa-people-group"></i></button>';
				$calisanButton .='<button type="button" class="btn btn-outline-info btn-sm ml-2"  onClick="teklifYazBasla('.$veri["ID"].',0)" data-toggle="tooltip" data-placement="top" title="Hızlı teklif yazmaya başla"><i class="fa-brands fa-wpforms"></i></button>';
				$sendIslem = $editButton.$calisanButton;
				
				$veri["islem"]=$sendIslem;
				array_push($return["data"],$veri);
			}
			$return["recordsTotal"]=count($return["data"]);
			$return["recordsFiltered"]=count($return["data"]);
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı acenta bulunamadı...";
		}
		return $return;
    }
	public function acentaSelectListe($sirketID,$userID,$yetki,$query=""){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		$sql="SELECT `ID` AS 'id', `acentaAdi` AS 'text'  FROM `acentalar` WHERE `sirketID` = $sirketID AND `acentaAdi` LIKE '%$query%'";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı acenta bulunamadı...";
		}
		return $return;
	}
    public function acentaDuzenleVeri($sirketID,$userID,$yetki,$acentaID){
        $return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Acenta düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaDuzenleVeri","kullanıcı tarafından yetkisiz Acenta düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM `acentalar` WHERE `ID` = $acentaID AND `sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı acenta bulunamadı...";
		}
		return $return;
        
    }
    public function acentaDuzenleKaydet($sirketID,$userID,$yetki,$acenta){
        $return = array("status"=>0,"message"=>"","header"=>"","data"=>"");

        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Acenta düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaDuzenleKaydet","kullanıcı tarafından yetkisiz Acenta düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }
        $this->changeLog($sirketID,$userID,"acentalar",$acenta["acentaDuzenleKaydet"]);
        $sql="UPDATE
            `acentalar`
            SET
                `acentaAdi` = '".htmlspecialchars(trim($acenta["acentaAdiDuzenle"]), ENT_QUOTES)."',
                `acentaAdresi` = '".htmlspecialchars(trim($acenta["acentaAdresiDuzenle"]), ENT_QUOTES)."',
                `acentaTelefon` = '".intVal($acenta["acentaTelefonuDuzenle"])."',
                `acentaFaturaBaslik` = '".htmlspecialchars(trim($acenta["acentaFaturaBaslikDuzenle"]), ENT_QUOTES)."',
                `acentaVergiDairesi` = '".htmlspecialchars(trim($acenta["acentaVergiDairesiDuzenle"]), ENT_QUOTES)."',
                `acentaVergiNo` = '".intVal($acenta["acentaVergiNoDuzenle"])."',
                `acentaGrubu` = '".intVal($acenta["AcentaDuzenleGrupAra"])."',
                `acentaIl` = '".htmlspecialchars(trim($acenta["acentaIl"]), ENT_QUOTES)."',
                `acentaIlce` = '".htmlspecialchars(trim($acenta["acentaIlce"]), ENT_QUOTES)."',
                `acentaWeb` = '".htmlspecialchars(trim($acenta["acentaWeb"]), ENT_QUOTES)."',
                `acentaEposta` = '".htmlspecialchars(trim($acenta["acentaEposta"]), ENT_QUOTES)."'

            WHERE
                `acentalar`.`ID` = ".htmlspecialchars(trim($acenta["acentaDuzenleKaydet"]), ENT_QUOTES).";";
        $updatedID = $this->updateReturnID($sql,$acenta["acentaDuzenleKaydet"]);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Güncelleme Başarılı";
			$this->log->info($sirketID,$userID,"acentaDuzenleKaydet","(acentaID:$updatedID) düzenlendi",$this->ipAdress);
            $sql="SELECT
				`acentalar`.`ID`,
                `acentalar`.`acentaAdi`,
                `acentalar`.`acentaAdresi`,
                `acentalar`.`acentaTelefon`,
                `acentalar`.`acentaFaturaBaslik`,
                `acentalar`.`acentaVergiDairesi`,
                `acentalar`.`acentaVergiNo`,
                `acentalar`.`acentaGrubu`,
                `acentalar`.`acentaIl`,
                `acentalar`.`acentaIlce`,
                `acentalar`.`acentaWeb`,
                `acentalar`.`acentaEposta`,
                `acentaGrup`.`grupAdi`,
				CONCAT('act', `acentalar`.`ID`) AS `DT_RowId`
			FROM
				`acentalar`
				 LEFT JOIN `acentaGrup` ON `acentaGrup`.`ID` = `acentalar`.`acentaGrubu`
			WHERE `acentalar`.`ID` = $updatedID AND `acentalar`.`sirketID` = $sirketID";
			$result=array();
            $result =  $this->getSqlResult($sql);
            $result["DT_RowId"]="act".$updatedID;

            $editButton ="";
            $calisanButton ="";
            $sendIslem="";
            if($yetki >=$this->yetkiler["yonetici"]){ 
                $editButton ='<button type="button" class="btn btn-outline-warning btn-sm" ml-2  onClick="acentaDuzenle('.$updatedID.')" data-toggle="tooltip" data-placement="top" title="Acenta düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
				$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="acentaSilConfirm('.$updatedID.')" data-toggle="tooltip" data-placement="top" title="Acenta Sil"><i class="fa-solid fa-trash"></i></button>';
                $calisanButton .='<button type="button" class="btn btn-outline-success btn-sm ml-2"  onClick="acentaCalisanEkle('.$updatedID.')" data-toggle="tooltip" data-placement="top" title="Çalışan Ekle"><i class="fa-solid fa-person-circle-plus"></i></button>';
                
            }
            $calisanButton .='<button type="button" class="btn btn-outline-primary btn-sm ml-2"  onClick="acentaCalisanListe('.$updatedID.')" data-toggle="tooltip" data-placement="top" title="Çalışan listesi"><i class="fa-solid fa-people-group"></i></button>';
            $calisanButton .='<button type="button" class="btn btn-outline-info btn-sm ml-2"  onClick="teklifYazBasla('.$updatedID.',0)" data-toggle="tooltip" data-placement="top" title="Hızlı teklif yazmaya başla"><i class="fa-brands fa-wpforms"></i></button>';
            $sendIslem = $editButton.$calisanButton;
            
            $result["islem"]=$sendIslem;



            $return["data"]=$result;
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu <br>( ".$acenta["acentaAdiDuzenle"]." )";
            $return["data"]=$updatedID;
            $this->log->warning($sirketID,$userID,"acentaDuzenleKaydet","(hizmetID:".$acenta["acentaDuzenleKaydet"].") düzenlenirken bir hata oluştu",$this->ipAdress);
		}
        return $return;
    }
	public function acentaAdiBak($sirketID,$userID,$yetki,$acentaID){
		$return = array("status"=>0,"message"=>"","data"=>array());
		$sql="SELECT `acentaAdi` FROM `acentalar` WHERE `sirketID`= $sirketID AND `ID` = $acentaID;";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı acenta bulunamadı...";
		}
		return $return;

	}
	#endregion

	#region Acenta Çalışanlar
	public function AcentaEkleGrupLoad($sirketID,$userID,$yetki,$query){
		$return = array("status"=>0,"message"=>"","data"=>"","results"=>array());
		$sqlEkle="";
		if($query != ""){
			$sqlEkle=" WHERE `acentaGrup` LIKE '%$query%'";
		}
		$sql="SELECT
			`ID` AS 'id',
			`grupAdi` AS 'text',
			`grupIcon` AS 'icon'
		FROM
			`acentaGrup` $sqlEkle";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["results"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı grup bulunamadı...";
		}
		return $return;
	}
	public function acentaCalisanEkle($sirketID,$userID,$yetki,$calisan){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Çalışan ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaCalisanEkle","kullanıcı tarafından yetkisiz Acenta çalışan ekleme isteği geldi",$this->ipAdress);
            return $return;
        }	
		$sql = "SELECT
			*
		FROM
			`acentaCalisanlar`
		WHERE
			`acentaID` = ".$calisan["acentaID"]." AND 
			`calisanAdi` LIKE '".$calisan["calisanEkleAdi"]."' ";

		$iscalisanExist = $this-> countReturnInt($sql);
        if($iscalisanExist > 0){
            $return = array("status"=>0,"message"=>"Bu çalışan (".$calisan["calisanEkleAdi"].") zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut acenta çalışanı","data"=>"");
            $this->log->info($sirketID,$userID,"acentaCalisanEkle","mevcut acenta çalışanı için yeni kayıt açılmaya çalışıldı (acentaID:".$calisan["acentaID"].")(".$calisan["calisanEkleAdi"].")",$this->ipAdress);
            return $return;
        }
		try {
			$acentaID = intVal($calisan["acentaID"]);
			$calisanAktifmi = intVal($calisan["calisanEkleDurum"]);
			$calisanTelefon = intVal($calisan["calisanEkleTelefon"]);
			$sql = "INSERT INTO `acentaCalisanlar`(
				`ID`,
				`acentaID`,
				`calisanAdi`,
				`calisanTelefon`,
				`calisanEposta`,
				`calisanNot`,
				`calisanAktifmi`,
				`calisanTelefon2`,
				`calisanTelefon3`,
				`calisanEposta2`,
				`sirketPozisyonu`
			)
			VALUES(
				NULL,
				'$acentaID',
				'".htmlspecialchars(trim($calisan["calisanEkleAdi"]), ENT_QUOTES)."',
				'$calisanTelefon',
				'".htmlspecialchars(trim($calisan["calisanEkleEposta"]), ENT_QUOTES)."',
				'".htmlspecialchars(trim($calisan["calisanEkleNot"]), ENT_QUOTES)."',
				'$calisanAktifmi',
				'".htmlspecialchars(trim($calisan["calisanEkleTelefon2"]), ENT_QUOTES)."',
				'".htmlspecialchars(trim($calisan["calisanEkleTelefon3"]), ENT_QUOTES)."',
				'".htmlspecialchars(trim($calisan["calisanEkleEposta2"]), ENT_QUOTES)."',
				'".htmlspecialchars(trim($calisan["calisanEklePozisyon"]), ENT_QUOTES)."'
			);";
			$returnID = $this->insertReturnID($sql);
			if($returnID<=0){

				$return = array("status"=>0,"message"=>$calisan["calisanEkleAdi"]." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
				$this->log->warning($sirketID,$userID,"acentaCalisanEkle","(id:$returnID) (acentaID:$acentaID)".htmlspecialchars(trim($calisan["calisanEkleAdi"]), ENT_QUOTES)."  için Kayıt oluşturulurken bir hata oluştu.",$this->ipAdress);
				return $return;
			}
			$return = array("status"=>1,"message"=>$calisan["calisanEkleAdi"]." için Kayıt eklendi $returnID","header"=>"Başarılı","data"=>$returnID);
			$this->log->info($sirketID,$userID,"acentaCalisanEkle","(id:$returnID)(acentaID:$acentaID) ".htmlspecialchars(trim($calisan["calisanEkleAdi"]), ENT_QUOTES)." adı ile yeni acenta çalışanı eklendi. ",$this->ipAdress);
			
			return $return;
		}
		catch(PDOException $e ) { 
			$return = array("status"=>0,"message"=>$calisan["calisanEkleAdi"]." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
			$this->log->writeUserError("acentaCalisanEkle->  ".$calisan["calisanEkleAdi"]." değerleri ile yeni acenta kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
			return $return; 
		}
	}
	public function acentaCalisanSil($sirketID,$userID,$yetki,$acentaCalisan){
        $return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Acenta Çalışan Silme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaCalisanSil","kullanıcı tarafından yetkisiz Acenta Çalışan silme isteği geldi ($acentaCalisan)",$this->ipAdress);
            return $return;
        }
        try {
            
            $sql = "DELETE FROM `acentaCalisanlar` WHERE `acentaCalisanlar`.`ID` = $acentaCalisan;";
            $returnID = $this->deleteRecord($sql);
			if($returnID == 1){
				$return = array("status"=>1,"message"=>"Acenta Çalışanı Silindi","header"=>"İşlem Başarılı","data"=>"");
				$this->log->info($sirketID,$userID,"acentaCalisanSil","(id:$acentaCalisan) acenta çalışanı Silindi. ",$this->ipAdress);
			}
			else{
				$return = array("status"=>0,"message"=>"Acenta Çalışanı silinirken bir Hata oluştu","header"=>"İşlem başarısız","data"=>"");
				$this->log->info($sirketID,$userID,"acentaCalisanSil","(id:$acentaCalisan) acenta çalışanı silinemedi. ",$this->ipAdress);
			}            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$acentaCalisan." veritabanından silinirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("acentaCalisanSil->  ".$acentaCalisan." değerleri ile silinirken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
    }
	public function acentaCalisanListele($sirketID,$userID,$yetki,$acentaID){
		$return = array("status"=>0,"message"=>"","draw"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"data"=>array());

		
		$sql="SELECT *,CONCAT('acID',`acentaCalisanlar`.`ID`) AS `DT_RowId` FROM `acentaCalisanlar` WHERE `acentaID` = $acentaID";
		$result =  $this->getAllSqlResults($sql);
		try{
			if($result && count($result)>0){
				foreach($result as $veri){
					$editButton ="";
					$calisanButton ="";
					$sendIslem="";
					if($yetki >=$this->yetkiler["yonetici"]){ 
						$editButton ='<button type="button" class="btn btn-outline-warning btn-sm ml-1"   onClick="acentaCalisanDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Acenta Çalışan düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
						$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-1 "  onClick="acentaCalisanSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Çalışan Sil"><i class="fa-solid fa-trash"></i></button>';
					}
				
					$calisanButton .='<button type="button" class="btn btn-outline-info btn-sm ml-1"  onClick="teklifYazBasla('.$veri["acentaID"].','.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Hızlı teklif yazmaya başla"><i class="fa-brands fa-wpforms"></i></button>';
					$sendIslem = $editButton.$calisanButton;
					
					$veri["islem"]=$sendIslem;
					array_push($return["data"],$veri);
				}
				$return["recordsTotal"]=count($return["data"]);
				$return["recordsFiltered"]=count($return["data"]);
				$return["status"]=1;
				return $return;
			}
			else{
				$return["message"]="Acentaya kayıtlı çalışan bulunamadı...";
			}
		}
		catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>" veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("acentaCalisanListele-> (acentaid:$acentaID) değerleri ile acenta çalışan liste sorgusu yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
		return $return;
	}
	public function acentaCalisanSelectListe($sirketID,$userID,$yetki,$acentaID,$query=""){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		$sql="SELECT
				`ID` AS 'id',
				`calisanAdi` AS 'text'
			FROM
				`acentaCalisanlar`
			WHERE
				`acentaID` = $acentaID AND `calisanAdi` LIKE '%$query%'";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Acenta için çalışan kayıdı yok...";
		}
		return $return;
	}
	public function acentaCalisanDuzenleVeri($sirketID,$userID,$yetki,$acentaCalisanID){
        $return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Acenta Çalışan düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaCalisanDuzenleVeri","kullanıcı tarafından yetkisiz Acenta Çalışan düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM `acentaCalisanlar` WHERE `ID` = $acentaCalisanID";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı acenta çalışanı bulunamadı...";
		}
		return $return;
        
    }
	public function acentaCalisanDuzenleKaydet($sirketID,$userID,$yetki,$calisan){
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");

        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Acenta Çalışanı düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"acentaCalisanDuzenleKaydet","kullanıcı tarafından yetkisiz Acenta kullanıcı düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }
        $this->changeLog($sirketID,$userID,"acentaCalisanlar",$calisan["acentaCalisanDuzenleKaydet"]);
        $sql="UPDATE
				`acentaCalisanlar`
			SET
				`calisanAdi` = '".htmlspecialchars(trim($calisan["calisanDuzenleAdi"]), ENT_QUOTES)."',
				`calisanTelefon` = '".intVal($calisan["calisanDuzenleTelefon"])."',
				`calisanEposta` = '".htmlspecialchars(trim($calisan["calisanDuzenleEposta"]), ENT_QUOTES)."',
				`calisanNot` = '".htmlspecialchars(trim($calisan["calisanDuzenleNot"]), ENT_QUOTES)."',
				`calisanAktifmi` = '".intVal($calisan["calisanDuzenleDurum"])."'
			WHERE
				`acentaCalisanlar`.`ID` = ".$calisan["acentaCalisanDuzenleKaydet"].";";
        $updatedID = $this->updateReturnID($sql,$calisan["acentaCalisanDuzenleKaydet"]);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Güncelleme Başarılı";
			$this->log->info($sirketID,$userID,"acentaCalisanDuzenleKaydet","(acentaCalisanID:$updatedID) düzenlendi",$this->ipAdress);
            $sql="SELECT * FROM `acentaCalisanlar` WHERE `ID` = $updatedID";
            $result =  $this->getSqlResult($sql);
            $result["DT_RowId"]="acID".$calisan["acentaCalisanDuzenleKaydet"];

            $editButton ="";
            $calisanButton ="";
            $sendIslem="";
            if($yetki >=$this->yetkiler["yonetici"]){ 
				$editButton ='<button type="button" class="btn btn-outline-warning btn-sm" ml-2  onClick="acentaCalisanDuzenle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Acenta Çalışan düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';					
			}
		
			$calisanButton .='<button type="button" class="btn btn-outline-info btn-sm ml-2"  onClick="teklifYazBasla('.$result["acentaID"].','.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Hızlı teklif yazmaya başla"><i class="fa-brands fa-wpforms"></i></button>';
			$sendIslem = $editButton.$calisanButton;
            $sendIslem = $editButton.$calisanButton;
            
            $result["islem"]=$sendIslem;



            $return["data"]=$result;
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu <br>( ".$calisan["acentaAdiDuzenle"]." )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"acentaCalisanDuzenleKaydet","(acentaCalisanID:".$calisan["acentaCalisanDuzenleKaydet"].") düzenlenirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;
	}
	public function acentaCalisanAdiBak($sirketID,$userID,$yetki,$calisanID){
		$return = array("status"=>0,"message"=>"","data"=>array());
		$sql="SELECT `calisanAdi` FROM `acentaCalisanlar` WHERE `ID`= $calisanID;";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı acenta çalışanı bulunamadı...";
		}
		return $return;
	}
	public function acentaCalisanMailBak($sirketID,$userID,$yetki,$calisanID){
		$sql="SELECT `calisanEposta` FROM `acentaCalisanlar` WHERE `ID`= $calisanID;";
		$result =  $this->getSqlResult($sql);
		if($result){ return $result; }
		else{ return false; }
	}
	#endregion

	#region PERSONEL
	public function personelDepartmanAra($sirketID,$userID,$yetki,$payload=0){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		$sqlEkle="";
		if($payload != "0"){
			$sqlEkle=" AND `depratman` LIKE '%$payload%'";
		}
		$sql="SELECT
			`ID` AS 'id',
			`depratman` AS 'text'
		FROM `personelDepartman` WHERE `sirketID` = $sirketID  $sqlEkle";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Departman bulunamadı...";
		}
		return $return;
	}

	public function personelGorevAra($sirketID,$userID,$yetki,$payload=0){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		$sqlEkle="";
		if($payload != "0"){
			$sqlEkle=" AND `departmanID` = '$payload'";
		}
		$sql="SELECT
			`ID` AS 'id',
			`pozisyon` AS 'text'
		FROM `personelPozisyon` WHERE `sirketID` = $sirketID  $sqlEkle";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı iş pozisyonu bulunamadı...";
		}
		return $return;
	}
	public function personelEkle($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Personel ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"Personel","kullanıcı tarafından yetkisiz Personel ekleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$personelEkleAdi=htmlspecialchars(trim($payload["personelEkleAdi"]), ENT_QUOTES);
		$personelEkleTC=htmlspecialchars(trim($payload["personelEkleTC"]), ENT_QUOTES);
		if($personelEkleTC==""){
			$return = array("status"=>0,"message"=>"Personel T.C kimlik no boş bırakılamaz","header"=>"Veri yok!","data"=>"");
            $this->log->info($sirketID,$userID,"personelEkle","Personel T.C kimlik no boş geldi",$this->ipAdress);
            return $return;
		}
		$sql = "SELECT * FROM `personel` WHERE `sirketID` = $sirketID AND `personelTC` LIKE '$personelEkleTC'";
		$ispersonelExist = $this-> countReturnInt($sql);
        if($ispersonelExist > 0){
            $return = array("status"=>0,"message"=>"Bu personel ($personelEkleAdi) zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut personel","data"=>"");
            $this->log->info($sirketID,$userID,"personelEkle","mevcut personel için yeni kayıt açılmaya çalışıldı ($personelEkleAdi)",$this->ipAdress);
            return $return;
        }
        try {
			$personelDepartman = 0;
			$personelGorev = 0;
			if($payload["personelDepartman"]!= "null" && $payload["personelDepartman"]!=""){
				$personelDepartman =intVal($payload["personelDepartman"]);
			}
			if($payload["personelGorev"]!= "null" && $payload["personelGorev"]!=""){
				$personelGorev =intVal($payload["personelGorev"]);
			}
			$personelEkleDurum = intVal($payload["personelEkleDurum"]);
			$personelEkleAdres = htmlspecialchars(trim($payload["personelEkleAdres"]), ENT_QUOTES);
			$personelEkleEhliyet = htmlspecialchars(trim($payload["personelEkleEhliyet"]), ENT_QUOTES);
			$personelEkleEposta = htmlspecialchars(trim($payload["personelEkleEposta"]), ENT_QUOTES);
			$personelEklePasaport = htmlspecialchars(trim($payload["personelEklePasaport"]), ENT_QUOTES);
			$personelEkleTelefon1 = htmlspecialchars(trim($payload["personelEkleTelefon1"]), ENT_QUOTES);
			$personelEkleTelefon2 = htmlspecialchars(trim($payload["personelEkleTelefon2"]), ENT_QUOTES);
			$personelEkleDogumTarihi =htmlspecialchars(trim($payload["personelEkleDogumTarihi"]), ENT_QUOTES);
			//$source = '2012-07-31';
			$date = new DateTime($personelEkleDogumTarihi);
			$dogumTarihi =  $date->format('Y-m-d'); // 31.07.2012
			$personelDurum = htmlspecialchars(trim($payload["personelEkleDurum"]), ENT_QUOTES);
			//$ekipmanAdi = htmlspecialchars(trim($payload["hizmetEkleAdi"]), ENT_QUOTES);
			
            $sql = "INSERT INTO `personel`(
					`ID`,
					`sirketID`,
					`personelAd`,
					`personelAdres`,
					`personelTelefon`,
					`personelTelefon2`,
					`personelEposta`,
					`personelDogum`,
					`personelEhliyet`,
					`personelTC`,
					`personelPasaport`,
					`personelFoto`,
					`personelDepartman`,
					`personelGorev`,
					`personelDurum`
				)
				VALUES(
					NULL,
					'$sirketID',
					'$personelEkleAdi',
					'$personelEkleAdres',
					'$personelEkleTelefon1',
					'$personelEkleTelefon2',
					'$personelEkleEposta',
					'$dogumTarihi',
					'$personelEkleEhliyet',
					'$personelEkleTC',
					'$personelEklePasaport',
					'null',
					'$personelDepartman',
					'$personelGorev',
					'$personelDurum'
				);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>$personelEkleAdi." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"personelEkle","(id:$returnID) $personelEkleAdi  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>$personelEkleAdi." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"personelEkle","(id:$returnID) $personelEkleAdi değerleri ile yeni personel eklendi. ",$this->ipAdress);
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$personelEkleAdi." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("personelEkle->  ".$personelEkleAdi." değerleri ile yeni personel kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
	}

    public function personelListele($sirketID,$userID,$yetki,$limit=""){
        $return = array("status"=>0,"message"=>"","draw"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"data"=>array());
		
		$ekleLimit="";
		if($limit){ $ekleLimit="LIMIT 10"; }
		
		$sql="SELECT
				`personel`.`ID`,
				`personel`.`personelAd`,
				`personel`.`personelAdres`,
				`personel`.`personelTelefon`,
				`personel`.`personelTelefon2`,
				`personel`.`personelEposta`,
				`personel`.`personelDogum`,
				`personel`.`personelEhliyet`,
				`personel`.`personelTC`,
				`personel`.`personelPasaport`,
				`personel`.`personelFoto`,
				`personel`.`personelDepartman`,
				`personel`.`personelGorev`,
				`personelDepartman`.`depratman`,
				`personelPozisyon`.`pozisyon`,
				CONCAT('prs', `personel`.`ID`) AS `DT_RowId`
			FROM
				`personel`
				LEFT JOIN `personelDepartman` ON `personel`.`personelDepartman` = `personelDepartman`.`ID`
				LEFT JOIN `personelPozisyon` ON `personel`.`personelGorev` = `personelPozisyon`.`ID`
			WHERE
				`personel`.`sirketID` = $sirketID  $ekleLimit";
		$result =  $this->getAllSqlResults($sql);
		if(count($result)>0){
			foreach($result as $veri){
				$editButton ="";
				$calisanButton ="";
                $sendIslem="";
				if($yetki >=$this->yetkiler["yonetici"]){ 
					$editButton ='<button type="button" class="btn btn-outline-warning btn-sm ml-2 "  onClick="personelDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Personel Bilgileri Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="personelSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Personel Sil"><i class="fa-solid fa-trash"></i></button>';	
					$calisanButton .='<button type="button" class="btn btn-outline-primary btn-sm ml-2"  onClick="personelIzinleri('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Personel İzinleri düzenle"><i class="fa-solid fa-bolt"></i></button>';
                }
                
				$sendIslem = $editButton.$calisanButton;
				
				$veri["islem"]=$sendIslem;
				array_push($return["data"],$veri);
			}
			$return["recordsTotal"]=count($return["data"]);
			$return["recordsFiltered"]=count($return["data"]);
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Personel bulunamadı...";
		}
		return $return;
    }

    public function personelDuzenleVeri($sirketID,$userID,$yetki,$personelID){
        $return = array("status"=>0,"message"=>"","data"=>array());
		if(!$personelID){
			 $return = array("status"=>0,"message"=>"Düzenlenecek personel bulunamadı","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"personelDuzenleVeri","kullanıcı tarafından ID'siz Personel düzenleme isteği geldi",$this->ipAdress);
            return $return;
		}
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Personel düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"personelDuzenleVeri","kullanıcı tarafından yetkisiz Personel düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM `personel` WHERE `ID` = $personelID AND `sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı personel bulunamadı...";
		}
		return $return;
        
    }
	public function personelDuzenleKaydet($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		$personelTC = $payload["personelDuzenleTC"];
		if($payload["personelDuzenleTC"]==""){
			 $return = array("status"=>0,"message"=>"Personel T.C. No boş olamaz","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"personelDuzenleKaydet","Personel T.C. No boş geldi",$this->ipAdress);
            return $return;
		}
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Personel düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"personelDuzenleKaydet","kullanıcı tarafından yetkisiz personel düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$personelID = $payload["personelDuzenleKaydet"];
		$search = "`personel`.`ID` = $personelID;";
		if($personelID<=0){
			$search = "`personel`.`personelTC` LIKE '$personelTC';";
		}
		$personelDuzenleAdi="";
		if(isset($payload["personelDuzenleAdi"])&&$payload["personelDuzenleAdi"]!=""){$personelDuzenleAdi="`personelAd` = '".htmlspecialchars(trim($payload["personelDuzenleAdi"]))."',";}
		$personelDuzenleAdres="";
		if(isset($payload["personelDuzenleAdres"])&&$payload["personelDuzenleAdres"]!=""){$personelDuzenleAdres="`personelAdres` = '".htmlspecialchars(trim($payload["personelDuzenleAdres"]))."',";}
		if(isset($payload["personelDuzenleDogumTarihi"])&&$payload["personelDuzenleDogumTarihi"]!=""){
			$date = new DateTime($payload["personelDuzenleDogumTarihi"]);
			$dogumTarihi =  $date->format('Y-m-d');
			$personelDuzenleDogumTarihi="";
			$personelDuzenleDogumTarihi="`personelDogum` = '".htmlspecialchars(trim($dogumTarihi))."',";
		}
		$personelDuzenleDurum="";
		if(isset($payload["personelDuzenleDurum"])&&$payload["personelDuzenleDurum"]!=""){$personelDuzenleDurum="`personelDurum` = '".htmlspecialchars(trim($payload["personelDuzenleDurum"]))."',";}
		$personelDuzenleEhliyet="";
		if(isset($payload["personelDuzenleEhliyet"])&&$payload["personelDuzenleEhliyet"]!=""){$personelDuzenleEhliyet="`personelEhliyet` = '".htmlspecialchars(trim($payload["personelDuzenleEhliyet"]))."',";}
		$personelDuzenleEposta="";
		if(isset($payload["personelDuzenleEposta"])&&$payload["personelDuzenleEposta"]!=""){$personelDuzenleEposta="`personelEposta` = '".htmlspecialchars(trim($payload["personelDuzenleEposta"]))."',";}
		$personelDuzenlePasaport="";
		if(isset($payload["personelDuzenlePasaport"])&&$payload["personelDuzenlePasaport"]!=""){$personelDuzenlePasaport="`personelPasaport` = '".htmlspecialchars(trim($payload["personelDuzenlePasaport"]))."',";}
		$personelDuzenleTelefon1="";
		if(isset($payload["personelDuzenleTelefon1"])&&$payload["personelDuzenleTelefon1"]!=""){$personelDuzenleTelefon1="`personelTelefon` = '".htmlspecialchars(trim($payload["personelDuzenleTelefon1"]))."',";}
		$personelDuzenleTelefon2="";
		if(isset($payload["personelDuzenleTelefon2"])&&$payload["personelDuzenleTelefon2"]!=""){$personelDuzenleTelefon2="`personelTelefon2` = '".htmlspecialchars(trim($payload["personelDuzenleTelefon2"]))."',";}
		$personelDuzenleDepartman="";
		if(isset($payload["personelDuzenleDepartman"])&&$payload["personelDuzenleDepartman"]!=""){$personelDuzenleDepartman="`personelDepartman` = '".htmlspecialchars(trim($payload["personelDuzenleDepartman"]))."',";}
		$personelDuzenleGorev="";
		if(isset($payload["personelDuzenleGorev"])&&$payload["personelDuzenleGorev"]!=""){$personelDuzenleGorev="`personelGorev` = '".htmlspecialchars(trim($payload["personelDuzenleGorev"]))."',";}
		$this->changeLog($sirketID,$userID,"personel",$personelID);
		$sql ="UPDATE
				`personel`
			SET
				$personelDuzenleAdi
				$personelDuzenleAdres
				$personelDuzenleTelefon1
				$personelDuzenleTelefon2
				$personelDuzenleEposta
				$personelDuzenleDogumTarihi
				$personelDuzenleEhliyet
				$personelDuzenleDurum
				$personelDuzenlePasaport
				$personelDuzenleDepartman
				$personelDuzenleGorev
				`personelTC` = '$personelTC'
			WHERE
				$search";
					
			
        $updatedID = $this->updateReturnID($sql,$personelID);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Güncelleme Başarılı";
			$this->log->info($sirketID,$userID,"personelDuzenleKaydet","(personelID:$updatedID) düzenlendi",$this->ipAdress);
            $sql="SELECT 
				`personel`.`ID`,
				`personel`.`personelAd`,
				`personel`.`personelAdres`,
				`personel`.`personelTelefon`,
				`personel`.`personelTelefon2`,
				`personel`.`personelEposta`,
				`personel`.`personelDogum`,
				`personel`.`personelEhliyet`,
				`personel`.`personelTC`,
				`personel`.`personelPasaport`,
				`personel`.`personelFoto`,
				`personel`.`personelDepartman`,
				`personel`.`personelGorev`,
				`personelDepartman`.`depratman`,
				`personelPozisyon`.`pozisyon`,
				CONCAT('prs', `personel`.`ID`) AS `DT_RowId`
			FROM 
				`personel`
				LEFT JOIN `personelDepartman` ON `personel`.`personelDepartman` = `personelDepartman`.`ID`
				LEFT JOIN `personelPozisyon` ON `personel`.`personelGorev` = `personelPozisyon`.`ID`
			 WHERE `personel`.`ID` = $updatedID";
            $result =  $this->getSqlResult($sql);
            $result["DT_RowId"]="prs".$personelID;


            if($yetki >=$this->yetkiler["yonetici"]){ 
				$editButton ='<button type="button" class="btn btn-outline-warning btn-sm ml-2 "  onClick="personelDuzenle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Personel Bilgileri Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
				$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="personelSilConfirm('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Personel Sil"><i class="fa-solid fa-trash"></i></button>';	
				$calisanButton ='<button type="button" class="btn btn-outline-primary btn-sm ml-2"  onClick="personelIzinleri('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Personel İzinleri düzenle"><i class="fa-solid fa-bolt"></i></button>';
			}
		
			$sendIslem = $editButton.$calisanButton;
            $sendIslem = $editButton.$calisanButton;
            
            $result["islem"]=$sendIslem;
            $return["data"]=$result;
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu <br>( ".$payload["personelDuzenleAdi"]." )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"acentaCalisanDuzenleKaydet","(acentaCalisanID:".$personelID.") düzenlenirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;
	}
	#endregion

	#region KASA İŞLEMLERİ
	public function kasaEkle($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Kasa ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"kasaEkle","kullanıcı tarafından yetkisiz Kasa ekleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$kasaEkleAdi=htmlspecialchars(trim($payload["kasaEkleAdi"]), ENT_QUOTES);
		if($kasaEkleAdi==""){
			$return = array("status"=>0,"message"=>"Kasa Adı boş bırakılamaz","header"=>"Veri yok!","data"=>"");
            $this->log->info($sirketID,$userID,"kasaEkle","Kasa Adı no boş geldi",$this->ipAdress);
            return $return;
		}
		$sql = "SELECT * FROM `kasa` WHERE `sirketID` = $sirketID AND `kasaAdi` LIKE '$kasaEkleAdi'";
		$isKasaExist = $this-> countReturnInt($sql);
        if($isKasaExist > 0){
            $return = array("status"=>0,"message"=>"Bu Kasa ($kasaEkleAdi) zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut Kasa","data"=>"");
            $this->log->info($sirketID,$userID,"kasaEkle","mevcut kasa için yeni kayıt açılmaya çalışıldı ($kasaEkleAdi)",$this->ipAdress);
            return $return;
        }
        try {
			
			$kasaEkleBankaAdi=htmlspecialchars(trim($payload["kasaEkleBankaAdi"]), ENT_QUOTES);
			$kasaEkleDurum = intVal($payload["kasaEkleDurum"]);
			$kasaEkleBankaKodu = htmlspecialchars(trim($payload["kasaEkleBankaKodu"]), ENT_QUOTES);
			$kasaEkleHesapNo = htmlspecialchars(trim($payload["kasaEkleHesapNo"]), ENT_QUOTES);
			$kasaEkleIBAN = htmlspecialchars(trim($payload["kasaEkleIBAN"]), ENT_QUOTES);
			
			
            $sql = "INSERT INTO `kasa`(
				`ID`,
				`sirketID`,
				`kasaAdi`,
				`bankami`,
				`bankaAdi`,
				`bankaKodu`,
				`iban`,
				`hesapNo`
			)
			VALUES(
				NULL,
				'$sirketID',
				'$kasaEkleAdi',
				'$kasaEkleDurum',
				'$kasaEkleBankaAdi',
				'$kasaEkleBankaKodu',
				'$kasaEkleIBAN',
				'$kasaEkleHesapNo'
			);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>$kasaEkleAdi." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"kasaEkle","(id:$returnID) $kasaEkleAdi  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>$kasaEkleAdi." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"kasaEkle","(id:$returnID) $kasaEkleAdi değerleri ile yeni kasa eklendi. ",$this->ipAdress);
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$kasaEkleAdi." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("kasaEkle->  ".$kasaEkleAdi." değerleri ile yeni kasa kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
	}
	public function kasaListele($sirketID,$userID,$yetki,$limit=""){
		 $return = array("status"=>0,"message"=>"","draw"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"data"=>array());
		
		$ekleLimit="";
		if($limit){ $ekleLimit="LIMIT 10"; }
		
		$sql="SELECT
				`kasa`.`ID`,
				`kasa`.`sirketID`,
				`kasa`.`kasaAdi`,
				`kasa`.`bankami`,
				`kasa`.`bankaAdi`,
				`kasa`.`bankaKodu`,
				`kasa`.`iban`,
				`kasa`.`hesapNo`,
				CONCAT('ksa', `kasa`.`ID`) AS `DT_RowId`
                FROM `kasa`
			WHERE
				`kasa`.`sirketID` = $sirketID  $ekleLimit";
		$result =  $this->getAllSqlResults($sql);
		if(is_array($result)&&count($result)>0){
			foreach($result as $veri){
				$editButton ="";
				$calisanButton ="";
                $sendIslem="";
				if($yetki >=$this->yetkiler["yonetici"]){ 
					$editButton ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="kasaDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Kasa Bilgileri Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="kasaSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Kasa Sil"><i class="fa-solid fa-trash"></i></button>';	
					$calisanButton .='<button type="button" class="btn btn-outline-success btn-sm ml-2"  onClick="tahsilatEkle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Ekle"><i class="fa-solid fa-money-bill-1"></i></button>';
					$calisanButton .='<button type="button" class="btn btn-outline-warning btn-sm ml-2"  onClick="masrafEkle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Masraf Ekle"><i class="fa-solid fa-file-invoice"></i></button>';
                }
                
				$sendIslem = $editButton.$calisanButton;
				
				$veri["islem"]=$sendIslem;
				array_push($return["data"],$veri);
			}
			$return["recordsTotal"]=count($return["data"]);
			$return["recordsFiltered"]=count($return["data"]);
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Kasa bulunamadı...";
		}
		return $return;
	}

    public function kasaDuzenleVeri($sirketID,$userID,$yetki,$kasaID){
        $return = array("status"=>0,"message"=>"","data"=>array());
		if(!$kasaID){
			 $return = array("status"=>0,"message"=>"Düzenlenecek kasa bulunamadı","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"kasaDuzenleVeri","kullanıcı tarafından ID'siz kasa düzenleme isteği geldi",$this->ipAdress);
            return $return;
		}
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Kasa düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"kasaDuzenleVeri","kullanıcı tarafından yetkisiz kasa düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM `kasa` WHERE `ID` = $kasaID AND `sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı kasa bulunamadı...";
		}
		return $return;
        
    }

	public function kasaDuzenleKaydet($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		$kasaDuzenleID = $payload["kasaDuzenleKaydet"];
		if($payload["kasaDuzenleKaydet"]==""){
			 $return = array("status"=>0,"message"=>"Kasa belirteci No boş olamaz","header"=>"İşlem Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"kasaDuzenleKaydet","Kasa Düzenle ID No boş geldi",$this->ipAdress);
            return $return;
		}
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Kasa düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"kasaDuzenleKaydet","kullanıcı tarafından yetkisiz kasa düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$search = "`kasa`.`ID` = $kasaDuzenleID;";
		$kasaDuzenleDurum=htmlspecialchars(trim($payload["kasaDuzenleDurum"]));
		$kasaDuzenleAdi="";
		if(isset($payload["kasaDuzenleAdi"])&&$payload["kasaDuzenleAdi"]!=""){$kasaDuzenleAdi="`kasaAdi` = '".htmlspecialchars(trim($payload["kasaDuzenleAdi"]))."',";}
		
		$kasaDuzenleIBAN="`iban` = '',";
		$kasaDuzenleBankaAdi="`bankaAdi` = '',";
		$kasaDuzenleHesapNo="`hesapNo` = '',";
		$kasaDuzenleBankaKodu="`bankaKodu` = '',";
		if($kasaDuzenleDurum == "1"){
			if(isset($payload["kasaDuzenleIBAN"])&&$payload["kasaDuzenleIBAN"]!=""){$kasaDuzenleIBAN="`iban` = '".htmlspecialchars(trim($payload["kasaDuzenleIBAN"]))."',";}
			
			if(isset($payload["kasaDuzenleBankaAdi"])&&$payload["kasaDuzenleBankaAdi"]!=""){$kasaDuzenleBankaAdi="`bankaAdi` = '".htmlspecialchars(trim($payload["kasaDuzenleBankaAdi"]))."',";}
			
			if(isset($payload["kasaDuzenleHesapNo"])&&$payload["kasaDuzenleHesapNo"]!=""){$kasaDuzenleHesapNo="`hesapNo` = '".htmlspecialchars(trim($payload["kasaDuzenleHesapNo"]))."',";}
			
			if(isset($payload["kasaDuzenleBankaKodu"])&&$payload["kasaDuzenleBankaKodu"]!=""){$kasaDuzenleBankaKodu="`bankaKodu` = '".htmlspecialchars(trim($payload["kasaDuzenleBankaKodu"]))."',";}
		}
		$this->changeLog($sirketID,$userID,"kasa",$kasaDuzenleID);
		$sql ="UPDATE
				`kasa`
			SET
				$kasaDuzenleAdi
				$kasaDuzenleIBAN
				$kasaDuzenleBankaAdi
				$kasaDuzenleHesapNo
				$kasaDuzenleBankaKodu
				`bankami` = '$kasaDuzenleDurum'
			WHERE
				$search";
					
			
        $updatedID = $this->updateReturnID($sql,$kasaDuzenleID);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Güncelleme Başarılı";
			$this->log->info($sirketID,$userID,"kasaDuzenleKaydet","(kasaID:$updatedID) düzenlendi",$this->ipAdress);
            $sql="SELECT
				`kasa`.`ID`,
				`kasa`.`sirketID`,
				`kasa`.`kasaAdi`,
				`kasa`.`bankami`,
				`kasa`.`bankaAdi`,
				`kasa`.`bankaKodu`,
				`kasa`.`iban`,
				`kasa`.`hesapNo`,
				CONCAT('ksa', `kasa`.`ID`) AS `DT_RowId`
                FROM `kasa`
			WHERE `kasa`.`ID` = $updatedID";
            $result =  $this->getSqlResult($sql);
            $result["DT_RowId"]="ksa".$kasaDuzenleID;


            if($yetki >=$this->yetkiler["yonetici"]){ 
					$editButton ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="kasaDuzenle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Kasa Bilgileri Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="kasaSilConfirm('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Kasa Sil"><i class="fa-solid fa-trash"></i></button>';	
					$calisanButton ='<button type="button" class="btn btn-outline-success btn-sm ml-2"  onClick="tahsilatEkle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Ekle"><i class="fa-solid fa-money-bill-1"></i></button>';
					$calisanButton .='<button type="button" class="btn btn-outline-warning btn-sm ml-2"  onClick="masrafEkle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Masraf Ekle"><i class="fa-solid fa-file-invoice"></i></button>';
			}
		
			$sendIslem = $editButton.$calisanButton;
            
            $result["islem"]=$sendIslem;
            $return["data"]=$result;
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu <br>( ".$payload["kasaDuzenleAdi"]." )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"kasaDuzenleKaydet","(kasaID:".$kasaDuzenleID.") düzenlenirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;
	}
	public function kasaList($sirketID,$userID,$yetki){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		
		$sql="SELECT
			`ID` AS 'id',
			`kasaAdi` AS 'text'
		FROM `kasa` WHERE `sirketID` = $sirketID";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Ödeme Türü bulunamadı...";
		}
		return $return;
	}
	public function kasaSil($sirketID,$userID,$yetki,$kasaID){
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		if(!$kasaID){
			 $return = array("status"=>0,"message"=>"Kasa belirteci boş olamaz","header"=>"İşlem Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"kasaSil","Kasa ID boş geldi",$this->ipAdress);
            return $return;
		}
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Kasa silme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"kasaSil","kullanıcı tarafından yetkisiz kasa silme isteği geldi",$this->ipAdress);
            return $return;
        }
		$search = "`kasa`.`ID` = $kasaID;";

		$this->deleteLog($sirketID,$userID,"kasa",$search);
		$sql ="UPDATE `kasa` SET `sirketID` = '999' WHERE $search";
		$updatedID = $this->updateReturnID($sql,$kasaID);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Kasa Silindi";
			$this->log->info($sirketID,$userID,"kasaSil","(ID:$kasaID) silindi",$this->ipAdress);
			$return["data"]="ksa$updatedID";
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Silinirken bir hata oluştu <br>( $kasaID )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"kasaSil","(kasaID:".$kasaID.") silinirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;
	}
	#endregion

	#region Ödeme
	public function odemeTuruKaydet($sirketID,$userID,$yetki,$odemeTuruKaydet){
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Ödeme Türü ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeTuruKaydet","kullanıcı tarafından yetkisiz Ödeme Türü ekleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$odemeTuruKaydet=htmlspecialchars(trim($odemeTuruKaydet), ENT_QUOTES);
		if($odemeTuruKaydet==""){
			$return = array("status"=>0,"message"=>"Ödeme Türü boş bırakılamaz","header"=>"Veri yok!","data"=>"");
            $this->log->info($sirketID,$userID,"odemeTuruKaydet","Ödeme Türü boş geldi",$this->ipAdress);
            return $return;
		}
		$sql = "SELECT `ID` FROM `odemeTuru` WHERE `sirketID` = $sirketID AND `odemeTuru` LIKE '$odemeTuruKaydet'";
		$isOdemeExist = $this-> countReturnInt($sql);
        if($isOdemeExist > 0){
            $return = array("status"=>0,"message"=>"Bu Ödeme Türü ($odemeTuruKaydet) zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut Kasa","data"=>"");
            $this->log->info($sirketID,$userID,"odemeTuruKaydet","mevcut Ödeme Türü  için yeni kayıt açılmaya çalışıldı ($odemeTuruKaydet)",$this->ipAdress);
            return $return;
        }
        try {
			
			
			
			
            $sql = "INSERT INTO `odemeTuru`(
				`ID`,
				`sirketID`,
				`odemeTuru`
			)
			VALUES(
				NULL,
				'$sirketID',
				'$odemeTuruKaydet'
			);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>$odemeTuruKaydet." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"odemeTuruKaydet","(id:$returnID) $odemeTuruKaydet  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>$odemeTuruKaydet." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"odemeTuruKaydet","(id:$returnID) $odemeTuruKaydet değerleri ile yeni Ödeme Türü eklendi. ",$this->ipAdress);
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$odemeTuruKaydet." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("odemeTuruKaydet->  ".$odemeTuruKaydet." değerleri ile yeni Ödeme Türü kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }

	}
	public function OdemeCesidiEkleAra($sirketID,$userID,$yetki,$payload=0){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		
		$sql="SELECT
			`ID` AS 'id',
			`odemeTuru` AS 'text'
		FROM `odemeTuru` WHERE `sirketID` = $sirketID";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Ödeme Türü bulunamadı...";
		}
		return $return;
	}
	public function OdemeTuruAra($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		
		$sql="SELECT
			`ID` AS 'id',
			`odemeCesidi` AS 'text'
		FROM
			`odemeCesidi`
		WHERE
			`sirketID` = $sirketID AND `odemeTuru` = $payload;";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Ödeme Çeşidi bulunamadı...";
		}
		return $return;
	}
	public function odemeCesidiKaydet($sirketID,$userID,$yetki,$payload){
		$odemeTuru = $payload["odemeTuru"];
		$odemeCesidi = htmlspecialchars(trim($payload["odemeCesidiEkleCesidi"]), ENT_QUOTES);
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Ödeme Çeşidi ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeCesidiKaydet","kullanıcı tarafından yetkisiz Ödeme Çeşidi ekleme isteği geldi",$this->ipAdress);
            return $return;
        }
		if($odemeCesidi==""){
			$return = array("status"=>0,"message"=>"Ödeme Çesidi boş bırakılamaz","header"=>"Veri yok!","data"=>"");
            $this->log->info($sirketID,$userID,"odemeCesidiKaydet","Ödeme Çeşidi boş geldi",$this->ipAdress);
            return $return;
		}


		$sql = "SELECT `ID` FROM `odemeCesidi` WHERE `sirketID` = $sirketID AND `odemeTuru` = $odemeTuru AND `odemeCesidi` LIKE '$odemeCesidi'";
		$isOdemeExist = $this-> countReturnInt($sql);
        if($isOdemeExist > 0){
            $return = array("status"=>0,"message"=>"Bu Ödeme Çeşidi ($odemeCesidi) zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut Kasa","data"=>"");
            $this->log->info($sirketID,$userID,"odemeCesidiKaydet","mevcut Ödeme Çeşidi  için yeni kayıt açılmaya çalışıldı ($odemeCesidi)",$this->ipAdress);
            return $return;
        }
        try {
            $sql = "INSERT INTO `odemeCesidi`(
				`ID`,
				`sirketID`,
				`odemeTuru`,
				`odemeCesidi`
			)
			VALUES(
				NULL,
				'$sirketID',
				'$odemeTuru',
				'$odemeCesidi'
			);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>$odemeCesidi." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"odemeCesidiKaydet","(id:$returnID) $odemeCesidi  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>$odemeCesidi." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"odemeCesidiKaydet","(id:$returnID) $odemeCesidi değerleri ile yeni Ödeme Çeşidi eklendi. ",$this->ipAdress);
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$odemeCesidi." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("odemeCesidiKaydet->  ".$odemeCesidi." değerleri ile yeni Ödeme Çeşidi kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }

	}
	public function odemeCesidiListe($sirketID,$userID,$yetki,$limit=""){
		 $return = array("status"=>0,"message"=>"","draw"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"data"=>array());
		
		$ekleLimit="";
		if($limit){ $ekleLimit="LIMIT 10"; }
		
		$sql="SELECT
			`odemeCesidi`.`ID`,
			`odemeCesidi`.`odemeCesidi`,
			`odemeTuru`.`odemeTuru`,
			CONCAT('oCe', `odemeCesidi`.`ID`) AS `DT_RowId`
		FROM
			`odemeCesidi`
			LEFT JOIN `odemeTuru` ON `odemeCesidi`.`odemeTuru` = `odemeTuru`.`ID`
		WHERE `odemeCesidi`.`sirketID` =  $sirketID  $ekleLimit";
		$result =  $this->getAllSqlResults($sql);
		if(is_array($result)&&count($result)>0){
			foreach($result as $veri){
				$editButton ="";
				$calisanButton ="";
                $sendIslem="";
				if($yetki >=$this->yetkiler["yonetici"]){ 
					$editButton ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="odemeCesidiDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Çeşidi Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="odemeCesidiSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Çeşidi Sil"><i class="fa-solid fa-trash"></i></button>';
                }
                
				$sendIslem = $editButton;
				
				$veri["islem"]=$sendIslem;
				array_push($return["data"],$veri);
			}
			$return["recordsTotal"]=count($return["data"]);
			$return["recordsFiltered"]=count($return["data"]);
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Ödeme Türü bulunamadı...";
		}
		return $return;

	}
	public function odemeCesidiDuzenleVeri($sirketID,$userID,$yetki,$ID){
		   $return = array("status"=>0,"message"=>"","data"=>array());
		if(!$ID){
			 $return = array("status"=>0,"message"=>"Düzenlenecek Ödeme Çeşidi bulunamadı","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeCesidiDuzenleVeri","kullanıcı tarafından ID'siz Ödeme Çeşidi düzenleme isteği geldi",$this->ipAdress);
            return $return;
		}
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Ödeme Çeşidi düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeCesidiDuzenleVeri","kullanıcı tarafından yetkisiz Ödeme Çeşidi düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM `odemeCesidi` WHERE `ID` = $ID AND `sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Ödeme Çeşidi bulunamadı...";
		}
		return $return;
	}
	public function odemeCesidiDuzenleKaydet($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		$odemeCesidiID = $payload["odemeCesidiDuzenleID"];
		if($payload["odemeCesidiDuzenleID"]==""){
			 $return = array("status"=>0,"message"=>"Ödeme Çeşidi belirteci No boş olamaz","header"=>"İşlem Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeCesidiDuzenleKaydet","Ödeme Çeşidi ID boş geldi",$this->ipAdress);
            return $return;
		}
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Ödeme Çeşidi düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeCesidiDuzenleKaydet","kullanıcı tarafından yetkisiz Ödeme Çeşidi düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$search = "`odemeCesidi`.`ID` = $odemeCesidiID;";




		$odemeCesidi=htmlspecialchars(trim($payload["odemeCesidiDuzenleCesidi"]));
		$odemeTuru=htmlspecialchars(trim($payload["odemeTuru"]));
			
		$this->changeLog($sirketID,$userID,"odemeCesidi",$odemeCesidiID);
		$sql ="UPDATE
					`odemeCesidi`
				SET
					`odemeTuru` = '$odemeTuru',
					`odemeCesidi` = '$odemeCesidi'
				WHERE
				$search";
					
			
        $updatedID = $this->updateReturnID($sql,$odemeCesidiID);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Güncelleme Başarılı";
			$this->log->info($sirketID,$userID,"odemeCesidiDuzenleKaydet","(ID:$updatedID) düzenlendi",$this->ipAdress);
            $sql="SELECT
				`odemeCesidi`.`ID`,
				`odemeCesidi`.`odemeCesidi`,
				`odemeTuru`.`odemeTuru`,
				CONCAT('oCe', `odemeCesidi`.`ID`) AS `DT_RowId`
                FROM
					`odemeCesidi`
					LEFT JOIN `odemeTuru` ON `odemeCesidi`.`odemeTuru` = `odemeTuru`.`ID`
				WHERE `odemeCesidi`.`ID` = $updatedID";
            $result =  $this->getSqlResult($sql);
            $result["DT_RowId"]="oCe".$updatedID;


            if($yetki >=$this->yetkiler["yonetici"]){ 
				$editButton ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="odemeCesidiDuzenle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Çeşidi Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="odemeCesidiSilConfirm('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Çeşidi Sil"><i class="fa-solid fa-trash"></i></button>';
			}
		
			$sendIslem = $editButton;
            
            $result["islem"]=$sendIslem;
            $return["data"]=$result;
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu <br>( ".$payload["odemeCesidiDuzenleCesidi"]." )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"odemeCesidiDuzenleKaydet","(odemeCesidiID:".$odemeCesidiID.") düzenlenirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;
	}
	public function odemeEkle($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Ödeme ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeEkle","kullanıcı tarafından yetkisiz Ödeme ekleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$odemeEkleYeniODeme=htmlspecialchars(trim($payload["odemeEkleYeniODeme"]), ENT_QUOTES);
		if($odemeEkleYeniODeme=="" || $odemeEkleYeniODeme=="0"){
			$return = array("status"=>0,"message"=>"Ödeme miktarı boş bırakılamaz","header"=>"Veri yok!","data"=>"");
            $this->log->info($sirketID,$userID,"odemeEkle","Ödeme miktarı boş geldi",$this->ipAdress);
            return $return;
		}
        try {
			
			$masrafID=intVal(htmlspecialchars(trim($payload["odemeEkleMasrafID"]), ENT_QUOTES));
			if($masrafID){$masrafID="'$masrafID'";}else{$masrafID="NULL";}
			$kasaID=intVal(htmlspecialchars(trim($payload["odemeEkleKasa"]), ENT_QUOTES));
			if($kasaID){$kasaID="'$kasaID'";}else{$kasaID="NULL";}
			$odemeTarihi ="";
			if(isset($payload["odemeEkleOdemeTarihi"])&& $payload["odemeEkleOdemeTarihi"] != ""){

				$date = new DateTime($payload["odemeEkleOdemeTarihi"]);
				$odemeTarihi =  $date->format('Y-m-d');
			}
			else{
				$odemeTarihi = date('Y-m-d');
			}
			$miktar=floatval(str_replace(",",".",htmlspecialchars(trim($payload["odemeEkleYeniODeme"]), ENT_QUOTES)));
			$paraBirimi=htmlspecialchars(trim($payload["odemeEkleparaBirimi"]), ENT_QUOTES);
			$kur=htmlspecialchars(trim($payload["odemeEkleYeniKur"]), ENT_QUOTES);
			if($kur==""){$kur="1";}
			$odendimi=intVal(htmlspecialchars(trim($payload["odemeEkleOdendi"]), ENT_QUOTES));
			$Not=htmlspecialchars(trim($payload["odemeEkleNot"]), ENT_QUOTES);
            $sql = "INSERT INTO `odeme`(
				`ID`,
				`sirketID`,
				`userID`,
				`masrafID`,
				`kasaID`,
				`odemeTarihi`,
				`miktar`,
				`paraBirimi`,
				`kur`,
				`odendimi`,
				`notlar`
			)
			VALUES(
				NULL,
				'$sirketID',
				'$userID',
				$masrafID,
				$kasaID,
				'$odemeTarihi',
				'$miktar',
				'$paraBirimi',
				'$kur',
				'$odendimi',
				'$Not'
			);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>"Ödeme için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"odemeEkle","(Ödemeid:$returnID) için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>"Ödeme Kayıdı eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"odemeEkle","(Ödemeid:$returnID) değerleri ile yeni ödeme eklendi. ",$this->ipAdress);
			$sql = "SELECT
				`odeme`.`ID`,
				`kasa`.`kasaAdi`,
				`odeme`.`odemeTarihi`,
				`odeme`.`miktar`,
				`odeme`.`paraBirimi`,
				`odeme`.`kur`,
				`odeme`.`odendimi`,
				`odeme`.`notlar`,
				`odeme`.`masrafID`,
				CONCAT('odl', `odeme`.`ID`) AS `DT_RowId`
			FROM
				`odeme`
				LEFT JOIN `kasa` ON `kasa`.`ID` = `odeme`.`kasaID`
			WHERE
				`odeme`.`sirketID` = $sirketID AND `odeme`.`ID` = $returnID;";
			$veri =  $this->getSqlResult($sql);
			$editButton ="";
			$sendIslem="";
			if($yetki >=$this->yetkiler["yonetici"]){ 
				$editButton .='<button type="button" class="btn btn-outline-danger btn-sm"  onClick="odemeSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Sil"><i class="fa-solid fa-trash"></i></button>';
			}
			$sendIslem = $editButton;
			$odendiButton = '<button type="button" class="btn btn-outline-danger btn-sm" aria-name="odemeOdendi" aria-ID = "'.$veri["ID"].'" aria-value="1"  data-toggle="tooltip" data-placement="top" title="Ödendi Olarak İşaretle"><i class="fa-solid fa-circle-xmark"></i> Ödenmedi</button>';
			$odemeKur =1;
			$odemeTutar = $veri["miktar"];
			$TLOdenen =$odemeTutar;
			$odemeTutarYazdir =$TLOdenen." ".$this->paraSembol($veri["paraBirimi"]);
			if($veri["paraBirimi"]!="try"){
				$odemeKur = $veri["kur"];
				$TLOdenen = $odemeTutar*$odemeKur;
				$odemeTutarYazdir = $odemeTutar." ".$this->paraSembol($veri["paraBirimi"])." (".$TLOdenen." ₺)";
			}
			$veri["Tutar"] =$odemeTutarYazdir;

			if($veri["odendimi"]==1){
				$odendiButton = '<button type="button" class="btn btn-outline-success btn-sm"  onClick="odemeodendi('.$veri["ID"].',0)" data-toggle="tooltip" data-placement="top" title="Ödenmedi Olarak İşaretle"><i class="fa-solid fa-circle-check"></i> Ödendi</button>';
			}
			$date = new DateTime($veri["odemeTarihi"]);
			$odemeTarihi =  $date->format('d.m.Y');
			$veri["odendimi"]=$odendiButton;
			$veri["odemeTarihi"]=$odemeTarihi;
			$veri["islem"]=$sendIslem;
			$return["odeme"]= $this->masrafTekrarHesapla($sirketID,$userID,$yetki,$veri["masrafID"]);
			$return["masraf"]= $this->getUpdatedMasrafData($sirketID,$userID,$yetki,$veri["masrafID"]);
            $return["data"]=$veri;
            $return["status"]=1;
            return $return;

		
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>" veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("odemeEkle-> Ödeme kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
	}
	public function odemeGuncelle($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>array(),"odeme"=>array());
		$odemeID = $payload["odemeGuncelle"];
		$odemeStatus = $payload["odemeStatus"];
		if(!$odemeID){
			 $return = array("status"=>0,"message"=>"Ödeme belirteci gelmedi","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeGuncelle","kullanıcı tarafından ID'siz ödeme güncelleme isteği geldi",$this->ipAdress);
            return $return;
		}
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Ödeme Güncelleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeGuncelle","kullanıcı tarafından yetkisiz Ödeme Güncelleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$search = " `ID` = $odemeID AND `sirketID` = $sirketID";
		$this->changeLog($sirketID,$userID,"odeme",$odemeID);
		$sql ="UPDATE
					`odeme`
				SET
					`odendimi` = '$odemeStatus'
				WHERE
				$search";
					
			
        $updatedID = $this->updateReturnID($sql,$odemeID);
        if($updatedID !=0){
			$sql = "SELECT
				`odeme`.`ID`,
				`kasa`.`kasaAdi`,
				`odeme`.`odemeTarihi`,
				`odeme`.`miktar`,
				`odeme`.`paraBirimi`,
				`odeme`.`kur`,
				`odeme`.`odendimi`,
				`odeme`.`notlar`,
				`odeme`.`masrafID`,
				CONCAT('odl', `odeme`.`ID`) AS `DT_RowId`
			FROM
				`odeme`
				LEFT JOIN `kasa` ON `kasa`.`ID` = `odeme`.`kasaID`
			WHERE
				`odeme`.`sirketID` = $sirketID AND `odeme`.`ID` = $odemeID;";
			$veri =  $this->getSqlResult($sql);
			$editButton ="";
			$sendIslem="";
			if($yetki >=$this->yetkiler["yonetici"]){ 
				$editButton .='<button type="button" class="btn btn-outline-danger btn-sm"  onClick="odemeSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Sil"><i class="fa-solid fa-trash"></i></button>';
			}
			$sendIslem = $editButton;
			$odendiButton = '<button type="button" class="btn btn-outline-danger btn-sm" aria-name="odemeOdendi" aria-ID = "'.$veri["ID"].'" aria-value="1"  data-toggle="tooltip" data-placement="top" title="Ödendi Olarak İşaretle"><i class="fa-solid fa-circle-xmark"></i> Ödenmedi</button>';
			$odemeKur =1;
			$odemeTutar = $veri["miktar"];
			$TLOdenen =$odemeTutar;
			$odemeTutarYazdir =$TLOdenen." ".$this->paraSembol($veri["paraBirimi"]);
			if($veri["paraBirimi"]!="try"){
				$odemeKur = $veri["kur"];
				$TLOdenen = $odemeTutar*$odemeKur;
				$odemeTutarYazdir = $odemeTutar." ".$this->paraSembol($veri["paraBirimi"])." (".$TLOdenen." ₺)";
			}
			$veri["Tutar"] =$odemeTutarYazdir;

			if($veri["odendimi"]==1){
				$odendiButton = '<button type="button" class="btn btn-outline-success btn-sm"  onClick="odemeodendi('.$veri["ID"].',0)" data-toggle="tooltip" data-placement="top" title="Ödenmedi Olarak İşaretle"><i class="fa-solid fa-circle-check"></i> Ödendi</button>';
			}
			$date = new DateTime($veri["odemeTarihi"]);
			$odemeTarihi =  $date->format('d.m.Y');
			$veri["odendimi"]=$odendiButton;
			$veri["odemeTarihi"]=$odemeTarihi;
			$veri["islem"]=$sendIslem;
			$return["odeme"]= $this->masrafTekrarHesapla($sirketID,$userID,$yetki,$veri["masrafID"]);
            $return["data"]=$veri;
            $return["masraf"]=$this->getUpdatedMasrafData($sirketID,$userID,$yetki,$veri["masrafID"]);
            $return["status"]=1;
            return $return;

		}
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"odemeGuncelle","(ödemeID:".$odemeID.") düzenlenirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;

		//UPDATE `odeme` SET `odendimi` = '0' WHERE
	}
	public function odemeSil($sirketID,$userID,$yetki,$odemeID){
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		if(!$odemeID){
			 $return = array("status"=>0,"message"=>"Ödeme belirteci boş olamaz","header"=>"İşlem Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeSil","Ödeme ID boş geldi",$this->ipAdress);
            return $return;
		}
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Ödeme silme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeSil","kullanıcı tarafından yetkisiz kasa silme isteği geldi",$this->ipAdress);
            return $return;
        }
		$search = "`odeme`.`ID` = $odemeID;";

		$this->deleteLog($sirketID,$userID,"odeme",$search);
		$sql ="UPDATE `odeme` SET `sirketID` = '999' WHERE $search";
		$updatedID = $this->updateReturnID($sql,$odemeID);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Ödeme Silindi";
			$this->log->info($sirketID,$userID,"odemeSil","(ID:$odemeID) silindi",$this->ipAdress);
			$return["data"]="odl$updatedID";
			$sql="SELECT `masrafID` FROM `odeme` WHERE `ID` =$odemeID";
			$result =  $this->getSqlResult($sql);
			$masrafID = $result["masrafID"];
			$return["odeme"]= $this->masrafTekrarHesapla($sirketID,$userID,$yetki,$masrafID);
            $return["masraf"]=$this->getUpdatedMasrafData($sirketID,$userID,$yetki,$masrafID);
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Silinirken bir hata oluştu <br>( $odemeID )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"odemeSil","(kasaID:".$odemeID.") silinirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;

	}
	#endregion

	#region Masraf KARTI
	private function getUpdatedMasrafData($sirketID,$userID,$yetki,$masrafID){
		$fmt = new NumberFormatter( 'de_DE', NumberFormatter::DECIMAL );
		$sql="SELECT
				`masrafKarti`.`ID`,
				`masrafKarti`.`kartAdi`,
				`masrafKarti`.`faturaTarihi`,
				`masrafKarti`.`faturaNo`,
				`masrafKarti`.`faturaTutari`,
				`masrafKarti`.`faturaTuru`,
				`masrafKarti`.`isRefensVarmi`,
				`masrafKarti`.`teklifID`,
				`masrafKarti`.`aciklama`,
				`masrafKarti`.`faturaUrl`,
				`masrafKarti`.`dosyaTipi`,
				`odemeTuru`.`odemeTuru`,
				`masrafKarti`.`paraBirimi`,
				`masrafKarti`.`kur`,
				`masrafKarti`.`acikmi`,
				`odemeCesidi`.`odemeCesidi`,
				CONCAT('msf', `masrafKarti`.`ID`) AS `DT_RowId`
			FROM
				`masrafKarti`
				LEFT JOIN `odemeTuru` ON `masrafKarti`.`odemeGrubu` = `odemeTuru`.`ID`
				LEFT JOIN `odemeCesidi` ON `masrafKarti`.`odemeCesidi`=`odemeCesidi`.`ID`
			WHERE `masrafKarti`.`ID` = $masrafID";
		$result =  $this->getSqlResult($sql);
		//$result["DT_RowId"]="msf".$masrafDuzenleID;

		$editButton ="";
		$digerIslemler="";
		$sendIslem="";
		if($yetki >=$this->yetkiler["yonetici"]){ 
			$editButton ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="masrafDuzenle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Masraf Kartı Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
			$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="masrafSilConfirm('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Masraf Kart Sil"><i class="fa-solid fa-trash"></i></button>';	
			$editButton .='<button type="button" class="btn btn-outline-warning btn-sm ml-2"  onClick="masrafOdemeEkle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Ekle"><i class="fa-solid fa-file-invoice"></i></button>';
		}
		if($result["isRefensVarmi"]=="1"){
			$digerIslemler .='
							<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifGoruntule" aria-teklifuuid="'.$result["teklifID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Detayları">
							<i class="fa-solid fa-circle-info"></i>
							</button>';
		}
		if($result["faturaUrl"]){
			$digerIslemler .='
							<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="masrafFaturaGoster" aria-url="'.$result["faturaUrl"].'" aria-type="'.$result["dosyaTipi"].'" data-toggle="tooltip" data-placement="top" title="Masraf Faturası">
							<i class="fa-solid fa-file-invoice-dollar"></i>
							</button>';
			//
			
		}
		$result["faturaTutari"] =$fmt->format(floatval($result["faturaTutari"]))." ".$this->paraSembol($result["paraBirimi"]);
		$sendIslem = $editButton;
		
		$result["islem"]=$sendIslem;
		$result["diger"]=$digerIslemler;
		
		$result["islem"]=$sendIslem;
		return $result;

	}
	public function masrafTekrarHesapla($sirketID,$userID,$yetki,$masrafID){
		$return = array("kalan"=>"0","odenen"=>"0","tutar"=>"0","acikmi"=>"0");
		try {
			$fmt = new NumberFormatter( 'de_DE', NumberFormatter::DECIMAL );
			$sql="SELECT `ID`,`faturaTutari`,`paraBirimi`,`kur`,`acikmi` FROM `masrafKarti` WHERE `sirketID`=$sirketID AND `ID`=$masrafID;";
			$veri =  $this->getSqlResult($sql);
			
			$odemeKur =1;
			$odemeTutar = floatval($veri["faturaTutari"]);
			$TLOdenen =$odemeTutar;
			$odemeTutarYazdir =$fmt->format($TLOdenen)." ".$this->paraSembol($veri["paraBirimi"]);
			
			if($veri["paraBirimi"]!="try"){
				
				$odemeKur = floatval($veri["kur"]);
				
				$TLOdenen = $odemeTutar*$odemeKur;
				
				$odemeTutarYazdir = $fmt->format($odemeTutar)." ".$this->paraSembol($veri["paraBirimi"])." (".$fmt->format($TLOdenen)." ₺)";
				
			}
			$veri["faturaTutari"] =$odemeTutarYazdir;
			
			$odenen=0;
			$sql = "SELECT
				`odeme`.`miktar`,
				`odeme`.`paraBirimi`,
				`odeme`.`kur`,
				`odeme`.`odendimi`
			FROM
				`odeme`
			WHERE
				`odeme`.`sirketID` = $sirketID AND `odeme`.`masrafID` = $masrafID;";
			$odeme =  $this->getAllSqlResults($sql);
			if(is_array($odeme)&&count($odeme)>0){
				
				foreach($odeme as $odemeVeri){
					$odemeKurX =1;
					$odemeTutarX = $odemeVeri["miktar"];
					$TLOdenenX =$odemeTutarX;
					
					if($odemeVeri["paraBirimi"]!="try"){
						$odemeKurX = $odemeVeri["kur"];
						$TLOdenenX = $odemeTutarX*$odemeKurX;
						
					}
					if($odemeVeri["odendimi"]==1){$odenen+=$TLOdenenX;}
				}
			}
			else{
			
			}
			$kalan = $TLOdenen-$odenen;
			if($kalan <1){
				$kalan=0;
				$return["acikmi"]=1;//kapandı olarak işaret gönder
				$this->masrafAcikDuzenle($sirketID,$userID,$yetki,$masrafID,1);
			}
			else{
				$return["acikmi"]=0;//kapandı olarak işaret gönder
				$this->masrafAcikDuzenle($sirketID,$userID,$yetki,$masrafID,0);
			}
			$return["kalan"]=$fmt->format($kalan)." ₺";
			$return["odenen"]=$fmt->format($odenen)." ₺";
			$return["tutar"]=$odemeTutarYazdir;


		}
        catch(PDOException $e ) { 
			
            $return = array();
            $this->log->writeUserError("masrafTekrarHesapla-> ".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
		return $return; 

	}
	public function masrafEkleIsListe($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		
		//durum 1:taslak  2:bekleyen  3:onaylanan  4:iptal işler  5:biten işer
		$sql="SELECT
			`uuid` AS 'id',
			`teklifAdi` AS 'text'
		FROM
			`teklifler`
		WHERE
			`sirketID` = $sirketID AND (`durum` = 5 OR `durum` = 3);";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Ödeme Çeşidi bulunamadı...";
		}
		return $return;
	}
	public function masrafKartiEkleKaydet($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","header"=>"Veri yok!","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Masraf Kartı ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafKartiEkleKaydet","kullanıcı tarafından yetkisiz Masraf Kartı ekleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$masrafKariAdi =  htmlspecialchars(trim($payload["masrafEkleAdi"]), ENT_QUOTES);
		if($masrafKariAdi==""){
			$return = array("status"=>0,"message"=>"Masraf Kartı Adı boş bırakılamaz","header"=>"Veri yok!","data"=>"");
            $this->log->info($sirketID,$userID,"masrafKartiEkleKaydet","Masraf Kartı Adı boş geldi",$this->ipAdress);
            return $return;
		}
		$masrafEkleDosyaTuru = htmlspecialchars(trim($payload["masrafEkleDosyaTuru"]), ENT_QUOTES)  ?? NULL;
		$masrafEkleDosyaYolu = htmlspecialchars(trim($payload["masrafEkleDosyaYolu"]), ENT_QUOTES)  ?? NULL;
		$masrafEkleEkleFaturaTarihi ="";
		if(isset($payload["masrafEkleEkleFaturaTarihi"])&& $payload["masrafEkleEkleFaturaTarihi"] != ""){

			$date = new DateTime($payload["masrafEkleEkleFaturaTarihi"]);
			$masrafEkleEkleFaturaTarihi =  $date->format('Y-m-d');
		}
		else{
			$masrafEkleEkleFaturaTarihi = date('Y-m-d');
		}
		$masrafEkleFaturaNo = htmlspecialchars(trim($payload["masrafEkleFaturaNo"]), ENT_QUOTES);
		//$masrafEkleFaturaTutari = htmlspecialchars(trim($payload["masrafEkleFaturaTutari"]), ENT_QUOTES);
		$masrafEkleIs = "NULL";
		if(isset($payload["masrafEkleIs"]) && $payload["masrafEkleIs"]!="" ){
			$masrafEkleIs="'".$payload["masrafEkleIs"]."'";
		}
		$masrafEkleIsSecim = htmlspecialchars(trim($payload["masrafEkleIsSecim"]), ENT_QUOTES) ?? 0;
		$masrafEkleFaturaTutari = intval(htmlspecialchars(trim($payload["masrafEkleFaturaTutari"]), ENT_QUOTES)) ?? 0;
		$masrafEkleOdemeGrubu="NULL";
		if($payload["masrafEkleOdemeGrubu"]!="" && isset($payload["masrafEkleOdemeGrubu"])){
			$masrafEkleOdemeGrubu = "'".htmlspecialchars(trim($payload["masrafEkleOdemeGrubu"]), ENT_QUOTES)."'";
		}
		$masrafEkleNot = htmlspecialchars(trim($payload["masrafEkleNot"]), ENT_QUOTES);
		$masrafEkleOdemeTuru = "NULL";
		if($payload["masrafEkleOdemeTuru"]!="" && isset($payload["masrafEkleOdemeTuru"])){
			$masrafEkleOdemeTuru="'".$payload["masrafEkleOdemeTuru"]."'";
		}
		$masrafEkleTipi="";
		if(isset($payload["masrafEkleTipi"]) && $payload["masrafEkleTipi"]!=""){
			$masrafEkleTipi= htmlspecialchars(trim($payload["masrafEkleTipi"]), ENT_QUOTES);
		}
		$paraBirimi = htmlspecialchars(trim($payload["masrafEkleparaBirimi"]), ENT_QUOTES);
		$Kur = htmlspecialchars(trim($payload["masrafEkleKur"]), ENT_QUOTES);
		
        try {

            $sql = "INSERT INTO `masrafKarti`(
				`ID`,
				`sirketID`,
				`userID`,
				`kartAdi`,
				`faturaTarihi`,
				`faturaNo`,
				`faturaTutari`,
				`faturaTuru`,
				`isRefensVarmi`,
				`teklifID`,
				`odemeGrubu`,
				`odemeCesidi`,
				`aciklama`,
				`faturaUrl`,
				`dosyaTipi`,
				`paraBirimi`,
				`kur`
			)
			VALUES(
				NULL,
				'$sirketID',
				'$userID',
				'$masrafKariAdi',
				'$masrafEkleEkleFaturaTarihi',
				'$masrafEkleFaturaNo',
				'$masrafEkleFaturaTutari',
				'$masrafEkleTipi',
				'$masrafEkleIsSecim',
				$masrafEkleIs,
				$masrafEkleOdemeGrubu,
				$masrafEkleOdemeTuru,
				'$masrafEkleNot',
				'$masrafEkleDosyaYolu',
				'$masrafEkleDosyaTuru',
				'$paraBirimi',
				'$Kur'
			);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>$masrafKariAdi." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"masrafKartiEkleKaydet","(id:$returnID) $masrafKariAdi  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
			$result = $this->getUpdatedMasrafData($sirketID,$userID,$yetki,$returnID);
			$return["result"]=$result;
			
			$return["status"]=1;
			$return["message"]=$masrafKariAdi." için Kayıt eklendi";
			$return["header"]="Kayıt Başarılı";
			$return["data"]=$returnID;
            //$return = array("status"=>1,"message"=>$masrafKariAdi." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"masrafKartiEkleKaydet","(id:$returnID) $masrafKariAdi değerleri ile yeni Masraf Kartı eklendi. ",$this->ipAdress);
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$masrafKariAdi." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("masrafKartiEkleKaydet->  ".$masrafKariAdi." değerleri ile yeni Ödeme Çeşidi kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
		
	}
	public function masrafListele($sirketID,$userID,$yetki,$limit=""){
 		$return = array("status"=>0,"message"=>"","draw"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"data"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Masraf Listesi görüntüleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafListele","kullanıcı tarafından yetkisiz Masraf listesi görüntüleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$ekleLimit="";
		if($limit){ $ekleLimit="LIMIT 10"; }

		
		$sql="SELECT
			`masrafKarti`.`ID`,
			`masrafKarti`.`kartAdi`,
			`masrafKarti`.`faturaTarihi`,
			`masrafKarti`.`faturaNo`,
			`masrafKarti`.`faturaTutari`,
			`masrafKarti`.`faturaTuru`,
			`masrafKarti`.`isRefensVarmi`,
			`masrafKarti`.`teklifID`,
			`masrafKarti`.`aciklama`,
			`masrafKarti`.`faturaUrl`,
			`masrafKarti`.`dosyaTipi`,
			`odemeTuru`.`odemeTuru`,
			`masrafKarti`.`paraBirimi`,
			`masrafKarti`.`kur`,
			`masrafKarti`.`acikmi`,
			`odemeCesidi`.`odemeCesidi`,
			CONCAT('msf', `masrafKarti`.`ID`) AS `DT_RowId`
		FROM
			`masrafKarti`
			LEFT JOIN `odemeTuru` ON `masrafKarti`.`odemeGrubu` = `odemeTuru`.`ID`
			LEFT JOIN `odemeCesidi` ON `masrafKarti`.`odemeCesidi`=`odemeCesidi`.`ID`
		WHERE
			`masrafKarti`.`sirketID` = $sirketID  $ekleLimit";
		$result =  $this->getAllSqlResults($sql);
		$fmt = new NumberFormatter( 'de_DE', NumberFormatter::DECIMAL );
		if(is_array($result)&&count($result)>0){
			foreach($result as $veri){
				$editButton ="";
				$digerIslemler="";
                $sendIslem="";
				if($yetki >=$this->yetkiler["yonetici"]){ 
					$editButton ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="masrafDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Masraf Kartı Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="masrafSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Masraf Kart Sil"><i class="fa-solid fa-trash"></i></button>';	
					$editButton .='<button type="button" class="btn btn-outline-warning btn-sm ml-2"  onClick="masrafOdemeEkle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Ekle"><i class="fa-solid fa-file-invoice"></i></button>';
                }
                if($veri["isRefensVarmi"]=="1"){
					$digerIslemler .='
									<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifGoruntule" aria-teklifuuid="'.$veri["teklifID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Detayları">
									<i class="fa-solid fa-circle-info"></i>
									</button>';
				}
				if($veri["faturaUrl"]){
					$digerIslemler .='
									<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="masrafFaturaGoster" aria-url="'.$veri["faturaUrl"].'" aria-type="'.$veri["dosyaTipi"].'" data-toggle="tooltip" data-placement="top" title="Masraf Faturası">
									<i class="fa-solid fa-file-invoice-dollar"></i>
									</button>';
					//
					
				}
				/*$paraSembol = "₺";
				if($veri["paraBirimi"]=="eur"){$paraSembol="€";}
				if($veri["paraBirimi"]=="usd"){$paraSembol="$";}
				$veri["faturaTutari"] = $veri["faturaTutari"]." ".$paraSembol;*/
				$veri["faturaTutari"] =$fmt->format($veri["faturaTutari"])." ".$this->paraSembol($veri["paraBirimi"]);
				$sendIslem = $editButton;
				
				$veri["islem"]=$sendIslem;
				$veri["diger"]=$digerIslemler;
				array_push($return["data"],$veri);
			}
			$return["recordsTotal"]=count($return["data"]);
			$return["recordsFiltered"]=count($return["data"]);
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Masraf Kartı bulunamadı...";
		}
		return $return;
	}

    public function masrafDuzenleVeri($sirketID,$userID,$yetki,$masrafID){
        $return = array("status"=>0,"message"=>"","data"=>array());
		if(!$masrafID){
			 $return = array("status"=>0,"message"=>"Düzenlenecek masraf bulunamadı","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafDuzenleVeri","kullanıcı tarafından ID'siz masraf düzenleme isteği geldi",$this->ipAdress);
            return $return;
		}
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Masraf düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafDuzenleVeri","kullanıcı tarafından yetkisiz masraf düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM  `masrafKarti` WHERE `ID` = $masrafID AND `sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			//faturaTarihi
			$date = new DateTime($result["faturaTarihi"]);
			$FaturaTarihi =  $date->format('d.m.Y');
			$result["faturaTarihi"]=$FaturaTarihi;
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı masraf bulunamadı...";
		}
		return $return;
        
    }
	public function masrafDuzenleKaydet($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		$masrafDuzenleID = $payload["masrafDuzenleKaydet"];
		if($payload["masrafDuzenleKaydet"]==""){
			 $return = array("status"=>0,"message"=>"Masraf belirteci No boş olamaz","header"=>"İşlem Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafDuzenleKaydet","Masraf Düzenle ID No boş geldi",$this->ipAdress);
            return $return;
		}
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Masraf düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafDuzenleKaydet","kullanıcı tarafından yetkisiz Masraf düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }
		
		$search = "`masrafKarti`.`ID` = $masrafDuzenleID;";
		$masrafKariAdi=htmlspecialchars(trim($payload["masrafDuzenleAdi"]));
		$masrafDuzenleDosyaTuru = htmlspecialchars(trim($payload["masrafDuzenleDosyaTuru"]), ENT_QUOTES)  ?? NULL;
		$masrafDuzenleDosyaYolu = htmlspecialchars(trim($payload["masrafDuzenleDosyaYolu"]), ENT_QUOTES)  ?? NULL;
		$masrafDuzenleFaturaTarihi ="";
		$masrafDuzenleFaturaNo = htmlspecialchars(trim($payload["masrafDuzenleFaturaNo"]), ENT_QUOTES);
		$masrafDuzenleIs = "";
		$masrafDuzenleIsSecim = htmlspecialchars(trim($payload["masrafDuzenleIsSecim"]), ENT_QUOTES) ?? 0;
		$masrafDuzenleFaturaTutari = intval(htmlspecialchars(trim($payload["masrafDuzenleFaturaTutari"]), ENT_QUOTES)) ?? 0;
		$masrafDuzenleOdemeGrubu="NULL";
		$masrafDuzenleNot = htmlspecialchars(trim($payload["masrafDuzenleNot"]), ENT_QUOTES);
		$masrafDuzenleOdemeTuru = "NULL";
		$masrafDuzenleTipi="";
		if($masrafKariAdi==""){
			$return = array("status"=>0,"message"=>"Masraf Kartı Adı boş bırakılamaz","header"=>"Veri yok!","data"=>"");
            $this->log->info($sirketID,$userID,"masrafDuzenleKaydet","Masraf Kartı Adı boş geldi",$this->ipAdress);
            return $return;
		}
		if(isset($payload["masrafDuzenleFaturaTarihi"])&& $payload["masrafDuzenleFaturaTarihi"] != ""){

			$date = new DateTime($payload["masrafDuzenleFaturaTarihi"]);
			$masrafDuzenleFaturaTarihi =  $date->format('Y-m-d');
		}
		else{
			$masrafDuzenleFaturaTarihi = date('Y-m-d');
		}
		if($payload["masrafDuzenleIs"]!="" && isset($payload["masrafDuzenleIs"])){
			$masrafDuzenleIs=$payload["masrafDuzenleIs"];
		}
		if($payload["masrafDuzenleOdemeGrubu"]!="" && isset($payload["masrafDuzenleOdemeGrubu"])){
			$masrafDuzenleOdemeGrubu = "'".htmlspecialchars(trim($payload["masrafDuzenleOdemeGrubu"]), ENT_QUOTES)."'";
		}
		if($payload["masrafDuzenleOdemeTuru"]!="" && isset($payload["masrafDuzenleOdemeTuru"])){
			$masrafDuzenleOdemeTuru="'".$payload["masrafDuzenleOdemeTuru"]."'";
		}
		if(isset($payload["masrafDuzenleTipi"]) && $payload["masrafDuzenleTipi"]!=""){
			$masrafDuzenleTipi= htmlspecialchars(trim($payload["masrafDuzenleTipi"]), ENT_QUOTES);
		}
		$masrafDuzenleparaBirimi="try";
		if(isset($payload["masrafDuzenleparaBirimi"])){
			$masrafDuzenleparaBirimi= htmlspecialchars(trim($payload["masrafDuzenleparaBirimi"]), ENT_QUOTES);
		}
		$masrafDuzenleKur= htmlspecialchars(trim($payload["masrafDuzenleKur"]), ENT_QUOTES);
		//masrafDuzenleKur
		$this->changeLog($sirketID,$userID,"masrafKarti",$masrafDuzenleID);
		$sql ="UPDATE
				`masrafKarti`
			SET
				`sirketID` = '$sirketID',
				`userID` = '$userID',
				`kartAdi` = '$masrafKariAdi',
				`faturaTarihi` = '$masrafDuzenleFaturaTarihi',
				`faturaNo` = '$masrafDuzenleFaturaNo',
				`faturaTutari` = '$masrafDuzenleFaturaTutari',
				`faturaTuru` = '$masrafDuzenleTipi',
				`isRefensVarmi` = $masrafDuzenleIsSecim,
				`teklifID` = '$masrafDuzenleIs',
				`odemeGrubu` = $masrafDuzenleOdemeGrubu,
				`odemeCesidi` = $masrafDuzenleOdemeTuru,
				`aciklama` = '$masrafDuzenleNot',
				`faturaUrl` = '$masrafDuzenleDosyaYolu',
				`dosyaTipi` = '$masrafDuzenleDosyaTuru',
				`paraBirimi`= '$masrafDuzenleparaBirimi',
				`kur`='$masrafDuzenleKur'

			WHERE
				$search";
					
			
        $updatedID = $this->updateReturnID($sql,$masrafDuzenleID);
        if($updatedID !=0){
			$this->masrafTekrarHesapla($sirketID,$userID,$yetki,$masrafDuzenleID);
            $return["status"]=1;
            $return["message"]="Güncelleme Başarılı";
			$this->log->info($sirketID,$userID,"masrafDuzenleKaydet","(masrafID:$updatedID) düzenlendi",$this->ipAdress);
            $result = $this->getUpdatedMasrafData($sirketID,$userID,$yetki,$updatedID);
            $return["data"]=$result;
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu <br>( ".$masrafKariAdi." )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"masrafDuzenleKaydet","(masrafID:".$masrafDuzenleID.") düzenlenirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;
	}
	public function masrafDetay($sirketID,$userID,$yetki,$masrafID){
		$return = array("status"=>0,"message"=>"","data"=>array(),"odeme"=>array());
		if(!$masrafID){
			 $return = array("status"=>0,"message"=>"Masraf belirteci gelmedi","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafDetay","kullanıcı tarafından ID'siz masraf isteği geldi",$this->ipAdress);
            return $return;
		}
		$search = "";
		if($masrafID =="0"){
			$search = " AND `acikmi` = 0 ";
		}
		else{
			$search = " AND `ID` = $masrafID ";
		}
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Masraf görüntüleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafDetay","kullanıcı tarafından yetkisiz masraf görüntüleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$fmt = new NumberFormatter( 'de_DE', NumberFormatter::DECIMAL );
		$sql="SELECT 
				`masrafKarti`.*,
				`odemeTuru`.`odemeTuru` AS odemeGrubu,
                `odemeCesidi`.`odemeCesidi`
			FROM  `masrafKarti` 
            LEFT JOIN `odemeTuru` ON `odemeTuru`.`ID`=`masrafKarti`.`odemeGrubu`
            LEFT JOIN `odemeCesidi` ON `odemeCesidi`.`ID` = `masrafKarti`.`odemeCesidi`
			WHERE `masrafKarti`.`ID` = $masrafID AND `masrafKarti`.`sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$odenen = 0;
			$kalan = 0;
			$sql = "SELECT
				`odeme`.`ID`,
				`kasa`.`kasaAdi`,
				`odeme`.`odemeTarihi`,
				`odeme`.`miktar`,
				`odeme`.`paraBirimi`,
				`odeme`.`kur`,
				`odeme`.`odendimi`,
				`odeme`.`notlar`,
				CONCAT('odl', `odeme`.`ID`) AS `DT_RowId`
			FROM
				`odeme`
				LEFT JOIN `kasa` ON `kasa`.`ID` = `odeme`.`kasaID`
			WHERE
				`odeme`.`sirketID` = $sirketID AND `odeme`.`masrafID` = $masrafID;";
			$odeme =  $this->getAllSqlResults($sql);
			if(is_array($odeme)&&count($odeme)>0){
				
				foreach($odeme as $veri){
					$editButton ="";
					$sendIslem="";
					if($yetki >=$this->yetkiler["yonetici"]){ 
						$editButton .='<button type="button" class="btn btn-outline-danger btn-sm"  onClick="odemeSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Sil"><i class="fa-solid fa-trash"></i></button>';
					}
					$sendIslem = $editButton;
					$odendiButton = '<button type="button" class="btn btn-outline-danger btn-sm" aria-name="odemeOdendi" aria-ID = "'.$veri["ID"].'" aria-value="1"  data-toggle="tooltip" data-placement="top" title="Ödendi Olarak İşaretle"><i class="fa-solid fa-circle-xmark"></i> Ödenmedi</button>';
					$odemeKur =1;
					$odemeTutar = $veri["miktar"];
					$TLOdenen =$odemeTutar;
					$odemeTutarYazdir =$TLOdenen." ".$this->paraSembol($veri["paraBirimi"]);
					if($veri["paraBirimi"]!="try"){
						$odemeKur = $veri["kur"];
						$TLOdenen = $odemeTutar*$odemeKur;
						$odemeTutarYazdir = $odemeTutar." ".$this->paraSembol($veri["paraBirimi"])." (".$TLOdenen." ₺)";
					}
					$veri["Tutar"] =$odemeTutarYazdir;

					if($veri["odendimi"]==1){
						$odenen+=$TLOdenen;
						$odendiButton = '<button type="button" class="btn btn-outline-success btn-sm"  onClick="odemeodendi('.$veri["ID"].',0)" data-toggle="tooltip" data-placement="top" title="Ödenmedi Olarak İşaretle"><i class="fa-solid fa-circle-check"></i> Ödendi</button>';
					}
					$date = new DateTime($veri["odemeTarihi"]);
					$odemeTarihi =  $date->format('d.m.Y');
					$veri["odendimi"]=$odendiButton;
					$veri["odemeTarihi"]=$odemeTarihi;
					$veri["islem"]=$sendIslem;
					array_push($return["odeme"],$veri);
				}
			}
			else{
				$return["message"]="Kayıtlı Ödeme bulunamadı...";
			}

			$kur=1;
			if($result["kur"]>0){ $kur=$result["kur"]; }
			$tutarYazdir=$result["faturaTutari"]." ".$this->paraSembol($result["paraBirimi"]);
			$ToplamTutar = $result["faturaTutari"];
			$TLfaturaTutari = $ToplamTutar*$kur;
			if($result["paraBirimi"]!="try"){
				$tutarYazdir = $fmt->format($ToplamTutar)." ".$this->paraSembol($result["paraBirimi"])." (".$fmt->format($TLfaturaTutari)." ₺)";
			}
			$return["data"]["faturaTutari"]=$tutarYazdir;
			$kalan = $TLfaturaTutari-$odenen;
			$return["data"]["odenen"]=$fmt->format($odenen)." ₺";
			$return["data"]["kalan"]=$fmt->format($kalan)." ₺";
			$return["status"]=1;
		}
		else{
			$return["message"]="Kayıtlı masraf bulunamadı...";
		}
		return $return;
	}
	public function masrafAcikDuzenle($sirketID,$userID,$yetki,$masrafID,$masrafStatus){
		$search = " `ID` = $masrafID AND `sirketID` = $sirketID";
		$this->changeLog($sirketID,$userID,"masrafKarti",$masrafID);
		$sql ="UPDATE
					`masrafKarti`
				SET
					`acikmi` = '$masrafStatus'
				WHERE
				$search";
					
			
        $updatedID = $this->updateReturnID($sql,$masrafID);
	}
	public function masrafKartiSil($sirketID,$userID,$yetki,$masrafID){

		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		if(!$masrafID){
			 $return = array("status"=>0,"message"=>"Masraf Kartı belirteci boş olamaz","header"=>"İşlem Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafKartiSil","Masraf Kartı ID boş geldi",$this->ipAdress);
            return $return;
		}
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Masraf Kartı silme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"masrafKartiSil","kullanıcı tarafından yetkisiz Masraf kartı silme isteği geldi",$this->ipAdress);
            return $return;
        }
		$search = "`masrafKarti`.`ID` = $masrafID;";

		$this->deleteLog($sirketID,$userID,"masrafKarti",$search);
		$sql ="UPDATE `masrafKarti` SET `sirketID` = '999' WHERE $search";
		$updatedID = $this->updateReturnID($sql,$masrafID);
        if($updatedID !=0){
            $return["status"]=1;
            $return["message"]="Masraf Kartı Silindi";
			$this->log->info($sirketID,$userID,"masrafKartiSil","(ID:$updatedID) silindi",$this->ipAdress);
			//masraf kartına bağlı ödemeleri de sil
			//UPDATE `odeme` SET `sirketID` = '999' WHERE `odeme`.`masrafID` = 2;
			$search = "`odeme`.`masrafID` = $masrafID";
			$sql ="UPDATE `odeme` SET `sirketID` = '999' WHERE $search;";
			$this->deleteLog($sirketID,$userID,"odeme",$search);
			$this->updateReturnID($sql,$masrafID);
			$return["data"]="msf$updatedID";
            return $return;

        }
        else{
            $return["status"]=0;
            $return["header"]="Hata!";
			$return["message"]="Silinirken bir hata oluştu <br>( $masrafID )";
            $return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"masrafKartiSil","(masrafKartiID:".$masrafID.") silinirken bir hata oluştu",$this->ipAdress);
            
		}
        return $return;
	}
	#endregion

	#region Mutabakat
	public function mutabakatOlustur($sirketID,$userID,$yetki,$teklifID){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif son mutabakat oluşturma yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"taslakTeklifDurumGuncelle","kullanıcı tarafından yetkisiz Teklif son mutabakat oluşturma isteği geldi",$this->ipAdress);
            return $return;
        }

		$varmi="SELECT * FROM `sonMutabakat` WHERE `sirketID` = $sirketID AND `teklifID` LIKE '$teklifID';";
		$ekle="INSERT INTO `sonMutabakat`(
				`ID`,
				`sirketID`,
				`kullaniciID`,
				`teklifID`,
				`teklifTutari`,
				`mutabakatTutari`,
				`paraBirimi`,
				`mutabakatDosya`,
				`dosyaTipi`
			)
			VALUES(NULL, '$sirketID', '$userID', '$teklifID', '', '', '', '','');";
		$retID = $this->insertIfNotExistReturnID($varmi,$ekle);
		if($retID>0){
			$return["status"]=1;
			$return["message"]="Mutabakat oluşturuldu";
			$return["data"]=$retID;
			$this->log->info($sirketID,$userID,"mutabakatOlustur","(id:$retID) Mutabakat oluşturuldu. ",$this->ipAdress);
			
		}
		else{
			$return["message"]="Mutabakat oluşturulurken bir hata oluştu... $teklifID";
			$this->log->warning($sirketID,$userID,"mutabakatOlustur","Mutabakat oluşturulurken bir hata oluştu. ",$this->ipAdress);
		}
		return $return;


	}
	public function mutabakatBak($sirketID,$userID,$yetki,$teklifID){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
			$return = array("status"=>0,"message"=>"Teklif son mutabakat görüntüleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($userID,"mutabakatBak","kullanıcı tarafından yetkisiz Teklif son mutabakat görüntüleme isteği geldi",$this->ipAdress);
			return $return;
		}
		$mutabakat=$this->mutabakatOlustur($sirketID,$userID,$yetki,$teklifID);
		if($mutabakat["status"]!=1){
			return $mutabakat;
		}
		$sql="SELECT
			`ID` AS 'id',
			`teklifID`,
			`teklifTutari`,
			`mutabakatTutari`,
			`paraBirimi`,
			`mutabakatDosya`,
			`dosyaTipi`
		FROM
			`sonMutabakat`
		WHERE
			`sirketID` = $sirketID AND `teklifID` LIKE '$teklifID';";
		$result = $this->getSqlResult($sql);
		if($result){

			if($result["teklifTutari"]=="" && $result["mutabakatTutari"]==""){

				$sql = "SELECT `paraBirimi`,`anaToplam` FROM `teklifler` WHERE `uuid` LIKE '$teklifID' AND `sirketID` = $sirketID;";
				$teklif = $this->getSqlResult($sql);
				$result["teklifTutari"]=$teklif["anaToplam"];
				$result["paraBirimi"]=$teklif["paraBirimi"];
				$update = "UPDATE `sonMutabakat` SET `teklifTutari` = '".$teklif["anaToplam"]."', `paraBirimi` = '".$teklif["paraBirimi"]."' WHERE `ID` = ".$result["id"];
				$this->updateReturnID($update,$result["id"]);
			}

			$sembol = $this->paraSembol($result["paraBirimi"]);
			$result["sembol"] = $sembol;
			



			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı mutabakat bulunamadı...";
			$this->log->info($sirketID,$userID,"mutabakatBak","Mutabakat bulunamadı. ",$this->ipAdress);
		}
		return $return;
		
	}
	public function	mutabakatDosyaUpdate($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
			$return = array("status"=>0,"message"=>"Teklif son mutabakat dosya yükleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($userID,"mutabakatDosyaUpdate","kullanıcı tarafından yetkisiz Teklif son mutabakat dosya yükleme isteği geldi",$this->ipAdress);
			return $return;
		}
		$sql="UPDATE
				`sonMutabakat`
			SET
				`mutabakatDosya` = '".$payload["mutabakatDosyaYolu"]."',
				`dosyaTipi` = '".$payload["mutabakatDosyaTipi"]."'
			WHERE
				`sonMutabakat`.`ID` = ".$payload["mutabakatDosyaUpdate"].";";
		$updatedID = $this->updateReturnID($sql,$payload["mutabakatDosyaUpdate"]);
		if($updatedID !=0){
			$return["status"]=1;
			$return["message"]="Mutabakat dosyası yüklendi";
			$this->log->info($sirketID,$userID,"mutabakatDosyaUpdate","(id:$updatedID) Mutabakat dosyası yüklendi. ",$this->ipAdress);
			return $return;

		}
		else{
			$return["message"]="Mutabakat dosyası yüklenirken bir hata oluştu...";
			$this->log->warning($sirketID,$userID,"mutabakatDosyaUpdate","Mutabakat dosyası yüklenirken bir hata oluştu. ",$this->ipAdress);
		}
		return $return;
	}
	public function sonMutabakatEkle($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
			$return = array("status"=>0,"message"=>"Teklif son mutabakat kaydetme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($userID,"sonMutabakatEkle","kullanıcı tarafından yetkisiz Teklif son mutabakat kaydetme isteği geldi",$this->ipAdress);
			return $return;
		}
		$sql="UPDATE
				`sonMutabakat`
			SET
				`mutabakatTutari` = '".$payload["mutabakatFaturaTutari"]."',
				`paraBirimi` = '".$payload["mutabakatFaturaparaBirimi"]."'
			WHERE
				`sonMutabakat`.`teklifID` LIKE '".$payload["mutabakatDuzenle"]."';";
		$updatedID = $this->updateReturnID($sql,$payload["mutabakatDuzenle"]);
		if($updatedID !=0){
			$return["status"]=1;
			$return["message"]="Mutabakat kaydedildi";
			$this->log->info($sirketID,$userID,"sonMutabakatEkle","(id:$updatedID) Mutabakat kaydedildi. ",$this->ipAdress);
			return $return;

		}
		else{
			$return["message"]="Mutabakat kaydedilirken bir hata oluştu...";
			$this->log->warning($sirketID,$userID,"sonMutabakatEkle","Mutabakat kaydedilirken bir hata oluştu. ",$this->ipAdress);
		}
		return $return;
	}	
	#endregion

	#region Tahsilat Kartı
	public function tahsilatKartiEkle($sirketID,$userID,$yetki,$payload=NULL,$teklifID=NULL){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($payload==NULL && $teklifID==NULL){
			$return = array("status"=>0,"message"=>"Eksik veri gönderildi","header"=>"Veri Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatKartiEkle","kullanıcı tarafından eksik tahsilat kartı ekleme isteği geldi",$this->ipAdress);
			return $return;
		}


		if($yetki < $this->yetkiler["yonetici"]){
			$return = array("status"=>0,"message"=>"Tahsilat kartı ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatKartiEkle","kullanıcı tarafından yetkisiz tahsilat kartı ekleme isteği geldi",$this->ipAdress);
			return $return;
		}
		$retID =0;
		if($teklifID != NULL){
			$sql = "SELECT
					`sonMutabakat`.`mutabakatTutari`,
					`sonMutabakat`.`paraBirimi`,
					`sonMutabakat`.`teklifTutari`,
					`sonMutabakat`.`teklifID`,
					`teklifler`.`teklifAdi`
				FROM
					`sonMutabakat`
					LEFT JOIN `teklifler` ON `sonMutabakat`.`teklifID` LIKE `teklifler`.`uuid`
				WHERE
					`sonMutabakat`.`sirketID` = $sirketID AND `sonMutabakat`.`teklifID` LIKE '$teklifID';";
			$teklif = $this->getSqlResult($sql);
			if($teklif){
				$faturaTutari = 0;
				if($teklif["mutabakatTutari"]>0){
					$faturaTutari = $teklif["mutabakatTutari"];
				}
				else{
					$faturaTutari = $teklif["teklifTutari"];
				}
				$odemeKartiBak = "SELECT `ID` FROM `tahsilatKarti` WHERE `teklifID` LIKE '$teklifID';";
				$odemeKartiOlustur = "INSERT INTO `tahsilatKarti`(
						`ID`,
						`sirketID`,
						`userID`,
						`kartAdi`,
						`faturaTarihi`,
						`faturaNo`,
						`faturaTutari`,
						`faturaTuru`,
						`isRefensVarmi`,
						`teklifID`,
						`odemeGrubu`,
						`odemeCesidi`,
						`aciklama`,
						`faturaUrl`,
						`dosyaTipi`,
						`acikmi`,
						`paraBirimi`,
						`kur`,
						`tahsilatVadesi`
					)
					VALUES(
						NULL,
						'$sirketID',
						'$userID',
						'".$teklif["teklifAdi"]."',
						NULL,
						NULL,
						'$faturaTutari',
						'',
						'1',
						'".$teklif["teklifID"]."',
						NULL,
						NULL,
						'Sistem tarafından otomatik oluşturuldu',
						'',
						'',
						'0',
						'".$teklif["paraBirimi"]."',
						'1',
						NULL
					);";
				$retID = $this->insertIfNotExistReturnID($odemeKartiBak,$odemeKartiOlustur);
				if($retID>0){
					$return["status"]=1;
					$return["message"]="Tahsilat Kartı oluşturuldu";
					$return["data"]=$retID;
					$this->log->info($sirketID,$userID,"tahsilatKartiEkle","(id:$retID) Tahsilat kartı otomatik oluşturuldu. ",$this->ipAdress);
					
				}
				else{
					$return["message"]="Tahsilat Kartı oluşturulurken bir hata oluştu... $teklifID";
					$this->log->warning($sirketID,$userID,"tahsilatKartiEkle","Tahsilat Kartı oluşturulurken bir hata oluştu. ",$this->ipAdress);
				}
				return $return;
			}
			else{
				$return["message"]="Tahsilat Kartı oluşturulurken bir hata oluştu... $teklifID";
				$this->log->warning($sirketID,$userID,"tahsilatKartiEkle","Tahsilat Kartı oluşturmak için teklif bulunamadığı için bir hata oluştu. ",$this->ipAdress);
				return $return;
			}
		}


		$tahsilatKartiAdi=htmlspecialchars(trim($payload["tahsilatKartiAdi"]), ENT_QUOTES);
		$return["message"]="Tahsilat Kartı oluşturulurken bir hata oluştu...";
		return $return;
	}

	public function tahsilatListesiBak($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>array(),"result"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
			$return = array("status"=>0,"message"=>"Tahsilat kartı listeleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatListesiBak","kullanıcı tarafından yetkisiz tahsilat kartı listeleme isteği geldi",$this->ipAdress);
			return $return;
		}
		$sqlEkle="";
		if(isset($payload["tahsilatKartiAra"]) &&  $payload["tahsilatKartiAra"]!=""){
			$search = htmlspecialchars(trim($payload["tahsilatKartiAra"]), ENT_QUOTES);
			$sqlEkle=" AND (`kartAdi` LIKE '%$search%' OR `faturaNo` LIKE '%$search%' OR `faturaTutari` LIKE '%$search%')";
		}
		if(isset($payload["tahsilatKartiDurum"]) && $payload["tahsilatKartiDurum"]!="" ){
			$durum = intVal($payload["tahsilatKartiDurum"]);
			if($durum==1){
				$sqlEkle .=" AND `acikmi` = 1 ";
			}
			else if($durum==2){
				$sqlEkle .=" AND `acikmi` = 0 ";
			}
		}
		
		$sql="SELECT
			`tahsilatKarti`.`kartAdi`,
			`tahsilatKarti`.`faturaTarihi`,
			`tahsilatKarti`.`faturaNo`,
			`tahsilatKarti`.`faturaTutari`,
			`tahsilatKarti`.`kur`,
			`tahsilatKarti`.`faturaTuru`,
			`tahsilatKarti`.`odemeGrubu`,
			`tahsilatKarti`.`odemeCesidi`,
			`tahsilatKarti`.`tahsilatVadesi`,
			`tahsilatKarti`.`aciklama`,
			`tahsilatKarti`.`acikmi`,
			`tahsilatKarti`.`paraBirimi`,
			`tahsilatKarti`.`isRefensVarmi`,
			`tahsilatKarti`.`faturaUrl`,
			`tahsilatKarti`.`teklifID`,
			`tahsilatKarti`.`ID`,
			CONCAT('ths', `tahsilatKarti`.`ID`) AS `DT_RowId`
		FROM
			`tahsilatKarti`
		WHERE
			`sirketID` = $sirketID $sqlEkle";

		$result =  $this->getAllSqlResults($sql);
		if(is_array($result)&&count($result)>0){
			foreach($result as $veri){
				$editButton ="";
				$digerIslemler="";
                $sendIslem="";
				if($yetki >=$this->yetkiler["yonetici"]){ 
					$editButton ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="tahsilatDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Kartı Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="tahsilatSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Kart Sil"><i class="fa-solid fa-trash"></i></button>';	
					$editButton .='<button type="button" class="btn btn-outline-warning btn-sm ml-2"  onClick="tahsilatOdemeEkle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Ödeme Ekle"><i class="fa-solid fa-file-invoice"></i></button>';
                }
                if($veri["isRefensVarmi"]=="1"){
					$digerIslemler .='
									<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifGoruntule" aria-teklifuuid="'.$veri["teklifID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Detayları">
									<i class="fa-solid fa-circle-info"></i>
									</button>';
				}
				if($veri["faturaUrl"]){
					$digerIslemler .='
									<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="tahsilatFaturaGoster" aria-url="'.$veri["faturaUrl"].'" aria-type="'.$veri["dosyaTipi"].'" data-toggle="tooltip" data-placement="top" title="Tahsilat Faturası">
									<i class="fa-solid fa-file-invoice-dollar"></i>
									</button>';
					//
					
				}
				if($veri["faturaNo"]==""){
					$veri["faturaNo"]="Fatura No Yok";
					$veri["kartAdi"].=" <span class='badge badge-danger'>Faturalandırılmadı</span>";
				}
				if($veri["tahsilatVadesi"]=="0000-00-00" || $veri["tahsilatVadesi"]==NULL){
					$veri["tahsilatVadesi"]="Belirtilmemiş";
					$veri["kartAdi"].=" <span class='badge badge-warning'>Vade Giriniz!</span>";
				}
				else{
					$date = new DateTime($veri["tahsilatVadesi"]);
					$veri["tahsilatVadesi"] =  $date->format('d.m.Y');
				}
				$fmt = new NumberFormatter( 'de_DE', NumberFormatter::DECIMAL );
				$veri["faturaTutari"] =$fmt->format($veri["faturaTutari"])." ".$this->paraSembol($veri["paraBirimi"]);
				$sendIslem = $editButton;
				
				$veri["islem"]=$sendIslem;
				$veri["diger"]=$digerIslemler;
				array_push($return["data"],$veri);
			}
			$return["recordsTotal"]=count($return["data"]);
			$return["recordsFiltered"]=count($return["data"]);
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Tahsilat Kartı bulunamadı...";
		}
		return $return;
	}

	public function tahsilatCesidiBak($sirketID,$userID,$yetki){
		$return = array("status"=>0,"message"=>"","data"=>array());
		$sql="SELECT
			`tahsilatTuru`.`ID`,
			`tahsilatTuru`.`tahsilatTuru`,
			CONCAT('thc', `tahsilatTuru`.`ID`) AS `DT_RowId`
		FROM
			`tahsilatTuru`
		WHERE
			`sirketID` = $sirketID;";

		$result = $this->getAllSqlResults($sql);
		if(is_array($result)&&count($result)>0){
			foreach($result as $veri){
				$sendIslem="";
				if($yetki >=$this->yetkiler["yonetici"]){ 
					$sendIslem ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="tahsilatCesidiDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Çeşidi Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
					$sendIslem .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="tahsilatCesidiSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Çeşidi Sil"><i class="fa-solid fa-trash"></i></button>';	
					
                }

				$veri["islem"]=$sendIslem;
				array_push($return["data"],$veri);
			}
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Tahsilat çeşidi bulunamadı...";
		}
		return $return;
	}
	public function tahsilatTuruKaydet($sirketID,$userID,$yetki,$tahsilatTuru){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
			$return = array("status"=>0,"message"=>"Tahsilat türü ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatTuruKaydet","kullanıcı tarafından yetkisiz tahsilat türü ekleme isteği geldi",$this->ipAdress);
			return $return;
		}
		$tahsilatTuru=htmlspecialchars(trim($tahsilatTuru), ENT_QUOTES);
		$sql = "SELECT * FROM `tahsilatTuru` WHERE `sirketID` = $sirketID AND `tahsilatTuru` LIKE '$tahsilatTuru'";
		$isExist = $this-> countReturnInt($sql);
		if($isExist > 0){
			$return = array("status"=>0,"message"=>"Bu tahsilat türü (".$tahsilatTuru.") zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut tahsilat türü","data"=>"");
			$this->log->info($sirketID,$userID,"tahsilatTuruKaydet","mevcut tahsilat türü için yeni kayıt açılmaya çalışıldı ($tahsilatTuru)",$this->ipAdress);
			return $return;
		}
		try {
			$sql = "INSERT INTO `tahsilatTuru`(
				`ID`,
				`sirketID`,
				`tahsilatTuru`
			)
			VALUES(
				NULL,
				'$sirketID',
				'$tahsilatTuru'
			);";
			$returnID = $this->insertReturnID($sql);
			if($returnID<=0){

				$return = array("status"=>0,"message"=>$tahsilatTuru." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
				$this->log->warning($sirketID,$userID,"tahsilatTuruKaydet","(id:$returnID) $tahsilatTuru  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
				return $return;
			}
			$return = array("status"=>1,"message"=>$tahsilatTuru." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
			$this->log->info($sirketID,$userID,"tahsilatTuruKaydet","(id:$returnID) $tahsilatTuru değerleri ile yeni tahsilat türü eklendi. ",$this->ipAdress);
			return $return;
		}
		catch(PDOException $e ) { 
			$return = array("status"=>0,"message"=>$tahsilatTuru." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
			$this->log->writeUserError("tahsilatTuruKaydet->  ".$tahsilatTuru." değerleri ile yeni tahsilat türü kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
			return $return; 
		}	
	}
	public function tahsilatTuruDuzenleVeri($sirketID,$userID,$yetki,$ID){

		$return = array("status"=>0,"message"=>"","data"=>array());
		if(!$ID){
			 $return = array("status"=>0,"message"=>"Düzenlenecek Tahsilat Türü bulunamadı","header"=>"Eksik Veri Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"tahsilatCesidiDuzenleVeri","kullanıcı tarafından ID'siz Tahsilat Türü düzenleme isteği geldi",$this->ipAdress);
            return $return;
		}
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Tahsilat Türü düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"odemeCesidiDuzenleVeri","kullanıcı tarafından yetkisiz Tahsilat Türü düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM `tahsilatTuru` WHERE `ID` = $ID AND `sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Tahsilat Türü bulunamadı...";
		}
		return $return;
	}

	public function tahsilatTuruDuzenleKaydet($sirketID,$userID,$yetki,$tahsilatTuruDuzenleKaydet){
		$return = array("status"=>0,"message"=>"","data"=>array());
		$ID = $tahsilatTuruDuzenleKaydet["tahsilatTuruDuzenleKaydet"];
		if(!$ID){
			 $return = array("status"=>0,"message"=>"Düzenlenecek Tahsilat Türü bulunamadı","header"=>"Eksik Veri Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatTuruDuzenleKaydet","kullanıcı tarafından ID'siz Tahsilat Türü düzenleme isteği geldi",$this->ipAdress);
			return $return;
		}
		if($yetki < $this->yetkiler["yonetici"]){
			$return = array("status"=>0,"message"=>"Tahsilat Türü düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatTuruDuzenleKaydet","kullanıcı tarafından yetkisiz Tahsilat Türü düzenleme isteği geldi",$this->ipAdress);
			return $return;
		}		
		$tahsilatTuru=htmlspecialchars(trim($tahsilatTuruDuzenleKaydet["tahsilatTuruDuzenleAdi"]), ENT_QUOTES);
		
		$this->changeLog($sirketID,$userID,"tahsilatTuru",$ID);
		try {
			$sql="UPDATE `tahsilatTuru` SET `tahsilatTuru` = '$tahsilatTuru' WHERE `tahsilatTuru`.`ID` = ".$ID." AND `tahsilatTuru`.`sirketID` = $sirketID;";
			$updatedID = $this->updateReturnID($sql,$ID);
			if($updatedID<=0){

				$return = array("status"=>0,"message"=>$tahsilatTuru." için Güncelleme yapılırken bir hata oluştu","header"=>"Hata","data"=>$updatedID);
				$this->log->warning($sirketID,$userID,"tahsilatTuruDuzenleKaydet","(id:$updatedID) $tahsilatTuru  için Güncelleme yapılırken bir hata oluştu. ",$this->ipAdress);
				return $return;
			}
			$return["message"]=$tahsilatTuru." için Güncelleme yapıldı";
			$return["header"]="$tahsilatTuru Güncelleme Başarılı";
			$sql="SELECT
			`tahsilatTuru`.`ID`,
			`tahsilatTuru`.`tahsilatTuru`,
			CONCAT('thc', `tahsilatTuru`.`ID`) AS `DT_RowId`
			FROM
				`tahsilatTuru`
			WHERE
				`sirketID` = $sirketID AND `tahsilatTuru`.`ID` = $updatedID ;";

			$result =  $this->getSqlResult($sql);
			
			
			if($yetki >=$this->yetkiler["yonetici"]){ 
				$sendIslem ='<button type="button" class="btn btn-outline-secondary btn-sm ml-2 "  onClick="tahsilatCesidiDuzenle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Çeşidi Düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
				$sendIslem .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="tahsilatCesidiSilConfirm('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Tahsilat Çeşidi Sil"><i class="fa-solid fa-trash"></i></button>';	
					
			}
		
			//$sendIslem = $editButton;
            
            $result["islem"]=$sendIslem;
            $return["data"]=$result;
			
			$this->log->info($sirketID,$userID,"tahsilatTuruDuzenleKaydet","(id:$updatedID) $tahsilatTuru değerleri ile tahsilat türü güncellendi. ",$this->ipAdress);
			return $return;
		}
		catch(PDOException $e ) { 
			$return = array("status"=>0,"message"=>$tahsilatTuru." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
			$this->log->writeUserError("tahsilatTuruDuzenleKaydet->  ".$tahsilatTuru." değerleri ile tahsilat türü kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
			return $return; 
		}
	}
	public function tahsilatDuzenleVeri($sirketID,$userID,$yetki,$tahsilatID){
		
		$return = array("status"=>0,"message"=>"","data"=>array(),);
		if(!$tahsilatID){
			 $return = array("status"=>0,"message"=>"Düzenlenecek Tahsilat Kartı bulunamadı","header"=>"Eksik Veri Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatDuzenleVeri","kullanıcı tarafından ID'siz Tahsilat Kartı düzenleme isteği geldi",$this->ipAdress);
			return $return;
		}
		if($yetki < $this->yetkiler["satisSorumlusu"]){
			$return = array("status"=>0,"message"=>"Tahsilat Kartı düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
			$this->log->alert($sirketID,$userID,"tahsilatDuzenleVeri","kullanıcı tarafından yetkisiz Tahsilat Kartı düzenleme isteği geldi",$this->ipAdress);
			return $return;
		}		
		$sql="SELECT * FROM `tahsilatKarti` WHERE `ID` = $tahsilatID AND `sirketID` = $sirketID ";
		$result =  $this->getSqlResult($sql);
		
		if($result){
			$result["faturaTarihi"] = ($result["faturaTarihi"] != NULL) ? date("d.m.Y", strtotime($result["faturaTarihi"])) : "";
			$result["tahsilatVadesi"] = ($result["tahsilatVadesi"] != NULL) ? date("d.m.Y", strtotime($result["tahsilatVadesi"])) : "";
			
			$return["data"]=$result;
			$sql="SELECT
				`tahsilatTuru`.`ID` as 'id',
				`tahsilatTuru`.`tahsilatTuru` as 'text'
			FROM
				`tahsilatTuru`
			WHERE
				`sirketID` = $sirketID;";
			$tur = $this->getAllSqlResults($sql);
			$return["data"]["tahsilatTurleri"]=$tur;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Tahsilat Kartı bulunamadı...";
		}
		return $return;
	}
	#endregion


 	#region HİZMET  İŞLEMLERİ
	public function hizmetEkleGrupLoad($sirketID,$userID,$yetki,$query){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		$sqlEkle="";
		if($query != ""){
			$sqlEkle=" WHERE `grupAdi` LIKE '%$query%'";
		}
		$sql="SELECT
			`ID` AS 'id',
			`grupAdi` AS 'text',
			`grupIcon` AS 'icon'
		FROM
			`hizmetGrup` $sqlEkle";

		$result = $this->getAllSqlResults($sql);
		if($result){
			$return["result"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı grup bulunamadı...";
		}
		return $return;
	}
	public function hizmetEkle($sirketID,$userID,$yetki,$payload){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Hizmet ekleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"hizmetEkle","kullanıcı tarafından yetkisiz hizmet ekleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$hizmetAdi=htmlspecialchars(trim($payload["hizmetEkleAdi"]), ENT_QUOTES);
		$sql = "SELECT * FROM `hizmet` WHERE `sirketID` = $sirketID AND `hizmetAdi` LIKE '$hizmetAdi'";
		$isEkipmanExist = $this-> countReturnInt($sql);
        if($isEkipmanExist > 0){
            $return = array("status"=>0,"message"=>"Bu ekipman (".$payload["hizmetEkleAdi"].") zaten kayıtlı, yeni ekleme yapılamaz.","header"=>"Mevcut acenta","data"=>"");
            $this->log->info($sirketID,$userID,"hizmetEkle","mevcut ekipman için yeni kayıt açılmaya çalışıldı ($hizmetAdi)",$this->ipAdress);
            return $return;
        }
        try {
			$ekipmanNot = htmlspecialchars(trim($payload["hizmetEkleNot"]), ENT_QUOTES);
			$ekipmanAdi = htmlspecialchars(trim($payload["hizmetEkleAdi"]), ENT_QUOTES);
			
            $ekipmanFiyat = intVal($payload["hizmetEkleFiyat"]);
            $ekipmanGrup = intVal($payload["hizmetEkleGrupAra"]);
            $sql = "INSERT INTO `hizmet`(
				`ID`,
				`sirketID`,
				`hizmetAdi`,
				`hizmetGrubu`,
				`hizmetFiyati`,
				`hizmetNotlari`
			)
			VALUES(
				NULL,
				'$sirketID',
				'$ekipmanAdi',
				'$ekipmanGrup',
				'$ekipmanFiyat',
				'$ekipmanNot'
			);";
            $returnID = $this->insertReturnID($sql);
            if($returnID<=0){

                $return = array("status"=>0,"message"=>$payload["hizmetEkleAdi"]." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$returnID);
                $this->log->warning($sirketID,$userID,"hizmetEkle","(id:$returnID) $ekipmanAdi  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>$payload["hizmetEkleAdi"]." için Kayıt eklendi","header"=>"Başarılı","data"=>$returnID);
            $this->log->info($sirketID,$userID,"hizmetEkle","(id:$returnID) $ekipmanAdi değerleri ile yeni acenta eklendi. ",$this->ipAdress);
            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$payload["hizmetEkleAdi"]." veritabanına eklenirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("hizmetEkle->  ".$payload["hizmetEkleAdi"]." değerleri ile yeni acenta kayıdı yapılırken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
	}
	public function hizmetSil($sirketID,$userID,$yetki,$hizmet){
        $return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
        if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Hizmet Silme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"hizmetSil","kullanıcı tarafından yetkisiz Hizmet silme isteği geldi ($hizmet)",$this->ipAdress);
            return $return;
        }
        try {
            
            $sql = "DELETE FROM `hizmet` WHERE `hizmet`.`ID` = $hizmet;";
            $returnID = $this->deleteRecord($sql);
			if($returnID == 1){
				$return = array("status"=>1,"message"=>"Hizmet Silindi","header"=>"İşlem Başarılı","data"=>"");
				$this->log->info($sirketID,$userID,"hizmetSil","(id:$hizmet) hizmet Silindi. ",$this->ipAdress);
			}
			else{
				$return = array("status"=>0,"message"=>"Hizmet silinirken bir Hata oluştu","header"=>"İşlem başarısız","data"=>"");
				$this->log->info($sirketID,$userID,"hizmetSil","(id:$hizmet) hizmet silinemedi. ",$this->ipAdress);
			}            
            return $return;
        }
        catch(PDOException $e ) { 
            $return = array("status"=>0,"message"=>$hizmet." veritabanından silinirken beklenmedik bir hata oluştu","header"=>"Veritabanı hatası","data"=>"");
            $this->log->writeUserError("hizmetSil->  ".$hizmet." değerleri ile silinirken pdo hatası oluştu.->".$e->getMessage() ."-> $this->ipAdress");
            return $return; 
        }
    }
	public function hizmetListele($sirketID,$userID,$yetki,$limit=""){
		$return = array("status"=>0,"message"=>"","draw"=>0,"recordsTotal"=>0,"recordsFiltered"=>0,"data"=>array());
		//CONCAT(`hizmet`.`hizmetFiyati`,' &#8378;') AS `hizmetFiyati`, BU KISIM PARA BİRİMİNE GÖRE DEĞİŞECEK
		$ekleLimit="";
		if($limit){ $ekleLimit="LIMIT 10"; }
		
		$sql="SELECT
		`hizmet`.`ID`,
		`hizmet`.`hizmetAdi`,
		CONCAT(`hizmet`.`hizmetFiyati`,'') AS `hizmetFiyati`,
		`hizmet`.`hizmetNotlari`,
		`hizmetGrup`.`grupAdi` AS 'hizmetGrubu',
		CONCAT('hzm',`hizmet`.`ID`) AS `DT_RowId`
		FROM
			`hizmet`
		LEFT JOIN `hizmetGrup` ON `hizmetGrup`.`ID` = `hizmet`.`hizmetGrubu`
		WHERE
		`sirketID` = $sirketID $ekleLimit;";
		$result =  $this->getAllSqlResults($sql);
		if($result !=-1){
			
			if(count($result)>0){
				foreach($result as $veri){
					$editButton ="";
					if($yetki >=$this->yetkiler["yonetici"]){ 
						$editButton ='<button type="button" class="btn btn-outline-warning btn-sm" ml-2  onClick="hizmetDuzenle('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Hizmet düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
						$editButton .='<button type="button" class="btn btn-outline-danger btn-sm ml-2 "  onClick="HizmetSilConfirm('.$veri["ID"].')" data-toggle="tooltip" data-placement="top" title="Hizmet Sil"><i class="fa-solid fa-trash"></i></button>';
					}
					
					$veri["islem"]=$editButton;
					array_push($return["data"],$veri);
				}
				$return["recordsTotal"]=count($return["data"]);
				$return["recordsFiltered"]=count($return["data"]);
				$return["status"]=1;
				return $return;
			}
			else{
				$return["message"]="Kayıtlı hizmet bulunamadı...";
			}
		}
		else{
			$return["message"]="Kayıtlı hizmet bulunamadı...";
		}
		return $return;
	}
	public function hizmetFiltreButtonlar($sirketID,$userID,$yetki,$limit=""){
		$return = array("status"=>1,"message"=>"","data"=>array());
		$sql="SELECT `grupAdi`,`grupIcon` FROM `hizmetGrup`";
		$result =  $this->getAllSqlResults($sql);
		$buttons='<a href="#"  class="btn btn-success mr-2 mb-2" aria-clear="hizmetFilter" aria-val="" onclick="hizmetFilter(\'\')" ><i class="fa-solid fa-boxes-stacked mr-2"></i>Tüm Hizmetler</a>';
		foreach($result as $veri){
			//$buttons.='<span class="hizmetFilters"><button type="button" class="btn btn-outline-secondary mr-2 mb-2" aria-clear="hizmetFilterr" ><i class="'.$veri["grupIcon"].' mr-2"></i>'.$veri["grupAdi"].'</button></span>';
			$buttons.='<a href="#"  class="btn btn-outline-secondary mr-2 mb-2" aria-clear="hizmetFilter" aria-val="'.$veri["grupAdi"].'" onclick="hizmetFilter(\''.$veri["grupAdi"].'\')" ><i class="'.$veri["grupIcon"].' mr-2"></i>'.$veri["grupAdi"].'</a>';
		}
		//
		$return["data"]=$buttons;
		return $return;
	}
	public function teklifHizmetlerButton($sirketID,$userID,$yetki,$limit=""){
		$return = array("status"=>1,"message"=>"","data"=>array());
		$sql="SELECT `grupAdi`,`grupIcon` FROM `hizmetGrup`";
		$result =  $this->getAllSqlResults($sql);
		$buttons='<a href="#"  class="btn btn-success mr-2 mb-2" aria-clear="hizmetFilter" aria-val="" onclick="hizmetFilter(\'\')" ><i class="fa-solid fa-boxes-stacked mr-2"></i>Tüm Hizmetler</a>';
		$buttons = array(
			array(
				"text"=>"<i class=\" fa-solid fa-boxes-stacked\"></i>",
				"className"=>"btn btn-outline-secondary",
				"action" => ""
			)
		);
		
		
		
		foreach($result as $veri){
			array_push($buttons,array(
					"text"=>'<i class="'.$veri["grupIcon"].'" data-toggle="tooltip" data-placement="top" title="'.$veri["grupAdi"].'"></i>',
					"className"=>"btn btn-sm btn-outline-secondary",
					"action" => $veri["grupAdi"]
				)
				);
			//$buttons.='<span class="hizmetFilters"><button type="button" class="btn btn-outline-secondary mr-2 mb-2" aria-clear="hizmetFilterr" ><i class="'.$veri["grupIcon"].' mr-2"></i>'.$veri["grupAdi"].'</button></span>';
			//$buttons.='<a href="#"  class="btn btn-outline-secondary mr-2 mb-2" aria-clear="hizmetFilter" aria-val="'.$veri["grupAdi"].'" onclick="hizmetFilter(\''.$veri["grupAdi"].'\')" ><i class="'.$veri["grupIcon"].' mr-2"></i>'.$veri["grupAdi"].'</a>';
		}
		//buraları toparla  button array i başa al ve foreach ile içini doldur
		/*$buttons = array(
			array(
				"text"=>"<i class=\" fa-solid fa-boxes-stacked mr-2\"></i>görüntü",
				"className"=>"btn btn-success mr-2",
				"action" => $veri["grupAdi"]
			)
		);
		
		buttons: [
            {
                text: 'My button',
                action: function ( e, dt, node, config ) {
                    alert( 'Button activated' );
                }
            }
        ]
		*/
		$return["data"]=$buttons;
		return $return;
	}
	public function hizmethizmetDuzenleVeri($sirketID,$userID,$yetki,$hizmetID){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Hizmet düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"hizmethizmetDuzenleVeri","kullanıcı tarafından yetkisiz Hizmet düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }		
		$sql="SELECT * FROM `hizmet` WHERE `ID` = $hizmetID AND `sirketID` = $sirketID";
		$result =  $this->getSqlResult($sql);
        
		if($result){
			$return["data"]=$result;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Kayıtlı Hizmet bulunamadı...";
		}
		return $return;
	}
	public function hizmethizmetDuzenleKaydet($sirketID,$userID,$yetki,$hizmet){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["yonetici"]){
            $return = array("status"=>0,"message"=>"Hizmet düzenleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($sirketID,$userID,"hizmethizmetDuzenleKaydet","kullanıcı tarafından yetkisiz hizmet düzenleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$this->changeLog($sirketID,$userID,"hizmet",$hizmet["hizmetDuzenleKaydet"]);
		$sql="UPDATE
				`hizmet`
			SET
				`hizmetAdi` = '".htmlspecialchars(trim($hizmet["hizmetDuzenleAdi"]), ENT_QUOTES)."',
				`hizmetGrubu` = '".intVal($hizmet["hizmetDuzenleGrupAra"])."',
				`hizmetFiyati` = '".intVal($hizmet["hizmetDuzenleFiyat"])."',
				`hizmetNotlari` = '".htmlspecialchars(trim($hizmet["hizmetDuzenleNot"]), ENT_QUOTES)."'
			WHERE
				`hizmet`.`ID` = ".$hizmet["hizmetDuzenleKaydet"].";";
		$updatedID = $this->updateReturnID($sql,$hizmet["hizmetDuzenleKaydet"]);
		if($updatedID !=0){
			$return["status"]=1;
			$return["message"]="Güncelleme Başarılı";
			$this->log->info($sirketID,$userID,"hizmethizmetDuzenleKaydet","(hizmetID:$updatedID) düzenlendi",$this->ipAdress);
			$sql="SELECT
					`hizmet`.`ID`,
					`hizmet`.`hizmetAdi`,
					`hizmet`.`hizmetFiyati`,
					`hizmet`.`hizmetNotlari`,
					`hizmetGrup`.`grupAdi` AS 'hizmetGrubu',
					CONCAT('hzm',`hizmet`.`ID`) AS `DT_RowId`
				FROM
					`hizmet`
				LEFT JOIN `hizmetGrup` ON `hizmetGrup`.`ID` = `hizmet`.`hizmetGrubu`
				WHERE `hizmet`.`ID` = $updatedID";
			$result =  $this->getSqlResult($sql);
			$editButton ="";
			if($yetki >=$this->yetkiler["yonetici"]){ 
				$editButton ='<button type="button" class="btn btn-outline-warning btn-sm" ml-2  onClick="hizmetDuzenle('.$result["ID"].')" data-toggle="tooltip" data-placement="top" title="Hizmet düzenle"><i class="fa-solid fa-pen-to-square"></i></button>';
			}
			$result["islem"]=$editButton ;
			$return["data"]=$result;
			return $return;
		}
		else{
			$return["status"]=0;
			$return["header"]="Hata!";
			$return["message"]="Güncelleme yapılırken bir hata oluştu <br>( ".$hizmet["hizmetDuzenleAdi"]." )";
			$return["data"]=$updatedID;
			$this->log->warning($sirketID,$userID,"hizmethizmetDuzenleKaydet","(hizmetID:".$hizmet["hizmetDuzenleKaydet"].") düzenlenirken bir hata oluştu",$this->ipAdress);
			
		}
		$return["data"]=$hizmet;
		return $return;
	}
	public function hizmetlerTablosu($sirketID,$userID,$yetki){
		$return = array("status"=>0,"message"=>"","data"=>array());
		$sql="SELECT
			`hizmet`.`ID`,
			`hizmet`.`hizmetAdi`,
			`hizmet`.`hizmetFiyati`,
			`hizmet`.`hizmetNotlari`,
			`hizmetGrup`.`grupAdi` AS 'hizmetGrubu',
			CONCAT('hzm',`hizmet`.`ID`) AS `DT_RowId`,
			`hizmet`.`hizmetGrubu` AS `hizmetGrupID`
		FROM
			`hizmet`
		LEFT JOIN `hizmetGrup` ON `hizmetGrup`.`ID` = `hizmet`.`hizmetGrubu`
		WHERE
		`sirketID` = $sirketID ;";
		$result =  $this->getAllSqlResults($sql);
		if($result !=-1){
			
			if(count($result)>0){
				//foreach($result as $veri){
					//$editButton ="";
				//	if($yetki >=$this->yetkiler["yonetici"]){ 
				//		$editButton ='<button type="button" class="btn btn-outline-info btn-sm" ml-2 aria-name="hizmet"><i class="fa-solid fa-pen-to-square"></i></button>';
				//	}
					
					//$veri["islem"]=$editButton;
					//array_push($return["data"],$veri);
				//}
				$return["data"]=$result;
				$return["recordsTotal"]=count($return["data"]);
				$return["recordsFiltered"]=count($return["data"]);
				$return["status"]=1;
				return $return;
			}
			else{
				$return["message"]="Kayıtlı hizmet bulunamadı...";
			}
		}
		else{
			$return["message"]="Kayıtlı hizmet bulunamadı...";
		}
		return $return;
	}
	#endregion

	#region TEKLİF  İŞLEMLERİ
	public function teklifKaydet($sirketID,$userID,$yetki,$teklif){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif yazma yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"teklifKaydet","kullanıcı tarafından yetkisiz teklif oluşturma isteği geldi",$this->ipAdress);
            return $return;
        }
		$teklifData = json_decode($teklif,TRUE);
		$uuid=uniqid('teklif_');
		$date=date_create($teklifData["teklifIsBaslangic"]);
		$teklifAdi =$teklifData["teklifAdi"];
		$acentaID = $teklifData["teklifAcentaID"] ?: -1;
		$acentaCalisanID = $teklifData["teklifAcentaCalisanID"] ?: -1;
		//$yazimTarihi = $teklifData["teklifTarihi"];
		$yazimTarihi = date("Y-m-d H:i:s");
		$baslangic = new DateTime($teklifData["teklifIsBaslangic"]);
		$baslangicTarihi = $baslangic->format('Y-m-d');
		//$baslangicTarihi = $teklifData["teklifIsBaslangic"];
		$bitis = new DateTime($teklifData["teklifIsBitis"]);
		$bitisTarihi = $bitis->format('Y-m-d');
		//$bitisTarihi = $teklifData["teklifIsBitis"];
		
		$teklifTerminSuresi = new DateTime($teklifData["teklifTerminSuresi"]);
		$terminTarihi = $teklifTerminSuresi->format('Y-m-d');
		//$bitisTarihi = $teklifData["teklifIsBitis"];

		$revizeno = $teklifData["teklifRevize"] ?: 1;

		$sql = "INSERT INTO `teklifler`(
			`ID`,
			`uuid`,
			`sirketID`,
			`yazanID`,
			`acentaID`,
			`acentaCalisanID`,
			`teklifAdi`,
			`revizeNo`,
			`yazimTarihi`,
			`paraBirimi`,
			`baslangicTarihi`,
			`bitisTarihi`,
			`terminTarihi`,
			`durumTarihi`,
			`anaToplam`,
			`durum`,
			`ekip`,
			`icerik`
		)
		VALUES(
			NULL,
			'$uuid',
			'$sirketID',
			'".$teklifData["teklifYazanID"]."',
			'$acentaID',
			'$acentaCalisanID',
			'$teklifAdi',
			'$revizeno',
			'$yazimTarihi',
			'".$teklifData["teklifParaBirimi"]."',
			'$baslangicTarihi',
			'$bitisTarihi',
			'$terminTarihi',
			NULL,
			'".$teklifData["teklifAnaToplam"]."',
			'".$teklifData["teklifDurumu"]."',
			'".json_encode($teklifData["teklifEkip"],TRUE)."',
			'".json_encode($teklifData,TRUE)."'
		);";
		$returnID = $this->insertReturnID($sql);
            if($returnID<=0){
				$return = array("status"=>0,"message"=>$teklifAdi." için Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$uuid);
                $this->log->warning($sirketID,$userID,"teklifKaydet"," $teklifAdi  için Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
                return $return;
            }
            $return = array("status"=>1,"message"=>$teklifAdi." için Kayıt eklendi","header"=>"Başarılı","data"=>$uuid);
            $this->log->info($sirketID,$userID,"teklifKaydet","(teklifID:$returnID ) (uuid:$uuid) $teklifAdi değerleri ile yeni teklif eklendi. ",$this->ipAdress);
            

		return $return;
	}
	public function teklifVeriBul($sirketID,$userID,$yetki,$search,$query){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif okuma yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"teklifVeriBul","kullanıcı tarafından yetkisiz teklif okuma isteği geldi",$this->ipAdress);
            return $return;
        }
		$searchFor="";
		switch ($search) {
			case "acentaID":
				$searchFor="acentaID";
			  break;
			case "acentaCalisanID":
				$searchFor="acentaCalisanID";
			  break;
			case "uuid":
				$searchFor="uuid";
			break;
			case "teklifAdi":
				$searchFor="teklifAdi";
			break;
			case "yazanID":
				$searchFor="yazanID";
			break;
			case "sirketID":
				$searchFor="sirketID";
			break;
			case "yazimTarihi":
				$searchFor="yazimTarihi";
			break;
			case "baslangicTarihi":
				$searchFor="baslangicTarihi";
			break;
			case "durum":
				$searchFor="durum";
			break;
			case "ID":
				$searchFor="ID";
			break;
			default:
				$searchFor="uuid";
		  }
		$sql = "SELECT
			`teklifler`.*,
			`acentaCalisanlar`.`calisanEposta`
		FROM
			`teklifler`
		LEFT JOIN `acentaCalisanlar` ON `teklifler`.`acentaCalisanID` = `acentaCalisanlar`.`ID`
		WHERE
			`teklifler`.`$searchFor` LIKE '$query';";
		$result = $this->getAllSqlResults($sql);
		if($result){
			$islenmisSonuc= array();
			foreach($result as $veri){
				$veri["ekip"]=json_decode($veri["ekip"],TRUE);
				$veri["icerik"]=json_decode($veri["icerik"],TRUE);
				array_push($islenmisSonuc,$veri);
			}
			$return["result"]=$islenmisSonuc;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Teklif için kayıtlı veri bulunamadı...";
		}
		return $return;
	}
	public function teklifRevizeOlustur($sirketID,$userID,$yetki,$query){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif okuma yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"teklifVeriBul","kullanıcı tarafından yetkisiz teklif okuma isteği geldi",$this->ipAdress);
            return $return;
        }
	
		$sql = "SELECT
			`teklifler`.*,
			`acentaCalisanlar`.`calisanEposta`
		FROM
			`teklifler`
		LEFT JOIN `acentaCalisanlar` ON `teklifler`.`acentaCalisanID` = `acentaCalisanlar`.`ID`
		WHERE
			`teklifler`.`ID` LIKE '$query';";
		$result = $this->getSqlResult($sql);
		//eski teklifi geçersiz olarak işaretliyoruz
		$EskiDurumSql = "UPDATE `teklifler` SET `durumTarihi` = '".date("Y-m-d H:i:s")."',`durum` = '4' WHERE `teklifler`.`ID` = $query;";
		$this->updateReturnID($EskiDurumSql,$query);
		$result["icerik"]=$this->yaziDuzelt($result["icerik"]);
		if($result["icerik"]==null || $result["icerik"]==""){ 
			$return = array("status"=>0,"message"=>"Teklif içeriği hatalı formatta","data"=>array());
			return $return;
		}
		$eskiTeklifIcerik = json_decode($result["icerik"],TRUE);
		$bigestRevSQL = "SELECT `revizeNo` FROM `teklifler` WHERE `teklifAdi` LIKE '".$eskiTeklifIcerik["teklifAdi"]."' ORDER BY `revizeNo` DESC LIMIT 1";
		$resTemp = $this->getSqlResult($bigestRevSQL);
		if(isset($resTemp["revizeNo"])){
			$eskiTeklifIcerik["teklifRevize"] = $resTemp["revizeNo"]+1;
		}else{
			$eskiTeklifIcerik["teklifRevize"] = 1;
		}
		$eskiTeklifIcerik["teklifTarihi"]=  date("Y-m-d");
		$eskiTeklifIcerik["teklifTarihi"]=  date("Y-m-d H:i:s");
		//teklifYazanAdi
		//teklifYazanID
		//teklifYazanMail

		$eskiTeklifIcerik["teklifYazanID"]=$userID;
		$yazanKullaniciSQL = "SELECT `kullaniciAdi`,`kullaniciEposta` FROM `kullanicilar` WHERE `ID`=$userID";
		$revizeYazan = $this->getSqlResult($yazanKullaniciSQL);
		$eskiTeklifIcerik["teklifYazanAdi"]=$revizeYazan["kullaniciAdi"];
		$eskiTeklifIcerik["teklifYazanMail"]=$revizeYazan["kullaniciEposta"];
		////////////////////////////////

		$teklifData = $eskiTeklifIcerik;
		$uuid=uniqid('teklif_');
		//$date=date_create($teklifData["teklifIsBaslangic"]);
		$teklifAdi =$teklifData["teklifAdi"];
		$acentaID = $teklifData["teklifAcentaID"] ?: -1;
		$acentaCalisanID = $teklifData["teklifAcentaCalisanID"] ?: -1;
		//$yazimTarihi = $teklifData["teklifTarihi"];
		$yazimTarihi = date("Y-m-d H:i:s");
		$baslangic = new DateTime($teklifData["teklifIsBaslangic"]);
		$baslangicTarihi = $baslangic->format('Y-m-d');
		//$yazimTarihi = date("m/d/Y H:i");
		//$baslangicTarihi = $teklifData["teklifIsBaslangic"];
		$bitis = new DateTime($teklifData["teklifIsBitis"]);
		$bitisTarihi = $bitis->format('Y-m-d');
		//$bitisTarihi = $teklifData["teklifIsBitis"];
		$revizeno = $teklifData["teklifRevize"] ?: 1;

		$sql = "INSERT INTO `teklifler`(
			`ID`,
			`uuid`,
			`sirketID`,
			`yazanID`,
			`acentaID`,
			`acentaCalisanID`,
			`teklifAdi`,
			`revizeNo`,
			`yazimTarihi`,
			`paraBirimi`,
			`baslangicTarihi`,
			`bitisTarihi`,
			`durumTarihi`,
			`anaToplam`,
			`durum`,
			`ekip`,
			`icerik`
		)
		VALUES(
			NULL,
			'$uuid',
			'$sirketID',
			'".$teklifData["teklifYazanID"]."',
			'$acentaID',
			'$acentaCalisanID',
			'$teklifAdi',
			'$revizeno',
			'$yazimTarihi',
			'".$teklifData["teklifParaBirimi"]."',
			'$baslangicTarihi',
			'$bitisTarihi',
			NULL,
			'".$teklifData["teklifAnaToplam"]."',
			'".$teklifData["teklifDurumu"]."',
			'".json_encode($teklifData["teklifEkip"],TRUE)."',
			'".json_encode($teklifData,TRUE)."'
		);";
		$returnID = $this->insertReturnID($sql);
		if($returnID<=0){

			$return = array("status"=>0,"message"=>$teklifAdi." (Rev:".$eskiTeklifIcerik["teklifRevize"].") için Revize Kayıt oluşturulurken bir hata oluştu","header"=>"Hata","data"=>$uuid);
			$this->log->warning($sirketID,$userID,"teklifRevizeOlustur"," $teklifAdi (Rev:".$eskiTeklifIcerik["teklifRevize"].") için Revize Kayıt oluşturulurken bir hata oluştu. ",$this->ipAdress);
			return $return;
		}
		
		

		$sql = "SELECT
			`teklifler`.*,
			`acentaCalisanlar`.`calisanEposta`
		FROM
			`teklifler`
		LEFT JOIN `acentaCalisanlar` ON `teklifler`.`acentaCalisanID` = `acentaCalisanlar`.`ID`
		WHERE
			`teklifler`.`ID` LIKE '$returnID';";
		$resultRevize = $this->getSqlResult($sql);
		$resultRevize["icerik"]=json_decode($resultRevize["icerik"],TRUE);
		$return = array("status"=>1,"message"=>$teklifAdi." için Revize Kayıt eklendi","header"=>"Başarılı","data"=>$resultRevize);
		$this->log->info($sirketID,$userID,"teklifRevizeOlustur","(teklifID:$returnID ) (uuid:$uuid) $teklifAdi (Rev:".$eskiTeklifIcerik["teklifRevize"].") değerleri ile revize teklif eklendi. ",$this->ipAdress);
		///////////////////////////////////////////////////

	
		
		return $return;
	}
	public function teklifListesiOlustur($sirketID,$userID,$yetki,$search){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif okuma yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"teklifListesiOlustur","kullanıcı tarafından yetkisiz teklif okuma isteği geldi",$this->ipAdress);
            return $return;
        }
		$sql="SELECT
			`teklifler`.`ID`,
			`teklifler`.`uuid`,
			`acentalar`.`acentaAdi`,
			`acentaCalisanlar`.`calisanAdi`,
			`teklifler`.`teklifAdi`,
			`teklifler`.`yazimTarihi`,
			`teklifler`.`baslangicTarihi`,
			`kullanicilar`.`kullaniciAdi`,
            `teklifler`.`revizeNo`,
			CONCAT('TeklifListID',`teklifler`.`ID`) AS `DT_RowId`
		FROM
			`teklifler`
		LEFT JOIN `acentalar` ON `acentalar`.`ID` = `teklifler`.`acentaID`
		LEFT JOIN `acentaCalisanlar` ON `acentaCalisanlar`.`ID` = `teklifler`.`acentaCalisanID`
		LEFT JOIN `kullanicilar` ON `kullanicilar`.`ID` = `teklifler`.`yazanID`
		WHERE
			`teklifler`.`durum` = $search;";
		$result = $this->getAllSqlResults($sql);
		if($result){
			$islenmisSonuc= array();
			foreach($result as $veri){
				$bekleyenButton ="";
				$onayButton ="";
				$redButton ="";
				$silButton ="";
				$editButton="";
				$copyButton="";
				$revButton="";
				$detayButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifGoruntule" aria-teklifuuid="'.$veri["uuid"].'" data-toggle="tooltip" data-placement="top" title="Teklif Detayları">
				<i class="fa-solid fa-circle-info"></i>
				</button>';
				if($search != "2"){
				$bekleyenButton = '<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="TaslakTeklifBekleyen" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Bekleyen olarak işaretle">
				<i class="fa-solid fa-check"></i>
				</button>';}
				if($search!="3"){
				$onayButton = '<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="TaslakTeklifOnayla" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Onaylanan olarak işaretle">
				<i class="fa-solid fa-check-double"></i>
				</button>';}
				if($search!="4"){
				$redButton = '<button type="button" class="btn-sm d-inline ml-1 btn-outline-danger" aria-name="TaslakTeklifRed" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Red olarak işaretle">
				<i class="fa-regular fa-circle-xmark"></i>
				</button>';}
				if($search=="1"){
				$editButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="TaslakTeklifDuzenle" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif düzenle">
				<i class="fa fa-edit"></i>
					</button>';
				$silButton = '<button type="button" class="btn-sm d-inline ml-1 btn-outline-danger" aria-name="TaslakTeklifSil" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklifi Sil">
				<i class="fa-solid fa-trash-can"></i>
				</button>';}
				if($search !="1"){
					$copyButton ='<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="TaslakTeklifKopyala" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Kopyala">
					<i class="fa-solid fa-copy"></i>
						</button>';
					$revButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifRevizeBaslat" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Revize Oluştur">
					<i class="fa-solid fa-code-branch"></i>
						</button>';
				}
				
				$veri["yazimTarihi"]=$this->humanDateTime($veri["yazimTarihi"]);
				$veri["baslangicTarihi"]=$this->humanDate($veri["baslangicTarihi"]);
				$veri["teklifAdi"]=$this->yaziDuzelt($veri["teklifAdi"]);
				$veri["islem"]=$revButton.$copyButton.$editButton.$detayButton.$bekleyenButton.$onayButton.$redButton.$silButton;
				array_push($islenmisSonuc,$veri);
			}
			$return["data"]=$islenmisSonuc;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Teklif için kayıtlı veri bulunamadı...";
		}
		return $return;
	}
	public function teklifListesiTum($sirketID,$userID,$yetki,$search,$year = 0){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif okuma yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"teklifListesiTum","kullanıcı tarafından yetkisiz tüm teklif okuma isteği geldi",$this->ipAdress);
            return $return;
        }
		$sqlEkle ="WHERE `teklifler`.`sirketID` = $sirketID ";
		if($year !=0){
			$sqlEkle .="
			 AND (`teklifler`.`baslangicTarihi` LIKE '%$year%' OR `teklifler`.`yazimTarihi` LIKE '%$year%');";
		}
		$sql="SELECT
			`teklifler`.`ID`,
			`teklifler`.`uuid`,
			`acentalar`.`acentaAdi`,
			`acentaCalisanlar`.`calisanAdi`,
			`teklifler`.`teklifAdi`,
			`teklifler`.`yazimTarihi`,
			`teklifler`.`baslangicTarihi`,
			`teklifler`.`bitisTarihi`,
			`teklifler`.`durum`,
			`teklifler`.`terminTarihi`,
			`kullanicilar`.`kullaniciAdi`,
            `teklifler`.`revizeNo`,
			CONCAT('TeklifListID', `teklifler`.`ID`) AS `DT_RowId`
		FROM
			`teklifler`
		LEFT JOIN `acentalar` ON `acentalar`.`ID` = `teklifler`.`acentaID`
		LEFT JOIN `acentaCalisanlar` ON `acentaCalisanlar`.`ID` = `teklifler`.`acentaCalisanID`
		LEFT JOIN `kullanicilar` ON `kullanicilar`.`ID` = `teklifler`.`yazanID` $sqlEkle";
		$result = $this->getAllSqlResults($sql);
		if($result && is_array($result)){
			$islenmisSonuc= array();
			foreach($result as $veri){



				$silButton ="";
				$editButton="";
				$copyButton="";
				$revButton="";
				$mutabakatButton="";
				$detayButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifGoruntule" aria-teklifuuid="'.$veri["uuid"].'" data-toggle="tooltip" data-placement="top" title="Teklif Detayları">
				<i class="fa-solid fa-circle-info"></i>
				</button>';
				if($veri["durum"]=="1"){
				$editButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="TaslakTeklifDuzenle" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif düzenle">
				<i class="fa fa-edit"></i>
					</button>';
				$silButton = '<button type="button" class="btn-sm d-inline ml-1 btn-outline-danger" aria-name="TaslakTeklifSil" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklifi Sil">
				<i class="fa-solid fa-trash-can"></i>
				</button>';}
				if($veri["durum"] !="1"){
					$copyButton ='<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="TaslakTeklifKopyala" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Kopyala">
					<i class="fa-solid fa-copy"></i>
						</button>';
					$revButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifRevizeBaslat" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Revize Oluştur">
					<i class="fa-solid fa-code-branch"></i>
						</button>';
				}
				$termin = $veri["terminTarihi"];
				$durum = $veri["durum"];
				$teklifAdi = $veri["teklifAdi"];
				$bugun = new DateTime();
				if($termin != NULL){
					$terminSuresi = new DateTime($termin);
					$kalanGun = $bugun->diff($terminSuresi)->format("%r%a");
					if($durum == "2" && $kalanGun <=0){

						$teklifAdi ="<span class=\"bg-warning text-white\">".$veri["teklifAdi"]." (TERMİN AŞIMI!)</span>";
						$veri["teklifAdi"] = $teklifAdi;
						$veri["terminTarihi"] = "<span class=\"bg-warning text-white\">".$this->humanDate($veri["terminTarihi"])."</span>";
					}
					else{
						$veri["terminTarihi"] = $this->humanDate($veri["terminTarihi"]);
					}
				}
				$veri["baslangicTarihi"]=$this->humanDate($veri["baslangicTarihi"]);
				$bitisTarihi = $veri["bitisTarihi"];
				if($bitisTarihi != NULL){
					$bitisSuresi = new DateTime($bitisTarihi);
					$kalanGun = $bugun->diff($bitisSuresi)->format("%r%a");
					if($durum == "3" && $kalanGun <=0){
						$teklifAdi =$veri["teklifAdi"]."<span class=\"bg-warning  ml-2\"> (İş Bitimi! $kalanGun Gün)</span>";
						$veri["teklifAdi"] = $teklifAdi;
						$veri["baslangicTarihi"] = "<span class=\"bg-warning \">".$this->humanDate($veri["baslangicTarihi"])."</span>";
					}
					if($durum == "5" && $kalanGun <=0){
						$teklifAdi ="<span class=\"bg-danger text-white\">".$veri["teklifAdi"]." (FATURA GECİKME! $kalanGun Gün)</span>";
						$veri["teklifAdi"] = $teklifAdi;
						$veri["baslangicTarihi"] = "<span class=\"bg-danger text-white\">".$this->humanDate($veri["baslangicTarihi"])."</span>";
					}
				}
				switch ($veri["durum"]) {
					case "1":
						//$veri["durum"]='<span class="badge badge-secondary">Taslak</span>';
						$select = '<select class="form-control form-control-xs bg-secondary text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
									<option value="1" selected>Taslak</option>
									<option value="2">Bekleyen</option>
									<option value="3">Onaylanan</option>
									<option value="4">Geçersiz</option>
									</select>';
						$veri["durum"]=$select;
					  break;
					case "2":
						//$veri["durum"]='<span class="badge badge-warning">Bekleyen</span>';
						$select = '<select class="form-control form-control-xs bg-warning text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
									<option value="2" selected>Bekleyen</option>
									<option value="3">Onaylanan</option>
									<option value="4">Geçersiz</option>
									</select>';
						$veri["durum"]=$select;
					  break;
					case "3":
						//$veri["durum"]='<span class="badge badge-success">Onaylanan</span>';
						$select = '<select class="form-control form-control-xs bg-success text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
									<option value="2" >Bekleyen</option>
									<option value="3" selected>Onaylanan</option>
									<option value="5" >Biten</option>
									<option value="4">Geçersiz</option>
									</select>';
						$veri["durum"]=$select;
					  break;
					
					case "4":
						$veri["durum"]='<span class="badge badge-danger">Geçersiz</span>';
					  break;
					
					case "5":
						//$veri["durum"]='<span class="badge badge-info">Biten</span>';
						$select = '<select class="form-control form-control-xs bg-info text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
									<option value="3">Onaylanan</option>
									<option value="5" selected>Biten</option>
									<option value="6" >Faturalandırılan</option>
									</select>';
						$veri["durum"]=$select;
						$mutabakatButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="TaslakTeklifMutabakat" aria-teklifID="'.$veri["uuid"].'" data-toggle="tooltip" data-placement="top" title="Mutabakat Görüntüle"><i class="fa-solid fa-handshake"></i></button>';
					  break;
					
					case "6":
						$veri["durum"]='<span class="badge badge-info">Faturalandırılan</span>';
						$mutabakatButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="TaslakTeklifMutabakat" aria-teklifID="'.$veri["uuid"].'" data-toggle="tooltip" data-placement="top" title="Mutabakat Görüntüle"><i class="fa-solid fa-handshake"></i></button>';
					  break;
					default:
						//$veri["durum"]='<span class="badge badge-secondary">Taslak</span>';
						$select = '<select class="form-control form-control-xs bg-secondary text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
									<option value="1" selected>Taslak</option>
									<option value="2">Bekleyen</option>
									<option value="3">Onaylanan</option>
									<option value="4">Geçersiz</option>
									</select>';
						$veri["durum"]=$select;
				  }
				$veri["yazimTarihi"]=$this->humanDateTime($veri["yazimTarihi"]);
				//$veri["terminTarihi"]=$this->humanDate($veri["terminTarihi"]);
				$veri["teklifAdi"]=$this->yaziDuzelt($veri["teklifAdi"]);
				$veri["islem"]=$revButton.$copyButton.$editButton.$detayButton.$silButton.$mutabakatButton;
				array_push($islenmisSonuc,$veri);
			}
			$return["data"]=$islenmisSonuc;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Teklif için kayıtlı veri bulunamadı...";
			$return["data"]=$sql;
		}
		return $return;
	}
	public function taslakTeklifDurumGuncelle($sirketID,$userID,$yetki,$teklifID,$teklifDurum){
		$return = array("status"=>0,"message"=>"","data"=>"","result"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif durum değiştirme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"taslakTeklifDurumGuncelle","kullanıcı tarafından yetkisiz teklif durum değiştirme isteği geldi",$this->ipAdress);
            return $return;
        }
		$this->changeLog($sirketID,$userID,"teklifler",$teklifID);

		$sql="UPDATE `teklifler` SET 
		`durum` = '$teklifDurum',
		`durumTarihi` = '".date("Y-m-d H:i:s")."'
		 WHERE `teklifler`.`ID` = $teklifID;";
		
		$retID = $this->updateReturnID($sql,$teklifID);
		if($retID==0){
			$return["status"]=0;
			$return["message"]="Güncelleme yapılırken hata oluştu";
			return $return;
		}
		$sqlEkle ="WHERE `teklifler`.`sirketID` = $sirketID AND `teklifler`.`ID` =$teklifID";
		$sql="SELECT
			`teklifler`.`ID`,
			`teklifler`.`uuid`,
			`acentalar`.`acentaAdi`,
			`acentaCalisanlar`.`calisanAdi`,
			`teklifler`.`teklifAdi`,
			`teklifler`.`yazimTarihi`,
			`teklifler`.`baslangicTarihi`,
			`teklifler`.`bitisTarihi`,
			`teklifler`.`durum`,
			`teklifler`.`terminTarihi`,
			`kullanicilar`.`kullaniciAdi`,
            `teklifler`.`revizeNo`,
			CONCAT('TeklifListID', `teklifler`.`ID`) AS `DT_RowId`
		FROM
			`teklifler`
		LEFT JOIN `acentalar` ON `acentalar`.`ID` = `teklifler`.`acentaID`
		LEFT JOIN `acentaCalisanlar` ON `acentaCalisanlar`.`ID` = `teklifler`.`acentaCalisanID`
		LEFT JOIN `kullanicilar` ON `kullanicilar`.`ID` = `teklifler`.`yazanID` $sqlEkle";
		$veri = $this->getSqlResult($sql);
		if(!$veri || $veri == -1){
			$return = array("status"=>0,"message"=>"Güncellenen tekliften veri alınamadı","header"=>"Yetki Hatası","data"=>"");
            $this->log->info($userID,"taslakTeklifDurumGuncelle","Güncellenen tekliften veri alınamadı",$this->ipAdress);
            return $return;
		}
		$silButton ="";
		$editButton="";
		$copyButton="";
		$revButton="";
		$mutabakatButton="";
		$detayButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifGoruntule" aria-teklifuuid="'.$veri["uuid"].'" data-toggle="tooltip" data-placement="top" title="Teklif Detayları">
		<i class="fa-solid fa-circle-info"></i>
		</button>';
		if($veri["durum"]=="1"){
		$editButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="TaslakTeklifDuzenle" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif düzenle">
		<i class="fa fa-edit"></i>
			</button>';
		$silButton = '<button type="button" class="btn-sm d-inline ml-1 btn-outline-danger" aria-name="TaslakTeklifSil" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklifi Sil">
		<i class="fa-solid fa-trash-can"></i>
		</button>';}
		if($veri["durum"] !="1"){
			$copyButton ='<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="TaslakTeklifKopyala" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Kopyala">
			<i class="fa-solid fa-copy"></i>
				</button>';
			$revButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-info" aria-name="TaslakTeklifRevizeBaslat" aria-teklifID="'.$veri["ID"].'" data-toggle="tooltip" data-placement="top" title="Teklif Revize Oluştur">
			<i class="fa-solid fa-code-branch"></i>
				</button>';
		}
		$termin = $veri["terminTarihi"];
		$durum = $veri["durum"];
		$teklifAdi = $veri["teklifAdi"];
		$bugun = new DateTime();
		if($termin != NULL){
			//$earlier = new DateTime("2010-07-06");
			$terminSuresi = new DateTime($termin);

			$kalanGun = $bugun->diff($terminSuresi)->format("%r%a"); //3
			//$veri["teklifAdi"] = "$teklifAdi ($kalanGun) $durum";
			if($durum == "2" && $kalanGun <=0){

				$teklifAdi ="".$veri["teklifAdi"]."<span class=\"bg-warning text-white ml-2\"> (TERMİN AŞIMI!)</span>";
				$veri["teklifAdi"] = $teklifAdi;
				$veri["terminTarihi"] = "<span class=\"bg-warning text-white\">".$veri["terminTarihi"]."</span>";
			}
		}
		$veri["baslangicTarihi"]=$this->humanDate($veri["baslangicTarihi"]);
		$bitisTarihi = $veri["bitisTarihi"];
		if($bitisTarihi != NULL){
			$bitisSuresi = new DateTime($bitisTarihi);
			$kalanGun = $bugun->diff($bitisSuresi)->format("%r%a");
			if($durum == "3" && $kalanGun <=0){
				$teklifAdi =$veri["teklifAdi"]."<span class=\"bg-warning  ml-2\"> (İş Bitimi! $kalanGun Gün)</span>";
				$veri["teklifAdi"] = $teklifAdi;
				$veri["baslangicTarihi"] = "<span class=\"bg-warning \">".$this->humanDate($veri["baslangicTarihi"])."</span>";
			}
			if($durum == "5" && $kalanGun <=0){
				$teklifAdi =$veri["teklifAdi"]."<span class=\"bg-danger text-white ml-2\"> (FATURA GECİKME! $kalanGun Gün)</span>";
				$veri["teklifAdi"] = $teklifAdi;
				$veri["baslangicTarihi"] = "<span class=\"bg-danger text-white\">".$this->humanDate($veri["baslangicTarihi"])."</span>";
			}
		}

		switch ($veri["durum"]) {
			case "1":
				//$veri["durum"]='<span class="badge badge-secondary">Taslak</span>';
				$select = '<select class="form-control form-control-xs bg-secondary text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
							<option value="1" selected>Taslak</option>
							<option value="2">Bekleyen</option>
							<option value="3">Onaylanan</option>
							<option value="4">Geçersiz</option>
							</select>';
				$veri["durum"]=$select;
				break;
			case "2":
				//$veri["durum"]='<span class="badge badge-warning">Bekleyen</span>';
				$select = '<select class="form-control form-control-xs bg-warning text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
							<option value="2" selected>Bekleyen</option>
							<option value="3">Onaylanan</option>
							<option value="4">Geçersiz</option>
							</select>';
				$veri["durum"]=$select;
				break;
			case "3":
				//$veri["durum"]='<span class="badge badge-success">Onaylanan</span>';
				$select = '<select class="form-control form-control-xs bg-success text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
							<option value="2" >Bekleyen</option>
							<option value="3" selected>Onaylanan</option>
							<option value="5" >Biten</option>
							<option value="4">Geçersiz</option>
							</select>';
				$veri["durum"]=$select;
				break;
			
			case "4":
				$veri["durum"]='<span class="badge badge-danger">Geçersiz</span>';
				break;
			
			case "5":
				//$veri["durum"]='<span class="badge badge-info">Biten</span>';
				$select = '<select class="form-control form-control-xs bg-info text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
							<option value="3">Onaylanan</option>
							<option value="5" selected>Biten</option>
							<option value="6" >Faturalandırılan</option>
							</select>';
				$veri["durum"]=$select;
				$mutabakatButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="TaslakTeklifMutabakat" aria-teklifID="'.$veri["uuid"].'" data-toggle="tooltip" data-placement="top" title="Mutabakat Görüntüle"><i class="fa-solid fa-handshake"></i></button>';
				$mutabakat = $this->mutabakatBak($sirketID,$userID,$yetki,$veri["uuid"]);
				$veri["mutabakat"] = $mutabakat;
				break;
			
			case "6":
				$veri["durum"]='<span class="badge badge-info">Faturalandırılan</span>';
				$mutabakat = $this->mutabakatBak($sirketID,$userID,$yetki,$veri["uuid"]);
				$veri["mutabakat"] = $mutabakat;
				$mutabakatButton='<button type="button" class="btn-sm d-inline ml-1 btn-outline-success" aria-name="TaslakTeklifMutabakat" aria-teklifID="'.$veri["uuid"].'" data-toggle="tooltip" data-placement="top" title="Mutabakat Görüntüle"><i class="fa-solid fa-handshake"></i></button>';
				break;
			default:
				//$veri["durum"]='<span class="badge badge-secondary">Taslak</span>';
				$select = '<select class="form-control form-control-xs bg-secondary text-white" aria-name="teklifDurumSec" aria-ID="'.$veri["ID"].'">
							<option value="1" selected>Taslak</option>
							<option value="2">Bekleyen</option>
							<option value="3">Onaylanan</option>
							<option value="4">Geçersiz</option>
							</select>';
				$veri["durum"]=$select;
			}
		$veri["terminTarihi"]=$this->humanDateTime($veri["terminTarihi"]);
		$veri["yazimTarihi"]=$this->humanDateTime($veri["yazimTarihi"]);
		$veri["teklifAdi"]=$this->yaziDuzelt($veri["teklifAdi"]);
		$veri["islem"]=$revButton.$copyButton.$editButton.$detayButton.$silButton.$mutabakatButton;
		$veri["durumCode"]=$teklifDurum;
		$return["status"]=1;
		$return["data"]=$retID;
		$return["result"]=$veri;
		  
		
		return $return;
	}
	public function taslakTeklifSil($sirketID,$userID,$yetki,$taslakTeklifSil){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif Silme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"taslakTeklifSil","kullanıcı tarafından yetkisiz teklif silme isteği geldi",$this->ipAdress);
            return $return;
        }
		$sql ="DELETE FROM `teklifler` WHERE `teklifler`.`ID` = $taslakTeklifSil";
		$this->deleteRecord($sql);
		$return["status"]=1;
		$return["message"]="Teklif Silindi";
		return $return;
	}
	public function teklifIcerikGuncelle($sirketID,$userID,$yetki,$teklifData){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["satisSorumlusu"]){
            $return = array("status"=>0,"message"=>"Teklif güncelleme yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"teklifIcerikGuncelle","kullanıcı tarafından yetkisiz teklif güncelleme isteği geldi",$this->ipAdress);
            return $return;
        }
		$teklifData = $this->yaziDuzelt($teklifData);
		$data = json_decode($teklifData,TRUE);
		$acentaID=-1;
		$teklifAcentaCalisanID=-1;
		if($data["teklifAcentaID"]!=""){$acentaID=$data["teklifAcentaID"];}
		if($data["teklifAcentaCalisanID"]!=""){$teklifAcentaCalisanID=$data["teklifAcentaCalisanID"];}
		/*$sql = "UPDATE
			`teklifler`
		SET
			`acentaID` = '$acentaID',
			`acentaCalisanID` = '$teklifAcentaCalisanID',
			`teklifAdi` = '".$data["teklifAdi"]."',
			`yazimTarihi` = '".$data["teklifTarihi"]."',
			`paraBirimi` = '".$data["teklifParaBirimi"]."',
			`baslangicTarihi` = '".$data["teklifIsBaslangic"]."',
			`bitisTarihi` = '".$data["teklifIsBitis"]."',
			`anaToplam` = '".$data["teklifAnaToplam"]."',
			`durum` = '".$data["teklifDurumu"]."',
			`ekip` = '".json_encode($data["teklifEkip"],TRUE)."',
			`icerik` = '".json_encode($data,TRUE)."'
		WHERE
			`teklifler`.`ID` = ".$data["ID"].";";
		*/
		$baslangic = new DateTime($data["teklifIsBaslangic"]);
		$baslangicTarihi = $baslangic->format('Y-m-d');

		$bitis = new DateTime($data["teklifIsBaslangic"]);
		$bitisTarihi = $bitis->format('Y-m-d');
		$this->changeLog($sirketID,$userID,"teklifler",$data["ID"]);
		$sql = "UPDATE
			`teklifler`
		SET
			`acentaID` = '$acentaID',
			`acentaCalisanID` = '$teklifAcentaCalisanID',
			`teklifAdi` = '".$data["teklifAdi"]."',
			`yazimTarihi` = '".date("Y-m-d H:i:s")."',
			`paraBirimi` = '".$data["teklifParaBirimi"]."',
			`baslangicTarihi` = '".$baslangicTarihi."',
			`bitisTarihi` = '".$bitisTarihi."',
			`anaToplam` = '".$data["teklifAnaToplam"]."',
			`durum` = '".$data["teklifDurumu"]."',
			`ekip` = '".json_encode($data["teklifEkip"],TRUE)."',
			`icerik` = '".json_encode($data,TRUE)."'
		WHERE
			`teklifler`.`ID` = ".$data["ID"].";";

		$retID = $this->updateReturnID($sql,$data["ID"]);
		$return["status"]="1";
		$return["data"]=$data["uuid"];
		$return["message"]="Teklif güncellendi";
		return $return;
	}
	public function teklifInsertMusteriSayfasi($varmi,$ekle,$update){
		return $this->insertOrUpdateReturnID($varmi,$ekle,$update);
	}
	#endregion

	#region DÖVİZ İŞLEMLERİ
	public function getTcmbData(){
		$return = array("status"=>0,"message"=>"","data"=>"");
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, "http://www.tcmb.gov.tr/kurlar/today.xml");
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
		$response = curl_exec($ch);
		if ($response === false) {
			$return["status"]=0;
			$return["message"]=curl_error($ch);
			return $return;
			
		}
		curl_close($ch);
		$temp = array("dolar"=>"","euro"=>"");
		$data = $this->formatTcmbData((array)simplexml_load_string($response));
		$temp["dolar"]=$data["currencies"]["USD"]["BanknoteSelling"];
		$temp["euro"]=$data["currencies"]["EUR"]["BanknoteSelling"];;
		$return["status"]=1;
		$return["data"]=$temp;
		return $return;
	}
	private function formatTcmbData($data){
		$currencies = array();
		if (isset($data['Currency']) && count($data['Currency'])) {
			foreach ($data['Currency'] as $currency) {
				$currency     = (array)$currency;
				$currencyCode = $currency["@attributes"]["CurrencyCode"];
				/*if (in_array($currencyCode, $this->ignoredCurrencies)) {
					continue;
				}*/
				$currencies[$currencyCode] = array(
					self::TYPE_ALIS         => $currency[self::TYPE_ALIS] / $currency['Unit'],
					self::TYPE_EFEKTIFALIS  => $currency[self::TYPE_EFEKTIFALIS] / $currency['Unit'],
					self::TYPE_SATIS        => $currency[self::TYPE_SATIS] / $currency['Unit'],
					self::TYPE_EFEKTIFSATIS => $currency[self::TYPE_EFEKTIFSATIS] / $currency['Unit']
				);
			}
		}
		return array(
			'today'      => $data["@attributes"]["Tarih"],
			'currencies' => $currencies
		);
	}
	#endregion

	#region AYAR İŞLEMLERİ
	public function ayarGetData($sirketID,$userID,$yetki,$ayarAdi){
		$return = array("status"=>0,"message"=>"","data"=>array());
		if($yetki < $this->yetkiler["calisan"]){
            $return = array("status"=>0,"message"=>"Ayar istem yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"ayarGetData","kullanıcı tarafından yetkisiz ayar isteği geldi",$this->ipAdress);
            return $return;
        }
		$sql = "SELECT `ayarDegeri`  FROM `ayarlar` WHERE `sirketID` = $sirketID AND `ayarAdi` LIKE '$ayarAdi'";
		$data = $this->getSqlResult($sql);
		$return["data"]=$data;
		return $return;
	}
	public function ayarSetMailData($sirketID,$userID,$yetki,$mailAyar){
		if($yetki < $this->yetkiler["calisan"]){
            //$return = array("status"=>0,"message"=>"Ayar istem yetkiniz bulunmuyor","header"=>"Yetki Hatası","data"=>"");
            $this->log->alert($userID,"ayarSetMailData","kullanıcı tarafından yetkisiz ayar isteği geldi",$this->ipAdress);
            return;
        }
		$sql="SELECT COUNT(`ID`) FROM `ayarlar` WHERE `userID` = $userID AND `ayarAdi` LIKE \"mailAyar\";";

		$cnt = $this->countReturnInt($sql);
		$ayarJson = json_encode($mailAyar,TRUE);
		if($cnt==0){
			$sql="INSERT INTO `ayarlar` (`ID`, `sirketID`, `userID`, `ayarAdi`, `ayarDegeri`) VALUES (NULL, '$sirketID', '$userID', 'mailAyar', '$ayarJson');";
			$this->insertReturnID($sql);
		}
		if($cnt >0){
			$sql ="UPDATE `ayarlar` SET `ayarDegeri` = '$ayarJson' WHERE `ayarlar`.`userID` =$userID AND `ayarlar`.`ayarAdi` LIKE \"mailAyar\";";
			$this->updateReturnID($sql);
		}
	}

	#endregion
	public function takvimGetData($sirketID,$userID,$yetki,$start,$end){
		$return = array();
		if($yetki < $this->yetkiler["calisan"]){
            $return = array("status"=>0,"message"=>"Takvim yetkisiz istem","data"=>"");;
            $this->log->alert($sirketID,$userID,"takvimGetData","kullanıcı tarafından yetkisiz takvimGetData erişimi ($sirketID)(sifre:$userID)",$this->ipAdress);
			return $return;
        }
		$startDateTime = new DateTime($start);
		$startDate = $startDateTime->format('Y-m-d');

		$endDateTime = new DateTime($end);
		$endDate = $endDateTime->format('Y-m-d');
		
		$sql="SELECT
			`ID`,
			`teklifAdi`,
			`baslangicTarihi`,
			`bitisTarihi`,
			`uuid`,
            `icerik`,
            `durum`
		FROM
			`teklifler`
		WHERE
			`durum` BETWEEN 2 AND 3 AND `baslangicTarihi` BETWEEN '$startDate' AND '$endDate' 
			OR 
			`durum` BETWEEN 2 AND 3 AND `bitisTarihi` BETWEEN '$startDate' AND '$endDate';";
		
		//echo $sql;
		$data = $this->getAllSqlResults($sql);
		$newData=array();
		if(is_array($data)){
			
			foreach ($data as $key => $value) {
				
				$startTime = new DateTime($value["baslangicTarihi"]);
				$startDate = $startTime->format('Y-m-d');
				$endTime = new DateTime($value["bitisTarihi"]);
				$endTime->modify('+1 day'); // takvimde bitiş tarihini düzgün göstermek için 1 gün daha ekliyoruz
				$endDate = $endTime->format('Y-m-d');
				$url ='../../teklif/?uuid='.$value["uuid"];
				$onayColor = "#2835eb";
				$onayTextColor = "#000000";
				$kurulumTextColor = "#ffffff";
				$kurulumColor = "#aba7a7";
				if($value["durum"]=="2"){
					//beklemede
					$onayColor = "#fcbe03";
				}
				if($value["durum"]=="3"){
					//beklemede
					$onayColor = "#03fc35";
				}
				if($value["durum"]=="4"){
					//beklemede
					$onayColor = "#fc0303";
				}
				array_push($newData,array(
					"id"=>$value["ID"],
					"allDay"=>"true",
					"start"=>$startDate,
					"end"=>$endDate,
					"title"=>$value["teklifAdi"],
					"uuid"=>$value["uuid"],
					"url"=>$url,
					"color"=> $onayColor,
					"textColor"=>$onayTextColor
				));
				$icerik = json_decode($value["icerik"],1);
				//print_r($icerik);
				if($icerik["teklifIsKurulumBaslangic"]!=""){
					$startTime = new DateTime($icerik["teklifIsKurulumBaslangic"]);
					$startDate = $startTime->format('Y-m-d');
					$endTime = new DateTime($icerik["teklifIsKurulumBitis"]);
					$endTime->modify('+1 day'); // takvimde bitiş tarihini düzgün göstermek için 1 gün daha ekliyoruz
					$endDate = $endTime->format('Y-m-d');
					$url ='../../teklif/?uuid='.$value["uuid"];
					array_push($newData,array(
						"id"=>$value["ID"]."-kurulum",
						"allDay"=>"true",
						"start"=>$startDate,
						"end"=>$endDate,
						"title"=>$value["teklifAdi"],
						"uuid"=>$value["uuid"],
						"url"=>$url,
						"color"=> $kurulumColor,
						"textColor"=>$kurulumTextColor
					));
				}
				//"teklifIsKurulumBitis": "",
				//"teklifIsKurulumBaslangic": ""
				/*$data[$key]["allDay"]="true";
				$data[$key]["start"]=$startDate;
				$data[$key]["end"]=$endDate;
				$data[$key]["end"]=$value["ID"];
				$data[$key]["title"]=$value["teklifAdi"];*/
			}
		}
		else{
			$newData = array();
		}
		//$newData = array($startDate,$endDate,$sql);
		return $newData;

	}


	/*SELECT
    *    
FROM
    `masrafKarti`
WHERE
    `sirketID`=1 AND `ID` = 1*/


}


?>