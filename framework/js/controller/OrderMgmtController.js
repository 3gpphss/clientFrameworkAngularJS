/*
 * OrderMgmtController :  Responsible to manage the Bulk orders(Show all orders, cancel and schedule the orders).
 * Responsible to delegate the request to appropriate OrderMgmt operation layout manager
 * It extends from FrameworkView.
 * 		
 */
define(['frameworkViews/FrameworkView', 'frameworkModels/FrameworkModel', 'text!framework/templates/orderMgmtTemplate.html'], 
		function(FrameworkView, FrameworkModel, orderMgmtTemplate){
	return  FrameworkView.extend({
		el: $("#orderMgmtDiv"),
		template: _.template(orderMgmtTemplate), 
		timer : undefined,
		initialize: function() {
			this.model = new FrameworkModel();
			this.model.set("NEW", "NEW", {silent : true});
			this.model.set("EXECUTING", "EXECUTING", {silent : true});
			this.model.set("SUCCESS", "SUCCESS", {silent : true});
			this.model.set("FAILED", "FAILED", {silent : true});
			this.model.set("CANCELLED", "CANCELLED", {silent : true});
			this.model.set("PARTIAL_SUCCESS", "PARTIAL SUCCESS", {silent : true});
			this.model.set("CANCEL_PENDING", "CANCEL PENDING", {silent : true});
			this.model.set("SCHEDULED", "SCHEDULED", {silent : true});
			this.model.set("SCHEDULABLE", "SCHEDULABLE", {silent : true});
			this.model.set("UNKNOWN", "UNKNOWN", {silent : true});
			this.model.set("ALL", "ALL", {silent : true});
			this.model.set("DSA_SEARCHCOMPLETE", "DSA SEARCH COMPLETE", {silent : true});
			this.model.set("DSA_SEARCHINCOMPLETE", "DSA SEARCH INCOMPLETE", {silent : true});
			this.model.set("SEARCH_COMPLETE", "SEARCH COMPLETE", {silent : true});
			this.renderOrderMgmt();
		},
		
		events: {
				'change #orderMgmtFilterDiv' : 'getBulkHistory',
				'change #reloadBulkOrders' : 'reloadBulkOrders'
		},
		reloadBulkOrders : function(){
			 this.orderMgmtLayout.clearMessageDivs();
			 
			 if ($(this.reloadBulkOrders).is(':checked')) {
				var message = "Auto Reload is active. All operations will be disabled till Auto Reload become inactive.";
				this.orderMgmtLayout.showWarning(message);
				
				this.orderMgmtLayout.clearExpandedOrderInfoIds();
				var idArray = [];
				this.orderMgmtLayout.$el.find(".icon-minus-sign").each(function () {
				    idArray.push(this.id);
				});
				this.orderMgmtLayout.setExpandedOrderInfoIds(idArray);
				
				that = this;
				this.timer = setInterval(function(){
					if ($("ul.nav-tabs > li.active").find("a").attr('id') == "orderMgmtTab") {
						that.getBulkHistory(); 
					}
				}, that.refreshInterval);
				
				
				
			 }else{
				// clearing the old interval trigger.
				if(this.timer){
					clearInterval(this.timer);
				}	
			 }
			
			 this.getBulkHistory();
		},
		renderOrderMgmt: function(){
			this.render();
		},
		getConfigData : function() {
			this.ConfigurationManager.registerConfigHandler("setOrderMgmtConfigData", this);
		},
		setOrderMgmtConfigData : function() {
			this.refreshInterval = this.ConfigurationManager.getOrderMgmtRefreshInterval();
			if (this.refreshInterval == undefined || this.refreshInterval <=0 ) {
				this.refreshInterval = 5000;
			}
			else {
				this.refreshInterval = this.refreshInterval*1000;
			}
			
		},
		getBulkHistory : function(){
			 if (!$(this.reloadBulkOrders).is(':checked')) {
				 this.orderMgmtLayout.clearMessageDivs();
			 }
			
			if(this.orderMgmtLayout){
				this.orderMgmtLayout.searchBulkHistory(this.$el.find(this.orderMgmtFilterDiv).val());
			}
		}
	});
});