 <!-- Yeni Virman Modal -->
 <div class="modal fade" id="yeniVirmanModal" tabindex="-1" role="dialog" aria-labelledby="yeniVirmanModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="yeniVirmanModalLabel">Yeni Virman İşlemi</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <form id="yeniVirmanForm">
                        <div class="form-group">
                            <label for="virmanGonderenKasa">Gönderen Kasa *</label>
                            <div class="input-group" data-toggle="tooltip" data-placement="top" title="Aramak istediğiniz kasayı yazınız">
                                <select class="form-control select2bs4" id="virmanGonderenKasa" name="virmanGonderenKasa" data-placeholder="Kasa Seçiniz" required>
                                </select>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-secondary" type="button" data-select2-open="virmanGonderenKasa">
                                        <i class="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="virmanAlanKasa">Alan Kasa *</label>
                            <select class="form-control" id="virmanAlanKasa" name="virmanAlanKasa" required>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="virmanTutar">Tutar *</label>
                            <div class="input-group">
                                <input type="number" class="form-control" id="virmanTutar" name="virmanTutar" step="0.01" min="0.01" required placeholder="0.00">
                                <div class="input-group-append">
                                    <select class="custom-select" id="virmanParaBirimi" name="virmanParaBirimi">
                                        <option value="try" selected>₺</option>
                                        <option value="usd">$</option>
                                        <option value="eur">€</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div class="form-group d-none" id="virmanKurDetay">
                            <label for="virmanKur" class="control-label mb-1">Kur (1 Döviz = ? TL)</label>
                            <input id="virmanKur" name="virmanKur" type="number" class="form-control" placeholder="Kur giriniz" step="0.0001" min="0.0001" aria-required="true" aria-invalid="false">
                        </div>
                        <div class="form-group">
                            <label for="virmanAciklama">Açıklama *</label>
                            <textarea class="form-control" id="virmanAciklama" name="virmanAciklama" rows="3" required placeholder="Virman açıklaması yazın..."></textarea>
                        </div>
                        <div class="form-group">
                            <label for="virmanTarih">İşlem Tarihi</label>
                            <input type="date" class="form-control" id="virmanTarih" name="virmanTarih">
                        </div>
                        <button class="btn btn-primary" id="virmanKaydetBtn">
                          <i class="fa fa-save"></i> Virmanı Kaydet
                      </button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">İptal</button>
                    </form>
                </div>
                
            </div>
        </div>
    </div>