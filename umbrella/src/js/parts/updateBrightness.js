import { $, debounceResize, isUmbrellaLayout } from "./_utility";

function getImageLightness(canvas, ctx, x, y, w, h) {
    let imageData = ctx.getImageData(x, y, w, h);
    let data = imageData.data;
    let r, g, b, avg;
    let colorSum = 0;

    for(let k = 0, len = data.length; k < len; k += 4) {
        r = data[k];
        g = data[k + 1];
        b = data[k + 2];

        avg = Math.floor((r + g + b) / 3);
        colorSum += avg;
    }

    return Math.floor(colorSum / (w * h));
}

/*------------------------------------------------------------------

 Update Brightness

 -------------------------------------------------------------------*/
let timeout;
let $targets = $('.nk-layout').find('.nk-layout-top-left, .nk-layout-top-left-rotated, .nk-layout-top-center, .nk-layout-top-right, .nk-layout-bottom-left, .nk-layout-bottom-right, .nk-layout-bottom-center, .nk-layout-content-subtitle, .nk-layout-content-tagline');
let $logo = $('.nk-layout [data-logo-dark]');
    $logo.attr('data-logo-light', $logo.attr('src'));
if(isUmbrellaLayout()) {
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
        callback (elem, result, complex) {
            if($logo.is(elem)) {
                if(result === 'dark') {
                    $logo.attr('src', $logo.attr('data-logo-light'));
                } else {
                    $logo.attr('src', $logo.attr('data-logo-dark'));
                }
            }
        }
    });
}
function updateBrightness (recheck = false) {
    if(!isUmbrellaLayout()) {
        return;
    }

    clearTimeout(timeout);

    // recheck
    if(recheck) {
        BackgroundCheck.set('images', $('img:not([data-logo-light], [data-logo-dark]), div, body'));
        return;
    }

    timeout = setTimeout(function () {
        if(typeof BackgroundCheck !== 'undefined') {
            BackgroundCheck.refresh();
        }
    }, 100);
}

export { updateBrightness };
