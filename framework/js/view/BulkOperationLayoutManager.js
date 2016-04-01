/*
 *	BulkOperationLayoutManager : Provides the common functionality used by all Bulk operations		
 */
define([ 'backbone' ], function(Backbone) {
	return Backbone.View.extend({
		displayLayout : function(requestContext) {
			this.requestContext = requestContext;
			this.controllerProcessRequest();
			this.renderLayout();
			this.postDisplayLayout(requestContext);
		},
		controllerProcessRequest : function() {
			this.controller = this.getViewController(this.requestContext.getOperationType());
		},
		getViewController : function(name){
			var controller = this.ControllerFactory.getController(name, "bulkProvisioning");
			controller.layout = this;
			return controller;
		},
		renderLayout: function(){
			this.$el.append(this.template());
		},
		displayLoading : function(){
			$("#load").fadeTo(0, 0.8);
		},
		hideLoading : function(){
			$("#load").hide();
		},
		getBulkNavigationData: function() {
			return this.bulkController.getBulkNavigationData();
		},
		clearBulkStatusDiv: function() {
			this.bulkController.clearBulkStatusDiv();
		},
		postDisplayLayout : function(requestContext){

		},
		clearFilterTextArea: function() {
			if(this.filterTextArea) {
				this.$el.find(this.filterTextArea).val("");
			}
		},
		resetNavigationData: function() {
			return this.bulkController.resetNavigationData();
		}
	});
});