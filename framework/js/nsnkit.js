if (!Array.prototype.indexOf)
{
    Array.prototype.indexOf = function (elm, from)
    {
        from = from ? from : 0
        
        for (; from<this.length; from++)
        {
            if (from in this && this[from] == elm)
            {
                return from;
            }
        }
        
        return -1
    }
}


if (!Array.prototype.filter)
{
    Array.prototype.filter = function (fn, thisp)
    {
        thisp = thisp ? thisp : null
        
        var newarr = []
        
        for (var i=0; i<this.length; i++)
        {
            var val = this[i]
            
            if (fn.call(thisp, val, i, this))
            {
                newarr.push(val)
            }
        }
        
        return newarr
    }
}

if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function (fn, thisp)
    {
        thisp = thisp ? thisp : null
        
        for (var i=0; i<this.length; i++)
        {
            fn.call(thisp, this[i], i, this)
        }
    }
}

if (!Array.prototype.map)
{
    Array.prototype.map = function (fn, thisp)
    {
        thisp = thisp ? thisp : null
        var newarr = []
        
        for (var i=0; i<this.length; i++)
        {
            newarr.push(fn.call(thisp, this[i], i, this))
        }
        
        return newarr
    }
}


Function.prototype.bind = function ()
{
    var slice = Array.prototype.slice
    var args = slice.call(arguments, 0)
    var fn = this
    var obj = args.shift()
    
    return function ()
    {
        var args1 = slice.call(args, 0)
        var args2 = slice.call(arguments, 0)
        var l1 = args1.length, l2 = args2.length
        while (l2--)
        {
            args1[l1 + l2] = args2[l2]
        }
        return fn.apply(obj, args1)
    }
}

/*
Create a new jquery node.

E(
    <elementname>,
    [<class names>]
    [children: a DOMElement, jQuery node, TextNode or an array of objects of these types]
)

Example:

E(
    'div',
    'someclass anotherclass',
    E('div',
        T('Some text')
    ).click(
        function () { alert('foo') }
    )
)

Can be expressed in html like so:

<div class="someclass anotherclass">
    <div onclick="function () { alert('foo') }">Some text</div>
</div>

Note that a null passed where a child is expected will be ignored allowing
conditional structures in an element building chain like so:

var name = {
    first: 'Foo',
    last: null
}

E('div',
    T(name.first),
    name.last ? T(' '+name.last) : null
)
*/
window.E = function()
{
    var e = jQuery(document.createElement(arguments[0]))
    
    if (arguments.length > 1)
    {
        var args = Array.prototype.slice.call(arguments, 0)
        args.shift()
        
        if (typeof args[0] == 'string')
        {
            e.addClass(args.shift())
        }
        
        for (var i=0; i<args.length; i++)
        {
            if (args[i])
            {
                if (!args[i].jquery && typeof args[i].length != "undefined")
                {
                    args[i].forEach(function (_e)
                    {
                        e.append(_e)
                    })
                }
                else
                {
                    e.append(args[i])
                }
            }
        }
    }
    
    return e
}


/*
Create a jquery text node.
*/
window.T = function(s)
{
    return jQuery(document.createTextNode(s))
}


/*
A jQuery extension that appends a list of elements to a selection.

Example:

var items = ['a','b','c']

jQuery('ul#foo').appendlist(
    items.map(function (i)
    {
        return E('li', T(i))
    })
)

Will turn this:

<ul id="foo"></ul>

into this:

<ul id="foo">
    <li>a</li>
    <li>b</li>
    <li>c</li>
</ul>
*/
jQuery.fn.appendlist = function (elms)
{
    if (elms.length > 0)
    {
        var frag = document.createDocumentFragment()
        elms.forEach(function (e)
        {
            if (e)
            {
                if (e.jquery)
                {
                    e = e.get(0)
                }
                frag.appendChild(e)
            }
        })
        this.get(0).appendChild(frag)
    }
    return this
}


/*
Normalize interaction states to:
    hover
    focus
    active
    active + focus
*/

var $active_element = null

jQuery.fn.normalize_interaction_states = function ()
{
    return this.each(function ()
    {
        var $elm = jQuery(this)
        
        $elm
            .focus(function ()
            {
                if ($elm.is('.active'))
                {
                    return
                }
                
                $elm.addClass('focus')
            })
            .blur(function ()
            {
                $elm.removeClass('focus')
            })
            .mousedown(function ()
            {
                if ($elm.is('.focus'))
                {
                    $elm.addClass('active-focus').trigger('active-focus')
                }
                else
                {
                    $elm.addClass('active').trigger('active')
                }
                
                $active_element = $elm
            })
            .hover(function ()
            {
                $elm.addClass('hover')
            }, function ()
            {
                $elm.removeClass('hover')
            })
    })
}

