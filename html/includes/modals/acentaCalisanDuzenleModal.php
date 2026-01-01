<div class="modal fade" id="modal-Acenta-Calisan-Duzenle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Acenta-Calisan-Duzenle">
                <i class="fa-solid fa-pen-to-square text-warning mr-1"></i> Çalışan Düzenle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-Acenta-Calisan-Duzenle">
                <form novalidate="novalidate" id="acentaCalisanDuzenleForm">
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="calisanDuzenleAdi" class="control-label mb-1">Çalışan Adı</label>
                                <input id="calisanDuzenleAdi" name="calisanDuzenleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="calisanDuzenle">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="calisanDuzenlePozisyon" class="control-label mb-1">Çalışan Pozisyonu</label>
                                <input id="calisanDuzenlePozisyon" name="calisanDuzenlePozisyon" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="calisanDuzenle">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <div class="form-group">
                                <label for="calisanDuzenleTelefon" class="control-label mb-1">Telefon 1</label>
                                <input id="calisanDuzenleTelefon" name="calisanDuzenleTelefon" type="text" class="form-control" value="" autocomplete="calisanDuzenleTelefon" aria-clear="calisanDuzenle">
                                <span class="help-block" data-valmsg-for="calisanDuzenleTelefon" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                         <div class="col-4">
                            <div class="form-group">
                                <label for="calisanDuzenleTelefon2" class="control-label mb-1">Telefon 2</label>
                                <input id="calisanDuzenleTelefon2" name="calisanDuzenleTelefon2" type="text" class="form-control" value="" autocomplete="calisanDuzenleTelefon" aria-clear="calisanDuzenle">
                                <span class="help-block" data-valmsg-for="calisanDuzenleTelefon2" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="form-group">
                                <label for="calisanDuzenleTelefon3" class="control-label mb-1">Telefon 3</label>
                                <input id="calisanDuzenleTelefon3" name="calisanDuzenleTelefon3" type="text" class="form-control" value="" autocomplete="calisanDuzenleTelefon" aria-clear="calisanDuzenle">
                                <span class="help-block" data-valmsg-for="calisanDuzenleTelefon3" data-valmsg-replace="true"></span>
                            </div>
                        </div>

                        
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <label for="calisanDuzenleEposta" class="control-label mb-1">Eposta 1</label>
                            <div class="input-group">
                                <input id="calisanDuzenleEposta" name="calisanDuzenleEposta" type="text" class="form-control" value="" autocomplete="calisanDuzenleEposta" aria-clear="calisanDuzenle">

                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="calisanDuzenleEposta2" class="control-label mb-1">Eposta 2</label>
                                <input id="calisanDuzenleEposta2" name="calisanDuzenleEposta2" type="text" class="form-control" value="" autocomplete="calisanDuzenleEposta2" aria-clear="calisanEkle">
                                <span class="help-block" data-valmsg-for="calisanDuzenleEposta2" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">

                        <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                            <label aria-name="duzenleRadioCalisiyor" class="btn btn-outline-success">
                                <input type="radio" aria-name="calisanDuzenleDurum1" id="calisanDuzenleDurum1" name="calisanDuzenleDurum" value="1"> Çalışıyor
                            </label>
                            <label aria-name="duzenleRadioAyrildi" class="btn btn-outline-danger">
                                <input type="radio" aria-name="calisanDuzenleDurum2" id="calisanDuzenleDurum2" name="calisanDuzenleDurum" value="0"> Ayrıldı
                            </label>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label for="calisanDuzenleNot" class="control-label mb-1">Çalışan notları</label>
                                <textarea name="calisanDuzenleNot" id="calisanDuzenleNot" rows="4" placeholder="Çalışanla ilgili notları bu alana giriniz" class="form-control" aria-clear="calisanDuzenle"></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input type="hidden" id="calisanDuzenleAcenta" value="" aria-clear="calisanDuzenle">
                        <input type="hidden" id="calisanDuzenleID" value="" aria-clear="calisanDuzenle">
                        <button id="calisanDuzenleButtonKaydet" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="calisanDuzenleButtonGonder">Çalışan Kaydet</span>
                        <span id="calisanDuzenleButtonBekle" class="d-none">Kaydediliyor</span>
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