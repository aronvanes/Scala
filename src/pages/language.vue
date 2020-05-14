<template>
    <div class="language-select fill-content">
        <div class="lang-hero"/>
        <h1 class="lang-header">
            {{ $store.getters.translation('topic.language-select.title', $route.params.lang) }}
        </h1>

        <div class="lang-options">
            <div class="lang-option" v-for="locale in Object.keys(locales)" :key="'translation'+locale" @click="selectLanguage(locale)">
                <flags :locale="locale" width="24" height="18" />
                <div>
                    {{ locales[locale].name }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import Flags from '~/components/flags.vue'

  export default {
    name: "language",
    components: {
      Flags
    },

    data() {
      return {
        locales: this.$store.state.locales,
        cookie_necessary: this.$cookies.get("gdpra_necessary")
      }
    },

    methods: {
      selectLanguage(lang) {
          lang = lang.toLowerCase();
        if (this.cookie_necessary !== null && this.cookie_necessary === 'true') {
          this.$cookies.set('v_lang', lang, "3650D");
        }
        this.$store.dispatch('SET_LOCALE', lang);
        this.$router.push('/'+lang);
        location.reload();
      },
    }
  }
</script>
