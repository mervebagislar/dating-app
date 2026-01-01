<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Teklif</title>   
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
                            <div class="col-4">
                           
                            </div>
                            <div class="col-4">
                            
                            </div>
                            <div class="col-4">
                            <button type="button" aria-name="taslakTeklifKaydet" class="btn btn-success btn-sm"><i class="fa-solid fa-floppy-disk"></i> Taslak Kaydet</button>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-6">
                                <label for="" class=" form-control-label">Teklif Adı</label>
                                <div class="input-group" aria-name="yeniTeklifAdi">
                                   
                                    <div class="input-group-btn">
                                        <button class="btn btn-warning btn-prepend" aria-name="yeniTeklifGelismisDuzenle" >
                                        <i class="fa fa-edit"></i>
                                        </button>
                                    </div>
                                    <input type="text" name="yeniTeklifAdi" placeholder="Teklif başlığı giriniz" class="form-control" aria-name="yeniTeklifAdi" disabled>

                                </div>
                                <div class="input-group d-none" aria-name="yeniTeklifAdContainer" data-toggle="tooltip" data-placement="top" title="Teklif adı" >
                                    <div class="input-group-addon">
                                        <i class="fa-solid fa-file-invoice"></i>
                                    </div>
                                    <input type="text" name="yeniTeklifAdiInput" placeholder="Teklif başlığı giriniz" class="form-control" aria-name="yeniTeklifAdiInput">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="row">
                                    <div class="col-md-6">
                                        <label for="" class=" form-control-label">Genel İndirim</label>
                                        <div class="input-group" aria-name="teklifAnaIndirim">
                                            <input type="number" aria-name="teklifAnaIndirimGuncelle"  id="teklifAnaIndirimGuncelle" min="0" step="100" value=0  class="form-control">
                                            <div class="input-group-btn">
                                                <button class="btn btn-secondary btn-append" aria-name="teklifAnaIndirimParaBirimi" aria-state="cash" >  ₺ </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="" class=" form-control-label">Ara Toplam</label>
                                        <div class="input-group" aria-name="teklifAnaFiyat">
                                            <input type="number" aria-name="teklifAnaFiyatGuncelle"  id="teklifAnaFiyatGuncelle" min="0" step="100" value=0  class="form-control">
                                            <div class="input-group-btn">
                                                <button class="btn btn-secondary btn-append" aria-name="teklifAnaFiyatParaBirimi"  >  ₺ </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                        
                       
                        <div class="row">
                            <div class="col-sm-4">
                                <div class="card">
                                    <div class="card-header ">
                                        <div class="row">
                                            <div class="col-4">Hizmet Listesi</div>
                                        <!-- <span class="d-inline"> Hizmet Listesi</span>
                                            <i class="fa-solid fa-magnifying-glass d-inline"></i>
                                            <input type="text" id="teklifHizmetFilterBox" class="form-control-sm d-inline col-6"> -->
                                               
                                            <div class="col-8">
                                                <span class="d-flex">
                                                    <button class="btn btn btn-sm-flat d-inline">
                                                        <i class="fa fa-search"></i>
                                                    </button>
                                                    
                                                    <input type="text" id="teklifHizmetFilterBox" name="teklifHizmetFilterBox" placeholder="hizmet ara" class="form-control-sm  d-inline col-11">
                                                    </span>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <table id="teklifHizmet" class="table table-bordered table-striped dataTable dtr-inline collapsed">
                                            <thead>
                                                <tr>
                                                    <th>İşlemler</th>
                                                    <th>Hizmet Adı</th>
                                                    <th>Birim Fiyat</th>
                                                    <th>Grup ID</th>
                                                    <th>Grubu</th>
                                                    <th>Notlar</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <div class="card">
                                    <div class="card-header d-flex">
                                        <div class="input-group mb-2 d-flex">
                                            <div class="input-group-btn">
                                                <button class="btn  btn-sm btn-success btn-prepend" aria-name="yeniTeklifSalonEkleButton">
                                                <i class="fa fa-plus mr-2"></i>Salon Ekle
                                                </button>
                                            </div>
                                            <input type="text" name="yeniTeklifSalonEkleAdi" placeholder="Salon Adı giriniz" class="form-control-sm col-sm-6 d-none" aria-name="yeniTeklifSalonEkleAdi" >
                                            <div class="input-group-btn d-none" aria-name="yeniSalonEkleInputKaydet">
                                                <button class="btn btn-success btn-sm-flat">
                                                <i class="fa-solid fa-floppy-disk"></i>
                                                </button>
                                            </div>
                                            <span class="justify-content-end">
                                                <button type="button" class="btn-sm d-inline ml-1 btn-outline">
                                                    <span id="grandTotal"> </span> 
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div class="card-body">
                                        <div class="custom-tab">
                                            <nav>
                                                <div class="nav nav-tabs" id="nav-tab" role="tablist" aria-name="yeniTeklifTabList"> </div>
                                            </nav>
                                            <div class="tab-content pl-3 pt-2" id="nav-tabContent" aria-name="yeniTeklifTabContent"> </div>
                                        </div>
                                    </div>
                                </div>



                                
                            </div>
                        </div>





                        <div class="row">
                            <div class="col-sm-6">
                                
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
</body>
</html>




                        
                           
