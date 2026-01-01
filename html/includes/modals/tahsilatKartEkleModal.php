<div class="modal fade" id="modal-tahsilat-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-tahsilat-Ekle">
                <i class="fa-solid fa-circle-plus text-success"></i> Tahsilat Kartı Ekle
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-tahsilat-Ekle">
                <form novalidate="novalidate" id="tahsilatEkleForm">

                    <div class="row">
                        <div class="col-12">
                            <div class="form-group">
                                <label for="tahsilatEkleAdi" class="control-label mb-1">Kart Adı</label>
                                <input id="tahsilatEkleAdi" name="tahsilatEkleAdi" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatEkle">
                            </div>
                        </div>
                    </div>
                 
                    <div class="row" id="tahsilatEkleFaturaDetay">
                        <div class="col-sm-4">
                            <div class="input-group mb-3">
                                
                                <div class="custom-file">
                                    <input type="file" class="custom-file-input mt-2" id="tahsilatEkleDosya" name="tahsilatEkleDosya" aria-describedby="tahsilatEkleDosya">
                                    <label class="custom-file-label" for="tahsilatEkleDosya">Dosya Seçin</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="input-group">
                                <input id="tahsilatEkleFaturaNo" name="tahsilatEkleFaturaNo" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatEkle">
                                <div class="input-group-append">
                                    <span class="input-group-text">Fatura No</span>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <div class="form-group">
                                <label class="control-label mb-2">Fatura Durumu</label>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="tahsilatEkleFaturaDurumu" id="tahsilatEkleFaturali" value="faturali" checked>
                                    <label class="form-check-label" for="tahsilatEkleFaturali">
                                        <i class="fa fa-file-invoice text-success"></i> Faturalı
                                    </label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="tahsilatEkleFaturaDurumu" id="tahsilatEkleFaturasiz" value="faturasiz">
                                    <label class="form-check-label" for="tahsilatEkleFaturasiz">
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
                                <div class="input-group date" id="tahsilatEkleFaturaTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#tahsilatEkleFaturaTarihi" name="tahsilatEkleFaturaTarihi" id="tahsilatEkleFaturaTarihiInput" aria-clear="tahsilatEkle">
                                    <div class="input-group-append" data-target="#tahsilatEkleFaturaTarihi" data-toggle="datetimepicker">
                                        <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4">
                            <label for="tahsilatEkleFaturaTutari" class="control-label mb-1">Fatura Tutarı</label>
                            <div class="input-group">
                                <input id="tahsilatEkleFaturaTutari" name="tahsilatEkleFaturaTutari" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatEkle">
                                <div class="input-group-append">
                                    
                                        <select name="tahsilatEkleparaBirimi" id="tahsilatKartEkleparaBirimi" class="custom-select">
                                            <option value="try" selected>₺</option>
                                            <option value="usd">$</option>
                                            <option value="eur">€</option>
                                        </select>
                                    
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-4 d-none" id="tahsilatEkleKurDetay">
                            <div class="form-group">
                                <label for="tahsilatEkleKur" class="control-label mb-1">Kur</label>
                                
                                <div class="input-group">
                                <input id="tahsilatEkleKur" name="tahsilatEkleKur" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="tahsilatEkle">
                                <div class="input-group-append">
                                    
                                       <button class="btn btn-default btn-success" type="button" id="tahsilatKartEkleKurYenile">
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
                                <div class="input-group date" id="tahsilatEkleVadeTarihi" data-target-input="nearest">
                                    <input type="text" class="form-control datetimepicker-input" data-target="#tahsilatEkleVadeTarihi" name="tahsilatEkleVadeTarihi" id="tahsilatEkleVadeTarihiInput" aria-clear="tahsilatEkle">
                                    <div class="input-group-append" data-target="#tahsilatEkleVadeTarihi" data-toggle="datetimepicker">
                                        <div class="input-group-text" ><i class="fa fa-calendar"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6" id="tahsilatEkleCesitDetay">
                            <div class="form-group">
                                <label>Tahsilat Türü:</label>
                                <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Tahsilat Türü seçiniz">        
                                    <div class="input-group-prepend">
                                        <div class="input-group-btn">
                                            <button class="btn btn-default" type="button" data-select2-open="tahsilatEkleOdeme">
                                            
                                            </button>
                                        </div>
                                    </div>
                                    <select class="form-control-sm  input-sm" id="tahsilatEkleOdeme" name="tahsilatEkleOdeme" data-placeholder="Tahsilat Türü seçiniz" tabindex="-1" aria-hidden="true">
                                    
                                    </select>
                                </div>
                             </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mb-2">
                       
                        <div class="col-sm-6" id="tahsilatEkleIsDetay">
                            <div class="form-group">
                                <label for="tahsilatEkleIs" class="control-label mb-1">İş Adı</label>
                                <div class="input-group" data-toggle="tooltip" data-placement="top" title="İş seçiniz">
                                    <select class="form-control select2bs4" id="tahsilatEkleIs" name="tahsilatEkleIs" data-placeholder="İş seçiniz" aria-clear="tahsilatEkle">
                                        <option value="">İş seçiniz...</option>
                                    </select>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-secondary" type="button" data-select2-open="tahsilatEkleIs">
                                            <i class="fa-solid fa-magnifying-glass"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row mt-2">
                        
                         <div class="col-sm-6 d-none" id="tahsilatEkleOdemeTuruDetay">

                            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Tahsilat Türü seçiniz">
                                        
                                <div class="input-group-prepend">
                                    <div class="input-group-btn">
                                        <button class="btn btn-default" type="button" data-select2-open="tahsilatEkleOdemeTuru">
                                        Tahsilat Türü
                                        </button>
                                    </div>
                                </div>
                                <select class="form-control-sm  input-sm" id="tahsilatEkleOdemeTuru" name="tahsilatEkleOdemeTuru" data-placeholder="Ödeme Türü seçiniz" tabindex="-1" aria-hidden="true">
                                
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-12">
                             <div class="form-group">
                                <label for="exampleFormControlTextarea1">Notlar</label>
                                <textarea class="form-control" id="tahsilatKartEkleNot" name="tahsilatEkleNot" rows="3" aria-clear="tahsilatEkle"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-sm-12 d-none" id="tahsilatEklePdfDetay">
                            
                            <iframe src="" title="description" id="tahsilatEklePdf"  width="100%" height="500" style="height: 85vh;"></iframe>
                        </div>
                        <div class="col-sm-12 d-none" id="tahsilatEkleImageDetay">
                            <img src="../assets/bankalar/0.png" alt="..." class="img-thumbnail" aria-name="tahsilatEkleImage"  aria-clear="tahsilatEkle">
                        </div>
                    </div>
                    <div>
                        <input type="hidden" id="tahsilatEkleDosyaTuru" name ="tahsilatEkleDosyaTuru" class="form-control" value="" aria-clear="tahsilatEkle">
                        <input type="hidden" id="tahsilatEkleDosyaYolu" name ="tahsilatEkleDosyaYolu" class="form-control" value="" aria-clear="tahsilatEkle">
                        <button id="tahsilatEkleKaydetButton" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="tahsilatEkleKaydetButtonGonder" class="yok">Tahsilat Kartı Ekle</span>
                        <span id="tahsilatEkleKaydetButtonBekle" class="d-none">Ekleniyor</span>
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
