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
    <title>Test</title>  
    <link href="../../vendor/bootstrap-4.1/bootstrap.min.css" rel="stylesheet" media="all">
    <link href="../../vendor/font-awesome-4.7/css/font-awesome.min.css" rel="stylesheet" media="all">
    <link href="../../vendor/tempusdominus-bootstrap-4/tempusdominus-bootstrap-4.css" rel="stylesheet" media="all">
    <link href="../../vendor/daterangepicker/daterangepicker.css" rel="stylesheet" media="all">
</head>

<body class="animsition">
    <div class="page-wrapper">
        <div class="col-6">
        <div class="form-group">
            <label>Date:</label>
            <!-- <div class="input-group date" id="reservationdate" data-target-input="nearest">
                <input type="text" class="form-control datetimepicker-input" data-target="#reservationdate">
                <div class="input-group-append" data-target="#reservationdate" data-toggle="datetimepicker">
                    <div class="input-group-text"><i class="fa fa-calendar"></i></div>
                </div>
            </div>-->
             <input type='text' class="form-control" id='datetimepicker4' aria-name="testt" />
        </div>
    </div>
    <script src="../../vendor/jquery-3.2.1.min.js"></script>
    <script src="../../vendor/bootstrap-4.1/bootstrap.min.js"></script>
    <script src="../../vendor/moment/moment.min.js"></script>
    <script src="../../vendor/tempusdominus-bootstrap-4/tempusdominus-bootstrap-4.js"></script>
    <script src="../../vendor/daterangepicker/daterangepicker.js"></script>
    <script src="../../js/bootstrap-datetimepicker.js"></script>
    <script>
  $(function () {
     //Date picker
  //  $('#datetimepicker4').datetimepicker({
   //     format: 'L'
  //  });
    
     var myDate =  moment("1986-09-27","YYYY-MM-DD");
    $('[aria-name="testt"]').datetimepicker({
       format: 'DD.MM.YYYY', defaultDate:  myDate,viewMode: "years"
    });
    /*
    $('#datetimepicker4').datetimepicker({
       format: 'DD.MM.YYYY', defaultDate:  myDate,viewMode: "years"
    });*/
 })
    console.log($('#datetimepicker4').data("DateTimePicker"))
</script>
</body>
</html>

<!--
if(formHata ==false ){formHata=formHataBak(null,$('input#calisanDuzenleAcenta').val())}

if(formHata ==false ){formHata=formHataBak("#acentaAdiDuzenle",formData.get("acentaAdiDuzenle"))}

if(formHata ==false ){formHata=formTelefonHataBak("#calisanDuzenleTelefon",formData.get("calisanDuzenleTelefon"))}

formHata=formHataBak("#acentaAdi",formData.get("acentaAdi"))

toggleBekle("#acentaKaydetButtonGonder","#acentaKaydetButtonBekle")

toggelGonder("#acentaKaydetButtonGonder","#acentaKaydetButtonBekle")


toggleEditBekle('#OdemeCesidiDuzenleKaydetButtonGonder','#OdemeCesidiDuzenleKaydetButtonBekle')

toggelEditGonder('#OdemeCesidiDuzenleKaydetButtonGonder','#OdemeCesidiDuzenleKaydetButtonBekle')



             if ($.fn.DataTable.isDataTable( '#masrafListe' ) ) {
                console.log(data.masraf)
                let masrafRow = masrafTable.row( `#${data.data.DT_RowId}`)
                masrafRow.data(data.data).draw();
                var rowIndex =masrafRow.index();
                var cellNode = masrafTable.cell(rowIndex, 3).node();
                let color = "red"
                if(data.data.acikmi==1){color="green"}
                $(cellNode).css('color', color);
            }

-->
