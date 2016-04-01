var threeGppHssApp = angular.module('threeGppHssApp',
		[ 'ui.router', 'ngRoute' ]);

threeGppHssApp.config(function($stateProvider, $routeProvider) {

	$stateProvider.state('auc', {
		url : "/auc",
		views : {
			"applicationView" : {
				templateUrl : "resources/framework/3gppHss/views/applications.html"
			},
			"commonView" : {
				templateUrl : "resources/framework/3gppHss/views/commanImsiSelectView.html"
			},
			"dataView" : {
				templateUrl : "resources/framework/AUC/views/auc.html"
			},
			"footerButtonsView" : {
				templateUrl : "resources/framework/3gppHss/views/footerButtons.html"
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
			"subscriberSearchView" : {
				templateUrl : "resources/framework/3gppHss/views/SearchView.html"
			}
		}
	});
});