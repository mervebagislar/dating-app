<div class="modal fade" id="modal-Personel-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Personel-Ekle">
                    <i class="fa-solid fa-person-circle-plus text-success mr-1"></i> Personel Ekle
                </h4>
            </div>
            <div class="modal-body" id="modal-body-Personel-Ekle">
                <form novalidate="novalidate" id="personelEkleForm">
                    
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Personel Departmanı seçiniz">
                                
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="personelDepartmanAra">
                                        Departmanı
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="personelDepartmanAra" name="personelDepartmanAra" data-placeholder="Departman seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Personel Görevi seçiniz">
                                
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="personelGorevAra">
                                        Görev
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="personelGorevAra" name="personelGorevAra" data-placeholder="Görev seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                    </div>
                   <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label for="personelEkleAdi" class="control-label mb-1">Çalışan Adı</label>
                                <input id="personelEkleAdi" name="personelEkleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="personelEkle">
                            </div>
                        </div>
                   </div>
                   <div class="row">
                         <div class="col-sm-12">
                            <div class="form-group">
                                <label for="personelEkleAdres" class="control-label mb-1">Personel Adresi</label>
                                <textarea name="personelEkleAdres" id="personelEkleAdres" rows="2" placeholder="Personel adresi giriniz" class="form-control" aria-clear="personelEkle"></textarea>
                            </div>
                        </div>
                   </div>
                    <hr>
                   <hr>
                   <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelEkleTelefon1" class="control-label mb-1">Telefon 1</label>
                                <input id="personelEkleTelefon1" name="personelEkleTelefon1" type="text" class="form-control" value="" autocomplete="personelEkleTelefon" aria-clear="personelEkle">
                                <span class="help-block" data-valmsg-for="personelEkleTelefon1" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelEkleTelefon2" class="control-label mb-1">Telefon 2</label>
                                <input id="personelEkleTelefon2" name="personelEkleTelefon2" type="text" class="form-control" value="" autocomplete="personelEkleTelefon2" aria-clear="personelEkle">
                                <span class="help-block" data-valmsg-for="personelEkleTelefon2" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                   </div>
                   <div class="row">
                        <div class="col-6">
                            <label for="personelEkleEposta" class="control-label mb-1">Eposta</label>
                            <div class="input-group">
                                <input id="personelEkleEposta" name="personelEkleEposta" type="text" class="form-control" value="" autocomplete="personelEkleEposta" aria-clear="personelEkle">

                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                            <label>Doğum Tarihi:</label>
                                <div class="input-group date" id="personelEkleDogumTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#personelEkleDogumTarihi" name="personelEkleDogumTarihi" aria-clear="personelEkle">
                                    <div class="input-group-append" data-target="#personelEkleDogumTarihi" data-toggle="datetimepicker">
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
                                <label for="personelEkleTC" class="control-label mb-1">T.C. No</label>
                                <input id="personelEkleTC" name="personelEkleTC" type="text" class="form-control" value="" autocomplete="personelEkleTC" aria-clear="personelEkle">
                                <span class="help-block" data-valmsg-for="personelEkleTC" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelEklePasaport" class="control-label mb-1">Pasaport No</label>
                                <input id="personelEklePasaport" name="personelEklePasaport" type="text" class="form-control" value="" autocomplete="personelEklePasaport" aria-clear="personelEkle">
                                <span class="help-block" data-valmsg-for="personelEklePasaport" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                   </div>
                   <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="personelEkleEhliyet" class="control-label mb-1">Ehliyet</label>
                                <input id="personelEkleEhliyet" name="personelEkleEhliyet" type="text" class="form-control" value="" autocomplete="personelEkleEhliyet" aria-clear="personelEkle">
                                <span class="help-block" data-valmsg-for="personelEkleEhliyet" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <label for="personelEkleDurum" class="control-label mb-1">Çalışma Durumu</label>
                            <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                <label aria-name="ekleRadioCalisiyor" class="btn btn-outline-success active">
                                    <input type="radio" id="personelEkleDurum1" name="personelEkleDurum" value="1" checked> Çalışıyor
                                </label>
                                <label aria-name="ekleRadioAyrildi" class="btn btn-outline-danger">
                                    <input type="radio" id="personelEkleDurum2" value="0" name="personelEkleDurum"> Ayrıldı
                                </label>
                            </div>
                        </div>
                   
                        
                    </div>
                    
                    <div>
                        <input type="hidden" id="personelEkle" value="" aria-clear="personelEkle">
                        <button id="personelEkleButtonKaydet" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="personelEkleButtonGonder">Personel Kaydet</span>
                        <span id="persoenlEkleButtonBekle" class="d-none">Kaydediliyor</span>
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