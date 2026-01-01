<div class="modal fade" id="modal-Calisan-Liste">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title" id="modal-title-Calisan-Liste">
                    <i class="fa-solid fa-person-circle-plus text-success mr-1"></i> <span id="calisanListeAcentaAdi"></span> Çalışan Listesi
                </h4>
                
            </div>
            <div class="modal-body" id="modal-body-Calisan-Liste">
                <div class="input-group ml-4"  data-toggle="tooltip" data-placement="top" title="Aramak istediğiniz Acentayı yazınız">
                    <div class="input-group-prepend">
                        <div class="input-group-btn">
                            <button class="btn btn-default" type="button" data-select2-open="calisanListeAcentaAra">
                                <i class="fa-solid fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </div>
                        <select class="form-control-sm  input-sm select2bs4 select2-hidden-accessible" id="calisanListeAcentaAra" data-placeholder="acenta ara" tabindex="-1" aria-hidden="true">
                        
                    </select>
                </div>
                <div class="row">
                            <div class="col-sm-12">
                                <table id="acentaCalisanListe" class="table table-bordered table-striped dataTable dtr-inline collapsed" aria-describedby="acentaCalisanListe_info">
                                    <thead>
                                        <tr>
                                            <th class="sorting" tabindex="0" aria-controls="acentaCalisanListe" rowspan="1" colspan="1" aria-label="1" data-toggle="tooltip" data-placement="top" title="Acenta Çalışanları ile ilgili işlemler">İşlemler</th>
                                            <th class="sorting" tabindex="1" aria-controls="acentaCalisanListe" rowspan="1" colspan="1" aria-label="2" data-toggle="tooltip" data-placement="top" title="Çalışan Adı">Çalışan Adı</th>
                                            <th class="sorting" tabindex="2" aria-controls="acentaCalisanListe" rowspan="1" colspan="1" aria-label="3" data-toggle="tooltip" data-placement="top" title="Çalışan telefon numarası">Telefon</th>
                                            <th class="sorting" tabindex="3" aria-controls="acentaCalisanListe" rowspan="1" colspan="1" aria-label="4" data-toggle="tooltip" data-placement="top" title="Çalışan TEposta Adresi">E-Posta</th>
                                            <th class="sorting" tabindex="4" aria-controls="acentaCalisanListe" rowspan="1" colspan="1" aria-label="5" data-toggle="tooltip" data-placement="top" title="Çalışan hakkında notlar">Notlar</th>
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