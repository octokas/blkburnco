
import { options } from './parts/_options';
import { $wnd, debounceResize, throttleScroll, bodyOverflow, isInViewport, scrollTo } from './parts/_utility';
import { setOptions } from './parts/setOptions';
import { updateBrightness } from './parts/updateBrightness';
import { runPreloader, stopPreloader } from './parts/preloader';
import { initPages } from './parts/initPages';
import { initPageTitles } from './parts/initPageTitles';
import { initPageSlider } from './parts/initPageSlider';
import { initPageContent } from './parts/initPageContent';
import { initBlog } from './parts/initBlog';
import { initNavbar } from './parts/initNavbar';
import { initForms } from './parts/initForms';
import { initFormsMailChimp } from './parts/initFormsMailChimp';

/* Plugins */
import { initPluginFastClick } from './parts/initPluginFastClick';
import { initPluginNano } from './parts/initPluginNano';
import { initPluginTabs } from './parts/initPluginTabs';

/*------------------------------------------------------------------

  UMBRELLA Class

-------------------------------------------------------------------*/
class UMBRELLA {
    constructor () {
        this.options = options;
    }

    init () {
        let self = this;
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
    setOptions (newOpts) {
        return setOptions.call(this, newOpts);
    }
    updateBrightness (func) {
        return updateBrightness.call(this, func);
    }
    debounceResize (func) {
        return debounceResize.call(this, func);
    }
    throttleScroll (callback) {
        return throttleScroll.call(this, callback);
    }
    bodyOverflow (type) {
        return bodyOverflow.call(this, type);
    }
    isInViewport ($item, returnRect) {
        return isInViewport.call(this, $item, returnRect);
    }
    scrollTo ($to, callback) {
        return scrollTo.call(this, $to, callback);
    }
    runPreloader (type) {
        return runPreloader.call(this, type);
    }
    stopPreloader (type) {
        return stopPreloader.call(this, type);
    }

    initPages () {
        return initPages.call(this);
    }
    initPageTitles () {
        return initPageTitles.call(this);
    }
    initPageSlider () {
        return initPageSlider.call(this);
    }
    initPageSlidingContent () {
        return initPageContent.call(this);
    }
    initNavbar () {
        return initNavbar.call(this);
    }
    initBlog () {
        return initBlog.call(this);
    }
    initForms () {
        return initForms.call(this);
    }
    initFormsMailChimp () {
        return initFormsMailChimp.call(this);
    }


    initPluginFastClick () {
        return initPluginFastClick.call(this);
    }
    initPluginNano ($context) {
        return initPluginNano.call(this, $context);
    }
    initPluginTabs ($context) {
        return initPluginTabs.call(this, $context);
    }
}


/*------------------------------------------------------------------

  Init Umbrella

-------------------------------------------------------------------*/
window.Umbrella = new UMBRELLA();
