/*
 * OperationController: is the super class for all operation controllers
 * 
 */
define(['frameworkViews/FrameworkView', 'ErrorHandler', 'frameworkErrors/FrameworkError'],
		function(FrameworkView, ErrorHandler, FrameworkError){
	return FrameworkView.extend({
		
		processRequest : function(requestContext) {
			this.displayError(new FrameworkError('OPERATION_CONTROLLER_IMPLEMENTATION_ERROR'));
		},
		ProcessRequestOnControllerChange: function(requestContext, disableOperations) {
			this.displayError(new FrameworkError('OPERATION_CONTROLLER_IMPLEMENTATION_ERROR'));
		},
		successCallback: function(responseModel) {
			this.onServerSuccess(responseModel);
		},
		errorCallback: function(responseModel) {
			this.onServerFailure(responseModel);
		},
		onServerFailure: function(responseModel) {
			var httpError = undefined;
			if(responseModel.status == 0 && responseModel.statusText == "timeout") {
				httpError = new FrameworkError('HTTP_REQUEST_TIMEOUT_ERROR');
				httpError.setErrorRecomendation('Request timed out! Please check the status of the submitted request later.');
			} else {
				httpError = new FrameworkError('HTTP_SERVER_ERROR', [responseModel.status,responseModel.statusText, responseModel.responseText]);
			}
			this.displayError(httpError);
		},
		displayError: function(errorObject) {
			ErrorHandler(errorObject);
		},
		close : function() {
			FrameworkView.prototype.close.call(this);
			if(this.fcoView) {
				this.fcoView.close();
			}
			if(this.servicesView) {
				this.servicesView.close();
			}
		},
		hideLoading : function(){
			this.layout.hideLoading();
		}
	});
});