jQuery(document).mouseup(function ()
{
    if ($active_element)
    {
        if ($active_element.is('.active-focus'))
        {
            $active_element.removeClass('active-focus').trigger('active-focus-off').focus()
        }
        else
        {
            $active_element.removeClass('active').trigger('active-off')
        }
        
        $active_element = null
    }
})


/* Watch for attribute changes */
;(function ($)
{
	var observed_attrs = []
	var interval = null
	
	var start_observing = function ()
	{
		if (!interval)
		{
			interval = setInterval(function ()
			{
				observed_attrs.forEach(function (v)
				{
					var $elm = v[0], attr = v[1], lastval = v[2]
					var val = $elm.attr(attr)
					
					if (val !== lastval)
		            {
		                v[2] = val
						$elm.data('watch-listeners-'+attr).forEach(function (l)
						{
							l.call($elm.get(0), val)
						})
		            }
				})
			}, 150)
		}
	}
	
	$.fn.watch = function (attr, callback)
	{
	    return this.each(function ()
	    {
	        var $elm =$(this)
			var listeners = $elm.data('watch-listeners-'+attr)

			if (listeners)
			{
				listeners.push(callback)
				return
			}

			listeners = [callback]
			$elm.data('watch-listeners-'+attr, listeners)

	        var lastval = $elm.attr(attr)
			observed_attrs.push([$elm, attr, lastval])
			
			start_observing()
	    })
	}
})(jQuery)

/* Watch for inserted or removed child elements */
;(function ($)
{
	var root_elements = []
	var interval = null
	
	var start_observing = function ()
	{
		if (!interval)
		{
			interval = setInterval(function ()
			{
				root_elements.forEach(function (v)
				{
					var $elm = v[0], $last_children = v[1]
					var $current_children = $elm.find('>*')
					var change = false
					
					if ($current_children.length == $last_children.length)
					{
						for (var i=0; i<$last_children.length; i++)
						{
							if ($last_children.get(i) != $current_children.get(i))
							{
								change = true
								break
							}
						}
					}
					else
					{
						change = true
					}
					
					if (change)
					{
						v[1] = $current_children
						$elm.data('domchange-listeners').forEach(function (l) { l() })
					}
				})
			}, 150)
		}
	}
	
	$.fn.domchange = function (callback)
	{
		return this.each(function ()
		{
			var $elm = $(this)
			var listeners = $elm.data('domchange-listeners')

			if (listeners)
			{
				listeners.push(callback)
				return
			}

			listeners = [callback]
			$elm.data('domchange-listeners', listeners)
			
			var $current_children = $elm.find('>*')
			root_elements.push([$elm, $current_children])
			start_observing()
		})
	}
})(jQuery)



