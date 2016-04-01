/*
 * ModuleManager: is a business layer and a helper class for ModuleController.
 */
define(['frameworkPath/util/Interface', 'frameworkErrors/FrameworkError', 'ErrorHandler'],
		function(Interface, FrameworkError, ErrorHandler){
	return {
		childContexts : [],
		getModules: function(requestContext) {
			return this.ConfigurationManager.getModules(requestContext);
		},
		getModuleView: function(requestContext, moduleName) {
			return this.ConfigurationManager.getModuleView(requestContext, moduleName);
		},
		getAllModules: function() {
			return this.ConfigurationManager.getAllModules();
		},
		getModuleViewController : function(moduleName){
			var obj = this.childContexts[moduleName];
			if(obj !=undefined && obj.viewController!=undefined){
				return obj.viewController;
			}else{
				return {};
			}
		},
		getModuleModelController : function(moduleName){
			var obj = this.childContexts[moduleName];
			if(obj && obj.modelController){
				return obj.modelController;
			}else{
				return {};
			}
		},
		registerConfigHandler : function(){
			this.ConfigurationManager.registerConfigHandler("loadModulesSpec", this);
		},
		loadModulesSpec : function(){
			var modules = this.getAllModules();
			for ( var int = 0; int < modules.length; int++) {
				var path = "modulePath/"+modules[int]+"/js/controller/";
				this.loadSpec(path, modules[int]);
			}
		},
		loadSpec  : function(path, moduleName){
			var that = this;
			var viewControllerPath = path + "ViewController";
			var modelControllerPath = path +"ModelController";
			require([viewControllerPath,modelControllerPath],function(vc,mc){
				var viewController = new vc({'DAO':that.DAO ,'RequestFactory':that.RequestFactory,'RequestTypes' : that.RequestTypes});
				var modelController = new mc();
				
				var isVCProper = true, isMCProper = true;
				try {
					Interface.ensureImplements(modelController, that.ModuleModelController);
				} catch(errObject) {
					isVCProper = false;
					ErrorHandler(new FrameworkError('MODULE_MODEL_INTERFACE_NOT_IMPLEMENTED_ERROR', [moduleName]));
				}
				try {
					Interface.ensureImplements(viewController, that.ModuleViewController);
				} catch(errObject) {
					isMCProper = false;
					ErrorHandler(new FrameworkError('MODULE_VIEW_INTERFACE_NOT_IMPLEMENTED_ERROR', [moduleName]));
				}
				if(isVCProper && isMCProper){
					var childContext  = {"modelController":modelController , "viewController" : viewController};
					that.addData(childContext,moduleName.toString());
				}
			},function(err){
			});
		},
		addData : function(data, moduleName){
			this.childContexts[moduleName] = data;
		},
		checkOperationAvailable : function(fcoName, operationName){
			return this.ConfigurationManager.checkOperationAvailable(fcoName, operationName);
		},
		getChangeIdConfig : function(requestContext){
			return this.ConfigurationManager.getChangeIdConfig(requestContext);
		}
	};
});




