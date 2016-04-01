/*
 * BulkFilterLayoutManager: Responsible for Bulk Filter layout design and delegate request to controller.
 * 
 */
define(['BulkOperationLayoutManager', 'frameworkPath/layouts/TreeLayoutUtil', 'frameworkPath/layouts/HtmlLayoutUtil', 'text!framework/templates/bulkFilterTemplate.html'],
		function(BulkOperationLayoutManager, TreeLayoutUtil, HtmlLayoutUtil, bulkFilterTemplate){
	return BulkOperationLayoutManager.extend({
		template: _.template(bulkFilterTemplate),
		OPEN_PAREN: "(",
		CLOSE_PAREN: ")",
		EQUALITY_OPERATOR: "==",
		LESSTHAN_OPERATOR: "<=",
		GREATERTHAN_OPERATOR: ">=",
		AND_JOIN_OPERATOR: "AND",
		OR_JOIN_OPERATOR: "OR",
		NOT_JOIN_OPERATOR: "NOT",
		AND_NOT_JOIN_OPERATOR: "AND NOT",
		OR_NOT_JOIN_OPERATOR: "OR NOT",
		SINGLE_QUOTE: "'",
		filterTextArea: "#filterTextArea",
		cachedFcoToFilterData: {},
		rootId: "", // BulkFilter

		events: {
			'click .flatAttribute': 'addToFilterContent',
			'click #clearFilterTextAreaBtn': 'clearFilterTextArea',
			'click #validateFilterBtn': 'validateFilter',
			'click .tree-toggler': 'toggleTree',
			'click .childSco': 'populateAttributesDiv',
			'change #filterTextArea': 'updateJoinOpersCombo'
		},
		initialize : function(){
			this.$el = $("#bulkFilterDiv");
		},
		postDisplayLayout : function(requestContext){
			this.populateFcoDetails(requestContext);
		},
		populateFcoDetails : function(requestContext){
			this.getFcoDetails(requestContext);
		},
		getFcoDetails: function(requestContext) {
			this.controller.getFcoDetails(requestContext);
		},
		populateFilterDiv: function(treeData) {
			this.treeData = treeData;
			this.clearTreeData();
			this.clearFlatAttributesData();
			this.clearFilterTextArea();
			this.populateServicesDiv();
			this.populateAttributesDiv();
			this.setFilterToTextArea(this.getCachedFcoToFilterData(this.controller.fcoName, this.controller.pcName));
			this.updateJoinOpersCombo();
		},
		clearTreeData: function() {
			this.$el.find("#filterServicesTree").html("");
		},
		clearFlatAttributesData: function() {
			this.$el.find("#filterAttributesTableBody").html("");
		},
		populateServicesDiv: function() {
			this.$el.find("#filterServicesTree").append(TreeLayoutUtil.createTree(this.treeData, this.rootId));
		}, 
		populateAttributesDiv: function(ev) {
			if(!ev) {
				// If ev is undefined, show the attributes for first item in the tree
				if(this.treeData) {
					// Highlight and display attributes the first element in the tree
					this.createTable(this.treeData.get("attributes"));
					this.highlightSelectedItem($("#filterServicesTree").find(".childSco.aUnselectedItem").first());
					// Show only FCO immediate child by default
					$("#filterServicesTree").find(".icon-plus-sign").first().addClass('icon-minus-sign').removeClass('icon-plus-sign');
					this.$el.find('.tree ul').hide();
				}
			} else {
				this.highlightSelectedItem(ev.currentTarget);
				this.selectedScoName = (ev.currentTarget.id).substring(0, ev.currentTarget.id.length - this.rootId.length);
				this.populateAttributesTable();	
			}
			this.updateJoinOpersCombo();
		},
		highlightSelectedItem: function(item) {
			$("#filterServicesTree").find(".childSco.aSelectedItem").addClass("aUnselectedItem").removeClass("aSelectedItem");
			$(item).addClass("aSelectedItem").removeClass("aUnselectedItem");
		},
		populateAttributesTable: function() {
			var attributes = TreeLayoutUtil.getAttributes(this.treeData, this.selectedScoName);
			this.createTable(attributes);
		},
		createTable: function(flatAttributes) {
			this.clearFlatAttributesData();
			if(flatAttributes) {
				var that = this;
				flatAttributes.each(function(flatAttribute) {
					var rowContent = that.getAttrTableRow(flatAttribute.get("uniqueName"), flatAttribute.get("displayName"), flatAttribute.get("enumValues"), flatAttribute.get("type"));
					that.$el.find("#filterAttributesTableBody").append(rowContent);
				});
			}
		},
		getAttrTableRow: function(uniqueName, displayName, enumValues, type) {
			var uniqueId = HtmlLayoutUtil.getHyphenedId(uniqueName) + "Val" + this.rootId;
			var tableRowHtml = "<tr><td class='span5' style='padding-top: 5px;text-align: center'>" + displayName + "</td>" + 
			"<td class='span3' style='padding-top: 5px;text-align: center'>" + this.getJoinOperatorCombo(uniqueName) + "</td>" +
			"<td class='span5' style='padding-top: 5px;text-align: center'>" + uniqueName + "</td>" +
			"<td class='span3' style='padding-top: 5px;text-align: center'>" + this.getMatchOperatorCombo(uniqueName) + "</td>" +
			"<td class='span6' style='padding-top: 5px;'>";

			if(enumValues == null) {
				if(type == "boolean") {
					// Create drop down for boolean
					tableRowHtml = tableRowHtml + HtmlLayoutUtil.getBooleanComboFiled(uniqueId);
				} else {
					// Create text field for vlaue
					tableRowHtml = tableRowHtml + HtmlLayoutUtil.getTextFiled(uniqueId, displayName);
				}
			} else {
				// Create dropdown for allowed enum values
				tableRowHtml = tableRowHtml + HtmlLayoutUtil.getComboFiled(uniqueId, enumValues);
			}

			tableRowHtml = tableRowHtml + "</td>" + 
			"<td class='span2' style='padding-top: 3px;text-align: center'>" + this.getButton(uniqueName, displayName) + "</td>" + 
			"</tr>";
			return tableRowHtml;
		},
		getMatchOperatorCombo: function(uniqueName) {
			// "MO" for Match Operator 
			var hyphendId = HtmlLayoutUtil.getHyphenedId(uniqueName) + "MO";
			var comboFieldHtml = "<select id='" + hyphendId + "' name='" + hyphendId + "' style='width: 70px'>" +
			"<option value='" + this.EQUALITY_OPERATOR + "'>" + this.EQUALITY_OPERATOR + "</option>" +
			"<option value='" + this.LESSTHAN_OPERATOR + "'>" + this.LESSTHAN_OPERATOR + "</option>" +
			"<option value='" + this.GREATERTHAN_OPERATOR + "'>" + this.GREATERTHAN_OPERATOR + "</option>" +
			"</select>";

			return comboFieldHtml;
		},
		getJoinOperatorCombo: function(uniqueName) {
			// "MO" for Match Operator 
			var hyphendId = HtmlLayoutUtil.getHyphenedId(uniqueName) + "JO";
			var comboFieldHtml = "<select id='" + hyphendId + "' name='" + hyphendId + "' style='width: 70px'>" +
			"<option class='not-join-operators' value=''></option>" +
			"<option class='other-join-operators' value='" + this.AND_JOIN_OPERATOR + "'>" + this.AND_JOIN_OPERATOR + "</option>" +
			"<option class='other-join-operators' value='" + this.OR_JOIN_OPERATOR + "'>" + this.OR_JOIN_OPERATOR + "</option>" +
			"<option class='not-join-operators' value='" + this.NOT_JOIN_OPERATOR + "'>" + this.NOT_JOIN_OPERATOR + "</option>" +
			"<option class='other-join-operators' value='" + this.AND_NOT_JOIN_OPERATOR + "'>" + this.AND_NOT_JOIN_OPERATOR + "</option>" +
			"<option class='other-join-operators' value='" + this.OR_NOT_JOIN_OPERATOR + "'>" + this.OR_NOT_JOIN_OPERATOR + "</option>" +
			"</select>";

			return comboFieldHtml;
		},
		getButton: function(uniqueName, displayName) {
			return "<button class='btn flatAttribute' name='" + uniqueName + "Btn' id='" + uniqueName + "btn' value='" + uniqueName + "'>Add</button>";
		},
		addToFilterContent: function(ev) {
			var filter = this.getFilterFromTextArea();
			var joinOperator = this.$el.find("#" + HtmlLayoutUtil.getHyphenedId(ev.currentTarget.value) + "JO").val();
			var appendFilter = (joinOperator == "" ? "" : joinOperator + " " ) + this.getFilterContent(ev);
			this.clearFilterTextArea();
			if(filter == "") {
				filter = appendFilter;
				this.showOthersInJoinOpersCombo();
			} else {
				filter = filter + " " + appendFilter;
			}
			this.setFilterToTextArea(filter);
		},
		getFilterContent: function(ev) {
			return this.OPEN_PAREN + ev.currentTarget.value + " " + this.$el.find("#" + HtmlLayoutUtil.getHyphenedId(ev.currentTarget.value) + "MO").val() + 
			" " + this.SINGLE_QUOTE + this.$el.find("#" + HtmlLayoutUtil.getHyphenedId(ev.currentTarget.value) + "Val" + this.rootId).val() + this.SINGLE_QUOTE + this.CLOSE_PAREN;
		},
		getBulkModel: function() {
			if(this.controller) {
				return this.controller.getBulkModel();
			}
		},
		toggleTree: function(ev) {
			TreeLayoutUtil.toggleTree(ev);
		},
		validateFilter: function(ev) {
			var filter = this.getFilterFromTextArea();
			if(!filter) {
				alert("Filter is empty. Enter a filter");
			} else {
				this.controller.validateFilter(filter);
			}
		},
		cacheFilterData: function(fcoName, pcName) {
			this.setCachedFcoToFilterData(fcoName, pcName, this.getFilterFromTextArea());
		},
		getCachedFcoToFilterData: function(fcoName, pcName) {
			return this.cachedFcoToFilterData[fcoName + "_" + pcName] ? this.cachedFcoToFilterData[fcoName + "_" + pcName] : "";
		},
		setCachedFcoToFilterData: function(fcoName, pcName, filter) {
			this.cachedFcoToFilterData[fcoName + "_" + pcName] = filter;
		},
		getFilterFromTextArea: function() {
			return this.$el.find(this.filterTextArea).val().trim(); // TODO: CHeck for undefined
		},
		setFilterToTextArea: function(filter) {
			this.$el.find(this.filterTextArea).val(filter);
		},
		showNotInJoinOpersCombo: function() {
			this.$el.find(".other-join-operators").hide();
			this.$el.find(".not-join-operators").show();
			this.$el.find(".not-join-operators").parent().prop("selectedIndex", 0);
		},
		showOthersInJoinOpersCombo: function() {
			this.$el.find(".not-join-operators").hide();
			this.$el.find(".other-join-operators").show();
			this.$el.find(".other-join-operators").parent().prop("selectedIndex", 1);
		},
		updateJoinOpersCombo: function(ev) {
			if(this.getFilterFromTextArea() == "") {
				this.showNotInJoinOpersCombo();
			} else {
				this.showOthersInJoinOpersCombo();
			}
		},
		clearFilterTextArea: function(ev) {
			BulkOperationLayoutManager.prototype.clearFilterTextArea.call(this);
			// Update Join operators combo only on click action of "clear text area" button.
			if(ev) {
				this.updateJoinOpersCombo();
			}
		}
	});
});