/*
#########################################################################################
### This is the default (english) error code propery file for client framework.       ###
### Add every error message here. 						                              ###
### For better maintanability keep the messages always divided in the groups.         ###
######################################################################################### 
*/

define(function(){
	return {
		ErrorCodeProperties : {
				'clientFrameworkError.unknownClientError': 'Unknown client error occured',
				'clientFrameworkError.unexpectedClientError' : 'Unexpected Error : {0}',
				
				// Backbone Errors
				'clientFrameworkError.backboneModelUndefinedError': '{0} is undefined',
				'clientFrameworkError.backboneModelAttrUndefinedError': '{0} is undefined',
				'clientFrameworkError.backboneModelMethodUndefinedError': '{0} is undefined',
				
				'clientFrameworkError.backboneViewUndefinedError': '{0} is undefined',
				'clientFrameworkError.backboneViewMethodUndefinedError': '{0} is undefined',
				
				'clientFrameworkError.backboneCollectionUndefinedError': '{0} is undefined',
				
				// Underscore Errors
				'clientFrameworkError.underscoreError': 'Error in Underscore',

				// General Framework Errors
				'clientFrameworkError.operationControllerUnavaiableError': 'Unable to process the request. Operation Controller missing. Please contact Adminsitrator.',
				'clientFrameworkError.operationControllerImplementationError': 'Unable to process the request. Operation Controller not implemented properly. Please contact Adminsitrator.',
				'clientFrameworkError.templateLoadingError': '{0}: Template loading failed',
				
				// Bulk Modification Errors
				'clientFrameworkError.emptyModificationsError': "'Modification' cannot be empty for a bulk modify operation.",
				'clientFrameworkError.missingAttributeInBulkModificationError': "'{0}' must be specified for the following modification block.</br>{1}",
				'clientFrameworkError.invalidBulkModOperationValueError': "Invalid 'operation' specified in the following modification block.</br>{0}</br>Allowed values are [{1}]",
				'clientFrameworkError.matchIndexNotAllowedForBulkAddAddorsetError': "'match' and 'index' cannot be specified  for a modification block when 'operation' is 'add' or 'addorset'.</br>{0}",
				'clientFrameworkError.valueObjectNotAllowedForBulkRemoveError': "'valueObject' cannot be specified  for a modification block when 'operation' is 'remove'.</br>{0}",
				'clientFrameworkError.valueobjectMandatoryForBulkAddAddorsetSetSetoraddError': "'valueObject' is mandatory  for a modification block when 'operation' is 'add', 'addorset', 'set' or 'setoradd'.</br>{0}",
				'clientFrameworkError.invalidBulkModScopeValueError': "Invalid 'scope' specified in the following modification block.</br>{0}</br>Allowed values are [{1}]",
				'clientFrameworkError.jsonSyntaxError': "Syntax error: {0}</br>{1}",
				'clientFrameworkError.modificationNotBeginningWithKeywordError': "Modification must begin with the keyword 'modification' followed by the actual modification block",
				'clientFrameworkError.missingTypeInMatchClauseError': "'type' is missing for 'match' clause in the following modification block.</br>{0}",
				'clientFrameworkError.missingValueobjectInMatchClauseError': "'type' is missing for 'valueObject' clause in the following modification block.</br>{0}",
				'clientFrameworkError.typeMismatchInMatchValueobjectError': "'type' must be same for 'match' and 'valueObject' clauses for a modification block when 'scope' is 'uniqueTypeMapping'.</br>{0}",
				'clientFrameworkError.nameOrMatchMandatoryForBulkRemoveError': "Either 'name' or 'match' clause is mandatory for a modification block when 'operation' is 'remove'.</br>{0}",
				
				// Configuration data Errors
				'clientFrameworkError.configDataUndefinedError': 'Requested configuraion data {0} is unavailable',
				'clientFrameworkError.fcoDataUnavailableError': 'FCO data is unavailable',
				'clientFrameworkError.uniqueIdUnavailableError': 'Unique ID data is unavailable',
				'clientFrameworkError.viewTypesUnavailableError': 'View types is unavailable',
				
				// Module Errors
				'clientFrameworkError.moduleViewControllerUndefinedError': 'View controller for the module {0} is undefined',
				'clientFrameworkError.moduleModelControllerUndefinedError': 'Model controller for the module {0} is undefined',
				'clientFrameworkError.moduleConfigSpecMissingError': 'PC loading failed! One or all of the module spec is missing',
				'clientFrameworkError.moduleModelInterNotImplementedError': 'getModel() implementation missing for "{0}" module',
				'clientFrameworkError.moduleViewInterNotImplementedError': 'getView() implementation missing for "{0}" module',
				
				// Server Errors
				'clientFrameworkError.serverNotFoundError': 'Server not found',
				'clientFrameworkError.serverObjectNotFoundError': '{0} with {1} "{2}" not found',
				// 'clientFrameworkError.serverObjectAlreadyExistsError': '{0} with {1} "{2}" already exists',
				'clientFrameworkError.httpServerError': 'HTTP ERROR({0}): {1}',
				'clientFrameworkError.httpRequestTimeoutError': 'HTTP Error(Request Timed out)'
		},
		getMessage: function(errorMessageKey){
			return this.ErrorCodeProperties[errorMessageKey];
		}
	}
});