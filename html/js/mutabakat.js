//#region Mutabakat eventHandler
$( "#mutabakatDosya" ).on( "change", function() {

    if($(this).prop('files').length > 0){
        file =$(this).prop('files')[0];
		mutabakatDosyaYukle(file)
    }
	
});

$('body').on('click', '[aria-name="TaslakTeklifMutabakat"]',function(){
	
	var teklifID = $(this).attr('aria-teklifid');
	mutabakatBak(teklifID)
})

$('#mutabakatEkleForm').submit(function (e) {
    e.preventDefault();
    sonMutabakatEkle(e)
});
//#endregion
//#region Son Mutabakat functions
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