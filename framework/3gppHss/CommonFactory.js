threeGppHssApp
		.factory(
				'commonFactory',
				[
						'$window',
						'spmlRequestType',
						'restProcessor',
						'restProvider',
						function($window, spmlRequestType, restProcessor,
								restProvider) {
							var commonData = {};
							var aucDataList = [];
							var hlrDataList = [];
							var hssData = {};
							var nsrData = {};
							var response = "output: "
							var searchCondition = {};

							var getJsonResponse = function(type, operation) {
								var dataObject = {};
								var reqJsonObject;

								if (type === "subscriber") {
									if (operation === "add"
											|| operation === "modify") {
										addAttribute(dataObject, "identifier",
												commonData['identifier']);
										addAttribute(dataObject, "xsi.type",
												spmlRequestType.getType(type));

										if (aucDataList.length > 0) {
											addAttribute(dataObject, "auc",
													aucDataList);
										}

										if (hlrDataList.length > 0) {
											addAttribute(dataObject, "hlr",
													hlrDataList);
										}

										if (isEmpty(hssData) != true) {
											addAttribute(dataObject, "hss",
													hssData);
										}

										if (operation === "add") {
											reqJsonObject = spmlRequestType
													.createSubscriberJsonObject(
															dataObject, type);
										} else if (operation === "modify") {
											reqJsonObject = spmlRequestType
													.modifySubscriberJsonObject(
															dataObject,
															type,
															commonData['identifier']);
										}
									} else if (operation === "delete") {
										reqJsonObject = spmlRequestType
												.deleteSubscriberJsonObject(
														type,
														commonData['identifier']);
									} else if (operation === "search") {
										reqJsonObject = spmlRequestType
												.searchSubscriberJsonObject(
														searchCondition, type);
									}

								} else if (type === "nsr") {
									if (isEmpty(nsrData) != true) {
										addAttribute(dataObject, "hss", nsrData);
									}
								}

								var url = restProvider.getRestUrl(type,
										operation);

								var myPromise = restProcessor
										.restRequestProcesser(url,
												reqJsonObject);

								myPromise
										.then(
												function(resolve) {
													if (operation === "search") {
														if (resolve['data']['spml.searchResponse']['result'] === 'success') {
															getDataFromSearchResp(resolve);
															$window.location.href = '#/auc';
														} else if (resolve['data']['spml.searchResponse']['result'] === 'failure') {
															addCommonData(resolve['data']['spml.searchResponse']);
														}
													} else if (operation === "delete"
															|| operation === "add"
															|| operation === "modify") {
														if (resolve['data']['spml.'
																+ operation
																+ 'Response']['result'] === 'success') {
															$window.location.href = '#/auc';
														} else if (resolve['data']['spml.'
																+ operation
																+ 'Response']['result'] === 'failure') {
															addCommonData(resolve['data']['spml.'
																	+ operation
																	+ 'Response']);
														}
													}
												}, function(reject) {
													alert(reject)
												});
							}

							function getDataFromSearchResp(searchResp) {
								angular
										.forEach(
												searchResp['data']['spml.searchResponse']['objects'],
												function(item) {
													addCommonData(item);
													angular
															.forEach(
																	item['auc'],
																	function(
																			auc) {
																		saveAucData(auc);
																	}, {});

												}, {});
							}

							function isEmpty(obj) {
								for ( var prop in obj) {
									if (obj.hasOwnProperty(prop))
										return false;
								}
								return true;
							}

							function addAttribute(obj, name, value) {
								obj[name] = value;
							}

							var saveHlrData = function(hlrData) {
								hlrDataList.push(hlrData);
								return (hlrDataList);
							};

							var deleteHlrData = function(index) {
								hlrDataList.splice(index, 1);
								return (hlrDataList);
							};

							var saveAucData = function(aucData) {

								var duplicateItem;

								angular.forEach(aucDataList, function(item) {

									if (item['imsi'] === aucData['imsi']) {
										duplicateItem = item;
									}

								}, {});

								if (!angular.isUndefined(duplicateItem)) {
									var duplicateItemIndex = aucDataList
											.indexOf(duplicateItem);
									aucDataList.splice(duplicateItemIndex, 1);
								}

								aucDataList.push(aucData);
								return (aucDataList);
							};

							var deleteAucData = function(index) {
								aucDataList.splice(index, 1);
								return (aucDataList);
							};

							var addCommonData = function(data) {
								angular.forEach(data, function(value, key) {
									commonData[key] = value;
								}, {});

							}

							var addSearchCondition = function(data) {
								angular.forEach(data, function(value, key) {
									searchCondition['name'] = key;
									searchCondition['value'] = value;
								}, {});
							}

							return ({
								aucDataList : aucDataList,
								saveAucData : saveAucData,
								deleteAucData : deleteAucData,
								getJsonResponse : getJsonResponse,
								response : response,
								addCommonData : addCommonData,
								addSearchCondition : addSearchCondition,
								commonData : commonData
							});
						} ]);
