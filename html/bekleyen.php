<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Bekleyen Teklifler</title>   
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
                                <table id="bekleyenTeklifTable" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="bekleyenTeklifTable_info">
                                    <thead>
                                        <tr>
                                            <th>İşlemler</th>
                                            <th>Teklif Adı</th>
                                            <th>Revize</th>
                                            <th>Acenta Adı</th>
                                            <th>Kontak Kişi</th>
                                            <th>Teklif Tarihi</th>
                                            <th>İş Tarihi</th>
                                            <th>Gönderen</th>
                                            <th>uuid</th>
                                            <th>ID</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>  
                        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/footer.php");  ?>
                        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/ariaInit.php");  ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allModals.php");  ?>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allJs.php");  ?>
    <script src="../../js/teklif.js<?php echo $version;?>"></script>
</body>
</html>




                        
                           
