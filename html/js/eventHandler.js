
window.onbeforeunload = function(){
	
}
$(document).ready(function() {

	kullaniciMail =  sessionStorage.getItem("jwtEmail");
	kullaniciAdi =sessionStorage.getItem("jwtkullaniciAdi");
	userID = sessionStorage.getItem("jwtuserID");
	sirketID = sessionStorage.getItem("jwtsirketID");
	var sWidth = $(window).width();

	var sHeight = $(window).height();


	if(kullaniciMail && kullaniciMail=="" && currentPage!="/giris/"){
	 
	 window.location.replace("../../giris/");
	 return;
	}
	else{
		if(currentPage!="/giris/"){


			genelLoad()
			//dovizYenile() 
			
		}
		//takvimStartUp()
		if(currentPage=="/"|| currentPage == "/index/"){
			takvimStartUp()
		}

		if(currentPage=="/firma/"){
			if ( ! $.fn.DataTable.isDataTable( '#acentaListe' ) ) {
				initacentalisteTable()
			}
			$("#sayfaBasligi").text(`Firma Listesi`)
			acentaListele()
		}
		if(currentPage=="/hizmet/"){
			if ( ! $.fn.DataTable.isDataTable( '#hizmetListe' ) ) {
				inithizmetlisteTable()
			}
			$("#sayfaBasligi").text(`Hizmet Listesi`)
			hizmetListele()
		}
		if(currentPage=="/yeniteklif/"){
			yeniTeklifLoad()
		}

		if(currentPage=="/teklif/"){
			debuging("/teklif/${uuid} -","*")
			if(uuid !="-1"){
				$("#sayfaBasligi").text(`Teklif Detayları`)
				teklifLoad()
			}else{
				ToastCenterSpecialButton.fire({
					icon: "error",
					title: "Teklif Bulunmadı...",
					html:`<p>lütfen geçerli bir teklif seçiniz</p>`,
	
					confirmButtonText: 'Devam'
				})
			}
		}
		if(currentPage=="/taslak/"){
			$("#sayfaBasligi").text(`Taslak Teklif`)
			taslakLoad()
		}
		if(currentPage=="/bekleyen/"){
			$("#sayfaBasligi").text(`Bekleyen Teklifler`)
			bekleyenLoad()
		}
		if(currentPage=="/onaylanan/"){
			$("#sayfaBasligi").text(`Onaylanan Teklifler`)
			onaylananLoad()
		}

		if(currentPage=="/gecersiz/"){
			$("#sayfaBasligi").text(`Geçersiz Teklifler`)
			gecersizLoad()
		}

		if(currentPage=="/personel/"){
			if ( ! $.fn.DataTable.isDataTable( '#personelListe' ) ) {
				initpersonelisteTable()
			}
			$("#sayfaBasligi").text(`Personel İşlemleri`)
			personelListele()
		}
		if(currentPage=="/tumteklifler/"){
			$("#sayfaBasligi").text(`Tüm Teklifler`)
			tumTekliflerLoad()
		}
		if(currentPage=="/kasa/"){
			if ( ! $.fn.DataTable.isDataTable( '#kasaListe' ) ) {
				initkasaListeTable()
			}
			$("#sayfaBasligi").text(`Kasa İşlemleri`)
			kasaListele()
		}
		if(currentPage=="/odemecesit/"){

			if ( ! $.fn.DataTable.isDataTable( '#odemeCesitListe' ) ) {
				initodemeCesitListeTable()
			}
			$("#sayfaBasligi").text(`Ödeme Çeşitleri`)
			odemeCesidiListele()
			initOdemeCesidiSelect()
		}

		if(currentPage=="/masraf/"){

			if ( ! $.fn.DataTable.isDataTable( '#masrafListe' ) ) {
				initmasrafTable()
			}
			$("#sayfaBasligi").text(`Masraf Kartları`)
			masrafListe()
			//initOdemeCesidiSelect()
		}
		if(currentPage=="/tahsilat/"){

			if ( ! $.fn.DataTable.isDataTable( '#tahsilatListe' ) ) {
				inittahsilatTable()
			}
			$("#sayfaBasligi").text(`Tahsilat Kartları`)
			tahsilatListesiBak()
			//initOdemeCesidiSelect()
		}
		if(currentPage=="/tahsilatcesit/"){

			if ( ! $.fn.DataTable.isDataTable( '#tahsilatCesitListe' ) ) {
				inittahsilatCesitListeTable()
			}
			$("#sayfaBasligi").text(`Tahsilat Çeşitleri`)
			tahsilatCesidiBak()
			//initOdemeCesidiSelect()
		}
		if(currentPage=="/banka-hesaplari-raporu/" || currentPage=="/banka-hesaplari-raporu.php"){
			if ( ! $.fn.DataTable.isDataTable( '#bankaHesaplariRaporuTable' ) ) {
				initBankaHesaplariRaporuTable()
			}
			$("#sayfaBasligi").text(`Banka Hesapları Raporu`)
			bankaHesaplariRaporuLoad()
		}
		console.log("Current page kontrol ediliyor:", currentPage);
		if(currentPage=="/tahsilat-raporu/" || currentPage=="/tahsilat-raporu.php"){
			console.log("Tahsilat raporu sayfası yükleniyor");

			if ( ! $.fn.DataTable.isDataTable( '#tahsilatRaporTablosu' ) ) {
				console.log("DataTable başlatılıyor...");
				initTahsilatRaporuTable()
				console.log("DataTable başlatıldı, tahsilatRaporuTable:", typeof tahsilatRaporuTable);
			} else {
				console.log("DataTable zaten mevcut");
			}
			$("#sayfaBasligi").text(`Tahsilat Raporu`)
			console.log("Firma listesi yükleniyor...");
			tahsilatRaporuFirmaListesiYukle()
			tahsilatRaporuLoad()
		}
		
		if(currentPage=="/masraf-raporu/" || currentPage=="/masraf-raporu.php"){
			console.log("Masraf raporu sayfası yükleniyor");

			if ( ! $.fn.DataTable.isDataTable( '#masrafRaporTablosu' ) ) {
				console.log("DataTable başlatılıyor...");
				initMasrafRaporuTable()
				console.log("DataTable başlatıldı, masrafRaporuTable:", typeof masrafRaporuTable);
			} else {
				console.log("DataTable zaten mevcut");
			}
			$("#sayfaBasligi").text(`Masraf Raporu`)
			masrafRaporuLoad()
		}
	}
	
});
$(window).focus(function() {
	debuging("focus:",currentPage)	
});
$(window).blur(function() { 
	debuging("blur:",currentPage)	
	
});
$( ".cikisYap" ).on( "click", function() {
	var formData = new FormData();
	formData.append("cikis","1");
	let ser = JSON.stringify(Object.fromEntries(formData))
    $.ajax({
		type: "POST",
        url: "../loginWorker/",
        data: ser,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        processData: true,
		success: function(data)
		{ window.location.replace(data.data);}
	});
  } 
);
//#region ACENTA
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

