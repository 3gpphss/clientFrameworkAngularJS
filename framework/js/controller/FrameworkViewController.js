/*
 * Framework view Controller : Abstract Base Controller class for all Module view Controller class
 * 
 * Every Module has to extend and override required function based on their business requirement and Must override getView() function.
 */
define(['FrameworkExtendUtility'],function(FrameworkExtendUtility){
	
	var FrameworkViewController = function(options){
		 this._configure(options || {});
		 this.initialize.apply(this, arguments);
	}
	
	 var viewControllerOptions = ['DAO', 'RequestFactory', 'RequestTypes'];
	 
	 _.extend(FrameworkViewController.prototype,{
		 
	 	// Initialize is an empty function by default. Override it with your own
        // initialization logic.
        initialize: function(){},
	 
	 
		 // Performs the initial configuration of a ViewController with a set of options.
	     // Keys with special meaning *(DAO, RequestFactory, RequestTypes)*, are
	     // attached directly to the viewController.
		 _configure: function(options) {
	         if (this.options) options = _.extend({}, this.options, options);
	         for (var i = 0, l = viewControllerOptions.length; i < l; i++) {
	             var attr = viewControllerOptions[i];
	             if (options[attr]) this[attr] = options[attr];
	         }
	         this.options = options;
	     }
	 });
	 
	 
	 FrameworkViewController.extend = FrameworkExtendUtility.extend;
	 
	 return FrameworkViewController;
});