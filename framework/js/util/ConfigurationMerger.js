define([],function(){
	return {
		isConfigDataAvailable : false,
		dataReadyListeners : [],
		moduleLength : 0,
		loadedModuleLength : 0,
		fcos : [],
		elemenatePCS : [],// If module contribution is not available , elemenate the PC
		finalFcos : [],
		finalExtendedOperations : [],
		defaultKeys :["identifier"],
		defaultOperations : ["Search","Create","Delete","Update"],
		defaultViews: ["FullDetails"],
		defaultChangeIdConfig : {"key":"identifier","changeIdProceeding":[],"swap":false,"swapIdentifier":""},
		// listener design pattern for asynchornous call in javascript
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
		invokeConfigHandler : function() {
			for ( var i = 0; i < this.dataReadyListeners.length; i++) {
				this.dataReadyListeners[i].obj[this.dataReadyListeners[i].method]();
			}
		},
		// listeners design pattern implementation end
		
		getApplicationDataConfiguraion : function(){
			return this.fcos;
		},
		loadApplicationDataConfiguraion : function(PCS){
			this.loadModuleAppConfig(PCS);
		},
		loadModuleAppConfig : function(PCS){
			for(var j=0; j<PCS.length;j++){
				this.moduleLength = this.moduleLength + PCS[j].modules.length;
			}
			
			this.PCChildData = {};
			for(var i =0 ; i<PCS.length ;i++ ){
				var PC = PCS[i];
				var PCName = PC.requestVersion;
				var modules = PC.modules;
				var pcModules = {};
				for ( var int = 0; int < modules.length; int++) {
					pcModules[modules[int]] = undefined;
				}
				this.PCChildData[PCName] = {"modules":pcModules};	
			}
			
			
			for(var i =0 ; i<PCS.length ;i++ ){
				var PC = PCS[i];
				var PCName = PC.requestVersion;
				var modules = PC.modules;
				for ( var int = 0; int < modules.length; int++) {
					var path = "gui-modules/"+modules[int]+"/js/config/moduleAppConfig.js";
					this.loadAppConfig(path, modules[int],PCName);
				}
			}
		},
		loadAppConfig : function(path,ModuleName,PCName){
			var that = this;
			$.getJSON(path).done(function(data) {
				  that.addData(data,ModuleName.toString(),PCName.toString());
			      that.loadedModuleLength = that.loadedModuleLength +1;
			      if(that.moduleLength == that.loadedModuleLength){
			    	  that.execute();
			      }   
			   })
			   .fail(function( jqxhr, textStatus, error ) {
				   that.loadedModuleLength = that.loadedModuleLength +1;
				   if(!(error === "Not Found"))
					   that.elemenatePCS.push(PCName);
				   if(that.moduleLength == that.loadedModuleLength){
					   that.execute();
				   }
			   });
		},
		addData : function(data, moduleName, PCName){
			
			var updatedData = this.appendDefaultData(data);
			var Modules = [];
			/*if(this.PCChildData == undefined){
				this.PCChildData = {};
			}*/
			/*if(this.PCChildData[PCName] == undefined){
				this.PCChildData[PCName] = {"modules":[]};	
			}*/
			Modules = this.PCChildData[PCName].modules;
//			Modules[Modules.length] = updatedData;
			Modules[moduleName] = updatedData;
		},
		execute : function(){
				this.fcos = this.mergeAppliactionConfigData();
				this.isConfigDataAvailable = true;
				this.invokeConfigHandler();
		},
		appendDefaultData : function(moduleData){
			var module = moduleData;
			for(i=0;i<module.FCOs.length;i++){
				 var fco = module.FCOs[i];
				 fco.keys = fco.keys || [];
				 if(fco.keys.length == 0){
					 fco.keys =  this.getDefaultKeys();
				 }
				 var operations = fco.operations || {}
				 var denied = operations.denied || [];
				 var allowed = operations.allowed || [];
				 var accessControl = this.applyAccessControlOnDefaultOperationAndView(fco.type,denied,allowed);
				 this.appendDefaultOperationByApplyingAccessControl(fco,accessControl.deniedOperations,accessControl.allowedOperations,accessControl.changeIdConfigs);
				 this.appendDefaultViewsForOperationByApplyingAccessControl(fco.operations,accessControl.deniedViews,accessControl.allowedViews);
				 
//				 this.setDefaultOperations(fco);
//				 this.setDefaultViewsForOperation(fco.operations);
			}
			if(module.extendedOperations != undefined && module.extendedOperations != undefined){
					this.setDefaultViewsForOperation(module.extendedOperations);
			}
			return module;
		},
		appendDefaultOperationByApplyingAccessControl : function(fco,deniedOperations,allowedOperations,changeIdConfigs){
			var operations = [];
			var defaultOperations = this.getDefaultOperations(fco.type);
			for ( var dp = 0; dp < defaultOperations.length; dp++) {
				var defaultOperationName = defaultOperations[dp];
				if(!deniedOperations[defaultOperationName]){
					var changeIdConfig = [];
					if(defaultOperationName === "ChangeId"){
						changeIdConfig.push(this.defaultChangeIdConfig);
					}
					if(changeIdConfigs[defaultOperationName]){
						changeIdConfig.push.apply(changeIdConfig,changeIdConfigs[defaultOperationName]);
					}
					operations[operations.length] = {"name":defaultOperationName,"changeIdConfig":changeIdConfig};
				}
			}
			for ( var ap = 0; ap < allowedOperations.length; ap++) {
				var allowedOperation = allowedOperations[ap];
				operations[operations.length] = allowedOperation;
			}
			fco.operations =  operations;
		},
		appendDefaultViewsForOperationByApplyingAccessControl : function(operations,deniedViews,allowedViews,changeIdConfigs){
			var defaultViews = this.getDefaultViews();
			for ( var op = 0; op < operations.length; op++) {
				var operation = operations[op];
				var views = [];
				for ( var dv = 0; dv < defaultViews.length; dv++) {
					var defaultViewName = defaultViews[dv];
					if(!deniedViews[operation.name + "_" +defaultViewName]){
						views[views.length] = {"type":defaultViewName};
					}
				}
				var allowViews = allowedViews[operation.name] || [];
				for ( var av = 0; av < allowViews.length; av++) {
					var allowedView = allowViews[av];
					views[views.length] = allowedView;
				}
				operation.views = views;
			}
		},
		applyAccessControlOnDefaultOperationAndView : function(fcoType,denied,allowed){
			var deniedOperations = [];
			var deniedViews = [];
			var allowedOperations = [];
			var allowedViews = [];
			var changeIdConfigs = [];
			for ( var d = 0; d < denied.length; d++) {
				var deniedOperation = denied[d];
				if(deniedOperation.views != undefined && deniedOperation.views.length >0){
					var denyViews = deniedOperation.views;
					for ( var dv = 0; dv < denyViews.length; dv++) {
						var denyView = denyViews[dv];
						deniedViews[deniedOperation.name+"_"+denyView.type] = denyView;
					}
				}else{
					deniedOperations[deniedOperation.name] = deniedOperation;
				}
			}
			
			for ( var a = 0; a < allowed.length; a++) {
				var allowedOperation = allowed[a];
				if(!this.checkOperationIsAvailableInDefault(fcoType,allowedOperation.name)){
					allowedOperations[allowedOperations.length] = {"name":allowedOperation.name, "changeIdConfig":[]}
				}
				
				if(allowedOperation.changeIdConfig){
					changeIdConfigs[allowedOperation.name] = allowedOperation.changeIdConfig;
				}
				
				if(allowedOperation.views != undefined && allowedOperation.views.length >0){
					var allowViews = allowedOperation.views;
					for ( var av = 0; av < allowViews.length; av++) {
						var allowView = allowViews[av];
						if(!this.checkViewIsAvailableInDefault(allowView.type)){
							allowedViews[allowedOperation.name] = allowedViews[allowedOperation.name]? allowedViews[allowedOperation.name].push.apply(allowedViews[allowedOperation.name],[allowView]): [ allowView];
						}
					}
				}
			}
			return {"deniedOperations":deniedOperations,"deniedViews":deniedViews,"allowedOperations":allowedOperations,"allowedViews":allowedViews,"changeIdConfigs":changeIdConfigs};
		},
		
		
		
		
		checkOperationIsAvailableInDefault : function(type,operationName){
			if((this.getDefaultOperations(type)).indexOf(operationName) != -1){
				return true;
			}
			return false;
		},
		checkViewIsAvailableInDefault : function(viewName){
			if((this.getDefaultViews()).indexOf(viewName) != -1){
				return true;
			}
			return false;
		},
		getDefaultKeys : function(){
			return this.defaultKeys;
		},
		/*setDefaultOperations : function(fco){
			fco.operations = fco.operations || [];
			if(fco.operations.length == 0){
				fco.operations = this.getDefaultOperations(fco.type);
			}
		},*/
		getDefaultOperations : function(type){
			var operation = this.defaultOperations.slice(0);
			if(type === "NSR"){
				operation.push("SearchAll");
			}else{
				operation.push("ChangeId");
			}
			return operation;
		},
		setDefaultViewsForOperation : function(operation){
			for(op=0; op<operation.length;op++){
				var opt= operation[op];
				opt.views = opt.views || [];
				if(opt.views.length== 0){
					for ( var v = 0; v < this.getDefaultViews().length; v++) {
						var view = this.getDefaultViews()[v];
						opt.views[opt.views.length] = {"type" : view} ;
					}
				}
			}
		},
		getDefaultViews : function(){
			return this.defaultViews;
		},
		mergeAppliactionConfigData : function(){
		
			var fcos = {};
			var pcs = {};
			var pcFcoNames = {};
			var fcoNames = [];
			for( var pcName in this.PCChildData){
				if(!(this.elemenatePCS.indexOf(pcName) != -1)){
				var pc = this.PCChildData[pcName];
				fcos = {};
				fcoNames = [];
				var exOperations = [];
				
//				for(i=0; i<pc.modules.length ; i++){
//					var module = pc.modules[i];
				for( var modName in pc.modules){
					
						var module = pc.modules[modName];
						if(module!=undefined){
						var moduleName = module.version;
						var fcoList = module.FCOs;
						for(j=0;j<fcoList.length;j++){
							var fco = fcoList[j];
							var fcoName = fco.name;
							var fcoDropDownValue =(fco.type!=undefined ? fco.type+"-": "" )+fcoName+"_PC_"+pcName;
							var oldFCO = fcos[fcoName] || {"keys":[],"operations":[]};
							
							var oldKeys = oldFCO.keys;
							var oldOperations = oldFCO.operations;
							var oldViews = {};
							
							var newKeys = fco.keys;
							var newOperations  = fco.operations;
							
							// Elementing the duplicate fcoNames for Same PC
							fcoNames.push.apply(fcoNames,[fcoName]);
							fcoNames = this.ArrNoDupe(fcoNames);
							
							// Elementing the duplicate keys of same fco
							oldKeys.push.apply(oldKeys, newKeys);
							oldKeys = this.ArrNoDupe(oldKeys);
							
							for(k=0;k < newOperations.length; k++ ){
								var operation = newOperations[k];
								var operationName = operation.name;
								var oldViews = {};
								var oldChangeIdConfig = {};
								if(oldOperations[operationName]!=undefined){
									oldViews = oldOperations[operationName].views;
									oldChangeIdConfig = oldOperations[operationName].changeIdConfig || {};
								}
								newChangeIdConfig = operation.changeIdConfig || {};
								for(c=0;c < newChangeIdConfig.length; c++){
									var changeIdConfig=newChangeIdConfig[c];
									var changeIdKey = changeIdConfig.key;
									var oldChangeIdProceeding = [];
									if(changeIdKey!=undefined){
										if(oldChangeIdConfig[changeIdKey] != undefined){
											oldChangeIdProceeding = oldChangeIdConfig[changeIdKey].changeIdProceeding || {};
										}
										changeIdProceeding = changeIdConfig.changeIdProceeding || [];
										oldChangeIdProceeding.push.apply(oldChangeIdProceeding,changeIdProceeding);
										oldChangeIdConfig[changeIdKey] = {"key":changeIdKey,"changeIdProceeding":oldChangeIdProceeding,"swap":changeIdConfig.swap,"swapIdentifier":changeIdConfig.swapIdentifier};
									}
								}
								
								newViews = operation.views;
								for(l=0;l < newViews.length; l++){
									var view= newViews[l];
									var viewName = view.type;
									var oldModules = [];
									if(oldViews[viewName] != undefined){
										oldModules = oldViews[viewName].modules;
									}
									var modules = [{"name": moduleName}];
									oldModules.push.apply(oldModules,modules);
									oldViews[viewName] =  {"type" : viewName , "modules" : oldModules  };
								}
								oldOperations[operationName] = {"name" : operationName , "views" : oldViews , "changeIdConfig":oldChangeIdConfig};
							}
							fcos[fcoName] = {"name" : fcoName , "display" : fco.display , "type" : fco.type ,"fcoDropDown" : fcoDropDownValue, "keys" : oldKeys , "operations" : oldOperations};		
						}
						var extendedOperations = module.extendedOperations ||  [];
						
						var oldExtendedOperation = {};
						var oldExOperationViews = {};
						for(e=0 ; e < extendedOperations.length ; e++){
							var extendedOperation = extendedOperations[e]; 
							var extendedOperationDropDownValue = extendedOperation.name+"_PC_"+pcName;
							oldExtendedOperation = exOperations[extendedOperationDropDownValue];
							oldExOperationViews =  {};
							if(oldExtendedOperation != undefined){
								oldExOperationViews = oldExtendedOperation.views;
							}
							newExOperationViews = extendedOperation.views;
							for(l=0;l < newExOperationViews.length; l++){
								var view= newExOperationViews[l];
								var viewName = view.type;
								var oldModules = [];
								if(oldExOperationViews[viewName] != undefined){
									oldModules = oldExOperationViews[viewName].modules;
								}
								var modules = [{"name": moduleName}];
								oldModules.push.apply(oldModules,modules);
								oldExOperationViews[viewName] =  {"type" : viewName , "modules" : oldModules };
							}
							exOperations[extendedOperationDropDownValue] = {"name":extendedOperation.name , "display":extendedOperation.display ,"dropDownValue": extendedOperationDropDownValue , "views":oldExOperationViews};
						}
				}
				}
				pcs[pcName] = {"fcos" : fcos , "extendedOperations" : exOperations};
				pcFcoNames[pcName] = fcoNames;
			}
		}
			this.mergeFcoNames(pcFcoNames);
			return this.convertToOrignalJSON(pcs);
		
		},
		ArrNoDupe : function(a){
			var temp = {};
		    for (var a1 = 0; a1 < a.length; a1++)
		        temp[a[a1]] = true;
		    var r = [];
		    for (var a2 in temp)
		        r.push(a2);
		    return r;
		},
		convertToOrignalJSON : function(pcs){
			var newFCO = [];
			var newExOperations = [];
			var fcoName = "";
			for ( var pcName in pcs) {
				var fcos = pcs[pcName].fcos;
				for(var i in fcos){
					var tempFCO = fcos[i];
					var newTempOperation = [];
					var tempFcoName = tempFCO.name;
					var tempOperations = tempFCO.operations;
					for(var j in tempOperations){
						var tempOperation = tempOperations[j];
						var newTempView = [];
						var newChangeIdConfig = [];
						var tempViews =tempOperation.views;
						for(var k in tempViews){
							var tempView = tempViews[k];	
							newTempView[newTempView.length] = tempView;
						}
						var tempChangeIdConfig = tempOperation.changeIdConfig;
						for(var c in tempChangeIdConfig){
							var tempChangeId = tempChangeIdConfig[c];
							newChangeIdConfig[newChangeIdConfig.length] = tempChangeId;
						}
						newTempOperation[newTempOperation.length] = {"name" : tempOperation.name , "views" :  newTempView ,"changeIdConfig" :newChangeIdConfig};
					}
					
					// making dropdown display key
					
					fcoName =  tempFCO.display || (tempFCO.type!=undefined ? tempFCO.type+"-": "" )+tempFcoName;
					if(this.checkFcoDuplicate(tempFcoName)){
						fcoName = fcoName + "_PC_" +pcName ;
					}
					newFCO[newFCO.length] = {"name" : tempFcoName,"display" : tempFCO.display , "type" : tempFCO.type ,"fcoDropDownKey" : fcoName,"fcoDropDown" : tempFCO.fcoDropDown, "keys" : tempFCO.keys , "operations" :newTempOperation };
				}
				var extendedOperations = pcs[pcName].extendedOperations;
				for(var e in extendedOperations){
					var tempExOperation = extendedOperations[e];
					if(!(typeof tempExOperation === 'function')){
						var newExOperationTempView = [];
						var tempExOperationViews =  tempExOperation.views;
						for(var k in tempExOperationViews){
							var tempView = tempExOperationViews[k];	
							newExOperationTempView[newExOperationTempView.length] = tempView;
						}
						newExOperations[newExOperations.length] = {"name":tempExOperation.name , "display" :tempExOperation.display, "dropDownValue": tempExOperation.dropDownValue , "views": newExOperationTempView };
					}
				}
			}
			this.finalExtendedOperations = newExOperations;
			console.log(this.finalExtendedOperations);
			return newFCO;
		},
		removeInCorrectPCS : function(pcs){
			var tempPC = new Array();
			var pcName = "";
			for ( var int = 0; int < pcs.length; int++) {
				pcName = pcs[int].version;
				if(!(this.elemenatePCS.indexOf(pcName) != -1)){
					tempPC.push(pcs[int]);
				}
			}
			return tempPC;
		},
		mergeFcoNames : function(pcFcoNames){
			var pcName = "";
			for ( var pcName in pcFcoNames) {
				if(!(this.elemenatePCS.indexOf(pcName) != -1)){
					this.finalFcos.push.apply(this.finalFcos,pcFcoNames[pcName]);
				}
			}
		},
		checkFcoDuplicate : function(fcoName){
			var count = 0;
			for (var a1 = 0; a1 < this.finalFcos.length; a1++){
				if(this.finalFcos[a1] === fcoName){
					count = count +1;
					if(count > 1){
						return true;
					}
				}
			}
			return false;
		}
	};
});