
//#region API işlemleri eventHandler
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
