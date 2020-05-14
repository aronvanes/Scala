<template>
    <div class="sc-footer">
        <sc-triangle v-bind="leftTriangleProps()"/>
        <div class="width-container">

            <!-- LANG, OPTIONS & SOCIAL -->
            <div class="navigation">
                <div v-if="$mq === 'desktop'" class="current-language" @click="gotoLanguageSelect()">
                    <flags width="20" :locale="$getLocale()"/>
                    <div class="cl-language">
                        {{ $store.state.locales[$getLocale()].name }}
                    </div>
                </div>

                <div class="navigation-items">
                    <template v-for="(item, index) in items" v-if="items.length > 0">
                        <router-link :to="$getRoute(item.fields.slug)">
                            {{item.fields.text}}
                        </router-link>
                    </template>
                </div>

                <div v-if="$mq !== 'desktop'" class="current-language" @click="gotoLanguageSelect()">
                    <flags width="20" :locale="$getLocale()"/>
                    <div class="cl-language">
                        {{ $store.state.locales[$getLocale()].name }}
                    </div>
                </div>

                <div class="social">
                    <a v-if="socialItems.length > 0"
                       v-for="(subItem) in socialItems"
                       class="nav-item-social"
                       :alt="subItem.fields.text"
                       @click="openSocial(subItem.fields.url, $event)"
                    >
                        <icon-twitter v-if="subItem.fields.name.indexOf('twitter') !== -1" key="menu-social-twitter"></icon-twitter>
                        <icon-linkedin v-if="subItem.fields.name.indexOf('linkedin') !== -1" key="menu-social-linkedin"></icon-linkedin>
                        <icon-facebook v-if="subItem.fields.name.indexOf('facebook') !== -1" key="menu-social-facebook"></icon-facebook>
                    </a>
                </div>
            </div>

            <div class="separator" />

            <!-- COPYRIGHT & LEGAL -->
            <div class="copy">
                <div class="footer-copyright">
                    Copyright © {{today.getFullYear()}} Scala B.V. {{ $store.getters.translation('general.all-rights-reserved')}}.
                </div>
                <div class="footer-legal">
                    <span @click="$router.push($getRoute('privacy-policy'))">{{ $store.getters.translation('general.privacy-policy') }}</span> | <span @click="$store.dispatch('SET_GDPR_PROMPT_VALUE', true)">{{ $store.getters.translation('general.cookies') }}</span>
                    <!--| {{ $store.getters.translation('general.policies') }} | {{ $store.getters.translation('general.legal') }}-->
                </div>
            </div>
        </div>

    </div>
</template>

<script>
  import Flags from '~/components/flags.vue'
  import ScTriangle from '~/components/sc-design-elements/sc-triangle.vue'

  import IconTwitter from "~/components/icons/icon-twitter.vue";
  import IconLinkedin from "~/components/icons/icon-linkedin.vue";
  import IconFacebook from "~/components/icons/icon-facebook.vue";
  export default {
    name: 'sc-footer',
    components: {Flags, ScTriangle, IconLinkedin, IconFacebook, IconTwitter},
    data() {
      return {
        today: new Date(),
        items: [],
        socialItems: []
      }
    },
    created() {
      this.fetch()
    },
    methods: {

      openSocial(route, e) {
        e.preventDefault();
        window.open(route, '_blank');
      },

      leftTriangleProps() {
        let result = {};
        result.elemStyle = {
          position: 'absolute',
          top: 0,
          left: 'calc(100% - 90%)',
          transform: {
            rotate: 65,
            scale: 1.75
          }
        };
        result.stroke = 10;
        result.solid = false;
        result.opacity = 0.1;
        return result;
      },

      gotoLanguageSelect() {
        this.$router.push(this.$getRoute('language'))
      },

      fetch() {
        this.$getEntries({'content_type': 'sysNav', 'fields.name': 'scala.footer.nav', include: 3})
          .then((res) => {
            if (res.items.length > 0) {

              res.items[0].fields.items.forEach((item) => {
                if (item.fields.name !== 'scala.nav.social') {
                  this.items.push(item);
                } else {

                  if (item.fields.subitems.length > 0) {
                    item.fields.subitems.forEach((subItem) => {
                      this.socialItems.push(subItem);
                    })
                  }
                }
              });
            }
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  }
</script>
