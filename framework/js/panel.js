(function ($)
{
    $.fn.panel = function ()
    {
        return this.each(function ()
        {
            $(this)
                .wrapInner(E('div', 'content', E('div', 'inner')))
                .find('.content')
                    .prepend(E('div', 'topleft'))
                .end()
                .append(
                    E('div', 'bottom', E('div'))
                )
        })
    }
    
    $.fn.portal_panel = function ()
    {
        return this.each(function ()
        {
			var $container = $(this)
			
			$container
                .wrapInner(E('div', 'content'))
				.prepend(E('div', 'top', E('div')))
				.prepend(E('div', 'bottom', E('div')))
				.prepend(E('div', 'shadow', E('div')))
			
			if ($container.find('> .content').height() < parseInt($container.css('min-height')))
			{
				$container
					.find('> .top').css('height', '45px')
					.end()
					.find('> .bottom').css('top', '45px')
					.end()
					.css('min-height', '0')
			}
        })
    }
    
    // A panel with two sections divided in the middle
    $.fn.divided_panel = function ()
    {
        return this.each(function ()
        {
            var $left = $(this).find('> .left').panel()
            var $right = $(this).find('> .right')
                .append(E('div', 'shadow'))
                .panel()
            
            var height = Math.max($left.find('> .content').height(), $right.find('> .content').height())
            $left.find('> .content').css('height', height)
            $right.find('> .content').css('height', height)
        })
    }
    
	NSNReady(function ()
	{
		$('.panel:not(.portal,.divided)').panel()
		$('.panel-portal').portal_panel()
	    $('.panel.divided').divided_panel()
	})
    
})(jQuery)