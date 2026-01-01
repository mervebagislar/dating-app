<div class="modal fade" id="modal-Teklif-AcentaCalisanSec">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Teklif-AcentaCalisanSec">
                <i class="fa-solid fa-file-invoice text-success mr-1"></i><span id="AcentaCalisanSecBaslik"></span> Teklif Hazırla
                </h4>
                
            </div>
            <div class="modal-body" id="modal-body-Teklif-AcentaCalisanSec">
                <div class="row mb-2">
                    <div class="col-sm-6">
                        <div class="form-group">
                            <label for="acentaAdi" class="control-label mb-1">Firma</label>
                            <select class="form-control" id="teklifAcentaSec" name="teklifAcentaSec" data-placeholder="Firma seçiniz" tabindex="-1" aria-hidden="true" >

                            </select>
                        </div>
                    </div>
                    <div class="col-sm-6 d-none" aria-name="teklifCalisanContainer">
                            <div class="form-group">
                                <label for="acentaAdi" class="control-label mb-1">Çalışan</label>
                                <select class="form-control-sm  input-sm select2bs4 select2-hidden-accessible" id="teklifCalisanSec" name="teklifCalisanSec" data-placeholder="çalışan ara" tabindex="-1" aria-hidden="true">
                        
                            </select>
                        </div>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        
                        <div class="form-group">
                            <label for="acentaAdi" class="control-label mb-1">Teklif Başlığı</label>
                            <input type="text" name="teklifSecAdi" placeholder="Teklif başlığı giriniz" class="form-control">
                        </div>
                    </div>
                </div>
                <div class="row mb-2">
                    <div class="col-12">
                        <div class="card-header" data-toggle="collapse" data-target="#teklifEkleDetayGoster" aria-expanded="false" aria-controls="teklifEkleDetayGoster">
                            <h4>Tarih & Lokasyon</h4> 
                        </div>
                        <div class="card-body collapse" id="teklifEkleDetayGoster">
                            <div class="row mb-2">
                                <div class="col-lg-6">
                                    <label for="" class=" form-control-label">Kurulum Tarihi</label>
                                    <div class="form-group">
                                        <div class="input-group" aria-name="yeniTeklifKurulumTarihi" data-toggle="tooltip" data-placement="top" title="" data-original-title="Kurulum Tarihi seçiniz">
                                            <input type="text" class="form-control" aria-name="yeniTeklifKurulumTarihiGoster" disabled="">
                                            <span class="input-group-addon"><i class="fa-solid fa-calendar-plus"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <label for="" class=" form-control-label">Event Tarihi</label>
                                    <div class="form-group">
                                        <div class="input-group" aria-name="yeniTeklifTarihi" data-toggle="tooltip" data-placement="top" title="" data-original-title="Event Tarihi seçiniz">
                                            <input type="text" class="form-control" aria-name="yeniTeklifTarihiGoster" disabled="">
                                            <span class="input-group-addon"><i class="fa-solid fa-calendar-plus"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <label for="" class=" form-control-label">Termin Tarihi</label>
                                    <div class="form-group">
                                        <div class="input-group date input-group-sm" id="yeniTerminTarihi" data-target-input="nearest">
                                            <input type="text" class="form-control datetimepicker-input" data-target="#yeniTerminTarihi" aria-name="yeniTerminTarihi" name="yeniTerminTarihi"  placeholder="Termin Tarihi">
                                            <div class="input-group-append" data-target="#yeniTerminTarihi" data-toggle="datetimepicker">
                                                <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                     <label for="" class=" form-control-label">Lokasyon</label>
                                    <input type="text" name="yeniTekliflokasyon" placeholder="Lokasyon" class="form-control" aria-name="yeniTekliflokasyon">
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-12">
                        <button id="teklifAcentaCalisanDevam" class="btn btn-lg btn-success btn-block">
                            <i class="fa-solid fa-arrow-up-right-from-square mr-2"></i>Teklife Devam Et
                        </button>
                    </div>

                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>
               
            </div>
        </div>
    </div>
</div>