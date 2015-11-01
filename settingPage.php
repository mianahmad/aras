<?php
if (basename($_SERVER['PHP_SELF']) == basename(__FILE__)) 
{ 
die('Direct Access not permitted...'); 
}
	
	$activation = 0;
	$accKey = @get_option("prepostseo_acckey");
	$actionSite = @get_option("prepostseo_action_site");
	
	if(!empty($_POST['submit']) and !empty($_POST['account_api']))
	{
		$accKey = $_POST['account_api'];
		@update_option('prepostseo_acckey', $_POST['account_api']);
	}
	
	
	$data = file_get_contents($actionSite.'frontend/getAccountSettings/'.$accKey);
	
	$user = json_decode($data);
	
	if(!empty($user->limit) and !empty($accKey))
	{
		$activation = 1;
		$premium = ($user->premium == 1)? '<strong class="green">Premium User</strong>' : '<strong class="red">FREE User</strong>';
		$limitUsed = ($user->used/$user->limit)*100;
		$limitUsed = round($limitUsed, 2);
		
		if($limitUsed > 100)
		{
			$limitUsed = 100;
		}
		if($user->used > $user->limit)
		{
			$usedQ = $user->limit;
		}
		
	} else {
		if(!empty($_POST['account_api']))
		{
			$errorMsg =  "API key you entered is not valid; <br>";
		}
		elseif(!empty($accKey)){
			$errorMsg =  "Error in validating API Key";
		}
	}
	

?>

<?php if($activation == 1): ?>
<table id="travel" class="settings">

	
    <thead>    
    	<tr>
            <th colspan="2"><h1>PrePost SEO Settings</h1></th>
        </tr>  
    </thead>
    <?php if($user->premium == 0): ?>
    <tfoot>
    	<tr>
        	<th scope="row">Upgrade Membership</th>
            <td><a href="<?php echo $actionSite.'plans?accKey='.$accKey; ?>" target="_blank" class="button button-primary button-large">Upgrade Account</a></td>
        </tr>
    </tfoot>
    <?php endif; ?>
    <tbody>
    	<tr>
            <td colspan="2">
				You plugin is successfully configured and activated. <br>
                Account Details are below.
            </td>
        </tr>
        <tr>
            <th scope="col" width="200">Name</th>
            <th scope="col" colspan="6" width="500">Status</th>
        </tr>   
        <tr>
    		<th scope="row">User Name</th>
            <td><?php echo @$user->name; ?></td>
        </tr>
        <tr>
    		<th scope="row">Account Email</th>
            <td><?php echo @$user->email; ?></td>
        </tr>
        <tr>
    		<th scope="row">Account API key</th>
            <td><?php echo @$accKey; ?></td>
        </tr>
        <tr>
    		<th scope="row">Monthly Queries Limit</th>
            <td><?php echo @$user->limit; ?></td>
        </tr>
        <tr>
    		<th scope="row">Queries  Used</th>
            <td>
			(You have used <strong><?php echo $limitUsed; ?>%</strong> of your monthly limit)
            </td>
        </tr>
        
        <tr>
        	<th scope="row">Membership Type</th>
            <td><?php echo $premium; ?></td>
           
        </tr>
        
    </tbody>

</table>

<?php else: ?>

<form method="post" action="">
<table id="travel2" class="settings">

	
    <thead>    
    	<tr>
            <th colspan="2"><h1>PrePost SEO Settings</h1></th>
        </tr>
          
    </thead>
    <tfoot>
    	<tr>
        	<td></td>
        	<td scope="row">
            	<center>
            	<?php submit_button(); ?>
            	</center>
            </td>
        </tr>
    </tfoot>
    <tbody>
    	<tr>
    		<td colspan="2">
            	To activate this plugin please create and add plug API key below. <br>
                <a href="http://www.prepostseo.com/login" target="_blank">click here to create API KEY</a>
            </td>
        </tr>
        <tr>
    		<th scope="row">Account API key</th>
            <td>
            	<input type="text" name="account_api" value="<?php echo $accKey; ?>" style="width:100%;" />
            </td>
        </tr>
    </tbody>

</table>
</form>

<?php
endif;
