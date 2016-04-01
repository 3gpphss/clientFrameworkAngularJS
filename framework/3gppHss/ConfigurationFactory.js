threeGppHssApp
		.factory(
				'configurationFactory',
				[
						'spmlRequestType',
						'restProcessor',
						'restProvider',
						'$q',						
						function(spmlRequestType, restProcessor, restProvider,
								$q) {

							var mccMncTable = "";
							var mccMncConfigData = {};	
							
							var getConfigData = function() {
								console.log("configuration fac");
								var jsondata = "{\"dns\":[\"nodeName=SUBSCRIBER,dc=APPLICATIONS, dc=CONFIGURATION, dc=PGW, dc=C-NTDB\"]}";
								var defer = $q.defer();
								var url = restProvider.getRestUrl(
										"configData", "");
								console.log(jsondata);
								console.log(url);
								var res = restProcessor.restRequestProcesser(url,
										jsondata);

								res.then(function(resolve) {
									defer.resolve(resolve);
								}, function(reject) {

								}); 
								return defer.promise;
							}

							var setMccMncData = function(configData) {
								var content = "singleColumnTableEntries";
								getJsonObject(configData, content);
								angular.forEach(mccMncTable, function(value,key){
									mccMncConfigData[value['tableName'][0]] = value['value'];
								});

								return mccMncConfigData;

							}

							function getJsonObject(configData, content) {

								var keepGoing = true;

								for ( var k in configData) {
									if (configData.hasOwnProperty(k)) {
										if (k == content) {
											mccMncTable = configData[k];
											break;
										} else {
											if (isArray(configData[k])) {
												var value = configData[k];
												for ( var k1 in value) {
													if (isObject(value[k1])) {
														singleObject(value[k1],
																content);
													}
												}

											} else if (isObject(configData[k])) {
												return getJsonObject(
														configData[k], content);
											}
										}
									}
								}
							}

							function singleObject(obj, content) {
								return getJsonObject(obj, content);

							}

							function isArray(what) {
								return Object.prototype.toString.call(what) === '[object Array]';
							}
							function isObject(what) {
								return Object.prototype.toString.call(what) === '[object Object]';
							}

							return ({
								getConfigData : getConfigData,
								setMccMncData : setMccMncData
							});
						} ]);
