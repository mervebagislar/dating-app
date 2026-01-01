let digerHizmetlerID=8
let apiBase = "http://192.168.1.249/worker/";
//let apiBase = "../../worker/";

async function makeAjax(formData,debug=false){
    if(debug){console.log("ajax starts")}
    //debuging("ajax starts...","*",debug)
    let ser = JSON.stringify(Object.fromEntries(formData))
    
    try {
        let ret = await $.ajax({
            type: "POST",
            url: apiBase,
            data: ser,
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            processData: true,
            headers: jwtToken ? { "Authorization": "Bearer " + jwtToken } : {}
        });
        
        // Status kontrolü burada yapılıyor
        if(ret.status == -99){
            window.location.replace("../../giris/");
            return; // Yönlendirme yapıldığında fonksiyondan çık
        }
        if(ret.status == 0){
            ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: ret.header,
                html: ret.message,
                confirmButtonText: 'Tamam'
            })
        }
        
        //debuging("return send","*",debug)
        return ret;
        
    } catch (error) {
        console.error("AJAX Error:", error);
       
        
        // JWT token hatası durumunda da giriş sayfasına yönlendir
        if(error.responseJSON && error.responseJSON.status == -99) {
            window.location.replace("../../giris/");
            return;
        }
        // Hata durumunda da response döndür ki .then() chain'i bozulmasın
        return {
            status: 0,
            message: "AJAX hatası oluştu: " + (error.responseText || error.statusText || "Bilinmeyen hata"),
            header: "Hata",
            data: null
        };
    }
}
async function makeAjaxFile(formData,debug=false){
    if(debug){console.log("file ajax starts")}
    debuging("file ajax starts...","*",debug)
    
    try {
        let ret = await $.ajax({
            url: apiBase,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            headers: jwtToken ? { "Authorization": "Bearer " + jwtToken } : {}
        });
        
        // Status kontrolü burada yapılıyor
        if(ret.status == -99){
            window.location.replace("../../giris/");
            return; // Yönlendirme yapıldığında fonksiyondan çık
        }
        if(ret.status == 0){
            ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: ret.header,
                html: ret.message,
                confirmButtonText: 'Tamam'
            })
        }
        
        debuging("return send","*",debug)
        return ret;
        
    } catch (error) {
        console.error("AJAX File Error:", error);
        // JWT token hatası durumunda da giriş sayfasına yönlendir
        if(error.responseJSON && error.responseJSON.status == -99) {
            window.location.replace("../../giris/");
            return;
        }
        // Hata durumunda da response döndür ki .then() chain'i bozulmasın
        return {
            status: 0,
            message: "AJAX hatası oluştu",
            header: "Hata",
            data: null
        };
    }
}
function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
function makeIntid(length) {
    let result = '';
    const characters = '123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return parseInt(result);
}
function tableFilter(table,column,query){
    table.column(column).search( query ).draw();
  //  $("[aria-clear='hizmetFilter']").toggleClass("btn-success",false)
   // $("[aria-clear='hizmetFilter']").toggleClass("btn-outline-secondary",true)
  //  $("[aria-val='"+query+"']").toggleClass("btn-outline-secondary",false)
  //  $("[aria-val='"+query+"']").toggleClass("btn-success",true)

}
function dovizYenile(){
    
    let formData = new FormData();
    formData.append("doviz","1");
    makeAjax(formData).then((data) => { 
        dolarkuru = data.data.dolar
        eurokuru=data.data.euro
        $('.dollar').text(dolarkuru)
        $('.euro').text(eurokuru)
        if(teklifTaslak.teklifAdi!=""){
            if(teklifTaslak.teklifDolarKuru == 1){
                teklifTaslak.teklifDolarKuru = dolarkuru
            }
            if(teklifTaslak.teklifEuroKuru == 1){
                teklifTaslak.teklifEuroKuru = eurokuru
            }
            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`dövizyenile:`,teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        }
    })
}

//#region PAGE STARTUPS
function takvimStartUp(){
    var calendarEl = document.getElementById('calendar');
    let today = moment(new Date()).format("YYYY-MM-DD");
    takvim = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today refreshButton',
        center: 'title',
        right: 'dayGridYear,dayGridMonth,dayGridWeek,listMonth'
      },
      buttonText:{
        dayGridYear:"Yıl",
        dayGridMonth:"Ay",
        dayGridWeek:"Hafta",
        listMonth:"Liste",
        today:"Bugün"
      },
      customButtons: {
        refreshButton: {
          text: 'Yenile',
          click: function() {
            takvim.refetchEvents()
          }
        }
      },
      eventClick: function(arg) { 
        console.log(arg)
        //takvimGetEventDetails(arg)  
    },
      firstDay: 1,
      initialDate: today,
      stickyHeaderDates:true,
      nowIndicator: true,
      initialView: 'dayGridMonth',
      navLinks: true, // can click day/week names to navigate views 
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true, // allow "more" link when too many events
      
      eventSources: [
        {
            id:1,
            url: apiBase,
            method: 'POST',
            headers: jwtToken ? { "Authorization": "Bearer " + jwtToken } : {},
            //startParam: null, //resetting default fullcalendar parameter
            //endParam: null, //resetting default fullcalendar parameter
            data: function() {
                var date = $('#calendar').fullCalendar('getDate')._d;
                var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
                var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

                //firstDay = $filter('date')(firstDay, 'yyyy-MM-dd');
                //lastDay = $filter('date')(lastDay, 'yyyy-MM-dd');
                //AngularJS way of changing the date format to yyyy-mm-dd

                return {
                    startParam: firstDay,
                    endParam: lastDay
                }
            },
            extraParams: {
              takvimFilter: 'events'
            },
            failure: function() {
              //alert('Teklifler alınırken bir hata oluştu');
              ToastCenter.fire({
                    icon: "error", 
                    title: "Teklifler alınırken bir hata oluştu",
                    confirmButtonText: 'Tamam'
                })

            }
        }
      ]
    });
    takvim.setOption('locale', 'tr');
    takvim.render();
}

