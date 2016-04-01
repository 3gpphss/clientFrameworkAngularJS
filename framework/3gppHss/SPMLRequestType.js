threeGppHssApp.factory('spmlRequestType', [ 'pcType', function(pcType) {

	var getType = function(type) {
		var type;
		if (type === "subscriber") {
			type = "app.Subscriber";
		} else if (type === "nsr") {

		}
		return type
	}

	var createSubscriberJsonObject = function(dataObject, type) {
		var jsonReq = {};
		jsonReq['spml.addRequest'] = {};
		var obj = jsonReq['spml.addRequest'];
		addAttribute(obj, "language", "en_en");
		addAttribute(obj, "version", pcType.getPcType(type));
		addAttribute(obj, "object", dataObject);
		return jsonReq;
	}

	var modifySubscriberJsonObject = function(dataObject, type, identifier) {
		var jsonReq = {};
		jsonReq['spml.modifyRequest'] = {};
		var obj = jsonReq['spml.modifyRequest'];
		addAttribute(obj, "language", "en_en");
		addAttribute(obj, "objectclass", "Subscriber");
		addAttribute(obj, "identifier", identifier);
		addAttribute(obj, "version", pcType.getPcType(type));
		
		var modification = [{}];
		
		angular.forEach(modification, function(json) {
			json['operation'] = 'addorset';
			json['valueObject'] = dataObject;
		}, {});		
		
		addAttribute(obj, "modification", modification);
		return jsonReq;
	}

	var deleteSubscriberJsonObject = function(type, identifier) {
		var jsonReq = {};
		jsonReq['spml.deleteRequest'] = {};
		var obj = jsonReq['spml.deleteRequest'];
		addAttribute(obj, "language", "en_en");
		addAttribute(obj, "objectclass", "Subscriber");
		addAttribute(obj, "identifier", identifier);
		addAttribute(obj, "version", pcType.getPcType(type));
		
		return jsonReq;
	}

	var searchSubscriberJsonObject = function(dataObject, type) {
		var jsonReq = {};
		jsonReq['spml.searchRequest'] = {};
		var obj = jsonReq['spml.searchRequest'];
		addAttribute(obj, "language", "en_en");
		addAttribute(obj, "version", pcType.getPcType(type));
		
		var base = {};
		
		addAttribute(base, 'alias', dataObject);
		addAttribute(base, 'objectclass', "Subscriber");
		
		
		addAttribute(obj, 'base', base); 
		return jsonReq;
	}

	function addAttribute(obj, name, value) {
		obj[name] = value;
	}

	return ({
		getType : getType,
		createSubscriberJsonObject : createSubscriberJsonObject,
		modifySubscriberJsonObject : modifySubscriberJsonObject,
		deleteSubscriberJsonObject : deleteSubscriberJsonObject,
		searchSubscriberJsonObject : searchSubscriberJsonObject
	});
} ]);
