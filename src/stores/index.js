import Vue from 'vue'
import Vuex from 'vuex'
import {actions} from './actions'
import {mutations} from './mutations'
import locales from '~/config/locales'
import appRoutes from '~/routes.js'

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
    locales: locales,
    locale: 'en',
    displayGDPRPrompt: false,
    displayLangPrompt: false,
    slugs: undefined,
    fetchTranslations: false,
    routes: appRoutes,
  },
  actions,
  mutations,
  getters: {
    /**
     * $store.getters.translation fetches the translation for certain path and locale.
     * If locale isn't provided it defaults back to the locale found in $store.state
     * @param {string} path - path is a . separated string such as "test" or "test.deeper-test"
     * @param {string} [locale] - Optional parameter
     * @returns {[string]} Returns a string if a match has been found.
     */
    translation: (state) => (path, locale) => {
      locale = typeof locale !== 'undefined' ? locale : state.locale;
      if (state.locales[locale] !== undefined) {
        let translations = state.locales[locale].translations;

        if (typeof translations !== 'undefined') {
          let prevKey = undefined;
          return path.split('.').reduce((translations, key) => {
            if (typeof translations !== 'undefined') {
              if (typeof translations[key] === 'undefined') {
                console.warn("Could not find", key, "in", prevKey, ":", translations);
                return key;
              } else {
                if (typeof translations[key] !== 'undefined') {
                  prevKey = key;
                  return translations[key];
                } else {
                  console.warn("Unable to translate:", path, "for", locale);
                }
              }
            }
          }, translations);
        }
      }
    },

    /**
     * $store.getters.get('path') Allows to recursively find a state value in the store.
     * @param {string} path - path is a . separated string such as "test" or "test.deeper-test"
     * @returns value - Returns whatever has been found, if it's been found.
     */
    get: (state) => (path) => {
      let prevKey = undefined;
      return path.split('.').reduce((state, key) => {
        if (typeof state === 'undefined') {
          console.warn("Could not find", key, "in", prevKey, ":", state);
          return key;
        } else {
          if (typeof state[key] !== 'undefined') {
            prevKey = key;
            return state[key];
          } else {
            console.warn("Unable to get path:", path);
          }
        }
      }, state);
    },

    getLocale: (state) => () => {
      return state.locale;
    },

    getLocaleByIso: (state) => (iso) => {
      for (let localeKey in state.locales) {
        if (state.locales[localeKey].iso === iso) {
          return localeKey;
        }
      }
    },

    getLocaleIso: (state) => (lang) => {
      if (state.locales[lang]) {
        return state.locales[lang].iso;
      } else {
        return 'en-US'
      }
    },

    getMonth: (state) => (index) => {
      return state.locales[state.locale].translations.general.months.full[index];
    },

    getMonthShort: (state) => (index) => {
      return state.locales[state.locale].translations.general.months.short[index];
    },
  }
})
