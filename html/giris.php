<?php

ini_set('display_errors', 1); ini_set('display_startup_errors', 1); error_reporting(E_ALL);


?>


<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Bitek M.I.C.E Yönetim</title>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allCss.php");  ?>

</head>

<body class="animsition">
    <div class="page-wrapper">
        <div class="page-content--bge5">
            <div class="container">
                <div class="login-wrap">
                    <div class="login-content">
                        <div class="login-logo">
                            <a href="#">
                            <img src="../../assets/img/logo.jpg" alt="MICE Teklif" />
                            </a>
                        </div>
                        <div class="login-form">
                            <form id="loginForm">
                                <div class="form-group">
                                    <label>Eposta Adresi</label>
                                    <input class="au-input au-input--full"  autocomplete="username" type="email" name="email" id="email" placeholder="EPosta">
                                </div>
                                <div class="form-group">
                                    <label>Şifre</label>
                                    <input class="au-input au-input--full" autocomplete="current-password" type="password" name="password" id="password" placeholder="Şifre">
                                </div>
                                <div class="login-checkbox">
                                    <label>
                                        <input type="checkbox" name="remember" id="remember">Beni Hatırla
                                    </label>
                                    <label>
                                        <a href="../sifreYenile/">Şifremi unuttum</a>
                                    </label>
                                </div>
                                
                                
                            <button class="au-btn au-btn--block au-btn--green m-b-20" id="loginButton">Giriş Yap</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allModals.php");  ?>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allJs.php");  ?>
    <script src="../../js/login.js"></script>

</body>

</html>
<!-- end document-->
