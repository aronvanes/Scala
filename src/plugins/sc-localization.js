const ScLocalization = {
  install(Vue, options) {

    Vue.prototype.$getLocale = function() {
      return this.$store.getters.getLocale();
    };

    Vue.prototype.$getRoute = function(obj, locale) {
      if (typeof locale === 'undefined') locale = this.$getLocale();

      switch(typeof obj) {
        case "undefined":
          if (locale ==='en')
            return "/";
          else
            return "/"+locale;

        case "object":
          return this.$store.state.routes.getRoute(locale, obj.fields);

        case "string":
          return this.$store.state.routes.getRoute(locale, obj);
      }
    }
  }
};

export default ScLocalization;
