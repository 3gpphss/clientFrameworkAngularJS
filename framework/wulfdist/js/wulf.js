/*!
 * WULF v1.0.43 (http://networks.nokia.com/)
 * Copyright 2015 Nokia Solutions and Networks. All rights Reserved.
 * jshint ignore:start 
 */

if (typeof jQuery === 'undefined') {
  throw new Error('WULF\'s JavaScript requires jQuery')
}

+function ($) {
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('WULF\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

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