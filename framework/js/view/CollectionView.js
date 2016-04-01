/*
 * CollectionView: base view for all application/module views with collection data.
 * 		
 */
define(['BaseView', 'ModuleCollectionView', 'BaseCollection'],function(BaseView, ModuleCollectionView, BaseCollection){
	return BaseView.extend({
		collection : undefined,
		mainCollectionView : undefined,
		initialize: function() {
			this.subCollectionViews = new Array();
			this.i = 0;
		},
		close: function() {
			this.mainCollectionView.close();
			if (this.model != undefined) {
				this.model.unbind();
			}
			this.$el.html("");
			this.$el.off();
		},
		initializeCollViews: function(viewCreator, childDiv) {
			this.mainCollectionView = new ModuleCollectionView({ itemViewCreator : viewCreator,
				childItemDiv : childDiv, collection : this.collection});
		},
		preSubmitCollection: function() {
			for(var j = 0 ; j < this.subCollectionViews.length; j++) {
				this.subCollectionViews[j].preSubmit();
			}
		},
		preSubmit: function() {
			this.preSubmitCollection();
		}
	});
});


