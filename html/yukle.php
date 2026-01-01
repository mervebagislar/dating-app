<?php

if(isset($_FILES["masrafEklefile"])) {
    $return = array("status"=>0,"message"=>"","data"=>"");
    
    $target_dir = "assets/faturalar/";
    $target_file = $target_dir . basename($_FILES["masrafEklefile"]["name"]);
    $return["data"]=$target_file;
    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));

    // Check if image file is a actual image or fake image

    $check = getimagesize($_FILES["masrafEklefile"]["tmp_name"]);
    if($check !== false) {
        $return["message"]= "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        $return["message"]= "File is not an image.";
        $uploadOk = 0;
    }


    // Check if file already exists
    if (file_exists($target_file)) {
    $return["message"].= "Sorry, file already exists.";
    $uploadOk = 0;
    }

    // Check file size
    if ($_FILES["masrafEklefile"]["size"] > 500000) {
    $return["message"].= "Sorry, your file is too large.";
    $uploadOk = 0;
    }

    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg"
    && $imageFileType != "gif" ) {
    $return["message"].= "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
    $uploadOk = 0;
    }
    $return["status"]=$uploadOk;

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
    $return["message"].= "Sorry, your file was not uploaded.";
    // if everything is ok, try to upload file
    } else {
    if (move_uploaded_file($_FILES["masrafEklefile"]["tmp_name"], $target_file)) {
        $return["message"].= "The file ". htmlspecialchars( basename( $_FILES["masrafEklefile"]["name"])). " has been uploaded.";
    } else {
        $return["message"].= "Sorry, there was an error uploading your file.";
    }
    }
    return $return;
}
else{
    var_dump($_FILES);
}