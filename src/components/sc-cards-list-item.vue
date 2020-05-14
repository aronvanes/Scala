<template>
    <div class="cards-list-item" @click="handleClick" ref="cli" :class="`type-${type}`">
        <div class="card-image" ref="card-image" :style="imgStyle">
            <sc-image :item="item" :orientation="orientation"></sc-image>
            <div class="card-image-overlay" v-if="!hideOverlay"/>
            <div class="card-hover" v-if="!disableClick"/>
        </div>

        <div class="card-info">
            <sc-connector direction="horizontal"
                          v-if="$mq !== 'phone'"
                          :length="64"
                          :connector-style="{
                                      height: '10px',
                                      display: 'inline-block',
                                      marginRight: '2em',
                                      position: 'relative',
                                      top: '12px'
                        }"/>
            <sc-connector direction="horizontal"
                          v-if="$mq === 'phone'"
                          :length="64"
                          :connector-style="{
                                      height: '10px',
                                      display: 'inline-block',
                                      marginLeft: '-1.2em',
                                      position: 'absolute',
                                      top: '-2.5em'
                        }"/>

            <div class="info-wrapper">
                <h3 class="heading upper">
                    {{item.fields.title}}
                </h3>
                <template v-if="type !== 'events'">
                    <div v-if="type === 'news'" class="card-publish-date">
                        {{localisedDate()}}
                    </div>

                    <div class="card-description">
                        {{item.fields.shortDescription}}
                    </div>
                </template>
                <template v-else>
                    <div class="card-publish-date">
                        {{eventDate()}}
                    </div>
                    <div class="card-description">
                        {{item.fields.location}}
                    </div>
                </template>
            </div>

        </div>

    </div>
</template>

<script>
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";

  export default {
    name: "sc-cards-list-item",
    components: {ScConnector},
    props: {
      item: {type: Object, required: true},
      type: {type: String},
      orientation: {type: String, required: true},
      hideOverlay: {type: Boolean},
      disableClick: {type: Boolean}
    },

    data() {
      return {
        imgStyle: {height: 'auto'},
        changed: false,
      }
    },

    mounted() {
      this.getHeight();
      this.$events.$on('resize-event', this.getHeight);
    },

    beforeDestroy() {
      this.$events.$off('resize-event', this.getHeight);
    },

    methods: {
      getHeight() {
        let multiplier = 1.1;
        let w = 400;
        if (this.$refs['card-image']) {
          w = this.$refs['card-image'].clientWidth;

          if (['products', 'news', 'events'].includes(this.type)) {
            multiplier = 0.5
          }
          if (['phone', 'tablet'].includes(this.$mq)) multiplier = .5;

        }

        this.imgStyle.height = w * multiplier + 'px';
      },

      handleClick() {

        if (!this.disableClick) {
          this.$router.push(this.$getRoute(this.item.fields.slug))
        }
      },

      localisedDate() {
        let options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        };

        return new Date(this.item.fields.startDate).toLocaleDateString(this.$store.getters.getLocaleIso(), options);
      },

      eventDate() {
        let startDate = new window.moment(this.item.fields.startDate);
        let endDate = new window.moment(this.item.fields.endDate);
        if (startDate && endDate) {
          let end = '';

          let options = {
            day: 'numeric',
            month: 'short',
            ...(startDate.year() < endDate.year() && {year: 'numeric'})
            };

          let locale = this.$store.getters.getLocaleIso();
          let start = new Date(startDate).toLocaleDateString(locale, options);
          end = new Date(endDate).toLocaleDateString(locale, options);

          return `${start} - ${end}`
        }
      }
    }
  }
</script>

<style scoped>
    .cards-list-item {
        position: relative;
        width: calc(50% - calc(100px - 2em));
        box-sizing: border-box;
        /*margin: -5em 0 10em;*/
        margin: -5em 0 5em;
        cursor: pointer;
    }

    .cards-list-item:nth-child(even) {
        margin: -11em 0 16em;
    }

    .type-news.cards-list-item:nth-child(even),
    .type-events.cards-list-item:nth-child(even) {
        margin: 5em 0 -5em;
    }

    .type-news.cards-list-item:nth-child(even) .card-description,
    .type-events.cards-list-item:nth-child(even) .card-description {
        padding-bottom: 2em;
    }

    .cards-list-item:last-child {
        margin-bottom: 0;
    }

    .cards-list-item .card-image {
        position: relative;
        width: 100%;
        height: auto;
        /*background: #e0e1e6;*/
    }

    .cards-list-item .card-image img {
        width: inherit;
        height: inherit;
        display: block;
        object-fit: cover;
        position: relative;
    }

    .cards-list-item .card-image .card-image-overlay {
        position: absolute;
        display: block;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: linear-gradient(rgba(43, 46, 55, 0.05), rgba(43, 46, 55, 0.1));
    }

    .cards-list-item .card-image.default .card-image-overlay {
        background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.9))
    }

    .cards-list-item .card-image .card-hover {
        opacity: 0;
        transition: all .2s var(--easing);
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background-image: /* top, transparent red, faked with gradient */ linear-gradient(
                rgba(238, 50, 53, 0.8),
                rgba(238, 50, 53, 0.9)
        );
    }

    .cards-list-item:hover .card-image .card-hover {
        opacity: 1;
    }

    .cards-list-item .card-image .card-hover::before, .cards-list-item .card-image .card-hover::after {
        position: absolute;
        left: 50%;
        top: calc(50% - calc(20% / 2));
        content: ' ';
        height: 20%;
        width: 2px;
        background-color: #FFF;
    }

    .cards-list-item .card-image .card-hover:after {
        transform: rotate(-90deg);
    }

    .cards-list-item .card-info {
        position: relative;
        display: flex;
        align-items: flex-start;
        margin-top: 1.5em;
        left: 0;
        transition: left var(--easing) .4s;
    }

    .cards-list-item:hover .card-info {
        left: 5px;
    }

    .cards-list-item .card-info .info-wrapper {
        margin-right: 1em;
    }

    .cards-list-item .card-info .info-wrapper .card-publish-date {
        margin-bottom: 0.4em;
        text-transform: capitalize;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {

        .cards-list-item:nth-child(1n) {
            width: 100%;
            margin: 4em 0;
            transform: translateY(-8em);
        }

        .type-news.cards-list-item:nth-child(even),
        .type-events.cards-list-item:nth-child(even) {
            margin: 0;
        }

        .cards-list-item:last-child {
            margin-bottom: 0em;
        }
    }

    @media only screen and (max-width: 768px) {
        .cards-list-item .card-info {
            margin-top: 1.0em;
        }
    }

</style>