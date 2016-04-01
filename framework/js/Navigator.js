var threeGppHssApp = angular.module('mainApp', [ 'ngRoute' ]);

threeGppHssApp.config(function($routeProvider) {
	$routeProvider.when('/welcome', {
		templateUrl : 'views/welcomeView.html'
	}).when('/subscriber', {
		templateUrl : 'views/subscriberView.html'
	}).otherwise({
		redirectTo : '/welcome'
	});
});


threeGppHssApp.controller('commonController', [
                                       		'$scope',
                                       		'$http',
                                       		function($scope, $http) {

                                       					

                                       		} ]);