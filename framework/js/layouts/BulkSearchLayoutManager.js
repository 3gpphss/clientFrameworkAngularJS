/*
 * BulkSearchLayoutManager: Responsible for Bulk Search layout design and delegate request to controller.
 * 
 */
define([ 'BulkOperationLayoutManager', 'text!framework/templates/bulkSearchTemplate.html'], 
		function(BulkOperationLayoutManager, bulkSearchTemplate) {
	return BulkOperationLayoutManager.extend({
		template : _.template(bulkSearchTemplate),
		filterTextArea: "#bulkSearchFilter",
		initialize : function() {
			this.$el = $("#bulkSearchDiv");
		},
		events : {
			'click #submitBulkSearch' : 'onSubmitSearch',
			"click #assignBtn" : "assignData",
			"click #unAssignBtn" : "unAssignData",
			"click .assignDataElement" : "setSelectedAvailableData", 
			"click .unAssignDataElement" : "setSelectedAssignedData"
		},
		postDisplayLayout : function(requestContext) {
			this.$el.find(this.filterTextArea).val(requestContext.getFilter());
			this.populateFcoDetails(requestContext);
		},
		populateFcoDetails : function(requestContext){
			this.getFcoDetails(requestContext);
		},
		getFcoDetails: function(requestContext) {
			this.controller.getFcoDetails(requestContext);
		},
		populateFirstLevlAttr: function(fcoData) {
			this.fcoData = fcoData;
			this.clearFlatDataDropdown();
			this.populateFlatDataDropdown();
		},
		clearFlatDataDropdown : function(){
			this.$el.find("#selectAttributeDiv").html("");
			this.$el.find("#returnAttributeDiv").html("");
		},
		populateFlatDataDropdown : function(){
			var that = this;
			if(this.fcoData) {
				this.fcoData.get("attributes").each(function(attribute) {
					if(attribute.get("uniqueName") == 'identifier'){
						that.$el.find("#returnAttributeDiv").append("<li><a data-toggle='tab' class='unAssignDataElement' id='return"+ attribute.get("uniqueName")+"' value='"+ attribute.get("uniqueName")+"'>" + attribute.get("displayName") + "</a></li>");
					}else{
						that.$el.find("#selectAttributeDiv").append("<li><a data-toggle='tab' class='assignDataElement' id=return'"+ attribute.get("uniqueName")+"' value='"+ attribute.get("uniqueName")+"'>" + attribute.get("displayName") + "</a></li>");
					}
				});
				if(this.fcoData.get("secondClassObjects")){
					this.fcoData.get("secondClassObjects").each(function(childSco) {
						that.$el.find("#selectAttributeDiv").append("<li><a data-toggle='tab' class='assignDataElement' id=return'"+ childSco.get("uniqueName")+"' value='"+ childSco.get("uniqueName")+"'>" + childSco.get("displayName") + "</a></li>");
					});
				}
				this.$el.find("#assignBtn").removeAttr("disabled");
				this.$el.find("#unAssignBtn").removeAttr("disabled");
			}
		},
		setSelectedAvailableData: function(ev) {
			this.selectedAvailableData = ev.currentTarget.parentNode; 
		},
		setSelectedAssignedData: function(ev) {
			this.selectedAssignedData = ev.currentTarget.parentNode;
		},
		assignData: function() {
			if(this.selectedAvailableData) {
				$(this.selectedAvailableData).removeClass().find('a').removeClass().addClass('unAssignDataElement');
				this.$el.find("#returnAttributeDiv").append(this.selectedAvailableData);
				this.selectedAvailableData = undefined;
				
				if(this.$el.find("#selectAttributeDiv").find("a").length == 0){
					this.$el.find("#assignBtn").attr("disabled","disabled");
				} else {
					this.$el.find("#assignBtn").removeAttr("disabled");
				}
				this.$el.find("#unAssignBtn").removeAttr("disabled");
			} else {
				alert("Please select an attribute");
			}
		},
		unAssignData: function() {
			if(this.selectedAssignedData) {
				$(this.selectedAssignedData).removeClass().find('a').removeClass().addClass('assignDataElement');
				this.$el.find("#selectAttributeDiv").append(this.selectedAssignedData);
				this.selectedAssignedData = undefined;
				if(this.$el.find("#returnAttributeDiv").find("a").length == 0){
					this.$el.find("#unAssignBtn").attr("disabled","disabled");
					alert("Note that the response will include all the attributes!");
				} else {
					this.$el.find("#unAssignBtn").removeAttr("disabled");
				}
				this.$el.find("#assignBtn").removeAttr("disabled");
			} else {
				alert("Please select an return attribute");
			}
		},
		getLayoutData : function(){
			var data = {"filter" : undefined , "returnAttributes":[] };
			if(this.$el.find("#bulkSearchFilter").val() != undefined) {
				data.filter= this.$el.find("#bulkSearchFilter").val().trim();
			}
			var returnAttr = [];
			this.$el.find("#returnAttributeDiv").find("a").each(function(){
				returnAttr[returnAttr.length] = $(this).attr("value");
			});
			data.returnAttributes = returnAttr;
			return data;
		},
		onSubmitSearch : function() {
			this.clearBulkStatusDiv();
			this.controller.onSubmitSearch(this.getBulkNavigationData());
		}
	});
});
