/*
 * BulkOperationController: is the super class for all operation controllers
 * 
 */
define(['frameworkViews/FrameworkView', 'BulkErrorHandler', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError'],
		function(FrameworkView, BulkErrorHandler, FrameworkError, ServerError){
	return FrameworkView.extend({
		displayLayout : function(requestContext) {
			this.displayError(new FrameworkError('OPERATION_CONTROLLER_IMPLEMENTATION_ERROR'));
		},
		successCallback: function(responseModel) {
			this.onServerSuccess(responseModel);
		},
		errorCallback: function(responseModel) {
			this.onServerFailure(responseModel);
		},
		onServerSuccess : function(responseModel) {
			if (responseModel.get('bulkTransferResponse').get('errorMessage')) {
				var errorObject = new ServerError(responseModel.get('bulkTransferResponse').get('errorCode'),
						responseModel.get('bulkTransferResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('bulkTransferResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('bulkTransferResponse').get('errorRecomendation'));
				this.displayError(errorObject);
			} else {
				var message = undefined;
				try {
					message = responseModel.get("bulkTransferResponse").get("acknowledgementMessage");
					this.layout.resetNavigationData();
				} catch (err) {
					this.displayError(new FrameworkError(
							'BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR',
							['bulkTransferResponse.acknowledgementMessage']));
				}
				this.displayMessage(message);
			}
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
			BulkErrorHandler(errorObject);
			this.hideLoading();
		},
		hideLoading : function(){
			this.layout.hideLoading();
		},
		displayMessage : function(message){
			$("#bulkSuccessDiv").html(message);
			this.hideLoading();
		},
		validateRequest: function() {
			var bulkNavigationData = this.layout.getBulkNavigationData();
			var bulkModel = this.getBulkModel();
			if(bulkNavigationData.getResultFileName() == "") {
				alert("Result File Name is mandatory.");
				return false;
			} 
			if(bulkNavigationData.getIdentifierListText()) {
				if(bulkNavigationData.getIdentifierListFilterType() == "negative" && bulkModel.get("filter") == "") {
					alert("Filter and Identifier File Name cannot be empty when identifier file name is marked for negative list.");
					return false;
				}
			} else if(!bulkModel.get("filter")) {
				alert("Provide either an Identifier file name or specify a filter condition.");
				return false;
			}
			return true;
		},
		setRequestContextToRequestModel: function(bulkModel, requestContext) {
			bulkModel.setRequestVersion(requestContext.getRequestVersion());
			bulkModel.setObjectclass(requestContext.getBulkFcoType());
			bulkModel.setOperationalAttributes("GUIResultFileName",requestContext.getResultFileName());
			
			var responseFileSize = requestContext.getResponseFileSize()
			if(requestContext.getSchedulable()){
				bulkModel.setSchedulable("true");
			}
			if(responseFileSize != ""){
				bulkModel.setResponseFileSize(responseFileSize);
			}
			
		}
	});
});
