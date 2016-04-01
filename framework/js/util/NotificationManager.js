define(function() {
	return {
		nsrDeleteSuccess : function(responseModel){
			if(responseModel.get('deleteResponse').get('errorCode') !== undefined) {
				this.notifyFailure(responseModel.get('deleteResponse').get('errorMessage'));
			} else {
				this.fcoModel = responseModel.get("deleteResponse").get("resultingObject");
				this.notifySuccess(this.fcoModel.get("identifier")+" is deleted successfully");
			}
		},
		nsrDeleteFailure: function(responseModel) {
			this.notifyFailure(responseModel.statusText);
		},
		notifySuccess : function(msg){
			  $.pnotify({
				  	title : "Success",
			        text: msg,
			        type: "success"
			       });
		},
		notifyFailure : function(msg){
			  $.pnotify({
			        text: msg,
			        icon: "icon-warning-sign",
			        type: "error"
			       });
		},
		notifyInfo : function(){
			$.pnotify({
		        text: msg,
		        icon: "icon-warning-sign",
		        type: "warning"
		       });
		}
	}
});	