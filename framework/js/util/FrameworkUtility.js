/* Variables */
var regex_number = /^[0-9\b]+$/;
var regex_alphanumeric = /[a-zA-Z0-9]+$/;
var regex_specialchars = /[!@#\$%\^\&*\)\(+_]+$/;
var regex_hex = /[a-fA-F0-9\b]+$/;
var regex_space = /[\s]+$/;
var tmp_range ='';
var tmp_alphanumberic ='';
var tmp_space='';
 
/* Function to verify the number values
   It also handles cut copy paste... functions */
   
 function isNumber(event)
 {
	if(event)
	{
		var charCode = (event.which) ? event.which : event.keyCode;
		var codeValue = String.fromCharCode( charCode );		
		
		// to support cut copy and paste functions
		if(event.ctrlKey == true && (charCode == '17'|| charCode == '120' || charCode == '99' || charCode == '118' || charCode == '97')){
		     return true; 
		 }  
		 // to ignore special characters
    	else if(event.shiftKey == true && regex_specialchars.test(codeValue) && event.key != 'End' && event.key != 'Home'){
		   	return false
		}
		// to support keys like Home, End... 
		else if (charCode == '36' || charCode == '35' || charCode == '37' || charCode == '39' || charCode == '46' || charCode == '9') {
			return true; 		 
		}
		//to check only number		
		else if( !regex_number.test(codeValue) ){
			return false;
			
		}		
	}
	return true;
}  

/* Function to check range based on the minimum and maximum values. 
   It accepts only integer. */

function range(value, min, max) 
{
    if(!value)
    { 
			tmp_range = value;
			return value;
	}
    else
    {
			if (!regex_number.test(value)) return tmp_range;
			else if(parseInt(value) < min || isNaN(value)) return min; 
			else if(parseInt(value) > max) return max; 
			else 
			{
				tmp_range = value;
				return value;
			}
	}	
}

/* Function to validate mandatory attributes */

function validate(el) {
       var isValid = true;
       var mandatoryAttrs = new Array();
       var templateSelector = "#" + el + " .required";
       $(templateSelector).each(function() {
        if(this.value){
             if ($.trim(this.value) === '') {
                     $(this).focus();
                     mandatoryAttrs.push(this.attributes.name != undefined ? this.attributes.name.value : this.attributes.id.value  );
                     isValid = false;
              }
       }
       else if (this.value === '') {
                     $(this).focus();
                     mandatoryAttrs.push(this.attributes.name != undefined ? this.attributes.name.value : this.attributes.id.value  );
                     isValid = false;
              }
       });
     	if(!isValid) {
    	      var message = "Enter mandatory attribute: ";
    	      if(mandatoryAttrs.length > 1){
    	    	  message = "Enter mandatory attributes: ";
    	      }
              alert( message + mandatoryAttrs + ' !!');
       }       return isValid;
}

/* Function to check given input is Hexadecimal */

function isHexadecimal(event) {
	if(event)
	{
		var charCode = (event.which) ? event.which : event.keyCode;
		var codeValue = String.fromCharCode( charCode );		
		
		// to support cut copy and paste functions
		if(event.ctrlKey == true && (charCode == '17'|| charCode == '120' || charCode == '99' || charCode == '118' || charCode == '97')){
		     return true; 
		 }  
		 // to ignore special characters
    	else if(event.shiftKey == true && regex_specialchars.test(codeValue) && event.key != 'End' && event.key != 'Home'){
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
 }
 
 /* Function to check given value is less than 999. */
 
function maxValueCheck(value, max) 
{
	if(parseInt(value) > max|| isNaN(value)) 
    	alert('Enter value less then:'+ max );
        return value; 
}

//Function to check value is greater than 2.
function minValueCheck(value, min) 
{
    if(parseInt(value) < min || isNaN(value)) 
    	alert('Enter value greater then:'+ min);
        return value; 
}

/* Function to validate given email address */
function validatePattern(email) {
      var empty='';
	  var alphanumericsupport = "false";
      var reg = new RegExp(email.attributes.pattern.value);
	  var val = email.value;
	  var splCharsFlag = "false";
	  
	  // check the customized attribute 
	  if(email.attributes.allowAlphaNumeric){
			alphanumericsupport = email.attributes.allowAlphaNumeric.value;
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
				$(email).trigger( "focus" );
				$(email).popover('show');
				$(email).blur(function () {
				$(this).css({ 'border':'1px solid red'});
				$(this).focus();	
			   });
			   return empty;
	 }
	 
    // SIP format validation	 
	 else if( alphanumericsupport == "false" && !reg.test(val) ){
				$(email).trigger( "focus" );
				$(email).popover('show');
				$(email).blur(function () {
				$(this).css({ 'border':'1px solid red'});
				$(this).focus();	
			   });
			   return empty;
		   }
    else{
		$(email).blur(function () {
			$(this).css({ 'border':'1px solid #ccc'});
    	   });
	}
	 return val;
}

/* Function to check Minimum length of the given value */
function checkMinLength(value){
	if(value.value.length < value.attributes.maxlength.value){
	$(value).trigger( "focus" );
	$(value).popover('show');
	$(value).blur(function () {
       $(this).css({ 'border':'1px solid red'});
       });	
     }else{
       $(value).blur(function () {
      $(this).css({ 'border':'1px solid #ccc'});
       });
   }
}

/* Function to check Maximum length of the given value */
function checkMaxLength(value){
	if(value.value.length < value.attributes.minlength.value){
		$(value).trigger( "focus" );
		$(value).popover('show');
		$(value).blur(function () {
       	$(this).css({ 'border':'1px solid red'});
      	   });      	   
       }else{
		$(value).blur(function () {
       	$(this).css({ 'border':'1px solid #ccc'});
       });
  }
}

/* Function to validate Alpha numeric 
   It accepts only numbers and alphabetic */

function checkAlphaNumeric(value)
 {
		if ( value != '' && !regex_alphanumeric.test(value)) return tmp_alphanumberic;
		else{
				tmp_alphanumberic = value;
				return value;
		}
	}	

/* Function to validate space 
   It doesn't accepts space */
   
function checkSpace(value)
 {
		if (value != '' && regex_space.test(value)) return tmp_space;
		else{
				tmp_space = value;
				return value;
		}
	}	

