/*
 * AddRequestModel: Responsible to contain request data to be sent to the server for 'Create' operation. 
 * 'defaults' block contains a list of default attributes that needs to be there for a create request.
 */
define(["frameworkModels/FrameworkModel", "frameworkModels/BatchableRequestModel"],function(FrameworkModel, BatchableRequestModel){
	return BatchableRequestModel.extend({
		setObject : function(fcoObject,type){
			var objectModel = new Backbone.Model({'xsi.type': 'app.'+type});
			objectModel.set(fcoObject.attributes, {silent: true});
			this.set("object", objectModel, {silent: true});
		},
		getObject : function(){
			return this.get("object");
		},
		setReturnResultingObject : function(value){
			this.set("returnResultingObject",value);
		},
		getReturnResultingObject : function(){
			return this.get("returnResultingObject");
		},
		toJSON : function(){
			return  {
				"spml.addRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});
