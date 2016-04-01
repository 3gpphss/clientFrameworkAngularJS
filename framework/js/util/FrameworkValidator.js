define(["jquery"],function($){
	var regex_number = /^[0-9\b]+$/;
	var regex_specialchars = /[!@#\$%\^\&*\)\(+_]+$/;
	var regex_hex = /[a-fA-F0-9\b]+$/;
	var regex_space = /[\s]+$/;
	var regex_alphanumeric = /[a-zA-Z0-9]+$/;
	
	
	return {
		
		registerValidations : function(prefix){
			$(prefix+" .number").keypress(function(ev){
				if(ev)
				{
					var charCode = (ev.which) ? ev.which : ev.keyCode;
					var codeValue = String.fromCharCode( charCode );		
					
					// to support cut copy and paste functions
					if(ev.ctrlKey == true && (charCode == '17'|| charCode == '120' || charCode == '99' || charCode == '118' || charCode == '97')){
						$(this).popover('hide');
					     return true; 
					 }  
					 // to ignore special characters
			    	else if(ev.shiftKey == true && regex_specialchars.test(codeValue) && ev.key != 'End' && ev.key != 'Home'){
			    		$(this).popover('show');
					   	return false;
					}
					// to support keys like Home, End... 
					else if (charCode == '36' || charCode == '35' || charCode == '37' || charCode == '39' || charCode == '46' || charCode == '9') {
						$(this).popover('hide');
						return true; 		 
					}
					//to check only number		
					else if( !regex_number.test(codeValue) ){
						$(this).popover('show');
						return false;
					}		
				}
				return true;
			});
			/* $(".number").keyup(function(){
				if(!regex_number.test($(this).val())){
					$(this).val("");
				}
			}); */
			$(prefix+" [minvalue][maxvalue]").keyup(function(){
				var val = $(this).val();
				var min = $(this).attr("minvalue") || 0;
				var max = $(this).attr("maxvalue") || 1;
				
				if (!regex_number.test(val)){
					$(this).val('');
					$(this).popover('show');
				}
				else if(parseInt(val) < min || isNaN(val)){
					$(this).popover('show');
				}
				else if(parseInt(val) > max){
					$(this).popover('show');
				}
				else 
				{
					$(this).popover('hide');
					$(this).val(val);
				}
				
			});
			
			$(prefix+" .hexa").keypress(function(ev){
				if(ev)
				{
					var charCode = (ev.which) ? ev.which : ev.keyCode;
					var codeValue = String.fromCharCode( charCode );		
					
					// to support cut copy and paste functions
					if(ev.ctrlKey == true && (charCode == '17'|| charCode == '120' || charCode == '99' || charCode == '118' || charCode == '97')){
					     return true; 
					 }  
					 // to ignore special characters
			    	else if(ev.shiftKey == true && regex_specialchars.test(codeValue) && ev.key != 'End' && ev.key != 'Home'){
					   	return false
					}
					// to support keys like Home, End... 
					else if (charCode == '36' || charCode == '35' || charCode == '37' || charCode == '39' || charCode == '46' || charCode == '9') {
						return true; 		 
					}
					//to check only hexadecimal
					else if( !regex_hex.test(codeValue)){
					  return false;
					}
				}
				return true;
			});
			
			$(prefix+" [maxvalue]").keyup(function(){
				var val = $(this).val();
				var max = $(this).attr("maxvalue") || 1;
				if(isNaN(val)){
					$(this).popover('show');
					$(this).val('');
				}
				else if(parseInt(val) > max){
					$(this).popover('show');
					$(this).val(max);
				}
				else{
					$(this).val(val);
				}
			});
			
			$(prefix+" [minvalue]").keyup(function(){
				var val = $(this).val();
				var min = $(this).attr("minvalue") || 1;
				if(isNaN(val)){
					$(this).val('');
					$(this).popover('show');
				}
				else if(parseInt(val) < min){ 
					$(this).focus();
					$(this).popover('show');
			       $(this).css({ 'border':'1px solid red'});
				}
				else{
					$(this).val(val);
                    $(this).css({ 'border':'1px solid #ccc'});
				}
			});
			
			$(prefix+" [minlength]").bind("change blur", function(){
				var val = $(this).val();
				var min = $(this).attr("minlength") || 1;
				
				if(val.length < min){
					if(val.length > 0){
						$(this).focus();
						$(this).popover('show');
					    $(this).css({ 'border':'2px solid red'});
					}else{
						$(this).css({ 'border':'1px solid #ccc'});
					}
				}else{
					   $(this).css({ 'border':'1px solid #ccc'});
				}
			});
			
			$(prefix+" .alphanumeric").keyup(function(){
				var val = $(this).val();
				if ( val != '' && !regex_alphanumeric.test(val)){
					$(this).val('');
					$(this).popover('show');
				}		
				else{
					$(this).val(val);
				}
			});
			
			$(prefix+" .pattern").bind("change blur",function(){
				
				  var empty='';
				  var alphanumericsupport = "false";
			      var reg = new RegExp($(this).attr("pattern"));
				  var val =  $(this).val();
				  var splCharsFlag = "false";
				  
				  // check the customized attribute 
				  if($(this).attr("allowAlphaNumeric") != undefined){
						alphanumericsupport =$(this).attr("allowAlphaNumeric");
				  }
				
			      //  To check special char
				  var splChars = "@.!*|,\"<>[]{}`\';()&$#%";
				  for (var i = 0; i < val.length; i++) {
						if (splChars.indexOf(val.charAt(i)) != -1){
							splCharsFlag = "true";
							break;
					}
				 }
			      // validation with alpha numeric support		
				  if( splCharsFlag == "true" && alphanumericsupport == "true" && !reg.test(val) ){
							$(this).trigger( "focus" );
							$(this).popover('show');
							$(this).blur(function () {
							$(this).css({ 'border':'1px solid red'});
							$(this).focus();	
						   });
						   $(this).val(empty);
						   return;
				 }	 
			    // SIP format validation	 
				 else if( alphanumericsupport == "false" && !reg.test(val) ){
							$(this).trigger( "focus" );
							$(this).popover('show');
							$(this).blur(function () {
							$(this).css({ 'border':'1px solid red'});
							$(this).focus();	
						   });
						    $(this).val(empty);
						    return;
					   }
			    else{
						$(this).css({ 'border':'1px solid #ccc'});
				}
				 $(this).val(val);
			});
		},
		
		validateFormSubmit : function(prefix){
			var validAttr = "";
			
			$(prefix+" input.required,select.required").each(function(){
				if($(this).val().trim() == ""){
					if(validAttr ==""){
						validAttr = $(this).attr("id") || $(this).attr("name");					
					}else{
						validAttr = validAttr +","+($(this).attr("id") || $(this).attr("name"));
					}
					 $(this).css({ 'border':'1px solid red'});
				}else{
					
					 $(this).css({ 'border':'1px solid #ccc'});
				}
				
				if($(this).attr("type") == "radio"){
					if(!$("[name="+$(this).attr("name")+"]").is(':checked')){
						if(validAttr ==""){
							validAttr = $(this).attr("id") || $(this).attr("name");					
						}else{
							validAttr = validAttr +","+($(this).attr("id") || $(this).attr("name"));
						}
					}
				}
				if($(this).attr("type") == "checkbox"){
					if($(this).is(':checked')){
						if(validAttr ==""){
							validAttr = $(this).attr("id") || $(this).attr("name");					
						}else{
							validAttr = validAttr +","+($(this).attr("id") || $(this).attr("name"));
						}
					}
				}
				
			});
			
			if(validAttr!=""){
				alert(validAttr+" is required");
				return false;
			}
			return true;
		}
	};

});