/*
 * ErrorHandler: Client framework error handler is responsible to receive all server errors, 
 * internal client errors and displaying on GUI.
 */
define(['backbone'], function(backbone) {
	return function(errObject) {
		var errorMessage = '';

		if(errObject.requireType !== undefined) {
			requireType = errObject.requireType;
			requireModules = errObject.requireModules;
			errorMessage = requireType + ": while loading " + requireModules;
		} else {
			errorMessage = errObject.errorMessage;
		}
		
		// Render error message
		// Turn off events on old error messages
		$("#orderMgmtMoreInfo").off('click');
		// Turn on event on current error message
		$("#orderMgmtMoreInfo").on('click'); 
		$("#orderMgmtErrorDiv").show();
		$("#orderMgmtErrorMessageDiv").html("<span class='step error'><span class='icon'></span></span> "+errorMessage+"<a data-toggle='modal' data-placement='right' rel='tooltip'" +
				" href='#moreInfoPopUp' data-original-title='' title=''> <i class='icon-1x icon-info' title='more details' id='orderMgmtMoreInfo'></i></a>");
		// Loading icon has to be hidden when error occurs
		$("#load").hide();
		
		// Display formatted error details
		$("#orderMgmtMoreInfo").click(function() {
			var details = 
			"<form>" +
				"<fieldset>" +
					"<label>Error Id:" + errObject.errorId + "</label>" +
					"<label>Error Message:" + errorMessage + "</label>" +
					"<label>Error Hint:" + (errObject.errorHint || "NA") + "</label>" +
					"<label>Error Recommendation:" + (errObject.errorRecomendation || "NA") + "</label>" +
				"</fieldset>" +
			"</form>";
			$('#errorDetails').html(details);
		});
	};
});