import './bootstrap.js'

import Vue from 'vue'
import VueGtm from 'vue-gtm'
import VueRouter from 'vue-router'
import Meta from 'vue-meta'
import App from './App.vue'
import appRoutes from './routes.js'
import store from './stores/index.js'

Vue.use(VueRouter);

let router = null;

(async function () {
  window.axios = axios;
  await appRoutes.getRoutes();
  let routes = appRoutes.routes;

  router = new VueRouter({
    routes: routes,
    mode: 'history',
    linkActiveClass: 'is-active',
  });

  Vue.use(Meta, {
    keyName: 'metaInfo',
    attribute: 'data-vue-meta',
    tagIDKeyName: 'vmid'
  });

  Vue.use(VueGtm, {
    enabled: false,  // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
    debug: true,        // Whether or not display console logs debugs (optional)
    vueRouter: router, // Pass the router instance to automatically sync with router (optional)
    // ignoredViews: ['home'] // If router, you can exclude some routes name (case insensitive) (optional)
  });

  router.beforeEach((to, from, next) => {
    let lang = undefined;
    const matches = [/^\/\w{2}$/gm, /^\/{1}\w{2}\//gm, /^\/{2}\w{2}\//gm];


    if (['/', '/404', '/404/', '/thanks', '/thanks/', '/error', '/error/'].includes(to.path)) {
      lang = "en";

    } else {

      for (let i = 0; i < matches.length; i++) {
        let result = to.path.match(matches[i]);
        if (result !== null) {
          lang = result[0].replace(/\//g, "");
          break;
        }
      }

      if (!Object.keys(store.state.locales).includes(lang)) {
        // Locale doesn't exist
        console.warn("Language not available");
        // Does not match a supported locale, route must be faulty redirect to 404.
        return next('404');
      }
    }

    if (store.getters.getLocale() !== lang) {
      store.dispatch("SET_LANG", lang);
    }

    next();
  });

  Vue.use({
    install(V) {
      let events = new Vue();
      V.prototype.$events = events;
      V.events = events;
    }
  });

  new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data() {
      return {
        ready: false,
        routes: undefined
      }
    },
    beforeMount() {
      const COOKIE_THIRD_PARTY = this.$cookies.get("gdpra_third_party");
      if (COOKIE_THIRD_PARTY !== null && COOKIE_THIRD_PARTY === 'true') {
        this.$gtm.enable(true);
        dataLayer.push({'event': 'scala_consent_given'});
      }
    },

    mounted() {
      this.fetchDefaultTranslations();
    },

    methods: {
      fetchDefaultTranslations() {
        this.$getEntries({
          'content_type': 'sysLanguage',
          'sys.id': '7gkzxNGY1yqS0g4UMiyKEC',
          locale: '*'
        }, true)
          .then((res) => {
            this.$store.dispatch('LOAD_TRANSLATIONS', res.items[0]);
            this.fetchBrandTranslations();
          })
          .catch((err) => {
            console.error(err);
          })
      },

      fetchBrandTranslations() {
        this.$getEntries({
          content_type: 'sysLanguage',
          locale: '*'
        }).then((res) => {
          this.$store.dispatch('APPEND_TRANSLATIONS', res.items[0])
            .then(() => {
              // Required for prerendering.
              setTimeout(() => {
                document.dispatchEvent(new Event('render-event'));
              }, 100)

            })
            .catch((err) => {
              console.warn(err);
            });
        })
          .catch((err) => {
            console.error(err);
          })
      }
    }

  });
})();