/*
A function to check that an element that is using a custom font has been
rendered using that font. The callback will be passed a flag that if true
indicates that the element has rendered properly and if false, that the
maximum number of tries was reached. The callback's second argument is a 
clone of the source element that is used for testing size.
*/
;(function ($)
{
	FONT_LOADING = 1
	FONT_LOADED = 2
	FONT_FAILED = 3
	var font_status = {}
	var waiters = {}
	
	// Check a font by name
	jQuery.ensure_font_loaded = function (font_name, callback)
	{
		var $test_element = E('div', T('abcdefghijklmnopqrstuvwxyz0123456789')).css('font-family', font_name)
		$test_element.ensure_font_loaded(callback)
	}
	
	// Check the font used by an element and get a cloned test element
	jQuery.fn.ensure_font_loaded = function (callback, clone)
	{
	    var max_tries = 40
	    var tries = 0
	
		if (typeof clone == "undefined" || clone)
		{
			var $test_element = this.clone()
		}
		else
		{
			$test_element = this
		}
		
		var font_name = this.css('font-family').split(',')[0]
		var font_size = this.css('font-size')
		var $element = this
		
	    $test_element
	        .css({
	            position: 'absolute',
	            top: 0,
				left: '-10000px',
	            fontFamily: 'serif',
	            fontSize: font_size
	        })
	        .appendTo('body')

	    var original_width = $test_element.width()
	    var last_width = original_width

	    $test_element.css('font-family', font_name)
		
		if (typeof font_status[font_name] == "undefined")
		{
			font_status[font_name] = FONT_LOADING
			waiters[font_name] = [[callback, $test_element]]
		}
		else if (font_status[font_name] === FONT_LOADING)
		{
			waiters[font_name].push([callback, $test_element])
			return
		}
		else if (font_status[font_name] === FONT_FAILED)
		{
			callback(false, $test_element)
			$test_element.remove()
			return
		}
		else
		{
			callback(true, $test_element)
			$test_element.remove()
			return
		}
		
	    var check = function ()
	    {
	        var width = $test_element.width()
			
	        if (width != original_width && width == last_width)
	        {
				waiters[font_name].forEach(function (w)
				{
					w[0](true, w[1])
					w[1].remove()
				})
				font_status[font_name] = FONT_LOADED
				delete waiters[font_name]
	            return
	        }

	        tries++

	        if (tries == max_tries)
	        {
				waiters[font_name].forEach(function (w)
				{
					w[0](false, w[1])
					w[1].remove()
				})
				font_status[font_name] = FONT_FAILED
				delete waiters[font_name]
	            return
	        }

	        last_width = width
	        setTimeout(check, 50)
	    }
		
	    check()
	}
	
	// Let's create a one-shot event for when the custom fonts are loaded
	var fonts = ['Museo Sans 300', 'Museo Sans 500', 'Museo Sans 700']
	var fonts_ready_count = 0
	var fonts_done = false
	var font_ready_listeners = []
	
	
	$.fonts_ready = function (/* callback */)
	{
		if (arguments.length > 0)
		{
			if (fonts_done)
			{
				arguments[0]()
			}
			else
			{
				font_ready_listeners.push(arguments[0])
			}
		}
		else
		{
			font_ready_listeners.forEach(function (l) { l() })
		}
	}
	
	fonts.forEach(function (f)
	{
		$.ensure_font_loaded(f, function ()
		{
			fonts_ready_count++
			
			if (fonts_ready_count == fonts.length)
			{
				fonts_done = true
				$.fonts_ready()
			}
		})
	})
	
})(jQuery)

;(function ($)
{
    var input = document.createElement('input')
    var is_placeholder_supported = ('placeholder' in input)
    
    $.fn.placeholder = function ()
    {
        if (is_placeholder_supported)
        {
            return this
        }
        
        return this.each(function ()
        {
            var $input = $(this)
            var placeholder_text = $input.attr('placeholder')
            
            $input
                .focus(function ()
                {
                    if ($input.val() == placeholder_text)
                    {
                        $input.removeClass('placeholder').val('')
                    }
                })
                .blur(function ()
                {
                    if (!$input.val())
                    {
                        $input.addClass('placeholder').val(placeholder_text)
                    }
                })
                
            if (!$input.val())
            {
                $input.addClass('placeholder').val(placeholder_text)
            }
        })
    }
})(jQuery)


/*
For elements that have background PNGs, use an AlphaImageLoader fix for IE8.
*/
;(function ($)
{
    $.fn.alphapngfix = function ()
    {
        if (!$.browser.msie || parseInt($.browser.version) >= 9)
        {
            return
        }
        
        return $(this).each(function ()
        {
            var $elm = $(this)
            
            if ($elm.data('ispngfixed'))
            {
                return
            }
            
            $elm.data('ispngfixed', true)
            
            var background_image = $elm.css('background-image')
            
            if (!background_image)
            {
                return
            }
            
            var matches = background_image.match(/url\("([^\)"]+)/)
            
            if (matches.length != 2)
            {
                return
            }
            
            var url = matches[1]
            
            var img = new Image()
            img.onload = function ()
            {
                if ($elm.css('position') == 'static')
                {
                    $elm.css('position', 'relative')
                }
                
                var top = $elm.css('background-position-y')
                var left = $elm.css('background-position-x')
                
                var pos = {}
                
                if (top == 'top')
                {
                    pos.top = 0
                }
                else if (top == 'bottom')
                {
                    pos.bottom = 0
                }
                else
                {
                    pos.top = top
                }
                
                if (left == 'right')
                {
                    pos.right = 0
                }
                else if (left == 'left')
                {
                    pos.left = 0
                }
                else
                {
                    pos.left = left
                }
                
                $elm
                    .prepend(
                        E('div').css(
                            $.extend(pos, {
                                width: img.width,
                                height: img.height,
                                position: 'absolute',
                                filter: "progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+url+"',scale='crop')"
                            })
                        )
                    )
                    .css({
                        overflow: 'hidden',
                        background: 'none'
                    })
            }
            
            img.src = url
        })
    }
})(jQuery)


