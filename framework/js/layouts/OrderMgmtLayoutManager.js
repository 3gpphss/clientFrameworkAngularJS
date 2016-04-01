 	/*
	 * OrderMgmtLayoutManager: Responsible for layout design display. 
	 * Display orders and specific order details.
	 * Delegate request to operation controller.
	 * 
	 */
	define(
			[ 'backbone', 'text!framework/templates/orderMgmtResponseTemplate.html', 'text!framework/templates/orderMgmtResponseDataTemplate.html', 'text!framework/templates/orderMgmtResponseReadOnlyTemplate.html', 'text!framework/templates/orderMgmtDetailsTemplate.html', 'moment', 'tablesorter'],
			function(Backbone, orderMgmtResponseTemplate, orderMgmtResponseDataTemplate, orderMgmtResponseReadOnlyTemplate, orderMgmtDetailsTemplate, moment) {
				return Backbone.View.extend({
					template : _.template(orderMgmtResponseTemplate),
					dataTemplate : _.template(orderMgmtResponseDataTemplate),
					readonlyTemplate : _.template(orderMgmtResponseReadOnlyTemplate),
					detailsTemplate : _.template(orderMgmtDetailsTemplate),
					sortAttr : undefined,
					sortDirection : undefined,
					idArray :[],
					el: $("#orderMgmtResponseDiv"),
					events: {
						'click .details' : 'displayDetails',
						'click .cancel' : 'cancelBulkOrder'	,
						'change .timeScheduler' : 'scheduleBulkOrder',
						'click .main' : 'toggleBulkRequest',		
				        'click .ordermgmtsort' : 'sortOrdermgmtTable'
					},
					initializeRequiredFields : function(){
						this.orderMgmtOperationController.layout = this;
					},
					searchBulkHistory : function(state) {
						this.orderMgmtOperationController.searchBulkHistory(state);
					},
					renderResponse : function(bulkHistoryCollection) {
						this.collection = bulkHistoryCollection;
						
						var currentDate = moment().format('MMM DD YYYY HH:mm:ss');
						var context = {"bulkHistoryCollection": this.collection};
						this.isReload = $("#reloadBulkOrders").prop("checked");
						if(this.isReload) {
							this.$el.html(this.readonlyTemplate($.extend({}, context, {"lastRefreshTime": currentDate})));
						}
						else{
							this.$el.html(this.template({"lastRefreshTime": currentDate}));
							$("#OrderMgmtResponseData").html(this.dataTemplate(context));
						}
						this.processDomData(bulkHistoryCollection);
						this.expandIdsonRefresh();
					},
					sortOrdermgmtTable : function(ev){
						var sortColumn = ev.currentTarget.id;
						if (this.collection !=undefined && this.collection.length > 0){
							var sortAttr = this.collection.sortAttribute;
							if(sortColumn == sortAttr){
								this.collection.sortDirection *= -1;
							}
							else{
								this.collection.sortDirection = 1;
							}
							// storing the state of user selected sorting
							this.sortAttr = sortColumn;
							this.sortDirection = this.collection.sortDirection;
							
							this.collection.sortBulkData(sortColumn);
						    this.renderResponseWithSorting(this.collection, ev);
						}
					},
					renderResponseWithSorting : function(bulkHistoryCollection, ev) {
						var currentDate = moment().format('MMM DD YYYY HH:mm:ss');
						var context = {"bulkHistoryCollection": bulkHistoryCollection};
						var sortColumn = $(ev.currentTarget);
						var sortColumnId = ev.currentTarget.id;
						this.resetOtherTargets(sortColumnId);
						
						 if (bulkHistoryCollection.sortDirection == -1) {
							 sortColumn.removeClass('sortable-up').addClass('sortable-down');
						 } else {
						   	sortColumn.removeClass('sortable-down').addClass('sortable-up');
						 }
						  $("#OrderMgmtResponseData").html(this.dataTemplate(context));
						 this.processDomData(bulkHistoryCollection);
					},
					resetOtherTargets : function(sortColumn){
						if(sortColumn == "userName"){
							$("#extendedFileName").removeClass("sortable-up").removeClass("sortable-down");
							$("#initialTimeStamp").removeClass("sortable-up").removeClass("sortable-down");
							$("#status").removeClass("sortable-up").removeClass("sortable-down");
						}
						else if(sortColumn == "extendedFileName"){
							$("#userName").removeClass("sortable-up").removeClass("sortable-down");
							$("#initialTimeStamp").removeClass("sortable-up").removeClass("sortable-down");
							$("#status").removeClass("sortable-up").removeClass("sortable-down");
						}
						else if(sortColumn == "initialTimeStamp"){
							$("#extendedFileName").removeClass("sortable-up").removeClass("sortable-down");
							$("#userName").removeClass("sortable-up").removeClass("sortable-down");
							$("#status").removeClass("sortable-up").removeClass("sortable-down");
						}
						else if(sortColumn == "status"){
							$("#extendedFileName").removeClass("sortable-up").removeClass("sortable-down");
							$("#initialTimeStamp").removeClass("sortable-up").removeClass("sortable-down");
							$("#userName").removeClass("sortable-up").removeClass("sortable-down");
						}
					},
					processDomData : function(bulkHistoryCollection){
						var that =this;
						bulkHistoryCollection.each(function(model){
							that.applyProcessDomData(model);
							if(model.has("subRequests")){
								model.get("subRequests").each(function(model1){
									that.applyProcessDomData(model1);
								});
								
							}
						});
					},
					applyProcessDomData : function(model){
						var id = model.get("requestId"); 
						//Assign colors to states
						if(model.get("status") == "SUCCESS" || model.get("status") == "DSA_SEARCHCOMPLETE" || model.get("status") == "SEARCH_COMPLETE"){
							$('#status'+id).css('color', 'green');
						}
						if (model.get("status") == "FAILED" || model.get("status") == "CANCELLED" || model.get("status") == "UNKNOWN" || model.get("status") == "DSA_SEARCHINCOMPLETE" ) {
							$('#status'+id).css('color', 'red');
						}
						if (model.get("status") == "EXECUTING" || model.get("status") == "NEW" || model.get("status") == "SCHEDULABLE" || model.get("status") == "SCHEDULED" ) {
							$('#status'+id).css('color', 'indigo');
						}
						if (model.get("status") == "CANCEL_PENDING" || model.get("status") == "PARTIAL_SUCCESS") {
							$('#status'+id).css('color', 'orange');
						}
						//Handle Schedulable timer
						if((model.get("status") == "SCHEDULABLE" || model.get("status") == "SCHEDULED")) {
							$('#disabledtimer'+id).hide();
							$('#scheduler'+id).show();
						}
						else{
							$('#scheduler'+id).hide();
							$('#disabledtimer'+id).show();
						}
						//Disable cancel button for following states
						if(!model.get("cancellable")){
							$('#cancel'+id).attr('disabled','disabled');
						}
						if(!model.get("hasDetails")){
							$('#details'+id).attr('disabled','disabled');
						}
						
					},
					
					renderBulkOrderResponse : function(responseMessage) {
						$(this.orderMgmtSuccessDiv).show();
						$(this.orderMgmtSuccessDiv).html("<span class='step success'><span class='icon'></span></span> "+responseMessage);
					},
					displayDetails : function(ev) {
						
						if(this.collection != undefined) {
							var id = $(ev.currentTarget).data("id");
							var subId = $(ev.currentTarget).data("sub-id")
					        var orderDetailsModel = this.collection.find(function(model) { 
					        	return model.get('requestId') == id; 
					        });
					        if(subId){
					        	orderDetailsModel = orderDetailsModel.get("subRequests").find(function(model) { 
						        	return model.get('requestId') == subId; 
						        });
					        	
					        }
					        
					        if(orderDetailsModel != undefined) {					        	
					        	if (orderDetailsModel.get('fwdAddress') != undefined){
					        		var fwdAddress = orderDetailsModel.get('fwdAddress');
					        		var fwdAddressWithoutInstance = fwdAddress.split(":")
					        		orderDetailsModel.set('fwdAddress', fwdAddressWithoutInstance[0], {silent : true});
						        }
					        }
					        
							this.$el.find("#orderDetails").html(this.detailsTemplate(orderDetailsModel.toJSON()));
						}
					},
					cancelBulkOrder : function(ev) {
						this.clearMessageDivs();
						if(this.collection != undefined) {
							var id = $(ev.currentTarget).data("id");
							var subId = $(ev.currentTarget).data("sub-id");
					        var bulkOrderModel = this.collection.find(function(model) { return model.get('requestId') == id; });
					        if(subId){
					        	bulkOrderModel = bulkOrderModel.get("subRequests").find(function(model) { 
						        	return model.get('requestId') == subId; 
						        });
					        	
					        }
					        this.orderMgmtOperationController.cancelBulkOrder(bulkOrderModel);
						 
						}
					},
					scheduleBulkOrder : function(ev){
						this.clearMessageDivs();
						if(this.collection != undefined) {
							var id = $(ev.currentTarget).data("id");
							var scheduleTime = $("#timeScheduler"+id).val();
							if (scheduleTime == "" || scheduleTime == undefined) {
								alert("Please Enter the Schedule Time");
							}
							else {
								var bulkOrderModel = this.collection.find(function(model) { return model.get('requestId') == id; });
								bulkOrderModel.set("scheduledExecutionTime", scheduleTime );
								this.orderMgmtOperationController.scheduleBulkOrder(bulkOrderModel);
							}
							
						}
					},
					clearMessageDivs: function(){
						$(this.orderMgmtErrorDiv).hide();
						$(this.orderMgmtSuccessDiv).hide();
						$(this.orderMgmtWarningDiv).hide();
					},
					showWarning: function(message){
						$(this.orderMgmtWarningDiv).show();
						$(this.orderMgmtWarningMessageDiv).html("<span class='step info'><span class='icon'></span></span> "+ message); 
					},
					displayLoading : function() {
						$("#load").fadeTo(0, 0.8);
					},
					hideLoading : function() {
						$("#load").hide();
					},
					toggleBulkRequest : function(ev){
						this.$el.find("#"+ev.currentTarget.id+"_child").toggle();					
						if(this.$el.find("#"+ev.currentTarget.id).hasClass("icon-plus-sign")){
							this.$el.find("#"+ev.currentTarget.id).removeClass("icon-plus-sign").addClass("icon-minus-sign");
						} else {
							this.$el.find("#"+ev.currentTarget.id).removeClass("icon-minus-sign").addClass("icon-plus-sign");
						}
					},
					clearExpandedOrderInfoIds : function(){
						this.idArray = [];
					},
					setExpandedOrderInfoIds : function(ids){
						this.idArray = ids;
					},
					expandIdsonRefresh : function(){
						if(this.isReload && this.idArray) {
							for(var i=0;i<this.idArray.length ; i++){
								this.$el.find("#"+this.idArray[i]+"_child").show();	
								this.$el.find("#"+this.idArray[i]).removeClass("icon-plus-sign").addClass("icon-minus-sign");
							}
						}
					}
				});
			});
