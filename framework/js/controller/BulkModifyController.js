/*
 * BulkModifyController: Responsible for end to end flow for bulk modify.
 * 
 */
define(['BulkOperationController', 'frameworkErrors/FrameworkError', 'frameworkErrors/ServerError', 'frameworkModels/FrameworkModel'],
		function(BulkOperationController, FrameworkError, ServerError, FrameworkModel) {
	return BulkOperationController.extend({
		MODIFICATION_KEY: "modification",
		TYPE_KEY: "type",
		OPERATION_KEY: "operation",
		ALLOWED_OPERATIONS: {add: "add", set: "set", addorset: "addorset", setoradd: "setoradd", remove: "remove"},
		allowedOperationValues: undefined,
		MATCH_KEY: "match",
		VALUEOBJECT_KEY: "valueObject",
		NAME_KEY: "name",
		SCOPE_KEY: "scope",
		INDEX_KEY: "index",
		ALLOWED_SCOPE: {uniqueTypeMapping: "uniqueTypeMapping", abstractTypeMapping: "abstractTypeMapping"},
		allowedScopeValues: undefined,
		initialize : function() {
			this.beginsWithModRegex =  new RegExp("^" + this.MODIFICATION_KEY + " [^\s]+");
		},
		getFcoDetails : function(requestContext) {
			if(this.fcoName == requestContext.getBulkFcoType() && this.pcName == requestContext.getRequestVersion()){
				return; //No change in tree structure
			}
			this.layout.displayLoading();
			// reset fcoName and pcName
			this.fcoName = requestContext.getBulkFcoType();
			this.pcName = requestContext.getRequestVersion();
			// Get new FCO details
			var fcoDetails = this.DAO.getFcoDetails({"fcoName": this.fcoName,"requestVersion": this.pcName},'onFcoDetailsResponse', 'errorCallback', this);
		},
		onFcoDetailsResponse : function(responseModel) {
			if (responseModel.get("errorMessage") == null) {
				this.layout.hideLoading();
				this.layout.populateModificationDiv(responseModel);
			} else {
				this.displayError(new ServerError(undefined, responseModel.get('errorMessage')));
			}
		},
		// ^modification\s+"operation"\s*:\s*("add"|"set"|"setoradd"|"addorset"|"remove")
		onSubmitModify : function(requestContext) {
			if(this.validateRequest()) {
				this.getBulkModifyModel(requestContext);
				if(this.validateModification(this.modifyModel.get("modification"))) {
					this.layout.displayLoading();
					this.DAO.bulkRequest(this.bulkModifyModel,'successCallback', 'errorCallback', this);
				} 
			}
		},
		getBulkModifyModel: function(requestContext) {
			this.bulkModifyModel = this.RequestFactory.getRequestModel(this.RequestTypes.bulkOperation);
			this.setRequestContextToRequestModel(this.bulkModifyModel, requestContext);
			if(requestContext.getIdentifierListText() != "") {
				this.bulkModifyModel.setIdentifierListFileName(requestContext.getIdentifierListText());
				this.bulkModifyModel.setIdentifierListAlias(requestContext.getIdentifierListAlias());
				this.bulkModifyModel.setIdentifierListFilterType(requestContext.getIdentifierListFilterType());
			}
			if(this.modifyModel.get("filter") != "") {
				this.bulkModifyModel.setFilter(this.modifyModel.get("filter"));
			}
			this.bulkModifyModel.setOperation("modify");
			return this.bulkModifyModel;
		},
		getBulkModel: function() {
			this.modifyModel = new FrameworkModel();
			var data = this.layout.getLayoutData();
			if(data.filter != undefined) {
				this.modifyModel.set("filter", data.filter);					
			}
			if(data.modifications != undefined) {
				this.modifyModel.set("modification", data.modifications);					
			}
			return this.modifyModel;
		},
		validateModification: function(modifications) {
			modifications = modifications.trim();
			if(modifications == "") {
				this.displayError(new FrameworkError('EMPTY_MODIFICATIONS_ERROR'));
				return false;
			}
			if(!this.beginsWithModRegex.test(modifications)) {
				this.displayError(new FrameworkError('MODIFICATION_NOT_BEGGINING_WTH_KEYWORD_ERROR'));
				return false;
			}
			var modificationsArr = modifications.split(this.MODIFICATION_KEY + " ");
			for(var i = 0; i < modificationsArr.length ; i++) {
				var modificationBlock = modificationsArr[i];
				// Ignore blank lines
				if(modificationBlock.trim() == "") {
					continue;
				}
				// Convert modification block to backbone model; handle syntax errors
				var modificationBlockJson = "{" + modificationBlock + "}";
				try {
					var modificationBlockModel = new FrameworkModel(JSON.parse(modificationBlockJson));
				} catch(parseException) {
					this.displayError(new FrameworkError('JSON_SYNTAX_ERROR', [parseException.message, modificationBlockJson]));
					return false;
				}
				if(!this.validateModOperation(modificationBlockModel, modificationBlockJson)) {
					return false;
				}
				if(!this.validateModScope(modificationBlockModel, modificationBlockJson)) {
					return false;
				}
				if(!this.validateMatchClause(modificationBlockModel, modificationBlockJson)) {
					return false;
				}
				if(!this.validateValueobjectClause(modificationBlockModel, modificationBlockJson)) {
					return false;
				}
				if(!this.validateMatchValueobjectTypes(modificationBlockModel, modificationBlockJson)) {
					return false;
				}
				if(this.bulkModifyModel) {
					this.bulkModifyModel.setModification(modificationBlockModel);
				}
			}
			return true;
		},
		setAllowedOperationValues: function() {
			this.allowedOperationValues = [];
			for(var key in this.ALLOWED_OPERATIONS) {
				this.allowedOperationValues.push(this.ALLOWED_OPERATIONS[key]);
			}
		},
		setAllowedScopeValues: function() {
			this.allowedScopeValues = [];
			for(var key in this.ALLOWED_SCOPE) {
				this.allowedScopeValues.push(this.ALLOWED_SCOPE[key]);
			}
		},
		validateModOperation: function(modificationBlockModel, modificationBlockJson) {
			if(!modificationBlockModel.has(this.OPERATION_KEY)) {
				this.displayError(new FrameworkError('MISSING_ATTRIBUTE_IN_BULK_MODIFICATION_ERROR', [this.OPERATION_KEY, modificationBlockJson]));
				return false;
			} 
			var operation = modificationBlockModel.get(this.OPERATION_KEY);
			this.setAllowedOperationValues();
			if(this.allowedOperationValues.indexOf(operation) == -1) {
				this.displayError(new FrameworkError('INVALID_BULK_MOD_OPERATION_VALUE_ERROR', [modificationBlockJson, this.allowedOperationValues]));
				return false;
			}
			if(operation == this.ALLOWED_OPERATIONS.add || operation == this.ALLOWED_OPERATIONS.addorset) {
				if(modificationBlockModel.has(this.MATCH_KEY) || modificationBlockModel.has(this.INDEX_KEY)) {
					this.displayError(new FrameworkError('MATCH_INDEX_NOT_ALLOWED_FOR_BULK_ADD_ADDORSET_ERROR', [modificationBlockJson]));
					return false;
				}
				if(!modificationBlockModel.has(this.VALUEOBJECT_KEY)) {
					this.displayError(new FrameworkError('VALUEOBJECT_MANDATORY_FOR_BULK_ADD_ADDORSET_SET_SETORADD_ERROR', [modificationBlockJson]));
					return false;
				}
			}
			if((operation == this.ALLOWED_OPERATIONS.set || operation == this.ALLOWED_OPERATIONS.setoradd) && !modificationBlockModel.has(this.VALUEOBJECT_KEY)) {
				this.displayError(new FrameworkError('VALUEOBJECT_MANDATORY_FOR_BULK_ADD_ADDORSET_SET_SETORADD_ERROR', [modificationBlockJson]));
				return false;
			}
			if(operation == this.ALLOWED_OPERATIONS.remove &&  !modificationBlockModel.has(this.NAME_KEY) && !modificationBlockModel.has(this.MATCH_KEY)) {
				this.displayError(new FrameworkError('NAME_OR_MATCH_MANDATORY_FOR_BULK_REMOVE_ERROR', [modificationBlockJson]));
				return false;
			}
			if(operation == this.ALLOWED_OPERATIONS.remove && modificationBlockModel.has(this.VALUEOBJECT_KEY)) {
				this.displayError(new FrameworkError('VALUEOBJECT_NOT_ALLOWED_FOR_BULK_REMOVE_ERROR', [modificationBlockJson]));
				return false;
			}
			return true;
		},
		validateModScope: function(modificationBlockModel, modificationBlockJson) {
			if(modificationBlockModel.has(this.SCOPE_KEY)) {
				this.setAllowedScopeValues();
				if(this.allowedScopeValues.indexOf(modificationBlockModel.get(this.SCOPE_KEY)) == -1) {
					this.displayError(new FrameworkError('INVALID_BULK_MOD_SCOPE_VALUE_ERROR', [modificationBlockJson, this.allowedScopeValues]));
					return false;
				}
			} else {
				modificationBlockModel.set(this.SCOPE_KEY, this.ALLOWED_SCOPE.uniqueTypeMapping, {silent: true});
			}
			return true;
		},
		validateMatchClause: function(modificationBlockModel, modificationBlockJson) {
			if(modificationBlockModel.has(this.MATCH_KEY)) {
				var matchClause = modificationBlockModel.get(this.MATCH_KEY);
				if(!matchClause[this.TYPE_KEY]) {
					this.displayError(new FrameworkError('MISSING_TYPE_IN_MATCH_CLAUSE_ERROR', [modificationBlockJson]));
					return false;
				}
				var type = matchClause[this.TYPE_KEY];
				delete matchClause[this.TYPE_KEY];
				matchClause["xsi.type"] = type;
				modificationBlockModel.set(this.MATCH_KEY, matchClause);
			}
			return true;
		},
		validateValueobjectClause: function(modificationBlockModel, modificationBlockJson) {
			if(modificationBlockModel.has(this.VALUEOBJECT_KEY)) {
				var valueObjectClause = modificationBlockModel.get(this.VALUEOBJECT_KEY);
				if(!valueObjectClause[this.TYPE_KEY]) {
					this.displayError(new FrameworkError('MISSING_TYPE_IN_VALUEOBJECT_CLAUSE_ERROR', [modificationBlockJson]));
					return false;
				}
				var type = valueObjectClause[this.TYPE_KEY];
				delete valueObjectClause[this.TYPE_KEY];
				valueObjectClause["xsi.type"] = type;
				modificationBlockModel.set(this.VALUEOBJECT_KEY, valueObjectClause);
			}
			return true;
		},
		validateMatchValueobjectTypes: function(modificationBlockModel, modificationBlockJson) {
			if(modificationBlockModel.has(this.VALUEOBJECT_KEY) && modificationBlockModel.has(this.MATCH_KEY) && modificationBlockModel.get(this.SCOPE_KEY) == this.ALLOWED_SCOPE.uniqueTypeMapping) {
				if(modificationBlockModel.get(this.VALUEOBJECT_KEY)["xsi.type"] != modificationBlockModel.get(this.MATCH_KEY)["xsi.type"]) {
					this.displayError(new FrameworkError('TYPE_MISMATCH_IN_MATCH_VALUEOBJECT_ERROR', [modificationBlockJson]));
					return false;
				}
			}
			return true;
		}
	});
});