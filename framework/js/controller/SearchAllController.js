/*
 * SearchController: Responsible for end to end flow for search.
 * 
 */
define(['OperationController', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError','frameworkPath/view/SearchAllView'],
		function(OperationController, FrameworkError, ServerError,SearchAllView){
	return OperationController.extend({
		processRequest : function(requestContext){
			this.requestContext = requestContext;
			var searchModel = this.RequestFactory.getRequestModel(this.RequestTypes.searchOperation);
			searchModel.setReturnAttribute(this.requestContext.getUniqueId());
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
			} else {
				try {
					this.fcoCollection = responseModel.get("searchResponse").get("objects");
				} catch(err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', ['searchResponse.objects']));
				}
				this.preRender();
			}
		},
		preRender : function(){
			this.searchAllView = new SearchAllView();
			this.searchAllView.collection = this.fcoCollection;
			this.render(); 
		},
		render : function(){
			this.layout.renderViews(this.searchAllView);
			this.hideLoading();
		}
	});
});
