<div class="modal fade" id="modal-Acenta-Duzenle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Acenta-Duzenle">
                <i class="fa-solid fa-pen-to-square text-warning mr-1"></i> Acenta Düzenle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-Acenta-Duzenle">
                <form novalidate="novalidate" id="acentaDuzenleForm">
                    <div class="form-group">
                        <label for="acentaAdiDuzenle" class="control-label mb-1">Acenta Adı</label>
                        <input id="acentaAdiDuzenle" name="acentaAdiDuzenle" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear='acentaDuzenle'>
                    </div>
                    <div class="form-group">
                        <label for="acentaAdresiDuzenle" class="control-label mb-1">Acenta Adresi</label>
                        <input id="acentaAdresiDuzenle" name="acentaAdresiDuzenle" type="text" class="form-control cc-name valid" aria-clear='acentaDuzenle' value="asd">
                        <span class="help-block field-validation-valid" data-valmsg-for="acentaAdresiDuzenle" data-valmsg-replace="true"></span>
                    </div>
                    <div class="form-group">
                        <label for="acentaTelefonuDuzenle" class="control-label mb-1">Acenta Telefonu</label>
                        <input id="acentaTelefonuDuzenle" name="acentaTelefonuDuzenle" type="tel" class="form-control cc-number identified visa" value="" autocomplete="acentaTelefonu" aria-clear='acentaDuzenle'>
                        <span class="help-block" data-valmsg-for="acentaTelefonuDuzenle" data-valmsg-replace="true"></span>
                    </div>
                    <div class="form-group">
                        <label for="acentaFaturaBaslikDuzenle" class="control-label mb-1">Fatura Başlığı</label>
                        <input id="acentaFaturaBaslikDuzenle" name="acentaFaturaBaslikDuzenle" type="text" class="form-control cc-name valid" aria-clear='acentaDuzenle'>
                        <span class="help-block field-validation-valid" data-valmsg-for="acentaFaturaBaslikDuzenle" data-valmsg-replace="true"></span>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaVergiDairesiDuzenle" class="control-label mb-1">Vergi Dairesi</label>
                                <input id="acentaVergiDairesiDuzenle" name="acentaVergiDairesiDuzenle" type="text" class="form-control cc-exp" value="" autocomplete="acentaVergiDairesi" aria-clear='acentaDuzenle'>
                                <span class="help-block" data-valmsg-for="acentaVergiDairesiDuzenle" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-6">
                            <label for="acentaVergiNoDuzenle" class="control-label mb-1">Vergi No</label>
                            <div class="input-group">
                                <input id="acentaVergiNoDuzenle" name="acentaVergiNoDuzenle" type="tel" class="form-control cc-cvc" value="" autocomplete="acentaVergiNo" aria-clear='acentaDuzenle'>

                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaIlDuzenle" class="control-label mb-1">İl</label>
                                <input id="acentaIlDuzenle" name="acentaIl" type="text" class="form-control cc-exp" value="" autocomplete="acentaIl" aria-clear='acentaDuzenle'>
                                <span class="help-block" data-valmsg-for="acentaIlDuzenle" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaIlceDuzenle" class="control-label mb-1">İlçe</label>
                                <input id="acentaIlceDuzenle" name="acentaIlce" type="text" class="form-control cc-exp" value="" autocomplete="acentaIlce" aria-clear='acentaDuzenle'>
                                <span class="help-block" data-valmsg-for="acentaIlceDuzenle" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaWebDuzenle" class="control-label mb-1">Web Sitesi</label>
                                <input id="acentaWebDuzenle" name="acentaWeb" type="text" class="form-control cc-exp" value="" autocomplete="acentaWeb" aria-clear='acentaDuzenle'>
                                <span class="help-block" data-valmsg-for="acentaWebDuzenle" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="form-group">
                                <label for="acentaEpostaDuzenle" class="control-label mb-1">E-Posta</label>
                                <input id="acentaEpostaDuzenle" name="acentaEposta" type="text" class="form-control cc-exp" value="" autocomplete="acentaEposta" aria-clear='acentaDuzenle'>
                                <span class="help-block" data-valmsg-for="acentaEpostaDuzenle" data-valmsg-replace="true"></span>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Firma Grubu seçiniz">
                                
                        <div class="input-group-prepend">
                            <div class="input-group-btn">
                                <button class="btn btn-default" type="button" data-select2-open="AcentaDuzenleGrupAra">
                                Firma Grubu
                                </button>
                            </div>
                        </div>
                        <select class="form-control-sm  input-sm" id="AcentaDuzenleGrupAra" name="AcentaDuzenleGrupAra" data-placeholder="Firma Grubu seçiniz" tabindex="-1" aria-hidden="true">
                        
                        </select>
                    </div>
                    <div>
                        <input id="AcenteIDDuzenle" type="hidden">
                        <button id="acentaKaydetDuzenleButton" class="btn btn-lg btn-warning btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="acentaKaydetButtonDuzenleGonder">Acenta Düzenle</span>
                        <span id="acentaKaydetButtonDuzenleBekle" class="d-none">Kaydediliyor</span>
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