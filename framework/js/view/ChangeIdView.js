/*
 * ServiesView: is responsible to handle the drop-down for services to be added to a particular FCO.
 * 		
 */
define(['frameworkViews/FrameworkView', 'text!framework/templates/changeIdDataTemplate.html'],
		function(FrameworkView, changeIdDataTemplate){
	return FrameworkView.extend({
		template: _.template(changeIdDataTemplate),
		initialize : function() {
			this._modelBinder = new Backbone.ModelBinder();
		},
		events : {
			"change #identityType": "changeDom"
		},
		render : function(){
			this.appendEl();
			this.delegateEvents();
			this.bindModel();
			this.populateKeys();
		},
		changeDom : function(ev){
			var changeData = this.getChangeIdProceedingAndSwap(ev.currentTarget.value);
			this.populateChangeIdProceeding(changeData.changeIdProceeding);
			this.toggleCheckSwap(changeData.swap);
			this.setSwapIdentifier(changeData.swapIdentifier);
		},
		populateChangeIdProceeding : function(changeIdProceedingList){
			this.model.set("changeIdProceeding","",{silent:true});
			this.$el.find("#changeIdProceeding").html('');
			for ( var i = 0; i < changeIdProceedingList.length; i++) {
				var newRadio = '<input type="radio" name="TIME" value="'+changeIdProceedingList[i].dropdownValue+'" id="'+changeIdProceedingList[i].dropdownKey+'"> '+ changeIdProceedingList[i].dropdownKey;
				this.$el.find("#changeIdProceeding").append(newRadio);
			}
		},
		appendSelect : function(dropDownId) {
			this.$el.find('#' + dropDownId).empty();
			this.$el.find('#' + dropDownId).append('<option value="">Select</option>');
		},
		populateKeys : function(){
			this.appendSelect("identityType");
			for ( var i = 0; i < this.data.length; i++) {
				var newOption = $('<option value="' + this.data[i].key + '">'+ this.data[i].key + '</option>');
				this.$el.find("#identityType").append(newOption);
			}
		},
		toggleCheckSwap : function(swap){
			if(swap == true){
				this.$el.find('input:radio[name=TIME]:nth(0)').prop('checked',true);
				this.$el.find("#swapDiv").show();
				this.model.set("TIME","swap");
			}else{
				this.$el.find('input:radio[name=TIME]:nth(0)').prop('checked',false);
				this.$el.find("#swapDiv").hide();
				this.model.set("TIME","");
			}
		},
		getChangeIdProceedingAndSwap: function(value){
			var data = {"changeIdProceeding":"","swap":false,"swapIdentifier":""};
			for ( var int = 0; int < this.data.length; int++) {
				key = this.data[int]["key"];
				if (key === value) {
					data.changeIdProceeding = this.data[int]['changeIdProceeding'];
					data.swap = this.data[int]['swap'];
					data.swapIdentifier = this.data[int]['swapIdentifier'];
				}
			}
			return data;
		},
		setSwapIdentifier : function(setSwapIdentifier){
			this.model.set("setSwapIdentifier",setSwapIdentifier);
		}
	});
});