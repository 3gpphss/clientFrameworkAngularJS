/*
 * ModifyRequestModel: Responsible to contain request data to be sent to the server for 'Modify' operation. 
 * 'defaults' block contains a list of default attributes that needs to be there for a Modify request.
 */
define(["frameworkModels/FrameworkModel", "frameworkModels/BatchableRequestModel"],function(FrameworkModel, BatchableRequestModel){
	return BatchableRequestModel.extend({
		setObjectClass : function(value){
			this.set("objectclass",value);
		},
		getObjectClass : function(){
			return this.get("objectclass");
		},

		setModification : function(valueObjectModel){
			var modificationModel = new Backbone.Model({'operation': 'addorset'});
			modificationModel.set("valueObject", valueObjectModel.attributes, {silent: true});
			this.set("modification", []);
			this.get("modification").push(modificationModel);
		},
		addRemoveOperation : function(attrName) {
			var modificationRemModel = new Backbone.Model({'operation': 'remove'});
			var find = '\\.';
			var regEx = new RegExp(find, 'g');
			modificationRemModel.set('name', attrName.replace(regEx, '/'), {silent: true});
			this.get("modification").push(modificationRemModel);
		},
		getvalueObjectModel : function(){
			return this.get("object");
		},	
		setValueObjectModel : function(fcoObject,type){
			var valueObjectModel = new Backbone.Model({'xsi.type': 'app.'+type});
			valueObjectModel.set(fcoObject.attributes, {silent: true});
			this.setModification(valueObjectModel);
		},
		getvalueObjectModel : function(){
			return this.get("object");
		},
		setIdentifier : function(value){
			this.set("identifier",value);
		},
		getIdentifier : function(){
			return this.get("identifier");
		},
		getModification : function(){
			return this.get("modification");
		},
		setReturnResultingObject : function(value){
			this.set("returnResultingObject",value);
		},
		getReturnResultingObject : function(){
			return this.get("returnResultingObject");
		},
		toJSON : function(){
			return  {
				"spml.modifyRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});