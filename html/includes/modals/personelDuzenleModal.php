<div class="modal fade" id="modal-Personel-Duzenle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Personel-Duzenle">
                    <i class="fa-solid fa-person-circle-plus text-success mr-1"></i> Personel Düzenle
                </h4>
            </div>
            <div class="modal-body" id="modal-body-Personel-Duzenle">
                <form novalidate="novalidate" id="personelDuzenleForm">
                    
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Personel Departmanı seçiniz">
                                
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="personelDuzenleDepartman">
                                        Departmanı
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="personelDuzenleDepartman" name="personelDuzenleDepartman" data-placeholder="Departman seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Personel Görevi seçiniz">
                                
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="personelDuzenleGorev">
                                        Görev
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="personelDuzenleGorev" name="personelDuzenleGorev" data-placeholder="Görev seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                    </div>
                   <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label for="personelDuzenleAdi" class="control-label mb-1">Çalışan Adı</label>
                                <input id="personelDuzenleAdi" name="personelDuzenleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="personelDuzenle">
                            </div>
                        </div>
                   </div>
                   <div class="row">
                         <div class="col-sm-12">
                            <div class="form-group">
                                <label for="personelDuzenleAdres" class="control-label mb-1">Personel Adresi</label>
                                <textarea name="personelDuzenleAdres" id="personelDuzenleAdres" rows="2" placeholder="Personel adresi giriniz" class="form-control" aria-clear="personelDuzenle"></textarea>
                            </div>
                        </div>
                   </div>
                    <hr>
                   <hr>
                   <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelDuzenleTelefon1" class="control-label mb-1">Telefon 1</label>
                                <input id="personelDuzenleTelefon1" name="personelDuzenleTelefon1" type="text" class="form-control" value="" autocomplete="personelDuzenleTelefon" aria-clear="personelDuzenle">
                                <span class="help-block" data-valmsg-for="personelDuzenleTelefon1" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelDuzenleTelefon2" class="control-label mb-1">Telefon 2</label>
                                <input id="personelDuzenleTelefon2" name="personelDuzenleTelefon2" type="text" class="form-control" value="" autocomplete="personelDuzenleTelefon2" aria-clear="personelDuzenle">
                                <span class="help-block" data-valmsg-for="personelDuzenleTelefon2" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                   </div>
                   <div class="row">
                        <div class="col-6">
                            <label for="personelDuzenleEposta" class="control-label mb-1">Eposta</label>
                            <div class="input-group">
                                <input id="personelDuzenleEposta" name="personelDuzenleEposta" type="text" class="form-control" value="" autocomplete="personelDuzenleEposta" aria-clear="personelDuzenle">

                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                            <label>Doğum Tarihi:</label>
                                <div class="input-group date" id="personelDuzenleDogumTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#personelDuzenleDogumTarihi" name="personelDuzenleDogumTarihi"  id="personelDuzenleDogumTarihiInput" aria-clear="personelDuzenle">
                                    <div class="input-group-append" data-target="#personelDuzenleDogumTarihi" data-toggle="datetimepicker">
                                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <hr>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="ppersonelDuzenleTC" class="control-label mb-1">T.C. No</label>
                                <input id="personelDuzenleTC" name="personelDuzenleTC" type="text" class="form-control" value="" autocomplete="personelDuzenleTC" aria-clear="personelDuzenle">
                                <span class="help-block" data-valmsg-for="personelDuzenleTC" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelDuzenlePasaport" class="control-label mb-1">Pasaport No</label>
                                <input id="personelDuzenlePasaport" name="personelDuzenlePasaport" type="text" class="form-control" value="" autocomplete="personelDuzenlePasaport" aria-clear="personelDuzenle">
                                <span class="help-block" data-valmsg-for="personelDuzenlePasaport" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                   </div>
                   <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelDuzenleEhliyet" class="control-label mb-1">Ehliyet</label>
                                <input id="personelDuzenleEhliyet" name="personelDuzenleEhliyet" type="text" class="form-control" value="" autocomplete="personelEkleEhliyet" aria-clear="personelDuzenle">
                                <span class="help-block" data-valmsg-for="personelDuzenleEhliyet" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <label for="personelDuzenleDurum" class="control-label mb-1">Çalışma Durumu</label>
                            <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                <label aria-name="personelDuzenleRadioCalisiyor" class="btn btn-outline-success active">
                                    <input type="radio" id="personelDuzenleDurum1" name="personelDuzenleDurum" value="1" checked> Çalışıyor
                                </label>
                                <label aria-name="personelDuzenleRadioAyrildi" class="btn btn-outline-danger">
                                    <input type="radio" id="personelDuzenleDurum2" value="0" name="personelDuzenleDurum"> Ayrıldı
                                </label>
                            </div>
                        </div>
                   
                        
                    </div>
                    
                    <div>
                        <input type="hidden" id="personelDuzenle" class="form-control" value="" aria-clear="personelDuzenle">
                        <button id="personelDuzenleButtonKaydet" class="btn btn-lg btn-warning btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="personelDuzenleButtonGonder">Personel Kaydet</span>
                        <span id="personelDuzenleButtonBekle" class="d-none">Kaydediliyor</span>
                        </button>
                    </div>
                </form>
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>
               
            </div>
        </div>
    </div>
</div>