function takvimGetEventDetails(arg){
    if (arg.url) {
        //if you want to open url in the same tab
        //location.href = arg.url
        //if you want to open url in another window / tab, use the commented code below
        window.open(arg.url)
        //return false;
    }
    var formData = new FormData();
    if(arg.event._def.extendedProps.uuid != null || arg.event._def.extendedProps.uuid !=undefined){
        formData.append("takvimDetails","uuid");
        formData.append("uuid",arg.event._def.extendedProps.uuid);
        location.href = `../../teklif/?uuid=${arg.event._def.extendedProps.uuid}`
    }
    else{
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"Seçtiğiniz teklif linkine ulaşılamıyor",
            confirmButtonText: 'Tamam'
        })
    }
   
}
function modalLoad(){

}
function genelLoad(){
    try {
        $(".kullaniciAdi").text(kullaniciAdi)
        $(".kullaniciMail").text(kullaniciMail)
        //$("#sayfaBasligi").text(`${currentPage} -  sW: ${sWidth}  -  sH:${sHeight}`)
        if($('#kullaniciAdiMobile').length > 0) {$("#kullaniciAdiMobile").text(kullaniciAdi)}
        if($('#kullaniciAdiBirMobile').length > 0) {$("#kullaniciAdiBirMobile").text(kullaniciAdi)}
        if($('#kullaniciMailMobile').length > 0) {$("#kullaniciMailMobile").text(kullaniciMail)}
        acentaEkleLoad()
        hizmetEkleLoad()
        personelEkleLoad()
        masrafEkleLoad()
        yeniTeklifTarihYerlestir()
        yeniTeklifKurulumYerlestir()
        yeniTeklifTerminYerlestir()
        //inittahsilatOdemeEkleTable
        if ( ! $.fn.DataTable.isDataTable( '#tahsilatEkleListe' ) ) {
            inittahsilatEkleTable()
        }
        let taslak = sessionStorage.getItem("taslak");
        if(taslak == null){
            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging("taslak==null:",teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        }
        else{
            teklifTaslak = JSON.parse(sessionStorage.getItem("taslak"));
            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging("taslak!=null:",teklifTaslakCopy)
        }
        let teklif = sessionStorage.getItem("teklif");
        if(teklif == null){
            sessionStorage.setItem("teklif", JSON.stringify(teklifTaslak));
        }
        else{
            teklif = JSON.parse(sessionStorage.getItem("teklif"));
        } /**/
        if ( ! $.fn.DataTable.isDataTable( '#odemeEkleListe' ) ) {
            initodemeEkleTable()
        }
        
    }
    catch(err) {
        console.warn(err.message)
    }
}
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
//#endregion

//#region HİZMET
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


//#region TEKLİF
async function teklifYazBasla(acentaID,CalisanID){

    teklifTaslak = JSON.parse(sessionStorage.getItem("taslak"));
    
    if(acentaID == 0 && CalisanID == 0){
       teklifYazYeni()
    }
    else{
        teklifYazTaslak(acentaID,CalisanID)
    }
}
async function teklifYazYeni(){
    $('[aria-name="teklifCalisanContainer"]').toggleClass("d-none",true)
    let acentaAra =$("#teklifAcentaSec")
    let kullaniciAra=$("#teklifCalisanSec")
    let teklifSecAdi= $('input[name="teklifSecAdi"]')
    teklifTaslak.teklifYazanAdi=kullaniciAdi
    teklifTaslak.teklifYazanID=userID
    teklifTaslak.teklifYazanMail=kullaniciMail

    acentaAra.on('change', function() {
        if(this.value > 0){
            teklifTaslak.teklifAcentaID = this.value
            teklifTaslak.teklifAcentaAdi=acentaAra.select2('data')[0].text
            if (  $('#teklifSecAdi').val() <= 0){

                let taslakName=`Teklif-Taslak-${makeid(8)}`;
                teklifTaslak.teklifAdi = taslakName;
                $('[aria-name="yeniTeklifAdiDegistirInput"]').val(taslakName)
                $('#teklifSecAdi').attr("placeholder", taslakName);
            }
            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`teklifYazBasla acentaAra.onchange:`,teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
            teklifCalisanSelectOlustur(kullaniciAra,this.value)
        }
        
    });
    kullaniciAra.on('change', function() {
        if(this.value > 0){
            teklifTaslak.teklifAcentaCalisanID = this.value
            teklifTaslak.teklifAcentaCalisanAdi=kullaniciAra.select2('data')[0].text
            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`teklifYazBasla kullaniciAra.onchange:`,teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        }
    });
    teklifSecAdi.on('change', function() {
        teklifTaslak.teklifAdi = this.value
        teklifTaslak.teklifEventAdi = this.value
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
        debuging(`teklifYazBasla teklifSecAdi.onchange:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    });
    if(teklifTaslak.teklifAcentaID == ""){
        teklifAcentaSelectOlustur(acentaAra);
        $('#modal-Teklif-AcentaCalisanSec').modal('show')
        return;
    }
    if(teklifTaslak.teklifAcentaID>0){
        let buttons = `Taslağa kaldığınız yerden devam etmek istermisiniz? <br>`;
        buttons += `<button type="button" class="btn btn-outline-success btn-sm m-2" onclick="teklifSayfasınaGit()" ><i class="fa-solid fa-check-to-slot"></i> Teklife Devam Et</button>`;
        buttons+=`<button type="button" class="btn btn-outline-danger btn-sm m-2" onclick="teklifTemizle(true)" ><i class="fa-solid fa-trash-can"></i> Temizle</button>`
        ToastCenterSpecialButton.fire({
            icon: "warning",
            title: "Kayıtlı taslak var",
            html:`${buttons}`,

            confirmButtonText: 'Vazgeç'
        })
    }
}
async function teklifYazTaslak(acentaID,CalisanID) {
    if(acentaID !=0){
        teklifTemizle()
        teklifTaslak.teklifAcentaID =acentaID
        if(CalisanID!=0){
            teklifTaslak.teklifAcentaCalisanID = CalisanID
        }
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
        debuging(`teklifYazBasla if acetaID&calisanID:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        teklifSayfasınaGit()
    }
    else{
        //TODO acenta boş bırakılamaz yazısı çıkart
    }
}
function teklifTemizle(start=false){

    swal.close();
    $('[aria-name="yeniTerminTarihi"]').val('')
    $('[aria-name="yeniTekliflokasyon"]').val('')
    teklifTaslakSifirla()
    let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
    debuging(`teklifTemizle:`,teklifTaslakCopy)
    sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    if(start){teklifYazBasla(0,0)}
}

async function teklifAcentaAdiBul(acentaID){
    formData = new FormData();
    formData.append("acentaAdiBak",acentaID);
    let ret = await makeAjax(formData).then((data) => {
      return data.data.acentaAdi
    });
    return ret
}
async function teklifAcentaSelectOlustur(element,selected=0){
    if(acentaListesi != null){
        element.select2({
            theme:"bootstrap4",
            data: acentaListesi
        })
        element.val(selected);
        element.trigger('change');
    }
    else{
        let formData = new FormData();
        formData.append("bul","acentaBul");
        formData.append("q","");
        await makeAjax(formData).then((data) => { 
            acentaListesi = data.result
            element.select2({
                theme:"bootstrap4",
                data: data.result
            })
           element.val(selected);
            element.trigger('change');
        })
    }
}
async function teklifCalisanSelectOlustur(element,acentaID){
    let formData = new FormData();
        formData.append("bul","calisanBul");
        formData.append("acentaID",acentaID);
        formData.append("q","");
        makeAjax(formData).then((data) => { 
            if(data.status == 1){
                acentaKullaniciListesi=data.result
                element.empty().trigger("change");
                element.val(null).trigger('change');
                element.select2({
                    theme:"bootstrap4",
                    data: data.result
                })
                
                element.val(teklifTaslak.teklifAcentaCalisanID).trigger('change');
                $('[aria-name="teklifCalisanContainer"]').toggleClass("d-none",false)

            }
            else{
                $('[aria-name="teklifCalisanContainer"]').toggleClass("d-none",true)
                element.empty().trigger("change");
                element.val(null).trigger('change');
            }
        })
}
function teklifDurumGuncelle(durum,ID){
    if(durum==6){
        Toast.fire({
			icon: "success",
			text:"FATURA İÇİN MUTABAKAT SOR"
		})
        return;
    }
    debuging("TaslakDurumGuncelle:","*")
	let formData=new FormData();
	formData.append("taslakTeklifDurumGuncelle","1");
	formData.append("teklifID",ID);
	formData.append("teklifDurum",durum);
	makeAjax(formData).then((data) => {
		debuging("teklif güncellendi:","*")
		if(data.status==0){
			Toast.fire({
				icon: "error",
				text:data.message
			})
			return
		}
		Toast.fire({
			icon: "success",
			text:"Teklif Durumu Güncellendi"
		})
        
		if(currentPage=="/tumteklifler/"){
            tumTeklifTable.row( `#${data.result.DT_RowId}`).data(data.result).draw(false);
			//tumTekliflerLoad()
		}
        if(data.result.durumCode==5){
            data.result.mutabakat.data.teklifAdi = data.result.teklifAdi
            if(data.result.mutabakat.status==0){    
                Toast.fire({
                    icon: "error",
                    text:data.result.mutabakat.message
                })
                return
            }
            sonMutabakatGoster(data.result.mutabakat.data)
        }
    })
}


function teklifSayfasınaGit(){
    window.location.replace("../../yeniteklif/");
}
function yeniTeklifSalonEkle(){
    if(!$('[aria-name="yeniTeklifSalonEkleAdi"]').val()){
        $('[aria-name="yeniTeklifSalonEkleAdi"]').toggleClass("is-invalid",true)
        //alert("salonadi bos")
        return;
    }
    $('[aria-name="yeniTeklifSalonEkleAdi"]').toggleClass("is-invalid",false)
   // let salonAdi = $('[aria-name="yeniTeklifSalonEkleAdi"]').val()
    $('[aria-name="yeniTeklifSalonEkleButton"]').prop('disabled', false);
	$('[aria-name="yeniTeklifSalonEkleAdi"]').toggleClass("d-none",true)
	$('[aria-name="yeniSalonEkleInputKaydet"]').toggleClass("d-none",true)
    let yeniSalon = {
        salonAdi:$('[aria-name="yeniTeklifSalonEkleAdi"]').val(),
        icerik:[],
        salonGun:teklifTaslak.teklifIsGun,
        hizmetGrupFiyatlari:[],
        salonAraFiyat:0,
        salonIndirim:0,
        salonFinalFiyat:0
    }
    teklifTaslak.teklifIcerik.push(yeniSalon);
    yeniSalonID = teklifTaslak.teklifIcerik.length-1
    debuging(`yeniSalonID:`,yeniSalonID,true)
    
    //$(`#custom-nav-1-tab`).tab('show');
    let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
    debuging(`yeniTeklifSalonEkle:`,teklifTaslakCopy)
    sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    //alert($('[aria-name="yeniTeklifSalonEkleAdi"]').val())
    $('[aria-name="yeniTeklifSalonEkleAdi"]').val("")

    teklifSalonYerlestir()
}
function teklifKurulumUcretlimi(cb){
    if(cb.checked) {
        $('[aria-name="yeniTeklifKurulumKatsayiContainer"]').toggleClass("d-none",false)
        
    }
    else{
        $('[aria-name="yeniTeklifKurulumKatsayiContainer"]').toggleClass("d-none",true)
    }
}
//teklif parçalarını yerleştir
function teklifSabitleriYerlestir(){
    //teklif adı
    let yeniTeklifAdi = $('[aria-name="yeniTeklifAdi"]')
    if(teklifTaslak.teklifAdi.length >0){
        $('[aria-name="yeniTeklifAdi"]').val(nameReplace(teklifTaslak.teklifAdi)+` (Rev ${teklifTaslak.teklifRevize})`)
        $('[aria-name="yeniTeklifAdiDegistirInput"]').val(nameReplace(teklifTaslak.teklifAdi))
        if(teklifTaslak.teklifLokasyon){$('[aria-name="yeniTekliflokasyon"]').val(nameReplace(teklifTaslak.teklifLokasyon))}
        //$('[aria-name="yeniTeklifAdiInput"]').attr("placeholder", teklifTaslak.teklifAdi);
       // $('[aria-name="yeniTeklifAdContainer"]').toggleClass('d-none',true)
        //$('[aria-name="yeniTeklifAdiDuzenle"]').toggleClass('d-none',false)
    }
    else{
        let taslakName=`Teklif-Taslak-${makeid(8)}`;
        teklifTaslak.teklifAdi = taslakName;
        $('[aria-name="yeniTeklifAdi"]').val(nameReplace(teklifTaslak.teklifAdi+` (Rev ${teklifTaslak.teklifRevize})`))
        //$('[aria-name="yeniTeklifAdiDuzenle"]').toggleClass('d-none',true)
        //yeniTeklifAdi.toggleClass('d-none',true)
       // $('[aria-name="yeniTeklifAdContainer"]').toggleClass('d-none',false)
    }/**/
    if(teklifTaslak.teklifTarihi==""){ teklifTaslak.teklifTarihi = moment().format("MM/DD/YYYY") }
    teklifTaslak.teklifTarihi = moment().format("MM/DD/YYYY")
    if(teklifTaslak.teklifRevize==""){teklifTaslak.teklifRevize=1}
    if(teklifTaslak.teklifKurulumUcretlimi){ 
        $(`[aria-name="yeniTeklifKurulumUcretlimi"]`).attr('checked','checked')
        $('[aria-name="yeniTeklifKurulumKatsayiContainer"]').toggleClass('d-none',false)
        $('[aria-name="yeniTeklifKurulumKatsayi"]').val(teklifTaslak.teklifKurulumCarpan)
        
    }
  //  if(teklifTaslak.teklifDolarKuru ==""){teklifTaslak.teklifDolarKuru=String(dolarkuru)}
    //if(teklifTaslak.teklifEuroKuru ==""){teklifTaslak.teklifEuroKuru=String(eurokuru)}
    //dolar kuru
    
    /*
    +teklifDolarKuru
    teklifEuroKuru
    +teklifRevize
    +teklifTarihi
    */
}
function teklifYazanYerlestir(){
     ////teklif yazan bilgileri boşsa doldur
     if(teklifTaslak.teklifYazanID==""){
        teklifTaslak.teklifYazanID=userID
        teklifTaslak.teklifYazanMail=kullaniciMail
        teklifTaslak.teklifYazanAdi=kullaniciAdi
    }
    //teklifi yazan bilgilerini yerleştir
    $('[aria-name="yeniTeklifYazanAdi"]').text(nameReplace(teklifTaslak.teklifYazanAdi))
    $('[aria-name="yeniTeklifYazanMail"]').text(nameReplace(teklifTaslak.teklifYazanMail))
}
function yeniTeklifNakliyeYerleştir(){
        let baslangic
    if(teklifTaslak.teklifNakliyeTarihi !=""){
        debuging(`tarih boş degil `,"*")
        let teklifNakliyeTarihi=new Date( Date.parse(teklifTaslak.teklifNakliyeTarihi));
        baslangic = moment(teklifNakliyeTarihi)
        $('[aria-name="yeniTeklifNakliyeTarihiGoster"]').val(`${baslangic.format('DD.MM.YYYY')}`)
      
        baslangic=baslangic.format("DD-MM-YYYY")
    }
    $('[aria-name="yeniTeklifNakliyeTarihi"]').daterangepicker({
        locale:takvimLocale,
        singleDatePicker: true,
        opens: 'left',
        autoApply: true,
        startDate: baslangic,
        endDate: baslangic,
        timeZone: 'Europe/Istanbul'
    }, function(start, end, label) {
        teklifTaslak.teklifNakliyeTarihi = start.format("MM/DD/YYYY")
        //teklifTaslak.teklifIsKurulumBitis = end.format("MM/DD/YYYY")
        $('[aria-name="yeniTeklifNakliyeTarihiGoster"]').val(`${start.format('DD.MM.YYYY')}`)
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))

        debuging(`yeniTeklifNakliyeYerlestir:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    });
}
function yeniTeklifKurulumYerlestir(){
    //teklif kurulum başlangıç ve bitiş tarihi yerleştir
    let baslangic
    let bitis
    if(teklifTaslak.teklifIsKurulumBaslangic == "Invalid date" || teklifTaslak.teklifIsKurulumBitis =="Invalid date"){
        teklifTaslak.teklifIsKurulumBaslangic="";
        teklifTaslak.teklifIsKurulumBitis = "";
    }
    if(teklifTaslak.teklifIsKurulumBaslangic !="" && teklifTaslak.teklifIsKurulumBitis !=""){
        //baslangic =moment.tz(teklifTaslak.teklifIsKurulumBaslangic,'Asia/Istanbul');
        let baslangicDate=new Date( Date.parse(teklifTaslak.teklifIsKurulumBaslangic));
        baslangic = moment(baslangicDate)
        let bitisDate = new Date( Date.parse(teklifTaslak.teklifIsKurulumBitis));
        bitis = moment(bitisDate)
        
        $('[aria-name="yeniTeklifKurulumTarihiGoster"]').val(`${baslangic.format('DD.MM.YYYY')} -> ${bitis.format('DD.MM.YYYY')} (${teklifTaslak.teklifIsKurulumGun})`)
        baslangic=baslangic.format("DD-MM-YYYY")
        bitis=bitis.format("DD-MM-YYYY")
        //DD-MM-YYYY
    }
    console.log("başlangıç tarihi:",baslangic)
    console.log("bitis tarihi:",bitis)
    $('[aria-name="yeniTeklifKurulumTarihi"]').daterangepicker({
        locale:takvimLocale,
        opens: 'left',
        autoApply: true,
        linkedCalendars:false,
        startDate: baslangic,
        endDate: bitis,
        timeZone: 'Europe/Istanbul'
    }, function(start, end, label) {
        teklifTaslak.teklifIsKurulumBaslangic = start.format("MM/DD/YYYY")
        teklifTaslak.teklifIsKurulumBitis = end.format("MM/DD/YYYY")
        let kurulumGun=end.diff(start, 'days')+1
        teklifTaslak.teklifIsKurulumGun=kurulumGun
        $('[aria-name="yeniTeklifKurulumTarihiGoster"]').val(`${start.format('DD.MM.YYYY')} -> ${end.format('DD.MM.YYYY')}(${teklifTaslak.teklifIsKurulumGun})`)
        
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
        debuging(`yeniTeklifKurulumYerlestir:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    }); /**/
}
function yeniTeklifTarihYerlestir(){
    //teklif kurulum başlangıç ve bitiş tarihi yerleştir
    let baslangic
    let bitis
     if(teklifTaslak.teklifIsBaslangic == "Invalid date" || teklifTaslak.teklifIsBitis =="Invalid date"){
        teklifTaslak.teklifIsBaslangic="";
        teklifTaslak.teklifIsBitis = "";
    }
    if(teklifTaslak.teklifIsBaslangic !="" && teklifTaslak.teklifIsBitis !=""){
        let baslangicDate=new Date( Date.parse(teklifTaslak.teklifIsBaslangic));
        baslangic = moment(baslangicDate)
        let bitisDate = new Date( Date.parse(teklifTaslak.teklifIsBitis));
        bitis = moment(bitisDate)
        $('[aria-name="yeniTeklifTarihiGoster"]').val(`${baslangic.format('DD.MM.YYYY')} -> ${bitis.format('DD.MM.YYYY')} (${teklifTaslak.teklifIsGun})`)
        baslangic=baslangic.format("DD-MM-YYYY")
        bitis=bitis.format("DD-MM-YYYY")
    }
    $('[aria-name="yeniTeklifTarihi"]').daterangepicker({
        locale:takvimLocale,
        opens: 'center',
        drops: "auto",
        autoApply: true,
        linkedCalendars:false,
        startDate: baslangic,
        endDate: bitis,
        timeZone: 'Europe/Istanbul'
    }, function(start, end, label) {
        if(teklifTaslak.teklifIsKurulumBaslangic==""){
            teklifTaslak.teklifIsKurulumBaslangic = start.format("MM/DD/YYYY")
            teklifTaslak.teklifIsKurulumBitis = start.format("MM/DD/YYYY")
            teklifTaslak.teklifIsKurulumGun="0"
            $('[aria-name="yeniTeklifKurulumTarihiGoster"]').val(`${start.format('DD.MM.YYYY')} -> ${start.format('DD.MM.YYYY')} (${teklifTaslak.teklifIsKurulumGun})`)
            
            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`yeniTeklifTarihYerlestir daterangepicker:`,teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        }

        if(start.format("MM/DD/YYYY")<teklifTaslak.teklifIsKurulumBaslangic){
            ToastCenterWhiteButton.fire({
                icon: "error",
                titleText:"Tarih hatası",
                text:"İş başlangıcı kurulumdan önce olamaz",
                confirmButtonText: 'Tamam'
            })
            return;
        }
        if(end.format("MM/DD/YYYY") <teklifTaslak.teklifIsKurulumBitis){
            ToastCenterWhiteButton.fire({
                icon: "error",
                titleText:"Tarih hatası",
                text:"İş bitiş tarihi kurulum bitiminden önce olamaz",
                confirmButtonText: 'Tamam'
            })
            return;
        }
        teklifTaslak.teklifIsBaslangic = start.format("MM/DD/YYYY")
        teklifTaslak.teklifIsBitis = end.format("MM/DD/YYYY")
        let IsGun=end.diff(start, 'days')+1
        teklifTaslak.teklifIsGun=IsGun
        teklifTaslak.teklifIcerik[0].salonGun=IsGun
        $('[aria-name="yeniTeklifTarihiGoster"]').val(`${start.format('DD.MM.YYYY')} -> ${end.format('DD.MM.YYYY')} (${teklifTaslak.teklifIsGun})`)
        
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
        debuging(`yeniTekifTarifYerlestir:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        
       
    });
}
function yeniTeklifTerminYerlestir(){
    debuging(`yeniTeklifTerminYerlestir`,"*")
    if(teklifTaslak.teklifTerminSuresi !=""){
    
        let baslangicDate=new Date( Date.parse(teklifTaslak.teklifTerminSuresi));
        baslangic = moment(baslangicDate).format("DD.MM.YYYY")
        $('[aria-name="yeniTerminTarihi"]').val(baslangic)
    }
    if($('#yeniTerminTarihi').length != 0) {
        $('#yeniTerminTarihi').datetimepicker({
            format: 'DD.MM.YYYY',locale: 'tr'
        });
    }
    if($('#teklifTerminTarihi').length != 0) {
        $('#teklifTerminTarihi').datetimepicker({
            format: 'DD.MM.YYYY',locale: 'tr'
        });
    }
}
function teklifAcentaYerlestir(){
     //teklif acenta ve çalışan yerleştir
     let acentaElement = $('[aria-name="yeniTeklifAcentaSec"]')
     let calisanElement = $('[aria-name="yeniTeklifAcentaCalisanSec"]')
     let selected = 
     acentaElement.on('change', function() {
         if(this.value > 0){
            if(teklifTaslak.teklifAcentaID !=this.value){
                teklifTaslak.teklifAcentaCalisanID = ""
                teklifTaslak.teklifAcentaCalisanAdi=""
            }
            teklifTaslak.teklifAcentaID = this.value
            teklifTaslak.teklifAcentaAdi=acentaElement.select2('data')[0].text

            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`teklifAcentaYerlestir acentaElement.onchange:`,teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
            teklifCalisanSelectOlustur(calisanElement,this.value)
         }
     });
 
     calisanElement.on('change', function() {
        if(this.value > 0){
            teklifTaslak.teklifAcentaCalisanID = this.value
            teklifTaslak.teklifAcentaCalisanAdi=calisanElement.select2('data')[0].text

            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`teklifAcentaYerlestir calisanElement.onchange:`,teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
             
        }
         
     });
     teklifAcentaSelectOlustur(acentaElement,teklifTaslak.teklifAcentaID)
}
function teklifSecilenSalon(index){
   secilenSalon=index
   debuging(`seçilen Salon:`,secilenSalon)
}
function sadeceSalonHesapla(){
    let genelToplam = 0;
    teklifTaslak.teklifIcerik.forEach((element,index)=>{
        genelToplam +=element.salonFinalFiyat;
    })
    teklifTaslak.teklifAraToplam = genelToplam
    let indirimlifiyat = genelToplam-teklifTaslak.teklifIndirim
    teklifTaslak.teklifAnaToplam = indirimlifiyat
    $(`#teklifAnaFiyatGuncelle`).val(genelToplam)

    let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
    debuging(`sadeceSalonHesap:`,teklifTaslakCopy)
    sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
}
function salonToplamHesapla(){
    let genelToplam = 0;
    teklifTaslak.teklifIcerik.forEach((element,index)=>{
        let salonAraFiyat =0;
        element.hizmetGrupFiyatlari.forEach((item,subindex)=>{
            $(`#salon-${index}-hizmetGrup-${item.grupID}-hizmetAraFiyat`).val(item.grupToplam)
            salonAraFiyat +=item.grupToplam
        })
        let salonFinalFiyat= parseFloat(salonAraFiyat)-element.salonIndirim
        teklifTaslak.teklifIcerik[index].salonAraFiyat = parseFloat(salonAraFiyat)
        teklifTaslak.teklifIcerik[index].salonFinalFiyat = salonFinalFiyat
        $(`#salon-${index}-salonAraFiyat`).val(salonAraFiyat)
        $(`#salon-${index}-ToplamFiyat`).val(salonFinalFiyat)
        genelToplam +=salonFinalFiyat;
    })
    teklifTaslak.teklifAraToplam = genelToplam
    let indirimlifiyat = genelToplam-teklifTaslak.teklifIndirim
    teklifTaslak.teklifAnaToplam = indirimlifiyat
    $(`#teklifAnaFiyatGuncelle`).val(genelToplam)

    let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
    debuging(`salonToplamHesap:`,teklifTaslakCopy)
    sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    //salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmetAraFiyat
}
function teklifKatsayiHesapla(gun){
  /*  let ret = 1
    if(gun==1){  ret=1; }
    if(gun==2){  ret=2; }
    if(gun==3){  ret=2.8; }
    if(gun==4){  ret=3.5; }
    if(gun==5){  ret=4; }
    if(gun>5){  ret=gun-1; }

*/
    return gun
}
function taslakFiyatHesapla(){
    let grandTotal = 0;
    let formatPrice=new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
    });
    teklifTaslak.teklifIcerik.forEach((element,index)=>{
        let salonID = index
        let salonToplam = 0
        //hizmet grup fiyatlarını baştan hesaplamak için hizmet gruplarını siliyoruz
        teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari=[]
        let isGenelHizmet = false;
        if(element.salonAdi == "Genel Hizmetler"){
            isGenelHizmet = true;
        }
        //her bir hizmeti tek tek hesaplıyoruz
        element.icerik.forEach((item,subIndex)=>{
            let hizmetGrubuID= item.hizmetGrupID
           
            let kurulumCarpan = parseFloat(teklifTaslak.teklifKurulumCarpan)
            if(teklifTaslak.teklifKurulumCarpan == ""){kurulumCarpan=0}
            
            let objt = teklifTaslak.teklifIcerik[salonID].icerik.find(x => x.ID == item.ID);
	        let grupIndext = teklifTaslak.teklifIcerik[salonID].icerik.indexOf(objt);
            // katsayıyı buluyoruz 
            
            let katsayiOrjinal = teklifKatsayiHesapla(parseFloat(item.gunSayisi))
            let katsayi=1
            /*if(teklifTaslak.teklifKurulumUcretlimi){
                katsayi = katsayi+kurulumCarpan
                if(isGenelHizmet){katsayi = katsayiOrjinal;}
                
            }
            else{
                
                katsayi = katsayiOrjinal;
            }*/
            katsayi = katsayiOrjinal;
            
            //toplam hizmet katsayısını buluyoruz
            let hizmetToplam = (parseFloat(item.hizmetFiyati)*parseFloat(item.adet))*katsayi
            teklifTaslak.teklifIcerik[salonID].icerik[grupIndext]["hizmetToplam"]=hizmetToplam
            //hizmet grubu tanımlanmamışsa tanımlıyoruz, tanımlanmışsa indexini buluyoruz
           
            //DEĞİŞTİ
            let grupIndex =-1;
            try {
                
            let obj = teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari.find(x => x.grupID == hizmetGrubuID);
	        grupIndex = teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari.indexOf(obj);
            } catch (error) {
                grupIndex =-1
            }
            //let grupIndex = hizmetGrubuID;
            if(grupIndex == -1){
                let hizmetGrupFiyatlari={
                    grupID:hizmetGrubuID,
                    grupAdi:item.hizmetGrubu,
                    grupToplam:0,
                    grupParaBirimi:teklifTaslak.teklifParaBirimi
                }
                //HİZMET GRUPLARI SIRALAMA DEĞİŞTİRİLİYOR
                teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari.push(hizmetGrupFiyatlari)
                obj = teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari.find(x => x.grupID == hizmetGrubuID);
	            grupIndex = teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari.indexOf(obj);
                
                
            }
            
            //grup fiyatlarına hizmet fiyatını ekliyoruz.
            let grupFiyatTotal = teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari[grupIndex].grupToplam + hizmetToplam
            teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari[grupIndex].grupToplam= grupFiyatTotal
            
            
            //hizmet toplamını okunut formata çeviriyoruz
            var hizmetFormatted = formatPrice.format(hizmetToplam);
            //ilgili hizmet fiyat alanına çıktıyı yazdırıyoruz
            $(`#salon-${salonID}-hizmet-${item.ID}-FiyatToplam`).text(hizmetFormatted)
            
            //salonToplam+=hizmetToplam
        })

       
    })
    salonToplamHesapla()
     //hizmet grubu toplamından salon toplamını buluyoruz.


    // grandTotal+=salonToplam
     //let salonFormatted = formatPrice.format(salonToplam);
     //$(`#custom-nav-${salonID}-Total`).text(salonFormatted)
    // $(`#custom-nav-${salonID}-currency`).html("₺")

    //let totalFormatted = formatPrice.format(grandTotal);
    //$(`#grandTotal`).text(totalFormatted)
    //sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
   // $(`#grandTotal-currency`).html("₺")
    
}
function teklifSalonHizmetEkle(hizmetOriginal,secilen = -1,itemIndex=-1){
    let salonSirala = false
    hizmet= JSON.parse(JSON.stringify(hizmetOriginal))
    debuging(`teklifSalonHizmetEkle : secilen:${secilen} itemIndex:${itemIndex} hizmet:`,hizmet)
    let dovizKatsayi = 1/ teklifTaslak.teklifDolarKuru
    let hizmetFiyati = 0
    hizmet["hizmetNotlari"]="";
    hizmet["hizmetFiyati"]=parseFloat(hizmet["hizmetFiyati"])
    let collapseButton =""
    let hizmetret = ""
    let localsecilenSalon = secilenSalon
    //eğer function ile salon belirtilmişse o salonu seçilen yap
    if(secilen != -1){localsecilenSalon = secilen;}
    //adet belirtilmemişse yada adet kayıdı yoksa adeti 1 olarak ata
    debuging(`secilen:${secilen} - localSecilen: ${localsecilenSalon}`,"*")
    if(hizmet["adet"]== undefined){ 
        debuging(`hizmet adedi belirtilmediği için 1 olarak ayarlandı`,"*")
        hizmet["adet"]=1;
     }   
    //gün sayısı belirtilmemişse günü 1 olarak ata
    if(teklifTaslak.teklifIcerik[localsecilenSalon].salonGun==""){teklifTaslak.teklifIcerik[localsecilenSalon].salonGun=1}
    let obj = teklifTaslak.teklifIcerik[localsecilenSalon].icerik.find(x => x.ID == hizmet.ID);
	let index = teklifTaslak.teklifIcerik[localsecilenSalon].icerik.indexOf(obj);
    //kayıttan okunmuyorsa gün sayısını  salona kayıtlı genel gün sayısından al, kayıttan okunuyorsa taslak gün sayısından al
    if( index != -1){ hizmet["gunSayisi"]=teklifTaslak.teklifIcerik[localsecilenSalon].icerik[index].gunSayisi }
    else{ hizmet["gunSayisi"]=teklifTaslak.teklifIcerik[localsecilenSalon].salonGun }
    //eğer hizmet diğer hizmetse "diğer hizmetler" sekmesine yazdır
    if(hizmet.hizmetGrupID == digerHizmetlerID){
        localsecilenSalon=1
        hizmetFiyati = hizmet["hizmetFiyati"]
        hizmetFiyatToplam = hizmetFiyati*(hizmet["adet"]*hizmet["gunSayisi"])
        if($(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Container`).length == 0) {

            if($(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Container`).length == 0) {
                collapseButton = `
                <div class="collapse show" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Content">
                    <div class="card card-body-hizmet" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Container">
                        <div class="row card-header-small">
                            <div class="col-4">Hizmet</div>
                            <div class="col-2">Adet</div>
                            <div class="col-2">Gün</div>
                            <div class="col-2">Fiyat</div>
                            <div class="col-2 d-flex justify-content-end"> </div>
                        </div>
                    </div>
                </div>`
                $("#custom-nav-" + localsecilenSalon).append(collapseButton)
                salonsirala=true
            }



            //if(secilen == -1){hizmet["adet"]=1}
            hizmetret = `
                <div id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Container" >
                    <div class="row">
                        <div class="col-4"> ${nameReplace(hizmet.hizmetAdi)}</div>
                        <div class="col-2"><input class="form-control-sm col-12" type="number" aria-name="hizmetAdetGuncelle" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Adet"  min="1" value=${hizmet["adet"]}></div>
                        <div class="col-2"><input class="form-control-sm col-12" type="number" aria-name="hizmetGunGuncelle" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Gun"  min="1" value=${hizmet["gunSayisi"]}></div>
                        <div class="col-3">
                            <div class="d-flex">
                                <input type="number" aria-name="hizmetFiyatGuncelle" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Fiyat" min="0" step="100" value=${hizmetFiyati.toFixed(2)}  class="form-control-sm col-10 d-inline">
                                <span class="d-inline" id="salon-${localsecilenSalon}-hizmet-${hizmet.ID}-FiyatToplam">${hizmetFiyatToplam}</span>
                            </div>
                        
                        
                        
                        </div>
                        <div class="col-1">
                        <button type="button" class="btn-sm d-inline ml-1 btn-outline-danger" aria-name="hizmetSil" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}">
                            <i class="fa-regular fa-trash-can" ></i>
                         </button>
                    </div>
                        <hr class="hr border-top col-10" />
                    </div>
                          
                </div>
            `;
            $("#custom-nav-" + localsecilenSalon).append(hizmetret)  

            //hizmet günü ilk açıldığında hep 1 olarak açılacak
            //hizmet.gunSayisi = 1
            if(secilen == -1){teklifTaslak.teklifIcerik[localsecilenSalon].icerik.push(hizmet)}
        }
        else{
            let obj = teklifTaslak.teklifIcerik[localsecilenSalon].icerik.find(x => x.ID === hizmet.ID);
            let index = teklifTaslak.teklifIcerik[localsecilenSalon].icerik.indexOf(obj);
            teklifTaslak.teklifIcerik[localsecilenSalon].icerik[index].adet=parseInt($(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Adet`).val())+1
            hizmet["adet"]=teklifTaslak.teklifIcerik[localsecilenSalon].icerik[index].adet
            $(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Adet`).val(hizmet["adet"])
        }
        if(secilen == -1){
            Toast.fire({
                icon: "success",
                text:"Hizmet 'Diğer'e işlendi"
            })

            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`teklifSalonHizmetEkle digerHizmetler secilen==-1:`,teklifTaslakCopy)
            sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        }
        taslakFiyatHesapla()
        return;
    }

    //salon tabı varmı kontrol et eğer tab yoksa hata ver ve işlemi bitir
    if($("#custom-nav-" + localsecilenSalon).length == 0) {
        ToastCenterWhiteButton.fire({
            icon: "error",
            titleText: "Salon bulunamadı",
            text:"Seçilen salon olmadığı için hizmet ekleyemezsiniz",
            confirmButtonText: 'Tamam'
        })
        
        return;
    }
    
    //eğer hizmet grubu butonu daha önce oluşturulmamışsa önce hizmet grubunu oluştur
    if($(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Button`).length == 0) {
        collapseButton = `
        <div class="row">
            
                <button class="btn btn-outline-secondary btn-sm col-8 mt-2" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Button" type="button" data-toggle="collapse" data-target="#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Content" aria-expanded="true" aria-controls="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Content">
                ${nameReplace(hizmet.hizmetGrubu)}
                </button>
           
            <input class="btn btn-outline-secondary  btn-sm col-4 mt-2" type="number" aria-name="hizmetAraFiyatGuncelle" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}"  id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmetAraFiyat"  min="1" value="">
            
        </div>
        
        <div class="collapse show" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Content">
            <div class="card card-body-hizmet" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Container">
                <div class="row card-header-small">
                    <div class="col-4">Hizmet</div>
                    <div class="col-2">Adet</div>
                    <div class="col-2">Gün</div>
                    <div class="col-2">Fiyat</div>
                    <div class="col-2 d-flex justify-content-end">
                        
                        <i class="btn-sm-round d-inline  fa fa-plus ml-1 btn-success ml-1" aria-name="salonHizmetEkle" aria-hizmetGrupAdi="${hizmet.hizmetGrubu}" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}"></i> 
                        <i class="btn-sm d-inline fa-regular fa-trash-can ml-1 btn-danger" aria-name="hizmetGrupSil" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}"></i>
                    </div>
            </div>
            </div>
        </div>`
        $("#custom-nav-" + localsecilenSalon).append(collapseButton)
        salonsirala=true
    }
    //eğer hizmet daha önce eklenmemişse hizmeti ekle, eklenmişse hizmet adedini arttır
    if($(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Container`).length == 0) {
        //if(secilen == -1){
           // hizmet["adet"]=1
        hizmetFiyati = hizmet["hizmetFiyati"]
        hizmetFiyatToplam = hizmetFiyati*(hizmet["adet"]*hizmet["gunSayisi"])
        hizmetret = `
            <div id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Container" >
                <div class="row">
                    <div class="col-md-4"> ${nameReplace(hizmet.hizmetAdi)}</div>
                    <div class="col-md-2"><input class="form-control-sm col-12" type="number" aria-name="hizmetAdetGuncelle" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Adet"  min="1" value=${hizmet["adet"]}></div>
                    <div class="col-md-2"><input class="form-control-sm col-12" type="number" aria-name="hizmetGunGuncelle" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Gun"  min="1" value=${hizmet["gunSayisi"]}></div>
                    <div class="col-md-3">
                        <div class="d-flex">
                            <input type="number" aria-name="hizmetFiyatGuncelle" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}" id="salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Fiyat" min="0" step="100" value=${hizmetFiyati.toFixed(2)}  class="form-control-sm col-8 d-inline">
                            <span class="d-inline ml-2" id="salon-${localsecilenSalon}-hizmet-${hizmet.ID}-FiyatToplam">${hizmetFiyatToplam}</span>
                        </div>
                    
                    
                    
                    </div>
                    <div class="col-1">
                        <button type="button" class="btn-sm d-inline ml-1 btn-outline-danger" aria-name="hizmetSil" aria-salon="${localsecilenSalon}" aria-hizmetGrup="${hizmet.hizmetGrupID}" aria-hizmetID="${hizmet.ID}">
                            <i class="fa-regular fa-trash-can" ></i>
                         </button>
                    </div>
                    <hr class="hr border-top col-10" />
                </div>
                      
            </div>
        `;
        if(secilen == -1){
            teklifTaslak.teklifIcerik[localsecilenSalon].icerik.push(hizmet)
        }
    }
    else{
        //sayfa yenilemede kayıttan okunmuyorsa var olan hizmetin sayısını arttır
        if(secilen == -1){
            let obj = teklifTaslak.teklifIcerik[localsecilenSalon].icerik.find(x => x.ID === hizmet.ID);
            let index = teklifTaslak.teklifIcerik[localsecilenSalon].icerik.indexOf(obj);
            teklifTaslak.teklifIcerik[localsecilenSalon].icerik[index].adet=parseInt($(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Adet`).val())+1

            hizmet["adet"]=teklifTaslak.teklifIcerik[localsecilenSalon].icerik[index].adet
            $(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Adet`).val(hizmet["adet"])
        }
    }

    //eğer kayıttan okunmuyorsa taslağa ekle ve kaydet
    if(secilen == -1){
        //bilgileri session storage e kayder
            let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
            debuging(`teklifSalonHizmetEkle secilen==-1:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        taslakFiyatHesapla()
    }
    //hizmeti sayfaya yazdır
    $(`#salon-${localsecilenSalon}-hizmetGrup-${hizmet.hizmetGrupID}-Container`).append(hizmetret)
    if(salonSirala){ tekSalonYerlestir(localsecilenSalon); }
   
}
function tekSalonYerlestir(salonID){
        index=salonID
        let isActive = "";
        let show = "";
        let selected = "false"
        let item = teklifTaslak.teklifIcerik[index]
        if(index == 0){
            isActive="active"
            show = "show active";
            selected = "true"
        }
        $(`#custom-nav-${index}`).html("")
        //$('[aria-name="yeniTeklifTabContent"]').append(content)
        //arr[index] = item * 10;
        let tab = `<a class="nav-item nav-link ${isActive}" id="custom-nav-${index}-tab" data-toggle="tab" href="#custom-nav-${index}" role="tab" aria-controls="custom-nav-${index}" aria-salon="${index}" onclick="teklifSecilenSalon(${index})" aria-selected="${selected}">${nameReplace(item.salonAdi)}</a>`;
        let content= `
        
            <div class="row" >
                <div class="col-md-8">
                    <div class="input-group mb-2">
                        <button class="btn btn-secondary btn-prepend btn-prepend-sm" > &nbsp &nbsp Ara Toplam</button>
                        <input class="form-control-sm col-8 d-inline" type="number" aria-name="salonAraFiyatGuncelle" aria-salon="${index}"   id="salon-${index}-salonAraFiyat"  min="1"  step="100" value="">
                        <div class="input-group-btn">
                            <button class="btn btn-secondary btn-append btn-append-sm" aria-name="salonIndirimGuncelleParaBirimi"  aria-salon="${index}" >  ₺ </button>
                        </div>
                    </div>
                    <div class="input-group mb-2">
                    <button class="btn btn-secondary btn-prepend btn-prepend-sm"> &nbsp &nbsp &nbsp &nbsp İndirim &nbsp  &nbsp &nbsp</button>
                        <input class="form-control-sm col-8 d-inline" type="number" aria-name="salonIndirimGuncelle"  aria-salon="${index}"   id="salon-${index}-salonIndirim" id="salonIndirimGuncelle" min="0" step="100" value="${item.salonIndirim}" >
                        <div class="input-group-btn">
                            <button class="btn btn-secondary btn-append btn-append-sm" aria-name="salonIndirimGuncelleParaBirimi"  >  ₺ </button>
                        </div>
                    </div>
                    <div class="input-group mb-2">
                    <button class="btn btn-success btn-prepend btn-prepend-sm"> Salon Toplam</button>
                        <input class="form-control-sm col-8 d-inline" type="number" aria-name="salonToplam"  aria-salon="${index}"   id="salon-${index}-ToplamFiyat" id="salonToplam" min="0" step="100" value="" disabled>
                        <div class="input-group-btn">
                            <button class="btn btn-success btn-append btn-append-sm" aria-name="salonToplamFiyatParaBirimi"  >  ₺ </button>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="d-flex justify-content-end" >
                        <button type="button" class="btn-sm d-inline ml-1 btn-outline">
                        </button>
                        <button type="button" class="btn-sm-round d-inline ml-1 btn-success" aria-name="salonHizmetEkle" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Hizmet Ekle">
                            <i class="fa fa-plus" ></i>
                        </button>
                        <button type="button" class="btn-sm d-inline ml-1 btn-warning" aria-name="salonDuzenle" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Düzenle">
                            <i class="fa fa-edit" ></i>
                        </button>
                        <button type="button" class="btn-sm d-inline ml-1 btn-info" aria-name="salonKopyala" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Kopyala">
                            <i class="fa fa-copy" ></i>
                        </button>   
                        <button type="button" class="btn-sm d-inline ml-1 btn-info" aria-name="salonSirala" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Sırala">
                            <i class="fa-solid fa-arrow-down-a-z"></i>
                        </button> 
                        <button type="button" class="btn-sm d-inline ml-1 btn-danger" aria-name="salonSil" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Sil">
                            <i class="fa-regular fa-trash-can" ></i>
                        </button> 
                    </div> 
                </div>
                <div class="col-md-8">
                    
                    
                </div>
                <div class="col-md-8">
                    
                    
                </div>
               
            </div>
        `;

        //$('[aria-name="yeniTeklifTabList"]').append(tab)
       // $('[aria-name="yeniTeklifTabContent"]').append(content)
       $(`#custom-nav-${index}`).html(content)
        if(item.icerik.length >0){
            let salonIndex=index
            item.icerik.sort((a,b) => a.hizmetGrupID - b.hizmetGrupID);
            item.icerik.forEach((item, index, arr) => {
                teklifSalonHizmetEkle(item,salonIndex,index)
             });
        }
        taslakFiyatHesapla()
    
}
function teklifSalonYerlestir(){
    $('[aria-name="yeniTeklifTabList"]').html("")
    $('[aria-name="yeniTeklifTabContent"]').html("")
    teklifTaslak.teklifIcerik.forEach(icerik)

    function icerik(item, index, arr) {
        
        let isActive = "";
        let show = "";
        let selected = "false"
        if(index == 0){
            isActive="active"
            show = "show active";
            selected = "true"
        }
        //arr[index] = item * 10;
        let tab = `<a class="nav-item nav-link ${isActive}" id="custom-nav-${index}-tab" data-toggle="tab" href="#custom-nav-${index}" role="tab" aria-controls="custom-nav-${index}" aria-salon="${index}" onclick="teklifSecilenSalon(${index})" aria-selected="${selected}">${nameReplace(item.salonAdi)}</a>`;
        let content= `
        <div class="tab-pane mb-2 fade ${show}" id="custom-nav-${index}" role="tabpanel" aria-labelledby="custom-nav-${index}-tab">
            <div class="row" >
                <div class="col-md-8">
                    <div class="input-group mb-2">
                        <button class="btn btn-secondary btn-prepend btn-prepend-sm" > &nbsp &nbsp Ara Toplam</button>
                        <input class="form-control-sm col-8 d-inline" type="number" aria-name="salonAraFiyatGuncelle" aria-salon="${index}"   id="salon-${index}-salonAraFiyat"  min="1"  step="100" value="">
                        <div class="input-group-btn">
                            <button class="btn btn-secondary btn-append btn-append-sm" aria-name="salonIndirimGuncelleParaBirimi"  aria-salon="${index}" >  ₺ </button>
                        </div>
                    </div>
                    <div class="input-group mb-2">
                    <button class="btn btn-secondary btn-prepend btn-prepend-sm"> &nbsp &nbsp &nbsp &nbsp İndirim &nbsp  &nbsp &nbsp</button>
                        <input class="form-control-sm col-8 d-inline" type="number" aria-name="salonIndirimGuncelle"  aria-salon="${index}"   id="salon-${index}-salonIndirim" id="salonIndirimGuncelle" min="0" step="100" value="${item.salonIndirim}" >
                        <div class="input-group-btn">
                            <button class="btn btn-secondary btn-append btn-append-sm" aria-name="salonIndirimGuncelleParaBirimi"  >  ₺ </button>
                        </div>
                    </div>
                    <div class="input-group mb-2">
                    <button class="btn btn-success btn-prepend btn-prepend-sm"> Salon Toplam</button>
                        <input class="form-control-sm col-8 d-inline" type="number" aria-name="salonToplam"  aria-salon="${index}"   id="salon-${index}-ToplamFiyat" id="salonToplam" min="0" step="100" value="" disabled>
                        <div class="input-group-btn">
                            <button class="btn btn-success btn-append btn-append-sm" aria-name="salonToplamFiyatParaBirimi"  >  ₺ </button>
                        </div>
                    </div>
                </div>
                <div class="col-md-2">
                    <div class="d-flex justify-content-end" >
                        <button type="button" class="btn-sm d-inline ml-1 btn-outline">
                        </button>
                        <button type="button" class="btn-sm-round d-inline ml-1 btn-success" aria-name="salonHizmetEkle" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Hizmet Ekle">
                            <i class="fa fa-plus" ></i>
                        </button>
                        <button type="button" class="btn-sm d-inline ml-1 btn-warning" aria-name="salonDuzenle" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Düzenle">
                            <i class="fa fa-edit" ></i>
                        </button>
                        <button type="button" class="btn-sm d-inline ml-1 btn-info" aria-name="salonKopyala" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Kopyala">
                            <i class="fa fa-copy" ></i>
                        </button>   
                        <button type="button" class="btn-sm d-inline ml-1 btn-info" aria-name="salonSirala" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Sırala">
                            <i class="fa-solid fa-arrow-down-a-z"></i>
                        </button> 
                        <button type="button" class="btn-sm d-inline ml-1 btn-danger" aria-name="salonSil" aria-salon="${index}" data-toggle="tooltip" data-placement="top" title="Sil">
                            <i class="fa-regular fa-trash-can" ></i>
                        </button> 
                    </div> 
                </div>
                <div class="col-md-8">
                    
                    
                </div>
                <div class="col-md-8">
                    
                    
                </div>
               
            </div>
        </div>`;

        $('[aria-name="yeniTeklifTabList"]').append(tab)
        $('[aria-name="yeniTeklifTabContent"]').append(content)
        if(item.icerik.length >0){
            let salonIndex=index
            item.icerik.sort((a,b) => a.hizmetGrupID - b.hizmetGrupID);
            item.icerik.forEach((item, index, arr) => {
                teklifSalonHizmetEkle(item,salonIndex,index)
             });
        }
    }

    if(yeniSalonID !=-1){
        $(`#custom-nav-${yeniSalonID}-tab`).tab('show');
        teklifSecilenSalon(yeniSalonID)
        yeniSalonID = -1
    }
   
}

function malzemeTablosuYarat(){
    initTeklifHizmet()
    let formData = new FormData();
    formData.append("hizmetlerTablosu","1");
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
         teklifSalonHizmetEkle(rowData)
      } );

    
}
function teklifIndir(path,dosyaAdi){
    $('#predownloadContainer').toggleClass('d-none',true)
    $('#indir').toggleClass('d-none',false)
    $('#indirDosyaAdi').text(dosyaAdi)
    const url = path;
    const a = document.getElementById('indir');
    a.href = url+"/"+dosyaAdi;
    a.download = dosyaAdi;
}
/***************teklif parçaları sonu */
function teklifDuzenle(teklifID){
    teklifTemizle();
    formData = new FormData();
    formData.append("teklifVeriBul","1");
    formData.append("search","ID")
    formData.append("query",teklifID)
    makeAjax(formData).then((data) => { 
       // anaTeklifTemizle()
       let editTeklif= data.result[0];
       let editIcerik = editTeklif.icerik
       editIcerik.ID = editTeklif.ID
       editIcerik.teklifEkip = editTeklif.ekip
       editIcerik.uuid = editTeklif.uuid
       debuging(`teklifDuzenle:`,editIcerik)
       teklifTaslak = editIcerik
        //teklif= data.result[0]
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
        debuging(`eklifDuzenle taslak:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        window.location.replace("../../yeniteklif/");
        //teklifYerlestir()
        //teklifSalonOlustur()
        
    })
}
function revizeOlustur(teklifID){
   // teklifTemizle();
    formData = new FormData();
    formData.append("teklifRevizeOlustur","1");
    formData.append("query",teklifID)
    makeAjax(formData).then((data) => { 
        let editTeklif= data.data;
        let editIcerik = editTeklif.icerik
        editIcerik.ID = editTeklif.ID
        editIcerik.teklifEkip = editTeklif.ekip
        editIcerik.uuid = editTeklif.uuid
        debuging(`revizeOlustur:`,editIcerik)
        teklifTaslak = editIcerik
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
        debuging(`revizeOlustur taslak:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        window.location.replace("../../yeniteklif/");
        /*
       let editTeklif= data.result[0];
       let editIcerik = editTeklif.icerik
       editIcerik.ID ="-1"
       editIcerik.teklifEkip = editTeklif.ekip
       editIcerik.uuid = ""
       editIcerik.teklifRevize= editIcerik.teklifRevize+1
       teklifTaslak = editIcerik
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        window.location.replace("../../yeniteklif/");*/
        
    })
}
function teklifKopyala(teklifID){
    teklifTemizle();
    formData = new FormData();
    formData.append("teklifVeriBul","1");
    formData.append("search","ID")
    formData.append("query",teklifID)
    makeAjax(formData).then((data) => { 
       // anaTeklifTemizle()
       let editTeklif= data.result[0];
       let editIcerik = editTeklif.icerik
       editIcerik.ID = -1
       editIcerik.teklifEkip = []
       editIcerik.uuid = ""
       editIcerik.teklifAcentaAdi=""
       editIcerik.teklifAcentaCalisanAdi=""
       editIcerik.teklifAcentaCalisanID=""
       editIcerik.teklifAcentaID=""
       editIcerik.teklifAdi=""
       editIcerik.teklifDurumAdi="Yeni Taslak"
       editIcerik.teklifDurumu=1
       editIcerik.teklifEventAdi=""
       editIcerik.teklifIsBaslangic=""
       editIcerik.teklifIsBitis=""
       editIcerik.teklifIsGun=1
       editIcerik.teklifRevize=1
       editIcerik.teklifTarihi=""
       editIcerik.teklifYazanAdi=""
       editIcerik.teklifYazanID=""
       editIcerik.teklifYazanMail=""
       console.log(editIcerik)
       teklifTaslak = editIcerik
        //teklif= data.result[0]
        let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
        debuging(`teklifKopyala:`,teklifTaslakCopy)
        sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
        window.location.replace("../../yeniteklif/");
        //teklifYerlestir()
        //teklifSalonOlustur()
        
    })
}
async function yeniTeklifLoad(){
    teklifTaslak = JSON.parse(sessionStorage.getItem("taslak"));
    debuging("YENİ TEKLİF LOAD","*")
    teklifSabitleriYerlestir()
    debuging("TEKLİF SABİTLERİ YERLEŞTİR DONE","*")
    teklifYazanYerlestir()
    debuging("TEKLİF YAZAN YERLEŞTİR DONE","*")
    teklifAcentaYerlestir()
    debuging("TEKLİF ACENTA YERLEŞTİR DONE","*")
    yeniTeklifNakliyeYerleştir()
    debuging("TEKLİF NAKLİYE YERLEŞTİR DONE","*")
    yeniTeklifKurulumYerlestir()
    debuging("TEKLİF KURULUM YERLEŞTİR DONE","*")
    yeniTeklifTarihYerlestir()
    debuging("TEKLİF TARİH YERLEŞTİR DONE","*")
    yeniTeklifTerminYerlestir()
    debuging("TEKLİF TERMİN YERLEŞTİR DONE","*")
    teklifSalonYerlestir()
    debuging("TEKLİF SALON YERLEŞTİR DONE","*")
    malzemeTablosuYarat()
    debuging("MALZEME TABLOSU YARAT DONE","*")
    taslakFiyatHesapla()
    debuging("TASLAK FİYAT HESAPLA DONE","*")
    
    
    /*nameReplace(teklif.icerik.teklifAcentaAdi)*/
   
    
   
    //teklifin son halini kaydet

    let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
    debuging("yeniTeklifLoad:",teklifTaslakCopy)
    sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    debuging("YENİ TEKLİF LOAD DONE.....","*")
}
//#endregion

//#region KULLANICI
function kullaniciHesapBak(){
    formData = new FormData();
    formData.append("kullaniciHesapBak","1");
    makeAjax(formData).then((data) => { 
        $('[aria-name="kullaniciAdi"]').text(data.data.kullaniciAdi)
        $('[aria-name="kullaniciYetki"]').text(data.data.kullaniciYetki)
        $('[aria-name="kullaniciMail"]').text(data.data.kullaniciEposta)
        $('#modal-kullaniciHesap').modal('show')
        
    })
}
function hesapSifreDegistirKaydet(){
    $("#new-password-1").toggleClass("border-danger",false)
    $("#new-password-2").toggleClass("border-danger",false)
    $("#old-Password").toggleClass("border-danger",false)


    let yeniSifre1=$("#new-password-1").val();
    let yeniSifre2=$("#new-password-2").val();
    let eskiSifre=$("#old-Password").val();
    if(eskiSifre.length <=0){

        $("#old-Password").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Eski şifre alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    if(yeniSifre1.length <=0){
        $("#new-password-1").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Yeni şifre alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    if(yeniSifre1.length <8){
        $("#new-password-1").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Yeni şifre enaz 8 hane olmalıdır",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    if(yeniSifre1 != yeniSifre2){
        $("#new-password-1").toggleClass("border-danger",true)
        $("#new-password-2").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Yeni şifre ve şifre tekrarı aynı değil",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    formData = new FormData();
    formData.append("hesapSifreDegistir","1");
    formData.append("eskiSifre",eskiSifre);
    formData.append("yeniSifre",yeniSifre1);
    makeAjax(formData).then((data) => { 

        
        if(data.status==1){
            Toast.fire({
                icon: "success",
                text:data.message
            })
            $("#new-password-1").val("")
            $("#new-password-2").val("")
            $("#old-Password").val("")
            $('#sifreCollapse').collapse('hide');
        }
    })
}
//#endregion
//#region PERSONEL
function personelEkleLoad(){
    personelDepartmanAra =$("#personelDepartmanAra")
    personelGorevAra = $("#personelGorevAra")
    personelDepartmanAra.val();
    personelGorevAra.val();
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
    formData.append("personelDepartmanAra","0");
    makeAjax(formData).then((data) => { 
       personelDepartmanAra.select2({
            theme:"bootstrap4",
            data: data.result
        })
        personelDepartmanAra.val('').trigger('change');
        //personelDepartmanAra.trigger('change');
    })
    personelGorevAra.select2()
    personelDepartmanAra.on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data.id);
        personelGorevAra.empty().append(new Option()).trigger('change');
        var formDatas = new FormData();
        formDatas.append("personelGorevAra",data.id);
        makeAjax(formDatas).then((datas) => { 
            console.log(datas)
            personelGorevAra.select2({
                theme:"bootstrap4",
                data: datas.result
            })
            personelGorevAra.trigger('change');
        })
    });
    $('#personelEkleDogumTarihi').datetimepicker({
        format: 'DD.MM.YYYY',viewMode: "years",locale: 'tr'
    });
    //$('#personelDuzenleDogumTarihi').datetimepicker({
    //   format: 'DD.MM.YYYY',viewMode: "years"
    //});
   // console.log($('#personelDuzenleDogumTarihi').data("DateTimePicker"))
    
}
function personelEkle(e){
    toggleBekle("#personelEkleButtonGonder","#personelEkleButtonGonder")
	var formData = new FormData($("form#personelEkleForm")[0]);

    //console.table([...formData])
    let personelDepartman = formData.get("personelDepartmanAra")
    let personelGorev = formData.get("personelGorevAra")
    formData.delete("personelDepartmanAra");
    formData.delete("personelGorevAra");
    formData.append("personelDepartman", personelDepartman);
    formData.append("personelGorev", personelGorev);
	let formHata=false;
    if(formHata ==false ){formHata=formHataBak("#personelEkleAdi",formData.get("personelEkleAdi"))}
    if(formHata ==false ){
        if(!TCNOKontrol(formData.get("personelEkleTC"))){$('#personelEkleTC').toggleClass("border-danger",true); formHata=true}
        else{$('#personelEkleTC').toggleClass("border-danger",false);}
    }
   
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#personelEkleButtonGonder","#personelEkleButtonGonder")
        return;
    }
    formData.append("personelEkle","1");
    makeAjax(formData).then((data) => {
        
         Toast.fire({
            icon: "success",
            text:data.message
        })
        $('.form-control').val("");
        toggelGonder("#personelEkleButtonGonder","#personelEkleButtonGonder")
        $('#modal-Personel-Ekle').modal('hide')
        if(currentPage=="/personel/"){
            if ( ! $.fn.DataTable.isDataTable( '#personelListe' ) ) {
                initpersonelisteTable()
            }
            personelListele()
        }
    })
}
function personelListele(){
    personelTable.clear().draw();
    var formData = new FormData();
    formData.append("personelListele","1");
    makeAjax(formData).then((data) => {
        console.log('Personel Listesi Verisi:', data);
        // Her personel için işlemler sütununu oluştur
        personelTable.rows.add( data.data ).draw();
    })
}

