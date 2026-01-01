
//#region HİZMET eventHandler
$( ".hizmetEkleButton" ).on( "click", function() {
	debuging("eventHandler:","hizmetEkleButton")
    $('#modal-Hizmet-Ekle').modal('show')
});
$('#hizmetEkleForm').submit(function (e) {
    e.preventDefault();
    hizmetEkle(e)
 });
 $('#hizmetDuzenleForm').submit(function (e) {
    e.preventDefault();
    hizmetDuzenleKaydet(e)
 });
//#endregion

//#region HİZMET functions
function hizmetEkleLoad(){
    
	hizmetEklearaSelect =$("#hizmetEkleGrupAra")
	hizmetDuzenlearaSelect =$("#hizmetDuzenleGrupAra")

    function formatRepo (repo) {
        if (repo.loading) {
        return repo.text;
        }
    
        var $container = $(
        "<div class='select2-result-repository clearfix'>" +
            "<div class='select2-result-repository__avatar d-inline mr-2'><i class='" + repo.icon + "' ></i></div>" +
            "<div class='select2-result-repository__title d-inline'></div>" +
        "</div>"
        );
    
        $container.find(".select2-result-repository__title").text(repo.text);
        return $container;
    }
    
    function formatRepoSelection (repo) {
        return repo.text || repo.text;
    }
    var formData = new FormData();
    formData.append("hizmetEkleGrupLoad","0");
    makeAjax(formData).then((data) => { 
        hizmetEklearaSelect.select2({
            theme:"bootstrap4",
            data: data.result,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection
          })
        hizmetEklearaSelect.trigger('change');
        hizmetDuzenlearaSelect.select2({
            theme:"bootstrap4",
            data: data.result,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection
          })
        hizmetEklearaSelect.trigger('change');
    })
}
function hizmetEkle(e){
    toggleBekle("#hizmetEkleKaydetButtonGonder","#hizmetEkleKaydetButtonBekle")
	var formData = new FormData($("form#hizmetEkleForm")[0]);

	let formHata=false ;

    if(formHata ==false ){formHata=formHataBak("#hizmetEkleAdi",formData.get("hizmetEkleAdi"))}

    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#hizmetEkleKaydetButtonGonder","#hizmetEkleKaydetButtonBekle")
        return;
    }
    formData.append("hizmetEkle","1");
    makeAjax(formData).then((data) => { 
        $("[aria-clear='hizmetEkle']").val('')
        $('#modal-Hizmet-Ekle').modal('hide')
        toggelGonder("#hizmetEkleKaydetButtonGonder","#hizmetEkleKaydetButtonBekle")
        hizmetListele()
        Toast.fire({
            icon: "success",
            titleText: data.header,
            text:data.message,
            confirmButtonText: 'Tamam'
        })
    })
}
function  hizmetListele(){
    if ( $.fn.DataTable.isDataTable( '#hizmetListe' ) ) {
       //teklifHizmet_wrapper
        hizmetTable.clear().draw();
        var formData = new FormData();
        formData.append("hizmetListele","1");
        makeAjax(formData).then((data) => { 
            hizmetTable.rows.add( data.data ).draw();
        })
        $('#hizmetFilterButtons').html("")
        formData = new FormData();
        formData.append("hizmetFiltreButtonlar","1");
        makeAjax(formData).then((data) => { 
            $('#hizmetFilterButtons').html(data.data)
        })
    }
    if ( $.fn.DataTable.isDataTable( '#teklifHizmet' ) ) {
        teklifHizmetTable.clear().draw();
        let formData = new FormData();
        formData.append("hizmetlerTablosu","1");
        $('#hizmetListe_wrapper').html("")
        makeAjax(formData).then((data) => { 
            teklifHizmetTable.buttons().container().appendTo('#hizmetListe_wrapper .col-md-6:eq(0)')
            teklifHizmetTable.rows.add(data.data).draw();
        })
        formData = new FormData();
        formData.append("teklifHizmetlerButton","1");
        makeAjax(formData).then((data) => { 
            data.data.forEach((element,index) => {
                let btn ={
                    text:element.text,
                    className:element.className,
                action: function ( e, dt, node, config ) {tableFilter(teklifHizmetTable,4,element.action)}
                }
                teklifHizmetTable.button().add( index+1, btn);
            });
            
        })

      $('#teklifHizmet tbody').on('click', 'tr', function () {

         var tr = $(this)
         var row = teklifHizmetTable.row( tr );
         var rowData = row.data();
         debuging("tablodan hizmet eklendi",rowData)
         teklifSalonHizmetEkle(rowData)
       
      } );

    }

}
function HizmetSilConfirm(ID){
    let buttons=`<button type="button" class="btn btn-outline-danger btn-sm m-2" onclick="hizmetSil(${ID})" ><i class="fa-solid fa-trash-can"></i>Hizmeti Sil</button>`
    ToastConfimDelete.fire({
        icon: "warning",
        title: "Hizmeti silmek İstediğinizden Emin misiniz?",
        html:`${buttons}`,

        confirmButtonText: 'Vazgeç'
    })
}
function hizmetSil(ID){
    var formData = new FormData();
    formData.append("hizmetSil",ID);
    makeAjax(formData).then((data) => {
        $(`#hzm${ID}`).remove()
        if(data.status==1){

            ToastConfimDelete.close();
            Toast.fire({
                icon: "success",
                titleText: data.header,
                text:data.message,
                confirmButtonText: 'Tamam'
            })
        }
    })
}
function hizmetFilter(query){
    hizmetTable.column(2).search( query ).draw();
    $("[aria-clear='hizmetFilter']").toggleClass("btn-success",false)
    $("[aria-clear='hizmetFilter']").toggleClass("btn-outline-secondary",true)
    $("[aria-val='"+query+"']").toggleClass("btn-outline-secondary",false)
    $("[aria-val='"+query+"']").toggleClass("btn-success",true)

}
async function hizmetDuzenle(hizmetID){
    var formData = new FormData();
    formData.append("hizmetDuzenle",hizmetID);
    makeAjax(formData).then((data) => {
        $("#hizmetDuzenleAdi").val(data.data.hizmetAdi)
        $("#hizmetDuzenleFiyat").val(data.data.hizmetFiyati)
        $("#hizmetDuzenleNot").val(data.data.hizmetNotlari)
        $("#hizmetDuzenleID").val(data.data.ID)
        hizmetDuzenlearaSelect.val(data.data.hizmetGrubu);
        hizmetDuzenlearaSelect.trigger('change');
        $('#modal-Hizmet-Duzenle').modal('show')
    });
}
function hizmetDuzenleKaydet(e){
    toggleEditBekle('#hizmetDuzenleKaydetButtonGonder','#hizmetDuzenleKaydetButtonGonder')
	var formData = new FormData($("form#hizmetDuzenleForm")[0]);

	let formHata=false;
    if(formHata ==false ){formHata=formHataBak(null,$('input#hizmetDuzenleID').val())}
    if(formHata ==false ){formHata=formHataBak("#hizmetDuzenleAdi",formData.get("hizmetDuzenleAdi"))}
    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelEditGonder('#hizmetDuzenleKaydetButtonGonder','#hizmetDuzenleKaydetButtonGonder')
        return;
    }
    formData.append("hizmetDuzenleKaydet",$('input#hizmetDuzenleID').val());
    if ( ! $.fn.DataTable.isDataTable( '#hizmetListe' ) ) {
        inithizmetlisteTable()
    }
    makeAjax(formData).then((data) => { 
        $('#modal-Hizmet-Duzenle').modal('hide')
        $("[aria-clear='hizmetDuzenle']").val('')
        toggelEditGonder('#hizmetDuzenleKaydetButtonGonder','#hizmetDuzenleKaydetButtonGonder')
        hizmetTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
    })    
}
//#endregion