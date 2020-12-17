import { $, tween } from "./_utility";

/*------------------------------------------------------------------

 Init Page Content

 -------------------------------------------------------------------*/
function initPageContent () {
    const self = this;
    let $navbar = $('.nk-navbar');
    let $main = $('.nk-main');
    let $mainBg = $main.next('.nk-main-bg');
    let $mainAndBg = $main.add($mainBg);
    let busy = 0;

    // check side for animation (right, top, bottom)
    function checkSide (type = 'in') {
        let result = $main.attr('data-transition-' + type);
        if(result !== 'top' && result !== 'bottom' && result !== 'right') {
            result = 'right';
        }
        return result;
    }

    // show sliding content
    self.showContent = (callback = () => {}) => {
        if(busy || $main.hasClass('active')) {
            callback();
            return;
        }

        // hide navbar
        if($navbar.hasClass('active')) {
            self.hideNavbar(() => {
                self.showContent(callback);
            });
            return;
        }

        busy = 1;

        // options
        let side = checkSide('in');
        let transitionSpeed = parseInt($main.attr('data-transition-speed'), 10) || 500;

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
            onComplete () {
                busy = 0;
                callback();
                self.updateBrightness();
            }
        });
    };

    // hide sliding content
    self.hideContent = (callback = () => {}) => {
        if(busy || !$main.hasClass('active')) {
            callback();
            return;
        }

        busy = 1;

        // options
        let side = checkSide('out');
        let transitionSpeed = parseInt($main.attr('data-transition-speed'), 10) || 500;

        $main.removeClass('active');

        // stop previous tween
        tween.killTweensOf($mainAndBg);

        // set default styles
        tween.set($mainAndBg, {
            y: '0%',
            x: '0%',
            margin: 0,
        });

        function onComplete () {
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
    if(self.getDefaultPageData().contentShow) {
        // small timeout
        setTimeout(() => {
            $main.removeClass('active');
            self.showContent();
        }, 200);
    }
}

export { initPageContent };
