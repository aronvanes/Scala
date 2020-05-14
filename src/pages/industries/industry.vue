<template>
    <div class="casestudy" :key="`casestudy-${$route.fullPath}`">

        <!-- HEADER -->
        <div class="casestudy-header">
            <div class="width-container cs-header-wrapper" v-if="typeof item !== 'undefined'">
                <div class="cs-header-wrapper-content">
                    <sc-connector v-if="$mq==='desktop'" direction="horizontal" :length=96 :connectorStyle="{
                            height: '10px',
                            marginRight: '2em',
                            justifySelf: 'left',
                            paddingTop: '1em'
                        }"/>

                    <div class="cs-title">
                        <h1 class="heading bold heavy upper" style="margin-bottom: .5em;">
                            {{item.fields.title}}
                        </h1>
                        <div class="cs-subtitle">
                            {{item.fields.introduction}}
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <template v-if="typeof item !== 'undefined'">
            <div class="width-container cs-hero-wrapper">
                <!-- VIDEO -->
                <div class="cs-video" v-if="item">
                    <sc-video v-if="item.fields.video" :source="item.fields.video"/>
                    <!-- FALLBACK TO IMG -->
                    <sc-image :item="item" :height="getImgHeight()"></sc-image>
                </div>
            </div>

            <!-- FACTS -->
            <sc-quick-facts class="quick-maths" v-if="item.fields.bulletPoints && item.fields.bulletPoints.length > 0"
                            :items="item.fields.bulletPoints"
                            :show-title="false"
                            :blockStyle="($mq==='desktop')?{padding:'5em 2em 3em'}:{padding:'5em 1em 3em'}"/>

            <!-- PARAGRAPHS -->
            <div class="width-container " v-if="item.fields.paragraphs">

                <div class="paragraphs">
                    <div class="paragraph" v-for="paragraph in item.fields.paragraphs">
                        <h3 class="heading">
                            {{paragraph.fields.title}}
                        </h3>
                        <sc-markitup class="description"
                                     :class="{'column-count-2 column-gap-small': $mq === 'desktop'}"
                                     :content="paragraph.fields.description">
                        </sc-markitup>
                    </div>
                </div>
            </div>

            <!-- RELATED -->
            <sc-related v-if="item.fields.relatedCasestudies && item.fields.relatedCasestudies.length > 0" :items="item.fields.relatedCasestudies"
                        title="relevant case studies" :background="false"></sc-related>
        </template>

        <!-- TRIANGLES -->
        <template>
            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 8,
                    elemStyle: {
                        position: 'absolute',
                        top:'-5em',
                        left:'100px',
                        transform: {
                            rotate: 100,
                            scale: 3.5,
                            transformX:'100px',
                        }
                    },
                opacity: .1,
                solid:false,
                color:'#ff1212',
                top:'30em',
                }">
            </sc-triangle>

            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 6,
                    elemStyle: {
                        position: 'absolute',
                        transform: {
                            rotate: 10,
                            scale: 3.5,
                            transformX:'100px',
                        }
                    },
                opacity: .1,
                solid:false,
                right:'5%',
                top:'60em'
                }">
            </sc-triangle>

            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 6,
                    elemStyle: {
                        position: 'relative',
                        transform: {
                            rotate: 10,
                            scale: 3.5
                        }
                    },
                opacity: .1,
                top:'118em',
                left:'30em'
                }">
            </sc-triangle>
        </template>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScConnector from '~/components/sc-design-elements/sc-connector.vue'
  import ScTriangle from "~/components/sc-design-elements/sc-triangle.vue";
  import ContentBlock from "~/pages/casestudies/content-block.vue";
  import ScQuotes from "~/components/sc-quotes.vue";
  import ScQuickFacts from "~/components/sc-quick-facts.vue";
  import ScVideo from "~/components/sc-video.vue";
  import ScRelated from "~/components/sc-related.vue";

  export default {
    name: 'industry',
    components: {ScRelated, ScVideo, ScQuickFacts, ScTriangle, ScQuotes, ContentBlock, ScConnector},
    mixins: [mixins.scMetaEntry],
    data() {
      return {
        item: undefined,
        entries: [],
        assets: [],
        includes: [],
        aboutActiveElem: 'customer',
        ready: false
      }
    },

    mounted() {
      this.fetch();
    },

    methods: {
      fetch() {
        this.$getEntries({
          content_type: 'slugs',
          'fields.identifier': 'industries',
          ['fields.slug.'+this.$store.getters.getLocaleIso()]: this.$route.params.slug,
          'select': 'sys.id',
          locale: '*',
          order: 'sys.createdAt'
        }).then((res) => {
          if (res.items.length > 0) {
            this.$getEntries({
              content_type: 'industries',
              'fields.slug.sys.id': res.items[0].sys.id,
              'fields.title[exists]': true,
              include: 2,
            })
              .then((res) => {
                if (res.items.length === 0) {
                  let error = new Error();
                  error.statusCode = 404;
                  error.message = 'Not found';
                  throw error;

                } else {
                  this.item = res.items[0];
                  console.log(this.item);
                }
              })
              .finally(() => {
                this.ready = true;
              })
              .catch((error) => {
                console.error(error)
                // this.$router.push({name: 'NotFound'})
              })
          } else {
            throw new Error("No matches");
          }
        })
          .catch((err) => {
            console.error(err);
          });
      },

      getImgHeight() {
        switch(this.$mq) {
          case 'desktop':
            return 450;
          case 'phone':
            return 300;
          default:
            return 800
        }

      },

      getCustomStyle(item) {
        let result = [];
        if (item.fields.image && item.fields.image.file) {
          let src = item.fields.image.fields.file.url;
          if (src !== undefined) {
            result.push(`background-image: url(${src}?q=50);background-repeat: no-repeat;background-size:cover`)
          }
        }
        return {style: result.join(';')};
      },
    }
  }

