<div class="modal fade" id="modal-Acenta-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Acenta-Ekle">
                <i class="fa-solid fa-circle-plus text-success"></i> Firma Ekle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-Acenta-Ekle">
                <form novalidate="novalidate" id="acentaEkleForm">

                    <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Firma Grubu seçiniz">
                                
                        <div class="input-group-prepend">
                            <div class="input-group-btn">
                                <button class="btn btn-default" type="button" data-select2-open="AcentaEkleGrupAra">
                                Firma Grubu
                                </button>
                            </div>
                        </div>
                        <select class="form-control-sm  input-sm" id="AcentaEkleGrupAra" name="AcentaEkleGrupAra" data-placeholder="Firma Grubu seçiniz" tabindex="-1" aria-hidden="true">
                        
                        </select>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label for="acentaAdi" class="control-label mb-1">Firma Adı</label>
                        <input id="acentaAdi" name="acentaAdi" type="text" class="form-control" aria-required="true" aria-invalid="false">
                    </div>
                    <div class="form-group">
                        <label for="acentaAdresi" class="control-label mb-1">Firma Adresi</label>
                        <input id="acentaAdresi" name="acentaAdresi" type="text" class="form-control cc-name valid">
                        <span class="help-block field-validation-valid" data-valmsg-for="acentaAdresi" data-valmsg-replace="true"></span>
                    </div>
                    <div class="form-group">
                        <label for="acentaTelefonu" class="control-label mb-1">Firma Telefonu</label>
                        <input id="acentaTelefonu" name="acentaTelefonu" type="tel" class="form-control cc-number identified visa" value="" autocomplete="acentaTelefonu">
                        <span class="help-block" data-valmsg-for="acentaTelefonu" data-valmsg-replace="true"></span>
                    </div>
                    <hr>
                    <div class="form-group">
                        <label for="acentaFaturaBaslik" class="control-label mb-1">Fatura Başlığı</label>
                        <input id="acentaFaturaBaslik" name="acentaFaturaBaslik" type="text" class="form-control cc-name valid">
                        <span class="help-block field-validation-valid" data-valmsg-for="acentaFaturaBaslik" data-valmsg-replace="true"></span>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaVergiDairesi" class="control-label mb-1">Vergi Dairesi</label>
                                <input id="acentaVergiDairesi" name="acentaVergiDairesi" type="text" class="form-control cc-exp" value="" autocomplete="acentaVergiDairesi">
                                <span class="help-block" data-valmsg-for="acentaVergiDairesi" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-6">
                            <label for="acentaVergiNo" class="control-label mb-1">Vergi No</label>
                            <div class="input-group">
                                <input id="acentaVergiNo" name="acentaVergiNo" type="tel" class="form-control cc-cvc" value="" autocomplete="acentaVergiNo">

                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaIl" class="control-label mb-1">İl</label>
                                <input id="acentaIl" name="acentaIl" type="text" class="form-control cc-exp" value="" autocomplete="acentaIl">
                                <span class="help-block" data-valmsg-for="acentaIl" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaIlce" class="control-label mb-1">İlçe</label>
                                <input id="acentaIlce" name="acentaIlce" type="text" class="form-control cc-exp" value="" autocomplete="acentaIlce">
                                <span class="help-block" data-valmsg-for="acentaIlce" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaWeb" class="control-label mb-1">Web Sitesi</label>
                                <input id="acentaWeb" name="acentaWeb" type="text" class="form-control cc-exp" value="" autocomplete="acentaWeb">
                                <span class="help-block" data-valmsg-for="acentaWeb" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaEposta" class="control-label mb-1">E-Posta</label>
                                <input id="acentaEposta" name="acentaEposta" type="text" class="form-control cc-exp" value="" autocomplete="acentaEposta">
                                <span class="help-block" data-valmsg-for="acentaEposta" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button id="acentaKaydetButton" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="acentaKaydetButtonGonder">Firma Kaydet</span>
                        <span id="acentaKaydetButtonBekle" class="d-none">Kaydediliyor</span>
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