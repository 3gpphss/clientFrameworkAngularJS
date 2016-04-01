/*
 * Used to fetch the configuration data from server
 * will be injected to ConfigurationManager to invoke a server call.
 */
define(function() {
	return {
		getAppConfigData : function(model, callbackMethod, errorCallback, callbackObject) {
			var that = this;
			model.url = "appConfig/tenant/searchrequest.htm";
			model.save({}, {
				success : function(model, response) {
					that.success(model, response, callbackMethod, callbackObject);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				}
			});
		},

		success : function(model, response, callbackMethod, callbackObject) {
			callbackObject[callbackMethod](model);
		},
		error : function(xhr, model, response, errorCallback, callbackObject) {
			callbackObject[errorCallback](xhr);
		}

	};
})