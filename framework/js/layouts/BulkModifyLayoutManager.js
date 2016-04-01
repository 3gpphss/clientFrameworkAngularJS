/*
 * BulkModifyLayoutManager: Responsible for Bulk Modify layout design and delegate request to controller.
 * 
 */
define([ 'BulkOperationLayoutManager', 'frameworkPath/layouts/TreeLayoutUtil', 'frameworkPath/layouts/HtmlLayoutUtil', 'text!framework/templates/bulkModifyTemplate.html'], 
		function(BulkOperationLayoutManager, TreeLayoutUtil, HtmlLayoutUtil, bulkModifyTemplate) {
	return BulkOperationLayoutManager.extend({
		template : _.template(bulkModifyTemplate),
		filterTextArea: "#bulkModifyFilter",
		modificationTextArea: "#modificationTextArea",
		cachedFcoToModificationData: {},
		rootId: "BM", // BulkModify
		isModifyClicked: false,
		CHOOSE_SCO_TO_MODIFY: "Choose Object to Modify",
		BACK: "Back",
		blockNo : 0,
		
		events: {
			'click #submitBulkModify' : 'onSubmitModify',
			'click #clearModificationTextAreaBtn': 'clearModificationTextArea',
			'click #validateModificationBtn': 'validateModification',
			'click .tree-toggler': 'toggleTree',
			'click .childSco': 'updateSelectedSco',
			'click #modifyScoBtn': 'setScoForModification',
			'change #modifyOperation' : 'toggleAddButton',
			'click .flatAttribute' : 'applyCondition'
		},
		initialize : function() {
			this.$el = $("#bulkModifyDiv");
		},
		postDisplayLayout : function(requestContext) {
			// Set Filter
			this.$el.find(this.filterTextArea).val(requestContext.getFilter());

			// Create FCO tree
			this.populateFcoDetails(requestContext);
			// Set cached modification
			if(!(this.fcoName == requestContext.getBulkFcoType() && this.pcName == requestContext.getRequestVersion())){
				this.fcoName = requestContext.getBulkFcoType();
				this.pcName = requestContext.getRequestVersion();
				this.setModificationToTextArea(this.getCachedFcoToModificationData(requestContext.getBulkFcoType(), requestContext.getRequestVersion()));
			}
		},
		populateFcoDetails : function(requestContext){
			this.getFcoDetails(requestContext);
		},
		getFcoDetails: function(requestContext) {
			this.controller.getFcoDetails(requestContext);
		},
		populateModificationDiv: function(treeData) {
			this.treeData = treeData;
			this.clearTreeData();
			this.clearFlatAttributesData();
			this.clearModificationTextArea();
			this.populateServicesDiv();
			this.resetModifyScoBtn();
		},
		clearTreeData: function() {
			this.$el.find("#modificationServicesTree").html("");
		},
		clearFlatAttributesData: function() {
			this.$el.find("#modificationAttributesTableBody").html("");
		},
		populateServicesDiv: function() {
			this.$el.find("#modificationServicesTree").append(TreeLayoutUtil.createTree(this.treeData , this.rootId));
		}, 
		toggleTree: function(ev) {
			TreeLayoutUtil.toggleTree(ev);
		},
		updateSelectedSco: function(ev) {
			this.highlightSelectedItem(ev.currentTarget);
			this.selectedScoName = (ev.currentTarget.id).substring(0, ev.currentTarget.id.length - this.rootId.length);
			if(this.isModifyClicked) {
				this.populateAttributesTable();
			}
		},
		showFirstLevelTree: function() {
			var firstChild = $("#modificationServicesTree").find(".childSco").first();
			this.highlightSelectedItem(firstChild);
			// Show only FCO immediate child by default
			$("#modificationServicesTree").find(".icon-minus-sign").addClass('icon-plus-sign').removeClass('icon-minus-sign');
			$("#modificationServicesTree").find(".icon-plus-sign").first().addClass('icon-minus-sign').removeClass('icon-plus-sign');
			this.selectedScoName = firstChild.attr("id").substring(0, firstChild.attr("id").length - this.rootId.length);
			this.$el.find('.tree ul').hide();
		},
		highlightSelectedItem: function(item) {
			$("#modificationServicesTree").find(".childSco.aSelectedItem").addClass("aUnselectedItem").removeClass("aSelectedItem");
			$(item).addClass("aSelectedItem").removeClass("aUnselectedItem");
		},
		getLayoutData : function(){
			var data = {"filter": undefined, "modifications": undefined};
			if(this.$el.find(this.filterTextArea).val() != undefined) {
				data.filter= this.$el.find(this.filterTextArea).val().trim();
			}
			if(this.$el.find(this.modificationTextArea).val() != undefined) {
				data.modifications= this.$el.find(this.modificationTextArea).val().trim();
			}
			return data;
		},
		onSubmitModify : function() {
			this.clearBulkStatusDiv();
			this.controller.onSubmitModify(this.getBulkNavigationData());
		},
		cacheModificationData: function(fcoName, pcName) {
			this.setCachedFcoToModificationData(fcoName, pcName, this.getModificationFromTextArea());
		},
		getCachedFcoToModificationData: function(fcoName, pcName) {
			return this.cachedFcoToModificationData[fcoName + "_" + pcName] ? this.cachedFcoToModificationData[fcoName + "_" + pcName] : "";
		},
		setCachedFcoToModificationData: function(fcoName, pcName, modification) {
			this.cachedFcoToModificationData[fcoName + "_" + pcName] = modification;
		},
		getModificationFromTextArea: function() {
			return this.$el.find(this.modificationTextArea) ? this.$el.find(this.modificationTextArea).val().trim() : "";
		},
		setModificationToTextArea: function(modification) {
			this.$el.find(this.modificationTextArea).val(modification);
		},
		clearModificationTextArea: function(ev) {
			if(this.modificationTextArea) {
				this.$el.find(this.modificationTextArea).val("");
			}
			if(ev != undefined){
				this.blockNo = 0;
			}
		},
		validateModification: function(ev) {
			this.clearBulkStatusDiv();
			var modification = this.getModificationFromTextArea();
			if(!modification) {
				alert("Modification is empty. Enter a modification");
			} else {
				if(this.controller.validateModification(modification)) {
					this.controller.displayMessage("Modification(s) is(are) syntactically valid");
				}
			}
		},
		setScoForModification: function(ev) {
			this.selectedScoToModify = this.selectedScoName;
			this.populateAttributesTable();
			this.toggleChooseScoBtn(ev);
		},
		toggleChooseScoBtn: function(ev) {
			if(ev.currentTarget.textContent == this.CHOOSE_SCO_TO_MODIFY) {
				this.isModifyClicked = true;
				ev.currentTarget.textContent = this.BACK;
				this.findModificationBlockNo();
				this.toggleScoTree("hide");
				this.populateModifyScoType();
			} else {
				this.toggleScoTree("show");
				this.resetModifyScoBtn();
				this.resetLayoutOnBackBtn();
			}
		},
		toggleScoTree : function(toggle){
			if(toggle === "show"){
				$( "#modificationServicesTree > li" ).find( ":hidden" ).show();
				$("#modificationServicesTree > li > a.childSco.aUnselectedItem").show();
				$("#modificationServicesTree > li > a.childSco.aUnselectedItem").siblings("label").show();
			}else{
				var maintag = $("#modificationServicesTree");
				var reflection =  function(that){
					var parentTree = $(that).parent().parent();
					$(parentTree).siblings().hide();
					if(parentTree.get(0) != maintag.get(0)){
						reflection(parentTree);
					}
				}
				reflection($("#modificationServicesTree .aSelectedItem"));
				$("#modificationServicesTree > li > a.childSco.aUnselectedItem").hide();
				$("#modificationServicesTree > li > a.childSco.aUnselectedItem").siblings("label").hide();
			}
		},
		resetModifyScoBtn: function() {
			this.$el.find("#modifyScoBtn").text(this.CHOOSE_SCO_TO_MODIFY);
			this.isModifyClicked = false;
			this.showFirstLevelTree();
			//$(ev.currentTarget).css("width", this.modifyScoBtnWidth);
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
					that.$el.find("#modificationAttributesTableBody").append(rowContent);
				});
			}
		},
		getAttrTableRow: function(uniqueName, displayName, enumValues, type) {
			var attributeNameSplit = uniqueName.split('/');
			var attributeName = attributeNameSplit[attributeNameSplit.length - 1];
			var uniqueId = HtmlLayoutUtil.getHyphenedId(uniqueName) + "Val" + this.rootId;

			var tableRowHtml = "<tr><td class='span5' style='padding-top: 5px;text-align: center'>" + displayName + "</td>" + 
			"<td class='span5' style='padding-top: 5px;text-align: center'>" + attributeName + "</td>" +
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
			"<td class='span2' style='padding-top: 3px;text-align: center'>" + this.getButton(uniqueName, "M_Btn" + this.rootId, displayName,'btn flatAttribute matchButton') + "</td>" + 
			"<td class='span2' style='padding-top: 3px;text-align: center'>" + this.getButton(uniqueName, "V_Btn" + this.rootId, displayName,'btn flatAttribute valueButton' ) + "</td>" + 
			"</tr>";
			return tableRowHtml;
		},
		getButton: function(uniqueName, rootId, displayName,classes) {
			var uniqueId = uniqueName + rootId;
			return "<button class='"+classes+"' name='" + uniqueId + "' id='" + uniqueId + "' value='" + uniqueName + "'>Add</button>";
		},
		toggleAddButton : function(ev){
			var val = ev.currentTarget.value;
			if(val == "add"){
				this.$el.find(".matchButton").attr('disabled','disabled');
			}else{
				this.$el.find(".matchButton").removeAttr('disabled');
			}
		},
		findModificationBlockNo : function(){
			var modificationTextArea = this.getModificationFromTextArea();
			var modificationArray = modificationTextArea.split("modification ") || [];
			modificationArray = this.cleanArray(modificationArray);
			
			this.blockNo = modificationArray.length;
		},
		applyCondition : function(ev){
			var val = this.$el.find("#" + HtmlLayoutUtil.getHyphenedId(ev.currentTarget.value) + "Val" + this.rootId).val();
			if(val != ''){
				this.preAddCondition();
				this.addCondition(ev,val);
				this.postAddCondition();
			}
		},
		preAddCondition : function(){
			var modificationTextArea = this.getModificationFromTextArea();
			
			this.modificationArray = modificationTextArea.split("modification ") || [];
			this.modificationArray = this.cleanArray(this.modificationArray);
			
			this.modification = this.modificationArray[this.blockNo] || this.getModificationBlock();
			this.modification = JSON.parse("{" + this.modification + "}");
			
		},
		addCondition : function(ev,val){
			var data = undefined;
			
			if($(ev.currentTarget).hasClass("matchButton")){
				this.modification.match = this.modification.match || {'type':this.$el.find("#modifyScoType").html()};
				data = this.modification.match;
			}else{
				this.modification.valueObject = this.modification.valueObject || {'type':this.$el.find("#modifyScoType").html()};
				data = this.modification.valueObject;
			}

			var accessEleTempArray = ev.currentTarget.value.split(this.selectedScoToModify+"/");
			var accessTempsArray = "";
			if(accessEleTempArray.length == 1){
				accessTempArray = accessEleTempArray[0];
			}else{
				accessTempArray = accessEleTempArray[1];
			}
			var elementArray = accessTempArray.split('/');
			var len = elementArray.length -1;
			
			
			for (var int = 0; int < elementArray.length; int++) {
				var element = elementArray[int];
				if(data[element] == undefined){
					if(TreeLayoutUtil.parseTreeDataForFields(this.treeData, element ,"multivalued")){
						data[element] = new Array();
					}else{
						data[element] = {};
					}
				}
				// if int is not leaf count of elementArray then assigning the current element to data . else assigning the val to data
				if(len != int){
					// if data[element] is array then assigning the last index content to data variable. else assigning the current content object to data variable
					if(data[element] instanceof Array){
						if(data[element].length == 0){
							data[element][0] = {}
						}
						var v = data[element][data[element].length-1]; 
						if(v[elementArray[int+1]] == undefined){
							data = v;
						}else{
							data[element][data[element].length] = {};
							data = data[element][data[element].length-1];
						}
					}else{
						data = data[element];
					}
				}else{
					data[element] = val;
				}
			}
		},
		postAddCondition : function(){
			this.modificationArray[this.blockNo] = this.modification; 
			var finalModification = '';
			for (var int = 0; int < this.modificationArray.length; int++) {
				if(int == this.blockNo){
					var mod = JSON.stringify(this.modificationArray[int]).replace(/\\\//g, "/");
					mod = mod.substring(1, mod.length-1);
				} else {
					mod = this.modificationArray[int];
				}
				if(finalModification == ""){
					finalModification = "modification "+mod;
				}else{
					finalModification = finalModification+"\n"+"modification "+mod;
				}
			}
			this.clearModificationTextArea();
			this.setModificationToTextArea(finalModification);
		
		},
		getModificationBlock : function(){
			var modificationObject = 'subscriber';
			return '"operation":"'+this.$el.find("#modifyOperation").val() +'"';
		},
		cleanArray : function(actual){
			  var newArray = new Array();
			  for(var i = 0; i<actual.length; i++){
			      if (actual[i]){
			        newArray.push(actual[i]);
			    }
			  }
			  return newArray;
		},
		populateModifyScoType : function() {
			var scoType = TreeLayoutUtil.parseTreeDataForFields(this.treeData, this.selectedScoName,"type");
			this.$el.find("#modifyScoType").html(scoType || this.selectedScoName);
		},
		resetLayoutOnBackBtn : function(){
			this.clearFlatAttributesData();
			this.$el.find("#modifyScoType").html("");
			this.$el.find('#modifyOperation').val(this.$el.find('#modifyOperation option:first-child').val());
		}
	});
});
