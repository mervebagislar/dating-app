<div class="modal fade" id="modal-kullaniciHesap">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">
                    <i class="fa-solid fa-user-gear"></i>
                </h4>
                
            </div>
            <div class="modal-body" id="modal-body-kullaniciHesap">
                <aside class="profile-nav alt">
                    <section class="card">
                        <div class="card-header user-header alt bg-dark">
                            <div class="media">
                                <div class="media-body">
                                    <h2 class="text-light display-6" aria-name="kullaniciAdi">Jim Doe</h2>
                                    <p class="font-weight-bold" aria-name="kullaniciYetki">Project Manager</p>
                                </div>
                            </div>
                        </div>


                        <ul class="list-group list-group-flush">
                            <li class="list-group-item">
                                <i class="fa fa-envelope-o"></i> <span aria-name="kullaniciMail">Mail Inbox</span>
                            </li>
                            <li class="list-group-item">
                                <a class="btn-sm btn-primary"  data-toggle="collapse" href="#sifreCollapse" role="button" aria-expanded="false" aria-controls="sifreCollapse" aria-name="sifreDegistirButton">
                                <i class="fa-solid fa-key"></i> Şifre Değiştir
                                    
                                </a>
                               
                            </li>
                        </ul>

                    </section>
                </aside>
                <div class="collapse" id="sifreCollapse">
                    <div class="card">
                        <div class="card-header">
                            <strong>Şifre Değiştir</strong>
                        </div>
                        <div class="card-body card-block">
                            <form action="" method="post" class="">
                                <div class="form-group">
                                    <div class="input-group">
                                        <input type="password" id="old-Password" name="old-Password" placeholder="Eski şifre..." class="form-control" autocomplete="off">
                                        <i class="fa-regular fa-eye input-group-addon-inlet" aria-name="kullaniciEskiSifreToggle"></i>
                                        
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <input type="password" id="new-password-1" name="new-password-1" placeholder="Yeni şifre..." class="form-control" autocomplete="off">
                                        <i class="fa-regular fa-eye input-group-addon-inlet" aria-name="kullaniciSifre1Toggle"></i>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <div class="input-group">
                                        <input type="password" id="new-password-2" name="new-password-2" placeholder="Yeni şifre tekrar..." class="form-control" autocomplete="off">
                                        <i class="fa-regular fa-eye input-group-addon-inlet" aria-name="kullaniciSifre2Toggle"></i>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="card-footer">
                            <button type="button" class="btn btn-primary btn-sm" aria-name="hesapSifreDegistirKaydet">
                                <i class="fa fa-dot-circle-o"></i> Kaydet
                            </button>
                        </div>
                    </div>
                </div>
            </div>
                
        </div>
    </div>
</div>