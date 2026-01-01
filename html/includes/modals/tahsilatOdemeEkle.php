<div class="modal fade" id="modal-tahsilat-Odeme-Ekle">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Odeme-Ekle">
                    <i class="fa-solid fa-file-invoice text-success mr-2"></i>
                    <span aria-name="tahsilatEkleTahsilatAdi" ></span> Tahsilat Ekle 
                </h4>
                <span aria-name="modalLoad" class="d-none">
                    hazırlanıyor
                    <span class="fa fa-spinner fa-spin fa-3x"></span>
                </span>
            </div>
            <div class="modal-body" id="modal-body-Odeme-Ekle">
                <div class="row mb-2 border-bottom border-secondary">
                    <div class="col-10">
                        <label class="sr-only" for="inlineFormInputGroup">Tahsilat Adı</label>
                        <div class="input-group mb-2">
                            <div class="input-group-prepend">
                            <div class="input-group-text">Tahsilat Adı</div>
                            </div>
                            <input type="text" class="form-control" aria-name="tahsilatEkleTahsilatAdi" placeholder="Tahsilat Adı" readonly>
                        </div>
                    </div>
                    <div class="col-2">
                        <button type="button" class="btn btn-warning" aria-name="tahsilatEkleTahsilatDuzenle" aria-ID=""><i class="fa-solid fa-pen-to-square mr-2"></i> Düzenle</button>
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header" data-toggle="collapse" data-target="#tahsilatEkleFaturaBody" aria-expanded="false" aria-controls="tahsilatEkleFaturaBody">
                        <h4>Fatura Detay</h4> 
                    </div>
                    <div class="card-body collapse" id="tahsilatEkleFaturaBody">
                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <p class="card-text">Fatura Tipi</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleFaturaTipi" aria-clear-html="tahsilatEkle"></p>
                            </div>

                            <div class="col-sm-4">
                                <p class="card-text">Fatura No</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleFaturaNo" aria-clear-html="tahsilatEkle"></p>
                            </div>
                            <div class="col-sm-4">
                                <button type="button" class="btn btn-secondary" aria-name="tahsilatEkleFaturaGoster" aria-type="" aria-url=""><i class="fa-solid fa-file-invoice mr-2"></i>Fatura Göster</button>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-sm-4">
                                <p class="card-text">Fatura Tarihi</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleEkleFaturaTarihi" aria-clear-html="tahsilatEkle"></p>
                            </div>
                            <div class="col-sm-4">
                                <p class="card-text" aria-name ="tahsilatEkleParaBirimi" aria-clear-html="tahsilatEkle">Kur</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleKur" aria-clear-html="tahsilatEkle"></p>
                            </div>
                            <div class="col-sm-4">
                                <p class="card-text">Harcama Tipi</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleFaturaHarcama" aria-clear-html="tahsilatEkle"></p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-sm-4">
                                <p class="card-text">Grubu</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleOdemeGrubu" aria-clear-html="tahsilatEkle"></p>
                            </div>

                            <div class="col-sm-4">
                                <p class="card-text">Çeşidi</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleOdemeCesidi" aria-clear-html="tahsilatEkle"></p> 
                            </div>
                            <div class="col-sm-4">
                                
                                
                            </div>
                        </div>
                        
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header">
                        <h4>Tahsilat Ödeme</h4> 
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-sm-3">
                                <p class="card-text">Toplam Tahsilat</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleToplamOdeme" aria-clear-html="tahsilatEkle"></p>
                            </div>

                            <div class="col-sm-3">
                                <p class="card-text">Yapılan Tahsilat</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleYapilanODeme" aria-clear-html="tahsilatEkle"></p>
                            </div>
                            <div class="col-sm-3">
                                 <p class="card-text">Kalan Tahsilat</p>
                                <p class="card-text font-weight-bold" aria-name="tahsilatEkleKalanODeme" aria-clear-html="tahsilatEkle"></p>
                            </div>
                            <div class="col-sm-3">
                                
                                <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                    <label aria-name="tahsilatEkleAcik" class="btn btn-sm btn-outline-danger active">
                                        Açık
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header" data-toggle="collapse" data-target="#tahsilatEkleEkleBody" aria-expanded="true" aria-controls="tahsilatEkleEkleBody">
                        <h4>Tahsilat Ekle</h4> 
                    </div>
                    <div class="card-body" id="tahsilatEkleEkleBody">
                        <form novalidate="novalidate" id="tahsilatOdemeHizliEkleForm">
                            <div class="row">
                                <div class="col-sm-3">
                                    <div class="input-group date input-group-sm" id="tahsilatEkleOdemeTarihi" data-target-input="nearest">
                                        <input type="text" class="form-control datetimepicker-input" data-target="#tahsilatEkleOdemeTarihi" name="tahsilatEkleOdemeTarihi" id="tahsilatEkleOdemeTarihiInput" aria-clear="tahsilatEkle" placeholder="Ödeme Tarihi">
                                        <div class="input-group-append" data-target="#tahsilatEkleOdemeTarihi" data-toggle="datetimepicker">
                                            <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-5" aria-name="tahsilatEkleParaDetay">
                                    <div class="input-group input-group-sm mb-2">
                                        <input type="text" class="form-control" name ="tahsilatEkleYeniODeme" id="tahsilatEkleYeniODeme" placeholder="Ödeme Miktarı"  aria-clear="tahsilatEkle">
                                        <div class="input-group-append">
                                            <select name="tahsilatEkleparaBirimi" id="tahsilatEkleparaBirimi" class="custom-select custom-select-sm">
                                                <option value="try" selected="">₺</option>
                                                <option value="usd">$</option>
                                                <option value="eur">€</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-2 d-none" aria-name="tahsilatEkleKurDetay">
                                    <div class="input-group input-group-sm">
                                        <input id="tahsilatEkleYeniKur" name="tahsilatEkleYeniKur" type="text" class="form-control" placeholder="Kur" aria-clear="tahsilatEkle">
                                        <div class="input-group-append">
                                            
                                            <button class="btn btn-default btn-success" type="button" id="tahsilatEkleKurYenile">
                                                    <i class="fa-solid fa-arrows-rotate"></i>
                                                </button>
                                            
                                        </div>
                                    </div>
                                </div>

                                <div class="col-sm-4">
                                    <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Kasa seçiniz">
                                        <select class="form-control" id="tahsilatEkleKasa" name="tahsilatEkleKasa" data-placeholder="Kasa seçiniz" tabindex="-1" aria-hidden="true" >
                                        
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
                                        <textarea class="form-control" id="tahsilatEkleNot" name="tahsilatEkleNot" rows="1" aria-clear="tahsilatEkle" ></textarea>
                                    </div>
                                </div>
                                <div class="col-sm-3">
                                    <div class="btn-group btn-group-toggle ml-2" data-toggle="buttons">
                                        <label aria-name="tahsilatEkleYeniAcik" class="btn btn-outline-danger active btn-sm">
                                            <input type="radio" id="tahsilatEkleOdenmediInput" value="0" name="tahsilatEkleOdendi" checked=""> Ödenmedi
                                        </label>
                                        <label aria-name="tahsilatEkleYeniKapali" class="btn btn-outline-success">
                                            <input type="radio" id="tahsilatEkleOdendiInput" value="1" name="tahsilatEkleOdendi">Ödendi
                                        </label>
                                    </div>
                                </div>
                                <div class="col-sm-4">
                                    <input type="hidden" id="tahsilatEkleTahsilatID" name ="tahsilatEkleTahsilatID" value="" >
                                    <button id="tahsilatEkleButton" class="btn btn-success btn-block">
                                        <i class="fa-solid fa-floppy-disk"></i>&nbsp;
                                        <span id="tahsilatEkleButtonGonder" class="yok">Tahsilat Kaydet</span>
                                        <span id="tahsilatEkleButtonBekle" class="d-none">Kaydediliyor</span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div class="card bg-light mb-3">
                    <div class="card-header" data-toggle="collapse" data-target="#tahsilatEkleListeBody" aria-expanded="true" aria-controls="tahsilatEkleListeBody">
                        <h4>Ödeme Listesi</h4> 
                    </div>
                    <div class="card-body" id="tahsilatEkleListeBody">
                       <table id="tahsilatEkleListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="tahsilatEkleListe_info">
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