/*!-----------------------------------------------------------------
  Name: Umbrella. - Photography HTML Template
  Version: 1.1.2
  Author: blkburn, blkburn
  Website: https://nkdev.info
  Purchase: https://themeforest.net/item/umbrella-photography-html-template/17889537
  Support: https://nk.ticksy.com
  License: You must have a valid license purchased only from ThemeForest (the above link) in order to legally use the theme for your project.
  Copyright 2018.
-------------------------------------------------------------------*/
;(function() {
'use strict';

/*------------------------------------------------------------------

  Theme Options

-------------------------------------------------------------------*/
var options = {
    // mobile device width (need for slider to activate all categories)
    mobile: 991,

    // automatically show all categories on mobile devices
    sliderShowAllCategoriesOnMobile: true,

    // enable AJAX page loading
    ajax: true,

    events: {
        // before ajax loading click. Return true to prevent ajax loading
        onBeforeAjaxPageLoad: function onBeforeAjaxPageLoad(event) {
            return false;
        },


        // after ajax page loaded
        onAfterAjaxPageLoad: function onAfterAjaxPageLoad(data) {},


        // callback to load new posts in blog
        onLoadBlogPosts: function onLoadBlogPosts() {
            var callback = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : function () {};

            // fake timeout to demonstrate loading
            setTimeout(function () {
                // new posts will be appended to the current list
                var newPosts = [{
                    title: 'Other designers are experimenting with backless blouses, cut-out crop tops, and spine-baring slips',
                    url: 'blog-article.html'
                }, {
                    title: 'The style has long been considered to be the cotton anti-sexy of the underpinning world, with its noticeable seams and overtly full-coverage silhouette',
                    url: 'blog-article.html'
                }, {
                    title: 'Or a little pantaloon, while maybe not sexy, can be really pretty and sweet',
                    url: 'blog-article.html'
                }];

                // if true, ajax loading will never run again
                var noMorePosts = true;

                callback(newPosts, noMorePosts);
            }, 1200);
        }
    }
};

if (typeof Umbrella !== 'undefined') {
    Umbrella.setOptions(options);
    Umbrella.init();
}
}());
