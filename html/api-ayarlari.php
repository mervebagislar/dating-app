<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="API Ayarları">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="API Ayarları">
    <title>API Ayarları</title>   
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

                        <!-- Sayfa Başlığı -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="overview-wrap">
                                    <h2 class="title-1">
                                        <i class="fa-solid fa-code"></i> API Ayarları
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <!-- API Ayarları Formu -->
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="mb-0">
                                            <i class="fa-solid fa-cog mr-2"></i>API Yapılandırması
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <form id="ApiEkleForm">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="ApiKullaniciAdi" class="control-label mb-1">Kullanıcı Adı</label>
                                                        <input id="ApiKullaniciAdi" name="ApiKullaniciAdi" type="text" class="form-control" placeholder="API kullanıcı adınız" aria-required="true" aria-invalid="false">
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    <div class="form-group">
                                                        <label for="ApiAccessToken" class="control-label mb-1">Access Token</label>
                                                        <div class="input-group">
                                                            <input id="ApiAccessToken" name="ApiAccessToken" type="password" class="form-control" placeholder="API access token'ınız" aria-required="true" aria-invalid="false">
                                                            <div class="input-group-append">
                                                                <button class="btn btn-outline-secondary" type="button" id="ApiTokenToggle">
                                                                    <i class="fa-solid fa-eye" id="ApiTokenEye"></i>
                                                                    <i class="fa-solid fa-eye-slash d-none" id="ApiTokenEyeSlash"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12">
                                                    <button type="button" class="btn btn-primary" id="ApiKaydetBtn">
                                                        <i class="fa-solid fa-save mr-2"></i>API Ayarlarını Kaydet
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
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
