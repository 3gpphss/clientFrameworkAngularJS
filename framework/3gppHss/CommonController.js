threeGppHssApp.controller('commonController', [
		'$scope',
		'commonFactory',
		function($scope, commonFactory) {

			$scope.common = commonFactory.commonData;

			$scope.funcCreateSubscriber = function(operation, type) {
				commonFactory.addCommonData($scope.common);
				$scope.response = commonFactory
						.getJsonResponse(type, operation);
				$scope.common = commonFactory.commonData;
			};

			$scope.funcSearchSubscriber = function(operation, type) {
				
				commonFactory.addSearchCondition($scope.searchCondition);
				commonFactory
						.getJsonResponse(type, operation);	
				$scope.common = commonFactory.commonData;
				
			};

			$scope.funcModifySubscriber = function(operation, type) {
				commonFactory.addCommonData($scope.common);
				$scope.response = commonFactory
						.getJsonResponse(type, operation);
				$scope.common = commonFactory.commonData;
			};

			$scope.funcDeleteSubscriber = function(operation, type) {
				commonFactory.addCommonData($scope.common);
				$scope.response = commonFactory
						.getJsonResponse(type, operation);
				$scope.common = commonFactory.commonData;
			};

		} ]);
