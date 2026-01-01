<div class="modal fade" id="modal-Hizmet-Duzenle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Hizmet-Duzenle">
                <i class="fa-solid fa-pen-to-square text-warning mr-1"></i> Hizmet Duzenle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-Hizmet-Duzenle">
                <form novalidate="novalidate" id="hizmetDuzenleForm">
                    <div class="form-group">
                        <label for="hizmetDuzenleAdi" class="control-label mb-1">Hizmet Adı</label>
                        <input id="hizmetDuzenleAdi" name="hizmetDuzenleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear='hizmetDuzenle'>
                    </div>
                    <div class="form-group">
                        <label for="hizmetDuzenleFiyat" class="control-label mb-1">Birim Fiyat</label>
                        <input id="hizmetDuzenleFiyat" name="hizmetDuzenleFiyat" type="number" class="form-control valid"  aria-clear='hizmetDuzenle'>
                    </div>
                    <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Hizmet Grubu seçiniz">
                                
                        <div class="input-group-prepend">
                            <div class="input-group-btn">
                                <button class="btn btn-default" type="button" data-select2-open="hizmetDuzenleGrupAra">
                                <i class="fa-solid fa-briefcase"></i>
                                </button>
                            </div>
                        </div>
                        <select class="form-control-sm  input-sm select2bs4 select2-hidden-accessible" id="hizmetDuzenleGrupAra" name="hizmetDuzenleGrupAra" data-placeholder="Ekipman Grubu seçiniz" tabindex="-1" aria-hidden="true">
                        
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="hizmetDuzenleNot" class="control-label mb-1">Hizmet notları</label>
                        <textarea name="hizmetDuzenleNot" id="hizmetDuzenleNot" rows="4" placeholder="Ekipman / Hizmet ile ilgili notları bu alana giriniz" class="form-control" aria-clear="hizmetDuzenle"></textarea>
                    </div>
                    <div>
                        <input id="hizmetDuzenleID" type="hidden">
                        <button id="hizmetDuzenleKaydetButton" class="btn btn-lg btn-warning btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="hizmetDuzenleKaydetButtonGonder">Hizmet Kaydet</span>
                        <span id="hizmetDuzenleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
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