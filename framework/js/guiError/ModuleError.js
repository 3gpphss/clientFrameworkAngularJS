/*
 * ModuleError: Abstract class for all Module Exceptions
 */
define(['frameworkErrors/GuiError'], function(GuiError){
	var ModuleError = function(errorCode, params) {
		this.setDefaults("ModuleError", undefined, undefined);
		this.setErrorCode(errorCode, params);
	}
	ModuleError.prototype = new GuiError();
	ModuleError.prototype.constructor = ModuleError;

	return ModuleError;
});