import { $, $doc, tween, debounceResize, isUmbrellaLayout } from "./_utility";

/*------------------------------------------------------------------

 Init AJAX Page Loading

 -------------------------------------------------------------------*/
function initPages () {
    const self = this;
    let $layout = $('.nk-layout:eq(0)');
    let $main = $('.nk-main');
    let $mainBg = $main.next('.nk-main-bg');
    let $blog = $('.nk-blog');

    // current page data (with dynamic changed titles). Available data see in generatePageData function
    let cur = {};

    // default page data (current loaded page data without dynamic changes). Available data see in generatePageData function
    let def = {};

    // set default page data
    self.setDefaultPageData = (newDef = {}) => {
        def = $.extend(def, newDef);
    };

    // get default page data
    self.getDefaultPageData = () => {
        return $.extend(true, {}, def);
    };

    // set current page data
    self.setCurrentPageData = (newCur = {}) => {
        cur = $.extend(cur, newCur);
    };

    // get current page data
    self.getCurrentPageData = () => {
        return $.extend(true, {}, cur);
    };

    // generate page data from dom
    self.generatePageData = ($href = location.href, $page = $doc) => {
        let $layout = $page.find('.nk-layout:eq(0)');
        let $main = $page.find('.nk-main:eq(0)');
        let $blog = $page.find('.nk-blog:eq(0)');
        let $slider = $layout.find('.nk-slider');
        let $sliderNav = $page.find('.nk-slider-nav');

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
    function toggleBlog (callback = () => {}) {
        if(def.blogShow && !cur.blogShow) {
            $blog.addClass('active');

            let posts = [];
            def.blog.find('> .nk-blog-item a').each(function () {
                posts.push({
                    title: $(this).text(),
                    url: $(this).attr('href')
                });
            });

            self.pushNewPosts(posts, true);
            self.showBlogPostsList(callback);
        } else if(cur.blogShow && !def.blogShow) {
            $blog.removeClass('active');
            self.hideBlogPostsList(callback);

            // regenerate slider navigation
            self.sliderCreateNavigation(() => {
                self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
            });
        } else {
            callback();
        }
    }

    // update content text and background colors
    let contentColorsStyles = false;
    function updateContentColors () {
        if(!contentColorsStyles) {
            contentColorsStyles = document.createElement('style');
            contentColorsStyles.setAttribute('type', 'text/css');
            contentColorsStyles.setAttribute('id', '#umbrella-content-styles');
            var head = document.head || document.getElementsByTagName('head')[0];
            head.appendChild(contentColorsStyles);
        }

        var styles = [];

        if(def.contentCustomColor) {
            styles.push(
                '.nk-main {',
                '   color: ' + def.contentCustomColor + ';',
                '}'
            );
        }
        if(def.contentCustomBg) {
            styles.push(
                '.nk-main + .nk-main-bg {',
                '   background-color: ' + def.contentCustomBg + ';',
                '}'
            );
        }
        if(def.contentCustomBgMobile) {
            styles.push(
                '@media (max-width: ' + self.options.mobile + 'px) {',
                    '.nk-main + .nk-main-bg {',
                    '   background-color: ' + def.contentCustomBgMobile + ';',
                    '}',
                '}'
            );
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
    function updateContent (animate = false) {
        let $content = $(def.contentHTML);
        let $mainNano = $main.find('.nano-content');
        let $mainLayout = $main.find('.nk-layout');

        // animate
        if(animate) {
            // hide layout title
            tween.to($mainLayout, 0.3, {
                opacity: 0,
                onComplete () {
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
                onComplete () {
                    $mainNano.html($content.find('.nano-content').html());
                    $main[(def.contentLowerTitle ? 'add' : 'remove') + 'Class']('nk-main-lower-title');

                    updateContentColors();
                    self.initForms();

                    // show content
                    tween.to($mainNano, 0.3, {
                        opacity: 1,
                        force3D: true,
                        onComplete () {
                            $content.remove();
                            $content = null;
                            $mainNano = null;
                            $mainLayout = null;
                            debounceResize();
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
            debounceResize();
        }
    }

    // show / hide content
    function toggleContent (callback = () => {}) {
        $main.attr('data-transition-in', def.contentTransitionIn);
        $main.attr('data-transition-out', def.contentTransitionOut);

        // show new content
        if(def.contentShow && def.contentHTML != cur.contentHTML) {
            // hide old container and show new
            if(def.contentLowerTitle !== cur.contentLowerTitle) {
                self.hideContent(() => {
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
            else if(cur.contentShow === def.contentShow) {
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
            self.hideContent(() => {
                updateContent();

                // hide navbar
                self.hideNavbar();

                callback();
            });
        }
    }

    // activate / deactivate menu items
    function updateMenuItems () {
        $('.nk-nav ul:not(.nk-slider-categories) > li > a').each(function () {
            let $li = $(this).parent('li');
            if(this.href === def.href) {
                $li.addClass('active');
            } else {
                $li.removeClass('active');
            }
        });
    }

    // check if currently in page loading queue
    let pageLoading = false;
    self.isInPageLoadQueue = function () {
        return pageLoading;
    };

    // show default page data
    self.showDefaultPageData = (effect = 'right') => {
        // update items when new href
        if(cur.href === def.href) {
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
        }, () => {
            // change slider navigation style
            $('.nk-slider-nav')[(def.sliderNavSlim ? 'add' : 'remove') + 'Class']('nk-slider-nav-slim');
        });
        if(def.blogShow || cur.blogShow) {
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
        if(def.blogShow && !cur.blogShow) {
            toggleContent(() => {
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
            toggleBlog(() => {
                // show layout titles
                self.showTitle(def.pageTitle, effect);
                self.showSubtitle(def.pageSubtitle);
                self.showTagline(def.pageTagline);

                toggleContent(() => {
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
    let xhr = {};

    // Return the `href` component of given URL object with the hash portion removed.
    function stripHash(href) {
        return href.replace(/#.*/, '');
    }

    // cache pages
    let cache = {};
    function setCache(key = false, data = false) {
        if(!key || !data || cache[key]) {
            return;
        }
        cache[key] = data;
    }
    function getCache(key = false) {
        if(!key || !cache[key]) {
            return false;
        }
        return cache[key];
    }

    // render new page from cache
    function renderNewPageFromCache (data) {
        // store data
        self.setDefaultPageData(data);

        // show new data
        self.showDefaultPageData();

        // callback
        if(typeof self.options.events.onAfterAjaxPageLoad !== 'undefined') {
            self.options.events.onAfterAjaxPageLoad(self.getDefaultPageData());
        }
    }

    // parse and render new page content
    function renderNewPage (href = '', $newHTML) {
        // store data
        self.setDefaultPageData(self.generatePageData(href, $newHTML));

        // save page cache
        setCache(href, self.getDefaultPageData());

        // show new data
        self.showDefaultPageData();

        // callback
        if(typeof self.options.events.onAfterAjaxPageLoad !== 'undefined') {
            self.options.events.onAfterAjaxPageLoad(self.getDefaultPageData());
        }
    }

    // load new page
    function loadPage (href = false, clicked = false) {
        let currentPageData = self.getDefaultPageData();

        // stop when the same urls
        if (!href || stripHash(href) == stripHash(currentPageData.href)) {
            return;
        }

        // return cached version
        let cached = getCache(href);
        if(cached) {
            renderNewPageFromCache(cached);

            // push state for new page
            if(clicked && typeof History !== 'undefined' && self.options.ajax) {
                History.pushState(null, cached.title, href);
            }
            return;
        }

        // stop previous request
        if(xhr && xhr.abort) {
            xhr.abort();
            xhr = {};
        }

        // new ajax request
        self.runPreloader();
        xhr = $.ajax({
            url: href,
            success (responseHtml) {
                if(!responseHtml) {
                    location = href;
                    return;
                }

                let $newHTML = $('<div>').html(responseHtml);
                let title = $newHTML.find('title:eq(0)').text() || document.title;

                // check for Umbrella layout
                if(!isUmbrellaLayout($newHTML)) {
                    location = href;
                    return;
                }

                // render new content
                renderNewPage(href, $newHTML);

                // push state for new page
                if(typeof History !== 'undefined' && self.options.ajax) {
                    History.pushState(null, title, href);
                }

                // remove stored data
                $newHTML.remove();
                $newHTML = null;

                self.stopPreloader();
            },
            error (msg) {
                if(msg.status !== 0) {
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

    if(!isUmbrellaLayout()) {
        return;
    }

    // click on links
    $doc.on('click', 'a:not(.no-ajax):not([target="_blank"]):not([href^="#"]):not([href^="mailto"]):not([href^="javascript:"])', function(e) {
        var link = e.currentTarget;

        // Stop if AJAX is not supported
        if(!self.options.ajax) {
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
        let currentPageData = self.getDefaultPageData();
        if (link.href.indexOf('#') > -1 && stripHash(link.href) == stripHash(currentPageData.href)) {
            return;
        }

        // Ignore if local file protocol
        if(window.location.protocol === 'file:') {
            return;
        }

        // Ignore e with default prevented
        if (e.isDefaultPrevented()) {
            return;
        }

        // Check for function in options
        if(typeof self.options.events.onBeforeAjaxPageLoad !== 'undefined' && self.options.events.onBeforeAjaxPageLoad(e)) {
            return;
        }

        e.preventDefault();

        loadPage(link.href, true);
    });

    // on state change
    if(typeof History !== 'undefined' && self.options.ajax) {
        History.Adapter.bind(window, 'statechange', function(e) {
            loadPage(History.getState().url);
            History.replaceState(null, document.title, History.getState().url);
        });
    }
}

export { initPages };
