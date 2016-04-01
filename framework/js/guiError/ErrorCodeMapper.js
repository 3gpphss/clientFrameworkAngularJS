/*
 * ErrorCodeMapper: Maps server error codes to client error code
 */
define(['frameworkErrors/ErrorCode'], function(ErrorCode){
	return {
		ErrorCodeMapper : {
			//'3503': ErrorCode.get('SERVER_OBJECT_NOT_FOUND'),
			//'3504': ErrorCode.get('SERVER_OBJECT_ALREADY_EXISTS')
		},
		get: function(code){
			return (this.ErrorCodeMapper[code] || ErrorCode.get('UNKNOWN_SERVER_ERROR'));
		}	
	};
});




