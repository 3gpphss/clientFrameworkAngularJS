(function ($)
{
    var capslock_counter = 0
	var numeric_counter = 0
    
    // Create a text input field
    $.fn.textinput = function ()
    {
        return $(this).each(function ()
        {
            var $input = $(this).placeholder()
            var $container = $input.wrap(E('div', 'textinput')).parent().append(E('div', 'textinput-inner'))
            
			if ($input.is('.change-indicator'))
			{
				$container.addClass('change-indicator')
			}

            if ($input.is('.small'))
            {
                $container.addClass('small')
            }
			
			if ($input.is('[readonly]'))
            {
                $container.addClass('readonly')
            }

            if ($input.is('.required'))
            {
                $container
                    .addClass('required')
                    .append(E('span', 'required', T('*')))
                    
                if ($input.val() && !$input.is('.placeholder'))
                {
                    $container.find('span.required').hide()
                }
            }
            
            $container.append(E('span', 'state'))
            
            if ($input.is('.error'))
            {
                $container.addClass('error')
            }
            else if ($input.is('.valid'))
            {
                $container.addClass('valid')
            }
            
            if ($input.is('[disabled]'))
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
            
            $input
                .focus(function ()
                {
                    $container.addClass('focus')
                })
                .blur(function ()
                {
                    $container.removeClass('focus')
                })
                .keyup(function ()
                {
                    if ($input.is('.required') && $input.val() && !$input.is('.placeholder'))
                    {
                        $container.find('span.required').hide()
                    }
                    else
                    {
                        $container.find('span.required').show()
                    }
                })
                
            if ($input.is('.capslock') && $.fn.bubble)
            {
                var id = 'capslock-'+capslock_counter
                capslock_counter++
                
                $('body')
                    .append(
                        E('div', 'bubble-content with-close')
                            .attr('for', id)
                            .html('Caps lock on may affect entry of your password.<br />Press caps lock key to turn off and try again.')
                    )
                
                $container.find('.state').before(
                    E('span', 'capslock-icon bubble west')
                        .attr('id', id)
                        .hide()
                )
                
                var $capslock = $container.find('.capslock-icon').bubble()
                var capslock_is_on = false
                
                $input.keyup(function (e)
                {
                    if (e.keyCode == 20 && capslock_is_on)
                    {
                        capslock_is_on = false
                        $container.find('.capslock-icon').hide()
                        $capslock.trigger('bubblehide')
                    }
                    else
                    {
                        var s = $input.val()
                        var c = s.charAt(s.length-1)
                        
                        if (c.toUpperCase() === c && c.toLowerCase() !== c && !e.shiftKey)
                        {
                            capslock_is_on = true
                            $container.find('.capslock-icon').show()
                            $capslock.trigger('bubbleshow')
                        }
                        else if (capslock_is_on)
                        {
                            capslock_is_on = false
                            $container.find('.capslock-icon').hide()
                            $capslock.trigger('bubblehide')
                        }
                    }
                })
            }
			
			if ($input.is('.numeric') && $.fn.bubble)
            {			
				var id = 'numeric-'+numeric_counter
                numeric_counter++
				$('body')
                    .append(
                        E('div', 'bubble-content')     
							.attr('for', id)
                            .html('This field only accepts numeric characters.')
                    )
				$container.find('.numeric').before(
						E('span','no-icon bubble')	
							.attr('id', id)
							.hide()
					)
					
				var $numeric = $container.find('.no-icon').bubble()
                var non_numeric_value = false	
				$input.keypress(function (e) 
				{ // Allow: backspace, delete, tab, escape, and enter
					if ( e.keyCode == 46 || e.keyCode == 8 || e.keyCode == 9 || e.keyCode == 27 || e.keyCode == 13 || 
					// Allow: Ctrl+A
					(e.keyCode == 65 && e.ctrlKey === true) || 
					// Allow: home, end, left, right
					(e.keyCode >= 35 && e.keyCode <= 39)) {
								non_numeric_value = false
								$container.find('.no-icon').hide()
								$numeric.trigger('bubblehide')				
					 }else if (String.fromCharCode(e.charCode).match(/[^0-9]/g))
					{  
						non_numeric_value = true						
						$container.find('.no-icon').show()				
						$numeric.trigger('bubbleshow')	
						return false;
					}else if (non_numeric_value)
					{
						non_numeric_value = false
						$container.find('.no-icon').hide()
						$numeric.trigger('bubblehide')
					}
					
					if ($input.is('.required') && !$input.val())							
					{
						$container.find('span.required').show()
					}							
				}).keyup(function () 
				{ 
						if (this.value != this.value.replace(/[^0-9]/g,''))
						{  
							non_numeric_value = true
							this.value = this.value.replace(/[^0-9]/g,'');	
							$container.find('.no-icon').show()				
							$numeric.trigger('bubbleshow')
						}
						
					    if ($input.is('.required') && !$input.val())							
						{
							$container.find('span.required').show()
						}		
				}).blur(function ()
                {
                    if (non_numeric_value)
                        {
                            non_numeric_value = false
                            $container.find('.no-icon').hide()
                            $numeric.trigger('bubblehide')
                        }
                });				
			}
        })
    }
    
    $(function () 
	{
		// Setup inputs already on the page
	    $('input.text').textinput()
	})
})(jQuery)