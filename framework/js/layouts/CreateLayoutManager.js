/*
 * CreateController: Responsible for end to end flow for create.
 * 
 */
define(['OperationLayoutManager', 'text!framework/templates/fcoCreateTemplate.html'],
		function(OperationLayoutManager, createTemplate){
	return OperationLayoutManager.extend({
		template: _.template(createTemplate),
		events: {
			'click #submitCreate': 'onSubmitCreate',
			'click #cancelCreate': 'onCancelCreate'
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
		onSubmitCreate : function() {
			//if(this.validateFormSubmit("#fcoDiv")){
				this.displayLoading();
				this.controller.onSubmitCreate();
			//}
		},
		onCancelCreate: function() {
			this.controller.onCancelCreate();
		}
	});
});
