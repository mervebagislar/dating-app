<div class="modal fade" id="modal-Masraf-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Masraf-Ekle">
                <i class="fa-solid fa-circle-plus text-success"></i> Masraf Kartı Oluştur
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-Masraf-Ekle">
                <form novalidate="novalidate" id="masrafEkleForm">

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="masrafEkleAdi" class="control-label mb-1">Kart Adı</label>
                                <input id="masrafEkleAdi" name="masrafEkleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafEkle">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                         
                            <div class="form-group">
                                <label for="masrafEkleTipi">Fatura Tipi</label>
                                <select class="form-control" id="masrafEkleTipi" name="masrafEkleTipi">
                                    <option selected disabled>Fatura tipi seçin</option>
                                    <option value="Faturasız">Faturasız</option>
                                    <option value="Fiş-Makbuz">Fiş - Makbuz</option>
                                    <option value="E-Arşiv">E-Arşiv</option>
                                    <option value="E-Fatura">E-Fatura</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row d-none" id="masrafEkleFaturaDetay">
                        <div class="col-sm-6">
                            <div class="input-group mb-3">
                                
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input mt-2" id="masrafEkleDosya" name="masrafEkleDosya" aria-describedby="masrafEkleDosya">
                                    <label class="custom-file-label" for="masrafEkleDosya">Dosya Seçin</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="input-group">
                                <input id="masrafEkleFaturaNo" name="masrafEkleFaturaNo" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafEkle">
                                <div class="input-group-append">
                                    <span class="input-group-text">Fatura No</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label>Fatura Tarihi:</label>
                                <div class="input-group date" id="masrafEkleEkleFaturaTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#masrafEkleEkleFaturaTarihi" name="masrafEkleEkleFaturaTarihi" aria-clear="masrafEkle">
                                    <div class="input-group-append" data-target="#masrafEkleEkleFaturaTarihi" data-toggle="datetimepicker">
                                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="masrafEkleFaturaTutari" class="control-label mb-1">Fatura Tutarı</label>
                                <div class="input-group">
                                    <input id="masrafEkleFaturaTutari" name="masrafEkleFaturaTutari" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafEkle">
                                    <div class="input-group-append">
                                       
                                            <select name="masrafEkleparaBirimi" id="masrafEkleparaBirimi" class="custom-select">
                                                <option value="try" selected>₺</option>
                                                <option value="usd">$</option>
                                                <option value="eur">€</option>
                                            </select>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 d-none" id="masrafEkleKurDetay">
                            <div class="form-group">
                                <label for="masrafEkleKur" class="control-label mb-1">Kur</label>
                                <input id="masrafEkleKur" name="masrafEkleKur" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafEkle">
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                <label aria-name="ekleRadioIsMasrafi" class="btn btn-outline-info">
                                    <input type="radio" id="masrafEkleIsSecim1" name="masrafEkleIsSecim" value="1"> İş Harcaması
                                </label>
                                <label aria-name="ekleRadioDigerMasraf" class="btn btn-outline-secondary active">
                                    <input type="radio" id="masrafEkleIsSecim2" value="0" name="masrafEkleIsSecim" checked=""> Diğer Harcama
                                </label>
                            </div>

                        </div>
                        <div class="col-sm-6 d-none" id="masrafEkleIsDetay">
                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="İş seçiniz">
                                        
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="masrafEkleIs">
                                        İşler
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="masrafEkleIs" name="masrafEkleIs" data-placeholder="İş seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mt-2">
                        <div class="col-sm-6">

                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Ödeme Grubu seçiniz">
                                        
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="masrafEkleOdemeGrubu">
                                        Ödeme Grubu
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="masrafEkleOdemeGrubu" name="masrafEkleOdemeGrubu" data-placeholder="Ödeme Grubu seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                         <div class="col-sm-6 d-none" id="masrafEkleOdemeTuruDetay">

                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Ödeme Türü seçiniz">
                                        
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="masrafEkleOdemeTuru">
                                        Ödeme Türü
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="masrafEkleOdemeTuru" name="masrafEkleOdemeTuru" data-placeholder="Ödeme Türü seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                             <div class="form-group">
                                <label for="exampleFormControlTextarea1">Notlar</label>
                                <textarea class="form-control" id="masrafEkleNot" name="masrafEkleNot" rows="3" aria-clear="masrafEkle"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 d-none" id="masrafEklePdfDetay">
                            
                            <iframe src="" title="description" id="masrafEklePdf"  width="100%" height="500" style="height: 85vh;"></iframe>
                        </div>
                        <div class="col-sm-12 d-none" id="masrafEkleImageDetay">
                            <img src="../assets/bankalar/0.png" alt="..." class="img-thumbnail" aria-name="masrafEkleImage"  aria-clear="masrafEkle">
                        </div>
                    </div>
                    <div>
                        <input type="hidden" id="masrafEkleDosyaTuru" name ="masrafEkleDosyaTuru" class="form-control" value="" aria-clear="masrafEkle">
                        <input type="hidden" id="masrafEkleDosyaYolu" name ="masrafEkleDosyaYolu" class="form-control" value="" aria-clear="masrafEkle">
                        <button id="masrafEkleKaydetButton" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="masrafEkleKaydetButtonGonder" class="yok">Masraf Kartı Kaydet</span>
                        <span id="masrafEkleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
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