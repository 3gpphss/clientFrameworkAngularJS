/*
 * HtmlLayoutUtil: Utility to get html contents.
 */
define(function(){
	return {
		getComboFiled: function(uniqueId, enumValues) {
			var comboFieldHtml = "<select style='width:95px' id='" + uniqueId + "' name='" + uniqueId + "'>";
			if(enumValues && enumValues.length > 0) {
				for(var i = 0; i < enumValues.length; i++) {
					comboFieldHtml = comboFieldHtml + "<option value='" + enumValues[i] + "'>" + enumValues[i] + "</option>";
				}
			}
			return comboFieldHtml + "</select>";
		},
		getBooleanComboFiled: function(uniqueId) {
			return this.getComboFiled(uniqueId, ["true","false"]);
		},
		// It is not safe to have '/' in HTML element id. Hence replacing all '/' with '-'. '/' is also not supported as part of HTML id.
		getHyphenedId: function(uniqueId) {
			return uniqueId.replace(/\//g, "-");
		},
		getTextFiled: function(uniqueId, displayName) {
			return "<input type='text' class='span' title='Enter a value' placeholder='" + displayName + "' id='" + uniqueId + "' name='" + uniqueId + "'/>";
		}
	};
});




