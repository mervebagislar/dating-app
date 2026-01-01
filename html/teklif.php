<?php
include_once($_SERVER['DOCUMENT_ROOT']."/includes/autoloader.php");

$uuid="-1";
if(isset($_GET["uuid"])){
    $uuid=$_GET["uuid"];
}
?>
<!DOCTYPE html>
<html lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Teklif</title>   
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allCss.php");  ?>
    <script>
        let uuid = "<?php echo $uuid; ?>"
    </script>
</head>

<body class="animsition">
    <div class="page-wrapper">
        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/sideBar.php");  ?>
        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/headerDesktop.php");  ?>
        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/headerMobile.php");  ?>
        <div class="page-container">
        <div class="main-content">
                <div class="section__content section__content--p30">
                    <div class="container-fluid">
                        <div class="row">
                            <div class="col-4">
                           
                            </div>
                            <div class="col-4">
                            
                            </div>
                            <div class="col-4">
                           
                            </div>
                        </div>
                        <div class="row mb-1">
                            <div class="col-12">
                                <div class="card">
                                    <div class="card-header d-flex justify-content-between">
                                        <span class=" d-inline">
                                            <label for="teklifAdi" class=" form-control-label mr-2">Teklif Adı</label>
                                            <input type="text" name="teklifAdi" placeholder="Teklif başlığı giriniz" class="form-control d-inline col-10" aria-name="teklifAdi" disabled>
                                        </span>    
                                        <div class=" d-inline">
                                            <button type="button" class="btn-bar-sm btn-secondary" id="teklifEssentials" data-toggle="collapse" data-target="#teklifEssentials-Content"  aria-expanded="true" aria-controls="teklifEssentials-Content"><i class="fa-solid fa-minus"></i></button>
                                            
                                        </div>
                                    </div>
                                    <div class="card-body collapse show" id="teklifEssentials-Content">
                                        <div class="row">
                                            <div class="col-md-5">
                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Firma :</div>
                                                    <div class="col-md-8"><span aria-name="teklifAcentaAdi"><span></div>
                                                </div>
                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Kontak Kişi :</div>
                                                    <div class="col-md-8"><span aria-name="teklifAcentaCalisanAdi"><span></div>
                                                </div>

                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">E-Mail :</div>
                                                    <div class="col-md-8"><span aria-name="teklifAcentaCalisanMail"><span></div>
                                                </div>
                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Kurulum Tarihi :</div>
                                                    <div class="col-md-8"><span aria-name="teklifKurulumTarihi"><span></div>
                                                </div>

                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Teklif Tarihi :</div>
                                                    <div class="col-md-8"><span aria-name="teklifTarihi"><span></div>
                                                </div>
                                            </div>
                                            <div class="col-md-5">
                                            
                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Etkinlik Adı :</div>
                                                    <div class="col-md-8"><span aria-name="teklifEtkinlikAdi"><span></div>
                                                </div>
                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Proje Direktörü :</div>
                                                    <div class="col-md-8"><span aria-name="teklifYazanAdi"><span></div>
                                                </div>

                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Lokasyon :</div>
                                                    <div class="col-md-8"><span aria-name="teklifLokasyon"><span></div>
                                                </div>
                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Etkinlik Tarihi :</div>
                                                    <div class="col-md-8"><span aria-name="teklifIsTarihi"><span></div>
                                                </div>

                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Geçerlilik Süresi :</div>
                                                    <div class="col-md-8"><span aria-name="teklifGecerlilikSuresi">15<span> Gün</div>
                                                </div>
                                                <div class="row mb-1">
                                                    <div class="col-md-4 bg-flat-color-secondary">Revize No :</div>
                                                    <div class="col-md-8"><span aria-name="teklifRevizeNo">0<span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                       
                        <div class="row">
                            <div class="col-sm-2">
                                <button class="btn btn-warning btn-sm col-12 btn-blok d-inline mb-2"  aria-name="TaslakTeklifDuzenle" aria-teklifid="" data-toggle="tooltip" data-placement="top" title="Teklif düzenle" type="button" >
                                    <i class="fa fa-edit"></i>Düzenle
                                </button>
                                <hr class="hr border-top col-10 bg-white">
                                <div class="form-check">
                                    <div class="radio">
                                        <label for="raporCikti1" class="form-check-label ">
                                            <input type="radio" id="raporCikti1" name="raporCikti" value="1" class="form-check-input" checked>Genel Toplam
                                        </label>
                                    </div>
                                    <div class="radio">
                                        <label for="raporCikti2" class="form-check-label ">
                                            <input type="radio" id="raporCikti2" name="raporCikti" value="2" class="form-check-input">Detaylı Fiyat Listesi
                                        </label>
                                    </div>
                                    <div class="radio">
                                        <label for="raporCikti3" class="form-check-label ">
                                            <input type="radio" id="raporCikti3" name="raporCikti" value="3" class="form-check-input">Fiyatsız
                                        </label>
                                    </div>
                                </div>
                                <hr class="hr border-top col-10 bg-white">
                                <div class="form-check">
                                <?php
                                   /* $db = new Workers\database();
                                    $data = $db->ayarGetData($sirketID,$userID,$yetki,"excelSablon");
                                    $sablonlar = json_decode($data["data"]["ayarDegeri"],1);
                                    if(count($sablonlar)>0){
                                        //print_r($sablonlar);
                                        $checked = "";
                                        foreach ($sablonlar as $key => $sablon) {
                                            if($key ==0){$checked = "checked";}
                                            else{$checked = "";}
                                            echo '<div class="radio">
                                            <label for="sablonCikti'.$key.'" class="form-check-label ">
                                                <input type="radio" id="sablonCikti'.$key.'" name="sablonCikti" value="'.$key.'" class="form-check-input" '.$checked.'>'.$sablon["sablonAdi"].'
                                            </label>
                                        </div>';
                                        }
                                    }*/
                                ?>
                                   <div class="radio">
                                        <label for="sablonCikti1" class="form-check-label ">
                                            <input type="radio" id="sablonCikti1" name="sablonCikti" value="1" class="form-check-input" checked>Kongre
                                        </label>
                                    </div>
                                    <div class="radio">
                                        <label for="sablonCikti2" class="form-check-label ">
                                            <input type="radio" id="sablonCikti2" name="sablonCikti" value="2" class="form-check-input">M.I.C.E
                                        </label>
                                    </div>
                                    <div class="radio">
                                        <label for="sablonCikti3" class="form-check-label ">
                                            <input type="radio" id="sablonCikti3" name="sablonCikti" value="3" class="form-check-input">SETUR
                                        </label>
                                    </div> <!---->
                                </div>
                                <hr class="hr border-top col-10 bg-white">
                                <button class="btn btn-info btn-sm col-12 btn-blok d-inline mb-2" id="mailGonder" type="button" >
                                <i class="fa-solid fa-square-envelope pr-2"></i>E-posta Gönder
                                </button>

                                <button class="btn btn-success btn-sm col-12 btn-blok d-inline mb-2" id="excelIndir" type="button" >
                                <i class="fa-regular fa-file-excel pr-2"></i>Excel İndir
                                </button>
                                <!--
                                <button class="btn btn-danger btn-sm col-12 btn-blok d-inline mb-2" id="" type="button" >
                                <i class="fa-solid fa-file-pdf"></i>PDF İndir
                                </button> -->
                            </div>
                            <div class="col-sm-10">
                                <div class="card">
                                    <div class="card-header">
                                        <!--<div class="input-group mb-2 d-flex">
                                          Salon Listesi
                                          <span class="justify-content-end">
                                                <button type="button" class="btn-sm d-inline ml-1 btn-outline">
                                                    <span id="grandTotal"> </span> 
                                                </button>
                                            </span>
                                        </div> -->
                                        <div class="row">
                                            <div class="col-md-3" >Salon Listesi</div>
                                            <div class="col-md-3" >Ara Toplam: <span id="teklifAraFiyat"></span></div>
                                            <div class="col-md-3" >İndirim: <span id="teklifIndirim"></span></div>
                                            <div class="col-md-3" >Genel Toplam: <span id="teklifAnaFiyat"></span></div>
                                            
                                        </div>
                                    </div>
                                    
                                    <div class="card-body">
                                        <div class="custom-tab">
                                            <nav>
                                                <div class="nav nav-tabs" id="nav-tab" role="tablist" aria-name="yeniTeklifTabList"> </div>
                                            </nav>
                                            <div class="tab-content pl-3 pt-2" id="nav-tabContent" aria-name="yeniTeklifTabContent"> </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-6">
                                
                            </div>
                        </div>
                        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/footer.php");  ?>
                        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/ariaInit.php");  ?>
                    </div>
                </div>
            </div>
        </div>
        <iframe id="my_iframe" style="display:none;"></iframe>
    </div>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allModals.php");  ?>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allJs.php");  ?>
    <script src="../../js/teklif.js<?php echo $version;?>"></script>
</body>
</html>




                        
                           
