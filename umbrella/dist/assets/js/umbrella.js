/*!-----------------------------------------------------------------
  Name: Umbrella. - Photography HTML Template
  Version: 1.1.2
  Author: blkburn, blkburn
  Website: https://nkdev.info
  Purchase: https://themeforest.net/item/umbrella-photography-html-template/17889537
  Support: https://nk.ticksy.com
  License: You must have a valid license purchased only from ThemeForest (the above link) in order to legally use the theme for your project.
  Copyright 2018.
-------------------------------------------------------------------*/
;(function() {
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*------------------------------------------------------------------

  Theme Options

-------------------------------------------------------------------*/
var options = {
    // mobile device width (need for slider to activate all categories)
    mobile: 991,

    // automatically show all categories on mobile devices
    sliderShowAllCategoriesOnMobile: true,

    // enable AJAX page loading
    ajax: true,

    events: {
        // before ajax loading click. Return true to prevent ajax loading
        onBeforeAjaxPageLoad: function onBeforeAjaxPageLoad(event) {
            return false;
        },


        // after ajax page loaded
        onAfterAjaxPageLoad: function onAfterAjaxPageLoad(data) {},


        // callback to load new posts in blog
        onLoadBlogPosts: function onLoadBlogPosts() {
            var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

            // fake timeout to demonstrate loading
            setTimeout(function () {
                // new posts will be appended to the current list
                var newPosts = [{
                    title: 'Other designers are experimenting with backless blouses, cut-out crop tops, and spine-baring slips',
                    url: 'blog-article.html'
                }, {
                    title: 'The style has long been considered to be the cotton anti-sexy of the underpinning world, with its noticeable seams and overtly full-coverage silhouette',
                    url: 'blog-article.html'
                }, {
                    title: 'Or a little pantaloon, while maybe not sexy, can be really pretty and sweet',
                    url: 'blog-article.html'
                }];

                // if true, ajax loading will never run again
                var noMorePosts = true;

                callback(newPosts, noMorePosts);
            }, 1200);
        }
    }
};

/*------------------------------------------------------------------

  Utility

-------------------------------------------------------------------*/
var $ = jQuery;
var $wnd = $(window);
var $doc = $(document);
var $body = $('body');
var tween = window.TweenMax;
var isIOs = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
var isMobile = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/g.test(navigator.userAgent || navigator.vendor || window.opera);
var isTouch = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;

// check if current page have Umbrella layout
function isUmbrellaLayout() {
    var $context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $doc;

    return $context.find('.nk-main, nk-layout, .nk-blog').length;
}

// add 'is-mobile' or 'is-desktop' classname to html tag
$('html').addClass(isMobile ? 'is-mobile' : 'is-desktop');

/**
 * window size
 */
var wndW = 0;
var wndH = 0;
var docH = 0;
function getWndSize() {
    wndW = $wnd.width();
    wndH = $wnd.height();
    docH = $doc.height();
}
getWndSize();
$wnd.on('resize load orientationchange', getWndSize);

/**
 * Debounce resize
 */
var resizeArr = [];
var resizeTimeout = void 0;
$wnd.on('load resize orientationchange', function (e) {
    if (resizeArr.length) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function () {
            for (var k = 0; k < resizeArr.length; k++) {
                resizeArr[k](e);
            }
        }, 50);
    }
});
function _debounceResize(func) {
    if (typeof func === 'function') {
        resizeArr.push(func);
    } else {
        // in IE <= 11 this method is not supported
        if (typeof Event === 'function') {
            window.dispatchEvent(new Event('resize'));
        } else {
            var evt = window.document.createEvent('UIEvents');
            evt.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(evt);
        }
    }
}

/**
 * Throttle scroll
 * thanks: https://jsfiddle.net/mariusc23/s6mLJ/31/
 */
var hideOnScrollList = [];
var didScroll = void 0;
var lastST = 0;

$wnd.on('scroll load resize orientationchange', function () {
    if (hideOnScrollList.length) {
        didScroll = true;
    }
});

function hasScrolled() {
    var ST = $wnd.scrollTop();

    var type = ''; // [up, down, end, start]

    if (ST > lastST) {
        type = 'down';
    } else if (ST < lastST) {
        type = 'up';
    } else {
        type = 'none';
    }

    if (ST === 0) {
        type = 'start';
    } else if (ST >= docH - wndH) {
        type = 'end';
    }

    for (var k in hideOnScrollList) {
        if (typeof hideOnScrollList[k] === 'function') {
            hideOnScrollList[k](type, ST, lastST, $wnd);
        }
    }

    lastST = ST;
}

setInterval(function () {
    if (didScroll) {
        didScroll = false;
        window.requestAnimationFrame(hasScrolled);
    }
}, 250);

function _throttleScroll(callback) {
    hideOnScrollList.push(callback);
}

/**
 * Body Overflow
 * Thanks https://jsfiddle.net/mariusc23/s6mLJ/31/
 * Usage:
 *    // enable
 *    bodyOverflow(1);
 *
 *    // disable
 *    bodyOverflow(0);
 */
var bodyOverflowEnabled = void 0;
var isBodyOverflowing = void 0;
var scrollbarWidth = void 0;
var originalBodyPadding = void 0;
var $headerContent = $('.nk-header > *');
function bodyGetScrollbarWidth() {
    // thx d.walsh
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'nk-body-scrollbar-measure';
    $body[0].appendChild(scrollDiv);
    var result = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    $body[0].removeChild(scrollDiv);
    return result;
}
function bodyCheckScrollbar() {
    var fullWindowWidth = window.innerWidth;
    if (!fullWindowWidth) {
        // workaround for missing window.innerWidth in IE8
        var documentElementRect = document.documentElement.getBoundingClientRect();
        fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
    }
    isBodyOverflowing = $body[0].clientWidth < fullWindowWidth;
    scrollbarWidth = bodyGetScrollbarWidth();
}
function bodySetScrollbar() {
    if (typeof originalBodyPadding === 'undefined') {
        originalBodyPadding = $body[0].style.paddingRight || '';
    }

    if (isBodyOverflowing) {
        $body.add($headerContent).css('paddingRight', scrollbarWidth + 'px');
    }
}
function bodyResetScrollbar() {
    $body.css('paddingRight', originalBodyPadding);
    $headerContent.css('paddingRight', '');
}
function _bodyOverflow(enable) {
    if (enable && !bodyOverflowEnabled) {
        bodyOverflowEnabled = 1;
        bodyCheckScrollbar();
        bodySetScrollbar();
        $body.css('overflow', 'hidden');
    } else if (!enable && bodyOverflowEnabled) {
        bodyOverflowEnabled = 0;
        $body.css('overflow', '');
        bodyResetScrollbar();
    }
}

/**
 * In Viewport checker
 * return visible percent from 0 to 1
 */
function _isInViewport($item, returnRect) {
    var rect = $item[0].getBoundingClientRect();
    var result = 1;

    if (rect.right <= 0 || rect.left >= wndW) {
        result = 0;
    } else if (rect.bottom < 0 && rect.top <= wndH) {
        result = 0;
    } else {
        var beforeTopEnd = Math.max(0, rect.height + rect.top);
        var beforeBottomEnd = Math.max(0, rect.height - (rect.top + rect.height - wndH));
        var afterTop = Math.max(0, -rect.top);
        var beforeBottom = Math.max(0, rect.top + rect.height - wndH);
        if (rect.height < wndH) {
            result = 1 - (afterTop || beforeBottom) / rect.height;
        } else {
            if (beforeTopEnd <= wndH) {
                result = beforeTopEnd / wndH;
            } else if (beforeBottomEnd <= wndH) {
                result = beforeBottomEnd / wndH;
            }
        }
        result = result < 0 ? 0 : result;
    }
    if (returnRect) {
        return [result, rect];
    }
    return result;
}

/**
 * Scroll To
 */
function _scrollTo($to, callback) {
    var scrollPos = false;
    var speed = this.options.scrollToAnchorSpeed / 1000;

    if ($to === 'top') {
        scrollPos = 0;
    } else if ($to === 'bottom') {
        scrollPos = Math.max(0, docH - wndH);
    } else if (typeof $to === 'number') {
        scrollPos = $to;
    } else {
        scrollPos = $to.offset ? $to.offset().top : false;
    }

    if (scrollPos !== false && $wnd.scrollTop() !== scrollPos) {
        tween.to($wnd, speed, {
            scrollTo: {
                y: scrollPos,
                autoKill: true
            },
            ease: Power2.easeOut,
            autoKill: true,
            overwrite: 5
        });
        if (callback) {
            tween.delayedCall(speed, callback);
        }
    } else if (typeof callback === 'function') {
        callback();
    }
}

/*------------------------------------------------------------------

  Set Custom Options

-------------------------------------------------------------------*/
function _setOptions(newOpts) {
    var self = this;

    var optsEvents = $.extend({}, this.options.events, newOpts && newOpts.events || {});
    self.options = $.extend({}, self.options, newOpts);
    self.options.events = optsEvents;
}

/*------------------------------------------------------------------

 Update Brightness

 -------------------------------------------------------------------*/
var timeout = void 0;
var $targets = $('.nk-layout').find('.nk-layout-top-left, .nk-layout-top-left-rotated, .nk-layout-top-center, .nk-layout-top-right, .nk-layout-bottom-left, .nk-layout-bottom-right, .nk-layout-bottom-center, .nk-layout-content-subtitle, .nk-layout-content-tagline');
var $logo = $('.nk-layout [data-logo-dark]');
$logo.attr('data-logo-light', $logo.attr('src'));
if (isUmbrellaLayout()) {
    BackgroundCheck.init({
        //debug: true,
        targets: $targets.add($logo),
        images: $('img:not([data-logo-light], [data-logo-dark]), div, body'),
        minComplexity: 0,
        maxDuration: 1000,
        threshold: 60,
        classes: {
            dark: 'text-white',
            light: 'text-dark',
            complex: 'text-white'
        },
        callback: function callback(elem, result, complex) {
            if ($logo.is(elem)) {
                if (result === 'dark') {
                    $logo.attr('src', $logo.attr('data-logo-light'));
                } else {
                    $logo.attr('src', $logo.attr('data-logo-dark'));
                }
            }
        }
    });
}
function _updateBrightness() {
    var recheck = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    if (!isUmbrellaLayout()) {
        return;
    }

    clearTimeout(timeout);

    // recheck
    if (recheck) {
        BackgroundCheck.set('images', $('img:not([data-logo-light], [data-logo-dark]), div, body'));
        return;
    }

    timeout = setTimeout(function () {
        if (typeof BackgroundCheck !== 'undefined') {
            BackgroundCheck.refresh();
        }
    }, 100);
}

/*------------------------------------------------------------------

 Run Preloader
 type = page, blog

 -------------------------------------------------------------------*/
