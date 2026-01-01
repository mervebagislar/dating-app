<?php
namespace Workers;
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/credits.php");
include_once($_SERVER['DOCUMENT_ROOT'].'/libs/PHPMailer/src/Exception.php');
include_once($_SERVER['DOCUMENT_ROOT'].'/libs/PHPMailer/src/PHPMailer.php');
include_once($_SERVER['DOCUMENT_ROOT'].'/libs/PHPMailer/src/SMTP.php');
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;
//phpmailerException

use \PDO;
use \PDOException;
use \DateTime;
use Workers\logs as log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;

class mailWriter{


	#region Class Varaibles
        public $teklifData;
        public $mailTo;
        public $filter=1;
        public $template;
        public $templateFile;
        public $teklifSart=array();
        public $teklifVars=array(
                            "path"=>"",
                            "footerPath"=>"/assets/img/footer.jpg",
                            "dosyaAdi"=>"",
                            "paraSymbol"=>"₺",
                            "colorBlack"=>"000000",
                            "colorGrey"=>"918f8e",
                            "colorWhite"=>"FFFFFF",
                            "colorRed"=>"d12219",
                            "colorBordo"=>"b3251b",
                            "colorGreen"=>"43a82a",
                            "colorOrange"=>"f09126",
                            "colorYellow"=>"ffff66",
                            "colorBGBlue"=>"bfbfbf"
                        );
	#endregion

