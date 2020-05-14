<template>
    <div id="app" class="font-size">
        <cookie-consent></cookie-consent>
        <language-location-prompt></language-location-prompt>
        <main-menu></main-menu>
        <transition name="main-page-transition">
            <router-view :key="`${$route.fullPath}`"></router-view>
        </transition>
        <sc-footer></sc-footer>
        <div class="resizeLoader" v-if="resizing">
            {{ $store.getters.translation('general.loading') }}...
        </div>
    </div>
</template>

<script>
  import CookieConsent from '~/components/cookie-consent.vue'
  import MainMenu from '~/components/main-menu.vue'
  import scFooter from '~/components/sc-footer.vue'
  import LanguageLocationPrompt from "~/components/language-location-prompt.vue";

  export default {
    name: 'app',
    components: {
      LanguageLocationPrompt,
      CookieConsent,
      MainMenu,
      scFooter
    },

    data() {
      return {
        resizing: false,
        resizeTimer: null,
        windowWidth: window.innerWidth
      }
    },

    beforeDestroy() {
      document.removeEventListener("visibilitychange", this.handleVisibilityChange);
      window.removeEventListener("blur", this.handleOnWindowBlur);
      window.removeEventListener("focus", this.handleOnWindowFocus);
      window.removeEventListener("resize", this.handleOnWindowResize);
    },

    methods: {
      handleOnWindowVisibilityChange() {
        this.$events.$emit('window-visible', !document.hidden)
      },
      handleOnWindowBlur() {
        this.$events.$emit('window-active', false)
      },
      handleOnWindowFocus() {
        this.$events.$emit('window-active', true);
      },
      handleOnWindowResize() {
        if (window.innerWidth !== this.windowWidth) {
          this.resizing = true;
          clearTimeout(this.resizeTimer);
          this.resizeTimer = setTimeout(() => {
            this.windowWidth = window.innerWidth;
            this.$events.$emit('resize-event', {});
            setTimeout(() => {
              this.resizing = false;
            }, 250)

          }, 100)
        }
      },
    },
    created() {
      document.addEventListener("visibilitychange", this.handleOnWindowVisibilityChange);
      window.addEventListener("blur", this.handleOnWindowBlur);
      window.addEventListener("focus", this.handleOnWindowFocus);
      window.addEventListener("resize", this.handleOnWindowResize);
    },
    metaInfo() {
      return {
        htmlAttrs: {
          lang: this.$getLocale(),
        },
        meta: [
          {vmid: 'og:site_name', property: 'og:site_name', content: 'scala.com'},
          {vmid: 'og:type', property: 'og:type', content: 'website'},
          {vmid: 'og:locale', property: 'og:locale', content: this.$getLocale()},
          {vmid: 'og:url', property: 'og:url', content: window.location.href}
        ],
        titleTemplate: (titleChunk) => {
          // If undefined or blank then we don't need the hyphen
          // Fallback will be default for the website.
          // Pages besides home will be hyphened with ' - Scala'.
          return titleChunk ? `${titleChunk} - Scala` : 'Scala Connected Signage';
        }
      }
    }
  }
</script>

<style scoped>

    .main-page-transition-enter-active,
    .main-page-transition-leave-active {
        transition-property: opacity;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
    }

    .main-page-transition-leave-active {
        background: #fff;
        position: absolute;
        z-index:100;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }

    .main-page-transition-leave {
        opacity: 1;
    }

    .main-page-transition-leave-to {
        opacity: 0;
    }

</style>
