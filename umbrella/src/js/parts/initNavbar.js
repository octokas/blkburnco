import { $, tween, $doc } from "./_utility";

/*------------------------------------------------------------------

 Init Navbar

 -------------------------------------------------------------------*/
function initNavbar () {
    const self = this;
    let $main = $('.nk-main');
    let $navbar = $('.nk-navbar');
    let $navbarBg = $navbar.next('.nk-navbar-bg');
    let $navbarBgImage = $navbarBg.find('.nk-navbar-image');
    let busy = 0;

    // toggle navbars
    function updateTogglers () {
        $('.nk-nav-toggle').each(function () {
            let active = $navbar.hasClass('active');
            $(this)[(active ? 'add' : 'remove') + 'Class']('active');
        });
    }
    self.toggleNavbar = (callback = () => {}) => {
        self[$navbar.hasClass('active') ? 'hideNavbar' : 'showNavbar'](callback);
    };
    self.showNavbar = (callback = () => {}) => {
        if(busy || $navbar.hasClass('active') || self.isInPageLoadQueue()) {
            return;
        }

        // hide main content
        if($main.hasClass('active')) {
            self.hideContent(() => {
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
        if($navbarBgImage.is(':visible')) {
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
            onComplete() {
                busy = 0;
                callback();
                self.updateBrightness();
            }
        });

        updateTogglers();
    };
    self.hideNavbar = (callback = () => {}) => {
        if(busy || !$navbar.hasClass('active')) {
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
            onComplete () {
                busy = 0;

                callback();

                // show main content if closed all items
                if(!self.isInPageLoadQueue()) {
                    if(self.getDefaultPageData().contentShow && !$main.add($navbar).is('.active')) {
                        self.showContent();
                    } else {
                        self.updateBrightness();
                    }
                }
            }
        });

        // hide background image if visible
        if($navbarBgImage.is(':visible')) {
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
        if(!e.isDefaultPrevented()) {
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

export { initNavbar };
