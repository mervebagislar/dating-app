<div class="modal fade" id="modal-Kasa-Duzenle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Kasa-Duzenle">
                    <i class="fa-solid fa-person-circle-plus text-success mr-1"></i> Kasa Düzenle
                </h4>
            </div>
            <div class="modal-body" id="modal-body-Kasa-Duzenle">
                
                <form novalidate="novalidate" id="kasaDuzenleForm">
                   
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="kasaDuzenleAdi" class="control-label mb-1">Kasa Adı</label>
                                <input id="kasaDuzenleAdi" name="kasaDuzenleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaDuzenle">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <label for="kasaDuzenleDurum" class="control-label mb-1">Kasa Şekli</label>
                            <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                <label aria-name="kasaDuzenleRadioBanka" class="btn btn-outline-info">
                                    <input type="radio" id="kasaDuzenleDurum1" name="kasaDuzenleDurum" value="1"> Banka
                                </label>
                                <label aria-name="kasaDuzenleRadioNakit" class="btn btn-outline-info active">
                                    <input type="radio" id="kasaDuzenleDurum2" value="0" name="kasaDuzenleDurum" checked> Nakit
                                </label>
                            </div>
                        </div>
                        
                    </div>
                    <span id="kasaDuzenleBankaDetay" class="d-none">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                            <label for="kasaDuzenleIBAN" class="control-label mb-1">IBAN</label>
                                <input id="kasaDuzenleIBAN" name="kasaDuzenleIBAN" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaDuzenle">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <img src="../assets/bankalar/0.png" alt="..." class="img-thumbnail" aria-name="kasaDuzenleImage">
                        </div>
                        <div class="col-sm-6">
                            
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="kasaDuzenleBankaAdi" class="control-label mb-1">Banka Adı</label>
                                    <input id="kasaDuzenleBankaAdi" name="kasaDuzenleBankaAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaDuzenle">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="kasaDuzenleHesapNo" class="control-label mb-1">Hesap No</label>
                                    <input id="kasaDuzenleHesapNo" name="kasaDuzenleHesapNo" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaDuzenle">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="kasaDuzenleBankaKodu" class="control-label mb-1">Banka Kodu</label>
                                    <input id="kasaDuzenleBankaKodu" name="kasaDuzenleBankaKodu" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaDuzenle">
                                </div>
                            </div>

                        </div>
                    </div>
                    
                    </span>
                    <div>
                        <input type="hidden" id="kasaDuzenleID" class="form-control" value="" aria-clear="kasaDuzenle">
                        <button id="kasaDuzenleButtonKaydet" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="kasaDuzenleButtonGonder">Kasa Kaydet</span>
                        <span id="kasaDuzenleButtonBekle" class="d-none">Kaydediliyor</span>
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