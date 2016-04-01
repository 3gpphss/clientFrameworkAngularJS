/*!
 * WULF v1.0.43 (http://networks.nokia.com/)
 * Copyright 2015 Nokia Solutions and Networks. All rights Reserved.
 * jshint ignore:start 
 */
//For debug, the file name is: bootstrap.js
/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.6'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.6'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.6'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.6'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.6'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.6'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.6'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.6'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.6'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

//For debug, the file name is: jquery.mousewheel.js
/*!
 * jQuery Mousewheel 3.1.13
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 */

(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
                    ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.12',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
            // Clean up the data we added to the element
            $.removeData(this, 'mousewheel-line-height');
            $.removeData(this, 'mousewheel-page-height');
        },

        getLineHeight: function(elem) {
            var $elem = $(elem),
                $parent = $elem['offsetParent' in $.fn ? 'offsetParent' : 'parent']();
            if (!$parent.length) {
                $parent = $('body');
            }
            return parseInt($parent.css('fontSize'), 10) || parseInt($elem.css('fontSize'), 10) || 16;
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true, // see shouldAdjustOldDeltas() below
            normalizeOffset: true  // calls getBoundingClientRect for each event
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0,
            offsetX    = 0,
            offsetY    = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Normalise offsetX and offsetY properties
        if ( special.settings.normalizeOffset && this.getBoundingClientRect ) {
            var boundingRect = this.getBoundingClientRect();
            offsetX = event.clientX - boundingRect.left;
            offsetY = event.clientY - boundingRect.top;
        }

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        event.offsetX = offsetX;
        event.offsetY = offsetY;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }

}));

//For debug, the file name is: jquery.mCustomScrollbar.js
/*
== malihu jquery custom scrollbar plugin == 
Version: 3.0.9 
Plugin URI: http://manos.malihu.gr/jquery-custom-content-scroller 
Author: malihu
Author URI: http://manos.malihu.gr
License: MIT License (MIT)
*/

/*
Copyright 2010 Manos Malihutsakis (email: manos@malihu.gr)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
The code below is fairly long, fully commented and should be normally used in development. 
For production, use either the minified jquery.mCustomScrollbar.min.js script or 
the production-ready jquery.mCustomScrollbar.concat.min.js which contains the plugin 
and dependencies (minified). 
*/