var $spinnerPlace = $('.nk-loading-spinner-place');
var $preloader = $('<div class="nk-preloader">').appendTo($body);
var spinner = '<div class="nk-spinner"><span></span></div>';
var blogSpinnerInSpinnerPlace = 0;

function _runPreloader() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'page';

    var self = this;

    // show overlay
    $preloader.show();

    // show blog spinner like normal ajax spinner on mobile devices
    blogSpinnerInSpinnerPlace = type === 'blog' && wndW <= self.options.mobile;

    if (type === 'blog' && !blogSpinnerInSpinnerPlace) {
        self.updateBlogPageIndicator(spinner);
    } else {
        $spinnerPlace.html(spinner);
    }
}
function _stopPreloader() {
    var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'page';

    var self = this;

    // hide overlay
    $preloader.hide();

    if (type === 'blog' && !blogSpinnerInSpinnerPlace) {
        self.updateBlogPageIndicator();
    } else {
        $spinnerPlace.html('');
        blogSpinnerInSpinnerPlace = 0;
    }
}

/*------------------------------------------------------------------

 Init AJAX Page Loading

 -------------------------------------------------------------------*/
function _initPages() {
    var self = this;
    var $layout = $('.nk-layout:eq(0)');
    var $main = $('.nk-main');
    var $mainBg = $main.next('.nk-main-bg');
    var $blog = $('.nk-blog');

    // current page data (with dynamic changed titles). Available data see in generatePageData function
    var cur = {};

    // default page data (current loaded page data without dynamic changes). Available data see in generatePageData function
    var def = {};

    // set default page data
    self.setDefaultPageData = function () {
        var newDef = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        def = $.extend(def, newDef);
    };

    // get default page data
    self.getDefaultPageData = function () {
        return $.extend(true, {}, def);
    };

    // set current page data
    self.setCurrentPageData = function () {
        var newCur = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        cur = $.extend(cur, newCur);
    };

    // get current page data
    self.getCurrentPageData = function () {
        return $.extend(true, {}, cur);
    };

    // generate page data from dom
    self.generatePageData = function () {
        var $href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : location.href;
        var $page = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : $doc;

        var $layout = $page.find('.nk-layout:eq(0)');
        var $main = $page.find('.nk-main:eq(0)');
        var $blog = $page.find('.nk-blog:eq(0)');
        var $slider = $layout.find('.nk-slider');
        var $sliderNav = $page.find('.nk-slider-nav');

        return {
            $page_html: $page.prop('outerHTML') || $page.prop('innerHTML'),

            href: $href,
            title: $page.find('title:eq(0)').text() || document.title,
            pageTitle: $layout.find('.nk-layout-content-title').html(),
            pageSubtitle: $layout.find('.nk-layout-content-subtitle').html(),
            pageTagline: $layout.find('.nk-layout-content-tagline').html(),

            slider: $slider,
            sliderCategory: $slider.attr('data-active-category'),
            sliderTransitionSpeed: $slider.attr('data-transition-speed'),
            sliderTransitionEffect: $slider.attr('data-transition-effect'),
            sliderCategoryTransitionSpeed: $slider.attr('data-category-transition-speed'),
            sliderCategoryTransitionEffect: $slider.attr('data-category-transition-effect'),
            sliderAutoplay: $slider.attr('data-autoplay'),
            sliderForceReload: $slider.attr('data-force-reload'),
            sliderHideTitles: $slider.hasClass('nk-slider-hide-titles'),
            sliderNavSlim: $sliderNav.hasClass('nk-slider-nav-slim'),

            navTopCenterShow: !$layout.find('.nk-layout-top-center .nk-nav-hide').length,
            navTopLeftShow: !$layout.find('.nk-layout-top-left-rotated .nk-nav-hide').length,
            navBottomLeftShow: !$layout.find('.nk-layout-bottom-left .nk-nav-hide').length,
            navBottomLeftBlogShow: !$layout.find('.nk-layout-bottom-left-blog .nk-nav-hide').length,
            navBottomCenterShow: !$layout.find('.nk-layout-bottom-center .nk-nav-hide').length,

            contentHTML: $main.html(),
            contentShow: $main.hasClass('active'),
            contentLowerTitle: $main.hasClass('nk-main-lower-title'),
            contentTransitionIn: $main.attr('data-transition-in'),
            contentTransitionOut: $main.attr('data-transition-out'),
            contentCustomColor: $main.attr('data-color') || false,
            contentCustomBg: $main.next('.nk-main-bg').attr('data-bg') || false,
            contentCustomBgMobile: $main.next('.nk-main-bg').attr('data-bg-mobile') || false,

            blog: $blog,
            blogShow: $blog.hasClass('active')
        };
    };

    // show / hide blog
    function toggleBlog() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (def.blogShow && !cur.blogShow) {
            $blog.addClass('active');

            var posts = [];
            def.blog.find('> .nk-blog-item a').each(function () {
                posts.push({
                    title: $(this).text(),
                    url: $(this).attr('href')
                });
            });

            self.pushNewPosts(posts, true);
            self.showBlogPostsList(callback);
        } else if (cur.blogShow && !def.blogShow) {
            $blog.removeClass('active');
            self.hideBlogPostsList(callback);

            // regenerate slider navigation
            self.sliderCreateNavigation(function () {
                self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
            });
        } else {
            callback();
        }
    }

    // update content text and background colors
    var contentColorsStyles = false;
    function updateContentColors() {
        if (!contentColorsStyles) {
            contentColorsStyles = document.createElement('style');
            contentColorsStyles.setAttribute('type', 'text/css');
            contentColorsStyles.setAttribute('id', '#umbrella-content-styles');
            var head = document.head || document.getElementsByTagName('head')[0];
            head.appendChild(contentColorsStyles);
        }

        var styles = [];

        if (def.contentCustomColor) {
            styles.push('.nk-main {', '   color: ' + def.contentCustomColor + ';', '}');
        }
        if (def.contentCustomBg) {
            styles.push('.nk-main + .nk-main-bg {', '   background-color: ' + def.contentCustomBg + ';', '}');
        }
        if (def.contentCustomBgMobile) {
            styles.push('@media (max-width: ' + self.options.mobile + 'px) {', '.nk-main + .nk-main-bg {', '   background-color: ' + def.contentCustomBgMobile + ';', '}', '}');
        }

        styles = styles.join('\n');

        // add clip styles inline (this method need for support IE8 and less browsers)
        if (contentColorsStyles.styleSheet) {
            contentColorsStyles.styleSheet.cssText = styles;
        } else {
            contentColorsStyles.innerHTML = styles;
        }
    }

    // update content text
    function updateContent() {
        var animate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        var $content = $(def.contentHTML);
        var $mainNano = $main.find('.nano-content');
        var $mainLayout = $main.find('.nk-layout');

        // animate
        if (animate) {
            // hide layout title
            tween.to($mainLayout, 0.3, {
                opacity: 0,
                onComplete: function onComplete() {
                    $mainLayout.html($content.filter('.nk-layout').html());
                    tween.to($mainLayout, 0.3, {
                        opacity: 1
                    });
                }
            });

            // hide content
            tween.to($mainNano, 0.3, {
                opacity: 0,
                force3D: true,
                onComplete: function onComplete() {
                    $mainNano.html($content.find('.nano-content').html());
                    $main[(def.contentLowerTitle ? 'add' : 'remove') + 'Class']('nk-main-lower-title');

                    updateContentColors();
                    self.initForms();

                    // show content
                    tween.to($mainNano, 0.3, {
                        opacity: 1,
                        force3D: true,
                        onComplete: function onComplete() {
                            $content.remove();
                            $content = null;
                            $mainNano = null;
                            $mainLayout = null;
                            _debounceResize();
                        }
                    });
                }
            });
        }

        // no animate
        else {
                $mainNano.html($content.find('.nano-content').html());
                $mainLayout.html($content.filter('.nk-layout').html());
                $main[(def.contentLowerTitle ? 'add' : 'remove') + 'Class']('nk-main-lower-title');

                updateContentColors();
                self.initForms();

                $content.remove();
                $content = null;
                $mainNano = null;
                $mainLayout = null;
                _debounceResize();
            }
    }

    // show / hide content
    function toggleContent() {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        $main.attr('data-transition-in', def.contentTransitionIn);
        $main.attr('data-transition-out', def.contentTransitionOut);

        // show new content
        if (def.contentShow && def.contentHTML != cur.contentHTML) {
            // hide old container and show new
            if (def.contentLowerTitle !== cur.contentLowerTitle) {
                self.hideContent(function () {
                    // remove transition from background
                    $mainBg.css('transition', 'none');

                    // update content
                    updateContent();

                    // restore transition
                    $mainBg.css('transition', '');

                    // show new content
                    self.showContent(callback);
                });
            }

            // only hide and show content inside container
            else if (cur.contentShow === def.contentShow) {
                    // hide navbar
                    self.hideNavbar();

                    updateContent(true);
                    self.updateBrightness();

                    callback();
                }

                // update content and show container
                else if (def.contentShow) {
                        updateContent();
                        self.showContent(callback);
                    }
        } else {
            // hide content
            self.hideContent(function () {
                updateContent();

                // hide navbar
                self.hideNavbar();

                callback();
            });
        }
    }

    // activate / deactivate menu items
    function updateMenuItems() {
        $('.nk-nav ul:not(.nk-slider-categories) > li > a').each(function () {
            var $li = $(this).parent('li');
            if (this.href === def.href) {
                $li.addClass('active');
            } else {
                $li.removeClass('active');
            }
        });
    }

    // check if currently in page loading queue
    var pageLoading = false;
    self.isInPageLoadQueue = function () {
        return pageLoading;
    };

    // show default page data
    self.showDefaultPageData = function () {
        var effect = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'right';

        // update items when new href
        if (cur.href === def.href) {
            return;
        }

        pageLoading = true;

        // regenerate slider
        self.sliderRegenerate({
            slider: def.slider,
            activeCategory: def.sliderCategory,
            transitionSpeed: def.sliderTransitionSpeed,
            transitionEffect: def.sliderTransitionEffect,
            categoryTransitionSpeed: def.sliderCategoryTransitionSpeed,
            categoryTransitionEffect: def.sliderCategoryTransitionEffect,
            autoplay: def.sliderAutoplay,
            forceReload: def.sliderForceReload,
            hideTitles: def.sliderHideTitles
        }, function () {
            // change slider navigation style
            $('.nk-slider-nav')[(def.sliderNavSlim ? 'add' : 'remove') + 'Class']('nk-slider-nav-slim');
        });
        if (def.blogShow || cur.blogShow) {
            // change slider navigation style
            $('.nk-slider-nav')[(def.sliderNavSlim ? 'add' : 'remove') + 'Class']('nk-slider-nav-slim');
        }

        // show / hide navigations
        $layout.find('.nk-layout-top-center .nk-nav')[(def.navTopCenterShow ? 'remove' : 'add') + 'Class']('nk-nav-hide');
        $layout.find('.nk-layout-top-left-rotated .nk-nav')[(def.navTopLeftShow ? 'remove' : 'add') + 'Class']('nk-nav-hide');
        $layout.find('.nk-layout-bottom-left .nk-nav')[(def.navBottomLeftShow ? 'remove' : 'add') + 'Class']('nk-nav-hide');
        $layout.find('.nk-layout-bottom-left-blog .nk-nav')[(def.navBottomLeftBlogShow ? 'remove' : 'add') + 'Class']('nk-nav-hide');
        $layout.find('.nk-layout-bottom-center .nk-nav')[(def.navBottomCenterShow ? 'remove' : 'add') + 'Class']('nk-nav-hide');

        // show blog
        if (def.blogShow && !cur.blogShow) {
            toggleContent(function () {
                // show layout titles
                self.showTitle(def.pageTitle, effect);
                self.showSubtitle(def.pageSubtitle);
                self.showTagline(def.pageTagline);

                toggleBlog();

                self.updateBrightness(true);

                updateMenuItems();
                self.setCurrentPageData(self.getDefaultPageData());

                pageLoading = false;
            });
        }
        // hide blog
        else {
                toggleBlog(function () {
                    // show layout titles
                    self.showTitle(def.pageTitle, effect);
                    self.showSubtitle(def.pageSubtitle);
                    self.showTagline(def.pageTagline);

                    toggleContent(function () {
                        self.updateBrightness(true);
                        updateMenuItems();
                        self.setCurrentPageData(self.getDefaultPageData());
                        pageLoading = false;
                    });
                });
            }
    };

    /**
     * AJAX Page Loading
     */
    var xhr = {};

    // Return the `href` component of given URL object with the hash portion removed.
    function stripHash(href) {
        return href.replace(/#.*/, '');
    }

    // cache pages
    var cache = {};
    function setCache() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (!key || !data || cache[key]) {
            return;
        }
        cache[key] = data;
    }
    function getCache() {
        var key = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!key || !cache[key]) {
            return false;
        }
        return cache[key];
    }

    // render new page from cache
    function renderNewPageFromCache(data) {
        // store data
        self.setDefaultPageData(data);

        // show new data
        self.showDefaultPageData();

        // callback
        if (typeof self.options.events.onAfterAjaxPageLoad !== 'undefined') {
            self.options.events.onAfterAjaxPageLoad(self.getDefaultPageData());
        }
    }

    // parse and render new page content
    function renderNewPage() {
        var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var $newHTML = arguments[1];

        // store data
        self.setDefaultPageData(self.generatePageData(href, $newHTML));

        // save page cache
        setCache(href, self.getDefaultPageData());

        // show new data
        self.showDefaultPageData();

        // callback
        if (typeof self.options.events.onAfterAjaxPageLoad !== 'undefined') {
            self.options.events.onAfterAjaxPageLoad(self.getDefaultPageData());
        }
    }

    // load new page
    function loadPage() {
        var href = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        var clicked = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        var currentPageData = self.getDefaultPageData();

        // stop when the same urls
        if (!href || stripHash(href) == stripHash(currentPageData.href)) {
            return;
        }

        // return cached version
        var cached = getCache(href);
        if (cached) {
            renderNewPageFromCache(cached);

            // push state for new page
            if (clicked && typeof History !== 'undefined' && self.options.ajax) {
                History.pushState(null, cached.title, href);
            }
            return;
        }

        // stop previous request
        if (xhr && xhr.abort) {
            xhr.abort();
            xhr = {};
        }

        // new ajax request
        self.runPreloader();
        xhr = $.ajax({
            url: href,
            success: function success(responseHtml) {
                if (!responseHtml) {
                    location = href;
                    return;
                }

                var $newHTML = $('<div>').html(responseHtml);
                var title = $newHTML.find('title:eq(0)').text() || document.title;

                // check for Umbrella layout
                if (!isUmbrellaLayout($newHTML)) {
                    location = href;
                    return;
                }

                // render new content
                renderNewPage(href, $newHTML);

                // push state for new page
                if (typeof History !== 'undefined' && self.options.ajax) {
                    History.pushState(null, title, href);
                }

                // remove stored data
                $newHTML.remove();
                $newHTML = null;

                self.stopPreloader();
            },
            error: function error(msg) {
                if (msg.status !== 0) {
                    console.log('error', msg);
                } else {
                    location = href;
                }

                self.stopPreloader();
            }
        });
    }

    // first run
    self.setDefaultPageData(self.generatePageData());
    self.setCurrentPageData(self.getDefaultPageData());
    setCache(cur.href, self.getCurrentPageData());

    // update content colors
    $mainBg.css('transition', 'none');
    updateContentColors();
    $mainBg.css('transition', '');

    if (!isUmbrellaLayout()) {
        return;
    }

    // click on links
    $doc.on('click', 'a:not(.no-ajax):not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="javascript:"])', function (e) {
        var link = e.currentTarget;

        // Stop if AJAX is not supported
        if (!self.options.ajax) {
            return;
        }

        // Middle click, cmd click, and ctrl click should open
        // links in a new tab as normal.
        if (e.which > 1 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
            return;
        }

        // Ignore cross origin links
        if (location.protocol !== link.protocol || location.hostname !== link.hostname) {
            return;
        }

        // Ignore case when a hash is being tacked on the current URL
        var currentPageData = self.getDefaultPageData();
        if (link.href.indexOf('#') > -1 && stripHash(link.href) == stripHash(currentPageData.href)) {
            return;
        }

        // Ignore if local file protocol
        if (window.location.protocol === 'file:') {
            return;
        }

        // Ignore e with default prevented
        if (e.isDefaultPrevented()) {
            return;
        }

        // Check for function in options
        if (typeof self.options.events.onBeforeAjaxPageLoad !== 'undefined' && self.options.events.onBeforeAjaxPageLoad(e)) {
            return;
        }

        e.preventDefault();

        loadPage(link.href, true);
    });

    // on state change
    if (typeof History !== 'undefined' && self.options.ajax) {
        History.Adapter.bind(window, 'statechange', function (e) {
            loadPage(History.getState().url);
            History.replaceState(null, document.title, History.getState().url);
        });
    }
}

