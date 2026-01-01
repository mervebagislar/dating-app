//#region ACENTA eventHandler
$( ".acentaEkle" ).on( "click", function() {
	debuging("eventHandler:","acentaEkle")
    $('#modal-Acenta-Ekle').modal('show')
});
$('#acentaEkleForm').submit(function (e) {
   e.preventDefault();
   acentaEkle(e)
});
$('#acentaDuzenleForm').submit(function (e) {
    e.preventDefault();
    acentaDuzenleKaydet(e)
 });
 $('#calisanEkleForm').submit(function (e) {
    e.preventDefault();
    calisanEkle(e)
 });
 $('#acentaCalisanDuzenleForm').submit(function (e) {
    e.preventDefault();
    acentaCalisanDuzenleKaydet(e)
 });
 $('#modal-Acenta-Calisan-Duzenle').on('hide.bs.modal', function () {
	$('#modal-Calisan-Liste').modal('show')
  })
//#endregion



//#region ACENTA
function acentaEkleLoad(){
    
	acentaEklearaSelect =$("#AcentaEkleGrupAra")
    acentaEklearaSelect.val();
	acentaDuzenlearaSelect =$("#AcentaDuzenleGrupAra")
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
    formData.append("acentaEkleGrupLoad","0");
    makeAjax(formData).then((data) => { 
        
       acentaEklearaSelect.select2({
            theme:"bootstrap4",
            data: data.results,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection
        })
        acentaEklearaSelect.trigger('change');
        acentaDuzenlearaSelect.select2({
            theme:"bootstrap4",
            data: data.results,
            templateResult: formatRepo,
            templateSelection: formatRepoSelection
        })
        acentaDuzenlearaSelect.trigger('change');
          
          
    })
}

