<div class="modal fade" id="modal-Hizmet-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Hizmet-Ekle">
                <i class="fa-solid fa-circle-plus text-success"></i> Hizmet Ekle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-Hizmet-Ekle">
                <form novalidate="novalidate" id="hizmetEkleForm">
                    <div class="form-group">
                        <label for="hizmetEkleAdi" class="control-label mb-1">Hizmet Adı</label>
                        <input id="hizmetEkleAdi" name="hizmetEkleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear='hizmetEkle'>
                    </div>
                    <div class="form-group">
                        <label for="hizmetEkleFiyat" class="control-label mb-1">Birim Fiyat</label>
                        <input id="hizmetEkleFiyat" name="hizmetEkleFiyat" type="number" class="form-control valid"  aria-clear='hizmetEkle'>
                    </div>
                    <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Ekipman Grubu seçiniz">
                                
                        <div class="input-group-prepend">
                            <div class="input-group-btn">
                                <button class="btn btn-default" type="button" data-select2-open="hizmetEkleGrupAra">
                                <i class="fa-solid fa-briefcase"></i>
                                </button>
                            </div>
                        </div>
                        <select class="form-control-sm  input-sm select2bs4 select2-hidden-accessible" id="hizmetEkleGrupAra" name="hizmetEkleGrupAra" data-placeholder="Hizmet Grubu seçiniz" tabindex="-1" aria-hidden="true">
                        
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="hizmetEkleNot" class="control-label mb-1">Hizmet notları</label>
                        <textarea name="hizmetEkleNot" id="hizmetEkleNot" rows="4" placeholder="Ekipman / Hizmet ile ilgili notları bu alana giriniz" class="form-control" aria-clear="hizmetEkle"></textarea>
                    </div>
                    <div>
                        <button id="hizmetEkleKaydetButton" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="hizmetEkleKaydetButtonGonder" class="yok">Hizmet Kaydet</span>
                        <span id="hizmetEkleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
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