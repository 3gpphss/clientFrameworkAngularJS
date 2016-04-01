/*
 * DOMError: DOM Exception class
 */
define(['frameworkPath/util/FrameworkHelper', 'frameworkErrors/FrameworkError'], function(FrameworkHelper, FrameworkError){
	var DOMError = function(errorCode, params) {
		if(options) {
			this.name = "DOMError";
			this.errorCode = ErrorCode.get('UNKNOWN_ERROR').errorId;
			this.message = "DOM error";
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
	DOMError.prototype = new FrameworkError();
	DOMError.prototype.constructor = DOMError;
	
	return DOMError;
});