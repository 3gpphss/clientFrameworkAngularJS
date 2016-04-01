threeGppHssApp.controller('configurationController',[
				'$scope',
				'configurationFactory',				
				function($scope, configurationFactory) {
					//$scope.config={};
					var configData = configurationFactory.getConfigData();
					
					configData.then(function(resolve){			
						var mccMnc = configurationFactory.setMccMncData(resolve);
						angular.forEach(mccMnc, function(value,key){
							$scope.config[key] = value;
						});
						
			        }, function(reject){
			        	alert(reject);   
			        	//return response;
			        });										
					
				}
			]);
