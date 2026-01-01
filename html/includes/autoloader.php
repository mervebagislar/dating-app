<?php

spl_autoload_register(
	function ($class) {
		//echo $class."<br>";
		
			$filename = $_SERVER['DOCUMENT_ROOT'].'/classes'. DIRECTORY_SEPARATOR . str_replace('\\', DIRECTORY_SEPARATOR, $class) . '.php'; 
			if (file_exists($filename)) { 
				require_once ($filename); 
			} 
		
	}

); 


?>