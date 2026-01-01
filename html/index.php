<!DOCTYPE html>
<html manifest="cache.appcache" lang="tr">

<head>
    <!-- Required meta tags-->
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="miceTeklif">
    <meta name="author" content="Cem GORA">
    <meta name="keywords" content="miceTeklif">
    <title>Dashboard</title>   
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allCss.php");  ?>
</head>

<body class="animsition">
    <div class="page-wrapper">
        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/sideBar.php");  ?>
        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/headerDesktop.php");  ?>
        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/headerMobile.php");  ?>
        <div class="page-container">
            <div class="main-content">
                <div class="section__content section__content--p30">
                    <div class="container-fluid">

                        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/indexTemplate1.php");  ?>
                        <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/footer.php");  ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allModals.php");  ?>
    <?php include_once($_SERVER['DOCUMENT_ROOT']."/includes/pages/allJs.php");  ?>
</body>
</html>
