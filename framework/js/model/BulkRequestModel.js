/*
 * BulkRequestModel: Responsible to contain request data to be sent to the server for 'Bulk' operation. 
 */
define(["frameworkModels/RequestModel"],function(RequestModel){
	return RequestModel.extend({
		setObjectclass : function(objectclass){
			this.set("objectclass", objectclass);
		},
		getObjectclass : function(){
			return this.get("objectclass");
		},
		setIdentifierListAlias: function(idAliasType){
			this.set("identifierRangeFilename.alias", idAliasType);
		},
		getIdentifierListAlias: function(value){
			return this.get("identifierRangeFilename.alias");
		},
		setIdentifierListFilterType: function(idFilterType){
			this.set("identifierRangeFilename.filterType", idFilterType);
		},
		getIdentifierListFilterType: function(){
			return this.get("identifierRangeFilename.filterType");
		},
		setIdentifierListFileName: function(idFileName){
			this.set("identifierRangeFilename.#text", idFileName);
		},
		getIdentifierListFileName: function(){
			return this.get("identifierRangeFilename.#text");
		},
		setOperation: function(operation) {
			this.set("operation", operation);
		},
		getOperation: function() {
			return this.get("operation");
		},
		setFilter: function(filter) {
			this.set("filter", filter);
		},
		getFilter: function(){
			return this.get("filter");
		},
		setModification: function(modification) {
			if(!this.get("modification")) {
				this.set("modification", []);
			}
			this.get("modification").push(modification);
		},
		getModification: function() {
			return this.get("modification");
		},
		toJSON : function(){
			return  {
				"spml.bulkRequest": Backbone.NestedModel.deepClone(this.attributes)
			};
		}
	});
});