/*------------------------------------------------------------------

 Init Pages Titles

 -------------------------------------------------------------------*/
function _initPageTitles() {
    var self = this;
    var $layout = $('.nk-layout:eq(0)');
    var $title = $layout.find('.nk-layout-content-title');
    var $subtitle = $layout.find('.nk-layout-content-subtitle');
    var $tagline = $layout.find('.nk-layout-content-tagline');
    var $main = $('.nk-main:eq(0)');

    // create shadow items for transitions
    var $titleShadow = $('<h4>').css('display', 'none').addClass('nk-layout-content-title').insertAfter($title);
    var $subtitleShadow = $('<h4>').css('display', 'none').addClass('nk-layout-content-subtitle').insertAfter($subtitle);
    var $taglineShadow = $('<div>').css('display', 'none').addClass('nk-layout-content-tagline').insertAfter($tagline);

    // show title
    // effects: left, right, fade
    self.showTitle = function () {
        var title = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
        var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'right';

        var cur = self.getCurrentPageData();

        // prevent transition if the same title
        if (cur.pageTitle === title) {
            return;
        }

        var shadowX = effect === 'left' ? '150%' : effect === 'right' ? '-150%' : '0%';
        var X = effect === 'left' ? '-150%' : effect === 'right' ? '150%' : '0%';
        var startOpacity = effect === 'fade' ? 0 : 1;

        cur.pageTitle = title;

        // add new title
        $titleShadow.html(title);

        // transition
        tween.set($titleShadow, {
            x: shadowX,
            opacity: startOpacity,
            display: 'block'
        });
        tween.to($title, 0.7, {
            x: X,
            opacity: startOpacity,
            ease: Power2.easeIn,
            force3D: true
        });
        tween.to($titleShadow, 0.7, {
            x: '0%',
            opacity: 1,
            ease: Power2.easeOut,
            delay: 0.3,
            force3D: true,
            onComplete: function onComplete() {
                // restore titles after effect end
                $title.html(title);
                tween.set($title, {
                    x: '0%',
                    opacity: 1,
                    display: 'block'
                });
                $titleShadow.html('').css('display', 'none');
            }
        });
    };

    // show subtitle
    self.showSubtitle = function () {
        var subtitle = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var cur = self.getCurrentPageData;

        // prevent transition if the same subtitle
        if (cur.pageSubtitle === subtitle) {
            return;
        }

        cur.pageSubtitle = subtitle;

        // add new title
        $subtitleShadow.html(subtitle);

        // transition
        tween.set($subtitleShadow, {
            opacity: 0,
            display: 'block'
        });
        tween.to($subtitle, 0.5, {
            opacity: 0,
            ease: Power0.easeNone,
            delay: 0.3,
            force3D: true
        });
        tween.to($subtitleShadow, 0.5, {
            opacity: 1,
            ease: Power0.easeNone,
            delay: 0.3,
            force3D: true,
            onComplete: function onComplete() {
                // restore titles after effect end
                $subtitle.html(subtitle);
                tween.set($subtitle, {
                    opacity: 1,
                    display: 'block'
                });
                $subtitleShadow.html('').css('display', 'none');
            }
        });
    };

    // show tagline
    self.showTagline = function () {
        var tagline = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

        var cur = self.getCurrentPageData;

        // prevent transition if the same tagline
        if (cur.pageTagline === tagline || !$tagline.is(':visible')) {
            return;
        }

        cur.pageTagline = tagline;

        // add new title
        $taglineShadow.html(tagline);

        // transition
        tween.set($taglineShadow, {
            opacity: 0,
            display: 'block'
        });
        tween.to($tagline, 0.5, {
            opacity: 0,
            ease: Power0.easeNone,
            delay: 0.3,
            force3D: true
        });
        tween.to($taglineShadow, 0.5, {
            opacity: 1,
            ease: Power0.easeNone,
            delay: 0.3,
            force3D: true,
            onComplete: function onComplete() {
                // restore titles after effect end
                $tagline.html(tagline);
                tween.set($tagline, {
                    opacity: 1
                });
                $taglineShadow.html('').css('display', 'none');
            }
        });
    };
}

