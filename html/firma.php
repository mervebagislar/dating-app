<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Acentalar</title>   
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
                            <div class="col-sm-12">
                                <table id="acentaListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="acentaListe_info">
                                    <thead>
                                        <tr>
                                            <th class="sorting" tabindex="0" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="1" data-toggle="tooltip" data-placement="top" title="Firma ile ilgili işlemler">İşlemler</th>
                                            <th class="sorting" tabindex="1" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="2" data-toggle="tooltip" data-placement="top" title="Firma Adı">Firma Adı</th>
                                            <th class="sorting" tabindex="2" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="3" data-toggle="tooltip" data-placement="top" title="Firma Adresi">Adresi</th>
                                            <th class="sorting" tabindex="3" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="4" data-toggle="tooltip" data-placement="top" title="Firma Telefon No">Telefon</th>
                                            <th class="sorting" tabindex="4" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="5" data-toggle="tooltip" data-placement="top" title="Firma Fatura Başlıpı">Ünvan</th>
                                            <th class="sorting" tabindex="5" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="6" data-toggle="tooltip" data-placement="top" title="Vergi Dairesi">Vergi D.</th>
                                            <th class="sorting" tabindex="6" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="7" data-toggle="tooltip" data-placement="top" title="Vergi Numarası">Vergi No</th>
                                            <th class="sorting" tabindex="3" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="8" data-toggle="tooltip" data-placement="top" title="Firma Grubu">Grubu</th>
                                            <th class="sorting" tabindex="4" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="9" data-toggle="tooltip" data-placement="top" title="Firma İl">İl</th>
                                            <th class="sorting" tabindex="5" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="10" data-toggle="tooltip" data-placement="top" title="Firma ilçe">İlçe</th>
                                            <th class="sorting" tabindex="6" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="11" data-toggle="tooltip" data-placement="top" title="Web">Web</th>
                                            <th class="sorting" tabindex="6" aria-controls="acentaListe" rowspan="1" colspan="1" aria-label="12" data-toggle="tooltip" data-placement="top" title="Web">E-posta</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
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
