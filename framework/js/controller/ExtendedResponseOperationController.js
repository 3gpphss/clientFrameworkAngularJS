/*
 * SearchController: Responsible for end to end flow for search.
 * 
 */
define(['OperationController', 'frameworkErrors/FrameworkError'],
		function(OperationController, FrameworkError){
	return OperationController.extend({
		processRequestOnControllerChange : function(fcoModel,requestContext){
			this.requestContext = requestContext;
			this.requestContext.setType("response");
			this.fcoModel = fcoModel;
			this.invokeModuleController(); 
		},
		invokeModuleController : function(){
			this.ModuleController.getViews(this.fcoModel, this.fcoView, undefined, undefined, this.requestContext);
			this.fcoView.model = this.fcoModel;
			this.render();
			this.layout.closeButtons();
		},
		render : function(){
			this.layout.renderViews(this.fcoView);
			this.hideLoading();
		}
	});
});
