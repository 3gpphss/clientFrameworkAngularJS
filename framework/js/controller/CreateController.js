/*
 * CreateController: Responsible for end to end flow for create.
 * 
 */
define(['OperationController','frameworkErrors/ServerError', 'frameworkErrors/FrameworkError', 'frameworkPath/util/MessageFormat', 'frameworkPath/view/ServicesView', 'frameworkPath/util/FrameworkHelper'],
		function(OperationController, ServerError, FrameworkError, MessageFormat, ServicesView, FrameworkHelper){
	return OperationController.extend({
		processRequest : function(requestContext){
			this.requestContext = requestContext;
			this.initializeServiceView();
			this.ModuleController.getModels(this.fcoModel, this.servicesModel, this.requestContext);
			this.ModuleController.getViews(this.fcoModel, this.fcoView, this.servicesModel, this.servicesView, this.requestContext);
			this.fcoView.model = this.fcoModel;
			this.render();
		},
		initializeServiceView: function() {
			var modules = this.ModuleController.getModules(this.requestContext);
			// Create ServicesView only if there are multiple supported modules
			if(modules.length > 1) {
				this.servicesView = new ServicesView();
				this.servicesView.fcoView = this.fcoView;
				this.servicesModel = this.servicesView.model;
			}
		},
		getServicesView: function() {
			return this.servicesView;
		},
		render : function(){
			this.layout.renderViews(this.fcoView);
			this.hideLoading();
		},
		onSubmitCreate : function() {
			this.preSubmitData = JSON.stringify(this.fcoModel);
			this.fcoView.preSubmit();
			var createModel = this.RequestFactory.getRequestModel(this.RequestTypes.createOperation);
			createModel.setObject(this.fcoModel,this.requestContext.getFcoType());
			//Set ReturnResultingObject type to full by default
			createModel.setReturnResultingObject('full');
			createModel.setRequestVersion(this.requestContext.getRequestVersion());
			this.DAO.createRequest(createModel, 'successCallback', 'errorCallback', this);
		},
		onServerSuccess : function(responseModel){
			if(responseModel.get('addResponse').get('errorCode')) {
				var errorObject = new ServerError(responseModel.get('addResponse').get('errorCode'),
						responseModel.get('addResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('addResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('addResponse').get('errorRecomendation'));
				
				this.displayError(errorObject);
				this.reRenderWithPreSubmitModel();
			} else {
				try {
					this.fcoModel = responseModel.get("addResponse").get("resultingObject");
					this.changeController(MessageFormat('FCO_CREATE_SUCCESS', [this.requestContext.getFcoType(), this.fcoModel.get("identifier")]));
				} catch(err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', ['addResponse.object']));
					this.hideLoading();
				}
			}
		},
		changeController: function(result) {
			this.layout.changeLayout(this.fcoModel, result, 'Search', false,this.requestContext); 
		},
		onCancelCreate: function() {
			this.layout.removeLayout();
		},
		setPreSubmitModel: function() {
			this.preSubmitModel = new Backbone.Model(JSON.parse(this.preSubmitData));
			FrameworkHelper.createNestedModel(this.preSubmitModel);
		},
		// On cancel or on PGW error, re-render the views with data before submit,
		// so that the modified in preSubmit calls does not affect the update flow
		reRenderWithPreSubmitModel: function() {
			this.setPreSubmitModel();
			this.fcoModel = this.preSubmitModel;
			this.fcoView.closechildViews();
			this.fcoView.model = this.fcoModel;
			this.ModuleController.getViews(this.fcoModel, this.fcoView, this.servicesModel, this.servicesView, this.requestContext);
			this.render();
		}
	});
});