<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="Tahsilat Raporu">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="Tahsilat Raporu">
    <title>Tahsilat Raporu</title>   
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
                                        <i class="fa-solid fa-money-bill-wave"></i> Tahsilat Raporu
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
                                                    <label for="firmaAdi">Firma Adı</label>
                                                    <select class="form-control select2" id="firmaAdi" name="firmaAdi" style="width: 100%;">
                                                        <option value="">Tüm Firmalar</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-md-3">
                                                <div class="form-group">
                                                    <label for="durum">Durum</label>
                                                    <select class="form-control" id="durum" name="durum">
                                                        <option value="">Tümü</option>
                                                        <option value="yapilmis">Yapılmış</option>
                                                        <option value="yapilmamis">Yapılmamış</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-12 text-right">
                                                <button type="button" class="btn btn-primary" id="tahsilatRaporuFiltreleBtn">
                                                    <i class="fa fa-filter"></i> Filtrele
                                                </button>
                                                <button type="button" class="btn btn-secondary" id="tahsilatRaporuTemizleBtn">
                                                    <i class="fa fa-refresh"></i> Temizle
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
                                <div class="card bg-info text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">Yapılmış</h4>
                                                <h2 id="yapilmisTahsilat">₺0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-check-circle fa-2x"></i>
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
                                                <h4 class="card-title">Yapılmamış</h4>
                                                <h2 id="yapilmamisTahsilat">₺0</h2>
                                            </div>
                                            <div class="align-self-center">
                                                <i class="fa fa-clock fa-2x"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-primary text-white">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <h4 class="card-title">Tahsilat Oranı</h4>
                                                <h2 id="tahsilatOrani">%0</h2>
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
                        <div class="row">
                            <div class="col-md-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-money-bill-wave text-success"></i> Tahsilat Detayları
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <div class="table-responsive" style="overflow-x: auto; min-height: 400px;">
                                            <table id="tahsilatRaporTablosu" class="table table-bordered table-striped dataTable" style="width: 100%; min-width: 1200px;" aria-describedby="tahsilatRaporTablosu_info">
                                                <thead>
                                                    <tr>
                                                        <th class="sorting_disabled" tabindex="0" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="İşlemler">İşlemler</th>
                                                        <th class="sorting" tabindex="0" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="İşlemler">Teklif</th>
                                                        <th class="sorting" tabindex="1" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="Tarih">Tahsilat Tarihi</th>
                                                        <th class="sorting" tabindex="2" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="Firma Adı">Firma Adı</th>
                                                        <th class="sorting" tabindex="3" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="İş Adı">İş Adı</th>
                                                        <th class="sorting" tabindex="4" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="Açıklama">Açıklama</th>
                                                        <th class="sorting" tabindex="5" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="Tutar">Tutar</th>
                                                        <th class="sorting" tabindex="6" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="Ödeme Türü">Ödeme Türü</th>
                                                        <th class="sorting" tabindex="7" aria-controls="tahsilatRaporTablosu" rowspan="1" colspan="1" aria-label="Durum">Durum</th>
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

                        <!-- Grafik Alanı -->
                        <div class="row mt-4">
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-chart-pie"></i> Durum Dağılımı
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="durumChart" width="400" height="200"></canvas>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">
                                            <i class="fa fa-chart-bar"></i> Aylık Tahsilat Trendi
                                        </h4>
                                    </div>
                                    <div class="card-body">
                                        <canvas id="trendChart" width="400" height="200"></canvas>
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
    
    <script>
    $(document).ready(function() {
        // Tarih aralığı daterangepicker
        $('#tarihAraligi').daterangepicker({
            locale: {
                format: 'DD.MM.YYYY',
                separator: ' - ',
                applyLabel: 'Uygula',
                cancelLabel: 'İptal',
                fromLabel: 'Başlangıç',
                toLabel: 'Bitiş',
                customRangeLabel: 'Özel',
                weekLabel: 'H',
                daysOfWeek: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
                monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
                    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
                firstDay: 1
            },
            opens: 'left',
            autoUpdateInput: false
        });
        
        $('#tarihAraligi').on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY'));
            $('#tarihBaslangic').val(picker.startDate.format('YYYY-MM-DD'));
            $('#tarihBitis').val(picker.endDate.format('YYYY-MM-DD'));
        });
        
        $('#tarihAraligi').on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
            $('#tarihBaslangic').val('');
            $('#tarihBitis').val('');
        });
        
        // Tarih temizle butonu
        $('#tarihTemizle').on('click', function() {
            $('#tarihAraligi').val('');
            $('#tarihBaslangic').val('');
            $('#tarihBitis').val('');
        });
    });
    </script>
   
</body>
</html>