function personelYetkilendirmeAc(ID){ 
    personelYetkilendirmeAc(ID,null,null,null)
}
// Personel yetkilendirme modalını açan fonksiyon
function personelYetkilendirmeAc(personelID, personelAd=null, personelTC=null, departman=null) {
    console.log('Personel Yetkilendirme Açılıyor:', {
        personelID: personelID,
        personelAd: personelAd,
        personelTC: personelTC,
        departman: departman
    });
    
    // Modal bilgilerini doldur
    $('#personelYetkilendirmeID').val(personelID);
    $('#personelYetkilendirmeAdi').text(personelAd);
    $('#personelYetkilendirmeTC').text(personelTC);
    $('#personelYetkilendirmeDepartman').text(departman);
    
    // Önce modülleri yükle, sonra personel yetkilerini yükle
    modulleriYukle(personelID).then(() => {
        personelYetkilendirmeYukle(personelID, personelAd, personelTC, departman);
    }).catch((error) => {
        console.error('Modül yükleme hatası:', error);
        // "Kayıtlı yetki bulunmadı" hatası geldiğinde modalı kapat
        if (error && error.includes("yetki")) {
            $('#modal-personel-yetkilendirme').modal('hide');
        }
    });
    
    // Modalı aç
    $('#modal-personel-yetkilendirme').modal('show');
}


function modulleriYukle(personelID) {   
    return new Promise((resolve, reject) => {       
        var formData = new FormData();
        formData.append("modulleriGetir", personelID);    
  
        makeAjax(formData).then((data) => {
            console.log('Modül Verisi:', data);
            if (data.status === 1) {
                modulleriRender(data.data);
                resolve();
            } else {
                console.error('Modül yükleme hatası:', data.message);
                reject(data.message);
            }
        }).catch((error) => {
            console.error('Modül yükleme hatası:', error);
            reject(error);
        });
    });
}

// Modül ID'lerini saklamak için global değişken
var modulIDleri = {};

// Modülleri HTML'e render eden fonksiyon
function modulleriRender(moduller) {
    var container = $('#modulYetkileriContainer');
    var html = '';
    
    // Modül ID'lerini sakla
    modulIDleri = {};
    
    if (moduller && moduller.length > 0) {
        moduller.forEach(function(modul) {
            var modulAdi = modul.alias || modul.tanim || modul.ad;
            var modulBaslik = modul.alias || modul.tanim || modul.ad;
            var modulIcon = modul.icon;
            
            // Modül ID'sini sakla
            modulIDleri[modulAdi] = modul.ID;
            
            html += '<div class="card mb-3">';
            html += '<div class="card-header" style="cursor: pointer; padding: 12px 15px;">';
            html += '<div class="d-flex justify-content-between align-items-center">';
            html += '<div class="d-flex align-items-center" style="flex: 1; margin-left: 8px;">';
            html += '<span class="modul-baslik d-flex align-items-center">';
            html += '<span class="mr-2">' + modulIcon + '</span>';
            html += '<strong>' + modulBaslik + '</strong>';
            html += '</span>';
            html += '</div>';
            html += '<i class="fa fa-chevron-down modul-arrow" style="font-size: 14px;"></i>';
            html += '</div>';
            html += '</div>';
            html += '<div class="card-body" id="' + modulAdi + 'Detay" style="display: none;">';
            html += '<div class="row">';
            
            // Statik yetki türleri - her modül için aynı
            var yetkiTürleri = [
                {ad: 'ekleme', baslik: 'Ekleme', icon: 'fa-solid fa-plus'},
                {ad: 'duzenleme', baslik: 'Düzenleme', icon: 'fa-solid fa-edit'},
                {ad: 'silme', baslik: 'Silme', icon: 'fa-solid fa-trash'},
                {ad: 'goruntuleme', baslik: 'Görüntüleme', icon: 'fa-solid fa-eye'}
            ];
            
           
            
            yetkiTürleri.forEach(function(yetki, index) {
                var colClass = yetkiTürleri.length > 2 ? 'col-md-3' : 'col-md-6';
                html += '<div class="' + colClass + '">';
                html += '<div class="form-check">';
                html += '<input class="form-check-input" type="checkbox" id="' + modulAdi + yetki.ad.charAt(0).toUpperCase() + yetki.ad.slice(1) + '" name="modulYetkiler[' + modulAdi + '][detay][]" value="' + yetki.ad + '">';
                html += '<label class="form-check-label" for="' + modulAdi + yetki.ad.charAt(0).toUpperCase() + yetki.ad.slice(1) + '">';
                html += '<i class="' + yetki.icon + ' mr-1"></i> ' + yetki.baslik;
                html += '</label>';
                html += '</div>';
                html += '</div>';
            });
            
            html += '</div>';
            html += '</div>';
            html += '</div>';
        });
    } else {
        html = '<div class="alert alert-warning">Modül bulunamadı.</div>';
    }
    
    container.html(html);
    
    // Card header'a tıklama event'i ekle (sadece detay kısmını aç/kapat)
    $('.card-header').off('click').on('click', function(e){
        // Eğer checkbox'a tıklandıysa işlem yapma
        if($(e.target).is('input[type="checkbox"]')){
            return;
        }
        
        // Modül adını card'dan al
        var card = $(this).closest('.card');
        var modulAdi = card.find('.card-body').attr('id').replace('Detay', '');
        var detayDiv = $('#' + modulAdi + 'Detay');
        var arrow = $(this).find('.modul-arrow');
        
        // Sadece detay kısmını aç/kapat
        if(detayDiv.is(':visible')){
            detayDiv.slideUp();
            arrow.removeClass('fa-chevron-up').addClass('fa-chevron-down');
        } else {
            detayDiv.slideDown();
            arrow.removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
    });
}

// Personel yetkilerini yükleyen fonksiyon
function personelYetkilendirmeYukle(personelID, personelAd, personelTC, departman) {


    var formData = new FormData();
    formData.append("personelYetkileriGetir", "1");
    formData.append("personelID", personelID);
    
    
    makeAjax(formData).then((data) => {
        console.log('Personel Yetki Verisi:', data);
        if (data.status === 1) {
            // Personel bilgilerini doldur (ilk veriden al)
            if (data.data && Array.isArray(data.data) && data.data.length > 0) {
                var ilkVeri = data.data[0];
                if (ilkVeri.personelAd) {
                    $('#personelYetkilendirmeAdi').text(ilkVeri.personelAd);
                }
                if (ilkVeri.personelTC) {
                    $('#personelYetkilendirmeTC').text(ilkVeri.personelTC);
                }
                if (ilkVeri.departman) {
                    $('#personelYetkilendirmeDepartman').text(ilkVeri.departman);
                }
                if (ilkVeri.pozisyon) {
                    $('#personelPozisyon').text(ilkVeri.pozisyon);
                }
                console.log('Personel bilgileri dolduruldu:', {
                    ad: ilkVeri.personelAd,
                    tc: ilkVeri.personelTC,
                    departman: ilkVeri.departman,
                    pozisyon: ilkVeri.pozisyon
                });
            }
            
            // Tüm checkbox'ları temizle
            $('input[name^="modulYetkiler"]').prop('checked', false);
            $('.card-body[id$="Detay"]').hide();
            
            if (data.data && Array.isArray(data.data)) {
                data.data.forEach(function(yetki) {
                   
                    var modulID = yetki.tanim;
                    var modulAdi = null;

                    for (var key in modulIDleri) {
                        if (modulIDleri[key] == modulID) {
                            modulAdi = key;
                            break;
                        }
                    }
                    
                    if (!modulAdi) {
                        console.log('Modül adı bulunamadı, ID:', modulID);
                        return;
                    }
                    
                    console.log('Yetki işleniyor:', yetki, 'Modül adı:', modulAdi);
                    
                    // Detay yetkilerini işaretle
                    if (yetki.ekleme == 1) {
                        $('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="ekleme"]').prop('checked', true);
                    }
                    if (yetki.silme == 1) {
                        $('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="silme"]').prop('checked', true);
                    }
                    if (yetki.duzenleme == 1) {
                        $('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="duzenleme"]').prop('checked', true);
                    }
                    if (yetki.goruntuleme == 1) {
                        $('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="goruntuleme"]').prop('checked', true);
                    }
                });
            }
        }
    }).catch((error) => {
        console.error("Yetki yükleme hatası:", error);
    });
}


function personelYetkilendirmeKaydet() {
    var personelID = $('#personelYetkilendirmeID').val();
    var personelAd = $('#personelYetkilendirmeAdi').text();
    console.log('Personel Yetkileri Kaydediliyor - PersonelID:', personelID);
    console.log('Personel Yetkileri Kaydediliyor - PersonelAd:', personelAd);

    var modulYetkiler = {};

 
    // Tüm modüller için yetkileri topla (aktif kontrolü yok)
    Object.keys(modulIDleri).forEach(function(modulAdi) {
        var modulID = modulIDleri[modulAdi];
        
        modulYetkiler[modulID] = {
            ekleme: 0,
            silme: 0,
            duzenleme: 0,
            goruntuleme: 0
        };
        
        // Her yetki türünü kontrol et ve seçiliyse 1, değilse 0 olarak ayarla
        if ($('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="ekleme"]').is(':checked')) {
            modulYetkiler[modulID].ekleme = 1;
        }
        if ($('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="silme"]').is(':checked')) {
            modulYetkiler[modulID].silme = 1;
        }
        if ($('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="duzenleme"]').is(':checked')) {
            modulYetkiler[modulID].duzenleme = 1;
        }
        if ($('input[name="modulYetkiler[' + modulAdi + '][detay][]"][value="goruntuleme"]').is(':checked')) {
            modulYetkiler[modulID].goruntuleme = 1;
        }
    });
    

    var formData = new FormData();
    formData.append("personelYetkileriKaydet", "1");
    formData.append("personelID", personelID);
    formData.append("modulYetkiler", JSON.stringify(modulYetkiler));
    
    // Buton durumunu değiştir
    $('#personelYetkilendirmeKaydetText').addClass('d-none');
    $('#personelYetkilendirmeBekle').removeClass('d-none');
    $('#personelYetkilendirmeKaydet').prop('disabled', true);
    
    makeAjax(formData).then((data) => {
        if (data.status === 1) {
            Toast.fire({
                icon: 'success',
                title: 'Yetkiler başarıyla kaydedildi!'
            });
            $('#modal-personel-yetkilendirme').modal('hide');
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Hata: ' + (data.message || 'Yetkiler kaydedilemedi!')
            });
        }
    }).catch((error) => {
        console.error("Yetki kaydetme hatası:", error);
        Toast.fire({
            icon: 'error',
            title: 'Yetkiler kaydedilemedi!'
        });
    }).finally(() => {
        // Buton durumunu eski haline getir
        $('#personelYetkilendirmeKaydetText').removeClass('d-none');
        $('#personelYetkilendirmeBekle').addClass('d-none');
        $('#personelYetkilendirmeKaydet').prop('disabled', false);
    });
}

// Personel yetkilendirme formunu temizleyen fonksiyon
function personelYetkilendirmeTemizle() {
    $('input[name^="modulYetkiler"]').prop('checked', false);
    $('.card-body[id$="Detay"]').hide();
}

// Modül yetkisi seçildiğinde detay yetkileri göster/gizle
function toggleModulDetay(modulAdi) {
    var detayDiv = $('#' + modulAdi + 'Detay');
    var anaCheckbox = $('#yetki' + modulAdi.charAt(0).toUpperCase() + modulAdi.slice(1));
    
    if (anaCheckbox.is(':checked')) {
        detayDiv.slideDown();
        
        // Tüm modüller için: Ana checkbox işaretlendiğinde tüm detay yetkilerini seç
        detayDiv.find('input[type="checkbox"]').prop('checked', true);
    } else {
        detayDiv.slideUp();
        // Detay yetkilerini de temizle
        detayDiv.find('input[type="checkbox"]').prop('checked', false);
    }
}

// Personel silme onay fonksiyonu
function personelSilConfirm(personelID) {
    ToastConfimDelete.fire({
        icon: "warning",
        iconColor: "red",
        title: "Personel silmek istediğinizden emin misiniz?",
        text: "Bu işlem geri alınamaz!",
        showCancelButton: true,
        confirmButtonText: "Evet, Sil",
        cancelButtonText: "İptal",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6"
    }).then((result) => {
        if (result.isConfirmed) {
            personelSil(personelID);
        }
    });
}

// Personel silme fonksiyonu
function personelSil(personelID) {
    var formData = new FormData();
    formData.append("personelSil", "1");
    formData.append("personelID", personelID);
    
    makeAjax(formData).then((data) => {
        if (data.status === 1) {
            Toast.fire({
                icon: 'success',
                title: 'Personel başarıyla silindi!'
            });
            personelListele(); // Listeyi yenile
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Hata: ' + (data.message || 'Personel silinemedi!')
            });
        }
    }).catch((error) => {
        console.error("Personel silme hatası:", error);
        Toast.fire({
            icon: 'error',
            title: 'Personel silinemedi!'
        });
    });
}

function personelDuzenleClear(){
   //$("[aria-clear='personelDuzenle']").val('')
   $("#personelDuzenleDepartman").val('').trigger('change');
   $("#personelDuzenleGorev").val('').trigger('change');
   //$('#personelDuzenleDogumTarihi').datetimepicker({format: 'L'})
   //console.log($('#personelDuzenleDogumTarihi').data("DateTimePicker"))
}
function personelDuzenle(ID){
    personelDuzenleDepartman =$("#personelDuzenleDepartman")
    personelDuzenleGorev = $("#personelDuzenleGorev")
    personelDepartmanAra.val();
    personelGorevAra.val();
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
    formData.append("personelDepartmanAra","0");
    makeAjax(formData).then((data) => { 
        console.log(data)
       personelDuzenleDepartman.select2({
            theme:"bootstrap4",
            data: data.result
        })
        personelDuzenleDepartman.val('').trigger('change');
    })
    personelDuzenleDepartman.on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data.id);
        personelDuzenleGorev.empty().append(new Option()).trigger('change');
        var formDatas = new FormData();
        formDatas.append("personelGorevAra",data.id);
        makeAjax(formDatas).then((datas) => { 
        console.log(datas)
        personelDuzenleGorev.select2({
            theme:"bootstrap4",
            data: datas.result
        })
        personelDuzenleGorev.val('').trigger('change');
    })
    });
    var formData = new FormData();
    formData.append("personelDuzenleVeri",ID);
    makeAjax(formData).then((data) => {
        personelDuzenleClear()
        let personel = data.data;
        personelDuzenleDepartman.val(personel.personelDepartman).trigger('change');
        $('#personelDuzenleDogumTarihi').datetimepicker({
        format: 'DD.MM.YYYY', viewMode: "years"
        });
        var formDataG = new FormData();
        formDataG.append("personelGorevAra",personel.personelDepartman);
        makeAjax(formDataG).then((datas) => { 
            personelDuzenleGorev.select2({
                theme:"bootstrap4",
                data: datas.result
            })
            personelDuzenleGorev.val(personel.personelGorev).trigger('change')
        })
        /* personel.personelFoto */
        $('#personelDuzenle').val(personel.ID)
        $('#personelDuzenleAdi').val(personel.personelAd)
        $('#personelDuzenleAdres').val(personel.personelAdres)
        $('#personelDuzenleEposta').val(personel.personelEposta)
        $('#personelDuzenleDogumTarihiInput').val(moment(personel.personelDogum, 'YYYY-MM-DD').format('DD.MM.YYYY'))
        if(personel.personelTelefon){$('#personelDuzenleTelefon1').val(personel.personelTelefon)}
        if(personel.personelTelefon2){$('#personelDuzenleTelefon2').val(personel.personelTelefon2)}
        $('#personelDuzenleTC').val(personel.personelTC)
        $('#personelDuzenlePasaport').val(personel.personelPasaport)
        $('#personelDuzenleEhliyet').val(personel.personelEhliyet)
        $('[aria-name="personelDuzenleRadioCalisiyor"]').removeClass("active");
        $('[aria-name="personelDuzenleRadioAyrildi"]').addClass("active");
        $("#personelDuzenleDurum1").prop("checked", false); $("#personelDuzenleDurum2").prop("checked", true);
        if(personel.personelDurum==1){
            $("#personelDuzenleDurum1").prop("checked", true); 
            $('[aria-name="personelDuzenleRadioCalisiyor"]').addClass("active");
            $("#personelDuzenleDurum2").prop("checked", false);
            $('[aria-name="personelDuzenleRadioAyrildi"]').removeClass("active");
        }
        $('#modal-Personel-Duzenle').modal('show')
        
    })
}
function personelDuzenleKaydet(e){
    toggleEditBekle('#personelDuzenleButtonGonder','#personelDuzenleButtonBekle')
	var formData = new FormData($("form#personelDuzenleForm")[0]);

    //console.table([...formData])
	let formHata=false;
    if(formHata ==false ){formHata=formHataBak(null,$('input#personelDuzenle').val())}
    if(formHata ==false ){formHata=formHataBak("#personelDuzenleAdi",formData.get("personelDuzenleAdi"))}
    if(formHata ==false ){
        if(!TCNOKontrol(formData.get("personelDuzenleTC"))){$('#personelDuzenleTC').toggleClass("border-danger",true); formHata=true}
    }

    if(formHata){
        if(formHata==2){
            ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Sayfada Hata",
            text:`Sayfada bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyiniz.`,
            confirmButtonText: 'Tamam'
            })
            return;
        }
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelEditGonder('#personelDuzenleButtonGonder','#personelDuzenleButtonBekle')
        return;
    }
    formData.append("personelDuzenleKaydet",$('input#personelDuzenle').val());
    if ( ! $.fn.DataTable.isDataTable( '#personelListe' ) ) {
        initpersonelisteTable()
    }
    makeAjax(formData).then((data) => { 
        $('#modal-Personel-Duzenle').modal('hide')
        $("[aria-clear='personelDuzenle']").val('')
        toggelEditGonder('#personelDuzenleButtonGonder','#personelDuzenleButtonBekle')
        personelTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
    })    
}
//#endregion

//#region KASA İşlemleri
function switchKasa (key,field="kasaEkleBankaDetay") {
    $(`#${field}`).toggleClass("d-none",true)
    if(key==1){
        $(`#${field}`).toggleClass("d-none",false)
    }
}
function bankaResmi(url,field){
    $(`${field}`).attr('src', `../../assets/bankalar/${url}.png`);
}
function ibanYerlestir(data){
    let iban = data
	let ret = ibanCozumle(iban)
	console.log(ret)
	if(ret.checkResult == true){
        $('#kasaEkleBankaAdi').val(ret.bankaAdi)
        $('#kasaEkleHesapNo').val(ret.hesapno)
        $('#kasaEkleBankaKodu').val(ret.bankaKodu)
        $('#kasaEkleIBAN').val(ret.Iban)
        bankaResmi(ret.bankaKodu,'[aria-name="kasaEkleImage"]')
        //$('[aria-name="kasaEkleImage"]').attr('src', `../../assets/bankalar/${ret.bankaKodu}.png`);
          
	}
	else{
		Toast.fire({
            icon: "warning",
            titleText: "Geçersiz IBAN",
            text:"Girdiğiniz IBAN geçersiz görünüyor. Lütfen kontrol ediniz",
            confirmButtonText: 'Tamam'
        })
	}
}
function ibanYerlestirDuzenle(data){
    let iban = data
	let ret = ibanCozumle(iban)
	console.log(ret)
	if(ret.checkResult == true){
        $('#kasaDuzenleBankaAdi').val(ret.bankaAdi)
        $('#kasaDuzenleHesapNo').val(ret.hesapno)
        $('#kasaDuzenleBankaKodu').val(ret.bankaKodu)
        $('#kasaDuzenleIBAN').val(ret.Iban)
        bankaResmi(ret.bankaKodu,'[aria-name="kasaDuzenleImage"]')
        //$('[aria-name="kasaEkleImage"]').attr('src', `../../assets/bankalar/${ret.bankaKodu}.png`);
          
	}
	else{
		Toast.fire({
            icon: "warning",
            titleText: "Geçersiz IBAN",
            text:"Girdiğiniz IBAN geçersiz görünüyor. Lütfen kontrol ediniz",
            confirmButtonText: 'Tamam'
        })
	}
}
function kasaEkle(){
    toggleBekle("#kasaEkleButtonGonder","#kasaEkleButtonBekle")
	var formData = new FormData($("form#kasaEkleForm")[0]);

    //console.table([...formData])

	let formHata;
    formHata=formHataBak("#kasaEkleAdi",formData.get("kasaEkleAdi"))
    formHata=formHataBak("#kasaEkleParaBirimi",formData.get("kasaEkleParaBirimi")) || formHata
    
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#kasaEkleButtonGonder","#kasaEkleButtonBekle")
        return;
    }
    formData.append("kasaEkle","1");
    makeAjax(formData).then((data) => {
        //kasaEkleDurum
        Toast.fire({
            icon: "success",
            text:data.message
        })
        $('.form-control').val("");
        $('#kasaEkleParaBirimi').val("try"); // Para birimini varsayılan olarak try'ye ayarla
        $('#kasaEkleBakiye').val("0");
        $('[aria-name="kasaEkleImage"]').attr('src', `../../assets/bankalar/0.png`);
        toggelGonder("#kasaEkleButtonGonder","#kasaEkleButtonBekle")
    })

}

function kasaListele(){
    kasaTable.clear().draw();
    var formData = new FormData();
    formData.append("kasaListele","1");
    makeAjax(formData).then((data) => {
        kasaTable.rows.add( data.data ).draw();
        
    })
    var formData = new FormData();
    formData.append("kasaListeleselect", "1");
    
    makeAjax(formData).then((data) => {
        if (data.status == 1 && data.data && data.data.length > 0) {
            var kasaListesi = data.data;
            
            $('#virmanGonderenKasa').empty().trigger("change");
            $('#virmanGonderenKasa').val(null).trigger('change');
            $('#virmanGonderenKasa').select2({
                theme:"bootstrap4",
                data: data.data,
                minimumInputLength: 0,
                matcher: function(params, data) {
                    // Eğer arama terimi yoksa tüm sonuçları göster
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    
                    // Arama terimini küçük harfe çevir
                    var term = params.term.toLowerCase();
                    
                    // Kasa adını küçük harfe çevir ve arama terimini ara
                    if (data.text.toLowerCase().indexOf(term) > -1) {
                        return data;
                    }
                    
                    // Eşleşme yoksa null döndür
                    return null;
                },
                language: {
                    noResults: function() {
                        return "Kasa bulunamadı";
                    },
                    searching: function() {
                        return "Aranıyor...";
                    }
                }
            });
            

            $('#virmanAlanKasa').empty().trigger("change");
            $('#virmanAlanKasa').val(null).trigger('change');
            $('#virmanAlanKasa').select2({
                theme:"bootstrap4",
                data: data.data,
                minimumInputLength: 0,
                matcher: function(params, data) {
                    // Eğer arama terimi yoksa tüm sonuçları göster
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    
                    // Arama terimini küçük harfe çevir
                    var term = params.term.toLowerCase();
                    
                    // Kasa adını küçük harfe çevir ve arama terimini ara
                    if (data.text.toLowerCase().indexOf(term) > -1) {
                        return data;
                    }
                    
                    // Eşleşme yoksa null döndür
                    return null;
                },
                language: {
                    noResults: function() {
                        return "Kasa bulunamadı";
                    },
                    searching: function() {
                        return "Aranıyor...";
                    }
                }
            });

/*
            // Select2'yi güncelle
            $('#virmanGonderenKasa').empty().select2({
                data: data.data,
                placeholder: 'Kasa Seçiniz',
                allowClear: true,
                minimumInputLength: 0,
                matcher: function(params, data) {
                    // Eğer arama terimi yoksa tüm sonuçları göster
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    
                    // Arama terimini küçük harfe çevir
                    var term = params.term.toLowerCase();
                    
                    // Kasa adını küçük harfe çevir ve arama terimini ara
                    if (data.text.toLowerCase().indexOf(term) > -1) {
                        return data;
                    }
                    
                    // Eşleşme yoksa null döndür
                    return null;
                },
                language: {
                    noResults: function() {
                        return "Kasa bulunamadı";
                    },
                    searching: function() {
                        return "Aranıyor...";
                    }
                }
            });
            
            $('#virmanAlanKasa').empty().select2({
                data: data.data,
                placeholder: 'Kasa Seçiniz',
                allowClear: true,
                minimumInputLength: 0,
                matcher: function(params, data) {
                    // Eğer arama terimi yoksa tüm sonuçları göster
                    if ($.trim(params.term) === '') {
                        return data;
                    }
                    
                    // Arama terimini küçük harfe çevir
                    var term = params.term.toLowerCase();
                    
                    // Kasa adını küçük harfe çevir ve arama terimini ara
                    if (data.text.toLowerCase().indexOf(term) > -1) {
                        return data;
                    }
                    
                    // Eşleşme yoksa null döndür
                    return null;
                },
                language: {
                    noResults: function() {
                        return "Kasa bulunamadı";
                    },
                    searching: function() {
                        return "Aranıyor...";
                    }
                }
            });*/
        }
    }).catch((error) => {
     
    });
}
function kasaDuzenleClear(){
    $("[aria-clear='kasaDuzenle']").val('')
    $('.form-control').val("");
    bankaResmi("0",'[aria-name="kasaDuzenleImage"]')
}
function kasaDuzenle(ID){
    var formData = new FormData();
    formData.append("kasaDuzenleVeri",ID);
    makeAjax(formData).then((data) => {
        kasaDuzenleClear()
        let kasa = data.data;
        
        /* personel.personelFoto */
        $('#kasaDuzenleID').val(kasa.ID)
        $('#kasaDuzenleAdi').val(kasa.kasaAdi)
        $('#kasaDuzenleIBAN').val(kasa.iban)
        $('#kasaDuzenleBankaAdi').val(kasa.bankaAdi)
        $('#kasaDuzenleHesapNo').val(kasa.hesapNo)
        $('#kasaDuzenleBankaKodu').val(kasa.bankaKodu)
        if(!kasa.bankaKodu){kasa.bankaKodu = "0"}
        bankaResmi(kasa.bankaKodu,'[aria-name="kasaDuzenleImage"]')
        switchKasa (kasa.bankami,field="kasaDuzenleBankaDetay")
        $('[aria-name="kasaDuzenleRadioBanka"]').removeClass("active");
        $('[aria-name="kasaDuzenleRadioNakit"]').addClass("active");
        $("#kasaDuzenleDurum1").prop("checked", false); $("#kasaDuzenleDurum2").prop("checked", true);
        if(kasa.bankami==1){
            $("#kasaDuzenleDurum1").prop("checked", true); 
            $('[aria-name="kasaDuzenleRadioBanka"]').addClass("active");
            $("#kasaDuzenleDurum2").prop("checked", false);
            $('[aria-name="kasaDuzenleRadioNakit"]').removeClass("active");
        }
        $('#modal-Kasa-Duzenle').modal('show')
    })
}
function kasaDuzenleKaydet(e){
    toggleEditBekle('#kasaEkleButtonGonder','#kasaEkleButtonBekle')
	var formData = new FormData($("form#kasaDuzenleForm")[0]);

    //console.table([...formData])
	let formHata=false;
    if(formHata ==false ){formHata=formHataBak(null,$('input#kasaDuzenleID').val())}
    if(formHata ==false ){formHata=formHataBak("#kasaDuzenleAdi",formData.get("kasaDuzenleAdi"))}

    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelEditGonder('#kasaEkleButtonGonder','#kasaEkleButtonGonder')
        return;
    }
    if ( ! $.fn.DataTable.isDataTable( '#kasaListe' ) ) {
        initkasaListeTable()
    }
    formData.append("kasaDuzenleKaydet",$('input#kasaDuzenleID').val());
    makeAjax(formData).then((data) => { 
        $('#modal-Kasa-Duzenle').modal('hide')
        kasaDuzenleClear()
        toggelEditGonder('#kasaEkleButtonGonder','#kasaEkleButtonGonder')
        kasaTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
    })    
}
function kasaSilConfirm(ID){
    let buttons=`<h4 class="text-danger">Bu işlem geri alınamaz!</h4><button type="button" class="btn btn-outline-danger btn-lg m-2" onclick="kasaSil(${ID})" ><i class="fa-solid fa-trash-can"></i>Kasa Sil</button>`
    ToastConfimDelete.fire({
        icon: "warning",
        iconColor:"red",
        title: "Kasayı silmek İstediğinizden emin misiniz? ",
        html:`${buttons}`,

        confirmButtonText: 'Vazgeç'
    })
}
function kasaSil(ID){
     let formData = new FormData()
    formData.append("kasaSil",ID)
    makeAjax(formData).then((data) => { 
        if(data.status==1){
            kasaTable.row(`#${data.data}`).remove().draw(false);
            swal.close()
        }
    })
    
}
function virmanKaydetClear(){
    $('.form-control').val("");
}
function virmanKaydet(e){
  
    var formData = new FormData($("form#yeniVirmanForm")[0]);
    console.log(formData)
    formData.append("virmanKaydet","1");
    makeAjax(formData).then((data,status) => {  
        if(status==1){
        ToastCenter.fire({
            icon: "success",
            title: "Başarılı",
            text: data.message,
            showConfirmButton: false,
            timer: 3000
        })  
        }
        else{
            Toast.fire({
                icon: "error",
                text:data.message
            })
        }
        virmanKaydetClear()
        
    })
}
function virmanModalKasaListesiYukle(){
    var formData = new FormData();
    formData.append("kasaListeleselect", "1");
    
    makeAjax(formData).then((data) => {
       $('#virmanGonderenKasa').select2({
            theme:"bootstrap4",
            data: data.data
        })
        $('#virmanAlanKasa').select2({
            theme:"bootstrap4",
            data: data.data
        })
    });
}

//#endregion

//#region ÖDEME
function odemeCesidiListele(){
    odemeCesitTable.clear().draw();
    var formData = new FormData();
    formData.append("odemeCesidiListe","1");
    makeAjax(formData).then((data) => {
        odemeCesitTable.rows.add( data.data ).draw();
    })
}
function odemeCesidiEkleTemizle(){
    $("[aria-clear='odemeCesidiEkle']").val('')
    $('.form-control').val("");
}
function odemeCesidiEkleGoster(){
    $('#odemenCesidiDuzenle').toggleClass("d-none",true)
    $(`#odemenCesidiEkle`).toggleClass("d-none",false)
    $('#odemeCesidiTable').toggleClass('col-sm-12',false)
    $('#odemeCesidiTable').toggleClass('col-sm-6',true)
}

