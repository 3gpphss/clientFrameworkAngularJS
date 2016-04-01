/*
 * BatchableRequestModel: Responsible to contain batch request data to be sent to the server.
 * 						  Base class for Create/Update/Delete operation request models.  
 */
define(["frameworkModels/RequestModel"],function(RequestModel){
	return RequestModel.extend({
		defaults : {
			"language": "en_us",
			"execution": "synchronous"
		}
	});
});
