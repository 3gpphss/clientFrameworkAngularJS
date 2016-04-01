/*
 * ExtendedUpdateController: Responsible for end to end flow for update. Creates update request with both read and modified FCOs.
 * 
 */
define(["framework/js/controller/UpdateController", 'frameworkErrors/ServerError', 'frameworkErrors/FrameworkError', 'frameworkPath/util/MessageFormat'], 
		function(UpdateController, ServerError, FrameworkError, MessageFormat){
	return UpdateController.extend({
		onUpdate : function() {
			// TODO: Send readFcoModel to all application modules
			this.preSubmitData = JSON.stringify(this.fcoModel);
			this.fcoView.preSubmit();
			this.updateModel = this.RequestFactory.getRequestModel(this.RequestTypes.extendedModifyOperation);
			this.updateModel.setReturnResultingObject("full");
			this.updateModel.setRequestVersion(this.requestContext.getRequestVersion());	
			this.updateModel.setObjectClass(this.requestContext.getFcoType());

			this.updateModel.setIdentifier(this.fcoModel.get("identifier"));
			
			this.setReadFCOModel();
			this.updateModel.setValueObjectModel(this.readFcoModel, this.fcoModel, this.requestContext.getFcoType());
			
			this.DAO.extendedUpdateRequest(this.updateModel, 'successCallback', 'errorCallback', this);
		}
	});
});
