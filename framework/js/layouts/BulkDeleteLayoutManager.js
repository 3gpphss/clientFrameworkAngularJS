/*
 * BulkDeleteLayoutManager: Responsible for Bulk Delete layout design and delegate request to controller.
 * 
 */
define([ 'BulkOperationLayoutManager', 'text!framework/templates/bulkDeleteTemplate.html' ],
		function(BulkOperationLayoutManager, bulkDeleteTemplate) {
	return BulkOperationLayoutManager.extend({
		template : _.template(bulkDeleteTemplate),
		filterTextArea: "#bulkDeleteFilter",
		initialize : function() {
			this.$el = $("#bulkDeleteDiv");
		},
		events : {
			'click #submitBulkDelete' : 'onSubmitDelete'
		},
		postDisplayLayout : function(requestContext) {
			this.$el.find(this.filterTextArea).val(requestContext.getFilter());
		},
		onSubmitDelete : function() {
			this.clearBulkStatusDiv();
			this.controller.onSubmitDelete(this.getBulkNavigationData());
		},
		getLayoutData : function(){
			var data = {"filter" : undefined};
			if(this.$el.find(this.filterTextArea).val() != undefined) {
				data.filter= this.$el.find(this.filterTextArea).val().trim();
			}
			return data;
		}
	});
});
