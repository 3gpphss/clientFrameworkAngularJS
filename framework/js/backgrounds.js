(function ($)
{
    $('body.gray-gradient-ribbon').prepend(
        E('div', 'gray-gradient-ribbon')
    )
    
    $('body.radial-gradient')
        .prepend(
            E('img', 'radial-gradient')
                .attr('src', 'images/background-radial-gradient.jpg')
        )
    
    var $parallax_body = $('body.parallax')
    
    if ($parallax_body.length > 0)
    {
        $moving_layer = E('div', 'parallax')
        $parallax_body.prepend($moving_layer)
        $window = $(window)
        
        $window.scroll(function (e)
        {
            var amount = $window.scrollTop() * 0.2;
            $moving_layer.css('background-position', '0 -'+amount+'px')
        })
    }
})(jQuery)