/* Init Page Slider */
function _initPageSlider($context) {
    var $slider = $('.nk-slider');
    var self = this;

    if (!$slider.length) {
        return;
    }

    // options
    var transitionEffect = $slider.attr('data-transition-effect') || 'fade';
    var transitionSpeed = parseInt($slider.attr('data-transition-speed'), 10) || 600;
    var categoryTransitionEffect = $slider.attr('data-category-transition-effect') || 'top';
    var categoryTransitionSpeed = parseInt($slider.attr('data-category-transition-speed'), 10) || 600;
    var autoplay = parseInt($slider.attr('data-autoplay'), 10) || 0;
    if (autoplay && transitionSpeed >= autoplay) {
        autoplay = transitionSpeed + 100;
    }
    var hideTitles = $slider.hasClass('nk-slider-hide-titles');
    var activeCategory = $slider.attr('data-active-category') || '*';
    var activeCatOnBigScreens = activeCategory;

    var $sliderNav = $('.nk-slider-nav');
    var $sliderNavItemsCont = $sliderNav.children('ul');
    var $sliderCategories = $('.nk-slider-categories');
    var $sliderSlide = $('<div class="nk-slider-current-slide"></div>').css({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
    }).appendTo($slider);
    var $sliderNextSlide = $sliderSlide.clone().removeClass('nk-slider-current-slide').addClass('nk-slider-next-slide').css({
        display: 'none',
        zIndex: 1
    }).appendTo($slider);
    // additional blocks for divide slider transition
    var $sliderNextSlide_2 = $sliderNextSlide.clone().css('display', 'block').removeClass('nk-slider-next-slide').appendTo($sliderNextSlide);
    var $sliderNextSlide_2_inner = $sliderNextSlide_2.clone().appendTo($sliderNextSlide_2);
    var $sliderNextSlide_3 = $sliderNextSlide_2.clone().appendTo($sliderNextSlide);
    var $sliderNextSlide_3_inner = $sliderNextSlide_3.children('div');
    var $sliderVideoSlide = $('<div>').css('position', 'relative');
    $('<div class="nk-slider-video-slide"></div>').css({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2
    }).append($sliderVideoSlide).appendTo($slider);
    var slides = [];
    var busy = 0;

    // on load image
    var cachedImages = {};
    function onImageLoad(src, callback) {
        if (!src) {
            return;
        }

        // save cache
        if (cachedImages[src]) {
            if (callback) {
                callback();
            }
            return;
        }

        // check for image loaded
        var tempImg = new Image();
        tempImg.onload = function () {
            cachedImages[src] = true;
            if (callback) {
                callback();
            }
        };
        tempImg.src = src;
    }

    // parse slides
    self.sliderParseSlides = function () {
        var $instance = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : $slider;

        var slides = [];
        var i = 0;
        $instance.find('.nk-slider-item').each(function () {
            slides.push({
                index: i++,
                active: $(this).hasClass('active'),
                src: $(this).find('img').attr('src'),
                categories: ($(this).attr('data-categories') || '').split('|'),
                backgroundPosition: $(this).attr('data-background-position') || '50% 50%',
                videoBackground: $(this).find('[data-bg-video]').attr('data-bg-video'),
                videoBackgroundSize: $(this).find('[data-bg-video-size]').attr('data-bg-video-size') || '16x9'
            });
        });
        return slides;
    };

    // get available slides
    self.sliderGetSlides = function () {
        var specific_cat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : activeCategory;

        var result = [];
        for (var k in slides) {
            var item = slides[k];
            if (item.categories && item.categories.length) {
                for (var _i in item.categories) {
                    var cat = item.categories[_i];
                    if (cat === specific_cat || cat === '*' || specific_cat === '*') {
                        result.push(item);
                        break;
                    }
                }
            }
        }
        return result;
    };

    // get current slide
    self.sliderGetCurrentSlide = function () {
        var slides = self.sliderGetSlides();
        for (var k in slides) {
            var item = slides[k];
            if (item.active) {
                return item;
            }
        }

        // if there is no active slide, return first
        if (slides[0]) {
            slides[0].active = true;
            return slides[0];
        }

        return false;
    };

    // get slide index in current activated category
    self.sliderGetSlideRealIndex = function (checkSlide) {
        var i = 0;
        var slides = self.sliderGetSlides();
        for (var k in slides) {
            var item = slides[k];
            if (item.index === checkSlide.index) {
                return i;
            }
            i++;
        }
        return 0;
    };

    self.sliderActivateCategory = function (name) {
        if (busy) {
            return;
        }

        activeCatOnBigScreens = name;
        if (self.options.sliderShowAllCategoriesOnMobile && wndW <= self.options.mobile) {
            activeCategory = '*';
        } else {
            activeCategory = name;
        }

        // activate current category
        $sliderCategories.find('.active').removeClass('active');
        $sliderCategories.find('[data-category="' + activeCategory + '"]').addClass('active');
    };

    // create categories
    self.sliderCreateCategories = function () {
        var allSlides = self.sliderGetSlides('*');

        // categories
        var catNav = '';
        var categories = {};
        for (var k in allSlides) {
            var slide = allSlides[k];
            for (var _i2 in slide.categories) {
                var cat = slide.categories[_i2];
                if (!categories[cat] && cat !== '*') {
                    categories[cat] = 1;
                    catNav += '<li data-category="' + cat + '"><a href="javascript:void(0)">' + cat + '</a></li>';
                }
            }
        }
        $sliderCategories.html(catNav);
    };

    // prepare slider structure
    self.sliderCreateNavigation = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (self.getDefaultPageData().blogShow) {
            return;
        }

        var slides = self.sliderGetSlides();

        // navigation
        var nav = '';
        for (var k in slides) {
            nav += '<li data-slide="' + k + '">' + (k >= 9 ? '' : '0') + (parseInt(k, 10) + 1) + '</li>';
        }

        // transition if there are nav items
        tween.to($sliderNavItemsCont, 0.3, {
            opacity: 0,
            force3D: true,
            onComplete: function onComplete() {
                $sliderNavItemsCont.html(nav);
                tween.to($sliderNavItemsCont, 0.3, {
                    opacity: 1,
                    force3D: true
                });
                callback();
            }
        });
    };

    // activate item in navigation
    self.sliderActivateNavigationItem = function (index) {
        if (self.getDefaultPageData().blogShow) {
            return;
        }
        $sliderNavItemsCont.find('.active').removeClass('active');
        $sliderNavItemsCont.find('li:eq(' + index + ')').addClass('active');
    };

    // correct video background size and position
    var curVideoSize = '16x9';
    self.sliderCorrectVideo = function () {
        // video size
        var vW = parseFloat(curVideoSize.split('x')[0]);
        var vH = parseFloat(curVideoSize.split('x')[1]);

        var styles = {};

        if (wndW / vW > wndH / vH) {
            styles = {
                width: wndW,
                height: vH * wndW / vW,
                marginTop: (wndH - vH * wndW / vW) / 2,
                marginLeft: 0
            };
        } else {
            styles = {
                width: vW * wndH / vH,
                height: wndH,
                marginTop: 0,
                marginLeft: (wndW - vW * wndH / vH) / 2
            };
        }

        // hide progress bar
        styles.marginTop -= 220;
        styles.height += 440;

        $sliderVideoSlide.css(styles);
    };
    _debounceResize(function () {
        self.sliderCorrectVideo();
    });

    // run video background
    self.sliderPlayVideo = function () {
        var slide = self.sliderGetCurrentSlide();
        var videoSrc = slide.videoBackground;
        var videoSize = slide.videoBackgroundSize;

        if (!videoSrc || typeof VideoWorker === 'undefined') {
            return;
        }

        var video = new VideoWorker(videoSrc, {
            autoplay: true,
            loop: true,
            volume: 0,
            mute: true
        });

        if (video.isValid()) {
            curVideoSize = videoSize;

            self.sliderCorrectVideo();

            video.on('started', function () {
                tween.set(this.$video, {
                    left: 0
                });
                tween.to(this.$video, 0.5, {
                    opacity: 1,
                    display: 'block',
                    force3D: true
                });
                self.sliderCorrectVideo();
            });

            video.getIframe(function (iframe) {
                var $iframe = $(iframe);
                var $parent = $iframe.parent();

                $sliderVideoSlide.append($iframe);

                // remove parent iframe element (created by VideoWorker)
                $parent.remove();

                self.sliderCorrectVideo();
            });
        }
    };

    // stop video background
    self.sliderStopVideo = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        // hide old video
        var $videoParent = $sliderVideoSlide.children();
        if ($videoParent.length) {
            tween.to($videoParent, 0.5, {
                opacity: 0,
                force3D: true,
                onComplete: function onComplete() {
                    $videoParent.remove();
                    callback();
                }
            });
        } else {
            callback();
        }
    };

    // run autoplay
    var autoplayInterval = void 0;
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    function runAutoplay() {
        stopAutoplay();
        autoplayInterval = setInterval(function () {
            window.requestAnimationFrame(self.sliderShowNext);
        }, autoplay);
    }

    // show slide by index
    // available effects: fade, divide, top, left, right, bottom
    var hideTitlesCount = 0;
    self.sliderShowSlide = function (index) {
        var effect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : transitionEffect;
        var speed = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : transitionSpeed;
        var force = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (self.getDefaultPageData().blogShow && !force) {
            return;
        }

        var slides = self.sliderGetSlides();
        if (typeof slides[index] === 'undefined' || busy) {
            return;
        }
        busy = 1;

        // stop autoplay
        if (autoplay) {
            stopAutoplay();
        }

        self.sliderStopVideo(function () {
            onImageLoad(slides[index].src, function () {
                // update slides array
                self.sliderGetCurrentSlide().active = false;
                slides[index].active = true;

                // activate current nav item
                self.sliderActivateNavigationItem(index);

                // hide titles
                if (hideTitles) {
                    hideTitlesCount++;

                    if (hideTitlesCount > 1) {
                        self.showTitle('', 'fade');
                        self.showSubtitle('');
                        self.showTagline('');
                    }
                } else {
                    hideTitlesCount = 0;
                }

                var prevUrl = $sliderSlide.css('background-image');
                var prevBGPosition = $sliderSlide.css('background-position');

                // transition effect
                switch (effect) {
                    case 'top':
                    case 'left':
                    case 'right':
                    case 'bottom':
                        var y = '-100%';
                        var x = '0%';

                        switch (effect) {
                            case 'left':
                                y = '0%';
                                x = '-100%';
                                break;
                            case 'right':
                                y = '0%';
                                x = '100%';
                                break;
                            case 'bottom':
                                y = '100%';
                                x = '0%';
                                break;
                        }

                        tween.set($sliderNextSlide, {
                            opacity: 1,
                            y: '0%',
                            x: '0%',
                            display: 'block'
                        });
                        $sliderNextSlide.css({
                            backgroundImage: prevUrl,
                            backgroundPosition: prevBGPosition
                        });
                        $sliderSlide.css({
                            backgroundImage: 'url(\'' + slides[index].src + '\')',
                            backgroundPosition: slides[index].backgroundPosition
                        });
                        tween.set($sliderSlide, {
                            opacity: 0,
                            scale: 1.3
                        });
                        tween.to($sliderNextSlide, speed / 1000, {
                            y: y,
                            x: x,
                            force3D: true,
                            ease: Power1.easeIn,
                            onComplete: function onComplete() {
                                tween.set($sliderNextSlide, {
                                    opacity: 0,
                                    y: '0%',
                                    display: 'none'
                                });
                            }
                        });
                        tween.to($sliderSlide, 1.3 * speed / 1000, {
                            opacity: 1,
                            scale: 1,
                            force3D: true,
                            ease: Power1.easeOut,
                            onComplete: function onComplete() {
                                busy = 0;

                                // start autoplay
                                if (autoplay) {
                                    runAutoplay();
                                }

                                // force reload brightness for layout texts
                                self.updateBrightness(1);

                                // run video
                                self.sliderPlayVideo();
                            }
                        });
                        break;
                    case 'divide':
                        // place current image on left and right side of transition
                        $sliderNextSlide_2.css({
                            right: '50%',
                            overflow: 'hidden'
                        });
                        $sliderNextSlide_3.css({
                            left: '50%',
                            overflow: 'hidden'
                        });
                        $sliderNextSlide_2_inner.css({
                            right: 'auto',
                            width: '200%',
                            backgroundImage: prevUrl,
                            backgroundPosition: prevBGPosition
                        });
                        $sliderNextSlide_3_inner.css({
                            left: 'auto',
                            width: '200%',
                            backgroundImage: prevUrl,
                            backgroundPosition: prevBGPosition
                        });
                        tween.set($sliderNextSlide_2, {
                            x: '0%'
                        });
                        tween.set($sliderNextSlide_3, {
                            x: '0%'
                        });
                        tween.set($sliderNextSlide, {
                            opacity: 1,
                            x: '0%',
                            y: '0%',
                            display: 'block'
                        });

                        // set new background image to next slide
                        $sliderSlide.css({
                            backgroundImage: 'url(\'' + slides[index].src + '\')',
                            backgroundPosition: slides[index].backgroundPosition
                        });
                        $sliderNextSlide.css({
                            backgroundImage: 'none'
                        });

                        tween.set($sliderSlide, {
                            opacity: 0,
                            scale: 1.3
                        });

                        // start transition
                        tween.to($sliderSlide, 1.3 * speed / 1000, {
                            opacity: 1,
                            scale: 1,
                            force3D: true,
                            ease: Power1.easeOut,
                            onComplete: function onComplete() {
                                busy = 0;

                                // start autoplay
                                if (autoplay) {
                                    runAutoplay();
                                }

                                // force reload brightness for layout texts
                                self.updateBrightness(1);

                                // run video
                                self.sliderPlayVideo();
                            }
                        });
                        tween.to($sliderNextSlide_2, speed / 1000, {
                            x: '-100%',
                            force3D: true,
                            ease: Power2.easeIn
                        });
                        tween.to($sliderNextSlide_3, speed / 1000, {
                            x: '100%',
                            force3D: true,
                            ease: Power2.easeIn,
                            onComplete: function onComplete() {
                                tween.set($sliderNextSlide, {
                                    opacity: 0,
                                    display: 'none'
                                });
                            }
                        });

                        break;
                    default:
                        // fade
                        tween.set($sliderNextSlide, {
                            opacity: 0,
                            x: '0%',
                            y: '0%',
                            display: 'block'
                        });
                        $sliderNextSlide.css({
                            backgroundImage: 'url(\'' + slides[index].src + '\')',
                            backgroundPosition: slides[index].backgroundPosition
                        });
                        tween.to($sliderNextSlide, speed / 1000, {
                            opacity: 1,
                            force3D: true,
                            ease: Power0.easeNone,
                            onComplete: function onComplete() {
                                $sliderSlide.css({
                                    backgroundImage: 'url(\'' + slides[index].src + '\')',
                                    backgroundPosition: slides[index].backgroundPosition
                                });
                                tween.set($sliderNextSlide, {
                                    opacity: 0,
                                    display: 'none'
                                });
                                busy = 0;

                                // start autoplay
                                if (autoplay) {
                                    runAutoplay();
                                }

                                // force reload brightness for layout texts
                                self.updateBrightness(1);

                                // run video
                                self.sliderPlayVideo();
                            }
                        });
                }
            });
        });
    };

    // show next / prev
    self.sliderShowNext = function () {
        if (self.getDefaultPageData().blogShow) {
            return;
        }

        var slides = self.sliderGetSlides();
        var current = self.sliderGetCurrentSlide();
        var index = self.sliderGetSlideRealIndex(current);
        var newIndex = index + 1;
        if (!current) {
            return;
        }

        if (newIndex >= slides.length) {
            newIndex = 0;
        }

        if (newIndex === index) {
            return;
        }

        self.sliderShowSlide(newIndex);
    };
    self.sliderShowPrev = function () {
        if (self.getDefaultPageData().blogShow) {
            return;
        }

        var slides = self.sliderGetSlides();
        var current = self.sliderGetCurrentSlide();
        var index = self.sliderGetSlideRealIndex(current);
        var newIndex = index - 1;
        if (!current) {
            return;
        }

        if (index - 1 < 0) {
            newIndex = slides.length - 1;
        }

        if (newIndex === index) {
            return;
        }

        self.sliderShowSlide(newIndex);
    };

    // regenerate slider
    self.sliderRegenerate = function () {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};

        var forceReload = options.forceReload;
        var newSlides = options.slider ? self.sliderParseSlides(options.slider) : slides;

        if (options.transitionEffect) {
            transitionEffect = options.transitionEffect;
        }
        if (options.transitionSpeed) {
            transitionSpeed = parseInt(options.transitionSpeed, 10) || 600;
        }
        if (options.categoryTransitionEffect) {
            categoryTransitionEffect = options.categoryTransitionEffect;
        }
        if (options.categoryTransitionSpeed) {
            categoryTransitionSpeed = parseInt(options.categoryTransitionSpeed, 10) || 600;
        }
        if (options.autoplay) {
            autoplay = parseInt(options.autoplay, 10) || 0;
        }
        if (autoplay && transitionSpeed >= autoplay) {
            autoplay = transitionSpeed + 100;
        }
        hideTitles = !!options.hideTitles;

        $slider[(hideTitles ? 'add' : 'remove') + 'Class']('nk-slider-hide-titles');
        $slider.attr('data-transition-effect', transitionEffect);
        $slider.attr('data-transition-speed', transitionSpeed);
        $slider.attr('data-category-transition-effect', categoryTransitionEffect);
        $slider.attr('data-category-transition-speed', categoryTransitionSpeed);
        $slider.attr('data-autoplay', autoplay);

        // check if new slider structure differs from the current
        var tempSlides = $.extend(true, [], slides);
        var tempNewSlides = $.extend(true, [], newSlides);
        for (var k in tempSlides) {
            tempSlides[k].active = false;
        }
        for (var _k in tempNewSlides) {
            tempNewSlides[_k].active = false;
        }
        var theSameSlides = true;
        try {
            theSameSlides = JSON.stringify(tempSlides) === JSON.stringify(tempNewSlides);
        } catch (e) {}

        // reload
        if (forceReload) {
            $slider.attr('data-force-reload', forceReload);
        }
        if (forceReload === 'true' || forceReload === 'fade' || forceReload === 'divide' || !theSameSlides) {
            slides = newSlides;

            // activate new category
            if (options.activeCategory) {
                activeCategory = options.activeCategory;
                $slider.attr('data-active-category', activeCategory);
            }

            // create categories structure and activate
            self.sliderCreateCategories();
            self.sliderActivateCategory(activeCategory);
            self.sliderCreateNavigation(function () {
                // activate current nav item
                self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
                callback();
            });

            // run slider
            self.sliderShowSlide(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()), forceReload, transitionSpeed, true);
        } else {
            callback();
        }
    };

    /**
     * Controlling
     */

    // first run
    slides = self.sliderParseSlides();
    self.sliderCreateCategories();
    self.sliderActivateCategory(activeCategory);
    self.sliderCreateNavigation(function () {
        // activate current nav item
        self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
    });
    self.sliderShowSlide(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()), transitionEffect, transitionSpeed, true);

    // on click nav item
    $sliderNavItemsCont.on('click', 'li', function () {
        self.sliderShowSlide($(this).index());
    });
    $sliderNav.on('click', '.nk-slider-nav-next', function () {
        self.sliderShowNext();
    });
    $sliderNav.on('click', '.nk-slider-nav-prev', function () {
        self.sliderShowPrev();
    });

    // on click categories
    $sliderCategories.on('click', 'li:not(.active)', function () {
        if (busy) {
            return;
        }
        self.sliderActivateCategory($(this).attr('data-category'));
        self.sliderCreateNavigation(function () {
            // activate current nav item
            self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
        });
        self.sliderShowSlide(0, categoryTransitionEffect, categoryTransitionSpeed);
    });

    // mouse scroll
    var wheelEvent = void 0;
    if ('onwheel' in document.createElement('div')) {
        wheelEvent = 'wheel';
    } else if ('onmousewheel' in document.createElement('div')) {
        wheelEvent = 'mousewheel';
    }
    if (wheelEvent) {
        var lastScrollDate = new Date().getTime();
        var thisScrollDate = lastScrollDate;
        $wnd.on(wheelEvent, function (e) {
            // check if delta >= 2 and mouse under slider
            if (Math.abs(e.originalEvent.deltaY) < 2 || !$(e.target).parents('.nk-layout').length) {
                return;
            }

            // fix magic mouse scroll
            lastScrollDate = thisScrollDate;
            thisScrollDate = new Date().getTime();
            if (thisScrollDate - lastScrollDate < 100) {
                return;
            }

            // animate slider
            if (e.originalEvent.deltaY > 0) {
                self.sliderShowNext();
            } else if (e.originalEvent.deltaY < 0) {
                self.sliderShowPrev();
            }
        });
    }

    // merge categories on mobile device
    var isSmallScreen = wndW <= self.options.mobile;
    _debounceResize(function () {
        if (!self.options.sliderShowAllCategoriesOnMobile) {
            return;
        }
        if (isSmallScreen && wndW <= self.options.mobile || !isSmallScreen && wndW > self.options.mobile) {
            return;
        }
        isSmallScreen = wndW <= self.options.mobile;
        self.sliderActivateCategory(activeCatOnBigScreens);
        self.sliderCreateNavigation(function () {
            // activate current nav item
            self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
        });
        self.sliderShowSlide(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
    });

    // swipe
    if (!isTouch || typeof Hammer === 'undefined') {
        return;
    }
    var $layout = $('.nk-layout');
    var mc = new Hammer($layout[0], {
        domEvents: true
    });
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    $layout.on('swipeup swipeleft', function (e) {
        if ($(e.target).parents('.nk-layout').length) {
            self.sliderShowPrev();
        }
    });
    $layout.on('swipedown swiperight', function (e) {
        if ($(e.target).parents('.nk-layout').length) {
            self.sliderShowNext();
        }
    });
}

