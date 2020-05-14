<template>
    <div class="casestudy" :key="`casestudy-${$route.fullPath}`" v-if="ready">
        <!-- HEADER -->
        <div class="casestudy-header">
            <div class="width-container cs-header-wrapper">
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

        <div class="width-container cs-hero-wrapper">
            <!-- SUMMARY -->
            <div class="cs-summary">
                <h3 class="heading upper bold">project summary</h3>
                {{item.fields.summary}}
            </div>

            <!-- VIDEO -->
            <div class="cs-video" v-if="item && item.fields.video || item.fields.image">
                <sc-video v-if="item.fields.video" :source="item.fields.video"/>
                <!-- FALLBACK TO IMG -->
                <sc-image v-else :item="item"></sc-image>
            </div>
        </div>

        <!-- FACTS -->
        <sc-quick-facts v-if="item.fields.facts.length > 0" :items="item.fields.facts"/>

        <div class="width-container clearfix" style="overflow: hidden;" v-if="ready">
            <!-- CONTENT BLOCK STORY -->
            <content-block :title="item.fields.storyTitle"
                           :content="item.fields.storyDescription"
                           :image="item.fields.casestudyImages ? item.fields.casestudyImages[0] : undefined"/>

            <!-- CONTENT BLOCK SOLUTION -->
            <content-block :title="item.fields.solutionTitle"
                           :content="item.fields.solutionDescription"
                           :imagePosition="'right'"
                           :image="item.fields.casestudyImages ? item.fields.casestudyImages[1] : undefined"/>

            <!-- CONTENT BLOCK RESULT -->
            <content-block :title="item.fields.resultTitle"
                           :content="item.fields.resultDescription"
                           :image="item.fields.casestudyImages ? item.fields.casestudyImages[2] : undefined"/>

            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                     stroke: 6,
                         elemStyle: {
                            position: 'relative',
                            left: '90%',
                            top: '-14em',
                            transform: {
                                rotate: 10,
                                scale: 3.75
                            }
                         },
                         opacity: .1,
                         solid: false,
                        }"/>
        </div>

        <!-- QUOTES -->
        <sc-quotes v-if="typeof item.fields.quotes !== 'undefined'" :quotes="item.fields.quotes"/>

        <!-- ABOUT CUSTOMER & PARTNER -->
        <div class="width-container" v-if="item.fields.customer || item.fields.partner">
            <div class="cs-about-wrapper">
                <div class="cs-about-list">
                    <div class="cs-about" v-if="item.fields.customer"
                         :class="{active: aboutActiveElem === 'customer'}"
                         @click="aboutActiveElem = 'customer'">
                        <sc-image v-if="item.fields.customer.fields.logo" :image="item.fields.customer.fields.logo"
                                  fit="contain" :height="100"></sc-image>
                        <span v-else style="font-size: 1.5em;">{{item.fields.customer.fields.name}}</span>
                    </div>
                    <div class="cs-about" v-if="item.fields.partner"
                         :class="{active: aboutActiveElem === 'partner'}"
                         @click="aboutActiveElem = 'partner'">
                        <sc-image v-if="item.fields.partner.fields.logo" :image="item.fields.partner.fields.logo"
                                  fit="contain" :height="100"></sc-image>
                        <span v-else style="font-size: 1.5em;">{{item.fields.partner.fields.name}}</span>
                    </div>
                </div>
                <sc-connector v-if="$mq === 'desktop'" direction="horizontal" :length=96 :connectorStyle="{
                            display: 'inline-block',
                            height: '10px',
                            marginRight: '2em',
                            marginLeft: '6em',
                            justifySelf: 'left',
                            paddingTop: '0.9em'
                        }"/>
                <div class="cs-about-content">
                    <h3 class="heading bold upper">about {{item.fields[aboutActiveElem].fields.name}}</h3>
                    {{item.fields[aboutActiveElem].fields.about}}
                </div>
            </div>
        </div>
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

  export default {
    name: 'casestudy',
    components: {ScVideo, ScQuickFacts, ScTriangle, ScQuotes, ContentBlock, ScConnector},
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
          'fields.identifier': 'casestudies',
          ['fields.slug.'+this.$store.getters.getLocaleIso()]: this.$route.params.slug,
          'select': 'sys.id',
          locale: '*',
          order: '-sys.createdAt'
        }).then((res) => {
          if (res.items.length > 0) {
            this.$getEntries({
              content_type: 'casestudies',
              'fields.slug.sys.id': res.items[0].sys.id,
              'fields.title[exists]': true,
              include: 3
            })
              .then((res) => {
                if (res.items.length === 0) {
                  let error = new Error();
                  error.statusCode = 404;
                  error.message = 'Not found';
                  throw error;

                } else {
                  this.item = res.items[0];

                  if (!this.item.fields.customer && this.item.fields.partner) {
                    this.aboutActiveElem = 'partner';
                  }
                }
              })
              .finally(() => {
                this.ready = true;
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
      }
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
        align-items: center;
        margin: -8em auto 2em;
        z-index: 1;
    }

    .cs-title {
        flex-grow: 1;
        flex-basis: calc(50% - 100px);
    }

    .cs-subtitle {
        flex-grow: 1;
        flex-shrink: 1;
        max-width: 75%;
    }

    .cs-summary {
        flex-basis: 40%;
        margin-right: 3em;
    }

    .cs-video {
        margin-right: 3em;
        min-width: 800px;
    }

    .cs-video-backup {
        background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.9)), url('/assets/images/scala-mesh.jpg');
        display: block;
        background-size: cover;
        height: 500px;
    }

    .cs-about-wrapper {
        display: flex;
        flex-flow: row nowrap;
        margin: 3em 0;
    }

    .cs-about-list {
        width: 400px;
        flex-shrink: 0;
        text-align: right;
        display: flex;
        flex-flow: column wrap;
        margin-left: 10em;
    }

    .cs-about {
        opacity: .5;
        transition: all .2s var(--easing);
        margin-top: 2em;
        cursor: pointer;
    }

    .cs-about:hover {
        opacity: .75;
    }

    .cs-about.active {
        opacity: 1;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {

    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 768px) {

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
            max-width: inherit;
            min-width: initial;
        }

        .cs-about-wrapper {
            flex-flow: column;
            margin: 1em 0 4em;
        }

        .cs-about-list {
            width: auto;
            margin: initial;
            flex-flow: row wrap;
            justify-content: space-evenly;
        }

        .cs-about-list .cs-about {
            margin-bottom: 1em;
            width: 45%;
        }
    }

</style>