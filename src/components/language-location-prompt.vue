<template>
    <transition name="fade" v-if="displayPrompt && typeof locationData !== 'undefined' && Object.keys($store.state.locales).length > 1">
        <!--<div :class="displayPrompt ? 'language-prompt visible BUILD_IGNORE' : 'language-prompt'" >-->
        <div class="language-prompt">
            <div class="lp-description">
                {{ $store.getters.translation('topic.language-select.description', locationData.country_code.toLowerCase()) }}
            </div>
            <div>
                <select class="lp-select" v-model="selected">
                    <option :value="locationData.country_code" v-if="Object.keys($store.state.locales).indexOf(locationData.country_code.toLowerCase()) !== -1">
                        {{ $store.getters.translation('general.'+
                            $store.state.locales[locationData.country_code.toLowerCase()].identifier,
                            locationData.country_code.toLowerCase()) }}
                    </option>
                    <option :value="false">
                        {{ $store.getters.translation('topic.language-select.option', locationData.country_code.toLowerCase())  }}
                    </option>
                </select>
            </div>
            <div @click="continueClick()" class="lp-button">
                {{ $store.getters.translation('general.continue', locationData.country_code.toLowerCase()) }}
            </div>
            <div @click="ignoreChoice()" class="lp-close">
                X
            </div>
        </div>
    </transition>
</template>

<script>
  import Flags from '~/components/flags.vue'
  export default {
    name: "language-location-prompt",
    components: {
      Flags
    },
    data() {
      return {
        displayPrompt: false,
        locationData: undefined,
        selected: '',
        cookie_necessary: this.$cookies.get("gdpra_necessary")
      }
    },

    created() {
      this.shouldPrompt();
    },

    methods: {
      ignoreChoice() {
        sessionStorage.setItem("v_lang", "en");
        this.displayPrompt = false;
      },

      continueClick() {
        if (this.selected === false) {
          this.ignoreChoice();
          this.$router.push( this.$getRoute('language') );
        } else {
          let locale = this.selected.toLowerCase();
          if (this.cookie_necessary !== null && this.cookie_necessary === 'true') {
            this.$cookies.set('v_lang',locale,"3650D","/");
          }
          this.$store.dispatch('SET_LOCALE', locale);
          location.reload();
        }
      },

      shouldPrompt() {
        let ssVal = sessionStorage.getItem('v_lang');
        if (ssVal !== null) {
          this.displayPrompt = false;

        } else {
          let cookieVal = this.$cookies.get('v_lang');
          if (cookieVal === null || typeof cookieVal === 'undefined') {
            this.requestLocationInfo();
          } else {
            if (cookieVal === "") {
              this.requestLocationInfo();
            }
            // this.displayPrompt = cookieVal === '';
          }
        }
      },

      requestLocationInfo() {
        let path = this.$route.path;
        axios.get("https://geoip-db.com/json/")
          .then((res) => {
            this.locationData = res.data;
            this.selected = ['US','GB', 'IR', 'CA'].includes(res.data.country_code) ? 'en' : res.data.country_code;

            let matchLocale = new RegExp('^/'+this.selected.toLowerCase());
            if (path === '/' && this.selected !== 'en' || path.match(matchLocale) === null) {
              this.displayPrompt = true;
            }
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  }
</script>