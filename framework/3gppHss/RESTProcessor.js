threeGppHssApp.factory('restProcessor', ['$http', '$q', function($http, $q) {

	var restRequestProcesser = function(url, data) {
		
		console.log('input : ' + JSON.stringify(data, null, "    "));
		
		var deferred = $q.defer();


		return $http.post(url, data).success(function(output, status) {
			console.log('output : ' + JSON.stringify(output, null, "    "));
			
			deferred.resolve(output);
		}).error(function(output, status){
			deferred.reject('ERROR');
		});
		
		 return deferred.promise;
	}

	return ({
		restRequestProcesser : restRequestProcesser
	});
} ]);
