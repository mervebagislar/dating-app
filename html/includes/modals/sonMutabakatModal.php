<div class="modal fade" id="modal-SonMutabakat-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-modal-SonMutabakat-Ekle">
                    <i class="fa-solid fa-person-circle-plus text-success mr-1"></i> <span aria-name="mutabakatTeklifAdi"></span> Son Mutabakatı
                </h4>
            </div>
            <div class="modal-body" id="modal-body-modal-SonMutabakat-Ekle">
                <form novalidate="novalidate" id="mutabakatEkleForm">
                    
                    <div class="row">
                        <div class="col-sm-6">
                             <div class="form-group">
                                <label for="mutabakatTeklifTutari" class="control-label mb-1">Teklif Tutarı</label>
                                <div class="input-group">
                                    <input aria-name="mutabakatTeklifTutari"  name="mutabakatTeklifTutari" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="mutabakatEkle">
                                    <div class="input-group-append">
                                       
                                            <select name="mutabakatTeklifparaBirimi" aria-name="mutabakatTeklifparaBirimi" class="custom-select">
                                                <option value="try" selected="">₺</option>
                                                <option value="usd">$</option>
                                                <option value="eur">€</option>
                                            </select>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="form-group">
                                <label for="mutabakatFaturaTutari" class="control-label mb-1">Fatura Tutarı</label>
                                <div class="input-group">
                                    <input aria-name="mutabakatFaturaTutari" name="mutabakatFaturaTutari" type="text" class="form-control" aria-required="true" aria-invalid="false" aria-clear="mutabakatEkle" required>
                                    <div class="input-group-append">
                                       
                                            <select name="mutabakatFaturaparaBirimi" aria-name="mutabakatFaturaparaBirimi" class="custom-select">
                                                <option value="try" selected="">₺</option>
                                                <option value="usd">$</option>
                                                <option value="eur">€</option>
                                            </select>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   <div class="row">
                        <div class="col-sm-6">

                          <div class="input-group mb-3">
                                
                              <div class="custom-file">
                                  <input type="file" class="custom-file-input mt-2" id="mutabakatDosya" name="mutabakatDosya" aria-describedby="masrafEkleDosya" accept=".pdf,.jpg,.jpeg,.png,.xls,.xlsx">
                                  <label class="custom-file-label" for="mutabakatDosya">Dosya Seçin</label>
                              </div>
                          </div>
                           
                        </div>
                   </div>
                   <div class="row mb-2">
                        <div class="col-sm-12 d-none" id="mutabakatPdfDetay">
                            
                            <iframe src="" title="description" id="mutabakatPdf"  width="100%" height="500" style="height: 85vh;"></iframe>
                        </div>
                        <div class="col-sm-12 d-none" id="mutabakatImageDetay">
                            <img src="../assets/bankalar/0.png" alt="..." class="img-thumbnail" aria-name="mutabakatImage">
                        </div>
                        <div class="col-sm-12 d-none" id="mutabakatXLSDetay">
                            <a aria-name="masrafEkleXls" href="" class="btn btn-lg btn-info btn-block" target="_blank"><i class="fa-solid fa-file-excel mr-2"></i> Mutabakat dosyasını indir</a>
                            
                        </div>
                    </div>
                   
                    
                    <div>
                        <input type="hidden" aria-name="mutabakatDuzenle" name="mutabakatDuzenle" value="" aria-clear="mutabakatEkle">
                        <button id="mutabakatEkleButtonKaydet" class="btn btn-lg btn-success btn-block">
                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                        <span id="mutabakatEkleButtonGonder">Son Mutabakat Kaydet</span>
                        <span id="mutabakatEkleButtonBekle" class="d-none">Kaydediliyor</span>
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