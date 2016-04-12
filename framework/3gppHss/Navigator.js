var threeGppHssApp = angular.module('threeGppHssApp',
		[ 'ui.router', 'ngRoute' ]);

threeGppHssApp.config(function($stateProvider, $routeProvider) {

	$stateProvider.state('auc', {
		url : "/auc",
		views : {
			"msgView" : {
				templateUrl : "resources/framework/3gppHss/views/msgView.html",
				controller : 'aucController'
			},
			"applicationView" : {
				templateUrl : "resources/framework/3gppHss/views/applications.html",
				controller : 'aucController'
			},
			"commonView" : {
				templateUrl : "resources/framework/3gppHss/views/commanImsiSelectView.html",
				controller : 'aucController'
			},
			"dataView" : {
				templateUrl : "resources/framework/AUC/views/auc.html",
				controller : 'aucController'
			},
			"footerButtonsView" : {
				templateUrl : "resources/framework/3gppHss/views/footerButtons.html",
				controller : 'aucController'
				
			}
		}
	}).state('hlr', {
		url : "/hlr",
		views : {
			"applicationView" : {
				templateUrl : "views/applications.html"
			},
			"commonView" : {
				templateUrl : "views/commanImsiSelectView.html"
			},
			"dataView" : {
				templateUrl : "views/hlr.html"
			},
			"footerButtonsView" : {
				templateUrl : "views/footerButtons.html"
			}
		}
	}).state('hss', {
		url : "/hss",
		views : {
			"applicationView" : {
				templateUrl : "views/applications.html"
			},
			"commonView" : {
				templateUrl : "views/commanImsiSelectView.html"
			},
			"dataView" : {
				templateUrl : "views/hss.html"
			},
			"footerButtonsView" : {
				templateUrl : "views/footerButtons.html"
			}
		}
	}).state('applications', {
		url : "/applications",
		views : {
			"applicationView" : {
				templateUrl : "resources/framework/3gppHss/views/applications.html"
			},
			"commonView" : {
				templateUrl : "resources/framework/3gppHss/views/commanImsiSelectView.html"
			}
		}
	}).state('subscriberSearch', {
		url : "/subscriberSearch",
		views : {
			"msgView" : {
				templateUrl : "resources/framework/3gppHss/views/msgView.html",
				controller : 'commonController'
			},
			"subscriberSearchView" : {
				templateUrl : "resources/framework/3gppHss/views/SearchView.html",
				controller : 'commonController'
			}
		}
	});
});