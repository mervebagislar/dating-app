<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="İş Raporları">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="İş Raporları">
    <title>İş Raporları</title>   
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
                                        <i class="fa-solid fa-chart-bar"></i> İş Raporları
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <!-- İş Seçimi -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa-solid fa-search"></i> İş Seçimi
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
                                            <div class="col-md-6">
                                                <div class="form-group">
                                                    <label for="isSecimi">İş Seçiniz</label>
                                                    <select class="form-control" id="isSecimi" name="isSecimi">
                                                        <option value="">İş seçiniz...</option>
                                                        <!-- İş listesi buraya gelecek -->
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
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
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12 text-right">
                                                <button type="button" class="btn btn-primary" id="raporGetirBtn">
                                                    <i class="fa fa-chart-line"></i> Raporu Getir
                                                </button>
                                                <button type="button" class="btn btn-info" id="tarihFiltreleBtn">
                                                    <i class="fa fa-calendar"></i> Bu Tarih Aralığındaki İşleri Göster
                                                </button>
                                                <button type="button" class="btn btn-secondary" id="raporTemizleBtn">
                                                    <i class="fa fa-refresh"></i> Temizle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tarih Aralığındaki İşler -->
                        <div class="row mb-4" id="tarihFiltreSonuclari" style="display: none;">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa-solid fa-calendar-check"></i> Bu Tarih Aralığındaki İşler
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="row" id="isKartlari">
                                            <!-- İş kartları buraya gelecek -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Özet Kartları -->
                        <div class="row mb-4" id="ozetKartlari" style="display: none;">
                            <div class="col-md-3">
                                <div class="card bg-success text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">Toplam Tahsilat</h4>
                                                <h2 id="toplamTahsilat">₺0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-arrow-up fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                                <h4 class="card-title">Net Kar/Zarar</h4>
                                                <h2 id="netKarZarar">₺0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-balance-scale fa-2x"></i>
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
                                                <h4 class="card-title">Kar Marjı</h4>
                                                <h2 id="karMarji">%0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-percentage fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Tahsilat Tablosu -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-money-bill-wave text-success"></i> Tahsilatlar
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table id="tahsilatTablosu" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="tahsilatTablosu_info">
                                                <thead>
                                                    <tr>
                                                        <th class="sorting" tabindex="0" aria-controls="tahsilatTablosu" rowspan="1" colspan="1" aria-label="Tarih">Tarih</th>
                                                        <th class="sorting" tabindex="1" aria-controls="tahsilatTablosu" rowspan="1" colspan="1" aria-label="Müşteri">Müşteri</th>
                                                        <th class="sorting" tabindex="2" aria-controls="tahsilatTablosu" rowspan="1" colspan="1" aria-label="Açıklama">Açıklama</th>
                                                        <th class="sorting" tabindex="3" aria-controls="tahsilatTablosu" rowspan="1" colspan="1" aria-label="Tutar">Tutar</th>
                                                        <th class="sorting" tabindex="4" aria-controls="tahsilatTablosu" rowspan="1" colspan="1" aria-label="Ödeme Türü">Ödeme Türü</th>
                                                        <th class="sorting" tabindex="5" aria-controls="tahsilatTablosu" rowspan="1" colspan="1" aria-label="Durum">Durum</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <!-- Tahsilat verileri buraya gelecek -->
                                                </tbody>
                                            </table>
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
                                            <i class="fa fa-receipt text-danger"></i> Masraflar
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table id="masrafTablosu" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="masrafTablosu_info">
                                                <thead>
                                                    <tr>
                                                        <th class="sorting" tabindex="0" aria-controls="masrafTablosu" rowspan="1" colspan="1" aria-label="Tarih">Tarih</th>
                                                        <th class="sorting" tabindex="1" aria-controls="masrafTablosu" rowspan="1" colspan="1" aria-label="Açıklama">Açıklama</th>
                                                        <th class="sorting" tabindex="2" aria-controls="masrafTablosu" rowspan="1" colspan="1" aria-label="Kategori">Kategori</th>
                                                        <th class="sorting" tabindex="3" aria-controls="masrafTablosu" rowspan="1" colspan="1" aria-label="Tutar">Tutar</th>
                                                        <th class="sorting" tabindex="4" aria-controls="masrafTablosu" rowspan="1" colspan="1" aria-label="Ödeme Türü">Ödeme Türü</th>
                                                        <th class="sorting" tabindex="5" aria-controls="masrafTablosu" rowspan="1" colspan="1" aria-label="Durum">Durum</th>
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

                        <!-- Grafik Alanı -->
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-chart-pie"></i> İş Analizi Grafiği
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div style="height: 400px;">
                                            <canvas id="isAnalizChart"></canvas>
                                        </div>
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
    
    
    <!-- İş Raporları JavaScript -->
    <script src="js/isRaporlari.js"></script>
   
</body>
</html>