(function(factory){
	if(typeof module!=="undefined" && module.exports){
		module.exports=factory;
	}else{
		factory(jQuery,window,document);
	}
}(function($){
(function(init){
	var _rjs=typeof define==="function" && define.amd, /* RequireJS */
		_njs=typeof module !== "undefined" && module.exports, /* NodeJS */
		_dlp=("https:"==document.location.protocol) ? "https:" : "http:", /* location protocol */
		_url="cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.12/jquery.mousewheel.min.js";
	if(!_rjs){
		if(_njs){
			require("jquery-mousewheel")($);
		}else{
			/* load jquery-mousewheel plugin (via CDN) if it's not present or not loaded via RequireJS 
			(works when mCustomScrollbar fn is called on window load) */
			$.event.special.mousewheel || $("head").append(decodeURI("%3Cscript src="+_dlp+"//"+_url+"%3E%3C/script%3E"));
		}
	}
	init();
}(function(){
	
	/* 
	----------------------------------------
	PLUGIN NAMESPACE, PREFIX, DEFAULT SELECTOR(S) 
	----------------------------------------
	*/
	
	var pluginNS="mCustomScrollbar",
		pluginPfx="mCS",
		defaultSelector=".mCustomScrollbar",
	
	
		
	
	
	/* 
	----------------------------------------
	DEFAULT OPTIONS 
	----------------------------------------
	*/
	
		defaults={
			/*
			set element/content width/height programmatically 
			values: boolean, pixels, percentage 
				option						default
				-------------------------------------
				setWidth					false
				setHeight					false
			*/
			/*
			set the initial css top property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setTop:0,
			/*
			set the initial css left property of content  
			values: string (e.g. "-100px", "10%" etc.)
			*/
			setLeft:0,
			/* 
			scrollbar axis (vertical and/or horizontal scrollbars) 
			values (string): "y", "x", "yx"
			*/
			axis:"y",
			/*
			position of scrollbar relative to content  
			values (string): "inside", "outside" ("outside" requires elements with position:relative)
			*/
			scrollbarPosition:"inside",
			/*
			scrolling inertia
			values: integer (milliseconds)
			*/
			scrollInertia:950,
			/* 
			auto-adjust scrollbar dragger length
			values: boolean
			*/
			autoDraggerLength:true,
			/*
			auto-hide scrollbar when idle 
			values: boolean
				option						default
				-------------------------------------
				autoHideScrollbar			false
			*/
			/*
			auto-expands scrollbar on mouse-over and dragging
			values: boolean
				option						default
				-------------------------------------
				autoExpandScrollbar			false
			*/
			/*
			always show scrollbar, even when there's nothing to scroll 
			values: integer (0=disable, 1=always show dragger rail and buttons, 2=always show dragger rail, dragger and buttons), boolean
			*/
			alwaysShowScrollbar:0,
			/*
			scrolling always snaps to a multiple of this number in pixels
			values: integer
				option						default
				-------------------------------------
				snapAmount					null
			*/
			/*
			when snapping, snap with this number in pixels as an offset 
			values: integer
			*/
			snapOffset:0,
			/* 
			mouse-wheel scrolling
			*/
			mouseWheel:{
				/* 
				enable mouse-wheel scrolling
				values: boolean
				*/
				enable:true,
				/* 
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto",
				/* 
				mouse-wheel scrolling axis 
				the default scrolling direction when both vertical and horizontal scrollbars are present 
				values (string): "y", "x" 
				*/
				axis:"y",
				/* 
				prevent the default behaviour which automatically scrolls the parent element(s) when end of scrolling is reached 
				values: boolean
					option						default
					-------------------------------------
					preventDefault				null
				*/
				/*
				the reported mouse-wheel delta value. The number of lines (translated to pixels) one wheel notch scrolls.  
				values: "auto", integer 
				"auto" uses the default OS/browser value 
				*/
				deltaFactor:"auto",
				/*
				normalize mouse-wheel delta to -1 or 1 (disables mouse-wheel acceleration) 
				values: boolean
					option						default
					-------------------------------------
					normalizeDelta				null
				*/
				/*
				invert mouse-wheel scrolling direction 
				values: boolean
					option						default
					-------------------------------------
					invert						null
				*/
				/*
				the tags that disable mouse-wheel when cursor is over them
				*/
				disableOver:["select","option","keygen","datalist","textarea"]
			},
			/* 
			scrollbar buttons
			*/
			scrollButtons:{ 
				/*
				enable scrollbar buttons
				values: boolean
					option						default
					-------------------------------------
					enable						null
				*/
				/*
				scrollbar buttons scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
				/*
				tabindex of the scrollbar buttons
				values: false, integer
					option						default
					-------------------------------------
					tabindex					null
				*/
			},
			/* 
			keyboard scrolling
			*/
			keyboard:{ 
				/*
				enable scrolling via keyboard
				values: boolean
				*/
				enable:true,
				/*
				keyboard scrolling type 
				values (string): "stepless", "stepped"
				*/
				scrollType:"stepless",
				/*
				scrolling amount in pixels
				values: "auto", integer 
				*/
				scrollAmount:"auto"
			},
			/*
			enable content touch-swipe scrolling 
			values: boolean, integer, string (number)
			integer values define the axis-specific minimum amount required for scrolling momentum
			*/
			contentTouchScroll:25,
			/*
			advanced option parameters
			*/
			advanced:{
				/*
				auto-expand content horizontally (for "x" or "yx" axis) 
				values: boolean
					option						default
					-------------------------------------
					autoExpandHorizontalScroll	null
				*/
				/*
				auto-scroll to elements with focus
				*/
				autoScrollOnFocus:"input,textarea,select,button,datalist,keygen,a[tabindex],area,object,[contenteditable='true']",
				/*
				auto-update scrollbars on content, element or viewport resize 
				should be true for fluid layouts/elements, adding/removing content dynamically, hiding/showing elements, content with images etc. 
				values: boolean
				*/
				updateOnContentResize:true,
				/*
				auto-update scrollbars each time each image inside the element is fully loaded 
				values: boolean
				*/
				updateOnImageLoad:true,
				/*
				auto-update scrollbars based on the amount and size changes of specific selectors 
				useful when you need to update the scrollbar(s) automatically, each time a type of element is added, removed or changes its size 
				values: boolean, string (e.g. "ul li" will auto-update scrollbars each time list-items inside the element are changed) 
				a value of true (boolean) will auto-update scrollbars each time any element is changed
					option						default
					-------------------------------------
					updateOnSelectorChange		null
				*/
				/*
				extra selectors that'll release scrollbar dragging upon mouseup, pointerup, touchend etc. (e.g. "selector-1, selector-2")
					option						default
					-------------------------------------
					releaseDraggableSelectors	null
				*/
				/*
				auto-update timeout 
				values: integer (milliseconds)
				*/
				autoUpdateTimeout:60
			},
			/* 
			scrollbar theme 
			values: string (see CSS/plugin URI for a list of ready-to-use themes)
			*/
			theme:"light",
			/*
			user defined callback functions
			*/
			callbacks:{
				/*
				Available callbacks: 
					callback					default
					-------------------------------------
					onInit						null
					onScrollStart				null
					onScroll					null
					onTotalScroll				null
					onTotalScrollBack			null
					whileScrolling				null
					onOverflowY					null
					onOverflowX					null
					onOverflowYNone				null
					onOverflowXNone				null
					onImageLoad					null
					onSelectorChange			null
					onUpdate					null
				*/
				onTotalScrollOffset:0,
				onTotalScrollBackOffset:0,
				alwaysTriggerOffsets:true
			}
			/*
			add scrollbar(s) on all elements matching the current selector, now and in the future 
			values: boolean, string 
			string values: "on" (enable), "once" (disable after first invocation), "off" (disable)
			liveSelector values: string (selector)
				option						default
				-------------------------------------
				live						false
				liveSelector				null
			*/
		},
	
	
	
	
	
	/* 
	----------------------------------------
	VARS, CONSTANTS 
	----------------------------------------
	*/
	
		totalInstances=0, /* plugin instances amount */
		liveTimers={}, /* live option timers */
		oldIE=(window.attachEvent && !window.addEventListener) ? 1 : 0, /* detect IE < 9 */
		touchActive=false,touchable, /* global touch vars (for touch and pointer events) */
		/* general plugin classes */
		classes=[
			"mCSB_dragger_onDrag","mCSB_scrollTools_onDrag","mCS_img_loaded","mCS_disabled","mCS_destroyed","mCS_no_scrollbar",
			"mCS-autoHide","mCS-dir-rtl","mCS_no_scrollbar_y","mCS_no_scrollbar_x","mCS_y_hidden","mCS_x_hidden","mCSB_draggerContainer",
			"mCSB_buttonUp","mCSB_buttonDown","mCSB_buttonLeft","mCSB_buttonRight"
		],
		
	
	
	
	
	/* 
	----------------------------------------
	METHODS 
	----------------------------------------
	*/
	
		methods={
			
			/* 
			plugin initialization method 
			creates the scrollbar(s), plugin data object and options
			----------------------------------------
			*/
			
			init:function(options){
				
				var options=$.extend(true,{},defaults,options),
					selector=_selector.call(this); /* validate selector */
				
				/* 
				if live option is enabled, monitor for elements matching the current selector and 
				apply scrollbar(s) when found (now and in the future) 
				*/
				if(options.live){
					var liveSelector=options.liveSelector || this.selector || defaultSelector, /* live selector(s) */
						$liveSelector=$(liveSelector); /* live selector(s) as jquery object */
					if(options.live==="off"){
						/* 
						disable live if requested 
						usage: $(selector).mCustomScrollbar({live:"off"}); 
						*/
						removeLiveTimers(liveSelector);
						return;
					}
					liveTimers[liveSelector]=setTimeout(function(){
						/* call mCustomScrollbar fn on live selector(s) every half-second */
						$liveSelector.mCustomScrollbar(options);
						if(options.live==="once" && $liveSelector.length){
							/* disable live after first invocation */
							removeLiveTimers(liveSelector);
						}
					},500);
				}else{
					removeLiveTimers(liveSelector);
				}
				
				/* options backward compatibility (for versions < 3.0.0) and normalization */
				options.setWidth=(options.set_width) ? options.set_width : options.setWidth;
				options.setHeight=(options.set_height) ? options.set_height : options.setHeight;
				options.axis=(options.horizontalScroll) ? "x" : _findAxis(options.axis);
				options.scrollInertia=options.scrollInertia>0 && options.scrollInertia<17 ? 17 : options.scrollInertia;
				if(typeof options.mouseWheel!=="object" &&  options.mouseWheel==true){ /* old school mouseWheel option (non-object) */
					options.mouseWheel={enable:true,scrollAmount:"auto",axis:"y",preventDefault:false,deltaFactor:"auto",normalizeDelta:false,invert:false}
				}
				options.mouseWheel.scrollAmount=!options.mouseWheelPixels ? options.mouseWheel.scrollAmount : options.mouseWheelPixels;
				options.mouseWheel.normalizeDelta=!options.advanced.normalizeMouseWheelDelta ? options.mouseWheel.normalizeDelta : options.advanced.normalizeMouseWheelDelta;
				options.scrollButtons.scrollType=_findScrollButtonsType(options.scrollButtons.scrollType); 
				
				_theme(options); /* theme-specific options */
				
				/* plugin constructor */
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if(!$this.data(pluginPfx)){ /* prevent multiple instantiations */
					
						/* store options and create objects in jquery data */
						$this.data(pluginPfx,{
							idx:++totalInstances, /* instance index */
							opt:options, /* options */
							scrollRatio:{y:null,x:null}, /* scrollbar to content ratio */
							overflowed:null, /* overflowed axis */
							contentReset:{y:null,x:null}, /* object to check when content resets */
							bindEvents:false, /* object to check if events are bound */
							tweenRunning:false, /* object to check if tween is running */
							sequential:{}, /* sequential scrolling object */
							langDir:$this.css("direction"), /* detect/store direction (ltr or rtl) */
							cbOffsets:null, /* object to check whether callback offsets always trigger */
							/* 
							object to check how scrolling events where last triggered 
							"internal" (default - triggered by this script), "external" (triggered by other scripts, e.g. via scrollTo method) 
							usage: object.data("mCS").trigger
							*/
							trigger:null
						});
						
						var d=$this.data(pluginPfx),o=d.opt,
							/* HTML data attributes */
							htmlDataAxis=$this.data("mcs-axis"),htmlDataSbPos=$this.data("mcs-scrollbar-position"),htmlDataTheme=$this.data("mcs-theme");
						 
						if(htmlDataAxis){o.axis=htmlDataAxis;} /* usage example: data-mcs-axis="y" */
						if(htmlDataSbPos){o.scrollbarPosition=htmlDataSbPos;} /* usage example: data-mcs-scrollbar-position="outside" */
						if(htmlDataTheme){ /* usage example: data-mcs-theme="minimal" */
							o.theme=htmlDataTheme;
							_theme(o); /* theme-specific options */
						}
						
						_pluginMarkup.call(this); /* add plugin markup */
						
						$("#mCSB_"+d.idx+"_container img:not(."+classes[2]+")").addClass(classes[2]); /* flag loaded images */
						
						methods.update.call(null,$this); /* call the update method */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin update method 
			updates content and scrollbar(s) values, events and status 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("update");
			*/
			
			update:function(el,cb){
				
				var selector=el || _selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx),o=d.opt,
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
						
						if(!mCSB_container.length){return;}
						
						if(d.tweenRunning){_stop($this);} /* stop any running tweens while updating */
						
						/* if element was disabled or destroyed, remove class(es) */
						if($this.hasClass(classes[3])){$this.removeClass(classes[3]);}
						if($this.hasClass(classes[4])){$this.removeClass(classes[4]);}
						
						_maxHeight.call(this); /* detect/set css max-height value */
						
						_expandContentHorizontally.call(this); /* expand content horizontally */
						
						if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
							mCSB_container.css("width",_contentWidth(mCSB_container.children()));
						}
						
						d.overflowed=_overflowed.call(this); /* determine if scrolling is required */
						
						_scrollbarVisibility.call(this); /* show/hide scrollbar(s) */
						
						/* auto-adjust scrollbar dragger length analogous to content */
						if(o.autoDraggerLength){_setDraggerLength.call(this);}
						
						_scrollRatio.call(this); /* calculate and store scrollbar to content ratio */
						
						_bindEvents.call(this); /* bind scrollbar events */
						
						/* reset scrolling position and/or events */
						var to=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)];
						if(o.axis!=="x"){ /* y/yx axis */
							if(!d.overflowed[0]){ /* y scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="y"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[1]){
									_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[0].height()>mCSB_dragger[0].parent().height()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* y scrolling is required */
								_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								d.contentReset.y=null;
							}
						}
						if(o.axis!=="y"){ /* x/yx axis */
							if(!d.overflowed[1]){ /* x scrolling is not required */
								_resetContentPosition.call(this); /* reset content position */
								if(o.axis==="x"){
									_unbindEvents.call(this);
								}else if(o.axis==="yx" && d.overflowed[0]){
									_scrollTo($this,to[0].toString(),{dir:"y",dur:0,overwrite:"none"});
								}
							}else if(mCSB_dragger[1].width()>mCSB_dragger[1].parent().width()){
								_resetContentPosition.call(this); /* reset content position */
							}else{ /* x scrolling is required */
								_scrollTo($this,to[1].toString(),{dir:"x",dur:0,overwrite:"none"});
								d.contentReset.x=null;
							}
						}
						
						/* callbacks: onImageLoad, onSelectorChange, onUpdate */
						if(cb && d){
							if(cb===2 && o.callbacks.onImageLoad && typeof o.callbacks.onImageLoad==="function"){
								o.callbacks.onImageLoad.call(this);
							}else if(cb===3 && o.callbacks.onSelectorChange && typeof o.callbacks.onSelectorChange==="function"){
								o.callbacks.onSelectorChange.call(this);
							}else if(o.callbacks.onUpdate && typeof o.callbacks.onUpdate==="function"){
								o.callbacks.onUpdate.call(this);
							}
						}
						
						_autoUpdate.call(this); /* initialize automatic updating (for dynamic content, fluid layouts etc.) */
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/* 
			plugin scrollTo method 
			triggers a scrolling event to a specific value
			----------------------------------------
			usage: $(selector).mCustomScrollbar("scrollTo",value,options);
			*/
		
			scrollTo:function(val,options){
				
				/* prevent silly things like $(selector).mCustomScrollbar("scrollTo",undefined); */
				if(typeof val=="undefined" || val==null){return;}
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							/* method default options */
							methodDefaults={
								trigger:"external", /* method is by default triggered externally (e.g. from other scripts) */
								scrollInertia:o.scrollInertia, /* scrolling inertia (animation duration) */
								scrollEasing:"mcsEaseInOut", /* animation easing */
								moveDragger:false, /* move dragger instead of content */
								timeout:60, /* scroll-to delay */
								callbacks:true, /* enable/disable callbacks */
								onStart:true,
								onUpdate:true,
								onComplete:true
							},
							methodOptions=$.extend(true,{},methodDefaults,options),
							to=_arr.call(this,val),dur=methodOptions.scrollInertia>0 && methodOptions.scrollInertia<17 ? 17 : methodOptions.scrollInertia;
						
						/* translate yx values to actual scroll-to positions */
						to[0]=_to.call(this,to[0],"y");
						to[1]=_to.call(this,to[1],"x");
						
						/* 
						check if scroll-to value moves the dragger instead of content. 
						Only pixel values apply on dragger (e.g. 100, "100px", "-=100" etc.) 
						*/
						if(methodOptions.moveDragger){
							to[0]*=d.scrollRatio.y;
							to[1]*=d.scrollRatio.x;
						}
						
						methodOptions.dur=dur;
						
						setTimeout(function(){ 
							/* do the scrolling */
							if(to[0]!==null && typeof to[0]!=="undefined" && o.axis!=="x" && d.overflowed[0]){ /* scroll y */
								methodOptions.dir="y";
								methodOptions.overwrite="all";
								_scrollTo($this,to[0].toString(),methodOptions);
							}
							if(to[1]!==null && typeof to[1]!=="undefined" && o.axis!=="y" && d.overflowed[1]){ /* scroll x */
								methodOptions.dir="x";
								methodOptions.overwrite="none";
								_scrollTo($this,to[1].toString(),methodOptions);
							}
						},methodOptions.timeout);
						
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin stop method 
			stops scrolling animation
			----------------------------------------
			usage: $(selector).mCustomScrollbar("stop");
			*/
			stop:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
										
						_stop($this);
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin disable method 
			temporarily disables the scrollbar(s) 
			----------------------------------------
			usage: $(selector).mCustomScrollbar("disable",reset); 
			reset (boolean): resets content position to 0 
			*/
			disable:function(r){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
						
						var d=$this.data(pluginPfx);
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						if(r){_resetContentPosition.call(this);} /* reset content position */
						
						_scrollbarVisibility.call(this,true); /* show/hide scrollbar(s) */
						
						$this.addClass(classes[3]); /* add disable class */
					
					}
					
				});
				
			},
			/* ---------------------------------------- */
			
			
			
			/*
			plugin destroy method 
			completely removes the scrollbar(s) and returns the element to its original state
			----------------------------------------
			usage: $(selector).mCustomScrollbar("destroy"); 
			*/
			destroy:function(){
				
				var selector=_selector.call(this); /* validate selector */
				
				return $(selector).each(function(){
					
					var $this=$(this);
					
					if($this.data(pluginPfx)){ /* check if plugin has initialized */
					
						var d=$this.data(pluginPfx),o=d.opt,
							mCustomScrollBox=$("#mCSB_"+d.idx),
							mCSB_container=$("#mCSB_"+d.idx+"_container"),
							scrollbar=$(".mCSB_"+d.idx+"_scrollbar");
					
						if(o.live){removeLiveTimers(o.liveSelector || $(selector).selector);} /* remove live timers */
						
						_autoUpdate.call(this,"remove"); /* remove automatic updating */
						
						_unbindEvents.call(this); /* unbind events */
						
						_resetContentPosition.call(this); /* reset content position */
						
						$this.removeData(pluginPfx); /* remove plugin data object */
						
						_delete(this,"mcs"); /* delete callbacks object */
						
						/* remove plugin markup */
						scrollbar.remove(); /* remove scrollbar(s) first (those can be either inside or outside plugin's inner wrapper) */
						mCSB_container.find("img."+classes[2]).removeClass(classes[2]); /* remove loaded images flag */
						mCustomScrollBox.replaceWith(mCSB_container.contents()); /* replace plugin's inner wrapper with the original content */
						/* remove plugin classes from the element and add destroy class */
						$this.removeClass(pluginNS+" _"+pluginPfx+"_"+d.idx+" "+classes[6]+" "+classes[7]+" "+classes[5]+" "+classes[3]).addClass(classes[4]);
					
					}
					
				});
				
			}
			/* ---------------------------------------- */
			
		},
	
	
	
	
		
	/* 
	----------------------------------------
	FUNCTIONS
	----------------------------------------
	*/
	
		/* validates selector (if selector is invalid or undefined uses the default one) */
		_selector=function(){
			return (typeof $(this)!=="object" || $(this).length<1) ? defaultSelector : this;
		},
		/* -------------------- */
		
		
		/* changes options according to theme */
		_theme=function(obj){
			var fixedSizeScrollbarThemes=["rounded","rounded-dark","rounded-dots","rounded-dots-dark"],
				nonExpandedScrollbarThemes=["rounded-dots","rounded-dots-dark","3d","3d-dark","3d-thick","3d-thick-dark","inset","inset-dark","inset-2","inset-2-dark","inset-3","inset-3-dark"],
				disabledScrollButtonsThemes=["minimal","minimal-dark"],
				enabledAutoHideScrollbarThemes=["minimal","minimal-dark"],
				scrollbarPositionOutsideThemes=["minimal","minimal-dark"];
			obj.autoDraggerLength=$.inArray(obj.theme,fixedSizeScrollbarThemes) > -1 ? false : obj.autoDraggerLength;
			obj.autoExpandScrollbar=$.inArray(obj.theme,nonExpandedScrollbarThemes) > -1 ? false : obj.autoExpandScrollbar;
			obj.scrollButtons.enable=$.inArray(obj.theme,disabledScrollButtonsThemes) > -1 ? false : obj.scrollButtons.enable;
			obj.autoHideScrollbar=$.inArray(obj.theme,enabledAutoHideScrollbarThemes) > -1 ? true : obj.autoHideScrollbar;
			obj.scrollbarPosition=$.inArray(obj.theme,scrollbarPositionOutsideThemes) > -1 ? "outside" : obj.scrollbarPosition;
		},
		/* -------------------- */
		
		
		/* live option timers removal */
		removeLiveTimers=function(selector){
			if(liveTimers[selector]){
				clearTimeout(liveTimers[selector]);
				_delete(liveTimers,selector);
			}
		},
		/* -------------------- */
		
		
		/* normalizes axis option to valid values: "y", "x", "yx" */
		_findAxis=function(val){
			return (val==="yx" || val==="xy" || val==="auto") ? "yx" : (val==="x" || val==="horizontal") ? "x" : "y";
		},
		/* -------------------- */
		
		
		/* normalizes scrollButtons.scrollType option to valid values: "stepless", "stepped" */
		_findScrollButtonsType=function(val){
			return (val==="stepped" || val==="pixels" || val==="step" || val==="click") ? "stepped" : "stepless";
		},
		/* -------------------- */
		
		
		/* generates plugin markup */
		_pluginMarkup=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				expandClass=o.autoExpandScrollbar ? " "+classes[1]+"_expand" : "",
				scrollbar=["<div id='mCSB_"+d.idx+"_scrollbar_vertical' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_vertical"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_vertical' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>","<div id='mCSB_"+d.idx+"_scrollbar_horizontal' class='mCSB_scrollTools mCSB_"+d.idx+"_scrollbar mCS-"+o.theme+" mCSB_scrollTools_horizontal"+expandClass+"'><div class='"+classes[12]+"'><div id='mCSB_"+d.idx+"_dragger_horizontal' class='mCSB_dragger' style='position:absolute;' oncontextmenu='return false;'><div class='mCSB_dragger_bar' /></div><div class='mCSB_draggerRail' /></div></div>"],
				wrapperClass=o.axis==="yx" ? "mCSB_vertical_horizontal" : o.axis==="x" ? "mCSB_horizontal" : "mCSB_vertical",
				scrollbars=o.axis==="yx" ? scrollbar[0]+scrollbar[1] : o.axis==="x" ? scrollbar[1] : scrollbar[0],
				contentWrapper=o.axis==="yx" ? "<div id='mCSB_"+d.idx+"_container_wrapper' class='mCSB_container_wrapper' />" : "",
				autoHideClass=o.autoHideScrollbar ? " "+classes[6] : "",
				scrollbarDirClass=(o.axis!=="x" && d.langDir==="rtl") ? " "+classes[7] : "";
			if(o.setWidth){$this.css("width",o.setWidth);} /* set element width */
			if(o.setHeight){$this.css("height",o.setHeight);} /* set element height */
			o.setLeft=(o.axis!=="y" && d.langDir==="rtl") ? "989999px" : o.setLeft; /* adjust left position for rtl direction */
			$this.addClass(pluginNS+" _"+pluginPfx+"_"+d.idx+autoHideClass+scrollbarDirClass).wrapInner("<div id='mCSB_"+d.idx+"' class='mCustomScrollBox mCS-"+o.theme+" "+wrapperClass+"'><div id='mCSB_"+d.idx+"_container' class='mCSB_container' style='position:relative; top:"+o.setTop+"; left:"+o.setLeft+";' dir="+d.langDir+" /></div>");
			var mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.axis!=="y" && !o.advanced.autoExpandHorizontalScroll){
				mCSB_container.css("width",_contentWidth(mCSB_container.children()));
			}
			if(o.scrollbarPosition==="outside"){
				if($this.css("position")==="static"){ /* requires elements with non-static position */
					$this.css("position","relative");
				}
				$this.css("overflow","visible");
				mCustomScrollBox.addClass("mCSB_outside").after(scrollbars);
			}else{
				mCustomScrollBox.addClass("mCSB_inside").append(scrollbars);
				mCSB_container.wrap(contentWrapper);
			}
			_scrollButtons.call(this); /* add scrollbar buttons */
			/* minimum dragger length */
			var mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			mCSB_dragger[0].css("min-height",mCSB_dragger[0].height());
			mCSB_dragger[1].css("min-width",mCSB_dragger[1].width());
		},
		/* -------------------- */
		
		
		/* calculates content width */
		_contentWidth=function(el){
			return Math.max.apply(Math,el.map(function(){return $(this).outerWidth(true);}).get());
		},
		/* -------------------- */
		
		
		/* expands content horizontally */
		_expandContentHorizontally=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.autoExpandHorizontalScroll && o.axis!=="y"){
				/* 
				wrap content with an infinite width div and set its position to absolute and width to auto. 
				Setting width to auto before calculating the actual width is important! 
				We must let the browser set the width as browser zoom values are impossible to calculate.
				*/
				mCSB_container.css({"position":"absolute","width":"auto"})
					.wrap("<div class='mCSB_h_wrapper' style='position:relative; left:0; width:999999px;' />")
					.css({ /* set actual width, original position and un-wrap */
						/* 
						get the exact width (with decimals) and then round-up. 
						Using jquery outerWidth() will round the width value which will mess up with inner elements that have non-integer width
						*/
						"width":(Math.ceil(mCSB_container[0].getBoundingClientRect().right+0.4)-Math.floor(mCSB_container[0].getBoundingClientRect().left)),
						"position":"relative"
					}).unwrap();
			}
		},
		/* -------------------- */
		
		
		/* adds scrollbar buttons */
		_scrollButtons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_scrollTools=$(".mCSB_"+d.idx+"_scrollbar:first"),
				tabindex=!_isNumeric(o.scrollButtons.tabindex) ? "" : "tabindex='"+o.scrollButtons.tabindex+"'",
				btnHTML=[
					"<a href='#' class='"+classes[13]+"' oncontextmenu='return false;' "+tabindex+" />",
					"<a href='#' class='"+classes[14]+"' oncontextmenu='return false;' "+tabindex+" />",
					"<a href='#' class='"+classes[15]+"' oncontextmenu='return false;' "+tabindex+" />",
					"<a href='#' class='"+classes[16]+"' oncontextmenu='return false;' "+tabindex+" />"
				],
				btn=[(o.axis==="x" ? btnHTML[2] : btnHTML[0]),(o.axis==="x" ? btnHTML[3] : btnHTML[1]),btnHTML[2],btnHTML[3]];
			if(o.scrollButtons.enable){
				mCSB_scrollTools.prepend(btn[0]).append(btn[1]).next(".mCSB_scrollTools").prepend(btn[2]).append(btn[3]);
			}
		},
		/* -------------------- */
		
		
		/* detects/sets css max-height value */
		_maxHeight=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mh=$this.css("max-height") || "none",pct=mh.indexOf("%")!==-1,
				bs=$this.css("box-sizing");
			if(mh!=="none"){
				var val=pct ? $this.parent().height()*parseInt(mh)/100 : parseInt(mh);
				/* if element's css box-sizing is "border-box", subtract any paddings and/or borders from max-height value */
				if(bs==="border-box"){val-=(($this.innerHeight()-$this.height())+($this.outerHeight()-$this.innerHeight()));}
				mCustomScrollBox.css("max-height",Math.round(val));
			}
		},
		/* -------------------- */
		
		
		/* auto-adjusts scrollbar dragger length */
		_setDraggerLength=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				ratio=[mCustomScrollBox.height()/mCSB_container.outerHeight(false),mCustomScrollBox.width()/mCSB_container.outerWidth(false)],
				l=[
					parseInt(mCSB_dragger[0].css("min-height")),Math.round(ratio[0]*mCSB_dragger[0].parent().height()),
					parseInt(mCSB_dragger[1].css("min-width")),Math.round(ratio[1]*mCSB_dragger[1].parent().width())
				],
				h=oldIE && (l[1]<l[0]) ? l[0] : l[1],w=oldIE && (l[3]<l[2]) ? l[2] : l[3];
			mCSB_dragger[0].css({
				"height":h,"max-height":(mCSB_dragger[0].parent().height()-10)
			}).find(".mCSB_dragger_bar").css({"line-height":l[0]+"px"});
			mCSB_dragger[1].css({
				"width":w,"max-width":(mCSB_dragger[1].parent().width()-10)
			});
		},
		/* -------------------- */
		
		
		/* calculates scrollbar to content ratio */
		_scrollRatio=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				scrollAmount=[mCSB_container.outerHeight(false)-mCustomScrollBox.height(),mCSB_container.outerWidth(false)-mCustomScrollBox.width()],
				ratio=[
					scrollAmount[0]/(mCSB_dragger[0].parent().height()-mCSB_dragger[0].height()),
					scrollAmount[1]/(mCSB_dragger[1].parent().width()-mCSB_dragger[1].width())
				];
			d.scrollRatio={y:ratio[0],x:ratio[1]};
		},
		/* -------------------- */
		
		
		/* toggles scrolling classes */
		_onDragClasses=function(el,action,xpnd){
			var expandClass=xpnd ? classes[0]+"_expanded" : "",
				scrollbar=el.closest(".mCSB_scrollTools");
			if(action==="active"){
				el.toggleClass(classes[0]+" "+expandClass); scrollbar.toggleClass(classes[1]); 
				el[0]._draggable=el[0]._draggable ? 0 : 1;
			}else{
				if(!el[0]._draggable){
					if(action==="hide"){
						el.removeClass(classes[0]); scrollbar.removeClass(classes[1]);
					}else{
						el.addClass(classes[0]); scrollbar.addClass(classes[1]);
					}
				}
			}
		},
		/* -------------------- */
		
		
		/* checks if content overflows its container to determine if scrolling is required */
		_overflowed=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				contentHeight=d.overflowed==null ? mCSB_container.height() : mCSB_container.outerHeight(false),
				contentWidth=d.overflowed==null ? mCSB_container.width() : mCSB_container.outerWidth(false);
			return [contentHeight>mCustomScrollBox.height(),contentWidth>mCustomScrollBox.width()];
		},
		/* -------------------- */
		
		
		/* resets content position to 0 */
		_resetContentPosition=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")];
			_stop($this); /* stop any current scrolling before resetting */
			if((o.axis!=="x" && !d.overflowed[0]) || (o.axis==="y" && d.overflowed[0])){ /* reset y */
				mCSB_dragger[0].add(mCSB_container).css("top",0);
				_scrollTo($this,"_resetY");
			}
			if((o.axis!=="y" && !d.overflowed[1]) || (o.axis==="x" && d.overflowed[1])){ /* reset x */
				var cx=dx=0;
				if(d.langDir==="rtl"){ /* adjust left position for rtl direction */
					cx=mCustomScrollBox.width()-mCSB_container.outerWidth(false);
					dx=Math.abs(cx/d.scrollRatio.x);
				}
				mCSB_container.css("left",cx);
				mCSB_dragger[1].css("left",dx);
				_scrollTo($this,"_resetX");
			}
		},
		/* -------------------- */
		
		
		/* binds scrollbar events */
		_bindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt;
			if(!d.bindEvents){ /* check if events are already bound */
				_draggable.call(this);
				if(o.contentTouchScroll){_contentDraggable.call(this);}
				_selectable.call(this);
				if(o.mouseWheel.enable){ /* bind mousewheel fn when plugin is available */
					function _mwt(){
						mousewheelTimeout=setTimeout(function(){
							if(!$.event.special.mousewheel){
								_mwt();
							}else{
								clearTimeout(mousewheelTimeout);
								_mousewheel.call($this[0]);
							}
						},100);
					}
					var mousewheelTimeout;
					_mwt();
				}
				_draggerRail.call(this);
				_wrapperScroll.call(this);
				if(o.advanced.autoScrollOnFocus){_focus.call(this);}
				if(o.scrollButtons.enable){_buttons.call(this);}
				if(o.keyboard.enable){_keyboard.call(this);}
				d.bindEvents=true;
			}
		},
		/* -------------------- */
		
		
		/* unbinds scrollbar events */
		_unbindEvents=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				sb=".mCSB_"+d.idx+"_scrollbar",
				sel=$("#mCSB_"+d.idx+",#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,"+sb+" ."+classes[12]+",#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal,"+sb+">a"),
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(o.advanced.releaseDraggableSelectors){sel.add($(o.advanced.releaseDraggableSelectors));}
			if(d.bindEvents){ /* check if events are bound */
				/* unbind namespaced events from document/selectors */
				$(document).unbind("."+namespace);
				sel.each(function(){
					$(this).unbind("."+namespace);
				});
				/* clear and delete timeouts/objects */
				clearTimeout($this[0]._focusTimeout); _delete($this[0],"_focusTimeout");
				clearTimeout(d.sequential.step); _delete(d.sequential,"step");
				clearTimeout(mCSB_container[0].onCompleteTimeout); _delete(mCSB_container[0],"onCompleteTimeout");
				d.bindEvents=false;
			}
		},
		/* -------------------- */
		
		
		/* toggles scrollbar visibility */
		_scrollbarVisibility=function(disabled){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				contentWrapper=$("#mCSB_"+d.idx+"_container_wrapper"),
				content=contentWrapper.length ? contentWrapper : $("#mCSB_"+d.idx+"_container"),
				scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
				mCSB_dragger=[scrollbar[0].find(".mCSB_dragger"),scrollbar[1].find(".mCSB_dragger")];
			if(o.axis!=="x"){
				if(d.overflowed[0] && !disabled){
					scrollbar[0].add(mCSB_dragger[0]).add(scrollbar[0].children("a")).css("display","block");
					content.removeClass(classes[8]+" "+classes[10]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[0].css("display","none");}
						content.removeClass(classes[10]);
					}else{
						scrollbar[0].css("display","none");
						content.addClass(classes[10]);
					}
					content.addClass(classes[8]);
				}
			}
			if(o.axis!=="y"){
				if(d.overflowed[1] && !disabled){
					scrollbar[1].add(mCSB_dragger[1]).add(scrollbar[1].children("a")).css("display","block");
					content.removeClass(classes[9]+" "+classes[11]);
				}else{
					if(o.alwaysShowScrollbar){
						if(o.alwaysShowScrollbar!==2){mCSB_dragger[1].css("display","none");}
						content.removeClass(classes[11]);
					}else{
						scrollbar[1].css("display","none");
						content.addClass(classes[11]);
					}
					content.addClass(classes[9]);
				}
			}
			if(!d.overflowed[0] && !d.overflowed[1]){
				$this.addClass(classes[5]);
			}else{
				$this.removeClass(classes[5]);
			}
		},
		/* -------------------- */
		
		
		/* returns input coordinates of pointer, touch and mouse events (relative to document) */
		_coordinates=function(e){
			var t=e.type;
			switch(t){
				case "pointerdown": case "MSPointerDown": case "pointermove": case "MSPointerMove": case "pointerup": case "MSPointerUp":
					return e.target.ownerDocument!==document ? [e.originalEvent.screenY,e.originalEvent.screenX,false] : [e.originalEvent.pageY,e.originalEvent.pageX,false];
					break;
				case "touchstart": case "touchmove": case "touchend":
					var touch=e.originalEvent.touches[0] || e.originalEvent.changedTouches[0],
						touches=e.originalEvent.touches.length || e.originalEvent.changedTouches.length;
					return e.target.ownerDocument!==document ? [touch.screenY,touch.screenX,touches>1] : [touch.pageY,touch.pageX,touches>1];
					break;
				default:
					return [e.pageY,e.pageX,false];
			}
		},
		/* -------------------- */
		
		
		/* 
		SCROLLBAR DRAG EVENTS
		scrolls content via scrollbar dragging 
		*/
		_draggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				draggerId=["mCSB_"+d.idx+"_dragger_vertical","mCSB_"+d.idx+"_dragger_horizontal"],
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=$("#"+draggerId[0]+",#"+draggerId[1]),
				draggable,dragY,dragX,
				rds=o.advanced.releaseDraggableSelectors ? mCSB_dragger.add($(o.advanced.releaseDraggableSelectors)) : mCSB_dragger;
			mCSB_dragger.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				touchActive=true;
				if(oldIE){document.onselectstart=function(){return false;}} /* disable text selection for IE < 9 */
				_iframe(false); /* enable scrollbar dragging over iframes by disabling their events */
				_stop($this);
				draggable=$(this);
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
					h=draggable.height()+offset.top,w=draggable.width()+offset.left;
				if(y<h && y>0 && x<w && x>0){
					dragY=y; 
					dragX=x;
				}
				_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
			}).bind("touchmove."+namespace,function(e){
				e.stopImmediatePropagation();
				e.preventDefault();
				var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				_drag(dragY,dragX,y,x);
			});
			$(document).bind("mousemove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace,function(e){
				if(draggable){
					var offset=draggable.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
					if(dragY===y){return;} /* has it really moved? */
					_drag(dragY,dragX,y,x);
				}
			}).add(rds).bind("mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				if(draggable){
					_onDragClasses(draggable,"active",o.autoExpandScrollbar); 
					draggable=null;
				}
				touchActive=false;
				if(oldIE){document.onselectstart=null;} /* enable text selection for IE < 9 */
				_iframe(true); /* enable iframes events */
			});
			function _iframe(evt){
				var el=mCSB_container.find("iframe");
				if(!el.length){return;} /* check if content contains iframes */
				var val=!evt ? "none" : "auto";
				el.css("pointer-events",val); /* for IE11, iframe's display property should not be "block" */
			}
			function _drag(dragY,dragX,y,x){
				mCSB_container[0].idleTimer=o.scrollInertia<233 ? 250 : 0;
				if(draggable.attr("id")===draggerId[1]){
					var dir="x",to=((draggable[0].offsetLeft-dragX)+x)*d.scrollRatio.x;
				}else{
					var dir="y",to=((draggable[0].offsetTop-dragY)+y)*d.scrollRatio.y;
				}
				_scrollTo($this,to.toString(),{dir:dir,drag:true});
			}
		},
		/* -------------------- */
		
		
		/* 
		TOUCH SWIPE EVENTS
		scrolls content via touch swipe 
		Emulates the native touch-swipe scrolling with momentum found in iOS, Android and WP devices 
		*/
		_contentDraggable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				dragY,dragX,touchStartY,touchStartX,touchMoveY=[],touchMoveX=[],startTime,runningTime,endTime,distance,speed,amount,
				durA=0,durB,overwrite=o.axis==="yx" ? "none" : "all",touchIntent=[],touchDrag,docDrag,
				iframe=mCSB_container.find("iframe"),
				events=[
					"touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace, //start
					"touchmove."+namespace+" pointermove."+namespace+" MSPointerMove."+namespace, //move
					"touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace //end
				];
			mCSB_container.bind(events[0],function(e){
				_onTouchstart(e);
			}).bind(events[1],function(e){
				_onTouchmove(e);
			});
			mCustomScrollBox.bind(events[0],function(e){
				_onTouchstart2(e);
			}).bind(events[2],function(e){
				_onTouchend(e);
			});
			if(iframe.length){
				iframe.each(function(){
					$(this).load(function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onTouchstart(e);
								_onTouchstart2(e);
							}).bind(events[1],function(e){
								_onTouchmove(e);
							}).bind(events[2],function(e){
								_onTouchend(e);
							});
						}
					});
				});
			}
			function _onTouchstart(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1; touchDrag=0; docDrag=0;
				$this.removeClass("mCS_touch_action");
				var offset=mCSB_container.offset();
				dragY=_coordinates(e)[0]-offset.top;
				dragX=_coordinates(e)[1]-offset.left;
				touchIntent=[_coordinates(e)[0],_coordinates(e)[1]];
			}
			function _onTouchmove(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				e.stopImmediatePropagation();
				if(docDrag && !touchDrag){return;}
				runningTime=_getTime();
				var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left,
					easing="mcsLinearOut";
				touchMoveY.push(y);
				touchMoveX.push(x);
				touchIntent[2]=Math.abs(_coordinates(e)[0]-touchIntent[0]); touchIntent[3]=Math.abs(_coordinates(e)[1]-touchIntent[1]);
				if(d.overflowed[0]){
					var limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
						prevent=((dragY-y)>0 && (y-dragY)>-(limit*d.scrollRatio.y) && (touchIntent[3]*2<touchIntent[2] || o.axis==="yx"));
				}
				if(d.overflowed[1]){
					var limitX=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
						preventX=((dragX-x)>0 && (x-dragX)>-(limitX*d.scrollRatio.x) && (touchIntent[2]*2<touchIntent[3] || o.axis==="yx"));
				}
				if(prevent || preventX){ /* prevent native document scrolling */
					e.preventDefault(); 
					touchDrag=1;
				}else{
					docDrag=1;
					$this.addClass("mCS_touch_action");
				}
				amount=o.axis==="yx" ? [(dragY-y),(dragX-x)] : o.axis==="x" ? [null,(dragX-x)] : [(dragY-y),null];
				mCSB_container[0].idleTimer=250;
				if(d.overflowed[0]){_drag(amount[0],durA,easing,"y","all",true);}
				if(d.overflowed[1]){_drag(amount[1],durA,easing,"x",overwrite,true);}
			}
			function _onTouchstart2(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){touchable=0; return;}
				touchable=1;
				e.stopImmediatePropagation();
				_stop($this);
				startTime=_getTime();
				var offset=mCustomScrollBox.offset();
				touchStartY=_coordinates(e)[0]-offset.top;
				touchStartX=_coordinates(e)[1]-offset.left;
				touchMoveY=[]; touchMoveX=[];
			}
			function _onTouchend(e){
				if(!_pointerTouch(e) || touchActive || _coordinates(e)[2]){return;}
				e.stopImmediatePropagation();
				touchDrag=0; docDrag=0;
				endTime=_getTime();
				var offset=mCustomScrollBox.offset(),y=_coordinates(e)[0]-offset.top,x=_coordinates(e)[1]-offset.left;
				if((endTime-runningTime)>30){return;}
				speed=1000/(endTime-startTime);
				var easing="mcsEaseOut",slow=speed<2.5,
					diff=slow ? [touchMoveY[touchMoveY.length-2],touchMoveX[touchMoveX.length-2]] : [0,0];
				distance=slow ? [(y-diff[0]),(x-diff[1])] : [y-touchStartY,x-touchStartX];
				var absDistance=[Math.abs(distance[0]),Math.abs(distance[1])];
				speed=slow ? [Math.abs(distance[0]/4),Math.abs(distance[1]/4)] : [speed,speed];
				var a=[
					Math.abs(mCSB_container[0].offsetTop)-(distance[0]*_m((absDistance[0]/speed[0]),speed[0])),
					Math.abs(mCSB_container[0].offsetLeft)-(distance[1]*_m((absDistance[1]/speed[1]),speed[1]))
				];
				amount=o.axis==="yx" ? [a[0],a[1]] : o.axis==="x" ? [null,a[1]] : [a[0],null];
				durB=[(absDistance[0]*4)+o.scrollInertia,(absDistance[1]*4)+o.scrollInertia];
				var md=parseInt(o.contentTouchScroll) || 0; /* absolute minimum distance required */
				amount[0]=absDistance[0]>md ? amount[0] : 0;
				amount[1]=absDistance[1]>md ? amount[1] : 0;
				if(d.overflowed[0]){_drag(amount[0],durB[0],easing,"y",overwrite,false);}
				if(d.overflowed[1]){_drag(amount[1],durB[1],easing,"x",overwrite,false);}
			}
			function _m(ds,s){
				var r=[s*1.5,s*2,s/1.5,s/2];
				if(ds>90){
					return s>4 ? r[0] : r[3];
				}else if(ds>60){
					return s>3 ? r[3] : r[2];
				}else if(ds>30){
					return s>8 ? r[1] : s>6 ? r[0] : s>4 ? s : r[2];
				}else{
					return s>8 ? s : r[3];
				}
			}
			function _drag(amount,dur,easing,dir,overwrite,drag){
				if(!amount){return;}
				_scrollTo($this,amount.toString(),{dur:dur,scrollEasing:easing,dir:dir,overwrite:overwrite,drag:drag});
			}
		},
		/* -------------------- */
		
		
		/* 
		SELECT TEXT EVENTS 
		scrolls content when text is selected 
		*/
		_selectable=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				action;
			mCSB_container.bind("mousedown."+namespace,function(e){
				if(touchable){return;}
				if(!action){action=1; touchActive=true;}
			}).add(document).bind("mousemove."+namespace,function(e){
				if(!touchable && action && _sel()){
					var offset=mCSB_container.offset(),
						y=_coordinates(e)[0]-offset.top+mCSB_container[0].offsetTop,x=_coordinates(e)[1]-offset.left+mCSB_container[0].offsetLeft;
					if(y>0 && y<wrapper.height() && x>0 && x<wrapper.width()){
						if(seq.step){_seq("off",null,"stepped");}
					}else{
						if(o.axis!=="x" && d.overflowed[0]){
							if(y<0){
								_seq("on",38);
							}else if(y>wrapper.height()){
								_seq("on",40);
							}
						}
						if(o.axis!=="y" && d.overflowed[1]){
							if(x<0){
								_seq("on",37);
							}else if(x>wrapper.width()){
								_seq("on",39);
							}
						}
					}
				}
			}).bind("mouseup."+namespace,function(e){
				if(touchable){return;}
				if(action){action=0; _seq("off",null);}
				touchActive=false;
			});
			function _sel(){
				return 	window.getSelection ? window.getSelection().toString() : 
						document.selection && document.selection.type!="Control" ? document.selection.createRange().text : 0;
			}
			function _seq(a,c,s){
				seq.type=s && action ? "stepped" : "stepless";
				seq.scrollAmount=10;
				_sequentialScroll($this,a,c,"mcsLinearOut",s ? 60 : null);
			}
		},
		/* -------------------- */
		
		
		/* 
		MOUSE WHEEL EVENT
		scrolls content via mouse-wheel 
		via mouse-wheel plugin (https://github.com/brandonaaron/jquery-mousewheel)
		*/
		_mousewheel=function(){
			if(!$(this).data(pluginPfx)){return;} /* Check if the scrollbar is ready to use mousewheel events (issue: #185) */
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_dragger=[$("#mCSB_"+d.idx+"_dragger_vertical"),$("#mCSB_"+d.idx+"_dragger_horizontal")],
				iframe=$("#mCSB_"+d.idx+"_container").find("iframe");
			if(iframe.length){
				iframe.each(function(){
					$(this).load(function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind("mousewheel."+namespace,function(e,delta){
								_onMousewheel(e,delta);
							});
						}
					});
				});
			}
			mCustomScrollBox.bind("mousewheel."+namespace,function(e,delta){
				_onMousewheel(e,delta);
			});
			function _onMousewheel(e,delta){
				_stop($this);
				if(_disableMousewheel($this,e.target)){return;} /* disables mouse-wheel when hovering specific elements */
				var deltaFactor=o.mouseWheel.deltaFactor!=="auto" ? parseInt(o.mouseWheel.deltaFactor) : (oldIE && e.deltaFactor<100) ? 100 : e.deltaFactor || 100;
				if(o.axis==="x" || o.mouseWheel.axis==="x"){
					var dir="x",
						px=[Math.round(deltaFactor*d.scrollRatio.x),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.width() ? mCustomScrollBox.width()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetLeft),
						draggerPos=mCSB_dragger[1][0].offsetLeft,
						limit=mCSB_dragger[1].parent().width()-mCSB_dragger[1].width(),
						dlt=e.deltaX || e.deltaY || delta;
				}else{
					var dir="y",
						px=[Math.round(deltaFactor*d.scrollRatio.y),parseInt(o.mouseWheel.scrollAmount)],
						amount=o.mouseWheel.scrollAmount!=="auto" ? px[1] : px[0]>=mCustomScrollBox.height() ? mCustomScrollBox.height()*0.9 : px[0],
						contentPos=Math.abs($("#mCSB_"+d.idx+"_container")[0].offsetTop),
						draggerPos=mCSB_dragger[0][0].offsetTop,
						limit=mCSB_dragger[0].parent().height()-mCSB_dragger[0].height(),
						dlt=e.deltaY || delta;
				}
				if((dir==="y" && !d.overflowed[0]) || (dir==="x" && !d.overflowed[1])){return;}
				if(o.mouseWheel.invert || e.webkitDirectionInvertedFromDevice){dlt=-dlt;}
				if(o.mouseWheel.normalizeDelta){dlt=dlt<0 ? -1 : 1;}
				if((dlt>0 && draggerPos!==0) || (dlt<0 && draggerPos!==limit) || o.mouseWheel.preventDefault){
					e.stopImmediatePropagation();
					e.preventDefault();
				}
				_scrollTo($this,(contentPos-(dlt*amount)).toString(),{dir:dir});
			}
		},
		/* -------------------- */
		
		
		/* checks if iframe can be accessed */
		_canAccessIFrame=function(iframe){
			var html=null;
			try{
				var doc=iframe.contentDocument || iframe.contentWindow.document;
				html=doc.body.innerHTML;
			}catch(err){/* do nothing */}
			return(html!==null);
		},
		/* -------------------- */
		
		
		/* disables mouse-wheel when hovering specific elements like select, datalist etc. */
		_disableMousewheel=function(el,target){
			var tag=target.nodeName.toLowerCase(),
				tags=el.data(pluginPfx).opt.mouseWheel.disableOver,
				/* elements that require focus */
				focusTags=["select","textarea"];
			return $.inArray(tag,tags) > -1 && !($.inArray(tag,focusTags) > -1 && !$(target).is(":focus"));
		},
		/* -------------------- */
		
		
		/* 
		DRAGGER RAIL CLICK EVENT
		scrolls content via dragger rail 
		*/
		_draggerRail=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				mCSB_draggerContainer=$(".mCSB_"+d.idx+"_scrollbar ."+classes[12]);
			mCSB_draggerContainer.bind("touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace,function(e){
				touchActive=true;
			}).bind("touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace,function(e){
				touchActive=false;
			}).bind("click."+namespace,function(e){
				if($(e.target).hasClass(classes[12]) || $(e.target).hasClass("mCSB_draggerRail")){
					_stop($this);
					var el=$(this),mCSB_dragger=el.find(".mCSB_dragger");
					if(el.parent(".mCSB_scrollTools_horizontal").length>0){
						if(!d.overflowed[1]){return;}
						var dir="x",
							clickDir=e.pageX>mCSB_dragger.offset().left ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetLeft)-(clickDir*(wrapper.width()*0.9));
					}else{
						if(!d.overflowed[0]){return;}
						var dir="y",
							clickDir=e.pageY>mCSB_dragger.offset().top ? -1 : 1,
							to=Math.abs(mCSB_container[0].offsetTop)-(clickDir*(wrapper.height()*0.9));
					}
					_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		FOCUS EVENT
		scrolls content via element focus (e.g. clicking an input, pressing TAB key etc.)
		*/
		_focus=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				namespace=pluginPfx+"_"+d.idx,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent();
			mCSB_container.bind("focusin."+namespace,function(e){
				var el=$(document.activeElement),
					nested=mCSB_container.find(".mCustomScrollBox").length,
					dur=0;
				if(!el.is(o.advanced.autoScrollOnFocus)){return;}
				_stop($this);
				clearTimeout($this[0]._focusTimeout);
				$this[0]._focusTimer=nested ? (dur+17)*nested : 0;
				$this[0]._focusTimeout=setTimeout(function(){
					var	to=[_childPos(el)[0],_childPos(el)[1]],
						contentPos=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft],
						isVisible=[
							(contentPos[0]+to[0]>=0 && contentPos[0]+to[0]<wrapper.height()-el.outerHeight(false)),
							(contentPos[1]+to[1]>=0 && contentPos[0]+to[1]<wrapper.width()-el.outerWidth(false))
						],
						overwrite=(o.axis==="yx" && !isVisible[0] && !isVisible[1]) ? "none" : "all";
					if(o.axis!=="x" && !isVisible[0]){
						_scrollTo($this,to[0].toString(),{dir:"y",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
					if(o.axis!=="y" && !isVisible[1]){
						_scrollTo($this,to[1].toString(),{dir:"x",scrollEasing:"mcsEaseInOut",overwrite:overwrite,dur:dur});
					}
				},$this[0]._focusTimer);
			});
		},
		/* -------------------- */
		
		
		/* sets content wrapper scrollTop/scrollLeft always to 0 */
		_wrapperScroll=function(){
			var $this=$(this),d=$this.data(pluginPfx),
				namespace=pluginPfx+"_"+d.idx,
				wrapper=$("#mCSB_"+d.idx+"_container").parent();
			wrapper.bind("scroll."+namespace,function(e){
				if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){
					$(".mCSB_"+d.idx+"_scrollbar").css("visibility","hidden"); /* hide scrollbar(s) */
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		BUTTONS EVENTS
		scrolls content via up, down, left and right buttons 
		*/
		_buttons=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				sel=".mCSB_"+d.idx+"_scrollbar",
				btn=$(sel+">a");
			btn.bind("mousedown."+namespace+" touchstart."+namespace+" pointerdown."+namespace+" MSPointerDown."+namespace+" mouseup."+namespace+" touchend."+namespace+" pointerup."+namespace+" MSPointerUp."+namespace+" mouseout."+namespace+" pointerout."+namespace+" MSPointerOut."+namespace+" click."+namespace,function(e){
				e.preventDefault();
				if(!_mouseBtnLeft(e)){return;} /* left mouse button only */
				var btnClass=$(this).attr("class");
				seq.type=o.scrollButtons.scrollType;
				switch(e.type){
					case "mousedown": case "touchstart": case "pointerdown": case "MSPointerDown":
						if(seq.type==="stepped"){return;}
						touchActive=true;
						d.tweenRunning=false;
						_seq("on",btnClass);
						break;
					case "mouseup": case "touchend": case "pointerup": case "MSPointerUp":
					case "mouseout": case "pointerout": case "MSPointerOut":
						if(seq.type==="stepped"){return;}
						touchActive=false;
						if(seq.dir){_seq("off",btnClass);}
						break;
					case "click":
						if(seq.type!=="stepped" || d.tweenRunning){return;}
						_seq("on",btnClass);
						break;
				}
				function _seq(a,c){
					seq.scrollAmount=o.snapAmount || o.scrollButtons.scrollAmount;
					_sequentialScroll($this,a,c);
				}
			});
		},
		/* -------------------- */
		
		
		/* 
		KEYBOARD EVENTS
		scrolls content via keyboard 
		Keys: up arrow, down arrow, left arrow, right arrow, PgUp, PgDn, Home, End
		*/
		_keyboard=function(){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,seq=d.sequential,
				namespace=pluginPfx+"_"+d.idx,
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				editables="input,textarea,select,datalist,keygen,[contenteditable='true']",
				iframe=mCSB_container.find("iframe"),
				events=["blur."+namespace+" keydown."+namespace+" keyup."+namespace];
			if(iframe.length){
				iframe.each(function(){
					$(this).load(function(){
						/* bind events on accessible iframes */
						if(_canAccessIFrame(this)){
							$(this.contentDocument || this.contentWindow.document).bind(events[0],function(e){
								_onKeyboard(e);
							});
						}
					});
				});
			}
			mCustomScrollBox.attr("tabindex","0").bind(events[0],function(e){
				_onKeyboard(e);
			});
			function _onKeyboard(e){
				switch(e.type){
					case "blur":
						if(d.tweenRunning && seq.dir){_seq("off",null);}
						break;
					case "keydown": case "keyup":
						var code=e.keyCode ? e.keyCode : e.which,action="on";
						if((o.axis!=="x" && (code===38 || code===40)) || (o.axis!=="y" && (code===37 || code===39))){
							/* up (38), down (40), left (37), right (39) arrows */
							if(((code===38 || code===40) && !d.overflowed[0]) || ((code===37 || code===39) && !d.overflowed[1])){return;}
							if(e.type==="keyup"){action="off";}
							if(!$(document.activeElement).is(editables)){
								e.preventDefault();
								e.stopImmediatePropagation();
								_seq(action,code);
							}
						}else if(code===33 || code===34){
							/* PgUp (33), PgDn (34) */
							if(d.overflowed[0] || d.overflowed[1]){
								e.preventDefault();
								e.stopImmediatePropagation();
							}
							if(e.type==="keyup"){
								_stop($this);
								var keyboardDir=code===34 ? -1 : 1;
								if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
									var dir="x",to=Math.abs(mCSB_container[0].offsetLeft)-(keyboardDir*(wrapper.width()*0.9));
								}else{
									var dir="y",to=Math.abs(mCSB_container[0].offsetTop)-(keyboardDir*(wrapper.height()*0.9));
								}
								_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
							}
						}else if(code===35 || code===36){
							/* End (35), Home (36) */
							if(!$(document.activeElement).is(editables)){
								if(d.overflowed[0] || d.overflowed[1]){
									e.preventDefault();
									e.stopImmediatePropagation();
								}
								if(e.type==="keyup"){
									if(o.axis==="x" || (o.axis==="yx" && d.overflowed[1] && !d.overflowed[0])){
										var dir="x",to=code===35 ? Math.abs(wrapper.width()-mCSB_container.outerWidth(false)) : 0;
									}else{
										var dir="y",to=code===35 ? Math.abs(wrapper.height()-mCSB_container.outerHeight(false)) : 0;
									}
									_scrollTo($this,to.toString(),{dir:dir,scrollEasing:"mcsEaseInOut"});
								}
							}
						}
						break;
				}
				function _seq(a,c){
					seq.type=o.keyboard.scrollType;
					seq.scrollAmount=o.snapAmount || o.keyboard.scrollAmount;
					if(seq.type==="stepped" && d.tweenRunning){return;}
					_sequentialScroll($this,a,c);
				}
			}
		},
		/* -------------------- */
		
		
		/* scrolls content sequentially (used when scrolling via buttons, keyboard arrows etc.) */
		_sequentialScroll=function(el,action,trigger,e,s){
			var d=el.data(pluginPfx),o=d.opt,seq=d.sequential,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				once=seq.type==="stepped" ? true : false,
				steplessSpeed=o.scrollInertia < 26 ? 26 : o.scrollInertia, /* 26/1.5=17 */
				steppedSpeed=o.scrollInertia < 1 ? 17 : o.scrollInertia;
			switch(action){
				case "on":
					seq.dir=[
						(trigger===classes[16] || trigger===classes[15] || trigger===39 || trigger===37 ? "x" : "y"),
						(trigger===classes[13] || trigger===classes[15] || trigger===38 || trigger===37 ? -1 : 1)
					];
					_stop(el);
					if(_isNumeric(trigger) && seq.type==="stepped"){return;}
					_on(once);
					break;
				case "off":
					_off();
					if(once || (d.tweenRunning && seq.dir)){
						_on(true);
					}
					break;
			}
			/* starts sequence */
			function _on(once){
				var c=seq.type!=="stepped", /* continuous scrolling */
					t=s ? s : !once ? 1000/60 : c ? steplessSpeed/1.5 : steppedSpeed, /* timer */
					m=!once ? 2.5 : c ? 7.5 : 40, /* multiplier */
					contentPos=[Math.abs(mCSB_container[0].offsetTop),Math.abs(mCSB_container[0].offsetLeft)],
					ratio=[d.scrollRatio.y>10 ? 10 : d.scrollRatio.y,d.scrollRatio.x>10 ? 10 : d.scrollRatio.x],
					amount=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*(ratio[1]*m)) : contentPos[0]+(seq.dir[1]*(ratio[0]*m)),
					px=seq.dir[0]==="x" ? contentPos[1]+(seq.dir[1]*parseInt(seq.scrollAmount)) : contentPos[0]+(seq.dir[1]*parseInt(seq.scrollAmount)),
					to=seq.scrollAmount!=="auto" ? px : amount,
					easing=e ? e : !once ? "mcsLinear" : c ? "mcsLinearOut" : "mcsEaseInOut",
					onComplete=!once ? false : true;
				if(once && t<17){
					to=seq.dir[0]==="x" ? contentPos[1] : contentPos[0];
				}
				_scrollTo(el,to.toString(),{dir:seq.dir[0],scrollEasing:easing,dur:t,onComplete:onComplete});
				if(once){
					seq.dir=false;
					return;
				}
				clearTimeout(seq.step);
				seq.step=setTimeout(function(){
					_on();
				},t);
			}
			/* stops sequence */
			function _off(){
				clearTimeout(seq.step);
				_delete(seq,"step");
				_stop(el);
			}
		},
		/* -------------------- */
		
		
		/* returns a yx array from value */
		_arr=function(val){
			var o=$(this).data(pluginPfx).opt,vals=[];
			if(typeof val==="function"){val=val();} /* check if the value is a single anonymous function */
			/* check if value is object or array, its length and create an array with yx values */
			if(!(val instanceof Array)){ /* object value (e.g. {y:"100",x:"100"}, 100 etc.) */
				vals[0]=val.y ? val.y : val.x || o.axis==="x" ? null : val;
				vals[1]=val.x ? val.x : val.y || o.axis==="y" ? null : val;
			}else{ /* array value (e.g. [100,100]) */
				vals=val.length>1 ? [val[0],val[1]] : o.axis==="x" ? [null,val[0]] : [val[0],null];
			}
			/* check if array values are anonymous functions */
			if(typeof vals[0]==="function"){vals[0]=vals[0]();}
			if(typeof vals[1]==="function"){vals[1]=vals[1]();}
			return vals;
		},
		/* -------------------- */
		
		
		/* translates values (e.g. "top", 100, "100px", "#id") to actual scroll-to positions */
		_to=function(val,dir){
			if(val==null || typeof val=="undefined"){return;}
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				t=typeof val;
			if(!dir){dir=o.axis==="x" ? "x" : "y";}
			var contentLength=dir==="x" ? mCSB_container.outerWidth(false) : mCSB_container.outerHeight(false),
				contentPos=dir==="x" ? mCSB_container[0].offsetLeft : mCSB_container[0].offsetTop,
				cssProp=dir==="x" ? "left" : "top";
			switch(t){
				case "function": /* this currently is not used. Consider removing it */
					return val();
					break;
				case "object": /* js/jquery object */
					var obj=val.jquery ? val : $(val);
					if(!obj.length){return;}
					return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
					break;
				case "string": case "number":
					if(_isNumeric(val)){ /* numeric value */
						return Math.abs(val);
					}else if(val.indexOf("%")!==-1){ /* percentage value */
						return Math.abs(contentLength*parseInt(val)/100);
					}else if(val.indexOf("-=")!==-1){ /* decrease value */
						return Math.abs(contentPos-parseInt(val.split("-=")[1]));
					}else if(val.indexOf("+=")!==-1){ /* inrease value */
						var p=(contentPos+parseInt(val.split("+=")[1]));
						return p>=0 ? 0 : Math.abs(p);
					}else if(val.indexOf("px")!==-1 && _isNumeric(val.split("px")[0])){ /* pixels string value (e.g. "100px") */
						return Math.abs(val.split("px")[0]);
					}else{
						if(val==="top" || val==="left"){ /* special strings */
							return 0;
						}else if(val==="bottom"){
							return Math.abs(wrapper.height()-mCSB_container.outerHeight(false));
						}else if(val==="right"){
							return Math.abs(wrapper.width()-mCSB_container.outerWidth(false));
						}else if(val==="first" || val==="last"){
							var obj=mCSB_container.find(":"+val);
							return dir==="x" ? _childPos(obj)[1] : _childPos(obj)[0];
						}else{
							if($(val).length){ /* jquery selector */
								return dir==="x" ? _childPos($(val))[1] : _childPos($(val))[0];
							}else{ /* other values (e.g. "100em") */
								mCSB_container.css(cssProp,val);
								methods.update.call(null,$this[0]);
								return;
							}
						}
					}
					break;
			}
		},
		/* -------------------- */
		
		
		/* calls the update method automatically */
		_autoUpdate=function(rem){
			var $this=$(this),d=$this.data(pluginPfx),o=d.opt,
				mCSB_container=$("#mCSB_"+d.idx+"_container");
			if(rem){
				/* 
				removes autoUpdate timer 
				usage: _autoUpdate.call(this,"remove");
				*/
				clearTimeout(mCSB_container[0].autoUpdate);
				_delete(mCSB_container[0],"autoUpdate");
				return;
			}
			var	wrapper=mCSB_container.parent(),
				scrollbar=[$("#mCSB_"+d.idx+"_scrollbar_vertical"),$("#mCSB_"+d.idx+"_scrollbar_horizontal")],
				scrollbarSize=function(){return [
					scrollbar[0].is(":visible") ? scrollbar[0].outerHeight(true) : 0, /* returns y-scrollbar height */
					scrollbar[1].is(":visible") ? scrollbar[1].outerWidth(true) : 0 /* returns x-scrollbar width */
				]},
				oldSelSize=sizesSum(),newSelSize,
				os=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false),wrapper.height(),wrapper.width(),scrollbarSize()[0],scrollbarSize()[1]],ns,
				oldImgsLen=imgSum(),newImgsLen;
			upd();
			function upd(){
				clearTimeout(mCSB_container[0].autoUpdate);
				if($this.parents("html").length===0){
					/* check element in dom tree */
					$this=null;
					return;
				}
				mCSB_container[0].autoUpdate=setTimeout(function(){
					/* update on specific selector(s) length and size change */
					if(o.advanced.updateOnSelectorChange){
						newSelSize=sizesSum();
						if(newSelSize!==oldSelSize){
							doUpd(3);
							oldSelSize=newSelSize;
							return;
						}
					}
					/* update on main element and scrollbar size changes */
					if(o.advanced.updateOnContentResize){
						ns=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false),wrapper.height(),wrapper.width(),scrollbarSize()[0],scrollbarSize()[1]];
						if(ns[0]!==os[0] || ns[1]!==os[1] || ns[2]!==os[2] || ns[3]!==os[3] || ns[4]!==os[4] || ns[5]!==os[5]){
							doUpd(ns[0]!==os[0] || ns[1]!==os[1]);
							os=ns;
						}
					}
					/* update on image load */
					if(o.advanced.updateOnImageLoad){
						newImgsLen=imgSum();
						if(newImgsLen!==oldImgsLen){
							mCSB_container.find("img").each(function(){
								imgLoader(this);
							});
							oldImgsLen=newImgsLen;
						}
					}
					if(o.advanced.updateOnSelectorChange || o.advanced.updateOnContentResize || o.advanced.updateOnImageLoad){upd();}
				},o.advanced.autoUpdateTimeout);
			}
			/* returns images amount */
			function imgSum(){
				var total=0
				if(o.advanced.updateOnImageLoad){total=mCSB_container.find("img").length;}
				return total;
			}
			/* a tiny image loader */
			function imgLoader(el){
				if($(el).hasClass(classes[2])){doUpd(); return;}
				var img=new Image();
				function createDelegate(contextObject,delegateMethod){
					return function(){return delegateMethod.apply(contextObject,arguments);}
				}
				function imgOnLoad(){
					this.onload=null;
					$(el).addClass(classes[2]);
					doUpd(2);
				}
				img.onload=createDelegate(img,imgOnLoad);
				img.src=el.src;
			}
			/* returns the total height and width sum of all elements matching the selector */
			function sizesSum(){
				if(o.advanced.updateOnSelectorChange===true){o.advanced.updateOnSelectorChange="*";}
				var total=0,sel=mCSB_container.find(o.advanced.updateOnSelectorChange);
				if(o.advanced.updateOnSelectorChange && sel.length>0){sel.each(function(){total+=$(this).height()+$(this).width();});}
				return total;
			}
			/* calls the update method */
			function doUpd(cb){
				clearTimeout(mCSB_container[0].autoUpdate); 
				methods.update.call(null,$this[0],cb);
			}
		},
		/* -------------------- */
		
		
		/* snaps scrolling to a multiple of a pixels number */
		_snapAmount=function(to,amount,offset){
			return (Math.round(to/amount)*amount-offset); 
		},
		/* -------------------- */
		
		
		/* stops content and scrollbar animations */
		_stop=function(el){
			var d=el.data(pluginPfx),
				sel=$("#mCSB_"+d.idx+"_container,#mCSB_"+d.idx+"_container_wrapper,#mCSB_"+d.idx+"_dragger_vertical,#mCSB_"+d.idx+"_dragger_horizontal");
			sel.each(function(){
				_stopTween.call(this);
			});
		},
		/* -------------------- */
		
		
		/* 
		ANIMATES CONTENT 
		This is where the actual scrolling happens
		*/
		_scrollTo=function(el,to,options){
			var d=el.data(pluginPfx),o=d.opt,
				defaults={
					trigger:"internal",
					dir:"y",
					scrollEasing:"mcsEaseOut",
					drag:false,
					dur:o.scrollInertia,
					overwrite:"all",
					callbacks:true,
					onStart:true,
					onUpdate:true,
					onComplete:true
				},
				options=$.extend(defaults,options),
				dur=[options.dur,(options.drag ? 0 : options.dur)],
				mCustomScrollBox=$("#mCSB_"+d.idx),
				mCSB_container=$("#mCSB_"+d.idx+"_container"),
				wrapper=mCSB_container.parent(),
				totalScrollOffsets=o.callbacks.onTotalScrollOffset ? _arr.call(el,o.callbacks.onTotalScrollOffset) : [0,0],
				totalScrollBackOffsets=o.callbacks.onTotalScrollBackOffset ? _arr.call(el,o.callbacks.onTotalScrollBackOffset) : [0,0];
			d.trigger=options.trigger;
			if(wrapper.scrollTop()!==0 || wrapper.scrollLeft()!==0){ /* always reset scrollTop/Left */
				$(".mCSB_"+d.idx+"_scrollbar").css("visibility","visible");
				wrapper.scrollTop(0).scrollLeft(0);
			}
			if(to==="_resetY" && !d.contentReset.y){
				/* callbacks: onOverflowYNone */
				if(_cb("onOverflowYNone")){o.callbacks.onOverflowYNone.call(el[0]);}
				d.contentReset.y=1;
			}
			if(to==="_resetX" && !d.contentReset.x){
				/* callbacks: onOverflowXNone */
				if(_cb("onOverflowXNone")){o.callbacks.onOverflowXNone.call(el[0]);}
				d.contentReset.x=1;
			}
			if(to==="_resetY" || to==="_resetX"){return;}
			if((d.contentReset.y || !el[0].mcs) && d.overflowed[0]){
				/* callbacks: onOverflowY */
				if(_cb("onOverflowY")){o.callbacks.onOverflowY.call(el[0]);}
				d.contentReset.x=null;
			}
			if((d.contentReset.x || !el[0].mcs) && d.overflowed[1]){
				/* callbacks: onOverflowX */
				if(_cb("onOverflowX")){o.callbacks.onOverflowX.call(el[0]);}
				d.contentReset.x=null;
			}
			if(o.snapAmount){to=_snapAmount(to,o.snapAmount,o.snapOffset);} /* scrolling snapping */
			switch(options.dir){
				case "x":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_horizontal"),
						property="left",
						contentPos=mCSB_container[0].offsetLeft,
						limit=[
							mCustomScrollBox.width()-mCSB_container.outerWidth(false),
							mCSB_dragger.parent().width()-mCSB_dragger.width()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.x)],
						tso=totalScrollOffsets[1],
						tsbo=totalScrollBackOffsets[1],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.x : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.x : 0;
					break;
				case "y":
					var mCSB_dragger=$("#mCSB_"+d.idx+"_dragger_vertical"),
						property="top",
						contentPos=mCSB_container[0].offsetTop,
						limit=[
							mCustomScrollBox.height()-mCSB_container.outerHeight(false),
							mCSB_dragger.parent().height()-mCSB_dragger.height()
						],
						scrollTo=[to,to===0 ? 0 : (to/d.scrollRatio.y)],
						tso=totalScrollOffsets[0],
						tsbo=totalScrollBackOffsets[0],
						totalScrollOffset=tso>0 ? tso/d.scrollRatio.y : 0,
						totalScrollBackOffset=tsbo>0 ? tsbo/d.scrollRatio.y : 0;
					break;
			}
			if(scrollTo[1]<0 || (scrollTo[0]===0 && scrollTo[1]===0)){
				scrollTo=[0,0];
			}else if(scrollTo[1]>=limit[1]){
				scrollTo=[limit[0],limit[1]];
			}else{
				scrollTo[0]=-scrollTo[0];
			}
			if(!el[0].mcs){
				_mcs();  /* init mcs object (once) to make it available before callbacks */
				if(_cb("onInit")){o.callbacks.onInit.call(el[0]);} /* callbacks: onInit */
			}
			clearTimeout(mCSB_container[0].onCompleteTimeout);
			if(!d.tweenRunning && ((contentPos===0 && scrollTo[0]>=0) || (contentPos===limit[0] && scrollTo[0]<=limit[0]))){return;}
			_tweenTo(mCSB_dragger[0],property,Math.round(scrollTo[1]),dur[1],options.scrollEasing);
			_tweenTo(mCSB_container[0],property,Math.round(scrollTo[0]),dur[0],options.scrollEasing,options.overwrite,{
				onStart:function(){
					if(options.callbacks && options.onStart && !d.tweenRunning){
						/* callbacks: onScrollStart */
						if(_cb("onScrollStart")){_mcs(); o.callbacks.onScrollStart.call(el[0]);}
						d.tweenRunning=true;
						_onDragClasses(mCSB_dragger);
						d.cbOffsets=_cbOffsets();
					}
				},onUpdate:function(){
					if(options.callbacks && options.onUpdate){
						/* callbacks: whileScrolling */
						if(_cb("whileScrolling")){_mcs(); o.callbacks.whileScrolling.call(el[0]);}
					}
				},onComplete:function(){
					if(options.callbacks && options.onComplete){
						if(o.axis==="yx"){clearTimeout(mCSB_container[0].onCompleteTimeout);}
						var t=mCSB_container[0].idleTimer || 0;
						mCSB_container[0].onCompleteTimeout=setTimeout(function(){
							/* callbacks: onScroll, onTotalScroll, onTotalScrollBack */
							if(_cb("onScroll")){_mcs(); o.callbacks.onScroll.call(el[0]);}
							if(_cb("onTotalScroll") && scrollTo[1]>=limit[1]-totalScrollOffset && d.cbOffsets[0]){_mcs(); o.callbacks.onTotalScroll.call(el[0]);}
							if(_cb("onTotalScrollBack") && scrollTo[1]<=totalScrollBackOffset && d.cbOffsets[1]){_mcs(); o.callbacks.onTotalScrollBack.call(el[0]);}
							d.tweenRunning=false;
							mCSB_container[0].idleTimer=0;
							_onDragClasses(mCSB_dragger,"hide");
						},t);
					}
				}
			});
			/* checks if callback function exists */
			function _cb(cb){
				return d && o.callbacks[cb] && typeof o.callbacks[cb]==="function";
			}
			/* checks whether callback offsets always trigger */
			function _cbOffsets(){
				return [o.callbacks.alwaysTriggerOffsets || contentPos>=limit[0]+tso,o.callbacks.alwaysTriggerOffsets || contentPos<=-tsbo];
			}
			/* 
			populates object with useful values for the user 
			values: 
				content: this.mcs.content
				content top position: this.mcs.top 
				content left position: this.mcs.left 
				dragger top position: this.mcs.draggerTop 
				dragger left position: this.mcs.draggerLeft 
				scrolling y percentage: this.mcs.topPct 
				scrolling x percentage: this.mcs.leftPct 
				scrolling direction: this.mcs.direction
			*/
			function _mcs(){
				var cp=[mCSB_container[0].offsetTop,mCSB_container[0].offsetLeft], /* content position */
					dp=[mCSB_dragger[0].offsetTop,mCSB_dragger[0].offsetLeft], /* dragger position */
					cl=[mCSB_container.outerHeight(false),mCSB_container.outerWidth(false)], /* content length */
					pl=[mCustomScrollBox.height(),mCustomScrollBox.width()]; /* content parent length */
				el[0].mcs={
					content:mCSB_container, /* original content wrapper as jquery object */
					top:cp[0],left:cp[1],draggerTop:dp[0],draggerLeft:dp[1],
					topPct:Math.round((100*Math.abs(cp[0]))/(Math.abs(cl[0])-pl[0])),leftPct:Math.round((100*Math.abs(cp[1]))/(Math.abs(cl[1])-pl[1])),
					direction:options.dir
				};
				/* 
				this refers to the original element containing the scrollbar(s)
				usage: this.mcs.top, this.mcs.leftPct etc. 
				*/
			}
		},
		/* -------------------- */
		
		
		/* 
		CUSTOM JAVASCRIPT ANIMATION TWEEN 
		Lighter and faster than jquery animate() and css transitions 
		Animates top/left properties and includes easings 
		*/
		_tweenTo=function(el,prop,to,duration,easing,overwrite,callbacks){
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var callbacks=callbacks || {},
				onStart=callbacks.onStart || function(){},onUpdate=callbacks.onUpdate || function(){},onComplete=callbacks.onComplete || function(){},
				startTime=_getTime(),_delay,progress=0,from=el.offsetTop,elStyle=el.style,_request,tobj=el._mTween[prop];
			if(prop==="left"){from=el.offsetLeft;}
			var diff=to-from;
			tobj.stop=0;
			if(overwrite!=="none"){_cancelTween();}
			_startTween();
			function _step(){
				if(tobj.stop){return;}
				if(!progress){onStart.call();}
				progress=_getTime()-startTime;
				_tween();
				if(progress>=tobj.time){
					tobj.time=(progress>tobj.time) ? progress+_delay-(progress-tobj.time) : progress+_delay-1;
					if(tobj.time<progress+1){tobj.time=progress+1;}
				}
				if(tobj.time<duration){tobj.id=_request(_step);}else{onComplete.call();}
			}
			function _tween(){
				if(duration>0){
					tobj.currVal=_ease(tobj.time,from,diff,duration,easing);
					elStyle[prop]=Math.round(tobj.currVal)+"px";
				}else{
					elStyle[prop]=to+"px";
				}
				onUpdate.call();
			}
			function _startTween(){
				_delay=1000/60;
				tobj.time=progress+_delay;
				_request=(!window.requestAnimationFrame) ? function(f){_tween(); return setTimeout(f,0.01);} : window.requestAnimationFrame;
				tobj.id=_request(_step);
			}
			function _cancelTween(){
				if(tobj.id==null){return;}
				if(!window.requestAnimationFrame){clearTimeout(tobj.id);
				}else{window.cancelAnimationFrame(tobj.id);}
				tobj.id=null;
			}
			function _ease(t,b,c,d,type){
				switch(type){
					case "linear": case "mcsLinear":
						return c*t/d + b;
						break;
					case "mcsLinearOut":
						t/=d; t--; return c * Math.sqrt(1 - t*t) + b;
						break;
					case "easeInOutSmooth":
						t/=d/2;
						if(t<1) return c/2*t*t + b;
						t--;
						return -c/2 * (t*(t-2) - 1) + b;
						break;
					case "easeInOutStrong":
						t/=d/2;
						if(t<1) return c/2 * Math.pow( 2, 10 * (t - 1) ) + b;
						t--;
						return c/2 * ( -Math.pow( 2, -10 * t) + 2 ) + b;
						break;
					case "easeInOut": case "mcsEaseInOut":
						t/=d/2;
						if(t<1) return c/2*t*t*t + b;
						t-=2;
						return c/2*(t*t*t + 2) + b;
						break;
					case "easeOutSmooth":
						t/=d; t--;
						return -c * (t*t*t*t - 1) + b;
						break;
					case "easeOutStrong":
						return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
						break;
					case "easeOut": case "mcsEaseOut": default:
						var ts=(t/=d)*t,tc=ts*t;
						return b+c*(0.499999999999997*tc*ts + -2.5*ts*ts + 5.5*tc + -6.5*ts + 4*t);
				}
			}
		},
		/* -------------------- */
		
		
		/* returns current time */
		_getTime=function(){
			if(window.performance && window.performance.now){
				return window.performance.now();
			}else{
				if(window.performance && window.performance.webkitNow){
					return window.performance.webkitNow();
				}else{
					if(Date.now){return Date.now();}else{return new Date().getTime();}
				}
			}
		},
		/* -------------------- */
		
		
		/* stops a tween */
		_stopTween=function(){
			var el=this;
			if(!el._mTween){el._mTween={top:{},left:{}};}
			var props=["top","left"];
			for(var i=0; i<props.length; i++){
				var prop=props[i];
				if(el._mTween[prop].id){
					if(!window.requestAnimationFrame){clearTimeout(el._mTween[prop].id);
					}else{window.cancelAnimationFrame(el._mTween[prop].id);}
					el._mTween[prop].id=null;
					el._mTween[prop].stop=1;
				}
			}
		},
		/* -------------------- */
		
		
		/* deletes a property (avoiding the exception thrown by IE) */
		_delete=function(c,m){
			try{delete c[m];}catch(e){c[m]=null;}
		},
		/* -------------------- */
		
		
		/* detects left mouse button */
		_mouseBtnLeft=function(e){
			return !(e.which && e.which!==1);
		},
		/* -------------------- */
		
		
		/* detects if pointer type event is touch */
		_pointerTouch=function(e){
			var t=e.originalEvent.pointerType;
			return !(t && t!=="touch" && t!==2);
		},
		/* -------------------- */
		
		
		/* checks if value is numeric */
		_isNumeric=function(val){
			return !isNaN(parseFloat(val)) && isFinite(val);
		},
		/* -------------------- */
		
		
		/* returns element position according to content */
		_childPos=function(el){
			var p=el.parents(".mCSB_container");
			return [el.offset().top-p.offset().top,el.offset().left-p.offset().left];
		};
		/* -------------------- */
		
	
	
	
	
	/* 
	----------------------------------------
	PLUGIN SETUP 
	----------------------------------------
	*/
	
	/* plugin constructor functions */
	$.fn[pluginNS]=function(method){ /* usage: $(selector).mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	$[pluginNS]=function(method){ /* usage: $.mCustomScrollbar(); */
		if(methods[method]){
			return methods[method].apply(this,Array.prototype.slice.call(arguments,1));
		}else if(typeof method==="object" || !method){
			return methods.init.apply(this,arguments);
		}else{
			$.error("Method "+method+" does not exist");
		}
	};
	
	/* 
	allow setting plugin default options. 
	usage: $.mCustomScrollbar.defaults.scrollInertia=500; 
	to apply any changed default options on default selectors (below), use inside document ready fn 
	e.g.: $(document).ready(function(){ $.mCustomScrollbar.defaults.scrollInertia=500; });
	*/
	$[pluginNS].defaults=defaults;
	
	/* 
	add window object (window.mCustomScrollbar) 
	usage: if(window.mCustomScrollbar){console.log("custom scrollbar plugin loaded");}
	*/
	window[pluginNS]=true;
	
	$(window).load(function(){
		
		$(defaultSelector)[pluginNS](); /* add scrollbars automatically on default selector */
		
		/* extend jQuery expressions */
		$.extend($.expr[":"],{
			/* checks if element is within scrollable viewport */
			mcsInView:$.expr[":"].mcsInView || function(el){
				var $el=$(el),content=$el.parents(".mCSB_container"),wrapper,cPos;
				if(!content.length){return;}
				wrapper=content.parent();
				cPos=[content[0].offsetTop,content[0].offsetLeft];
				return 	cPos[0]+_childPos($el)[0]>=0 && cPos[0]+_childPos($el)[0]<wrapper.height()-$el.outerHeight(false) && 
						cPos[1]+_childPos($el)[1]>=0 && cPos[1]+_childPos($el)[1]<wrapper.width()-$el.outerWidth(false);
			},
			/* checks if element is overflowed having visible scrollbar(s) */
			mcsOverflow:$.expr[":"].mcsOverflow || function(el){
				var d=$(el).data(pluginPfx);
				if(!d){return;}
				return d.overflowed[0] || d.overflowed[1];
			}
		});
	
	});

}))}));
//For debug, the file name is: banner-responsiveness.js
/**
 * Created by junjchen on 02.07.2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    var bannerBlueDetachEvent = "n.banner.blue.block.detached";
    var bannerBlueAttachEvent = "n.banner.blue.block.attached";
    var $bannersInPage = $(".n-banner");
    // responsive banner behavior when blue areas in 2 rows are detached
    $(document).ready(triggerCollapseBanner);
    $(window).resize(triggerCollapseBanner);
    function triggerCollapseBanner() {
        //loop through every banner on the page
        $bannersInPage.each(function () {
            var $banner = $(this);
            var compensation = 30;

            var bannerToggle = $banner.find(".n-banner-toggle");

            //blue part offset on the top banner
            var offsetUpBlue = $banner.find('.n-banner-1st-blue-to-gray').position().left + $banner.find('.n-banner-1st-blue-to-gray .blue-corner').width() - compensation;
            //grey part width in the bottom
            var $navTabDown = $banner.find('.n-banner-2nd .n-banner-tabs');
            //grey part off set in the bottom banner
            var offsetDownGray = $navTabDown.width();
            var breakPointState = $banner.attr("data-visual-break");
            if (breakPointState === undefined) {
                if (offsetUpBlue < offsetDownGray) {
                    $banner.trigger(bannerBlueDetachEvent);
                } else {
                    $banner.trigger(bannerBlueAttachEvent);
                }
            } else if (breakPointState === "true" && offsetUpBlue > offsetDownGray && typeof bannerToggle != "undefined" && $(bannerToggle).css("display") === "none") {
                $banner.trigger(bannerBlueAttachEvent);
            } else if (breakPointState === "false" && offsetUpBlue < offsetDownGray) {
                $banner.trigger(bannerBlueDetachEvent);
            }
        });
    }

    $bannersInPage.on(bannerBlueDetachEvent, bannerBlueBlockDetached).on(bannerBlueAttachEvent, bannerBlueBlockAttached);

    function toggleVisibleBlocksWhenBlueDetached($banner, detach) {
        //elements mark to be hidden on blue detached event in the banner
        var hidden_on_blue_detach = $banner.find('.hidden-on-blue-detached');
        var show_on_blue_detach = $banner.find('.show-on-blue-detached');
        var $overflow_cover = $banner.find('.overflow-toggle-area-cover');
        if (detach) {
            hidden_on_blue_detach.hide();
            show_on_blue_detach.show();
            $overflow_cover.show();
        } else {
            hidden_on_blue_detach.show();
            show_on_blue_detach.hide();
            $overflow_cover.hide();
        }
    }

    function bannerBlueBlockDetached() {
        var $banner = $(this);
        $banner.attr("data-visual-break", true);
        toggleVisibleBlocksWhenBlueDetached($banner, true);

        //rightmost tab need to hide
        var $nav_tab_down_right_most_tab = $banner.find('.n-banner-2nd .rightmost-tab');
        $nav_tab_down_right_most_tab.removeClass('rightmost-tab').addClass('rightmost-tab-disabled');

        //transform style for nav links
        var $nav_links = $banner.find('.n-banner-2nd .n-banner-links');
        var $nav_dropdown_links = $banner.find('.n-banner-2nd .n-banner-dropdown-links');
        $nav_dropdown_links.find('li.dropdown').each(function () {
            $banner.addClass('n-dropdown-menu-item-has-child');
        });
        $nav_dropdown_links.find('ul.dropdown-menu').each(function () {
            $banner.addClass('n-dropdown-sub-menu');
        });
        $nav_links.removeClass('nav n-banner-nav n-banner-links').addClass("dropdown-menu n-banner-links-collapse-dropdown-menu");
        $nav_dropdown_links.removeClass('nav n-banner-nav n-banner-dropdown-links').addClass("dropdown-menu n-banner-dropdown-links-collapse-dropdown-menu");

        //add class for showing dropdown correctly
        var $nav_links_sub_menu = $banner.find('.n-banner-2nd .n-banner-links-collapse .dropdown .dropdown-menu');
        $nav_links_sub_menu.addClass('n-collapse-dropdown-sub-menu');
    }

    function bannerBlueBlockAttached() {
        var $banner = $(this);
        $banner.attr("data-visual-break", false);
        toggleVisibleBlocksWhenBlueDetached($banner, false);

        //rightmost tab need to show
        var $nav_tab_down_right_most_tab = $banner.find('.n-banner-2nd .rightmost-tab-disabled');
        $nav_tab_down_right_most_tab.removeClass('rightmost-tab-disabled').addClass('rightmost-tab');

        //transform style for nav links
        var $nav_links = $banner.find('.n-banner-2nd .n-banner-links-collapse-dropdown-menu');
        var $nav_dropdown_links = $banner.find('.n-banner-2nd .n-banner-dropdown-links-collapse-dropdown-menu');
        $nav_dropdown_links.find('li.dropdown').each(function () {
            $banner.removeClass('n-dropdown-menu-item-has-child');
        });
        $nav_dropdown_links.find('ul.dropdown-menu').each(function () {
            $banner.removeClass('n-dropdown-sub-menu');
        });
        $nav_links.removeClass("dropdown-menu n-banner-links-collapse-dropdown-menu").addClass('nav n-banner-nav n-banner-links');
        $nav_dropdown_links.removeClass("dropdown-menu n-banner-dropdown-links-collapse-dropdown-menu").addClass('nav n-banner-nav n-banner-dropdown-links');

        //remove class
        var $nav_links_sub_menu = $banner.find('.n-banner-2nd .n-banner-links-collapse .dropdown .dropdown-menu.n-collapse-dropdown-sub-menu');
        $nav_links_sub_menu.removeClass('n-collapse-dropdown-sub-menu');
    }

}(jQuery);

//For debug, the file name is: calendar.js
/* ========================================================================
 * Calendar: fix bugs and extends function for fuelux datapicker component
 * Fuelux: https://github.com/ExactTarget/fuelux
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    var class_noradius_lb = 'n-inputfield-nonradius-lb';

    $(document)
        .on('shown.bs.dropdown hidden.bs.dropdown', '.n-calendar', function () {
            $(this).children('input').toggleClass(class_noradius_lb);
        })
        .on('blur.wf.calendar', '.n-calendar input', function () {
            var $input = $(this);
            if ($input.hasClass(class_noradius_lb)) {
                $input.removeClass(class_noradius_lb);
            }
        })
        //down key will result the focus to the back button
        .on('keydown.wf.calendar', '.n-calendar .datepicker-wheels-year', focusToWheelsBack)
        .on('keydown.wf.calendar', '.n-calendar .datepicker-wheels-month', focusToWheelsBack)
        //the focus will be switched to the title after clicking on back or select button.
        .on('click.wf.calendar', '.datepicker-wheels-footer .datepicker-wheels-back', focusToHeaderTitle)
        .on('click.wf.calendar', '.datepicker-wheels-footer .datepicker-wheels-select', focusToHeaderTitle);

    function focusToWheelsBack(evt) {
        if (evt.which === 40) {
            $(this).nextAll('.datepicker-wheels-footer').find('.datepicker-wheels-back').focus();
            evt.preventDefault();
            evt.stopPropagation();
        }
    }

    function focusToHeaderTitle(evt) {
        $(this).closest('.datepicker-calendar-wrapper').find('button.title').focus();
        evt.preventDefault();
        evt.stopPropagation();
    }

    //Data-API for data-markup=calendar, HTML markkup will be generated automatically
    $(function () {
        $('[data-markup^="calendar"]').each(function () {
            if ($(this).parent().find('.datepicker-calendar-wrapper').length === 0) {
                $(this).after('<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>');
            }
        });

        $('[data-markup^="disabled_calendar"]').each(function () {
            if ($(this).parent().find('.datepicker-calendar-wrapper').length === 0) {
                $(this).after('<div class=\"input-group-btn\"><button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" disabled>  <span class=\"glyphicon glyphicon-calendar\"></span>  <span class=\"sr-only\">Toggle Calendar</span></button><div class=\"dropdown-menu dropdown-menu-right datepicker-calendar-wrapper\" role=\"menu\">  <div class=\"datepicker-calendar\"><div class=\"datepicker-calendar-header\"><button type=\"button\" class=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span><span class=\"sr-only\">Previous Month</span></button><button type=\"button\" class=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span><span class=\"sr-only\">Next Month</span></button><button type=\"button\" class=\"title\"><span class=\"month\">  <span data-month=\"0\">January</span>  <span data-month=\"1\">February</span>  <span data-month=\"2\">March</span>  <span data-month=\"3\">April</span>  <span data-month=\"4\">May</span>  <span data-month=\"5\">June</span>  <span data-month=\"6\">July</span>  <span data-month=\"7\">August</span>  <span data-month=\"8\">September</span>  <span data-month=\"9\">October</span>  <span data-month=\"10\">November</span>  <span data-month=\"11\">December</span></span> <span class=\"year\"></span></button></div><table class=\"datepicker-calendar-days\"><thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead><tbody></tbody></table></div><div class=\"datepicker-wheels\" aria-hidden=\"true\"><div class=\"datepicker-wheels-month\"><h2 class=\"header\">Month</h2><ul><li data-month=\"0\"><button type=\"button\">Jan</button></li><li data-month=\"1\"><button type=\"button\">Feb</button></li><li data-month=\"2\"><button type=\"button\">Mar</button></li><li data-month=\"3\"><button type=\"button\">Apr</button></li><li data-month=\"4\"><button type=\"button\">May</button></li><li data-month=\"5\"><button type=\"button\">Jun</button></li><li data-month=\"6\"><button type=\"button\">Jul</button></li><li data-month=\"7\"><button type=\"button\">Aug</button></li><li data-month=\"8\"><button type=\"button\">Sep</button></li><li data-month=\"9\"><button type=\"button\">Oct</button></li><li data-month=\"10\"><button type=\"button\">Nov</button></li><li data-month=\"11\"><button type=\"button\">Dec</button></li></ul></div><div class=\"datepicker-wheels-year\"><h2 class=\"header\">Year</h2><ul></ul></div><div class=\"datepicker-wheels-footer clearfix\"><button type=\"button\" class=\"btn datepicker-wheels-back\"><span class=\"icon icon-left\"></span><span class=\"sr-only\">Return to Calendar</span></button><button type=\"button\" class=\"btn datepicker-wheels-select\">Select <span class=\"sr-only\">Month and Year</span></button></div></div></div></div> </div></div>');
            }
        });

        //This is just a workaround method to off the focus event for input field
        //fuelux should provide an option to not to listen it.
        setTimeout(function () {
            $('.datepicker .n-calendar .form-control').off('focus.fu.datepicker');
        }, 25);

    });

}(jQuery);
//For debug, the file name is: combobox.js
/**
 * Created by linaqiu on 2015/6/3.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $(document).on('click.bs.dropdown.data-api', '[data-toggle="dropdown"]', function () {
        if (!$(this).parents(".combobox").hasClass("n-page-combox")) {
            $(".n-page-combox").removeClass("combobox-open");
        }

        if ($(".combobox-open").length !== 0) {
            if($(".combobox-open").find("button").get(0) !== $(this).get(0)){
                $(".combobox-open").toggleClass('combobox-open');
            }
        }

        if ($(this).parents(".combobox").length !== 0) {
            $(this).parents(".combobox").toggleClass('combobox-open');
        }

        var comboBox = $(this).parents(".combobox");
        if ($(comboBox).hasClass("combobox-filter")) {
            var inputFiled = comboBox.find("input");
            inputFiled.focus();
            if ($(comboBox).hasClass("combobox-open")) {
                $(inputFiled).on("input", function() {
                    doFilter(comboBox);
                });

                var allItems = comboBox.find("ul li");
                var size = allItems.size();
                for (var i = 0; i < size; i++) {
                    $(allItems[i]).removeClass("combobox-item-hidden");
                }
            }
            else {
                inputFiled.unbind("input");
            }

            comboBox.find("ul").addClass("combobox-filter-dropdown-menu");
        }
    });

    $(document).on('click.bs.dropdown.data-api', function () {
        if ($(".combobox-open").length !== 0) {
            if ($(".combobox-open").hasClass("combobox-filter")) {

                if (!$(".combobox-open").find("input").is(":focus")) {
                    $(".combobox-open").find("input").unbind("input");
                    $(".combobox-open").removeClass('combobox-open');
                }
                else {
                    $(".combobox-open").find(".input-group-btn").addClass("open");
                    $(".combobox-open").find("button").attr("aria-expanded", "true");
                }
            }
            else {
                $(".combobox-open").removeClass('combobox-open');
            }
        }
    });

    function doFilter(comboBox){
        if (comboBox.find("ul").length !== 0) {
            var allItems = comboBox.find("ul li");
            var size = allItems.size();
            if (comboBox.find("input").val() !== "") {
                var inputText = comboBox.find("input").val();
                var reg = "/" + inputText.replace(/\*/g, ".*") + "/gi";
                for (var i = 0; i < size; i++) {
                    if (eval(reg).test(allItems[i].textContent)) {
                        $(allItems[i]).removeClass("combobox-item-hidden");
                    }
                    else {
                        $(allItems[i]).addClass("combobox-item-hidden");
                    }
                }
            }
            else {
                for (var i = 0; i < size; i++) {
                    $(allItems[i]).removeClass("combobox-item-hidden");
                }
            }
        }
    }

}(jQuery);




