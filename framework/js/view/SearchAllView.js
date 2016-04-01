/*
 * ServiesView: is responsible to handle the drop-down for services to be added to a particular FCO.
 * 		
 */
define(['frameworkViews/FrameworkView'],
		function(FrameworkView){
	return FrameworkView.extend({
		template : _.template("<tr><td><a href='#' class='fcoIdentifier'><%=identifier %></a></td></tr>"),
		render : function(){
			this.renderAll();
		},
		renderAll: function(){
			var that =this;
			if(this.collection){
				this.collection.each(function(model){
					that.$el.append(that.template(model.toJSON()));
				});
			}
		}
	});
});