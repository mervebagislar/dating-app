$(document).ready(function() {
   let c =  sessionStorage.getItem("jwtEmail");
   console.log(c)
    if(c && c !== ""){
    window.location.replace("../");
    return;
   }
 });
let apiLoginBase = "http://192.168.1.249/loginWorker/";
//let apiLoginBase = "../../loginWorker/";
$('#loginForm').submit(function (e) {
    e.preventDefault();
    $('#loginButton').toggleClass("d-none",true)
	//50 satır
	var formData = new FormData($("form#loginForm")[0]);
	let formHata;
    if(!formData.get("email")){$('#email').toggleClass("border-danger",true); formHata=true}
	if(formData.get("email")){$('#email').toggleClass("border-danger",false)}
    if(!formData.get("password")){$('#password').toggleClass("border-danger",true); formHata=true}
	if(formData.get("password")){$('#password').toggleClass("border-danger",false)}
    formData.append("giris","1");
    if(formHata){
        ToastCenterWhiteButton.fire({
            icon: "warning",
            titleText: "Eksik alan",
            text:"lütfen kırmızı işaretli alanları doldurunuz",
            confirmButtonText: 'Tamam'
        })
        $('#loginButton').toggleClass("d-none",false)
        return;
    }
    let ser = JSON.stringify(Object.fromEntries(formData))
    $.ajax({
		type: "POST",
        url:apiLoginBase,
        cors:true,
        headers: {
            "access-control-allow-origin": "*", 
            "Access-Control-Allow-Methods": "POST, GET",
           
           
        
        },
        data: ser,
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        processData: true,
		success: function(data)
		{
            console.log(data)
           switch(data.status){
                case 0:
                    ToastCenterWhiteButton.fire({
                        icon: "warning",
                        titleText: data.header,
                        text:data.message,
                        confirmButtonText: 'Tamam'
                    })
                break;
				case 1: 
                    console.log("loged in:",data.data)
                    storeJWTToken(data.token)
                    window.location.replace(data.data);
                 break;
				case 2:
                    $('#email').toggleClass("border-danger",true)
                    $('#loginButton').toggleClass("d-none",false)
                    ToastCenterWhiteButton.fire({
                        icon: "warning",
                        titleText: data.header,
                        text:data.message,
                        confirmButtonText: 'Tamam'
                    })
                break;
				case 3:
                    $('#email').toggleClass("border-danger",true)
                    $('#loginButton').toggleClass("d-none",false)
                    ToastCenterWhiteButton.fire({
                        icon: "warning",
                        titleText: data.header,
                        text:data.message,
                        confirmButtonText: 'Tamam'
                    })
                break;

				case 4:
                    $('#password').toggleClass("border-danger",true)
                    $('#loginButton').toggleClass("d-none",false)
                    ToastCenterWhiteButton.fire({
                        icon: "warning",
                        titleText: data.header,
                        text:data.message,
                        confirmButtonText: 'Tamam'
                    })
                break;
				default: ;
           }
			
		}
	});
});