//For debug, the file name is: dlg-wizard.js
/**
 * Created by linaqiu on 2015/7/20.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

//TODO If button is disabled, the focus should move as follows:
//TODO Back is disabled -> focus to Next
//TODO Next is disabled AND we are at the last step -> focus to Finish
+function ($) {
    'use strict';

    $.fn.extend({
        initWizard: function () {
            $(this).bootstrapWizard({
                'nextSelector': '.button-next', 'previousSelector': '.button-previous',
                'firstSelector': '.button-first', 'lastSelector': '.button-last'
            });

            // init steps width
            var $steps = $(this).find(".navbar-inner>ul>li");
            var distance = Math.floor(100 / ($steps.length - 1));
            var remainder = Math.ceil(40 / ($steps.length - 1));
            $steps.not(":last-child").css("width", "calc(" + distance + "% - " + remainder + "px)");
        }
    });

    $(".n-dlg-wizard").on("click", ".modal-footer>input[type=button]", function () {
        var activeTab = $(this).closest(".modal-footer").prev(".modal-body").find("li.active");
        addPassStyle(activeTab);
    });

    $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function () {
        var $wizard = $(".n-dlg-wizard.in");
        if ($wizard.length > 0) {
            // set next button as focus and reset to the first step
            $wizard.find("input[type=button][name=next]").focus();
            $wizard.find("input[type=button][name=first]").trigger("click");
        }
    });

    function addPassStyle(activeTab) {
        activeTab.removeClass("passed").siblings("li").removeClass("passed");
        var $passedSteps = activeTab.prevAll("li");
        if ($passedSteps.length > 0) {
            $passedSteps.addClass("passed");
        }
    }

}(jQuery);
//For debug, the file name is: drilldown-without-arrow.js
/**
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    var obj_drilldown_noArrow;
    $(".n-drillDown-row").each(function () {
        $(this).bind('click', function (e) {
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-inner").css("border-bottom-left-radius", "7px");
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-inner").css("border-bottom-right-radius", "7px");
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-content-row").css("border-bottom-left-radius", "7px");
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-content-row").css("border-bottom-right-radius", "7px");
            var ctrlKeyPressed = (window.event && window.event.ctrlKey) || e.ctrlKey;
            var shiftKeyPressed = (window.event && window.event.shiftKey) || e.shiftKey;
            if (ctrlKeyPressed || shiftKeyPressed) {
                return;
            }
            if (obj_drilldown_noArrow == this) {
                $($(this).attr("row-target-selector")).slideUp(function () {
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");

                });
                obj_drilldown_noArrow = '';
            }
            else {
                //if (obj && $(obj).attr("class").indexOf("n-drillDown-border-row") > 0) {
                //    $(obj).removeClass("n-drillDown-border-row");
                //}
                $(".n-drillDown-collapsed-row").hide();
                $($(this).attr("row-target-selector")).slideDown();
                var lastRowHeight = $(this).closest('table').find("tr:last").height();
                if (lastRowHeight > 0) {
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "0px");
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "0px");
                } else {
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");
                }
                obj_drilldown_noArrow = this;
            }
        });
    });

    $(".n-drillDown-collapsed-row .icon-close-rounded").click(function () {
        $(".n-drillDown-collapsed-row").slideUp(function () {
            $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
            $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");

        });
        obj_drilldown_noArrow = '';
    });

    $(document).keyup(function (event) {
        if ($(obj_drilldown_noArrow).length === 0) {
            return;
        }
        if (event.keyCode === 27) {
            $(".n-drillDown-collapsed-row").slideUp(function () {
                $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
                $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");

            });
            obj_drilldown_noArrow = '';
        }
    });
}(jQuery);
//For debug, the file name is: drilldown.js
/**
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    var isShow_drilldown = 0;
    var obj_drilldown;
    $(".n-drillDown-item").each(function () {

        $(this).bind('click', function (e) {
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-inner").css("border-bottom-left-radius", "7px");
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-inner").css("border-bottom-right-radius", "7px");
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-content").css("border-bottom-left-radius", "7px");
            $(this).closest('table').find("tr:last-child").find(".n-drillDown-content").css("border-bottom-right-radius", "7px");
            var ctrlKeyPressed = (window.event && window.event.ctrlKey) || e.ctrlKey;
            var shiftKeyPressed = (window.event && window.event.shiftKey) || e.shiftKey;
            if (ctrlKeyPressed || shiftKeyPressed) {
                return;
            }
            if (obj_drilldown == this) {
                $($(this).attr("data-target-selector")).slideUp(function () {
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
                    $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");

                });
                //$(this).removeClass('n-drillDown-border');
                obj_drilldown = '';
                isShow_drilldown = 0;
            }
            else {
                var arrowDistance = $(this).position().left + $(this).width() / 2;
                var arrowDistancePxValue = arrowDistance + "px";

                if (isShow_drilldown && $(this).offset().top === $(obj_drilldown).offset().top) { //
                    //$(this).addClass('n-drillDown-border').siblings().removeClass('n-drillDown-border');
                    $(".n-drillDown-arrow").animate({left: arrowDistancePxValue});
                    $($(this).attr("data-target-selector")).show().siblings().stop(true, true).hide();
                    obj_drilldown = this;
                } else {
                    $(".n-drillDown-collapsed").hide();
                    //$(".n-drillDown-item").removeClass("n-drillDown-border");
                    //$(this).addClass('n-drillDown-border');
                    $(".n-drillDown-arrow").css("left", arrowDistancePxValue);

                    $($(this).attr("data-target-selector")).slideDown();
                    var lastRowHeight = $(this).closest('table').find("tr:last").height();
                    if (lastRowHeight > 0) {
                        $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "0px");
                        $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "0px");
                    } else {
                        $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
                        $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");
                    }
                    isShow_drilldown = 1;
                    obj_drilldown = this;
                }
            }
        });
    });

    $(".icon-close-rounded").click(function () {
        $(".n-drillDown-collapsed").slideUp(function () {
            $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
            $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");

        });
        //$(".n-drillDown-item").removeClass('n-drillDown-border');
        obj_drilldown = '';
        isShow_drilldown = 0;
    });

    $(window).resize(function () {
        if ($(obj_drilldown).length === 0) {
            return;
        }
        var arrowDistance = $(obj_drilldown).position().left + $(obj_drilldown).width() / 2;
        var arrowDistancePxValue = arrowDistance + "px";
        $(".n-drillDown-arrow").css("left", arrowDistancePxValue);
    });

    $(document).keyup(function (event) {
        if ($(obj_drilldown).length === 0) {
            return;
        }
        if (event.keyCode === 27) {
            $(".n-drillDown-collapsed").slideUp(function () {
                $(this).closest('table').find("tr:nth-last-child(2)").find("td:first-child").css("border-bottom-left-radius", "7px");
                $(this).closest('table').find("tr:nth-last-child(2)").find("td:last-child").css("border-bottom-right-radius", "7px");
            });
            obj_drilldown = '';
            isShow_drilldown = 0;
        }
    });
}(jQuery);
//For debug, the file name is: dropdowns.js
/**
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $.fn.extend({
        adaptiveSelectlist: function () {
            var $select = $(this);
            $select.selectlist();
            var $dropDownMecu = $select.find('> .dropdown-menu');
            var DROP_DOWN_MIN_WIDTH_IN_PX = $dropDownMecu.css('min-width').replace(/[^-\d\.]/g, '');
            $select.on('changed.fu.selectlist', function () {
                var adaptedWidth = $select.width();
                if (adaptedWidth > DROP_DOWN_MIN_WIDTH_IN_PX) {
                    $dropDownMecu.css('width', adaptedWidth);
                }
                else {
                    $dropDownMecu.css('width', 'auto');
                }
            });
        }
    });

    $(document).ready(function () {
        $(".n-dropdown-menu-scroll").on("click", ".mCSB_dragger_bar", function (e) {
            e.stopPropagation();
        });
    });

}(jQuery);


//For debug, the file name is: flyoutmenu.js
/**
 * Created by linaqiu on 2015/6/12.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $.fn.extend({
        initFlyout: function () {
            var $flyout = $(this);
            // set flyout container left position
            var $menuContainer = $flyout.find(".n-flyout-container");
            var menuWidth = $menuContainer.outerWidth();
            var menuHeight = $menuContainer.outerHeight();
            $flyout.css("left", (-menuWidth) + "px");
            // set flyout open top position
            var $openAnchor = $flyout.find(".n-flyout-open");
            var openHeight = $openAnchor.outerHeight();
            var menuLenght = $flyout.find(".n-flyout-container > ul").children("li").length;
            $openAnchor.css("left", (menuWidth + 1) + "px");
            $openAnchor.css("top", Math.ceil((menuHeight - openHeight) / 2) + "px");
            // hide container
            $menuContainer.hide();
        }
    });

    $(".n-flyout").on("click", ".n-flyout-open", function () {
        var $flyoutContainer = $(this).prev(".n-flyout-container");
        if ($flyoutContainer.is(":visible")) {
            hideFlyout($flyoutContainer);
        }
        else {
            showFlyout($flyoutContainer);
        }
    });

    $(document).keydown(function (e) {
        // click esc to hide flyout menu if it is open
        var $flyoutContainer = $(".n-flyout>.n-flyout-container");
        if (e.keyCode === 27 && $flyoutContainer.is(":visible") && ($(".n-flyout").find(":focus").length>0)) {
            hideFlyout($flyoutContainer);
        }
        if (e.keyCode === 32 && $flyoutContainer.is(":visible") && $(".n-flyout-open").is(":focus")) {
            hideFlyout($flyoutContainer);
            return false;
        }

        if (e.keyCode === 32 && !$flyoutContainer.is(":visible") && $(".n-flyout-open").is(":focus")) {
            showFlyout($flyoutContainer);
            return false;
        }

    });

    function hideFlyout($flyoutContainer) {
        var menuWidth = $flyoutContainer.outerWidth();
        $flyoutContainer.parent(".n-flyout").animate({left: -menuWidth}, 400, function () {
                $flyoutContainer.hide();
            }
        );
    }

    function showFlyout($flyoutContainer) {
        $flyoutContainer.show();
        $flyoutContainer.parent(".n-flyout").animate({left: 0}, 400);
        $flyoutContainer.find("a:first").focus();
    }

}(jQuery);


//For debug, the file name is: grid.js
/**
 * Created by linaqiu on 2015/8/5.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $.grid = {
        /*---------------- nokia TextField render/editor ----------------*/
        nTextFieldCellRenderer: function (row, column, value) {
            return '<input class="n-inputfield n-inputfield-small" value="' + value + '" />';
        },

        nCreateTextFieldEditor: function (row, cellValue, editor, cellText, width, height) {
            // construct the editor.
            var element = $('<input class="n-inputfield n-inputfield-small" />');
            editor.append(element);
        },

        nInitTextFieldEditor: function (row, cellValue, editor, cellText, width, height) {
            // set the editor's current value. The callback is called each time the editor is displayed.
            var inputHTMLElement = editor.find("input");
            inputHTMLElement.val(cellValue);
            inputHTMLElement.focus();
        },

        nGetTextFieldEditorValue: function (row, cellValue, editor) {
            return editor.find("input").val();
        },

        /*---------------- nokia Indicator textField render/editor ----------------*/
        nIndicatorTextFieldCellRenderer: function (gridId) {
            return function(row, columnfield, value, defaulthtml, columnproperties){
                var edited = '';
                $(gridId + " .n-grid-inputfield-indicated").each(function () {
                    var idMatched = false;
                    var id = $(this).parent().attr('id');
                    if (id != undefined) {
                        if (id.indexOf(columnfield + "_" + row) >= 0) {
                            idMatched = true;
                        }
                    }

                    if ($(this).find("input").val() == value && idMatched) {
                        if ($(this).find(".icon").hasClass("icon-edited-small")) {
                            edited = 'icon-edited-small';
                        }
                    }
                });

                var element = '<div class="n-grid-inputfield-indicated">' +
                    '<input class="n-inputfield n-inputfield-small" value="' + value + '">' +
                    '<a class="form-control-feedback"><span class="icon ' + edited + '"></span></a>' +
                    '</div>';
                return element;
            };
        },

        nCreateIndicatorTextFieldEditor: function (row, cellValue, editor, cellText, width, height) {
            // construct the editor.
            var gridId = editor.parent().attr("id").replace("contenttable", "");
            var isIndicatedByCell = checkIndicatedByCell(editor);
            var element = '<div class="n-grid-inputfield-indicated">' +
                '<input class="n-inputfield n-inputfield-small"/>' +
                '<a class="form-control-feedback"><span class="icon"></span></a>' +
                '</div>';
            editor.append(element);
            var editorId = editor.attr("id");
            var inputHTMLElement = editor.find("input");
            inputHTMLElement.bind('input', function () {
                if (inputHTMLElement.val() != cellValue) {
                    if (isIndicatedByCell) {
                        editor.find(".icon").addClass("icon-edited-small");
                    }
                    $("#" + gridId + " #n-row-indicated-" + row + " > span").addClass("icon-edited-white");
                    addChangedCol(row, editorId, gridId);
                } else {
                    editor.find(".icon").removeClass("icon-edited-small");
                    removeChangedCol(row, editorId, gridId);
                }
            });
        },

        nInitIndicatorTextFieldEditor: function (row, cellValue, editor, cellText, width, height) {
            // set the editor's current value. The callback is called each time the editor is displayed.
            var inputHTMLElement = editor.find("input");
            inputHTMLElement.val(cellValue);
            inputHTMLElement.focus();
        },

        nGetIndicatorTextFieldEditorValue: function (row, cellValue, editor) {
            return editor.find("input").val();
        },

        /*---------------- nokia Checkbox render/editor ----------------*/
        nCheckboxCellsrenderer: function (checkLabel) {
            var _checkLabel = checkLabel;
            return function (row, column, value, editor) {
                return '<div class="checkbox checkbox-small">' +
                    '<input id="cb' + row + Date.now() + '" type="checkbox" ' + (value ? ' checked="true"' : '') + '/>' +
                    '<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' +
                    '</div>';
            };
        },
        nCreateCheckboxEditor: function (checkLabel) {
            var _checkLabel = checkLabel;
            return function (row, value, editor, cellText, width, height) {
                // construct the editor.
                var target = (value) ? ' checked="true"' : '';
                var element = '<div class="checkbox checkbox-small margin-add-one">' +
                    '<input id="cb' + row + Date.now() + '" type="checkbox" ' + (target) + '/>' +
                    '<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' + '</div>';
                editor.append(element);
            };
        },

        nInitCheckboxEditor: function (row, cellValue, editor, cellText, width, height) {
            // set the editor's current value. The callback is called each time the editor is displayed.
            var inputHTMLElement = editor.find("input");
            var current = inputHTMLElement.prop("checked");
            inputHTMLElement.prop({
                "checked": !current
            });
            inputHTMLElement.prop("checked");
            inputHTMLElement.focus();
        },
        nGetCheckboxEditorValue: function (row, cellValue, editor) {
            var inputHTMLElement = editor.find("input");
            return inputHTMLElement.prop("checked");
        },
        /*---------------- nokia Indicator Checkbox render/editor ----------------*/
        nIndicatorCheckboxCellsrenderer: function (gridId, checkLabel) {
            var _checkLabel = checkLabel;
            return function (row, column, value, editor) {
                var edited = '';
                var orignalValue = '';
                $(gridId + " .grid-checkbox-indicated").each(function () {
                    var idMatched = false;
                    var id = $(this).parent().attr('id');
                    if (id != undefined) {
                        if (id.indexOf(column + "_" + row) >= 0) {
                            idMatched = true;
                        }
                    }

                    if (idMatched) {
                        if ($(this).find(".icon").hasClass("icon-edited-small")) {
                            edited = 'icon-edited-small';
                        }
                        if ($(this).find(".icon").hasClass("icon-edited-small-white")) {
                            edited = 'icon-edited-small-white';
                        }
                        orignalValue = $(this).find("input").attr("orignal-value");
                    }
                });

                return '<div id="indicator-checkbox-' + row + '" class="checkbox checkbox-small grid-checkbox-indicated">' +
                    '<input id="cb' + row + Date.now() + '" type="checkbox" ' + (value ? ' checked="true"' : '') + ' orignal-value="' + orignalValue + '"/>' +
                    '<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' +
                    '<span class="icon align-right ' + edited + '"></span>' +
                    '</div>';
            };
        },
        nCreateIndicatorCheckboxEditor: function (checkLabel) {
            var _checkLabel = checkLabel;
            return function (row, value, editor, cellText, width, height) {
                // construct the editor.
                var target = (value) ? ' checked="true"' : '';
                var element = '<div id="indicator-checkbox-' + row + '" class="checkbox checkbox-small margin-add-one grid-checkbox-indicated">' +
                    '<input id="cb' + row + Date.now() + '" type="checkbox" ' + (target) + ' orignal-value="' + value + '"/>' +
                    '<label for="cb' + row + Date.now() + '">' + _checkLabel + '</label>' +
                    '<span class="icon align-right editor"></span>' + '</div>';
                editor.append(element);
            };
        },

        nInitIndicatorCheckboxEditor: function (row, cellValue, editor, cellText, width, height) {
            // set the editor's current value. The callback is called each time the editor is displayed.
            var gridId = editor.parent().attr("id").replace("contenttable", "");
            var isIndicatedByCell = checkIndicatedByCell(editor);
            var inputHTMLElement = editor.find("input");
            var current = inputHTMLElement.prop("checked");
            inputHTMLElement.prop({
                "checked": !current
            });
            inputHTMLElement.prop("checked");
            inputHTMLElement.focus();
            var editorId = editor.attr("id");
            if (current.toString() == inputHTMLElement.attr("orignal-value")) {
                if (isIndicatedByCell) {
                    editor.find(".icon").addClass("icon-edited-small-white");
                }
                $("#" + gridId + " #n-row-indicated-" + row + " > span").addClass("icon-edited-white");
                addChangedCol(row, editorId, gridId);
            } else {
                editor.find(".icon").removeClass("icon-edited-small-white");
                removeChangedCol(row, editorId, gridId);
            }
            inputHTMLElement.change(function () {
                if (inputHTMLElement.prop("checked").toString() == inputHTMLElement.attr("orignal-value")) {
                    editor.find(".icon").removeClass("icon-edited-small-white");
                    removeChangedCol(row, editorId, gridId);
                } else {
                    if (isIndicatedByCell) {
                        editor.find(".icon").addClass("icon-edited-small-white");
                    }
                    $("#" + gridId + " #n-row-indicated-" + row + " > span").addClass("icon-edited-white");
                    addChangedCol(row, editorId, gridId);
                }
            });
        },
        nGetIndicatorCheckboxEditorValue: function (row, cellValue, editor) {
            var inputHTMLElement = editor.find("input");
            return inputHTMLElement.prop("checked");
        },
        /*---------------- nokia dropdownlist render/editor ----------------*/
        dropdownlistCellsrenderer: function (row, columnfield, value) {
            return '<div class="btn-group selectlist selectlist-small selectlist-resize" data-resize="none" data-initialize="selectlist" id="mySelectlist7">' +
                '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">' +
                '<span class="selected-label">' + value + '</span>' +
                '<span class="selected-caret" ><span class="caret"></span></span>' +
                '</button>' +
                '<ul class="dropdown-menu" role="menu">' +
                '<li data-value="1">' + '<a href="#">' + '<span>' + value + '</span>' + '</a>' + '</li>' +
                '</ul>' + '</div>';
        },

        dropdownlistEditor: function (dropdownlists) {
            var _dropdownlists = dropdownlists;
            return function (row, cellValue, editor, cellText, width, height) {
                editor.jqxDropDownList(
                    {
                        autoDropDownHeight: false,
                        itemHeight: 27,
                        dropDownHeight: '150px',
                        scrollBarSize: 8, width: width - 4, height: 24,
                        source: _dropdownlists.map(function (name) {
                            return "<span>" + name + "</span>";
                        })
                    });
            };
        },

        dropdownlistInitEditor: function (row, cellValue, editor, cellText, width, height) {
            editor.jqxDropDownList('selectItem', '<span>' + cellValue + '</span>');
            editor.jqxDropDownList('open');
        },

        dropdownlistEditorValue: function (row, cellValue, editor) {
            return editor.val();
        },
        /*---------------- nokia dropdownlist render/editor ----------------*/
        indicatorDropdownlistCellsrenderer: function (gridId) {
            return function(row, columnfield, value){
                var edited = '';
                $(gridId + " .grid-selectlist-indicated").each(function () {
                    var idMatched = false;
                    var id = $(this).parent().attr('id');
                    if (id != undefined) {
                        if (id.indexOf(columnfield + "_" + row) >= 0) {
                            idMatched = true;
                        }
                    }
                    if (idMatched) {
                        if ($(this).find(".icon").hasClass("icon-edited-small")) {
                            edited = 'icon-edited-small';
                        }
                    }
                });

                return '<div class="btn-group selectlist selectlist-small selectlist-resize selectlist-indicated" data-resize="none" data-initialize="selectlist" id="mySelectlist' + row + '">' +
                    '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">' +
                    '<span class="selected-label">' + value + '</span>' +
                    '<span class="selected-caret" ><span class="caret"></span></span>' +
                    '</button>' +
                    '<ul class="dropdown-menu" role="menu">' +
                    '<li data-value="1">' + '<a href="#">' + '<span>' + value + '</span>' + '</a>' + '</li>' +
                    '</ul>' +
                    '<a class="form-control-feedback">' +
                    '<span class="icon ' + edited + '"></span>' +
                    '</a>' +
                    '</div>';
            };
        },

        indicatorDropdownlistEditor: function (dropdownlists) {
            var _dropdownlists = dropdownlists;
            return function (row, cellValue, editor, cellText, width, height) {
                var gridId = editor.parent().attr("id").replace("contenttable", "");
                var isIndicatedByCell = checkIndicatedByCell(editor);
                var editorId = editor.attr("id");
                editor.jqxDropDownList({
                    autoDropDownHeight: false,
                    itemHeight: 27,
                    dropDownHeight: '150px',
                    scrollBarSize: 8, width: width - 4, height: 24,
                    source: _dropdownlists.map(function (name) {
                        return "<span>" + name + "</span>";
                    }),
                    selectionRenderer: function () {
                        var item = editor.jqxDropDownList('getSelectedItem');
                        if (item != null) {
                            if (item.value.indexOf(cellText) >= 0) {
                                removeChangedCol(row, editorId, gridId);
                                return item.value;
                            } else {
                                addChangedCol(row, editorId, gridId);
                                $("#" + gridId + " #n-row-indicated-" + row + " > span").addClass("icon-edited-white");
                                if (isIndicatedByCell) {
                                    return item.value + '<div class="grid-selectlist-indicated"><a class="form-control-feedback"><span class="icon icon-edited-small"></span></a></div>';
                                }else{
                                    return item.value;
                                }
                            }
                        }
                    }
                });
            };
        },

        indicatorDropdownlistInitEditor: function (row, cellValue, editor, cellText, width, height) {
            editor.jqxDropDownList('selectItem', '<span>' + cellValue + '</span>');
            editor.jqxDropDownList('open');
        },

        indicatorDropdownlistEditorValue: function (row, cellValue, editor) {
            return editor.val();
        },

        /*---------------- nokia indicator ----------------*/
        indicatorRenderer: function (gridId) {
            return function(row, datafield, value, defaulthtml, columnproperties){
                var edited = '';
                var changedCol = '';
                if ($(gridId + " #n-row-indicated-" + row + " > span").hasClass("icon-edited")) {
                    edited = "icon-edited";
                }
                if ($(gridId + " #n-row-indicated-" + row + " > span").hasClass("icon-edited-white")) {
                    edited = "icon-edited-white";
                }
                changedCol = $(gridId + " #n-row-indicated-" + row).attr("changed-col");
                if(changedCol == undefined){
                    changedCol = '';
                }
                return '<div id="n-row-indicated-' + row + '" class="n-row-indicated text-center" changed-col="' + changedCol + '"><span class="icon ' + edited + '"></span></div>';
            };

        },

        indicatorRowSelectRenderer: function (gridId) {
            var $grid = $(gridId);
            $grid.bind('rowselect', function (event) {
                var row = event.args.rowindex;
                $(gridId + " .n-row-indicated").each(function () {
                    var icon = $(this).find("span");
                    if (icon.hasClass("icon-edited-white")) {
                        icon.removeClass("icon-edited-white");
                        icon.addClass("icon-edited");
                    }
                });
                if ($(gridId + " #n-row-indicated-" + row + " > span").hasClass("icon-edited")) {
                    $(gridId + " #n-row-indicated-" + row + " > span").removeClass("icon-edited");
                    $(gridId + " #n-row-indicated-" + row + " > span").addClass("icon-edited-white");
                }

                $(gridId + " .grid-checkbox-indicated").each(function () {
                    var cbId = $(this).attr("id");
                    var icon = $(this).find("span");
                    if (cbId.indexOf(row, cbId.length - row.length) == -1) {
                        if (icon.hasClass("icon-edited-small-white")) {
                            icon.removeClass("icon-edited-small-white");
                            icon.addClass("icon-edited-small");
                        }
                    } else {
                        if (icon.hasClass("icon-edited-small")) {
                            icon.removeClass("icon-edited-small");
                            icon.addClass("icon-edited-small-white");
                        }
                    }
                });
            });
        },

        /*---------------- nokia dropdownlist filter ----------------*/
        dropdownFilterRender: function (column, columnElement, widget) {
            widget.jqxDropDownList({
                scrollBarSize: 8,
                placeHolder: "Filter...",
                renderer: function (index, label, value) {
                    return "<span>" + label + "</span>";
                }
            });
        },

        dropdownFilterString: {filterchoosestring: "Filter..."},

        /*---------------- nokia paging render ----------------*/
        pagerrenderer: function (gridId) {
            var $grid = $(gridId);
            var element = $("<div class=\"page-container\"></div>");
            var datainfo = $grid.jqxGrid('getdatainformation');
            var paginginfo = datainfo.paginginformation;
            var pagescount = paginginfo.pagescount;

            var filterable = $grid.jqxGrid('filterable');
            if (filterable) {
                appendFilterPageLeft();
                addFilterEvent();
            }
            else {
                appendLeft();
                appendMiddle();
                appendRight();
            }

            function addFilterEvent() {
                $grid.on("filter", function (event) {
                    var filterRows = $grid.jqxGrid('getrows');
                    var dataRows = $grid.jqxGrid('getboundrows');
                    var filterPageLeft = $grid.find(".n-table-paging-left");

                    if (dataRows.length === filterRows.length) {
                        filterPageLeft.removeClass("has-filter");
                        filterPageLeft.addClass("no-filter");
                    }
                    else {
                        filterPageLeft.removeClass("no-filter");
                        filterPageLeft.addClass("has-filter");
                        $(filterPageLeft).find(".n-table-filter-result span").html(filterRows.length);
                    }
                });
            }

            function appendFilterPageLeft() {
                var totalItem = $("<span class=\"n-table-paging-left no-filter\"><span class=\"icon icon-filter\"></span><span class=\"n-table-filter-result\">Results: <span></span></span><span>Total: " + datainfo.rowscount + "</span></span>");
                totalItem.appendTo(element);
            }

            function appendLeft() {
                var totalItem = $("<span class=\"n-table-paging-left\"><span>Total:" + datainfo.rowscount + "</span></span>");
                totalItem.appendTo(element);
            }

            function appendMiddle() {
                var centerField = $("<div class=\"n-table-paging-middle\"></div>");

                var firstButton = $("<button class=\"btn btn-icon page-first\"><span class=\"icon icon-first\"></span></button>");
                var prevButton = $("<button class=\"btn btn-icon page-prev\"><span class=\"icon icon-back\"></span></button>");

                var pageField = $("<div class='pageField'></div>");
                var pageInput = $("<input type=\"text\" class=\"n-inputfield n-inputfield-small\" />");
                $("<span>Page</span>").appendTo(pageField);
                pageInput.appendTo(pageField);
                $("<span>\/ " + pagescount + "</span>").appendTo(pageField);


                var nextButton = $("<button class=\"btn btn-icon page-next\"><span class=\"icon icon-next\"></span></button>");
                var lastButton = $("<button class=\"btn btn-icon page-last\"><span class=\"icon icon-last\"></span></button>");

                firstButton.appendTo(centerField);
                prevButton.appendTo(centerField);
                pageField.appendTo(centerField);
                nextButton.appendTo(centerField);
                lastButton.appendTo(centerField);
                centerField.appendTo(element);

                pageInput.val(parseInt(paginginfo.pagenum) + 1);

                firstButton.on('click', function () {
                    $grid.jqxGrid('gotopage', 0);
                    setTimeout(function() {firstButton.focus(); }, 50);
                });

                prevButton.off('click').on('click', function () {
                    $grid.jqxGrid('gotoprevpage');
                    setTimeout(function() {prevButton.focus(); }, 50);
                });

                nextButton.off('click').on('click', function () {
                    $grid.jqxGrid('gotonextpage');
                    setTimeout(function() {nextButton.focus(); }, 50);
                });

                lastButton.off('click').on('click', function () {
                    $grid.jqxGrid('gotopage', pagescount);
                    setTimeout(function() {lastButton.focus(); }, 50);
                });

                pageInput.off('change').on('change', function () {
                    goToPage($(this).val());
                });

                pageInput.off('keydown').on('keydown', function (event) {
                    if (event.keyCode === 13) {
                        goToPage(pageInput.val());
                    }
                });

                $grid.off('pagechanged').on('pagechanged', function () {
                    var datainfo = $grid.jqxGrid('getdatainformation');
                    var paginginfo = datainfo.paginginformation;
                    pageInput.val(parseInt(paginginfo.pagenum) + 1);
                });

                function goToPage(inputVal) {
                    var pageIndex = parseInt(inputVal) - 1;
                    $grid.jqxGrid('gotopage', pageIndex);
                }
            }

            function appendRight() {
                var perPageField = $("<div class='n-table-paging-right'></div>");
                var perPageCombo = $("<div id=\"" + gridId + "jqxPerPageCombo" + "\"></div>");
                var index = $grid.jqxGrid('pagesize');
                var selectedIndex = [10, 20, 30].indexOf(index);
                perPageCombo.jqxComboBox({
                    source: [10, 20, 30], width: 50, height: 24, selectedIndex: selectedIndex,
                    renderer: function (index, label, value) {
                        return "<span>" + label + "</span>";
                    }
                });

                perPageCombo.appendTo(perPageField);
                $("<span>Items per page</span>").appendTo(perPageField);

                perPageField.appendTo(element);

                perPageCombo.off('change').on('change', function (event) {
                    var args = event.args;
                    if (args) {
                        $grid.jqxGrid('pagesize', args.item.originalItem);
                    }
                });
            }

            return element;
        }
    };

    $(document).ready(function () {
        var headerColumns = $(".jqx-grid-column-header");
        for (var i = 0; i < headerColumns.length; i++) {
            headerColumns[i].onclick = handleColumnHeadSort;
        }
    });

    function handleColumnHeadSort() {
        var columnSortType = $(this).attr("aria-sort");
        if (columnSortType === "" || columnSortType === undefined) {
            return;
        }

        var columnHeadTextDiv = $(this).children("div").children("div")[0];
        var columnAlignType = $(columnHeadTextDiv).css("text-align");

        //add right padding if it is right alignment and is sorting.
        if (columnAlignType === "right" && (columnSortType === "ascending" || columnSortType === "descending")) {
            $(columnHeadTextDiv).css("padding-right", "18px");
        }
        else {
            $(columnHeadTextDiv).css("padding-right", "8px");
        }
    }

    function addChangedCol(row, editorId, gridId){
        var changedCol = $("#" + gridId + " #n-row-indicated-" + row).attr("changed-col");
        if (changedCol == undefined) {
            changedCol = '';
        }
        if(changedCol.indexOf(editorId) == -1){
            changedCol = changedCol + editorId;
            $("#" + gridId + " #n-row-indicated-" + row).attr("changed-col", changedCol);
        }
    }

    function removeChangedCol(row, editorId, gridId) {
        var changedCol = $("#" + gridId + " #n-row-indicated-" + row).attr("changed-col");
        if (changedCol == undefined) {
            changedCol = '';
        }
        changedCol = changedCol.replace(editorId, '');
        $("#" + gridId + " #n-row-indicated-" + row).attr("changed-col", changedCol);
        var currentChangedCol = $("#" + gridId + " #n-row-indicated-" + row).attr("changed-col");
        if(currentChangedCol !== undefined){
            if (currentChangedCol.replace('editorId', '') == '') {
                $("#" + gridId + " #n-row-indicated-" + row + " > span").removeClass("icon-edited-white");
            }
        }
    }

    function checkIndicatedByCell(editor) {
        var gridId = editor.parent().attr("id").replace("contenttable", "");
        var tmpColumnName = editor.attr("id").replace("customeditor" + gridId, "");
        var columnName = tmpColumnName.substring(0, tmpColumnName.indexOf("_"));
        var isIndicatedByCell = $("#" + gridId).jqxGrid('getcolumnproperty', columnName, 'indicator');
        if (isIndicatedByCell == undefined) {
            isIndicatedByCell = false;
        }
        return isIndicatedByCell;
    }

    //Hide the up and down button in scroll bar for jqx table
    if ($.jqx !== undefined) {
        $.jqx.init({"scrollBarButtonsVisibility": "hidden"});
    }

}(jQuery);
//For debug, the file name is: inputfield.js
/**
 * Created by jilian on 8/12/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $(document).ready(function () {
        $(".input-required input").on("keyup", function (event) {
            var inputValue = event.target.value;
            var mandatoryElement = $(event.target).next(".form-control-feedback").find(".icon");

            if (inputValue.length > 0) {
                mandatoryElement.removeClass("icon-mandatory");
            }
            else {
                mandatoryElement.addClass("icon-mandatory");
            }
        });

        $(".n-inputfield-control-icon").on("click", function (event) {
            var prev = $(this).prev();
            if (prev.hasClass("n-inputfield")) {
                prev.attr("placeholder", "");
                prev.val("");
            }
        });
    });

}(jQuery);
//For debug, the file name is: jquery.mask.js
/**
 * jquery.mask.js
 * @version: v1.11.4
 * @author: Igor Escobar
 *
 * Created by Igor Escobar on 2012-03-10. Please report any bug at http://blog.igorescobar.com
 *
 * Copyright (c) 2012 Igor Escobar http://blog.igorescobar.com
 *
 * The MIT License (http://www.opensource.org/licenses/mit-license.php)
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

/* jshint laxbreak: true */
/* global define, jQuery, Zepto */

