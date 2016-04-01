/*
 * FrameworkHelper: helper for client side framework
 */
define(['BaseCollection'], function(BaseCollection){
	Array.prototype.remove = function(element) {
		var index = this.indexOf(element);
		if(index > -1) {
			this.splice(index, 1);
		}
	};
	// Shallow copy
	Array.prototype.clone = function() {
		return this.slice(0);
	};
	return {
		replaceErrorParams :function(string, replacements) {
			return string.replace(/\{(\d+)\}/g, function() {
				return replacements[arguments[1]] || arguments[0];
			});
		},

		// Assumption: any array will be a collection of similar type of data. Array with multi-type data is not supported
		// strModel: Backbone nested model object
		createNestedModel: function(strModel) {
			for(attr in strModel.attributes) {
				if(_.isArray(strModel.get(attr))) {
					// If array is empty, its not sure that it is a collection of objects or flat attributes. So unset it from the model.
					if(strModel.get(attr).length == 0) {	
						strModel.unset(attr, {silent: true}); 
					} else {
						var isNestedModel = strModel.get(attr).length > 0 ?  
											((typeof strModel.get(attr)[0] == "object") || (typeof strModel.get(attr)[0] == "array")) :
											false;
								if(isNestedModel) {
									var coll = new BaseCollection(strModel.get(attr));
									strModel.set(attr, coll, {silent: true});
									/*for(item in coll.models) {
										this.createNestedModel(coll.models[item]);
									} */
									for (var i=0; i<coll.length; i++) {
									 	this.createNestedModel(coll.at(i));
									}
								}
					}
				} else if(_.isObject(strModel.get(attr))) {
					var obj = new Backbone.NestedModel(strModel.get(attr));
					strModel.set(attr, obj, {silent: true});
					this.createNestedModel(strModel.get(attr));
				}
			}
		},				
		createUUID : function(){
		       var s = [];
		    var hexDigits = "0123456789abcdef";
		    for (var i = 0; i < 25; i++) {
		     s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		    }
		    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		    s[8] = s[20] = ":";

		    var uuid = s.join("");
		    return uuid;
		  }
	};
});




