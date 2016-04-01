/*
 * ExtendedModifyRequestModel: Responsible to contain request data to be sent to the server for 'Modify' operation. 
 * Will have both read FCO and modified FCO details.
 */
define(["frameworkModels/RequestModel", "framework/js/model/ModifyRequestModel"],function(RequestModel, ModifyRequestModel){
	return RequestModel.extend({
		defaults: {
			"originalRequest": new ModifyRequestModel(),
			"modifiedRequest": new ModifyRequestModel()
		},
		setReturnResultingObject : function(value){
			this.get("originalRequest").setReturnResultingObject(value);
			this.get("modifiedRequest").setReturnResultingObject(value);
		},
		setRequestVersion : function(requestVersion){
			this.get("originalRequest").setRequestVersion(requestVersion);
			this.get("modifiedRequest").setRequestVersion(requestVersion);
		},
		setObjectClass : function(value){
			this.get("originalRequest").setObjectClass(value);
			this.get("modifiedRequest").setObjectClass(value);
		},
		setIdentifier : function(value){
			this.get("originalRequest").setIdentifier(value);
			this.get("modifiedRequest").setIdentifier(value);
		},
		setValueObjectModel: function(readFCOModel, modifiedFCOModel, type) {
			this.get("originalRequest").setValueObjectModel(readFCOModel, type);
			this.get("modifiedRequest").setValueObjectModel(modifiedFCOModel, type);
		},
		toJSON : function(){
			return  {
				"spml.extendedModifyRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});