async function acentaListele(){
    // acentaTable tanımlı değilse sadece acentaListesi'ni yükle
    if (typeof acentaTable === 'undefined') {
        console.log("acentaTable tanımlı değil, sadece acentaListesi yükleniyor...");
        let formData = new FormData();
        formData.append("bul","acentaBul");
        formData.append("q","");
        return makeAjax(formData).then((data) => { 
            acentaListesi = data.result;
            console.log("acentaListesi yüklendi:", acentaListesi);
            return acentaListesi;
        });
    }
    
    // acentaTable tanımlıysa normal işlemi yap
    acentaTable.clear().draw();
    var formData = new FormData();
    formData.append("acentaListele","1");
    return makeAjax(formData).then((data) => {
        acentaTable.rows.add( data.data ).draw();
        
        let formData = new FormData();
        formData.append("bul","acentaBul");
        formData.append("q","");
        return makeAjax(formData).then((data) => { 
            acentaListesi = data.result;
            return acentaListesi;
        });
    });
}
function acentaEkle(e){
    toggleBekle("#acentaKaydetButtonGonder","#acentaKaydetButtonBekle")
	var formData = new FormData($("form#acentaEkleForm")[0]);

    //console.table([...formData])
	let formHata;
    formHata=formHataBak("#acentaAdi",formData.get("acentaAdi"))
    formHata=formTelefonHataBak("#acentaTelefonu",formData.get("acentaTelefonu"))
    if(formData.get("acentaTelefonu")!="" && formData.get("acentaTelefonu").length < 10){$('#acentaTelefonu').toggleClass("border-danger",true); formHata=true}
    formData.append("acentaEkle","1");
    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#acentaKaydetButtonGonder","#acentaKaydetButtonBekle")
        return;
    }
    makeAjax(formData).then((data) => {
        $('.form-control').val("");
        toggelGonder("#acentaKaydetButtonGonder","#acentaKaydetButtonBekle")
        $('#modal-Acenta-Ekle').modal('hide')
        if(currentPage=="/firma/"){
            if ( ! $.fn.DataTable.isDataTable( '#acentaListe' ) ) {
                initacentalisteTable()
            }
            acentaListele()
        }
    })
    
}
function acentaDuzenleClear(){
   $("[aria-clear='acentaDuzenle']").val('')
}
function acentaDuzenle(ID){
    var formData = new FormData();
    formData.append("acentaDuzenleVeri",ID);
    makeAjax(formData).then((data) => {
        acentaDuzenleClear()
        $('#acentaAdiDuzenle').val(data.data.acentaAdi)
        $('#acentaAdresiDuzenle').val(data.data.acentaAdresi)
        if(data.data.acentaTelefon){$('#acentaTelefonuDuzenle').val(data.data.acentaTelefon)}
        $('#acentaFaturaBaslikDuzenle').val(data.data.acentaFaturaBaslik)
        $('#acentaVergiDairesiDuzenle').val(data.data.acentaVergiDairesi)
        if(data.data.acentaVergiNo){$('#acentaVergiNoDuzenle').val(data.data.acentaVergiNo)}
        if(data.data.acentaIl){$('#acentaIlDuzenle').val(data.data.acentaIl)}
        if(data.data.acentaIlce){$('#acentaIlceDuzenle').val(data.data.acentaIlce)}
        if(data.data.acentaWeb){$('#acentaWebDuzenle').val(data.data.acentaWeb)}
        if(data.data.acentaEposta){$('#acentaEpostaDuzenle').val(data.data.acentaEposta)}


        acentaDuzenlearaSelect.val(data.data.acentaGrubu);
        acentaDuzenlearaSelect.trigger('change');
        $('#AcenteIDDuzenle').val(data.data.ID)
        $('#modal-Acenta-Duzenle').modal('show')
    })
}
function acentaDuzenleKaydet(e){
    
    toggleEditBekle('#acentaKaydetButtonDuzenleGonder','#acentaKaydetButtonDuzenleBekle')
	var formData = new FormData($("form#acentaDuzenleForm")[0]);

    //console.table([...formData])
	let formHata = false;
    if(formHata ==false ){formHata=formHataBak(null,$('input#AcenteIDDuzenle').val())}
    if(formHata ==false ){formHata=formHataBak("#acentaAdiDuzenle",formData.get("acentaAdiDuzenle"))}
    if(formHata ==false ){formHata=formTelefonHataBak("#acentaTelefonuDuzenle",formData.get("acentaTelefonuDuzenle"))}
    
    console.log("acenta düzenle hata:",formHata)
    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelEditGonder('#acentaKaydetButtonDuzenleGonder','#acentaKaydetButtonDuzenleBekle')
        return;
    }
    formData.append("acentaDuzenleKaydet",$('input#AcenteIDDuzenle').val());
    makeAjax(formData).then((data) => {
        acentaDuzenleClear()
        toggelEditGonder('#acentaKaydetButtonDuzenleGonder','#acentaKaydetButtonDuzenleBekle')
        $('#modal-Acenta-Duzenle').modal('hide')
        acentaTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
    })
}
function acentaSilConfirm(ID){
    let acenta = acentaListesi.find(x => x.id == ID);

    let buttons = `Acentayı silmek istediğinizden eminmisiniz? <br> <u><strong>${acenta.text}</strong></u><br>`;
    buttons+=`<button type="button" class="btn btn-outline-danger btn-sm m-2" onclick="acentaSil(${ID})" ><i class="fa-solid fa-trash-can"></i>Acentayı Sil</button>`
    ToastConfimDelete.fire({
        icon: "warning",
        title: "Acenta silmeyi onayla!",
        html:`${buttons}`,

        confirmButtonText: 'Vazgeç'
    })
}
function acentaSil(ID){
    acentaListesi = null
    var formData = new FormData();
    formData.append("acentaSil",ID);
    makeAjax(formData).then((data) => {
        $(`#act${ID}`).remove()
        if(data.status==1){

            ToastConfimDelete.close();
            Toast.fire({
                icon: "success",
                titleText: data.header,
                text:data.message,
                confirmButtonText: 'Tamam'
            })
            //silme işleminden sonra tekrar acenta listesi çek
            let formData = new FormData();
            formData.append("bul","acentaBul");
            formData.append("q","");
            makeAjax(formData).then((data) => { 
                acentaListesi = data.result
            })
        }
    })
   
}
function acentaCalisanEkle(acentaID){
    $("[aria-clear='calisanEkle']").val('')    
    let araSelect =$("#acentaAra")
    araSelect.val(acentaID);
    araSelect.trigger('change');
    let rowID = `#act${acentaID}`;
    let cells = acentaTable.row(rowID).data()
    console.log(acentaTable.row(rowID).data())
    $('#calisanEkleAcentaAdi').text(cells.acentaAdi)
    $('#calisanEkleAcenta').val(acentaID)
    $('#modal-Calisan-Ekle').modal('show')
    

	araSelect.on('change', function() {
        if(this.value){
            $('#calisanEkleAcenta').val(this.value)
            let cell = acentaTable.row(`#act${this.value}`).data()

            $('#calisanEkleAcentaAdi').text(cell.acentaAdi)
        }
	  });
	araSelect.select2({
		theme:"bootstrap4",
		ajax: {
		  url: "../../worker/",
          type: 'POST',
          contentType: "application/json;charset=UTF-8",
		  dataType: 'json',
		  delay: 250,
		  data: function (params) {
			return  (JSON.stringify({
				bul:"acentaBul",	
			  q: params.term, // search term
			  page: params.page
			}));
		  },
		  processResults: function (data) {
			
			  if(data.status == 0){
				Toast.fire({
					icon: 'error',
					title: data.message
				});
				return {
					results: [],
					pagination: {
					  more: false
					}
				  };
			  }
			  else{
				return {
					results: data.result,
					pagination: {
					  more: false
					}
				  };
			  }
			
		  },
		  cache: true
		},

		minimumInputLength: 1,
	  });
}
function calisanEkle(e){
    toggleBekle("#calisanEkleButtonGonder","#calisanEkleButtonBekle")
	var formData = new FormData($("form#calisanEkleForm")[0]);

    //console.table([...formData])
	let formHata = false;
    if(formHata ==false ){formHata=formHataBak(null,$('input#calisanEkleAcenta').val())}
    if(formHata ==false ){formHata=formHataBak("#calisanEkleAdi",formData.get("calisanEkleAdi"))}
    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#calisanEkleButtonGonder","#calisanEkleButtonBekle")
        return;
    }
    formData.append("calisanEkle","1");
    formData.append("acentaID",$('#calisanEkleAcenta').val());
    makeAjax(formData).then((data) => {
        $("[aria-clear='calisanEkle']").val('')
        $('#calisanEkleAcentaAdi').text('')
        $('#calisanEkleAcenta').value=''
        $('#modal-Calisan-Ekle').modal('hide')
        Toast.fire({
            icon: "success",
            titleText: data.header,
            text:data.message,
            confirmButtonText: 'Tamam'
        })

        toggelGonder("#calisanEkleButtonGonder","#calisanEkleButtonBekle")
    })
    
}
function acentaCalisanListe(acentaID){
   
    $('#modal-Calisan-Liste').modal('show')
   
    var formData = new FormData();
    formData.append("acentaCalisanListele",acentaID);
    //initacentaCalisanTable()
    if ( ! $.fn.DataTable.isDataTable( '#acentaCalisanListe' ) ) {
        initacentaCalisanTable()
    }
    acentaCalisanTable.clear().draw();
    makeAjax(formData,true).then((data) => {
        acentaCalisanTable.rows.add( data.data ).draw();
        formData = new FormData();
        formData.append("bul","calisanBul");
        formData.append("acentaID",acentaID);
        formData.append("q","");
        makeAjax(formData).then((data) => { 
            acentaKullaniciListesi=data.result
        })
    })
}
function acentaCalisanSilConfirm(ID){
    let calisan = acentaKullaniciListesi.find(x => x.id == ID);
    let buttons = `Çalışanı silmek istediğinizden eminmisiniz? <br> <u><strong>${calisan.text}</strong></u><br>`;
    buttons+=`<button type="button" class="btn btn-outline-danger btn-sm m-2" onclick="acentaCalisanSil(${ID})" ><i class="fa-solid fa-trash-can"></i>Çalışanı Sil</button>`
    ToastConfimDelete.fire({
        icon: "warning",
        title: "Çalışan silmeyi onayla!",
        html:`${buttons}`,

        confirmButtonText: 'Vazgeç'
    })
}
function acentaCalisanSil(ID){
    acentaKullaniciListesi = null
    var formData = new FormData();
    formData.append("acentaCalisanSil",ID);
    makeAjax(formData).then((data) => {
        $(`#acID${ID}`).remove()
        if(data.status==1){

            ToastConfimDelete.close();
            Toast.fire({
                icon: "success",
                titleText: data.header,
                text:data.message,
                confirmButtonText: 'Tamam'
            })
            //silme işleminden sonra tekrar acenta çalışan listesi çek
            formData = new FormData();
            formData.append("bul","calisanBul");
            formData.append("acentaID",acentaID);
            formData.append("q","");
            makeAjax(formData).then((data) => { 
                acentaKullaniciListesi=data.result
            })
        }
    })
}
function acentaCalisanDuzenle(acID){
    $("[aria-clear='calisanDuzenle']").val('')
    var formData = new FormData();
    formData.append("acentaCalisanDuzenleVeri",acID);
    makeAjax(formData).then((data) => {
        $('#modal-Calisan-Liste').modal('hide')
        $("[aria-clear='calisanDuzenle']").val('')
        $('#calisanDuzenleID').val(data.data.ID)
        $('#calisanDuzenleAcenta').val(data.data.acentaID)
        $('#calisanDuzenleAdi').val(data.data.calisanAdi)
        $('#calisanDuzenleEposta').val(data.data.calisanEposta)
        $('#calisanDuzenleNot').val(data.data.calisanNot)
        //$('[aria-name="calisanDuzenleDurum1"]').prop("checked", false); 
        $('[aria-name="duzenleRadioCalisiyor"]').removeClass("active");
        //$('[aria-name="calisanDuzenleDurum2"]').prop("checked", true);
        $('[aria-name="duzenleRadioAyrildi"]').addClass("active");
        $("#calisanDuzenleDurum1").prop("checked", false); $("#calisanDuzenleDurum2").prop("checked", true);
        //if(data.data.calisanAktifmi){$("#calisanDuzenleDurum1").prop("checked", true); $("#calisanDuzenleDurum2").prop("checked", false);}
        
        if(data.data.calisanAktifmi==1){
            $("#calisanDuzenleDurum1").prop("checked", true); 
            $('[aria-name="duzenleRadioCalisiyor"]').addClass("active");
            $("#calisanDuzenleDurum2").prop("checked", false);
            $('[aria-name="duzenleRadioAyrildi"]').removeClass("active");
        }
        
        if(data.data.calisanTelefon!="0"){$('#calisanDuzenleTelefon').val(data.data.calisanTelefon)}
        
        $('#calisanDuzenleTelefon2').val(data.data.calisanTelefon2)
        $('#calisanDuzenleTelefon3').val(data.data.calisanTelefon3)
        $('#calisanDuzenleEposta2').val(data.data.calisanEposta2)
        $('#calisanDuzenlePozisyon').val(data.data.sirketPozisyonu)

        $('#modal-Acenta-Calisan-Duzenle').modal('show')
    })
    
}
function acentaCalisanDuzenleKaydet(e){
      
    toggleEditBekle('#acentaKaydetButtonDuzenleGonder','#acentaKaydetButtonDuzenleBekle')
	var formData = new FormData($("form#acentaCalisanDuzenleForm")[0]);
    //console.table([...formData])
	let formHata=false;

    if(formHata ==false ){formHata=formHataBak(null,$('input#calisanDuzenleAcenta').val())}
    if(formHata ==false ){formHata=formHataBak(null,$('input#calisanDuzenleID').val())}
    if(formHata ==false ){formHata=formHataBak("#calisanDuzenleAdi",formData.get("calisanDuzenleAdi"))}
    if(formHata ==false ){formHata=formTelefonHataBak("#calisanDuzenleTelefon",formData.get("calisanDuzenleTelefon"))}
    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        $('#calisanDuzenleButtonGonder').toggleClass("d-none",false)
        $('#calisanDuzenleButtonBekle').toggleClass("d-none",true)
        return;
    }
    formData.append("acentaCalisanDuzenleKaydet",$('input#calisanDuzenleID').val());
    if ( ! $.fn.DataTable.isDataTable( '#acentaCalisanListe' ) ) {
        initacentaCalisanTable()
    }
    makeAjax(formData).then((data) => { 
        $('#modal-Acenta-Calisan-Duzenle').modal('hide')
        $("[aria-clear='calisanDuzenle']").val('')
        $('#calisanDuzenleButtonGonder').toggleClass("d-none",false)
        $('#calisanDuzenleButtonBekle').toggleClass("d-none",true)
        acentaCalisanTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
    })    
   
}