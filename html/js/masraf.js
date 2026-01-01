
//#region Masraf Kartı eventHandler
$('body').on('click', '[aria-name="odemeTuruKaydet"]',function(){
	odemeTuruKaydet()
});
$('#odemeCesidiEkleForm').submit(function (e) {
    e.preventDefault();
    odemeCesidiEkle(e)
});
$('#odemeCesidiDuzenleForm').submit(function (e) {
    e.preventDefault();
    odemeCesidiDuzenleKaydet(e)
});
$( ".masrafKartEkleButton" ).on( "click", function() {
	debuging("eventHandler:","masrafKartEkleButton")
	masrafEkleClear()
    $('#modal-Masraf-Ekle').modal('show')
});

$( ".tahsilatKartEkleButton" ).on( "click", function() {
	debuging("eventHandler:","tahsilatKartEkleButton")
	tahsilatEkleClear()
    $('#modal-tahsilat-Ekle').modal('show')
});

// Modal açıldığında datetimepicker'ları initialize et
$('#modal-tahsilat-Ekle').on('shown.bs.modal', function () {
    tahsilatEkleLoad()
});

//
$('body').on('change', '#masrafEkleTipi',function(){
	masrafEkleFatura($('#masrafEkleTipi').val())
});
$('body').on('change', 'input[name="masrafEkleIsSecim"]',function(){
	console.log("masrafEkleIsSecim 2")
	masrafEkleIsLoad()
});
$( "#masrafEkleDosya" ).on( "change", function() {

    if($(this).prop('files').length > 0)
    {
		
        file =$(this).prop('files')[0];
		masrafEkleDosyaYukle(file)
		debuging("eventHandler:","masrafEkleDosya",true)
       
    }
	
});

$( "#masrafDuzenleDosya" ).on( "change", function() {

    if($(this).prop('files').length > 0)
    {
		
        file =$(this).prop('files')[0];
		masrafDuzenleDosyaYukle(file)
		debuging("eventHandler:","masrafDuzenleosyaYukle",true)
       
    }
	
});
$('body').on('change', 'input[name="masrafDuzenleIsSecim"]',function(){
	console.log("masrafDuzenleIsSecim 2")
	masrafDuzenleIsLoad()
});
$('body').on('change', '#masrafDuzenleTipi',function(){
	masrafDuzenleTipi($('#masrafDuzenleTipi').val())
});
$('#masrafEkleForm').submit(function (e) {
    e.preventDefault();
    masrafEkle()
 });

$('#tahsilatEkleForm').submit(function (e) {
    e.preventDefault();
    tahsilatEkle()
 });
$('body').on('click', '[aria-name="masrafFaturaGoster"]',function(){
	debuging("masrafFaturaGoster:","*")
	let faturaURL= $(this).attr('aria-url'); 
	let faturaType= $(this).attr('aria-type'); 
	masrafFaturaGoruntule(faturaURL,faturaType)
});

$('body').on('click', '[aria-name="tahsilatEkleFaturaGoster"]',function(){
	debuging("tahsilatEkleFaturaGoster:","*")
	let faturaURL= $(this).attr('aria-url'); 
	let faturaType= $(this).attr('aria-type'); 
	masrafFaturaGoruntule(faturaURL,faturaType)
});

$('body').on('click', '[aria-name="odemeEkleFaturaGoster"]',function(){
	debuging("odemeEkleFaturaGoster:","*")
	let faturaURL= $(this).attr('aria-url'); 
	let faturaType= $(this).attr('aria-type'); 
	masrafFaturaGoruntule(faturaURL,faturaType)
});

$('body').on('click', '[aria-name="odemeEkleMasrafDuzenle"]',function(){
	let masrafaID= $(this).attr('aria-id'); 
	masrafOdemeClear()
	$('#modal-Odeme-Ekle').modal('hide')
	
	setTimeout(function (){
  
		masrafDuzenle(masrafaID)
	}, 1000);
});
$('#masrafDuzenleForm').submit(function (e) {
    e.preventDefault();
    odemeDuzenleKaydet()
});
$( "#masrafEkleparaBirimi" ).on( "change", function() {
	masrafEkleparaBirimi()
});
$( "#masrafDuzenleparaBirimi" ).on( "change", function() {
	masrafDuzenleparaBirimi()
});
$( "#masrafDuzenleKurYenile" ).on( "click", function() {
	masrafDuzenleKurYenile()
});

$( "#odemeEkleKurYenile" ).on( "click", function() {
	odemeEkleKurYenile()
});
$('body').on('click', '[aria-name="odemeEkleFaturaDetay"]',function(){
	$('[aria-name="odemeEkleFaturaDetayGoster"]').toggleClass("d-none")
});

$('#masrafOdemeHizliEkleForm').submit(function (e) {
    e.preventDefault();
    masrafOdemeHizliEkle()
 });

$( "#odemeEkleparaBirimi" ).on( "change", function() {
	odemeEkleparaBirimi()
});

$( "#odemeEkleKurYenile" ).on( "click", function() {
	odemeEkleKurYenile()
});

$('body').on('click', '[aria-name="odemeOdendi"]',function(){
	odendiGuncelle($(this))
});
$('body').on('click', '[aria-name="tahsilatOdendi"]',function(){
	tahsilatGuncelle($(this))
});
$( "#tahsilatDuzenleDosya" ).on( "change", function() {

    if($(this).prop('files').length > 0)
    {
		
        file =$(this).prop('files')[0];
		tahsilatDuzenleDosyaYukle(file)
		debuging("eventHandler:","tahsilatDuzenleDosyaYukle",true)
       
    }
	
});
$( "#tahsilatEkleDosya" ).on( "change", function() {

	if($(this).prop('files').length > 0)
	{
	
			file =$(this).prop('files')[0];
	tahsilatEkleDosyaYukle(file)
	debuging("eventHandler:","tahsilatEkleDosya",true)
		 
	}

});

//#endregion
 
//#region ÖDEME functions
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
function odemeEkleClear(){
    $('[aria-clear="odemeEkle"]').val(``)
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
//#endregion
//#region Masraf Kartı functions
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