/*
 * BaseCollectionView: A view that iterates over a Backbone.Collection and renders an individual ItemView for each model.
 * 		
 */
define(['collectionBinder'],function(CollectionBinder){
	return Backbone.View.extend({
		initialize : function(args){
			this.itemViewCreator = args.itemViewCreator;
			this.childItemDiv =  args.childItemDiv;
			this.collection = args.collection;
			this.createCollectionBinder();
		},
		createCollectionBinder: function() {
			var that = this;
			// The managerFactory helps to generate element managers - an el manager creates/removes elements when models are added to a collection
			var elManagerFactory = new Backbone.CollectionBinder.ViewManagerFactory(this.itemViewCreator);
			this.collectionBinder = new Backbone.CollectionBinder(elManagerFactory);
			// This is very similar to the ModelBinder.bind() function but the collectionBinder will also create nested element views
			this.collectionBinder.bind(this.collection, this.childItemDiv);
			//CollectionBinder events
			this.collectionBinder.on('elCreated', function(model, view){
			});
		},
		close: function() {
			this.deleteAllViews();
			if (this.model != undefined) {
				this.model.unbind();
			}
			if(this.collectionBinder != undefined){
				this.collectionBinder.unbind();
			}
		},
		addChildItemView: function(childItemModel) {
			this.collection.add(childItemModel);
		},
		deleteChildItemView: function(childItemModel) {
			if(this.collection.length > 0){
				this.collection.remove(childItemModel);
			}		
		},
		deleteAll: function() {
			this.collection.reset();
		},
		deleteAllViews: function() {
			this.collectionBinder._removeAllElManagers();
		}/*,
		getViews: function() {
			var views = new Array();
			for(var i = 0; i < this.collectionBinder._elManagers.length ; i++) {
				views.push(this.collectionBinder._elManagers[i].getView());
			}
			return views;
		}*/
	});
});
