/*
 * ChangeIdController: Responsible for end to end flow for ChangeId Operation.
 */
define(['OperationController', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError','frameworkPath/view/ChangeIdView'],
		function(OperationController, FrameworkError, ServerError,ChangeIdView){
	return OperationController.extend({

		processRequest : function(requestContext){
			this.requestContext = requestContext;
			this.initializeChangeIdView();
			this.render();
		},
		initializeChangeIdView : function(){
			this.changeIdView = new ChangeIdView({model : this.fcoModel});
			this.changeIdView.data = this.ModuleController.getChangeIdConfig(this.requestContext);
		},
		onServerSuccess : function(responseModel){
			if(responseModel.get('changeIdResponse').get('errorCode') !== undefined) {
				var errorObject = new ServerError(responseModel.get('changeIdResponse').get('errorCode'),
						responseModel.get('changeIdResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('changeIdResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('changeIdResponse').get('errorRecomendation'));

				this.displayError(errorObject);
				this.hideLoading();
			} else {
				try {
					this.fcoModel = responseModel.get("changeIdResponse").get("resultingObject");
					this.changeController("ID is updated successfully");
				} catch(err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', ['searchResponse.objects']));
					this.hideLoading();
				}
			}
		},
		render : function(){
			this.layout.renderViews(this.changeIdView);
			this.hideLoading();
		},
		onChangeIdCancel : function(){
			this.layout.removeLayout();
		},
		onChangeId :function(){
			if(validate('fcoDiv')){
				this.layout.displayLoading();
				this.fcoModel.set('TIME',$("input:radio[name=TIME]:checked").val());
				var changeIdModel = this.RequestFactory.getRequestModel(this.RequestTypes.changeIdOperation);
				changeIdModel.setObjectclass(this.requestContext.getFcoType());
				changeIdModel.setRequestVersion(this.requestContext.getRequestVersion());
				if(this.fcoModel.get("setSwapIdentifier")!=undefined && this.fcoModel.get("setSwapIdentifier")!=""){
					changeIdModel.setNewIdType(this.fcoModel.get("setSwapIdentifier"));
					changeIdModel.setOldIdType(this.fcoModel.get("setSwapIdentifier"));
				}
				
				if(this.fcoModel.get('TIME')!=undefined && this.fcoModel.get('TIME')!= "" && this.fcoModel.get('TIME')!="swap" ){
					changeIdModel.setChangeIdProceeding(this.fcoModel.get('TIME'));
				}
				if(this.fcoModel.get('identityType')!='' && this.fcoModel.get('identityType')!='identifier'){
					changeIdModel.setNewIdAlias(this.fcoModel.get("identityType"));
					changeIdModel.setOldIdAlias(this.fcoModel.get("identityType"));
				}
				changeIdModel.setNewId(this.fcoModel.get("newId"));
				changeIdModel.setOldId(this.fcoModel.get("oldId"));
				changeIdModel.setReturnResultingObject("full");
				this.DAO.changeIdRequest(changeIdModel, 'successCallback', 'errorCallback', this);
			}
		},
		changeController : function(message){
			this.layout.changeLayout(this.fcoModel,message,"Search",false,this.requestContext);
		}
	});
});