/*
 * BaseView: Base backbone view for all framework and module views.
 * 			 FrameworkView and ModuleView extends this class.
 * 			 Provides basic rendering functionality, displaying of provisioning data on the GUI using render())
 * 			 Provides functionality to delete a view by un-binding the model and model binder, if any, 
 * 				clearing the view el and unregistering of any registered events using close().
 * 		
 */
define(['modelBinder', 'framework/js/util/ConfigurationManager','FrameworkValidator'],function(modelBinder, ConfigurationManager,FrameworkValidator){
	return Backbone.View.extend({
		isExtendedUpdate: ConfigurationManager.isExtendedUpdate(),
		validateContentId : '',
		validateList : [],
		initialize : function() {
			//this._modelBinder = new Backbone.ModelBinder();
		},
		render : function() {
			this.appendEl();
			this.bindModel();
			//TODO: Check the implications of including delegateEvents() here
			//this.delegateEvents();
			return this;
		},
		reRender: function() {
			this.clearEl();
			this.render();
		},
		appendEl: function() {
			this.$el.append(this.template(this.model.toJSON()));
		},
		bindModel: function() {
			if(this._modelBinder != undefined) {
				this._modelBinder.bind(this.model, this.$el);
			}
		},
		close : function() {
			this.unbindModelAndModelBinder();
			this.unbindCollection();
			this.clearEl();
			this.unregisterEventsFromEl();
		},
		unbindModelAndModelBinder: function() {
			if (this.model) {
				this.model.unbind();
			}
			if(this._modelBinder) {
				this._modelBinder.unbind();
			}
		},
		unbindCollection: function () {
			if (this.collection) {
				this.collection.unbind();
			}
		},
		clearEl: function() {
			this.$el.html("");
		},
		unregisterEventsFromEl: function() {
			this.$el.off();
		},
		preSubmit: function() {

		},
		deleteConfirmDialog : function(){ 
			var r=confirm("Do you really want to delete the selected service?");
			if (r==true)
			{
				this.deleteService();
			}
			else
			{
				x="You pressed Cancel!";
			}
		},
		validateWithId : function(){
			FrameworkValidator.scoValidateFormSubmit(this.validateContentId);
		},
		validateWithList : function(){
			FrameworkValidator.scoValidateWithList(this.validateList);
		}
	});
});


