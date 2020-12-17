import { $, $wnd, $body, wndW, wndH, tween, isTouch, debounceResize } from "./_utility";

/* Init Page Slider */
function initPageSlider ($context) {
    let $slider = $('.nk-slider');
    const self = this;

    if(!$slider.length) {
        return;
    }

    // options
    let transitionEffect = $slider.attr('data-transition-effect') || 'fade';
    let transitionSpeed = parseInt($slider.attr('data-transition-speed'), 10) || 600;
    let categoryTransitionEffect = $slider.attr('data-category-transition-effect') || 'top';
    let categoryTransitionSpeed = parseInt($slider.attr('data-category-transition-speed'), 10) || 600;
    let autoplay = parseInt($slider.attr('data-autoplay'), 10) || 0;
    if(autoplay && transitionSpeed >= autoplay ) {
        autoplay = transitionSpeed + 100;
    }
    let hideTitles = $slider.hasClass('nk-slider-hide-titles');
    let activeCategory = $slider.attr('data-active-category') || '*';
    let activeCatOnBigScreens = activeCategory;

    let $sliderNav = $('.nk-slider-nav');
    let $sliderNavItemsCont = $sliderNav.children('ul');
    let $sliderCategories = $('.nk-slider-categories');
    let $sliderSlide = $('<div class="nk-slider-current-slide"></div>').css({
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundPosition: 'center center',
            backgroundSize: 'cover'
        }).appendTo($slider);
    let $sliderNextSlide = $sliderSlide.clone()
        .removeClass('nk-slider-current-slide').addClass('nk-slider-next-slide')
        .css({
            display: 'none',
            zIndex: 1
        }).appendTo($slider);
    // additional blocks for divide slider transition
    let $sliderNextSlide_2 = $sliderNextSlide.clone().css('display', 'block').removeClass('nk-slider-next-slide').appendTo($sliderNextSlide);
    let $sliderNextSlide_2_inner = $sliderNextSlide_2.clone().appendTo($sliderNextSlide_2);
    let $sliderNextSlide_3 = $sliderNextSlide_2.clone().appendTo($sliderNextSlide);
    let $sliderNextSlide_3_inner = $sliderNextSlide_3.children('div');
    let $sliderVideoSlide = $('<div>').css('position', 'relative');
    $('<div class="nk-slider-video-slide"></div>').css({
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2
    }).append($sliderVideoSlide).appendTo($slider);
    let slides = [];
    let busy = 0;

    // on load image
    let cachedImages = {};
    function onImageLoad (src, callback) {
        if(!src) {
            return;
        }

        // save cache
        if(cachedImages[src]) {
            if(callback) {
                callback();
            }
            return;
        }

        // check for image loaded
        var tempImg = new Image();
        tempImg.onload = function () {
            cachedImages[src] = true;
            if(callback) {
                callback();
            }
        };
        tempImg.src = src;
    }

    // parse slides
    self.sliderParseSlides = ($instance = $slider) => {
        let slides = [];
        let i = 0;
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
    self.sliderGetSlides = (specific_cat = activeCategory) => {
        let result = [];
        for (let k in slides) {
            let item = slides[k];
            if(item.categories && item.categories.length) {
                for(let i in item.categories) {
                    let cat = item.categories[i];
                    if(cat === specific_cat || cat === '*' || specific_cat === '*') {
                        result.push(item);
                        break;
                    }
                }
            }
        }
        return result;
    };

    // get current slide
    self.sliderGetCurrentSlide = () => {
        let slides = self.sliderGetSlides();
        for (let k in slides) {
            let item = slides[k];
            if(item.active) {
                return item;
            }
        }

        // if there is no active slide, return first
        if(slides[0]) {
            slides[0].active = true;
            return slides[0];
        }

        return false;
    };

    // get slide index in current activated category
    self.sliderGetSlideRealIndex = (checkSlide) => {
        let i = 0;
        let slides = self.sliderGetSlides();
        for (let k in slides) {
            let item = slides[k];
            if(item.index === checkSlide.index) {
                return i;
            }
            i++;
        }
        return 0;
    };

    self.sliderActivateCategory = (name) => {
        if(busy) {
            return;
        }

        activeCatOnBigScreens = name;
        if(self.options.sliderShowAllCategoriesOnMobile && wndW <= self.options.mobile) {
            activeCategory = '*';
        } else {
            activeCategory = name;
        }

        // activate current category
        $sliderCategories.find('.active').removeClass('active');
        $sliderCategories.find(`[data-category="${activeCategory}"]`).addClass('active');
    };

    // create categories
    self.sliderCreateCategories = () => {
        let allSlides = self.sliderGetSlides('*');

        // categories
        let catNav = '';
        let categories = {};
        for(let k in allSlides) {
            let slide = allSlides[k];
            for(let i in slide.categories) {
                let cat = slide.categories[i];
                if(!categories[cat] && cat !== '*') {
                    categories[cat] = 1;
                    catNav += `<li data-category="${cat}"><a href="javascript:void(0)">${cat}</a></li>`;
                }
            }
        }
        $sliderCategories.html(catNav);
    };

    // prepare slider structure
    self.sliderCreateNavigation = (callback = () => {}) => {
        if(self.getDefaultPageData().blogShow) {
            return;
        }

        let slides = self.sliderGetSlides();

        // navigation
        let nav = '';
        for(let k in slides) {
            nav += `<li data-slide="${k}">${ k >= 9 ? '' : '0'}${parseInt(k, 10) + 1}</li>`;
        }

        // transition if there are nav items
        tween.to($sliderNavItemsCont, 0.3, {
            opacity: 0,
            force3D: true,
            onComplete () {
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
    self.sliderActivateNavigationItem = (index) => {
        if(self.getDefaultPageData().blogShow) {
            return;
        }
        $sliderNavItemsCont.find('.active').removeClass('active');
        $sliderNavItemsCont.find(`li:eq(${index})`).addClass('active');
    };

    // correct video background size and position
    let curVideoSize = '16x9';
    self.sliderCorrectVideo = () => {
        // video size
        let vW = parseFloat(curVideoSize.split('x')[0]);
        let vH = parseFloat(curVideoSize.split('x')[1]);

        let styles = {};

        if (wndW / vW > wndH / vH) {
            styles = {
                width: wndW,
                height: vH * wndW / vW,
                marginTop: (wndH - vH * wndW / vW) / 2,
                marginLeft: 0,
            };
        } else {
            styles = {
                width: vW * wndH / vH,
                height: wndH,
                marginTop: 0,
                marginLeft: (wndW - vW * wndH / vH) / 2,
            };
        }

        // hide progress bar
        styles.marginTop -= 220;
        styles.height += 440;

        $sliderVideoSlide.css(styles);
    };
    debounceResize(() => {
        self.sliderCorrectVideo();
    });

    // run video background
    self.sliderPlayVideo = () => {
        let slide = self.sliderGetCurrentSlide();
        let videoSrc = slide.videoBackground;
        let videoSize = slide.videoBackgroundSize;

        if (!videoSrc || typeof VideoWorker === 'undefined') {
            return;
        }

        var video = new VideoWorker(videoSrc, {
            autoplay: true,
            loop: true,
            volume: 0,
            mute: true,
        });

        if(video.isValid()) {
            curVideoSize = videoSize;

            self.sliderCorrectVideo();

            video.on('started', function () {
                tween.set(this.$video, {
                    left: 0,
                });
                tween.to(this.$video, 0.5, {
                    opacity: 1,
                    display: 'block',
                    force3D: true
                });
                self.sliderCorrectVideo();
            });

            video.getIframe(function (iframe) {
                let $iframe = $(iframe);
                let $parent = $iframe.parent();

                $sliderVideoSlide.append($iframe);

                // remove parent iframe element (created by VideoWorker)
                $parent.remove();
                
                self.sliderCorrectVideo();
            });
        }
    };

    // stop video background
    self.sliderStopVideo = (callback = () => {}) => {
        // hide old video
        let $videoParent = $sliderVideoSlide.children();
        if ($videoParent.length) {
            tween.to($videoParent, 0.5, {
                opacity: 0,
                force3D: true,
                onComplete () {
                    $videoParent.remove();
                    callback();
                }
            });
        } else {
            callback();
        }
    };

    // run autoplay
    let autoplayInterval;
    function stopAutoplay () {
        clearInterval(autoplayInterval);
    }
    function runAutoplay () {
        stopAutoplay();
        autoplayInterval = setInterval(() => {
            window.requestAnimationFrame(self.sliderShowNext);
        }, autoplay);
    }

    // show slide by index
    // available effects: fade, divide, top, left, right, bottom
    let hideTitlesCount = 0;
    self.sliderShowSlide = (index, effect = transitionEffect, speed = transitionSpeed, force = false) => {
        if(self.getDefaultPageData().blogShow && !force) {
            return;
        }

        let slides = self.sliderGetSlides();
        if(typeof slides[index] === 'undefined' || busy) {
            return;
        }
        busy = 1;

        // stop autoplay
        if(autoplay) {
            stopAutoplay();
        }

        self.sliderStopVideo(() => {
            onImageLoad(slides[index].src, function () {
                // update slides array
                self.sliderGetCurrentSlide().active = false;
                slides[index].active = true;

                // activate current nav item
                self.sliderActivateNavigationItem(index);

                // hide titles
                if(hideTitles) {
                    hideTitlesCount++;

                    if(hideTitlesCount > 1) {
                        self.showTitle('', 'fade');
                        self.showSubtitle('');
                        self.showTagline('');
                    }
                } else {
                    hideTitlesCount = 0;
                }

                let prevUrl = $sliderSlide.css('background-image');
                let prevBGPosition = $sliderSlide.css('background-position');

                // transition effect
                switch (effect) {
                    case 'top':
                    case 'left':
                    case 'right':
                    case 'bottom':
                        let y = '-100%';
                        let x = '0%';

                        switch(effect) {
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
                            backgroundImage: `url('${slides[index].src}')`,
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
                            onComplete () {
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
                            onComplete () {
                                busy = 0;

                                // start autoplay
                                if(autoplay) {
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
                            backgroundImage: `url('${slides[index].src}')`,
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
                            onComplete () {
                                busy = 0;

                                // start autoplay
                                if(autoplay) {
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
                            onComplete () {
                                tween.set($sliderNextSlide, {
                                    opacity: 0,
                                    display: 'none'
                                });
                            }
                        });

                        break;
                    default: // fade
                        tween.set($sliderNextSlide, {
                            opacity: 0,
                            x: '0%',
                            y: '0%',
                            display: 'block'
                        });
                        $sliderNextSlide.css({
                            backgroundImage: `url('${slides[index].src}')`,
                            backgroundPosition: slides[index].backgroundPosition
                        });
                        tween.to($sliderNextSlide, speed / 1000, {
                            opacity: 1,
                            force3D: true,
                            ease: Power0.easeNone,
                            onComplete () {
                                $sliderSlide.css({
                                    backgroundImage: `url('${slides[index].src}')`,
                                    backgroundPosition: slides[index].backgroundPosition
                                });
                                tween.set($sliderNextSlide, {
                                    opacity: 0,
                                    display: 'none'
                                });
                                busy = 0;

                                // start autoplay
                                if(autoplay) {
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
    self.sliderShowNext = () => {
        if(self.getDefaultPageData().blogShow) {
            return;
        }

        let slides = self.sliderGetSlides();
        let current = self.sliderGetCurrentSlide();
        let index = self.sliderGetSlideRealIndex(current);
        let newIndex = index + 1;
        if(!current) {
            return;
        }

        if(newIndex >= slides.length) {
            newIndex = 0;
        }

        if ( newIndex === index ) {
            return;
        }

        self.sliderShowSlide(newIndex);
    };
    self.sliderShowPrev = () => {
        if(self.getDefaultPageData().blogShow) {
            return;
        }

        let slides = self.sliderGetSlides();
        let current = self.sliderGetCurrentSlide();
        let index = self.sliderGetSlideRealIndex(current);
        let newIndex = index - 1;
        if(!current) {
            return;
        }

        if(index - 1 < 0) {
            newIndex = slides.length - 1;
        }

        if ( newIndex === index ) {
            return;
        }

        self.sliderShowSlide(newIndex);
    };


    // regenerate slider
    self.sliderRegenerate = (options = {}, callback = () => {}) => {
        let forceReload = options.forceReload;
        let newSlides = options.slider ? self.sliderParseSlides(options.slider) : slides;

        if(options.transitionEffect) {
            transitionEffect = options.transitionEffect;
        }
        if(options.transitionSpeed) {
            transitionSpeed = parseInt(options.transitionSpeed, 10) || 600;
        }
        if(options.categoryTransitionEffect) {
            categoryTransitionEffect = options.categoryTransitionEffect;
        }
        if(options.categoryTransitionSpeed) {
            categoryTransitionSpeed = parseInt(options.categoryTransitionSpeed, 10) || 600;
        }
        if(options.autoplay) {
            autoplay = parseInt(options.autoplay, 10) || 0;
        }
        if(autoplay && transitionSpeed >= autoplay ) {
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
        let tempSlides = $.extend(true, [], slides);
        let tempNewSlides = $.extend(true, [], newSlides);
        for(let k in tempSlides) {
            tempSlides[k].active = false;
        }
        for(let k in tempNewSlides) {
            tempNewSlides[k].active = false;
        }
        let theSameSlides = true;
        try {
            theSameSlides = JSON.stringify(tempSlides) === JSON.stringify(tempNewSlides);
        } catch (e) {}

        // reload
        if(forceReload) {
            $slider.attr('data-force-reload', forceReload);
        }
        if(forceReload === 'true' || forceReload === 'fade' || forceReload === 'divide' || !theSameSlides) {
            slides = newSlides;

            // activate new category
            if(options.activeCategory) {
                activeCategory = options.activeCategory;
                $slider.attr('data-active-category', activeCategory);
            }

            // create categories structure and activate
            self.sliderCreateCategories();
            self.sliderActivateCategory(activeCategory);
            self.sliderCreateNavigation(() => {
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
    self.sliderCreateNavigation(() => {
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
        if(busy) {
            return;
        }
        self.sliderActivateCategory($(this).attr('data-category'));
        self.sliderCreateNavigation(() => {
            // activate current nav item
            self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
        });
        self.sliderShowSlide(0, categoryTransitionEffect, categoryTransitionSpeed);
    });

    // mouse scroll
    let wheelEvent;
    if ('onwheel' in document.createElement('div')) {
        wheelEvent = 'wheel';
    }
    else if ('onmousewheel' in document.createElement('div')) {
        wheelEvent = 'mousewheel';
    }
    if (wheelEvent) {
        let lastScrollDate = new Date().getTime();
        let thisScrollDate = lastScrollDate;
        $wnd.on(wheelEvent, (e) => {
            // check if delta >= 2 and mouse under slider
            if(Math.abs(e.originalEvent.deltaY) < 2 || !$(e.target).parents('.nk-layout').length) {
                return;
            }

            // fix magic mouse scroll
            lastScrollDate = thisScrollDate;
            thisScrollDate = new Date().getTime();
            if ((thisScrollDate - lastScrollDate) < 100) {
                return;
            }

            // animate slider
            if(e.originalEvent.deltaY > 0) {
                self.sliderShowNext();
            } else if (e.originalEvent.deltaY < 0) {
                self.sliderShowPrev();
            }
        });
    }

    // merge categories on mobile device
    let isSmallScreen = wndW <= self.options.mobile;
    debounceResize(() => {
        if(!self.options.sliderShowAllCategoriesOnMobile) {
            return;
        }
        if(isSmallScreen && wndW <= self.options.mobile || !isSmallScreen && wndW > self.options.mobile) {
            return;
        }
        isSmallScreen = wndW <= self.options.mobile;
        self.sliderActivateCategory(activeCatOnBigScreens);
        self.sliderCreateNavigation(() => {
            // activate current nav item
            self.sliderActivateNavigationItem(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
        });
        self.sliderShowSlide(self.sliderGetSlideRealIndex(self.sliderGetCurrentSlide()));
    });

    // swipe
    if(!isTouch || typeof Hammer === 'undefined') {
        return;
    }
    let $layout = $('.nk-layout');
    let mc = new Hammer($layout[0], {
        domEvents: true
    });
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    $layout.on('swipeup swipeleft', function(e) {
        if($(e.target).parents('.nk-layout').length) {
            self.sliderShowPrev();
        }
    });
    $layout.on('swipedown swiperight', function(e) {
        if($(e.target).parents('.nk-layout').length) {
            self.sliderShowNext();
        }
    });
}

export { initPageSlider };
