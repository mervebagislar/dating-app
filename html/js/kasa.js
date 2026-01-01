
//#region KASA eventHandler
$('body').on('change', 'input[name="kasaEkleDurum"]',function(){
	switchKasa ($('input[name="kasaEkleDurum"]:checked').val(),"kasaEkleBankaDetay")

});
$('body').on('change', 'input[name="kasaDuzenleDurum"]',function(){
	switchKasa ($('input[name="kasaDuzenleDurum"]:checked').val(),"kasaDuzenleBankaDetay")

});
$('#kasaEkleForm').submit(function (e) {
    e.preventDefault();
    kasaEkle()
 });
$('body').on('onkeydown', '#kasaEkleIBAN',function(){
	ibanYerlestir($('#kasaEkleIBAN').val())
	
});
$('body').on('change', '#kasaEkleIBAN',function(){
	ibanYerlestir($('#kasaEkleIBAN').val())
});
$('body').on('change', '#kasaDuzenleIBAN',function(){
	ibanYerlestirDuzenle($('#kasaDuzenleIBAN').val())
});
$('#kasaDuzenleForm').submit(function (e) {
    e.preventDefault();
    kasaDuzenleKaydet(e)
 });
$('#yeniVirmanForm').submit(function (e) {
	e.preventDefault();
	virmanKaydet(e)
});
$('#yeniVirmanModal').on('show.bs.modal', function () {
    virmanModalKasaListesiYukle();
});
// Virman para birimi değiştiğinde kur alanını göster/gizle
$('#virmanParaBirimi').on('change', function() {
    var paraBirimi = $(this).val();
    
    if(paraBirimi === 'usd' || paraBirimi === 'eur') {
        $('#virmanKurDetay').removeClass('d-none');
        $('#virmanKur').prop('required', true);
    } else {
        // TL seçildiğinde
        $('#virmanKurDetay').addClass('d-none');
        $('#virmanKur').prop('required', false);
        $('#virmanKur').val('');
    }
});
//#endregion
//#region KASA functions
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