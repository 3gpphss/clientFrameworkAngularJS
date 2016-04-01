(function ($)
{
	$.fn.pill = function ()
	{
		return this.each(function ()
		{
			var $container = $(this)
			$container
				.wrapInner(E('div', 'content'))
				.prepend(E('div', 'pill-right'))
				.prepend(E('div', 'pill-left'))
		})
	}
	
	$(function ()
	{
		$('.pill').pill()
	})
})(jQuery)