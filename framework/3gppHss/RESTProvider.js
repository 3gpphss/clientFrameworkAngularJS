threeGppHssApp.factory('restProvider', function() {

	var getRestUrl = function(type, operation) {

		var restUrl;

		if (type === "subscriber") {
			if (operation === "add") {
				restUrl = "tenent/appdata/addrequest.htm";
			} else if (operation === "modify") {
				restUrl = "tenent/appdata/modifyrequest.htm";				
			} else if (operation === "delete") {
				restUrl = "tenent/appdata/deleterequest.htm";	
			} else if (operation === "search") {
				restUrl = "tenent/appdata/searchrequest.htm";
			}

		} else if (type === "nsr") {
			if (operation === "add") {
				// inprogress
			} else if (operation === "modify") {
				// inprogress
			} else if (operation === "delete") {
				// inprogress
			} else if (operation === "delete") {
				// inprogress
			}
		} else if(type == "configData"){
			restUrl = "appConfig/tenant/configData.htm";
		}

		return restUrl;
	}

	return ({
		getRestUrl : getRestUrl
	});
});
