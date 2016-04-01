/*
 * UpdateController: Responsible for end to end flow for update.
 * 
 */
define(['OperationLayoutManager', 'text!framework/templates/fcoUpdateTemplate.html'],
        function(OperationLayoutManager, updateTemplate){
	return OperationLayoutManager.extend({
		template: _.template(updateTemplate),
		
		events: {
			'click #update': 'onUpdate',
			'click #cancelUpdate': 'onCancelUpdate'
		},
		renderViews : function(view){
			this.$el.html(this.template({}));
			var servicesView = this.controller.getServicesView();
			if(servicesView != undefined){
				this.setView("#servicesDiv",servicesView);
			}
			this.setView("#fcoDiv",view);
			this.$el.show();
			//this.registerValidations("#fcoDiv");
			this.displayModificationAfterRender();
		},
		onUpdate : function() {
			//if(this.validateFormSubmit("#fcoDiv")){
			    this.displayLoading();
				this.controller.onUpdate();	
			//}
		},
		onCancelUpdate: function() {
			this.controller.onCancelUpdate();
		},
		getViewController : function(name){
			if(this.ConfigurationManager.isExtendedUpdate()) {
				name = "ExtendedUpdate";
			}
			var controller = this.ControllerFactory.getController(name,"singleProvisioning");
			controller.layout = this;
			return controller;
		}
	});
});
