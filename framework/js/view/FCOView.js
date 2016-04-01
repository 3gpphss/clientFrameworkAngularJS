/*
 * FCOView: is the view which combines the views from all application modules
 *     		Passes the views to the operation controller to render it.
 * 
 */
define(['frameworkViews/FrameworkView'],function(FrameworkView){
	return FrameworkView.extend({
		// template compilation
//		template: _.template(fcoTemplate),
		
		initialize : function(attrs) {
			this.childViews = [];
			//this._modelBinder = new Backbone.ModelBinder();
		},
		addChildView: function(childView) {
			childView.parentView = this;
			var index = this.childViews.length;
			this.childViews[index]= childView;
			// Each child view of FCOView will have its index in FCOView set in viewCount attribute.
			childView.viewCount = index;
		},
		getChildViews: function() {
			return this.childViews;
		},
		getChildView: function(moduleName) {
			var childView = undefined;
			for ( var i = 0; i < this.childViews.length; i++) {
				if(this.childViews[i].moduleName == moduleName) {
					childView = this.childViews[i];
				}
			}
			return childView;
		},
		appendEl : function(){
//			this.$el.html(this.template(this.model.toJSON()));
			this.appendChildEls();
		},
		appendChildEls: function() {
			for ( var i = 0; i < this.childViews.length; i++) {
				this.$el.append(this.childViews[i].render().$el);
			}
		},
		close: function() {
			this.closechildViews();
			FrameworkView.prototype.close.call(this);
		},
		closechildViews : function(){
			for (var i = 0; i < this.childViews.length; i++) {
				this.childViews[i].close();
			}
			this.childViews = new Array();
		}, 
		removeChildView: function(index) {
			this.childViews.remove(index);
			this.resetchildViews();
		},
		resetchildViews : function(){
			for (var index = 0; index < this.childViews.length; index++) {
				this.childViews[index].viewCount = index;
			}
		},
		preSubmit: function() {
			for (var i = 0; i < this.childViews.length; i++) {
				this.childViews[i].preSubmit();
			}
		},
		addServiceToView: function(moduleName) {
			for (var i = 0; i < this.childViews.length; i++) {
				if(this.childViews[i].moduleName === moduleName) {
					//ModuleModelController.get model();
					this.$el.find(this.childDiv).append(this.childViews[i].addServiceToView());
					break;
				}
			}
		}
	}); 	
}); 