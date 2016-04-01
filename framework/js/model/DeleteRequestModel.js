/*
 * DeleteRequestModel: Responsible to contain request data to be sent to the server for 'Delete' operation. 
 * 'defaults' block contains a list of default attributes that needs to be there for a delete request.
 */
define(["frameworkModels/BatchableRequestModel"],function(BatchableRequestModel){
	return BatchableRequestModel.extend({
		setObjectclass : function(value){
			this.set("objectclass",value);
		},
		getObjectclass : function(){
			return this.get("objectclass");
		},
		setIdentifier : function(value){
			this.set("identifier",value);
		},
		getIdentifier : function(){
			return this.get("identifier");
		},
		setReturnResultingObject : function(value){
			this.set("returnResultingObject",value);
		},
		getReturnResultingObject : function(){
			return this.get("returnResultingObject");
		},
		toJSON : function(){
			return  {
					"spml.deleteRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});
