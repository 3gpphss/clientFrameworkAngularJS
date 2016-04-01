(function ($)
{
	$.fn.drilldown = function ()
	{
		return this.each(function ()
		{
			var $container = $(this)
			
			if ($container.parents('.panel-portal').length > 0)
			{
				$container
					.wrapInner(
						E('div', E('div', 'content'))
					)
					.find('> div')
						.appendlist([
							E('div', 'top', E('div')),
							E('div', 'bottom', E('div')),
							E('div', 'arrow')
						])
			}
			else
			{
				$container
					.wrapInner(E('div', E('div', 'content')))
					.find('> div')
						.appendlist([
							E('div', 'top'),
							E('div', 'arrow')
						])
			}
					
			var $arrow = $container.find('> div > .arrow')
			
			$container
				.bind('show-drilldown', function (e, trigger)
				{
					if (!$container.is(':visible'))
					{
						$container
							.addClass('sizing')
							.show()
							.css(
							{
								height: '1px',
								visiblity: 'hidden'
							})
					}
						
					var $trigger = $(trigger)
					var trigger_offset = $trigger.offset().left
					var container_offset = $container.offset().left
					var trigger_center = $trigger.outerWidth() / 2 + trigger_offset
					var arrow_center = trigger_center - container_offset
					var arrow_left = arrow_center - $arrow.width() / 2
					
					if ($container.is('.sizing'))
					{
						$container
							.removeClass('sizing')
							.hide()
							.css(
							{
								height: 'auto',
								visiblity: 'visible'
							})
					}
					
					if ($container.is(':visible'))
					{
						$arrow.animate({left: arrow_left + 'px'}, 350)
					}
					else
					{
						$arrow.css('left', arrow_left + 'px')
						$container.slideDown(500)
					}
				})
				.bind('hide-drilldown', function (e)
				{
					$container.slideUp(500)
				})
		})
	}
	
	NSNReady(function () { NSNReady(function () { $('.drilldown').drilldown() }) })
})(jQuery)