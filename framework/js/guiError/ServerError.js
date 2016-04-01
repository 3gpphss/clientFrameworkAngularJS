/*
 * ServerError: Handles all server errors
 */
define(['frameworkErrors/FrameworkError'], function(FrameworkError){
	var ServerError = function(errorId, errorMessage) {
		this.setDefaults("ServerError", this.getErrorCodeMap(), 'UNKNOWN_SERVER_ERROR');
		this.setErrorCode(errorId, errorMessage);
	}
	ServerError.prototype = new FrameworkError();
	ServerError.prototype.constructor = ServerError;

	ServerError.prototype.setErrorCode = function(errorId, errorMessage) {
		this.errorId = errorId ? errorId : this.errorId;
		this.errorMessage = errorMessage ? errorMessage : this.errorMessage;
	}
	return ServerError;
});