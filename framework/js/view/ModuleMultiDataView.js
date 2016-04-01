/*
 * ModuleMultiDataView: Base view for all application module views with multiple data. 
 * Each module view extending this view should define the following:
 * template: template to be rendered by the view
 * listTemplate: template for list display
 * listDiv: String value of the div where list should be displayed
 * dataDiv: String value of the div where the selected list data should be displayed
 * listItemId: model attribute name(unique identifier) corresponding to list values
 * 
 * Each module view extending this view should define all the events and can invoke addNewItem, removeItem, renderSelectedItem and saveItem
 * 		
 */
define(['ModuleView', 'ModuleModel'],function(ModuleView, ModuleModel){
	return ModuleView.extend({
		initialize: function() {
			this.model = new ModuleModel();
			this.collection.bind("add remove", this.renderListView, this);
			this.isEdit = true;
			this.postInitialize();
		},
		// To be implemented by child views for any post-initializing
		postInitialize: function() {
			
		},
		render: function() {
			ModuleView.prototype.render.call(this);
			this.delegateEvents();
			this.renderListView();
			this.renderDefaultDataView();

			this.registerSubViews([this.dataView]);
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
		renderDefaultDataView: function() {
			var dataModel = (this.collection && this.collection.length > 0) ? this.collection.at(0) : this.getNewModel();
			this.renderDataView(dataModel);
		},
		renderDataView: function(dataModel) {
			this.closeExistingDataView();
			this.dataView = this.getDataView(dataModel);
			this.dataView.$el = this.$el.find(this.dataDiv);
			this.dataViewPreRender();
			this.dataView.render();
		},
		// To be implemented by all child views
		getDataView: function() {

		},
		// To be implemented by child views for any pre-rendering logic
		dataViewPreRender: function() {

		},
		closeExistingDataView: function() {
			if(this.dataView) {
				this.dataView.close();
			}
		},
		addNewItem: function() {
			this.isEdit = false;
			this.preAdd();
			this.renderDataView(this.getNewModel());
		},
		getNewModel: function() {
			return new ModuleModel();
		},
		//T o be implemented by child views for any pre-adding logic.
		preAdd: function() {

		},
		removeItem: function() {
			if(!this.collection.contains(this.dataView.model)) {
				alert('Please select an item from the list to delete');
			} else {
				this.preRemove();
				this.collection.remove(this.dataView.model);
				//TODO: Remove once collection.remove event triggering issue is fixed
				this.renderListView();
				this.renderDefaultDataView();
				this.postRemove();
			}
		},
		// To be implemented by child views for any pre-removing logic. 
		// Eg: Removal of any associated data
		preRemove: function() {

		},
		// To be implemented by child views for any post-removing logic. 
		// Eg: Re-rendering of any dependent view
		postRemove: function() {

		},
		saveItem: function() {
			// Default preSave() returns true, If the function has no return statement "undefined" will be returned. 
			// Hence check only for not false condition
			if(this.preSave() !== false) {
				if(!this.isDuplicate(this.dataView.model.get(this.listItemId))) {
					this.collection.add(this.dataView.model);
					this.postSave();
					// Re-rendering of list is required only if any of the existing data's key is changed
					// as the data is already in the Collection, collection.add() does not trigger any event
					this.renderListView();
					this.isEdit = true;
				}
			}
		},
		isDuplicate: function(listData) {
			if(this.collection && !this.isEdit) {
				for(var i = 0; i < this.collection.length; i++) {
					if(this.collection.at(i).get(this.listItemId) == listData) {
						alert('The value "' + listData + '" already exists in the list!');
						return true;
					}
				}
			}
			return false;
		},
		// To be implemented by child views for any pre-saving logic
		preSave: function() {
			return true;
		},
		// To be implemented by child views for any post-saving logic
		// Eg: Re-rendering of any dependent view
		postSave: function() {

		},
		renderSelectedItem: function(ev) {
			this.preRenderSelectedItem(ev);
			//collection.findWhere(attributes) - supported in backbone 1.1.0
			var that = this;
			if(this.collection) {
				this.collection.each(function(model){
					if(model.get(that.listItemId) === ev.currentTarget.firstChild.data) {
						that.renderDataView(model);
						this.isEdit = true;
					}
				});
			}
		},
		// To be implemented by child views for any logic to be handle prior rendering of selected item
		preRenderSelectedItem: function(ev) {

		}
	});
});


