
function anaTeklifTemizle(){
    swal.close();
    anaTeklifSifirla()
    sessionStorage.setItem("teklif", JSON.stringify(teklifTaslak));
}
function teklifYerlestir(){
    console.log("teklif yerleştir",teklif)
    let teklifTarihi =  new Date( Date.parse(teklif.icerik.teklifTarihi));
    let teklifIsKurulumBaslangic =""
    if(teklif.icerik.teklifIsKurulumBaslangic !=""){
        teklifIsKurulumBaslangic= moment(new Date( Date.parse(teklif.icerik.teklifIsKurulumBaslangic))).format('DD.MM.YYYY')
    }
   
    let teklifIsKurulumBitis =  ""
    if(teklif.icerik.teklifIsKurulumBitis !=""){
        teklifIsKurulumBitis= moment(new Date( Date.parse(teklif.icerik.teklifIsKurulumBitis))).format('DD.MM.YYYY')
    }
    let teklifIsBaslangic =  ""
    if(teklif.icerik.teklifIsBaslangic !=""){
        teklifIsBaslangic= moment(new Date( Date.parse(teklif.icerik.teklifIsBaslangic))).format('DD.MM.YYYY')
    }
    let teklifIsBitis = "";
    if(teklif.icerik.teklifIsBitis !=""){
        teklifIsBitis= moment(new Date( Date.parse(teklif.icerik.teklifIsBitis))).format('DD.MM.YYYY')
    }
    //teklif adı
    //acentaCalisanID
    //
    console.log("--"+teklif.calisanEposta)
   if(teklif.calisanEposta){ $('[aria-name="teklifAcentaCalisanMail"]').text(nameReplace(teklif.calisanEposta))}
   $('[aria-name="teklifAdi"]').val(nameReplace(teklif.teklifAdi)+` (Rev ${teklif.revizeNo})`)
   if(teklif.icerik.teklifAcentaAdi){$('[aria-name="teklifAcentaAdi"]').text(nameReplace(teklif.icerik.teklifAcentaAdi))}
   if(teklif.icerik.teklifAcentaCalisanAdi){$('[aria-name="teklifAcentaCalisanAdi"]').text(nameReplace(teklif.icerik.teklifAcentaCalisanAdi))}
   $('[aria-name="teklifKurulumTarihi"]').text(`${teklifIsKurulumBaslangic}->${teklifIsKurulumBitis}`)
   $('[aria-name="teklifEtkinlikAdi"]').text(nameReplace(teklif.icerik.teklifAdi))
   $('[aria-name="teklifYazanAdi"]').text(nameReplace(teklif.icerik.teklifYazanAdi))
   if(teklif.icerik.teklifLokasyon){$('[aria-name="teklifLokasyon"]').text(nameReplace(teklif.icerik.teklifLokasyon))}
   $('[aria-name="teklifIsTarihi"]').text(`${teklifIsBaslangic}->${teklifIsBitis}`)
   $('[aria-name="teklifTarihi"]').text(moment(teklifTarihi).format('DD.MM.YYYY'))
   $('[aria-name="teklifGecerlilikSuresi"]').text(teklif.icerik.teklifGecerlilik+" Gün")
   $('[aria-name="teklifRevizeNo"]').text(teklif.revizeNo)
  
}
function teklifSalonHizmetOlustur(hizmet,salonIndex,index){
    //let hizmetFiyati = 0
    //hizmet["hizmetFiyati"]=parseFloat(hizmet["hizmetFiyati"])
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
            text:"Seçilen salon olmadığı için hizmet ekleyemezsiniz",
            confirmButtonText: 'Tamam'
        })
        
        return;
    }
    
    //eğer hizmet grubu butonu daha önce oluşturulmamışsa önce hizmet grubunu oluştur
    if($(`#salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Button`).length == 0) {
       let obj = teklif.icerik.teklifIcerik[salonIndex].hizmetGrupFiyatlari.find(x => x.grupID === hizmet.hizmetGrupID);
       let grupPos = teklif.icerik.teklifIcerik[salonIndex].hizmetGrupFiyatlari.indexOf(obj);
     //  console.log(teklif.icerik.teklifIcerik[salonIndex].hizmetGrupFiyatlari[grupPos])
         console.log(teklif.icerik.teklifIcerik[salonIndex].hizmetGrupFiyatlari[grupPos].grupToplam)
        collapseButton = `
        <div clas="d-flex flex-row">
            <button class="btn btn-outline-secondary btn-sm col-10 mt-2" id="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Button" type="button" data-toggle="collapse" data-target="#salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Content" aria-expanded="true" aria-controls="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-Content">
            ${nameReplace(hizmet.hizmetGrubu)}
            </button>
            
                <span class=" col-2 mt-2">${formatPrice.format(teklif.icerik.teklifIcerik[salonIndex].hizmetGrupFiyatlari[grupPos].grupToplam)}</span>
            
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
        hizmetret = `
            <div id="salon-${salonIndex}-hizmetGrup-${hizmet.hizmetGrupID}-hizmet-${hizmet.ID}-Container" >
                <div class="row">
                    <div class="col-md-4"> ${nameReplace(hizmet.hizmetAdi)}</div>
                    <div class="col-md-2"><span>${hizmet["adet"]}</span> </div>
                    <div class="col-md-2"><span>${hizmet["gunSayisi"]}</span></div>
                    <div class="col-md-4">
                        <div class="d-flex">
                            <span class="d-inline">${formatPrice.format(hizmetFiyati)}</span>
                            
                            <span class="d-inline ml-3">${formatPrice.format(hizmetFiyatToplam)}</span>
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
function teklifSalonOlustur(){
    let formatPrice=new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        minimumFractionDigits: 2,
    });
    $('#teklifAraFiyat').text(formatPrice.format(teklif.icerik.teklifAraToplam))
    $('#teklifIndirim').text(formatPrice.format(teklif.icerik.teklifIndirim))
    $('#teklifAnaFiyat').text(formatPrice.format(teklif.icerik.teklifAnaToplam))
    $('[aria-name="yeniTeklifTabList"]').html("")
    $('[aria-name="yeniTeklifTabContent"]').html("")
    teklif.icerik.teklifIcerik.forEach(icerik)

    function icerik(item, index, arr) {
        console.log(item)
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
        <div class="tab-pane fade ${show}" id="custom-nav-${index}" role="tabpanel" aria-labelledby="custom-nav-${index}-tab">
            
                <div class="row">
                    <div class="col-4"><span class="d-inline">Salon Ara Toplam : <span aria-name="salonAraFiyat" >${formatPrice.format(teklif.icerik.teklifIcerik[index].salonAraFiyat)}</span></span></div>
                    <div class="col-4"><span class="d-inline">Salon İndirim : <span aria-name="salonIndirimFiyat" >${formatPrice.format(teklif.icerik.teklifIcerik[index].salonIndirim)}</span></span></div>
                    <div class="col-4"><span class="d-inline">Salon TOPLAM : <span aria-name="salonIndirimFiyat" >${formatPrice.format(teklif.icerik.teklifIcerik[index].salonFinalFiyat)}</span></span></div>
                </div>
                
            
        </div>`;
        
        $('[aria-name="yeniTeklifTabList"]').append(tab)
        $('[aria-name="yeniTeklifTabContent"]').append(content)
        if(item.icerik.length >0){
            let salonIndex=index
            item.icerik.forEach((item, index, arr) => {
                teklifSalonHizmetOlustur(item,salonIndex,index)
             });
        }
    }

   
}


//seçilen teklifin detayını görüntüle uuid ile istem yap
function teklifLoad(){
   
    formData = new FormData();
    formData.append("teklifVeriBul","1");
    formData.append("search","uuid")
    formData.append("query",uuid)
    makeAjax(formData).then((data) => { 
        anaTeklifTemizle()
        //console.log(data.result[0])
        teklif= data.result[0]
        sessionStorage.setItem("teklif", JSON.stringify(teklif));
        $('[aria-name="TaslakTeklifDuzenle"]').attr('aria-teklifid', teklif.ID);
        teklifYerlestir()
        teklifSalonOlustur()
        
    })
}
//taslak tekliflerin gösterildiği tabloyu oluştur
function taslakLoad(){
    if ( ! $.fn.DataTable.isDataTable( '#taslakTeklifTable' ) ) {
        initTaslakTeklifTable()
    }
    
    formData = new FormData();
    formData.append("teklifListe","1")
    makeAjax(formData).then((data) => { 
        //console.log(data)
        taslakTeklifTable.clear().draw()
        taslakTeklifTable.rows.add( data.data ).draw();
    })
}
//bekleyen tekliflerin gösterildiği tabloyu oluştur
function bekleyenLoad(){
    if ( ! $.fn.DataTable.isDataTable( '#bekleyenTeklifTable' ) ) {
        initBekleyenTeklifTable()
    }
    
    formData = new FormData();
    formData.append("teklifListe","2")
    makeAjax(formData).then((data) => { 
        bekleyenTeklifTable.clear().draw()
        bekleyenTeklifTable.rows.add( data.data ).draw();
    })
}
//onaylanan tekliflerin gösterildiği tabloyu oluştur
function onaylananLoad(){
    if ( ! $.fn.DataTable.isDataTable( '#onaylananTeklifTable' ) ) {
        initOnaylananTeklifTable()
    }
    
    formData = new FormData();
    formData.append("teklifListe","3")
    makeAjax(formData).then((data) => { 
        onaylananTeklifTable.clear().draw()
        onaylananTeklifTable.rows.add( data.data ).draw();
    })
}
//geçersiz tekliflerin gösterildiği tabloyu oluştur
function gecersizLoad(){
    if ( ! $.fn.DataTable.isDataTable( '#gecersizTeklifTable' ) ) {
        initGecersizTeklifTable()
    }
    
    formData = new FormData();
    formData.append("teklifListe","4")
    makeAjax(formData).then((data) => { 
        gecersizTeklifTable.clear().draw()
        gecersizTeklifTable.rows.add( data.data ).draw();
    })
}
function tumTekliflerLoad(yil=0){
    if ( ! $.fn.DataTable.isDataTable( '#tumTeklifTable' ) ) {
        initTumTeklifTable()
    }
    
    if(yil == 0){
       yil = new Date().getFullYear();
       addYearsToTable("#tumTeklifTable_wrapper")
    }
    formData = new FormData();
    formData.append("teklifListe","-1")
    formData.append("teklifYil",yil)
    makeAjax(formData).then((data) => { 
        tumTeklifTable.clear().draw()
        if(data.status==1){
            tumTeklifTable.rows.add( data.data ).draw();
            //tumTeklifTable.rowGroup.dataSrc='teklifAdi';
            //tumTeklifTable.draw(true);
            tumTekliflerFilter(data.data)
        }
    })
}

function ayAdi(tarih){

    let ret = "Tarihsiz"
    
    return ret
}
function addYearsToTable(tablename){
    let forms = `
    <form id="teklifYearForm">
        <div class="form-group row">
            <label class="col-sm-2 col-form-label">&nbsp; Yıl Seçiniz:</label>
            <div class="col-sm-10">
                <select class="form-control input-sm"  aria-name="tableYearFilter"></select>
            </div>
        </div>
    </form>`
    if( $('#teklifYearForm').length ){
        $('[aria-name="tableYearFilter"]').empty()
    }
    else{
        $(tablename).prepend(forms);
    }
    const d = new Date();
    let year = d.getFullYear();
    for (let i = 0; i < 10; i++) {
        let years = year-i;
        let selected = "";
        if(years == year){ selected = "selected";}
        $('[aria-name="tableYearFilter"]').append('<option value="' + years + '" '+selected+'>' + years + '</option>');
    }
    //$(tablename).prepend('<select class="form-control input-sm"  aria-name="tableYearFilter"></select>');
    //$(tablename).prepend('<label>&nbsp; Yıl:</label>');

    /*am_aplicacion_ids = [{0: 'All Apps'}, {1: 'App ID 1'}, {2: 'App ID 2'}];
    for (var key in am_aplicacion_ids) {
        var obj = am_aplicacion_ids[key];
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                $('[aria-name="tableYearFilter"]').append('<option value="' + prop + '">' + obj[prop] + '</option>');
            }
        }
    }*/
}
function tumTekliflerFilter(data){
    let aylar = []
    
    data.forEach((element,index) => {
        //console.log(element)
        //
        if(element.baslangicTarihi == "-"){
            aylar.indexOf("00") === -1 ? aylar.push("00") : null;
        }
        else{
            let ay = element.baslangicTarihi.split(".");
            aylar.indexOf(ay[1]) === -1 ? aylar.push(ay[1]) : null;
        }
        //data.yazimTarihi üzerinden filtreleniyor
        //let btn ={
        //    text:element.text,
        //    className:element.className,
        //action: function ( e, dt, node, config ) {tableFilter(tumTeklifTable,4,element.action)}
       //}
        //tumTeklifTable.button().add( index+1, btn);
    });
    aylar.sort()
    let sonIndex=0;
    tumTeklifTable.buttons('.filters').remove();
    aylar.forEach((element,index) => {
        sonIndex = index+1
        let ayAdi = "Tarihsiz"
        switch(element) {
            case "00": ayAdi = "Tarihsiz"; break;
            case "01": ayAdi = "Ocak"; break;
            case "02": ayAdi = "Şubat"; break;
            case "03": ayAdi = "Mart"; break;
            case "04": ayAdi = "Nisan"; break;
            case "05": ayAdi = "Mayıs"; break;
            case "06": ayAdi = "Haziran"; break;
            case "07": ayAdi = "Temmuz"; break;
            case "08": ayAdi = "Ağustos"; break;
            case "09": ayAdi = "Eylül"; break;
            case "10": ayAdi = "Ekim"; break;
            case "11": ayAdi = "Kasım"; break;
            case "12": ayAdi = "Aralık"; break;
            default:
                ayAdi= "Tarihsiz";
          }
          let action = ""
          if(element !="00"){action ="."+element;}
          else{action ="-";}
        let btn ={
            text:ayAdi,
            className:"btn btn-sm btn-outline-secondary filters",
        action: function ( e, dt, node, config ) {tableFilter(tumTeklifTable,7,action)}
       }
        tumTeklifTable.button().add( index+1, btn);
    });
    let btn ={
        text:"Hepsi",
        className:"btn btn-sm btn-outline-secondary filters",
        action: function ( e, dt, node, config ) {tableFilter(tumTeklifTable,7,"")}
    }
    tumTeklifTable.button().add( sonIndex+1, btn);
    console.log("aylar",aylar)
    
}