// UMD (Universal Module Definition) patterns for JavaScript modules that work everywhere.
// https://github.com/umdjs/umd/blob/master/jqueryPluginCommonjs.js
(function (factory) {

    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery || Zepto);
    }

}(function ($) {
    'use strict';
    var Mask = function (el, mask, options) {
        el = $(el);

        var jMask = this, oldValue = el.val(), regexMask;

        mask = typeof mask === 'function' ? mask(el.val(), undefined, el,  options) : mask;

        var p = {
            invalid: [],
            getCaret: function () {
                try {
                    var sel,
                        pos = 0,
                        ctrl = el.get(0),
                        dSel = document.selection,
                        cSelStart = ctrl.selectionStart;

                    // IE Support
                    if (dSel && navigator.appVersion.indexOf('MSIE 10') === -1) {
                        sel = dSel.createRange();
                        sel.moveStart('character', el.is('input') ? -el.val().length : -el.text().length);
                        pos = sel.text.length;
                    }
                    // Firefox support
                    else if (cSelStart || cSelStart === '0') {
                        pos = cSelStart;
                    }

                    return pos;
                } catch (e) {}
            },
            setCaret: function(pos) {
                try {
                    if (el.is(':focus')) {
                        var range, ctrl = el.get(0);

                        if (ctrl.setSelectionRange) {
                            ctrl.setSelectionRange(pos,pos);
                        } else if (ctrl.createTextRange) {
                            range = ctrl.createTextRange();
                            range.collapse(true);
                            range.moveEnd('character', pos);
                            range.moveStart('character', pos);
                            range.select();
                        }
                    }
                } catch (e) {}
            },
            events: function() {
                el
                    // SPEC added keydown mask to prevent a lot of illegal characters to show up when key kept down
                    // Still it shows the pressed key and erases it in key up if char is illegal - that could be
                    // also blocked to get the user experience better - also some message/tooltip should be
                    // shown what is the correct input format.
                .on('keydown.mask', p.behaviour)
                .on('keyup.mask', p.behaviour)
                .on('paste.mask drop.mask', function() {
                    setTimeout(function() {
                        el.keydown().keyup();
                    }, 100);
                })
                .on('change.mask', function(){
                    el.data('changed', true);
                })
                .on('blur.mask', function(){
                    if (oldValue !== el.val() && !el.data('changed')) {
                        el.triggerHandler('change');
                    }
                    el.data('changed', false);
                })
                // it's very important that this callback remains in this position
                // otherwhise oldValue it's going to work buggy
                .on('keydown.mask, blur.mask', function() {
                    oldValue = el.val();
                })
                // select all text on focus
                .on('focus.mask', function (e) {
                    if (options.selectOnFocus === true) {
                        $(e.target).select();
                    }
                })
                // clear the value if it not complete the mask
                .on('focusout.mask', function() {
                    if (options.clearIfNotMatch && !regexMask.test(p.val())) {
                       p.val('');
                   }
                });
            },
            getRegexMask: function() {
                var maskChunks = [], translation, pattern, optional, recursive, oRecursive, r;

                for (var i = 0; i < mask.length; i++) {
                    translation = jMask.translation[mask.charAt(i)];

                    if (translation) {

                        pattern = translation.pattern.toString().replace(/.{1}$|^.{1}/g, '');
                        optional = translation.optional;
                        recursive = translation.recursive;

                        if (recursive) {
                            maskChunks.push(mask.charAt(i));
                            oRecursive = {digit: mask.charAt(i), pattern: pattern};
                        } else {
                            maskChunks.push(!optional && !recursive ? pattern : (pattern + '?'));
                        }

                    } else {
                        maskChunks.push(mask.charAt(i).replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
                    }
                }

                r = maskChunks.join('');

                if (oRecursive) {
                    r = r.replace(new RegExp('(' + oRecursive.digit + '(.*' + oRecursive.digit + ')?)'), '($1)?')
                         .replace(new RegExp(oRecursive.digit, 'g'), oRecursive.pattern);
                }

                return new RegExp(r);
            },
            destroyEvents: function() {
                el.off(['keydown', 'keyup', 'paste', 'drop', 'blur', 'focusout', ''].join('.mask '));
            },
            val: function(v) {
                var isInput = el.is('input'),
                    method = isInput ? 'val' : 'text',
                    r;

                if (arguments.length > 0) {
                    if (el[method]() !== v) {
                        el[method](v);
                    }
                    r = el;
                } else {
                    r = el[method]();
                }

                return r;
            },
            getMCharsBeforeCount: function(index, onCleanVal) {
                for (var count = 0, i = 0, maskL = mask.length; i < maskL && i < index; i++) {
                    if (!jMask.translation[mask.charAt(i)]) {
                        index = onCleanVal ? index + 1 : index;
                        count++;
                    }
                }
                return count;
            },
            caretPos: function (originalCaretPos, oldLength, newLength, maskDif) {
                var translation = jMask.translation[mask.charAt(Math.min(originalCaretPos - 1, mask.length - 1))];

                return !translation ? p.caretPos(originalCaretPos + 1, oldLength, newLength, maskDif)
                                    : Math.min(originalCaretPos + newLength - oldLength - maskDif, newLength);
            },
            behaviour: function(e) {
                e = e || window.event;
                p.invalid = [];
                var keyCode = e.keyCode || e.which;
                if ($.inArray(keyCode, jMask.byPassKeys) === -1) {

                    var caretPos = p.getCaret(),
                        currVal = p.val(),
                        currValL = currVal.length,
                        changeCaret = caretPos < currValL,
                        newVal = p.getMasked(),
                        newValL = newVal.length,
                        maskDif = p.getMCharsBeforeCount(newValL - 1) - p.getMCharsBeforeCount(currValL - 1);

                    p.val(newVal);

                    // change caret but avoid CTRL+A
                    if (changeCaret && !(keyCode === 65 && e.ctrlKey)) {
                        // Avoid adjusting caret on backspace or delete
                        if (!(keyCode === 8 || keyCode === 46)) {
                            caretPos = p.caretPos(caretPos, currValL, newValL, maskDif);
                        }
                        p.setCaret(caretPos);
                    }

                    return p.callbacks(e);
                }
            },
            getMasked: function(skipMaskChars) {
                var buf = [],
                    value = p.val(),
                    m = 0, maskLen = mask.length,
                    v = 0, valLen = value.length,
                    offset = 1, addMethod = 'push',
                    resetPos = -1,
                    lastMaskChar,
                    check;

                if (options.reverse) {
                    addMethod = 'unshift';
                    offset = -1;
                    lastMaskChar = 0;
                    m = maskLen - 1;
                    v = valLen - 1;
                    check = function () {
                        return m > -1 && v > -1;
                    };
                } else {
                    lastMaskChar = maskLen - 1;
                    check = function () {
                        return m < maskLen && v < valLen;
                    };
                }

                while (check()) {
                    var maskDigit = mask.charAt(m),
                        valDigit = value.charAt(v),
                        translation = jMask.translation[maskDigit];

                    if (translation) {
                        if (valDigit.match(translation.pattern)) {
                            buf[addMethod](valDigit);
                             if (translation.recursive) {
                                if (resetPos === -1) {
                                    resetPos = m;
                                } else if (m === lastMaskChar) {
                                    m = resetPos - offset;
                                }

                                if (lastMaskChar === resetPos) {
                                    m -= offset;
                                }
                            }
                            m += offset;
                        } else if (translation.optional) {
                            m += offset;
                            v -= offset;
                        } else if (translation.fallback) {
                            buf[addMethod](translation.fallback);
                            m += offset;
                            v -= offset;
                        } else {
                          p.invalid.push({p: v, v: valDigit, e: translation.pattern});
                        }
                        v += offset;
                    } else {
                        if (!skipMaskChars) {
                            buf[addMethod](maskDigit);
                        }

                        if (valDigit === maskDigit) {
                            v += offset;
                        }

                        m += offset;
                    }
                }

                var lastMaskCharDigit = mask.charAt(lastMaskChar);
                if (maskLen === valLen + 1 && !jMask.translation[lastMaskCharDigit]) {
                    buf.push(lastMaskCharDigit);
                }

                return buf.join('');
            },
            callbacks: function (e) {
                var val = p.val(),
                    changed = val !== oldValue,
                    defaultArgs = [val, e, el, options],
                    callback = function(name, criteria, args) {
                        if (typeof options[name] === 'function' && criteria) {
                            options[name].apply(this, args);
                        }
                    };

                callback('onChange', changed === true, defaultArgs);
                callback('onKeyPress', changed === true, defaultArgs);
                callback('onComplete', val.length === mask.length, defaultArgs);
                callback('onInvalid', p.invalid.length > 0, [val, e, el, p.invalid, options]);
            }
        };


        // public methods
        jMask.mask = mask;
        jMask.options = options;
        jMask.remove = function() {
            var caret = p.getCaret();
            p.destroyEvents();
            p.val(jMask.getCleanVal());
            p.setCaret(caret - p.getMCharsBeforeCount(caret));
            return el;
        };

        // get value without mask
        jMask.getCleanVal = function() {
           return p.getMasked(true);
        };

       jMask.init = function(onlyMask) {
            onlyMask = onlyMask || false;
            options = options || {};

            jMask.byPassKeys = $.jMaskGlobals.byPassKeys;
            jMask.translation = $.jMaskGlobals.translation;

            jMask.translation = $.extend({}, jMask.translation, options.translation);
            jMask = $.extend(true, {}, jMask, options);

            regexMask = p.getRegexMask();

            if (onlyMask === false) {

                if (options.placeholder) {
                    el.attr('placeholder' , options.placeholder);
                }

                // autocomplete needs to be off. we can't intercept events
                // the browser doesn't  fire any kind of event when something is
                // selected in a autocomplete list so we can't sanitize it.
                el.attr('autocomplete', 'off');
                p.destroyEvents();
                p.events();

                var caret = p.getCaret();
                p.val(p.getMasked());
                p.setCaret(caret + p.getMCharsBeforeCount(caret, true));

            } else {
                p.events();
                p.val(p.getMasked());
            }
        };

        jMask.init(!el.is('input'));
    };

    $.maskWatchers = {};
    var HTMLAttributes = function () {
            var input = $(this),
                options = {},
                prefix = 'data-mask-',
                mask = input.attr('data-mask');

            if (input.attr(prefix + 'reverse')) {
                options.reverse = true;
            }

            if (input.attr(prefix + 'clearifnotmatch')) {
                options.clearIfNotMatch = true;
            }

            if (input.attr(prefix + 'selectonfocus') === 'true') {
               options.selectOnFocus = true;
            }

            if (notSameMaskObject(input, mask, options)) {
                return input.data('mask', new Mask(this, mask, options));
            }
        },
        notSameMaskObject = function(field, mask, options) {
            options = options || {};
            var maskObject = $(field).data('mask'),
                stringify = JSON.stringify,
                value = $(field).val() || $(field).text();
            try {
                if (typeof mask === 'function') {
                    mask = mask(value);
                }
                return typeof maskObject !== 'object' || stringify(maskObject.options) !== stringify(options) || maskObject.mask !== mask;
            } catch (e) {}
        };


    $.fn.mask = function(mask, options) {
        options = options || {};
        var selector = this.selector,
            globals = $.jMaskGlobals,
            interval = $.jMaskGlobals.watchInterval,
            maskFunction = function() {
                if (notSameMaskObject(this, mask, options)) {
                    return $(this).data('mask', new Mask(this, mask, options));
                }
            };

        $(this).each(maskFunction);

        if (selector && selector !== '' && globals.watchInputs) {
            clearInterval($.maskWatchers[selector]);
            $.maskWatchers[selector] = setInterval(function(){
                $(document).find(selector).each(maskFunction);
            }, interval);
        }
        return this;
    };

    $.fn.unmask = function() {
        clearInterval($.maskWatchers[this.selector]);
        delete $.maskWatchers[this.selector];
        return this.each(function() {
            var dataMask = $(this).data('mask');
            if (dataMask) {
                dataMask.remove().removeData('mask');
            }
        });
    };

    $.fn.cleanVal = function() {
        return this.data('mask').getCleanVal();
    };

    $.applyDataMask = function(selector) {
        selector = selector || $.jMaskGlobals.maskElements;
        var $selector = (selector instanceof $) ? selector : $(selector);
        $selector.filter($.jMaskGlobals.dataMaskAttr).each(HTMLAttributes);
    };

    var globals = {
        maskElements: 'input,td,span,div',
        dataMaskAttr: '*[data-mask]',
        dataMask: true,
        watchInterval: 300,
        watchInputs: true,
        watchDataMask: false,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            '0': {pattern: /\d/},
            '9': {pattern: /\d/, optional: true},
            '#': {pattern: /\d/, recursive: true},
            'A': {pattern: /[a-zA-Z0-9]/},
            'S': {pattern: /[a-zA-Z]/}
        }
    };

    $.jMaskGlobals = $.jMaskGlobals || {};
    globals = $.jMaskGlobals = $.extend(true, {}, globals, $.jMaskGlobals);

    // looking for inputs with data-mask attribute
    if (globals.dataMask) { $.applyDataMask(); }


    //remove this for unit test delay issue
    //setInterval(function(){
    //    if ($.jMaskGlobals.watchDataMask) { $.applyDataMask(); }
    //}, globals.watchInterval);

}));

