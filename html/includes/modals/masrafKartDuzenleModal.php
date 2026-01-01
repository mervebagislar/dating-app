<div class="modal fade" id="modal-Masraf-Duzenle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Masraf-Duzenle">
                <i class="fa-solid fa-circle-plus text-warning"></i> Masraf Kartı Düzenle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-Masraf-Duzenle">
                <form novalidate="novalidate" id="masrafDuzenleForm">

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="masrafDuzenleAdi" class="control-label mb-1">Kart Adı</label>
                                <input id="masrafDuzenleAdi" name="masrafDuzenleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafDuzenle">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                         
                            <div class="form-group">
                                <label for="masrafDuzenleTipi">Fatura Tipi</label>
                                <select class="form-control" id="masrafDuzenleTipi" name="masrafDuzenleTipi">
                                    <option selected disabled>Fatura tipi seçin</option>
                                    <option value="Faturasız">Faturasız</option>
                                    <option value="Fiş-Makbuz">Fiş - Makbuz</option>
                                    <option value="E-Arşiv">E-Arşiv</option>
                                    <option value="E-Fatura">E-Fatura</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="row d-none" id="masrafDuzenleFaturaDetay">
                        <div class="col-sm-6">
                            <div class="input-group mb-3">
                                
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input mt-2" id="masrafDuzenleDosya" name="masrafDuzenleDosya" aria-describedby="masrafDuzenleDosya">
                                    <label class="custom-file-label" for="masrafDuzenleDosya">Dosya Seçin</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="input-group">
                                <input id="masrafDuzenleFaturaNo" name="masrafDuzenleFaturaNo" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafDuzenle">
                                <div class="input-group-append">
                                    <span class="input-group-text">Fatura No</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <div class="form-group">
                            <label>Fatura Tarihi:</label>
                                <div class="input-group date" id="masrafDuzenleFaturaTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#masrafDuzenleFaturaTarihi" name="masrafDuzenleFaturaTarihi" id="masrafDuzenleFaturaTarihiInput" aria-clear="masrafDuzenle">
                                    <div class="input-group-append" data-target="#masrafDuzenleFaturaTarihi" data-toggle="datetimepicker">
                                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label for="masrafDuzenleAdi" class="control-label mb-1">Fatura Tutarı</label>
                            <div class="input-group">
                                <input id="masrafDuzenleFaturaTutari" name="masrafDuzenleFaturaTutari" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafDuzenle">
                                <div class="input-group-append">
                                    
                                        <select name="masrafDuzenleparaBirimi" id="masrafDuzenleparaBirimi" class="custom-select">
                                            <option value="try" selected>₺</option>
                                            <option value="usd">$</option>
                                            <option value="eur">€</option>
                                        </select>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 d-none" id="masrafDuzenleKurDetay">
                            <div class="form-group">
                                <label for="masrafDuzenleKur" class="control-label mb-1">Kur</label>
                                
                                <div class="input-group">
                                <input id="masrafDuzenleKur" name="masrafDuzenleKur" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="masrafDuzenle">
                                <div class="input-group-append">
                                    
                                       <button class="btn btn-default btn-success" type="button" id="masrafDuzenleKurYenile">
                                            <i class="fa-solid fa-arrows-rotate"></i>
                                        </button>
                                    
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mb-2">
                        <div class="col-sm-6">
                            <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                <label aria-name="ekleRadioIsMasrafi" class="btn btn-outline-info">
                                    <input type="radio" id="masrafDuzenleIsSecim1" name="masrafDuzenleIsSecim" value="1"> İş Harcaması
                                </label>
                                <label aria-name="ekleRadioDigerMasraf" class="btn btn-outline-secondary active">
                                    <input type="radio" id="masrafDuzenleIsSecim2" value="0" name="masrafDuzenleIsSecim" checked=""> Diğer Harcama
                                </label>
                            </div>

                        </div>
                        <div class="col-sm-6 d-none" id="masrafDuzenleIsDetay">
                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="İş seçiniz">
                                        
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="masrafDuzenleIs">
                                        İşler
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="masrafDuzenleIs" name="masrafDuzenleIs" data-placeholder="İş seçiniz" tabindex="-1" aria-hidden="true">
                                
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
                                        <button class="btn btn-default" type="button" data-select2-open="masrafDuzenleOdemeGrubu">
                                        Ödeme Grubu
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="masrafDuzenleOdemeGrubu" name="masrafDuzenleOdemeGrubu" data-placeholder="Ödeme Grubu seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                         <div class="col-sm-6 d-none" id="masrafDuzenleOdemeTuruDetay">

                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Ödeme Türü seçiniz">
                                        
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="masrafDuzenleOdemeTuru">
                                        Ödeme Türü
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="masrafDuzenleOdemeTuru" name="masrafDuzenleOdemeTuru" data-placeholder="Ödeme Türü seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                             <div class="form-group">
                                <label for="exampleFormControlTextarea1">Notlar</label>
                                <textarea class="form-control" id="masrafDuzenleNot" name="masrafDuzenleNot" rows="3" aria-clear="masrafDuzenle"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 d-none" id="masrafDuzenlePdfDetay">
                            
                            <iframe src="" title="description" id="masrafDuzenlePdf"  width="100%" height="500" style="height: 85vh;"></iframe>
                        </div>
                        <div class="col-sm-12 d-none" id="masrafDuzenleImageDetay">
                            <img src="../assets/bankalar/0.png" alt="..." class="img-thumbnail" aria-name="masrafDuzenleImage"  aria-clear="masrafDuzenle">
                        </div>
                    </div>
                    <div>
                        <input type="hidden" id="masrafDuzenleDosyaTuru" name ="masrafDuzenleDosyaTuru" class="form-control" value="" aria-clear="masrafDuzenle">
                        <input type="hidden" id="masrafDuzenleDosyaYolu" name ="masrafDuzenleDosyaYolu" class="form-control" value="" aria-clear="masrafDuzenle">
                        <input type="hidden" id="masrafDuzenleID" name ="masrafDuzenleID" class="form-control" value="" aria-clear="masrafDuzenle">
                        <button id="masrafDuzenleKaydetButton" class="btn btn-lg btn-warning btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="masrafDuzenleKaydetButtonGonder" class="yok">Masraf Kartı Kaydet</span>
                        <span id="masrafDuzenleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
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