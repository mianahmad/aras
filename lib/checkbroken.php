<?php
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) 
{ 
die('Direct Access not permitted...'); 
}

function validate_url($url=false)  
	{
		
		if((strpos($url,'http://')=== false))
			{
				if(strpos($url,'https://')=== false)
				{
					return false;
				}
			}
		if($url!="")
		{
			

			$ch = curl_init();
			curl_setopt($ch, CURLOPT_NOBODY,true);
			curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); 	
			curl_setopt($ch, CURLOPT_URL, $url); 
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
			curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);			
			$dt = curl_exec($ch); 
			$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
			curl_close($ch);   
			
			if($httpcode >= 200 && $httpcode < 300)
			{
				return true;
			}
			else
			{
				return false;
			}
		}
		else
		{
			return false;
		}
	}
	
	

