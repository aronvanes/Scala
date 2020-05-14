<template>
    <div class="casestudy" :key="`news-${$route.fullPath}`" v-if="item">
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

                    <div class="cs-title">
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

            <div class="column left">
                <div class="news-text">
                    <sc-markitup :content="item.fields.description"></sc-markitup>
                </div>
            </div>

            <div class="column right">
                <div class="news-image" ref="news-image">
                    <sc-video v-if="item.fields.video" :source="item.fields.video"/>
                    <!-- FALLBACK TO IMG -->
                    <sc-image v-else :item="item"></sc-image>
                </div>

                <div class="recent-posts-block" v-if="item">
                    <sc-paragraph-title :style="$mq === 'desktop' ? 'margin-left:-40px;' : 'margin-left: 24px;'"
                                        :name="$store.getters.translation('topic.news.recent-posts')"></sc-paragraph-title>
                    <sc-news-recent-posts :current="item.fields.slug"></sc-news-recent-posts>
                </div>
            </div>
        </div>
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

  export default {
    name: 'news-item',
    components: {ScNewsRecentPosts, ScVideo, ScQuickFacts, ScTriangle, ScQuotes, ContentBlock},
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
          'fields.identifier': 'news',
          ['fields.slug.'+this.$store.getters.getLocaleIso()]: this.$route.params.slug,
          'select': 'sys.id',
          locale: '*',
          order: 'sys.createdAt'
        }, true).then((res) => {
          if (res.items.length > 0) {
            this.$getEntries({
              content_type: 'news',
              'fields.slug.sys.id': res.items[0].sys.id,
              'fields.title[exists]': true,
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

      getImage() {
        let url = undefined;
        let changed = false;

        if (this.$refs['news-image']) {
          let w = this.$refs['news-image'].clientWidth;

          let img = this.item.fields.image;
          if (img && img.fields && img.fields.landscape) {
            url = img.fields.landscape.fields.file.url;
            changed = true;
          } else if (img && img.fields && img.fields.portrait) {
            url = img.fields.portrait.fields.file.url;
            changed = true;
          }

          if (changed) url + `?w=${w}`;

          this.imgUrl = url;
        }
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

</style>