/*
 * ChangeIdLayoutManager: Responsible for ChangeId layout design and framework events.
 * 
 */
define(['OperationLayoutManager', 'text!framework/templates/fcoChangeIdTemplate.html'],
		function(OperationLayoutManager, searchTemplate){
	return OperationLayoutManager.extend({
		template: _.template(searchTemplate),
		events: {
			'click #changeIdMode'	: 'onChangeId',
			'click #changeIdCancel' : 'onChangeIdCancel'
		},
		onChangeId : function(){
//			this.displayLoading();
			//if(this.validateFormSubmit("#fcoDiv")){
				this.controller.onChangeId();
			//}
		},
		onChangeIdCancel :function(){
			this.controller.onChangeIdCancel();
		},
		renderViews : function(view){
			this.$el.html(this.template());
			this.setView("#fcoDiv",view);
			this.$el.show();
			//this.registerValidations("#fcoDiv");
		}
	});
});
