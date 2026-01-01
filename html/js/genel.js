let currentPage=window.location.pathname
let serverURL=`https://${window.location.hostname}`
let chatSocket;
let ekipmanEklearaSelect
let hizmetDuzenlearaSelect
let acentaEklearaSelect
let acentaDuzenlearaSelect
let personelDepartmanAra
let personelGorevAra
let sirketID
let userID
let kullaniciAdi
let kullaniciMail
let acentaKullaniciListesi
let dolarkuru=0
let eurokuru=0
let secilenSalon=0
let digerHizmetlerGrupID=8
let genelDebug= true
let yeniSalonID = -1
let personelDuzenleTarih

// Listeler ÖN Yüklemesi
let acentaListesi
let odemeGrubu
let isListesi
let kasaListesi
let jwtToken = sessionStorage.getItem('jwtToken');
let takvimLocale = {
    "separator": " - ",
    "applyLabel": "Uygula",
    "cancelLabel": "İptal",
    "fromLabel": "Başlangıç",
    "toLabel": "Bitiş",
    "customRangeLabel": "Özel",
    "daysOfWeek": [
        "Pzt",
        "Sal",
        "Çar",
        "Per",
        "Cum",
        "Cmt",
        "Pzr"
    ],
    "monthNames": [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık"
    ],
    "firstDay": 0
}
let teklifTaslak={
	ID:-1,
	uuid:"",
	teklifAdi:"",
	teklifAcentaAdi:"",
	teklifAcentaID:"",
	teklifAcentaCalisanAdi:"",
	teklifAcentaCalisanID:"",
	teklifTarihi:"",
	teklifIsKurulumBaslangic:"",
	teklifIsKurulumBitis:"",
	teklifIsKurulumGun:"",
	teklifIsBaslangic:"",
	teklifIsBitis:"",
	teklifIsGun:"",
	teklifNakliyeTarihi:"",
	teklifDolarKuru:1,
	teklifEuroKuru:1,
	teklifYazanAdi:"",
	teklifYazanID:"",
	teklifYazanMail:"",
	teklifRevize:"",
	teklifKurulumUcretlimi:0,
	teklifKurulumCarpan:0,
	teklifParaBirimi:"try",
	teklifIcerik:[
	   {
			salonAdi:"Teknik Hizmetler",
			icerik:[],
			salonGun:1,
			hizmetGrupFiyatlari:[],
			salonAraFiyat:0,
			salonIndirim:0,
			salonFinalFiyat:0
		},
		{
			salonAdi:"Diğer Hizmetler",
			icerik:[],
			salonGun:1,
			hizmetGrupFiyatlari:[],
			salonAraFiyat:0,
			salonIndirim:0,
			salonFinalFiyat:0

		}
	],
	teklifEkip:[],
	teklifAraToplam:0,
	teklifIndirim:0,
	teklifKDV:0,
	teklifAnaToplam:0,
	teklifDurumu:1,
	teklifDurumAdi:"Yeni Taslak",
	teklifLokasyon:"",
	teklifGecerlilik:15,
	teklifTerminSuresi:""

}
let teklif={
	ID:-1,
	uuid:"",
	teklifAdi:"",
	teklifAcentaAdi:"",
	teklifAcentaID:"",
	teklifAcentaCalisanAdi:"",
	teklifAcentaCalisanID:"",
	teklifEventAdi:"",
	teklifTarihi:"",
	teklifIsKurulumBaslangic:"",
	teklifIsKurulumBitis:"",
	teklifIsKurulumGun:"",
	teklifIsBaslangic:"",
	teklifIsBitis:"",
	teklifIsGun:"",
	teklifNakliyeTarihi:"",
	teklifDolarKuru:1,
	teklifEuroKuru:1,
	teklifYazanAdi:"",
	teklifYazanID:"",
	teklifYazanMail:"",
	teklifRevize:"",
	teklifKurulumUcretlimi:0,
	teklifKurulumCarpan:0,
	teklifParaBirimi:"try",
	teklifIcerik:[
	   {
			salonAdi:"Teknik Hizmetler",
			icerik:[],
			salonGun:1,
			hizmetGrupFiyatlari:[],
			salonAraFiyat:0,
			salonIndirim:0,
			salonFinalFiyat:0
		},
		{
			salonAdi:"Diğer Hizmetler",
			icerik:[],
			salonGun:1,
			hizmetGrupFiyatlari:[],
			salonAraFiyat:0,
			salonIndirim:0,
			salonFinalFiyat:0

		}
	],
	teklifEkip:[],
	teklifAraToplam:0,
	teklifIndirim:0,
	teklifKDV:0,
	teklifAnaToplam:0,
	teklifDurumu:1,
	teklifDurumAdi:"Yeni Taslak",
	teklifLokasyon:"",
	teklifGecerlilik:15,
	teklifTerminSuresi:""

}
//moment().tz.setDefault("Europe/Istanbul");
$('[data-toggle="tooltip"]').tooltip()
function anaTeklifSifirla(){
	teklif={
	ID:-1,
	uuid:"",
	teklifAdi:"",
	teklifAcentaAdi:"",
	teklifAcentaID:"",
	teklifAcentaCalisanAdi:"",
	teklifAcentaCalisanID:"",
	teklifEventAdi:"",
	teklifTarihi:"",
	teklifIsKurulumBaslangic:"",
	teklifIsKurulumBitis:"",
	teklifIsKurulumGun:"",
	teklifIsBaslangic:"",
	teklifIsBitis:"",
	teklifIsGun:"",
	teklifNakliyeTarihi:"",
	teklifDolarKuru:1,
	teklifEuroKuru:1,
	teklifYazanAdi:"",
	teklifYazanID:"",
	teklifYazanMail:"",
	teklifRevize:"",
	teklifKurulumUcretlimi:0,
	teklifKurulumCarpan:0,
	teklifParaBirimi:"try",
	teklifIcerik:[
	   {
			salonAdi:"Teknik Hizmetler",
			icerik:[],
			salonGun:1,
			hizmetGrupFiyatlari:[],
			salonAraFiyat:0,
			salonIndirim:0,
			salonFinalFiyat:0
		},
		{
			salonAdi:"Diğer Hizmetler",
			icerik:[],
			salonGun:1,
			hizmetGrupFiyatlari:[],
			salonAraFiyat:0,
			salonIndirim:0,
			salonFinalFiyat:0

		}
	],
	teklifEkip:[],
	teklifAraToplam:0,
	teklifIndirim:0,
	teklifKDV:0,
	teklifAnaToplam:0,
	teklifDurumu:1,
	teklifDurumAdi:"Yeni Teklif",
	teklifLokasyon:"",
	teklifGecerlilik:15,
	teklifTerminSuresi:""

}
}
function teklifTaslakSifirla(){
	teklifTaslak={
		ID:-1,
		uuid:"",
		teklifAdi:"",
		teklifAcentaAdi:"",
		teklifAcentaID:"",
		teklifAcentaCalisanAdi:"",
		teklifAcentaCalisanID:"",
		teklifTarihi:"",
		teklifIsKurulumBaslangic:"",
		teklifIsKurulumBitis:"",
		teklifIsKurulumGun:"",
		teklifIsBaslangic:"",
		teklifIsBitis:"",
		teklifIsGun:"",
		teklifNakliyeTarihi:"",
		teklifDolarKuru:1,
		teklifEuroKuru:1,
		teklifYazanAdi:"",
		teklifYazanID:"",
		teklifYazanMail:"",
		teklifRevize:"",
		teklifKurulumUcretlimi:0,
		teklifKurulumCarpan:0,
		teklifParaBirimi:"try",
		teklifIcerik:[
		{
				salonAdi:"Teknik Hizmetler",
				icerik:[],
				salonGun:1,
				hizmetGrupFiyatlari:[],
				salonAraFiyat:0,
				salonIndirim:0,
				salonFinalFiyat:0
			},
			{
				salonAdi:"Diğer Hizmetler",
				icerik:[],
				salonGun:1,
				hizmetGrupFiyatlari:[],
				salonAraFiyat:0,
				salonIndirim:0,
				salonFinalFiyat:0

			}
		],
		teklifEkip:[],
		teklifAraToplam:0,
		teklifIndirim:0,
		teklifKDV:0,
		teklifAnaToplam:0,
		teklifDurumu:1,
		teklifDurumAdi:"Yeni Taslak",
		teklifLokasyon:"",
		teklifGecerlilik:15,
		teklifTerminSuresi:""

	}
}
var Toast = Swal.mixin({
	toast: true,
	position: 'top-end',
	showConfirmButton: false,
	timer: 3000,
	timerProgressBar:true,
	allowEscapeKey:true
});
var ToastCenter = Swal.mixin({
	toast: true,
	position: 'center',
	showConfirmButton: false,
	timer: 5000,
	timerProgressBar:true,
	allowEscapeKey:true
});
var ToastCenterSpecialButton = Swal.mixin({
	toast: true,
	position: 'center',
	showConfirmButton: true,
	allowEscapeKey:true
});
var ToastCenterButton = Swal.mixin({
	toast: true,
	position: 'center',
	showConfirmButton: true,
	background:'#f0e09c',
	confirmButtonColor:'#e3b34b'
});
var ToastConfimDelete = Swal.mixin({
	toast: true,
	position: 'center',
	showConfirmButton: true,
	confirmButtonColor:'#858585ff',
	allowEscapeKey:true,
	showClass: {
		popup: `
		animate__animated
		animate__fadeInUp
		animate__faster
		`
	},
	hideClass: {
		popup: `
		animate__animated
		animate__fadeOutDown
		animate__faster
		`
	}
});
var ToastCenterWhiteButton = Swal.mixin({
	toast: true,
	position: 'center',
	showConfirmButton: true,
	background:'#fff',
	confirmButtonColor:'#e3b34b'
});
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
	  let c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}
