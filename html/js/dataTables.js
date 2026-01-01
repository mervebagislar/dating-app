let tableLang={
    "decimal":        "",
    "emptyTable": "Tabloda veri bulunamadı",
    "info":           "_TOTAL_ kayıttan _START_ ile _END_ arası gösteriliyor",
    "infoEmpty":      "0 kayıdın 0'dan 0'a kısmı gösteriliyor",
    "infoFiltered":   "(filtered from _MAX_ total entries)",
    "infoPostFix":    "",
    "thousands":      ",",
    "lengthMenu":     "_MENU_ kayıt gösteriliyor",
    "loadingRecords": "Yükleniyor...",
    "processing":     "işleniyor",
    "zeroRecords":    "eşleşen kayıt bulunamadı",
    "paginate": {
        "first":      "İlk",
        "last":       "Son",
        "next":       "Sonraki",
        "previous":   "Önceki"
    },
    "aria": {
        "sortAscending":  ": artan sıralama için su sütunu kullanın",
        "sortDescending": ": azalan sıralama için su sütunu kullanın"
    },
   "search":"Ara"
}



let tableOpts = {
	"responsive": true, 
	"lengthChange": true, 
	"autoWidth": true,
	"paging": true,
	"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "Hepsi"] ],
	"info": true,
	"order": [[0, 'asc']],
	"processing": true,
	"serverSide": true,
	"buttons": [],
	"columns": [],
	"language": tableLang, 
	"initComplete": function() {
            $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
        },
	"columnDefs":[],
    "createdRow": function() { },
	"rowCallback": function(){},
};

var collapsedGroups = {};

