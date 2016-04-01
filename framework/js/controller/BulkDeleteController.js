/*
 * BulkDeleteController: Responsible for end to end flow for delete.
 * 
 */
define(['BulkOperationController', 'frameworkErrors/FrameworkError', 'frameworkModels/FrameworkModel' ],
        function(BulkOperationController, FrameworkError, FrameworkModel) {
	return BulkOperationController.extend({
		onSubmitDelete : function(requestContext) {
			if(this.validateRequest() && this.deleteConfirmDialog()) {
				this.layout.displayLoading();
				var bulkDeleteModel = this.getBulkDeleteModel(requestContext);
				this.DAO.bulkRequest(bulkDeleteModel,'successCallback', 'errorCallback', this);
			}
		},
		getBulkDeleteModel: function(requestContext) {
			var bulkDeleteModel = this.RequestFactory.getRequestModel(this.RequestTypes.bulkOperation);
			this.setRequestContextToRequestModel(bulkDeleteModel, requestContext);
			if(requestContext.getIdentifierListText() != "") {
				bulkDeleteModel.setIdentifierListFileName(requestContext.getIdentifierListText());
				bulkDeleteModel.setIdentifierListAlias(requestContext.getIdentifierListAlias());
				bulkDeleteModel.setIdentifierListFilterType(requestContext.getIdentifierListFilterType());
			}
			if(this.deleteModel.get("filter") != "") {
				bulkDeleteModel.setFilter(this.deleteModel.get("filter"));
			}
			bulkDeleteModel.setOperation("delete");
			return bulkDeleteModel;
		},
		getBulkModel: function() {
			this.deleteModel = new FrameworkModel();
			var data = this.layout.getLayoutData();
			if(data.filter != undefined) {
				this.deleteModel.set("filter", data.filter);					
			}
			return this.deleteModel;
		},
		deleteConfirmDialog : function(){ 
			return confirm("Do you really want to perform a bulk delete?");
		}
	});
});