function odemeTuruKaydet(){
    let container = $('#odemeTuruAdi')
    let odemeturuAdi = container.val()
    if(odemeturuAdi == ""){
        container.toggleClass("border-danger",true);
         Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        return;
    }
    var formData = new FormData();
    formData.append("odemeTuruKaydet",odemeturuAdi);
     makeAjax(formData).then((data) => {
        //kasaEkleDurum
        Toast.fire({
            icon: "success",
            text:data.message
        })
        container.val("");
        initOdemeCesidiSelect(1)
        $(`#odemenCesidiEkle`).toggleClass("d-none",true)
        $('#odemeCesidiTable').toggleClass('col-sm-6 col-sm-12')
    })

}
function initOdemeCesidiSelect(refresh = 0){
    
    OdemeCesidiEkleAra =$("#OdemeCesidiEkleAra")
    OdemeCesidiDuzenleAra =$("#OdemeCesidiDuzenleAra")
    OdemeCesidiEkleAra.val();
    OdemeCesidiDuzenleAra.val();
    var formData = new FormData();
    formData.append("OdemeCesidiEkleAra","0");
    makeAjax(formData).then((data) => { 
        console.log(data)
        if(odemeGrubu == null || odemeGrubu==""){
            odemeGrubu=data.result
        }
        if(refresh = 1){
            odemeGrubu=data.result
        }
       OdemeCesidiEkleAra.select2({
            theme:"bootstrap4",
            data: odemeGrubu
        })

       OdemeCesidiDuzenleAra.select2({
            theme:"bootstrap4",
            data: odemeGrubu
        })
    })
}
function odemeCesidiEkle(e){
    toggleBekle('#OdemeCesidiEkleKaydetButtonGonder','#OdemeCesidiEkleKaydetButtonBekle')

	var formData = new FormData($("form#odemeCesidiEkleForm")[0]);
	let formHata;
    formHata=formHataBak("#odemeCesidiEkleCesidi",formData.get("odemeCesidiEkleCesidi"))
    
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder('#OdemeCesidiEkleKaydetButtonGonder','#OdemeCesidiEkleKaydetButtonBekle')
        return;
    }
    formData.append("odemeCesidiEkleKaydet","1");
    makeAjax(formData).then((data) => {
        Toast.fire({
            icon: "success",
            text:data.message
        })
        $('.form-control').val("");
        toggelGonder('#OdemeCesidiEkleKaydetButtonGonder','#OdemeCesidiEkleKaydetButtonBekle')
        odemeCesidiListele()
    })

}
function odemeCesidiDuzenleClear(){
     $("[aria-clear='odemeCesidiDuzenle']").val('')
    $('.form-control').val("");
}
function odemeCesidiDuzenle(ID){
    //odemeCesidiTable
    $('#odemenCesidiEkle').toggleClass("d-none",true)
    $('#odemeCesidiTable').toggleClass('col-sm-12',false)
    $('#odemeCesidiTable').toggleClass('col-sm-6',true)
    var formData = new FormData();
    formData.append("odemeCesidiDuzenleVeri",ID);
    makeAjax(formData).then((data) => {
        odemeCesidiDuzenleClear()
        let odeme = data.data;
        
        $('#odemeCesidiDuzenleID').val(odeme.ID)
        $("#OdemeCesidiDuzenleAra").val(odeme.odemeTuru)
        $("#OdemeCesidiDuzenleAra").trigger('change');
        $("#odemeCesidiDuzenleCesidi").val(odeme.odemeCesidi)
        $('#odemenCesidiDuzenle').toggleClass("d-none",false)
    })
   
}
function odemeCesidiDuzenleKaydet(e){
    toggleEditBekle('#OdemeCesidiDuzenleKaydetButtonGonder','#OdemeCesidiDuzenleKaydetButtonBekle')
	var formData = new FormData($("form#odemeCesidiDuzenleForm")[0]);

	let formHata=false;
    if(formHata ==false ){formHata=formHataBak(null,$('input#odemeCesidiDuzenleID').val())}
    if(formHata ==false ){formHata=formHataBak("#odemeCesidiDuzenleCesidi",formData.get("odemeCesidiDuzenleCesidi"))}

    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelEditGonder('#OdemeCesidiDuzenleKaydetButtonGonder','#OdemeCesidiDuzenleKaydetButtonBekle')
        return;
    }
    if ( ! $.fn.DataTable.isDataTable( '#odemeCesitListe' ) ) {
        initodemeCesitListeTable()
    }
    formData.append("odemeCesidiDuzenleKaydet",$('input#odemeCesidiDuzenleID').val());
    makeAjax(formData).then((data) => { 
        if(data.status==1){
            Toast.fire({
                icon: "success",
                text:data.message
            })
            $('#odemenCesidiDuzenle').toggleClass("d-none",true)
            odemeCesidiDuzenleClear()
            toggelEditGonder('#OdemeCesidiDuzenleKaydetButtonGonder','#OdemeCesidiDuzenleKaydetButtonBekle')
            odemeCesitTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
            $('#odemeCesidiTable').toggleClass('col-sm-6 col-sm-12')
        }
        else{
             ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
            toggelEditGonder('#OdemeCesidiDuzenleKaydetButtonGonder','#OdemeCesidiDuzenleKaydetButtonBekle')
        }
    })    
}
function masrafOdemeClear(){
     $('#modal-body-Odeme-Ekle').toggleClass("d-none",true)
     $('[aria-name="modalLoad"]').toggleClass("d-none",false)
     $(`[aria-name="odemeEkleFaturaGoster"]`).attr('aria-type',"");
     $(`[aria-name="odemeEkleFaturaGoster"]`).attr('aria-url',"");
     $('#odemeEklePAraBirimi').html(`Kur`)
     $('[aria-clear-html="odemeEkle"]').html(` `)
     $(`#odemeEkleMasrafDuzenle`).attr('aria-ID',"");
     $(`[aria-name="odemeEkleAcik"]`).toggleClass("active",false)
     $(`[aria-name="odemeEkleKapali"]`).toggleClass("active",false)
     $('[aria-clear="odemeEkle"]').val(``)
     if (typeof odemeEkleTable !== 'undefined' && odemeEkleTable) {
     odemeEkleTable.clear().draw();
     }
}
//Kullanılmayan test fonksiyonu. Tablo hücresi içerik renk değiştirme çalışan kod
function changecolor(){
    var rowIndex = masrafTable.row('#msf2').index();
    var cellNode = masrafTable.cell(rowIndex, 2).node();
    $(cellNode).css('color', 'red');
}
function odendiGuncelle(element){
	let odemeID= $(element).attr('aria-ID'); 
	let odemeStatus= $(element).attr('aria-value'); 
	$(element).toggleClass("d-none",true)
    var formData = new FormData();
    formData.append("odemeGuncelle",odemeID);
    formData.append("odemeStatus",odemeStatus);
    makeAjax(formData).then((data) => {
       console.log(data)
       let odeme = data.odeme
       $('[aria-name="odemeEkleToplamOdeme"]').html(odeme.tutar)
       $('[aria-name="odemeEkleYapilanODeme"]').html(odeme.odenen)
       $('[aria-name="odemeEkleKalanODeme"]').html(odeme.kalan)

        if(odeme.acikmi==1){
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
            $(`[aria-name="odemeEkleAcik"]`).html("Ödendi")
        }
        else{
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)
            $(`[aria-name="odemeEkleAcik"]`).html("açık")
        }
       odemeEkleTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
        if ($.fn.DataTable.isDataTable( '#masrafListe' ) ) {
            console.log(data.masraf)
            let masrafRow = masrafTable.row( `#${data.masraf.DT_RowId}`)
            masrafRow.data(data.masraf).draw();
            var rowIndex =masrafRow.index();
            var cellNode = masrafTable.cell(rowIndex, 3).node();
            let color = "red"
            if(data.masraf.acikmi==1){color="green"}
            $(cellNode).css('color', color);
        }
    })
}
function tahsilatGuncelle(element){
    let tahsilatID= $(element).attr('aria-ID'); 
    let tahsilatStatus= $(element).attr('aria-value'); 
   
    var formData = new FormData();
    formData.append("tahsilatGuncelle",tahsilatID);
    formData.append("tahsilatStatus",tahsilatStatus);
    makeAjax(formData).then((data) => {
                console.log(data)
                let tahsilat = data.tahsilat
                $('[aria-name="tahsilatEkleToplamOdeme"]').html(tahsilat.tutar)
                $('[aria-name="tahsilatEkleYapilanODeme"]').html(tahsilat.odenen)
                $('[aria-name="tahsilatEkleKalanODeme"]').html(tahsilat.kalan)
                
                if(tahsilat.acikmi==1){
                    $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
                    $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
                    $(`[aria-name="tahsilatEkleAcik"]`).html("Ödendi")
                }
                else{
                    $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)
                    $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)
                    $(`[aria-name="tahsilatEkleAcik"]`).html("açık")
                }
                
                tahsilatEkleTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
                if ($.fn.DataTable.isDataTable( '#tahsilatListe' ) ) {
                    console.log(data.tahsilat)
                    let tahsilatRow = tahsilatTable.row( `#${data.tahsilat.DT_RowId}`)
                    tahsilatRow.data(data.tahsilat).draw();
                    var rowIndex =tahsilatRow.index();
                    var cellNode = tahsilatTable.cell(rowIndex, 3).node();
                    let color = "red"
                    if(data.tahsilat.acikmi==1){color="green"}
                    $(cellNode).css('color', color);
                }
    })
}
function masrafOdemeEkle(ID=0){
    masrafOdemeClear()
    $('[aria-name="modalLoad"]').toggleClass("d-none",false)
    $('#modal-Odeme-Ekle').modal('show')
    $('#odemeEkleOdemeTarihi').datetimepicker({
        format: 'DD.MM.YYYY',locale: 'tr'
    });
    formData = new FormData();
    //formData.append("wait","1");
    formData.append("masrafDetay",ID);
    makeAjax(formData).then((data) => { 
        let masraf = data.data
        $('[aria-name="odemeEkleMasrafAdi"]').val(masraf.kartAdi)
        $(`[aria-name="odemeEkleMasrafDuzenle"]`).attr('aria-ID', masraf.ID);
        $(`#odemeEkleMasrafID`).val(masraf.ID);
        
        $('[aria-name="odemeEkleFaturaTipi"]').html(masraf.faturaTuru)
        $('[aria-name="odemeEkleFaturaNo"]').html(masraf.faturaNo)

        if(masraf.dosyaTipi!="" && masraf.faturaUrl != ""){
            $(`[aria-name="odemeEkleFaturaGoster"]`).attr('aria-type', masraf.dosyaTipi);
            $(`[aria-name="odemeEkleFaturaGoster"]`).attr('aria-url', masraf.faturaUrl);
            $(`[aria-name="odemeEkleFaturaGoster"]`).toggleClass("d-none",false)
        }
        else{
            $(`[aria-name="odemeEkleFaturaGoster"]`).toggleClass("d-none",true)
        }

        if(masraf.isRefensVarmi){  $('[aria-name="odemeEkleFaturaHarcama"]').html("İş Harcaması")  }
        else{   $('[aria-name="odemeEkleFaturaHarcama"]').html("Diğer Harcama")  }
        if(masraf.paraBirimi =="try"){ $('[aria-name ="odemeEkleParaBirimi"]').html(`Kur (₺)`) }
        if(masraf.paraBirimi =="usd"){ $('[aria-name ="odemeEkleParaBirimi"]').html(`Kur ($)`) }
        if(masraf.paraBirimi =="eur"){ $('[aria-name ="odemeEkleParaBirimi"]').html(`Kur (€)`) }
        $('[aria-name="odemeEkleKur"]').html(masraf.kur)
        $('[aria-name="odemeEkleEkleFaturaTarihi"]').html(masraf.faturaTarihi)
        //let formattedTotal = new Intl.NumberFormat("de-DE").format(masraf.faturaTutari)
        $('[aria-name="odemeEkleToplamOdeme"]').html(masraf.faturaTutari)
        $('[aria-name="odemeEkleYapilanODeme"]').html(masraf.odenen)
        $('[aria-name="odemeEkleKalanODeme"]').html(masraf.kalan)
        $('[aria-name="odemeEkleOdemeGrubu"]').html(masraf.odemeGrubu)
        $('[aria-name="odemeEkleOdemeCesidi"]').html(masraf.odemeCesidi)

        if(masraf.acikmi==1){
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
            $(`[aria-name="odemeEkleAcik"]`).html("Ödendi")
        }
        else{
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)
            $(`[aria-name="odemeEkleAcik"]`).html("açık")
        }
        //odemeEkleKasa
        odemeEkleKasa =$("#odemeEkleKasa")
        odemeEkleKasa.empty().append(new Option()).trigger('change');
        odemeEkleKasa.select2()
        if(kasaListesi == null || kasaListesi==""){
            var formData = new FormData();
            formData.append("OdemeEkleKasaAra","0");
            makeAjax(formData).then((data) => { 
                kasaListesi=data.result

                odemeEkleKasa.select2({
                    theme:"bootstrap4",
                    data: kasaListesi,
                    placeholder: 'Kasa Seçiniz'
                })
            })
        }
        else{
            odemeEkleKasa.select2({
                theme:"bootstrap4",
                data: kasaListesi,
                placeholder: 'Kasa Seçiniz'
            })
        }  
        if (typeof odemeEkleTable !== 'undefined' && odemeEkleTable && data.odeme) {
        odemeEkleTable.rows.add( data.odeme ).draw();
        }
        $('[aria-name="modalLoad"]').toggleClass("d-none",true)
        $('#modal-body-Odeme-Ekle').toggleClass("d-none",false)
    })

   

}
function tahsilatEkleparaBirimi(){
     let paraBirimi = $("#tahsilatEkleparaBirimi").val()
    if(paraBirimi=="try"){
        $("#tahsilatEkleYeniKur").val("1")
        $('[aria-name="tahsilatEkleParaDetay"]').toggleClass("col-sm-3",false)
        $('[aria-name="tahsilatEkleParaDetay"]').toggleClass("col-sm-5",true)
        $('[aria-name="tahsilatEkleKurDetay"]').toggleClass("d-none",true)
    }
    else{
        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#tahsilatEkleYeniKur").val(dolarkuru)
                }
                if(paraBirimi=="eur"){
                    $("#tahsilatEkleYeniKur").val(eurokuru)
                }
                $('[aria-name="tahsilatEkleKurDetay"]').toggleClass("d-none",false)

                $('[aria-name="tahsilatEkleParaDetay"]').toggleClass("col-sm-3",true)
                $('[aria-name="tahsilatEkleParaDetay"]').toggleClass("col-sm-5",false)
                return;
            })

        }
        else{
            if(paraBirimi=="usd"){
                $("#tahsilatEkleYeniKur").val(dolarkuru)
            }
            if(paraBirimi=="eur"){
                $("#tahsilatEkleYeniKur").val(eurokuru)
            }
            $('[aria-name="tahsilatEkleKurDetay"]').toggleClass("d-none",false)
            $('[aria-name="tahsilatEkleParaDetay"]').toggleClass("col-sm-3",true)
            $('[aria-name="tahsilatEkleParaDetay"]').toggleClass("col-sm-5",false)
        }
        

    }
}
function tahsilatEkleClear(){
    $('[aria-clear="tahsilatEkle"]').val(``)
}
function masrafOdemeHizliEkle(){
    toggleBekle("#odemeEkleButtonGonder","#odemeEkleButtonBekle")

	var formData = new FormData($("form#masrafOdemeHizliEkleForm")[0]);
	let formHata;
    formHata=formHataBak("#odemeEkleYeniODeme",formData.get("odemeEkleYeniODeme"))
    
    
    //formData.append("wait","1");
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#odemeEkleButtonGonder","#odemeEkleButtonBekle")
        return;
    }
    formData.append("odemeEkleKaydet","1");
    makeAjax(formData).then((data) => {
        Toast.fire({
            icon: "success",
            text:data.message
        })
       odemeEkleClear()
       let odeme = data.odeme
       $(`#odemeEkleMasrafID`).val(data.data.masrafID);
       $('[aria-name="odemeEkleToplamOdeme"]').html(odeme.tutar)
       $('[aria-name="odemeEkleYapilanODeme"]').html(odeme.odenen)
       $('[aria-name="odemeEkleKalanODeme"]').html(odeme.kalan)

        if(odeme.acikmi==1){
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
            $(`[aria-name="odemeEkleAcik"]`).html("Ödendi")
        }
        else{
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)
            $(`[aria-name="odemeEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)
            $(`[aria-name="odemeEkleAcik"]`).html("açık")
        }
        odemeEkleTable.row.add( data.data ).draw();
        if ($.fn.DataTable.isDataTable( '#masrafListe' ) ) {
            console.log(data.masraf)
            let masrafRow = masrafTable.row( `#${data.masraf.DT_RowId}`)
            masrafRow.data(data.masraf).draw();
            var rowIndex =masrafRow.index();
            var cellNode = masrafTable.cell(rowIndex, 3).node();
            let color = "red"
            if(data.masraf.acikmi==1){color="green"}
            $(cellNode).css('color', color);
        }
       console.log("masrafEkleHizliOdeme",data)
       toggelGonder("#odemeEkleButtonGonder","#odemeEkleButtonBekle")
    })
}
function tahsilatHizliOdemeClear(){
   $('[aria-clear="tahsilatEkle"]').val(``)
}
function tahsilatOdemeHizliEkle(){
    
    toggleBekle("#tahsilatEkleButtonGonder","#tahsilatEkleButtonBekle")

	var formData = new FormData($("form#tahsilatOdemeHizliEkleForm")[0]);
	let formHata;
    formHata=formHataBak("#tahsilatEkleOdemeTarihi",formData.get("tahsilatEkleOdemeTarihi"))
    
    
    //formData.append("wait","1");
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#tahsilatEkleButtonGonder","#tahsilatEkleButtonBekle")
        return;
    }
    formData.append("tahsilatOdemeHizliEkleKaydet","1");
    makeAjax(formData).then((data) => {
        if(data.status==0){
            Toast.fire({
                icon: "warning",
                text:data.message
            })
            toggelGonder("#tahsilatEkleButtonGonder","#tahsilatEkleButtonBekle")
            return;
        }
        
        Toast.fire({
            icon: "success",
            text:data.message
        })
       tahsilatHizliOdemeClear()
       let odeme = data.odeme
       $(`#tahsilatEkleMasrafID`).val(data.data.masrafID);
       $('[aria-name="tahsilatEkleToplamOdeme"]').html(odeme.tutar)
       $('[aria-name="tahsilatEkleYapilanODeme"]').html(odeme.odenen)
       $('[aria-name="tahsilatEkleKalanODeme"]').html(odeme.kalan)

        if(odeme.acikmi==1){
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
            $(`[aria-name="tahsilatEkleAcik"]`).html("Ödendi")
        }
        else{
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)
            $(`[aria-name="tahsilatEkleAcik"]`).html("açık")
        }
        tahsilatEkleTable.row.add( data.data ).draw();
        if ($.fn.DataTable.isDataTable( '#tahsilatListe' ) ) {
            console.log(data.tahsilat)
            let tahsilatRow = tahsilatTable.row( `#${data.tahsilat.DT_RowId}`)
            tahsilatRow.data(data.tahsilat).draw();
            var rowIndex =tahsilatRow.index();
            var cellNode = tahsilatTable.cell(rowIndex, 3).node();
            let color = "red"
            if(data.tahsilat.acikmi==1){color="green"}
            $(cellNode).css('color', color);
        }
 
       toggelGonder("#tahsilatEkleButtonGonder","#tahsilatEkleButtonBekle")
       tahsilatHizliOdemeClear()
    })

}
function tahsilatEkleKurYenile(){
     let paraBirimi = $("#tahsilatEkleparaBirimi").val()
    if(paraBirimi=="try"){
       $("#tahsilatEkleYeniKur").val("1")
    }
    else{

        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#tahsilatEkleYeniKur").val(dolarkuru)
                }
                if(paraBirimi=="eur"){
                    $("#tahsilatEkleYeniKur").val(eurokuru)
                }
                $('#tahsilatEkleKurDetay').toggleClass("d-none",false)
                return;
            })

        }
        else{
            if(paraBirimi=="usd"){
                $("#tahsilatEkleYeniKur").val(dolarkuru)
            }
            if(paraBirimi=="eur"){
                $("#tahsilatEkleYeniKur").val(eurokuru)
            }
            $('#tahsilatEkleKurDetay').toggleClass("d-none",false)
        }
    }
}

// Tahsilat kartı ekleme para birimi değişikliği fonksiyonu
function tahsilatKartEkleparaBirimi(){
     let paraBirimi = $("#tahsilatKartEkleparaBirimi").val()
    if(paraBirimi=="try"){
        $("#tahsilatEkleKur").val("1")
        $('#tahsilatEkleKurDetay').toggleClass("d-none",true)
    }
    else{
        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#tahsilatEkleKur").val(dolarkuru)
                }
                if(paraBirimi=="eur"){
                    $("#tahsilatEkleKur").val(eurokuru)
                }
                $('#tahsilatEkleKurDetay').toggleClass("d-none",false)
                return;
            })

        }
        else{
            if(paraBirimi=="usd"){
                $("#tahsilatEkleKur").val(dolarkuru)
            }
            if(paraBirimi=="eur"){
                $("#tahsilatEkleKur").val(eurokuru)
            }
            $('#tahsilatEkleKurDetay').toggleClass("d-none",false)
        }
    }
}

// Tahsilat kartı ekleme kur yenileme fonksiyonu
function tahsilatKartEkleKurYenile(){
     let paraBirimi = $("#tahsilatKartEkleparaBirimi").val()
    if(paraBirimi=="try"){
       $("#tahsilatEkleKur").val("1")
    }
    else{

        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#tahsilatEkleKur").val(dolarkuru)
                }
                if(paraBirimi=="eur"){
                    $("#tahsilatEkleKur").val(eurokuru)
                }
                $('#tahsilatEkleKurDetay').toggleClass("d-none",false)
                return;
            })

        }
        else{
            if(paraBirimi=="usd"){
                $("#tahsilatEkleKur").val(dolarkuru)
            }
            if(paraBirimi=="eur"){
                $("#tahsilatEkleKur").val(eurokuru)
            }
            $('#tahsilatEkleKurDetay').toggleClass("d-none",false)
        }
    }
}
function odemeEkleClear(){
    $('[aria-clear="odemeEkle"]').val(``)
}
function odemeEkleparaBirimi(){
    let paraBirimi = $("#odemeEkleparaBirimi").val()
    if(paraBirimi=="try"){
        $("#odemeEkleYeniKur").val("1")
        $('[aria-name="odemeEkleParaDetay"]').toggleClass("col-sm-3",false)
        $('[aria-name="odemeEkleParaDetay"]').toggleClass("col-sm-5",true)
        $('[aria-name="odemeEkleKurDetay"]').toggleClass("d-none",true)
    }
    else{
        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                odemeEkleparaBirimi()
            })
        }
        else{
            $('[aria-name="odemeEkleParaDetay"]').toggleClass("col-sm-5",false)
            $('[aria-name="odemeEkleParaDetay"]').toggleClass("col-sm-3",true)
            $('[aria-name="odemeEkleKurDetay"]').toggleClass("d-none",false)
            if(paraBirimi=="usd"){
                $("#odemeEkleYeniKur").val(dolarkuru)
            }
            else if(paraBirimi=="eur"){
                $("#odemeEkleYeniKur").val(eurokuru)
            }
        }
    }
}
function odemeEkleKurYenile(){
    let paraBirimi = $("#odemeEkleparaBirimi").val()
    if(paraBirimi=="try"){
        $("#odemeEkleYeniKur").val("1")
    }
    else{
        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#odemeEkleYeniKur").val(dolarkuru)
                }
                else if(paraBirimi=="eur"){
                    $("#odemeEkleYeniKur").val(eurokuru)
                }
            })
        }
        else{
            if(paraBirimi=="usd"){
                $("#odemeEkleYeniKur").val(dolarkuru)
            }
            else if(paraBirimi=="eur"){
                $("#odemeEkleYeniKur").val(eurokuru)
            }
        }
    }
}
function odemeSilConfirm(ID){
 let buttons=`<h4 class="text-danger">Bu işlem geri alınamaz!</h4><button type="button" class="btn btn-outline-danger btn-lg m-2" onclick="odemeSil(${ID})" ><i class="fa-solid fa-trash-can"></i>Ödeme Sil</button>`
    ToastConfimDelete.fire({
        icon: "warning",
        iconColor:"red",
        title: "Ödeme silmek İstediğinizden emin misiniz? ",
        html:`${buttons}`,

        confirmButtonText: 'Vazgeç'
    })
}
function tahsilatSilConfirm(ID){
    let buttons=`<h4 class="text-danger">Bu işlem geri alınamaz!</h4><button type="button" class="btn btn-outline-danger btn-lg m-2" onclick="tahsilatSil(${ID})" ><i class="fa-solid fa-trash-can"></i>Tahsilat Sil</button>`
       ToastConfimDelete.fire({
           icon: "warning",
           iconColor:"red",
           title: "Tahsilat silmek İstediğinizden emin misiniz? ",
           html:`${buttons}`,
   
           confirmButtonText: 'Vazgeç'
       })
   }
function tahsilatSil(ID){
   let formData = new FormData()
   formData.append("tahsilatSil",ID)
   makeAjax(formData).then((data) => { 
       if(data.status==1){
           
           swal.close()
           let tahsilat = data.tahsilat
           $('[aria-name="tahsilatEkleToplamOdeme"]').html(tahsilat.tutar)
           $('[aria-name="tahsilatEkleYapilanODeme"]').html(tahsilat.odenen)
           $('[aria-name="tahsilatEkleKalanODeme"]').html(tahsilat.kalan)

           if(tahsilat.acikmi==1){
               $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
               $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
               $(`[aria-name="tahsilatEkleAcik"]`).html("Ödendi")
           }
           else{
               $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)
               $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)
               $(`[aria-name="tahsilatEkleAcik"]`).html("açık")
           }
          tahsilatEkleTable.row(`#${data.data}`).remove().draw(false);
           if ($.fn.DataTable.isDataTable( '#tahsilatListe' ) ) {
               console.log(data.tahsilat)
               let tahsilatRow = tahsilatTable.row( `#${data.tahsilat.DT_RowId}`)
               tahsilatRow.data(data.tahsilat).draw();
               var rowIndex =tahsilatRow.index();
               var cellNode = tahsilatTable.cell(rowIndex, 3).node();
               let color = "red"
               if(data.tahsilat.acikmi==1){color="green"}
               $(cellNode).css('color', color);
           }
       }
   })
   
}
function odemeSil(ID){
     let formData = new FormData()
    formData.append("odemeSil",ID)
    makeAjax(formData).then((data) => { 
        if(data.status==1){
            
            swal.close()
            let odeme = data.odeme
            $('[aria-name="tahsilatEkleToplamOdeme"]').html(odeme.tutar)
            $('[aria-name="tahsilatEkleYapilanODeme"]').html(odeme.odenen)
            $('[aria-name="tahsilatEkleKalanODeme"]').html(odeme.kalan)

            if(odeme.acikmi==1){
                $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
                $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
                $(`[aria-name="tahsilatEkleAcik"]`).html("Ödendi")
            }
            else{
                $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)
                $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)
                $(`[aria-name="tahsilatEkleAcik"]`).html("açık")
            }
           odemeEkleTable.row(`#${data.data}`).remove().draw(false);
            if ($.fn.DataTable.isDataTable( '#masrafListe' ) ) {
                console.log(data.masraf)
                let masrafRow = masrafTable.row( `#${data.masraf.DT_RowId}`)
                masrafRow.data(data.masraf).draw();
                var rowIndex =masrafRow.index();
                var cellNode = masrafTable.cell(rowIndex, 3).node();
                let color = "red"
                if(data.masraf.acikmi==1){color="green"}
                $(cellNode).css('color', color);
            }
        }
    })
    
}
//#endregion

//#region Masraf Kartı
function masrafEkleLoad(){

    if ( ! $.fn.DataTable.isDataTable( '#tahsilatEkleListe' ) ) {
        inittahsilatEkleTable()
    }
    $('#masrafEkleEkleFaturaTarihi').datetimepicker({
        format: 'DD.MM.YYYY',locale: 'tr'
    });
    masrafEkleOdemeGrubu =$("#masrafEkleOdemeGrubu")
    masrafEkleOdemeGrubu.select2()
    masrafEkleOdemeGrubu.empty().append(new Option()).trigger('change');
    masrafEkleOdemeTuru =$("#masrafEkleOdemeTuru")
    if(odemeGrubu == null || odemeGrubu==""){
        var formData = new FormData();
        formData.append("OdemeCesidiEkleAra","0");
        makeAjax(formData).then((data) => { 
            odemeGrubu=data.result

            masrafEkleOdemeGrubu.select2({
                theme:"bootstrap4",
                data: odemeGrubu,
                placeholder: 'Ödeme Grubu Seçiniz'
            })
        })
    }
    else{
        masrafEkleOdemeGrubu.select2({
            theme:"bootstrap4",
            data: odemeGrubu,
            placeholder: 'Ödeme Grubu Seçiniz'
        })
    }
    //masrafEkleOdemeGrubu.val(2).trigger('change');
    masrafEkleOdemeTuru.select2()
    masrafEkleOdemeGrubu.on('select2:select', function (e) {
        var data = e.params.data;
        console.log(data.id);
        masrafEkleOdemeTuru.empty().append(new Option()).trigger('change');
        var formDatas = new FormData();
        formDatas.append("OdemeTuruAra",data.id);
        makeAjax(formDatas).then((datas) => { 
            console.log(datas)
            masrafEkleOdemeTuru.select2({
                theme:"bootstrap4",
                data: datas.result
            })
            masrafEkleOdemeTuru.trigger('change');
            $('#masrafEkleOdemeTuruDetay').toggleClass("d-none",false)
        })
    });
}
function masrafEkleIsLoad(){
    let selected = $('input[name="masrafEkleIsSecim"]:checked').val()
    let masrafEkleIs = $('#masrafEkleIs')
    masrafEkleIs.select2()
    masrafEkleIs.empty().append(new Option()).trigger('change');
    if(selected == 0){
        $('#masrafEkleIsDetay').toggleClass("d-none",true)
        return;
    }
    if(isListesi == null || isListesi == ""){
        console.log("iş listesi boş, ajax çekiliyor")
        var formDatas = new FormData();
        formDatas.append("masrafEkleIsListe","1");
        makeAjax(formDatas).then((datas) => { 
            console.log(datas)
            isListesi = datas.result
            masrafEkleIs.select2({
                    theme:"bootstrap4",
                    data: datas.result
                })
            masrafEkleIs.trigger('change');
            $('#masrafEkleIsDetay').toggleClass("d-none",false)
        })
    }
    else{
        console.log("iş listesi var, select2 hazır veriden yüklendi")
        
        masrafEkleIs.select2({
                    theme:"bootstrap4",
                    data: isListesi
                })
        masrafEkleIs.trigger('change');
        $('#masrafEkleIsDetay').toggleClass("d-none",false)
    }

}
function masrafEkleClear(){
    $("[aria-clear='masrafEkle']").val('')
    $('.form-control').val("");
    $('#masrafEkleFaturaDetay').toggleClass("d-none",true)
    $('#masrafEkleOdemeTuruDetay').toggleClass("d-none",true)
}
function masrafEkleFatura(element){
    if(element == "E-Arşiv"|| element == "E-Fatura"){
        $('#masrafEkleFaturaDetay').toggleClass("d-none",false)
        return;
    }
    $('#masrafEkleFaturaDetay').toggleClass("d-none",true)
    $('#masrafEkleFaturaNo').val('')
    $("#masrafEkleDosya").replaceWith($("#masrafEkleDosya").val('').clone(true));
}
function masrafEkleDosyaYukle(file){
    toggleBekle("#masrafEkleKaydetButtonGonder","#masrafEkleKaydetButtonBekle")
    var fd = new FormData();
    var files = file;
    console.log(files)
    fd.append('masrafEklefile', files);
    makeAjaxFile(fd).then((data) => { 
        let dosya = data.data
        $(`[aria-name="masrafEkleImage"]`).attr('src', `../../assets/bankalar/0.png`);
        $('#masrafEklePdf').attr('src', "");
        $('#masrafEklePdfDetay').toggleClass("d-none",true)
        $('#masrafEkleImageDetay').toggleClass("d-none",true)
        if(data.status==1){
            $('#masrafEkleDosyaTuru').val(dosya.type)
            $('#masrafEkleDosyaYolu').val(dosya.target)
            if(dosya.type == "pdf"){
                $('#masrafEklePdfDetay').toggleClass("d-none",false)
                $('#masrafEklePdf').attr('src', dosya.target); 
            }
            if(dosya.type == "jpg" || dosya.type == "jpeg" || dosya.type == "png"){
                $('#masrafEkleImageDetay').toggleClass("d-none",false)
                $(`[aria-name="masrafEkleImage"]`).attr('src', dosya.target);
            }

        }
        toggelGonder("#masrafEkleKaydetButtonGonder","#masrafEkleKaydetButtonBekle")
        
    })
}
function masrafEkleClear(){
    $('.form-control').val("");
    $(`[aria-name="masrafEkleImage"]`).attr('src', `../../assets/bankalar/0.png`);
    $("#masrafEklePdf").attr({
            data: ""
        });
    $('#masrafEkleFaturaDetay').toggleClass("d-none",true)
    $('#masrafEklePdfDetay').toggleClass("d-none",true)
    $('#masrafEkleImageDetay').toggleClass("d-none",true)
    $("#masrafEkleOdemeGrubu").val('').trigger('change');
    $('#masrafEkleTipi').val('').trigger('change');
    $('#masrafEkleIs').val('').trigger('change');
    $('#masrafEkleparaBirimi').val('try').trigger('change');
    $("#masrafEkleOdemeTuru").empty().append(new Option()).trigger('change');
    
}
function masrafEkle(){
    toggleBekle("#masrafEkleKaydetButtonGonder","#masrafEkleKaydetButtonBekle")

	var formData = new FormData($("form#masrafEkleForm")[0]);
	let formHata;
    formHata=formHataBak("#masrafEkleAdi",formData.get("masrafEkleAdi"))
    
    
    //formData.append("wait","1");
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#masrafEkleKaydetButtonGonder","#masrafEkleKaydetButtonBekle")
        return;
    }
    formData.append("masrafKartiEkleKaydet","1");
    makeAjax(formData).then((data) => {
        Toast.fire({
            icon: "success",
            text:data.message
        })
        if ( ! $.fn.DataTable.isDataTable( '#masrafListe' ) ) {
			initmasrafTable()
            masrafTable.row.add(data.result).draw();
		}
        else{
            masrafTable.row.add(data.result).draw();
        }
        $('#modal-Masraf-Ekle').modal('hide')
        toggelGonder("#masrafEkleKaydetButtonGonder","#masrafEkleKaydetButtonBekle")
        //odemeCesidiListele()
    })
}