/* Scrollbars */
;(function ($)
{
	window.NSNScrollbar = function ($container, axis)
	{
		this.$container = $container
		this.$content_container = $container.find('.scrolling-content-container')
		this.$content = $container.find('.scrolling-content')
		
		// Create the track and thumb
		this.$scrollbar = E('div', 'scrollbar-container '+axis,
			E('div', 'track', E('div')),
			E('div', 'thumb')
		).appendTo($container)
		this.$track = this.$scrollbar.find('.track')
		this.$thumb = this.$scrollbar.find('.thumb')
		this.$document = $(document)
		
		this.axis = this.axes[axis]
		
		this.content_offset = 0
		this.max_content_offset = 0
		this.max_thumb_offset = 0
		this.thumb_size = this.$thumb[this.axis.track_size_property]()
		this.drag_position = {
			thumb_start: null,
			mouse_start: null
		}
		
		this._drag_start = this.drag_start.bind(this)
		this._drag_move = this.drag_move.bind(this)
		this._drag_end = this.drag_end.bind(this)
		
		// Scroll when the thumb is dragged
		this.$thumb
			.bind('mousedown', this._drag_start)
			.bind('touchstart', this._drag_start)
						
		// Jump scroll position when the track is clicked
		this.$track
			.click(this.jump_to.bind(this))
		
		// Respond to mousewheel events
		this._mousewheel = this.mousewheel.bind(this)
		
		var container_elm = this.$container.get(0)
		
		if (container_elm.addEventListener)
        {
            container_elm.addEventListener('DOMMouseScroll', this._mousewheel, false);
            container_elm.addEventListener('mousewheel', this._mousewheel, false );
        }
        else
        {
            container_elm.onmousewheel = this._mousewheel
        }
		
		// We set up the sizes twice. Once when fonts may not be ready and once after
		// to avoid a flash of the scollable content outside it's scrolling container
		this.size_changed()
		$.fonts_ready(this.size_changed.bind(this))
		
		// Watch for changes in content size
		this.$content.bind('resize', this.size_changed.bind(this))
		// Watch for changes in container size
		this.$container.bind('resize', this.size_changed.bind(this))
	}
	NSNScrollbar.prototype = 
	{
		// Functionality for a scrollbar is pretty much the same
		// whether it's vertical or horizontal but the way we
		// get some properties is different.
		axes: {
			'horizontal': {
				name: 'horizontal',
				dimension: 'x',
				container_size: function () { return this.$container.innerWidth() },
				content_container_size: function () { return this.$container.width() },
				content_size: function () { return this.$content.outerWidth() },
				track_margin: function () {
					return (parseInt(this.$scrollbar.css('margin-left')) || 0) +
							(parseInt(this.$scrollbar.css('margin-right')) || 0)
				},
				track_size_property: 'width',
				position_property: 'left',
				page_position: 'pageX',
                wheel_delta: 'wheelDeltaX'
			},
			'vertical': {
				name: 'vertical',
				dimension: 'y',
				container_size: function () { return this.$container.innerHeight() },
				content_container_size: function () { return this.$container.height() },
				content_size: function () { return this.$content_container.get(0).scrollHeight },
				track_margin: function () {
					return (parseInt(this.$scrollbar.css('margin-top')) || 0) + 
						   (parseInt(this.$scrollbar.css('margin-bottom')) || 0)
				},
				track_size_property: 'height',
				position_property: 'top',
				page_position: 'pageY',
                wheel_delta: 'wheelDeltaY'
			}
		},
		
		animation_duration: 250,
		
		container_size: function ()
		{
			return this.axis.container_size.call(this)
		},
		
		content_container_size: function ()
		{
			return this.axis.content_container_size.call(this)
		},
		
		content_size: function ()
		{
			return this.axis.content_size.call(this)
		},
		
		track_margin: function ()
		{
			return this.axis.track_margin.call(this)
		},
		
		size_changed: function ()
		{
			if (this.$container.is(':visible'))
			{
				this.$content_container.css({
					width: this.$container.width(),
					height: this.$container.height()
				})
			}
			
			var container_size = this.container_size()
			var content_container_size = this.content_container_size()
			var content_size = this.content_size()
			var track_margin = this.track_margin()
			
			if (!container_size || !content_size || !content_container_size)
			{
				return
			}
			
			if (content_size <= content_container_size)
			{
				this.$container.removeClass('scrollbars-'+this.axis.name+'-visible')
				this.set_position(0)
			}
			else
			{
				this.$container.addClass('scrollbars-'+this.axis.name+'-visible')
				this.$scrollbar.css(this.axis.track_size_property, container_size - track_margin + 'px')
				this.max_content_offset = -1 * (content_size - content_container_size)
				this.max_thumb_offset = container_size - this.thumb_size - track_margin
				
				// If we're scrolled and the size changes we need to change our offset
				if (this.content_offset < this.max_content_offset)
				{
					this.set_position(this.max_content_offset)
				}
			}
			
			this.onsizechange()
		},
		
		onsizechange: function ()
		{
			
		},
		
		set_position: function (new_offset, animated)
		{
			new_offset = parseInt(new_offset)
			
			if (this.content_offset == new_offset)
	        {
	            return
	        }
			
	        this.content_offset = parseInt(Math.max(this.max_content_offset, Math.min(new_offset, 0)))
	        var ratio = this.content_offset / this.max_content_offset
			
			if (animated)
			{
				var options = {}
				options[this.axis.position_property] = this.content_offset
				this.$content.animate(options, 250)
				
				options = {}
				options[this.axis.position_property] = parseInt(this.max_thumb_offset * ratio)
		        this.$thumb.animate(options, 250)
			}
			else
			{
				this.$content.css(this.axis.position_property, this.content_offset)
		        this.$thumb.css(this.axis.position_property, parseInt(this.max_thumb_offset * ratio))
			}
			
			this.onpositionchange(this.content_offset, animated)
			this.$container.trigger('scroll-position-changed')
			$(document).trigger('nsnscroll', this.$container.get(0))
		},
		
		// A hook for scroll changes
		onpositionchange: function (content_offset, animated)
		{
		},
		
		drag_start: function (e)
		{
			e.preventDefault()
            e.stopPropagation()
			
			if (!this.$scrollbar.is(':visible'))
			{
				return
			}
			
            this.drag_position.mouse_start = e[this.axis.page_position]
            this.drag_position.thumb_start = parseInt(this.$thumb.css(this.axis.position_property))
			
			this.$document.bind('mousemove', this._drag_move)
			this.$document.bind('mouseup', this._drag_end)
			this.$document.bind('touchmove', this._drag_move)
			this.$document.bind('touchend', this._drag_end)
			
			this.$container.trigger('scroll-start')
		},
		
		drag_move: function (e)
		{
			e.preventDefault()
			e.stopPropagation()
			var thumb_offset = this.drag_position.thumb_start + (e[this.axis.page_position] - this.drag_position.mouse_start)
			var new_content_offset = Math.min(this.max_thumb_offset, thumb_offset) / this.max_thumb_offset * this.max_content_offset
            this.set_position(new_content_offset)

			this.$container.trigger('scroll-move')
		},
		
		drag_end: function (e)
		{
			this.$document.unbind('mousemove', this._drag_move)
			this.$document.unbind('mouseup', this._drag_end)
			this.$document.unbind('touchmove', this._drag_move)
			this.$document.unbind('touchend', this._drag_end)
			
			this.drag_position.thumb_start = null
			this.drag_position.mouse_start = null
			
			this.$container.trigger('scroll-end')
		},
		
		jump_to: function (e)
		{
			var thumb_offset = e[this.axis.page_position] - this.$track.offset()[this.axis.position_property] - this.thumb_size / 2
			var new_content_offset = parseInt(Math.min(this.max_thumb_offset, thumb_offset) / this.max_thumb_offset * this.max_content_offset)
            this.set_position(new_content_offset)
		},
		
		smooth_to: function (pos)
		{
			var new_offset = Math.min(Math.max(pos, this.max_content_offset), 0)
			this.set_position(pos, true)
		},
		
		mousewheel: function (e)
        {
			if (!this.$scrollbar.is(':visible'))
			{
				return
			}
			
            var delta = 0, e = e || window.event;
            
			if (typeof e.wheelDeltaX == 'undefined' && typeof e.wheelDelta != "undefined")
            {
                e.wheelDeltaX = e.wheelDeltaY = e.wheelDelta
            }
			
			if (typeof e.wheelDelta != "undefined")
			{
				delta = e[this.axis.wheel_delta] / 120
			}
			else if (e.detail)
			{
				delta = -e.detail / 3
			}
            
            this.set_position(this.content_offset + delta * 40)
            
            e = $.event.fix(e)
            e.preventDefault()

			this.$container.trigger('scroll-move')
        }
	}
	
	// Add scrollbars to an element.
	$.fn.scrollbars = function ()
	{
		return $(this).each(function ()
		{
			var $container = $(this)
			
			var options = 
			{
				horizontal: $container.is('.horizontal'),
				vertical: $container.is('.vertical')
			}
			
			$container.wrapInner(E('div', 'scrolling-content-container', E('div', 'scrolling-content')))
			var scrollbars = []
			
			;['horizontal', 'vertical'].forEach(function (axis)
			{
				if (options[axis] && typeof $container.data('scrollbar-'+axis) == "undefined")
				{
					var scrollbar = new NSNScrollbar($container, axis)
					scrollbars.push(scrollbar)
					$container.data('scrollbar-'+axis, scrollbar)
				}
			})
		})
	}
	
	$('.scrollbars').scrollbars()
})(jQuery)


