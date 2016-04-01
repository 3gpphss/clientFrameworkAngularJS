/*
 * RequestContext: Model which contains request context data. Extends from FrameworkModel.
 * 		
 * 'FrameworkModel': is the base backbone model for all framework models. 'frameworkModels' is an alias whose 
 *  path is defined in require-config.js file.
 */
define([ 'frameworkModels/FrameworkModel' ], function(FrameworkModel) {
	return FrameworkModel.extend({
		setFcoType : function(fcoType) {
			this.set("fcoType", fcoType);
		},
		getFcoType : function() {
			return this.get("fcoType");
		},
		setOperationType : function(operationType) {
			this.set("operationType", operationType);
		},
		getOperationType : function() {
			return this.get("operationType");
		},
		setUniqueId : function(uniqueId) {
			this.set("uniqueId", uniqueId);
		},
		getUniqueId : function() {
			return this.get("uniqueId");
		},
		setUniqueIdValue : function(uniqueIdValue) {
			this.set("uniqueIdValue", uniqueIdValue);
		},
		getUniqueIdValue : function() {
			return this.get("uniqueIdValue");
		},
		setViewType : function(viewType) {
			this.set("viewType", viewType);
		},
		getViewType : function() {
			return this.get("viewType");
		},
		setDataTemplateName : function(dataTemplateName) {
			this.set("dataTemplateName", dataTemplateName);
		},
		getDataTemplateName : function() {
			return this.get("dataTemplateName");
		},
		setRequestVersion : function(version) {
			this.set("requestVersion", version);
		},
		getRequestVersion : function() {
			return this.get("requestVersion");
		},
		setConfigFCO : function(fcoName) {
			this.set("configFCO", fcoName)
		},
		getConfigFCO : function() {
			return this.get("configFCO");
		},
		setRequestFcoType : function(type) {
			this.set("requestFcoType", type)
		},
		getRequestFcoType : function() {
			return this.get("requestFcoType");
		},
		setExtendedOperationType : function(extendedOperationType) {
			this.set("extendedOperationType", extendedOperationType);
		},
		getExtendedOperationType : function() {
			return this.get("extendedOperationType");
		},
		setExtendedOperationName : function(extendedOperationName) {
			this.set("extendedOperationName", extendedOperationName);
		},
		getExtendedOperationName : function() {
			return this.get("extendedOperationName");
		},
		setType : function(type) {
			this.set("type", type);
		},
		getType : function() {
			return this.get("type");
		},
		setOriginalViewType : function(viewType) {
			this.set("originalViewType", viewType);
		},
		getOriginalViewType : function() {
			return this.get("originalViewType");
		}
	});
});
