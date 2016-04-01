/*
 * ConfigurationManager: is the responsible to manage configuration data.
 */
define(['frameworkErrors/FrameworkError', 'framework/js/util/ConfigurationProperties'],function(FrameworkError, ConfigurationProperties) {
	return {
		FCOs : [],
		PCs : [],
		isConfigDataAvailable : false,
		dataReadyListeners : [],
		extendedOperations : [],
		registerConfigHandler : function(callbackMethod, callbackObj) {
			if (!this.isConfigDataAvailable) {
				this.dataReadyListeners.push({
					method : callbackMethod,
					obj : callbackObj
				});
			} else {
				callbackObj[callbackMethod]();
			}
		},
		loadConfigData : function() {
			this.DAO.getAppConfigData(this.model, "afterFetchingConfig","onServerFailure",this);
		},
		onServerFailure: function(responseModel) {
			throw new FrameworkError(responseModel.status + ':' + responseModel.statusText);
		},
		afterFetchingConfig : function(configModel) {
			this.model = configModel;
			this.afterLoadingModuleContribution();
			/*// For Merging the data of each module
			this.configurationMerger.loadApplicationDataConfiguraion(this.model.get("pcs"));
			this.configurationMerger.registerConfigHandler("afterLoadingModuleContribution",this);*/
		},
		afterLoadingModuleContribution : function(){
			/*this.model.set("fcos", this.configurationMerger.getApplicationDataConfiguraion());
			this.model.set("pcs" , this.configurationMerger.removeInCorrectPCS(this.model.get("pcs")));*/

			this.PCs = this.model.get("pcData.pcs");
			this.FCOs = this.model.get("navigationData.fcos");
			this.requestTimeOut = this.model.get("clientRequestTimeOut");
			this.customViewsAvailable = this.model.get("customViewsAvailable");
			this.extendedOperations = this.model.get("navigationData.extendedOperations");
			this.uploadFileSize = this.model.get("uploadFileSize");
			this.isConfigDataAvailable = true;
			this.orderMgmtRefreshInterval = this.model.get("bulkRequestHistoryConfigData.refreshInterval");
			this.invokeConfigHandler();
		},
		invokeConfigHandler : function() {
			for ( var i = 0; i < this.dataReadyListeners.length; i++) {
				this.dataReadyListeners[i].obj[this.dataReadyListeners[i].method]();
			}
		},
		getFCOs : function(provisioning) {
			var fco = new Array();
			if(provisioning == "singleProvisioning"){
				for ( var int = 0; int < this.FCOs.length; int++) {
					if(this.FCOs[int]["supportsInGUI"]){
						fco[fco.length] = {"dropDownKey" : this.FCOs[int]["fcoDropDownKey"] , "dropDownValue" : this.FCOs[int]["fcoDropDown"]};
					}
				}
			}else if(provisioning == "bulkProvisioning"){
				for ( var int = 0; int < this.FCOs.length; int++) {
					fco[int] = {"dropDownKey" : this.FCOs[int]["fcoDropDownKeyForBulk"] , "dropDownValue" : this.FCOs[int]["fcoDropDown"]};
				}
			}
			return fco.sort(this.compareFco);
		},
		getModules : function(requestContext) {
			var requestVersion = requestContext.getRequestVersion();
			var modules = [];

			for ( var int = 0; int < this.PCs.length; int++) {
				if(requestVersion == this.PCs[int]['requestVersion']){
					modules = this.PCs[int]['modules'];
				}
			}
			return modules;
		},
		filterOperationForView : function(operationName,OperationList,key){
			for ( var j = 0; j < OperationList.length; j++) {
				// TODO : this line of code we have to cross check the proper implementation
				operationType = OperationList[j][key]; 
				if (operationType === operationName) {
					return OperationList[j]['views'];
				}
			}
		},
		filterViewsForModule :  function(viewName , viewList){
			var modules = [];
			for ( var k = 0; k < viewList.length; k++) {
				view = viewList[k]['type'];
				if (view === viewName) {
					moduleArray = viewList[k]['modules'];
					for ( var x = 0; x < moduleArray.length; x++) {
						modules[x] = moduleArray[x]['name'];
					}
				}
			}
			return 	modules;
		},
		getAllModules : function() {
			var allModules = new Array();
			var arrayindex = 0;

			var modules = '';
			for ( var int = 0; int < this.PCs.length; int++) {
				modules = this.PCs[int]['modules'];
				for ( var j = 0; j < modules.length; j++) {
					allModules[arrayindex] = modules[j];
					arrayindex++;
				}
			}
			return allModules;
		},
		getViewTypes : function(FCOName, Operation) {
			var viewsArray = new Array();
			var fcoType = '';
			var operations = '';
			var operationType = '';
			var views = '';

			for ( var int = 0; int < this.FCOs.length; int++) {
				fcoType = this.FCOs[int]["fcoDropDown"];
				if (fcoType === FCOName) {
					operations = this.FCOs[int]['operations'];
					for ( var j = 0; j < operations.length; j++) {
						operationType = operations[j]['name'];
						if (operationType === Operation) {
							views = operations[j]['views'];
							for ( var k = 0; k < views.length; k++) {
								viewsArray[k] = views[k]['type'];
							}
						}
					}
				}
			}
			return viewsArray;
		},
		getKeys : function(FCOName){
			var keys = new Array();
			for ( var int = 0; int < this.FCOs.length; int++) {
				fcoType = this.FCOs[int]["fcoDropDown"];
				if (fcoType === FCOName) {
					keys =  this.FCOs[int]['keys'];
				}
			}
			return keys;
		},
		checkOperationAvailable : function(fcoName, operationName){
			var operationAvailable = false;	
			var fcoType = '';
			var operations = '';
			var operationType = '';

			for ( var int = 0; int < this.FCOs.length; int++) {
				fcoType = this.FCOs[int]["fcoDropDown"];
				if (fcoType === fcoName) {
					operations = this.FCOs[int]['operations'];
					for ( var j = 0; j < operations.length; j++) {
						operationType = operations[j]['name'];
						if (operationType === operationName) {
							operationAvailable = true;
						}
					}
				}
			}
			return operationAvailable;
		},
		getChangeIdConfig : function(requestContext){

			var FCOName = requestContext.getConfigFCO();// modified accourding to new configuration
			var Operation = requestContext.getOperationType();

			var fcoType = '';
			var operations = '';
			var operationType = '';
			for ( var int = 0; int < this.FCOs.length; int++) {
				fcoType = this.FCOs[int]["fcoDropDown"];
				if (fcoType === FCOName) {
					operations = this.FCOs[int]['operations'];
					for ( var j = 0; j < operations.length; j++) {
						operationType = operations[j]['name'];
						if (operationType === Operation) {
							return operations[j].changeIdConfig;
						}
					}
				}
			}
			return [];

		},
		getFCOsByOperation : function(operationName,provisioning){
			var fco = new Array();
			var operations = '';
			var operationType = '';
			if(operationName === "extendedOperation"){
				for ( var int = 0; int < this.extendedOperations.length; int++) {
					fco[fco.length] = {"dropDownKey" : this.extendedOperations[int]["display"] , "dropDownValue" : this.extendedOperations[int]["dropDownValue"]};;
				}
			}else{

				if(provisioning == "singleProvisioning"){
					for ( var int = 0; int < this.FCOs.length; int++) {
						if(this.FCOs[int]["supportsInGUI"]){
							operations = this.FCOs[int]['operations'];
							for ( var j = 0; j < operations.length; j++) {
								operationType = operations[j]['name'];
								if (operationType === operationName) {
									fco[fco.length] = {"dropDownKey" : this.FCOs[int]["fcoDropDownKey"] , "dropDownValue" : this.FCOs[int]["fcoDropDown"]};	
								}
							}
						}
					}
				}else if(provisioning == "bulkProvisioning"){
					for ( var int = 0; int < this.FCOs.length; int++) {
						operations = this.FCOs[int]['operations'];
						for ( var j = 0; j < operations.length; j++) {
							operationType = operations[j]['name'];
							if (operationType === operationName) {
								fco[fco.length] = {"dropDownKey" : this.FCOs[int]["fcoDropDownKeyForBulk"] , "dropDownValue" : this.FCOs[int]["fcoDropDown"]};	
							}
						}
					}
				}
			}
			return fco.sort(this.compareFco);
		},
		isExtendedUpdate:  function() {
			return ConfigurationProperties["isExtendedUpdate"];
		},
		getRequestTimeout: function() {
			return this.requestTimeOut;
		},
		compareFco: function(a,b) {
			if (a.dropDownKey < b.dropDownKey)
				return -1;
			if (a.dropDownKey > b.dropDownKey)
				return 1;
			return 0;
		},
		isCustomViewsAvailable : function(){
			return this.customViewsAvailable;
		},
		getUploadFileSize : function(){
			return this.uploadFileSize;
		},
		getOrderMgmtRefreshInterval : function(){
			return this.orderMgmtRefreshInterval;
		}
		
	};
});