	function __construct(){
		array_push($this->teklifSart,"İş onayında  %50 ön ödeme İş bitiminden sonraki haftada tamamı NAKİT olarak tahsil edilecektir. ");
        array_push($this->teklifSart,"Tüm resmi daire izinleri harç vergi v.s ödemeler tarafınızdan yapılacaktır.");
        array_push($this->teklifSart,"İş tarihinden 3 gün önce iptal edilen sözleşmelerde MAGICBOX sözleşme tutarının %50 sini Fatura Eder. ");
        array_push($this->teklifSart,"İş tarihinde veya 3 güne kadar olan sözleşme iptallerinde MAGICBOX sözleşme tutarının tamamını Fatura Eder.");
        array_push($this->teklifSart,"İş süresince Kiralanan cihazların tahrip edilmesi, düşürülmesi, kırılması veya çalınması halinde MÜŞTERİ  cihazların  bedelini ödeyecektir. ");
        array_push($this->teklifSart,"Gerektiğinde cihazların gece emniyetini  MÜŞTERİ sağlayacaktır. ");
        array_push($this->teklifSart,"Teklifimiz, verildiği tarihten itibaren 3 (üç) hafta için geçerlidir.Bu zaman sonunda revize edilebilir.");
    }
    private function getUserDetails($sirketID,$userID,$yetki){
        $db = new database();
        $userData = $db->kullaniciMailBak($sirketID,$userID,$yetki);
        if($userData !=false){
            return $userData;
        }
        return false;
    }
    private function getMailTo($sirketID,$userID,$yetki,$calisanID){
               
        $db = new database();
        $acentaCalisanMail = $db->acentaCalisanMailBak($sirketID,$userID,$yetki,$calisanID);
        return $acentaCalisanMail;
    }
    private function sendMail($sirketID,$userData,$mailHeader,$mailBody,$MailTo,$dosyaAdi,$senderName="M.I.C.E.Teklif.com"){
        //var_dump($userData);
        
        $mailSecure = PHPMailer::ENCRYPTION_STARTTLS;
        if($userData["guvenlik"]=="starttls"){ $mailSecure=PHPMailer::ENCRYPTION_STARTTLS; }
        if($userData["guvenlik"]=="ssl"){ $mailSecure=PHPMailer::ENCRYPTION_SMTPS; }
        $mailHost =$userData["sunucu"];
        $smtpAuth = true;
        $mailUserName=$userData["kullanici"];
        $mailEmail = $userData["email"];
        $mailPaswd = $userData["sifre"];
        $mailSMTPport=$userData["port"];
        $mailFrom=$mailEmail;
        $allow_self_signed=true;
        if($userData["SelfSigned"]=="false"){ $allow_self_signed=false; }
        $verify_peer=false;
        if($userData["peer"]=="true"){ $verify_peer=true; }
        $mailerName=$senderName;
        $mailTo = $MailTo;

		try {
            $GLOBALS['deb']="";
            $return="";
			$mail = new PHPMailer(true);
			$mail->CharSet = 'UTF-8';
			$mail->Encoding = 'base64';
		 	$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
			$mail->isSMTP(); 
            $mail->Timeout       =   20;                                           //Send using SMTP
			$mail->Host       = $mailHost;                     //Set the SMTP server to send through
			$mail->SMTPAuth   = $smtpAuth;                                   //Enable SMTP authentication
			$mail->Username   = $mailUserName;                     //SMTP username
			$mail->Password   = $mailPaswd;    
			$mail->SMTPSecure = $mailSecure;
            $mail->Debugoutput = function($str, $level) {   $GLOBALS['deb'].=$str;  };
			$mail->Port       = $mailSMTPport;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
			$mail->SMTPOptions = array(
				'ssl' => array(
				'verify_peer' => $verify_peer,
				'verify_peer_name' => false,
				'allow_self_signed' => $allow_self_signed
				)
			); 
            $mail->setFrom($mailFrom, $mailerName);
			$mail->addAddress($mailTo); 
            $mail->isHTML(true);                                  //Set email format to HTML
            $mail->AddAttachment($_SERVER['DOCUMENT_ROOT']."/assets/teklifler/$sirketID/$dosyaAdi" , $dosyaAdi );
			$mail->Subject = $mailHeader;
			$mail->Body    = $mailBody;
			$mail->AltBody = "Yeni bir teklifiniz var!";
            $mail->send();
            $mail->SmtpClose();
			//echo "mail gönderildi";

			$return="Mail gönderimi Başarılı";
           /* $db = new database();
            $db->ayarSetMailData($sirketID,$userID,$yetki,$mailAyar);
			*///$return["data"]=$GLOBALS['deb'];
			
		} catch (Exception $e)
        {

			$return=$e->errorMessage();
        } 
        return $return;
        //return true;
    }
    private function yaziDuzelt($yazi){
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
            $yazi=str_replace("&amp;", "&",$yazi);

            
            
        }
        return $yazi;
    }
    private function createTemplateOne($teklifData,$filter=3){
       
        $return = "";
            //filter
            //1-Genel Toplamlı (ekipman başına detalı değil ses ışık görüntü başlıklarının toplamı)
            //2-detaylı fiyat
            //3-fiyatsız
        if($filter !=3){

        }
        $return.=$this->yaziDuzelt($teklifData["teklifAdi"]).' - Rev '.$teklifData["revizeNo"]."<br>";
        $return.="Gönderen: ".$this->yaziDuzelt($teklifData["icerik"]["teklifYazanAdi"])."<br>";
        if($teklifData["icerik"]["teklifAcentaCalisanAdi"]!=""){
            $return.="Kime: ".$this->yaziDuzelt($teklifData["icerik"]["teklifAcentaCalisanAdi"])."<br>";
        }
        $return.="Gelen teklifinizi görüntülemek ve değerlendirmek için lütfen aşağıdaki butona basınız.";
        return $return;
    
    }
    private function createFooter(){
        $return = "";
        //SÖZLEŞME ŞARTLARINI YERLEŞTİRİYORUZ
        foreach($this->teklifSart as $index=>$sartlar){
            
           
        }
        
        return $return;
    }
    private function createSocialLinks($sirketID,$userID,$yetki,$servername,$selectedTemplate){
        $footerFacebookLink="#";
        $footerTwitterLink="#";
        $footerLinkedinLink="#";
       $socialLinks ='<td width="33" align="center"><a href="'.$footerFacebookLink.'" target="_blank"><img src="https://'.$servername.'/assets/img/fb.jpg" alt="facebook" width="36" height="36" border="0" style="border-width:0; max-width:36px;height:auto; display:block; max-height:36px"></a></td>
         <td width="34" align="center"><a href="'.$footerTwitterLink.'" target="_blank"><img src="https://'.$servername.'/assets/img/tw.jpg" alt="twitter" width="36" height="36" border="0" style="border-width:0; max-width:36px;height:auto; display:block; max-height:36px"></a></td>
          <td width="33" align="center"><a href="'.$footerLinkedinLink.'" target="_blank"><img src="https://'.$servername.'/assets/img/in.jpg" alt="linkedin" width="36" height="36" border="0" style="border-width:0; max-width:36px;height:auto; display:block; max-height:36px"></a></td>';
        return $socialLinks;
    }
    private function createTeklifLink(){
        $varmi = "SELECT * FROM `teklifMusteriSayfasi` WHERE `teklifuuID` LIKE '".$this->teklifData["uuid"]."'";

        $ekle = "INSERT INTO `teklifMusteriSayfasi`(
            `ID`,
            `sirketID`,
            `userID`,
            `userName`,
            `mailTo`,
            `teklifID`,
            `teklifuuID`,
            `teklifAdi`,
            `teklifFiltresi`,
            `authToken`,
            `expration`,
            `teklifOnay`,
            `teklifOnayStatus`,
            `teklifOnayZamani`
        )
        VALUES(
            NULL,
            '".$this->teklifData["sirketID"]."',
            '".$this->teklifData["yazanID"]."',
            '".$this->yaziDuzelt($this->teklifData["icerik"]["teklifYazanAdi"])."',
            '".$this->mailTo."',
            '".$this->teklifData["ID"]."',
            '".$this->teklifData["uuid"]."',
            '".$this->teklifData["teklifAdi"]."',
            '$this->filter',
            '000000',
            NULL,
            '0',
            '0',
            NULL
        );";
        $update="UPDATE
            `teklifMusteriSayfasi`
        SET
            `mailTo` = '".$this->mailTo."',
            `teklifFiltresi` = '$this->filter',
            `teklifOnay` = '0'
        WHERE `teklifuuID` LIKE '".$this->teklifData["uuid"]."'";
        $db = new database();
        /*$count = $db->countReturnInt($varmi);
        if($count == 0){
           
        }
        else{
            $returnID =$db->teklifInsertMusteriSayfasi($varmi,$ekle);
        }*/
        $returnID =$db->teklifInsertMusteriSayfasi($varmi,$ekle,$update);
        return $returnID;
    }
    public function createMail($sirketID,$userID,$yetki,$teklifData,$mailSablon,$noMailTo="",$filter=1,$template=0){
        $this->template = $template;
        $this->filter = $filter;
        $this->teklifData = $teklifData["result"][0];
        $return =  array("status"=>0,"message"=>"","data"=>array());
        $userData = $this->getUserDetails($sirketID,$userID,$yetki);
        $mailTo="";
        if(isset($this->teklifData["calisanEposta"])){$mailTo = $this->teklifData["calisanEposta"];}
        else{
            if($noMailTo!=""){$mailTo =$noMailTo; }
        }
        if($userData == false){
            $mailButton = '
            <button aria-name= "mailAyarlari" id="mailAyarlari" class="btn btn-lg btn-info btn-block">
                <i class="fa-solid fa-gears mr-2"></i>
                <span id="mailAyarlariButtonGonder" class="yok">Mail Ayarları</span>
            </button>';
            $return["status"]=0;
            $return["message"]="Kullanıcı Eposta verisi bulunamadı. Lütfen Eposta ayarlarınızı yapınız<br>$mailButton";
            return $return;
        }
        if($mailTo == false || $mailTo =="" || $mailTo ==null){
            $return["status"]=-1;
            $return["message"]="Kayıtlı Eposta adresi bulunamadı. <br> Gönderilecek E-posta adresini giriniz";
            return $return;
        }
        $this->mailTo = $mailTo;
        if($this->template == 0){
            
           
        }
        $servername = $_SERVER['SERVER_NAME'];
        $weblink="https://$servername/gelenTeklif/?uuid=".$this->teklifData["uuid"];
        $mailBaslik="Yeni Bir Teklifiniz var!";
        $mailIcerik=$this->createTemplateOne($this->teklifData,$this->filter);
        $butonLink="https://$servername/gelenTeklif/?uuid=".$this->teklifData["uuid"];
        $buttonText="TEKLİFİ GÖR";
        $footerimageLink="#";
        $footerImage="";
        $footerLine1="Bu teklif yanlızca muhattabına gönderilmiştir ve hassas bilgi içerir";
        $footerLine2="Lütfen yönlendirmeyiniz";
        $footerLine3="Lütfen cevap vermeyiniz.";
        $socialLinks = $this->createSocialLinks($sirketID,$userID,$yetki,$servername,$mailSablon);
        $selectedTemplate=$mailSablon;
        include_once($_SERVER['DOCUMENT_ROOT']."/includes/mailTemplates/$mailSablon/index.php");
        $sayfaID = $this->createTeklifLink();
        if($sayfaID>0){
            $sendMail = $this->sendMail($sirketID,$userData,"Yeni Teklif Bildirimi ".$this->teklifData["teklifAdi"],$mailTemplate,$mailTo,$teklifData["dosyaAdi"]);
            $sendMail ="";
            $return =  array("status"=>1,"message"=>"","data"=>array("mailTo"=>$mailTo,"filter"=>$filter,"serverName"=>$servername,"mailStatus"=>$sendMail,"sayfaID"=>$sayfaID));

        }
        else{
            $return =  array("status"=>0,"message"=>"Onay sayfası işlenirken bir hata oluştu, E-posta gönderilemedi","data"=>array());
        }
        return $return;
       
    }
    public function testMail($sirketID,$userID,$yetki,$mailAyar){

        $return = array("status"=>0,"message"=>"","data"=>array());
        
        $mailSecure = PHPMailer::ENCRYPTION_STARTTLS;
        if($mailAyar["guvenlik"]=="starttls"){ $mailSecure=PHPMailer::ENCRYPTION_STARTTLS; }
        if($mailAyar["guvenlik"]=="ssl"){ $mailSecure=PHPMailer::ENCRYPTION_SMTPS; }
        $mailHost =$mailAyar["sunucu"];
        $smtpAuth = true;
        $mailUserName=$mailAyar["kullanici"];
        $mailEmail = $mailAyar["email"];
        $mailPaswd = $mailAyar["sifre"];
        $mailSMTPport=$mailAyar["port"];
        $mailFrom=$mailEmail;
        $allow_self_signed=true;
        if($mailAyar["SelfSigned"]=="false"){ $allow_self_signed=false; }
        $verify_peer=false;
        if($mailAyar["peer"]=="true"){ $verify_peer=true; }
        $mailerName="test mailer";
        $mailTo = $mailEmail;

		try {
            $GLOBALS['deb']="";
			$mail = new PHPMailer(true);
			$mail->CharSet = 'UTF-8';
			$mail->Encoding = 'base64';
			$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
			$mail->isSMTP(); 
            $mail->Timeout       =   20;                                           //Send using SMTP
			$mail->Host       = $mailHost;                     //Set the SMTP server to send through
			$mail->SMTPAuth   = $smtpAuth;                                   //Enable SMTP authentication
			$mail->Username   = $mailUserName;                     //SMTP username
			$mail->Password   = $mailPaswd;    
			$mail->SMTPSecure = $mailSecure;
            $mail->Debugoutput = function($str, $level) {   $GLOBALS['deb'].=$str;  };
			$mail->Port       = $mailSMTPport;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
			$mail->SMTPOptions = array(
				'ssl' => array(
				'verify_peer' => $verify_peer,
				'verify_peer_name' => false,
				'allow_self_signed' => $allow_self_signed
				)
			); 
            $mail->setFrom($mailFrom, $mailerName);
			$mail->addAddress($mailTo); 
            $mail->isHTML(true);                                  //Set email format to HTML
			$mail->Subject = 'Server Test Maili';
			$mail->Body    = " tebrikler <strong>test maili</strong> başarılı";
			$mail->AltBody = " tebrikler test maili başarılı";
            $mail->send();
            $mail->SmtpClose();
			//echo "mail gönderildi";
			$return["status"]=1;
			$return["message"]="Mail gönderimi Başarılı";
            $db = new database();
            $db->ayarSetMailData($sirketID,$userID,$yetki,$mailAyar);
			//$return["data"]=$GLOBALS['deb'];
			
		} catch (Exception $e)
        {
            $return["status"]=-1;
			$return["message"]="mail <strong>gönderilemedi</strong>! Test Başarısız.";
			$return["data"]=$e->errorMessage();
        } 
        return $return;
    }
    public function creareAuthMail($musteriEposta,$ID,$gonderen,$token,$teklifUUID,$mailSablon=1){
        //sendAuthMail(, $mailHeader,$mailBody);
        //$this->template = $template;
        $servername = $_SERVER['SERVER_NAME'];
        $weblink="https://$servername/gelenTeklif/?uuid=".$teklifUUID;
        $mailBaslik="Kodunuz:<strong>$token</strong>";
        $butonLink="https://$servername/gelenTeklif/?uuid=".$teklifUUID;
        $buttonText="TEKLİFE GİT";
        $mailIcerik="Bu teklif yanlızca muhattabına gönderilmiştir ve hassas bilgi içerir lütfen doğrulama kodunuzu kimseyle paylaşmayınız.";
        //$buttonText="TEKLİFİ GÖR";
        $footerimageLink="#";
        $footerImage="https://$servername/assets/img/logo.jpg";
        $footerLine3="";
        $footerLine1="Lütfen yönlendirmeyiniz";
        $footerLine2="E-postaya cevap vermeyiniz.";
        $socialLinks = $this->createSocialLinks(0,0,0,$servername,$mailSablon);
        $selectedTemplate=$mailSablon;
        include_once($_SERVER['DOCUMENT_ROOT']."/includes/mailTemplates/$mailSablon/index.php");
        $sendMail = $this->sendAuthMail($musteriEposta,$ID,"Teklif doğrulama kodunuz",$mailTemplate);
        
        return $sendMail;
        
    }
    public function sendAuthMail($mailTo,$authFor,$mailHeader,$mailBody){
        $mailSecure = PHPMailer::ENCRYPTION_STARTTLS;
        
        $mailHost ="192.168.2.105";
        $smtpAuth = true;
        $mailUserName="dogrulama@miceteklif.com";
        $mailEmail = "dogrulama@miceteklif.com";
        $mailPaswd = "gora0754Cem!";
        $mailSMTPport="587";
        $mailFrom=$mailEmail;
        $allow_self_signed=true;
        $verify_peer=false;
        $mailerName="MICE Teklif Doğrulama Maili";
        

		try {
            $GLOBALS['deb']="";
            $return="";
			$mail = new PHPMailer(true);
			$mail->CharSet = 'UTF-8';
			$mail->Encoding = 'base64';
		 	$mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
			$mail->isSMTP(); 
            $mail->Timeout       =   20;                                           //Send using SMTP
			$mail->Host       = $mailHost;                     //Set the SMTP server to send through
			$mail->SMTPAuth   = $smtpAuth;                                   //Enable SMTP authentication
			$mail->Username   = $mailUserName;                     //SMTP username
			$mail->Password   = $mailPaswd;    
			$mail->SMTPSecure = $mailSecure;
            $mail->Debugoutput = function($str, $level) {   $GLOBALS['deb'].=$str;  };
			$mail->Port       = $mailSMTPport;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`
			$mail->SMTPOptions = array(
				'ssl' => array(
				'verify_peer' => $verify_peer,
				'verify_peer_name' => false,
				'allow_self_signed' => $allow_self_signed
				)
			); 
            $mail->setFrom($mailFrom, $mailerName);
			$mail->addAddress($mailTo); 
            $mail->isHTML(true);                                  //Set email format to HTML
			$mail->Subject = $mailHeader;
			$mail->Body    = $mailBody;
			$mail->AltBody = "MICE Teklif Doğrulama Kodunuz";
            $mail->send();
            $mail->SmtpClose();
			//echo "mail gönderildi";

			$return=TRUE;
           /* $db = new database();
            $db->ayarSetMailData($sirketID,$userID,$yetki,$mailAyar);
			*///$return["data"]=$GLOBALS['deb'];
			
		} catch (Exception $e)
        {

			$return=FALSE;
        } 
        return $return;
        //return true;








    }
}