//For debug, the file name is: keyboard-support.js
/**
 * Created by jilian on 12/3/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function($) {
    'use strict';

    var ENTER_KEY = 13;
    var SPACE_BAR_KEY = 32;
    var LEFT_KEY = 37;
    var RIGHT_KEY = 39;
    var UP_KEY = 38;
    var DOWN_KEY = 40;
    var ESC_KEY = 27;
    var TAB_KEY = 9;

    /** add keyboard event for pull down && combo box*/
    $(document).on('keydown', '.dropdown-menu', keyboardHandler);

    /** add keyboard event for panel unfloder/floder */
    $(document).on('keydown', '.panel-heading', { notSupport: [UP_KEY, DOWN_KEY] }, keyboardHandler)
        .on('keydown', '.panel-arrow', { notSupport: [UP_KEY, DOWN_KEY] }, keyboardHandler)
        .on('keydown', '.icon-close', { notSupport: [UP_KEY, DOWN_KEY] }, keyboardHandler)
        .on('keydown', '.n-close', { notSupport: [UP_KEY, DOWN_KEY] }, keyboardHandler);

    /** add keyboard event for tree*/
    $(document).on('keydown', '.tree', treeKeyboardHandler);

    /** add keyboard event for list*/
    $(document).on('keydown', '.n-list-group', keyboardHandler);

    /** add keyboard event for flyout menu */
    $(document).on('keydown', '.n-flyout-menu', keyboardHandler);

    /** add keyboard event for balloon and dialog */
    $(document).on('keydown', 'a[data-toggle=popover]', { notSupport: [UP_KEY, DOWN_KEY] }, balloonKeyboardHandler)
        .on('keydown', 'a[data-toggle=modal]', { notSupport: [UP_KEY, DOWN_KEY] }, balloonKeyboardHandler);

    /** add keyboard event for tabbed pane */
    $(document).on('keydown', '.nav-tabs li', tabPaneKeyboardHandler);

    /** add keyboard event for table **/
    $(document).on('keydown.wf.keyboard', '.n-table tbody', tableKeyboardHandler)
        .on('focusin.wf.keyboard', '.n-table tbody', tableFocusinHandler);

    /** add keyboard event for calendar **/
    $(document).on('keydown.wf.keyboard', '.datepicker-calendar-days', calendarDatePickerKeyboardHandler)
        .on('focusin.wf.keyboard', '.datepicker-calendar-days', calendarDatePickerFocusinHandler);

    function balloonKeyboardHandler(e) {
        if(e.which === ENTER_KEY){
            $(e.target).trigger('click');
        }
        keyboardHandler(e);
    }

    function tabPaneKeyboardHandler(e) {
        var supportKeys = [TAB_KEY, LEFT_KEY, SPACE_BAR_KEY, RIGHT_KEY, ENTER_KEY];

        if (supportKeys.indexOf(e.which) === -1) {
            return;
        }

        if (e.which !== TAB_KEY) {
            e.preventDefault();
            e.stopPropagation();
        }

        switch (e.which) {
            case ENTER_KEY:
            case SPACE_BAR_KEY:
                if (!$(e.target).closest('li').hasClass('disabled')) {
                    $(e.target).tab('show');
                }
                break;
            case LEFT_KEY://focus on previous tab
            case RIGHT_KEY://foucs on next tab
                var parent = getRootNode($(e.target));
                var nextItem = getNextItem(parent, e);
                nextItem.trigger('focus');
                break;
        }
    }

    function treeKeyboardHandler(e) {
        var supportKeys = [TAB_KEY, LEFT_KEY, SPACE_BAR_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY];

        if (supportKeys.indexOf(e.which) === -1) {
            return;
        }

        switch (e.which) {
            case SPACE_BAR_KEY:
                var href = $(e.target).attr("href");
                if (href !== "" && href !== "#") {
                    var target = $(e.target).attr("target");
                    var targetParent = window.parent.document.getElementById(target);
                    var targetSelf = document.getElementById(target);
                    if (targetParent !== null) {
                        targetParent.src = href;
                    }
                    else if (targetSelf !== null) {
                        targetSelf.src = href;
                    }
                    else {
                        location.href = href;
                    }
                }
                break;

            case LEFT_KEY:
                var iconCaret = $(e.target).find(".icon-caret");
                if (iconCaret.length > 0) {
                    if ($(e.target).find('.glyphicon-folder-open').length) {
                        $(iconCaret).trigger("click");
                    }
                }
                break;
            case RIGHT_KEY:
                iconCaret = $(e.target).find(".icon-caret");
                if (iconCaret.length > 0) {
                    if ($(e.target).find('.glyphicon-folder-close').length) {
                        $(iconCaret).trigger("click");
                    }
                }
                break;
        }

        keyboardHandler(e);
    }

    function tableFocusinHandler(e) {
        var current = $(e.target);
        if (current.is('td') && current.index() === 0) {
            initTableSelected(e, 'n-cell-selected');
        }
    }

    function tableKeyboardHandler(e) {
        var supportKeys = [TAB_KEY, SPACE_BAR_KEY, ENTER_KEY, LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY];
        var selectedClassName = 'n-cell-selected';

        if (supportKeys.indexOf(e.which) === -1) {
            return;
        }

        initTableSelected(e, selectedClassName);

        switch (e.which) {
            case SPACE_BAR_KEY:
            case ENTER_KEY:
                handleTableSpaceAndEntryKeyboardAction(e);
                break;
            case LEFT_KEY:
            case RIGHT_KEY:
            case UP_KEY:
            case DOWN_KEY:
                handleTableDirectionKeyAction(e, selectedClassName);
                break;
            case TAB_KEY:
                handleTableTabKeyboardAction(e, selectedClassName);
                break;
        }
    }

    function initTableSelected(e, className) {
        var current = $(e.target);

        // Remove the selected class for all items in table
        current.closest('table').find('td').each(function () {
            $(this).removeClass(className);
        });

        // Only keep the selected class for current item
        if (current.is('td')) {
            if (current.closest('table').hasClass('n-table-hover')) {
                current.closest('tr').find('td').each(function () {
                    $(this).addClass(className);
                });
            } else {
                current.addClass(className);
            }
        }
    }

    function handleTableSpaceAndEntryKeyboardAction(e) {
        var current = $(e.target);
        if (current.is('td')) {
            // If the current focus is on table element, prevent the default key action.
            e.preventDefault();
            $(e.target).trigger('click');
            if (current.find('input').length > 0) {
                // If the focused element is input filed or checkbox.
                current.find('input').focus();

                // If the focused element is dropdown list.
                if (current.find('.selectlist').length > 0) {
                    current.find('button').trigger("click");
                }
            }
        }
    }

    function handleTableDirectionKeyAction(e, className) {
        var current = $(e.target);

        // If the current focus is on table element, prevent the default key action.
        if (current.is('td')) {
            e.preventDefault();
        } else {
            if (current.attr('type') !== 'text') {
                // dropup the possible list element.
                dropupListInTable(current);
                current = current.closest('td');
            }
        }

        var target = getNextTableItem(current, e);

        // Remove the selected class on current element and add selected class to target element.
        if (target.length > 0) {
            if (!current.closest('table').hasClass('n-table-hover')) {
                current.removeClass(className);
                target.addClass(className);
            } else {
                current.closest('tr').find('td').each(function () {
                    $(this).removeClass(className);
                });
                target.closest('tr').find('td').each(function () {
                    $(this).addClass(className);
                });
            }
            target.attr('tabindex', 0);
            target.trigger('focus');
        }
    }

    function handleTableTabKeyboardAction(e, className) {
        var current = $(e.target);
        if (current.closest('td').index() === 0
            && current.closest('tr').index() === 0) {
            if (!e.shiftKey) {
                handleTableDirectionKeyAction(e, className);
            }
        } else if (current.closest('td').next().length === 0
            && current.closest('tr').next().length === 0) {
            if (e.shiftKey) {
                handleTableDirectionKeyAction(e, className);
            }
        } else {
            handleTableDirectionKeyAction(e, className);
        }
    }

    function getNextTableItem(current, e) {
        var items = getAllVisibleSubItems(current.parent());
        var index = items.index(current);
        switch (e.which) {
            case TAB_KEY:
                if(e.shiftKey){
                    if (index > 0) {
                        index--;
                    } else {
                        index = items.length - 1;
                        var prev = current.parent().prev();
                        if (isDrilldown(current)) {
                            prev = prev.prev();
                        }
                        items = getAllVisibleSubItems(prev);
                    }
                }else{
                    if (index < items.length - 1) {
                        index++;
                    } else {
                        index = 0;
                        var next = current.parent().next();
                        if (isDrilldown(current)) {
                            next = next.next();
                        }
                        items = getAllVisibleSubItems(next);
                    }
                }
                break;
            case LEFT_KEY:
                index = index > 0 ? index - 1 : 0;
                break;
            case RIGHT_KEY:
                index = index < items.length - 1 ? index + 1 : items.length - 1;
                break;
            case UP_KEY:
                var prev = current.parent().prev();
                if (isDrilldown(current)) {
                    prev = prev.prev();
                }
                items = prev.length > 0 ? getAllVisibleSubItems(prev) : items;
                break;
            case DOWN_KEY:
                var next = current.parent().next();
                if (isDrilldown(current)) {
                    next = next.next();
                }
                items = next.length > 0 ? getAllVisibleSubItems(next) : items;
                break;
            default:
                break;
        }
        return items.eq(index);
    }

    function isDrilldown(current) {
        return current.closest('table').hasClass('n-drilldown-table');
    }

    /**
     * Dropup the list if the element is a dropdown list.
     *
     * @param current - the current focused element.
     */
    function dropupListInTable(current) {
        if (current.closest('div').hasClass('selectlist')) {
            if (current.closest('div').find('button').attr('aria-expanded') === 'true') {
                current.closest('div').find('button').trigger('click');
            }
        }
    }

    function calendarDatePickerFocusinHandler(e) {
        var current = $(e.target).closest('td');
        if (current.index() === 0) {
            initDatePickerSelected(e, 'selected');
        }
    }

    function calendarDatePickerKeyboardHandler(e) {
        var supportKeys = [TAB_KEY, SPACE_BAR_KEY, ENTER_KEY, LEFT_KEY, RIGHT_KEY, UP_KEY, DOWN_KEY];
        var selectedClassName = 'selected';

        if (supportKeys.indexOf(e.which) === -1) {
            return;
        }
        initDatePickerSelected(e, selectedClassName);

        switch (e.which) {
            case LEFT_KEY:
            case RIGHT_KEY:
            case UP_KEY:
            case DOWN_KEY:
                handleTableDirectionKeyAction(e, selectedClassName);
                break;
            case TAB_KEY:
                handleTableTabKeyboardAction(e, selectedClassName);
                break;
            case SPACE_BAR_KEY:
            case ENTER_KEY:
                $(e.target).find('button').trigger('click');
                break;
        }
    }

    function initDatePickerSelected(e, className) {
        var current = $(e.target);
        current.closest('table').find('td').each(function () {
            $(this).removeClass(className);
        });
        current.closest('td').addClass(className);
    }

    function keyboardHandler(e) {
        var supportKeys = [TAB_KEY, SPACE_BAR_KEY, UP_KEY, DOWN_KEY];

        if (supportKeys.indexOf(e.which) === -1) {
            return;
        }

        if (e.which !== TAB_KEY) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (e.data && e.data.notSupport) {
            if (e.data.notSupport.indexOf(e.which) !== -1) {
                return;
            }
        }

        if (e.which === SPACE_BAR_KEY) {
            $(e.target).trigger('click');
            return;
        }

        var parent = getRootNode($(e.target));
        var nextItem = getNextItem(parent, e);

        //Handle focus status
        switch (e.which) {
            case UP_KEY:
            case DOWN_KEY:
                nextItem.trigger('focus');
                break;
            default:
                break;
        }

        //Handle scrollbar status
        if (isScrollNeeded(parent, nextItem)) {
            $(parent).mCustomScrollbar('scrollTo', nextItem, { scrollInertia: 0 });
        }
    }

    function getNextItem(parent, e) {
        var items = getAllVisibleSubItems(parent);
        var indx = items.index(e.target);
        switch (e.which) {
            case TAB_KEY: // Tab or Shift+tab
                indx = (e.shiftKey ? (indx > 0 ? indx - 1 : 0) : (indx < items.length - 1 ? indx + 1 : items.length - 1));
                break;
            case LEFT_KEY:
            case UP_KEY:
                indx = indx > 0 ? indx - 1 : 0;
                break;
            case RIGHT_KEY:
            case DOWN_KEY:
                indx = indx < items.length - 1 ? indx + 1 : items.length - 1;
                break;
            default:
                break;
        }
        return items.eq(indx);
    }

    function isScrollNeeded(parent, item) {
        if ($(parent).find('.mCSB_container').length === 0) {
            return;
        }

        var parentTop = $(parent).offset().top;
        var itemTop = $(item).offset().top;
        var parentHeight = $(parent).get(0).clientHeight;
        var itemHeight = item.get(0).offsetHeight;
        var topDiff = itemTop - parentTop;
        var bottomDiff = topDiff + itemHeight;
        return (topDiff < 10 || bottomDiff > parentHeight - 10);
    }

    function getAllVisibleSubItems(target) {
        if ($(target).hasClass('n-list-group')) {
            return target.find('li');
        }

        if ($(target).hasClass('n-flyout-menu')) {
            return target.find('li a');
        }

        if ($(target).hasClass('nav-tabs')){
            return target.find('li a');
        }

        if ($(target).hasClass('dropdown-menu')) {
            return target.find('li a');
        }
        if ($(target).hasClass('tree')) {
            var itemArr = [];
            var items = target.find('li:not(.hide) a');
            for (var i = 0; i <= items.length - 1; i++) {
                if (!$(items[i]).closest('ul').hasClass('hidden')) {
                    itemArr.push(items[i]);
                }
            }
            return $(itemArr);
        }
        if ($(target).is('tr')) {
            return target.find('td');
        }

        return target.find('li');
    }

    function getRootNode(target) {
        if (target.hasClass('n-list-group-item')) {
            return target.closest('ul');
        }

        if (target.hasClass('tree-branch-name') || target.hasClass('tree-item-name')) {
            return target.closest('ul.tree');
        }

        return target.closest('ul');
    }
}(jQuery);
//For debug, the file name is: list-group.js
/*
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $(document).ready(function () {
        var listGroup = $("ul.n-list-group");
        $.each(listGroup, function () {
            if (!$(this).hasClass("disabled")) {
                $(this).find(".n-list-group-item").attr("tabindex", 0);
                $(this).find(".n-list-group-item").bind("click", function () {
                    $(this).parents(".n-list-group").find(".n-list-group-item").removeClass("selected");
                    $(this).addClass("selected");
                });
            }
        });

        var listScrollGroup = $("ul.n-list-group-scroll");
        $.each(listScrollGroup, function () {

            if ($(this).hasClass("disabled")) {

                $(this).nScrollbar({
                    alwaysShowScrollbar: 2,
                    theme: "disabled",
                    mouseWheel: {enable: false}
                });

                $(this).nScrollbar("disable");
            }
            else {
                $(this).nScrollbar();
            }
        });
    });
}(jQuery);
//For debug, the file name is: login.js
/**
 * Created by linaqiu on 2015/7/28.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    var $username = $('#applicationLoginUsername'),
        $password = $('#applicationLoginPassword'),
        $login = $('#applicationLoginButton');

    $('#applicationLoginUsername,#applicationLoginPassword').on('keyup change', function (e) {
        if ($username.val() && $password.val()) {
            $login.prop('disabled', false);
        }
        else {
            $login.prop('disabled', true);
        }
    });
    $('#applicationLoginUsername').on('keyup change', function (e) {
        if ($username.val()) {
            $username.next().children('span').removeClass('icon-mandatory');
        }
        else {
            $username.next().children('span').addClass('icon-mandatory');
        }
    });
    $('#applicationLoginPassword').on('keyup change', function (e) {
        if ($password.val()) {
            $password.next().children('span').removeClass('icon-mandatory');
        }
        else {
            $password.next().children('span').addClass('icon-mandatory');
        }
    });

    $('.n-login-forget-password').on('click', ">a", function () {
        $(this).removeClass("n-link-visited").addClass("n-link-visited");
    });
}(jQuery);
//For debug, the file name is: navbar.js
/**
 * Created by linaqiu on 2015/7/1.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    var $n_banner_links_collapse = $(".n-banner-links-collapse");
    var $n_banner_tabs = $(".n-banner-tabs");
    var KEY = {up: 38, down: 40, right: 39, left: 37};

    /*---------------------- bind actions ----------------------*/
    $n_banner_tabs.on("mouseover", ".n-dropdown-menu-item-has-child", function () {
        showSubMenu($(this));
    });

    $n_banner_tabs.on("mouseleave", ".n-dropdown-menu-item-has-child", function () {
        hideSubMenu($(this).children(".n-dropdown-sub-menu"));
    });

    // add key event to show or close sub menu
    $n_banner_tabs.on("keydown", ".n-dropdown-menu-item-has-child", function (event) {
        // click right arrow, open sub menu;
        if (event.keyCode === KEY.right) {
            var $subMenu = $(this).children(".n-dropdown-sub-menu");
            if (!$subMenu.hasClass("open")) {
                showSubMenu($(this));
                $(this).blur();
                $subMenu.children("li").first().children("a").focus();
            }
        }
    });

    $n_banner_tabs.on("click", ".n-banner-dropdown-toggle", function () {
        var $n_dropdown_sub_menu_open = $n_dropdown_sub_menu_open || $(".n-dropdown-sub-menu.open");
        if ($n_dropdown_sub_menu_open.length !== 0) {
            $n_dropdown_sub_menu_open.removeClass("open");
        }
    });

    // add key event to move focus of sub menu item
    $n_banner_tabs.on("keydown", ".n-dropdown-sub-menu>li", function (event) {
        event.stopPropagation();
        // click up arrow
        if (event.keyCode === KEY.up) {
            setSubMenuItemFocus($(this), true);
        }
        // click down arrow
        else if (event.keyCode === KEY.down) {
            setSubMenuItemFocus($(this), false);
        }
        // click left arrow, close sub menu;
        else if (event.keyCode === KEY.left) {
            var $subMenu = $(this).parent(".n-dropdown-sub-menu");
            hideSubMenu($subMenu);
            $subMenu.prev("a").focus();
        }
    });

    $n_banner_tabs.on("focus", ">li>a", function () {
        var $this = $(this);
        var parentLi = $this.closest("li");
        parentLi.siblings("li").removeClass("active");
        parentLi.addClass("active");
        var $bar_grayToBlue = parentLi.closest(".n-banner-tabs").siblings(".n-banner-2nd-gray-to-blue");
        if ($bar_grayToBlue.length > 0) {
            if (parentLi.hasClass("rightmost-tab")) {
                $bar_grayToBlue.addClass("active");
            }
            else {
                $bar_grayToBlue.removeClass("active");
            }
        }
    });

    // hide all sub menu
    $(document).on('click.bs.dropdown.data-api', function () {
        var $n_dropdown_sub_menu_open = $n_dropdown_sub_menu_open || $(".n-dropdown-sub-menu.open");
        if ($n_dropdown_sub_menu_open.length !== 0) {
            $n_dropdown_sub_menu_open.removeClass("open");
        }
    });

    /*---------------------- functions ----------------------*/

    var showSubMenu = function ($parent) {
        var parentMenuWidth = $parent.parent("ul").innerWidth();
        var $subMenu = $parent.children(".n-dropdown-sub-menu");
        if (parentMenuWidth < ($parent.closest(".n-banner").width() - $parent.offset().left)) {
            $subMenu.css("left", parentMenuWidth + "px");
        } else {
            $subMenu.css("left", "-" + $subMenu.innerWidth() + "px");
        }

        $subMenu.addClass("open");
    };

    var hideSubMenu = function ($subMenu) {
        $subMenu.css("left", "auto");
        $subMenu.removeClass("open");
    };

    var setSubMenuItemFocus = function ($item, isUpMove) {
        $item.siblings("li").children("a").blur();
        var prevItem = isUpMove ? $item.prev("li") : $item.next("li");
        if (prevItem.length === 0) {
            prevItem = isUpMove ? $item.parent().children("li").last() : $item.parent().children("li").first();
        }
        prevItem.children("a").focus();
    };

    /*------------------update the info of 3rd nav-----------------*/
    $n_banner_tabs.on('focus', "li", function () {
        var div = $(this).find("div");
        if (!div.hasClass("n-banner-overflow-control")) {
            $(".n-banner-3rd-filler-gray").hide();
            $(".n-banner-3rd").find(".n_banner_3rd_subItem").hide();
        }

        if ($(this).hasClass("n-banner-3Link")) {
            var id = $(this).find("a").data("item");
            $(".n-banner-3rd-filler-gray").show();
            $(".n-banner-3rd").show();
            $("#" + id).show();
        }
    });

    $(".n_banner_3rd_subItem").on("focus", ">li>a", function () {
        var $this = $(this);
        var parentLi = $this.closest("li");
        parentLi.siblings("li").removeClass("active");
        parentLi.addClass("active");
    });

    //collapsed banner toggle
    $n_banner_links_collapse.on("mouseover", ".n-banner-links-collapse-dropdown-menu > .dropdown", function () {
        showCollapsedSubMenu($(this));
    });

    $n_banner_links_collapse.on("mouseleave", ".n-banner-links-collapse-dropdown-menu > .dropdown", function () {
        hideCollapsedSubMenu($(this));
    });

    var showCollapsedSubMenu = function ($parent) {
        var parentMenuWidth = $parent.parent("ul").innerWidth();
        var $subMenu = $parent.children(".n-collapse-dropdown-sub-menu");
        if (parentMenuWidth < ($parent.closest(".n-banner").width() - $parent.offset().left)) {
            $subMenu.css("left", parentMenuWidth + "px");
        } else {
            var subMenuPos = $subMenu.innerWidth() + 2;
            $subMenu.css("left", "-" + subMenuPos + "px");
        }

        $parent.addClass("open");
    };

    var hideCollapsedSubMenu = function ($parent) {
        $parent.children(".n-collapse-dropdown-sub-menu").css("left", "auto");
        $parent.removeClass("open");
    };
}(jQuery);