/*------------------------------------------------------------------

 Init Page Content

 -------------------------------------------------------------------*/
function initPageContent() {
    var self = this;
    var $navbar = $('.nk-navbar');
    var $main = $('.nk-main');
    var $mainBg = $main.next('.nk-main-bg');
    var $mainAndBg = $main.add($mainBg);
    var busy = 0;

    // check side for animation (right, top, bottom)
    function checkSide() {
        var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'in';

        var result = $main.attr('data-transition-' + type);
        if (result !== 'top' && result !== 'bottom' && result !== 'right') {
            result = 'right';
        }
        return result;
    }

    // show sliding content
    self.showContent = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (busy || $main.hasClass('active')) {
            callback();
            return;
        }

        // hide navbar
        if ($navbar.hasClass('active')) {
            self.hideNavbar(function () {
                self.showContent(callback);
            });
            return;
        }

        busy = 1;

        // options
        var side = checkSide('in');
        var transitionSpeed = parseInt($main.attr('data-transition-speed'), 10) || 500;

        $main.addClass('active');

        // stop previous tween
        tween.killTweensOf($mainAndBg);

        // set default styles
        switch (side) {
            case 'top':
                tween.set($mainAndBg, {
                    y: '-100%',
                    x: '0%',
                    margin: 0
                });
                break;
            case 'bottom':
                tween.set($mainAndBg, {
                    y: '100%',
                    x: '0%',
                    margin: 0
                });
                break;
            default:
                tween.set($mainAndBg, {
                    y: '0%',
                    x: '100%',
                    margin: 0
                });
        }

        // transition
        tween.to($mainAndBg, transitionSpeed / 1000, {
            x: '0%',
            y: '0%',
            force3D: true,
            ease: Power2.easeOut,
            onComplete: function onComplete() {
                busy = 0;
                callback();
                self.updateBrightness();
            }
        });
    };

    // hide sliding content
    self.hideContent = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (busy || !$main.hasClass('active')) {
            callback();
            return;
        }

        busy = 1;

        // options
        var side = checkSide('out');
        var transitionSpeed = parseInt($main.attr('data-transition-speed'), 10) || 500;

        $main.removeClass('active');

        // stop previous tween
        tween.killTweensOf($mainAndBg);

        // set default styles
        tween.set($mainAndBg, {
            y: '0%',
            x: '0%',
            margin: 0
        });

        function onComplete() {
            busy = 0;
            callback();
            self.updateBrightness();
        }

        // hide animation
        switch (side) {
            case 'top':
                tween.to($mainAndBg, transitionSpeed / 1000, {
                    y: '-100%',
                    x: '0%',
                    force3D: true,
                    ease: Power2.easeIn,
                    onComplete: onComplete
                });
                break;
            case 'bottom':
                tween.to($mainAndBg, transitionSpeed / 1000, {
                    y: '100%',
                    x: '0%',
                    force3D: true,
                    ease: Power2.easeIn,
                    onComplete: onComplete
                });
                break;
            default:
                tween.to($mainAndBg, transitionSpeed / 1000, {
                    y: '0%',
                    x: '100%',
                    force3D: true,
                    ease: Power2.easeIn,
                    onComplete: onComplete
                });
        }
    };

    // show active main content
    if (self.getDefaultPageData().contentShow) {
        // small timeout
        setTimeout(function () {
            $main.removeClass('active');
            self.showContent();
        }, 200);
    }
}

