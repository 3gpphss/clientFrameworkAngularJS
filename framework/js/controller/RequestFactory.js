/*
 * RequestFactory : is the Factory to produce RequestModel based on the passed requestType. 
 */
define(['frameworkErrors/FrameworkError'], function(FrameworkError){
	return {
		getRequestModel : function(requestType){
			var requestModel = undefined;
			var spec={
					cloneRequestModel : {
						create: { $ref: requestType },
					}	
			};
			this.wire(spec).then(function(childContext){
				requestModel = childContext.cloneRequestModel;
			});
			if(requestModel == undefined){
				throw new FrameworkError('REQUEST_MODEL_UNAVAILABLE_ERROR');
			}
			return requestModel;
		}
	};
});