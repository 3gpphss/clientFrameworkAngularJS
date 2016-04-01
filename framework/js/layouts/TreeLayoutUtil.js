/*
 * TreeLayoutUtil: Utility to get html content for tree structure.
 */
define(function(){
	return {
		createTree: function(data, rootId) {
			this.rootId = rootId;
			var that = this;
			if(data) {
				var subTreeHtml;
				if(data.get("secondClassObjects")) {
					subTreeHtml = this.getNonLeafHtml(data.get("uniqueName"), data.get("displayName"));
					data.get("secondClassObjects").each(function(childSCO) {
						subTreeHtml = subTreeHtml + that.wrapUl(that.createTree(childSCO, that.rootId));
					});
					subTreeHtml = this.wrapLabelLi(subTreeHtml);
				} else {
					subTreeHtml = this.getLeafHtml(data.get("uniqueName"), data.get("displayName"));
					subTreeHtml = this.wrapLi(subTreeHtml);
				}
			}
			return subTreeHtml;
		},
		getLeafHtml: function(uniqueName, displayName) {
			return this.getTreeLiHyperLinkHtml(uniqueName, displayName);
		},
		getNonLeafHtml: function(uniqueName, displayName) {
			return this.getLabelHtml(uniqueName) + this.getTreeLiHyperLinkHtml(uniqueName, displayName);
		},
		getLabelHtml: function(uniqueName) {
			var hyphendId = this.getHyphenedId(uniqueName) + "Icon" + this.rootId;
			return "<label class='tree-toggler nav-header' style='float: left'><i id='" + hyphendId + "' class='icon-plus-sign'></i>&nbsp;</label>";
		},
		getTreeLiHyperLinkHtml: function(uniqueName, displayName) {
			return "<a class='childSco aUnselectedItem' id='" + uniqueName + this.rootId + "'>" + displayName + "</a>";
		},
		wrapLabelLi: function(htmlContent) {
			return "<li>" + htmlContent + "</li>";
		},
		wrapLi: function(htmlContent) {
			return "<li class='tree'>" + htmlContent + "</li>";
		},
		wrapUl: function(htmlContent) {
			return "<ul class='nav nav-list tree'>" + htmlContent + "</ul>";
		},
		// It is not safe to have '/' in HTML element id. Hence replacing all '/' with '-'. '/' is also not supported as part of HTML id.
		getHyphenedId: function(uniqueName) {
			return uniqueName.replace(/\//g, "-");
		},
		toggleTree: function(ev) {
			$(ev.currentTarget).parent().children('ul.tree').toggle();		      
			if($(ev.currentTarget).find(' > i.icon-plus-sign').length > 0) {
				$(ev.currentTarget).find(' > i').addClass('icon-minus-sign').removeClass('icon-plus-sign');
			} else {
				$(ev.currentTarget).find(' > i').addClass('icon-plus-sign').removeClass('icon-minus-sign');
			}
		},
		getAttributes: function(data, scoName) {
			return this.parseTreeDataForAttrs(data, scoName);
		},
		parseTreeDataForAttrs: function(data, scoName) {
			var attributes;
			if(data) {
				if(data.get("uniqueName") == scoName) {
					return data.get("attributes");
				} else {
					if(data.get("secondClassObjects")) {
						for(var i = 0; i < data.get("secondClassObjects").size(); i++) {
							var childSco = data.get("secondClassObjects").at(i);
							attributes = this.parseTreeDataForAttrs(childSco, scoName);
							if(attributes) {
								break;
							}
						}
					}
				}
			}
			return attributes;
		},
		parseTreeDataForFields: function(data, scoName, fieldName) {
			var fieldValue;
			if(data) {
				if(data.get("uniqueName") == scoName) {
					return data.get(fieldName);
				} else {
					if(data.get("secondClassObjects")) {
						for(var i = 0; i < data.get("secondClassObjects").size(); i++) {
							var childSco = data.get("secondClassObjects").at(i);
							fieldValue = this.parseTreeDataForFields(childSco, scoName,fieldName);
							if(fieldValue) {
								break;
							}
						}
					}
				}
			}
			return fieldValue;
		}
	};
});




