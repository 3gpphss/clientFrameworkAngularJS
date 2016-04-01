/*
 * ConfigurationDataError: Configuration Data Exception class
 */
define(['frameworkPath/util/FrameworkHelper', 'frameworkErrors/FrameworkError'], function(FrameworkHelper, FrameworkError){
	var ConfigurationDataError = function(errorCode, params) {
		if(options) {
			this.name = "ConfigurationDataError";
			this.errorCode = ErrorCode.get('UNKNOWN_ERROR').errorId;
			this.message = "Configuration Data error";
			if(options.message) {
				this.message = options.message;
			} else if(options.errorCode){
				this.errorCode = options.errorCode.errorId || this.errorCode;
				if(options.errorCode.errorMessage) {
					if(options.params) {
						this.message = FrameworkHelper.replaceErrorParams(options.errorCode.errorMessage, options.params) || this.message;
					} else {
						this.message = options.errorCode.errorMessage || this.message;
					}
				} 
			}
		}
	}
	ConfigurationDataError.prototype = new FrameworkError();
	ConfigurationDataError.prototype.constructor = ConfigurationDataError;
	
	return ConfigurationDataError;
});