function tahsilatEkleLoad(){
    // Önce mevcut datetimepicker'ları temizle
    if ($('#tahsilatEkleFaturaTarihi').data('DateTimePicker')) {
        $('#tahsilatEkleFaturaTarihi').data('DateTimePicker').destroy();
    }
    if ($('#tahsilatEkleVadeTarihi').data('DateTimePicker')) {
        $('#tahsilatEkleVadeTarihi').data('DateTimePicker').destroy();
    }
    
    // Takvimleri initialize et
    $('#tahsilatEkleFaturaTarihi').datetimepicker({
        format: 'DD.MM.YYYY',
        locale: 'tr',
        useCurrent: false,
        allowInputToggle: true
    });
    
    $('#tahsilatEkleVadeTarihi').datetimepicker({
        format: 'DD.MM.YYYY',
        locale: 'tr',
        useCurrent: false,
        allowInputToggle: true
    });
    
    // Select2'leri initialize et
    tahsilatEkleOdemeGrubu =$("#tahsilatEkleOdemeGrubu")
    tahsilatEkleOdemeGrubu.select2()
    tahsilatEkleOdemeGrubu.empty().append(new Option()).trigger('change');
    
    tahsilatEkleOdemeCesidi =$("#tahsilatEkleOdemeCesidi")
    tahsilatEkleOdemeCesidi.select2()
    tahsilatEkleOdemeCesidi.empty().append(new Option()).trigger('change');
    
    // Ödeme gruplarını yükle
    if(odemeGrubu == null || odemeGrubu==""){
        var formData = new FormData();
        formData.append("OdemeCesidiEkleAra","0");
        makeAjax(formData).then((data) => { 
            odemeGrubu=data.result
            tahsilatEkleOdemeGrubu.select2({
                theme:"bootstrap4",
                data: odemeGrubu,
                placeholder: 'Ödeme Grubu Seçiniz'
            })
        })
    }
    else{
        tahsilatEkleOdemeGrubu.select2({
            theme:"bootstrap4",
            data: odemeGrubu,
            placeholder: 'Ödeme Grubu Seçiniz'
        })
    }
    
    // İş listesini yükle
    tahsilatEkleIsLoad()
}

function tahsilatEkleIsLoad(){
    let tahsilatEkleIs = $('#tahsilatEkleIs')
    tahsilatEkleIs.select2()
    tahsilatEkleIs.empty().append(new Option()).trigger('change');
    
    if(isListesi == null || isListesi == ""){
        console.log("iş listesi boş, ajax çekiliyor")
        var formDatas = new FormData();
        formDatas.append("masrafEkleIsListe","1");
        makeAjax(formDatas).then((datas) => { 
            console.log(datas)
            isListesi = datas.result
            tahsilatEkleIs.select2({
                    theme:"bootstrap4",
                    data: datas.result
                })
            tahsilatEkleIs.trigger('change');
        })
    }
    else{
        console.log("iş listesi var, select2 hazır veriden yüklendi")
        tahsilatEkleIs.select2({
                    theme:"bootstrap4",
                    data: isListesi
                })
        tahsilatEkleIs.trigger('change');
    }
}

function tahsilatEkleClear(){
    $("[aria-clear='tahsilatEkle']").val('');
    $('.form-control').val("");
    $(`[aria-name="tahsilatEkleImage"]`).attr('src', `../../assets/bankalar/0.png`);
    $("#tahsilatEklePdf").attr({
            data: ""
        });
    $('#tahsilatEkleFaturaDetay').toggleClass("d-none",true)
    $('#tahsilatEklePdfDetay').toggleClass("d-none",true)
    $('#tahsilatEkleImageDetay').toggleClass("d-none",true)
    $("#tahsilatEkleOdemeGrubu").val('').trigger('change');
    $('#tahsilatEkleFaturaTuru').val('').trigger('change');
    $('#tahsilatEkleIs').val('').trigger('change');
    $('#tahsilatEkleParaBirimi').val('try').trigger('change');
    $("#tahsilatEkleOdemeCesidi").empty().append(new Option()).trigger('change');
    
    // Datetimepicker'ları temizle
    if ($('#tahsilatEkleFaturaTarihi').data('DateTimePicker')) {
        $('#tahsilatEkleFaturaTarihi').data('DateTimePicker').clear();
    }
    if ($('#tahsilatEkleVadeTarihi').data('DateTimePicker')) {
        $('#tahsilatEkleVadeTarihi').data('DateTimePicker').clear();
    }
}

function tahsilatEkle(){
    toggleBekle("#tahsilatEkleKaydetButtonGonder","#tahsilatEkleKaydetButtonBekle")

	var formData = new FormData($("form#tahsilatEkleForm")[0]);
	let formHata;
    formHata=formHataBak("#tahsilatEkleAdi",formData.get("tahsilatEkleAdi"))
    
    
    //formData.append("wait","1");
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#tahsilatEkleKaydetButtonGonder","#tahsilatEkleKaydetButtonBekle")
        return;
    }
    formData.append("tahsilatKartiEkleKaydet","1");
    makeAjax(formData).then((data) => {
        Toast.fire({
            icon: "success",
            text:data.message
        })
        if ( ! $.fn.DataTable.isDataTable( '#tahsilatListe' ) ) {
			inittahsilatTable()
            tahsilatTable.row.add(data.result).draw();
		}
        else{
            tahsilatTable.row.add(data.result).draw();
        }
        $('#modal-tahsilat-Ekle').modal('hide')
        toggelGonder("#tahsilatEkleKaydetButtonGonder","#tahsilatEkleKaydetButtonBekle")
        //odemeCesidiListele()
    })
}

// Genel tarih aralığı picker fonksiyonu
function initTarihAraligiPicker() {
    // Eğer tarihAraligi elementi yoksa çık
    if ($('#tarihAraligi').length === 0) {
        return;
    }
    
    $('#tarihAraligi').daterangepicker({
        locale: {
            format: 'DD.MM.YYYY',
            separator: ' - ',
            applyLabel: 'Uygula',
            cancelLabel: 'İptal',
            fromLabel: 'Başlangıç',
            toLabel: 'Bitiş',
            customRangeLabel: 'Özel',
            weekLabel: 'H',
            daysOfWeek: ['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'],
            monthNames: ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'],
            firstDay: 1
        },
        ranges: {
            'Bugün': [moment(), moment()],
            'Dün': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Son 7 Gün': [moment().subtract(6, 'days'), moment()],
            'Son 30 Gün': [moment().subtract(29, 'days'), moment()],
            'Bu Ay': [moment().startOf('month'), moment().endOf('month')],
            'Geçen Ay': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Bu Yıl': [moment().startOf('year'), moment().endOf('year')]
        },
        autoUpdateInput: false,
        showDropdowns: true,
        alwaysShowCalendars: true
    });
    
    // Tarih seçildiğinde
    $('#tarihAraligi').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD.MM.YYYY') + ' - ' + picker.endDate.format('DD.MM.YYYY'));
        $('#tarihBaslangic').val(picker.startDate.format('YYYY-MM-DD'));
        $('#tarihBitis').val(picker.endDate.format('YYYY-MM-DD'));
    });
    
    // Tarih seçimi iptal edildiğinde
    $('#tarihAraligi').on('cancel.daterangepicker', function(ev, picker) {
        $(this).val('');
        $('#tarihBaslangic').val('');
        $('#tarihBitis').val('');
    });
    
    // Tarih temizle butonu
    $('#tarihTemizle').on('click', function() {
        $('#tarihAraligi').val('');
        $('#tarihBaslangic').val('');
        $('#tarihBitis').val('');
    });
}

function masrafListe(){
    masrafTable.clear().draw();
    var formData = new FormData();
    formData.append("masrafListele","1");
    makeAjax(formData).then((data) => {
        masrafTable.rows.add( data.data ).draw();
        
        
    })
}
function masrafFaturaGoruntule(faturaURL,faturaType){
    console.log("masraf fatura götüntüle",`${faturaType} - ${faturaURL}`)
    $('#faturaGosterPDF').toggleClass("d-none",true)
    $('#faturaGosterIMG').toggleClass("d-none",true)
    $(`[aria-name="faturaImg"]`).attr('src', "../assets/bankalar/0.png");
    $("#faturaPdf").attr('src', " " );
        
    if(faturaType == "pdf"){
        $('#faturaGosterPDF').toggleClass("d-none",false)
        $('#faturaPdf').attr('src', faturaURL);
        
    }
    if(faturaType == "jpg" || faturaType == "jpeg" || faturaType == "png"){
        $('#faturaGosterIMG').toggleClass("d-none",false)
        $(`[aria-name="faturaImg"]`).attr('src', faturaURL);
    }
    $('#modal-Fatura-Goster').modal('show')

}
function masrafDuzenleDosyaYukle(file){
   toggleEditBekle('#masrafDuzenleKaydetButtonGonder','#masrafDuzenleKaydetButtonBekle')
    var fd = new FormData();
    var files = file;
    console.log(files)
    fd.append('masrafEklefile', files);
    makeAjaxFile(fd).then((data) => { 
        let dosya = data.data
        $(`[aria-name="masrafDuzenleImage"]`).attr('src', "../assets/bankalar/0.png");
        $("#masrafDuzenlePdf").attr( 'src', " " );

        $('#masrafDuzenlePdfDetay').toggleClass("d-none",true)
        $('#masrafDuzenleImageDetay').toggleClass("d-none",true)
        if(data.status==1){
            $('#masrafDuzenleDosyaTuru').val(dosya.type)
            $('#masrafDuzenleDosyaYolu').val(dosya.target)
            if(dosya.type == "pdf"){
                $('#masrafDuzenlePdfDetay').toggleClass("d-none",false)
                $('#masrafDuzenlePdf').attr('src', dosya.target); 
            }
            if(dosya.type == "jpg" || dosya.type == "jpeg" || dosya.type == "png"){
                $('#masrafDuzenleImageDetay').toggleClass("d-none",false)
                $(`[aria-name="masrafDuzenleImage"]`).attr('src', dosya.target);
            }

        }
        toggelEditGonder('#masrafDuzenleKaydetButtonGonder','#masrafDuzenleKaydetButtonBekle')
        
    })
}
function masrafDuzenleIsLoad(){
    let selected = $('input[name="masrafDuzenleIsSecim"]:checked').val()
    let masrafDuzenleIs = $('#masrafDuzenleIs')
    masrafDuzenleIs.select2()
    masrafDuzenleIs.empty().append(new Option()).trigger('change');
    if(selected == 0){
        $('#masrafDuzenleIsDetay').toggleClass("d-none",true)
        return;
    }
    if(isListesi == null || isListesi == ""){
        console.log("iş listesi boş, ajax çekiliyor")
        var formDatas = new FormData();
        formDatas.append("masrafEkleIsListe","1");
        makeAjax(formDatas).then((datas) => { 
            console.log(datas)
            isListesi = datas.result
            masrafDuzenleIs.select2({
                    theme:"bootstrap4",
                    data: datas.result
                })
            masrafDuzenleIs.trigger('change');
            $('#masrafDuzenleIsDetay').toggleClass("d-none",false)
        })
    }
    else{
    
        
        masrafDuzenleIs.select2({
                    theme:"bootstrap4",
                    data: isListesi
                })
        masrafDuzenleIs.trigger('change');
        $('#masrafDuzenleIsDetay').toggleClass("d-none",false)
    }
}
function masrafDuzenleTipi(element){
    if(element == "E-Arşiv"|| element == "E-Fatura"){
        $('#masrafDuzenleFaturaDetay').toggleClass("d-none",false)
        return;
    }
    $('#masrafDuzenleFaturaDetay').toggleClass("d-none",true)
    $('#masrafDuzenleFaturaNo').val('')
    $('#masrafDuzenleDosyaTuru').val('')
    $('#masrafDuzenleDosyaYolu').val('')
    $("#masrafDuzenleDosya").replaceWith($("#masrafDuzenleFaturaNo").val('').clone(true));
    $(`[aria-name="masrafDuzenleImage"]`).attr('src', "../assets/bankalar/0.png");
    $("#masrafDuzenlePdf").attr( 'src', " " );
    $('#masrafDuzenlePdfDetay').toggleClass("d-none",true)
    $('#masrafDuzenleImageDetay').toggleClass("d-none",true)
}
function masrafDuzenleClear(){
 $('.form-control').val("");
 $(`[aria-clear="masrafDuzenle"]`).val("");
 $("#masrafDuzenleOdemeGrubu").empty().append(new Option()).trigger('change');
 $('#masrafDuzenleFaturaDetay').toggleClass("d-none",true)
 $('[aria-name="ekleRadioDigerMasraf"]').toggleClass("active",true)
 $('[aria-name="ekleRadioIsMasrafi"]').toggleClass("active",false)
 $('[aria-name="ekleRadioDigerMasraf"]').prop("checked", true);
 $('[aria-name="ekleRadioIsMasrafi"]').prop("checked", false);
 $('#masrafDuzenleIsDetay').toggleClass("d-none",true)
 $("#masrafDuzenleIs").empty().append(new Option()).trigger('change');
 $('#masrafDuzenleOdemeTuruDetay').toggleClass("d-none",true)
 $(`[aria-name="masrafDuzenleImage"]`).attr('src', "../assets/bankalar/0.png");
 $("#masrafDuzenlePdf").attr( 'src', " " );
 $('#masrafDuzenlePdfDetay').toggleClass("d-none",true)
 $('#masrafDuzenleImageDetay').toggleClass("d-none",true)
 $('#masrafDuzenleKurDetay').toggleClass("d-none",true)
 $('#masrafDuzenleparaBirimi').val('try').trigger('change');
}
function masrafDuzenle(ID){

    $('#masrafDuzenleFaturaTarihi').datetimepicker({
    format: 'DD.MM.YYYY'
    });
    var formData = new FormData();
    formData.append("masrafDuzenleVeri",ID);
    makeAjax(formData).then((data) => {
        masrafDuzenleClear()
        let masraf = data.data;
        console.log(masraf)
        $('#masrafDuzenleID').val(masraf.ID)
        $("#masrafDuzenleAdi").val(masraf.kartAdi)
        $("#masrafDuzenleTipi").val(masraf.faturaTuru)
        if(masraf.faturaTuru == "E-Arşiv" || masraf.faturaTuru == "E-Fatura"){
            $('#masrafDuzenleFaturaDetay').toggleClass("d-none",false)
            $("#masrafDuzenleFaturaNo").val(masraf.faturaNo)
        }
        $("#masrafDuzenleFaturaTarihiInput").val(masraf.faturaTarihi)
        $("#masrafDuzenleFaturaTutari").val(masraf.faturaTutari)
        if(masraf.isRefensVarmi==1){
            $('[aria-name="ekleRadioDigerMasraf"]').toggleClass("active",false)
            $('[aria-name="ekleRadioIsMasrafi"]').toggleClass("active",true)
            $('[aria-name="ekleRadioDigerMasraf"]').prop("checked", false);
            $('[aria-name="ekleRadioIsMasrafi"]').prop("checked", true);
            $('#masrafDuzenleIsDetay').toggleClass("d-none",false)
            if(isListesi == null || isListesi == ""){
                var formDatas = new FormData();
                formDatas.append("masrafEkleIsListe","1");
                makeAjax(formDatas).then((datas) => { 
                    console.log(datas)
                    isListesi = datas.result
                    $("#masrafDuzenleIs").select2({
                            theme:"bootstrap4",
                            data: datas.result
                        })
                    $("#masrafDuzenleIs").val(masraf.teklifID).trigger('change');
                    $('#masrafDuzenleIsDetay').toggleClass("d-none",false)
                })
            }
            else{
                console.log("iş listesi var, select2 hazır veriden yüklendi")
                
                $("#masrafDuzenleIs").select2({
                            theme:"bootstrap4",
                            data: isListesi
                        })
                $("#masrafDuzenleIs").val(masraf.teklifID).trigger('change');
                $('#masrafDuzenleIsDetay').toggleClass("d-none",false)
            }
        }
        if(odemeGrubu == null || odemeGrubu==""){
            var formData = new FormData();
            formData.append("OdemeCesidiEkleAra","0");
            makeAjax(formData).then((data) => { 
                console.log(data)
                odemeGrubu=data.result

                $('#masrafDuzenleOdemeGrubu').select2({
                    theme:"bootstrap4",
                    data: odemeGrubu,
                    placeholder: 'Ödeme Grubu Seçiniz'
                })
            })
        }
        else{
            $('#masrafDuzenleOdemeGrubu').select2({
                theme:"bootstrap4",
                data: odemeGrubu,
                placeholder: 'Ödeme Grubu Seçiniz'
            })
        }
        $("#masrafDuzenleOdemeGrubu").val(masraf.odemeGrubu).trigger('change');
        formDatas = new FormData()
        formDatas.append("OdemeTuruAra",masraf.odemeGrubu);
        makeAjax(formDatas).then((datas) => { 
            console.log(datas)
            $('#masrafDuzenleOdemeTuru').select2({
                theme:"bootstrap4",
                data: datas.result
            })
            $('#masrafDuzenleOdemeTuru').val(masraf.odemeCesidi).trigger('change');
            $('#masrafDuzenleOdemeTuruDetay').toggleClass("d-none",false)
        })
        $('#masrafDuzenleOdemeGrubu').on('select2:select', function (e) {
            var data = e.params.data;
            $('#masrafDuzenleOdemeTuru').empty().append(new Option()).trigger('change');
            var formDatas = new FormData();
            formDatas.append("OdemeTuruAra",data.id);
            makeAjax(formDatas).then((datas) => { 
                console.log(datas)
                $('#masrafDuzenleOdemeTuru').select2({
                    theme:"bootstrap4",
                    data: datas.result
                })
                $('#masrafDuzenleOdemeTuru').trigger('change');
                $('#masrafDuzenleOdemeTuruDetay').toggleClass("d-none",false)
            })
        });
        $('#masrafDuzenleNot').val(masraf.aciklama)
        
        $('#masrafDuzenlePdfDetay').toggleClass("d-none",true)
        $('#masrafDuzenleImageDetay').toggleClass("d-none",true)
        $(`[aria-name="masrafDuzenleImage"]`).attr('src', "../assets/bankalar/0.png");
        $("#masrafDuzenlePdf").attr( 'src', " " );
        if(masraf.faturaUrl){

            if(masraf.dosyaTipi == "pdf"){
                $('#masrafDuzenlePdfDetay').toggleClass("d-none",false)
                $('#masrafDuzenlePdf').attr('src', masraf.faturaUrl);
                
            }
            if(masraf.dosyaTipi == "jpg" || masraf.dosyaTipi == "jpeg" || masraf.dosyaTipi == "png"){
                $('#masrafDuzenleImageDetay').toggleClass("d-none",false)
                $(`[aria-name="masrafDuzenleImage"]`).attr('src', masraf.faturaUrl);
            }
            $('#masrafDuzenleDosyaTuru').val(masraf.dosyaTipi)
            $('#masrafDuzenleDosyaYolu').val(masraf.faturaUrl)
        } 
        $('#masrafDuzenleparaBirimi').val(masraf.paraBirimi)
        $('#masrafDuzenleKur').val(masraf.kur)
        if(masraf.paraBirimi =="usd" || masraf.paraBirimi == "eur"){
            $('#masrafDuzenleKurDetay').toggleClass("d-none",false)
        }
        if(masraf.paraBirimi =="try"){
            $('#masrafDuzenleKur').val("1")
        }
        
// aciklama
       // $("#OdemeCesidiDuzenleAra").val(odeme.odemeTuru)
       // $("#OdemeCesidiDuzenleAra").trigger('change');
    })/**/

    $('#modal-Masraf-Duzenle').modal('show')
}
function odemeDuzenleKaydet(){
    toggleEditBekle('#masrafDuzenleKaydetButtonGonder','#masrafDuzenleKaydetButtonBekle')
	var formData = new FormData($("form#masrafDuzenleForm")[0]);

	let formHata=false;
    if(formHata ==false ){formHata=formHataBak(null,$('input#masrafDuzenleID').val())}
    if(formHata ==false ){formHata=formHataBak("#masrafDuzenleAdi",formData.get("masrafDuzenleAdi"))}

    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:`lütfen kırmızı işaretli alanları doldurunuz`,
            confirmButtonText: 'Tamam'
        })
        toggelEditGonder('#masrafDuzenleKaydetButtonGonder','#masrafDuzenleKaydetButtonBekle')
        return;
    }
    formData.append("masrafDuzenleKaydet",$('input#masrafDuzenleID').val());
    makeAjax(formData).then((data) => { 
        if(data.status==1){
            Toast.fire({
                icon: "success",
                text:data.message
            })
            $('#odemenCesidiDuzenle').toggleClass("d-none",true)
            masrafDuzenleClear()
            toggelEditGonder('#masrafDuzenleKaydetButtonGonder','#masrafDuzenleKaydetButtonBekle')

            if ( ! $.fn.DataTable.isDataTable( '#masrafListe' ) ) {
                initmasrafTable()
            }

            if ($.fn.DataTable.isDataTable( '#masrafListe' ) ) {
                console.log(data.masraf)
                let masrafRow = masrafTable.row( `#${data.data.DT_RowId}`)
                masrafRow.data(data.data).draw();
                var rowIndex =masrafRow.index();
                var cellNode = masrafTable.cell(rowIndex, 3).node();
                let color = "red"
                if(data.data.acikmi==1){color="green"}
                $(cellNode).css('color', color);
            }
            $('#modal-Masraf-Duzenle').modal('hide')
        }
        else{
             ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
            toggelEditGonder('#masrafDuzenleKaydetButtonGonder','#masrafDuzenleKaydetButtonBekle')
        }
    })    
}
function masrafEkleparaBirimi(){
    let paraBirimi = $("#masrafEkleparaBirimi").val()
    if(paraBirimi=="try"){
        $("#masrafEkleKur").val("1")
        $('#masrafEkleKurDetay').toggleClass("d-none",true)
    }
    else{
        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#masrafEkleKur").val(dolarkuru)
                }
                if(paraBirimi=="eur"){
                    $("#masrafEkleKur").val(eurokuru)
                }
                $('#masrafEkleKurDetay').toggleClass("d-none",false)
                return;
            })

        }
        else{
            if(paraBirimi=="usd"){
                $("#masrafEkleKur").val(dolarkuru)
            }
            if(paraBirimi=="eur"){
                $("#masrafEkleKur").val(eurokuru)
            }
            $('#masrafEkleKurDetay').toggleClass("d-none",false)
        }
        

    }
}
function masrafDuzenleparaBirimi(){
    let paraBirimi = $("#masrafDuzenleparaBirimi").val()
     if(paraBirimi=="try"){
        //$("#masrafDuzenleKur").val("1")
        $('#masrafDuzenleKurDetay').toggleClass("d-none",true)
    }
    else{
        $('#masrafDuzenleKurDetay').toggleClass("d-none",false)
    }
}
function masrafDuzenleKurYenile(){
    let paraBirimi = $("#masrafDuzenleparaBirimi").val()
    if(paraBirimi=="try"){
       
    }
    else{

        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#masrafDuzenleKur").val(dolarkuru)
                }
                if(paraBirimi=="eur"){
                    $("#masrafDuzenleKur").val(eurokuru)
                }
                $('#masrafDuzenleKurDetay').toggleClass("d-none",false)
                return;
            })

        }
        else{
            if(paraBirimi=="usd"){
                $("#masrafDuzenleKur").val(dolarkuru)
            }
            if(paraBirimi=="eur"){
                $("#masrafDuzenleKur").val(eurokuru)
            }
            $('#masrafDuzenleKurDetay').toggleClass("d-none",false)
        }
    }
}
function masrafSilConfirm(ID){
    let buttons=`<h4 class="text-danger">Bu işlem geri alınamaz!</h4><p class="text-danger">Masraf kartına bağlı tüm ödemelerde silenecek!</p><button type="button" class="btn btn-outline-danger btn-lg m-2" onclick="masrafSil(${ID})" ><i class="fa-solid fa-trash-can"></i>Masraf Kartı Sil</button>`
    ToastConfimDelete.fire({
        icon: "warning",
        iconColor:"red",
        title: "Masraf kartını silmek İstediğinizden emin misiniz? ",
        html:`${buttons}`,

        confirmButtonText: 'Vazgeç'
    })
}
function masrafSil(ID){
     let formData = new FormData()
    formData.append("masrafSil",ID)
    makeAjax(formData).then((data) => { 
        if(data.status==1){
            masrafTable.row(`#${data.data}`).remove().draw(false);
            swal.close()
        }
    })
    
}
//#endregion

//#region Son Mutabakat işlemleri
function mutabakatBak(teklifID){
    
    var formData = new FormData();
    formData.append("sonMutabakatBak",teklifID);
    makeAjax(formData).then((data) => {
        if(data.status==1){
            if(data.data){
                sonMutabakatGoster(data.data)
            }
            else{
                mutabakatClear()
                $('#modal-SonMutabakat-Ekle').modal('hide')
            }
        }
    })
}
function mutabakatClear(){
    $('[aria-name="mutabakatEkle"]').val('');
    $('[aria-name="mutabakatTeklifAdi"]').html('');
    $("#mutabakatDosya").replaceWith($("#mutabakatDosya").val('').clone(true));
       $('#mutabakatPdf').attr('src', "");
        $('#mutabakatPdfDetay').toggleClass("d-none",true)
        $('#mutabakatImageDetay').toggleClass("d-none",true)
        $('#mutabakatXLSDetay').toggleClass("d-none",true)
        $(`[aria-name="mutabakatImage"]`).attr('src',  "../assets/bankalar/0.png");
         $('[aria-name="masrafEkleXls"]').attr('href',"")

}
function sonMutabakatGoster(mutabakat){
    mutabakatClear()
    $('[aria-name="mutabakatTeklifAdi"]').html(mutabakat.teklifAdi);
    $('[aria-name="mutabakatTeklifTutari"]').val(mutabakat.teklifTutari);
    $('[aria-name="mutabakatTeklifparaBirimi"]').val(mutabakat.paraBirimi);
    $('[aria-name="mutabakatFaturaTutari"]').val(mutabakat.mutabakatTutari);
    $('[aria-name="mutabakatFaturaparaBirimi"]').val(mutabakat.paraBirimi);
    $('[aria-name="mutabakatDuzenle"]').val(mutabakat.teklifID);
   // $('#masrafEkleDosyaTuru').val(dosya.type)
    //$('#masrafEkleDosyaYolu').val(dosya.target)
    if(mutabakat.dosyaTipi == "pdf"){
        $('#mutabakatPdfDetay').toggleClass("d-none",false)
        $('#mutabakatPdf').attr('src', mutabakat.mutabakatDosya); 
    }
    if(mutabakat.dosyaTipi == "jpg" || mutabakat.dosyaTipi == "jpeg" || mutabakat.dosyaTipi == "png"){
        $('#mutabakatImageDetay').toggleClass("d-none",false)
        $(`[aria-name="mutabakatImage"]`).attr('src', mutabakat.mutabakatDosya);
    }
    if(mutabakat.dosyaTipi == "xls" || mutabakat.dosyaTipi == "xlsx"){

        
        $('#mutabakatXLSDetay').toggleClass("d-none",false)
        $('[aria-name="masrafEkleXls"]').attr('href',mutabakat.mutabakatDosya)
    }
    $('#modal-SonMutabakat-Ekle').modal('show')

}
function mutabakatDosyaUpdate(dosyaYolu,dosyaTipi){
    toggleBekle("#mutabakatEkleButtonGonder","#mutabakatEkleButtonBekle")
    var formData = new FormData()
    mutabakatID=$('input[aria-name="mutabakatDuzenle"]').val()
    formData.append("mutabakatDosyaUpdate",mutabakatID)
    formData.append("mutabakatDosyaYolu",dosyaYolu)
    formData.append("mutabakatDosyaTipi",dosyaTipi)
    makeAjax(formData).then((data) => { 
        if(data.status==1){
            Toast.fire({
                icon: "success",
                text:data.message
            })
        }
        else{
             ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
        }
        toggelGonder("#mutabakatEkleButtonGonder","#mutabakatEkleButtonBekle")
    })
}
function mutabakatDosyaYukle(file){
    toggleBekle("#mutabakatEkleButtonKaydet","#mutabakatEkleButtonBekle")
    var fd = new FormData();
    var files = file;
    console.log(files)
    fd.append('mutabakatfile', files);
    makeAjaxFile(fd).then((data) => { 
        let dosya = data.data
        $('#mutabakatPdf').attr('src', "");
        $('#mutabakatPdfDetay').toggleClass("d-none",true)
        $('#mutabakatImageDetay').toggleClass("d-none",true)
        $('#mutabakatXLSDetay').toggleClass("d-none",true)
        $(`[aria-name="mutabakatImage"]`).attr('src',  "../assets/bankalar/0.png");
         $('#masrafEkleXls').attr('href',"")
        if(data.status==1){
            mutabakatDosyaUpdate(dosya.target,dosya.type)   
            $('#masrafEkleDosyaTuru').val(dosya.type)
            $('#masrafEkleDosyaYolu').val(dosya.target)
            if(dosya.type == "pdf"){
                $('#mutabakatPdfDetay').toggleClass("d-none",false)
                $('#mutabakatPdf').attr('src', dosya.target); 
            }
            if(dosya.type == "jpg" || dosya.type == "jpeg" || dosya.type == "png"){
                $('#mutabakatImageDetay').toggleClass("d-none",false)
                $(`[aria-name="mutabakatImage"]`).attr('src', dosya.target);
            }
            if(dosya.type == "xls" || dosya.type == "xlsx"){

                
                $('#mutabakatXLSDetay').toggleClass("d-none",false)
                $('[aria-name="masrafEkleXls"]').attr('href',dosya.target)
            }

        }
        toggelGonder("#mutabakatEkleButtonKaydet","#mutabakatEkleButtonBekle")
        
    })
}
function sonMutabakatEkle(){
    toggleBekle("#mutabakatEkleButtonKaydet","#mutabakatEkleButtonBekle")
    var formData = new FormData($("form#mutabakatEkleForm")[0]);
    let teklifuuid=formData.get("mutabakatDuzenle")
    let formHata;
    formHata=formHataBak("#mutabakatFaturaTutari",formData.get("mutabakatFaturaTutari"))
    if(formHata){
       Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        toggelGonder("#mutabakatEkleButtonKaydet","#mutabakatEkleButtonBekle")
        return;
    }
    formData.append("sonMutabakatEkle","1");
    makeAjax(formData).then((data) => { 
        if(data.status==1){
            Toast.fire({
                icon: "success",
                text:data.message
            })
            mutabakatClear()
            TahsilatKartEkleOto(teklifuuid)
            $('#modal-SonMutabakat-Ekle').modal('hide')
        }
        else{
             ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
        }
        toggelGonder("#mutabakatEkleButtonKaydet","#mutabakatEkleButtonBekle")
    })  
}
//#endregion

//#region Tahsilat Kartı İşlemleri
function tahsilatEkleClear(){
    
    $('#tahsilatEkleForm')[0].reset();

    $('#tahsilatEkleIs').val(null).trigger('change');
    $('#tahsilatEkleOdeme').val(null).trigger('change');
    $('#tahsilatEkleOdemeTuru').val(null).trigger('change');
    
    
    $('#tahsilatEkleDosyaTuru').val('');
    $('#tahsilatEkleDosyaYolu').val('');
    
   
    $('#tahsilatEkleDosya').val('');
    $('.custom-file-label').text('Dosya Seçin');
    

    $('#tahsilatEklePdfDetay').addClass('d-none');
    $('#tahsilatEkleImageDetay').addClass('d-none');
    

    $('#tahsilatEkleKurDetay').addClass('d-none');
    

    $('#tahsilatEkleFaturali').prop('checked', true);
    
    tahsilatTuruYukle();
    tahsilatIsListeYukle();
}


function tahsilatTuruYukle() {
    var formData = new FormData();
    formData.append("tahsilatCesidiBak", "1");
    
    makeAjax(formData).then((data) => {
        console.log("Tahsilat türleri API response:", data);
        
        if(data.status == 1 && data.data) {
            console.log("Tahsilat türleri yükleniyor:", data.data);
            
            // Veri formatını dönüştür (ID ve tahsilatTuru -> id ve text)
            var tahsilatTurleri = data.data.map(function(tur) {
                return {
                    id: tur.ID,
                    text: tur.tahsilatTuru
                };
            });
            
            $("#tahsilatEkleOdeme").select2({
                theme:"bootstrap4",
                data: tahsilatTurleri
            });
        } else {
            console.error("Tahsilat türleri yüklenemedi:", data);
        }
    }).catch((error) => {
        console.error("API hatası:", error);
    });
}

// İş listesini yükle
function tahsilatIsListeYukle() {
    var formData = new FormData();
    formData.append("tahsilatIsListe", "1");
    
    makeAjax(formData).then((data) => {
        console.log("İş listesi API response:", data);
        
        if(data.status == 1 && data.result) {
            console.log("İş listesi yükleniyor:", data.result);
            
            $("#tahsilatEkleIs").select2({
                theme:"bootstrap4",
                data: data.result
            });
        } else {
            console.error("İş listesi yüklenemedi:", data);
        }
    }).catch((error) => {
        console.error("API hatası:", error);
    });
}

function TahsilatKartEkleOto(teklifuuid){  
    var formData = new FormData();
    formData.append("tasilatKartiOlustur",teklifuuid);
    makeAjax(formData).then((data) => { 
        if(data.status==1){
           Toast.fire({
                icon: "success",
                text:data.message
            })
        }
        else{
             ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Tahsilat Kartı Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
        }
    })

}
function tahsilatListesiBak(){
    var formData = new FormData();
    formData.append("tahsilatListesiBak","1");
    makeAjax(formData).then((data) => { 
        if(data.status==1){
           console.log(data.data)
           if ( ! $.fn.DataTable.isDataTable( '#tahsilatListe' ) ) {
				inittahsilatTable()
			}
        tahsilatTable.rows.add( data.data ).draw();
        }
        else{
             ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Tahsilat Listesi Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
        }
    })

    }
