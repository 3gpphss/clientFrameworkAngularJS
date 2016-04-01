/*
 * Framework Model Controller : Abstract Base Controller class for all Module Model Controller class
 * 
 * Every Module has to extend and override required function based on their business requirement and Must override getModel() function.
 */
define(['FrameworkExtendUtility'],function(FrameworkExtendUtility){
	
	var FrameworkModelController = function(options){
		 this.initialize.apply(this, arguments);
	}
	
	 
	 _.extend(FrameworkModelController.prototype,{
		 
	 	// Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function(){}
	 
	 });
	 
	 
	 FrameworkModelController.extend = FrameworkExtendUtility.extend;
	 
	 return FrameworkModelController;
});