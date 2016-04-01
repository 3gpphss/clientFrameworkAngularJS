/*
 * ServicesModel: Contains the services to be added to a particular FCO
 */
define(['frameworkModels/FrameworkModel'],function(FrameworkModel){
	return FrameworkModel.extend({
		initialize : function(){
			this.set("services", []);
		},
		addToServices : function(service) {
			if(this.get("services").indexOf(service) == -1){
				this.get("services").push(service);
			}
			// Manually trigger change event on model as it is triggered only when model.set() is invoked
			this.trigger('change');
		},
		//Added getServices() for Test case
		getServices: function(){
			return this.get("services");
		},
		deleteFromServices: function(service) {
			(this.get('services')).remove(service);
			// Manually trigger change event on model as it is triggered only when model.set() is invoked
			this.trigger('change');
		}
	});
});


