(function($) {
  /*
  Scrolling to the top from an iframe HTMl element in case of it was not scrolled there before.

  In Internet Explorer a different condition has to be used for checking the scrollbar's vertical
  position than in other browsers like Google Chrome, Mozilla Firefox and Opera.
  In order to make sure that the operation is performed smoothly a 1s scrolling animation is set.
  */
  if(window.parent.$("html, body").scrollTop() > 0 || window.parent.$("body").scrollTop() > 0) {
    window.parent.$("html, body").animate({scrollTop:0}, 1000);
  }
})(jQuery)