function QueryString(item, text){
	var foundString = text.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
	return foundString ? foundString[1] : foundString;
}
function nameReplace(name){
	//Diu011fer Hizmetler u00dc
	name=name.replaceAll("u015f", "ş");
	name=name.replaceAll("u0131", "ı");
	name=name.replaceAll("u00f6", "ö");
	name=name.replaceAll("u00fc", "ü");
	name=name.replaceAll("u011f", "ğ");
	name=name.replaceAll("u00dc", "Ü");
	name=name.replaceAll("u00d6", "Ö");
	name=name.replaceAll("u015e", "Ş");
	name=name.replaceAll("u011e", "Ğ");
	name=name.replaceAll("u0130", "I");
	name=name.replaceAll("u00e7", "ç");
	name=name.replaceAll("u00c7", "Ç");
	name=name.replaceAll("&amp;", "&");
	
	
	return name
}
function TCNOKontrol(TCNO) {
    var tek = 0,
      cift = 0,
      sonuc = 0,
      TCToplam = 0,
      i = 0,
      hatali = [11111111110, 22222222220, 33333333330, 44444444440, 55555555550, 66666666660, 7777777770, 88888888880, 99999999990];;

    if (TCNO.length != 11) return false;
    if (isNaN(TCNO)) return false;
    if (TCNO[0] == 0) return false;

    tek = parseInt(TCNO[0]) + parseInt(TCNO[2]) + parseInt(TCNO[4]) + parseInt(TCNO[6]) + parseInt(TCNO[8]);
    cift = parseInt(TCNO[1]) + parseInt(TCNO[3]) + parseInt(TCNO[5]) + parseInt(TCNO[7]);

    tek = tek * 7;
    sonuc = tek - cift;
    if (sonuc % 10 != TCNO[9]) return false;

    for (var i = 0; i < 10; i++) {
      TCToplam += parseInt(TCNO[i]);
    }

    if (TCToplam % 10 != TCNO[10]) return false;

    if (hatali.toString().indexOf(TCNO) != -1) return false;

    return true;
  }
