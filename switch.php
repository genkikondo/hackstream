<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Papermashup.com | jQuery UI Switch</title>
<link href="../style.css" rel="stylesheet" type="text/css" />

<style>

#container{background:#ebebeb;}

.switch{
	border:none;
	background:left no-repeat;
	width:105px;
	height:46px;
	padding:0;
	margin:0;
}

.on, .off{
	width:50px;
	height:40px;
	display:inline-block;
	cursor:pointer;
}

.result{display:none; margin-top:5px; font-size:14px; color:#333;}
.result span{color:#C03; font-weight:700;}

</style>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js" type="text/javascript"></script>

<script type="text/javascript">

$(document).ready(function(){

	$('.switch').css('background', 'url("switch.png")');
	$('.on_off').css('display','none');
	$('.on, .off').css('text-indent','-10000px');

    $("input[name=on_off]").change(function() {
      var button = $(this).val();
	  
		if(button == 'off'){ $('.switch').css('background-position', 'right'); }
		if(button == 'on'){ $('.switch').css('background-position', 'left'); }	 
		  	  
		 $('.result span').html(button); 
		 $('.result').fadeIn();

   });

});

</script>
</head>

<body>

<?php include '../includes/header.php';
 $link = '| <a href="http://papermashup.com/jquery-fancy-switch/">Back To Tutorial</a>';
?>

<form action="" method="get">

<fieldset class="switch">
    <label class="off">Off<input type="radio" class="on_off" name="on_off" value="off"/></label>
    <label class="on">On<input type="radio" class="on_off" name="on_off" value="on"/></label>
</fieldset>

<input type="submit" value="Submit"/>

</form>

<div class="result">The switch is: <span>on</span></div>

<?php include '../includes/footer.php';?>

</body>
</html>