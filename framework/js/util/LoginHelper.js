jQuery(document).ready(function(){
	jQuery("#userName, #password").keyup(function() {		
		if((jQuery("#userName").val().length != 0) && (jQuery("#password").val().length != 0)) {		
			jQuery("#submit").attr("disabled", false);
		} else {
			jQuery("#submit").attr("disabled", true);
		}
	});	
});