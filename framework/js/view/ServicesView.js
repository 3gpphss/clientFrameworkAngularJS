/*
 * ServiesView: is responsible to handle the drop-down for services to be added to a particular FCO.
 * 		
 */
define(['frameworkViews/FrameworkView', 'text!framework/templates/servicesTemplate.html', 'frameworkModels/ServicesModel'],
		function(FrameworkView, servicesTemplate, ServicesModel){
	return FrameworkView.extend({
		template: _.template(servicesTemplate),
		initialize : function() {
			this.model = new ServicesModel();
		},
		events : {
			"change #serviceDropDown": "addServiceToView"
		},
		render : function(){
			FrameworkView.prototype.render.call(this);
			this.delegateEvents();
			this.renderDropdown();
			this.model.bind('change', this.renderDropdown, this);
		},
		renderDropdown : function(){
			var that = this;
			this.$el.find("#serviceDropDown").empty();
			this.$el.find("#serviceDropDown").append("<option value=''>Select</option>");
			_.each(this.model.get("services"), function (item) {
	            var option = $("<option/>", {
	                value: item,
	                text: item.toUpperCase()
	            }).appendTo(that.$el.find("#serviceDropDown"));
	        });
			return this;
		},
		addServiceToView : function() {
			var moduleName = $("#serviceDropDown").val();
			this.fcoView.addServiceToView(moduleName);
			this.model.deleteFromServices(moduleName);
		}
	});
});


