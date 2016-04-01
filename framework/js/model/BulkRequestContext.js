/*
 * BulkRequestContext: Model which contains request context data for bulk requests. Extends from FrameworkModel.
 * 		
 */
define([ 'frameworkModels/FrameworkModel' ], function(FrameworkModel) {
	return FrameworkModel.extend({
		setBulkFcoType : function(bulkFcoType) {
			this.set("bulkFcoType", bulkFcoType);
		},
		getBulkFcoType : function() {
			return this.get("bulkFcoType");
		},
		setOperationType : function(operationType) {
			this.set("operationType", operationType);
		},
		getOperationType : function() {
			return this.get("operationType");
		},
		setRequestVersion : function(version) {
			this.set("requestVersion", version);
		},
		getRequestVersion : function() {
			return this.get("requestVersion");
		},
		setResultFileName : function(bulkResultFileName) {
			this.set("bulkResultFileName", bulkResultFileName);
		},
		getResultFileName : function() {
			return this.get("bulkResultFileName")
		},
		setIdentifierListText : function(bulkIdentifierListName) {
			return this.set("bulkIdentifierListName", bulkIdentifierListName);
		},
		getIdentifierListText : function() {
			return this.get("bulkIdentifierListName");
		},
		setIdentifierListFilterType : function(bulkFilterType) {
			this.set("bulkFilterType", bulkFilterType);
		},
		getIdentifierListFilterType : function() {
			return this.get("bulkFilterType");
		},
		setIdentifierListAlias : function(alias) {
			this.set("alias", alias);
		},
		getIdentifierListAlias : function() {
			return this.get("alias");
		},
		setSchedulable : function(bulkSchedulable) {
			this.set("bulkSchedulable", bulkSchedulable);
		},
		getSchedulable : function() {
			return this.get("bulkSchedulable");
		},
		setResponseFileSize : function(responseFileSize) {
			this.set("responseFileSize", responseFileSize);
		},
		getResponseFileSize : function() {
			return this.get("responseFileSize");
		},
		setFilter: function(filter) {
			this.set("filter", filter);
		},
		getFilter: function() {
			return this.get("filter");
		}
	});
});
