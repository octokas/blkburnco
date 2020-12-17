/*------------------------------------------------------------------

  Theme Options

-------------------------------------------------------------------*/
let options = {
    // mobile device width (need for slider to activate all categories)
    mobile: 991,

    // automatically show all categories on mobile devices
    sliderShowAllCategoriesOnMobile: true,

    // enable AJAX page loading
    ajax: true,

    events: {
        // before ajax loading click. Return true to prevent ajax loading
        onBeforeAjaxPageLoad (event) {
            return false;
        },

        // after ajax page loaded
        onAfterAjaxPageLoad (data) {

        },

        // callback to load new posts in blog
        onLoadBlogPosts (callback = () => {}) {
            // fake timeout to demonstrate loading
            setTimeout(() => {
                // new posts will be appended to the current list
                let newPosts = [
                    {
                        title: 'Other designers are experimenting with backless blouses, cut-out crop tops, and spine-baring slips',
                        url: 'blog-article.html'
                    }, {
                        title: 'The style has long been considered to be the cotton anti-sexy of the underpinning world, with its noticeable seams and overtly full-coverage silhouette',
                        url: 'blog-article.html'
                    }, {
                        title: 'Or a little pantaloon, while maybe not sexy, can be really pretty and sweet',
                        url: 'blog-article.html'
                    }
                ];

                // if true, ajax loading will never run again
                let noMorePosts = true;

                callback(newPosts, noMorePosts);
            }, 1200);
        }
    }
};

export { options };
