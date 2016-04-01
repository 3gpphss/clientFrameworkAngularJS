(function ($)
{
    $.fn.tree = function ()
    {
        return this.each(function ()
        {
            var $tree = $(this)
            
            var sort_list = function ($ul)
            {
                $ul.find('> li').sort(function (a,b)
                {
                    var atext = $(a).find('> a').text().toUpperCase()
                    var btext = $(b).find('> a').text().toUpperCase()
                    return atext > btext ? 1 : -1
                    
                }).appendTo($ul)
            }
            
            if ($tree.is('.sorted'))
            {
                sort_list($tree)
                
                $tree.find('ul').each(function ()
                {
                    sort_list($(this))
                })
            }
            
			var left_padding_offset = parseInt($tree.find('li:first > a:first').css('padding-left'))
			
            var wrap_link = function ($a)
            {
                if ($a.find('span.text').length == 0)
                {
                    $a.wrapInner(E('span', 'content', E('span', 'text')))
                }
                else
                {
                    $a.wrapInner(E('span', 'content'))
                }
            }
            
            var make_branch = function ($li, depth)
            {
                $li
                    .addClass('branch')
                    .find('> a')
                        .css('padding-left', 20 * depth + left_padding_offset + 'px')
                        .each(function ()
                        {
                            wrap_link($(this))
                        })
                        .find('.content')
                            .prepend(E('span', 'arrow'))
                        .end()
                        .click(function (e)
                        {
                            e.preventDefault()
                            
                            if ($li.is('.disabled'))
                            {
                                return
                            }
                            
                            if ($li.is('.expanded'))
                            {
                                $li.removeClass('expanded')
								$tree.trigger('leaf-collapsed', $li)
                            }
                            else
                            {
                                $li.addClass('expanded')
								$tree.trigger('leaf-expanded', $li)
                            }
                        })
                
                $li.find('> ul > li').each(function ()
                {
                    make_node($(this), depth + 1)
                })
            }
            
            var make_leaf = function ($li, depth)
            {
                $li
                    .addClass('leaf')
                    .find('> a')
                    .css('padding-left', 20 * depth + left_padding_offset + 'px')
				    .each(function ()
                    {
                        wrap_link($(this))
                    })
                    .find('.content')
                        .prepend(E('span', 'bullet'))
                    .end()
            }
            
            var make_node = function ($li, depth)
            {
                if ($li.find('> ul').length > 0)
                {
                    make_branch($li, depth)
                }
                else
                {
                    make_leaf($li, depth)
                }
            }
            
            $tree
                .find('> li')
                    .each(function () { make_node($(this), 0) })
                .end()
                .find('a')
                    .click(function (e)
                    {
						e.preventDefault()
						
                        if ($(this).parent().is('.disabled'))
                        {
                            return
                        }
						
                        $tree.find('.selected').removeClass('selected')
                        $(this).parent().addClass('selected')
                    })
        })
    }
	
    $(function () { $('.tree').tree() })
})(jQuery)