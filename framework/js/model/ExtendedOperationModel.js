/*
 * ExtendedOperationModel: Responsible to contain request data to be sent to the server for 'extended' operation. 
 * 'defaults' block contains a list of default attributes that needs to be there for a create request.
 */
define(["frameworkModels/FrameworkModel", "frameworkModels/BatchableRequestModel"],function(FrameworkModel, BatchableRequestModel){
	return BatchableRequestModel.extend({
		setOperation : function(type){
			var objectModel = new Backbone.Model({'xsi.type': 'app.'+type ,"type":"canMSUB"});
			this.set("operation", objectModel, {silent: true});
		},
		getOperation : function(){
			return this.get("operation");
		},
		toJSON : function(){
			return  {
				"spml.extendedRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});
