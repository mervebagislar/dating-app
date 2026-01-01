<div class="modal fade" id="modal-Calisan-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Calisan-Ekle">
                    <i class="fa-solid fa-person-circle-plus text-success mr-1"></i> Çalışan Ekle
                </h4>
                <div class="input-group ml-4"  data-toggle="tooltip" data-placement="top" title="Aramak istediğiniz Acentayı yazınız">
                                
                    <div class="input-group-prepend">
                    <div class="input-group-btn">
                        <button class="btn btn-default" type="button" data-select2-open="acentaAra">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </button>
                    </div>
                </div>
                    <select class="form-control-sm  input-sm select2bs4 select2-hidden-accessible" id="acentaAra" data-placeholder="acenta ara" tabindex="-1" aria-hidden="true">
                    
                </select>
                </div>
            </div>
            <div class="modal-body" id="modal-body-Calisan-Ekle">
                <h4 class="modal-title mb-2" id="calisanEkleAcentaAdi">

                </h4>
                <form novalidate="novalidate" id="calisanEkleForm">
                   
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="calisanEkleAdi" class="control-label mb-1">Çalışan Adı</label>
                                <input id="calisanEkleAdi" name="calisanEkleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="calisanEkle">
                            </div>
                        </div>
                        
                    </div>
                    <div class="row">
                         <div class="col-sm-6">
                            <div class="form-group">
                                <label for="calisanEklePozisyon" class="control-label mb-1">Çalışan Pozisyonu</label>
                                <input id="calisanEklePozisyon" name="calisanEklePozisyon" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="calisanEkle">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <div class="form-group">
                                <label for="calisanEkleTelefon" class="control-label mb-1">Telefon 1</label>
                                <input id="calisanEkleTelefon" name="calisanEkleTelefon" type="text" class="form-control" value="" autocomplete="calisanEkleTelefon" aria-clear="calisanEkle">
                                <span class="help-block" data-valmsg-for="calisanEkleTelefon" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        
                        <div class="col-4">
                            <div class="form-group">
                                <label for="calisanEkleTelefon2" class="control-label mb-1">Telefon 2</label>
                                <input id="calisanEkleTelefon2" name="calisanEkleTelefon2" type="text" class="form-control" value="" autocomplete="calisanEkleTelefon" aria-clear="calisanEkle">
                                <span class="help-block" data-valmsg-for="calisanEkleTelefon2" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="calisanEkleTelefon3" class="control-label mb-1">Telefon 3</label>
                                <input id="calisanEkleTelefon3" name="calisanEkleTelefon3" type="text" class="form-control" value="" autocomplete="calisanEkleTelefon" aria-clear="calisanEkle">
                                <span class="help-block" data-valmsg-for="calisanEkleTelefon3" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="calisanEkleEposta" class="control-label mb-1">Eposta 1</label>
                            <div class="input-group">
                                <input id="calisanEkleEposta" name="calisanEkleEposta" type="text" class="form-control" value="" autocomplete="calisanEkleEposta" aria-clear="calisanEkle">

                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="calisanEkleEposta2" class="control-label mb-1">Eposta 2</label>
                                <input id="calisanEkleEposta2" name="calisanEkleEposta2" type="text" class="form-control" value="" autocomplete="calisanEkleEposta2" aria-clear="calisanEkle">
                                <span class="help-block" data-valmsg-for="calisanEkleEposta2" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">

                        <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                            <label aria-name="ekleRadioCalisiyor" class="btn btn-outline-success active">
                                <input type="radio" name="options" id="calisanEkleDurum1" name="calisanEkleDurum" checked> Çalışıyor
                            </label>
                            <label aria-name="ekleRadioAyrildi" class="btn btn-outline-danger">
                                <input type="radio" id="calisanEkleDurum2" name="calisanEkleDurum"> Ayrıldı
                            </label>
                        </div>


                        
                    </div>
                    <div class="row">
                         <div class="col-sm-12">
                            <div class="form-group">
                                <label for="calisanEkleNot" class="control-label mb-1">Çalışan notları</label>
                                <textarea name="calisanEkleNot" id="calisanEkleNot" rows="4" placeholder="Çalışanla ilgili notları bu alana giriniz" class="form-control" aria-clear="calisanEkle"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input type="hidden" id="calisanEkleAcenta" value="" aria-clear="calisanEkle">
                        <button id="calisanEkleButtonKaydet" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="calisanEkleButtonGonder">Çalışan Kaydet</span>
                        <span id="calisanEkleButtonBekle" class="d-none">Kaydediliyor</span>
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