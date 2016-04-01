/*
 * SearchController: Responsible for end to end flow for search.
 * 
 */
define(['OperationController', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError'],
		function(OperationController,  FrameworkError, ServerError){
	return OperationController.extend({
		editOperationAvailable   : false,
		deleteOperationAvailable : false,
		
		processRequest : function(requestContext){
			this.requestContext = requestContext;
			
			var searchModel = this.RequestFactory.getRequestModel(this.RequestTypes.searchOperation);
			searchModel.setAliasTypeName(this.requestContext.getUniqueId());
			searchModel.setAliasTypeValue(this.requestContext.getUniqueIdValue());
			searchModel.setObjectclass(this.requestContext.getFcoType());
			searchModel.setRequestVersion(this.requestContext.getRequestVersion());
			this.DAO.searchRequest(searchModel, 'successCallback', 'errorCallback', this);
		},
		onServerSuccess : function(responseModel){
			if(responseModel.get('searchResponse').get('errorCode') !== undefined) {
				var errorObject = new ServerError(responseModel.get('searchResponse').get('errorCode'),
						responseModel.get('searchResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('searchResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('searchResponse').get('errorRecomendation'));
				this.displayError(errorObject);
				this.hideLoading();
			} else {
				try {
					this.fcoModel = responseModel.get("searchResponse").get("objects").at(0);
				} catch(err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', ['searchResponse.objects']));
					this.hideLoading();
				}
				this.preRender();
			}
		},
		preRender : function(){
			this.fcoView.model = this.fcoModel;
			this.render(); 
		},
		render : function(){
			this.setViews();
			this.editOperationAvailable = this.ModuleController.checkOperationAvailable(this.requestContext.getConfigFCO(),"Update");
			this.deleteOperationAvailable = this.ModuleController.checkOperationAvailable(this.requestContext.getConfigFCO(),"Delete");
			this.updateViewTypes = this.ConfigurationManager.getViewTypes(this.requestContext.getConfigFCO(),"Update");
			this.layout.renderViews(this.fcoView);
			this.hideLoading();
		},
		setViews : function(){
			this.ModuleController.getViews(this.fcoModel,this.fcoView,undefined, undefined, this.requestContext);
		},
		onDelete : function(){
			this.layout.changeLayout(this.fcoModel,"","Delete",false,this.requestContext);
		},
		processRequestOnControllerChange : function(fcoModel,requestContext){
			this.requestContext = requestContext;
			this.fcoModel = fcoModel;
			this.preRender(); 
		},
		onEdit :function(){
			this.requestContext.setOriginalViewType(this.requestContext.getViewType());
			this.requestContext.setViewType($("#updateViewType").val());
			this.layout.changeLayout(this.fcoModel,"","Update",false,this.requestContext);
			} 
	});
});
