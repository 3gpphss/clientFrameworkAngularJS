/*
 * BulkFilterController: Responsible for end to end flow for Filter.
 * 
 */
define(['BulkOperationController', 'frameworkErrors/FrameworkError','frameworkErrors/ServerError', 'frameworkModels/FrameworkModel'],
		function(BulkOperationController, FrameworkError, ServerError, FrameworkModel) {
	return BulkOperationController.extend({
		fcoName : undefined,
		pcName : undefined,
		getFcoDetails : function(requestContext) {
			this.requestContext = requestContext;
			if(this.fcoName == this.requestContext.getBulkFcoType() && this.pcName == this.requestContext.getRequestVersion()){
				return; //No change in tree structure
			}
			this.layout.displayLoading();
			// reset fcoName and pcName
			this.fcoName = this.requestContext.getBulkFcoType();
			this.pcName = this.requestContext.getRequestVersion();
			// Get new FCO details
			var fcoDetails = this.DAO.getFcoDetails({"fcoName": this.fcoName,"requestVersion": this.pcName},'successCallback', 'errorCallback', this);
		},
		onServerSuccess : function(responseModel) {
			if (responseModel.get("errorMessage") == null) {
				this.layout.hideLoading();
				this.layout.populateFilterDiv(responseModel);
			} else {
				this.displayError(new ServerError(undefined, responseModel.get('errorMessage')));
			}
		},
		getBulkModel: function() {
			this.filterModel = new FrameworkModel();
			if($("#filterTextArea").val() != undefined) {
				this.filterModel.set("filter", $("#filterTextArea").val().trim());
			}
			return this.filterModel;
		},
		validateFilter: function(filter) {
			this.layout.clearBulkStatusDiv();
			var model = new FrameworkModel({"filter": filter});
			this.DAO.validateFilterRequest(model, 'validateFilterSuccessCallback', 'validateFilterErrorCallback', this);
		},
		validateFilterSuccessCallback: function(responseModel) {
			if(responseModel.get('result') == "Failure") {
				var errorObject = new ServerError(responseModel.get('errorCode'), responseModel.get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('errorRecomendation'));
				this.displayError(errorObject);
			} else {
				this.displayMessage("Filter is syntactically valid");
			}
		},
		validateFilterErrorCallback: function(responseModel) {
			this.onServerFailure(responseModel);
		}
	});
});
