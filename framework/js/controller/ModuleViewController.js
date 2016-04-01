/*
 * ModuleViewController: Interface to be implemented by each application module view controllers.
 */
define(['frameworkPath/util/Interface'], function(Interface){
	return 	new Interface('ModuleViewController', ['getView']);
});