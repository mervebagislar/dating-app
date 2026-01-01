<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Masraf Raporu">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="Masraf Raporu">
    <title>Masraf Raporu</title>   
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
                                        <i class="fa-solid fa-chart-line"></i> Masraf Raporu
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <!-- Filtre Alanı -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa-solid fa-filter"></i> Filtreler
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label for="tarihAraligi">Tarih Aralığı</label>
                                                    <div class="input-group">
                                                        <input type="text" class="form-control" id="tarihAraligi" name="tarihAraligi" readonly placeholder="Tarih aralığı seçiniz">
                                                        <div class="input-group-append">
                                                            <button class="btn btn-outline-secondary" type="button" id="tarihTemizle">
                                                                <i class="fa fa-times"></i>
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <input type="hidden" id="tarihBaslangic" name="tarihBaslangic">
                                                    <input type="hidden" id="tarihBitis" name="tarihBitis">
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label for="odemeGrubu">Ödeme Grubu</label>
                                                    <select class="form-control" id="odemeGrubu" name="odemeGrubu">
                                                        <option value="">Tüm Gruplar</option>
                                                        <!-- Ödeme grupları buraya gelecek -->
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label for="odemeAltGrubu">Ödeme Alt Grubu</label>
                                                    <select class="form-control" id="odemeAltGrubu" name="odemeAltGrubu">
                                                        <option value="">Tüm Alt Gruplar</option>
                                                        <!-- Ödeme alt grupları buraya gelecek -->
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label for="isAdi">İş Adı</label>
                                                    <select class="form-control" id="isAdi" name="isAdi">
                                                        <option value="">Tüm İşler</option>
                                                        <!-- İş listesi buraya gelecek -->
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label>&nbsp;</label>
                                                    <button type="button" class="btn btn-primary btn-block" id="filtreleBtn" title="Filtrele">
                                                        <i class="fa fa-filter"></i> Filtrele
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="col-md-2">
                                                <div class="form-group">
                                                    <label>&nbsp;</label>
                                                    <button type="button" class="btn btn-secondary btn-block" id="temizleBtn" title="Temizle">
                                                        <i class="fa fa-refresh"></i> Temizle
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Özet Kartları -->
                        <div class="row mb-4" id="ozetKartlari">
                            <div class="col-md-3">
                                <div class="card bg-danger text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">Toplam Masraf</h4>
                                                <h2 id="toplamMasraf">₺0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-arrow-down fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-info text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">Ortalama Masraf</h4>
                                                <h2 id="ortalamaMasraf">₺0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-calculator fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-warning text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">En Yüksek Masraf</h4>
                                                <h2 id="enYuksekMasraf">₺0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-arrow-up fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-success text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">Masraf Sayısı</h4>
                                                <h2 id="masrafSayisi">0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-list fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Masraf Tablosu -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-list-alt"></i> Masraf Detayları
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table id="masrafRaporTablosu" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="masrafRaporTablosu_info">
                                                <thead>
                                                    <tr>
                                                        <th class="sorting" tabindex="0" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="Tarih">Tarih</th>
                                                        <th class="sorting" tabindex="1" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="İş Adı">İş Adı</th>
                                                        <th class="sorting" tabindex="2" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="Ödeme Grubu">Ödeme Grubu</th>
                                                        <th class="sorting" tabindex="3" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="Ödeme Alt Grubu">Ödeme Alt Grubu</th>
                                                        <th class="sorting" tabindex="4" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="Açıklama">Açıklama</th>
                                                        <th class="sorting" tabindex="5" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="Tutar">Tutar</th>
                                                        <th class="sorting" tabindex="6" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="Para Birimi">Para Birimi</th>
                                                        <th class="sorting" tabindex="7" aria-controls="masrafRaporTablosu" rowspan="1" colspan="1" aria-label="Durum">Durum</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <!-- Masraf verileri buraya gelecek -->
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Gruplama Tablosu -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-table"></i> Gruplama Raporu
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table id="gruplamaTablosu" class="table table-bordered table-striped">
                                                <thead>
                                                    <tr>
                                                        <th>Ödeme Grubu</th>
                                                        <th>Ödeme Alt Grubu</th>
                                                        <th>Toplam Tutar</th>
                                                        <th>Masraf Sayısı</th>
                                                        <th>Ortalama Tutar</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <!-- Gruplanmış veriler buraya gelecek -->
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Grafik Alanı -->
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-chart-pie"></i> Ödeme Grubu Dağılımı
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="odemeGrubuDagilimChart" width="400" height="200"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-chart-bar"></i> Aylık Masraf Trendi
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="aylikMasrafTrendChart" width="400" height="200"></canvas>
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
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    
    <!-- Daterangepicker -->
    <script src="vendor/daterangepicker/daterangepicker.js"></script>
    <link rel="stylesheet" href="vendor/daterangepicker/daterangepicker.css">
    
    <!-- Masraf Raporu JavaScript -->
    <!-- Masraf raporu artık eventHandler.js, callBacks.js ve dataTables.js kullanıyor -->
    
    <script>
    $(document).ready(function() {
        // Tarih aralığı picker'ını başlat
        initTarihAraligiPicker();
    });
    </script>
   
</body>
</html>
