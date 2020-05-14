<template>
    <div class="sc-cta" v-if="item !== undefined" :style="alternateStyle()" >
        <div class="width-container">
            <div class="sc-cta-wrapper">
                <div class="cta-text noselect">
                    {{item.fields.description}}
                </div>

                <router-link :to="ctaRoute()"
                             v-if="item.fields.link"
                             class="button">
                    {{item.fields.buttonText || $store.getters.translation('general.learn-more')}}
                </router-link>

                <a :href="item.fields.url" v-else-if="item.fields.url" class="button" target="_blank">
                    {{item.fields.buttonText || $store.getters.translation('general.learn-more')}}
                </a>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    name: "sc-call-to-action",
    props: {
      name: {
        required: true,
        type: String,
        // NAME prop is used to fetch correct CTA entry. Make sure to pass correct name.
      }
    },

    data() {
      return {
        item: undefined,
      }
    },

    mounted() {
      this.fetch();
    },

    methods: {
      ctaRoute() {
        let routingObj = this.item.fields.link.fields.slug;
        if (this.item.fields.link.fields.slug.fields.identifier === 'home') {
            routingObj = undefined
        }
        return this.$getRoute(routingObj);
      },

      alternateStyle() {
        if (typeof this.item !== 'undefined') {

          if (typeof this.item.fields.image !== 'undefined') {

            let img = this.item.fields.image;

            let path;
            if (img.fields.landscape) {
              path = img.fields.landscape.fields.file.url;
            } else if (img.fields.portrait) {
              path = img.fields.portrait.fields.file.url;
            }

            if (path) {
              let url = "https:" + path + "?q=60";
              let color = "rgba(238, 50, 53, 0.8)";

              if (typeof this.item.fields.overlayColor !== 'undefined') {
                color = this.item.fields.overlayColor;
              }

              return {
                backgroundImage: `linear-gradient(${color}, ${color}), url('${url}')`
              }
            }
          } else if (typeof this.item.fields.overlayColor !== 'undefined') {
            let color = this.item.fields.overlayColor;

            return {
              backgroundImage: `linear-gradient(${color}, ${color})`
            }
          }
        }
      },

      fetch() {
        this.$getEntries({
          'content_type': 'callToActions',
          'fields.name': this.name,
          include: 2,
        }, true)
          .then((res) => {
            if (res.items.length === 1) {
              let item = res.items[0];
              if (item.fields.link || item.fields.url) {
                this.item = item;
              } else {
                throw new Error('CTA does not have any valid actions')
              }
            }
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  }
</script>

<style>
    .sc-cta {
        width: 100%;
        padding: 3em 0;
        display: block;
        background-image: /* top, transparent red, faked with gradient */ linear-gradient(
                rgba(238, 50, 53, 0.8),
                rgba(238, 50, 53, 0.9)
        );
        background-size: cover;
        background-position: 50%;
    }

    .sc-cta .width-container {
        height: 100%;
    }

    .sc-cta .sc-cta-wrapper {
        margin: 0 auto;
        min-width: 350px;
        max-width: 60vw;
        height: inherit;
        color: #FFF;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .sc-cta .sc-cta-wrapper .cta-text {
        font-size: 3em;
        line-height: initial;
        font-weight: 300;
        text-align: center;
    }

    .sc-cta .sc-cta-wrapper .button {
        margin: 2em 0 0;
        align-self: flex-end;
        font-size: 1.3em;
    }

    .sc-cta .sc-cta-wrapper .button::before {
        bottom: 0;
    }

    .sc-cta .sc-cta-wrapper .button:hover::before {
        height: 100%;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .sc-cta {
            height: auto;
            padding: 3em 0;
        }

        .sc-cta .sc-cta-wrapper {
            width: 75vw;
        }
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 480px) {
        .sc-cta {
            height: auto;
            width: initial;
        }

        .sc-cta .sc-cta-wrapper {
            width: initial;
            min-width: initial;
        }

        .sc-cta .sc-cta-wrapper .cta-text {
            font-size: 2.2em;
        }
        .sc-cta .sc-cta-wrapper .button {
            font-size: 1.3em;
        }
    }

</style>