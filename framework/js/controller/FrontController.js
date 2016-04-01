/*
 * Frontcontroller :  responsible for all incoming Browser Request. 
 * Responsible to delegate the request to operation controller
 * controls dom elements of navigation bar
 * It extends from FrameworkView.
 * 		
 * 'FrameworkView': is the base backbone view for all framework views. 'frameworkViews' is an alias whose 
 *  path is defined in require-config.js file.
 *  'ProvisioningModel': is the Backbone Model which is injected through wire holds navigation data. 'frameworkModels' is an alias whose path is defined in require-config.js file.
 *  'text!framework/templates/navigationTemplate.html': is the html view template for navigation bar.
 */
define(['frameworkViews/FrameworkView', 'text!framework/templates/navigationTemplate.html', 'ErrorHandler','frameworkErrors/FrameworkError'], function(FrameworkView, navigationTemplate, ErrorHandler,FrameworkError){
	return  FrameworkView.extend({
		template: _.template(navigationTemplate),
		isDefaultSet : false, 
		events: {
			'click .submit': 'onSubmit',
			'change #fcoType' : 'populateKeysAndViews',
			'click #create': 'onCreate',
			'click #SearchAll': 'SearchAll',
			'change #fcoTypeForCreate' : 'populateViewsforCreate',
			'click #ChangeId': 'onChangeId',
			'click #extendedOperationSubmit' : 'onExtendedOperation',
			'click #SearchAllButton' : 'populateDataForSearchAll',
			'click #createDropdown'  : 'populateDataForCreate'
		},
		populateDataForCreate : function(){
			this.$el.find("#fcoTypeForCreate").val(this.$el.find("#fcoType").val());
		},
		populateDataForSearchAll : function(){
			this.$el.find("#fcoTypeForSearchAll").val(this.$el.find("#fcoType").val());
		},
		populateKeys : function(){
			var keys = this.ConfigurationManager.getKeys($(this.fcoType).val()); // TODO : Hardcoded for Search Operation to Work
			this.appendSelect("uniqueId");
			for ( var i = 0; i < keys.length; i++) {
				var newOption = $('<option value="' + keys[i] + '">'+ keys[i] + '</option>');
				$(this.uniqueId).append(newOption);
			}	
				// Clear the value field upon FCO change
				var uniqueIdValue = $.trim( $('#uniqueIdValue').val() );
				if (uniqueIdValue.length) {	
					$("#uniqueIdValue").val("");
				}	// End of changes
		},
		populateKeysAndViews : function(){
			this.populateKeys();
			this.populateViews();
		//	this.enableSearchAll();
		},
		initialize : function(attrs) {
			this.$el = $(attrs.div);
		},
		getConfigData : function() {
			this.ConfigurationManager.registerConfigHandler("afterFecthingConfigData", this);
		},
		afterFecthingConfigData : function(){
			this.render();
			this.populateFcos();
			this.populateFcosforCreate();
			this.populateFcosforSearchAll();
			this.populateFcosforChangeId();
			this.populateExtendedOperations();
			this.toggleViews();
		},
		populateFcos : function() {
			var fcos = this.ConfigurationManager.getFCOs("singleProvisioning");
			for ( var i = 0; i < fcos.length; i++) {
				var newOption = $('<option value="' + fcos[i]["dropDownValue"] + '">' + fcos[i]["dropDownKey"]
				+ '</option>');
				$(this.fcoType).append(newOption);
			}
			this.populateKeysAndViews();
		},
		populateViews : function() {
			var backboneViews = this.ConfigurationManager.getViewTypes($(this.fcoType).val(), 'Search'); // TODO : Hardcoded for Search Operation to Work
			this.appendSelect("viewType");
			for ( var i = 0; i < backboneViews.length; i++) {
				var newOption = $('<option value="' + backboneViews[i] + '">'+ backboneViews[i] + '</option>');
				$(this.viewType).append(newOption);
			}
			if(!this.isDefaultSet){
				this.setDefaultValuesInModel();
			}
		},
		appendSelect : function(dropDownId) {
			$('#' + dropDownId).empty();
		},
		onSubmit: function(ev) {
			this.setDataInModel(ev.currentTarget.value,$("#fcoType").val(),undefined);
			this.clearErrorDiv();// TODO: This has to be removed after deciding on clearDiv
			this.processRequest(true,null,false,undefined);
		},
		SearchAll: function(ev) {
			this.setDataInModel(ev.currentTarget.value,$("#fcoTypeForSearchAll").val(),undefined);
			this.clearErrorDiv();// TODO: This has to be removed after deciding on clearDiv
			this.processRequest(true,null,false,undefined);
		},
		clearErrorDiv: function() {
			$(this.errorDiv).hide();
		},
		clearAllMessageDivs: function() {
			this.clearErrorDiv();
			$("#successDiv").html('');
			$("#warningDiv").html('');
		},
		createLayout : function(requestContext) {
			this.removeLayout();
			this.layout = this.LayoutFactory.getLayout(requestContext.get("operationType"), "singleProvisioning");
		},
		resetRequestContext : function(){
			this.requestContext.clear();
			this.setDataInRequestContext();
		},
		setDataInRequestContext : function(){
			this.requestContext.set(this.model.toJSON());
			var fco = this.model.get("fcoType");
			var extendedOperation = this.model.get("extendedOperationName");
			if(extendedOperation != undefined && extendedOperation!=''){
				var tempExOp = extendedOperation.split("_PC_");
				this.requestContext.setExtendedOperationType(extendedOperation);
				this.requestContext.setExtendedOperationName(tempExOp[0]);
				this.requestContext.setRequestVersion(tempExOp[1]);
				this.model.unset("extendedOperationName");
			}else{
				var fcoDetails = this.getFCODetails(fco);
				this.requestContext.setConfigFCO(fco);
				this.requestContext.setRequestFcoType(fcoDetails.fcoType);
				this.requestContext.setFcoType(fcoDetails.fcoName);
				$("#fcoAccordin").text(fcoDetails.fcoName);// Setting this value to get the value in accordin div
				this.requestContext.setRequestVersion(fcoDetails.requestVersion);
			}
		},
		removeLayout : function(){
			if (this.layout != undefined) {
				this.clearAllMessageDivs();
				this.layout.close();
				this.layout = undefined;
			}
		},
		setDefaultValuesInModel : function(){
			this.model.set("fcoType",$(this.fcoType).val());
			this.model.set("viewType",$(this.viewType).val());
			this.model.set("uniqueId",$(this.uniqueId).val());
			this.isDefaultSet = true;
		},
		changeLayout : function(serverModel, message, operation,disableOperations,requestContext){
				requestContext.setOperationType(operation);
				this.processRequest(false,serverModel,disableOperations,requestContext);
				this.displayMessage(message);
		},
		processRequest : function(isServerCall,serverModel,disableOperations,requestContext){
			try{
				if(!requestContext) {
					this.resetRequestContext();
					requestContext = this.requestContext;
				}
				this.createLayout(requestContext);
				if(isServerCall){
					this.layout.processRequest(requestContext);
				}else{
					this.layout.processRequestOnLayoutChange(serverModel,requestContext,disableOperations);
				}
			} catch(err){
				ErrorHandler(new FrameworkError('UNEXPECTED_ERROR', [err.message]));
			}
		},
		// For Create operation we added the function below
		onCreate: function(evt) {
			this.setDataInModel(evt.target.value,$("#fcoTypeForCreate").val(),undefined);
			this.clearErrorDiv(); // TODO: This has to be removed after deciding on clearDiv 
			this.processRequest(true,null,false,undefined);
		},
		populateViewsforCreate : function() {
			var backboneViews = this.ConfigurationManager.getViewTypes($("#fcoTypeForCreate").val(), 'Create'); // TODO : Hardcoded for Search Operation to Work
			for ( var i = 0; i < backboneViews.length; i++) {
				var newOption = $('<option value="' + backboneViews[i] + '">'+ backboneViews[i] + '</option>');
				$("#viewTypeforCreate").append(newOption);
			}
			if(!this.isDefaultSet){
				this.setDefaultValuesInModel();
			}
		},
		populateFcosforCreate : function() {
			var fcos = this.ConfigurationManager.getFCOsByOperation("Create","singleProvisioning");
			for ( var i = 0; i < fcos.length; i++) {
				var newOption = $('<option value="' + fcos[i]["dropDownValue"] + '">' + fcos[i]["dropDownKey"]
				+ '</option>');
				$("#fcoTypeForCreate").append(newOption);
			}
			this.populateViewsforCreate();
		},
	/*	populateViewsforSearchAll : function() {
			var backboneViews = this.ConfigurationManager.getViewTypes($("#fcoTypeForSearchAll").val(), 'SearchAll'); 
			for ( var i = 0; i < backboneViews.length; i++) {
				var newOption = $('<option value="' + backboneViews[i] + '">'+ backboneViews[i] + '</option>');
				this.$el.find("#viewTypeforSearchAll").append(newOption);
			}
		},*/
		populateFcosforSearchAll : function() {
			var fcos = this.ConfigurationManager.getFCOsByOperation("SearchAll","singleProvisioning");
			for ( var i = 0; i < fcos.length; i++) {
				var newOption = $('<option value="' + fcos[i]["dropDownValue"] + '">' + fcos[i]["dropDownKey"]
				+ '</option>');
				this.$el.find("#fcoTypeForSearchAll").append(newOption);
			}
			
//			this.populateViewsforSearchAll();		
		},
		appendEl: function() {
			$(this.searchNavigationDiv).append(this.template(this.model.toJSON()));
  		},
		// End of Create Function
	/*	enableSearchAll : function(){
			if(this.isNSRFCO()){
				$("#SearchAll").show();
			}else{
				$("#SearchAll").hide();
			}
		},
		isNSRFCO : function(){
			var fco = $("#fcoType").val();
			var fcoDetails = this.getFCODetails(fco);
			var type = "";
			if(fco != undefined){
//				var fcoName = fcoDetails.fcoName;
				if(this.checkOperationAvailable(fco,"SearchAll")){
					type = fcoDetails.fcoType;
				}
			}
			if(type === 'NSR'){
				return true;
			}else {
				return false;
			}
		},
		checkOperationAvailable : function(fcoName,operationName){
			return this.ConfigurationManager.checkOperationAvailable(fcoName,operationName);
		},*/
		getFCODetails : function(fco){
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
		populateFcosforChangeId : function() {
			var fcos = this.ConfigurationManager.getFCOsByOperation("ChangeId","singleProvisioning");
			for ( var i = 0; i < fcos.length; i++) {
				var newOption = $('<option value="' + fcos[i]["dropDownValue"] + '">' + fcos[i]["dropDownKey"]
				+ '</option>');
				$("#fcoTypeForChangeId").append(newOption);
			}
		},
		onChangeId : function(evt) {
			this.setDataInModel(evt.target.value,$("#fcoTypeForChangeId").val(),undefined);
			this.clearErrorDiv(); // TODO: This has to be removed after deciding on clearDiv 
			this.processRequest(true,null,false,undefined);
		},
		populateExtendedOperations : function() {
			var operations = this.ConfigurationManager.getFCOsByOperation("extendedOperation","singleProvisioning");
			for ( var i = 0; i < operations.length; i++) {
				var newOption = $('<option value="' + operations[i]["dropDownValue"] + '">' + operations[i]["dropDownKey"]
				+ '</option>');
				$("#extendedOperation").append(newOption);
			}
		},
		onExtendedOperation : function(){
			this.setDataInModel("ExtendedOperation",undefined,$("#extendedOperation").val());
			this.clearErrorDiv(); // TODO: This has to be removed after deciding on clearDiv 
			this.processRequest(true,null,false,undefined);
		},
		setDataInModel : function(operationName,fcoDropdownValue,extendedOperationName){
			this.clearModelData();
			this.model.set("operationType",operationName);
			if(operationName == 'SearchAll'){
				this.model.set("uniqueId","identifier");
			}else{
				this.model.set("uniqueId",$("#uniqueId").val());
			}
			
			this.model.set("uniqueIdValue",$("#uniqueIdValue").val());
			this.model.set("viewType",$("#viewType").val());
			this.model.set("fcoType",fcoDropdownValue);
			this.model.set("extendedOperationName",extendedOperationName);
		},
		clearModelData : function(){
			this.model.clear();
		},
		displayMessage : function(message){
			$("#successDiv").html(message);
		},
		toggleViews : function(){
			if(!this.ConfigurationManager.isCustomViewsAvailable()){
				//this.$el.find("#viewType").hide();
			}
		}
	});
});