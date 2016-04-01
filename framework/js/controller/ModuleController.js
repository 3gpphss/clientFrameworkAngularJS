/*
 * ModuleController: is a business layer. It contains utility functions to get module information.
 */
define(function(){
	return {
		getModules: function(requestContext) {
			return this.ModuleManager.getModules(requestContext);
		},
		getViews : function(fcoModel, fcoView, servicesModel, servicesView, requestContext){
			var modules = this.getModules(requestContext);
			for ( var i = 0; i < modules.length; i++) {
				var moduleName = modules[i];
				// this has to be commented accourding to modification in COnfiguration (ModuleViewName will not be available in new Configuration)
				// var moduleView = this.ModuleManager.getModuleView(requestContext, moduleName);
			
				var viewController = this.ModuleManager.getModuleViewController(moduleName);
				if (typeof(viewController.getView) === "function") { 
					var moduleSubView = viewController.getView(fcoModel, fcoView, requestContext);
					if(moduleSubView){
						moduleSubView.name = moduleName;
						moduleSubView.servicesModel =  servicesModel;
						moduleSubView.servicesView = servicesView;
						fcoView.addChildView(moduleSubView);
					}
				}
	
			}
		},
		getModels : function(fcoModel, servicesModel, requestContext){
			var modules = this.getModules(requestContext);
			for ( var i = 0; i < modules.length; i++) {
				var modelController = this.ModuleManager.getModuleModelController(modules[i]);
				if (typeof(modelController.getModel) === "function") {
					modelController.getModel(fcoModel, servicesModel, requestContext);
			}
			}
		},
		checkOperationAvailable : function(fcoName, operationName){
			return this.ModuleManager.checkOperationAvailable(fcoName, operationName);
		},
		getChangeIdConfig : function(requestContext){
			return this.ModuleManager.getChangeIdConfig(requestContext);
		}
	};
});
