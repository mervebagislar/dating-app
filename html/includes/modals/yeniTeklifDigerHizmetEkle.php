<div class="modal fade" id="modal-yeniTeklif-digerHizmetEkle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-yeniTeklif-digerHizmetEkle">
                <i class="fa-solid fa-pen-to-square text-warning mr-1"> </i>Diğer Hizmet Ekle
                </h4>
                
            </div>
            <div class="modal-body" id="modal-body-yeniTeklif-digerHizmetEkle">
                <div class="row mb-2">
                    <div class="col-md-4">
                        <label for="yeniTeklifDigerHizmetAdi" class="form-control-label">Hizmet Adı</label>
                        <input type="text" id="yeniTeklifDigerHizmetAdi" class="form-control form-control">
                    </div>
                    <div class="col-md-2">
                        <label for="yeniTeklifDigerHizmetAdet" class="form-control-label">Adet Sayısı</label>
                        <input type="number" id="yeniTeklifDigerHizmetAdet" min="1" class="form-control form-control">
                    </div>
                    <div class="col-md-2">
                        <label for="yeniTeklifDigerHizmetGun" class="form-control-label">Gün Sayısı</label>
                        <input type="number" id="yeniTeklifDigerHizmetGun" min="1" class="form-control form-control">
                    </div>
                    <div class="col-md-2">
                        <label for="yeniTeklifDigerHizmetFiyat" class="form-control-label">Birim Fiyat</label>
                        <input type="number" id="yeniTeklifDigerHizmetFiyat" min="1" class="form-control form-control">
                    </div>
                </div>
                <input type="hidden" value="" id="taslakTeklifdigerHizmetSalonID">
                <input type="hidden" value="" id="taslakTeklifdigerHizmetgrupID">
                <input type="hidden" value="" id="taslakTeklifdigerHizmetgrupAdi">
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-success" aria-name="digerHizmetEkleKaydet" data-dismiss="modal">Kaydet</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>
            </div>
        </div>
    </div>
</div>