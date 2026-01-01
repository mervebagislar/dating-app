

//#region KULLANICI
function kullaniciHesapBak(){
    formData = new FormData();
    formData.append("kullaniciHesapBak","1");
    makeAjax(formData).then((data) => { 
        $('[aria-name="kullaniciAdi"]').text(data.data.kullaniciAdi)
        $('[aria-name="kullaniciYetki"]').text(data.data.kullaniciYetki)
        $('[aria-name="kullaniciMail"]').text(data.data.kullaniciEposta)
        $('#modal-kullaniciHesap').modal('show')
        
    })
}
function hesapSifreDegistirKaydet(){
    $("#new-password-1").toggleClass("border-danger",false)
    $("#new-password-2").toggleClass("border-danger",false)
    $("#old-Password").toggleClass("border-danger",false)


    let yeniSifre1=$("#new-password-1").val();
    let yeniSifre2=$("#new-password-2").val();
    let eskiSifre=$("#old-Password").val();
    if(eskiSifre.length <=0){

        $("#old-Password").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Eski şifre alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    if(yeniSifre1.length <=0){
        $("#new-password-1").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Yeni şifre alanı boş bırakılamaz",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    if(yeniSifre1.length <8){
        $("#new-password-1").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Yeni şifre enaz 8 hane olmalıdır",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    if(yeniSifre1 != yeniSifre2){
        $("#new-password-1").toggleClass("border-danger",true)
        $("#new-password-2").toggleClass("border-danger",true)
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Hata",
            text:"Yeni şifre ve şifre tekrarı aynı değil",
            confirmButtonText: 'Tamam'
        })
        return false
    }
    formData = new FormData();
    formData.append("hesapSifreDegistir","1");
    formData.append("eskiSifre",eskiSifre);
    formData.append("yeniSifre",yeniSifre1);
    makeAjax(formData).then((data) => { 

        
        if(data.status==1){
            Toast.fire({
                icon: "success",
                text:data.message
            })
            $("#new-password-1").val("")
            $("#new-password-2").val("")
            $("#old-Password").val("")
            $('#sifreCollapse').collapse('hide');
        }
    })
}
//#endregion