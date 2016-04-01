/*
 * SearchAllLayoutManager: Responsible for Search layout design and framework events.
 * 
 */
define(['OperationLayoutManager', 'text!framework/templates/fcoSearchAllTemplate.html'],
		function(OperationLayoutManager, searchAllTemplate){
	return OperationLayoutManager.extend({
		template: _.template(searchAllTemplate),
		hideDiv : false,
		rendered : false,
		isSearch : false,
		isEdit  : false,
		isDelete : false,
		events: {
			'click .fcoIdentifier'	: 'onFcoSearch',
			'click #editMode'	: 'onFcoEdit',
			'click #deleteMode' : 'onFcoDelete',
			'click #update': 'onFcoUpdate',
			'click #cancelUpdate': 'onFcoCancelUpdate',
			'click #confirm' : 'onConfirm',
			'click #cancel' : 'onCancel'
		},
		changeLayout : function(serverModel, message, operation,disableOperations,requestContext){
			this.requestContext = requestContext;
			this.fcoControllerProcessRequest(operation,serverModel);
			this.displayMessage(message);
		},
		fcoControllerProcessRequest : function(operation,serverModel){
			this.requestContext.setOperationType(operation);
			this.fcoController = this.getViewController(this.requestContext.getOperationType());
			this.isSearch=false; this.isEdit=false;this.isDelete=false;
			if(operation == "Search"){
				this.isSearch=true;
				this.fcoController.processRequest(this.requestContext);
			}else{
				if(operation == "Delete"){
					this.isDelete=true;
				}else{
					this.isEdit=true;
				}
				this.fcoController.processRequestOnControllerChange(serverModel,this.requestContext);
			}
		},
		onFcoSearch : function(ev){
			this.requestContext.setUniqueIdValue(ev.currentTarget.firstChild.data);
			this.fcoControllerProcessRequest("Search",undefined);
		},
		onFcoDelete : function(){
			this.fcoController.onDelete();
		},
		onFcoEdit :function(){
			this.fcoController.onEdit();
		},
		onFcoUpdate : function() {
			//if(this.validateFormSubmit("#childDiv")){
				this.fcoController.onUpdate();	
			//}
		},
		onFcoCancelUpdate: function() {
			this.fcoController.onCancelUpdate();
		},
		onConfirm : function(){
			this.fcoController.onConfirm();
			this.$el.find("#deleteModeDiv").hide();
		},
		onCancel : function(){
			this.fcoController.onCancel();
		},
		renderViews : function(view){
			if(this.rendered==false){
				this.$el.html(this.template());
				this.setView("#fcoList",view);
				this.$el.show();
				this.rendered = true;
			}else{
				this.setView("#childDiv",view);
				if(!this.isDelete){
					this.$el.find("#childDiv").addClass("guiBox");
				}
			}
			//this.registerValidations("#childDiv");
			this.displayOperationButtons();
			this.displayModificationAfterRender();
		},
		displayOperationButtons : function(){
			if(this.isEdit){
				this.$el.find("#searchMode").hide();
				this.$el.find("#updateMode").show();
				this.$el.find("#deleteModeDiv").hide();
			}else if(this.isSearch){
				this.$el.find("#childDiv").find('select, :input').attr('disabled', true);
				this.$el.find("#updateMode").hide();
				this.$el.find("#searchMode").show();
				this.$el.find("#deleteModeDiv").hide();
				if(!this.fcoController.editOperationAvailable){
					this.$el.find("#editMode").hide();
				}
				if(!this.fcoController.deleteOperationAvailable){
					this.$el.find("#deleteMode").hide();
				}else{
					this.$el.find("#childDiv").removeClass("guiBox");
				}
			}else if(this.isDelete){
				this.$el.find("#searchMode").hide();
				this.$el.find("#updateMode").hide();
				this.$el.find("#deleteModeDiv").show();
				this.fcoController.$el = $("#childDiv");
				this.fcoController.el = $("#childDiv");
			}
		},
		displayMessage : function(message){
			this.frontController.clearAllMessageDivs();
			this.frontController.displayMessage(message);
		},
	});
});