;(function ($)
{
    var ready_listeners = []
    var nsn_ready = false
    
    window.NSNReady = function ()
    {
        if (arguments.length > 0)
        {
            if (nsn_ready)
            {
                arguments[0]()
            }
            else
            {
                ready_listeners.push(arguments[0])
            }
        }
    }
    
    $(function ()
    {
        $.fonts_ready(function ()
        {
            nsn_ready = true
            ready_listeners.forEach(function (l)
            {
                l()
            })
            $('body').css('visibility', 'visible')
        })
    })
})(jQuery)


;NSNReady(function ()
{
	// make sure fixed footers don't overlap content
	$('.footer.small').each(function ()
	{
		var spacing = 32
		var $footer = $(this)
		var $sibling = $footer.prev()
		var original_bottom = $footer.css('bottom')
		
		var limit_position = function ()
		{
			var pos = $sibling.offset()
			var height = $sibling.outerHeight(true)
			
			if ($footer.css('position') == 'absolute')
			{
				if ($(window).height() > pos.top + height + $footer.outerHeight() + spacing)
				{
					$footer.css(
						{
							position: 'fixed',
							top: 'auto',
							bottom: original_bottom
						})
				}
			}
			else if ($footer.offset().top < pos.top + height + spacing)
			{
				$footer.css({
					position: 'absolute',
					top: pos.top + height + spacing + 'px',
					bottom: 'auto'
				})
			}
		}
		
		limit_position()
		$(window).resize(limit_position)
	})
    
    // Wrap disclosure link text so it can be independently underlined
    $('a.disclosure').wrapInner(E('span'))
})

