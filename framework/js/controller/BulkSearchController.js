/*
 * BulkSearchController: Responsible for end to end flow for search.
 * 
 */
define(['BulkOperationController', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError', 'frameworkModels/FrameworkModel' ],
		function(BulkOperationController, FrameworkError, ServerError, FrameworkModel) {
	return BulkOperationController.extend({
		onSubmitSearch : function(requestContext) {
			if(this.validateRequest()) {
				this.layout.displayLoading();
				var bulkSearchModel = this.getBulkSearchModel(requestContext);

				this.DAO.bulkSearchRequest(bulkSearchModel,'successCallback', 'errorCallback', this);
			}
		},
		getBulkSearchModel: function(requestContext) {
			var bulkSearchModel = this.RequestFactory.getRequestModel(this.RequestTypes.searchOperation);
			this.setRequestContextToRequestModel(bulkSearchModel, requestContext);
			if(requestContext.getIdentifierListText() != "") {
				bulkSearchModel.setIdentifierListText(requestContext.getIdentifierListText());
				bulkSearchModel.setIdentifierListAlias(requestContext.getIdentifierListAlias());
				bulkSearchModel.setIdentifierListFilterType(requestContext.getIdentifierListFilterType());
			}
			if(this.searchModel.get("filter") != "") {
				bulkSearchModel.setFilter(this.searchModel.get("filter"));
			}
			if(this.searchModel.get("returnAttribute")) {
				bulkSearchModel.setReturnAttribute(this.searchModel.get("returnAttribute"));
			}
			return bulkSearchModel;
		},
		getBulkModel: function() {
			this.searchModel = new FrameworkModel();
			var data = this.layout.getLayoutData();
			if(data.filter != undefined) {
				this.searchModel.set("filter", data.filter);					
			}
			if(data.returnAttributes.length != 0) {
				this.searchModel.set("returnAttribute", data.returnAttributes);
			}
			return this.searchModel;
		},
		getFcoDetails : function(requestContext) {
			this.requestContext = requestContext;
			if(this.fcoName == this.requestContext.getBulkFcoType() && this.pcName == this.requestContext.getRequestVersion()){
				return; //No change in tree structure
			}
			this.layout.displayLoading();
			this.fcoName = this.requestContext.getBulkFcoType();
			this.pcName = this.requestContext.getRequestVersion();
			var fcoDetails = this.DAO.getFcoDetails({"fcoName": this.fcoName,"requestVersion": this.pcName},'successFcoDetails', 'errorCallback', this);
		},
		successFcoDetails : function(responseModel) {
			if (responseModel.get("errorMessage") == null) {
				this.layout.hideLoading();
				this.layout.populateFirstLevlAttr(responseModel);
			} else {
				this.displayError(new ServerError(undefined,responseModel.get('errorMessage')));
			}
		}
	});
});