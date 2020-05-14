<template>
    <div class="concept" :key="`concept-${$route.fullPath}`" v-if="item">
        <div class="concept-header">
            <div class="width-container">
                <sc-paragraph-title v-if="item.fields.title" :name="item.fields.title" :length="100" first
                                    :subtitle="item.fields.shortDescription" :style="{maxWidth: $mq === 'desktop' ? '60%' : 'initial'}"></sc-paragraph-title>
            </div>
        </div>

        <div class="width-container">
            <!-- VIDEO -->
            <div :style="videoStyle()" class="cs-video">
                <sc-video v-if="$mq !== 'phone' && item.fields.video" :source="item.fields.video"/>
                <sc-image v-else-if="item.fields.image" :item="item"></sc-image>
            </div>

            <!-- DESCRIPTION -->
            <div class="flex f-column concept-description">
                <div class="flex f-row" :class="{'f-column': $mq === 'phone'}">
                    <h4 class="heading upper bold medium oneliner">
                        {{item.fields.oneLiner}}
                    </h4>
                    <div class="description" :class="$mq === 'desktop' ? 'column-count-2 column-gap-large' : ''">{{item.fields.description}}</div>
                </div>
            </div>

            <!-- BENEFITS -->
            <div v-if="item.fields.benefits" class="flex f-row f-around concept-benefits" :class="{'f-column': $mq !== 'desktop'}">
                <img v-bind="imgAttributes"/>
                <div :style="{padding: $mq === 'desktop' ? '0 4em' : '2em 0'}">
                    <sc-paragraph-title name="Benefits" :length="88"/>
                    <div class="benefits-list">
                        <div v-for="(benefit, index) in item.fields.benefits" :key="'item-'+index" class="bl-item">
                            <template v-if="index < 10">
                                <div class="bold heavy number">0{{index+1}}.</div>
                                <div>{{benefit.fields.value || benefit.fields.benefit}}</div>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="width-container clearfix concepts-insights-delivery">
            <!-- INSIGHTS -->
            <div class="customer-insights" :style="insightsStyle()" v-if="customerInsights !== undefined">
                <div class="customer-insights-content">
                    <sc-paragraph-title :name="customerInsights.fields.title"
                                        direction="vertical"></sc-paragraph-title>
                    {{ customerInsights.fields.description }}
                </div>
            </div>

            <!-- DELIVERY -->
            <div class="concept-delivery"
                 v-if="conceptDelivery && conceptDelivery.fields.bulletPoints">
                <sc-paragraph-title :name="conceptDelivery.fields.title"></sc-paragraph-title>
                <div class="flex f-column concept-delivery-content">
                    <div v-for="bp in conceptDelivery.fields.bulletPoints" class="flex cdc-bullet-point">
                        <div class="cdc-bp-icon">
                            <img v-if="bp.fields.icon" :src="bp.fields.icon.fields.file.url"/>
                        </div>
                        <div style="flex:1;">
                            {{ bp.fields.value }}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <sc-call-to-action v-if="ctaName" :name="ctaName"></sc-call-to-action>
    </div>
</template>

<style scoped>

    .concept-description {
        background-color: #f4f5f9;
        padding: 10em;
        margin-top: -4em;
    }

    .concept-description .oneliner {
        flex: 1.5;
        margin-right: 4em;
    }

    .concept-description .description {
        flex: 3;
    }

    .concept-benefits {
        align-items: center;
        margin: -4em 2em 2em;
    }

    .concept-benefits .benefits-list {
        display: flex;
        flex-flow: row wrap;
        position: relative;
        justify-content: flex-start;
    }

    .concept-benefits .bl-item {
        margin: 1em 0;
        display: flex;
        flex-flow: row nowrap;
        width: 50%;
    }

    .concept-benefits .bl-item .number {
        margin-right: .5em;
        color: #e0e1e3;
        font-size: 4rem;
        text-align: right;
        min-width: 2em;
    }

    .concepts-insights-delivery {
        justify-content: center;
        margin: 6em auto;
        box-sizing: border-box;
    }

    .concept-delivery-content {
        justify-content: space-between;
        height: 80%;
    }

    .customer-insights-content {
        width: 40%;
        position: absolute;
        right: 2em;
        top: 3em;
    }

    .cdc-bullet-point {
        flex-wrap: nowrap;
        align-items: center;
        justify-content: space-evenly;
        position: relative;
        left: 2em;
    }

    .cdc-bp-icon {
        width: 48px;
        height: 48px;
        text-align: right;
        margin-right: 1.5em;
    }

    .customer-insights {
        height: 500px;
        box-sizing: border-box;
        background-size: cover;
        position: relative;
        z-index: -1;
        float: right;
    }

    .customer-insights::before {
        display: block;
        background: rgba(255, 255, 255, 0.3);
        position: absolute;
        content: '';
        width: 100%;
        height: 100%;
    }

    .concept-delivery {
        float: left;
        width: 60%;
        height: 480px;
        background: var(--primary-color-dark);
        box-sizing: border-box;
        padding: 4em 8em;
        margin-top: -240px;
        margin-left: 2em;
        color: #FFF;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .concept-header {
            height: auto;
            padding-top: 6em;
            padding-bottom: 2em;
        }
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 768px) {

        .concept-description {
            background-color: #f4f5f9;
            margin: 2em 0;
            padding: 2em;
        }

        .concept-description .oneliner {
            margin-right: 1em;
            margin-bottom: .5em;
        }

        .concept-benefits {
            align-items: initial;
            margin: 2em 0;
        }

        .concept-benefits .benefits-list {
            flex-flow: column;
        }
        .concept-benefits .bl-item {
            width: 100%;
        }

        .customer-insights {
            margin-right: initial;
            height: 300px;
            float: initial;
            width: auto;
        }

        .customer-insights::before {
            background: rgba(255, 255, 255, 0.5);
        }

        .customer-insights-content {
            width: auto;
            left: initial;
            margin: 0 2em 2em;
        }

        .concept-delivery {
            width: 95%;
            float: initial;
            margin: -4em auto 0;
            padding: 4em;
            height: auto;
        }

        .cdc-bullet-point {
            left: initial;
            margin: .5em 0;
        }

    }

