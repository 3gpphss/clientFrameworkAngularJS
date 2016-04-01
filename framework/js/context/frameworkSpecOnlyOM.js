/*
 *  This is a [wire.js] wiring spec for One-NDS Provisioning
 */
define({
// Ordermanagement related Beans
	OrderMgmtDAO : {
		create : {
			module : 'framework/js/util/OrderMgmtDAO'
		}
	},
	OrderMgmtController : {
		create : {
			module : 'framework/js/controller/OrderMgmtController'
		},
		properties : {
			orderMgmtFilterDiv : "#orderMgmtFilterDiv",
			reloadBulkOrders: "#reloadBulkOrders",
			orderMgmtLayout  : {
				$ref : 'OrderMgmtLayoutManager'
			},
		ConfigurationManager : {$ref: 'ConfigurationManager'},
		},
		ready :  {
			getBulkHistory : {},
			getConfigData : {}
		}
	},
// ConfigurationManager is used to get configuration data
	ConfigurationManager : {
		create : {
			module : 'framework/js/util/ConfigurationManager'
		},
		properties : {
			model : {$ref: 'configModel'},
			DAO : {$ref: 'configDAO'},
			configurationMerger : {$ref : 'configurationMerger'}
		},
		ready : {
			loadConfigData : {}
		}
	},
	//ConfigurationModel is the model for configuration data
	configModel : {
		create : {
			module : 'framework/js/model/ConfigurationModel'
		}
	},
	configDAO : {
		module : 'framework/js/util/ConfigDAO'
	},
	OrderMgmtLayoutManager : {
		create : {
			module : 'framework/js/layouts/OrderMgmtLayoutManager'
		},
		properties: {
			orderMgmtSuccessDiv : "#orderMgmtSuccessDiv",
			orderMgmtWarningDiv : "#orderMgmtWarningDiv",
			orderMgmtErrorDiv : "#orderMgmtErrorDiv",
			orderMgmtWarningMessageDiv: "#orderMgmtWarningMessageDiv",
			orderMgmtOperationController  : {
				$ref : 'OrderMgmtOperationController'
			}
		},
		ready :  {
			initializeRequiredFields : {}
		}
	},
	OrderMgmtOperationController : {
		create : {
			module : 'framework/js/controller/OrderMgmtOperationController'
		},
		properties : {
			OrderMgmtDAO : {
				$ref : 'OrderMgmtDAO'
			}
			
		}
	},
	// ConfigurationMerger which will be merging the data of each module
	configurationMerger : {
		create : {
			module: 'framework/js/util/ConfigurationMerger'
		},
		properties : {
			wire : { $ref: 'wire!' }
		}
	},
	plugins : [
	           /*
	            * The debug plugin outputs wiring progress and diagnostic info to the
	            * console. Turning on trace will trace method calls on components in this
	            * spec.
	            */
	           {
	        	   module : 'wire/debug',
	        	   trace : false
	           }]
});
