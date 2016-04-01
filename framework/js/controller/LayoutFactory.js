/*
 * LayoutFactory : is responsible to return OperationLayoutManager 
 * Defines required objects for returning OperationLayoutManager using depenedency injection
 */
define([ 'frameworkErrors/FrameworkError' ], function(FrameworkError) {
	return {
		getLayout : function(operation, provisioningType) {
			var layoutName = operation + "LayoutManager";
			var layout = undefined;
			var spec = undefined;
			if (provisioningType === "singleProvisioning") {
				spec = {
					cloneLayout : {
						create : {
							$ref : layoutName
						},
						properties : {
							ControllerFactory : {
								$ref : 'ControllerFactory'
							},
							frontController : {
								$ref : 'frontController'
							},
							ConfigurationManager : {
								$ref : 'ConfigurationManager'
							}
						}
					}
				};
			} else if (provisioningType === "bulkProvisioning") {
				spec = {
					cloneLayout : {
						create : {
							$ref : layoutName
						},
						properties : {
							ControllerFactory : {
								$ref : 'ControllerFactory'
							},
							bulkController : {
								$ref : 'bulkController'
							}
						}
					}
				};
			}

			this.wire(spec).then(function(childContext) {
				layout = childContext.cloneLayout;
			});
			if (layout == undefined) {
				throw new FrameworkError('OPERATION_LAYOUT_UNAVAILABLE_ERROR');
			}
			return layout;
		}
	};
});