/*
 * ExtendedOperationController: Responsible for end to end flow for extendedOperation.
 * 
 */
define(['OperationController', 'frameworkErrors/ServerError', 'frameworkErrors/FrameworkError', 'frameworkPath/util/MessageFormat'],
		function(OperationController, ServerError, FrameworkError, MessageFormat){
	return OperationController.extend({
		processRequest : function(requestContext){
			this.requestContext = requestContext;
			this.invokeModuleController();
		},
		invokeModuleController : function(){
			this.requestContext.setType("request");
			this.ModuleController.getModels(this.fcoModel, undefined, this.requestContext);
			this.ModuleController.getViews(this.fcoModel, this.fcoView, undefined, undefined, this.requestContext);
			this.fcoView.model = this.fcoModel;
			this.render();
		},
		render : function(){
			this.layout.renderViews(this.fcoView);
			this.hideLoading();
		},
		onSubmit : function() {
			this.fcoView.preSubmit();
			var extendedModel = this.RequestFactory.getRequestModel(this.RequestTypes.extendedOperation);
			extendedModel.setRequestVersion(this.requestContext.getRequestVersion());
			extendedModel.setOperation(this.requestContext.getExtendedOperationName());
			extendedModel.getOperation().set(this.fcoView.model.attributes);
			this.DAO.extendedRequest(extendedModel, 'successCallback', 'errorCallback', this);
		},
		onServerSuccess : function(responseModel){
			if(responseModel.get('extendedResponse').get('errorCode')) {
				var errorObject = new ServerError(responseModel.get('extendedResponse').get('errorCode'),
						responseModel.get('extendedResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('extendedResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('extendedResponse').get('errorRecomendation'));
				
				this.displayError(errorObject);
				this.hideLoading();
			} else {
				try {
					this.fcoModel = responseModel.get("extendedResponse").get("operation");
					this.changeController('extended operation response is success');
				} catch(err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', ['extendedResponse.object']));
					this.hideLoading();
				}
			}
		},
		changeController: function(result) {
			this.layout.changeLayout(this.fcoModel, result, 'ExtendedResponseOperation', false,this.requestContext); 
		},
		/*onResultSuccess : function(result) {
			this.invokeModuleController();
			this.layout.closeButtons();
			this.layout.displayMessage(result);
		},*/
		onCancel: function() {
			this.layout.removeLayout();
		}
	});
});