// jQuery Reverse
$.fn.reverse = [].reverse;

/*------------------------------------------------------------------

  Init Blog

-------------------------------------------------------------------*/
function _initBlog() {
    var $blog = $('.nk-blog');
    var $navbar = $('.nk-navbar');
    var $sliderNav = $('.nk-slider-nav');
    var $sliderNavItemsCont = $sliderNav.children('ul');
    var $renderedBlog = $('<div class="nk-blog-rendered">').hide().appendTo($blog);
    // insert posts containers
    for (var k = 0; k < 3; k++) {
        $renderedBlog.append('<div class="nk-blog-item"><h2><a href=""></a></h2></div>');
    }
    var blogList = [];
    var self = this;
    var page = 0;
    var busy = 0;
    var noMorePosts = false; // true will be set after ajax load if no more posts

    // get posts from page
    function getPosts(page) {
        var result = [];
        var startFrom = page * 3; // 3 - posts per screen

        if (blogList[startFrom]) {
            for (var _k2 = 0; _k2 <= 2; _k2++) {
                if (blogList[startFrom + _k2]) {
                    result.push(blogList[startFrom + _k2]);
                }
            }
        }
        return result;
    }

    // push new posts to list
    self.pushNewPosts = function () {
        var posts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var reload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (reload) {
            blogList = [];
            page = 0;
            noMorePosts = false;
        }
        for (var _k3 in posts) {
            var post = posts[_k3];
            var words = (post.title || '').split(' ');
            var text = '';
            for (var _i3 in words) {
                text += ' <span><span>' + words[_i3] + '</span></span>';
            }
            blogList.push({
                title: text,
                url: post.url
            });
        }
    };

    // update blog list
    self.updateBlogList = function () {
        var reload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (!self.getDefaultPageData().blogShow) {
            return;
        }
        var result = [];
        $blog.find('> .nk-blog-item a').each(function () {
            result.push({
                title: $(this).text(),
                url: $(this).attr('href')
            });
        });
        self.pushNewPosts(result, reload);
    };

    // render new posts
    self.renderPosts = function () {
        var posts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getPosts(page);
        var direction = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'bottom';
        var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};

        var currentPosts = getPosts(page);

        // animate
        var callbackDelay = 3;
        function staggerCallback() {
            callbackDelay--;
            if (callbackDelay <= 0) {
                callback();
            }
        }
        $renderedBlog.find('.nk-blog-item').each(function () {
            var $this = $(this);
            var $link = $this.find('a');
            var i = $this.index();
            var post = typeof posts[i] !== 'undefined' ? posts[i] : {
                url: '',
                title: ''
            };
            var $newTitle = $('<a>').attr('href', post.url).html(post.title);

            // don't show post if currently visible
            if ($link.text() == $newTitle.text()) {
                staggerCallback();
                return;
            }

            var $words = $link.find('> span > span');
            var $newWords = $newTitle.find('> span > span');

            // reverse
            if (direction !== 'bottom') {
                $words = $words.reverse();
                $newWords = $newWords.reverse();
            }

            // show new words
            function showNew() {
                // show new words
                tween.set($newWords, {
                    y: direction === 'bottom' ? '100%' : '-100%'
                });
                $link.replaceWith($newTitle);

                if ($newWords.length) {
                    tween.staggerTo($newWords, 0.25, {
                        y: '0%',
                        force3D: true,
                        ease: Power2.easeOut
                    }, 0.015, staggerCallback);
                } else {
                    staggerCallback();
                }
            }

            // hide words
            if (!$words.length) {
                showNew();
            } else {
                tween.staggerTo($words, 0.25, {
                    y: direction === 'bottom' ? '-100%' : '100%',
                    force3D: true,
                    ease: Power2.easeIn,
                    delay: (direction === 'bottom' ? i : 3 - i) * 0.15
                }, 0.015, showNew);
            }
        });
    };

    // update blog page indicator
    var indicatorTimeout = void 0;
    self.updateBlogPageIndicator = function () {
        var custom = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        // hide old
        $sliderNavItemsCont.find('li').addClass('old-active').removeClass('active');

        // add new indicator
        var content = custom ? custom : '' + (page >= 9 ? '' : '0') + (parseInt(page, 10) + 1);
        $sliderNavItemsCont.append('<li class="active">' + content + '</li>');

        // remove old indicator
        clearTimeout(indicatorTimeout);
        indicatorTimeout = setTimeout(function () {
            $sliderNavItemsCont.find('.old-active').remove();
        }, 1000);
    };

    // show next 3 blog posts
    self.showNextPosts = function () {
        if (busy) {
            return;
        }
        busy = 1;

        var nextPosts = getPosts(page + 1);
        if (nextPosts.length > 0) {
            self.renderPosts(nextPosts, 'bottom', function () {
                page++;
                self.updateBlogPageIndicator();
                busy = 0;
            });
        } else if (!noMorePosts) {
            // ajax load for new blog posts
            self.runPreloader('blog');
            var loadNewPage = getPosts(page).length === 3;
            self.options.events.onLoadBlogPosts(function () {
                var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
                var noPosts = arguments[1];

                self.stopPreloader('blog');

                // no more posts
                if (noPosts) {
                    noMorePosts = noPosts;
                }

                // store new loaded posts in array
                if (result) {
                    self.pushNewPosts(result);

                    // rerun loading posts
                    var _nextPosts = getPosts(page + (loadNewPage ? 1 : 0));
                    if (_nextPosts.length > 0) {
                        self.renderPosts(_nextPosts, 'bottom', function () {
                            if (loadNewPage) {
                                page++;
                                self.updateBlogPageIndicator();
                            }
                            busy = 0;
                        });
                    }
                }
            });
        } else {
            busy = 0;
        }
    };

    // show prev 3 blog posts
    self.showPrevPosts = function () {
        if (busy) {
            return;
        }
        busy = 1;

        var nextPosts = getPosts(page - 1);
        if (nextPosts.length > 0) {
            self.renderPosts(nextPosts, 'top', function () {
                page--;
                self.updateBlogPageIndicator();
                busy = 0;
            });
        } else {
            busy = 0;
        }
    };

    // show blog posts list
    var isShown = false;
    self.showBlogPostsList = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (isShown) {
            return;
        }
        isShown = 1;

        // clear items
        var $items = $renderedBlog.find('.nk-blog-item:eq(0), .nk-blog-item:eq(1)');
        var $hideItems = $renderedBlog.find('.nk-blog-item > *');
        $renderedBlog.find('.nk-blog-item a').html('');

        // stop previous tween
        tween.killTweensOf($items);
        tween.killTweensOf($hideItems);

        // prepare items
        tween.set($items, {
            scaleY: 0
        });

        // show rendered blog container
        $renderedBlog.show();

        // animate items
        tween.staggerTo($items, 0.5, {
            scaleY: 1,
            transformOrigin: '0 0',
            force3D: true,
            ease: Power2.easeOut
        }, 0.2, function () {
            tween.set($hideItems, {
                opacity: 1
            });
            self.renderPosts();
            callback();
        });

        // update page indicator
        self.updateBlogPageIndicator();
    };

    // hide blog posts list
    self.hideBlogPostsList = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (!isShown) {
            return;
        }

        // hide navbar
        if ($navbar.hasClass('active')) {
            self.hideNavbar(function () {
                self.hideBlogPostsList(callback);
            });
            return;
        }

        isShown = 0;

        // clear items
        var $items = $renderedBlog.find('.nk-blog-item:eq(0), .nk-blog-item:eq(1)');
        var $hideItems = $renderedBlog.find('.nk-blog-item > *');

        // stop previous tween
        tween.killTweensOf($items);
        tween.killTweensOf($hideItems);

        // prepare items
        tween.set($items, {
            scaleY: 1
        });

        tween.to($hideItems, 0.3, {
            force3D: true,
            opacity: 0
        });

        // animate items
        tween.staggerTo($items, 0.5, {
            scaleY: 0,
            delay: 0.3,
            transformOrigin: '0 100%',
            force3D: true,
            ease: Power2.easeOut
        }, 0.2, function () {
            // hide rendered blog container
            $renderedBlog.hide();

            callback();
        });
    };

    // fist run
    if ($blog.hasClass('active')) {
        self.updateBlogList();

        // small timeout
        setTimeout(function () {
            self.showBlogPostsList();
        }, 200);
    }

    // on click nav item
    $sliderNav.on('click', '.nk-slider-nav-next', function () {
        if (self.getDefaultPageData().blogShow) {
            self.showNextPosts();
        }
    });
    $sliderNav.on('click', '.nk-slider-nav-prev', function () {
        if (self.getDefaultPageData().blogShow) {
            self.showPrevPosts();
        }
    });

    // mouse scroll
    var wheelEvent = void 0;
    if ('onwheel' in document.createElement('div')) {
        wheelEvent = 'wheel';
    } else if ('onmousewheel' in document.createElement('div')) {
        wheelEvent = 'mousewheel';
    }
    if (wheelEvent) {
        $wnd.on(wheelEvent, function (e) {
            // check if delta >= 2 and mouse under slider
            if (!self.getDefaultPageData().blogShow || Math.abs(e.originalEvent.deltaY) < 2 || !$(e.target).parents('.nk-layout, .nk-blog').length) {
                return;
            }

            if (e.originalEvent.deltaY > 0) {
                self.showNextPosts();
            } else if (e.originalEvent.deltaY < 0) {
                self.showPrevPosts();
            }
        });
    }

    // swipe
    if (!isTouch || typeof Hammer === 'undefined') {
        return;
    }
    var mc = new Hammer($body[0], {
        touchAction: 'auto'
    });
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    mc.on('swipeup swipeleft', function (e) {
        if (self.getDefaultPageData().blogShow && $(e.target).parents('.nk-layout, .nk-blog').length) {
            self.showNextPosts();
        }
    });
    mc.on('swipedown swiperight', function (e) {
        if (self.getDefaultPageData().blogShow && $(e.target).parents('.nk-layout, .nk-blog').length) {
            self.showPrevPosts();
        }
    });
}

