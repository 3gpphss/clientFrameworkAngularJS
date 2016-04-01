/*
 *  This is a [wire.js] wiring spec for One-NDS Provisioning
 */
define({// FrontController is the controller for all browser requests
	frontController : {
		create : {
			module : 'framework/js/controller/FrontController',
			args : {
				div : ".navigationDiv"
			}
		},
		properties : {
			errorDiv : "#errorDiv",
			searchNavigationDiv : "#searchNavigation",
			fcoType : "#fcoType",
			viewType : "#viewType",
			uniqueId : "#uniqueId",
			model : {$ref : 'provisioningModel'},
			LayoutFactory : {$ref : 'LayoutFactory'},
			ConfigurationManager : {$ref: 'ConfigurationManager'},
			requestContext : {$ref: 'requestContext'}
		},
		ready : {
			getConfigData : {}
		}
	},
	// ProvisioningModel is the input model for frontController which contains navigation data model.
	provisioningModel : {
		create : {
			module : 'framework/js/model/ProvisioningModel'
		}
	},
	requestContext : {
		create : {
			module : 'framework/js/model/RequestContext'
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
			configurationMerger : {$ref : 'configurationMerger'},
			//extendedUpdate: true,
			//requestTimeout: 1920000, // 32mins
			// 3 mins request timeout
			//requestTimeout: 180000,
			// nsrDeleteRequestTimeout: 10800000 // 3hrs
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

	// Factory which will create Operation controllers
	ControllerFactory : {
		create : {
			module: 'framework/js/controller/ControllerFactory'
		},
		properties : {
			wire : { $ref: 'wire!' }
		}
	},
	// controller for Search operation
	SearchController : {
		module : 'framework/js/controller/SearchController'
	},
	// RequestFactory is a factory which will create a requestTypeModel based on requestType through wire
	RequestFactory : {
		create : {
			module : 'framework/js/controller/RequestFactory'
		},
		properties : {
			wire : { $ref: 'wire!' }
		}
	},
	RequestTypes : {
		create : {
			module : 'framework/js/controller/RequestTypes'
		}
	},	
	SearchRequestModel: {
		module : 'framework/js/model/SearchRequestModel'
	},
	ModuleController : {
		create : {
			module : 'framework/js/controller/ModuleController'
		},
		properties : {
			ModuleManager : { $ref: 'ModuleManager' } 
		}
	},
	ModuleManager : {
		create : {
			module : 'framework/js/util/ModuleManager'
		},
		properties : {
			ConfigurationManager : { $ref: 'ConfigurationManager' },
			ModuleModelController : { $ref: 'ModuleModelController'},
			ModuleViewController : { $ref: 'ModuleViewController'},
			DAO :{ $ref: 'DAO'},
			RequestFactory :{ $ref: 'RequestFactory'},
			RequestTypes :{ $ref: 'RequestTypes'}
		},
		ready : {
			registerConfigHandler : {}
		}
	},
	DAO : {
		create : {
			module : 'framework/js/util/DAO'
		},
		properties : {
			ConfigurationManager : { $ref: 'ConfigurationManager' }
		},
		ready : {
			getRequestTimeOut : {}
		}
	},
	fcoView : {
		module: 'framework/js/view/FCOView',
	},
	fcoModel : {
		module : 'framework/js/model/FCOModel'
	},
	ModuleModelController : {
		create : {
			module : 'framework/js/controller/ModuleModelController'
		}
	},
	ModuleViewController : {
		create : {
			module : 'framework/js/controller/ModuleViewController'
		}
	},
	// controller for Delete operation
	DeleteController : {
		module : 'framework/js/controller/DeleteController'
	},
	DeleteRequestModel: {
		module : 'framework/js/model/DeleteRequestModel'
	},
	// controller for Create operation
	CreateController : {
		module : 'framework/js/controller/CreateController'
	},
	AddRequestModel: {
		module : 'framework/js/model/AddRequestModel'
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
	UpdateController : {
		module : 'framework/js/controller/UpdateController'
	},
	ModifyRequestModel: {
		module : 'framework/js/model/ModifyRequestModel'
	},
	NotificationManager : {
		create : {
			module : 'framework/js/util/NotificationManager'
		}
	},
	LayoutFactory :{
		create :{
			module: 'framework/js/controller/LayoutFactory'
		},
		properties : {
			wire : { $ref: 'wire!' }
		}
	},
	SearchLayoutManager : {
		module : 'framework/js/layouts/SearchLayoutManager'
	},
	DeleteLayoutManager : {
		module : 'framework/js/layouts/DeleteLayoutManager'
	},
	CreateLayoutManager : {
		module : 'framework/js/layouts/CreateLayoutManager'
	},
	UpdateLayoutManager : {
		module : 'framework/js/layouts/UpdateLayoutManager'
	},
	SearchAllLayoutManager : {
		module : 'framework/js/layouts/SearchAllLayoutManager'
	},
	SearchAllController : {
		module : 'framework/js/controller/SearchAllController'
	},
	ChangeIdLayoutManager : {
		module : 'framework/js/layouts/ChangeIdLayoutManager'
	},
	ChangeIdController : {
		module : 'framework/js/controller/ChangeIdController'
	},
	ChangeIdRequestModel: {
		module : 'framework/js/model/ChangeIdRequestModel'
	},
	ExtendedOperationLayoutManager : {
		module : 'framework/js/layouts/ExtendedOperationLayoutManager'
	},
	ExtendedOperationController : {
		module : 'framework/js/controller/ExtendedOperationController'
	},
	ExtendedOperationModel: {
		module : 'framework/js/model/ExtendedOperationModel'
	},
	ExtendedResponseOperationController : {
		module : 'framework/js/controller/ExtendedResponseOperationController'
	},
	ExtendedUpdateController : {
		module : 'framework/js/controller/ExtendedUpdateController'
	},
	ExtendedModifyRequestModel: {
		module : 'framework/js/model/ExtendedModifyRequestModel'
	},
	// Bulk related Beans
	bulkController : {
		create : {
			module : 'framework/js/controller/BulkController'
		},
		properties : {
			bulkSuccessDiv: "#bulkSuccessDiv",
			bulkWarningDiv: "#bulkWarningDiv",
			bulkErrorDiv : "#bulkErrorDiv",
			bulkNavigationDiv : "#bulkNavigationDiv",
			bulkFcoType: "#bulkFcoType",
			bulkResultFileName: "#resultFileName",
			bulkIdentifierListName: "#identifierListName",
			bulkFilterType: "#filterType",
			bulkAlias: "#alias",
			bulkSchedulable: "#bulkSchedulable",
			responseFileSize: "#responseFileSize",
			ConfigurationManager : {$ref: 'ConfigurationManager'},
			LayoutFactory : {$ref : 'LayoutFactory'},
			requestContext : {$ref: 'bulkRequestContext'},
			DAO : {$ref : 'DAO' }
		},
		ready : {
			getFCOData : {}
		}
	},
	BulkSearchLayoutManager : {
		module : 'framework/js/layouts/BulkSearchLayoutManager'
	},
	BulkSearchController : {
		module : 'framework/js/controller/BulkSearchController'
	},
	BulkDeleteLayoutManager : {
		module : 'framework/js/layouts/BulkDeleteLayoutManager'
	},
	BulkDeleteController : {
		module : 'framework/js/controller/BulkDeleteController'
	},
	BulkRequestModel: {
		module : 'framework/js/model/BulkRequestModel'
	},
	BulkFilterLayoutManager : {
		module : 'framework/js/layouts/BulkFilterLayoutManager'
	},
	BulkFilterController : {
		module : 'framework/js/controller/BulkFilterController'
	},
	BulkModifyLayoutManager : {
		module : 'framework/js/layouts/BulkModifyLayoutManager'
	},
	BulkModifyController : {
		module : 'framework/js/controller/BulkModifyController'
	},
	bulkRequestContext : {
		create : {
			module : 'framework/js/model/BulkRequestContext'
		}	
	},
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