function debuging(consoleMessage,consoleObject="*",localDebug=false){
	if(genelDebug){
		if(consoleObject !="*"){
			console.log(consoleMessage,consoleObject)
		}
		else{
			console.log(consoleMessage)
		}

	}
	else{
		if(localDebug){
			if(consoleObject !="*"){
				console.log(consoleMessage,consoleObject)
			}
			else{
				console.log(consoleMessage)
			}
		}
	}
}
function ibanCozumle(input){
	//gelen iban karakterlerini büyüğe çevir ve tüm boşlukları sil
	input = String(input).toUpperCase()
	let senitized = input.replaceAll(' ','')
	let ret={
		bankaKodu:"", bankaAdi:"",iban:"",hesapno:"",checkResult:false
	};
	let TrBankalar={
		46:"AKBANK T.A.Ş", 143:"AKTİF YATIRIM BANKASI A.Ş",203:"ALBARAKA TÜRK KATILIM BANKASI A.Ş.",
		124:"ALTERNATİFBANK A.Ş.",135:"ANADOLUBANK A.Ş.",91:"ARAP TÜRK BANKASI",
		129:"BANK OF AMERICA YATIRIM BANK A.Ş.",149:"BANK OF CHINA TURKEY A.Ş.",142:"BANKPOZİTİF KREDİ VE KALK.BANK.A.Ş",
		29:"BİRLEŞİK FON BANKASI A.Ş.",125:"BURGAN BANK A.Ş.",92:"CITIBANK A.Ş.",
		158:"COLENDİ BANK A.Ş.",151:"D YATIRIM BANKASI A.Ş.",134:"DENİZBANK A.Ş.",
		152:"DESTEK YATIRIM BANKASI A.Ş.",115:"DEUTSCHE BANK A.Ş.",138:"DİLER YATIRIM BANKASI A.Ş.",
		214:"DÜNYA KATILIM BANKASI A.Ş.",157:"ENPARA BANK A.Ş.",103:"FİBABANKA A.Ş.",
		159:"FUPS BANK A.Ş.",150:"GOLDEN GLOBAL YATIRIM BANKASI A.Ş.",139:"GSD YATIRIM BANKASI A.Ş.",
		212:"HAYAT FİNANS KATILIM BANKASI",156:"HEDEF YATIRIM BANKASI A.Ş.",123:"HSBC BANK A.Ş.",
		109:"ICBC TURKEY BANK A.Ş.",99:"ING BANK A.Ş.",148:"INTESA SANPAOLO S.P.A.",
		4:"İLLER BANKASI A.Ş.",132:"İSTANBUL TAKAS VE SAKLAMA BANK. A.Ş.",98:"JPMORGAN CHASE BANK N.A.",
		205:"KUVEYT TÜRK KATILIM BANKASI A.Ş.",806:"MERKEZİ KAYIT KURULUŞU A.Ş.",153:"MİSYON YATIRIM BANKASI A.Ş.",
		147:"MUFG BANK TURKEY A.Ş.",141:"NUROL YATIRIM BANKASI A.Ş.",146:"ODEA BANK A.Ş.",
		116:"PASHA YATIRIM BANK A.Ş.",807:"POSTA VE TELGRAF TEŞKİLATI A.Ş.",137:"RABOBANK A.Ş.",
		122:"SOCIETE GENERALE (SA)",121:"STANDARD CHARTERED YATIRIM BANKASI TÜRK A.Ş.",59:"ŞEKERBANK T.A.Ş.",
		32:"T. EKONOMİ BANKASI A.Ş.",16:"T. EXİMBANK",62:"T. GARANTİ BANKASI A.Ş.",
		12:"T. HALK BANKASI A.Ş.",64:"T. İŞ BANKASI A.Ş.",17:"T. KALKINMA BANKASI A.Ş.",
		14:"T. SINAİ KALKINMA BANKASI A.Ş.",15:"T. VAKIFLAR BANKASI T.A.O.",1:"T.C. MERKEZ BANKASI",
		10:"T.C. ZİRAAT BANKASI A.Ş.",154:"TERA YATIRIM BANKASI A.Ş.",213:"T.O.M. KATILIM BANKASI A.Ş.",
		96:"TURKISH BANK A.Ş.",108:"TURKLAND BANK A.S.",60:"TÜRK TİCARET BANKASI A.Ş",
		211:"TÜRKİYE EMLAK KATILIM BANKASI A.Ş.",206:"TÜRKİYE FİNANS KATILIM BANKASI A.Ş",210:"VAKIF KATILIM BANKASI A.Ş.",
		67:"YAPI VE KREDİ BANKASI A.Ş.",160:"ZİRAAT DİNAMİK BANKA A.Ş.",209:"ZİRAAT KATILIM BANKASI A.Ş.",
		155:"Q YATIRIM BANKASI A.Ş.",111:"QNB FİNANSBANK A.Ş."



	}
	var CODE_LENGTHS = {
        AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
        CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
        FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
        HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
        LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
        MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
        RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26,   
        AL: 28, BY: 28, CR: 22, EG: 29, GE: 22, IQ: 23, LC: 32, SC: 31, ST: 25,
        SV: 28, TL: 23, UA: 29, VA: 22, VG: 24, XK: 20
    };
    var iban = senitized.replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
	code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/), // match and capture (1) the country code, (2) the check digits, and (3) the rest
	digits;
	if(code.length > 0){
		if(code[1]=="TR"){
			ret.iban=senitized
			let bankaKodu = senitized.substring(4, 9);
			ret.bankaKodu = bankaKodu.replace(/^0+/, '');
			ret.bankaAdi = TrBankalar[ret.bankaKodu];
			let hesapno = senitized.substring(10);
			ret.hesapno = hesapno.replace(/^0+/, '');
			ret.Iban = senitized
			if(senitized.length==26){ ret.checkResult = true; }
			//console.log(ret)
			//baştaki 0ları silme
			//s = s.replace(/^0+/, '');

		}
	}
    // check syntax and length
    if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
        ret.checkResult = false;
    }

    return ret;
}
function mod97(string) {
    var checksum = string.slice(0, 2), fragment;
    for (var offset = 2; offset < string.length; offset += 7) {
        fragment = String(checksum) + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
}

function toggelEditGonder(gonder,bekle){
	let parent = $(`${gonder}`).parent()
	$(`${gonder}`).toggleClass("d-none",false)
	$(`${bekle}`).toggleClass("d-none",true)
	parent.toggleClass('btn-secondary btn-warning');
	parent.prop('disabled', false);
}

function toggleEditBekle(gonder,bekle){
	let parent = $(`${gonder}`).parent()
	$(`${gonder}`).toggleClass("d-none",true)
    $(`${bekle}`).toggleClass("d-none",false)
	parent.toggleClass('btn-warning btn-secondary');
	parent.prop('disabled', true);
}
function toggelGonder(gonder,bekle){
	let parent = $(`${gonder}`).parent()
	$(`${gonder}`).toggleClass("d-none",false)
	$(`${bekle}`).toggleClass("d-none",true)
	parent.toggleClass('btn-secondary btn-success');
	parent.prop('disabled', false);
}
function toggleBekle(gonder,bekle){
	let parent = $(`${gonder}`).parent()
	$(`${gonder}`).toggleClass("d-none",true)
    $(`${bekle}`).toggleClass("d-none",false)
	parent.toggleClass('btn-success btn-secondary');
	parent.prop('disabled', true);
}
function formHataBak(element,val){
	if(element==null && val==""){
		return true;
	}
	if(element==null && val==null){
		return true;
	}
	if(!val){
		$(`${element}`).toggleClass("border-danger",true); 
		return true;
	}
	$(`${element}`).toggleClass("border-danger",false)
	return false;

}

function formTelefonHataBak(element,val){

	if(val !="" && val.length < 10){
		$(`${element}`).toggleClass("border-danger",true); 
		return true;
	}
	$(`${element}`).toggleClass("border-danger",false)
	return false;

}
function paraBirimiSembol(paraBirimi){
	if(paraBirimi=="usd"){ return "$"; }
	if(paraBirimi=="eur"){return "€";}
	return "₺";
}

function storeJWTToken(token) {
    if (!token) return;
    sessionStorage.setItem('jwtToken', token);
    try {
        // JWT'nin payload kısmını ayrıştır
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.email) {
            sessionStorage.setItem('jwtEmail', payload.email);
        }
		if (payload.userID) {
            sessionStorage.setItem('jwtuserID', payload.userID);
        }
/*
		if (payload.yetki) {
            sessionStorage.setItem('jwtyetki', payload.yetki);
        }*/

		if (payload.sirketID) {
            sessionStorage.setItem('jwtsirketID', payload.sirketID);
        }
		if (payload.kullaniciAdi) {
            sessionStorage.setItem('jwtkullaniciAdi', payload.kullaniciAdi);
        }
		
    } catch (e) {
        console.error('JWT ayrıştırılamadı:', e);
    }
}