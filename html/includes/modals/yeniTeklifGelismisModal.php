<div class="modal fade" id="modal-yeniTeklif-Gelismis">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-yeniTeklif-Gelismis">
                <i class="fa-solid fa-file-invoice text-success mr-1"></i><span id="yeniTeklifGelismisBaslik"></span> 
                </h4>
                
            </div>
            <div class="modal-body" id="modal-body-yeniTeklif-Gelismis">
                <div class="row mb-2">
                    <div class="col-md-6">
                        <label for="" class=" form-control-label">Teklif Adı</label>
                        <div class="input-group" aria-name="yeniTeklifAdi"  >
                            
                            <div class="input-group-btn">
                                <button class="btn btn-warning">
                                <i class="fa fa-edit"></i>
                                </button>
                            </div>
                            <input type="text" name="yeniTeklifAdiDegistirInput" placeholder="Teklif başlığı giriniz" class="form-control" aria-name="yeniTeklifAdiDegistirInput">

                        </div>
                        
                    </div>
                    <div class="col-md-6">
                        <div class="checkbox">
                            <label class="form-check-label">
                                Teklifi Yazan:
                            </label>
                        </div>

                        <div class="checkbox">
                            <label for="checkbox1" class="form-check-label" >
                            <i class="fa-solid fa-user"></i> <span aria-name="yeniTeklifYazanAdi"></span> ( <span aria-name="yeniTeklifYazanMail"></span>)
                            </label>
                        </div>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-lg-6" aria-name="yeniTeklifAcentaContainer">
                        <label for="" class=" form-control-label">Acenta</label>
                        <div class="input-group mb-2" aria-name="yeniTeklifAcentaGrup" >
                            <div class="input-group-addon">
                                <i class="fa-solid fa-building"></i>
                            </div>
                            <select class="form-control-sm  input-sm select2bs4 select2-hidden-accessible" aria-name="yeniTeklifAcentaSec" name="yeniTeklifAcentaSec" data-placeholder="acenta ara" tabindex="-1" aria-hidden="true">

                            </select>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <label for="" class=" form-control-label">Çalışan</label>
                        <div class="input-group mb-2" aria-name="yeniTeklifAcentaCalisanGrup"  data-toggle="tooltip" data-placement="top" title="Aramak istediğiniz Çalışanı yazınız">
                            <div class="input-group-addon">
                                <i class="fa-solid fa-people-group"></i>
                            </div>
                            <select class="form-control-sm  input-sm select2bs4 select2-hidden-accessible" aria-name="yeniTeklifAcentaCalisanSec" name="yeniTeklifAcentaCalisanSec" data-placeholder="Çalışan ara" tabindex="-1" aria-hidden="true">

                            </select>
                        </div>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-lg-6">
                        <label for="" class=" form-control-label">Kurulum Tarihi</label>
                        <div class="form-group">
                            <div class='input-group' aria-name="yeniTeklifKurulumTarihi" data-toggle="tooltip" data-placement="top" title="Kurulum Tarihi seçiniz">
                                <input type='text' class="form-control" aria-name="yeniTeklifKurulumTarihiGoster" disabled/>
                                <span class="input-group-addon"><i class="fa-solid fa-helmet-safety"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-6" >
                        <label for="" class=" form-control-label">Event Tarihi</label>
                        <div class="form-group">
                            <div class='input-group' aria-name="yeniTeklifTarihi" data-toggle="tooltip" data-placement="top" title="Event Tarihi seçiniz">
                                <input type='text' class="form-control" aria-name="yeniTeklifTarihiGoster" disabled/>
                                <span class="input-group-addon"><i class="fa-solid fa-calendar-plus"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                   <div class="col-lg-6">
                            <label for="" class=" form-control-label">Termin Tarihi</label>
                        <div class="form-group">
                            <div class="input-group date input-group-sm" id="teklifTerminTarihi" data-target-input="nearest">
                                <input type="text" class="form-control datetimepicker-input" data-target="#teklifTerminTarihi" aria-name="yeniTerminTarihi" name="teklifTerminTarihi"  placeholder="Termin Tarihi">
                                <div class="input-group-append" data-target="#teklifTerminTarihi" data-toggle="datetimepicker">
                                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--<div class="col-lg-6">
                        <div class="input-group d-none" aria-name="yeniTeklifKurulumKatsayiContainer">
                            
                            <div class="input-group-btn">
                                <button class="btn btn-warning" >
                                katsayı
                                </button>
                            </div>
                            <input type="text" name="yeniTeklifKurulumKatsayi" placeholder="katsayı" class="form-control" aria-name="yeniTeklifKurulumKatsayi" value="0">

                        </div>
                       
                    </div> -->
                    <div class="col-6 mt-2">
                        <div class="input-group" aria-name="yeniTekliflokasyonContainer">
                            
                            <div class="input-group-btn">
                                <button class="btn btn-info" >
                                lokasyon
                                </button>
                            </div>
                            <input type="text" name="yeniTekliflokasyon" placeholder="Lokasyon" class="form-control" aria-name="yeniTekliflokasyon">

                        </div>
                    </div>
                   <!-- <div class="col-lg-6">
                        <div class="checkbox pl-4">
                            <input type="checkbox" aria-name="yeniTeklifKurulumUcretlimi" name="yeniTeklifKurulumUcretlimi" value="evet" class="form-check-input">
                            <label for="checkbox1" class="form-check-label ">
                                Kurulum Ücretli
                            </label>
                        </div>
                    </div> -->
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>
               
            </div>
        </div>
    </div>
</div>