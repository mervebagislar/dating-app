//#region Tahsilat eventHandler
$('#tahsilatOdemeHizliEkleForm').submit(function (e) {
	e.preventDefault();
	tahsilatOdemeHizliEkle(e)
});

// Tahsilat ödeme ekleme para birimi değişikliği
$('body').on('change', '#tahsilatEkleparaBirimi',function(){
	tahsilatEkleparaBirimi()
});

// Tahsilat kartı ekleme para birimi değişikliği
$('body').on('change', '#tahsilatKartEkleparaBirimi',function(){
	tahsilatKartEkleparaBirimi()
});

// Tahsilat ödeme ekleme kur yenileme
$('body').on('click', '#tahsilatEkleKurYenile',function(){
	tahsilatEkleKurYenile()
});


// Tahsilat kartı ekleme kur yenileme
$('body').on('click', '#tahsilatKartEkleKurYenile',function(){
	tahsilatKartEkleKurYenile()
});

$('body').on('click', '[aria-name="tahsilatTuruKaydet"]',function(){
	tahsilatTuruKaydet()
});

// Personel yetkilendirme modal event handler'ları
$('body').on('click', '#personelYetkilendirmeKaydet', function(){
	personelYetkilendirmeKaydet()
});
// Personel yetkilendirme modal event handler'ları
/*$('body').on('click', '#personelYetkilendirmeAc', function(){
	personelYetkilendirmeAc()
});*/
$('body').on('click', '#personelYetkilendirmeTemizle', function(){
	personelYetkilendirmeTemizle()
});

// Modül yetkisi değişikliklerini dinle
$('body').on('change', 'input[name^="modulYetkiler"][name$="[aktif]"]', function(){
	var modulAdi = $(this).attr('name').match(/\[([^\]]+)\]/)[1];
	toggleModulDetay(modulAdi);
});



$('#tahsilatCesidiDuzenleForm').submit(function (e) {
    e.preventDefault();
    tahsilatCesidiDuzenleKaydet(e)
});

$('body').on('change', '#tahsilatDuzenleparaBirimi',function(){
	tahsilatDuzenleToggleParaBirimi()
});
$( "#tahsilatDuzenleKurYenile" ).on( "click", function() {
	tahsilatDuzenleKurYenile()
});

// Tahsilat düzenle kaydet event handler
$('body').on('click', '#tahsilatDuzenleKaydetButton', function(){
	tahsilatDuzenleKaydet()
});

//#endregion


//#region Tahsilat functions

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
//#endregion

//#region Tahsilat Kartı functions

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