<?php
namespace Workers;
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/genelFonksiyonlar.php");
include_once($_SERVER['DOCUMENT_ROOT']."/includes/credits.php");

use \PDO;
use \PDOException;
use \DateTime;
use Workers\logs as log;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;

class excelwriter{


	#region Class Varaibles
        public $teklifData;
        public $filter=1;
        public $template;
        public $templateFile;
        public $teklifSart=array();
        public $teklifVars=array(
                            "path"=>"",
                            "footerPath"=>"/assets/img/footer.jpg",
                            "dosyaAdi"=>"",
                            "paraSymbol"=>"₺",
                            "fill"=>\PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                            "colorBlack"=>"000000",
                            "colorGrey"=>"918f8e",
                            "colorWhite"=>"FFFFFF",
                            "colorRed"=>"d12219",
                            "colorBordo"=>"b3251b",
                            "colorGreen"=>"43a82a",
                            "colorOrange"=>"f09126",
                            "colorYellow"=>"ffff66",
                            "colorBGBlue"=>"bfbfbf",
                            "sagaYasla"=>\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_RIGHT,
                            "solaYasla"=>\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
                            "ortala"=>\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                            "dikeyOrtala"=>\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                            "styleArray"=>array(
                                'font'  => array(
                                    'bold'  => true,
                                    'color' => array('rgb' => '000000'),
                                    'size'  => 9.1,
                                    'name'  => 'Tahoma'
                                )),
                            "SETURstyleArray"=>array(
                                'font'  => array(
                                    'bold'  => true,
                                    'color' => array('rgb' => '000000'),
                                    'size'  => 10,
                                    'name'  => 'Tahoma'
                                ))
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
    private function createTemplateOne($spreadsheet){
       
            //filter
            //1-Genel Toplamlı (ekipman başına detalı değil ses ışık görüntü başlıklarının toplamı)
            //2-detaylı fiyat
            //3-fiyatsız
        
        //aktif sheet seçiliyor
        $worksheet = $spreadsheet->getActiveSheet();
        #region TEKLİF GENEL BİLGİLERİ
        //TEKLİF TARİHLERİNİ FORMATLIYORUZ
        $date=date_create($this->teklifData["icerik"]["teklifIsBaslangic"]);
        $teklifisbaslangic= date_format($date,"d.m.Y");
        $date=date_create($this->teklifData["icerik"]["teklifIsBitis"]);
        $teklifisbitis= date_format($date,"d.m.Y");
        $teklifTarihi = "$teklifisbaslangic - $teklifisbitis";
        $date=date_create($this->teklifData["icerik"]["teklifIsKurulumBaslangic"]);
        $teklifkurulumbaslangic= date_format($date,"d.m.Y");
        $date=date_create($this->teklifData["icerik"]["teklifIsKurulumBitis"]);
        $teklifkurulumbitis= date_format($date,"d.m.Y");
        $kurulumTarihi = "$teklifkurulumbaslangic - $teklifkurulumbitis";
        //TEKLİF SON FİYATLARI AYARLIYORUZ
        $geneltoplam =  $this->teklifData["icerik"]["teklifAnaToplam"];
        $genelIndirim = $this->teklifData["icerik"]["teklifIndirim"];
        $paraSymbol = $this->teklifVars["paraSymbol"];

        //genel bilgileri dolduruyoruz
        $acentaBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAcentaAdi"]);
        if($this->teklifData["icerik"]["teklifAcentaCalisanAdi"]!=""){
            $acentaBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAcentaAdi"])."-".$this->teklifData["icerik"]["teklifAcentaCalisanAdi"];
        }
        $isBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAdi"])."(rev".$this->teklifData["revizeNo"]." )";
        if($this->teklifData["icerik"]["teklifLokasyon"]!=""){
            $isBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifLokasyon"]."-".$this->teklifData["icerik"]["teklifAdi"])."(rev".$this->teklifData["revizeNo"]." )";
        }
        $worksheet->getCell('G2')->setValue(date("d.m.Y"));
        $worksheet->getCell('D4')->setValue($acentaBaslik);
        $worksheet->getCell('D5')->setValue($isBaslik);
        $worksheet->getCell('D6')->setValue("Kurulum Tarihi : $kurulumTarihi");
        $worksheet->getCell('D7')->setValue("Etkinlik Tarihi : $teklifTarihi");
        #endregion

        #region TOPLAM FİYATLAR
        //filtre "fiyatsız" değilse toplam fiyatları yazdırıyoruz
        if($this->filter!=3){
            //indirimden sonraki rakamı hesaplıyoruz
            $aratoplam = $geneltoplam-$genelIndirim;
            $KDV = ($aratoplam/100)*20;
            $KDVDahil = $geneltoplam+$KDV;
            //İNDİRİM VARSA YAZDIRIYORUZ
            if($genelIndirim != 0){
                $KDVDahil = $aratoplam+$KDV;
                $worksheet->getCell('H5')->setValue(number_format($genelIndirim, 0, ',', '.')." $paraSymbol");
                $worksheet->getCell('H6')->setValue(number_format($aratoplam, 0, ',', '.')." $paraSymbol");
            }
            else{
                $worksheet->getCell('E5')->setValue("");
                $worksheet->getCell('E6')->setValue("");
            }
            $worksheet->getCell('H4')->setValue(number_format($geneltoplam, 0, ',', '.')." $paraSymbol"); 
            $worksheet->getCell('H7')->setValue(number_format($KDV, 0, ',', '.')." $paraSymbol");
            $worksheet->getCell('H8')->setValue(number_format($KDVDahil, 0, ',', '.')." $paraSymbol");
        }
        //eğer fiyatsız teklif isteniyorsa genel toplam başlıklarını siliyoruz
        if($this->filter==3){
            $worksheet->getCell('E4')->setValue("");
            $worksheet->getCell('E5')->setValue("");
            $worksheet->getCell('E6')->setValue("");
            $worksheet->getCell('E7')->setValue("");
            $worksheet->getCell('E8')->setValue("");
            
        }
        #endregion
        $startB = 10;
        
        #region TEKLİF SALON BİLGİLERİ
        foreach($this->teklifData["icerik"]["teklifIcerik"] as $index=>$salon){
            $ekipmanSayısı = count($salon["icerik"]);
            //SALONDA EKİPMAN VARSA SALONU YAZDIRIYORUZ
            if($ekipmanSayısı>0){
               
                //SALON BAŞLIĞINI ATIYORUZ
                $worksheet->mergeCells('B'.$startB.':H'.$startB);
                $worksheet->getStyle('B'.$startB.':H'.$startB)->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorOrange"]);
                $worksheet->getStyle('B'.$startB)->getFont()->getColor()->setARGB($this->teklifVars["colorWhite"]);
                $salonAdi = $this->yaziDuzelt($salon["salonAdi"]);
                $worksheet->getCell('B'.$startB)->setValue($salonAdi);
                $worksheet->getStyle('B'.$startB.':F'.$startB)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                $startB++;
                //SALON DÜZENİNİ AYARLIYORUZ
                $worksheet->getStyle("B$startB:H$startB")->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorOrange"]);
                $worksheet->getStyle("B$startB:H$startB")->getFont()->getColor()->setARGB($this->teklifVars["colorWhite"]);
                $worksheet->mergeCells("C$startB:D$startB");
                $worksheet->getCell("B$startB")->setValue("No");
                $worksheet->getCell("C$startB")->setValue("Açıklama");
                $worksheet->getCell("E$startB")->setValue("Adet");
                $worksheet->getCell("F$startB")->setValue("Birim Fiyat");
                $worksheet->getCell("G$startB")->setValue("Gün");
                $worksheet->getCell("H$startB")->setValue("Tutar");
                $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                $startB++;
                //SALON İÇERİĞİ YAZDIRIYORUZ
                foreach($salon["icerik"] as $salonIndex=>$icerik){
                    //print_r($icerik);
                    $hizmetAdi = $this->yaziDuzelt($icerik["hizmetAdi"]);
                    $adet = $icerik["adet"];
                    $gun = $icerik["gunSayisi"];
                    $birimFiyat=number_format($icerik["hizmetFiyati"], 0, ',', '.')." $paraSymbol";
                    $hizmetToplam=number_format($icerik["hizmetToplam"], 0, ',', '.')." $paraSymbol";
                    $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                    $worksheet->mergeCells("C$startB:D$startB");
                    $worksheet->getStyle("B$startB:H$startB")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                    $worksheet->getCell("B$startB")->setValue($salonIndex+1);
                    $worksheet->getStyle("C$startB")->getAlignment()->setHorizontal($this->teklifVars["solaYasla"]);
                    $worksheet->getCell("C$startB")->setValue($hizmetAdi);
                    $worksheet->getCell("E$startB")->setValue($adet);
                    $worksheet->getCell("G$startB")->setValue($gun);
                    if($this->filter==2){ 
                        $worksheet->getCell("F$startB")->setValue($birimFiyat);
                        $worksheet->getCell("H$startB")->setValue($hizmetToplam);
                    }
                    
                    $startB++;
    
                }
                $startB++;
            }
        }
        #endregion

        $startB++;
        #region TEKLİF FOOTER
        $spreadsheetReturn=$this->createFooter($spreadsheet,$startB);
        return $spreadsheetReturn;
    
    }
    private function createTemplateTwo($spreadsheet){
        

        //aktif sheet seçiliyor
        $worksheet = $spreadsheet->getActiveSheet();
        #region TEKLİF GENEL BİLGİLERİ
        //TEKLİF TARİHLERİNİ FORMATLIYORUZ
        $date=date_create($this->teklifData["icerik"]["teklifIsBaslangic"]);
        $teklifisbaslangic= date_format($date,"d.m.Y");
        $date=date_create($this->teklifData["icerik"]["teklifIsBitis"]);
        $teklifisbitis= date_format($date,"d.m.Y");
        $teklifTarihi = "$teklifisbaslangic - $teklifisbitis";
        $date=date_create($this->teklifData["icerik"]["teklifIsKurulumBaslangic"]);
        $teklifkurulumbaslangic= date_format($date,"d.m.Y");
        $date=date_create($this->teklifData["icerik"]["teklifIsKurulumBitis"]);
        $teklifkurulumbitis= date_format($date,"d.m.Y");
        $kurulumTarihi = "$teklifkurulumbaslangic - $teklifkurulumbitis";
        //TEKLİF SON FİYATLARI AYARLIYORUZ
        $geneltoplam =  $this->teklifData["icerik"]["teklifAnaToplam"];
        $genelIndirim = $this->teklifData["icerik"]["teklifIndirim"];
        $paraSymbol = $this->teklifVars["paraSymbol"];

        //genel bilgileri dolduruyoruz
        $acentaBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAcentaAdi"]);
        if($this->teklifData["icerik"]["teklifAcentaCalisanAdi"]!=""){
            $acentaBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAcentaAdi"])."-".$this->teklifData["icerik"]["teklifAcentaCalisanAdi"];
        }
        $isBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAdi"])."(rev".$this->teklifData["revizeNo"]." )";
        if($this->teklifData["icerik"]["teklifLokasyon"]!=""){
            $isBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifLokasyon"]."-".$this->teklifData["icerik"]["teklifAdi"])."(rev".$this->teklifData["revizeNo"]." )";
        }
        $worksheet->getCell('H2')->setValue($this->yaziDuzelt(date("d.m.Y")));
        $worksheet->getCell('D4')->setValue($acentaBaslik);
        $worksheet->getCell('D5')->setValue($isBaslik);
        $worksheet->getCell('D6')->setValue("Kurulum Tarihi : $kurulumTarihi");
        $worksheet->getCell('D7')->setValue("Etkinlik Tarihi : $teklifTarihi");
        #endregion

        #region TOPLAM FİYATLAR
        //filtre "fiyatsız" değilse toplam fiyatları yazdırıyoruz
        if($this->filter!=3){
            //indirimden sonraki rakamı hesaplıyoruz
            $aratoplam = $geneltoplam-$genelIndirim;
            $KDV = ($aratoplam/100)*20;
            $KDVDahil = $geneltoplam+$KDV;
            //İNDİRİM VARSA YAZDIRIYORUZ
            if($genelIndirim != 0){
                $KDVDahil = $aratoplam+$KDV;
                $worksheet->getCell('H5')->setValue(number_format($genelIndirim, 0, ',', '.')." $paraSymbol");
                $worksheet->getCell('H6')->setValue(number_format($aratoplam, 0, ',', '.')." $paraSymbol");
            }
            else{
                $worksheet->getCell('F5')->setValue("");
                $worksheet->getCell('E6')->setValue("");
            }
            $worksheet->getCell('H4')->setValue(number_format($geneltoplam, 0, ',', '.')." $paraSymbol"); 
            $worksheet->getCell('H7')->setValue(number_format($KDV, 0, ',', '.')." $paraSymbol");
            $worksheet->getCell('H8')->setValue(number_format($KDVDahil, 0, ',', '.')." $paraSymbol");
        }
        //eğer fiyatsız teklif isteniyorsa genel toplam başlıklarını siliyoruz
        if($this->filter==3){
            $worksheet->getCell('F4')->setValue("");
            $worksheet->getCell('F5')->setValue("");
            $worksheet->getCell('E6')->setValue("");
            $worksheet->getCell('F7')->setValue("");
            $worksheet->getCell('F8')->setValue("");
        }
        $worksheet->getCell('D9')->setValue(date("Y"));
        #endregion
        $startB = 11;
       
        foreach($this->teklifData["icerik"]["teklifIcerik"] as $index=>$salon){
            $ekipmanSayısı = count($salon["icerik"]);
            if($ekipmanSayısı>0){
                 //SALON BAŞLIĞINI ATIYORUZ
                 $worksheet->mergeCells('B'.$startB.':H'.$startB);
                 $worksheet->getStyle('B'.$startB.':H'.$startB)->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorOrange"]);
                 $worksheet->getStyle('B'.$startB)->getFont()->getColor()->setARGB($this->teklifVars["colorWhite"]);
                 $salonAdi = $this->yaziDuzelt($salon["salonAdi"]);
                 $worksheet->getCell('B'.$startB)->setValue($salonAdi);
                 $worksheet->getStyle('B'.$startB.':F'.$startB)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                 $startB++;
                 //SALON DÜZENİNİ AYARLIYORUZ
                 $worksheet->getStyle("B$startB:H$startB")->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorOrange"]);
                 $worksheet->getStyle("B$startB:H$startB")->getFont()->getColor()->setARGB($this->teklifVars["colorWhite"]);
                 $worksheet->getStyle("B$startB:H$startB")->getFont()->setBold(true);
                 $worksheet->mergeCells("C$startB:D$startB");
                 $worksheet->getCell("B$startB")->setValue("No");
                 $worksheet->getCell("C$startB")->setValue("Açıklama");
                 $worksheet->getStyle("E$startB:H$startB")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                 $worksheet->getCell("E$startB")->setValue("Adet/m2");
                 $worksheet->getCell("F$startB")->setValue("Birim Fiyat");
                 $worksheet->getCell("G$startB")->setValue("Gün");
                 $worksheet->getCell("H$startB")->setValue("Tutar");
                 $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                 $startB++;
                 //SALON İÇERİĞİ YAZDIRIYORUZ
                foreach($salon["hizmetGrupFiyatlari"] as $index=>$grup){
                    $grupID = $grup["grupID"];
                    $worksheet->mergeCells("B$startB:H$startB");
                    $worksheet->getStyle("B$startB")->getFont()->setBold(true);
                    $worksheet->getStyle("B$startB:H$startB")->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorYellow"]);
                    $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                    $worksheet->getStyle("B$startB:H$startB")->getFont()->getColor()->setARGB($this->teklifVars["colorBlack"]);
                    $worksheet->getCell("B$startB")->setValue($this->yaziDuzelt($grup["grupAdi"]));
                    $startB++;
                    $virtualIndex = 0;
                    $groupStart = $startB;
                    $grupBirimFiyatı = 0;
                    foreach($salon["icerik"] as $ind=>$hizmet){
                        if($hizmet["hizmetGrupID"]==$grupID){
                            $virtualIndex++;
                            $worksheet->mergeCells("C$startB:D$startB");
                            $worksheet->getStyle("B$startB:H$startB")->getFont()->setBold(true);
                            $worksheet->getCell("B$startB")->setValue($this->yaziDuzelt($virtualIndex));
                            $worksheet->getCell("C$startB")->setValue($this->yaziDuzelt($hizmet["hizmetAdi"]));
                            $worksheet->getStyle("E$startB:H$startB")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                            $worksheet->getCell("E$startB")->setValue($this->yaziDuzelt($hizmet["adet"]));
                            //if($this->filter==2){$worksheet->getCell("F$startB")->setValue($hizmet["hizmetFiyati"]." $paraSymbol");}
                            $worksheet->getCell("G$startB")->setValue($this->yaziDuzelt($hizmet["gunSayisi"]));
                            $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                            //$grupCellEnd=$startB;
                            $grupBirimFiyatı +=$hizmet["hizmetFiyati"];
                            $startB++;

                        }
                    } 
                    $groupEnd=$startB-1;
                    //Eğer filtre detaylı liste değilse birim fiyat ve toplam fiyat kısımlarını birleştiriyoruz
                   // if($this->filter!=2){
                        $worksheet->mergeCells("F$groupStart:F$groupEnd"); 
                        $worksheet->mergeCells("H$groupStart:H$groupEnd");
                        $worksheet->getStyle("F$groupStart:F$groupEnd")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                        $worksheet->getStyle("F$groupStart:F$groupEnd")->getAlignment()->setVertical($this->teklifVars["dikeyOrtala"]);
                        $worksheet->getStyle("H$groupStart:H$groupEnd")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                        $worksheet->getStyle("H$groupStart:H$groupEnd")->getAlignment()->setVertical($this->teklifVars["dikeyOrtala"]);
                    //}
                    //Grup toplam fiyatınız yazdırıyoruz
                    if($this->filter==2){
                        
                        $worksheet->getCell("H$groupStart")->setValue(number_format($grup["grupToplam"], 0, ',', '.')." $paraSymbol");
                        $worksheet->getCell("F$groupStart")->setValue(number_format($grupBirimFiyatı, 0, ',', '.')." $paraSymbol");
                    }
                }
            }

        }

        $startB++;
        #region TEKLİF FOOTER

        
        $spreadsheetReturn=$this->createFooter($spreadsheet,$startB);
        return $spreadsheetReturn;
    
    }
    private function createTemplateTree($spreadsheet){
        

        //aktif sheet seçiliyor
        $worksheet = $spreadsheet->getActiveSheet();
        
        #region TEKLİF GENEL BİLGİLERİ
            //TEKLİF TARİHLERİNİ FORMATLIYORUZ
        $date=date_create($this->teklifData["icerik"]["teklifIsBaslangic"]);
        $teklifisbaslangic= date_format($date,"d.m.Y");
        $date=date_create($this->teklifData["icerik"]["teklifIsBitis"]);
        $teklifisbitis= date_format($date,"d.m.Y");
        $teklifTarihi = "$teklifisbaslangic - $teklifisbitis";
        $date=date_create($this->teklifData["icerik"]["teklifIsKurulumBaslangic"]);
        $teklifkurulumbaslangic= date_format($date,"d.m.Y");
        $date=date_create($this->teklifData["icerik"]["teklifIsKurulumBitis"]);
        $teklifkurulumbitis= date_format($date,"d.m.Y");
        $kurulumTarihi = "$teklifkurulumbaslangic - $teklifkurulumbitis";
            //TEKLİF SON FİYATLARI AYARLIYORUZ
        $geneltoplam =  $this->teklifData["icerik"]["teklifAnaToplam"];
        $genelIndirim = $this->teklifData["icerik"]["teklifIndirim"];
        $paraSymbol = $this->teklifVars["paraSymbol"];

            //genel bilgileri dolduruyoruz
        $acentaBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAcentaAdi"]);
        if($this->teklifData["icerik"]["teklifAcentaCalisanAdi"]!=""){
            $acentaBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAcentaAdi"])."-".$this->teklifData["icerik"]["teklifAcentaCalisanAdi"];
        }
        $isBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAdi"])."(rev".$this->teklifData["revizeNo"]." )";
        if($this->teklifData["icerik"]["teklifLokasyon"]!=""){
            $isBaslik = $this->yaziDuzelt($this->teklifData["icerik"]["teklifLokasyon"]."-".$this->teklifData["icerik"]["teklifAdi"])."(rev".$this->teklifData["revizeNo"]." )";
        }
        $worksheet->getCell('G2')->setValue($this->yaziDuzelt(date("d.m.Y")));
        $worksheet->getCell('D4')->setValue($this->yaziDuzelt($acentaBaslik));
        $worksheet->getCell('D5')->setValue($isBaslik);
        $worksheet->getCell('D6')->setValue("Kurulum Tarihi : $kurulumTarihi");
        $worksheet->getCell('D7')->setValue("Etkinlik Tarihi : $teklifTarihi");
        #endregion

        #region TOPLAM FİYATLAR
        //filtre "fiyatsız" değilse toplam fiyatları yazdırıyoruz
        if($this->filter!=3){
            //indirimden sonraki rakamı hesaplıyoruz
            $aratoplam = $geneltoplam-$genelIndirim;
            $KDV = ($aratoplam/100)*20;
            $KDVDahil = $geneltoplam+$KDV;
            //İNDİRİM VARSA YAZDIRIYORUZ
            if($genelIndirim != 0){
                $KDVDahil = $aratoplam+$KDV;
                $worksheet->getCell('H5')->setValue(number_format($genelIndirim, 0, ',', '.')." $paraSymbol");
                $worksheet->getCell('H6')->setValue(number_format($aratoplam, 0, ',', '.')." $paraSymbol");
            }
            else{
                $worksheet->getCell('G5')->setValue("");
                $worksheet->getCell('G6')->setValue("");
            }
            $worksheet->getCell('H4')->setValue(number_format($geneltoplam, 0, ',', '.')." $paraSymbol"); 
            $worksheet->getCell('H7')->setValue(number_format($KDV, 0, ',', '.')." $paraSymbol");
            $worksheet->getCell('H8')->setValue(number_format($KDVDahil, 0, ',', '.')." $paraSymbol");
        }
        //eğer fiyatsız teklif isteniyorsa genel toplam başlıklarını siliyoruz
        if($this->filter==3){
            $worksheet->getCell('G4')->setValue("");
            $worksheet->getCell('G5')->setValue("");
            $worksheet->getCell('G6')->setValue("");
            $worksheet->getCell('G7')->setValue("");
            $worksheet->getCell('G8')->setValue("");
        }
        #endregion
        $startB = 10;
        foreach($this->teklifData["icerik"]["teklifIcerik"] as $index=>$salon){
            $ekipmanSayısı = count($salon["icerik"]);
            if($ekipmanSayısı>0){
                 //SALON BAŞLIĞINI ATIYORUZ
                 $worksheet->mergeCells("B$startB:H$startB");
                 $worksheet->getStyle("B$startB:H$startB")->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorOrange"]);
                 $worksheet->getStyle("B$startB")->getFont()->getColor()->setARGB($this->teklifVars["colorWhite"]);
                 $worksheet->getStyle("B$startB")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                 $worksheet->getStyle("B$startB")->getFont()->setBold(true);
                 $salonAdi = $this->yaziDuzelt($salon["salonAdi"]);
                 $worksheet->getCell("B$startB")->setValue($salonAdi);
                 $worksheet->getStyle("B$startB:F$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                 $startB++;
                 //SALON DÜZENİNİ AYARLIYORUZ
                 $worksheet->getStyle("B$startB:H$startB")->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorOrange"]);
                 $worksheet->getStyle("B$startB:H$startB")->getFont()->getColor()->setARGB($this->teklifVars["colorWhite"]);
                 $worksheet->getStyle("B$startB:H$startB")->getFont()->setBold(true);
                 $worksheet->mergeCells("C$startB:D$startB");
                 $worksheet->getCell("B$startB")->setValue("No");
                 $worksheet->getCell("C$startB")->setValue("Açıklama");
                 $worksheet->getStyle("E$startB:H$startB")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                 $worksheet->getCell("E$startB")->setValue("Birim Fiyat");
                 $worksheet->getCell("F$startB")->setValue("Gün");
                 $worksheet->getCell("G$startB")->setValue("Adet/m2");
                 $worksheet->getCell("H$startB")->setValue("Tutar");
                 $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                 $startB++;
                 //SALON İÇERİĞİ YAZDIRIYORUZ
                $virtualIndex = 0;
                foreach($salon["hizmetGrupFiyatlari"] as $index=>$grup){
                    $grupID = $grup["grupID"];
                    //$worksheet->mergeCells("B$startB:H$startB");
                    //$worksheet->getStyle("B$startB")->getFont()->setBold(true);
                    //$worksheet->getStyle("B$startB:H$startB")->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorYellow"]);
                    $worksheet->mergeCells("C$startB:D$startB");
                    $worksheet->getStyle("C$startB:D$startB")->getFont()->setBold(true);
                    $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                    $worksheet->getStyle("B$startB:H$startB")->getFont()->getColor()->setARGB($this->teklifVars["colorBlack"]);
                    $worksheet->getCell("C$startB")->setValue($this->yaziDuzelt($grup["grupAdi"]));
                    $groupStart = $startB;
                    $startB++;
                    $virtualIndex++;
                    $grupBirimFiyatı = 0;
                    foreach($salon["icerik"] as $ind=>$hizmet){
                        if($hizmet["hizmetGrupID"]==$grupID){
                            $worksheet->mergeCells("C$startB:D$startB");
                            $worksheet->getCell("C$startB")->setValue($this->yaziDuzelt($hizmet["hizmetAdi"]));
                            $worksheet->getStyle("E$startB:H$startB")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                            $worksheet->getCell("G$startB")->setValue($this->yaziDuzelt($hizmet["adet"]));
                            $worksheet->getCell("F$startB")->setValue($this->yaziDuzelt($hizmet["gunSayisi"]));
                            $worksheet->getStyle("B$startB:H$startB")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->setColor(new Color($this->teklifVars["colorBlack"]));
                            if($this->filter==2){
                                $worksheet->getStyle("E$startB")->getFont()->setBold(true);
                                $worksheet->getStyle("E$startB")->getAlignment()->setHorizontal($this->teklifVars["sagaYasla"]);
                                $worksheet->getCell("E$startB")->setValue(number_format($hizmet["hizmetFiyati"], 0, ',', '.')." $paraSymbol");
                                $worksheet->getStyle("H$startB")->getFont()->setBold(true);
                                $worksheet->getStyle("H$startB")->getAlignment()->setHorizontal($this->teklifVars["sagaYasla"]);
                                $worksheet->getCell("H$startB")->setValue(number_format($hizmet["hizmetToplam"], 0, ',', '.')." $paraSymbol");
                            }
                            $startB++;

                        }
                    } 
                    $groupEnd=$startB-1;
                    //B stünunu birleştirip Grup Numarasını yazıyoruz
                    $worksheet->mergeCells("B$groupStart:B$groupEnd");
                    $worksheet->getStyle("B$groupStart:B$groupEnd")->getAlignment()->setHorizontal($this->teklifVars["ortala"]);
                    $worksheet->getStyle("B$groupStart:B$groupEnd")->getAlignment()->setVertical($this->teklifVars["dikeyOrtala"]);
                    $worksheet->getCell("B$groupStart")->setValue($this->yaziDuzelt($virtualIndex));
                    
                    
                }
                $startB++;
            }

        

            //$startB++;
        }
        #region TEKLİF FOOTER
        $spreadsheetReturn=$this->createFooter($spreadsheet,$startB);
        return $spreadsheetReturn;
    }
    private function createFooter($spreadsheet,$lastCellNumer){
        $worksheet = $spreadsheet->getActiveSheet();
        //SÖZLEŞME ŞARTLARINI YERLEŞTİRİYORUZ
        foreach($this->teklifSart as $index=>$sartlar){
            
            $worksheet->getStyle("B$lastCellNumer:H$lastCellNumer")->getFill()->setFillType($this->teklifVars["fill"])->getStartColor()->setARGB($this->teklifVars["colorBGBlue"]);
            $worksheet->mergeCells("B$lastCellNumer:H$lastCellNumer");
            $worksheet->getStyle("B$lastCellNumer:H$lastCellNumer")->getAlignment()->setHorizontal($this->teklifVars["solaYasla"]);
            $worksheet->getCell("B$lastCellNumer")->setValue($sartlar);
            $lastCellNumer++;
        }
        $lastCellNumer++;
        //SON RESMİ KOYUYORUZ
        $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
        $drawing->setName('footer');
        $drawing->setDescription('footer');
        $drawing->setPath($_SERVER['DOCUMENT_ROOT'].$this->teklifVars["footerPath"]); // put your path and image here 
        $drawing->setCoordinates("B$lastCellNumer");
        //$drawing->setOffsetX(110);
        //$drawing->setRotation(25);
        $drawing->getShadow()->setVisible(true);
        $drawing->setWidth(1145);
        //$drawing->getShadow()->setDirection(45);
        $drawing->setWorksheet($spreadsheet->getActiveSheet());
        $lastCellNumer=$lastCellNumer+4;
        $worksheet->getCell("H$lastCellNumer")->setValue("FR 33-01");
        #endregion
        return $spreadsheet;
    }
    public function createExcel($sirketID,$teklifData,$excelSablon,$filter=1,$template=1){
        $this->template = $template;
        $this->filter = $filter;
        $this->teklifData = $teklifData;
       
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
         //KLASÖR KONTROLÜ YAP YOKSA OLUŞTUR VE TAM İZİN VER
        $this->teklifVars["path"] = $_SERVER['DOCUMENT_ROOT']."/assets/teklifler/$sirketID";
        if (!file_exists($this->teklifVars["path"])) {
            mkdir($this->teklifVars["path"], 0777, true);
        }
        //EXCEL SABİTLERİ
        $this->teklifVars["dosyaAdi"]="teklif.xlsx";
        $paraBirimi = $this->teklifData["icerik"]["teklifParaBirimi"];

        if($paraBirimi =="tl"){$this->teklifVars["paraSymbol"]="₺";}
        if($paraBirimi =="usd"){$this->teklifVars["paraSymbol"]="$";}
        if($paraBirimi =="euro"){$this->teklifVars["paraSymbol"]="€";}
        //tarih formatlanıyor
        $date=date_create($this->teklifData["icerik"]["teklifIsBaslangic"]);
        $teklifisbaslangic= date_format($date,"d.m.Y");
        $date=date_create($this->teklifData["icerik"]["teklifIsBitis"]);
        $dosyaAcentaAdi = "";
        $dosyaIsBaslangic="";
        if($this->teklifData["icerik"]["teklifAcentaAdi"]){$dosyaAcentaAdi = $this->yaziDuzelt($this->teklifData["icerik"]["teklifAcentaAdi"])." - ";}
        if($teklifisbaslangic){$dosyaIsBaslangic=$teklifisbaslangic." - ";}
        //$this->teklifVars["dosyaAdi"] = $dosyaIsBaslangic.$dosyaAcentaAdi.$this->yaziDuzelt($this->teklifData["teklifAdi"])."-Rev". $this->teklifData["icerik"]["teklifRevize"];
        $dosyaOnAdi = $dosyaIsBaslangic.$dosyaAcentaAdi.$this->yaziDuzelt($this->teklifData["teklifAdi"])."-Rev". $this->teklifData["icerik"]["teklifRevize"];

        $dataToWrite ="";
        $dosyaAdiEki="";
        if($this->template == 0){
            
            //template xls çekiliyor
            //$xlstemplate = "kongreTeklif.xlsx";
            $xlstemplate = $excelSablon[$this->template]["sablonxls"];
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($xlstemplate);
            $spreadsheet->getDefaultStyle()->applyFromArray($this->teklifVars["styleArray"]);
            $dataToWrite = $this->createTemplateOne($spreadsheet);
            $dosyaAdiEki="kongre";
        }
        if($this->template == 1){
            
            //template xls çekiliyor
            //$xlstemplate = "miceTeklif.xlsx";
            $xlstemplate = $excelSablon[$this->template]["sablonxls"];
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($xlstemplate);
            $spreadsheet->getDefaultStyle()->applyFromArray($this->teklifVars["styleArray"]);
            $dataToWrite = $this->createTemplateTwo($spreadsheet);
            $dosyaAdiEki="mice";
            
        }

        if($this->template == 2){
            
            //template xls çekiliyor
            //$xlstemplate = "seturTeklif.xlsx";
            $xlstemplate = $excelSablon[$this->template]["sablonxls"];
            $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($xlstemplate);
            $spreadsheet->getDefaultStyle()->applyFromArray($this->teklifVars["SETURstyleArray"]);
            $dataToWrite = $this->createTemplateTree($spreadsheet);
            $dosyaAdiEki="Setur";
            
        }
        $this->teklifVars["dosyaAdi"]="$dosyaOnAdi-$dosyaAdiEki.xlsx";
        //DOSYA MEVCUTSA SİL
        if(file_exists($this->teklifVars["path"].'/'.$this->teklifVars["dosyaAdi"])){
            //chmod($this->teklifVars["path"].'/'.$this->teklifVars["dosyaAdi"], 0777);
            unlink($this->teklifVars["path"].'/'.$this->teklifVars["dosyaAdi"]);
        }

        $writer = \PhpOffice\PhpSpreadsheet\IOFactory::createWriter($dataToWrite, 'Xlsx');
        $writer->save($this->teklifVars["path"].'/'.$this->teklifVars["dosyaAdi"]);
        return $this->teklifVars["dosyaAdi"];
        //return array("status"=>0,"message"=>"Şablon Boş Bırakldı...","data"=>array());
    }


}