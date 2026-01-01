<?php
namespace Workers;
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/credits.php");

use \PDO;
use \PDOException;
use \DateTime;
use \Exception;
use \DateInterval;
use Workers\logs as log;
class musteriDatabase{

	#region Class Varaibles
	private $dbname;
	private $dbuser;
	private $dbpass;
	private $dbhost;
	public $dbc;
	private $log;
	private $ipAdress="*";
	private $loginSuresi=24;
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

	#endregion

	function __construct(){
		$this->log = new log;
		$this->ipAdress = getUserIP();
		$dbCredit = dbCredits();
		$this->dbname =$dbCredit["dbname"];
		$this->dbuser =$dbCredit["dbuser"];
		$this->dbpass =$dbCredit["dbpass"];
		$this->dbhost =$dbCredit["host"];
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
    public function noUse($sirketID,$userID,$yetki){
		$return = array("status"=>1,"message"=>"","header"=>"","data"=>"");
		$sql = "";
        $id = $this->insertReturnID($sql);
        $this->log->info($sirketID,$userID,"ekipmanEkle","(id:) -  envantere eklendi.",$this->ipAdress);
		return $return;
		
	}
	private function authTokenOlustur($teklifSayfaID){

		$token = rand(100000, 999999);
		$today = new DateTime();
		$expire =$today->add(new DateInterval('P1D'));
		//$expire = new DateTime('tomorrow');
		$expireFormatted= $expire->format('Y-m-d H:i:s');
		$sql ="UPDATE `teklifMusteriSayfasi` SET `authToken` = '$token', `expration` = '$expireFormatted' WHERE `teklifMusteriSayfasi`.`ID` = $teklifSayfaID;";
		$returnID = $this->updateReturnID($sql,$teklifSayfaID);
		if($returnID==0){$token=0;}
		return $token;
	}
	private function teklifVeriBul($query,$filter){
		 /*
            filter
            1-Genel Toplamlı (ekipman başına detalı değil ses ışık görüntü başlıklarının toplamı)
            2-detaylı fiyat
            3-fiyatsız

            template
            1-kongre
            2-mice
            3-setur
        */
		$return = array("status"=>0,"message"=>"","data"=>array());
		
		$searchFor="uuid";
		$sql = "SELECT
			*
		FROM
			`teklifler`
		WHERE
			`teklifler`.`ID` LIKE '$query';";
		$result = $this->getSqlResult($sql);
		if($result){
			$teklifIcerik=json_decode($result["icerik"],TRUE);
			if($filter == 3){
				$teklifIcerik["teklifKDV"]=NULL;
				$teklifIcerik["teklifIndirim"]=NULL;
				$teklifIcerik["teklifAnaToplam"]=NULL;
				$teklifIcerik["teklifAraToplam"]=NULL;
			}
			$islenmisSonuc= array();
			foreach($teklifIcerik["teklifIcerik"] as $veri){
				if($filter == 1 || $filter == 3){
					$veri["salonIndirim"]=NULL;
					$veri["salonAraFiyat"]=NULL;
					$veri["salonFinalFiyat"]=NULL;
					$islenmisGrup= array();
					foreach($veri["hizmetGrupFiyatlari"] as $grupFiyat){
						$grupFiyat["grupToplam"]=NULL;
						array_push($islenmisGrup,$grupFiyat);
					}
					$veri["hizmetGrupFiyatlari"] = $islenmisGrup;
					$islenmisHizmet= array();
					foreach($veri["icerik"] as $hizmetFiyat){
						$hizmetFiyat["hizmetFiyati"]=NULL;
						$hizmetFiyat["hizmetToplam"]=NULL;
						array_push($islenmisHizmet,$hizmetFiyat);
					}
					$veri["icerik"]=$islenmisHizmet;
					$veri["hizmetGrupFiyatlari"] = $islenmisGrup;
				}
				//$veri["ekip"]=json_decode($veri["ekip"],TRUE);
				//$veri["icerik"]=$teklifIcerik;
				array_push($islenmisSonuc,$veri);
			}
			$teklifIcerik["teklifIcerik"] = $islenmisSonuc;
			$return["result"]=$teklifIcerik;
			$return["status"]=1;
			return $return;
		}
		else{
			$return["message"]="Teklif için kayıtlı veri bulunamadı...";
		}
		return $return;
	}
	#endregion

    #region KULLANICI İŞLEMLERİ

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
            setcookie("userID", $veri["ID"], time()+($this->loginSuresi*3600),'/');
            setcookie("yetki", $veri["kullaniciYetki"], time()+($this->loginSuresi*3600),'/');
            setcookie("kullaniciAdi", $veri["kullaniciAdi"], time()+($this->loginSuresi*3600),'/');
            setcookie("sirketID", $veri["sirketID"], time()+($this->loginSuresi*3600),'/');
            $this->log->info($veri["sirketID"],$veri["ID"],"login","$email ile başarılı giriş yapıldı.",$this->ipAdress);
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



	public function epostaDogrulama($musteriEposta,$teklifUUID,$tekrarYolla=FALSE){
		$musteriEposta = htmlspecialchars(strtolower(trim($musteriEposta)), ENT_QUOTES); 
		$teklifUUID = htmlspecialchars(strtolower(trim($teklifUUID)), ENT_QUOTES); 
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"");
		$sql = "SELECT * FROM `teklifMusteriSayfasi` WHERE `mailTo` LIKE '$musteriEposta' AND `teklifuuID` LIKE '$teklifUUID'";
		$rawData = $this->getSqlResult($sql);
		$mailStatus=NULL;
		if($rawData){ 
			
			if($rawData["authToken"] == 0 || $tekrarYolla==TRUE){
				 
				$token = $this->authTokenOlustur($rawData["ID"]);
				if($token== 0){
					$return["status"]=0;
					$return["header"]="Hata!";
					$return["message"]="Doğrulama kodu oluşturulurken hata oluştu...";
					return $return;
				}
				$gonderen = $rawData["userName"];
				//token'ı mail ile gönder hata verirse işleme devam etme
				//$mailHeader = "Doğrulama Kodunuz";
				//$mailBody= $gonderen.' tarafından gönderilen Teklifi görüntülemek için doğrulama kodunuz:<strong>'.$token.'</strong>. <br>Bu kod 24 saat boyunca geçerli kalacaktır.<br> lütfen başkalarıyla paylaşmayınız.';
				$mailer = new mailWriter();
				//$mailStatus = $mailer->sendAuthMail($musteriEposta,$rawData["ID"],$mailHeader,$mailBody);
				$mailStatus = $mailer->creareAuthMail($musteriEposta,$rawData["ID"],$gonderen,$token,$teklifUUID,$mailSablon=1);

				if($mailStatus!=TRUE){
					$return["status"]=0;
					$return["header"]="Hata!";
					$return["message"]="Doğrulama kodu gönderilirken bir hata oluştu...";
					return $return; 
				}
			}
			setcookie("musteriMail", $musteriEposta, time()+($this->loginSuresi*3600),'/');
			setcookie("teklifSayfaID", $rawData["ID"], time()+($this->loginSuresi*3600),'/');

			
			$return["status"]=1;
			$return["data"]=$mailStatus;
			return $return; 
		}
		else{ 
			$return["status"]=0;
			$return["header"]="Hata!";
			$return["message"]="Üzgünüz aradığınız kriterlede E-postanıza kayıtlı bir teklif bulamadık...";
			setcookie("musteriMail", "", time()-($this->loginSuresi*3600),'/');
			setcookie("teklifSayfaID", "", time()-($this->loginSuresi*3600),'/');
			setcookie("musteriAuth", "", time()-($this->loginSuresi*3600),'/');
			$this->log->notice("-2","musteriEpostaDogrulama","kullanıcı tarafından yetkisiz E-postanıza kod isteği geldi",$this->ipAdress);
			return $return; 
		}
	}
	public function kodDogrulama($musteriEposta,$teklifUUID,$kod){
		$musteriEposta = htmlspecialchars(strtolower(trim($musteriEposta)), ENT_QUOTES); 
		$teklifUUID = htmlspecialchars(strtolower(trim($teklifUUID)), ENT_QUOTES); 
		$kod = htmlspecialchars(strtolower(trim($kod)), ENT_QUOTES); 
		$return = array("status"=>0,"message"=>"","header"=>"","data"=>"","debug"=>"");
		$sql = "SELECT `ID`,`teklifFiltresi`,`authToken`,`expration`,`teklifOnay`,`teklifOnayStatus`,`teklifID` FROM `teklifMusteriSayfasi` WHERE `mailTo` LIKE '$musteriEposta' AND `teklifuuID` LIKE '$teklifUUID'";
		$teklifMusteriVeri = $this->getSqlResult($sql);
		if($teklifMusteriVeri){
			
			if($teklifMusteriVeri["authToken"]==$kod){
				if($teklifMusteriVeri["expration"]> date("Y-m-d H:s:i")){

					//$return["status"]=1;
					//$return["data"]=$teklifMusteriVeri;
					//$return["debug"].="stage 1\r\n";
					setcookie("musteriAuth", $teklifMusteriVeri["authToken"], time()+($this->loginSuresi*3600),'/');
					$return = $this->teklifVeriBul($teklifMusteriVeri["teklifID"],$teklifMusteriVeri["teklifFiltresi"]);
					
				}
				else{
					$return["status"]=0;
					$return["header"]="Doğrulama E-postanız tekrar gönderildi!";
					$return["message"]="Girdiğiniz güvenlik kodunun süresi dolmuş. Lütfen E-postanıza gönderdiğimiz yeni kodu kullanarak giriş yapınız";
					$return["debug"].="stage 2\r\n";
					$gonderen = $teklifMusteriVeri["userName"];
					$token = $this->authTokenOlustur($teklifMusteriVeri["ID"]);
					$mailHeader = "Doğrulama Kodunuz";
					$mailBody= $gonderen.' tarafından gönderilen Teklifi görüntülemek için doğrulama kodunuz:<strong>'.$token.'</strong>. <br>Bu kod 24 saat boyunca geçerli kalacaktır.<br> lütfen başkalarıyla paylaşmayınız.';
					$mailer = new mailWriter();
					$mailStatus = $mailer->sendAuthMail($musteriEposta,$teklifMusteriVeri["ID"],$mailHeader,$mailBody);
					if($mailStatus==FALSE){
						$return["status"]=0;
						$return["header"]="Hata!";
						$return["message"]="Doğrulama kodu gönderilirken bir hata oluştu...";
						$return["debug"].="stage 3\r\n";
					}
					
					
				}
				return $return; 
			}

			$return["status"]=0;
			$return["header"]="Başarısız Doğrulama!";
			$return["message"]="Girdiğiniz kod E-posta ile gönderilen kod ile uyuşmuyor. Lütfen girdiğiniz kodu kontrol ediniz.";
			$return["debug"].="stage 4 SAT:".$teklifMusteriVeri["authToken"]." MAT:$kod \r\n";
			$this->log->notice("-2","musteriKodDogrulama","kullanıcı tarafından yanlış doğrulama kodu girildi gelen kod:$kod  -- istenen kod:".$teklifMusteriVeri["authToken"],$this->ipAdress);
			return $return; 
		}
		else{
			$return["status"]=0;
			$return["header"]="Hata!";
			$return["message"]="Üzgünüz, aradığınız kriterlede E-postanıza kayıtlı bir teklif bulamadık...";
			$return["debug"].="stage 5\r\n";
			$this->log->notice("-2","musteriKodDogrulama","kullanıcı tarafından yetkisiz kod doğrulama isteği geldi",$this->ipAdress);
			return $return; 
		} 
	}
    #endregion
}


?>