function tahsilatOdemeClear(){
    $('#modal-body-Odeme-Ekle').toggleClass("d-none",true)
    $('[aria-name="modalLoad"]').toggleClass("d-none",false)
    $(`[aria-name="tahsilatEkleFaturaGoster"]`).attr('aria-type',"");
    $(`[aria-name="tahsilatEkleFaturaGoster"]`).attr('aria-url',"");
    $('#tahsilatEklePAraBirimi').html(`Kur`)
    $('[aria-clear-html="tahsilatEkle"]').html(` `)
    $(`#tahsilatEkleTahsilatDuzenle`).attr('aria-ID',"");
    $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("active",false)
     $(`[aria-name="tahsilatEkleKapali"]`).toggleClass("active",false)
     $('[aria-clear="tahsilatEkle"]').val(``)
     tahsilatEkleTable.clear().draw();
}
function tahsilatOdemeEkle(ID){
    tahsilatOdemeClear()    
   // $('[aria-name="modalLoad"]').toggleClass("d-none",false)
   $('#modal-tahsilat-Odeme-Ekle').modal('show')
     $('#tahsilatEkleOdemeTarihi').datetimepicker({
         format: 'DD.MM.YYYY',locale: 'tr'
     });
    formData = new FormData();
    //formData.append("wait","1");
    formData.append("tahsilatDetay",ID);
    makeAjax(formData).then((data) => { 
        let tahsilat = data.data
         $('[aria-name="tahsilatEkleTahsilatAdi"]').val(tahsilat.kartAdi)   
         $(`[aria-name="tahsilatEkleTahsilatDuzenle"]`).attr('aria-ID', tahsilat.ID);
         $(`#tahsilatEkleTahsilatID`).val(tahsilat.ID);
         $(`#tahsilatEkleTahsilatID`).val(tahsilat.ID); 
        
        $('[aria-name="tahsilatEkleFaturaTipi"]').html(tahsilat.faturaTuru)        
        $('[aria-name="tahsilatEkleFaturaNo"]').html(tahsilat.faturaNo)    

        if(tahsilat.dosyaTipi!="" && tahsilat.faturaUrl != ""){
                    $(`[aria-name="tahsilatEkleFaturaGoster"]`).attr('aria-type', tahsilat.dosyaTipi);
            $(`[aria-name="tahsilatEkleFaturaGoster"]`).attr('aria-url', tahsilat.faturaUrl);
            $(`[aria-name="tahsilatEkleFaturaGoster"]`).toggleClass("d-none",false)
        }
        else{
            $(`[aria-name="tahsilatEkleFaturaGoster"]`).toggleClass("d-none",true)
        }

        if(tahsilat.isRefensVarmi){  $('[aria-name="tahsilatEkleFaturaHarcama"]').html("İş Harcaması")  }
        else{   $('[aria-name="tahsilatEkleFaturaHarcama"]').html("Diğer Harcama")  }
        if(tahsilat.paraBirimi =="try"){ $('[aria-name ="tahsilatEkleParaBirimi"]').html(`Kur (₺)`) }
        if(tahsilat.paraBirimi =="usd"){ $('[aria-name ="tahsilatEkleParaBirimi"]').html(`Kur ($)`) }
        if(tahsilat.paraBirimi =="eur"){ $('[aria-name ="tahsilatEkleParaBirimi"]').html(`Kur (€)`) }
        $('[aria-name="tahsilatEkleKur"]').html(tahsilat.kur)
        $('[aria-name="tahsilatEkleEkleFaturaTarihi"]').html(tahsilat.faturaTarihi)
        //let formattedTotal = new Intl.NumberFormat("de-DE").format(masraf.faturaTutari)
         $('[aria-name="tahsilatEkleToplamOdeme"]').html(tahsilat.faturaTutari || "0") 
         $('[aria-name="tahsilatEkleYapilanODeme"]').html(tahsilat.odenen || "0")
         $('[aria-name="tahsilatEkleKalanODeme"]').html(tahsilat.kalan || tahsilat.faturaTutari || "0")   
         $('[aria-name="tahsilatEkleOdemeGrubu"]').html(tahsilat.odemeGrubu || "-")
         $('[aria-name="tahsilatEkleOdemeCesidi"]').html(tahsilat.odemeCesidi || "-")

        if(tahsilat.acikmi==1){
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",false)
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",true)
            $(`[aria-name="tahsilatEkleAcik"]`).html("Ödendi") 
        }
        else{
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-danger",true)  
            $(`[aria-name="tahsilatEkleAcik"]`).toggleClass("btn-sm btn-outline-success",false)    
            $(`[aria-name="tahsilatEkleAcik"]`).html("açık")   
        }
        //tahsilatEkleKasa
        tahsilatEkleKasa =$("#tahsilatEkleKasa")      
        tahsilatEkleKasa.empty().append(new Option()).trigger('change');   
        tahsilatEkleKasa.select2()
        if(kasaListesi == null || kasaListesi==""){
            var formData = new FormData();
            formData.append("OdemeEkleKasaAra","0");    
            makeAjax(formData).then((data) => { 
                kasaListesi=data.result

                tahsilatEkleKasa.select2({
                    theme:"bootstrap4",
                    data: kasaListesi,
                    placeholder: 'Kasa Seçiniz'
                })
            })
        }
        else{
            tahsilatEkleKasa.select2({
                theme:"bootstrap4",
                data: kasaListesi,
                placeholder: 'Kasa Seçiniz'
            })  
        }  
         // Tahsilat ödemelerini yükle
         var formData2 = new FormData();
         formData2.append("tahsilatDetay", ID);
         makeAjax(formData2).then((odemeData) => {
             if(odemeData.status == 1 && odemeData.tahsilat && odemeData.tahsilat.length > 0) {
                 tahsilatEkleTable.rows.add( odemeData.tahsilat ).draw();       
             }
         }).catch((error) => {
             console.log("Tahsilat ödemeleri yüklenemedi:", error);
         });
        $('[aria-name="modalLoad"]').toggleClass("d-none",true)
        $('#modal-body-tahsilat-Odeme-Ekle').toggleClass("d-none",false)
        
        // Para birimi değişikliği event'ini tetikle
        $('#tahsilatEkleparaBirimi').trigger('change');
    })

   

}

function tahsilatDuzenleClear(){
    // Clear all form fields
    $('[aria-clear="tahsilatDuzenle"]').val('');
    
    // Reset radio buttons
    $('#tahsilatDuzenleFaturali').prop('checked', true);
    
    // Clear datetime pickers
    if ($('#tahsilatDuzenleFaturaTarihi').data('DateTimePicker')) {
        $('#tahsilatDuzenleFaturaTarihi').data('DateTimePicker').clear();
    }
    if ($('#tahsilatDuzenleVadeTarihi').data('DateTimePicker')) {
        $('#tahsilatDuzenleVadeTarihi').data('DateTimePicker').clear();
    }
    
    // Reset select2 dropdowns
    if ($('#tahsilatDuzenleOdeme').hasClass('select2-hidden-accessible')) {
        $('#tahsilatDuzenleOdeme').val(null).trigger('change');
    }
    if ($('#tahsilatDuzenleIs').hasClass('select2-hidden-accessible')) {
        $('#tahsilatDuzenleIs').val(null).trigger('change');
    }
}

function tahsilatDuzenleLoad(){
    // Initialize datetime pickers
    $('#tahsilatDuzenleFaturaTarihi').datetimepicker({
        format: 'DD.MM.YYYY',
        locale: 'tr',
        useCurrent: false,
        allowInputToggle: true
    });
    
    $('#tahsilatDuzenleVadeTarihi').datetimepicker({
        format: 'DD.MM.YYYY',
        locale: 'tr',
        useCurrent: false,
        allowInputToggle: true
    });
    
    // Load tahsilat types
    var formData = new FormData();
    formData.append("tahsilatCesidiBak", "1");
    
    makeAjax(formData).then((data) => {
        if(data.status == 1 && data.data) {
            var tahsilatTurleri = data.data.map(function(tur) {
                return {
                    id: tur.ID,
                    text: tur.tahsilatTuru
                };
            });
            
            $("#tahsilatDuzenleOdeme").select2({
                theme:"bootstrap4",
                data: tahsilatTurleri,
                placeholder: 'Tahsilat Türü seçiniz'
            });
        }
    });
    
    // Load work list
    var formData2 = new FormData();
    formData2.append("isListesiBak", "1");
    
    makeAjax(formData2).then((data) => {
        if(data.status == 1 && data.data) {
            var isListesi = data.data.map(function(is) {
                return {
                    id: is.ID,
                    text: is.isAdi
                };
            });
            
            $("#tahsilatDuzenleIs").select2({
                theme:"bootstrap4",
                data: isListesi,
                placeholder: 'İş seçiniz'
            });
        }
    });
}

function tahsilatCesidiBak(){
    
    var formData = new FormData();
    formData.append("tahsilatCesidiBak","1");
    makeAjax(formData).then((data) => { 
        if(data.status==1){
           tahsilatCesitTable.clear().draw();
           console.log(data.data)
           tahsilatCesidi=data.data
           tahsilatCesitTable.rows.add( tahsilatCesidi ).draw();
        }
        else{
             ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Tahsilat Çeşidi Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
        }
    })

}

function tahsilatCesidiEkleGoster(){
    $('#tahsilatTuruAdi').val("");
    $('#tahsilatCesidiDuzenle').toggleClass("d-none",true)
    $(`#tahsilatCesidiEkle`).toggleClass("d-none",false)
}
function tahsilatTuruKaydet(){
     let container = $('#tahsilatTuruAdi')
    let tahsilatturuAdi = container.val()
    if(tahsilatturuAdi == ""){
        container.toggleClass("border-danger",true);
         Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        return;
    }
    var formData = new FormData();
    formData.append("tahsilatTuruKaydet",tahsilatturuAdi);
     makeAjax(formData).then((data) => {
        //kasaEkleDurum
        Toast.fire({
            icon: "success",
            text:data.message
        })
        container.val("");
        tahsilatCesidiBak()
    })
}
function tahsilatCesidiDuzenleClear(){

    $('#tahsilatCesidiDuzenleAdi').val("");
    $('#tahsilatCesidiDuzenleID').val('')
    $('#tahsilatCesidiDuzenle').toggleClass("d-none",true)
}
function tahsilatCesidiDuzenle(ID){
 //odemeCesidiTable
    $('#tahsilatCesidiEkle').toggleClass("d-none",true)
    var formData = new FormData();
    formData.append("tahsilatTuruDuzenleVeri",ID);
    makeAjax(formData).then((data) => {
        if(data.status== 0){
            ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
            return;
        }
        tahsilatCesidiDuzenleClear()
        let tahsilat = data.data;
        $(`#tahsilatCesidiEkle`).toggleClass("d-none",true)
        $('#tasilatCesidiDuzenleID').val(tahsilat.ID)
        $("#tahsilatCesidiDuzenleAdi").val(tahsilat.tahsilatTuru)
        $('#tahsilatCesidiDuzenle').toggleClass("d-none",false)    
    })
}
function tahsilatCesidiDuzenleKaydet(e){
    e.preventDefault();
    let container = $('#tahsilatCesidiDuzenleAdi')
    let tahsilatturuAdi = container.val()
    let ID = $('#tasilatCesidiDuzenleID').val()
    if(tahsilatturuAdi == ""){
        container.toggleClass("border-danger",true);
         Toast.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        return;
    }
    var formData = new FormData();
    formData.append("tahsilatTuruDuzenleKaydet",ID);
    formData.append("tahsilatTuruDuzenleAdi",tahsilatturuAdi);
     makeAjax(formData).then((data) => {
        //kasaEkleDurum
        Toast.fire({
            icon: "success",
            text:data.message
        })
        tahsilatCesidiDuzenleClear()
        if ( ! $.fn.DataTable.isDataTable( '#tahsilatCesitListe' ) ) {
            inittahsilatCesitListeTable()
        }
        tahsilatCesitTable.row( `#${data.data.DT_RowId}`).data(data.data).draw();
    })  
}
function tahsilatDuzenleClear(){
    $('[aria-clear="tahsilatDuzenle"]').val("");
    $('#tahsilatDuzenleID').val('')
    $("#tahsilatDuzenleOdemeTuru").empty().append(new Option()).trigger('change');
    $('#tahsilatDuzenleImageDetay').toggleClass("d-none",true)
    $('#tahsilatDuzenlePdfDetay').toggleClass("d-none",true)
}
function tahsilatDuzenleToggleParaBirimi(){
    let paraBirimi = $("#tahsilatDuzenleparaBirimi").val()
     if(paraBirimi=="try"){
        //$("#masrafDuzenleKur").val("1")
        $('#tahsilatDuzenleKurDetay').toggleClass("d-none",true)
    }
    else{
        $('#tahsilatDuzenleKurDetay').toggleClass("d-none",false)
    }
}
function tahsilatDuzenleKurYenile(){
     let paraBirimi = $("#tahsilatDuzenleparaBirimi").val()
    if(paraBirimi=="try"){
       
    }
    else{

        if(dolarkuru==0 || eurokuru==0){
            let formData = new FormData();
            formData.append("doviz","1");
            makeAjax(formData).then((data) => { 
                dolarkuru = data.data.dolar
                eurokuru=data.data.euro
                if(paraBirimi=="usd"){
                    $("#tahsilatDuzenleKur").val(dolarkuru)
                }
                if(paraBirimi=="eur"){
                    $("#tahsilatDuzenleKur").val(eurokuru)
                }
                $('#tahsilatDuzenleKurDetay').toggleClass("d-none",false)
                return;
            })

        }
        else{
            if(paraBirimi=="usd"){
                $("#tahsilatDuzenleKur").val(dolarkuru)
            }
            if(paraBirimi=="eur"){
                $("#tahsilatDuzenleKur").val(eurokuru)
            }
            $('#tahsilatDuzenleKurDetay').toggleClass("d-none",false)
        }
    }
}

function tahsilatDuzenleDosyaYukle(file){
   toggleEditBekle('#tahsilatDuzenleKaydetButtonGonder','#tahsilatDuzenleKaydetButtonBekle')
    var fd = new FormData();
    var files = file;
    console.log(files)
    fd.append('tahsilatEklefile', files);
    makeAjaxFile(fd).then((data) => { 
        let dosya = data.data
        $(`[aria-name="tahsilatDuzenleImage"]`).attr('src', "../assets/bankalar/0.png");
        $("#tahsilatDuzenlePdf").attr( 'src', " " );

        $('#tahsilatDuzenlePdfDetay').toggleClass("d-none",true)
        $('#tahsilatDuzenleImageDetay').toggleClass("d-none",true)
        if(data.status==1){
            $('#tahsilatDuzenleDosyaTuru').val(dosya.type)
            $('#tahsilatDuzenleDosyaYolu').val(dosya.target)
            if(dosya.type == "pdf"){
                $('#tahsilatDuzenlePdfDetay').toggleClass("d-none",false)
                $('#tahsilatDuzenlePdf').attr('src', dosya.target); 
            }
            if(dosya.type == "jpg" || dosya.type == "jpeg" || dosya.type == "png"){
                $('#tahsilatDuzenleImageDetay').toggleClass("d-none",false)
                $(`[aria-name="tahsilatDuzenleImage"]`).attr('src', dosya.target);
            }

        }
        toggelEditGonder('#tahsilatDuzenleKaydetButtonGonder','#tahsilatDuzenleKaydetButtonBekle')
        
    })
}
function tahsilatEkleDosyaYukle(file){
    toggleEditBekle('#tahsilatEkleKaydetButtonGonder','#tahsilatEkleKaydetButtonBekle')
     var fd = new FormData();
     var files = file;
     console.log(files)
     fd.append('tahsilatEklefile', files);
     makeAjaxFile(fd).then((data) => { 
         let dosya = data.data
         $(`[aria-name="tahsilatEkleImage"]`).attr('src', "../assets/bankalar/0.png");
         $("#tahsilatEklePdf").attr( 'src', " " );
 
         $('#tahsilatEklePdfDetay').toggleClass("d-none",true)
         $('#tahsilatEkleImageDetay').toggleClass("d-none",true)
         if(data.status==1){
             $('#tahsilatEkleDosyaTuru').val(dosya.type)
             $('#tahsilatEkleDosyaYolu').val(dosya.target)
             if(dosya.type == "pdf"){
                 $('#tahsilatEklePdfDetay').toggleClass("d-none",false)
                 $('#tahsilatEklePdf').attr('src', dosya.target); 
             }
             if(dosya.type == "jpg" || dosya.type == "jpeg" || dosya.type == "png"){
                 $('#tahsilatEkleImageDetay').toggleClass("d-none",false)    
                 $(`[aria-name="tahsilatEkleImage"]`).attr('src', dosya.target);
             }
 
         }
         toggelEditGonder('#tahsilatEkleKaydetButtonGonder','#tahsilatEkleKaydetButtonBekle')
         
     })
 }
function tahsilatDuzenle(ID){
    var formData = new FormData();
    formData.append("tahsilatDuzenleVeri",ID);
    makeAjax(formData).then((data) => {
        if(data.status== 0){
            ToastCenterWhiteButton.fire({
                icon: "warning",
                titleText: "Hata Oluştu",
                text:data.message,
                confirmButtonText: 'Tamam'
            })
            return;
        }
        tahsilatDuzenleClear()
        $('#tahsilatDuzenleFaturaTarihi').datetimepicker({
            format: 'DD.MM.YYYY',locale: 'tr'
        });
         $('#tahsilatDuzenleVadeTarihi').datetimepicker({
            format: 'DD.MM.YYYY',locale: 'tr'
        });
        
        let tahsilat = data.data
        console.log(tahsilat)
        $('#tahsilatDuzenleID').val(tahsilat.ID) 
        $("#tahsilatDuzenleAdi").val(tahsilat.kartAdi)
        $('#tahsilatDuzenleFaturaNo').val(tahsilat.faturaNo)
        $("#tahsilatDuzenleFaturaTarihiInput").val(tahsilat.faturaTarihi)
        $("#tahsilatDuzenleFaturaTutari").val(tahsilat.faturaTutari)
        $("#tahsilatDuzenleparaBirimi").val(tahsilat.paraBirimi).trigger('change');
        if(tahsilat.paraBirimi =="usd" || tahsilat.paraBirimi == "eur"){
            $('#tahsilatDuzenleKurDetay').toggleClass("d-none",false)
        }
        if(tahsilat.paraBirimi =="try"){
            $('#tahsilatDuzenleKur').val("1")
            $('#tahsilatDuzenleKurDetay').toggleClass("d-none",true)
        }
        $('#tahsilatDuzenleKur').val(tahsilat.kur)
        $("#tahsilatDuzenleVadeTarihi").val(tahsilat.tahsilatVadesi)
        $("#tahsilatDuzenleOdeme").select2({
            theme:"bootstrap4",
            data: tahsilat.tahsilatTurleri
        })
        if(tahsilat.odemeCesidi != null && tahsilat.odemeCesidi !=""){
            $("#tahsilatDuzenleOdeme").val(tahsilat.tahsilat.odemeCesidi).trigger('change');
        }
        $('#tahsilatDuzenleNot').val(tahsilat.aciklama)
        if(tahsilat.dosyaTipi == "pdf"){
            $('#tahsilatDuzenlePdfDetay').toggleClass("d-none",false)
            $('#tahsilatDuzenlePdf').attr('src', tahsilat.faturaUrl);
            
        }
        if(tahsilat.dosyaTipi == "jpg" || tahsilat.dosyaTipi == "jpeg" || tahsilat.dosyaTipi == "png"){
            $('#tahsilatDuzenleImageDetay').toggleClass("d-none",false)
            $(`[aria-name="tahsilatDuzenleImage"]`).attr('src', tahsilat.faturaUrl);
        }
        $('#tahsilatDuzenleDosyaTuru').val(tahsilat.dosyaTipi)
        $('#tahsilatDuzenleDosyaYolu').val(tahsilat.faturaUrl)
    })
$('#modal-tahsilat-Duzenle').modal('show')
}

// Tahsilat düzenle kaydet fonksiyonu
function tahsilatDuzenleKaydet() {
    var formData = new FormData();
    
    // Tahsilat ID'sini al
    var tahsilatID = $('#tahsilatDuzenleID').val();
    
    // Form verilerini topla
    formData.append("tahsilatDuzenleKaydet", "1");
    formData.append("tahsilatID", tahsilatID);
    formData.append("kartAdi", $('#tahsilatDuzenleAdi').val());
    formData.append("faturaNo", $('#tahsilatDuzenleFaturaNo').val());
    formData.append("faturaTarihi", $('#tahsilatDuzenleFaturaTarihiInput').val());
    formData.append("faturaTutari", $('#tahsilatDuzenleFaturaTutari').val());
    formData.append("paraBirimi", $('#tahsilatDuzenleparaBirimi').val());
    formData.append("kur", $('#tahsilatDuzenleKur').val());
    formData.append("vadeTarihi", $('#tahsilatDuzenleVadeTarihiInput').val());
    formData.append("odemeCesidi", $('#tahsilatDuzenleOdeme').val());
    formData.append("isID", $('#tahsilatDuzenleIs').val());
    formData.append("aciklama", $('#tahsilatDuzenleNot').val());
    formData.append("faturaDurumu", $('input[name="tahsilatDuzenleFaturaDurumu"]:checked').val());
    formData.append("dosyaTuru", $('#tahsilatDuzenleDosyaTuru').val());
    formData.append("dosyaYolu", $('#tahsilatDuzenleDosyaYolu').val());
    
    // Buton durumunu değiştir
    $('#tahsilatDuzenleKaydetButtonGonder').addClass('d-none');
    $('#tahsilatDuzenleKaydetButtonBekle').removeClass('d-none');
    $('#tahsilatDuzenleKaydetButton').prop('disabled', true);
    
    makeAjax(formData).then((data) => {
        if (data.status === 1) {
            Toast.fire({
                icon: 'success',
                title: 'Tahsilat kartı başarıyla güncellendi!'
            });
            $('#modal-tahsilat-Duzenle').modal('hide');
            // Tahsilat listesini yenile
            if (typeof tahsilatListele === 'function') {
                tahsilatListele();
            }
        } else {
            Toast.fire({
                icon: 'error',
                title: 'Hata: ' + (data.message || 'Tahsilat kartı güncellenemedi!')
            });
        }
    }).catch((error) => {
        console.error("Tahsilat düzenleme hatası:", error);
        Toast.fire({
            icon: 'error',
            title: 'Tahsilat kartı güncellenemedi!'
        });
    }).finally(() => {
        // Buton durumunu eski haline getir
        $('#tahsilatDuzenleKaydetButtonGonder').removeClass('d-none');
        $('#tahsilatDuzenleKaydetButtonBekle').addClass('d-none');
        $('#tahsilatDuzenleKaydetButton').prop('disabled', false);
    });
}

//#endregion

//#region Mail Ayarları
function startMailSettings(){
    ToastCenterWhiteButton.close()
    $('#modal-Mail-Ekle').modal('show')
}
function mailTestEt(){
    $('[aria-name="smtpDebug"]').html("");
    $('[aria-name="modal-Mail-Ekle-overlay"]').toggleClass("d-none",false);
    $('[aria-name="MailEkleEkleTestEtButtonGonder"]').toggleClass("d-none",true);
    $('[aria-name="MailEkleEkleTestEtButtonBekle"]').toggleClass("d-none",false);
    let mailAyar={sunucu:"",guvenlik:"",port:"",email:"",kullanici:"",sifre:"",SelfSigned:"true",peer:"false"};
    mailAyar.sunucu=$("#MailEkleSunucu").val();
    mailAyar.guvenlik=$("#MailEkleGuvenlik option:selected").val();
    //mailAyar.guvenlik=$("#MailEkleGuvenlik").val(); 
    mailAyar.port=$("#MailEklePort").val();
    mailAyar.email=$("#MailEkleEposta").val();
    mailAyar.kullanici=$("#MailEkleKullanici").val();
    mailAyar.sifre=$("#MailEkleSifre").val();
    mailAyar.SelfSigned=$('input[name=MailEkleSelfSigned]:checked').val()
    mailAyar.peer=$('input[name=MailEkleVerifyPeer]:checked').val()
    //var conceptVal = $("#aioConceptName option:selected").val()
    $('#MailEkleSunucu').toggleClass("border-danger",false);
    $('#MailEklePort').toggleClass("border-danger",false);
    $('#MailEkleKullanici').toggleClass("border-danger",false);
    $('#MailEkleSifre').toggleClass("border-danger",false);
    if(mailAyar.sunucu==null || mailAyar.sunucu==""){
        $('#MailEkleSunucu').toggleClass("border-danger",true);
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik Alan",
            text:"Sunucu alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        $('[aria-name="modal-Mail-Ekle-overlay"]').toggleClass("d-none",true);
        return
    }
    if(mailAyar.port==null || mailAyar.port==""){
        $('#MailEklePort').toggleClass("border-danger",true);
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik Alan",
            text:"Port alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        $('[aria-name="modal-Mail-Ekle-overlay"]').toggleClass("d-none",true);
        return
    }
    if(mailAyar.email==null || mailAyar.email==""){
        $('#MailEkleEposta').toggleClass("border-danger",true);
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik Alan",
            text:"Eposta alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        $('[aria-name="modal-Mail-Ekle-overlay"]').toggleClass("d-none",true);
        return
    }
    if(mailAyar.kullanici==null || mailAyar.kullanici==""){
        $('#MailEkleKullanici').toggleClass("border-danger",true);
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik Alan",
            text:"Kullanıcı alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        $('[aria-name="modal-Mail-Ekle-overlay"]').toggleClass("d-none",true);
        return
    }
    if(mailAyar.sifre==null || mailAyar.sifre==""){
        $('#MailEkleSifre').toggleClass("border-danger",true);
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik Alan",
            text:"Şifre alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        $('[aria-name="modal-Mail-Ekle-overlay"]').toggleClass("d-none",true);
        return
    }
    formData = new FormData();
    formData.append("testEposta","1");
    let ser = JSON.stringify(mailAyar)
    formData.append("mailAyar",ser);
    makeAjax(formData).then((data) => { 
        $('[aria-name="modal-Mail-Ekle-overlay"]').toggleClass("d-none",true);
        console.log(data)
        if(data.status==-1){
            $('[aria-name="MailEkleEkleTestEtButtonGonder"]').toggleClass("d-none",false);
            $('[aria-name="MailEkleEkleTestEtButtonBekle"]').toggleClass("d-none",true);
            
            let htmlData = data.data.replace(/\r\n/g, "<br>");
            $('[aria-name="smtpDebug"]').html(htmlData);
            Toast.fire({
                icon: "error",
                html:data.message
            })
        }
        if(data.status==1){
            $('[aria-name="MailEkleTestEtButton"]').toggleClass("d-none",true);
            $('[aria-clear="MailEkle"]').val("");
            Toast.fire({
                icon: "success",
                html:data.message
            })
          
            //$('#sifreCollapse').collapse('hide');
        }
    })
}
function mailGonder(){
    debuging("mailGonder:","*")
    $('#mailGonder').attr('disabled','disabled');
    $('#mailGonder').html('<i class="fa-solid fa-square-envelope pr-2"></i>Gönderiliyor...');
	let filter = $('input[name=raporCikti]:checked').val()
	let sablon = $('input[name=sablonCikti]:checked').val()
    let musteriNoMail = $('[aria-name="musteriNoMail"]').val()
    var formData = new FormData();
	formData.append("teklifMailGonder",uuid);
	formData.append("filtre",filter);
	formData.append("sablon",sablon);
    if(musteriNoMail!=undefined && musteriNoMail!="" && musteriNoMail !=null && musteriNoMail!="undefined"){
	    formData.append("musteriNoMail",musteriNoMail);
    }
    makeAjax(formData).then((data) => {
		//let path ="../../assets/teklifler/"+sirketID;
		//let dosyaAdi = data.dosyaAdi
		//teklifIndir(path,dosyaAdi)
        if(data.status == -1){
            let mailEkle =`
            <div class="input-group mb-2"  data-toggle="tooltip" data-placement="top" title="Lütfen teklifin gönderildiği E-posta adresinizi giriniz">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        @
                    </div>
                </div>
                <input type="mail" class="form-control"  aria-name="musteriNoMail">
            </div>
                <div class="input-group-btn">
                        <button class="btn btn-default btn-block" type="button" aria-name="musteriNoMailGonder">
                            <i class="fa-solid fa-share text-success ml-2"></i> Gönder
                        </button>
                    </div>`



            ToastCenterWhiteButton.fire({
                icon: "error",
                titleText: data.header,
                html:data.message+mailEkle,
                width: '800px'
            })
        }
        if(data.status == 1){
            Toast.fire({
                icon: "success",
                titleText: "Başarılı",
                text:"Teklifiniz başarıyla gönderlidi",
                confirmButtonText: 'Tamam'
            })
            ToastCenterWhiteButton.close();
        }
        $('#mailGonder').removeAttr('disabled');
		debuging("mailGonder Resp:",data)
        $('#mailGonder').html('<i class="fa-solid fa-square-envelope pr-2"></i>E-posta Gönder');
    })
}
//#endregion

//#region BANKA HESAPLARI RAPORU
let bankaHesaplariRaporuAllData = []; // Tüm veri
let bankaHesaplariRaporuFilteredData = []; // Filtrelenmiş veri

function bankaHesaplariRaporuLoad() {
    // Tarih aralığı picker'ını başlat
    initTarihAraligiPicker();
    
    var formData = new FormData();
    formData.append("bankaHesaplariRaporuListele", "1");
    
    makeAjax(formData).then((data) => {
        console.log("Banka hesapları raporu verisi:", data);
        
        // Tüm veriyi sakla
        bankaHesaplariRaporuAllData = data.data || [];
        
        bankaHesaplariRaporuFilteredData = [...bankaHesaplariRaporuAllData];
        
        console.log("Yüklenen veri sayısı:", bankaHesaplariRaporuAllData.length);
        if (bankaHesaplariRaporuAllData.length > 0) {
            console.log("İlk veri örneği:", bankaHesaplariRaporuAllData[0]);
        }
        
        // İlk yüklemede tüm veriyi göster
        bankaHesaplariRaporuUpdateTable();
        bankaHesaplariRaporuUpdateSummaryCards();
        
        // Chart'ları oluştur
      //  window.currentChartType = 'gunluk';
       // bankaHesaplariRaporuChartOlustur();
      //  bankaHesaplariRaporuChartEventHandlers();
        
        // İşlem türü dağılımı chart'ını oluştur
       // bankaHesaplariRaporuIslemTuruChartOlustur();
        
        // Tahsilat/Masraf chart'ını oluştur
       // window.currentTahsilatMasrafChartType = 'gunluk';
       // bankaHesaplariRaporuTahsilatMasrafChartOlustur();
       // bankaHesaplariRaporuTahsilatMasrafChartEventHandlers();
    });
    
    // Kasa listesini yükle
    var kasaFormData = new FormData();
    kasaFormData.append("OdemeEkleKasaAra", "0");
    
    makeAjax(kasaFormData).then((data) => {
        if (data && data.result && data.result.length > 0) {
            var kasaListesi = data.result;
            
            // Kasa seçim dropdown'ını temizle ve yeniden doldur
            $('#kasaSecimi').empty();
            $('#kasaSecimi').append('<option value="">Tüm Kasalar</option>');
            
            kasaListesi.forEach(function(kasa) {
                $('#kasaSecimi').append('<option value="' + kasa.id + '">' + kasa.text + '</option>');
            });
        }
    }).catch((error) => {
        console.error("Kasa listesi yükleme hatası:", error);
    });

    // İş listesini yükle
    var isFormData = new FormData();
    isFormData.append("masrafEkleIsListe", "1");
    
    makeAjax(isFormData).then((data) => {
        if (data && data.result && data.result.length > 0) {
            var isListesi = data.result;
            
            // İş seçim dropdown'ını temizle ve yeniden doldur
            $('#isSecimi').empty();
            $('#isSecimi').append('<option value="">Tüm İşler</option>');
            
            isListesi.forEach(function(is) {
                $('#isSecimi').append('<option value="' + is.id + '">' + is.text + '</option>');
            });
        }
    }).catch((error) => {
        console.error("İş listesi yükleme hatası:", error);
    });

    // Kasa işlemleri verisini yükle
    kasaIslemleriListele();
}

