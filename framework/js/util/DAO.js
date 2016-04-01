/*
 * DAO: Data Access Object. This provides an abstract interface to the persistence mechanism. It provides mapping of application calls to 
 * the persistence layer without exposing details of the persistence layer.
 * Note: Persistence layer for client is just invocation of server side controller. 
 * It will be injected to all operation controllers to invoke a server call
 * 
 */
define(['frameworkPath/util/FrameworkHelper'], function(FrameworkHelper){
	return { 
		// Cache on client side which maintains fco details for a given fcoName and pcName
		cachedFcoDetails: [],
		getCachedFcoDetails: function(fcoName, pcName) {
			for(var i = 0; i < this.cachedFcoDetails.length; i++) {
				if(this.cachedFcoDetails[i].fcoName == fcoName && this.cachedFcoDetails[i].pcName == pcName) {
					return this.cachedFcoDetails[i].data;
				}
			}
			return undefined;
		},
		setCachedFcoDetails: function(fcoName, pcName, data) {
			this.cachedFcoDetails.push({"fcoName": fcoName, "pcName": pcName, "data": data});
		},
		getRequestTimeOut: function() {
			this.requestTimeout = this.ConfigurationManager.getRequestTimeout();
		},
		// REST API Functions
		searchRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/searchrequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.searchResponse","searchResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model,response) {
					that.error(xhr, model,response,errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		bulkSearchRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;		
			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/bulkSearchRequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.bulkTransferResponse","bulkTransferResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model,response) {
					that.error(xhr, model,response,errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		deleteRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/deleterequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.deleteResponse","deleteResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		// No timeout for NSR delete request as the response is shown as a notification
		nsrDeleteRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/deleterequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.deleteResponse","deleteResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				}
			});
		},
		createRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/addrequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.addResponse","addResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		updateRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/modifyrequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.modifyResponse","modifyResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		changeIdRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/changeIdrequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.changeIdResponse","changeIdResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		extendedRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/extendedRequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.extendedResponse","extendedResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		// TODO: update the success callback
		extendedUpdateRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/extendedModifyRequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.modifyResponse","modifyResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model, response) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		bulkRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;		
			model.setRequestID(FrameworkHelper.createUUID());
			model.url = "tenent/appdata/bulkRequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.bulkTransferResponse","bulkTransferResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model,response) {
					that.error(xhr, model,response,errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		getConfigData : function(dns, callbackMethod, errorCallback, callbackObject) {
			var that = this;
			if(dns != undefined && dns.length >= 1){
				$.ajax({
					type: "POST",
					url: "appConfig/tenant/configData.htm",
					data: JSON.stringify({"dns":dns}),
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					success: function(podData){
						callbackObject[callbackMethod](podData);
					},
					failure : function( jqxhr, textStatus, error){
						//that.error(xhr, model, response, errorCallback, callbackObject); //TODO :  handle the failure sceneraio
					}
				});
			} else{
				callbackObject[callbackMethod]({});
			} 
		},
		getNSRData : function(dns, callbackMethod, errorCallback, callbackObject) {
			var that = this;
			if(dns != undefined && dns.length >= 1){
				$.ajaxSetup({
					async: false
				});   

				$.ajax({
					type: "POST",
					url: "appConfig/tenant/nsrCacheData.htm",
					data: JSON.stringify({"dns":dns}),
					contentType: 'application/json; charset=utf-8',
					dataType: 'json',
					success: function(podData){
						callbackObject[callbackMethod](podData);
					},
					failure : function( jqxhr, textStatus, error){
						//that.error(xhr, model, response, errorCallback, callbackObject); //TODO :  handle the failure sceneraio
					}
				});
				$.ajaxSetup({
					async: true
				});
			} else{
				callbackObject[callbackMethod]({});
			} 
		},
		searchBulkHistory : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			
			model.url = "tenent/ordermgmt/bulkHistorySearch.htm";
			model.save({}, {
				success : function(model, response) {
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(response);
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(xhr, model,response) {
					that.error(xhr, model,response,errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		// Synchronous search request: Blocks the flow until server response is received.
		syncSearchRequest : function(xhr, model, successCallback, errorCallback, callbackObject){
			$.ajaxSetup({
				async: false
			});   

			this.searchRequest(xhr, model, successCallback, errorCallback, callbackObject);

			$.ajaxSetup({
				async: true
			});
		},
		getFcoDetails : function(data, successCallback, errorCallback, callbackObject) {
			/*var responseModel  = new Backbone.Model();
			//var responseModel = new Backbone.Model({'name': 'Subscriber','displayName':'Subscriber', 'childSCOs':[{'scoName':'hss','displayName':'HSS','flatAttributes':[{'attributeName':'subscriptionId','displayName':'subscriptionId','attributeType':'string'},{'attributeName':'profilType','displayName':'profileType','attributeType':'enum'}],'childSCOs':[{'scoName':'privateUserId','displayName':'privateUserId','flatAttributes':[{'attributeName':'privateUserId','displayName':'privateUserId','attributeType':'string'},{'attributeName':'imsi','displayName':'imsi','attributeType':'string'}],'childSCOs':[{'scoName':'provisionedImsi','displayName':'proviionedImsi','flatAttributes':[{'attributeName':'provisionedImsi','displayName':'provisionedImsi','attributeType':'string'}]}]}]},{'scoName':'auc','displayName':'AUC','flatAttributes':[{'attributeName':'imsi','displayName':'imsi','attributeType':'string'},{'attributeName':'algoId','displayName':'algoId','attributeType':'int'}]}],'flatAttributes':[{'attributeName':'identifier','diplayName':'identifier','attributeType':'string'},{'attributeName':'masteredBy','displayName':'masteredBy','attributeType':'int'}]});
			if(data.fcoName == 'Subscriber') {
				//responseModel = new Backbone.Model({'name': 'Subscriber','displayName':'Subscriber', 'childSCOs':[{'scoName':'/hss','displayName':'HSS','flatAttributes':[{'attributeName':'/hss/subscriptionId','displayName':'subscriptionId','attributeType':'string'},{'attributeName':'/hss/profilType','displayName':'profileType','attributeType':'enum'}],'childSCOs':[{'scoName':'/hss/privateUserId','displayName':'privateUserId','flatAttributes':[{'attributeName':'/hss/privateUserId/privateUserId','displayName':'privateUserId','attributeType':'string'},{'attributeName':'/hss/privateUerId/imsi','displayName':'imsi','attributeType':'string'}],'childSCOs':[{'scoName':'/hss/privateUerId/provisionedImsi','displayName':'proviionedImsi','flatAttributes':[{'attributeName':'/hss/privateUserId/provisionedImsi/provisionedImsi','displayName':'provisionedImsi','attributeType':'string'}]}]}]},{'scoName':'/auc','displayName':'AUC','flatAttributes':[{'attributeName':'imsi','displayName':'imsi','attributeType':'string'},{'attributeName':'/auc/algoId','displayName':'algoId','attributeType':'int'}]}],'flatAttributes':[{'attributeName':'identifier','diplayName':'identifier','attributeType':'string'},{'attributeName':'masteredBy','displayName':'masteredBy','attributeType':'int'}]});
				//responseModel = new Backbone.Model({'uniqueName': 'Subscriber','displayName':'Subscriber', 'secondClassObjects':[{'uniqueName':'/hss','displayName':'HSS','attributes':[{'uniqueName':'/hss/subscriptionId','displayName':'subscriptionId','type':'string'},{'uniqueName':'/hss/profilType','displayName':'profileType','type':'enum'}],'secondClassObjects':[{'uniqueName':'/hss/privateUserId','displayName':'privateUserId','attributes':[{'uniqueName':'/hss/privateUserId/privateUserId','displayName':'privateUserId','type':'string'},{'uniqueName':'/hss/privateUerId/imsi','displayName':'imsi','type':'string'}],'secondClassObjects':[{'uniqueName':'/hss/privateUerId/provisionedImsi','displayName':'proviionedImsi','attributes':[{'uniqueName':'/hss/privateUserId/provisionedImsi/provisionedImsi','displayName':'provisionedImsi','type':'string'}]}]}]},{'uniqueName':'/auc','displayName':'AUC','attributes':[{'uniqueName':'imsi','displayName':'imsi','type':'string'},{'uniqueName':'/auc/algoId','displayName':'algoId','type':'int'}]}],'attributes':[{'uniqueName':'identifier','diplayName':'identifier','type':'string'},{'uniqueName':'masteredBy','displayName':'masteredBy','type':'int'}]});
				responseModel = new Backbone.Model({'uniqueName':'Subscriber','displayName':'Subscriber','secondClassObjects':[{'uniqueName':'/hss','displayName':'HSS','attributes':[{'uniqueName':'/hss/subscriptionId','displayName':'subscriptionId','type':'string'},{'uniqueName':'/hss/profilType','displayName':'profileType','type':'enum'}],'secondClassObjects':[{'uniqueName':'/hss/privateUserId','displayName':'privateUserId','attributes':[{'uniqueName':'/hss/privateUserId/privateUserId','displayName':'privateUserId','type':'string'},{'uniqueName':'/hss/privateUerId/imsi','displayName':'imsi','type':'string'}],'secondClassObjects':[{'uniqueName':'/hss/privateUerId/provisionedImsi','displayName':'proviionedImsi','attributes':[{'uniqueName':'/hss/privateUserId/provisionedImsi/provisionedImsi','displayName':'provisionedImsi','type':'string'}]}]},			{'uniqueName':'/hss/serviceProfile','displayName':'ServiceProfile','attributes':[{'uniqueName':'/hss/serviceProfile/profileName','displayName':'ProfileName','type':'string'},{'uniqueName':'/hss/serviceProfile/attr','displayName':'testattribute','type':'string'}],'secondClassObjects':[{'uniqueName':'/hss/serviceProfile/mandatoryCapability','displayName':'MandatoryCapability','attributes':[{'uniqueName':'/hss/serviceProfile/mandatoryCapability/mandatoryCapability','displayName':'MandatoryCapability','type':'string'}]},				{'uniqueName':'/hss/serviceProfile/optionalCapability','displayName':'OptionalCapability','attributes':[{'uniqueName':'/hss/serviceProfile/optionalCapability/optionalCapability','displayName':'OptionalCapability','type':'string'}]}]}]},{'uniqueName':'/auc','displayName':'AUC','attributes':[{'uniqueName':'imsi','displayName':'imsi','type':'string'},{'uniqueName':'/auc/algoId','displayName':'algoId','type':'int'}],		'secondClassObjects':[{'uniqueName':'/auc/testSCO','displayName':'TestSCO','attributes':[{'uniqueName':'/auc/testSCO/testSCO','displayName':'testscoattr','type':'string'}]}]}],'attributes':[{'uniqueName':'identifier','diplayName':'identifier','type':'string'},{'uniqueName':'masteredBy','displayName':'masteredBy','type':'int'}]});
				FrameworkHelper.createNestedModel(responseModel);
			}
			callbackObject[successCallback](responseModel);*/

			var that = this;
			if(data){
				var responseModel = this.getCachedFcoDetails(data.fcoName, data.requestVersion);
				if(responseModel) {
					callbackObject[successCallback](responseModel);
				} else {
					$.ajax({
						type: "POST",
						url: "appConfig/tenant/fcoDetails.htm",
						data: JSON.stringify(data),
						contentType: 'application/json; charset=utf-8',
						dataType: 'json',
						success: function(responseString){
							var responseModel = new Backbone.Model(responseString);
							FrameworkHelper.createNestedModel(responseModel);
							that.formatTreeData(responseModel);
							that.setCachedFcoDetails(data.fcoName, data.requestVersion, responseModel);
							callbackObject[successCallback](responseModel);
						},
						error: function(jqXHR, textStatus, errorThrown){
							that.error(jqXHR,  textStatus, errorThrown, errorCallback, callbackObject); 
						},
						timeout: that.requestTimeout
					});
				}
			} else{
				callbackObject[callbackMethod]({});
			} 
		},
		validateFilterRequest : function(model, successCallback, errorCallback, callbackObject){
			var that = this;			
			model.url = "tenent/appdata/validateFilterRequest.htm";
			model.save({}, {
				success : function(model, response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.validateFilterResponse","validateFilterResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					that.error(xhr, model, response, errorCallback, callbackObject);
				},
				timeout : that.requestTimeout
			});
		},
		uploadIdentifierFile : function(formData, successCallback, errorCallback, callbackObject) {
			$.ajax({
				url: "tenent/appdata/uploadIdentifierFile.htm",
				type : 'POST',
				data : formData,
				enctype : "multipart/form-data",
				contentType : false,
				cache : false,
				processData : false,
				success : function(response) {
					var responseString = JSON.stringify(response); 
					responseString = responseString.replace("spml.idFileTransferResponse","idFileTransferResponse");
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(JSON.parse(responseString));
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallback](responseModel);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					that.error(jqXHR,  textStatus, errorThrown, errorCallback, callbackObject); 
				}
			});
		},
		// Send redirect status is 302 but as returned status is 200 
		// so checking the response text to identify if page is redirected to login page and 
		// explicitly reloading login page which comes from getResponseHeader("Location")
		error : function(xhr, model, response, errorCallback, callbackObject) {
			if (xhr !== undefined) {
				if (xhr.status == 200 && xhr.responseText.indexOf("post") != -1 ) {
					window.location = xhr.getResponseHeader("Location");
					window.location.reload();
				} else{
					callbackObject[errorCallback](xhr);
				}
			}
		},
		// Removes initial slash from all uniqueNames in the tree structure
		formatTreeData: function(treeData) {
			var that = this;
			if(treeData) {
				this.removeSlashFromUniqueName(treeData);
				if(treeData.get("attributes")) {
					treeData.get("attributes").each(function(attribute) {
						that.removeSlashFromUniqueName(attribute);
					});
				}
				if(treeData.get("secondClassObjects")) {
					treeData.get("secondClassObjects").each(function(childSco) {
						that.formatTreeData(childSco);
					});
				}
			}
		},
		// Removes initial slash from the given element's uniqueName
		removeSlashFromUniqueName: function(obj) {
			if(obj.get("uniqueName")) {
				var uniqueName = obj.get("uniqueName").replace("/", "");
				obj.set("uniqueName", uniqueName, {silent: true});
			}
		}
	};
});