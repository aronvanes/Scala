<template>
    <div class="casestudy" :key="`news-${$route.fullPath}`">
        <!-- HEADER -->
        <div class="news-header">
            <div class="width-container cs-header-wrapper">
                <div class="cs-header-wrapper-content">
                    <sc-connector v-if="$mq==='desktop'" direction="horizontal" :length=96 :connectorStyle="{
                            height: '10px',
                            marginRight: '2em',
                            justifySelf: 'left',
                            paddingTop: '1em'
                        }"/>

                    <div class="cs-title" v-if="item">
                        <h1 class="heading bold heavy" style="margin-bottom: .5em;">
                            {{item.fields.title}}
                        </h1>
                        <div class="cs-subtitle">
                            {{item.fields.shortDescription}}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="width-container news-hero-wrapper">

            <div class="column left" v-if="item">
                <div class="news-text">
                    <sc-markitup :content="item.fields.description"></sc-markitup>
                </div>
            </div>

            <div class="column right">
                <sc-image :item="item" :height="300" v-if="$mq === 'desktop'"></sc-image>
            </div>
        </div>

        <sc-related v-if="item && item.fields && item.fields.related" :items="item.fields.related"></sc-related>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScTriangle from "~/components/sc-design-elements/sc-triangle.vue";
  import ContentBlock from "~/pages/casestudies/content-block.vue";
  import ScQuotes from "~/components/sc-quotes.vue";
  import ScQuickFacts from "~/components/sc-quick-facts.vue";
  import ScVideo from "~/components/sc-video.vue";
  import ScNewsRecentPosts from "~/components/sc-news-recent-posts.vue";
  import ScRelated from "~/components/sc-related.vue";

  export default {
    name: 'software-item',
    components: {ScRelated, ScNewsRecentPosts, ScVideo, ScQuickFacts, ScTriangle, ScQuotes, ContentBlock},
    mixins: [mixins.scMetaEntry],
    data() {
      return {
        item: undefined,
        entries: [],
        assets: [],
        includes: [],
        aboutActiveElem: 'customer',
        imgStyle: {height: '200px'},
        imgUrl: undefined,
        ready: false
      }
    },

    mounted() {
      this.fetch();
      this.getHeight();
      this.$events.$on('resize-event', this.getHeight);
    },

    methods: {
      fetch() {
        this.$getEntries({
          content_type: 'slugs',
          'fields.identifier': 'software',
          ['fields.slug.'+this.$store.getters.getLocaleIso()]: this.$route.params.slug,
          'select': 'sys.id',
          locale: '*',
          order: 'sys.createdAt'
        }).then((res) => {
          if (res.items.length > 0) {
            this.$getEntries({
              content_type: 'products',
              'fields.slug.sys.id': res.items[0].sys.id,
              'fields.title[exists]': true,
              include: 2
            })
              .then((res) => {
                if (res.items.length === 0) {
                  let error = new Error();
                  error.statusCode = 404;
                  error.message = 'Not found';
                  throw error;
                } else {
                  this.item = res.items[0];
                  this.getHeight();
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
      },


      getHeight() {
        if (typeof this.$refs['news-image'] !== 'undefined') {
          let w = this.$refs['news-image'].clientWidth;
          let multiplier = 0.4;
          if (['phone', 'tablet'].includes(this.$mq)) multiplier = .5;

          this.imgStyle.height = w * multiplier + 'px';
        }
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
        max-width: 46%;
        display: flex;
        flex-flow: row wrap;
    }

    .news-hero-wrapper {
        display: flex;
        flex-flow: row nowrap;
        margin: -8em auto 2em;
        z-index: 1;
    }

    .cs-title {
        flex-grow: 1;
        flex-basis: calc(50% - 100px);
    }

    .column {
        width: 50%;
        box-sizing: border-box;
    }

    .column.left {
        padding-right: 2%;
    }

    .column.right {
        padding-left: 2%;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
    }

    .cs-subtitle {
        flex-grow: 1;
        flex-shrink: 1;
    }

    .news-text {
        flex: 1;
    }

    .news-image {
        text-align: right;
        height: 300px;
    }

    .news-image img {
        height: inherit;
        display: block;
        object-fit: cover;
        position: relative;
    }

    .recent-posts-block {
        background-color: #f4f5f9;
        box-sizing: border-box;
        margin: 80px 64px 0;
        padding-top: 24px;
    }

    .cs-video-backup {
        background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.9)), url('/assets/images/scala-mesh.jpg');
        display: block;
        background-size: cover;
        height: 100%;
    }

    .news-text {
        margin-top: 12em;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {

    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 768px) {

        .news-header {
            height: auto;
            padding-top: 6em;
            padding-bottom: 2em;
        }

        .cs-header-wrapper-content {
            max-width: initial;
        }

        .news-hero-wrapper {
            flex-flow: column;
            max-width: 100%;
            margin: 0em 0;
        }

        .news-hero-wrapper .column {
            width: 100%;
            padding: 0;
        }

        .column.right .news-image {
            display: none;
        }

        .news-hero-wrapper .news-text {
            margin-top: 2em;
        }

        .recent-posts-block {
            margin: 16px 16px 0;
            padding-top: 16px;
        }

    }

    /* Large screens (laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1025px) and (max-width: 1599px) {
    }

    /* Extra large devices (1600px and up) */
    @media only screen and (min-width: 1600px) {
    }

</style>