// Kasa işlemleri listeleme fonksiyonu
function kasaIslemleriListele() {
    console.log("Kasa işlemleri listeleniyor...");
    
    var formData = new FormData();
    formData.append("kasaIslemleriListele", "1");
    
    // Tüm filtreleme parametrelerini backend'e gönder
    var tarihBaslangic = $("#tarihBaslangic").val();
    var tarihBitis = $("#tarihBitis").val();
    var kasaSecimi = $("#kasaSecimi").val();
    var islemTuru = $("#islemTuru").val();
    var odendiDurumu = $("#odendiDurumu").val();
    var vadeDurumu = $("#vadeDurumu").val();
    var isSecimi = $("#isSecimi").val();
    var gruplama = $("#gruplama").val();
    
    // Tarih aralığı filtresi
    if (tarihBaslangic) {
        formData.append("tarihBaslangic", tarihBaslangic);
        console.log("Başlangıç tarihi:", tarihBaslangic);
    }
    if (tarihBitis) {
        formData.append("tarihBitis", tarihBitis);
        console.log("Bitiş tarihi:", tarihBitis);
    }
    
    // Kasa seçimi filtresi
    if (kasaSecimi) {
        formData.append("kasaID", kasaSecimi);
        console.log("Kasa filtresi uygulanıyor:", kasaSecimi);
    }
    
    // İşlem türü filtresi
    if (islemTuru) {
        formData.append("islemTuru", islemTuru);
        console.log("İşlem türü filtresi:", islemTuru);
    }
    
    // Ödendi durumu filtresi
    if (odendiDurumu) {
        formData.append("odendiDurumu", odendiDurumu);
        console.log("Ödendi durumu filtresi:", odendiDurumu);
    }
    
    // Vade durumu filtresi
    if (vadeDurumu) {
        formData.append("vadeDurumu", vadeDurumu);
        console.log("Vade durumu filtresi:", vadeDurumu);
    }
    
    // İş seçimi filtresi
    if (isSecimi) {
        formData.append("isID", isSecimi);
        console.log("İş seçimi filtresi:", isSecimi);
    }
    
    // Gruplama
    if (gruplama) {
        formData.append("gruplama", gruplama);
        console.log("Gruplama:", gruplama);
    }
    
    // Tabloyu temizle
    if (bankaHesaplariRaporuTable) {
        bankaHesaplariRaporuTable.clear().draw();
    }
    
    makeAjax(formData).then((data) => {
        console.log("Kasa işlemleri verisi:", data);
        console.log("Response status:", data.status);
        console.log("Response message:", data.message);
        console.log("Data length:", data.data ? data.data.length : "data yok");
        
        
        if (data.status === 1 && data.data) {
            // Veriyi tabloya ekle
            if (bankaHesaplariRaporuTable) {
                bankaHesaplariRaporuTable.rows.add(data.data).draw();
            }
            
            // Tüm veriyi sakla (chart'lar için)
            bankaHesaplariRaporuAllData = data.data;
            bankaHesaplariRaporuFilteredData = [...data.data];
            
            
            // Özet kartlarını güncelle
            if (data.ozet) {
                bankaHesaplariRaporuUpdateSummaryCards(data.ozet);
            } else {
                bankaHesaplariRaporuUpdateSummaryCards();
            }
            
            // Chart'ları güncelle
            if (window.kasaBakiyeChart) {
                bankaHesaplariRaporuChartOlustur();
            }
            if (window.islemTuruChart) {
                bankaHesaplariRaporuIslemTuruChartOlustur();
            }
            if (window.tahsilatMasrafChart) {
                bankaHesaplariRaporuTahsilatMasrafChartOlustur();
            }
            
            console.log("Kasa işlemleri yüklendi. Veri sayısı:", data.data.length);
        } else {
            console.log("Kasa işlemleri verisi bulunamadı:", data.message);
            Toast.fire({
                icon: 'warning',
                title: 'Kasa işlemleri verisi bulunamadı!'
            });
        }
    }).catch((error) => {
        console.error("Kasa işlemleri yükleme hatası:", error);
        Toast.fire({
            icon: 'error',
            title: 'Kasa işlemleri yüklenirken hata oluştu!'
        });
    });
}

// Özet kartlarını güncelleme fonksiyonu
function bankaHesaplariRaporuUpdateSummaryCards(ozetData = null) {
    console.log("Özet kartları güncelleniyor...");
    
    if (ozetData) {
        // Backend'den gelen özet verisini kullan
        $("#toplamGiris").text(ozetData.toplamGiris || "₺0");
        $("#toplamCikis").text(ozetData.toplamCikis || "₺0");
        $("#netBakiye").text(ozetData.netBakiye || "₺0");
        $("#islemSayisi").text(ozetData.islemSayisi || "0");
        console.log("Özet kartları backend verisi ile güncellendi:", ozetData);
    } else {
        // Mevcut veriden hesapla
        let toplamGiris = 0;
        let toplamCikis = 0;
        let islemSayisi = 0;
        
        if (bankaHesaplariRaporuFilteredData && bankaHesaplariRaporuFilteredData.length > 0) {
            bankaHesaplariRaporuFilteredData.forEach(function(item) {
                // Tutarı sayısal değere çevir
                let tutar = 0;
                if (item.tutar && typeof item.tutar === 'string') {
                    let tutarStr = item.tutar.replace(/[₺,]/g, '').replace('.', ',');
                    tutar = parseFloat(tutarStr.replace(',', '.'));
                } else if (typeof item.tutar === 'number') {
                    tutar = item.tutar;
                }
                
                if (item.islemTuru === 'TAHSILAT') {
                    toplamGiris += tutar;
                } else if (item.islemTuru === 'MASRAF') {
                    toplamCikis += tutar;
                }
                islemSayisi++;
            });
        }
        
        let netBakiye = toplamGiris - toplamCikis;
        
        // Formatla ve göster
        $("#toplamGiris").text(formatPara(toplamGiris));
        $("#toplamCikis").text(formatPara(toplamCikis));
        $("#netBakiye").text(formatPara(netBakiye));
        $("#islemSayisi").text(islemSayisi);
        
        console.log("Özet kartları hesaplandı - Giriş:", toplamGiris, "Çıkış:", toplamCikis, "Net:", netBakiye, "İşlem:", islemSayisi);
    }
}

// Para formatı fonksiyonu
function formatPara(tutar) {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2
    }).format(tutar);
}


// Tabloyu güncelleyen fonksiyon
function bankaHesaplariRaporuUpdateTable() {
    bankaHesaplariRaporuTable.clear().draw();
    bankaHesaplariRaporuFilteredData.forEach(item => {
        // İşlem türüne göre tutar formatını ayarla
        let tutarHtml = '';
        if (item.islemTuru === 'TAHSILAT') {
            tutarHtml = '<span class="text-success">+ ' + item.tutar + '</span>';
        } else if (item.islemTuru === 'MASRAF') {
            tutarHtml = '<span class="text-danger">- ' + item.tutar + '</span>';
        } else {
            tutarHtml = '<span class="text-muted">' + item.tutar + '</span>';
        }
        
        // Vade durumu hesapla
        let vadeDurumu = '-';
        if (item.vadeTarihi) {
            const bugun = new Date();
            const vadeTarihi = new Date(item.vadeTarihi);
            if (vadeTarihi < bugun) {
                vadeDurumu = '<span class="text-danger">Vadesi Gelmiş</span>';
            } else {
                vadeDurumu = '<span class="text-success">Vadesi Gelmemiş</span>';
            }
        }
        
        bankaHesaplariRaporuTable.row.add([
            item.kasaAdi,
            item.islemTuru,
            vadeDurumu,
            item.isAdi || '-',
            item.masrafAdi || '-',
            tutarHtml,
            item.aciklama
        ]).draw();
    });
}

// Özet kartlarını güncelleyen fonksiyon
function bankaHesaplariRaporuUpdateSummaryCards() {
    let toplamGiris = 0;
    let toplamCikis = 0;
    let netBakiye = 0;
    let islemSayisi = bankaHesaplariRaporuFilteredData.length;
    
    bankaHesaplariRaporuFilteredData.forEach(item => {
        let tutar = parseFloat(item.tutar.replace(/[^\d.-]/g, '')) || 0;
        
        if (item.islemTuru === 'TAHSILAT') {
            toplamGiris += tutar;
        } else if (item.islemTuru === 'MASRAF') {
            toplamCikis += tutar;
        }
        // VIRMAN işlemleri nötr olduğu için hesaplamaya dahil edilmiyor
    });
    
    netBakiye = toplamGiris - toplamCikis;
    
    $('#toplamGiris').text('₺' + toplamGiris.toLocaleString('tr-TR', {minimumFractionDigits: 2}));
    $('#toplamCikis').text('₺' + toplamCikis.toLocaleString('tr-TR', {minimumFractionDigits: 2}));
    $('#netBakiye').text('₺' + netBakiye.toLocaleString('tr-TR', {minimumFractionDigits: 2}));
    $('#islemSayisi').text(islemSayisi);
    
    // Chart'ları güncelle
    bankaHesaplariRaporuUpdateCharts();
}

// Chart'ları güncelleyen fonksiyon
function bankaHesaplariRaporuUpdateCharts() {
    // Giriş-Çıkış Trendi Chart'ı
    bankaHesaplariRaporuUpdateTrendChart();
    
    // İşlem Türü Dağılımı Chart'ı
    bankaHesaplariRaporuUpdateIslemTuruChart();
}

// Giriş-Çıkış Trendi Chart'ı
function bankaHesaplariRaporuUpdateTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;
    
    // Mevcut chart'ı yok et
    if (window.trendChartInstance) {
        window.trendChartInstance.destroy();
    }
    
    // Tarih bazlı veri gruplama
    const tarihGruplari = {};
    bankaHesaplariRaporuFilteredData.forEach(item => {
        const tarih = item.tarih || new Date().toISOString().split('T')[0];
        if (!tarihGruplari[tarih]) {
            tarihGruplari[tarih] = { giris: 0, cikis: 0 };
        }
        
        const tutar = parseFloat(item.tutar.replace(/[^\d.-]/g, '')) || 0;
        if (item.islemTuru === 'TAHSILAT') {
            tarihGruplari[tarih].giris += tutar;
        } else if (item.islemTuru === 'MASRAF') {
            tarihGruplari[tarih].cikis += tutar;
        }
    });
    
    // Tarihleri sırala
    const sortedTarihler = Object.keys(tarihGruplari).sort();
    const girisVerileri = sortedTarihler.map(tarih => tarihGruplari[tarih].giris);
    const cikisVerileri = sortedTarihler.map(tarih => tarihGruplari[tarih].cikis);
    
    window.trendChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sortedTarihler,
            datasets: [{
                label: 'Giriş',
                data: girisVerileri,
                borderColor: 'rgb(40, 167, 69)',
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                tension: 0.1
            }, {
                label: 'Çıkış',
                data: cikisVerileri,
                borderColor: 'rgb(220, 53, 69)',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Giriş-Çıkış Trendi'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₺' + value.toLocaleString('tr-TR');
                        }
                    }
                }
            }
        }
    });
}

