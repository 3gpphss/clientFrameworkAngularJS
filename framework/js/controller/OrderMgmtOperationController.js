/*
 * OrderMgmtOperationController: Handles all Order Management operations based on user inputs.
 * Send requests to OrderMgmtDAO with required model. 
 * 
 */
define(['frameworkViews/FrameworkView', 'frameworkModels/RequestModel', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError', 'OrderMgmtErrorHandler', 'BaseCollection'],
		function(FrameworkView, RequestModel, FrameworkError, ServerError, OrderMgmtErrorHandler, BaseCollection){
	return FrameworkView.extend({
		
		searchBulkHistory : function(state) {
				var isReload = $("#reloadBulkOrders").prop("checked");
				if(!isReload){
					this.layout.displayLoading();
				}
				var requestModel = new RequestModel();
				requestModel.set("status", state, {silent: true});
				requestModel.unset("language", {silent: true});
				requestModel.unset("execution", {silent: true});
				this.OrderMgmtDAO.searchBulkHistory(requestModel,'successCallbackBulkOrders', 'errorCallback', this);
		},
		cancelBulkOrder : function(bulkOrderModel) {
			this.layout.displayLoading();
			var requestModel = new RequestModel(bulkOrderModel.toJSON());
			requestModel.unset("language", {silent: true});
			requestModel.unset("execution", {silent: true});
			requestModel.unset("successPercnetage", {silent: true});
			this.OrderMgmtDAO.cancelBulkOrder(requestModel,'successCallbackCancelBulkOrder', 'errorCallback', this);
		},
		scheduleBulkOrder : function(bulkOrderModel) {
			this.layout.displayLoading();
			var requestModel = new RequestModel(bulkOrderModel.toJSON());
			requestModel.unset("language", {silent: true});
			requestModel.unset("execution", {silent: true});
			requestModel.unset("successPercnetage", {silent: true});
			this.OrderMgmtDAO.scheduleBulkOrder(requestModel,'successCallbackScheduleBulkOrder', 'errorCallback', this);
		},
		onServerSuccess : function(responseModel) {
			if (responseModel.get('result') == "FAILURE") {
				var errorObject = new ServerError(responseModel.get('errorCode'), responseModel.get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('errorRecomendation'));
				this.displayError(errorObject);
			} else {
				var bulkHistoryCollection = null;
				var MASKED_DATA = "*****";
				try {
					bulkHistoryCollection = responseModel.get("responseCollection");
					if(bulkHistoryCollection!= undefined) {
						bulkHistoryCollection.sortAttribute= this.layout.sortAttr || "initialTimeStamp"; // if user selected sorting is available , then use that data else use default sort attr
						bulkHistoryCollection.sortDirection= this.layout.sortDirection || -1;// if user selected sorting is available , then use that data else use default sort direction
						bulkHistoryCollection.sortBulkData = function (attr) {
							bulkHistoryCollection.sortAttribute = attr;
							bulkHistoryCollection.sort({silent:true});
						   },
						   bulkHistoryCollection.slice = function(begin, end) {
						        return this.models.slice(begin, end);
						    },
						bulkHistoryCollection.comparator= function(a,b){
							//special handling for Time stamp.   
							if(bulkHistoryCollection.sortAttribute == "initialTimeStamp"){
								var dateInMSA = parseInt(a.get("initialTimeStampinMS"));
								var dateInMSB = parseInt(b.get("initialTimeStampinMS"));
								if (dateInMSA == dateInMSB) 
									return 0;
								if (bulkHistoryCollection.sortDirection ==1) 
									return dateInMSA > dateInMSB ? 1 : -1;
								else
									return dateInMSA < dateInMSB ? 1 : -1;
							}
							else {
								var a = a.get(bulkHistoryCollection.sortAttribute), 
					            b = b.get(bulkHistoryCollection.sortAttribute);
								if (a == b) 
									return 0;
								if (bulkHistoryCollection.sortDirection == 1)
									return a > b ? 1 : -1;
								else	
									return a < b ? 1 : -1;
							}
					    }
						bulkHistoryCollection.sort({silent:true});
						bulkHistoryCollection.each(function(model){
							if (model.get('extendedFileName').indexOf("dsa") !=-1 ){
								model.set('numberOfRequestsExecuted', model.get('totalNumberOfRequests'), {silent: true} );
							}
							var successPercnetage = 0; 
							var	numberOfRequestsExecuted = model.get('numberOfRequestsExecuted');
							var totalNumberOfRequests = model.get('totalNumberOfRequests');
							if ((numberOfRequestsExecuted !=0 && numberOfRequestsExecuted != MASKED_DATA) || (totalNumberOfRequests !=0 && totalNumberOfRequests != MASKED_DATA) ) { 
								var success = numberOfRequestsExecuted/totalNumberOfRequests;
								var successPercnetage = success*100; 
								model.set('successPercnetage', successPercnetage, {silent: true});
							}
							else {
								if (numberOfRequestsExecuted == MASKED_DATA && totalNumberOfRequests == MASKED_DATA){
									model.set('successPercnetage', MASKED_DATA, {silent: true} );
								}
								else {
									model.set('successPercnetage', successPercnetage, {silent: true} );
								}
							}
						});
					}
					else {
						bulkHistoryCollection = new BaseCollection();
					}
					
				} catch (err) {
					this.displayError(new FrameworkError('UNEXPECTED_ERROR',[ err ]));
				}
				this.render(bulkHistoryCollection);
			}
		},
		onServerSuccessCancelBulkOrder : function(responseModel) {
			if ("SUCCESS" == responseModel.get('result')){
				var responseMessage = null;
				try {
					//responseMessage = FrameworkMessage('ORDRMGMT_CANCELLATION_SUCESS' ['']);
					  responseMessage = "Cancellation status: Request accepted and cancellation in progress.";
					  this.renderBulkOrderResponse(responseMessage);
						
				} catch (err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', [ 'result' ]));
				}
			}
		else {
			if ("FAILURE" == responseModel.get('result')) {
				var failureMessage = null;
				if (null == responseModel.get('errorMessage')){
					failureMessage = "Cancellation status: Could not cancel order.";
				}
			}
			else{
					failureMessage = "Cancellation status: Request rejected.";
				}
				var errorObject = new ServerError(responseModel.get('errorCode'), failureMessage);
				errorObject.setErrorHint(responseModel.get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('errorRecomendation'));
				this.displayError(errorObject);
			}
		},
		onServerSuccessScheduleBulkOrder : function(responseModel) {
			if ("SUCCESS" == responseModel.get('result')){
				var responseMessage = null;
				try {
					//responseMessage = FrameworkMessage('ORDRMGMT_CANCELLATION_SUCESS' ['']);
					  responseMessage = "Schedule status: Request accepted and scheduling in progress.";
					  this.renderBulkOrderResponse(responseMessage);
						
				} catch (err) {
					this.displayError(new FrameworkError('BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR', [ 'result' ]));
				}
			}
		else {
			if ("FAILURE" == responseModel.get('result')) {
				var failureMessage = null;
				if (null == responseModel.get('errorMessage')){
					failureMessage = "Schedule status: Couldn't schedule the order.";
				}
			}
			else{
					failureMessage = "Schedule status: Couldn't schedule the order.";
				}
				var errorObject = new ServerError(responseModel.get('errorCode'), failureMessage);
				errorObject.setErrorHint(responseModel.get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('errorRecomendation'));
				this.displayError(errorObject);
			}
		},
		render : function(bulkHistoryCollection){
			this.layout.renderResponse(bulkHistoryCollection);
			this.hideLoading();
		},
		renderBulkOrderResponse : function(responseMessage) {
			this.layout.renderBulkOrderResponse(responseMessage);
			this.hideLoading();
		},
		successCallbackBulkOrders: function(responseModel) {
			this.onServerSuccess(responseModel);
		},
		successCallbackCancelBulkOrder: function(responseModel) {
			this.onServerSuccessCancelBulkOrder(responseModel);
		},
		successCallbackScheduleBulkOrder: function(responseModel) {
			this.onServerSuccessScheduleBulkOrder(responseModel);
		},
		
		errorCallback: function(responseModel) {
			this.onServerFailure(responseModel);
		},
		onServerFailure: function(responseModel) {
			var httpError = undefined;
			if(responseModel.status == 0 && responseModel.statusText == "timeout") {
				httpError = new FrameworkError('HTTP_REQUEST_TIMEOUT_ERROR');
				httpError.setErrorRecomendation('Request timed out! Please check the status of the submitted request later.');
			} else {
				httpError = new FrameworkError('HTTP_SERVER_ERROR', [responseModel.status,responseModel.statusText, responseModel.responseText]);
			}
			this.displayError(httpError);
		},
		displayError: function(errorObject) {
			OrderMgmtErrorHandler(errorObject);
			this.hideLoading();
		},
		hideLoading : function(){
			this.layout.hideLoading();
		}
	});
});