//For debug, the file name is: panels.js
/**
 * Created by lonlin on 10/22/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $.fn.extend({
        slideToggleVertical: function (options) {
            var $slideBar = $(this);
            var currentImg = $slideBar.find(".icon");
            var speed = 500;
            var isOpen = true;
            var panelBody = $slideBar.parent().find(".panel-body")
            speed = options && options.speed;
            isOpen = options && options.isOpen;
            if (isOpen) {
                $(panelBody).css("display", "block");
                currentImg.removeClass('icon-right').addClass("icon-down");
            }
            else {
                $(panelBody).css("display", "none");
                currentImg.removeClass('icon-down').addClass("icon-right");
            }
            $slideBar.click(function () {
                panelBody.slideToggle(speed, function () {
                    panelBody.is(":visible") ?
                        currentImg.removeClass('icon-right').addClass("icon-down")
                        : currentImg.removeClass('icon-down').addClass("icon-right");
                })
            })
        },
        slideToggleHorizontal: function (options) {
            var isLeftOpen = options && options.isLeftOpen;
            var leftWidth = options && options.leftWidth;
            var $span = $(this);
            var parentLeft = $span.parent();
            var parentRight = parentLeft.parent().find(".panel-right");
            var panelBody = parentLeft.find(".panel .panel-body");
            var parent = $span.parent().find(".panel");
            var currentImg = $span.find("span");
            var myLeftWidth = typeof(leftWidth) == "undefined" ? 30 : leftWidth;
            var myLeftOpen = typeof(isLeftOpen) == "undefined" ? true : isLeftOpen;
            if (myLeftOpen) {
                parentLeft.css({"width": myLeftWidth + "%"});
                parentRight.css({"width": "calc(" + (100 - myLeftWidth) + "% - " + "20px)", "margin-left": "20px"});
                parentLeft.addClass("panel-shadow");
                parentLeft.find("div").each(function () {
                    $(this).show();
                });
                $span.css({'border-top-left-radius': '0px', 'border-bottom-left-radius': '0px'});
                parentRight.addClass("open");
                currentImg.removeClass('icon-right').addClass('icon-left');
            }
            else {
                parentLeft.css({"width": "0"});
                parentRight.css({"width": "calc(100% - 40px)", 'margin-left': '40px'});
                $(parent).find("div").each(function () {
                    $(this).hide();
                });
                parentLeft.removeClass("panel-shadow");
                $span.css({'border-top-left-radius': '7px', 'border-bottom-left-radius': '7px'});
                currentImg.removeClass('icon-left').addClass('icon-right');
            }
            $span.click(function () {
                var currentArrow = $(this);
                if (panelBody.is(":visible")) {

                    var leftWidth = parentLeft.width();
                    var rightWidth = parentRight.width();
                    parentLeft.removeClass("panel-shadow");
                    parentLeft.animate({width: 0}, "show", function () {
                        $(parent).find("div").each(function () {
                            $(this).hide();
                        });
                        currentArrow.css({'border-top-left-radius': '7px', 'border-bottom-left-radius': '7px'});
                        currentImg.removeClass('icon-left').addClass('icon-right');
                    });
                    var current = leftWidth + rightWidth - 20;
                    parentRight.animate({"width": current + "px", 'margin-left': '40px'});

                } else {
                    parentLeft.find("div").each(function () {
                        $(this).show();
                    })
                    parentRight.css({"width": "calc(" + (100 - myLeftWidth) + "% - " + "20px)", "margin-left": "20px"});
                    parentLeft.animate({width: myLeftWidth + "%"}, "show", function () {
                        parentLeft.addClass("panel-shadow");
                        currentArrow.css({'border-top-left-radius': '0px', 'border-bottom-left-radius': '0px'});
                    });
                    currentImg.removeClass('icon-right').addClass('icon-left');
                }
            })
        }
    });

}(jQuery);


//For debug, the file name is: popover.js
/**
 * Created by lonlin on 11/12/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function($) {
    'use strict';

    // if click other area popover will close
    $(document).click(function(event) {
        if (!($(event.target).hasClass("btn btn-info") || $(event.target).attr("data-toggle") == "popover")
            && !$(event.target).closest('.popover').length == 1) {
            $('[data-toggle="popover"]').popover('hide');
        }
    });

    // resize windown reposition the popover
    $(window).on('resize', function() {
        $('[data-toggle="popover"]').filter("[aria-describedby]").popover("show");
    });

}(jQuery);

//For debug, the file name is: radiogroup.js
/**
 * Created by ablir on 11/16/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $.fn.radioButtonFocus = function () {
        var groups = [];

        // group the inputs by name
        $(this).each(function () {
            var el = this;
            var thisGroup = groups[el.name] = (groups[el.name] || []);
            thisGroup.push(el);
        });

        $(this).on('keydown', function (e) {
            setTimeout(function () {
                var el = e.target;
                var thisGroup = groups[el.name] = (groups[el.name] || []);
                var indexOfTarget = thisGroup.indexOf(e.target);
                var isShiftKey = (window.event && window.event.shiftKey) || e.shiftKey;

                if (e.keyCode === 9) {
                    if (indexOfTarget < (thisGroup.length - 1) && !isShiftKey) {
                        thisGroup[indexOfTarget + 1].focus();
                    }
                    else if (indexOfTarget > 0 && isShiftKey) {
                        thisGroup[indexOfTarget - 1].focus();
                    }
                }
                if (e.keyCode === 13) {
                    el.checked = true;
                }
            });
        });
    };

    $(document).ready(function () {
        $('.n-radio-btn').radioButtonFocus();
    });

}(jQuery);

//For debug, the file name is: scroll.js
/**
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function($) {
    'use strict';

    $.fn.extend({
        nScrollbar: function(options) {
            var $select = $(this);
            if ($select.hasClass("n-dropdown-menu-scroll") || $select.hasClass("tree-scroll") || $select.hasClass("n-table-scrollbar") || ($select.hasClass("n-list-group-scroll") && $select.find("li.n-list-group-item").length > 0)) {
                options = $.extend({}, options, { keyboard: { enable: false } });
            }
            $select.mCustomScrollbar(options);
        }
    });

}(jQuery);

//For debug, the file name is: search.js
/**
 * Created by jilian on 10/20/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function($) {
    'use strict';

    //handling the click event of clear icon
    $(document).on('click.wf.search', '.n-search-control-icon', function(event){
        event.preventDefault();
        $(this).prev('.n-search-input').val('');
    });

}(jQuery);
//For debug, the file name is: slider.js
/*
*  rangeslider.js - v2.0.5 | (c) 2015 @andreruffert | MIT license | https://github.com/andreruffert/rangeslider.js
*  Jonathan: [NOTE] once the native HTML5 range input can be styled to cross-browser compatible slider, then this JS file can be totally removed from WULF.  
* ========================================================================
* Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
* ======================================================================== */

