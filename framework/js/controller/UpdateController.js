/*
 * UpdateController: Responsible for end to end flow for update.
 * 
 */
define(['OperationController', 'nestedModel', 'frameworkErrors/ServerError', 'frameworkErrors/FrameworkError', 
        'frameworkPath/util/MessageFormat', 'frameworkPath/util/FrameworkHelper', 'frameworkPath/view/ServicesView'],
        function(OperationController, nestedModel, ServerError, FrameworkError, MessageFormat, FrameworkHelper, ServicesView){
	return OperationController.extend({

		processRequestOnControllerChange : function(fcoModel,requestContext){
			fcoModel.unset("xsi", {silent: true});
			this.fcoModel = fcoModel;
			this.readFco = JSON.stringify(this.fcoModel);
			this.requestContext = requestContext;
			this.initializeServiceView();
			this.ModuleController.getModels(this.fcoModel, this.servicesModel, this.requestContext);
			this.ModuleController.getViews(this.fcoModel, this.fcoView, this.servicesModel, this.servicesView, this.requestContext);
			this.fcoView.model = this.fcoModel;
			this.render();
		},
		/*
		//TODO: To be removed once delta processing is done
		removeHSSNotificationData: function(dataModel) {
			if(dataModel.get("hss")) {
				(dataModel.get("hss")).unset("notification", {silent: true});
			}
		},*/
		initializeServiceView: function() {
			var modules = this.ModuleController.getModules(this.requestContext);
			// Create ServicesView only if there are multiple supported modules
			if(modules.length > 1) {
				this.servicesView = new ServicesView();
				this.servicesView.fcoView = this.fcoView;
				this.servicesModel = this.servicesView.model;
			}
		},
		render : function(){
			this.layout.renderViews(this.fcoView);
			this.hideLoading();
		},
		getServicesView: function() {
			return this.servicesView;
		},
		onUpdate : function() {
			/*//TODO: Remove this logic of unsetting HSS Notification data once delta processing is fixed
			this.removeHSSNotificationData(this.fcoModel);
			*/
			this.preSubmitData = JSON.stringify(this.fcoModel);
			this.fcoView.preSubmit();
			this.updateModel = this.RequestFactory.getRequestModel(this.RequestTypes.modifyOperation);
			// TODO : have to change this code from requestContext to fcoModel
			this.updateModel.setReturnResultingObject("full");
			this.updateModel.setRequestVersion(this.requestContext.getRequestVersion());	
			//TODO : have to discuss on this
			/*this.type = this.fcoModel.get("xsi.type") || this.fcoModel.get("xsi").get("type"); 
			this.type = this.type.substring(this.type.lastIndexOf('.')+1,this.type.length);
			this.updateModel.setObjectClass(this.type);*/
			
			this.updateModel.setObjectClass(this.requestContext.getFcoType());

			this.updateModel.setIdentifier(this.fcoModel.get("identifier"));
			this.updateModel.setValueObjectModel(this.fcoModel, this.requestContext.getFcoType())
			
			// Add remove modifications to update model for all the removed attributes and SCOs
			this.setReadFCOModel();
			/*
			//TODO: Remove this logic of unsetting HSS Notification data once delta processing is fixed
			this.removeHSSNotificationData(this.readFcoModel);
			*/
			this.addRemoveModifications(this.readFcoModel, this.fcoModel);
			
			this.DAO.updateRequest(this.updateModel, 'successCallback', 'errorCallback', this);
		},
		addRemoveModifications: function(readFco, modifiedFco, parentProperty) {
			if(!parentProperty) {
				parentProperty = "";
			}
			for(property in readFco.attributes) {
				var readFcoChild = readFco.get(property);
				if(readFcoChild != null){
					var modifiedFcoChild = modifiedFco.get(property);
					if(modifiedFcoChild == undefined){
						this.updateModel.addRemoveOperation(parentProperty + property);
					}
					else {
						if((readFcoChild instanceof Backbone.NestedModel) && (modifiedFcoChild instanceof Backbone.NestedModel) ){
							this.addRemoveModifications(readFcoChild,modifiedFcoChild,property + '.'); 
						} else if((readFcoChild instanceof Backbone.Collection) && (modifiedFcoChild instanceof Backbone.Collection)) {
							if(modifiedFcoChild.length == 0) {
								this.updateModel.addRemoveOperation(parentProperty + property);
							}
						}
					}
				}
			}
		},
		onCancelUpdate: function() {
			var result = "";
			this.setReadFCOModel();
			if(this.requestContext.getOriginalViewType() != undefined){
				this.requestContext.setViewType(this.requestContext.getOriginalViewType());
			}
			this.changeController(this.readFcoModel, "");
		},
		setReadFCOModel: function() {
			this.readFcoModel = new Backbone.Model(JSON.parse(this.readFco));
			FrameworkHelper.createNestedModel(this.readFcoModel);
		},
		setPreSubmitModel: function() {
			this.preSubmitModel = new Backbone.Model(JSON.parse(this.preSubmitData));
			FrameworkHelper.createNestedModel(this.preSubmitModel);
		},
		changeController : function(model, message){
			this.layout.changeLayout(model,message,"Search",false,this.requestContext);
		},
		// TODO: Move this common logic to Operation controller
		onServerSuccess : function(responseModel){
			if(responseModel.get('modifyResponse').get('errorCode')) {
				var errorObject = new ServerError(responseModel.get('modifyResponse').get('errorCode'),
						responseModel.get('modifyResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('modifyResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('modifyResponse').get('errorRecomendation'));
				
				this.displayError(errorObject);
				this.reRenderWithPreSubmitModel();
			} else {
				try {
					this.fcoModel = responseModel.get('modifyResponse').get('resultingObject');
					this.changeController(this.fcoModel, MessageFormat('FCO_UPDATE_SUCCESS', [this.requestContext.getFcoType(), this.fcoModel.get("identifier")]));
				} catch(err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', ['modifyResponse.resultingObject']));
					this.hideLoading();
				}
			}
		},
		// On cancel or on PGW error, re-render the views with data before submit,
		// so that the modified in preSubmit calls does not affect the update flow
		reRenderWithPreSubmitModel: function() {
			this.setPreSubmitModel();
			this.fcoModel = this.preSubmitModel;
			this.fcoView.closechildViews();
			this.fcoView.model = this.fcoModel;
			this.ModuleController.getModels(this.fcoModel, this.servicesModel, this.requestContext);
			this.ModuleController.getViews(this.fcoModel, this.fcoView, this.servicesModel, this.servicesView, this.requestContext);
			this.render();
		}
	});
});