</script>

<style scoped>
    .cs-header-wrapper {
        display: flex;
        flex-flow: row;
        justify-content: space-between;
        align-items: center;
    }

    .cs-header-wrapper-content {
        max-width: 50%;
        display: flex;
        flex-flow: row wrap;
    }

    .cs-hero-wrapper {
        display: flex;
        flex-flow: row nowrap;
        justify-content: flex-end;
        align-items: center;
        margin: -8em auto 0em;
        z-index: 1;
    }

    .cs-title {
        flex-grow: 1;
        flex-basis: calc(50% - 100px);
    }

    .cs-subtitle {
        flex-grow: 1;
        flex-shrink: 1;
    }

    .cs-video {
        margin-right: 3em;
        min-width: 800px;
        max-height: 640px;
        position: relative;
    }

    .paragraphs {
        margin: 5em 0 7em;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-start;
    }

    .paragraphs .paragraph {
        position: relative;
        max-width: calc(50% - 2em);
        margin-top: 3em;
    }

    .paragraphs .paragraph:first-child, .paragraphs .paragraph:nth-child(2) {
        margin-top: initial;
    }

    .paragraphs .paragraph:nth-child(odd) {
        margin-right: 2em;
    }

    .paragraphs .paragraph:nth-child(even) {
        margin-left: 2em;
    }

    .paragraphs .paragraph .title {
        text-transform: uppercase;
        color: #333;
        font-size: 1.4em;
        font-weight: 500;
        position: relative;
        margin-bottom: 0.8em;
    }

    .quick-maths {
        margin-top: -3em;
        width: 100%;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {

        .cs-header-wrapper-content {
            max-width: initial;
        }

        .cs-hero-wrapper {
            flex-flow: column;
            max-width: 100%;
            margin: 2em 0;
        }

        .cs-video {
            margin-top: 1em;
            margin-right: initial;
            max-width: initial;
            min-width: initial;
            width: 100%;
        }

        .quick-maths {
            margin: -5em 0 5em;
        }
    }

    @media only screen and (max-width: 480px) {
        .paragraphs {
            display: block;
        }
        .paragraphs .paragraph:nth-child(1n) {
            margin: 0 0 2em 0;
            max-width: 100%;
        }
        .paragraphs .paragraph:last-child {
            margin-bottom: initial;
        }
    }
</style>