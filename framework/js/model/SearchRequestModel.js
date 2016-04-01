/*
 * SearchRequestModel: Responsible to contain request data to be sent to the server for 'Search' operation. 
 * 'defaults' block contains a list of default attributes that needs to be there for a search request.
 */
define(["frameworkModels/RequestModel"],function(RequestModel){
	return RequestModel.extend({
		setAliasTypeName : function(name){
			this.set("base.alias.name",name);
		},
		getAliasTypeName : function(name){
			return this.get("base.alias.name");
		},
		setAliasTypeValue : function(value){
			this.set("base.alias.value",value);
		},
		getAliasTypeValue : function(){
			return this.get("base.alias.value");
		},
		setObjectclass : function(value){
			this.set("base.objectclass",value);
		},
		getObjectclass : function(){
			return this.get("base.objectclass");
		},
		setFilter: function(value){
			this.set("filter", value);
		},
		getFilter: function(){
			return this.get("filter");
		},
		setReturnAttribute : function(value){
			if(!this.get("returnAttribute")) {
				this.set("returnAttribute",new Array());
			}
			var returnAttributeArr = this.get("returnAttribute");
			if(_.isArray(value)) {
				returnAttributeArr.push.apply(returnAttributeArr, value);
			} else {
				returnAttributeArr.push(value);
			}
		},
		getReturnAttribute : function(){
			return this.get("returnAttribute");
		},
		//Bulk Attributes
		setIdentifierListAlias: function(value){
			this.set("identifierListName.alias", value);
		},
		getIdentifierListAlias: function(){
			this.get("identifierListName.alias");
		},
		setIdentifierListFilterType: function(value){
			this.set("identifierListName.filterType", value);
		},
		getIdentifierListFilterType: function(){
			this.get("identifierListName.filterType");
		},
		setIdentifierListText: function(value){
			this.set("identifierListName.#text", value);
		},
		getIdentifierListText: function(){
			return this.get("identifierListName.#text");
		},
		toJSON : function(){
			return  {
					"spml.searchRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});
