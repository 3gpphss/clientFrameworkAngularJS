/*
 * ControllerFactory : is responsible to return OperationController 
 * Defines required objects for returning operationController using depenedency injection
 */
define([ 'frameworkErrors/FrameworkError' ], function(FrameworkError) {
	return {
		getController : function(operation, provisioningType) {
			var controllerName = operation + "Controller";
			var controller = undefined;
			var spec = undefined;
			if (provisioningType === "singleProvisioning") {
				spec = {
					cloneController : {
						create : {
							$ref : controllerName
						},
						properties : {
							fcoView : {
								create : {
									$ref : 'fcoView'
								},
								properties : {
									childDiv : "#fcoDiv"
								}
							},
							fcoModel : {
								create : {
									$ref : 'fcoModel'
								}
							},
							DAO : {
								$ref : 'DAO'
							},
							RequestFactory : {
								$ref : 'RequestFactory'
							},
							RequestTypes : {
								$ref : 'RequestTypes'
							},
							ModuleController : {
								$ref : 'ModuleController'
							},
							NotificationManager : {
								$ref : 'NotificationManager'
							},
							ConfigurationManager : {
								$ref : 'ConfigurationManager'
							}
						}
					}
				};
			} else if (provisioningType === "bulkProvisioning") {
				spec = {
					cloneController : {
						create : {
							$ref : controllerName
						},
						properties : {
							DAO : {
								$ref : 'DAO'
							},
							RequestFactory : {
								$ref : 'RequestFactory'
							},
							RequestTypes : {
								$ref : 'RequestTypes'
							}
						}
					}
				};

			}
			this.wire(spec).then(function(childContext) {
				controller = childContext.cloneController;
			});
			if (controller == undefined) {
				throw new FrameworkError(
						'OPERATION_CONTROLLER_UNAVAILABLE_ERROR');
			}
			return controller;
		}
	};
});