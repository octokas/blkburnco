import { $, $body, wndW } from "./_utility";

/*------------------------------------------------------------------

 Run Preloader
 type = page, blog

 -------------------------------------------------------------------*/
let $spinnerPlace = $('.blk-loading-spinner-place');
let $preloader = $('<div class="blk-preloader">').appendTo($body);
let spinner = '<div class="blk-spinner"><span></span></div>';
let blogSpinnerInSpinnerPlace = 0;

function runPreloader (type = 'page') {
    const self = this;

    // show overlay
    $preloader.show();

    // show blog spinner like normal ajax spinner on mobile devices
    blogSpinnerInSpinnerPlace = type === 'blog' && wndW <= self.options.mobile;

    if(type === 'blog' && !blogSpinnerInSpinnerPlace) {
        self.updateBlogPageIndicator(spinner);
    } else {
        $spinnerPlace.html(spinner);
    }
}
function stopPreloader (type = 'page') {
    const self = this;

    // hide overlay
    $preloader.hide();

    if(type === 'blog' && !blogSpinnerInSpinnerPlace) {
        self.updateBlogPageIndicator();
    } else {
        $spinnerPlace.html('');
        blogSpinnerInSpinnerPlace = 0;
    }
}

export { runPreloader, stopPreloader };
