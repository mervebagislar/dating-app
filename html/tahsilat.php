<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Tahsilat İşlemleri</title>   
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
                                <table id="tahsilatListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="tahsilatListe_info">
                                    <thead>
                                        <tr>
                                        <th class="sorting" tabindex="0" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="0" data-toggle="tooltip" data-placement="top" title="Tahsilat Durumu">Durum</th>
                                            <th class="sorting" tabindex="0" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="0" data-toggle="tooltip" data-placement="top" title="Tahsilat ile ilgili işlemler">İşlemler</th>
                                            <th class="sorting" tabindex="1" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="1" data-toggle="tooltip" data-placement="top" title="Tahsilat Adı">Tahsilat Adı</th>
                                            <th class="sorting" tabindex="1" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="1" data-toggle="tooltip" data-placement="top" title="Teklif Adı">Teklif Adı</th>
                                            <th class="sorting" tabindex="2" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="2" data-toggle="tooltip" data-placement="top" title="Acenta Adı">Acenta Adı</th>
                                            <th class="sorting" tabindex="3" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="3" data-toggle="tooltip" data-placement="top" title="Tahsilat Tarihi">Fatura Tarihi</th>
                                            <th class="sorting" tabindex="4" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="4" data-toggle="tooltip" data-placement="top" title="Tahsilat Tutarı">Tutarı</th>
                                            <th class="sorting" tabindex="5" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="5" data-toggle="tooltip" data-placement="top" title="Kur">Kur</th>
                                            <th class="sorting" tabindex="6" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="6" data-toggle="tooltip" data-placement="top" title="Fatura No">Fatura No</th>
                                            <th class="sorting" tabindex="7" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="7" data-toggle="tooltip" data-placement="top" title="Fatura Türü">Fatura Türü</th>
                                            <th class="sorting" tabindex="9" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="9" data-toggle="tooltip" data-placement="top" title="Tahsilat Çeşidi">Tahsilat Çeşidi</th>
                                            <th class="sorting" tabindex="10" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="10" data-toggle="tooltip" data-placement="top" title="Tahsilat Vadesi">Vadesi</th>
                                            <th class="sorting" tabindex="11" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="11" data-toggle="tooltip" data-placement="top" title="Tahsilat Notu">Notlar</th>
                                            <th class="sorting" tabindex="12" aria-controls="tahsilatListe" rowspan="1" colspan="1" aria-label="12" data-toggle="tooltip" data-placement="top" title="Diğer Özellikler">Diğer</th>
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
