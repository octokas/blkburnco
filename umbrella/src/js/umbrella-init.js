import { options } from "./parts/_options";

if(typeof Umbrella !== 'undefined') {
    Umbrella.setOptions(options);
    Umbrella.init();
}
