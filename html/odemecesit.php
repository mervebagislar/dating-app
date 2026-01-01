<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Ödeme Çeşitleri</title>   
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allCss.php");  ?>
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
                            <div class="col-sm-12 mr-1" id="odemeCesidiTable">
                                <table id="odemeCesitListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="odemeCesitListe_info">
                                    <thead>
                                        <tr>
                                            <th class="sorting" tabindex="0" aria-controls="odemeCesitListe" rowspan="1" colspan="1" aria-label="0" data-toggle="tooltip" data-placement="top" title="Ödeme ile ilgili işlemler">İşlemler</th>
                                            <th class="sorting" tabindex="1" aria-controls="odemeCesitListe" rowspan="1" colspan="1" aria-label="1" data-toggle="tooltip" data-placement="top" title="Ödeme Türü">Ödeme Türü</th>
                                            <th class="sorting" tabindex="2" aria-controls="odemeCesitListe" rowspan="1" colspan="1" aria-label="2" data-toggle="tooltip" data-placement="top" title="Ödeme Çeşidi">Ödeme Çeşidi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-sm-5 border-left border-success  d-none" id="odemenCesidiEkle"> 
                                <div class="row">
                                    <div class="col-12 mb-2">
                                        <p>Hızlı Ödeme Türü Ekle</p>
                                        <div class="input-group input-group-sm mb-2">
                                            <input type="text" class="form-control" name="odemeTuruAdi" id="odemeTuruAdi">
                                            <span class="input-group-append">
                                                <button type="button" class="btn btn-success btn-flat" aria-name="odemeTuruKaydet"> <i class="fa-solid fa-floppy-disk text-white mr-2"></i>Kaydet</button>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-12 mt-2"> </div>
                                    <div class="col-12 mt-2">
                                         <form novalidate="novalidate" id="odemeCesidiEkleForm">

                                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Ödeme Grubu seçiniz">
                                                        
                                                <div class="input-group-prepend">
                                                    <div class="input-group-btn">
                                                        <button class="btn btn-default" type="button" data-select2-open="OdemeCesidiEkleAra">
                                                        Ödeme Grubu
                                                        </button>
                                                    </div>
                                                </div>
                                                <select class="form-control-sm  input-sm" id="OdemeCesidiEkleAra" name="odemeTuru" data-placeholder="Ödeme Grubu seçiniz" tabindex="-1" aria-hidden="true">
                                                
                                                </select>
                                            </div>
                                            <hr>
                                            <div class="form-group">
                                                <label for="odemeCesidiEkleCesidi" class="control-label mb-1">Ödeme Çeşidi</label>
                                                <input id="odemeCesidiEkleCesidi" name="odemeCesidiEkleCesidi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="odemeCesidiEkle">
                                            </div>
                                            <hr>
                                            <div>
                                                <button id="OdemeCesidiEkleKaydetButton" class="btn btn-lg btn-success btn-block">
                                                    <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                                                    <span id="OdemeCesidiEkleKaydetButtonGonder">Ödeme Çeşidi Kaydet</span>
                                                    <span id="OdemeCesidiEkleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                
                            </div>

                            <div class="col-sm-5 border-left border-warning  d-none" id="odemenCesidiDuzenle"> 
                                    <div class="col-12 mt-2">
                                         <form novalidate="novalidate" id="odemeCesidiDuzenleForm">

                                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Ödeme Grubu seçiniz">
                                                        
                                                <div class="input-group-prepend">
                                                    <div class="input-group-btn">
                                                        <button class="btn btn-default" type="button" data-select2-open="OdemeCesidiDuzenleAra">
                                                        Ödeme Grubu
                                                        </button>
                                                    </div>
                                                </div>
                                                <select class="form-control-sm  input-sm" id="OdemeCesidiDuzenleAra" name="odemeTuru" data-placeholder="Ödeme Grubu seçiniz" tabindex="-1" aria-hidden="true">
                                                
                                                </select>
                                            </div>
                                            <hr>
                                            <div class="form-group">
                                                <label for="odemeCesidiDuzenleCesidi" class="control-label mb-1">Ödeme Çeşidi</label>
                                                <input id="odemeCesidiDuzenleCesidi" name="odemeCesidiDuzenleCesidi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="odemeCesidiDuzenle">
                                            </div>
                                            <hr>
                                            <div>
                                                <input id="odemeCesidiDuzenleID" type="hidden" name="odemeCesidiDuzenleID" aria-clear="odemeCesidiDuzenle">
                                                <button id="OdemeCesidiDuzenleKaydetButton" class="btn btn-lg btn-warning btn-block">
                                                    <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                                                    <span id="OdemeCesidiDuzenleKaydetButtonGonder">Ödeme Çeşidi Düzenle</span>
                                                    <span id="OdemeCesidiDuzenleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/footer.php");  ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allModals.php");  ?>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allJs.php");  ?>
   
</body>
</html>
