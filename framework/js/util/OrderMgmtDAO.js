/*
 * OrderMgmtDAO: Data Access Object. This provides an abstract interface to the persistence mechanism for Order Management requests. 
 * It provides mapping of application calls to the persistence layer without exposing details of the persistence layer.
 * Note: Persistence layer for client is just invocation of server side controller. 
 * It will be injected to all operation controllers to invoke a server call.
 * 
 */
define(['frameworkPath/util/FrameworkHelper'], function(FrameworkHelper){
	return {
		searchBulkHistory : function(model, successCallbackBulkOrders, errorCallback, callbackObject){
			var that = this;			
			model.url = "tenent/ordermgmt/bulkHistorySearch.htm";
			model.save({}, {
				success : function(model, response) {
					//Convert the String back to JSON object to set the attributes properly in the model
					var responseModel = new Backbone.Model(response);
					FrameworkHelper.createNestedModel(responseModel);
					callbackObject[successCallbackBulkOrders](responseModel);
				},
				error : function(xhr, model,response) {
					that.error(xhr, model,response,errorCallback, callbackObject);
				},
				//timeout : that.requestTimeout
			});
		},
		cancelBulkOrder : function(model, successCallbackCancelBulkOrder, errorCallback, callbackObject){
			var that = this;			
			model.url = "tenent/ordermgmt/cancelBulkOrder.htm";
			model.save({}, {
				success : function(model, response) {
					//var cancelOrderResponse = JSON.stringify(response); 
					var responseModel = new Backbone.Model(response);
					callbackObject[successCallbackCancelBulkOrder](responseModel);
				},
				error : function(xhr, model,response) {
					that.error(xhr, model,response,errorCallback, callbackObject);
				},
				//timeout : that.requestTimeout
			});
		},
		scheduleBulkOrder : function(model, successCallbackScheduleBulkOrder, errorCallback, callbackObject){
			var that = this;			
			model.url = "tenent/ordermgmt/scheduleBulkOrder.htm";
			model.save({}, {
				success : function(model, response) {
					//var cancelOrderResponse = JSON.stringify(response); 
					var responseModel = new Backbone.Model(response);
					callbackObject[successCallbackScheduleBulkOrder](responseModel);
				},
				error : function(xhr, model,response) {
					that.error(xhr, model,response,errorCallback, callbackObject);
				},
				//timeout : that.requestTimeout
			});
		},
		// Send redirect status is 302 but as returned status is 200 
		// so checking the response text to identify if page is redirected to login page and 
		// explicitly reloading login page which comes from getResponseHeader("Location")
		error : function(xhr, model, response, errorCallback, callbackObject) {
			if (xhr !== undefined) {
				if (xhr.status == 200 && xhr.responseText.indexOf("post") != -1 ) {
					window.location.href = this.getRootWebSitePath()+"/login.htm?sessionTimeOut=true";
					//window.location.reload();
				} else{
					callbackObject[errorCallback](xhr);
				}
			}
		},
		getRootWebSitePath : function(){
			var _location = document.location.toString();
    			var applicationNameIndex = _location.indexOf('/', _location.indexOf('://') + 3);
			var applicationName = _location.substring(0, applicationNameIndex) + '/';
    			var webFolderIndex = _location.indexOf('/', _location.indexOf(applicationName) + applicationName.length);
			var webFolderFullPath = _location.substring(0, webFolderIndex);
			return webFolderFullPath;
		}
	};
});