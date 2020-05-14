<template>
    <div v-if="displayGDPRMessage" id="gdpr-banner" :class="displayGDPRMessage ? 'visible BUILD_IGNORE' : ''">
        <div class="width-container">
            <div class="gdpr-wrapper" v-if="messages.general">
                <div class="gdpr-message">
                    <h2 class="heading bold gdpr-title">{{ messages.general.fields.title }}</h2>
                    {{ messages.general.fields.description }}
                    <span class='gdpr-learn-more' @click="showMore = !showMore">
                        {{$store.getters.translation('buttons.learn-more')}}
                    </span>
                </div>

            </div>

            <div class="gdpr-wrapper" v-if="showMore" style="padding-top: 0;">
                <div class="cookies-privacy">
                    <h3 class="heading bold gdpr-title">
                        {{ messages.privacy.fields.title }}
                    </h3>
                    {{ messages.privacy.fields.description }}
                </div>
            </div>

            <div class="gdpr-options">
                <template v-for="message in ['necessary', 'thirdParty']">
                    <div class="gdpr-wrapper flex f-row" :key="message+'Message'" v-if="messages[message]">
                        <div class="gdpr-toggle f-shrink zero">
                            <input-toggle :value.sync="cookies[message]"
                                          :key="'cookies.'+message"
                                          :disabled="message === 'necessary'"/>
                        </div>

                        <div class="gdpr-description">
                            <h4 class="heading bold gdpr-title">
                                {{ messages[message].fields.title }}
                            </h4>
                            {{ messages[message].fields.description }}
                        </div>
                    </div>
                </template>
            </div>

            <div class="gdpr-wrapper flex f-row">
                <div class="gdpr-button accept noselect" @click="acceptAll">
                    {{ $store.getters.translation("general.accept-all") }}
                </div>

                <div class="gdpr-button noselect" @click="saveGDPRPreferences">
                    {{ $store.getters.translation("general.save-preferences") }}
                </div>
            </div>

        </div>
    </div>
</template>

<script>
  import InputToggle from '~/components/input-toggle.vue'

  export default {
    name: "cookie-consent",
    components: {
      InputToggle
    },
    data() {
      return {
        displayGDPRMessage: false,
        cookieChecked: false,

        messages: {
          general: undefined,
          privacy: undefined,
          necessary: undefined,
          thirdParty: undefined
        },

        showMore: false,

        cookies: {
          necessary: true,
          thirdParty: this.$cookies.get("gdpra_third_party") === null ? true : this.$cookies.get("gdpra_third_party") === 'true',
        }
      }
    },

    beforeMount() {
      this.$store.watch((state, getters) => getters.get('displayGDPRPrompt'), (value) => {
        if (value) {
          this.fetch();
          if (!this.displayGDPRMessage) {
            this.displayGDPRMessage = true;
            document.body.scrollTop = document.documentElement.scrollTop = 0;
          }
        }
      });
    },

    mounted() {
      const COOKIE_POPUP = this.$cookies.get("gdpra_popup");
      if (COOKIE_POPUP === null) {
        this.$store.commit("SET_GDPR_PROMPT_VALUE", true);
      } else {
        this.cookieChecked = true;
      }
    },

    methods: {
      fetch() {
        this.$getEntries({'content_type': 'topics', 'fields.name': 'cookie-consent', select: 'fields.paragraphs'})
          .then((res) => {
            if (res.items.length > 0) {
              let data = res.items[0];
              for (let i = 0; i < data.fields.paragraphs.length; i++) {
                let p = data.fields.paragraphs[i];
                if (p.fields.name === 'cookie-message-' + process.env.BRAND_NAME) {
                  this.messages.general = p;
                }
                if (p.fields.name === 'cookie-privacy-' + process.env.BRAND_NAME) {
                  this.messages.privacy = p;
                }
                if (p.fields.name === 'cookie-necessary-' + process.env.BRAND_NAME) {
                  this.messages.necessary = p;
                }
                if (p.fields.name === 'cookie-third-party-' + process.env.BRAND_NAME) {
                  this.messages.thirdParty = p;
                }
              }
            }
          })
          .finally(() => {
            if (!this.cookieChecked) {
              setTimeout(() => {
                this.displayGDPRMessage = true;
              },1000)
            }
          })
          .catch((err) => {
            console.error(err);
          })
      },

      acceptAll(e) {
        this.cookies.thirdParty = true;
        this.saveGDPRPreferences();
      },

      saveGDPRPreferences(e) {
        this.$cookies.set('gdpra_popup', 'accepted', "365D", "/");
        this.$cookies.set('gdpra_necessary', true, "365D", "/");

        let timeout = 0;
        let thirdPartyResult = false;
        if (this.cookies.thirdParty) {
          dataLayer.push({'event': 'scala_consent_given'});
          thirdPartyResult = true;
          timeout = 400;
        }

        this.$gtm.enable(thirdPartyResult);
        this.$cookies.set('gdpra_third_party', thirdPartyResult, "365D", "/");

        setTimeout(() => {
          this.displayGDPRMessage = false;
          this.$store.dispatch("SET_GDPR_PROMPT_VALUE", false);
        }, timeout);
      }
    }
  }
</script>

<style>
    #gdpr-banner {
        background: #FFF;
        position: static;
        left: 0;
        right: 0;
        top: 0;
        z-index: 500;
        height: auto;
        width: 100%;
        box-shadow: 0 5px 5px 1px rgba(0, 0, 0, 0.25);
        padding: 1em 0;
        font-size: .9em;
        display: none;
    }

    #gdpr-banner.visible {
        display: block;
    }

    #gdpr-banner + .main-menu,  #gdpr-banner + .language-prompt + .main-menu{
        position: relative;
        margin-bottom: -80px;
    }

    .gdpr-wrapper {
        flex: 0 1 auto;
        position: relative;
        display: flex;
        box-sizing: border-box;
        padding: 1em;
    }

    .gdpr-button {
        padding: .5em 1em;
        text-transform: capitalize;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        transition: all 0.3s cubic-bezier(.25, .8, .25, 1);
    }

    .gdpr-button.accept {
        background: #FFA900;
        color: #FFF;
        font-weight: 600;
        margin-right: 1em;
    }

    .gdpr-button:hover {
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.22);
    }

    .gdpr-button:active {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.22), 0 3px 6px rgba(0, 0, 0, 0.22);
    }

    .gdpr-toggle {
        margin-right: 2em;
        display: flex;
    }

    .gdpr-options {
        border-top: 1px solid lightgrey;
        border-bottom: 1px solid lightgrey;
    }

    .gdpr-options .gdpr-wrapper {
        border-bottom: 1px solid lightgrey;
    }

    .gdpr-options .gdpr-wrapper:last-child {
        border-bottom: initial;
    }

    .gdpr-learn-more {
        color: var(--primary-color-bright);
        text-decoration: underline;
        text-transform: capitalize;
    }

</style>
