/*
 * ExtendedOperationLayoutManager : Responsible for end to end flow for extended Operations.
 * 
 */
define(['OperationLayoutManager','text!framework/templates/extendedOperationTemplate.html'],
		function(OperationLayoutManager,extendedOperationTemplate){
	return OperationLayoutManager.extend({
		template : _.template(extendedOperationTemplate),
		rendered : false,
		events : {
			'click #submitExtendedOperation' : 'onSubmit',
			'click #cancelExtendedOperation' : 'onCancel' 
		},
		renderViews : function(view){
			this.$el.html(this.template({}));
			this.setView("#fcoDiv",view);
			this.$el.show();
			//this.registerValidations("#fcoDiv");
		},
		onSubmit : function() {
			var validation = true;
			var that = this;
			this.$el.find('input.required').each(function() {
				if (this.value == undefined || this.value.trim() === '') {
					alert('Please enter the requierd value !!');
					$(this).focus();
					validation = false;
				}
			});
			if(validation){
				//if(this.validateFormSubmit("#fcoDiv")){
				this.displayLoading();
				this.controller.onSubmit();
				//}
			}
		},
		onCancel : function(){
			this.controller.onCancel();
		},
		displayMessage : function(message){
			this.frontController.clearAllMessageDivs();
			this.frontController.displayMessage(message);
		},
		closeButtons : function(){
			this.$el.find("#submitExtendedOperation").hide();
			this.$el.find("#cancelExtendedOperation").hide();
		},
		changeLayout : function(serverModel, message, operation,disableOperations,requestContext){
			this.displayMessage(message);
			requestContext.setOperationType(operation);
			this.processRequestOnLayoutChange(serverModel,requestContext,disableOperations);
		}
	});
});