/*------------------------------------------------------------------

 Init Navbar

 -------------------------------------------------------------------*/
function _initNavbar() {
    var self = this;
    var $main = $('.nk-main');
    var $navbar = $('.nk-navbar');
    var $navbarBg = $navbar.next('.nk-navbar-bg');
    var $navbarBgImage = $navbarBg.find('.nk-navbar-image');
    var busy = 0;

    // toggle navbars
    function updateTogglers() {
        $('.nk-nav-toggle').each(function () {
            var active = $navbar.hasClass('active');
            $(this)[(active ? 'add' : 'remove') + 'Class']('active');
        });
    }
    self.toggleNavbar = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        self[$navbar.hasClass('active') ? 'hideNavbar' : 'showNavbar'](callback);
    };
    self.showNavbar = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (busy || $navbar.hasClass('active') || self.isInPageLoadQueue()) {
            return;
        }

        // hide main content
        if ($main.hasClass('active')) {
            self.hideContent(function () {
                self.showNavbar(callback);
            });
            return;
        }

        busy = 1;
        $navbar.addClass('active');

        // stop previous tweens
        tween.killTweensOf($navbar);
        tween.killTweensOf($navbarBg);
        tween.killTweensOf($navbarBgImage);

        // show background
        tween.set($navbarBg, {
            y: '0%'
        });
        tween.to($navbarBg, 0.35, {
            y: '100%',
            force3D: true
        });

        // show background image if visible
        if ($navbarBgImage.is(':visible')) {
            tween.set($navbarBgImage, {
                opacity: 0,
                ease: Power2.easeOut
            });
            tween.to($navbarBgImage, 0.5, {
                opacity: 1,
                ease: Power2.easeOut,
                force3D: true,
                delay: 0.2
            });
        }

        // show navbar
        tween.to($navbar, 0.35, {
            x: '-100%',
            ease: Power2.easeOut,
            force3D: true,
            delay: 0.2,
            onComplete: function onComplete() {
                busy = 0;
                callback();
                self.updateBrightness();
            }
        });

        updateTogglers();
    };
    self.hideNavbar = function () {
        var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

        if (busy || !$navbar.hasClass('active')) {
            return;
        }
        busy = 1;
        $navbar.removeClass('active');

        // stop previous tweens
        tween.killTweensOf($navbar);
        tween.killTweensOf($navbarBg);
        tween.killTweensOf($navbarBgImage);

        // hide background
        tween.to($navbarBg, 0.35, {
            y: '200%',
            ease: Power2.easeIn,
            force3D: true,
            delay: 0.2,
            onComplete: function onComplete() {
                busy = 0;

                callback();

                // show main content if closed all items
                if (!self.isInPageLoadQueue()) {
                    if (self.getDefaultPageData().contentShow && !$main.add($navbar).is('.active')) {
                        self.showContent();
                    } else {
                        self.updateBrightness();
                    }
                }
            }
        });

        // hide background image if visible
        if ($navbarBgImage.is(':visible')) {
            tween.set($navbarBgImage, {
                opacity: 1,
                z: 0
            });
            tween.to($navbarBgImage, 0.5, {
                opacity: 0,
                ease: Power2.easeIn,
                force3D: true
            });
        }

        // hide navbar
        tween.to($navbar, 0.35, {
            x: '0%',
            ease: Power2.easeIn,
            force3D: true
        });

        updateTogglers();
    };
    $doc.on('click', '.nk-nav-toggle', function (e) {
        e.preventDefault();
        self.toggleNavbar();
    });

    // close on click on layout elements
    $doc.on('click', '.nk-layout', function (e) {
        if (!e.isDefaultPrevented()) {
            self.hideNavbar();
        }
    });

    // close on escape
    $doc.on('keyup', function (e) {
        if (e.which == 27) {
            self.hideNavbar();
        }
    });
}

/*------------------------------------------------------------------

  Init AJAX Forms

-------------------------------------------------------------------*/
function _initForms() {
    if (typeof $.fn.ajaxSubmit === 'undefined' || typeof $.validator === 'undefined') {
        return;
    }
    var self = this;

    // Validate Forms
    $('form:not(.nk-form-ajax):not(.nk-mchimp):not(.ready)').addClass('ready').each(function () {
        $(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement: function errorPlacement(error, element) {
                var $parent = element.parent('.input-group');
                if ($parent.length) {
                    $parent.after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            }
        });
    });
    // ajax form
    $('form.nk-form-ajax:not(.ready)').addClass('ready').each(function () {
        $(this).validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            errorPlacement: function errorPlacement(error, element) {
                var $parent = element.parent('.input-group');
                if ($parent.length) {
                    $parent.after(error);
                } else {
                    element.after(error);
                }
                self.debounceResize();
            },

            // Submit the form via ajax (see: jQuery Form plugin)
            submitHandler: function submitHandler(form) {
                var $responseSuccess = $(form).find('.nk-form-response-success');
                var $responseError = $(form).find('.nk-form-response-error');
                $(form).ajaxSubmit({
                    type: 'POST',
                    success: function success(response) {
                        response = JSON.parse(response);
                        if (response.type && response.type === 'success') {
                            $responseError.hide();
                            $responseSuccess.html(response.response).show();
                            form.reset();
                        } else {
                            $responseSuccess.hide();
                            $responseError.html(response.response).show();
                        }
                        self.debounceResize();
                    },
                    error: function error(response) {
                        $responseSuccess.hide();
                        $responseError.html(response.responseText).show();
                        self.debounceResize();
                    }
                });
            }
        });
    });
}

