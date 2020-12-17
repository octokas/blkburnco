import { $, $wnd, $body, tween, isTouch } from "./_utility";

// jQuery Reverse
$.fn.reverse = [].reverse;

/*------------------------------------------------------------------

  Init Blog

-------------------------------------------------------------------*/
function initBlog () {
    let $blog = $('.nk-blog');
    let $navbar = $('.nk-navbar');
    let $sliderNav = $('.nk-slider-nav');
    let $sliderNavItemsCont = $sliderNav.children('ul');
    let $renderedBlog = $('<div class="nk-blog-rendered">').hide().appendTo($blog);
        // insert posts containers
        for(let k = 0; k < 3; k++) {
            $renderedBlog.append(`<div class="nk-blog-item"><h2><a href=""></a></h2></div>`);
        }
    let blogList = [];
    let self = this;
    let page = 0;
    let busy = 0;
    let noMorePosts = false; // true will be set after ajax load if no more posts

    // get posts from page
    function getPosts (page) {
        let result = [];
        let startFrom = page * 3; // 3 - posts per screen

        if(blogList[startFrom]) {
            for(let k = 0; k <= 2; k++) {
                if(blogList[startFrom + k]) {
                    result.push(blogList[startFrom + k]);
                }
            }
        }
        return result;
    }

    // push new posts to list
    self.pushNewPosts = (posts = [], reload = false) => {
        if(reload) {
            blogList = [];
            page = 0;
            noMorePosts = false;
        }
        for(let k in posts) {
            let post = posts[k];
            let words = (post.title || '').split(' ');
            let text = '';
            for(let i in words) {
                text += ' <span><span>' + words[i] + '</span></span>';
            }
            blogList.push({
                title: text,
                url: post.url
            });
        }
    };

    // update blog list
    self.updateBlogList = function (reload = false) {
        if(!self.getDefaultPageData().blogShow) {
            return;
        }
        let result = [];
        $blog.find('> .nk-blog-item a').each(function () {
            result.push({
                title: $(this).text(),
                url: $(this).attr('href')
            });
        });
        self.pushNewPosts(result, reload);
    };

    // render new posts
    self.renderPosts = function (posts = getPosts(page), direction = 'bottom', callback = () => {}) {
        let currentPosts = getPosts(page);

        // animate
        let callbackDelay = 3;
        function staggerCallback () {
            callbackDelay--;
            if(callbackDelay <= 0) {
                callback();
            }
        }
        $renderedBlog.find('.nk-blog-item').each(function () {
            let $this = $(this);
            let $link = $this.find('a');
            let i = $this.index();
            let post = typeof posts[i] !== 'undefined' ? posts[i] : {
                url: '',
                title: ''
            };
            let $newTitle = $('<a>').attr('href', post.url).html(post.title);

            // don't show post if currently visible
            if($link.text() == $newTitle.text()) {
                staggerCallback();
                return;
            }

            let $words = $link.find('> span > span');
            let $newWords = $newTitle.find('> span > span');

            // reverse
            if(direction !== 'bottom') {
                $words = $words.reverse();
                $newWords = $newWords.reverse();
            }

            // show new words
            function showNew () {
                // show new words
                tween.set($newWords, {
                    y: direction === 'bottom' ? '100%' : '-100%'
                });
                $link.replaceWith($newTitle);

                if($newWords.length) {
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
            if(!$words.length) {
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
    let indicatorTimeout;
    self.updateBlogPageIndicator = function (custom = false) {
        // hide old
        $sliderNavItemsCont.find('li').addClass('old-active').removeClass('active');

        // add new indicator
        let content = custom ? custom : `${ page >= 9 ? '' : '0'}${parseInt(page, 10) + 1}`;
        $sliderNavItemsCont.append(`<li class="active">${content}</li>`);

        // remove old indicator
        clearTimeout(indicatorTimeout);
        indicatorTimeout = setTimeout(() => {
            $sliderNavItemsCont.find('.old-active').remove();
        }, 1000);
    };

    // show next 3 blog posts
    self.showNextPosts = function () {
        if(busy) {
            return;
        }
        busy = 1;

        let nextPosts = getPosts(page + 1);
        if(nextPosts.length > 0) {
            self.renderPosts(nextPosts, 'bottom', () => {
                page++;
                self.updateBlogPageIndicator();
                busy = 0;
            });
        } else if(!noMorePosts) {
            // ajax load for new blog posts
            self.runPreloader('blog');
            let loadNewPage = getPosts(page).length === 3;
            self.options.events.onLoadBlogPosts((result = [], noPosts) => {
                self.stopPreloader('blog');

                // no more posts
                if(noPosts) {
                    noMorePosts = noPosts;
                }

                // store new loaded posts in array
                if(result) {
                    self.pushNewPosts(result);

                    // rerun loading posts
                    let nextPosts = getPosts(page + (loadNewPage ? 1 : 0));
                    if(nextPosts.length > 0) {
                        self.renderPosts(nextPosts, 'bottom', () => {
                            if(loadNewPage) {
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
        if(busy) {
            return;
        }
        busy = 1;

        let nextPosts = getPosts(page - 1);
        if(nextPosts.length > 0) {
            self.renderPosts(nextPosts, 'top', () => {
                page--;
                self.updateBlogPageIndicator();
                busy = 0;
            });
        } else {
            busy = 0;
        }
    };

    // show blog posts list
    let isShown = false;
    self.showBlogPostsList = (callback = () => {}) => {
        if(isShown) {
            return;
        }
        isShown = 1;

        // clear items
        let $items = $renderedBlog.find('.nk-blog-item:eq(0), .nk-blog-item:eq(1)');
        let $hideItems = $renderedBlog.find('.nk-blog-item > *');
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
        }, 0.2, () => {
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
    self.hideBlogPostsList = (callback = () => {}) => {
        if(!isShown) {
            return;
        }

        // hide navbar
        if($navbar.hasClass('active')) {
            self.hideNavbar(() => {
                self.hideBlogPostsList(callback);
            });
            return;
        }

        isShown = 0;

        // clear items
        let $items = $renderedBlog.find('.nk-blog-item:eq(0), .nk-blog-item:eq(1)');
        let $hideItems = $renderedBlog.find('.nk-blog-item > *');

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
        }, 0.2, () => {
            // hide rendered blog container
            $renderedBlog.hide();

            callback();
        });
    };

    // fist run
    if($blog.hasClass('active')) {
        self.updateBlogList();

        // small timeout
        setTimeout(() => {
            self.showBlogPostsList();
        }, 200);
    }

    // on click nav item
    $sliderNav.on('click', '.nk-slider-nav-next', function () {
        if(self.getDefaultPageData().blogShow) {
            self.showNextPosts();
        }
    });
    $sliderNav.on('click', '.nk-slider-nav-prev', function () {
        if(self.getDefaultPageData().blogShow) {
            self.showPrevPosts();
        }
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
        $wnd.on(wheelEvent, (e) => {
            // check if delta >= 2 and mouse under slider
            if(!self.getDefaultPageData().blogShow || Math.abs(e.originalEvent.deltaY) < 2 || !$(e.target).parents('.nk-layout, .nk-blog').length) {
                return;
            }

            if(e.originalEvent.deltaY > 0) {
                self.showNextPosts();
            } else if (e.originalEvent.deltaY < 0) {
                self.showPrevPosts();
            }
        });
    }

    // swipe
    if(!isTouch || typeof Hammer === 'undefined') {
        return;
    }
    let mc = new Hammer($body[0], {
        touchAction: 'auto'
    });
    mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    mc.on('swipeup swipeleft', function(e) {
        if(self.getDefaultPageData().blogShow && $(e.target).parents('.nk-layout, .nk-blog').length) {
            self.showNextPosts();
        }
    });
    mc.on('swipedown swiperight', function(e) {
        if(self.getDefaultPageData().blogShow && $(e.target).parents('.nk-layout, .nk-blog').length) {
            self.showPrevPosts();
        }
    });
}

export { initBlog };
