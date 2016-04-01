/*
 * SearchLayoutManager: Responsible for Search layout design and framework events.
 * 
 */
define(['OperationLayoutManager', 'text!framework/templates/fcoSearchTemplate.html'],
		function(OperationLayoutManager, searchTemplate){
	return OperationLayoutManager.extend({
		template: _.template(searchTemplate),
		hideDiv : false,
		events: {
			'click #editMode'	: 'onEdit',
			'click #deleteMode' : 'onDelete'
		},
		onDelete : function(){
			this.controller.onDelete();
		},
		onEdit :function(){
			this.displayLoading();
			this.controller.onEdit();
		},
		renderViews : function(view){
			this.$el.html(this.template());
			this.setView("#fcoDiv",view);
			this.$el.show();
			view.$el.find('select,:checkbox,:radio').attr('disabled', 'disabled');
			view.$el.find(':input:not(:checkbox):not(:radio)').attr('readonly', true);



			if(!this.controller.editOperationAvailable){
				this.$el.find("#editModeDiv").hide();
			}
			if(!this.controller.deleteOperationAvailable){
				this.$el.find("#deleteModeDiv").hide();
			}
			if(this.controller.updateViewTypes != undefined){
				this.$el.find('#updateViewType').empty();
				for ( var i = 0; i < this.controller.updateViewTypes.length; i++) {
					var newOption = $('<option value="' + this.controller.updateViewTypes[i] + '">'+ this.controller.updateViewTypes[i] + '</option>');
					this.$el.find('#updateViewType').append(newOption);
				}
				if(this.controller.updateViewTypes.indexOf(this.requestContext.getViewType()) > -1){
					this.$el.find('#updateViewType').val(this.requestContext.getViewType());
				} else {
					this.$el.find('#updateViewType').val("FullDetails");
				}
				
			}
			
			if(this.hideDiv){
				this.$el.find("#deleteModeDiv").hide();
				this.$el.find("#editModeDiv").hide();
			}
			this.$el.find("button").hide();
			this.$el.find(".icon-trash").hide();
			this.displayModificationAfterRender();
		}
	});
});
