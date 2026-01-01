<div class="modal fade" id="modal-Odeme-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Odeme-Ekle">
                    <i class="fa-solid fa-file-invoice text-success mr-2"></i>
                    <span aria-name="masrafAdi" ></span> Ödeme Ekle
                </h4>
                <span aria-name="modalLoad" class="d-none">
                    hazırlanıyor
                    <span class="fa fa-spinner fa-spin fa-3x"></span>
                </span>
            </div>
            <div class="modal-body d-none" id="modal-body-Odeme-Ekle">
                <div class="row mb-2 border-bottom border-secondary">
                    <div class="col-10">
                        <label class="sr-only" for="inlineFormInputGroup">Masraf Adı</label>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                            <div class="input-group-text">Masraf Adı</div>
                            </div>
                            <input type="text" class="form-control" aria-name="odemeEkleMasrafAdi" placeholder="Masraf Adı" readonly>
                        </div>
                    </div>
                    <div class="col-2">
                        <button type="button" class="btn btn-warning" aria-name="odemeEkleMasrafDuzenle" aria-ID=""><i class="fa-solid fa-pen-to-square mr-2"></i> Düzenle</button>
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header" data-toggle="collapse" data-target="#odemeEkleFaturaBody" aria-expanded="false" aria-controls="odemeEkleFaturaBody">
                        <h4>Fatura Detay</h4> 
                    </div>
                    <div class="card-body collapse" id="odemeEkleFaturaBody">
                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <p class="card-text">Fatura Tipi</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleFaturaTipi" aria-clear-html="odemeEkle"></p>
                            </div>

                            <div class="col-sm-4">
                                <p class="card-text">Fatura No</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleFaturaNo" aria-clear-html="odemeEkle"></p>
                            </div>
                            <div class="col-sm-4">
                                <button type="button" class="btn btn-secondary" aria-name="odemeEkleFaturaGoster" aria-type="" aria-url=""><i class="fa-solid fa-file-invoice mr-2"></i>Fatura Göster</button>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <p class="card-text">Fatura Tarihi</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleEkleFaturaTarihi" aria-clear-html="odemeEkle"></p>
                            </div>
                            <div class="col-sm-4">
                                <p class="card-text" aria-name ="odemeEkleParaBirimi" aria-clear-html="odemeEkle">Kur</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleKur" aria-clear-html="odemeEkle"></p>
                            </div>
                            <div class="col-sm-4">
                                <p class="card-text">Harcama Tipi</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleFaturaHarcama" aria-clear-html="odemeEkle"></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <p class="card-text">Grubu</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleOdemeGrubu" aria-clear-html="odemeEkle"></p>
                            </div>

                            <div class="col-sm-4">
                                <p class="card-text">Çeşidi</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleOdemeCesidi" aria-clear-html="odemeEkle"></p>
                            </div>
                            <div class="col-sm-4">
                                
                                
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header">
                        <h4>Ödeme</h4> 
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-3">
                                <p class="card-text">Toplam Ödeme</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleToplamOdeme" aria-clear-html="odemeEkle"></p>
                            </div>

                            <div class="col-sm-3">
                                <p class="card-text">Yapılan Ödeme</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleYapilanODeme" aria-clear-html="odemeEkle"></p>
                            </div>
                            <div class="col-sm-3">
                                 <p class="card-text">Kalan Ödeme</p>
                                <p class="card-text font-weight-bold" aria-name="odemeEkleKalanODeme" aria-clear-html="odemeEkle"></p>
                            </div>
                            <div class="col-sm-3">
                                
                                <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                    <label aria-name="odemeEkleAcik" class="btn btn-sm btn-outline-danger active">
                                        Açık
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header" data-toggle="collapse" data-target="#odemeEkleEkleBody" aria-expanded="true" aria-controls="odemeEkleEkleBody">
                        <h4>Ödeme Ekle</h4> 
                    </div>
                    <div class="card-body" id="odemeEkleEkleBody">
                        <form novalidate="novalidate" id="masrafOdemeHizliEkleForm">
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="input-group date input-group-sm" id="odemeEkleOdemeTarihi" data-target-input="nearest">
                                        <input type="text" class="form-control datetimepicker-input" data-target="#odemeEkleOdemeTarihi" name="odemeEkleOdemeTarihi" id="odemeEkleOdemeTarihiInput" aria-clear="odemeEkle" placeholder="Ödeme Tarihi">
                                        <div class="input-group-append" data-target="#odemeEkleOdemeTarihi" data-toggle="datetimepicker">
                                            <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5" aria-name="odemeEkleParaDetay">
                                    <div class="input-group input-group-sm mb-2">
                                        <input type="text" class="form-control" name ="odemeEkleYeniODeme" id="odemeEkleYeniODeme" placeholder="Ödeme Miktarı"  aria-clear="odemeEkle">
                                        <div class="input-group-append">
                                            <select name="odemeEkleparaBirimi" id="odemeEkleparaBirimi" class="custom-select custom-select-sm">
                                                <option value="try" selected="">₺</option>
                                                <option value="usd">$</option>
                                                <option value="eur">€</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-2 d-none" aria-name="odemeEkleKurDetay">
                                    <div class="input-group input-group-sm">
                                        <input id="odemeEkleYeniKur" name="odemeEkleYeniKur" type="text" class="form-control" placeholder="Kur" aria-clear="odemeEkle">
                                        <div class="input-group-append">
                                            
                                            <button class="btn btn-default btn-success" type="button" id="odemeEkleKurYenile">
                                                    <i class="fa-solid fa-arrows-rotate"></i>
                                                </button>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-4">
                                    <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Kasa seçiniz">
                                        <select class="form-control" id="odemeEkleKasa" name="odemeEkleKasa" data-placeholder="Kasa seçiniz" tabindex="-1" aria-hidden="true" >
                                        
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-sm-5">
                                    <div class="input-group mb-2">
                                        <div class="input-group-prepend">
                                            <div class="input-group-text">Not:</div>
                                        </div>
                                        <textarea class="form-control" id="odemeEkleNot" name="odemeEkleNot" rows="1" aria-clear="odemeEkle" ></textarea>
                                    </div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                        <label aria-name="odemeEkleYeniAcik" class="btn btn-outline-danger active btn-sm">
                                            <input type="radio" id="odemeEkleOdenmediInput" value="0" name="odemeEkleOdendi" checked=""> Ödenmedi
                                        </label>
                                        <label aria-name="odemeEkleYeniKapali" class="btn btn-outline-success">
                                            <input type="radio" id="odemeEkleOdendiInput" value="1" name="odemeEkleOdendi">Ödendi
                                        </label>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <input type="hidden" id="odemeEkleMasrafID" name ="odemeEkleMasrafID" value="" aria-clear="odemeEkle">
                                    <button id="odemeEkleButton" class="btn btn-success btn-block">
                                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                                        <span id="odemeEkleButtonGonder" class="yok">Ödeme Kaydet</span>
                                        <span id="odemeEkleButtonBekle" class="d-none">Kaydediliyor</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header" data-toggle="collapse" data-target="#odemeEkleListeBody" aria-expanded="true" aria-controls="odemeEkleListeBody">
                        <h4>Ödeme Listesi</h4> 
                    </div>
                    <div class="card-body" id="odemeEkleListeBody">
                       <table id="odemeEkleListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="odemeEkleListe_info">
                            <thead>
                                <tr>
                                    <th class="sorting" data-toggle="tooltip" data-placement="top" title="İşlemler"></th>
                                    <th class="sorting" data-toggle="tooltip" data-placement="top" title="Ödeme Kasa Adı">Kasa Adı</th>
                                    <th class="sorting" data-toggle="tooltip" data-placement="top" title="Ödeme Tarihi">Tarihi</th>
                                    <th class="sorting" data-toggle="tooltip" data-placement="top" title="Ödeme Miktarı">Miktarı</th>
                                    <th class="sorting" data-toggle="tooltip" data-placement="top" title="Ödeme Kuru">Kur</th>
                                    <th class="sorting" data-toggle="tooltip" data-placement="top" title="Ödeme Yapıldımı">Ödendi mi</th>
                                    <th class="sorting" data-toggle="tooltip" data-placement="top" title="Ödeme Notları">Notlar</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-default" data-dismiss="modal">Kapat</button>
               
            </div>
        </div>
    </div>
</div>