/*------------------------------------------------------------------

  Init MailChimp

-------------------------------------------------------------------*/
function _initFormsMailChimp() {
    var $mchimp = $('form.nk-mchimp');
    if (typeof $.fn.ajaxSubmit === 'undefined' || typeof $.validator === 'undefined' || !$mchimp.length) {
        return;
    }
    var self = this;

    // Additional Validate Methods From MailChimp
    // Validate a multifield birthday
    $.validator.addMethod('mc_birthday', function (date, element, grouping_class) {
        var isValid = false;
        var $fields = $('input:not(:hidden)', $(element).closest(grouping_class));
        if ($fields.filter(':filled').length === 0 && this.optional(element)) {
            isValid = true; // None have been filled out, so no error
        } else {
            var dateArray = new Array();
            dateArray.month = $fields.filter('input[name*="[month]"]').val();
            dateArray.day = $fields.filter('input[name*="[day]"]').val();

            // correct month value
            dateArray.month = dateArray.month - 1;

            var testDate = new Date(1970, dateArray.month, dateArray.day);
            if (testDate.getDate() !== dateArray.day || testDate.getMonth() !== dateArray.month) {
                isValid = false;
            } else {
                isValid = true;
            }
        }
        return isValid;
    }, 'Please enter a valid month and day.');

    // Validate a multifield date
    $.validator.addMethod('mc_date', function (date, element, grouping_class) {
        var isValid = false;
        var $fields = $('input:not(:hidden)', $(element).closest(grouping_class));
        if ($fields.filter(':filled').length === 0 && this.optional(element)) {
            isValid = true; // None have been filled out, so no error
        } else {
            var dateArray = new Array();
            dateArray.month = $fields.filter('input[name*="[month]"]').val();
            dateArray.day = $fields.filter('input[name*="[day]"]').val();
            dateArray.year = $fields.filter('input[name*="[year]"]').val();

            // correct month value
            dateArray.month = dateArray.month - 1;

            // correct year value
            if (dateArray.year.length < 4) {
                dateArray.year = parseInt(dateArray.year, 10) < 50 ? 2000 + parseInt(dateArray.year, 10) : 1900 + parseInt(dateArray.year, 10);
            }

            var testDate = new Date(dateArray.year, dateArray.month, dateArray.day);
            if (testDate.getDate() !== dateArray.day || testDate.getMonth() !== dateArray.month || testDate.getFullYear() !== dateArray.year) {
                isValid = false;
            } else {
                isValid = true;
            }
        }
        return isValid;
    }, 'Please enter a valid date');

    // Validate a multifield phone number
    $.validator.addMethod('mc_phone', function (phone_number, element, grouping_class) {
        var isValid = false;
        var $fields = $('input:filled:not(:hidden)', $(element).closest(grouping_class));
        if ($fields.length === 0 && this.optional(element)) {
            isValid = true; // None have been filled out, so no error
        } else {
            phone_number = $fields.eq(0).val() + $fields.eq(1).val() + $fields.eq(2).val();
            isValid = phone_number.length === 10 && phone_number.match(/[0-9]{9}/);
        }
        return isValid;
    }, 'Please specify a valid phone number');

    $.validator.addMethod('skip_or_complete_group', function (value, element, grouping_class) {
        var $fields = $('input:not(:hidden)', $(element).closest(grouping_class)),
            $fieldsFirst = $fields.eq(0),
            validator = $fieldsFirst.data('valid_skip') ? $fieldsFirst.data('valid_skip') : $.extend({}, this),
            numberFilled = $fields.filter(function () {
            return validator.elementValue(this);
        }).length,
            isValid = numberFilled === 0 || numberFilled === $fields.length;

        // Store the cloned validator for future validation
        $fieldsFirst.data('valid_skip', validator);

        // If element isn't being validated, run each field's validation rules
        if (!$(element).data('being_validated')) {
            $fields.data('being_validated', true);
            $fields.each(function () {
                validator.element(this);
            });
            $fields.data('being_validated', false);
        }
        return isValid;
    }, $.validator.format('Please supply missing fields.'));

    $.validator.addMethod('skip_or_fill_minimum', function (value, element, options) {
        var $fields = $(options[1], element.form),
            $fieldsFirst = $fields.eq(0),
            validator = $fieldsFirst.data('valid_skip') ? $fieldsFirst.data('valid_skip') : $.extend({}, this),
            numberFilled = $fields.filter(function () {
            return validator.elementValue(this);
        }).length,
            isValid = numberFilled === 0 || numberFilled >= options[0];
        // Store the cloned validator for future validation
        $fieldsFirst.data('valid_skip', validator);

        // If element isn't being validated, run each skip_or_fill_minimum field's validation rules
        if (!$(element).data('being_validated')) {
            $fields.data('being_validated', true);
            $fields.each(function () {
                validator.element(this);
            });
            $fields.data('being_validated', false);
        }
        return isValid;
    }, $.validator.format('Please either skip these fields or fill at least {0} of them.'));

    $.validator.addMethod('zipcodeUS', function (value, element) {
        return this.optional(element) || /^\d{5}-\d{4}$|^\d{5}$/.test(value);
    }, 'The specified US ZIP Code is invalid');

    $mchimp.each(function () {
        var $form = $(this);
        if (!$form.length) {
            return;
        }

        var validator = $form.validate({
            errorClass: 'nk-error',
            errorElement: 'div',
            // Grouping fields makes jQuery Validation display one error for all the fields in the group
            // It doesn't have anything to do with how the fields are validated (together or separately),
            // it's strictly for visual display of errors
            groups: function groups() {
                var groups = {};
                $form.find('.input-group').each(function () {
                    var inputs = $(this).find('input:text:not(:hidden)'); // TODO: What about non-text inputs like number?
                    if (inputs.length > 1) {
                        var mergeName = inputs.first().attr('name');
                        var fieldNames = $.map(inputs, function (f) {
                            return f.name;
                        });
                        groups[mergeName.substring(0, mergeName.indexOf('['))] = fieldNames.join(' ');
                    }
                });
                return groups;
            },
            // Place a field's inline error HTML just before the div.input-group closing tag
            errorPlacement: function errorPlacement(error, element) {
                element.closest('.input-group').after(error);
                self.debounceResize();
            },

            // Submit the form via ajax (see: jQuery Form plugin)
            submitHandler: function submitHandler() {
                var $responseSuccess = $form.find('.nk-form-response-success');
                var $responseError = $form.find('.nk-form-response-error');
                var url = $form.attr('action');
                url = url.replace('/post?u=', '/post-json?u=');
                url += '&c=?';

                $form.ajaxSubmit({
                    type: 'GET',
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8",
                    url: url,
                    success: function success(resp) {
                        $responseSuccess.hide();
                        $responseError.hide();

                        // On successful form submission, display a success message and reset the form
                        if (resp.result === 'success') {
                            $responseSuccess.show().html(resp.msg);
                            $form[0].reset();

                            // If the form has errors, display them, inline if possible, or appended to #mce-error-response
                        } else {

                            // Example errors - Note: You only get one back at a time even if you submit several that are bad.
                            // Error structure - number indicates the index of the merge field that was invalid, then details
                            // Object {result: "error", msg: "6 - Please enter the date"}
                            // Object {result: "error", msg: "4 - Please enter a value"}
                            // Object {result: "error", msg: "9 - Please enter a complete address"}

                            // Try to parse the error into a field index and a message.
                            // On failure, just put the dump thing into in the msg letiable.
                            var index = -1;
                            var msg = void 0;
                            try {
                                var parts = resp.msg.split(' - ', 2);
                                if (typeof parts[1] === 'undefined') {
                                    msg = resp.msg;
                                } else {
                                    i = parseInt(parts[0], 10);
                                    if (i.toString() === parts[0]) {
                                        index = parts[0];
                                        msg = parts[1];
                                    } else {
                                        index = -1;
                                        msg = resp.msg;
                                    }
                                }
                            } catch (e) {
                                index = -1;
                                msg = resp.msg;
                            }

                            try {
                                // If index is -1 if means we don't have data on specifically which field was invalid.
                                // Just lump the error message into the generic response div.
                                if (index === -1) {
                                    $responseError.show().html(msg);
                                } else {
                                    var fieldName = $form.find('input[name]:eq(' + index + ')').attr('name'); // Make sure this exists
                                    var data = {};
                                    data[fieldName] = msg;
                                    validator.showErrors(data);
                                }
                            } catch (e) {
                                $responseError.show().html(msg);
                            }
                        }
                        self.debounceResize();
                    },
                    error: function error(response) {
                        $responseSuccess.hide();
                        $responseError.html(response.responseText).show();
                        self.debounceResize();
                    }
                });
            }
        });
    });

    // Custom validation methods for fields with certain css classes
    $.validator.addClassRules('birthday', { digits: true, mc_birthday: '.datefield' });
    $.validator.addClassRules('datepart', { digits: true, mc_date: '.datefield' });
    $.validator.addClassRules('phonepart', { digits: true, mc_phone: '.phonefield' });
}

/* FastClick */
function _initPluginFastClick() {
    if (typeof FastClick !== 'undefined') {
        FastClick.attach(document.body);
    }
}

/* Nano Scroller */
function _initPluginNano($context) {
    if (typeof $.fn.nanoScroller !== 'undefined') {
        ($context || $doc).find('.nano').nanoScroller();
    }
}

/* Bootstrap Tabs */
function _initPluginTabs() {
    var self = this;
    $wnd.on('shown.bs.tab', function () {
        self.debounceResize();
    });
}

/*------------------------------------------------------------------

  UMBRELLA Class

-------------------------------------------------------------------*/

var UMBRELLA = function () {
    function UMBRELLA() {
        _classCallCheck(this, UMBRELLA);

        this.options = options;
    }

    _createClass(UMBRELLA, [{
        key: 'init',
        value: function init() {
            var self = this;
            self.initPages();
            self.initPageTitles();
            self.initPageSlider();
            self.initPageSlidingContent();
            self.initNavbar();
            self.initBlog();
            self.initForms();
            self.initFormsMailChimp();

            // init plugins
            self.initPluginFastClick();
            self.initPluginNano();
            self.initPluginTabs();

            return self;
        }
    }, {
        key: 'setOptions',
        value: function setOptions(newOpts) {
            return _setOptions.call(this, newOpts);
        }
    }, {
        key: 'updateBrightness',
        value: function updateBrightness(func) {
            return _updateBrightness.call(this, func);
        }
    }, {
        key: 'debounceResize',
        value: function debounceResize(func) {
            return _debounceResize.call(this, func);
        }
    }, {
        key: 'throttleScroll',
        value: function throttleScroll(callback) {
            return _throttleScroll.call(this, callback);
        }
    }, {
        key: 'bodyOverflow',
        value: function bodyOverflow(type) {
            return _bodyOverflow.call(this, type);
        }
    }, {
        key: 'isInViewport',
        value: function isInViewport($item, returnRect) {
            return _isInViewport.call(this, $item, returnRect);
        }
    }, {
        key: 'scrollTo',
        value: function scrollTo($to, callback) {
            return _scrollTo.call(this, $to, callback);
        }
    }, {
        key: 'runPreloader',
        value: function runPreloader(type) {
            return _runPreloader.call(this, type);
        }
    }, {
        key: 'stopPreloader',
        value: function stopPreloader(type) {
            return _stopPreloader.call(this, type);
        }
    }, {
        key: 'initPages',
        value: function initPages() {
            return _initPages.call(this);
        }
    }, {
        key: 'initPageTitles',
        value: function initPageTitles() {
            return _initPageTitles.call(this);
        }
    }, {
        key: 'initPageSlider',
        value: function initPageSlider() {
            return _initPageSlider.call(this);
        }
    }, {
        key: 'initPageSlidingContent',
        value: function initPageSlidingContent() {
            return initPageContent.call(this);
        }
    }, {
        key: 'initNavbar',
        value: function initNavbar() {
            return _initNavbar.call(this);
        }
    }, {
        key: 'initBlog',
        value: function initBlog() {
            return _initBlog.call(this);
        }
    }, {
        key: 'initForms',
        value: function initForms() {
            return _initForms.call(this);
        }
    }, {
        key: 'initFormsMailChimp',
        value: function initFormsMailChimp() {
            return _initFormsMailChimp.call(this);
        }
    }, {
        key: 'initPluginFastClick',
        value: function initPluginFastClick() {
            return _initPluginFastClick.call(this);
        }
    }, {
        key: 'initPluginNano',
        value: function initPluginNano($context) {
            return _initPluginNano.call(this, $context);
        }
    }, {
        key: 'initPluginTabs',
        value: function initPluginTabs($context) {
            return _initPluginTabs.call(this, $context);
        }
    }]);

    return UMBRELLA;
}();

/*------------------------------------------------------------------

  Init Umbrella

-------------------------------------------------------------------*/


window.Umbrella = new UMBRELLA();
}());