(function(factory) {
    'use strict';

    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function($) {
    'use strict';

    // Polyfill Number.isNaN(value)
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN
    Number.isNaN = Number.isNaN || function(value) {
            return typeof value === 'number' && value !== value;
        };

    /**
     * Range feature detection
     * @return {Boolean}
     */
    function supportsRange() {
        var input = document.createElement('input');
        input.setAttribute('type', 'range');
        return input.type !== 'text';
    }

    var pluginName = 'rangeslider',
        pluginIdentifier = 0,
        hasInputRangeSupport = supportsRange(),
        defaults = {
            polyfill: true,
            orientation: 'horizontal',
            rangeClass: 'rangeslider',
            disabledClass: 'rangeslider--disabled',
            horizontalClass: 'rangeslider--horizontal',
            verticalClass: 'rangeslider--vertical',
            fillClass: 'rangeslider__fill',
            handleClass: 'rangeslider__handle',
            startEvent: ['mousedown', 'touchstart', 'pointerdown'],
            moveEvent: ['mousemove', 'touchmove', 'pointermove'],
            endEvent: ['mouseup', 'touchend', 'pointerup']
        },
        constants = {
            orientation: {
                horizontal: {
                    dimension: 'width',
                    direction: 'left',
                    directionStyle: 'left',
                    coordinate: 'x'
                },
                vertical: {
                    dimension: 'height',
                    direction: 'top',
                    directionStyle: 'bottom',
                    coordinate: 'y'
                }
            }
        };

    /**
     * Delays a function for the given number of milliseconds, and then calls
     * it with the arguments supplied.
     *
     * @param  {Function} fn   [description]
     * @param  {Number}   wait [description]
     * @return {Function}
     */
    function delay(fn, wait) {
        var args = Array.prototype.slice.call(arguments, 2);
        return setTimeout(function(){ return fn.apply(null, args); }, wait);
    }

    /**
     * Returns a debounced function that will make sure the given
     * function is not triggered too much.
     *
     * @param  {Function} fn Function to debounce.
     * @param  {Number}   debounceDuration OPTIONAL. The amount of time in milliseconds for which we will debounce the function. (defaults to 100ms)
     * @return {Function}
     */
    function debounce(fn, debounceDuration) {
        debounceDuration = debounceDuration || 100;
        return function() {
            if (!fn.debouncing) {
                var args = Array.prototype.slice.apply(arguments);
                fn.lastReturnVal = fn.apply(window, args);
                fn.debouncing = true;
            }
            clearTimeout(fn.debounceTimeout);
            fn.debounceTimeout = setTimeout(function(){
                fn.debouncing = false;
            }, debounceDuration);
            return fn.lastReturnVal;
        };
    }

    /**
     * Check if a `element` is visible in the DOM
     *
     * @param  {Element}  element
     * @return {Boolean}
     */
    function isHidden(element) {
        return (
            element && (
                element.offsetWidth === 0 ||
                element.offsetHeight === 0 ||
                    // Also Consider native `<details>` elements.
                element.open === false
            )
        );
    }

    /**
     * Get hidden parentNodes of an `element`
     *
     * @param  {Element} element
     * @return {[type]}
     */
    function getHiddenParentNodes(element) {
        var parents = [],
            node    = element.parentNode;

        while (isHidden(node)) {
            parents.push(node);
            node = node.parentNode;
        }
        return parents;
    }

    /**
     * Returns dimensions for an element even if it is not visible in the DOM.
     *
     * @param  {Element} element
     * @param  {String}  key     (e.g. offsetWidth …)
     * @return {Number}
     */
    function getDimension(element, key) {
        var hiddenParentNodes       = getHiddenParentNodes(element),
            hiddenParentNodesLength = hiddenParentNodes.length,
            inlineStyle             = [],
            dimension               = element[key];

        // Used for native `<details>` elements
        function toggleOpenProperty(element) {
            if (typeof element.open !== 'undefined') {
                element.open = (element.open) ? false : true;
            }
        }

        if (hiddenParentNodesLength) {
            for (var i = 0; i < hiddenParentNodesLength; i++) {

                // Cache style attribute to restore it later.
                inlineStyle[i] = hiddenParentNodes[i].style.cssText;

                // visually hide
                if (hiddenParentNodes[i].style.setProperty) {
                    hiddenParentNodes[i].style.setProperty('display', 'block', 'important');
                } else {
                    hiddenParentNodes[i].style.cssText += ';display: block !important';
                }
                hiddenParentNodes[i].style.height = '0';
                hiddenParentNodes[i].style.overflow = 'hidden';
                hiddenParentNodes[i].style.visibility = 'hidden';
                toggleOpenProperty(hiddenParentNodes[i]);
            }

            // Update dimension
            dimension = element[key];

            for (var j = 0; j < hiddenParentNodesLength; j++) {

                // Restore the style attribute
                hiddenParentNodes[j].style.cssText = inlineStyle[j];
                toggleOpenProperty(hiddenParentNodes[j]);
            }
        }
        return dimension;
    }

    /**
     * Returns the parsed float or the default if it failed.
     *
     * @param  {String}  str
     * @param  {Number}  defaultValue
     * @return {Number}
     */
    function tryParseFloat(str, defaultValue) {
        var value = parseFloat(str);
        return Number.isNaN(value) ? defaultValue : value;
    }

    /**
     * Capitalize the first letter of string
     *
     * @param  {String} str
     * @return {String}
     */
    function ucfirst(str) {
        return str.charAt(0).toUpperCase() + str.substr(1);
    }

    /**
     * Plugin
     * @param {String} element
     * @param {Object} options
     */
    function Plugin(element, options) {
        this.$window            = $(window);
        this.$document          = $(document);
        this.$element           = $(element);
        this.options            = $.extend( {}, defaults, options );
        this.polyfill           = this.options.polyfill;
        this.orientation        = this.$element[0].getAttribute('data-orientation') || this.options.orientation;
        this.onInit             = this.options.onInit;
        this.onSlide            = this.options.onSlide;
        this.onSlideEnd         = this.options.onSlideEnd;
        this.DIMENSION          = constants.orientation[this.orientation].dimension;
        this.DIRECTION          = constants.orientation[this.orientation].direction;
        this.DIRECTION_STYLE    = constants.orientation[this.orientation].directionStyle;
        this.COORDINATE         = constants.orientation[this.orientation].coordinate;

        // Plugin should only be used as a polyfill
        if (this.polyfill) {
            // Input range support?
            if (hasInputRangeSupport) { return false; }
        }

        this.identifier = 'js-' + pluginName + '-' +(pluginIdentifier++);
        this.startEvent = this.options.startEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.moveEvent  = this.options.moveEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.endEvent   = this.options.endEvent.join('.' + this.identifier + ' ') + '.' + this.identifier;
        this.toFixed    = (this.step + '').replace('.', '').length - 1;
        this.$fill      = $('<div class="' + this.options.fillClass + '" />');
        this.$handle    = $('<div class="' + this.options.handleClass + '" />');
        this.$range     = $('<div class="' + this.options.rangeClass + ' ' + this.options[this.orientation + 'Class'] + '" id="' + this.identifier + '" />').insertAfter(this.$element).prepend(this.$fill, this.$handle);

        // visually hide the input
        this.$element.css({
            'position': 'absolute',
            'width': '1px',
            'height': '1px',
            'overflow': 'hidden',
            'opacity': '0'
        });

        // Store context
        this.handleDown = $.proxy(this.handleDown, this);
        this.handleMove = $.proxy(this.handleMove, this);
        this.handleEnd  = $.proxy(this.handleEnd, this);

        this.init();

        // Attach Events
        var _this = this;
        this.$window.on('resize.' + this.identifier, debounce(function() {
            // Simulate resizeEnd event.
            delay(function() { _this.update(); }, 300);
        }, 20));

        this.$document.on(this.startEvent, '#' + this.identifier + ':not(.' + this.options.disabledClass + ')', this.handleDown);

        // Listen to programmatic value changes
        this.$element.on('change.' + this.identifier + ' input.' + this.identifier, function(e, data) {
            if (data && data.origin === _this.identifier) {
                return;
            }

            var value = e.target.value,
                pos = _this.getPositionFromValue(value);
            _this.setPosition(pos);
        });
    }

    Plugin.prototype.init = function() {
        this.update(true, false);

        if (this.onInit && typeof this.onInit === 'function') {
            this.onInit();
        }
    };

    Plugin.prototype.update = function(updateAttributes, triggerSlide) {
        updateAttributes = updateAttributes || false;

        if (updateAttributes) {
            this.min    = tryParseFloat(this.$element[0].getAttribute('min'), 0);
            this.max    = tryParseFloat(this.$element[0].getAttribute('max'), 100);
            this.value  = tryParseFloat(this.$element[0].value, Math.round(this.min + (this.max-this.min)/2));
            this.step   = tryParseFloat(this.$element[0].getAttribute('step'), 1);
        }

        this.handleDimension    = getDimension(this.$handle[0], 'offset' + ucfirst(this.DIMENSION));
        this.rangeDimension     = getDimension(this.$range[0], 'offset' + ucfirst(this.DIMENSION));
        this.maxHandlePos       = this.rangeDimension - this.handleDimension;
        this.grabPos            = this.handleDimension / 2;
        this.position           = this.getPositionFromValue(this.value);

        // Consider disabled state
        if (this.$element[0].disabled) {
            this.$range.addClass(this.options.disabledClass);
        } else {
            this.$range.removeClass(this.options.disabledClass);
        }

        this.setPosition(this.position, triggerSlide);
    };

    Plugin.prototype.handleDown = function(e) {
        this.$document.on(this.moveEvent, this.handleMove);
        this.$document.on(this.endEvent, this.handleEnd);

        // If we click on the handle don't set the new position
        if ((' ' + e.target.className + ' ').replace(/[\n\t]/g, ' ').indexOf(this.options.handleClass) > -1) {
            this.$element.focus();
            //e.preventDefault();
            return;
        }

        var pos         = this.getRelativePosition(e),
            rangePos    = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            handlePos   = this.getPositionFromNode(this.$handle[0]) - rangePos,
            setPos      = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);

        this.setPosition(setPos);

        if (pos >= handlePos && pos < handlePos + this.handleDimension) {
            this.grabPos = pos - handlePos;
        }
    };

    Plugin.prototype.handleMove = function(e) {
        e.preventDefault();
        var pos = this.getRelativePosition(e);
        var setPos = (this.orientation === 'vertical') ? (this.maxHandlePos - (pos - this.grabPos)) : (pos - this.grabPos);
        this.setPosition(setPos);
    };

    Plugin.prototype.handleEnd = function(e) {
        e.preventDefault();
        this.$document.off(this.moveEvent, this.handleMove);
        this.$document.off(this.endEvent, this.handleEnd);

        // Ok we're done fire the change event
        this.$element.trigger('change', { origin: this.identifier });

        if (this.onSlideEnd && typeof this.onSlideEnd === 'function') {
            this.onSlideEnd(this.position, this.value);
        }
    };

    Plugin.prototype.cap = function(pos, min, max) {
        if (pos < min) { return min; }
        if (pos > max) { return max; }
        return pos;
    };

    Plugin.prototype.setPosition = function(pos, triggerSlide) {
        var value, newPos;

        if (triggerSlide === undefined) {
            triggerSlide = true;
        }

        // Snapping steps
        value = this.getValueFromPosition(this.cap(pos, 0, this.maxHandlePos));
        newPos = this.getPositionFromValue(value);

        // Update ui
        this.$fill[0].style[this.DIMENSION] = (newPos + this.grabPos) + 'px';
        this.$handle[0].style[this.DIRECTION_STYLE] = newPos + 'px';
        this.setValue(value);

        // Update globals
        this.position = newPos;
        this.value = value;

        if (triggerSlide && this.onSlide && typeof this.onSlide === 'function') {
            this.onSlide(newPos, value);
        }
    };

    // Returns element position relative to the parent
    Plugin.prototype.getPositionFromNode = function(node) {
        var i = 0;
        while (node !== null) {
            i += node.offsetLeft;
            node = node.offsetParent;
        }
        return i;
    };

    Plugin.prototype.getRelativePosition = function(e) {
        // Get the offset DIRECTION relative to the viewport
        var ucCoordinate = ucfirst(this.COORDINATE),
            rangePos = this.$range[0].getBoundingClientRect()[this.DIRECTION],
            pageCoordinate = 0;

        if (typeof e['page' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e['client' + ucCoordinate];
        }
        else if (typeof e.originalEvent['client' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent['client' + ucCoordinate];
        }
        else if (e.originalEvent.touches && e.originalEvent.touches[0] && typeof e.originalEvent.touches[0]['client' + ucCoordinate] !== 'undefined') {
            pageCoordinate = e.originalEvent.touches[0]['client' + ucCoordinate];
        }
        else if(e.currentPoint && typeof e.currentPoint[this.COORDINATE] !== 'undefined') {
            pageCoordinate = e.currentPoint[this.COORDINATE];
        }

        return pageCoordinate - rangePos;
    };

    Plugin.prototype.getPositionFromValue = function(value) {
        var percentage, pos;
        percentage = (value - this.min)/(this.max - this.min);
        pos = (!Number.isNaN(percentage)) ? percentage * this.maxHandlePos : 0;
        return pos;
    };

    Plugin.prototype.getValueFromPosition = function(pos) {
        var percentage, value;
        percentage = ((pos) / (this.maxHandlePos || 1));
        value = this.step * Math.round(percentage * (this.max - this.min) / this.step) + this.min;
        return Number((value).toFixed(this.toFixed));
    };

    Plugin.prototype.setValue = function(value) {
        if (value === this.value && this.$element[0].value !== '') {
            return;
        }

        // Set the new value and fire the `input` event
        this.$element
            .val(value)
            .trigger('input', { origin: this.identifier });
    };

    Plugin.prototype.destroy = function() {
        this.$document.off('.' + this.identifier);
        this.$window.off('.' + this.identifier);

        this.$element
            .off('.' + this.identifier)
            .removeAttr('style')
            .removeData('plugin_' + pluginName);

        // Remove the generated markup
        if (this.$range && this.$range.length) {
            this.$range[0].parentNode.removeChild(this.$range[0]);
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function(options) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function() {
            var $this = $(this),
                data  = $this.data('plugin_' + pluginName);

            // Create a new instance.
            if (!data) {
                $this.data('plugin_' + pluginName, (data = new Plugin(this, options)));
            }

            // Make it possible to access methods from public.
            // e.g `$element.rangeslider('method');`
            if (typeof options === 'string') {
                data[options].apply(data, args);
            }
        });
    };

    ////////////before printing, update slider at once because the window size or media gets changed on print mode//////////////////
    function adjustSliderImmediately() {
        $('input[type="range"]').rangeslider('update', true);
    }
    if(window.matchMedia)
    {
        //Only works on chrome as there is a bug in IE and FF for matchMedia('print').
        window.matchMedia('print').addListener(adjustSliderImmediately);
    }

}));

//For debug, the file name is: tables.js
/**
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $(document).ready(function () {

        // support the selection for readonly cells in table
        var tables = $("table").filter(".n-table");
        for (var tableIndex = 0; tableIndex < tables.length; tableIndex++) {
            var table = tables[tableIndex];
            var tdElements = $(table).find("td");
            var length = tdElements.length;
            for (var index = 0; index < length; index++) {
                var tdElement = tdElements[index];
                if ($(tdElement).find("input").length <= 0 && $(tdElement).find("Button").length <= 0 && $(tdElement).find("a").length <= 0) {
                    $(tdElement).attr("tabindex", "0");
                }
            }
        }

        $(".n-table-hover, .n-table-cell-hover").mousedown(function (e) {
            if (e.shiftKey) {
                // For non-IE browsers
                e.preventDefault();
                // For IE
                if (typeof $.browser != "undefined" && $.browser.msie) {
                    this.onselectstart = function () {
                        return false;
                    };
                    var selectionEvent = this;
                    window.setTimeout(function () {
                        selectionEvent.onselectstart = null;
                    }, 0);
                }
            }
        });

        initTableScrollbar();

        //Cell selection
        $('.n-table-cell-hover').on('click', 'td', function (e) {
            $(this).closest('table').find('td').removeClass('n-cell-selected');
            $(this).addClass('n-cell-selected');

        });

        //Row selection
        var selectionPivot;
        $('.n-table-hover').on('click', 'td', function (e) {
            var trElements = $(this).closest('table').find('tr');
            var ctrlKeyPressed = (window.event && window.event.ctrlKey) || e.ctrlKey;
            var shiftKeyPressed = (window.event && window.event.shiftKey) || e.shiftKey;

            var isHighLighted = $(this).closest("tr").children("td").hasClass("n-cell-selected");


            $(this).closest("tr").children("td").removeClass("n-cell-selected");

            if (!ctrlKeyPressed && !shiftKeyPressed) {
                selectionPivot = $(this).closest("tr");
                $(this).closest('table').find('td').removeClass('n-cell-selected');
                $(this).closest("tr").children("td").addClass("n-cell-selected");
            }
            else if (ctrlKeyPressed && !shiftKeyPressed) {
                selectionPivot = $(this).closest("tr");
                if (isHighLighted) {
                    return;
                } else {
                    $(this).closest("tr").children("td").addClass("n-cell-selected");
                }
            }
            else {
                if (!ctrlKeyPressed) {
                    $(this).closest('table').find('td').removeClass('n-cell-selected');
                }
                if (typeof selectionPivot === "undefined" || ($(selectionPivot).closest("table").get(0) != $(this).closest("table").get(0))) {
                    selectionPivot = $(this).closest("tr");
                    $(this).closest("tr").children("td").addClass("n-cell-selected");
                    return;
                }
                var bot = Math.min(selectionPivot[0].rowIndex, $(this).closest("tr")[0].rowIndex);
                var top = Math.max(selectionPivot[0].rowIndex, $(this).closest("tr")[0].rowIndex);
                for (var i = bot; i <= top; i++) {
                    $(trElements[i]).children("td").addClass("n-cell-selected");
                }
            }
        });

        $('.n-sortable').on('click', function (e) {
            var arrow = $(this).find('> span');
            if (arrow.is('.icon-arrow')) {
                arrow.removeClass('icon-arrow');
                arrow.addClass("icon-arrow-up");

            }
            else if (arrow.is('.icon-arrow-up')) {
                arrow.removeClass('icon-arrow-up');
                arrow.addClass("icon-arrow");
            }
        });
    });

    $(window).resize(function () {
        synchronizeTableColumnWidth();
    });

    function initTableScrollbar() {
        adjustScrollTable();
        $(".n-table-scrollbar").nScrollbar();
        setTimeout(synchronizeTableColumnWidth, 50);
    }

    //insert and update some html code for every scroll table
    function adjustScrollTable() {
        $(".n-table-scrollbar").each(function () {
            var colspanTotal = $(this).closest("table.n-table").find("thead th").length;
            var scrollTablePrifx = "<tr><th colspan='" + colspanTotal + "' style='padding: 0; border:none; border-bottom-left-radius: 7px; border-bottom-right-radius: 7px;'><table  class='n-table-scrollbar'>";
            var scrollTableSuffix = "</table></th></tr>";
            var scrollTableHtml = $(this).html();

            $(this).html(scrollTablePrifx + scrollTableHtml + scrollTableSuffix);
            $(this).removeClass("n-table-scrollbar");
        });
    }

    function synchronizeTableColumnWidth() {
        $(".n-table-scrollbar").each(function () {
            var tableWidth = $(this).closest("table.n-table").width();
            var theadCols = $(this).closest("table.n-table").find("thead th");
            var tbodyCols = $($(this).find("tr")[0]).find("td");

            //update the TD width in tbody same with in thead
            for (var i = 0; i < theadCols.length; i++) {
                /*
                 The default column padding is 8px.
                 But for some columns that use class "n-cell-control", its padding is 1px.
                 Here it will calculate the padding difference to adjust the assigned column width.
                 */
                var paddLeftDiff = parseInt($(theadCols[i]).css("padding-left")) - parseInt($(tbodyCols[i]).css("padding-left"));
                var paddRightDiff = parseInt($(theadCols[i]).css("padding-right")) - parseInt($(tbodyCols[i]).css("padding-right"));

                $(tbodyCols[i]).width($(theadCols[i]).width() + paddLeftDiff + paddRightDiff);
            }
        });
    }

}(jQuery);


