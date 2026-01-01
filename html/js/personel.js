
//#region PERSONEL eventHandler
$( ".personelEkleButton" ).on( "click", function() {
	debuging("eventHandler:","personelEkleButton",true)
	personelDepartmanAra.val('').trigger('change');
	personelGorevAra.empty().append(new Option()).trigger('change');
    $('#modal-Personel-Ekle').modal('show')
});

$('#personelEkleForm').submit(function (e) {
   e.preventDefault();
   personelEkle(e)
});
$('#personelDuzenleForm').submit(function (e) {
   e.preventDefault();
   personelDuzenleKaydet(e)
});
//personelDuzenleButtonGonder
// Statik modül event handler'ları kaldırıldı - artık dinamik olarak çalışıyor

//Personel Yetki Tab başlıklarına tıklandığında detay alanını aç
///////////////// HER .card-header CLASSINI KULLANDIĞINDA BU FONSİYON ÇALIŞACAK ONUN YERİNE aria-name   KULLANSAN DAHA İYİ OLUR GİBİ ///////////////////
$('.card-header').on('click', function() {
    var modulAdi = $(this).closest('.card').find('input[type="checkbox"]').attr('id').replace('yetki', '').toLowerCase();
    var anaCheckbox = $('#yetki' + modulAdi.charAt(0).toUpperCase() + modulAdi.slice(1));
    var detayDiv = $('#' + modulAdi + 'Detay');
    
    // Eğer detay alanı gizliyse aç, açıksa kapat
    if (detayDiv.is(':hidden')) {
        detayDiv.show();
        anaCheckbox.prop('checked', true);
    } else {
        detayDiv.hide();
        anaCheckbox.prop('checked', false);
        // Detay yetkilerini de temizle
        detayDiv.find('input[type="checkbox"]').prop('checked', false);
    }
});
//#endregion


//#region PERSONEL functions
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
// personel yetkilendirme modüllerini çek
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
// Personel yetkilerini kaydeden fonksiyon
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