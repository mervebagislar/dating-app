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
                            <div class="col-sm-6 mr-1" id="tahsilatCesidiTable">
                                <table id="tahsilatCesitListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="odemeCesitListe_info">
                                    <thead>
                                        <tr>
                                            <th class="sorting" tabindex="0" aria-controls="tahsilatCesitListe" rowspan="1" colspan="1" aria-label="0" data-toggle="tooltip" data-placement="top" title="Ödeme ile ilgili işlemler">İşlemler</th>
                                            <th class="sorting" tabindex="1" aria-controls="tahsilatCesitListe" rowspan="1" colspan="1" aria-label="1" data-toggle="tooltip" data-placement="top" title="Ödeme Türü">Ödeme Türü</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-sm-5 border-left border-success  d-none" id="tahsilatCesidiEkle"> 
                                <div class="row">
                                    <div class="col-12 mb-2">
                                        <p>Hızlı Tahsilat Türü Ekle</p>
                                        <div class="input-group input-group-sm mb-2">
                                            <input type="text" class="form-control" name="tahsilatTuruAdi" id="tahsilatTuruAdi">
                                            <span class="input-group-append">
                                                <button type="button" class="btn btn-success btn-flat" aria-name="tahsilatTuruKaydet"> <i class="fa-solid fa-floppy-disk text-white mr-2"></i>Kaydet</button>
                                            </span>
                                        </div>
                                    </div>

                                    <div class="col-12 mt-2"> </div>
                                </div>
                                
                            </div>

                            <div class="col-sm-5 border-left border-warning  d-none" id="tahsilatCesidiDuzenle"> 
                                    <div class="col-12 mt-2">
                                         <form novalidate="novalidate" id="tahsilatCesidiDuzenleForm">
                                            <div class="form-group">
                                                <label for="tahsilatCesidiDuzenleAdi" class="control-label mb-1">Tahsilat Türü</label>
                                                <input id="tahsilatCesidiDuzenleAdi" name="tahsilatCesidiDuzenleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatCesidiDuzenle">
                                            </div>
                                            <hr>
                                            <div>
                                                <input id="tasilatCesidiDuzenleID" type="hidden" name="tasilatCesidiDuzenleID" aria-clear="tahsilatCesidiDuzenle">
                                                <button id="tasilatCesidiDuzenleKaydetButton" class="btn btn-lg btn-warning btn-block">
                                                    <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                                                    <span id="tasilatCesidiDuzenleKaydetButtonGonder">Tahsilat Türü Düzenle</span>
                                                    <span id="tasilatCesidiDuzenleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
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
