/*
 * ModuleView: Base view for all application module views. 
 * 			   Provides deleteService() method which deletes the view and intimates the parent view of its removal.
 * 		
 */
define(['BaseView'],function(BaseView){
	return BaseView.extend({
		initialize : function() {
			this._modelBinder = new Backbone.ModelBinder();
			this.postInitialize();
		},
		//To be implemented by child views for any extra initializations
		postInitialize: function() {
			
		},
		registerSubViews: function(views) {
			var that = this;
			if(views) {
				if(!this.subViews) {
					this.subViews = new Array();
				}
				views.forEach(function(view) {
					that.subViews.push(view);
				});
			}
		},
		//To be implemented by child views for any pre-rendering
		preRender: function() {
			
		},
		render: function() {
			this.preRender();
			BaseView.prototype.render.call(this);
			this.delegateEvents();
			this.renderSubViews();
			this.postRender();
			return this;
		},
		renderSubViews: function() {
			this.setSubViewsEls();
			if(this.subViews) {
				for(var j = 0 ; j < this.subViews.length; j++) {
					if(this.subViews[j]) {
						this.subViews[j].render();
					}
				}
			}
		},
		// To be implemented by each child view to set sub views el
		setSubViewsEls: function() {
			
		},
		//To be implemented by child views for any post-rendering
		postRender: function() {
			
		},
		deleteService: function() {
			this.close();
			this.parentView.removeChildView(this.viewCount);
			this.parentView.resetchildViews();
		},
		preSubmitSubViews: function() {
			if(this.subViews) {
				for(var j = 0 ; j < this.subViews.length; j++) {
					if(this.subViews[j]) {
						this.subViews[j].preSubmit();
					}
				}
			}
		},
		preSubmit: function() {
			this.preSubmitSubViews();
		},
		removeAttrsFromModel: function(attrs) {
			for(var i = 0; i < attrs.length; i++) {
				this.model.unset(attrs[i], {silent: true});
			}
		},
		closeSubViews: function() {
			if(this.subViews) {
				for(var j = 0 ; j < this.subViews.length; j++) {
					if(this.subViews[j]) {
						this.subViews[j].close();
					}
				}
			}
		},
		close: function() {
			this.closeSubViews();
			BaseView.prototype.close.call(this);
		}
	});
});


