//#region MAİL eventHandler
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

//#region Mail Ayarları functions
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
