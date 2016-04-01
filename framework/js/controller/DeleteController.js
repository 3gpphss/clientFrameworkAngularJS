/*
 * SearchController: Responsible for end to end flow for search.
 * 
 */
define(['OperationController', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError', 'frameworkPath/util/MessageFormat'],
		function(OperationController, FrameworkError, ServerError, MessageFormat){
	return OperationController.extend({
		processRequestOnControllerChange : function(fcoModel,requestContext){
			this.fcoModel = fcoModel;
			this.requestContext = requestContext;
			this.render();
		},
		render : function(){
			this.layout.renderViews(this.fcoView);
			this.hideLoading();
		},
		onServerSuccess : function(responseModel){
			if(responseModel.get('deleteResponse').get('errorCode') !== undefined) {
				var errorObject = new ServerError(responseModel.get('deleteResponse').get('errorCode'),
					     responseModel.get('deleteResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('deleteResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('deleteResponse').get('errorRecomendation'));
				
				this.displayError(errorObject);
				this.changeController("",false);
			} else {
				try {
					this.fcoModel = responseModel.get("deleteResponse").get("resultingObject");
				} catch(err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', ['deleteResponse']));
					this.hideLoading();
				}
				this.changeController(MessageFormat('FCO_DELETE_SUCCESS', [this.type,this.fcoModel.get("identifier")]),true);
			}
		},
		onServerFailure: function(responseModel) {
			OperationController.prototype.onServerFailure.call(this);
			this.changeController("",false);
		},
		onConfirm : function(){
			var deleteModel = this.RequestFactory.getRequestModel(this.RequestTypes.deleteOperation);
			
			// TODO : have to change this code from requestContext to fcoModel
			deleteModel.setIdentifier(this.fcoModel.get("identifier"));
			
			//TODO : have to discuss on this
			/*this.type = this.fcoModel.get("xsi.type") || this.fcoModel.get("xsi").get("type"); 
			this.type = this.type.substring(this.type.lastIndexOf('.')+1,this.type.length);
			deleteModel.setObjectclass(this.type);*/
			this.type  = this.requestContext.getFcoType();
			deleteModel.setObjectclass(this.type);
			
			
			deleteModel.setReturnResultingObject("full");
			deleteModel.setRequestVersion(this.requestContext.getRequestVersion());
			
			if(this.requestContext.getRequestFcoType() === 'NSR'){
				this.DAO.nsrDeleteRequest(deleteModel, 'nsrDeleteSuccess', 'nsrDeleteFailure', this.NotificationManager);
				this.$el.html("<div><br><br></div><div class='box'>The request is submitted to PGW . You will be notified the response once the request is done.</div>");
				this.hideLoading();
			}else{
				this.DAO.deleteRequest(deleteModel, 'successCallback', 'onServerFailure', this);
			}
		},
		onCancel : function(){
			this.changeController("");
		},
		changeController : function(message,disableOperations){
			this.layout.changeLayout(this.fcoModel,message,"Search",disableOperations,this.requestContext);
		}
	});
});