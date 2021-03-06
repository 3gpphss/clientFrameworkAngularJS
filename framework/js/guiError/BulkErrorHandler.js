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
		$("#bulkMoreInfo").off('click');
		// Turn on event on current error message
		$("#bulkMoreInfo").on('click'); 
		$("#bulkErrorDiv").show();
		$("#bulkErrorMessageDiv").html(errorMessage);
		// Loading icon has to be hidden when error occurs
		$("#load").hide();
		
		// Display formatted error details
		$("#bulkMoreInfo").click(function() {
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