// İşlem Türü Dağılımı Chart'ı
function bankaHesaplariRaporuUpdateIslemTuruChart() {
    const ctx = document.getElementById('islemTuruChart');
    if (!ctx) return;
    
    // Mevcut chart'ı yok et
    if (window.islemTuruChartInstance) {
        window.islemTuruChartInstance.destroy();
    }
    
    // Temel işlem türlerini say
    let tahsilatSayisi = 0;
    let masrafSayisi = 0;
    let virmanSayisi = 0;
    let digerSayisi = 0;
    
    bankaHesaplariRaporuFilteredData.forEach(item => {
        const islemTuru = (item.tabloTur || item.islemTuru || '').toLowerCase();
        
        switch(islemTuru) {
            case 'tahsilat':
                tahsilatSayisi++;
                break;
            case 'masraf':
                masrafSayisi++;
                break;
            case 'virman':
                virmanSayisi++;
                break;
            default:
                if (islemTuru) {
                    digerSayisi++;
                }
                break;
        }
    });
    
    // Sadece mevcut olan işlem türlerini chart'a ekle
    const labels = [];
    const data = [];
    const colors = [];
    
    if (tahsilatSayisi > 0) {
        labels.push(`Tahsilat (${tahsilatSayisi})`);
        data.push(tahsilatSayisi);
        colors.push('#28a745'); // Yeşil
    }
    
    if (masrafSayisi > 0) {
        labels.push(`Masraf (${masrafSayisi})`);
        data.push(masrafSayisi);
        colors.push('#dc3545'); // Kırmızı
    }
    
    if (virmanSayisi > 0) {
        labels.push(`Virman (${virmanSayisi})`);
        data.push(virmanSayisi);
        colors.push('#ffc107'); // Sarı
    }
    
    if (digerSayisi > 0) {
        labels.push(`Diğer (${digerSayisi})`);
        data.push(digerSayisi);
        colors.push('#6c757d'); // Gri
    }
    
    // Eğer hiç veri yoksa boş chart göster
    if (labels.length === 0) {
        window.islemTuruChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Veri Yok'],
                datasets: [{
                    data: [1],
                    backgroundColor: ['#e9ecef'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'İşlem Türü Dağılımı'
                    },
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                }
            }
        });
        return;
    }
    
    window.islemTuruChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'İşlem Türü Dağılımı',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} işlem (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Backend filtreleme fonksiyonu
function bankaHesaplariRaporuFiltrele() {
    console.log("Banka hesapları raporu filtreleme başlatıldı - Backend'e request gönderiliyor");
    
    const kasaSecimi = $("#kasaSecimi").val();
    const tarihBaslangic = $("#tarihBaslangic").val();
    const tarihBitis = $("#tarihBitis").val();
    const islemTuru = $("#islemTuru").val();
    const vadeDurumu = $("#vadeDurumu").val();
    const odendiDurumu = $("#odendiDurumu").val();
    const isSecimi = $("#isSecimi").val();
    const gruplama = $("#gruplama").val();
    
    console.log("Filtre değerleri - Kasa:", kasaSecimi, "Tarih Başlangıç:", tarihBaslangic, "Tarih Bitiş:", tarihBitis, "İşlem:", islemTuru, "Vade:", vadeDurumu, "Ödendi:", odendiDurumu, "İş:", isSecimi, "Gruplama:", gruplama);
    
    // Backend'e filtreleme parametreleri ile request gönder
    kasaIslemleriListele();
}

function bankaHesaplariRaporuTemizle() {
    console.log("Banka hesapları raporu filtreleri temizleniyor...");
    
    // Form alanlarını temizle
    $('#kasaSecimi').val('');
    $('#tarihAraligi').val('');
    $('#islemTuru').val('');
    $('#vadeDurumu').val('');
    $('#odendiDurumu').val('');
    $('#isSecimi').val('');
    $('#tarihBaslangic').val('');
    $('#tarihBitis').val('');
    
    // DataTable filtrelerini temizle
    if (bankaHesaplariRaporuTable) {
        bankaHesaplariRaporuTable.search('').columns().search('').draw();
        console.log("Filtreler temizlendi");
    }
    
    // Kasa işlemleri verisini yeniden yükle
    kasaIslemleriListele();
}

//#endregion

function bankaHesaplariRaporuTemizle() {
    console.log("Banka hesapları raporu filtreleri temizleniyor...");
    
    // Form alanlarını temizle
    $('#kasaSecimi').val('');
    $('#tarihAraligi').val('');
    $('#islemTuru').val('');
    $('#vadeDurumu').val('');
    $('#odendiDurumu').val('');
    $('#isSecimi').val('');
    $('#tarihBaslangic').val('');
    $('#tarihBitis').val('');
    
    // DataTable filtrelerini temizle
    if (bankaHesaplariRaporuTable) {
        bankaHesaplariRaporuTable.search('').columns().search('').draw();
        console.log("Filtreler temizlendi");
    }
    
    // Kasa işlemleri verisini yeniden yükle
    kasaIslemleriListele();
}

//#endregion

//#region TAHŞİLAT RAPORU
function tahsilatRaporuLoad() {
    console.log("tahsilatRaporuLoad çağrıldı - Tüm veri yüklenecek");
    
    // DataTable'ı başlat
    console.log("DataTable başlatılıyor...");
    
    // DataTable zaten varsa yok et
    if ($.fn.DataTable.isDataTable('#tahsilatRaporTablosu')) {
        console.log("Mevcut DataTable yok ediliyor...");
        $('#tahsilatRaporTablosu').DataTable().destroy();
    }
    
    initTahsilatRaporuTable();
    console.log("DataTable başlatıldı");
    
    // Backend API'yi çağır - TÜM VERİYİ ÇEK
    var formData = new FormData();
    formData.append("tahsilatRaporuListele", "1");
    // Filtreleme parametreleri gönderme, tüm veriyi çek
    
    makeAjax(formData).then((data) => {
        console.log("Tahsilat raporu API yanıtı:", data);
        
        // DataTable'ı yeniden boyutlandır
        setTimeout(function() {
            if(tahsilatRaporuTable) {
                tahsilatRaporuTable.columns.adjust().draw();
            }
        }, 100);
        
        // Verileri DataTable'a yükle
        tahsilatRaporuTable.clear();
        if(data.data && data.data.length > 0) {
            data.data.forEach(item => {
                tahsilatRaporuTable.row.add(item);
            });
        }
        tahsilatRaporuTable.draw();
        
        // Özet kartlarını güncelle
        updateTahsilatOzetKartlari(data.data || []);
        
        // Grafikleri güncelle
        updateTahsilatDurumChart(data.data || []);
        updateTahsilatTrendChart(data.data || []);
        
    }).catch((error) => {
        console.error("Tahsilat raporu yükleme hatası:", error);
        console.log("Backend API henüz hazır değil, boş tablo gösteriliyor");
        
        // Hata durumunda boş tablo göster
        tahsilatRaporuTable.clear();
        tahsilatRaporuTable.draw();
        
        // Boş verilerle özet kartları güncelle
        updateTahsilatOzetKartlari([]);
        updateTahsilatDurumChart([]);
        updateTahsilatTrendChart([]);
    });
}

async function tahsilatRaporuFirmaListesiYukle() {
    console.log("tahsilatRaporuFirmaListesiYukle çağrıldı");
    
    var firmaSelect = $('#firmaAdi');
    firmaSelect.empty();
    firmaSelect.append('<option value="">Tüm Firmalar</option>');
    
    try {
        // Önce özel API'yi dene
        var formData = new FormData();
        formData.append("tahsilatRaporuFirmaListesi", "1");
        
        const data = await makeAjax(formData);
        console.log("Tahsilat raporu firma listesi API yanıtı:", data);
        
        if(data.data && data.data.length > 0) {
            console.log("Firma sayısı:", data.data.length);
            data.data.forEach(function(firma) {
                console.log("Firma ekleniyor:", firma.acentaAdi);
                firmaSelect.append('<option value="' + firma.acentaAdi + '">' + firma.acentaAdi + '</option>');
            });
            
            // Select2'yi başlat
            firmaSelect.select2({
                theme: "bootstrap4",
                placeholder: "Firma seçiniz...",
                allowClear: true
            });
            return;
        }
    } catch (error) {
        console.log("Özel firma API'si hazır değil, acenta listesi kullanılıyor");
    }
    
    try {
        // Fallback: Acenta listesini kullan
        await acentaListele();
        console.log("Acenta listesi yüklendi, dropdown'a aktarılıyor...");
        
        if(acentaListesi && acentaListesi.length > 0) {
            console.log("Acenta sayısı:", acentaListesi.length);
            acentaListesi.forEach(function(acenta) {
                console.log("Firma ekleniyor:", acenta.text);
                firmaSelect.append('<option value="' + acenta.id + '">' + acenta.text + '</option>');
            });
            
            // Select2'yi başlat
            firmaSelect.select2({
                theme: "bootstrap4",
                placeholder: "Firma seçiniz...",
                allowClear: true
            });
        } else {
            console.log("acentaListesi boş");
        }
    } catch (fallbackError) {
        console.error("Firma listesi yüklenirken hata:", fallbackError);
        // Hata durumunda en azından "Tüm Firmalar" seçeneği kalsın
        firmaSelect.empty();
        firmaSelect.append('<option value="">Tüm Firmalar</option>');
    }
}

function tahsilatRaporuFiltrele() {
    console.log("tahsilatRaporuFiltrele çağrıldı - Frontend filtreleme");
    
    var tarihBaslangic = $("#tarihBaslangic").val();
    var tarihBitis = $("#tarihBitis").val();
    var firmaAdi = $("#firmaAdi").val();
    var durum = $("#durum").val();
    
    console.log("Tarih başlangıç:", tarihBaslangic);
    console.log("Tarih bitiş:", tarihBitis);
    console.log("Firma adı:", firmaAdi);
    console.log("Durum:", durum);
    
    // DataTable'da filtreleme yap
    if (tahsilatRaporuTable) {
        // Tüm filtreleri temizle
        tahsilatRaporuTable.search('').columns().search('').draw();
        
        // Tarih aralığı filtresi (Tahsilat Tarihi - kolon 2)
        if (tarihBaslangic && tarihBitis) {
            tahsilatRaporuTable.column(2).search(function(value, data, index, meta) {
                var tarih = new Date(value);
                var baslangic = new Date(tarihBaslangic);
                var bitis = new Date(tarihBitis);
                return tarih >= baslangic && tarih <= bitis;
            });
        }
        
        // Firma adı filtresi (Firma Adı - kolon 3)
        if (firmaAdi) {
            tahsilatRaporuTable.column(3).search(firmaAdi, false, false);
        }
        
        // Durum filtresi (Durum - kolon 8)
        if (durum) {
            var durumText = durum === 'yapilmis' ? 'Yapılmış' : 'Yapılmamış';
            tahsilatRaporuTable.column(8).search(durumText, false, false);
        }
        
        // Filtrelemeyi uygula
        tahsilatRaporuTable.draw();
        
        // Filtrelenmiş veriyi al ve özet kartlarını güncelle
        var filteredData = tahsilatRaporuTable.rows({search: 'applied'}).data().toArray();
        updateTahsilatOzetKartlari(filteredData);
        
        console.log("Filtreleme uygulandı. Filtrelenmiş kayıt sayısı:", filteredData.length);
    }
}

function tahsilatRaporuTemizle() {
    console.log("Tahsilat raporu filtreleri temizleniyor...");
    
    // Form alanlarını temizle
    $('#tarihAraligi').val('');
    $('#tarihBaslangic').val('');
    $('#tarihBitis').val('');
    $('#firmaAdi').val('').trigger('change');
    $('#durum').val('');
    
    // DataTable filtrelerini temizle
    if (tahsilatRaporuTable) {
        tahsilatRaporuTable.search('').columns().search('').draw();
        
        // Tüm veriyi al ve özet kartlarını güncelle
        var allData = tahsilatRaporuTable.data().toArray();
        updateTahsilatOzetKartlari(allData);
        
        console.log("Filtreler temizlendi. Toplam kayıt sayısı:", allData.length);
    }
}

function updateTahsilatOzetKartlari(veriler) {
    var toplamTahsilat = veriler.reduce((sum, item) => sum + parseFloat(item.tutar), 0);
    var yapilmisTahsilat = veriler.filter(item => item.durum === 'yapilmis').reduce((sum, item) => sum + parseFloat(item.tutar), 0);
    var yapilmamisTahsilat = veriler.filter(item => item.durum === 'yapilmamis').reduce((sum, item) => sum + parseFloat(item.tutar), 0);
    var tahsilatOrani = toplamTahsilat > 0 ? ((yapilmisTahsilat / toplamTahsilat) * 100).toFixed(1) : 0;
    
    $('#toplamTahsilat').text(parseFloat(toplamTahsilat).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
    $('#yapilmisTahsilat').text(parseFloat(yapilmisTahsilat).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
    $('#yapilmamisTahsilat').text(parseFloat(yapilmamisTahsilat).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
    $('#tahsilatOrani').text('%' + tahsilatOrani);
}

function updateTahsilatDurumChart(veriler) {
    var yapilmis = veriler.filter(item => item.durum === 'yapilmis').length;
    var yapilmamis = veriler.filter(item => item.durum === 'yapilmamis').length;
    
    var ctx = document.getElementById('durumChart').getContext('2d');
    
    if(window.durumChart && typeof window.durumChart.destroy === 'function') {
        window.durumChart.destroy();
    }
    
    window.durumChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Yapılmış', 'Yapılmamış'],
            datasets: [{
                data: [yapilmis, yapilmamis],
                backgroundColor: ['#28a745', '#ffc107'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

function updateTahsilatTrendChart(veriler) {
    // Aylık gruplama
    var aylikVeriler = {};
    veriler.forEach(function(item) {
        var ay = item.tarih.substring(0, 7); // YYYY-MM formatında
        if(!aylikVeriler[ay]) {
            aylikVeriler[ay] = 0;
        }
        aylikVeriler[ay] += parseFloat(item.tutar);
    });
    
    var labels = Object.keys(aylikVeriler).sort();
    var data = labels.map(ay => aylikVeriler[ay]);
    
    var ctx = document.getElementById('trendChart').getContext('2d');
    
    if(window.trendChart && typeof window.trendChart.destroy === 'function') {
        window.trendChart.destroy();
    }
    
    window.trendChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Tahsilat (₺)',
                data: data,
                backgroundColor: '#007bff',
                borderColor: '#0056b3',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return parseFloat(value).toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'});
                        }
                    }
                }
            }
        }
    });
}

function tahsilatDetay(id) {
    Swal.fire({
        title: 'Tahsilat Detayı',
        text: 'Tahsilat ID: ' + id + ' detayları gösterilecek',
        icon: 'info',
        confirmButtonText: 'Tamam'
    });
}
//#endregion

//#region MASRAF RAPORU
function masrafRaporuLoad() {
    console.log("masrafRaporuLoad çağrıldı");
    
    // DataTable'ı başlat
    if(typeof masrafRaporuTable === 'undefined') {
        console.log("DataTable başlatılıyor...");
        
        if ( ! $.fn.DataTable.isDataTable( '#masrafRaporTablosu' ) ) {
            initMasrafRaporuTable();
            console.log("DataTable başlatıldı");
        }
        
        if(typeof masrafRaporuTable === 'undefined') {
            console.error("DataTable başlatılamadı!");
            return;
        }
    }
    
    // Önce dropdown'ları yükle
    masrafRaporuOdemeGruplariYukle();
    masrafRaporuOdemeAltGruplariYukle();
    masrafRaporuIsAdlariYukle();
    
    // Backend API'yi çağır
    var formData = new FormData();
    formData.append("masrafRaporuListele", "1");
    
    makeAjax(formData).then((data) => {
        console.log("Masraf raporu API yanıtı:", data);
        
        // DataTable'ı yeniden boyutlandır
        setTimeout(function() {
            if(masrafRaporuTable) {
                masrafRaporuTable.columns.adjust().draw();
            }
        }, 100);
        
        // Verileri DataTable'a yükle
        masrafRaporuTable.clear();
        if(data.data && data.data.length > 0) {
            data.data.forEach(item => {
                masrafRaporuTable.row.add(item);
            });
        }
        masrafRaporuTable.draw();
        
        // Özet kartlarını güncelle
        updateMasrafOzetKartlari(data.data || []);
        
    }).catch((error) => {
        console.error("Masraf raporu yükleme hatası:", error);
        console.log("Backend API henüz hazır değil, boş tablo gösteriliyor");
        
        // Hata durumunda boş tablo göster
        masrafRaporuTable.clear();
        masrafRaporuTable.draw();
        
        // Boş verilerle özet kartları güncelle
        updateMasrafOzetKartlari([]);
    });
}

function masrafRaporuFiltrele() {
    console.log("masrafRaporuFiltrele çağrıldı");
    
    var tarihBaslangic = $("#tarihBaslangic").val();
    var tarihBitis = $("#tarihBitis").val();
    var odemeGrubu = $("#odemeGrubu").val();
    var odemeAltGrubu = $("#odemeAltGrubu").val();
    var isAdi = $("#isAdi").val();
    
    console.log("Tarih başlangıç:", tarihBaslangic);
    console.log("Tarih bitiş:", tarihBitis);
    console.log("Ödeme grubu:", odemeGrubu);
    console.log("Ödeme alt grubu:", odemeAltGrubu);
    console.log("İş adı:", isAdi);
    
    var formData = new FormData();
    formData.append("masrafRaporuFiltrele", "1");
    formData.append("tarihBaslangic", tarihBaslangic);
    formData.append("tarihBitis", tarihBitis);
    formData.append("odemeGrubu", odemeGrubu);
    formData.append("odemeAltGrubu", odemeAltGrubu);
    formData.append("isAdi", isAdi);
    
    makeAjax(formData).then((data) => {
        console.log("Filtreleme API yanıtı:", data);
        
        // DataTable'ı yeniden boyutlandır
        setTimeout(function() {
            if(masrafRaporuTable) {
                masrafRaporuTable.columns.adjust().draw();
            }
        }, 100);
        
        // Verileri DataTable'a yükle
        masrafRaporuTable.clear();
        if(data.data && data.data.length > 0) {
            data.data.forEach(item => {
                masrafRaporuTable.row.add(item);
            });
        }
        masrafRaporuTable.draw();
        
        // Özet kartlarını güncelle
        updateMasrafOzetKartlari(data.data || []);
        
    }).catch((error) => {
        console.error("Masraf raporu filtreleme hatası:", error);
        console.log("Backend API henüz hazır değil, mevcut veriler korunuyor");
        
        // Hata durumunda mevcut verileri koru
        alert("Filtreleme API'si henüz hazır değil. Backend ekibi API'yi hazırladığında çalışacak.");
    });
}

function masrafRaporuTemizle() {
    $('#tarihAraligi').val('');
    $('#tarihBaslangic').val('');
    $('#tarihBitis').val('');
    $('#odemeGrubu').val('');
    $('#odemeAltGrubu').val('');
    $('#isAdi').val('');
    masrafRaporuLoad();
}

function updateMasrafOzetKartlari(veriler) {
    var toplamMasraf = veriler.reduce((sum, item) => sum + parseFloat(item.tutar), 0);
    var kategoriSayisi = [...new Set(veriler.map(item => item.kategori))].length;
    var ortalamaMasraf = veriler.length > 0 ? (toplamMasraf / veriler.length) : 0;
    
    // Özet kartlarını güncelle
    $('#toplamMasraf').text(toplamMasraf.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
    $('#kategoriSayisi').text(kategoriSayisi);
    $('#ortalamaMasraf').text(ortalamaMasraf.toLocaleString('tr-TR', {style: 'currency', currency: 'TRY'}));
}

function masrafDetay(id) {
    console.log("Masraf detayı gösteriliyor, ID:", id);
    Swal.fire({
        title: 'Masraf Detayı',
        text: 'Masraf ID: ' + id + ' detayları gösterilecek',
        icon: 'info',
        confirmButtonText: 'Tamam'
    });
}

function masrafRaporuOdemeGruplariYukle() {
    console.log("masrafRaporuOdemeGruplariYukle çağrıldı");
    
    // Önce özel API'yi dene, yoksa mevcut API'yi kullan
    var formData = new FormData();
    formData.append("masrafRaporuOdemeGruplari", "1");
    
    makeAjax(formData).then((data) => {
        console.log("Ödeme grupları API yanıtı:", data);
        
        var odemeGrubuSelect = $('#odemeGrubu');
        odemeGrubuSelect.empty();
        odemeGrubuSelect.append('<option value="">Tüm Gruplar</option>');
        
        if(data.status === 1 && data.data && data.data.length > 0) {
            console.log("Ödeme grubu sayısı:", data.data.length);
            data.data.forEach(function(grup) {
                console.log("Ödeme grubu ekleniyor:", grup.grup_adi);
                odemeGrubuSelect.append('<option value="' + grup.grup_adi + '">' + grup.grup_adi + '</option>');
            });
        } else {
            console.log("API henüz hazır değil veya veri boş, fallback kullanılıyor");
            
            // Fallback veriler
            odemeGrubuSelect.append('<option value="Ofis Giderleri">Ofis Giderleri</option>');
            odemeGrubuSelect.append('<option value="Seyahat Giderleri">Seyahat Giderleri</option>');
            odemeGrubuSelect.append('<option value="Eğitim Giderleri">Eğitim Giderleri</option>');
            odemeGrubuSelect.append('<option value="Pazarlama Giderleri">Pazarlama Giderleri</option>');
            odemeGrubuSelect.append('<option value="Teknik Giderler">Teknik Giderler</option>');
        }
        
    }).catch((error) => {
        console.log("Özel ödeme grupları API'si hazır değil, fallback kullanılıyor");
        
        // Fallback: Mevcut çalışan API'yi kullan (eğil varsa)
        var odemeGrubuSelect = $('#odemeGrubu');
        odemeGrubuSelect.empty();
        odemeGrubuSelect.append('<option value="">Tüm Gruplar</option>');
        odemeGrubuSelect.append('<option value="Ofis Giderleri">Ofis Giderleri</option>');
        odemeGrubuSelect.append('<option value="Seyahat Giderleri">Seyahat Giderleri</option>');
        odemeGrubuSelect.append('<option value="Eğitim Giderleri">Eğitim Giderleri</option>');
        odemeGrubuSelect.append('<option value="Pazarlama Giderleri">Pazarlama Giderleri</option>');
        odemeGrubuSelect.append('<option value="Teknik Giderler">Teknik Giderler</option>');
    });
}

function masrafRaporuOdemeAltGruplariYukle() {
    console.log("masrafRaporuOdemeAltGruplariYukle çağrıldı");
    
    // Önce özel API'yi dene, yoksa mevcut API'yi kullan
    var formData = new FormData();
    formData.append("masrafRaporuOdemeAltGruplari", "1");
    
    makeAjax(formData).then((data) => {
        console.log("Ödeme alt grupları API yanıtı:", data);
        
        var odemeAltGrubuSelect = $('#odemeAltGrubu');
        odemeAltGrubuSelect.empty();
        odemeAltGrubuSelect.append('<option value="">Tüm Alt Gruplar</option>');
        
        if(data.status === 1 && data.data && data.data.length > 0) {
            console.log("Ödeme alt grubu sayısı:", data.data.length);
            data.data.forEach(function(altGrup) {
                console.log("Ödeme alt grubu ekleniyor:", altGrup.alt_grup_adi);
                odemeAltGrubuSelect.append('<option value="' + altGrup.alt_grup_adi + '">' + altGrup.alt_grup_adi + '</option>');
            });
        } else {
            console.log("API henüz hazır değil veya veri boş, fallback kullanılıyor");
            
            // Fallback veriler
            odemeAltGrubuSelect.append('<option value="Kırtasiye">Kırtasiye</option>');
            odemeAltGrubuSelect.append('<option value="Temizlik">Temizlik</option>');
            odemeAltGrubuSelect.append('<option value="Yakıt">Yakıt</option>');
            odemeAltGrubuSelect.append('<option value="Ulaşım">Ulaşım</option>');
            odemeAltGrubuSelect.append('<option value="Yemek">Yemek</option>');
            odemeAltGrubuSelect.append('<option value="Konaklama">Konaklama</option>');
            odemeAltGrubuSelect.append('<option value="Telefon">Telefon</option>');
            odemeAltGrubuSelect.append('<option value="İnternet">İnternet</option>');
        }
        
    }).catch((error) => {
        console.log("Özel ödeme alt grupları API'si hazır değil, fallback kullanılıyor");
        
        // Fallback: Mevcut çalışan API'yi kullan (eğer varsa)
        var odemeAltGrubuSelect = $('#odemeAltGrubu');
        odemeAltGrubuSelect.empty();
        odemeAltGrubuSelect.append('<option value="">Tüm Alt Gruplar</option>');
        odemeAltGrubuSelect.append('<option value="Kırtasiye">Kırtasiye</option>');
        odemeAltGrubuSelect.append('<option value="Temizlik">Temizlik</option>');
        odemeAltGrubuSelect.append('<option value="Yakıt">Yakıt</option>');
        odemeAltGrubuSelect.append('<option value="Ulaşım">Ulaşım</option>');
        odemeAltGrubuSelect.append('<option value="Yemek">Yemek</option>');
        odemeAltGrubuSelect.append('<option value="Konaklama">Konaklama</option>');
        odemeAltGrubuSelect.append('<option value="Telefon">Telefon</option>');
        odemeAltGrubuSelect.append('<option value="İnternet">İnternet</option>');
    });
}

// Ödeme grubu değiştiğinde alt grupları güncelle
function masrafRaporuOdemeGrubuDegisti() {
    var secilenGrup = $('#odemeGrubu').val();
    console.log("Seçilen ödeme grubu:", secilenGrup);
    
    if(secilenGrup) {
        // Seçilen gruba göre alt grupları yükle
        var formData = new FormData();
        formData.append("masrafRaporuOdemeAltGruplariByGrup", "1");
        formData.append("odemeGrubu", secilenGrup);
        
        makeAjax(formData).then((data) => {
            console.log("Alt gruplar API yanıtı:", data);
            
            var odemeAltGrubuSelect = $('#odemeAltGrubu');
            odemeAltGrubuSelect.empty();
            odemeAltGrubuSelect.append('<option value="">Tüm Alt Gruplar</option>');
            
            if(data.status === 1 && data.data && data.data.length > 0) {
                data.data.forEach(function(altGrup) {
                    odemeAltGrubuSelect.append('<option value="' + altGrup.alt_grup_adi + '">' + altGrup.alt_grup_adi + '</option>');
                });
            } else {
                console.log("Grup bazlı alt gruplar API'si hazır değil, tüm alt gruplar gösteriliyor");
                // Fallback: Tüm alt grupları göster
                odemeAltGrubuSelect.append('<option value="Kırtasiye">Kırtasiye</option>');
                odemeAltGrubuSelect.append('<option value="Temizlik">Temizlik</option>');
                odemeAltGrubuSelect.append('<option value="Yakıt">Yakıt</option>');
                odemeAltGrubuSelect.append('<option value="Ulaşım">Ulaşım</option>');
                odemeAltGrubuSelect.append('<option value="Yemek">Yemek</option>');
                odemeAltGrubuSelect.append('<option value="Konaklama">Konaklama</option>');
                odemeAltGrubuSelect.append('<option value="Telefon">Telefon</option>');
                odemeAltGrubuSelect.append('<option value="İnternet">İnternet</option>');
            }
            
        }).catch((error) => {
            console.log("Alt gruplar API'si hazır değil");
            // Hata durumunda tüm alt grupları göster
            masrafRaporuOdemeAltGruplariYukle();
        });
    } else {
        // Grup seçilmediyse tüm alt grupları göster
        masrafRaporuOdemeAltGruplariYukle();
    }
}

function masrafRaporuIsAdlariYukle() {
    console.log("masrafRaporuIsAdlariYukle çağrıldı");
    
    // Önce özel API'yi dene, yoksa mevcut API'yi kullan
    var formData = new FormData();
    formData.append("masrafRaporuIsAdlari", "1");
    
    makeAjax(formData).then((data) => {
        console.log("İş adları API yanıtı:", data);
        
        var isAdiSelect = $('#isAdi');
        isAdiSelect.empty();
        isAdiSelect.append('<option value="">Tüm İşler</option>');
        
        if(data.status === 1 && data.data && data.data.length > 0) {
            console.log("İş adı sayısı:", data.data.length);
            data.data.forEach(function(is) {
                console.log("İş adı ekleniyor:", is.is_adi);
                isAdiSelect.append('<option value="' + is.is_adi + '">' + is.is_adi + '</option>');
            });
        } else {
            console.log("API henüz hazır değil veya veri boş, fallback kullanılıyor");
            
            // Fallback veriler
            isAdiSelect.append('<option value="Proje A">Proje A</option>');
            isAdiSelect.append('<option value="Proje B">Proje B</option>');
            isAdiSelect.append('<option value="Proje C">Proje C</option>');
            isAdiSelect.append('<option value="Genel Giderler">Genel Giderler</option>');
            isAdiSelect.append('<option value="Pazarlama">Pazarlama</option>');
            isAdiSelect.append('<option value="Satış">Satış</option>');
            isAdiSelect.append('<option value="Üretim">Üretim</option>');
            isAdiSelect.append('<option value="Ar-Ge">Ar-Ge</option>');
        }
        
    }).catch((error) => {
        console.log("Özel iş adları API'si hazır değil, fallback kullanılıyor");
        
        // Fallback: Mevcut çalışan API'yi kullan (eğer varsa)
        var isAdiSelect = $('#isAdi');
        isAdiSelect.empty();
        isAdiSelect.append('<option value="">Tüm İşler</option>');
        isAdiSelect.append('<option value="Proje A">Proje A</option>');
        isAdiSelect.append('<option value="Proje B">Proje B</option>');
        isAdiSelect.append('<option value="Proje C">Proje C</option>');
        isAdiSelect.append('<option value="Genel Giderler">Genel Giderler</option>');
        isAdiSelect.append('<option value="Pazarlama">Pazarlama</option>');
        isAdiSelect.append('<option value="Satış">Satış</option>');
        isAdiSelect.append('<option value="Üretim">Üretim</option>');
        isAdiSelect.append('<option value="Ar-Ge">Ar-Ge</option>');
    });
}

// Kasa bazında bakiye chart oluşturma
function bankaHesaplariRaporuChartOlustur() {
    console.log("Kasa bazında bakiye grafiği oluşturuluyor...");
    
    // Mevcut chart'ı yok et
    if (window.kasaBakiyeChart && typeof window.kasaBakiyeChart.destroy === 'function') {
        window.kasaBakiyeChart.destroy();
    }
    
    var ctx = document.getElementById('kasaBakiyeChart').getContext('2d');
    var chartType = window.currentChartType || 'gunluk';
    
    // Backend'den chart verisi çek
    bankaHesaplariRaporuChartVerisiCek(chartType).then(function(chartData) {
        window.kasaBakiyeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.labels,
                datasets: chartData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function(value) {
                                return '₺' + value.toLocaleString('tr-TR');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Kasa Bazında ' + (chartType === 'gunluk' ? 'Günlük (30 Gün)' : chartType === 'aylik' ? 'Aylık' : 'Yıllık') + ' Bakiye Grafiği'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₺' + context.parsed.y.toLocaleString('tr-TR');
                            }
                        }
                    }
                }
            }
        });
    }).catch(function(error) {
        console.error("Chart verisi yüklenirken hata:", error);
        // Hata durumunda boş chart göster
        window.kasaBakiyeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Veri Yok'],
                datasets: [{
                    label: 'Veri Bulunamadı',
                    data: [0],
                    borderColor: 'rgba(200, 200, 200, 0.8)',
                    backgroundColor: 'rgba(200, 200, 200, 0.1)',
                    tension: 0.1,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });
}

// Backend'den chart verisi çekme
function bankaHesaplariRaporuChartVerisiCek(chartType) {
    return new Promise(function(resolve, reject) {
        var formData = new FormData();
        formData.append("bankaHesaplariRaporuChartVerisi", "1");
        formData.append("chartType", chartType);
        
        // Filtreleme parametrelerini ekle
        var kasaSecimi = $("#kasaSecimi").val();
        var tarihBaslangic = $("#tarihBaslangic").val();
        var tarihBitis = $("#tarihBitis").val();
        
        if (kasaSecimi) {
            formData.append("kasaID", kasaSecimi);
        }
        if (tarihBaslangic) {
            formData.append("tarihBaslangic", tarihBaslangic);
        }
        if (tarihBitis) {
            formData.append("tarihBitis", tarihBitis);
        }
        
        makeAjax(formData).then(function(data) {
            console.log("Chart verisi:", data);
            
            if (data.status === 1 && data.data && data.data.length > 0) {
                var chartData = bankaHesaplariRaporuChartVerisiHazirla(data.data, chartType);
                resolve(chartData);
            } else {
                console.log("Backend'den veri gelmedi, test verisi kullanılıyor");
                var testData = bankaHesaplariRaporuTestVerisiOlustur(chartType);
                var chartData = bankaHesaplariRaporuChartVerisiHazirla(testData, chartType);
                resolve(chartData);
            }
        }).catch(function(error) {
            console.log("Backend hatası, test verisi kullanılıyor:", error);
            var testData = bankaHesaplariRaporuTestVerisiOlustur(chartType);
            var chartData = bankaHesaplariRaporuChartVerisiHazirla(testData, chartType);
            resolve(chartData);
        });
    });
}

// Test verisi oluşturma
function bankaHesaplariRaporuTestVerisiOlustur(chartType) {
    console.log("Test verisi oluşturuluyor, chart type:", chartType);
    
    var testData = [];
    var kasalar = ['Ana Kasa', 'Yan Kasa', 'Merkez Kasa'];
    var today = new Date();
    
    // Kasa seçimi filtresi uygula
    var kasaSecimi = $("#kasaSecimi").val();
    if (kasaSecimi) {
        var secilenKasaAdi = $("#kasaSecimi option:selected").text();
        if (secilenKasaAdi && secilenKasaAdi !== "Tüm Kasalar") {
            kasalar = [secilenKasaAdi];
            console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
        } else {
            console.log("Tüm kasalar gösteriliyor");
        }
    } else {
        console.log("Kasa seçimi yok, tüm kasalar gösteriliyor");
    }
    
    if (chartType === 'gunluk') {
        // Son 30 gün için test verisi
        for (var i = 29; i >= 0; i--) {
            var date = new Date(today);
            date.setDate(date.getDate() - i);
            var dateStr = date.toISOString().split('T')[0];
            
            kasalar.forEach(function(kasa, index) {
                var baseBakiye = 50000 + (index * 20000); // Her kasa için farklı başlangıç bakiyesi
                var randomChange = (Math.random() - 0.5) * 10000; // -5000 ile +5000 arası rastgele değişim
                var bakiye = Math.max(0, baseBakiye + randomChange + (i * 100)); // Günlük artış
                
                testData.push({
                    kasaAdi: kasa,
                    tarih: dateStr,
                    bakiye: Math.round(bakiye * 100) / 100
                });
            });
        }
    } else if (chartType === 'aylik') {
        // Son 12 ay için test verisi
        for (var i = 11; i >= 0; i--) {
            var date = new Date(today);
            date.setMonth(date.getMonth() - i);
            var dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
            
            kasalar.forEach(function(kasa, index) {
                var baseBakiye = 50000 + (index * 20000);
                var randomChange = (Math.random() - 0.5) * 50000;
                var bakiye = Math.max(0, baseBakiye + randomChange + (i * 5000));
                
                testData.push({
                    kasaAdi: kasa,
                    tarih: dateStr,
                    bakiye: Math.round(bakiye * 100) / 100
                });
            });
        }
    } else if (chartType === 'yillik') {
        // Son 5 yıl için test verisi
        for (var i = 4; i >= 0; i--) {
            var date = new Date(today);
            date.setFullYear(date.getFullYear() - i);
            var dateStr = date.getFullYear().toString();
            
            kasalar.forEach(function(kasa, index) {
                var baseBakiye = 500000 + (index * 200000);
                var randomChange = (Math.random() - 0.5) * 200000;
                var bakiye = Math.max(0, baseBakiye + randomChange + (i * 100000));
                
                testData.push({
                    kasaAdi: kasa,
                    tarih: dateStr,
                    bakiye: Math.round(bakiye * 100) / 100
                });
            });
        }
    }
    
    console.log("Test verisi oluşturuldu:", testData.length, "kayıt");
    return testData;
}

// Chart verisi hazırlama
function bankaHesaplariRaporuChartVerisiHazirla(data, chartType) {
    var kasalar = {};
    var labels = [];
    var datasets = [];
    
    // Eğer veri yoksa boş chart göster
    if (!data || data.length === 0) {
        console.log("Chart için veri bulunamadı, boş chart gösteriliyor");
        return {
            labels: ['Veri Yok'],
            datasets: [{
                label: 'Veri Bulunamadı',
                data: [0],
                borderColor: 'rgba(200, 200, 200, 0.8)',
                backgroundColor: 'rgba(200, 200, 200, 0.1)',
                tension: 0.1,
                fill: false
            }]
        };
    }
    
    // Kasa seçimi filtresi uygula
    var kasaSecimi = $("#kasaSecimi").val();
    var secilenKasaAdi = null;
    if (kasaSecimi) {
        secilenKasaAdi = $("#kasaSecimi option:selected").text();
        if (secilenKasaAdi === "Tüm Kasalar") {
            secilenKasaAdi = null;
            console.log("Tüm kasalar gösteriliyor");
        } else {
            console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
        }
    } else {
        console.log("Kasa seçimi yok, tüm kasalar gösteriliyor");
    }
    
    // Veriyi grupla
    data.forEach(function(item) {
        var kasaAdi = item.kasaAdi || 'Bilinmeyen Kasa';
        
        // Kasa filtresi uygula
        if (secilenKasaAdi && kasaAdi !== secilenKasaAdi) {
            return; // Bu kasa filtrelenmiş, atla
        }
        
        var tarih = new Date(item.tarih);
        var bakiye = parseFloat(item.bakiye) || 0;
        
        // Tarih formatını belirle
        var tarihKey;
        if (chartType === 'gunluk') {
            tarihKey = tarih.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (chartType === 'aylik') {
            tarihKey = tarih.getFullYear() + '-' + String(tarih.getMonth() + 1).padStart(2, '0'); // YYYY-MM
        } else if (chartType === 'yillik') {
            tarihKey = tarih.getFullYear().toString(); // YYYY
        }
        
        if (!kasalar[kasaAdi]) {
            kasalar[kasaAdi] = {};
        }
        
        kasalar[kasaAdi][tarihKey] = bakiye;
    });
    
    // Tüm tarihleri topla ve sırala
    var allDates = new Set();
    Object.keys(kasalar).forEach(function(kasa) {
        Object.keys(kasalar[kasa]).forEach(function(tarih) {
            allDates.add(tarih);
        });
    });
    
    labels = Array.from(allDates).sort();
    
    // Renk paleti
    var colors = [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)'
    ];
    
    // Dataset'leri oluştur
    var colorIndex = 0;
    Object.keys(kasalar).forEach(function(kasa) {
        var data = labels.map(function(tarih) {
            return kasalar[kasa][tarih] || 0;
        });
        
        datasets.push({
            label: kasa,
            data: data,
            borderColor: colors[colorIndex % colors.length],
            backgroundColor: colors[colorIndex % colors.length].replace('0.8', '0.1'),
            tension: 0.1,
            fill: false
        });
        
        colorIndex++;
    });
    
    console.log('Chart verisi hazırlandı:', {
        labels: labels,
        datasets: datasets.length,
        kasalar: Object.keys(kasalar)
    });
    
    return {
        labels: labels,
        datasets: datasets
    };
}

// Chart butonları event handler'ları
function bankaHesaplariRaporuChartEventHandlers() {
    $('#gunlukChartBtn').on('click', function() {
        $('.btn-group button').removeClass('active');
        $(this).addClass('active');
        window.currentChartType = 'gunluk';
        bankaHesaplariRaporuChartOlustur();
    });
    
    $('#aylikChartBtn').on('click', function() {
        $('.btn-group button').removeClass('active');
        $(this).addClass('active');
        window.currentChartType = 'aylik';
        bankaHesaplariRaporuChartOlustur();
    });
    
    $('#yillikChartBtn').on('click', function() {
        $('.btn-group button').removeClass('active');
        $(this).addClass('active');
        window.currentChartType = 'yillik';
        bankaHesaplariRaporuChartOlustur();
    });
    
    // Kasa seçimi değiştiğinde chart'ı güncelle
    $('#kasaSecimi').on('change', function() {
        console.log("Kasa seçimi değişti, chart güncelleniyor");
        if (window.kasaBakiyeChart) {
            bankaHesaplariRaporuChartOlustur();
        }
    });
}

// İşlem türü dağılımı chart oluşturma
function bankaHesaplariRaporuIslemTuruChartOlustur() {
    console.log("İşlem türü dağılımı chart'ı oluşturuluyor...");
    
    // Kasa işlemleri tablosundan veri çek ve chart oluştur
    bankaHesaplariRaporuIslemTuruHesapla();
}

// İşlem türü verilerini hesaplama
function bankaHesaplariRaporuIslemTuruHesapla() {
    // Kasa işlemleri tablosundan veri çek
    bankaHesaplariRaporuKasaIslemleriVerisiCek().then(function(data) {
        var islemTurleri = {};
        
        console.log("Kasa işlemleri verisi:", data);
        console.log("İşlem türü hesaplama için veri sayısı:", data.length);
        
        // Veriyi işle
        data.forEach(function(item) {
            var islemTuru = item.islemTuru || item.tabloTur || 'Bilinmeyen';
            
            // HTML tag'lerini temizle
            islemTuru = islemTuru.replace(/<[^>]*>/g, '').trim();
            
            // Virman, Tahsilat, Masraf olarak grupla
            if (islemTuru.includes('Virman')) {
                islemTuru = 'Virman';
            } else if (islemTuru.includes('Tahsilat')) {
                islemTuru = 'Tahsilat';
            } else if (islemTuru.includes('Masraf')) {
                islemTuru = 'Masraf';
            } else {
                islemTuru = 'Diğer';
            }
            
            if (!islemTurleri[islemTuru]) {
                islemTurleri[islemTuru] = 0;
            }
            islemTurleri[islemTuru]++;
        });
        
        // Chart'ı güncelle
        bankaHesaplariRaporuIslemTuruChartGuncelle(islemTurleri);
        
    }).catch(function(error) {
        console.log("Kasa işlemleri verisi alınamadı, test verisi kullanılıyor:", error);
        var testIslemTurleri = {
            'Tahsilat': 15,
            'Masraf': 8,
            'Virman': 12,
            'Diğer': 3
        };
        bankaHesaplariRaporuIslemTuruChartGuncelle(testIslemTurleri);
    });
}

// Kasa işlemleri tablosundan veri çekme
function bankaHesaplariRaporuKasaIslemleriVerisiCek() {
    return new Promise(function(resolve, reject) {
        var formData = new FormData();
        formData.append("kasaIslemleriListele", "1");
        
        // Filtreleme parametrelerini ekle
        var kasaSecimi = $("#kasaSecimi").val();
        var tarihBaslangic = $("#tarihBaslangic").val();
        var tarihBitis = $("#tarihBitis").val();
        
        if (kasaSecimi) {
            formData.append("kasaID", kasaSecimi);
        }
        if (tarihBaslangic) {
            formData.append("tarihBaslangic", tarihBaslangic);
        }
        if (tarihBitis) {
            formData.append("tarihBitis", tarihBitis);
        }
        
        makeAjax(formData).then(function(data) {
            console.log("Kasa işlemleri verisi:", data);
            
            if (data.status === 1 && data.data) {
                resolve(data.data);
            } else {
                reject(new Error(data.message || 'Kasa işlemleri verisi alınamadı'));
            }
        }).catch(function(error) {
            reject(error);
        });
    });
}

// İşlem türü chart'ını güncelleme
function bankaHesaplariRaporuIslemTuruChartGuncelle(islemTurleri) {
    // Mevcut chart'ı yok et
    if (window.islemTuruChart && typeof window.islemTuruChart.destroy === 'function') {
        window.islemTuruChart.destroy();
    }
    
    var ctx = document.getElementById('islemTuruChart').getContext('2d');
    
    // Chart verisi hazırla
    var labels = Object.keys(islemTurleri);
    var data = Object.values(islemTurleri);
    var colors = [
        '#28a745', // Tahsilat - Yeşil
        '#dc3545', // Masraf - Kırmızı
        '#007bff', // Virman - Mavi
        '#6c757d'  // Diğer - Gri
    ];
    
    console.log("İşlem türü dağılımı:", islemTurleri);
    
    window.islemTuruChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: colors,
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                },
                title: {
                    display: true,
                    text: 'İşlem Türü Dağılımı',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            var label = context.label || '';
                            var value = context.parsed;
                            var total = context.dataset.data.reduce((a, b) => a + b, 0);
                            var percentage = ((value / total) * 100).toFixed(1);
                            return label + ': ' + value + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// Tahsilat/Masraf chart oluşturma
function bankaHesaplariRaporuTahsilatMasrafChartOlustur() {
    console.log("Tahsilat/Masraf chart'ı oluşturuluyor...");
    
    // Mevcut chart'ı yok et
    if (window.tahsilatMasrafChart && typeof window.tahsilatMasrafChart.destroy === 'function') {
        window.tahsilatMasrafChart.destroy();
    }
    
    var ctx = document.getElementById('tahsilatMasrafChart').getContext('2d');
    var chartType = window.currentTahsilatMasrafChartType || 'gunluk';
    
    // Backend'den chart verisi çek
    bankaHesaplariRaporuTahsilatMasrafChartVerisiCek(chartType).then(function(chartData) {
        window.tahsilatMasrafChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: chartData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '₺' + value.toLocaleString('tr-TR');
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Kasa Bazında ' + (chartType === 'gunluk' ? 'Günlük' : chartType === 'aylik' ? 'Aylık' : 'Yıllık') + ' Tahsilat/Masraf'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': ₺' + context.parsed.y.toLocaleString('tr-TR');
                            }
                        }
                    }
                }
            }
        });
    }).catch(function(error) {
        console.error("Tahsilat/Masraf chart verisi yüklenirken hata:", error);
        // Hata durumunda boş chart göster
        window.tahsilatMasrafChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Veri Yok'],
                datasets: [{
                    label: 'Veri Bulunamadı',
                    data: [0],
                    backgroundColor: 'rgba(200, 200, 200, 0.8)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    });
}

// Backend'den tahsilat/masraf chart verisi çekme
function bankaHesaplariRaporuTahsilatMasrafChartVerisiCek(chartType) {
    return new Promise(function(resolve, reject) {
        var formData = new FormData();
        formData.append("bankaHesaplariRaporuTahsilatMasrafChartVerisi", "1");
        formData.append("chartType", chartType);
        
        // Filtreleme parametrelerini ekle
        var kasaSecimi = $("#kasaSecimi").val();
        var tarihBaslangic = $("#tarihBaslangic").val();
        var tarihBitis = $("#tarihBitis").val();
        
        if (kasaSecimi) {
            formData.append("kasaID", kasaSecimi);
        }
        if (tarihBaslangic) {
            formData.append("tarihBaslangic", tarihBaslangic);
        }
        if (tarihBitis) {
            formData.append("tarihBitis", tarihBitis);
        }
        
        makeAjax(formData).then(function(data) {
            console.log("Tahsilat/Masraf chart verisi:", data);
            
            if (data.status === 1 && data.data) {
                var chartData = bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(data.data, chartType);
                resolve(chartData);
            } else {
                console.log("Backend'den veri gelmedi, test verisi kullanılıyor");
                var testData = bankaHesaplariRaporuTahsilatMasrafTestVerisiOlustur(chartType);
                var chartData = bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(testData, chartType);
                resolve(chartData);
            }
        }).catch(function(error) {
            console.log("Backend hatası, test verisi kullanılıyor:", error);
            var testData = bankaHesaplariRaporuTahsilatMasrafTestVerisiOlustur(chartType);
            var chartData = bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(testData, chartType);
            resolve(chartData);
        });
    });
}

// Test verisi oluşturma
function bankaHesaplariRaporuTahsilatMasrafTestVerisiOlustur(chartType) {
    console.log("Tahsilat/Masraf test verisi oluşturuluyor, chart type:", chartType);
    
    var testData = [];
    var kasalar = ['Ana Kasa', 'Yan Kasa', 'Merkez Kasa'];
    var today = new Date();
    
    // Kasa seçimi filtresi uygula
    var kasaSecimi = $("#kasaSecimi").val();
    if (kasaSecimi) {
        var secilenKasaAdi = $("#kasaSecimi option:selected").text();
        if (secilenKasaAdi && secilenKasaAdi !== "Tüm Kasalar") {
            kasalar = [secilenKasaAdi];
            console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
        }
    }
    
    if (chartType === 'gunluk') {
        // Son 30 gün için test verisi
        for (var i = 29; i >= 0; i--) {
            var date = new Date(today);
            date.setDate(date.getDate() - i);
            var dateStr = date.toISOString().split('T')[0];
            
            kasalar.forEach(function(kasa, index) {
                var tahsilat = Math.floor(Math.random() * 10000) + 5000; // 5000-15000 arası
                var masraf = Math.floor(Math.random() * 5000) + 2000; // 2000-7000 arası
                
                testData.push({
                    kasaAdi: kasa,
                    tarih: dateStr,
                    tahsilat: tahsilat,
                    masraf: masraf
                });
            });
        }
    } else if (chartType === 'aylik') {
        // Son 12 ay için test verisi
        for (var i = 11; i >= 0; i--) {
            var date = new Date(today);
            date.setMonth(date.getMonth() - i);
            var dateStr = date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0');
            
            kasalar.forEach(function(kasa, index) {
                var tahsilat = Math.floor(Math.random() * 100000) + 50000; // 50000-150000 arası
                var masraf = Math.floor(Math.random() * 50000) + 20000; // 20000-70000 arası
                
                testData.push({
                    kasaAdi: kasa,
                    tarih: dateStr,
                    tahsilat: tahsilat,
                    masraf: masraf
                });
            });
        }
    } else if (chartType === 'yillik') {
        // Son 5 yıl için test verisi
        for (var i = 4; i >= 0; i--) {
            var date = new Date(today);
            date.setFullYear(date.getFullYear() - i);
            var dateStr = date.getFullYear().toString();
            
            kasalar.forEach(function(kasa, index) {
                var tahsilat = Math.floor(Math.random() * 500000) + 500000; // 500000-1000000 arası
                var masraf = Math.floor(Math.random() * 200000) + 200000; // 200000-400000 arası
                
                testData.push({
                    kasaAdi: kasa,
                    tarih: dateStr,
                    tahsilat: tahsilat,
                    masraf: masraf
                });
            });
        }
    }
    
    console.log("Tahsilat/Masraf test verisi oluşturuldu:", testData.length, "kayıt");
    return testData;
}

// Chart verisi hazırlama
function bankaHesaplariRaporuTahsilatMasrafChartVerisiHazirla(data, chartType) {
    var kasalar = {};
    var labels = [];
    var datasets = [];
    
    // Eğer veri yoksa boş chart göster
    if (!data || data.length === 0) {
        console.log("Chart için veri bulunamadı, boş chart gösteriliyor");
        return {
            labels: ['Veri Yok'],
            datasets: [{
                label: 'Veri Bulunamadı',
                data: [0],
                backgroundColor: 'rgba(200, 200, 200, 0.8)'
            }]
        };
    }
    
    // Kasa seçimi filtresi uygula
    var kasaSecimi = $("#kasaSecimi").val();
    var secilenKasaAdi = null;
    if (kasaSecimi) {
        secilenKasaAdi = $("#kasaSecimi option:selected").text();
        if (secilenKasaAdi === "Tüm Kasalar") {
            secilenKasaAdi = null;
            console.log("Tüm kasalar gösteriliyor");
        } else {
            console.log("Kasa filtresi uygulandı:", secilenKasaAdi);
        }
    } else {
        console.log("Kasa seçimi yok, tüm kasalar gösteriliyor");
    }
    
    // Veriyi grupla
    data.forEach(function(item) {
        var kasaAdi = item.kasaAdi || 'Bilinmeyen Kasa';
        
        // Kasa filtresi uygula
        if (secilenKasaAdi && kasaAdi !== secilenKasaAdi) {
            return; // Bu kasa filtrelenmiş, atla
        }
        
        var tarih = new Date(item.tarih);
        var tahsilat = parseFloat(item.tahsilat) || 0;
        var masraf = parseFloat(item.masraf) || 0;
        
        // Tarih formatını belirle
        var tarihKey;
        if (chartType === 'gunluk') {
            tarihKey = tarih.toISOString().split('T')[0]; // YYYY-MM-DD
        } else if (chartType === 'aylik') {
            tarihKey = tarih.getFullYear() + '-' + String(tarih.getMonth() + 1).padStart(2, '0'); // YYYY-MM
        } else if (chartType === 'yillik') {
            tarihKey = tarih.getFullYear().toString(); // YYYY
        }
        
        if (!kasalar[kasaAdi]) {
            kasalar[kasaAdi] = {
                tahsilat: {},
                masraf: {}
            };
        }
        
        if (!kasalar[kasaAdi].tahsilat[tarihKey]) {
            kasalar[kasaAdi].tahsilat[tarihKey] = 0;
        }
        if (!kasalar[kasaAdi].masraf[tarihKey]) {
            kasalar[kasaAdi].masraf[tarihKey] = 0;
        }
        
        kasalar[kasaAdi].tahsilat[tarihKey] += tahsilat;
        kasalar[kasaAdi].masraf[tarihKey] += masraf;
    });
    
    // Tüm tarihleri topla ve sırala
    var allDates = new Set();
    Object.keys(kasalar).forEach(function(kasa) {
        Object.keys(kasalar[kasa].tahsilat).forEach(function(tarih) {
            allDates.add(tarih);
        });
        Object.keys(kasalar[kasa].masraf).forEach(function(tarih) {
            allDates.add(tarih);
        });
    });
    
    labels = Array.from(allDates).sort();
    
    // Renk paleti
    var colors = [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 205, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)'
    ];
    
    // Dataset'leri oluştur
    var colorIndex = 0;
    Object.keys(kasalar).forEach(function(kasa) {
        var tahsilatData = labels.map(function(tarih) {
            return kasalar[kasa].tahsilat[tarih] || 0;
        });
        
        var masrafData = labels.map(function(tarih) {
            return kasalar[kasa].masraf[tarih] || 0;
        });
        
        datasets.push({
            label: kasa + ' - Tahsilat',
            data: tahsilatData,
            backgroundColor: colors[colorIndex % colors.length],
            borderColor: colors[colorIndex % colors.length],
            borderWidth: 1
        });
        
        datasets.push({
            label: kasa + ' - Masraf',
            data: masrafData,
            backgroundColor: colors[colorIndex % colors.length].replace('0.8', '0.4'),
            borderColor: colors[colorIndex % colors.length],
            borderWidth: 1
        });
        
        colorIndex++;
    });
    
    console.log('Tahsilat/Masraf chart verisi hazırlandı:', {
        labels: labels,
        datasets: datasets.length,
        kasalar: Object.keys(kasalar)
    });
    
    return {
        labels: labels,
        datasets: datasets
    };
}

// Chart butonları event handler'ları
function bankaHesaplariRaporuTahsilatMasrafChartEventHandlers() {
    $('#gunlukTahsilatMasrafChartBtn').on('click', function() {
        $('.btn-group button').removeClass('active');
        $(this).addClass('active');
        window.currentTahsilatMasrafChartType = 'gunluk';
        bankaHesaplariRaporuTahsilatMasrafChartOlustur();
    });
    
    $('#aylikTahsilatMasrafChartBtn').on('click', function() {
        $('.btn-group button').removeClass('active');
        $(this).addClass('active');
        window.currentTahsilatMasrafChartType = 'aylik';
        bankaHesaplariRaporuTahsilatMasrafChartOlustur();
    });
    
    $('#yillikTahsilatMasrafChartBtn').on('click', function() {
        $('.btn-group button').removeClass('active');
        $(this).addClass('active');
        window.currentTahsilatMasrafChartType = 'yillik';
        bankaHesaplariRaporuTahsilatMasrafChartOlustur();
    });
    
    // Kasa seçimi değiştiğinde chart'ı güncelle
    $('#kasaSecimi').on('change', function() {
        console.log("Kasa seçimi değişti, tahsilat/masraf chart güncelleniyor");
        if (window.tahsilatMasrafChart) {
            bankaHesaplariRaporuTahsilatMasrafChartOlustur();
        }
    });
}

//#endregion