
async function makeMuseriAjax(formData,debug=false){
    if(debug){console.log("Musteri ajax starts")}
    let ser = JSON.stringify(Object.fromEntries(formData))
  let ret =  await $.ajax({
        type: "POST",
        url: "../../musteriWorker/",
        data: ser,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        processData: true,
        success: function(data)
        {
            if(data.status == 0){
                ToastCenterWhiteButton.fire({
                    icon: "warning",
                    titleText: data.header,
                    text:data.message,
                    confirmButtonText: 'Tamam'
                })
            }
            else{
                return data;
            }
            
        }
    });
    return ret
}


window.onbeforeunload = function(){
	
}
$(document).ready(function() {
    if(uuid=="" || uuid == undefined || uuid== null || uuid=="-1"){
        $(".main-content").html("")
        $(".menu-sidebar").html("")
        $(".header-mobile__bar").html("")
        Toast.fire({
            icon: 'error',
            title: "Parametresiz işlem gerçekleştirilemez!"
        });
        return;
    }
    musteriMail =  getCookie("musteriMail");
	musteriAuth = getCookie("musteriAuth")
	teklifSayfaID = getCookie("teklifSayfaID")
    if(musteriMail=="" ){
        askForMailAdress()
        return;
    }
    else{ checkMailAdress(musteriMail) }
    if(teklifSayfaID==""){
        askForCode() 
        return;
    }
    if(musteriAuth ==""){
        askForCode()
        return;
    }
    

})

//#region eventHandlers

//musteriMailGonder
$('body').on('click', '[aria-name="musteriMailGonder"]',function(){
   let musteriEposta = $('[aria-name="musteriMail"]').val()
   checkMailAdress(musteriEposta)
})
$('body').on('click', '[aria-name="musteriDogrulamaGonder"]',function(){
    let musteriKod = $('[aria-name="musteriDogrulama"]').val()
    musteriMail =  getCookie("musteriMail");
    checkSecurityCode(musteriMail,musteriKod)
})
$('body').on('click', '[aria-name="resendCode"]',function(){
    resendSecurityCode()
})
//
//#endregion

//#region callbacks