//For debug, the file name is: textarea.js
/**
 * Created by jilian on 9/21/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */

+function ($) {
    'use strict';

    $(document).ready(function () {
        var textArea = $(".content-scroll .n-textarea");
        var textAreaHeight = parseInt($(".content-scroll").css("height")) - 17;
        textArea.css("height", textAreaHeight);
        textArea.wrap("<div class='textarea-wrapper' />");

        var textAreaWrapper = textArea.parent(".textarea-wrapper");
        textAreaWrapper.css("height", $(".content-scroll").css("height"));
        textAreaWrapper.addClass("textarea-wrapper-normal");
        textAreaWrapper.mCustomScrollbar({
            scrollInertia: 0,
            advanced: {autoScrollOnFocus: false}
        });

        var hiddenDiv = $(document.createElement("div")),
            content = null;
        hiddenDiv.addClass("textareaHiddenDiv");
        hiddenDiv.css("width", parseInt(textArea.css("width")) - 12);
        hiddenDiv.css("min-height", textAreaHeight);

        $("body").prepend(hiddenDiv);

        $.fn.getCursorPosition = function () {
            var el = $(this).get(0),
                pos = 0;
            if ("selectionStart" in el) {
                pos = el.selectionStart;
            }
            else if ("selection" in document) {
                el.focus();
                var sel = document.selection.createRange(),
                    selLength = document.selection.createRange().text.length;
                sel.moveStart("character", -el.value.length);
                pos = sel.text.length - selLength;
            }
            return pos;
        };

        function updateScrollbar(localTextArea) {
            var localContainer = localTextArea.parents(".mCSB_container");
            var localWrapper = localTextArea.parents(".textarea-wrapper");

            content = localTextArea.val();
            var cursorPosition = localTextArea.getCursorPosition();
            content = "<span>" + content.substr(0, cursorPosition) + "</span>" + content.substr(cursorPosition, content.length);
            content = content.replace(/\n/g, "<br />");
            hiddenDiv.html(content + "<br />");

            localTextArea.css("height", hiddenDiv.height());
            localWrapper.nScrollbar("update");

            var hiddenDivSpan = hiddenDiv.children("span"),
                hiddenDivSpanOffset = 0,
                viewLimitBottom = (parseInt(hiddenDiv.css("min-height"))) - hiddenDivSpanOffset,
                viewLimitTop = hiddenDivSpanOffset,
                viewRatio = Math.round(hiddenDivSpan.height() + localContainer.position().top);
            if (viewRatio > viewLimitBottom || viewRatio < viewLimitTop) {
                if ((hiddenDivSpan.height() - hiddenDivSpanOffset) > 0) {
                    localWrapper.mCustomScrollbar("scrollTo", hiddenDivSpan.height() - hiddenDivSpanOffset);
                }
                else {
                    localWrapper.mCustomScrollbar("scrollTo", "top");
                }
            }
        }

        if (textArea.length > 0) {
            updateScrollbar(textArea);
            textArea.bind("keyup keydown", function (e) {
                updateScrollbar($(this));
            });
            textArea.bind("focus", function () {
                var localWrapper = $(this).parents(".textarea-wrapper");
                localWrapper.removeClass("textarea-wrapper-normal");
                localWrapper.addClass("textarea-wrapper-focus");
            });
            textArea.bind("blur", function () {
                var localWrapper = $(this).parents(".textarea-wrapper");
                localWrapper.removeClass("textarea-wrapper-focus");
                localWrapper.addClass("textarea-wrapper-normal");
            });
        }
    });

}(jQuery);


//For debug, the file name is: tree-checkbox.js
/**
 * Created by zuhe on 7/23/2015.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */
+function($) {
    'use strict';

    setTimeout(function() {
        var trees = $('.tree');
        for (var i = 0; i < trees.length; i++) {
            updateLinkInTree(trees[i]);
            $(trees[i]).on("click", clickTree);
        }
    }, 500);

    function clickTree(ev) {
        updateLinkInTree(ev.currentTarget);
    }

    function updateLinkInTree(e) {
        var allBranchMenu = $(e).find(".tree-branch");
        for (var j = 0; j < allBranchMenu.length; j++) {
            var branch = allBranchMenu[j];
            if ($(branch).attr("src") !== "") {
                var header = $(branch).children(".tree-branch-header");
                var a = $(header).children(".tree-branch-name");
                $(a).attr("href", $(branch).attr("src"));
            }
        }

        var allItemMenu = $(e).find(".tree-item");
        for (var k = 0; k < allItemMenu.length; k++) {
            var item = allItemMenu[k];
            if ($(item).attr("src") !== "") {
                var b = $(item).children(".tree-item-name");
                $(b).attr("href", $(item).attr("src"));
            }
        }
    }

    /** For tree with checkbox */
    // process the leaf check box click events
    $('.tree-has-checkbox').on("keydown", "li.tree-item .checkbox[name='file']", trigerTreeItem);
    $('.tree-has-checkbox').on("click", "li.tree-item .checkbox[name='file']", trigerTreeItem);
    function trigerTreeItem(ev) {
        if (ev.which !== 32 && ev.which !== 1) {
            return;
        }

        ev.preventDefault();
        ev.stopPropagation();

        var currentStatus = $(this).find("input").prop("checked");
        var targetStatus = !currentStatus;
        $(this).find("input").prop("checked", targetStatus);
        updateTree();
    }

    // process the folder check box click events
    $('.tree-has-checkbox').on("keydown", "li.tree-branch .checkbox[name='folder']", trigerTreeFolder);
    $('.tree-has-checkbox').on("click", "li.tree-branch .checkbox[name='folder']", trigerTreeFolder);
    function trigerTreeFolder(ev) {
        if (ev.which !== 32 && ev.which !== 1) {
            return;
        }

        ev.preventDefault();
        ev.stopPropagation();

        var currentStatus = $(this).find("input").prop("checked");
        var targetStatus = !currentStatus;
        $(this).find("input").prop({
            "checked": targetStatus,
            indeterminate: false
        });
        var arrChk = $(this).closest(".tree-branch").find("input");
        arrChk.each(function() {
            $(this).prop({
                "checked": targetStatus,
                indeterminate: false
            });
        });
        updateTree();
    }

    $('.tree').on('click.fu.tree', '.icon-caret', function(e) {
        scrollTree(e);
    });

    $('.tree').on('click.fu.tree', '.tree-label', function(e) {
        scrollTree(e);
    });

    function scrollTree(e) {
        var currentTarget = e.currentTarget;
        var parentNode = $(currentTarget).parent();
        if ($(parentNode).hasClass('tree-branch-name') || $(parentNode).hasClass('tree-branch-header')) {
            var closetLiNode = parentNode.closest('li');
            if (!$(closetLiNode).hasClass('tree-open')) {
                var rootNode = parentNode.closest('ul.tree');
                var treeClientHeight = rootNode.get(0).clientHeight;
                var childNodesNum = closetLiNode.find('ul li').size();
                var lineHeight = $(parentNode).get(0).offsetHeight;
                var currentOffsetHeight = $(currentTarget).offset().top - rootNode.offset().top;
                var initScroll = (childNodesNum === 0 && currentOffsetHeight > treeClientHeight * 3 / 4);
                if ((treeClientHeight < (currentOffsetHeight + (childNodesNum + 1) * lineHeight)) || initScroll) {
                    rootNode.mCustomScrollbar('scrollTo', currentTarget, { scrollInertia: 0 });
                }
            }
        }
    }

    function updateTree() {
        $(".tree-branch-name > .checkbox > input[name='folder']").each(function() {
            var statuses = [];
            $(this).closest(".tree-branch").find("input[name='file']").each(
                function() {
                    statuses.push($(this).prop("checked"));
                }
            );
            if (statuses.length !== 0) {
                var allfileschecked = statuses.reduce(function(a, b) {
                    return a && b;
                });
                var partfilechecked = statuses.reduce(function(a, b) {
                    return a || b;
                });
                $(this).prop("checked", allfileschecked);
                if (allfileschecked) {
                    $(this).prop({
                        "checked": true,
                        indeterminate: false
                    });
                }
                else if (partfilechecked) {
                    $(this).prop({
                        "checked": false,
                        indeterminate: true
                    });
                }
                else {
                    $(this).prop({
                        "checked": false,
                        indeterminate: false
                    });
                }
            }
        });
    }
}(jQuery)
//For debug, the file name is: tree.js
/**
 * Created by jiangdai on 2016/1/4.
 * ========================================================================
 * Copyright (C) 2015 Nokia Solutions and Networks. All rights Reserved.
 * ======================================================================== */
+function ($) {
    'use strict';

    $(document).ready(
        function () {
            if ($.fn.tree !== undefined) {
                $.fn.tree.Constructor.prototype.disable = function () {
                    var self = this;
                    self.$element.addClass('disabled-tree');
                    self.$element.find('a').each(function () {
                        $(this).attr('disabled', 'disabled');
                    });
                    // Disable scroll bar if exists
                    if (self.$element.find(".mCSB_scrollTools").length > 0) {
                        self.$element.mCustomScrollbar('destroy');
                        self.$element.mCustomScrollbar({
                            advanced: {autoExpandHorizontalScroll: true},
                            alwaysShowScrollbar: 2,
                            theme: 'disabled',
                            mouseWheel:{ enable: false, axis: 'x' }

                        });
                        self.$element.mCustomScrollbar("disable");
                    }
                };

                $.fn.tree.Constructor.prototype.enableScrollbar = function (width, height) {
                    var self = this;
                    self.$element.nScrollbar();
                    self.$element.css('width', width + 'px');
                    self.$element.css('height', height + 'px');
                };

                $.fn.tree.Constructor.prototype.populate = function( $el ) {
                    var self = this;
                    var $parent = ( $el.hasClass( 'tree' ) ) ? $el : $el.parent();
                    var loader = $parent.find( '.tree-loader:eq(0)' );
                    var treeData = $parent.data();

                    loader.removeClass( 'hide hidden' ); // hide is deprecated
                    this.options.dataSource( treeData ? treeData : {}, function( items ) {
                        loader.addClass( 'hidden' );

                        $.each( items.data, function( index, value ) {
                            var $entity;

                            if ( value.type === 'folder' ) {
                                $entity = self.$element.find( '[data-template=treebranch]:eq(0)' ).clone().removeClass( 'hide hidden' ).removeData( 'template' ); // hide is deprecated
                                $entity.data( value );
                                $entity.find( '.tree-branch-name > .tree-label' ).html( value.text || value.name );
                            } else if ( value.type === 'item' ) {
                                $entity = self.$element.find( '[data-template=treeitem]:eq(0)' ).clone().removeClass( 'hide hidden' ).removeData( 'template' ); // hide is deprecated
                                $entity.find( '.tree-item-name > .tree-label' ).html( value.text || value.name );
                                $entity.data( value );
                            }

                            // Added support for description and icon
                            if(value.desc){
                                $entity.find('.tree-label').append("<span class='tree-description'> &ndash; " + value.desc + "</span>");
                            }
                            if(value.icon){
                                $entity.find( '.tree-label' ).append("<span class='icon " + value.icon + "'></span>");
                            }

                            // add attributes to tree-branch or tree-item
                            var attr = value.attr || value.dataAttributes || [];
                            $.each( attr, function( key, value ) {
                                switch ( key ) {
                                    case 'cssClass':
                                    case 'class':
                                    case 'className':
                                        $entity.addClass( value );
                                        break;

                                    // allow custom icons
                                    case 'data-icon':
                                        $entity.find( '.icon-item' ).removeClass().addClass( 'icon-item ' + value );
                                        $entity.attr( key, value );
                                        break;

                                    // ARIA support
                                    case 'id':
                                        $entity.attr( key, value );
                                        $entity.attr( 'aria-labelledby', value + '-label' );
                                        $entity.find( '.tree-branch-name > .tree-label' ).attr( 'id', value + '-label' );
                                        break;

                                    // style, data-*
                                    default:
                                        $entity.attr( key, value );
                                        break;
                                }
                            } );

                            // add child nodes
                            if ( $el.hasClass( 'tree-branch-header' ) ) {
                                $parent.find( '.tree-branch-children:eq(0)' ).append( $entity );
                            } else {
                                $el.append( $entity );
                            }
                        } );
                        // return newly populated folder
                        self.$element.trigger( 'loaded.fu.tree', $parent );
                    } );
                };
            }
        });
}(jQuery)/* jshint ignore:end */