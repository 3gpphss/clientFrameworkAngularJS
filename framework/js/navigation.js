(function ($)
{
    // General navigation setup
    
    var $window = $(window)
    var $navigation = $('.navigation')
    
    /* Set up left and right fills */
    $navigation
        .wrapInner(E('div', 'navigation-inner'))
        .find('.primary,.secondary,.filters,.local')
            .each(function ()
            {
                $(this)
                    .wrapInner(E('div', 'content'))
                    .prepend(
                        E('div', 'fill-right')
                    )
                    .prepend(
                        E('div', 'fill-left')
                    )
            })
        .end()
        
        /* Add necessary elements to the primary navigation links area */
        .find('.primary .links')
            .append(E('div', 'links-inner'))
            .find('.menu a')
                .wrapInner('<span></span>')
            .end()
        .end()
        
        .find('.secondary .content')
            .find('.tabs')
                
                /* Wrap tabs so we have a parent container for handling overflow */
                .wrap(E('div', 'tabs-outer'))
                
                /* So we can find the last tab in IE8 */
                .find('li:last-child')
                    .addClass('last-child')
                .end()
                
                /* So we can underline the text in the tab */
                .find('a')
                    .wrapInner('<span></span>')
                .end()
                
            .end()
            
            /* Add curved edge the side of the tabs */
            .find('.tabs-outer')
                .append(E('div', 'tab-cover'))
            .end()
            
            /* So we can find the last link in IE8 */
            .find('.links li:last-child')
                .addClass('last-child')
            .end()
            
            .find('.links a')
                .wrapInner('<span></span>')
            .end()
    
    /*
    Remove the secondary navigation bar background color if
    we have local navigation
    */
    if ($navigation.find('.local').length > 0)
    {
        $navigation.find('.secondary').css('background', 'none')
    }
    
    /* Offset the body by the navigation bar height */
    $('body').css('padding-top', $navigation.height()+'px')
    
    // Navigation menus
    
	/* Handle tab overflow */
	
	var $secondary = $navigation.find('.secondary')
	if ($secondary.length > 0 && $secondary.is('.multiple-tabs'))
	{
		var $tabs = $secondary.find('.tabs')
		var $items = $tabs.find('> li')
		var max_right = 640
		var first_overflow_index = 0
		
		for (var i=0; i<$items.length; i++)
		{
			var $item = $items.eq(i)
			if ($item.position().left + $item.outerWidth() >= max_right)
			{
				first_overflow_index = i
				break
			}
		}
		
		if (first_overflow_index)
		{
			var $overflow_items = $items.slice(first_overflow_index)
			$overflow_items.hide()
			
			var $selected = $overflow_items.filter('.selected')
			
			if ($selected.length > 0)
			{
				$selected.addClass('current')
			}
			
			$overflow_items.eq(0).before(E('li', 'overflow',
				E('a', 'overflow-trigger '+($selected.length > 0 ? ' selected' : ''))
					.html('&nbsp;').attr('href', '#'),
				E('ul',
					$overflow_items.get().map(function (item)
					{
						return $(item).clone().show()
					})
				)
			))
			
			$secondary.addClass('overflowed')
		}
	}
	
	/**
     * Navigation menus are nested, unordered lists like so:
     *
     * <code>
     * 
     * <ul class="menu">
     *    <li><a href="#">A leaf</a></li>
     *    <li>
     *        <a href="#">A branch</a>
     *        <ul>
     *            <li><a href="#">Another leaf</a></li>
     *        </ul>
     *    </li>
     * </ul>
     * 
     * </code>
     *
     */
    
    var hide_menus = function (animated)
    {
        var animated = (typeof animated == "undefined") ? true : animated
        
        if (!animated || $.browser.msie && parseInt($.browser.version) < 9)
        {
            $('.menu-expanded,.submenu').hide()
        }
        else
        {
            $('.menu-expanded,.submenu').fadeOut(150)
        }
        
        // also remove selected state of any meny items
        $('.menu-expanded .menu-items .selected,.submenu .menu-items .selected').removeClass('selected')
    }
    
    var hide_menu = function ($menu)
    {
        $menu
            .find('.with-menu').each(function ()
            {
                $(this).removeClass('selected')
                hide_menu($(this).data('submenu'))
            })
        
        if ($.browser.msie && parseInt($.browser.version) < 9)
        {
            $menu.hide()
        }
        else
        {
            $menu.fadeOut(150)
        }
    }
    
    $.fn.navigation_menu = function ()
    {
        return this.each(function ()
        {
			var $container = $(this)
			$container
                .find('> li > ul')
                .each(function ()
                {
                    /* 
                    The root menu is slightly different than sub menus since
                    it is rooted in a tab, not a list item.
                    */
                    
                    var $tab = $(this).parent()
                    var $trigger = $tab.find('> a:first')
                    
                    if ($trigger.length == 0)
                    {
                        return
                    }
                    
                    $trigger.append(E('span', 'arrow'))
                    $tab.addClass('with-menu')
                    
                    var $menu = E('div', 'menu-expanded '+($container.parents('.primary').length > 0 ? 'primary-menu' : 'secondary-menu' ),
                        E('div', 'title',
                            E('a')
                                .attr('href', '#')
                                .html($trigger.html())
                        ),
                        E('div', 'menu-items', this, 
                            E('div', 'menu-items-left-top'),
                            E('div', 'menu-items-right'),
                            E('div', 'menu-items-left')
                        )
                    ).appendTo('body')
                    
					if ($trigger.is('.overflow-trigger'))
					{
						$menu.addClass('overflow-menu')
					}
					
                    if ($tab.parent().is('.tabs'))
                    {
                        $menu.addClass('with-tab')
                    }
					
					if ($tab.parent().is('.command-bar'))
                    {
                        $menu.addClass('with-command-bar')
                    }
                    
                    $trigger.click(function (e)
                    {
                        e.preventDefault()
                        e.stopPropagation()
                        hide_menus()
                        var pos = $trigger.parent().offset()
						
                        $menu
                            .css(
                            {
                                top: (pos.top - $window.scrollTop())+'px',
                                left: (pos.left - $window.scrollLeft())+'px'
                            })
                        
                        if ($.browser.msie && parseInt($.browser.version) < 9)
                        {
                            $menu.show()
                        }
                        else
                        {
                            $menu.fadeIn(150)
                        }
                    })
                    
                    $menu
                        .find('.title a')
                            .click(function (e)
                            {
                                e.preventDefault()
                                e.stopPropagation()
                                hide_menus()
                            })
                        .end()
                        .click(function (e)
                        {
                            e.stopPropagation()
                        })
                        
                    /*
                    Now we look for the sub menus that are rooted in a list item
                    */
                    
                    var make_submenu = function ($menuitem)
                    {
                        $items = $menuitem.find('> ul')
                        
                        if ($items.length == 0)
                        {
                            $menuitem.mouseover(function (e)
                            {
                                $menuitem.parent().find('.selected').each(function ()
                                {
                                    var $sibling_item = $(this)
                                    hide_menu($sibling_item.removeClass('selected').data('submenu'))
                                })
                            })
                            return
                        }
                        
                        $menuitem.addClass('with-menu')
                        var $submenu = E('div', 'submenu',
                            E('div', 'inner',
                                E('div', 'top'),
                                $items.addClass('menu-items')
                            ),
                            E('div', 'bottom', E('div'))
                        ).appendTo('body')
                        
                        $menuitem.data('submenu', $submenu)
                        
                        $menuitem.mouseover(function (e)
                        {
                            if ($submenu.is(':visible'))
                            {
                                return
                            }
                            else
                            {
                                $menuitem.parent().find('.selected').each(function ()
                                {
                                    var $sibling_item = $(this)
                                    hide_menu($sibling_item.removeClass('selected').data('submenu'))
                                })
                                
                                $menuitem.addClass('selected')
                                
                                var pos = $menuitem.offset()
                                
                                $submenu
                                    .css(
                                    {
                                        top: (pos.top - $window.scrollTop()) + 'px',
                                        left: (pos.left + 
                                               $menuitem.outerWidth() -
                                               parseInt($menuitem.css('margin-right'))
                                              ) + 'px'
                                    })
                                
                                if ($.browser.msie && parseInt($.browser.version) < 9)
                                {
                                    $submenu.show()
                                }
                                else
                                {
                                    $submenu.fadeIn(150)
                                }
                            }
                        })
                        .click(function (e)
                        {
                            e.preventDefault()
                            e.stopPropagation()
                        })
                        
                        $submenu.click(function (e)
                        {
                            e.stopPropagation()
                        })
                        
                        $submenu.find('.menu-items > li').each(function ()
                        {
                            make_submenu($(this))
                        })
                    }
                    
                    $menu.find('.menu-items > ul > li').each(function ()
                    {
                        make_submenu($(this))
                    })
                })
        })
    }
    
    $('.menu').navigation_menu()
	
	/* Menus should be hidden when something other than the menu is clicked */
    $(document).click(hide_menus)
	
	/* Also when the window is scrolled or resized */
    $window
        .scroll(function ()
        {
    		/* Hide menus on scroll */
            hide_menus(false)
    		
    		/* Add a class when not scrolled to the top of the page 
    		  so that menus can change their style. Also, toggle condensed state
    		  if this menu has requested it. */
    		if ($window.scrollTop() == 0)
    		{
    			$navigation.removeClass('scrolled')
    			
    			if ($navigation.is('.condense-on-scroll'))
    			{
    				$navigation.removeClass('condensed')
    			}
    		}
    		else
    		{
    			$navigation.addClass('scrolled')
    			
    			if ($navigation.is('.condense-on-scroll'))
    			{
    				$navigation.addClass('condensed')
    			}
    		}
        })
        .resize(function ()
        {
            hide_menus(false)
            check_size()
        })
    
    /* Turn off fixed positioning if the viewport width is less than that
    of the navigation bar so that the user can scroll */
    var check_size = function ()
    {
        if ($window.width() < $navigation.find('.primary .content').width())
        {
            $navigation.addClass('narrow')
        }
        else
        {
            $navigation.removeClass('narrow')
        }
    }
	
	NSNReady(function ()
	{
		check_size()

	    /* Setup local navigation warning and critical tabs */
	    $navigation
	        .find('.local .warning, .local .critical')
	        .append(
	            E('div', 'strip',
	                E('div')
	            )
	        )
	})
    
    /* Wrap horizontal navigation anchors so they can be underlined */
    $('.navigation .horizontal a').wrapInner('<span></span>')
    
    /* Wrap inline menu anchors so they can be underlined */
    $('.inline-menu a').wrapInner('<span></span>')
    
    /* Old browsers like IE9 don't support text shadow and it is necessary on the primary links
    to ensure good contrast. */
    if (typeof document.createElement("detect").style.textShadow == "undefined")
    {
        $navigation.find('.primary .links a').textshadow()
    }
	
})(jQuery)