</style>

<script>
  import {mixins} from "sc-utils";
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  import ScCallToAction from "~/components/sc-call-to-action.vue";
  import ScVideo from "~/components/sc-video.vue";
  import ScQuickFacts from "~/components/sc-quick-facts.vue";

  export default {
    name: 'Concept',
    components: {ScQuickFacts, ScVideo, ScCallToAction, ScConnector},
    mixins: [mixins.scMetaEntry],
    data() {
      return {
        item: undefined,
        entries: [],
        assets: [],
        includes: [],
        paragraphs: [],
        form: undefined,
        mediaSize: 560,
        ctaName: undefined
      }
    },

    computed: {
      customerInsights() {
        if (this.paragraphs.length > 0) {
          return this.paragraphs.find((p) => p.fields.name === "scala-concepts-customer-insights")
        }
        return undefined
      },

      conceptDelivery() {
        if (this.paragraphs.length > 0) {
          return this.paragraphs.find((p) => p.fields.name === "scala-concepts-concept-delivery")
        }
        return undefined
      },

      imgAttributes() {
        let src = '/src/assets/images/scala-mesh.jpg';
        let alt = this.$route.params.slug.replace('-', ' ') + ' benefits';
        let title = alt;
        let changed = false;

        if (this.item.fields.solutionImages) {
          if (this.item.fields.solutionImages[0].fields.landscape) {
            src = this.item.fields.solutionImages[0].fields.landscape.fields.file.url;
            changed = true;
          } else if (this.item.fields.solutionImages[0].fields.portrait) {
            src = this.item.fields.solutionImages[0].fields.portrait.fields.file.url;
            changed = true;
          }

          if (changed) src += `?h=600`;
          if (this.item.fields.solutionImages[0].fields.title)
            alt = this.item.fields.solutionImages[0].fields.title;
          title = alt;
        }

        let style = {
          maxWidth: `${this.$mq === 'desktop' ? this.mediaSize+'px' : '100%'}`,
          height: this.$mq !== 'desktop' ? 'auto' : '600px',
          objectFit: 'cover',
        };

        if (this.$mq !== 'desktop') style.marginBottom = '2em';

        return {src, alt, title, style}
      }
    },

    mounted() {
      this.fetch();
      this.fetchTopic();
    },

    watch: {
      $route(to, from) {
        if (from.params.lang !== to.params.lang)
          this.fetch()
      }
    },

    methods: {
      fetch() {
        this.$getEntries({
          content_type: 'slugs',
          'fields.identifier': 'concepts',
          ['fields.slug.'+this.$store.getters.getLocaleIso()]: this.$route.params.slug,
          'select': ['sys.id'],
          locale: '*',
          order: 'sys.createdAt'
        }).then((res) => {
          if (res.items.length > 0) {
            this.$getEntries({
              content_type: 'solutions',
              'fields.slug.sys.id': res.items[0].sys.id,
              'fields.title[exists]': true
            })
              .then((res) => {
                if (res.items.length === 0) {
                  let error = new Error();
                  error.statusCode = 404;
                  error.message = 'Not found';
                  throw error;

                } else {
                  this.item = res.items[0];
                }
              })
              .catch((error) => {
                console.error(error)
              })
          } else {
            throw new Error("No matches");
          }
        })
          .catch((err) => {
            console.error(err);
          });
      },

      fetchTopic() {
        this.$getEntries({
          content_type: 'topics',
          'fields.name': 'concepts',
          'select': 'fields.paragraphs,fields.callToAction',
          'include': 2
        }).then((res) => {
          if (res.items.length === 1) {
            if (res.items[0].fields.paragraphs) {
              this.paragraphs = res.items[0].fields.paragraphs;
            }

            if (res.items[0].fields.callToAction) {
              this.ctaName = res.items[0].fields.callToAction.fields.name;
            }
          }
        }).catch((err) => {
          console.log(err);
        })
      },

      videoStyle() {
        if (this.$mq === 'desktop') {
          return {
            width: (this.mediaSize / 9 * 16) + 'px',
            height: this.mediaSize + 'px',
            marginTop: '-8em',
            position: 'relative',
            left: `calc(calc(100% - ${this.mediaSize / 9 * 16}px) - 8em)`
          };
        } else {
          return {
            width: '100%',
            margin: '2em 0',
            position: 'relative',
          };
        }
      },

      imgUrlFor(item, orientation, size) {

        if (!orientation) orientation = 'h';
        if (!size) size = this.mediaSize;

        let url;

        if (item.fields.image.fields.landscape) {
          url = item.fields.image.fields.landscape.fields.file.url;
        } else if (item.fields.image.fields.portrait) {
          url = item.fields.image.fields.portrait.fields.file.url;
        }

        if (url) url += `?${orientation}=${size}`;

        return url;
      },

      insightsStyle() {
        let width = ((this.mediaSize / 9) * 16);
        if (this.$mq !== 'desktop') width = window.innerWidth - 48;

        let style = {
          width: width + 'px',
        };

        if (this.customerInsights.fields.image) {
          let bg = this.imgUrlFor(this.customerInsights, 'w', width);
          if (bg) style.backgroundImage = `url(${bg})`;
        }

        return style;
      }
    }
  }

</script>
