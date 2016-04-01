/*
 * ModuleModelController: Interface to be implemented by each application module model controllers.
 */
define(['frameworkPath/util/Interface'], function(Interface){
	return  new Interface('ModuleModelController', ['getModel']);
});