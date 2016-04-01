/*
 * Configuration for require.js which includes alias paths, shim and loads a wire spec(frameworkSpec)
 * CatchError property define should be true to catch the require API error in project and browser defined bug tools.
 * In case of define: false, error will be caught only at browser defined bug tools.
 */
require.config({

	baseUrl : 'resources/',
	catchError : {
		define : true
	},
	paths : {
		frameworkPath : 'framework/js',
		frameworkModels : 'framework/js/model',
		frameworkViews : 'framework/js/view',
		frameworkErrors: 'framework/js/guiError',
		// Libraries
		text : 'framework/js/lib/text',
		// jquery Library
		jquery : 'framework/js/lib/jquery-1.9.0.min',
		// underscore Library
		underscore : 'framework/js/lib/underscore',
		// Backbone Library
		backbone : 'framework/js/lib/backbone',
		// Nested Module (Wrapper of Backbone Model)
		nestedModel : 'framework/js/lib/backbone-nested',
		// Model Binder( Backbone Plugin)
		modelBinder : 'framework/js/lib/Backbone.ModelBinder',
		collectionBinder: 'framework/js/lib/Backbone.CollectionBinder',
		BaseCollectionView : 'framework/js/collection/BaseCollectionView',
		ModuleCollectionView : 'framework/js/collection/ModuleCollectionView',
		// Base Model for Framework/Module models
		BaseModel : 'framework/js/model/BaseModel',
		// Base View for Framework/Module views
		BaseView : 'framework/js/view/BaseView',
		BaseCollection : 'framework/js/collection/BaseCollection',
		// This will be updated once the module path is finalized
		modulePath : '../gui-modules',
		ModuleView : 'framework/js/view/ModuleView',
		CollectionView : 'framework/js/view/CollectionView',
		ErrorHandler : 'framework/js/guiError/ErrorHandler',
		OperationController :'framework/js/controller/OperationController',
		BulkOperationController :'framework/js/controller/BulkOperationController',
		ModuleModel: 'framework/js/model/ModuleModel',
		OperationLayoutManager :'framework/js/view/OperationLayoutManager',
		BulkOperationLayoutManager :'framework/js/view/BulkOperationLayoutManager',
		ModuleListView : 'framework/js/view/ModuleListView',
		ModuleMultiDataView : 'framework/js/view/ModuleMultiDataView',
		domReady : 'framework/js/lib/domReady',
		BulkErrorHandler : 'framework/js/guiError/BulkErrorHandler',
		FrameworkViewController : 'framework/js/controller/FrameworkViewController',
		FrameworkModelController : 'framework/js/controller/FrameworkModelController',
		FrameworkExtendUtility : 'framework/js/util/FrameworkExtendUtility',
		OrderMgmtErrorHandler : 'framework/js/guiError/OrderMgmtErrorHandler',
		moment: 'framework/js/lib/moment',
		momentTimezone: 'framework/js/lib/moment-timezone.min',
		tablesorter : 'framework/js/lib/jquery.tablesorter.min',
		FrameworkValidator : 'framework/js/util/FrameworkValidator'
	},
	shim : {
		underscore : {
			exports : '_'
		},
		backbone : {
			deps : [ "underscore", "jquery" ],
			exports : "Backbone"
		},
		nestedModel : {
			deps : [ "backbone" ],
			exports : "nestedModel"
		},
		modelBinder : {
			deps : [ "backbone" ],
			exports : "modelBinder"
		},
		collectionBinder : {
			deps : [ "backbone", "modelBinder" ],
			exports : "collectionBinder"
		},
		tablesorter : {
			deps : ["jquery" ],
			exports : "tablesorter"
		},
		/*
			 * , frameworkUtility : { deps : ["jquery" ], exports :
			 * "FrameworkUtility" }
			 */
		
	},
	packages : [ {
		name : 'when',
		location : 'framework/js/lib/when',
		main : 'when'
	}, {
		name : 'wire',
		location : 'framework/js/lib/wire',
		main : 'wire'
	}, {
		name : 'meld',
		location : 'framework/js/lib/meld',
		main : 'meld'
	} ]
});

require(['jquery'], function(jquery){
	 $.ajax({
	        type: "GET",
	        url: "userdata.htm",
	        success: function(response){
	        // we have the response
	        $('#user').prepend("<span class='icon-user' style='padding-right: 8px'></span> "+response[0]);
	        $('#guiName').append(response[1]);
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	        	  console.log(textStatus, errorThrown);
	        	}
	        });
});

require(['ErrorHandler'], function(handler) {
	require.onError = handler;
});
// Disabled for v16 , remove comments to load all javascripts and comment require([ "wire!framework/js/context/frameworkSpecOnlyOM" ]);
require([ "wire!framework/js/context/frameworkSpec"]);

// comment down line and uncomment top line to load all javascripts
//require([ "wire!framework/js/context/frameworkSpecOnlyOM"]);

require(['domReady!'],function(){
	$("#loginload").hide();	
});