//#region HİZMET
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



//#region PERSONEL
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
//#endregion

//#region KASA
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

//#region Masraf Kartı
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


//
//
//#endregion

//#region Mutabakat
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

//#region Tahsilat
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

//#region TEKLİF
$( ".dovizYenile" ).on( "click", function() {
	debuging("eventHandler:","dovizYenile")
	dovizYenile()
});
$("#yeniTerminTarihi").on("change.datetimepicker", ({date, oldDate}) => {              
		
		let terminDate = moment(date).format('MM/DD/YYYY');
		teklifTaslak.teklifTerminSuresi = terminDate
		let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
		debuging(`teklifYazBasla teklifTermin.Body.onchange:`,teklifTaslakCopy,true)
		sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
})
$( ".teklifYaz" ).on( "click", function() {
	debuging("eventHandler:","teklifYaz")
	teklifYazBasla(0,0)
});
$('#teklifAcentaCalisanDevam').on( "click", function() {
	debuging("eventHandler:","teklifAcentaCalisanDevam")
    teklifSayfasınaGit()
});
$('[aria-name="yeniTeklifAdiDuzenle"]').on( "click", function() {
	$('[aria-name="yeniTeklifAdi"]').toggleClass('d-none',true)
    $('[aria-name="yeniTeklifAdContainer"]').toggleClass('d-none',false)
    $('[aria-name="yeniTeklifAdiInput"]').val(teklifTaslak.teklifAdi)
	$('[aria-name="yeniTeklifAdiDuzenle"]').toggleClass('d-none',true)
});
$('[aria-name="yeniTeklifGelismisDuzenle"]').on( "click", function() {
	$('[aria-name="yeniTeklifAdiInput"]').val(teklifTaslak.teklifAdi)
	$('#modal-yeniTeklif-Gelismis').modal('show')
});
$('body').on('change', '[aria-name="yeniTeklifAdiDegistirInput"]',function(){
	teklifTaslak.teklifAdi = $('[aria-name="yeniTeklifAdiDegistirInput"]').val()
	teklifTaslak.teklifEventAdi = $('[aria-name="yeniTeklifAdiDegistirInput"]').val()
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("yeniTeklifAdiDegistir:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	$('[aria-name="yeniTeklifAdi"]').val(teklifTaslak.teklifAdi+` (Rev ${teklifTaslak.teklifRevize})`)
});
$('body').on('change', '[aria-name="yeniTeklifKurulumKatsayi"]',function(){
	var katsayi = $(this).val();
	teklifTaslak.teklifKurulumCarpan = parseFloat(katsayi);
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("yeniTeklifKurulumKaysayi:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
})
$('body').on('change', '[aria-name="yeniTekliflokasyon"]',function(){
	var lokasyon = $(this).val();
	teklifTaslak.teklifLokasyon = lokasyon;
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("YeniTeklifLokasyon:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
})
//aria-name="teklifDurumSec"
$('body').on('change', '[aria-name="teklifDurumSec"]',function(){
	var durum = $(this).val();
	var teklifID = $(this).attr('aria-id');
	teklifDurumGuncelle(durum,teklifID)
	//formData.append("taslakTeklifDurumGuncelle","1");
	//formData.append("teklifID",teklifID);
	//formData.append("teklifDurum","3");
})
$('body').on('change', '[aria-name="tableYearFilter"]',function(){
	var yil = $(this).val();
	tumTekliflerLoad(yil)
})
$('[aria-name="teklifOnizleButton"]').on( "click", function() {
	$('#modal-Teklif-Onizleme').modal('show')
})
$('[aria-name="yeniTeklifSalonEkleButton"]').on( "click", function() {
	debuging("eventHandler:","YeniSalonEkle Göster")
	$('[aria-name="yeniTeklifSalonEkleButton"]').prop('disabled', true);
	$('[aria-name="yeniTeklifSalonEkleAdi"]').toggleClass("d-none",false)
	$('[aria-name="yeniSalonEkleInputKaydet"]').toggleClass("d-none",false)
	$(`input[name='yeniTeklifSalonEkleAdi']`).focus()
})
$(`input[name='yeniTeklifSalonEkleAdi']`).on('keypress',function(e) {
    if(e.which == 13) {
        //alert('You pressed enter!');
		yeniTeklifSalonEkle()
    }
});
$('[aria-name="yeniSalonEkleInputKaydet"]').on( "click", function() {
	yeniTeklifSalonEkle()
	
})
$('#teklifHizmetFilterBox').keyup(function(){
	teklifHizmetTable.search($(this).val()).draw() ;
})
$('body').on('change', '[aria-name="salonIndirimGuncelle"]',function(){
	var salonID = $(this).attr('aria-salon');
	teklifTaslak.teklifIcerik[salonID].salonIndirim = parseInt($(this).val())
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("salonİndirimGüncelle:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	salonToplamHesapla()
	sadeceSalonHesapla()
})
$('body').on('change', '[aria-name="teklifAnaIndirimGuncelle"]',function(){
	let val = $('[aria-name="teklifAnaIndirimParaBirimi"]').attr("aria-state")
	if(val == "cash"){

		teklifTaslak.teklifIndirim = parseInt($(this).val())
		teklifTaslak.teklifAnaToplam = teklifTaslak.teklifAraToplam - teklifTaslak.teklifIndirim
	}
	if(val == "percent"){
		let percent = parseInt($(this).val())
		teklifTaslak.teklifIndirim = (teklifTaslak.teklifAraToplam/100)*percent
		teklifTaslak.teklifAnaToplam =teklifTaslak.teklifAraToplam -teklifTaslak.teklifIndirim
	}
	$('[aria-name="teklifAnaFiyatGuncelle"]').val(teklifTaslak.teklifAnaToplam)
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("teklifAnaİndirimGüncelle:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	//salonToplamHesapla()
	//sadeceSalonHesapla()
})

$('body').on('click', '[aria-name="teklifAnaIndirimParaBirimi"]',function(){
	let val = $('[aria-name="teklifAnaIndirimParaBirimi"]').attr("aria-state")
	if(val == "cash"){
		$('[aria-name="teklifAnaIndirimParaBirimi"]').attr("aria-state","percent")
		$('[aria-name="teklifAnaIndirimParaBirimi"]').html(" % ")
		$('[aria-name="teklifAnaIndirimGuncelle"]').val(0)
		teklifTaslak.teklifAnaToplam = teklifTaslak.teklifAraToplam
		$('[aria-name="teklifAnaFiyatGuncelle"]').val(teklifTaslak.teklifAnaToplam)
		sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
		return;
	}
	if(val == "percent"){
		$('[aria-name="teklifAnaIndirimParaBirimi"]').attr("aria-state","cash")
		$('[aria-name="teklifAnaIndirimParaBirimi"]').html(" ₺ ")
		$('[aria-name="teklifAnaIndirimGuncelle"]').val(0)
		teklifTaslak.teklifAnaToplam = teklifTaslak.teklifAraToplam
		$('[aria-name="teklifAnaFiyatGuncelle"]').val(teklifTaslak.teklifAnaToplam)
		sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
		return;
	}
	//console.log("aria-state:"+val)
})
$('body').on('click', '[aria-name="hizmetSil"]',function(){
	var salonID = $(this).attr('aria-salon');
	var hizmetGrup = $(this).attr('aria-hizmetGrup');
	var hizmetID = $(this).attr('aria-hizmetID');
	$( `#salon-${salonID}-hizmetGrup-${hizmetGrup}-hizmet-${hizmetID}-Container`).remove();
	let obj = teklifTaslak.teklifIcerik[salonID].icerik.find(x => x.ID == hizmetID);
	let index = teklifTaslak.teklifIcerik[salonID].icerik.indexOf(obj);
	teklifTaslak.teklifIcerik[salonID].icerik.splice(index, 1);
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("hizmetSil:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	taslakFiyatHesapla()
})
$('body').on('click', '[aria-name="salonSil"]',function(){

	
	var salonID = $(this).attr('aria-salon');
	debuging("eventHandler:",`salon sil: salonID->${salonID}`)
	if(salonID ==0){ 
		teklifTaslak.teklifIcerik[salonID].icerik=[] 
		tekSalonYerlestir(salonID)
		/*$( `#custom-nav-${salonID}`).html(`<div class="d-flex justify-content-end" >
		<button type="button" class="btn-sm-round d-inline ml-1 btn-success" aria-name="salonHizmetEkle" aria-salon="${salonID}">
			<i class="fa fa-plus" ></i>
		</button>
		<button type="button" class="btn-sm d-inline ml-1 btn-warning" aria-name="salonDuzenle" aria-salon="${salonID}">
			<i class="fa fa-edit" ></i>
		</button>   
		<button type="button" class="btn-sm d-inline ml-1 btn-danger" aria-name="salonSil" aria-salon="${salonID}">
			<i class="fa-regular fa-trash-can" ></i>
		</button>  
		</div>`);*/
	}
	else if(salonID ==1 ){ 
		teklifTaslak.teklifIcerik[salonID].icerik=[] 
		tekSalonYerlestir(salonID)
		/*$( `#custom-nav-${salonID}`).html(`<div class="d-flex justify-content-end" >
		<button type="button" class="btn-sm d-inline ml-1 btn-outline-warning" aria-name="salonDuzenle" aria-salon="${salonID}">
			<i class="fa fa-edit" ></i>
		</button>   
		<button type="button" class="btn-sm d-inline ml-1 btn-outline-danger" aria-name="salonSil" aria-salon="${salonID}">
			<i class="fa-regular fa-trash-can" ></i>
		</button>  
		</div>`);*/

	}
	else{
		debuging("eventHandler:",`salonu komple sil -> ${teklifTaslak.teklifIcerik.salonAdi}`)
		teklifTaslak.teklifIcerik.splice(salonID, 1)
		$( `#custom-nav-${salonID}-tab`).remove();
		$( `#custom-nav-${salonID}`).remove();
		$('#custom-nav-0-tab').tab('show');
		teklifSecilenSalon(0)
		
	}
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("salonSil:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	taslakFiyatHesapla()
})
$('body').on('click', '[aria-name="hizmetGrupSil"]',function(){
	var salonID = $(this).attr('aria-salon');
	var hizmetGrup = $(this).attr('aria-hizmetGrup');
	debuging("eventHandler:",`hizmet grup sil: salonID->${salonID} hizmetGrup:${hizmetGrup}`)
	//let obj = teklifTaslak.teklifIcerik[salonID].icerik.find(x => x.hizmetGrupID == hizmetGrup);
	var indices = teklifTaslak.teklifIcerik[salonID].icerik.map((e, i) => e.hizmetGrupID == hizmetGrup ? i : '').filter(String)
	debuging("indices:",indices)
	debuging("hizmetGrupSil:",teklifTaslak.teklifIcerik[salonID].icerik)
	teklifTaslak.teklifIcerik[salonID].icerik.reduceRight((lastElem, elem, index) => {
		debuging("index",index)
		if(lastElem){
			if (indices.includes(index+1)) {
				teklifTaslak.teklifIcerik[salonID].icerik.splice(index+1, 1);
			}
		}
		if (indices.includes(index)) { //Our condition(s)
			teklifTaslak.teklifIcerik[salonID].icerik.splice(index, 1);
		}
	});
	/*indices.forEach(element=>{
		teklifTaslak.teklifIcerik[salonID].icerik.splice(element, 1)
	})*/
	$( `#salon-${salonID}-hizmetGrup-${hizmetGrup}-Button`).remove();
	$( `#salon-${salonID}-hizmetGrup-${hizmetGrup}-Content`).remove();
	$( `#salon-${salonID}-hizmetGrup-${hizmetGrup}-hizmetAraFiyat`).remove();

	//salon-0-hizmetGrup-1-hizmetAraFiyat
	/*	
		teklifTaslak.teklifIcerik.splice(salonID, 1)
		$( `#custom-nav-${salonID}-tab`).remove();
		$( `#custom-nav-${salonID}`).remove();
	*/
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("eventhandler hizmetGrupSil:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	
	taslakFiyatHesapla()
})
$('body').on('click', '[aria-name="salonKopyala"]',function(){
	var salonID = $(this).attr('aria-salon');
	debuging("salonKopyala:",`salonKopyala id ${salonID}`)

	let salon = {
        salonAdi:"",
        icerik:[],
        salonGun:teklifTaslak.teklifIsGun,
        hizmetGrupFiyatlari:[],
        salonAraFiyat:0,
        salonIndirim:0,
        salonFinalFiyat:0
    }
	
	//salon = Object.assign({}, teklifTaslak.teklifIcerik[salonID])
	salon = JSON.parse(JSON.stringify(teklifTaslak.teklifIcerik[salonID]))
	salon.salonAdi = `${salon.salonAdi}-Kopya(${makeid(4)})`
	debuging("salonKopyala:",salon)
    teklifTaslak.teklifIcerik.push(salon);
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("salonKopyala:",teklifTaslakCopy)
    sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
    teklifSalonYerlestir()
	taslakFiyatHesapla()
	
})
$('body').on('click', '[aria-name="salonDuzenle"]',function(){
	var salonID = $(this).attr('aria-salon');
	debuging("salonDuzenle:",`duzenlenen id ${salonID}`)
	$('#yeniTeklifSalonAdi').val(teklifTaslak.teklifIcerik[salonID].salonAdi)
	$('#yeniTeklifSalonGun').val(teklifTaslak.teklifIcerik[salonID].salonGun)
	$('#taslakTeklifSalonDuzenleID').val(salonID)
	$('#modal-yeniTeklif-SalonDuzenle').modal('show')
})
$('body').on('click', '[aria-name="salonDuzenleKaydet"]',function(){
	var salonID = $('#taslakTeklifSalonDuzenleID').val();
	var salonAdı = $('#yeniTeklifSalonAdi').val();
	var salonGun = parseInt($('#yeniTeklifSalonGun').val())
	if($('#yeniTeklifSalonGun').val()==""){salonGun=1}
	$('#taslakTeklifSalonDuzenleID').val("")
	$('#yeniTeklifSalonAdi').val("")
	$('#yeniTeklifSalonGun').val("")
	$(`#custom-nav-${salonID}-tab`).text(salonAdı)
	teklifTaslak.teklifIcerik[salonID].salonAdi=salonAdı
	teklifTaslak.teklifIcerik[salonID].salonGun=salonGun
	teklifTaslak.teklifIcerik[salonID].icerik.forEach((item,index)=>{
		teklifTaslak.teklifIcerik[salonID].icerik[index].gunSayisi=salonGun
		$(`#salon-${salonID}-hizmetGrup-${item.hizmetGrupID}-hizmet-${item.ID}-Gun`).val(salonGun)
		
	})
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("salonDüzenleKaydet:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	taslakFiyatHesapla()
})
//hizmetGrupEkle
$('body').on('click', '[aria-name="salonHizmetEkle"]',function(){
	var salonID =$(this).attr('aria-salon');
	var hizmetGrup = $(this).attr('aria-hizmetGrup');
	var hizmetGrupAdi = $(this).attr('aria-hizmetGrupAdi');

	$('#yeniTeklifDigerHizmetGun').val(teklifTaslak.teklifIcerik[salonID].salonGun)
	$('#yeniTeklifDigerHizmetAdet').val(1)
	$('#taslakTeklifdigerHizmetSalonID').val(salonID)
	$('#taslakTeklifdigerHizmetgrupID').val(hizmetGrup)
	$('#taslakTeklifdigerHizmetgrupAdi').val(hizmetGrupAdi)
	
	$('#modal-yeniTeklif-digerHizmetEkle').modal('show')
	//
})
$('body').on('click', '[aria-name="digerHizmetEkleKaydet"]',function(){
	
	var salonID =$('#taslakTeklifdigerHizmetSalonID').val();
	var hizmetGrup = $('#taslakTeklifdigerHizmetgrupID').val();
	var hizmetGrupAdi = $('#taslakTeklifdigerHizmetgrupAdi').val()
	var hizmetGun = parseInt($('#yeniTeklifDigerHizmetGun').val())
	var hizmetAdet = parseInt($('#yeniTeklifDigerHizmetAdet').val())
	var hizmetAdi = $('#yeniTeklifDigerHizmetAdi').val()
	var hizmetFiyat = parseFloat($('#yeniTeklifDigerHizmetFiyat').val())|| 0;
	debuging("digerHizmetEkleKaydet:",`hizmetAdı:${hizmetAdi}`)
	if(hizmetAdi == ""){
		$('#modal-yeniTeklif-digerHizmetEkle').modal('show')
		return;
	}
	let item
	if(hizmetGun <=0){hizmetGun=1}
	if(hizmetAdet <=0){hizmetAdet=1}
	if(hizmetGrup ==""){
		item={
			ID:makeIntid(8),
			adet:hizmetAdet,
			gunSayisi:hizmetGun,
			hizmetAdi:hizmetAdi,
			hizmetFiyati:hizmetFiyat,
			hizmetGrubu:"Diğer Hizmetler",
			hizmetGrupID:digerHizmetlerGrupID,
			hizmetNotlari:""
		}
	}
	else{
		item={
			ID:makeIntid(8),
			adet:hizmetAdet,
			gunSayisi:hizmetGun,
			hizmetAdi:hizmetAdi,
			hizmetFiyati:hizmetFiyat,
			hizmetGrubu:hizmetGrupAdi,
			hizmetGrupID:hizmetGrup,
			hizmetNotlari:""
		}
	}
	teklifTaslak.teklifIcerik[salonID].icerik.push(item)
	teklifSalonHizmetEkle(item,salonID)
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("diğerHizmetEkleKaydet:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	$('#taslakTeklifdigerHizmetSalonID').val("");
	$('#taslakTeklifdigerHizmetgrupID').val("");
	$('#taslakTeklifdigerHizmetgrupAdi').val("")
	$('#yeniTeklifDigerHizmetGun').val("")
	$('#yeniTeklifDigerHizmetAdet').val("")
	$('#yeniTeklifDigerHizmetAdi').val("")
	$('#yeniTeklifDigerHizmetFiyat').val("")
	taslakFiyatHesapla()
})
/*$('#modal-yeniTeklif-digerHizmetEkle').on('hide.bs.modal', function () {
	$('#yeniTeklifDigerHizmetGun').val(1)
	$('#yeniTeklifDigerHizmetAdet').val(1)
	$('#taslakTeklifdigerHizmetSalonID').val("")
	$('#taslakTeklifdigerHizmetgrupID').val("")
})*/

$('body').on('change', '[aria-name="hizmetAdetGuncelle"]',function(){
	var salonID = $(this).attr('aria-salon');
	var hizmetGrup = $(this).attr('aria-hizmetGrup');
	var hizmetID = $(this).attr('aria-hizmetID');
	let inputID = `salon-${salonID}-hizmetGrup-${hizmetGrup}-hizmet-${hizmetID}-Adet`
	let obj = teklifTaslak.teklifIcerik[salonID].icerik.find(x => x.ID == hizmetID);
	let index = teklifTaslak.teklifIcerik[salonID].icerik.indexOf(obj);
	teklifTaslak.teklifIcerik[salonID].icerik[index].adet = parseInt($(`#${inputID}`).val())
	debuging("hizmetAdetGuncelle:",`Adet: ${$(`#${inputID}`).val()} salonID:${salonID} hizmetGrup:${hizmetGrup} hizmetID:${hizmetID}`)
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("hizmetAdetGüncelle:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	taslakFiyatHesapla()
})
$('body').on('change', '[aria-name="hizmetGunGuncelle"]',function(){
	var salonID = $(this).attr('aria-salon');
	var hizmetGrup = $(this).attr('aria-hizmetGrup');
	var hizmetID = $(this).attr('aria-hizmetID');
	debuging("hizmetGunGuncelle:",`salonID:${salonID}`)
	debuging("hizmetGunGuncelle:",`hizmetGrup:${hizmetGrup}`)
	debuging("hizmetGunGuncelle:",`hizmetID:${hizmetID}`)

	let inputID = `salon-${salonID}-hizmetGrup-${hizmetGrup}-hizmet-${hizmetID}-Gun`
	debuging("hizmetGunGuncelle:",`inputID:${inputID}`)
	let obj = teklifTaslak.teklifIcerik[salonID].icerik.find(x => x.ID == hizmetID);
	let index = teklifTaslak.teklifIcerik[salonID].icerik.indexOf(obj);
	teklifTaslak.teklifIcerik[salonID].icerik[index].gunSayisi = parseInt($(`#${inputID}`).val())
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("hizmetGünGüncelle:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	taslakFiyatHesapla()
})
$('body').on('change', '[aria-name="hizmetFiyatGuncelle"]',function(){
	var salonID = $(this).attr('aria-salon');
	var hizmetGrup = $(this).attr('aria-hizmetGrup');
	var hizmetID = $(this).attr('aria-hizmetID');
	debuging("hizmetFiyatGuncelle:",`salonID->${salonID} hizmetGrup:${hizmetGrup} hizmetID:${hizmetID}`)
	let inputID = `salon-${salonID}-hizmetGrup-${hizmetGrup}-hizmet-${hizmetID}-Fiyat`
	let obj = teklifTaslak.teklifIcerik[salonID].icerik.find(x => x.ID == hizmetID);
	let index = teklifTaslak.teklifIcerik[salonID].icerik.indexOf(obj);
	teklifTaslak.teklifIcerik[salonID].icerik[index].hizmetFiyati = parseFloat($(`#${inputID}`).val())
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("hizmetFiyatGuncelle:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	taslakFiyatHesapla()
})
$('body').on('change', '[aria-name="hizmetAraFiyatGuncelle"]',function(){
	var salonID = $(this).attr('aria-salon');
	var hizmetGrup = $(this).attr('aria-hizmetGrup');
	let grupFiyat = $(`#salon-${salonID}-hizmetGrup-${hizmetGrup}-hizmetAraFiyat`).val()
	let obj = teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari.find(x => x.grupID == hizmetGrup);
	let index = teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari.indexOf(obj);
	teklifTaslak.teklifIcerik[salonID].hizmetGrupFiyatlari[index].grupToplam = parseFloat(grupFiyat)
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("hizmetAraFiyatGüncelle:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	salonToplamHesapla()
})
$('body').on('change', '[aria-name="salonAraFiyatGuncelle"]',function(){
	var salonID = $(this).attr('aria-salon');
	var salonFiyat = $(`#salon-${salonID}-salonAraFiyat`).val()
	teklifTaslak.teklifIcerik[salonID].salonAraFiyat = parseFloat(salonFiyat)
	let teklifTaslakCopy = JSON.parse(JSON.stringify(teklifTaslak))
	debuging("salonAraFiyatGüncelle:",teklifTaslakCopy)
	sessionStorage.setItem("taslak", JSON.stringify(teklifTaslak));
	sadeceSalonHesapla()
})
$('body').on('click', '[aria-name="taslakTeklifKaydet"]',function(){
	debuging("taslakTeklifKaydet","*")
	if(teklifTaslak.ID==-1){
		let formData=new FormData();
		formData.append("taslakTeklifKaydet","1");
		if(teklifTaslak.teklifAdi == ""){
			teklifTaslak.teklifAdi =  makeid(8)
		}
		formData.append("teklifData",JSON.stringify(teklifTaslak))
		makeAjax(formData).then((data) => {
			//teklifTemizle()
			window.location.replace("../../teklif/?uuid="+data.data);
		})

	}
	else{
		/*
		TODO
		worker da teklif güncelle oluştur
		database class da telkif güncelle oluştur ve güncelleme işlemini yap
		responce olarak uuid döndür
		dönen uuid ile teklif/?uuid çağır
		*/
		let formData=new FormData();
		formData.append("taslakTeklifGuncelle",teklifTaslak.ID);
		if(teklifTaslak.teklifAdi == ""){
			teklifTaslak.teklifAdi =  makeid(8)
		}
		formData.append("teklifData",JSON.stringify(teklifTaslak))
		makeAjax(formData).then((data) => {
			debuging("taslakTeklifKaydet:",data)
			teklifTemizle()
			//window.location.replace("../../teklif/?uuid="+data.data);
		})
	}
});
$('body').on('click', '[aria-name="TaslakTeklifDuzenle"]',function(){
	debuging("TaslakTeklifDuzenle:","*")
	let teklifID= $(this).attr('aria-teklifid');
	teklifDuzenle(teklifID)
});
$('body').on('click', '[aria-name="TaslakTeklifRevizeBaslat"]',function(){
	debuging("TaslakTeklifRevizeBaslat:","*")
	let teklifID= $(this).attr('aria-teklifid');
	revizeOlustur(teklifID)
});
//
$('body').on('click', '[aria-name="TaslakTeklifGoruntule"]',function(){
	debuging("TaslakTeklifGoruntule:","*")
	let teklifuuid= $(this).attr('aria-teklifuuid'); 
	window.location.replace("../../teklif/?uuid="+teklifuuid);
});
$('#excelIndir').on('click',function(){
	$('#modal-wait').modal('show')
	$('#predownloadContainer').toggleClass('d-none',false)
	$('#indir').toggleClass('d-none',true)
	debuging("excelIndir:","*")
	let filter = $('input[name=raporCikti]:checked').val()
	let sablon = $('input[name=sablonCikti]:checked').val()
    var formData = new FormData();
	formData.append("teklifExcelYaz",uuid);
	formData.append("filtre",filter);
	formData.append("sablon",sablon);
    makeAjax(formData).then((data) => {
		let path ="../../assets/teklifler/"+sirketID;
		let dosyaAdi = data.dosyaAdi
		teklifIndir(path,dosyaAdi)
    })
})
//#endregion

//#region MENU
$('body').on('click', '[aria-name="TaslakTeklifBekleyen"]',function(){
	debuging("TaslakTeklifBekleyen:","*")
	let teklifID= $(this).attr('aria-teklifid');
	let formData=new FormData();
	formData.append("taslakTeklifDurumGuncelle","1");
	formData.append("teklifID",teklifID);
	formData.append("teklifDurum","2");
	makeAjax(formData).then((data) => {
		debuging("teklif güncellendi:","*")
		console.log(data)
		if(data.status==0){
			Toast.fire({
				icon: "error",
				text:data.message
			})
			return
		}
		Toast.fire({
			icon: "success",
			text:"Teklif Durumu 'Bekleyen' olarak Güncellendi"
		})
		
		if(currentPage=="/tumteklifler/"){
			tumTekliflerLoad()
		}
		if(currentPage=="/taslak/"){
			taslakTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/bekleyen/"){
			bekleyenTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/onaylanan/"){
			onaylananTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/gecersiz/"){
			gecersizTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
    })
});
$('body').on('click', '[aria-name="TaslakTeklifOnayla"]',function(){
	debuging("TaslakTeklifOnayla:","*")
	let teklifID= $(this).attr('aria-teklifid');
	let formData=new FormData();
	formData.append("taslakTeklifDurumGuncelle","1");
	formData.append("teklifID",teklifID);
	formData.append("teklifDurum","3");
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
			text:"Teklif Durumu 'Onaylanan' olarak Güncellendi"
		})
		if(currentPage=="/tumteklifler/"){
			tumTekliflerLoad()
		}
		if(currentPage=="/taslak/"){
			taslakTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/bekleyen/"){
			bekleyenTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/onaylanan/"){
			onaylananTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/gecersiz/"){
			gecersizTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
    })
});
$('body').on('click', '[aria-name="TaslakTeklifRed"]',function(){
	debuging("TaslakTeklifRed:","*")
	let teklifID= $(this).attr('aria-teklifid');
	let formData=new FormData();
	formData.append("taslakTeklifDurumGuncelle","1");
	formData.append("teklifID",teklifID);
	formData.append("teklifDurum","4");
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
			text:"Teklif Durumu 'Geçersiz' olarak Güncellendi"
		})
		if(currentPage=="/tumteklifler/"){
			tumTekliflerLoad()
		}
		if(currentPage=="/taslak/"){
			taslakTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/bekleyen/"){
			bekleyenTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/onaylanan/"){
			onaylananTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/gecersiz/"){
			gecersizTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
    })
});
$('body').on('click', '[aria-name="TaslakTeklifSil"]',function(){
	debuging("TaslakTeklifSil:","*")
	let teklifID= $(this).attr('aria-teklifid');
	let formData=new FormData();
	formData.append("taslakTeklifSil",teklifID);
	makeAjax(formData).then((data) => {
        debuging("teklif silindi:","*")
		if(data.status==0){
			Toast.fire({
				icon: "error",
				text:data.message
			})
			return
		}
		Toast.fire({
			icon: "success",
			text:data.message
		})
		if(currentPage=="/tumteklifler/"){
			tumTekliflerLoad()
		}
		if(currentPage=="/taslak/"){
			taslakTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/bekleyen/"){
			bekleyenTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/onaylanan/"){
			onaylananTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
		if(currentPage=="/gecersiz/"){
			gecersizTeklifTable.row(`#TeklifListID${teklifID}`).remove().draw()
		}
    })
});
$('body').on('click', '[aria-name="TaslakTeklifKopyala"]',function(){
	debuging("TaslakTeklifKopyala:","*")
	let teklifID= $(this).attr('aria-teklifid');
	teklifKopyala(teklifID)
	//aria-teklifid
	//window.location.replace("../../teklif/?uuid="+data.data);
});
$('body').on('click', '#indir',function(){
	$('#modal-wait').modal('hide')
	$('#indirDosyaAdi').text("")
	//$(this).attr("href", "")
	//$(this).attr("download", "")
});
$('body').on('click', '[aria-name="kullaniciHesapAc"]',function(){
	kullaniciHesapBak()
	
});
$('body').on('click', '[aria-name="hesapSifreDegistirKaydet"]',function(){
	hesapSifreDegistirKaydet()
	
});
$('body').on('click', '[aria-name="kullaniciEskiSifreToggle"]',function(){

	const type = $('#old-Password').attr('type')=== 'password' ? 'text' : 'password';
	if(type == "password"){
		//fa-eye-slash fa-eye
		$('[aria-name="kullaniciEskiSifreToggle"]').toggleClass('fa-eye-slash',false)
		$('[aria-name="kullaniciEskiSifreToggle"]').toggleClass('fa-eye',true)
	}
	else{
		$('[aria-name="kullaniciEskiSifreToggle"]').toggleClass('fa-eye-slash',true)
		$('[aria-name="kullaniciEskiSifreToggle"]').toggleClass('fa-eye',false)
	}
	$('#old-Password').attr('type',type)
	
	
});
$('body').on('click', '[aria-name="kullaniciSifre1Toggle"]',function(){

	const type = $('#new-password-1').attr('type')=== 'password' ? 'text' : 'password';
	if(type == "password"){
		//fa-eye-slash fa-eye
		$('[aria-name="kullaniciSifre1Toggle"]').toggleClass('fa-eye-slash',false)
		$('[aria-name="kullaniciSifre1Toggle"]').toggleClass('fa-eye',true)
	}
	else{
		$('[aria-name="kullaniciSifre1Toggle"]').toggleClass('fa-eye-slash',true)
		$('[aria-name="kullaniciSifre1Toggle"]').toggleClass('fa-eye',false)
	}
	$('#new-password-1').attr('type',type)
	
	
});
$('body').on('click', '[aria-name="kullaniciSifre2Toggle"]',function(){

	const type = $('#new-password-2').attr('type')=== 'password' ? 'text' : 'password';
	if(type == "password"){
		//fa-eye-slash fa-eye
		$('[aria-name="kullaniciSifre2Toggle"]').toggleClass('fa-eye-slash',false)
		$('[aria-name="kullaniciSifre2Toggle"]').toggleClass('fa-eye',true)
	}
	else{
		$('[aria-name="kullaniciSifre2Toggle"]').toggleClass('fa-eye-slash',true)
		$('[aria-name="kullaniciSifre2Toggle"]').toggleClass('fa-eye',false)
	}
	$('#new-password-2').attr('type',type)
	
	
});
$('body').on('click', '[aria-name="salonSirala"]',function(){
//aria-salon
	let salonID= $(this).attr('aria-salon');
	tekSalonYerlestir(salonID)
	
	
});
//#endregion

//#region API işlemleri
$('body').on('click', '#ApiTokenToggle', function(){
	let tokenInput = $('#ApiAccessToken');
	let eyeIcon = $('#ApiTokenEye');
	let eyeSlashIcon = $('#ApiTokenEyeSlash');
	
	if(tokenInput.attr('type') === 'password'){
		tokenInput.attr('type', 'text');
		eyeIcon.addClass('d-none');
		eyeSlashIcon.removeClass('d-none');
	} else {
		tokenInput.attr('type', 'password');
		eyeIcon.removeClass('d-none');
		eyeSlashIcon.addClass('d-none');
	}
})

$('body').on('click', '#ApiKaydetBtn', function(){
	let kullaniciAdi = $('#ApiKullaniciAdi').val();
	let accessToken = $('#ApiAccessToken').val();
	
	if(kullaniciAdi === '' || accessToken === ''){
		Swal.fire({
			title: 'Hata!',
			text: 'Lütfen tüm alanları doldurun',
			icon: 'error',
			confirmButtonText: 'Tamam'
		});
		return;
	}
	
	// Frontend validasyonu - sadece görsel feedback
	Swal.fire({
		title: 'Başarılı!',
		text: 'API ayarları kaydedildi (Frontend Demo)',
		icon: 'success',
		confirmButtonText: 'Tamam'
	});
	
	// Form verilerini console'a yazdır (geliştirme için)
	console.log('API Ayarları:', {
		kullaniciAdi: kullaniciAdi,
		accessToken: accessToken
	});
})
//#endregion

//#region MAİL işlemleri
$('body').on('click', '[aria-name="mailAyarlari"]',function(){
	startMailSettings()
})
$('body').on('click', '[aria-name="MailEkleTestEtButton"]',function(){
	mailTestEt()
	
})
$('body').on('click', '[aria-name="MailEkleTestEtButton"]',function(){
	startMailSettings()
})
$('#MailEkleForm').submit(function (e) {
	e.preventDefault();
	console.log(e)
	//mailTestEt(e)
 });
 $('body').on('click', '[aria-name="MailEkleSifreSH"]',function(){
	let type = $('[aria-name="MailEkleSifre"]').attr('type');
	if(type == "password"){
		$('[aria-name="MailEkleSifreSW"]').toggleClass("d-none",true)
		$('[aria-name="MailEkleSifreHD"]').toggleClass("d-none",false)
		$('[aria-name="MailEkleSifre"]').attr('type','text');
		return
	}
	if(type == "text"){
		$('[aria-name="MailEkleSifreSW"]').toggleClass("d-none",false)
		$('[aria-name="MailEkleSifreHD"]').toggleClass("d-none",true)
		$('[aria-name="MailEkleSifre"]').attr('type','password');
		return
	}
 })
 $('#mailGonder').on('click',function(){

	mailGonder()
})
$('body').on('click', '[aria-name="musteriNoMailGonder"]',function(){
	mailGonder()
})
//#endregion

//#region BANKA HESAPLARI RAPORU
$('#bankaHesaplariRaporuFiltreleBtn').on('click', function() {
	bankaHesaplariRaporuFiltrele();
});

$('#bankaHesaplariRaporuTemizleBtn').on('click', function() {
	bankaHesaplariRaporuTemizle();
});
//#endregion

//#region TAHŞİLAT RAPORU
$(document).on('click', '#tahsilatRaporuFiltreleBtn', function() {
	console.log("Tahsilat raporu filtreleme butonu tıklandı");
	tahsilatRaporuFiltrele();
});

$(document).on('click', '#tahsilatRaporuTemizleBtn', function() {
	console.log("Tahsilat raporu temizleme butonu tıklandı");
	tahsilatRaporuTemizle();
});

// Tarih aralığı değişikliklerini dinle
$(document).on('change', '#tarihAraligi', function() {
	console.log("Tarih aralığı değişti");
	// Otomatik filtreleme yapılabilir
});

$(document).on('change', '#firmaAdi', function() {
	console.log("Firma adı değişti");
	// Otomatik filtreleme yapılabilir
});

$(document).on('change', '#durum', function() {
	console.log("Durum değişti");
	// Otomatik filtreleme yapılabilir
});
//#endregion

//#region MASRAF RAPORU
$('#filtreleBtn').on('click', function() {
	masrafRaporuFiltrele();
});

$('#temizleBtn').on('click', function() {
	masrafRaporuTemizle();
});

$('#odemeGrubu').on('change', function() {
	masrafRaporuOdemeGrubuDegisti();
});
//#endregion

$('.modal').on('hide.bs.modal', function (e) {
 console.log("modal HİDE")
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
})
//aria-name="musteriNoMailGonder"


//aria-name="MailEkleTestEtButton" 
//aria-action="hizmetSil" aria-hizmetGrup = "${hizmet.hizmetGrupID}" aria-hizmetID ="${hizmet.ID}"
 //$('td[name="tcol1"]')

// Statik modül event handler'ları kaldırıldı - artık dinamik olarak çalışıyor

// Tab başlıklarına tıklandığında detay alanını aç
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

