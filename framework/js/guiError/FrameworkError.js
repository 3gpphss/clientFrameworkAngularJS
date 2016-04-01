/*
 * FrameworkError: Base Exception class for all client side errors
 */
define(['frameworkErrors/GuiError'], function(GuiError){
	var FrameworkError = function(errorCode, params) {
		this.setDefaults("FrameworkError", this.getErrorCodeMap(), 'UNKNOWN_ERROR');
		this.setErrorCode(errorCode, params);
	}
	FrameworkError.prototype = new GuiError();
	FrameworkError.prototype.constructor = FrameworkError;

	FrameworkError.prototype.getErrorCodeMap = function() {
		return {
			'UNKNOWN_ERROR': {errorId: '10000', errorMessageKey: 'clientFrameworkError.unknownClientError'},
			'UNEXPECTED_ERROR': {errorId: '10001', errorMessageKey: 'clientFrameworkError.unexpectedClientError'},
			// Backbone Errors
			'BACKBONE_MODEL_UNDEFINED_ERROR': {errorId: '10010', errorMessageKey: 'clientFrameworkError.backboneModelUndefinedError'},
			'BACKBONE_MODEL_ATTRIBUTE_UNDEFINED_ERROR': {errorId: '10011', errorMessageKey: 'clientFrameworkError.backboneModelAttrUndefinedError'},
			'BACKBONE_MODEL_METHOD_UNDEFINED_ERROR': {errorId: '10012', errorMessageKey: 'clientFrameworkError.backboneModelMethodUndefinedError'},

			'BACKBONE_VIEW_UNDEFINED_ERROR': {errorId: '10101', errorMessageKey: 'clientFrameworkError.backboneViewUndefinedError'},
			'BACKBONE_VIEW_METHOD_UNDEFINED_ERROR': {errorId: '10102', errorMessageKey: 'clientFrameworkError.backboneViewMethodUndefinedError'},

			'BACKBONE_COLLECTION_UNDEFINED_ERROR': {errorId: '10201', errorMessageKey: 'clientFrameworkError.backboneCollectionUndefinedError'},

			// Underscore Errors
			'UNDERSCORE_ERROR' : {errorId: '10301', errorMessageKey: 'clientFrameworkError.underscoreError'},

			// General Framework Errors
			'OPERATION_CONTROLLER_UNAVAILABLE_ERROR': {errorId: '10401', errorMessageKey: 'clientFrameworkError.operationControllerUnavaiableError'},
			'OPERATION_CONTROLLER_IMPLEMENTATION_ERROR': {errorId: '10402', errorMessageKey: 'clientFrameworkError.operationControllerImplementationError'},
			'FAILED_TO_LOAD_TEMPLATE_ERROR': {errorId: '10403', errorMessageKey: 'clientFrameworkError.templateLoadingError'},

			// Bulk Modification Errors
			'EMPTY_MODIFICATIONS_ERROR': {errorId: '10411', errorMessageKey: 'clientFrameworkError.emptyModificationsError'},
			'MISSING_ATTRIBUTE_IN_BULK_MODIFICATION_ERROR': {errorId: '10412', errorMessageKey: 'clientFrameworkError.missingAttributeInBulkModificationError'},
			'INVALID_BULK_MOD_OPERATION_VALUE_ERROR': {errorId: '10413', errorMessageKey: 'clientFrameworkError.invalidBulkModOperationValueError'},
			'MATCH_INDEX_NOT_ALLOWED_FOR_BULK_ADD_ADDORSET_ERROR': {errorId: '10414', errorMessageKey: 'clientFrameworkError.matchIndexNotAllowedForBulkAddAddorsetError'},
			'VALUEOBJECT_NOT_ALLOWED_FOR_BULK_REMOVE_ERROR': {errorId: '10415', errorMessageKey: 'clientFrameworkError.valueObjectNotAllowedForBulkRemoveError'},
			'VALUEOBJECT_MANDATORY_FOR_BULK_ADD_ADDORSET_SET_SETORADD_ERROR': {errorId: '10416', errorMessageKey: 'clientFrameworkError.valueobjectMandatoryForBulkAddAddorsetSetSetoraddError'},
			'INVALID_BULK_MOD_SCOPE_VALUE_ERROR': {errorId: '10417', errorMessageKey: 'clientFrameworkError.invalidBulkModScopeValueError'},
			'JSON_SYNTAX_ERROR': {errorId: '10418', errorMessageKey: 'clientFrameworkError.jsonSyntaxError'},
			'MODIFICATION_NOT_BEGGINING_WTH_KEYWORD_ERROR': {errorId: '10419', errorMessageKey: 'clientFrameworkError.modificationNotBeginningWithKeywordError'},
			'MISSING_TYPE_IN_MATCH_CLAUSE_ERROR': {errorId: '10420', errorMessageKey: 'clientFrameworkError.missingTypeInMatchClauseError'},
			'MISSING_TYPE_IN_VALUEOBJECT_CLAUSE_ERROR': {errorId: '10421', errorMessageKey: 'clientFrameworkError.missingValueobjectInMatchClauseError'},
			'TYPE_MISMATCH_IN_MATCH_VALUEOBJECT_ERROR': {errorId: '10422', errorMessageKey: 'clientFrameworkError.typeMismatchInMatchValueobjectError'},
			'NAME_OR_MATCH_MANDATORY_FOR_BULK_REMOVE_ERROR': {errorId: '10423', errorMessageKey: 'clientFrameworkError.nameOrMatchMandatoryForBulkRemoveError'},
				
			// Configuration data Errors
			'CONFIG_DATA_UNDEFINED_ERROR': {errorId: '10452', errorMessageKey: 'clientFrameworkError.configDataUndefinedError'},
			'FCO_DATA_UNAVAILABLE_ERROR': {errorId: '10453', errorMessageKey: 'clientFrameworkError.fcoDataUnavailableError'},
			'UNIQUE_ID_UNAVAILABLE_ERROR': {errorId: '10454', errorMessageKey: 'clientFrameworkError.uniqueIdUnavailableError'},
			'VIEW_TYPES_UNAVAILABLE_ERROR': {errorId: '10455', errorMessageKey: 'clientFrameworkError.viewTypesUnavailableError'},

			// Module Errors
			'MODULE_VIEW_CONTROLLER_UNDEFINED_ERROR': {errorId: '12001', errorMessageKey: 'clientFrameworkError.moduleViewControllerUndefinedError'},
			'MODULE_MODEL_CONTROLLER_UNDEFINED_ERROR': {errorId: '12002', errorMessageKey: 'clientFrameworkError.moduleModelControllerUndefinedError'},
			'MODULE_CONFIG_SPEC_MISSING_ERROR' : {errorId: '12003', errorMessageKey: 'clientFrameworkError.moduleConfigSpecMissingError'},
			'MODULE_MODEL_INTERFACE_NOT_IMPLEMENTED_ERROR': {errorId: '12004', errorMessageKey: 'clientFrameworkError.moduleModelInterNotImplementedError'},
			'MODULE_VIEW_INTERFACE_NOT_IMPLEMENTED_ERROR': {errorId: '12005', errorMessageKey: 'clientFrameworkError.moduleViewInterNotImplementedError'},

			// Server Errors
			'SERVER_NOT_FOUND_ERROR': {errorId: '12201', errorMessageKey: 'clientFrameworkError.serverNotFoundError'},
			'SERVER_OBJECT_NOT_FOUND': {errorId:'12202', errorMessageKey:'clientFrameworkError.serverObjectNotFoundError'},
			//'SERVER_OBJECT_ALREADY_EXISTS': {errorId:'12203', errorMessageKey:'clientFrameworkError.serverObjectAlreadyExistsError'},
			'HTTP_SERVER_ERROR': {errorId: '12290', errorMessageKey:'clientFrameworkError.httpServerError'},
			'HTTP_REQUEST_TIMEOUT_ERROR': {errorId: '12291', errorMessageKey:'clientFrameworkError.httpRequestTimeoutError'},
			//UNKNOWN_SERVER_ERROR displays the error from server as is.
			'UNKNOWN_SERVER_ERROR': {errorId:'15000'}
			
		};
	}
	FrameworkError.prototype.getLocalePath = function(locale) {
		return 'framework/bundle/' + locale + '_errorCodeProperties';
	}

	return FrameworkError;
});