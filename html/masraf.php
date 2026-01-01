<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Masraf İşlemleri</title>   
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
                                <table id="masrafListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="MasrafListe_info">
                                    <thead>
                                        <tr>
                                            <th class="sorting" tabindex="0" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="0" data-toggle="tooltip" data-placement="top" title="Masraf ile ilgili işlemler">İşlemler</th>
                                            <th class="sorting" tabindex="1" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="1" data-toggle="tooltip" data-placement="top" title="Masraf Adı">Masraf Adı</th>
                                            <th class="sorting" tabindex="2" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="2" data-toggle="tooltip" data-placement="top" title="MAsraf Tarihi">Fatura Tarihi</th>
                                            <th class="sorting" tabindex="3" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="3" data-toggle="tooltip" data-placement="top" title="MAsraf Tutarı">Tutarı</th>
                                            <th class="sorting" tabindex="3" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="3" data-toggle="tooltip" data-placement="top" title="Kur">Kur</th>
                                            <th class="sorting" tabindex="4" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="4" data-toggle="tooltip" data-placement="top" title="Fatura Türü">Fatura Türü</th>
                                            <th class="sorting" tabindex="4" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="4" data-toggle="tooltip" data-placement="top" title="Ödeme Grubu">Ödeme Grubu</th>
                                            <th class="sorting" tabindex="5" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="5" data-toggle="tooltip" data-placement="top" title="Ödeme Çeşidi">Ödeme Çeşidi</th>
                                            <th class="sorting" tabindex="5" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="5" data-toggle="tooltip" data-placement="top" title="Masraf Notu">Notlar</th>
                                            <th class="sorting" tabindex="6" aria-controls="masrafListe" rowspan="1" colspan="1" aria-label="6" data-toggle="tooltip" data-placement="top" title="Diğer Özellikler">Diğer</th>
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
