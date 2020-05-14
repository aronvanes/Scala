export const actions = {
  TOGGLE_TRANSLATIONS ({ commit }, value) {
    commit('SET_TRANSLATIONS_BOOL', value)
  },
  SET_LANG ({ commit }, lang) {
    commit('SET_LANG', lang)
  },
  SET_TRANSLATION_HELPER({ commit }, helper) {
    commit('SET_HELPER', helper)
  },
  SET_GDPR_PROMPT_VALUE ({ commit }, value) {
    commit('SET_GDPR_PROMPT_VALUE', value);
  },
  LOAD_TRANSLATIONS ({ commit }, value) {
    commit('LOAD_TRANSLATIONS', value);
  },
  APPEND_TRANSLATIONS ({ commit }, value) {
    commit('APPEND_TRANSLATIONS', value);
  }
};
