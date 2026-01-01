<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Banka Hesapları Raporu">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="Banka Hesapları Raporu">
    <title>Banka Hesapları Raporu</title>   
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
                                        <i class="fa-solid fa-university"></i> Banka Hesapları Raporu
                                    </h2>
                                </div>
                            </div>
                        </div>

                        <!-- Özet Kartları -->
                        <div class="row mb-4" id="ozetKartlari">
                            <div class="col-md-3">
                                <div class="card bg-success text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">Toplam Giriş</h4>
                                                <h2 id="toplamGiris">₺0</h2>
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
                                                <h4 class="card-title">Toplam Çıkış</h4>
                                                <h2 id="toplamCikis">₺0</h2>
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
                                                <h4 class="card-title">Net Bakiye</h4>
                                                <h2 id="netBakiye">₺0</h2>
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
                                                <h4 class="card-title">İşlem Sayısı</h4>
                                                <h2 id="islemSayisi">0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-list fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Filtre Alanı -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Filtreler</h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="row">
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
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="kasaSecimi">Kasa Seçimi</label>
                                                    <select class="form-control" id="kasaSecimi" name="kasaSecimi">
                                                        <option value="">Tüm Kasalar</option>
                                                        <!-- Kasa listesi buraya gelecek -->
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="islemTuru">İşlem Türü</label>
                                                    <select class="form-control" id="islemTuru" name="islemTuru">
                                                        <option value="">Tümü</option>
                                                        <option value="TAHSILAT">Tahsilat</option>
                                                        <option value="MASRAF">Masraf</option>
                                                        <option value="VIRMAN">Virman</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="gruplama">Gruplama</label>
                                                    <select class="form-control" id="gruplama" name="gruplama">
                                                        <option value="gun">Günlük</option>
                                                        <option value="ay">Aylık</option>
                                                        <option value="yil">Yıllık</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="odendiDurumu">Ödendi mi</label>
                                                    <select class="form-control" id="odendiDurumu" name="odendiDurumu">
                                                        <option value="">Tümü</option>
                                                        <option value="odendi">Ödendi</option>
                                                        <option value="odenmedi">Ödenmedi</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="vadeDurumu">Vade Durumu</label>
                                                    <select class="form-control" id="vadeDurumu" name="vadeDurumu">
                                                        <option value="">Tümü</option>
                                                        <option value="vadesiGelmis">Vadesi Gelmiş</option>
                                                        <option value="vadesiGelmemis">Vadesi Gelmemiş</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="isSecimi">İş Seçimi</label>
                                                    <select class="form-control" id="isSecimi" name="isSecimi">
                                                        <option value="">Tüm İşler</option>
                                                        <!-- İş listesi buraya gelecek -->
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label>&nbsp;</label>
                                                    <div class="btn-group w-100" role="group">
                                                        <button type="button" class="btn btn-primary" id="bankaHesaplariRaporuFiltreleBtn">
                                                            <i class="fa fa-filter"></i> Filtrele
                                                        </button>
                                                        <button type="button" class="btn btn-secondary" id="bankaHesaplariRaporuTemizleBtn">
                                                            <i class="fa fa-times"></i> Temizle
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- İşlemler Tablosu -->
                        <div class="row mb-4">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-list-alt"></i> Kasa İşlemleri
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive">
                                            <table id="bankaHesaplariRaporuTable" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="bankaHesaplariRaporuTable_info">
                                                <thead>
                                                    <tr>
                                                        <th class="sorting" tabindex="0" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="İşlem Türü">İşlem Türü</th>
                                                        <th class="sorting" tabindex="1" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Kasa Adı">Kasa Adı</th>
                                                        <th class="sorting" tabindex="2" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Ödeme Tarihi">Ödeme Tarihi</th>
                                                        <th class="sorting" tabindex="3" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Miktar">Miktar</th>
                                                        <th class="sorting" tabindex="4" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Ödendi mi">Ödendi mi</th>
                                                        <th class="sorting" tabindex="5" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Fatura Tarihi">Fatura Tarihi</th>
                                                        <th class="sorting" tabindex="6" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Kart Adı">Kart Adı</th>
                                                        <th class="sorting" tabindex="7" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Vade Tarihi">Vade Tarihi</th>
                                                        <th class="sorting" tabindex="8" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Teklif Adı">Teklif Adı</th>
                                                        <th class="sorting" tabindex="9" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Tür">Tür</th>
                                                        <th class="sorting" tabindex="10" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Çeşidi">Çeşidi</th>
                                                        <th class="sorting" tabindex="11" aria-controls="bankaHesaplariRaporuTable" rowspan="1" colspan="1" aria-label="Açıklama">Açıklama</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <!-- İşlem verileri buraya gelecek -->
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
                                            <i class="fa fa-chart-line"></i> Kasa Bazında Bakiye Grafiği
                                        </h4>
                                        <div class="card-tools">
                                            <div class="btn-group" role="group">
                                                <button type="button" class="btn btn-sm btn-outline-primary active" id="gunlukChartBtn">Günlük (30 Gün)</button>
                                                <button type="button" class="btn btn-sm btn-outline-primary" id="aylikChartBtn">Aylık</button>
                                                <button type="button" class="btn btn-sm btn-outline-primary" id="yillikChartBtn">Yıllık</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="kasaBakiyeChart" width="400" height="300"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-chart-bar"></i> Kasa Bazında Tahsilat/Masraf Grafiği
                                        </h4>
                                        <div class="card-tools">
                                            <div class="btn-group" role="group">
                                                <button type="button" class="btn btn-sm btn-outline-success active" id="gunlukTahsilatMasrafChartBtn">Günlük</button>
                                                <button type="button" class="btn btn-sm btn-outline-success" id="aylikTahsilatMasrafChartBtn">Aylık</button>
                                                <button type="button" class="btn btn-sm btn-outline-success" id="yillikTahsilatMasrafChartBtn">Yıllık</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="tahsilatMasrafChart" width="400" height="300"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-4">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-chart-pie"></i> İşlem Türü Dağılımı
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="islemTuruChart" width="300" height="300"></canvas>
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
    
    <!-- Daterangepicker CSS -->
    <link rel="stylesheet" href="vendor/daterangepicker/daterangepicker.css">
    
    <script>
    $(document).ready(function() {
        // Tarih aralığı picker'ını başlat
        initTarihAraligiPicker();
        
        // Filtrele butonu
        $('#bankaHesaplariRaporuFiltreleBtn').on('click', function() {
            // Filtreleme işlemi buraya gelecek
            console.log('Filtreleme yapılıyor...');
            console.log('Tarih Başlangıç:', $('#tarihBaslangic').val());
            console.log('Tarih Bitiş:', $('#tarihBitis').val());
            console.log('Kasa:', $('#kasaSecimi').val());
            console.log('İşlem Türü:', $('#islemTuru').val());
            console.log('Gruplama:', $('#gruplama').val());
        });
        
        // Temizle butonu
        $('#bankaHesaplariRaporuTemizleBtn').on('click', function() {
            $('#tarihAraligi').val('');
            $('#tarihBaslangic').val('');
            $('#tarihBitis').val('');
            $('#kasaSecimi').val('').trigger('change');
            $('#islemTuru').val('').trigger('change');
            $('#gruplama').val('gun').trigger('change');
        });
    });
    </script>
   
</body>
</html>
