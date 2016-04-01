/*
 *	OperationLayoutManager : 		
 */
define(['backbone','FrameworkValidator'],function(Backbone,FrameworkValidator){
	return Backbone.View.extend({
		el:$("#mainDiv"),
		views : [],
		setView : function(name,view){
			var existing;
			if(view == undefined){
				view = name;
				name = view.el;
			}else{
				view.el = $(name);
				view.$el = $(name);
			}
			view.selector = name;
			
			existing = this.views[name];
			if(existing && view.cid !== existing.cid){
				this.removeView(existing);
			}
			this.renderView(view);
		},
		removeView : function(existing){
			var selector = existing.selector;
			existing.close();
			delete this.views[selector];
		},
		renderView : function(view){
			this.views[view.selector] = view;
			view.render();
		},
		getViewController : function(name){
			var controller =this.ControllerFactory.getController(name,"singleProvisioning");
			controller.layout = this;
			return controller;
		},
		processRequest : function(requestContext){
			this.requestContext = requestContext;
			this.controllerProcessRequest();
		},
		controllerProcessRequest : function(){
			this.displayLoading();
			this.controller = this.getViewController(this.requestContext.getOperationType());
			this.controller.processRequest(this.requestContext);
		},
		processRequestOnLayoutChange : function(fcoModel,requestContext, disableOperations){
			this.displayLoading();
			this.hideDiv = disableOperations;
			this.requestContext = requestContext;
			this.controller = this.getViewController(requestContext.getOperationType());
			this.controller.processRequestOnControllerChange(fcoModel,requestContext);
		},
		close : function(){
			this.clearEl();
			this.unregisterEventsFromEl();
			this.controller.close();
		},
		changeLayout : function(serverModel, message, operation,disableOperations,requestContext){
			this.frontController.changeLayout(serverModel, message, operation,disableOperations,requestContext);
		},
		removeLayout : function(){
			this.frontController.removeLayout();
		},
		clearEl: function() {
			this.$el.html("");
		},
		unregisterEventsFromEl: function() {
			this.$el.off();
		},
		displayModificationAfterRender : function(){
			this.$el.find(".nav-list").find("li:first").addClass("active");
		},
		
		displayLoading : function(){
			$("#load").fadeTo(0, 0.8);
		},
		hideLoading : function(){
			$("#load").hide();
		},
		validateFormSubmit : function(prefix){
			FrameworkValidator.validateFormSubmit(prefix);
		},
		registerValidations : function(prefix){
			FrameworkValidator.registerValidations(prefix);
		}
	});
});