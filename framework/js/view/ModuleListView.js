/*
 * ModuleListView: Base view for all application module views with list/collection data.  
 * Each module view extending this view should define the following:
 * template: template to be rendered by the view
 * listTemplate: template for list display
 * listDiv: String value of the div where list should be displayed
 * dataId: id of the html input text element where the new list item will be added
 * listItemId: model attribute name(unique identifier) corresponding to list values
 * 
 * Each module view extending this view should define all the events and can invoke addNewItem, removeItem and setRemoveModel
 * 
 */
define(['ModuleView',  'ModuleModel'],
		function(ModuleView, ModuleModel){ 
	return ModuleView.extend({
		initialize : function(){
			this.model = new ModuleModel();
			if(this.collection) {
				this.removeModel = this.collection.at(0);
				this.collection.bind("add remove", this.renderListView, this);
			}
		},
		render: function() {
			ModuleView.prototype.render.call(this);
			this.delegateEvents();
			this.renderListView();
		},
		renderListView: function() {
			this.$el.find(this.listDiv).html("");
			var that = this;
			if(this.collection){
				this.collection.each(function(model){
					that.$el.find(that.listDiv).append(that.listTemplate(model.toJSON()));
				});
			}
		},
		addNewItem: function() {
			var listData = $(this.dataId).val();
			if(listData && listData != "") {
				if(!this.isDuplicate(listData)) {
					if(this.preAdd() != false) {
						this.collection.add(this.getModel(listData));
						$(this.dataId).val("");
					}
				}
			}
		},
		isDuplicate: function(listData) {
			if(this.collection) {
				for(var i = 0; i < this.collection.length; i++) {
					if(this.collection.at(i).get(this.listItemId) == listData) {
						alert('The value "' + listData + '" already exists in the list!');
						return true;
					}
				}
			}
			return false;
		},
		// To be implemented by child views for any pre-saving handling
		preAdd: function() {

		},
		// To be implemented by all child views to get proper list data model
		getModel: function(model) {

		},
		setRemoveModel: function(ev) {
			var that = this;
			//collection.findWhere(attributes) - supported in backbone 1.1.0
			if(this.collection) {
				this.collection.each(function(model){
					if(model.get(that.listItemId) == ev.currentTarget.firstChild.data) {
						that.removeModel = model;
					}
				});
			}
		},
		removeItem: function() {
			this.preRemove()
			this.collection.remove(this.removeModel);
			this.renderListView();
		},
		// To be implemented by child views for any pre-removing handling
		preRemove: function() {

		}
	});
});