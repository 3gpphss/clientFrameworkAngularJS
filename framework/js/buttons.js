(function ($)
{
    // Create a button
    var $active_button = null;
	
	var add_toggling = function ($button)
	{
		if ($button.is('.toggle'))
		{
			$button.click(function ()
			{
				if ($button.is('.on'))
				{
					$button.removeClass('on')
				}
				else
				{
					$button.addClass('on')
				}
			})
		}
	}
    
    $.fn.button = function ()
    {
        return this.each(function ()
        {
            var $elm = $(this)
                .addClass('button')
                .wrapInner(
                    E('span', 'button-content')
                )
            var $content = $elm.find('.button-content')
            
            if ($elm.text() == '')
            {
                $elm.addClass('no-text')
            }
            
            $elm
				.prepend(E('span', 'button-right'))
				.prepend(E('span', 'button-left'))
				.normalize_interaction_states()
                
            if ($elm.is('.icon'))
            {
                $content.prepend(E('div', 'icon'))
            }
            
            if ($elm.attr('disabled'))
            {
                $elm.addClass('disabled')
            }
            
            $elm.watch('disabled', function (is_disabled)
            {
                if (is_disabled)
                {
                    $elm.addClass('disabled')
                }
                else
                {
                    $elm.removeClass('disabled')
                }
            })
			
			add_toggling($elm)
        })
    }
    
    $.fn.circlebutton = function ()
    {
        return this.each(function ()
        {
            var $elm = $(this)
            
            $elm
                .addClass('circle button')
                .normalize_interaction_states()
                
            if ($elm.is(':disabled'))
            {
                $elm.addClass('disabled')
            }
            
            $elm.watch('disabled', function (is_disabled)
            {
                if (is_disabled)
                {
                    $elm.addClass('disabled')
                }
                else
                {
                    $elm.removeClass('disabled')
                }
            })
			
			add_toggling($elm)
        })
    }
    
    $.fn.inputbutton = function ()
    {
        return this.each(function ()
        {
            var $input = $(this)
            $input
				.hide()
                .wrap(
                    E('div', 'button')
                )
                .parent()
                    .append(E('span', 'button-content', T($input.val())))
                
            var $container = $input.parent()
			$container
				.prepend(E('div', 'button-right'))
				.prepend(E('div', 'button-left'))
            
            $container.click(function (e)
            {
                e.preventDefault()
            })
            
            if ($input.attr('type') == 'submit')
            {
                $container.addClass('call-to-action')
            }
            
            $input
                .focus(function ()
                {
                    $container.trigger('focus')
                })
                .blur(function ()
                {
                    $container.trigger('blur')
                })
            
            $container
                .click(function (e)
                {
                    e.preventDefault()
                })
                .normalize_interaction_states()
                
            if ($input.attr('disabled'))
            {
                $container.addClass('disabled')
            }
            
            $input.watch('disabled', function (is_disabled)
            {
                if (is_disabled)
                {
                    $container.addClass('disabled')
                }
                else
                {
                    $container.removeClass('disabled')
                }
            })
			
			add_toggling($input)
        })
    }
    
	$(function ()
	{
		// Setup circle buttons
	    $('button.close,button.minimize').circlebutton()

	    // Setup other buttons
	    $('button:not(.circle)').button()

	    // Setup input element buttons
	    $('input[type=button],input[type=reset],input[type=submit]').inputbutton()
	})
})(jQuery)