let acentaTable
let tahsilatRaporuTable
function initacentalisteTable(){
    //console.log("initacentalisteTable")
	//tableOpts.ajax.url='../../worker/'
	//tableOpts.ajax.data= function(d){ d.acentaListele = 1; }
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}

    tableOpts.columns=[
		{ "data": 'islem',"width": "180px" },
		{ "data": 'acentaAdi' },
		{ "data": 'acentaAdresi',"visible": false  },
		{ "data": 'acentaTelefon',"visible": false  },
		{ "data": 'acentaFaturaBaslik',"visible": false },
		{ "data": 'acentaVergiDairesi' ,"visible": false},
		{ "data": 'acentaVergiNo',"visible": false},
		{ "data": 'grupAdi',"visible": true},
		{ "data": 'acentaIl',"visible": true},
		{ "data": 'acentaIlce',"visible": false},
		{ "data": 'acentaWeb',"visible": false},
		{ "data": 'acentaEposta',"visible": false},
	]
	tableOpts.buttons=[
		{
            extend: 'excel',
            text: 'Excel',
			 exportOptions: {
                columns: [ 0, 1,2, 3, 4, 5, 6 ],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'pdf',
            text: 'Pdf',
			 exportOptions: {
                columns: [ 0, 1,2, 3, 4, 5, 6 ],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'colvis',
            text: 'Sütunlar'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Firma Ekle',
            action: function ( e, dt, node, config ) {
            	$('#modal-Acenta-Ekle').modal('show')
          }
        }
	]
	acentaTable =  $("#acentaListe").DataTable(tableOpts);
    acentaTable.buttons().container().appendTo('#acentaListe_wrapper .col-md-6:eq(0)');
}

let acentaCalisanTable
function initacentaCalisanTable(){
    //console.log("initacentaCalisanTable")
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.paging=false
	tableOpts.initComplete=function(settings, json) {}
    tableOpts.columns=[
		{ "data": 'islem',"width": "90px" },
		{ "data": 'calisanAdi' },
		{ "data": 'calisanTelefon',"visible": false  },
		{ "data": 'calisanEposta',"visible": false  },
		{ "data": 'calisanNot',"visible": false },
	]
	tableOpts.buttons=[
		{
            extend: 'excel',
            text: 'Excel Kaydet',
			 exportOptions: {
                columns: [  1,2, 3, 4 ],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'pdf',
            text: 'Pdf Kaydet',
			 exportOptions: {
                columns: [ 1,2, 3, 4 ],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'colvis',
            text: 'Sütunlar'
        }
	]
	acentaCalisanTable =  $("#acentaCalisanListe").DataTable(tableOpts);
    acentaCalisanTable.buttons().container().appendTo('#acentaCalisanListe_wrapper .col-md-6:eq(0)');
}

let hizmetTable
function inithizmetlisteTable(){
    //console.log("inithizmetlisteTable")
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.paging=false
	tableOpts.initComplete=function(settings, json) {}
    tableOpts.columns=[
		{ "data": 'islem',"width": "30px" },
		{ "data": 'hizmetAdi' },
		{ "data": 'hizmetGrubu' },
		{ "data": 'hizmetFiyati'  },
		{ "data": 'hizmetNotlari',"visible": false  }
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i> Sütunlar'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Hizmet Ekle',
            action: function ( e, dt, node, config ) {
            	$('#modal-Hizmet-Ekle').modal('show')
          }
        }
	]
	hizmetTable =  $("#hizmetListe").DataTable(tableOpts);
	hizmetTable.buttons().container().appendTo('#hizmetListe_wrapper .col-md-6:eq(0)');

	
}

let teklifHizmetTable
function initTeklifHizmet(){
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}
	tableOpts.paging=false
	tableOpts.lengthChange=false
	//tableOpts.dom='lrt'
	//tableOpts.dom='lrtip'
	//lfrtip
    tableOpts.columns=[
		{ "data": 'ID' ,"visible": false  },
		{ "data": 'hizmetAdi'   },
		{ "data": 'hizmetFiyati' ,"visible": false  },
		{ "data": 'hizmetGrupID' ,"visible": false  },
		{ "data": 'hizmetGrubu' ,"visible": false  },
		{ "data": 'hizmetNotlari',"visible": false  },
		
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	teklifHizmetTable =  $("#teklifHizmet").DataTable(tableOpts);
	teklifHizmetTable.buttons().container().appendTo('#teklifHizmet_wrapper .col-md-6:eq(0)');
	$("#teklifHizmet_filter").parent().addClass("d-none");
	$("#teklifHizmet_filter").parent().parent().children(":first").toggleClass("col-md-6",false) 
	//$("#teklifHizmet_filter").parent().parent().first().html("bu mu?") 
	
}

let taslakTeklifTable
function initTaslakTeklifTable(){
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}
	tableOpts.paging=false
	tableOpts.lengthChange=false
	tableOpts.order= [[5, 'desc']]
    tableOpts.columns=[
		{ "data": 'islem'   },
		{ "data": 'teklifAdi'   },
		{ "data": 'revizeNo'   },
		{ "data": 'acentaAdi' },
		{ "data": 'calisanAdi'},
		{ "data": 'yazimTarihi'},
		{ "data": 'baslangicTarihi'},
		{ "data": 'kullaniciAdi'},
		{ "data": 'uuid',"visible": false  },
		{ "data": 'ID' ,"visible": false  }
		
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	taslakTeklifTable =  $("#taslakTeklifTable").DataTable(tableOpts);
	taslakTeklifTable.buttons().container().appendTo('#taslakTeklifTable_wrapper .col-md-6:eq(0)');
}
let bekleyenTeklifTable
function initBekleyenTeklifTable(){
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}
	tableOpts.paging=false
	tableOpts.lengthChange=false
	tableOpts.order= [[5, 'desc']]
    tableOpts.columns=[
		{ "data": 'islem'   },
		{ "data": 'teklifAdi'   },
		{ "data": 'revizeNo'   },
		{ "data": 'acentaAdi' },
		{ "data": 'calisanAdi'},
		{ "data": 'yazimTarihi'},
		{ "data": 'baslangicTarihi'},
		{ "data": 'kullaniciAdi'},
		{ "data": 'uuid',"visible": false  },
		{ "data": 'ID' ,"visible": false  }
		
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	bekleyenTeklifTable =  $("#bekleyenTeklifTable").DataTable(tableOpts);
	bekleyenTeklifTable.buttons().container().appendTo('#bekleyenTeklifTable_wrapper .col-md-6:eq(0)');
}

let onaylananTeklifTable
function initOnaylananTeklifTable(){
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}
	tableOpts.paging=false
	tableOpts.lengthChange=false
	tableOpts.order= [[5, 'desc']]
    tableOpts.columns=[
		{ "data": 'islem'   },
		{ "data": 'teklifAdi'   },
		{ "data": 'revizeNo'   },
		{ "data": 'acentaAdi' },
		{ "data": 'calisanAdi'},
		{ "data": 'yazimTarihi'},
		{ "data": 'baslangicTarihi'},
		{ "data": 'kullaniciAdi'},
		{ "data": 'uuid',"visible": false  },
		{ "data": 'ID' ,"visible": false  }
		
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	onaylananTeklifTable =  $("#onaylananTeklifTable").DataTable(tableOpts);
	onaylananTeklifTable.buttons().container().appendTo('#onaylananTeklifTable_wrapper .col-md-6:eq(0)');
}


let gecersizTeklifTable
function initGecersizTeklifTable(){
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}
	tableOpts.paging=false
	tableOpts.lengthChange=false
	tableOpts.order= [[5, 'desc']]
	tableOpts.rowGroup= {
		// Uses the 'row group' plugin
		dataSrc: 'teklifAdi',
		startRender: function(rows, group) {
			
			var collapsed = !!collapsedGroups[group];
			if(rows.count()>1){
				
				rows.nodes().each(function (r) {
					console.log(r)
				r.style.display = 'none';
				if (collapsed) {
					r.style.display = '';
				}
				r.className = "table-group-inside";
				});
				
				// Add category name to the <tr>. NOTE: Hardcoded colspan
				return $('<tr/>')
				.append('<td class="float-right"><span class="badge badge-info mr-1">Teklif Grubu</span><i class="fa-regular fa-square-caret-down"></i></td><td colspan="5" >' + group + ' (' + rows.count() + ')</td>')
				.attr('data-name', group)
				.toggleClass('collapsed', collapsed);
			}
		}
	}
    tableOpts.columns=[
		{ "data": 'islem'   },
		{ "data": 'teklifAdi'   },
		{ "data": 'revizeNo'   },
		{ "data": 'acentaAdi' },
		{ "data": 'calisanAdi'},
		{ "data": 'yazimTarihi'},
		{ "data": 'baslangicTarihi'},
		{ "data": 'kullaniciAdi'},
		{ "data": 'uuid',"visible": false  },
		{ "data": 'ID' ,"visible": false  }
		
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	gecersizTeklifTable =  $("#gecersizTeklifTable").DataTable(tableOpts);
	gecersizTeklifTable.buttons().container().appendTo('#gecersizTeklifTable_wrapper .col-md-6:eq(0)');
	$('#gecersizTeklifTable tbody').on('click', 'tr.dtrg-start ', function() {
		var name = $(this).data('name');
		collapsedGroups[name] = !collapsedGroups[name];
		gecersizTeklifTable.draw(false);
	});
}
let tumTeklifTable
function initTumTeklifTable(){
	tableOpts.autoWidth= false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}
	tableOpts.orderFixed= [2, 'asc'],
	tableOpts.rowGroup= {
		// Uses the 'row group' plugin
		dataSrc: 'teklifAdi',
		startRender: function(rows, group) {
			
			var collapsed = !!collapsedGroups[group];
			if(rows.count()>1){
				
				rows.nodes().each(function (r) {
				r.style.display = 'none';
				if (collapsed) {
					r.style.display = '';
				}
				r.className = "table-group-inside";
				});
				
				// Add category name to the <tr>. NOTE: Hardcoded colspan
				return $('<tr/>')
				.append('<td class="float-right"><i class="fa-regular fa-square-caret-down"></i></td><td><span class="badge badge-info">Teklif Grubu</span></td><td colspan="6" >' + group + ' (' + rows.count() + ')</td>')
				.attr('data-name', group)
				.toggleClass('collapsed', collapsed);
			}
		},
        endRender: function (rows, group) {

			if(rows.count()>1){
				let ret =  group+ ' için '+  rows.count()+' adet revize teklif '
				// Use the DataTables number formatter
				return (
				ret
				);
			}
			
        }
	}
	tableOpts.paging=false
	tableOpts.lengthChange=false
	tableOpts.order= [[2, 'desc']]
    tableOpts.columns=[
		{ "data": 'islem'   },
		{ "data": 'durum'   },
		{ "data": 'teklifAdi'   },
		{ "data": 'revizeNo'   },
		{ "data": 'acentaAdi' },
		{ "data": 'calisanAdi'},
		{ "data": 'yazimTarihi',"visible": false},
		{ "data": 'terminTarihi'},
		{ "data": 'baslangicTarihi'},
		{ "data": 'kullaniciAdi'},
		{ "data": 'uuid',"visible": false  },
		{ "data": 'ID' ,"visible": false  }
		
	]
	/*tableOpts.rowCallback= function(row, data) {
       if(data.terminTarihi != null){
			//if (data.durum === "<span class=\"badge badge-success\">Onaylanan</span>" || data.durum === "<span class=\"badge badge-warning\">Bekleyen</span>") {
			if ( data.durum === "<span class=\"badge badge-warning\">Bekleyen</span>") {
				
				let termin=new Date( Date.parse(data.terminTarihi));
				baslangic = moment(termin)
				let bugun  = moment();
				kalanGun=baslangic.diff(bugun, 'days')
				if(kalanGun<=0){
					$(row).addClass('bg-gecmis');
				}
			}
		}
		if(data.baslangicTarihi!=null){
			if (data.durum === "<span class=\"badge badge-success\">Onaylanan</span>") {
				let termin=new Date( Date.parse(data.baslangicTarihi));
				baslangic = moment(termin)
				let bugun  = moment();
				kalanGun=baslangic.diff(bugun, 'days')
				if(kalanGun<=0){
					$(row).addClass('bg-bitmis');
				}
			}
		}
    }
	tableOpts.createdRow=function(row, data, dataIndex) {
		if(data.terminTarihi != null){
			//if (data.durum === "<span class=\"badge badge-success\">Onaylanan</span>" || data.durum === "<span class=\"badge badge-warning\">Bekleyen</span>") {
			if ( data.durum === "<span class=\"badge badge-warning\">Bekleyen</span>") {
				
				let termin=new Date( Date.parse(data.terminTarihi));
				baslangic = moment(termin)
				let bugun  = moment();
				kalanGun=baslangic.diff(bugun, 'days')
				if(kalanGun<=0){
					$(row).addClass('bg-gecmis');
				}
			}
		}
		if(data.baslangicTarihi!=null){
			if (data.durum === "<span class=\"badge badge-success\">Onaylanan</span>") {
				let termin=new Date( Date.parse(data.baslangicTarihi));
				baslangic = moment(termin)
				let bugun  = moment();
				kalanGun=baslangic.diff(bugun, 'days')
				if(kalanGun<=0){
					$(row).addClass('bg-bitmis');
				}
			}
		}
    }*/
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	tumTeklifTable =  $("#tumTeklifTable").DataTable(tableOpts);
	tumTeklifTable.buttons().container().appendTo('#tumTeklifTable_wrapper .col-md-6:eq(0)');
	$('#tumTeklifTable tbody').on('click', 'tr.dtrg-start ', function() {
		var name = $(this).data('name');
		collapsedGroups[name] = !collapsedGroups[name];
		tumTeklifTable.draw(false);
	});
}

let personelTable
function initpersonelisteTable(){
    //console.log("initacentalisteTable")
	//tableOpts.ajax.url='../../worker/'
	//tableOpts.ajax.data= function(d){ d.acentaListele = 1; }
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}

    tableOpts.columns=[
		{ "data": 'islem',"width": "200px" },
		{ "data": 'personelTC',"visible": true},
		{ "data": 'personelAd',"visible": true },
		{ "data": 'depratman',"visible": true},
		{ "data": 'pozisyon',"visible": true},
		{ "data": 'personelTelefon',"visible": false  },
		{ "data": 'personelTelefon2',"visible": true },
		{ "data": 'personelEposta' ,"visible": true},
		{ "data": 'personelAdres',"visible": true  },
		{ "data": 'personelDogum',"visible": false},
		{ "data": 'personelEhliyet',"visible": false},
		{ "data": 'personelPasaport',"visible": false},
	]
	tableOpts.buttons=[
		{
            extend: 'excel',
            text: '<i class="fa fa-file-excel-o"></i> Excel',
			 exportOptions: {
                columns: [ 0, 1,2, 3, 4, 5, 6,7,8,9,10,11 ],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'pdf',
            text: '<i class="fa fa-file-pdf-o"></i> Pdf',
			 exportOptions: {
                columns: [ 0, 1,2, 3, 4, 5, 6,7,8,9,10,11 ],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>Sütunlar'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Personel Ekle',
            action: function ( e, dt, node, config ) {
            	personelDepartmanAra.val('').trigger('change');
				personelGorevAra.empty().append(new Option()).trigger('change');
				$('#modal-Personel-Ekle').modal('show');
          }
        }
	]
	personelTable =  $("#personelListe").DataTable(tableOpts);
    personelTable.buttons().container().appendTo('#personelListe_wrapper .col-md-6:eq(0)');
}

let kasaTable
function initkasaListeTable(){
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {}

    tableOpts.columns=[
		{ "data": 'islem',"width": "180px" },
		{ "data": 'kasaAdi',"visible": true},
		{ "data": 'bankaAdi',"visible": true },
		{ "data": 'iban',"visible": true},
		{ "data": 'hesapNo',"visible": true},
		{ "data": 'bankaKodu',"visible": false  },
		{ "data": 'bakiye',"visible": true  }
	]
	tableOpts.buttons=[
		{
            extend: 'excel',
            text: '<i class="fa fa-file-excel-o"></i> Excel',
			 exportOptions: {
                columns: [ 1,2, 3, 4 ],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'pdf',
            text: '<i class="fa fa-file-pdf-o"></i> Pdf',
			 exportOptions: {
                columns: [ 1,2, 3, 4],
				 modifier: { search: 'applied' },
				 rows: ':visible'
            }
        },
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>Sütunlar'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Kasa Ekle',
            action: function ( e, dt, node, config ) {
				$('#modal-Kasa-Ekle').modal('show');
          }
        },
		{
            text: '<i class="fa fa-exchange mr-1"></i>Virman Ekle',
            action: function ( e, dt, node, config ) {
				$('#yeniVirmanModal').modal('show');
          }
        }
	]
	kasaTable =  $("#kasaListe").DataTable(tableOpts);
    kasaTable.buttons().container().appendTo('#kasaListe_wrapper .col-md-6:eq(0)');
}
let odemeCesitTable
function initodemeCesitListeTable(){
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {
		 $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
	}

    tableOpts.columns=[
		{ "data": 'islem',"width": "180px" },
		{ "data": 'odemeTuru',"visible": true},
		{ "data": 'odemeCesidi',"visible": true }
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Çeşit Ekle',
            action: function ( e, dt, node, config ) {
				odemeCesidiEkleGoster()
          }
        }
	]
	odemeCesitTable =  $("#odemeCesitListe").DataTable(tableOpts);
    odemeCesitTable.buttons().container().appendTo('#odemeCesitListe_wrapper .col-md-6:eq(0)');
}
let masrafTable
function initmasrafTable(){
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {
		 $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
	}

    tableOpts.columns=[
		{ "data": 'islem',"width": "180px" },
		{ "data": 'kartAdi',"visible": true},
		{ "data": 'faturaTarihi',"visible": true },
		{ "data": 'faturaTutari',"visible": true },
		{ "data": 'kur',"visible": false },
		{ "data": 'faturaTuru',"visible": false },
		{ "data": 'odemeTuru',"visible": true },
		{ "data": 'odemeCesidi',"visible": true },
		{ "data": 'aciklama',"visible": false },
		{ "data": 'diger',"visible": true }
	]
	tableOpts.order= [[2, 'asc']]
	tableOpts.columnDefs=[
		{targets: 3,
			"createdCell": function (td, cellData, rowData, row, col){
				//console.log("cell Data:",cellData)
				//console.log("row Data:",rowData.acikmi)
				//console.log("row:",row)
				$(td).css('color', 'red')
				if (rowData.acikmi == 1 ) {
					$(td).css('color', 'green')
				}
				}
		},
	]
	/*
	

	*/
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Masraf Ekle',
            action: function ( e, dt, node, config ) {
				masrafEkleClear()
    			$('#modal-Masraf-Ekle').modal('show')
          }
        }
	]
	masrafTable =  $("#masrafListe").DataTable(tableOpts);
    masrafTable.buttons().container().appendTo('#masrafListe_wrapper .col-md-6:eq(0)');
}
let odemeEkleTable
function initodemeEkleTable(){
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {
		 $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
	}

    tableOpts.columns=[
		{ "data": 'islem',"width": "60px" },
		{ "data": 'kasaAdi',"visible": true },
		{ "data": 'odemeTarihi',"visible": true },
		{ "data": 'Tutar',"visible": true },
		{ "data": 'kur',"visible": false },
		{ "data": 'odendimi',"visible": true },
		{ "data": 'notlar',"visible": false }
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	odemeEkleTable =  $("#odemeEkleListe").DataTable(tableOpts);
    odemeEkleTable.buttons().container().appendTo('#odemeEkleListe_wrapper .col-md-6:eq(0)');
}


let tahsilatTable
function inittahsilatTable(){
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {
		 $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
	}

    tableOpts.columns=[
		{ "data": 'acikmi',"visible": true },
		{ "data": 'islem',"width": "180px" },
		{ "data": 'kartAdi',"visible": true},
		{ "data": 'teklifAdi',"visible": true },
		{ "data": 'acentaAdi',"visible": true, "title": "Acenta Adı" },
		{ "data": 'faturaTarihi',"visible": true },
		{ "data": 'faturaTutari',"visible": true },
		{ "data": 'kur',"visible": false },
		{ "data": 'faturaNo',"visible": true },
		{ "data": 'faturaTuru',"visible": false },
		{ "data": 'tahsilatTuru',"visible": true },
		{ "data": 'tahsilatVadesi',"visible": true },
		{ "data": 'aciklama',"visible": false },
		{ "data": 'diger',"visible": true }
	]
	
	tableOpts.order= [[2, 'asc']]
	tableOpts.columnDefs=[
		{targets: 6,
			"createdCell": function (td, cellData, rowData, row, col){
				//console.log("cell Data:",cellData)
				//console.log("row Data:",rowData.acikmi)
				//console.log("row:",row)
				$(td).css('color', 'red')
				if (rowData.acikmi == "<span class='badge badge-success'>Kapalı</span>" ) {
					$(td).css('color', 'green')
				}
				}
		},
	]
	/*
	

	*/
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Tahsilat Ekle',
            action: function ( e, dt, node, config ) {
				tahsilatEkleClear()
    			$('#modal-tahsilat-Ekle').modal('show')
          }
        }
	]
	tahsilatTable =  $("#tahsilatListe").DataTable(tableOpts);
    tahsilatTable.buttons().container().appendTo('#tahsilatListe_wrapper .col-md-6:eq(0)');
}

