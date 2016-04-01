/*
 * GuiError: Abstract Base Exception class for all client side errors
 */
define(['frameworkPath/util/FrameworkHelper'], function(FrameworkHelper){
	var GuiError = function(errorCode, params) {
		this.setDefaults("GuiError", undefined, undefined);
		this.setErrorCode(errorCode, params);
	}
	GuiError.prototype = new Error();
	GuiError.prototype.constructor = GuiError;
	GuiError.prototype.defaultLocale = "en_us";

	GuiError.prototype.setDefaults = function(name, errorCodeMap, unknownErrorKey) {
		this.name = name;
		this.unknownErrorKey = unknownErrorKey;
		this.errorCodeMap = errorCodeMap;
		this.errorId = this.getErrorId(this.unknownErrorKey);
		this.errorMessage = this.getErrorMessage(this.unknownErrorKey);
	}
	GuiError.prototype.setErrorCode = function(errorCode, params) {
		if(errorCode) {
			this.errorId = this.getErrorId(errorCode);
			if(params) {
				this.errorMessage = FrameworkHelper.replaceErrorParams(this.getErrorMessage(errorCode), params) || this.errorMessage;
			} else {
				this.errorMessage = this.getErrorMessage(errorCode) || this.errorMessage;
			}
		}
	}
	GuiError.prototype.setErrorHint = function(errorHint) {
		this.errorHint = JSON.stringify(errorHint);
	}
	GuiError.prototype.setErrorRecomendation = function(errorRecomendation) {
		this.errorRecomendation = JSON.stringify(errorRecomendation);
	}
	GuiError.prototype.getErrorCode = function(errorCodeKey) {
		if(this.errorCodeMap) {
			return this.errorCodeMap[errorCodeKey];
		}
	}
	GuiError.prototype.getErrorId = function(errorCodeKey) {
		if(this.errorCodeMap) {
			return this.errorCodeMap[errorCodeKey] ? this.errorCodeMap[errorCodeKey].errorId :  this.errorCodeMap[this.unknownErrorKey].errorId ;
		}
	}
	GuiError.prototype.getErrorMessageKey = function(errorCodeKey) {
		if(this.errorCodeMap) {
			return this.errorCodeMap[errorCodeKey] ? this.errorCodeMap[errorCodeKey].errorMessageKey : this.errorCodeMap[this.unknownErrorKey].errorMessageKey;
		}
	}
	GuiError.prototype.getErrorMessage = function(errorCodeKey) {
		this.errorCodeProperties = this.getErrorCodeProperties();
		if(this.errorCodeProperties) {
			return this.errorCodeProperties.getMessage(this.getErrorMessageKey(errorCodeKey)) || this.errorCodeProperties.getMessage(this.getErrorMessageKey(this.unknownErrorKey));
		}
	}
	GuiError.prototype.getErrorCodeProperties = function() {
		var errorCodeProperties = undefined;
		var localePath = this.getLocalePath(this.locale || this.defaultLocale);
		if(localePath) {
			require([localePath], function(ErrorCodeProperties) {
				errorCodeProperties = ErrorCodeProperties;
			});
		}
		return errorCodeProperties;
	}
	// To be implemented by all child classes
	GuiError.prototype.getLocalePath = function(locale) {
	}
	return GuiError;
});