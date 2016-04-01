/*
 * ChangeIdRequestModel: Responsible to contain request data to be sent to the server for 'ChangeId' operation. 
 */
define(["frameworkModels/FrameworkModel", "frameworkModels/BatchableRequestModel"],function(FrameworkModel, BatchableRequestModel){
	return BatchableRequestModel.extend({
		setReturnResultingObject : function(value){
			this.set("returnResultingObject",value);
		},
		getReturnResultingObject : function(){
			return this.get("returnResultingObject");
		},
		setChangeIdProceeding : function(value){
			this.set("changeIdProceeding",value);
		},
		getChangeIdProceeding : function(){
			return this.get("changeIdProceeding");
		},
		setOldId : function(value){
			/*if(this.get("oldId")){*/
			this.getOldIdObject().set("value",value);
			/*}else{
				this.set("oldId.value",value);
			}*/
		},
		getOldId : function(){
			return this.get("oldId.value");
		},
		setNewId : function(value){
//			if(this.get("newId")){
				this.getNewIdObject().set("value",value);
			/*}else{
				this.set("newId.value",value);
			}*/
		},
		getNewId : function(){
			return this.get("newId.value");
		},
		setObjectclass : function(value){
			this.set("objectclass",value);
		},
		getObjectclass : function(){
			return this.get("objectclass");
		},
		setNewIdAlias : function(value){
//			if(this.get("newId")){
			this.getNewIdObject().set("alias",value);
			/*}else{
				this.set("newId.alias",value);
			}*/
		},
		getNewIdAlias : function(){
			return this.get("newId.alias");
		},
		setOldIdAlias : function(value){
//			if(this.get("oldId")){
			this.getOldIdObject().set("alias",value);
			/*}else{
				this.set("oldId.alias",value);
			}*/
		},
		getOldIdAlias : function(){
			return this.get("oldId.alias");
		},
		setNewIdType : function(type){
			/*var objectModel = new Backbone.Model({'xsi.type': "subscriber:"+type});
			this.set("newId", objectModel, {silent: true});*/
			this.getNewIdObject().set('xsi.type', "subscriber:"+type);
		},
		setOldIdType : function(type){
			/*var objectModel = new Backbone.Model({'xsi.type': "subscriber:"+type});
			this.set("oldId", objectModel, {silent: true});*/
			this.getOldIdObject().set('xsi.type', "subscriber:"+type);
		},
		getOldIdObject : function(){
			if(this.get("oldId") == undefined){
				var objectModel = new Backbone.Model();
				this.set("oldId", objectModel, {silent: true});
			}
			return this.get("oldId");
		},
		getNewIdObject : function(){
			if(this.get("newId") == undefined){
				var objectModel = new Backbone.Model();
				this.set("newId", objectModel, {silent: true});
			}
			return this.get("newId");
		},
		toJSON : function(){
			return  {
				"spml.changeIdRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});
