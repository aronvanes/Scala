import Vue from 'vue';

import axios from 'axios'
import moment from 'moment';
import {components, plugins, filters} from 'sc-utils'
import VueObserveVisibility from 'vue-observe-visibility';
import ScLocalization from "./plugins/sc-localization";
import Vue2TouchEvents from 'vue2-touch-events'
import VueCookies from 'vue-cookies'
import VueMq from 'vue-mq'
import customComponents from './components/index.js'

require('intersection-observer');
IntersectionObserver.prototype.POLL_INTERVAL = 100; // Time in milliseconds.

require('./css/main.css');

window.moment = moment;
window.axios = axios;

Vue.use(components);
Vue.use(plugins.ScContentfulApi);
Vue.use(filters);
Vue.use(VueCookies);
Vue.use(Vue2TouchEvents);
Vue.use(VueObserveVisibility);
Vue.use(ScLocalization);
Vue.use(customComponents);

Vue.use(VueMq, {
  breakpoints: { // default breakpoints - customize this
    phone: 768,
    tablet: 1025,
    desktop: Infinity,
  }
});