let tahsilatEkleTable
function inittahsilatEkleTable(){
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {
		 $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
	}

    tableOpts.columns=[
		{ "data": 'islem',"width": "60px" },
		{ "data": 'kasaAdi',"visible": true },
		{ "data": 'tahsilatTarihi',"visible": true },
		{ "data": 'Tutar',"visible": true },
		{ "data": 'kur',"visible": false },
		{ "data": 'odendimi',"visible": true },
		{ "data": 'notlar',"visible": false }
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	tahsilatEkleTable =  $("#tahsilatEkleListe").DataTable(tableOpts);
    tahsilatEkleTable.buttons().container().appendTo('#tahsilatEkleListe_wrapper .col-md-6:eq(0)');
}
let tahsilatCesitTable
function inittahsilatCesitListeTable(){
	tableOpts.autoWidth= false
	tableOpts.paging=false
	tableOpts.serverSide= false
	tableOpts.initComplete=function(settings, json) {
		 $(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
	}

    tableOpts.columns=[
		{ "data": 'islem',"width": "180px" },
		{ "data": 'tahsilatTuru',"visible": true}
	]
	tableOpts.buttons=[
		
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        },
		{
            text: '<i class="fa-solid fa-circle-plus mr-1"></i>Çeşit Ekle',
            action: function ( e, dt, node, config ) {
				tahsilatCesidiEkleGoster()
          }
        }
	]
	tahsilatCesitTable =  $("#tahsilatCesitListe").DataTable(tableOpts);
    tahsilatCesitTable.buttons().container().appendTo('#tahsilatCesitListe_wrapper .col-md-6:eq(0)');
}

//#region BANKA HESAPLARI RAPORU
function initBankaHesaplariRaporuTable(){
	// tableOpts nesnesini sıfırla
	tableOpts = {
		"responsive": true, 
		"lengthChange": true, 
		"autoWidth": true,
		"paging": true,
		"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "Hepsi"] ],
		"info": true,
		"order": [[2, 'desc']], // Ödeme Tarihi kolonuna göre azalan sıralama
		"processing": true,
		"serverSide": false,
		"dom": 'Bfrtip',
		"buttons": [],
		"columns": [],
		"language": tableLang, 
		"initComplete": function() {
			$(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
		},
		"columnDefs":[
			{
				"targets": [2], // Miktar
				"render": function(data, type, row) {
					return data || '';
				}
			},
			{
				"targets": [4], // Ödendi mi
				"render": function(data, type, row) {
					if (data == "1") {
						return '<span class="badge badge-success">Ödendi</span>';
					} else {
						return '<span class="badge badge-warning">Ödenmedi</span>';
					}
				}
			}
		],
		"createdRow": function() { },
		"rowCallback": function(row, data, index){
		},
	};
	
	tableOpts.columns=[
		{ "data": 'tabloTur', "title": "İşlem Türü", "width": "140px" },
		{ "data": 'cariKasaAdi', "title": "Kasa Adı", "width": "180px" },
		{ "data": 'cariOdemeTarih', "title": "Ödeme Tarihi", "width": "130px" },
		{ "data": 'cariMiktar', "title": "Miktar", "width": "120px" },
		{ "data": 'cariOdendimi', "title": "Ödendi mi", "width": "100px" },
		{ "data": 'cariFaturaTarihi', "title": "Fatura Tarihi", "width": "130px" },
		{ "data": 'cariKartAdi', "title": "Kart Adı", "width": "180px" },
		{ "data": 'cariVadeTarihi', "title": "Vade Tarihi", "width": "130px" },
		{ "data": 'cariTeklifAdi', "title": "Teklif Adı", "width": "200px" },
		{ "data": 'cariTuru', "title": "Tür", "width": "140px" },
		{ "data": 'cariCesidi', "title": "Çeşidi", "width": "140px" },
		{ "data": 'cariNotlar', "title": "Açıklama", "width": "250px" }
	]
	tableOpts.buttons=[
		{
            extend: 'excel',
            text: '<i class="fa fa-file-excel-o"></i> Excel',
            className: 'btn btn-success btn-sm',
            exportOptions: {
                columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
                modifier: { search: 'applied' },
                rows: ':visible'
            }
        },
		{
            extend: 'pdf',
            text: '<i class="fa fa-file-pdf-o"></i> PDF',
            className: 'btn btn-danger btn-sm',
            exportOptions: {
                columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ],
                modifier: { search: 'applied' },
                rows: ':visible'
            }
        },
		{
            extend: 'colvis',
            text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
        }
	]
	if ($("#bankaHesaplariRaporuTable").length > 0) {
		bankaHesaplariRaporuTable =  $("#bankaHesaplariRaporuTable").DataTable(tableOpts);
		bankaHesaplariRaporuTable.buttons().container().appendTo('#bankaHesaplariRaporuTable_wrapper .col-md-6:eq(0)');
	} else {
		console.error("bankaHesaplariRaporuTable elementi bulunamadı");
	}
}

//#region TAHŞİLAT RAPORU
function initTahsilatRaporuTable(){
	// tableOpts nesnesini sıfırla
	tableOpts = {
		"responsive": false, 
		"lengthChange": true, 
		"autoWidth": false,
		"paging": true,
		"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "Hepsi"] ],
		"info": true,
		"order": [[0, 'desc']],
		"processing": true,
		"serverSide": false,
		"dom": 'Bfrtip',
		"buttons": [],
		"columns": [],
		"language": tableLang, 
		"initComplete": function() {
			$(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
		},
		"columnDefs":[],
		"createdRow": function() { },
		"rowCallback": function(row, data, index){
			// Duruma göre satır renklendirmesi
			if (data.durum) {
				switch(data.durum.toLowerCase()) {
					case 'yapilmis':
						$(row).addClass('table-success'); // Yeşil - Yapılmış
						break;
					case 'yapilmamis':
						$(row).addClass('table-warning'); // Sarı - Yapılmamış
						break;
					default:
						$(row).addClass('table-light'); // Açık gri
						break;
				}
			}
		},
		"scrollX": true,
		"scrollCollapse": true,
		"fixedColumns": false
	};

	tableOpts.columns = [
		{
			"data": null,
			"title": "İşlemler",
			"width": "80px",
			"orderable": false,
			"render": function(data, type, row) {
				return '<button class="btn btn-sm btn-info" onclick="tahsilatDetay(' + row.id + ')"><i class="fa fa-eye"></i></button>';
			}
		},
		{ "data": "teklif_adi", "title": "Teklif", "width": "150px" },
		{ "data": "tarih", "title": "Tahsilat Tarihi", "width": "120px" },
		{ "data": "firma_adi", "title": "Firma Adı", "width": "200px" },
		{ "data": "is_adi", "title": "İş Adı", "width": "180px" },
		{ "data": "aciklama", "title": "Açıklama", "width": "250px" },
		{ 
			"data": "tutar", 
			"title": "Tutar",
			"width": "120px",
			"render": function(data, type, row) {
				return parseFloat(data).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'});
			}
		},
		{ "data": "odeme_turu", "title": "Ödeme Türü", "width": "150px" },
		{ 
			"data": "durum", 
			"title": "Durum",
			"width": "100px",
			"render": function(data, type, row) {
				var badgeClass = data === 'yapilmis' ? 'badge-success' : 'badge-warning';
				var text = data === 'yapilmis' ? 'Yapılmış' : 'Yapılmamış';
				return '<span class="badge ' + badgeClass + '">' + text + '</span>';
			}
		}
	];

	tableOpts.buttons = [
		{ 
			extend: 'excel', 
			text: '<i class="fa fa-file-excel-o"></i> Excel', 
			className: 'btn btn-success btn-sm', 
			exportOptions: { 
				columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 
				modifier: { search: 'applied' }, 
				rows: ':visible' 
			}
		},
		{ 
			extend: 'pdf', 
			text: '<i class="fa fa-file-pdf-o"></i> PDF', 
			className: 'btn btn-danger btn-sm', 
			exportOptions: { 
				columns: [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ], 
				modifier: { search: 'applied' }, 
				rows: ':visible' 
			}
		},
		{
			extend: 'colvis',
			text: '<i class="fa-solid fa-table-columns" data-toggle="tooltip" data-placement="top" title="Sütunları Göster / Gizle"></i>'
		}
	];

	// DataTable'ın zaten var olup olmadığını kontrol et
	if ($.fn.DataTable.isDataTable('#tahsilatRaporTablosu')) {
		console.log("tahsilatRaporTablosu zaten mevcut, yok ediliyor...");
		$('#tahsilatRaporTablosu').DataTable().destroy();
	}
	
	tahsilatRaporuTable = $("#tahsilatRaporTablosu").DataTable(tableOpts);
    tahsilatRaporuTable.buttons().container().appendTo('#tahsilatRaporTablosu_wrapper .col-md-6:eq(0)');
    console.log("tahsilatRaporuTable tanımlandı:", typeof tahsilatRaporuTable);
}
//#endregion

//#region MASRAF RAPORU
function initMasrafRaporuTable(){
	// tableOpts nesnesini sıfırla
	tableOpts = {
		"responsive": false, 
		"lengthChange": true, 
		"autoWidth": false,
		"paging": true,
		"lengthMenu": [ [10, 25, 50, -1], [10, 25, 50, "Hepsi"] ],
		"info": true,
		"order": [[0, 'desc']],
		"processing": true,
		"serverSide": false,
		"dom": 'Bfrtip',
		"buttons": [],
		"columns": [],
		"language": tableLang, 
		"initComplete": function() {
			$(this.api().table().container()).find('input').parent().wrap('<form>').parent().attr('autocomplete', 'off');
		},
		"columnDefs":[],
		"createdRow": function() { },
		"rowCallback": function(){},
		"scrollX": true,
		"scrollCollapse": true,
		"fixedColumns": false
	};

	tableOpts.columns = [
		{
			"data": null,
			"title": "İşlemler",
			"width": "80px",
			"orderable": false,
			"render": function(data, type, row) {
				return '<button class="btn btn-sm btn-info" onclick="masrafDetay(' + row.id + ')"><i class="fa fa-eye"></i></button>';
			}
		},
		{ "data": "tarih", "title": "Tarih", "width": "120px" },
		{ "data": "aciklama", "title": "Açıklama", "width": "250px" },
		{ 
			"data": "tutar", 
			"title": "Tutar",
			"width": "120px",
			"render": function(data, type, row) {
				return parseFloat(data).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'});
			}
		},
		{ "data": "odeme_grubu", "title": "Ödeme Grubu", "width": "150px" },
		{ "data": "odeme_alt_grubu", "title": "Ödeme Alt Grubu", "width": "150px" },
		{ "data": "is_adi", "title": "İş Adı", "width": "180px" },
		{ "data": "kategori", "title": "Kategori", "width": "120px" },
		{ "data": "durum", "title": "Durum", "width": "100px" }
	];

	tableOpts.buttons = [
		{ 
			extend: 'pdf', 
			text: '<i class="fa fa-file-pdf-o"></i> PDF', 
			className: 'btn btn-danger btn-sm',
			title: 'Masraf Raporu',
			exportOptions: {
				columns: ':visible'
			}
		},
		{ 
			extend: 'print', 
			text: '<i class="fa fa-print"></i> Yazdır', 
			className: 'btn btn-info btn-sm',
			title: 'Masraf Raporu',
			exportOptions: {
				columns: ':visible'
			}
		},
		{ 
			extend: 'colvis', 
			text: '<i class="fa fa-columns"></i> Sütunlar', 
			className: 'btn btn-secondary btn-sm'
		}
	];

	masrafRaporuTable = $('#masrafRaporTablosu').DataTable(tableOpts);
	console.log("masrafRaporuTable tanımlandı:", typeof masrafRaporuTable);
	
	// Butonları container'a taşı
	masrafRaporuTable.buttons().container().appendTo('#masrafRaporuTable_wrapper .col-md-6:eq(0)');
}
//#endregion