function musteriTeklifSalonHizmetOlustur(teklif,hizmet,salonIndex,index){
    let formatPrice=new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
    });
    
    let hizmetret
    //salon tabı varmı kontrol et eğer tab yoksa hata ver ve işlemi bitir
    if($("#custom-nav-" + salonIndex).length == 0) {
        ToastCenterWhiteButton.fire({
            icon: "error",
            titleText: "Salon bulunamadı",
            text:"Seçilen salon olmadığı için işlem gerçekleştirilemiyor",
            confirmButtonText: 'Tamam'
        })
        
        return;
    }
    
    //eğer hizmet grubu butonu daha önce oluşturulmamışsa önce hizmet grubunu oluştur
    if($(`#salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Button`).length == 0) {
       let obj = teklif.teklifIcerik[salonIndex].hizmetGrupFiyatlari.find(x => x.grupID === hizmet.hizmetGrupID);
       let grupPos = teklif.teklifIcerik[salonIndex].hizmetGrupFiyatlari.indexOf(obj);
       let letGrupToplamVeri = ` <span class=" col-2 mt-2">${formatPrice.format(teklif.teklifIcerik[salonIndex].hizmetGrupFiyatlari[grupPos].grupToplam)}</span>`
       if(teklif.teklifIcerik[salonIndex].hizmetGrupFiyatlari[grupPos].grupToplam == null || teklif.teklifIcerik[salonIndex].hizmetGrupFiyatlari[grupPos].grupToplam == 0){
        letGrupToplamVeri =""
       }
        collapseButton = `
        <div clas="d-flex flex-row">
            <button class="btn btn-outline-secondary btn-sm col-10 mt-2" id="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Button" type="button" data-toggle="collapse" data-target="#salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Content" aria-expanded="true" aria-controls="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Content">
            ${nameReplace(hizmet.hizmetGrubu)}
            </button>
            ${letGrupToplamVeri}
               
            
        </div>
        <div class="collapse show" id="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Content">
            <div class="card card-body-hizmet" id="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Container">
                <div class="row card-header-small">
                <div class="col-4">Hizmet</div>
                <div class="col-2">Adet</div>
                <div class="col-2">Gün</div>
                <div class="col-2">Fiyat</div>
                <div class="col-2 d-flex justify-content-end">
                    <span aria-name="hizmetAraFiyat">..</span>
                </div>
            </div>
            </div>
        </div>`
        $("#custom-nav-" + salonIndex).append(collapseButton)
    }
   
   /* //eğer hizmet daha önce eklenmemişse hizmeti ekle, eklenmişse hizmet adedini arttır*/
    if($(`#salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Container`).length == 0) {
        hizmetFiyati = hizmet["hizmetFiyati"]
        hizmetFiyatToplam = hizmet["hizmetToplam"];
        let fiyatVeri = `<span class="d-inline">${formatPrice.format(hizmetFiyati)}</span><span class="d-inline ml-3">${formatPrice.format(hizmetFiyatToplam)}</span>`
        if(hizmetFiyati == null && hizmetFiyatToplam==null){
            fiyatVeri = "";
        }
        hizmetret = `
            <div id="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Container" >
                <div class="row">
                    <div class="col-md-4"> ${nameReplace(hizmet.hizmetAdi)}</div>
                    <div class="col-md-2"><span>${hizmet["adet"]}</span> </div>
                    <div class="col-md-2"><span>${hizmet["gunSayisi"]}</span></div>
                    <div class="col-md-4">
                        <div class="d-flex">
                        ${fiyatVeri}
                        </div>
                    </div>
                    <hr class="hr border-top col-10" />
                </div>
                      
            </div>
        `;
       // if(secilen == -1){teklifTaslak.teklifIcerik[salonIndex].icerik.push(hizmet)}
    }
   

    //hizmeti sayfaya yazdır
   // taslakFiyatHesapla()
    $(`#salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Container`).append(hizmetret)
}
function musteriTeklifSalonOlustur(teklif){
    let formatPrice=new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
    });
    
    if(teklif.teklifAraToplam==null && teklif.teklifIndirim==null && teklif.teklifAnaToplam==null){ $('[aria-name="musterTeklifToplamFiyatlar"]').toggleClass("d-none",true) }
    if(teklif.teklifIndirim==null || teklif.teklifIndirim==0){ $('[aria-name="musterTeklifGenelIndirim"]').toggleClass("d-none",true) }
    //aria-name="musterTeklifGenelIndirim"
    $('#teklifAraFiyat').text(formatPrice.format(teklif.teklifAraToplam))
    $('#teklifIndirim').text(formatPrice.format(teklif.teklifIndirim))
    $('#teklifAnaFiyat').text(formatPrice.format(teklif.teklifAnaToplam))
    $('[aria-name="yeniTeklifTabList"]').html("")
    $('[aria-name="yeniTeklifTabContent"]').html("")
    teklif.teklifIcerik.forEach(icerik)

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
        let indirimVeri = `<div class="col-4"><span class="d-inline">Salon İndirim : <span aria-name="salonIndirimFiyat" >${formatPrice.format(teklif.teklifIcerik[index].salonIndirim)}</span></span></div>`;
        let araFiyatVeri=`<div class="col-4"><span class="d-inline">Salon Ara Toplam : <span aria-name="salonAraFiyat" >${formatPrice.format(teklif.teklifIcerik[index].salonAraFiyat)}</span></span></div>`
        let finalFiyat = `<div class="col-4"><span class="d-inline">Salon TOPLAM : <span aria-name="salonIndirimFiyat" >${formatPrice.format(teklif.teklifIcerik[index].salonFinalFiyat)}</span></span></div>`
        if(teklif.teklifIcerik[index].salonAraFiyat==null && teklif.teklifIcerik[index].salonIndirim==null && teklif.teklifIcerik[index].salonFinalFiyat==null)
        { indirimVeri = "";araFiyatVeri = "";finalFiyat = ""; }
        if(teklif.teklifIcerik[index].salonIndirim==null || teklif.teklifIcerik[index].salonIndirim==0)
        { indirimVeri = ""; }
        let content= `
        <div class="tab-pane fade ${show}" id="custom-nav-${index}" role="tabpanel" aria-labelledby="custom-nav-${index}-tab">
            
                <div class="row">
                    ${araFiyatVeri}
                    ${indirimVeri}
                    ${finalFiyat}
                    
                </div>
                
            
        </div>`;
        
        $('[aria-name="yeniTeklifTabList"]').append(tab)
        $('[aria-name="yeniTeklifTabContent"]').append(content)
        if(item.icerik.length >0){
            let salonIndex=index
            item.icerik.forEach((item, index, arr) => {
                musteriTeklifSalonHizmetOlustur(teklif,item,salonIndex,index)
             });
        }
    }

   
}
function teklifYerlestir(teklif){
    Toast.fire({
        icon: "success",
        titleText: "Başarılı",
        text:"Teklifiniz getiriliyor...",
        confirmButtonText: 'Tamam'
    })

    sessionStorage.setItem("teklif", JSON.stringify(teklif));
    $('[aria-name="TaslakTeklifDuzenle"]').attr('aria-teklifid', teklif.ID);
    
    let teklifTarihi =  new Date( Date.parse(teklif.teklifTarihi));
    let teklifIsKurulumBaslangic =""
    if(teklif.teklifIsKurulumBaslangic !=""){
        teklifIsKurulumBaslangic= moment(new Date( Date.parse(teklif.teklifIsKurulumBaslangic))).format('DD.MM.YYYY')
    }
   
    let teklifIsKurulumBitis =  ""
    if(teklif.teklifIsKurulumBitis !=""){
        teklifIsKurulumBitis= moment(new Date( Date.parse(teklif.teklifIsKurulumBitis))).format('DD.MM.YYYY')
    }
    let teklifIsBaslangic =  ""
    if(teklif.teklifIsBaslangic !=""){
        teklifIsBaslangic= moment(new Date( Date.parse(teklif.teklifIsBaslangic))).format('DD.MM.YYYY')
    }
    let teklifIsBitis = "";
    if(teklif.teklifIsBitis !=""){
        teklifIsBitis= moment(new Date( Date.parse(teklif.teklifIsBitis))).format('DD.MM.YYYY')
    }
   $('[aria-name="teklifAdi"]').val(nameReplace(teklif.teklifAdi)+` (Rev ${teklif.teklifRevize})`)
   if(teklif.teklifAcentaAdi){$('[aria-name="teklifAcentaAdi"]').text(nameReplace(teklif.teklifAcentaAdi))}
   if(teklif.teklifAcentaCalisanAdi){$('[aria-name="teklifAcentaCalisanAdi"]').text(nameReplace(teklif.teklifAcentaCalisanAdi))}
   $('[aria-name="teklifKurulumTarihi"]').text(`${teklifIsKurulumBaslangic}->${teklifIsKurulumBitis}`)
   $('[aria-name="teklifEtkinlikAdi"]').text(nameReplace(teklif.teklifAdi))
   $('[aria-name="teklifYazanAdi"]').text(nameReplace(teklif.teklifYazanAdi))
   if(teklif.teklifLokasyon){$('[aria-name="teklifLokasyon"]').text(nameReplace(teklif.teklifLokasyon))}
   $('[aria-name="teklifIsTarihi"]').text(`${teklifIsBaslangic}->${teklifIsBitis}`)
   $('[aria-name="teklifTarihi"]').text(moment(teklifTarihi).format('DD.MM.YYYY'))
   $('[aria-name="teklifGecerlilikSuresi"]').text(teklif.teklifGecerlilik+" Gün")
   $('[aria-name="teklifRevizeNo"]').text(teklif.revizeNo)

   musteriTeklifSalonOlustur(teklif)
}
function resendSecurityCode(){
    
    musteriEposta =  getCookie("musteriMail");
    if(musteriEposta==""){
        askForMailAdress()
        return;
    }
    let formData = new FormData();
    formData.append("epostaDogrulama",musteriEposta);
    formData.append("teklifUUID",uuid);
    formData.append("tekrarYolla","TRUE");

    
    makeMuseriAjax(formData).then((data) => { 
        if(data.status == 0){ return false;}
        if(data.status == 1){ 
            $('[aria-name="musteriDogrulama"]').val("")
            askForCode();
         }
        
    })
}
function checkSecurityCode(musteriMail,musteriKod){
    let formData = new FormData();
    formData.append("kodDogrulama",musteriKod);
    formData.append("kodMail",musteriMail);
    formData.append("teklifUUID",uuid);
    makeMuseriAjax(formData).then((data) => { 
        if(data.status == 0){ askForCode()}
        if(data.status == 1){
            teklifYerlestir(data.result)
            $('#modal-Musteri-Dogrulama').modal('hide')
            $('[aria-name="musteriDogrulama"]').val("")
            //musteriDogrulama
        }
        
    })
}
function checkMailAdress(musteriEposta){
    
    let formData = new FormData();
    formData.append("epostaDogrulama",musteriEposta);
    formData.append("teklifUUID",uuid);
    makeMuseriAjax(formData).then((data) => { 
        if(data.status == 0){ return false;}
        if(data.status == 1){
            musteriAuth = getCookie("musteriAuth")
	        teklifSayfaID = getCookie("teklifSayfaID")
            if(teklifSayfaID!="" && musteriAuth !=""){
                checkSecurityCode(musteriEposta,musteriAuth)
                return;
            }
            
            askForCode();
        }
        
    })
}
function askForMailAdress(){
    $('#modal-Musteri-Mail').modal({
        backdrop: 'static',
        keyboard: false
    })
    $('[aria-name="musteriMail"]').val("")
    $('#modal-Musteri-Mail').modal('show')
}
function askForCode(){
    $('#modal-Musteri-Mail').modal('hide')
    $('[aria-name="musteriMail"]').val("")

    $('[aria-name="musteriDogrulama"]').val("")
    $('#modal-Musteri-Dogrulama').modal('show')
}
//#endregion