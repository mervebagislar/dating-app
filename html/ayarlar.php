<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Mail Ayarları">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="Mail Ayarları">
    <title>Mail Ayarları</title>   
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
                                        <i class="fa-solid fa-square-envelope"></i> Eposta Sunucu Ayarları
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <!-- Mail Ayarları Formu -->
                        <div class="row">
                            <div class="col-sm-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="mb-0">
                                            <i class="fa-solid fa-envelope mr-2"></i>Mail Ayarları
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <form id="MailEkleForm">
                                            <div class="row">
                                                <div class="col-8">
                                                    <div class="form-group">
                                                        <label for="MailEkleSunucu" class="control-label mb-1">SMTP Sunucusu</label>
                                                        <input id="MailEkleSunucu" name="MailEkleSunucu" type="text" class="form-control" placeholder="smtp.gmail.com" aria-required="true" aria-invalid="false" aria-clear="MailEkle">
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label for="MailEklePort" class="control-label mb-1">Sunucu Portu</label>
                                                        <input id="MailEklePort" name="MailEklePort" type="text" class="form-control" placeholder="587" aria-required="true" aria-invalid="false" aria-clear="MailEkle">
                                                    </div>
                                                </div>
                                                <hr class="col-10 ml-2">
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label for="MailEkleEposta" class="control-label mb-1">Mail Adresi</label>
                                                        <input id="MailEkleEposta" name="MailEkleEposta" type="email" class="form-control" placeholder="ornek@email.com" aria-required="true" aria-invalid="false" aria-clear="MailEkle">
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label for="MailEkleKullanici" class="control-label mb-1">SMTP Kullanıcı Adı</label>
                                                        <input id="MailEkleKullanici" name="MailEkleKullanici" type="text" class="form-control" placeholder="Kullanıcı adınız" aria-required="true" aria-invalid="false" aria-clear="MailEkle">
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label for="MailEkleSifre" class="control-label mb-1">SMTP Şifre</label>
                                                        <div class="input-group mb-3">
                                                            <div class="input-group-prepend">
                                                                <span class="input-group-text" aria-name="MailEkleSifreSH">
                                                                    <i class="fa-solid fa-eye" aria-name="MailEkleSifreSW"></i>
                                                                    <i class="fa-solid fa-eye-slash d-none" aria-name="MailEkleSifreHD"></i>
                                                                </span>
                                                            </div>
                                                            <input id="MailEkleSifre" name="MailEkleSifre" type="password" class="form-control" placeholder="Şifrenizi girin" aria-name="MailEkleSifre" aria-required="true" aria-invalid="false" aria-clear="MailEkle">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="col-10">
                                            <div class="row">
                                                <div class="col-12" aria-name="mailEkleAdvance" data-toggle="collapse" data-target="#mailEkleAdvanceCollapse" aria-expanded="false" aria-controls="mailEkleAdvanceCollapse">
                                                    <div class="form-group">
                                                        <label class="control-label mb-1">Gelişmiş Seçenekler</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row collapse" id="mailEkleAdvanceCollapse">
                                                <div class="col-4">
                                                    <div class="form-group">
                                                        <label for="MailEkleGuvenlik" class="control-label mb-1">Güvenlik Tipi</label>
                                                        <select class="form-control" id="MailEkleGuvenlik" name="MailEkleGuvenlik">
                                                            <option value="ssl">SSL/TLS</option>
                                                            <option value="starttls" selected>STARTTLS</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group pl-3">
                                                        <label for="MailEkleVerifyPeer" class="control-label mb-1">VerifyPeer</label>
                                                        <div class="radio">
                                                            <label for="MailEkleVerifyPeer1" class="form-check-label">
                                                                <input type="radio" id="MailEkleVerifyPeer2" name="MailEkleVerifyPeer" value="true" class="form-check-input">Evet
                                                            </label>
                                                        </div>
                                                        <div class="radio">
                                                            <label for="MailEkleVerifyPeer3" class="form-check-label">
                                                                <input type="radio" id="MailEkleVerifyPeer3" name="MailEkleVerifyPeer" value="false" class="form-check-input" checked>Hayır
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-4">
                                                    <div class="form-group pl-3">
                                                        <label for="MailEkleSelfSigned" class="control-label mb-1">Self Signed Sertifika</label>
                                                        <div class="radio">
                                                            <label for="MailEkleSelfSigned1" class="form-check-label">
                                                                <input type="radio" id="MailEkleSelfSigned2" name="MailEkleSelfSigned" value="true" class="form-check-input" checked>Evet
                                                            </label>
                                                        </div>
                                                        <div class="radio">
                                                            <label for="MailEkleSelfSigned3" class="form-check-label">
                                                                <input type="radio" id="MailEkleSelfSigned3" name="MailEkleSelfSigned" value="false" class="form-check-input">Hayır
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <hr class="col-10 mb-2">
                                            <div class="row">
                                                <div class="col-4">
                                                    <div>
                                                        <button aria-name="MailEkleTestEtButton" id="MailEkleTestEtButton" class="btn btn-info btn-block">
                                                            <i class="fa-regular fa-envelope"></i>&nbsp;
                                                            <span aria-name="MailEkleEkleTestEtButtonGonder" class="yok">Mail Test ET</span>
                                                            <span aria-name="MailEkleEkleTestEtButtonBekle" class="d-none">Test ediliyor...</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-12 mt-2">
                                                    <span aria-name="smtpDebug">*Sunucu testi için girmiş olduğunuz eposta adresine bir test epostası gönderilecektir</span>
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




                        
                           