/* 
jQuery text-shadow plugin 
https://github.com/heygrady/textshadow
*/
;(function($, window, undefined) {
    "use strict";

    //regex
    var rtextshadow = /(-?\d+px|(?:hsl|rgb)a?\(.+?\)|#(?:[a-fA-F0-9]{3}){1,2}|0)/g,
        rtextshadowsplit = /(,)(?=(?:[^\)]|\([^\)]*\))*$)/,
        rcolortest = /^((?:rgb|hsl)a?|#)/,
        rcolor = /(rgb|hsl)a?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?(?:\s*,\s*([\.\d]+))?/,
        rshadowsplit = /(,)(?=(?:[^\)]|\([^\)]*\))*$)/g,
        filter = "progid:DXImageTransform.Microsoft.",
        marker = '\u2063',
        rmarker = /\u2063/g,
        rbreakleft = /([\(\[\{])/g,
        rbreakright = /([\)\]\}%°\!\?\u2014])/g,
        rbreakboth = /([\-\u2013])/g,
        rsplit = /[\s\u2063]/,
        rspace = /(\s*)/g,
        rspaceonly = /^\s*$/,
        rprespace = /^(\s*)/,
        prefix = "ui-text-shadow";
    
    // create a plugin
    $.fn.textshadow = function(value, options) {
        if (typeof value === 'object' && !options) {
            options = value;
            value = null;
        }
        var opts = options || {},
            useStyle = opts.useStyle === false ? false : true,
            numShadows = opts.numShadows || 1,
            doDestroy = opts.destroy || false;
        
        // handle clearing all of the shadows
        if (doDestroy) {
            return this.each(function() {
                destroy(this);
            });
        }

        // loop the found items
        return this.each(function() {
            var $elem = $(this),
                copySelector = '.' + prefix + '-copy',
                $copy;
            
            // find the copy elements
            $copy = $elem.find(copySelector);

            // create them if none exist
            if (!$copy.length) {
                // create all of the elements
                allWords(this);
                $copy = $elem.find(copySelector);
            }
            if (useStyle) {
                applyStyles($copy, value);
            } else if (numShadows > 1) {
                $copy.filter(copySelector + '-1').each(function() {
                    var i = 1,
                        $parent = $(this.parentNode),
                        shadowSelector, $elem;
                    while (i < numShadows) {
                        shadowSelector = copySelector + '-' + (i + 1);
                        if (!$parent.find(shadowSelector).length) {
                            $elem = $(this.cloneNode(true))
                                .addClass(shadowSelector.substring(1))
                                .removeClass(prefix + '-copy-1');
                            $parent.prepend($elem);
                        }
                        i++;
                    }
                });
            }
        });
    };

    
    //---------------------
    // For splitting words
    //---------------------
    // function for returning all words in an element as text nodes
    function allWords(elem) {
        $(elem).contents().each(function() {
            if (this.nodeType === 3 && this.data) {
                makeWords(this);
                return true;
            }
            
            var $elem = $(this);
            if (this.nodeType === 1 && (!$elem.hasClass(prefix) || !$elem.hasClass(prefix + '-original') || !$elem.hasClass(prefix + '-copy'))) {
                allWords(this);
                return true;
            }
        });
    }
    
    // splits text nodes
    function makeWords(textNode) {
        // Split the text in the node by space characters
        var split, length, spaces, node,
            text = textNode.nodeValue,
            lastIndex = 0;

        // Skip empty nodes or nodes that are only whitespace
        if (!text || /^\s*$/.test(text)) {
            return;
        }

        //correct for IE break characters
        //leave a strange unicode character as a marker
        text = text.replace(rbreakleft, marker + '$1')
                .replace(rbreakright, '$1' + marker)
                .replace(rbreakboth, marker + '$1' + marker);

        // split the string by break characters
        split = text.split(rsplit);
        
        // remove our markers
        text = text.replace(rmarker, '');

        // Add the original string (it gets split)
        var fragment = document.createDocumentFragment();
        
        // set the "last index" based on leading whitespace
        lastIndex = rprespace.exec(text)[1].length;

        // loop by the splits
        $.each(split, function() {
            length = this.length;

            // IE9 will return empty splits (consecutive spaces)
            if (!length) {
                return true;
            }

            //include the trailing space characters
            rspace.lastIndex = lastIndex + length;
            spaces = rspace.exec(text);         
            
            // slice out our text
            // create a new node with it
            node = wrapWord(text.substr(lastIndex, length + spaces[1].length));
            if (node !== null) {
                fragment.appendChild(node);
            }
            lastIndex = lastIndex + length + spaces[1].length;
        });
        textNode.parentNode.replaceChild(fragment.cloneNode(true), textNode);
    }
    
    var shadowNode = $('<span class="' + prefix + '" />')[0],
        origNode = $('<span class="' + prefix + '-original" />')[0],
        copyNode = $('<span class="' + prefix + '-copy ' + prefix + '-copy-1" />')[0];

    // Removes the generated elements
    function destroy(elem) {
        var $elem = $(elem);

        $elem.find('.' + prefix + '-copy').remove();
        $elem.find('.' + prefix + '-original').unwrap().each(function() {
            $(this).replaceWith(this.childNodes);
        });
    }

    // Wrap words in generated elements
    function wrapWord(text) {
        if (!text.length) { // IE 9
            return null;
        }
        var shadow = shadowNode.cloneNode(false),
            orig = origNode.cloneNode(false),
            copy = copyNode.cloneNode(false);
            
        shadow.appendChild(copy);
        shadow.appendChild(orig);
        
        orig.appendChild(document.createTextNode(text));
        copy.appendChild(document.createTextNode(text));

        return shadow;
    }
    
    //---------------------
    // For Applying Styles
    //---------------------
    function applyStyles($copy, value) {
        // skip this if there's no currentStyle property
        if ($copy.length && !$copy[0].currentStyle) { return; }

        // this will work in IE
        $copy.each(function() {
            var copy = this,
                style = value || copy.currentStyle['text-shadow'],
                $copy = $(copy),
                parent = copy.parentNode,
                shadows, i = 0;
            
            // ensure we have the correct style using inheritence
            while ((!style || style === 'none') && parent.nodeName !== 'HTML') {
                style = parent.currentStyle['text-shadow'];
                parent = parent.parentNode;
            }
            
            // don't apply style if we can't find one
            if (!style || style === 'none') {
                return true;
            }
            
            // split the style, in case of multiple shadows
            shadows = style.split(rtextshadowsplit);

            // loop by the splits
            $.each(shadows, function() {
                var shadow = this;

                if (shadow == ',') { // IE 9
                    return true;
                }

                // parse the style
                var values = shadow.match(rtextshadow),
                    color = 'inherit',
                    opacity = 1,
                    x, y, blur, $elem;

                // capture the values

                // pull out the color from either the first or last position
                // actually remove it from the array
                if (rcolortest.test(values[0])) {
                    opacity = getAlpha(values[0]);
                    color = toHex(values.shift());
                } else if (rcolortest.test(values[values.length - 1])) {
                    opacity = getAlpha(values[values.length - 1]);
                    color = toHex(values.pop());
                }

                x = parseFloat(values[0]); // TODO: handle units
                y = parseFloat(values[1]); // TODO: handle units
                blur = values[2] !== undefined ? parseFloat(values[2]) : 0; // TODO: handle units
                
                // create new shadows when multiple shadows exist
                if (i == 0) {
                    $elem = $copy;
                } else {
                    $elem = $copy.clone().prependTo($copy.parent())
                        .addClass(prefix + '-copy-' + (i + 1))
                        .removeClass(prefix + '-copy-1');
                }

                // style the element
                $elem.css({
                    color: color,
                    left: (x - blur) + 'px',
                    top: (y - blur) + 'px'
                });
                
                // add in the filters
                if (opacity < 1 || blur > 0) {
                    $elem[0].style.filter = [
                        opacity < 1 ? filter + "Alpha(opacity=" + parseInt(opacity * 100, 10) + ") " : '',
                        blur > 0 ? filter + "Blur(pixelRadius=" + blur + ")" : ''
                    ].join('');
                }
                i++;
            });
        });
    }
    
    //---------------------
    // For Colors
    //---------------------
    // http://haacked.com/archive/2009/12/29/convert-rgb-to-hex.aspx
    function toHex(color) {
        // handle rgb
        var matches = rcolor.exec(color), rgb;
        
        // handle hsl
        if (matches && matches[1] === 'hsl') {
            rgb = hsl2rgb(matches[2], matches[3], matches[4]);
            matches[2] = rgb[0];
            matches[3] = rgb[1];
            matches[4] = rgb[2];
        }
        
        // convert to hex
        return matches ? '#' + (1 << 24 | matches[2] << 16 | matches[3] << 8 | matches[4]).toString(16).substr(1) : color;
    }
    
    function getAlpha(color) {
        var matches = rcolor.exec(color);
        if (matches) {
            return matches[5] !== undefined ? matches[5] : 1; 
        }
        return 1;
    }
    
    // http://www.codingforums.com/showthread.php?t=11156
    function hsl2rgb(h, s, l) {
        var m1, m2, hue, r, g, b;
        s /=100;
        l /= 100;
        if (s === 0) {
            r = g = b = (l * 255);
        } else {
            if (l <= 0.5) {
                m2 = l * (s + 1);
            } else {
                m2 = l + s - l * s;
            }
            m1 = l * 2 - m2;
            hue = h / 360;
            r = hue2rgb(m1, m2, hue + 1/3);
            g = hue2rgb(m1, m2, hue);
            b = hue2rgb(m1, m2, hue - 1/3);
        }
        return [r, g, b];
    }
    
    function hue2rgb(m1, m2, hue) {
        var v;
        if (hue < 0) {
            hue += 1;
        } else if (hue > 1) {
            hue -= 1;
        }

        if (6 * hue < 1) {
            v = m1 + (m2 - m1) * hue * 6;
        } else if (2 * hue < 1) {
            v = m2;
        } else if (3 * hue < 2) {
            v = m1 + (m2 - m1) * (2/3 - hue) * 6;
        } else {
            v = m1;
        }

        return 255 * v;
    }
})(jQuery, this);