/*
 * ProvisioningModel: It contains all the required attributes used by navigation view to render the dropdowns in the navigation bar.
 */
define(['frameworkModels/FrameworkModel'],function(FrameworkModel){
	return FrameworkModel.extend({
		defaults: {
			fcoType: '',
			operationType: 'Search',
			uniqueId: '',
			uniqueIdValue: '',
			viewType: '',
			dataTemplateName: ''
		},
		getFcoType : function(){
			return this.get("fcoType");
		},
		getOperationType : function(){
			return this.get("operationType");
		},
		getUniqueId : function(){
			return this.get("uniqueId");
		},
		getUniqueIdValue : function(){
			return this.get("uniqueIdValue");
		},
		getViewType : function(){
			return this.get("viewType");
		},
		getDataTemplateName : function(){
			return this.get("dataTemplateName");
		},
		
	});
});


