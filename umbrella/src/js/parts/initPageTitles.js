import { $, tween } from "./_utility";

/*------------------------------------------------------------------

 Init Pages Titles

 -------------------------------------------------------------------*/
function initPageTitles () {
    const self = this;
    let $layout = $('.nk-layout:eq(0)');
    let $title = $layout.find('.nk-layout-content-title');
    let $subtitle = $layout.find('.nk-layout-content-subtitle');
    let $tagline = $layout.find('.nk-layout-content-tagline');
    let $main = $('.nk-main:eq(0)');

    // create shadow items for transitions
    let $titleShadow = $('<h4>').css('display', 'none').addClass('nk-layout-content-title').insertAfter($title);
    let $subtitleShadow = $('<h4>').css('display', 'none').addClass('nk-layout-content-subtitle').insertAfter($subtitle);
    let $taglineShadow = $('<div>').css('display', 'none').addClass('nk-layout-content-tagline').insertAfter($tagline);

    // show title
    // effects: left, right, fade
    self.showTitle = (title = '', effect = 'right') => {
        let cur = self.getCurrentPageData();

        // prevent transition if the same title
        if(cur.pageTitle === title) {
            return;
        }

        let shadowX = effect === 'left' ? '150%' : effect=== 'right' ? '-150%' : '0%';
        let X = effect === 'left' ? '-150%' : effect=== 'right' ? '150%' : '0%';
        let startOpacity = effect === 'fade' ? 0 : 1;

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
            onComplete () {
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
    self.showSubtitle = (subtitle = '') => {
        let cur = self.getCurrentPageData;

        // prevent transition if the same subtitle
        if(cur.pageSubtitle === subtitle) {
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
            onComplete () {
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
    self.showTagline = (tagline = '') => {
        let cur = self.getCurrentPageData;

        // prevent transition if the same tagline
        if(cur.pageTagline === tagline || !$tagline.is(':visible')) {
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
            onComplete () {
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

export { initPageTitles };
