import Vue from 'vue'

export const mutations = {
  SET_LANG(state, lang) {
    if (state.locales[lang] !== undefined) {
      state.locale = lang;
    } else {
      let e = new Error();
      e.statusCode = 400;
      throw e;
    }
  },
  SET_TRANSLATIONS_BOOL(state, value) {
    state.fetchTranslations = value;
  },
  SET_HELPER(state, helper) {
    Vue.set(state, 'fetchTranslations', true);
    Vue.set(state, 'helper', helper);
  },
  SET_GDPR_PROMPT_VALUE(state, value) {
    state.displayGDPRPrompt = value;
  },
  LOAD_TRANSLATIONS(state, value) {
    for (let locale in state.locales) {
      let iso = state.locales[locale].iso;
      if (typeof value.fields.translations[iso] !== 'undefined')
        state.locales[locale].translations = value.fields.translations[state.locales[locale].iso];
    }
  },
  APPEND_TRANSLATIONS(state, value) {
    for (let locale in state.locales) {
      let iso = state.locales[locale].iso;
      if (typeof value.fields.translations[iso] !== 'undefined')
        state.locales[locale].translations = Object.assign({}, state.locales[locale].translations, value.fields.translations[state.locales[locale].iso]);
    }
  }
};
