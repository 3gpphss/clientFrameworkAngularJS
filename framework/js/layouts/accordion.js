define(function(){
	return {
		wrapDiv : function(id, operation){
			$("#" + id + " .moduleHeader").wrap(
			"<div class='panel'><div class='trigger'></div></div>");
			$("#" + id + " .moduleContent").wrap("<div class='drilldown'>"
							+ (operation == "search" ? ""
									: " <a class='drilldown-close' href='#'></a>")
							+ " <div class='items clearfix'></div></div>");
			$("#" + id + " .panel").wrap("<div class='inline-toolbar'></div");
			if (operation == "search") {
				$(".close").hide();
			}
			this.wrapInternalDiv(id);
		},
		
		wrapInternalDiv : function(id){
			$("#" + id + " .internalHeader").wrap("<a href='#'></a>");
			$("#" + id + " .internalContent").wrap("<ul><li></li></ul>");
			$("#" + id + " .treePanel").wrapInner("<ul class='tree'><li></li></ul>");
		},
		
		updateCSS : function(id){
			$('#' + id + ' select.pulldown').pulldown();

			$('#' + id + ' select.spinner').spinner();

			$('#' + id + ' .panel:not(.portal,.divided)').panel();

			$('.panel-portal').portal_panel();

			$('#' + id + ' .panel.divided').divided_panel();

			$('#' + id + ' .drilldown').drilldown();

			$('#' + id + ' .tabs:not(.secondary .tabs)').tabs();

			$('#' + id + ' .tree').tree();

			$('#' + id + ' input.text').textinput();

			$('#' + id + ' input[type=checkbox].switch').switchbutton();

			// Setup circle buttons
			$('#' + id + ' button.close,button.minimize').circlebutton();

			// Setup other buttons
			$('#' + id + ' button:not(.circle)').button();

			// Setup input element buttons
			$('#' + id + ' input[type=button],input[type=reset],input[type=submit]').inputbutton();

			var $managers = $('#' + id + ' .inline-toolbar');

			var $drilldowns = $('#' + id + ' .drilldown');

			$managers.each(function(i) {

				var $drilldown = $drilldowns.eq(i);

				var $container = $(this);

				var $trigger = $container.find('.trigger');

				var $panel = $container.find('.panel');

				// var $dialog = $dialogs.eq(i);

				$trigger.click(function(e) {

					e.preventDefault();

					if ($container.is('.selected')) {

						$drilldown.trigger('hide-drilldown');

						$container.removeClass('selected');

						$panel.removeClass('selected');

					} else {

						$container.addClass('selected');

						$panel.addClass('selected');

						$drilldown.trigger('show-drilldown', $panel);

					}

				});

			});
		},
		
		display : function(id , operation){
			this.wrapDiv(id, operation);
			this.updateCSS(id);
		}
	};
});