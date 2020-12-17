import { $ } from "./_utility";

/*------------------------------------------------------------------

  Set Custom Options

-------------------------------------------------------------------*/
function setOptions (newOpts) {
    const self = this;

    let optsEvents = $.extend({}, this.options.events, newOpts && newOpts.events || {});
    self.options = $.extend({}, self.options, newOpts);
    self.options.events = optsEvents;
}

export { setOptions };
