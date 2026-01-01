<div class="modal fade" id="modal-personel-yetkilendirme">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-personel-yetkilendirme">
                    <i class="fa-solid fa-user-shield text-primary mr-2"></i>
                    Personel Yetkilendirme
                </h4>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="modal-body-personel-yetkilendirme">
                <div class="row mb-3">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="fa-solid fa-user mr-2"></i>
                                    <span id="personelYetkilendirmeAdi">Personel Adı</span>
                                </h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-6">
                                        <strong>TC No:</strong> <span id="personelYetkilendirmeTC">-</span>
                                    </div>
                                    <div class="col-md-6">
                                        <strong>Departman:</strong> <span id="personelYetkilendirmeDepartman">-</span>
                                    </div>
                                </div>
                                <div class="row mt-2">
                                    <div class="col-md-6">
                                        <strong>Pozisyon:</strong> <span id="personelPozisyon">-</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-12">
                        <h5 class="mb-3">
                            <i class="fa-solid fa-key mr-2"></i>
                            Yetki Seçenekleri
                        </h5>
                        <div class="card">
                            <div class="card-body">
                                <form id="personelYetkilendirmeForm">
                                    <input type="hidden" id="personelYetkilendirmeID" name="personelYetkilendirmeID" value="">
                                    
                                    <!-- Modül Yetkileri -->
                                    <div class="row mb-3">
                                        <div class="col-12">
                                            <h6 class="text-primary mb-2">
                                                <i class="fa-solid fa-cube mr-1"></i>
                                                Modül Yetkileri
                                            </h6>
                                        </div>
                                    </div>

                                    <!-- Dinamik Modüller Buraya Yüklenecek -->
                                    <div id="modulYetkileriContainer">
                                        <div class="text-center py-4">
                                            <div class="spinner-border text-primary" role="status">
                                                <span class="sr-only">Modüller yükleniyor...</span>
                                            </div>
                                            <p class="mt-2">Modüller yükleniyor...</p>
                                        </div>
                                    </div>






                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer justify-content-between">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">
                    <i class="fa-solid fa-times mr-1"></i>
                    İptal
                </button>
                <div>
                    <button type="button" class="btn btn-warning mr-2" id="personelYetkilendirmeTemizle">
                        <i class="fa-solid fa-eraser mr-1"></i>
                        Temizle
                    </button>
                    <button type="button" class="btn btn-success" id="personelYetkilendirmeKaydet">
                        <i class="fa-solid fa-save mr-1"></i>
                        <span id="personelYetkilendirmeKaydetText">Kaydet</span>
                        <span id="personelYetkilendirmeBekle" class="d-none">
                            <i class="fa fa-spinner fa-spin mr-1"></i>
                            Kaydediliyor...
                        </span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
