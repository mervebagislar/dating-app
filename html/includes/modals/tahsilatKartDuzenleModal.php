<div class="modal fade" id="modal-tahsilat-Duzenle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-tahsilat-Duzenle">
                <i class="fa-solid fa-circle-plus text-warning"></i> Tahsilat Kartı Düzenle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-tahsilat-Duzenle">
                <form novalidate="novalidate" id="tahsilatDuzenleForm">

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="tahsilatDuzenleAdi" class="control-label mb-1">Kart Adı</label>
                                <input id="tahsilatDuzenleAdi" name="tahsilatDuzenleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatDuzenle">
                            </div>
                        </div>
                    </div>
                 
                    <div class="row" id="tahsilatDuzenleFaturaDetay">
                        <div class="col-sm-4">
                            <div class="input-group mb-3">
                                
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input mt-2" id="tahsilatDuzenleDosya" name="tahsilatDuzenleDosya" aria-describedby="tahsilatDuzenleDosya">
                                    <label class="custom-file-label" for="tahsilatDuzenleDosya">Dosya Seçin</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="input-group">
                                <input id="tahsilatDuzenleFaturaNo" name="tahsilatDuzenleFaturaNo" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatDuzenle">
                                <div class="input-group-append">
                                    <span class="input-group-text">Fatura No</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label class="control-label mb-2">Fatura Durumu</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="tahsilatDuzenleFaturaDurumu" id="tahsilatDuzenleFaturali" value="faturali" checked>
                                    <label class="form-check-label" for="tahsilatDuzenleFaturali">
                                        <i class="fa fa-file-invoice text-success"></i> Faturalı
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="tahsilatDuzenleFaturaDurumu" id="tahsilatDuzenleFaturasiz" value="faturasiz">
                                    <label class="form-check-label" for="tahsilatDuzenleFaturasiz">
                                        <i class="fa fa-file-o text-warning"></i> Faturasız
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-4">
                            <div class="form-group">
                            <label>Fatura Tarihi:</label>
                                <div class="input-group date" id="tahsilatDuzenleFaturaTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#tahsilatDuzenleFaturaTarihi" name="tahsilatDuzenleFaturaTarihi" id="tahsilatDuzenleFaturaTarihiInput" aria-clear="tahsilatDuzenle">
                                    <div class="input-group-append" data-target="#tahsilatDuzenleFaturaTarihi" data-toggle="datetimepicker">
                                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label for="tahsilatDuzelneFaturaTutari" class="control-label mb-1">Fatura Tutarı</label>
                            <div class="input-group">
                                <input id="tahsilatDuzenleFaturaTutari" name="tahsilatDuzenleFaturaTutari" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatDuzenle">
                                <div class="input-group-append">
                                    
                                        <select name="tahsilatDuzenleparaBirimi" id="tahsilatDuzenleparaBirimi" class="custom-select">
                                            <option value="try" selected>₺</option>
                                            <option value="usd">$</option>
                                            <option value="eur">€</option>
                                        </select>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 d-none" id="tahsilatDuzenleKurDetay">
                            <div class="form-group">
                                <label for="tahsilatDuzenleKur" class="control-label mb-1">Kur</label>
                                
                                <div class="input-group">
                                <input id="tahsilatDuzenleKur" name="tahsilatDuzenleKur" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatDuzenle">
                                <div class="input-group-append">
                                    
                                       <button class="btn btn-default btn-success" type="button" id="tahsilatDuzenleKurYenile">
                                            <i class="fa-solid fa-arrows-rotate"></i>
                                        </button>
                                    
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class = "col-sm-6">
                            <div class="form-group">
                                <label>Vade Tarihi:</label>
                                <div class="input-group date" id="tahsilatDuzenleVadeTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#tahsilatDuzenleVadeTarihi" name="tahsilatDuzenleVadeTarihi" id="tahsilatDuzenleVadeTarihiInput" aria-clear="tahsilatDuzenle">
                                    <div class="input-group-append" data-target="#tahsilatDuzenleVadeTarihi" data-toggle="datetimepicker">
                                        <div class="input-group-text" ><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6" id="tahsilatDuzenleCesitDetay">
                            <div class="form-group">
                                <label>Tahsilat Türü:</label>
                                <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Tahsilat Türü seçiniz">        
                                    <div class="input-group-prepend">
                                        <div class="input-group-btn">
                                            <button class="btn btn-default" type="button" data-select2-open="tahsilatDuzenleOdeme">
                                            
                                            </button>
                                        </div>
                                    </div>
                                    <select class="form-control-sm  input-sm" id="tahsilatDuzenleOdeme" name="tahsilatDuzenleOdeme" data-placeholder="Tahsilat Türü seçiniz" tabindex="-1" aria-hidden="true">
                                    
                                    </select>
                                </div>
                             </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mb-2">
                       
                        <div class="col-sm-6" id="tahsilatDuzenleIsDetay">
                            <div class="form-group">
                                <label for="tahsilatDuzenleIs" class="control-label mb-1">İş Adı</label>
                                <div class="input-group" data-toggle="tooltip" data-placement="top" title="İş seçiniz">
                                    <select class="form-control select2bs4" id="tahsilatDuzenleIs" name="tahsilatDuzenleIs" data-placeholder="İş seçiniz" aria-clear="tahsilatDuzenle">
                                        <option value="">İş seçiniz...</option>
                                    </select>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" data-select2-open="tahsilatDuzenleIs">
                                            <i class="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mt-2">
                        
                         <div class="col-sm-6 d-none" id="tahsilatDuzenleOdemeTuruDetay">

                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Tahsilat Türü seçiniz">
                                        
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="tahsilatDuzenleOdemeTuru">
                                        Tahsilat Türü
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="tahsilatDuzenleOdemeTuru" name="tahsilatDuzenleOdemeTuru" data-placeholder="Ödeme Türü seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                             <div class="form-group">
                                <label for="exampleFormControlTextarea1">Notlar</label>
                                <textarea class="form-control" id="tahsilatDuzenleNot" name="tahsilatDuzenleNot" rows="3" aria-clear="tahsilatDuzenle"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 d-none" id="tahsilatDuzenlePdfDetay">
                            
                            <iframe src="" title="description" id="tahsilatDuzenlePdf"  width="100%" height="500" style="height: 85vh;"></iframe>
                        </div>
                        <div class="col-sm-12 d-none" id="tahsilatDuzenleImageDetay">
                            <img src="../assets/bankalar/0.png" alt="..." class="img-thumbnail" aria-name="tahsilatDuzenleImage"  aria-clear="tahsilatDuzenle">
                        </div>
                    </div>
                    <div>
                        <input type="hidden" id="tahsilatDuzenleDosyaTuru" name ="tahsilatDuzenleDosyaTuru" class="form-control" value="" aria-clear="tahsilatDuzenle">
                        <input type="hidden" id="tahsilatDuzenleDosyaYolu" name ="tahsilatDuzenleDosyaYolu" class="form-control" value="" aria-clear="tahsilatDuzenle">
                        <input type="hidden" id="tahsilatDuzenleID" name ="tahsilatDuzenleID" class="form-control" value="" aria-clear="tahsilatDuzenle">
                        <button id="tahsilatDuzenleKaydetButton" class="btn btn-lg btn-warning btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="tahsilatDuzenleKaydetButtonGonder" class="yok">tahsilat Kartı Kaydet</span>
                        <span id="tahsilatDuzenleKaydetButtonBekle" class="d-none">Kaydediliyor</span>
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