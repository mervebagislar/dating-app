<div class="modal fade" id="modal-Kasa-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Kasa-Ekle">
                    <i class="fa-solid fa-person-circle-plus text-success mr-1"></i> Kasa Ekle
                </h4>
            </div>
            <div class="modal-body" id="modal-body-Kasa-Ekle">
                
                <form novalidate="novalidate" id="kasaEkleForm">
                   
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="kasaEkleAdi" class="control-label mb-1">Kasa Adı</label>
                                <input id="kasaEkleAdi" name="kasaEkleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaEkle">
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="kasaEkleParaBirimi" class="control-label mb-1">Para Birimi</label>
                                <select id="kasaEkleParaBirimi" name="kasaEkleParaBirimi" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaEkle">
                                    <option value="try">Türk Lirası (₺)</option>    
                                    <option value="usd">Amerikan Doları ($)</option>
                                    <option value="eur">Euro (€)</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <label for="kasaEkleDurum" class="control-label mb-1">Kasa Şekli</label>
                            <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                <label aria-name="kasaEkleRadioBanka" class="btn btn-outline-info">
                                    <input type="radio" id="kasaEkleDurum1" name="kasaEkleDurum" value="1"> Banka
                                </label>
                                <label aria-name="kasaEkleRadioNakit" class="btn btn-outline-info active">
                                    <input type="radio" id="kasaEkleDurum2" value="0" name="kasaEkleDurum" checked> Nakit
                                </label>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="kasaEkleBakiye" class="control-label mb-1">Başlangıç Bakiyesi</label>
                                <input id="kasaEkleBakiye" name="kasaEkleBakiye" type="number" step="0.01" class="form-control" value="0" aria-required="false" aria-invalid="false" aria-clear="kasaEkle">
                            </div>
                        </div>
                    </div>
                    <span id="kasaEkleBankaDetay" class="d-none">
                    <div class="row">
                        <div class="col-sm-12">
                            <div class="form-group">
                                <label for="kasaEkleIBAN" class="control-label mb-1">IBAN</label>
                                <input id="kasaEkleIBAN" name="kasaEkleIBAN" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaEkle">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <img src="../assets/bankalar/0.png" alt="..." class="img-thumbnail" aria-name="kasaEkleImage"  aria-clear="kasaEkle">
                        </div>
                        <div class="col-sm-6">
                            
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="kasaEkleBankaAdi" class="control-label mb-1">Banka Adı</label>
                                    <input id="kasaEkleBankaAdi" name="kasaEkleBankaAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaEkle">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="kasaEkleHesapNo" class="control-label mb-1">Hesap No</label>
                                    <input id="kasaEkleHesapNo" name="kasaEkleHesapNo" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaEkle">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-group">
                                    <label for="kasaEkleBankaKodu" class="control-label mb-1">Banka Kodu</label>
                                    <input id="kasaEkleBankaKodu" name="kasaEkleBankaKodu" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="kasaEkle">
                                </div>
                            </div>

                        </div>
                    </div>
                    
                    </span>
                    <div>
                        <button id="kasaEkleButtonKaydet" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="kasaEkleButtonGonder">Kasa Kaydet</span>
                        <span id="kasaEkleButtonBekle" class="d-none">Kaydediliyor</span>
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