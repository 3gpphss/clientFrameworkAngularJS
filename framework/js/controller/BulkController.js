/*
 * BulkController :  responsible for all incoming Bulk Requests. 
 * Responsible to delegate the request to appropriate bulk operation layout manager
 * It extends from FrameworkView.
 * 		
 */
define(['frameworkViews/FrameworkView', 'text!framework/templates/bulkNavigationTemplate.html', 'ErrorHandler', 'frameworkErrors/FrameworkError', 'BulkErrorHandler', 'frameworkErrors/ServerError'], 
		function(FrameworkView, bulkNavigationTemplate, ErrorHandler, FrameworkError, BulkErrorHandler,ServerError){
	return  FrameworkView.extend({
		el: $("#bulkNavigationDiv"),
		template: _.template(bulkNavigationTemplate),
		isIdFileNameDefined: false,
		initialize: function() {
			this.bulkSearchLayout = undefined;
			this.bulkDeleteLayout = undefined;
			this.bulkModifyLayout = undefined;
		},
		events: {
			'change #bulkFcoType' : 'populateKeysAndFcoDetails',
			'click .bulkNavigationTabs' : 'changeLayout',
			'submit #fileUpload' : 'uploadIdentifierFile',
			'keyup #identifierListName': 'updateOtherIdElements'
		},
		populateKeysAndFcoDetails: function(){
			this.clearBulkStatusDiv();
			this.populateKeys();
			this.updateLayouts();
		},
		// Invokes postDisplayLauyout() funciton of affected bulk layouts
		updateLayouts: function() {
			this.populateFcoDetails();
		},
		populateFcoDetails: function(){
			// Get old FCO name and version
			var oldFcoName = this.requestContext.getBulkFcoType();
			var oldPcName = this.requestContext.getRequestVersion();
			if(this.bulkFilterLayout){
				// Cache filter for old FCO
				this.bulkFilterLayout.cacheFilterData(oldFcoName, oldPcName);
				if(this.$el.find("ul.nav-tabs > li.active").find("a").attr('id') == "bulkFilterTab"){
					this.bulkFilterLayout.postDisplayLayout(this.getBulkNavigationData());
				} else {
					// Get cached filter for new FCO
					var fcoDetails = this.getFCODetails(this.$el.find(this.bulkFcoType).val());
					var cachedFilter = this.bulkFilterLayout.getCachedFcoToFilterData(fcoDetails.fcoName, fcoDetails.requestVersion);
					this.bulkFilterLayout.setFilterToTextArea(cachedFilter);
				}
			}
			if(this.bulkSearchLayout){
				if(this.$el.find("ul.nav-tabs > li.active").find("a").attr('id') == "bulkSearchTab"){
					this.bulkSearchLayout.postDisplayLayout(this.getBulkNavigationData());
				}
			}
			if(this.bulkModifyLayout){
				// Cache modification for old FCO
				this.bulkModifyLayout.cacheModificationData(oldFcoName, oldPcName);
				if(this.$el.find("ul.nav-tabs > li.active").find("a").attr('id') == "bulkModifyTab"){
					this.bulkModifyLayout.postDisplayLayout(this.getBulkNavigationData());
				}
			}
			if(this.bulkDeleteLayout){
				if(this.$el.find("ul.nav-tabs > li.active").find("a").attr('id') == "bulkDeleteTab"){
					this.bulkDeleteLayout.postDisplayLayout(this.getBulkNavigationData());
				}
			}
		},
		getFCOData:  function() {
			this.ConfigurationManager.registerConfigHandler("renderAndPopulateSelectData", this);
		},
		renderAndPopulateSelectData: function() {
			this.render();
			this.populateFcos();
			this.populateKeys();
			this.createBulkSearchLayout();
		},
		populateFcos: function() {
			var fcos = this.ConfigurationManager.getFCOs("bulkProvisioning");
			for(var i = 0; i < fcos.length; i++) {
				var newOption = $('<option value="' + fcos[i]["dropDownValue"] + '">' + fcos[i]["dropDownKey"]
				+ '</option>');
				this.$el.find(this.bulkFcoType).append(newOption);
			}
		},
		populateKeys: function(){
			var keys = this.ConfigurationManager.getKeys($(this.bulkFcoType).val()); 
			this.$el.find(this.bulkAlias).empty();
			for ( var i = 0; i < keys.length; i++) {
				var newOption = $('<option value="' + keys[i] + '">'+ keys[i] + '</option>');
				this.$el.find(this.bulkAlias).append(newOption);
			}
		},
		appendEl: function() {
			this.$el.append(this.template());
		}, 
		getFCODetails: function(fco){
			var fcoDetails = {"fcoName": "", "fcoType":"" , "requestVersion":""};
			if(fco != undefined){
				fco = fco.split("_PC_");
				var index = fco[0].indexOf("-");
				fcoDetails.fcoName = fco[0].substring(index+1)
				fcoDetails.fcoType = fco[0].substring(0,index);
				fcoDetails.requestVersion = fco[1];
			}
			return fcoDetails;
		},
		getBulkNavigationData: function() {
			var fcoDetails = this.getFCODetails(this.$el.find(this.bulkFcoType).val());
			this.requestContext.setBulkFcoType(fcoDetails.fcoName);
			this.requestContext.setRequestVersion(fcoDetails.requestVersion);
			this.requestContext.setResultFileName(this.$el.find(this.bulkResultFileName).val().trim());
			this.requestContext.setIdentifierListText(this.$el.find(this.bulkIdentifierListName).val().trim());
			this.requestContext.setIdentifierListFilterType(this.$el.find(this.bulkFilterType).prop('checked') ? "negative" : "positive");
			this.requestContext.setSchedulable(this.$el.find(this.bulkSchedulable).prop('checked'));
			this.requestContext.setResponseFileSize(this.$el.find(this.responseFileSize).val().trim());
			this.requestContext.setIdentifierListAlias(this.$el.find(this.bulkAlias).val());
			this.requestContext.setFilter("");
			// Get filter from filter tab and pass it on to other tabs
			if(this.bulkFilterLayout) {
				var filterModel = this.bulkFilterLayout.getBulkModel();
				if(filterModel) {
					this.requestContext.setFilter(filterModel.get("filter"));
				}
			}
			return this.requestContext;
		},
		createBulkSearchLayout: function() {
			this.requestContext.setOperationType("BulkSearch");
			if(!this.bulkSearchLayout) {
				this.bulkSearchLayout = this.LayoutFactory.getLayout(this.requestContext.getOperationType(), "bulkProvisioning");
				this.bulkSearchLayout.displayLayout(this.getBulkNavigationData());
			} else {
				this.bulkSearchLayout.postDisplayLayout(this.getBulkNavigationData());
			}
		},
		createBulkDeleteLayout: function() {
			this.requestContext.setOperationType("BulkDelete");
			if(!this.bulkDeleteLayout) {
				this.bulkDeleteLayout = this.LayoutFactory.getLayout(this.requestContext.getOperationType(), "bulkProvisioning");
				this.bulkDeleteLayout.displayLayout(this.getBulkNavigationData());
			} else {
				this.bulkDeleteLayout.postDisplayLayout(this.getBulkNavigationData());
			} 
		},
		createBulkFilterLayout: function(){
			this.requestContext.setOperationType("BulkFilter");
			if(!this.bulkFilterLayout) {
				this.bulkFilterLayout = this.LayoutFactory.getLayout(this.requestContext.getOperationType(), "bulkProvisioning");
				this.bulkFilterLayout.displayLayout(this.getBulkNavigationData());
			} else {
				this.bulkFilterLayout.postDisplayLayout(this.getBulkNavigationData());
			}
		},
		createBulkModifyLayout: function() {
			this.requestContext.setOperationType("BulkModify");
			if(!this.bulkModifyLayout) {
				this.bulkModifyLayout = this.LayoutFactory.getLayout(this.requestContext.getOperationType(), "bulkProvisioning");
				this.bulkModifyLayout.displayLayout(this.getBulkNavigationData());
			} else {
				this.bulkModifyLayout.postDisplayLayout(this.getBulkNavigationData());
			}
		},
		changeLayout: function(ev) {
			try{
				if(ev.currentTarget.id == "bulkSearchTab") {
					this.createBulkSearchLayout();
				} else if(ev.currentTarget.id == "bulkDeleteTab") {
					this.createBulkDeleteLayout();
				} else if(ev.currentTarget.id == "bulkFilterTab") {
					this.createBulkFilterLayout();
				} else if(ev.currentTarget.id == "bulkModifyTab") {
					this.createBulkModifyLayout();
				}
			} catch(error) {
				BulkErrorHandler(error);
			}
		},
		uploadIdentifierFile: function(ev){
			this.$el.find("#cancelUpload").click();
			ev.preventDefault(); //Prevent Default action.
			this.clearBulkStatusDiv();
			if(this.$el.find("#myFile")[0].files[0] == undefined){
				alert("No File is selected to upload");
				return ;
			} else {
				if(this.$el.find("#myFile")[0].files[0].size/this.ConfigurationManager.getUploadFileSize()  > 1){
					alert("Max File size is : " + this.ConfigurationManager.getUploadFileSize()/1048576 + " MB");
					return ;
				}
			}
			var fd = new FormData(ev.target);  
			this.DAO.uploadIdentifierFile(fd,'successUploadFile','errorUploadFile',this);
		},
		successUploadFile: function(responseModel){
			if(responseModel.get('idFileTransferResponse').get('errorCode') !== undefined) {
				var errorObject = new ServerError(responseModel.get('idFileTransferResponse').get('errorCode'),
						responseModel.get('idFileTransferResponse').get('errorMessage'));
				errorObject.setErrorHint(responseModel.get('idFileTransferResponse').get('errorHint'));
				errorObject.setErrorRecomendation(responseModel.get('idFileTransferResponse').get('errorRecomendation'));
				BulkErrorHandler(errorObject);
			} else {
//				this.$el.find(this.bulkIdentifierListName).val($("[name='myFile']").val());
				this.$el.find(this.bulkIdentifierListName).val(responseModel.get("idFileTransferResponse").get("fileName"));
				this.$el.find("[name='myFile']").val('');
				this.displayMessage(responseModel.get("idFileTransferResponse").get("acknowledgementMessage"))
			}
		},
		errorUploadFile: function(error){
			BulkErrorHandler(error);
			this.$el.find("[name='myFile']").val('');
		},
		resetNavigationData: function() {
			this.$el.find("#resultFileName").val("");
		},
		clearBulkStatusDiv: function() {
			$("#bulkSuccessDiv").html("");
			$("#bulkWarningDiv").html("");
			$("#bulkErrorDiv").hide();
		},
		displayMessage: function(message){
			$("#bulkSuccessDiv").html(message);
		},
		updateOtherIdElements: function(ev) {
			if(!ev.currentTarget.value) {
				$("#alias").prop("disabled", true);
				$("#filterType").prop("disabled", true);
				$("#alias").prop("title", "Enter an identitifer file name");
				this.isIdFileNameDefined = false;
			} else {
				if(!this.isIdFileNameDefined){
					$("#alias").prop( "disabled", false);
					$("#filterType").prop( "disabled", false);
					$("#alias").prop("title", "");
					this.isIdFileNameDefined = true;
				}
			} 
		}
	});
});