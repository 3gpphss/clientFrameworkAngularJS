threeGppHssApp.controller('aucController', [
		'$scope',
		'$controller',
		'commonFactory',
		function($scope, $controller, commonFactory) {

			$scope.member = commonFactory.aucDataList;
			$scope.response = commonFactory.response;

			$scope.MCC = [ "262", "121", "111", "131", "141", "151" ];
			$scope.MNC = [ "02", "11", "121", "141", "151" ];

			$controller('commonController', {
				$scope : $scope
			});

			$scope.cleanFields = function() {
				angular.forEach($scope.aucData, function(value, key) {
					$scope.aucData[key] = '';
				}, {});

				angular.forEach($scope.local, function(value, key) {
					$scope.local[key] = '';
				}, {});
			};

			$scope.funcSaveAucData = function() {
				commonFactory.saveAucData(createImsiObject());
			};

			$scope.funcDeleteAucData = function(index) {
				$scope.cleanFields();
				commonFactory.deleteAucData(index);
			};

			$scope.selectedItemChanged = function(selectedItem) {
				if (selectedItem.length > 0) {

					angular.forEach(selectedItem[0], function(value, key) {
						$scope.aucData[key] = selectedItem[0][key];
					}, {});

					$scope.local.acMcc = selectedItem[0]['imsi']
							.substring(0, 3);
					$scope.local.acMnc = selectedItem[0]['imsi']
							.substring(3, 5);
					$scope.local.acMsin = selectedItem[0]['imsi'].substring(5);
				}
			}

			function createImsiObject() {
				var imsiObject = {};
				angular.forEach($scope.aucData, function(value, key) {
					console.log(key + " " + value);
					imsiObject[key] = value;
				}, imsiObject);

				return imsiObject;
			}
		} ]);
