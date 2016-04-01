threeGppHssApp.factory('pcType', function() {

	var getPcType = function(type) {

		var nameSpace;

		if (type === "subscriber") {
			//rest call
			nameSpace = "HLR_SUBSCRIBER_v45";
		} else if (type === "nsr") {

		}

		return nameSpace;
	}

	return ({
		getPcType : getPcType
	});
});
