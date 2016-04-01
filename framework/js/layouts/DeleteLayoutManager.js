/*
 * SearchController: Responsible for end to end flow for search.
 * 
 */
define(['OperationLayoutManager','text!framework/templates/fcoDeleteTemplate.html'],
		function(OperationController,fcoDeleteTemplate){
	return OperationController.extend({
		template : _.template(fcoDeleteTemplate),
		events : {
			'click #confirm' : 'onConfirm',
			'click #cancel' : 'onCancel' 
		},
		renderViews : function(view){
			this.$el.html(this.template());
			this.$el.show();
			this.controller.$el = this.$el;
			this.displayModificationAfterRender();
		},
		onConfirm : function(){
			this.displayLoading();
			this.controller.onConfirm();
		},
		onCancel : function(){
			this.controller.onCancel();
		}
	});
});
