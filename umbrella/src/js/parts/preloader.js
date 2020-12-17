import { $, $body, wndW } from "./_utility";

/*------------------------------------------------------------------

 Run Preloader
 type = page, blog

 -------------------------------------------------------------------*/
let $spinnerPlace = $('.nk-loading-spinner-place');
let $preloader = $('<div class="nk-preloader">').appendTo($body);
let spinner = '<div class="nk-spinner"><span></span></div>';
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
