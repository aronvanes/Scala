<template>
    <div class="event" :key="`event-${$route.fullPath}`" v-if="item">
        <div class="events-header" :style="eventHeaderStyle()">
            <div class="width-container flex f-column" style="justify-content: center;align-items:center;">
                <h2 class="heading bold heavy text-shadow">{{item.fields.location}}</h2>
                <h1 class="heading bold heavy text-shadow">{{item.fields.title}}</h1>
                <h3 class="heading bold text-shadow">
                    <span>
                        {{eventDate()}}
                    </span>
                    &nbsp;
                    <span v-if="item.fields.boothnumber">
                            |  {{$store.getters.translation('general.tradeshows.Booth') || 'Booth'}}: &nbsp;{{item.fields.boothnumber}}
                    </span>
                </h3>
                <div style="width:400px;max-width:100%;margin-top: 1em;">
                    <sc-image v-if="item.fields.eventLogo" :image="item.fields.eventLogo" :height="200"></sc-image>
                </div>
            </div>
        </div>

        <div class="width-container" v-if="item.fields.description">
            <div class="flex f-column event-description">
                <sc-markitup :content="item.fields.description"
                             class="column-gap-small"
                             :class="{'column-count-3': $mq === 'desktop', 'column-count-2': $mq === 'tablet'}">

                </sc-markitup>
            </div>
        </div>

        <div style="position: relative;width: 100%; height:fit-content;">
            <sc-triangle v-if="$mq === 'desktop'" v-bind="topTriangleProps()" class="topTriangle"/>
            <sc-call-to-action v-if="item && item.fields && item.fields.callToAction" :name="item.fields.callToAction.fields.name"
                               style="margin-top: 3em;"></sc-call-to-action>
        </div>

        <!-- SNEAK PEEK -->
        <div class="width-container sneak-peek">
            <div class="flex f-column" style="align-items: center; margin: 2em 0;">
                <div class="title" v-if="eventParagraph">
                    <sc-paragraph-title :name="eventParagraph.fields.title"></sc-paragraph-title>
                </div>

                <div class="description" v-if="eventParagraph">
                    <sc-markitup :content="eventParagraph.fields.description"></sc-markitup>
                </div>

                <div class="flex f-row f-evenly f-wrap" :class="{'f-column': $mq === 'phone'}">
                    <div v-for="concept in item.fields.solutions"
                         class="event-sneak-peek drop-shadow low" :key="concept.sys.id">
                        <sc-image :item="concept" :height="200"></sc-image>
                        <div style="padding: 2em;background-color: #FFF;">
                            <h3 class="heading" style="text-align: center; margin-bottom: 1em;">
                                {{concept.fields.title}}</h3>
                            <sc-markitup :content="concept.fields.shortDescription"></sc-markitup>
                        </div>
                    </div>
                </div>
            </div>
            <sc-triangle v-if="$mq === 'desktop'" v-bind="leftTriangleProps()"/>
        </div>

        <!-- FORM -->
        <div class="form-wrapper" v-if="eventForm">
            <div class="width-container flex f-evenly f-wrap" v-if="eventForm">
                <div class="form-info">
                    <sc-paragraph-title v-if="eventForm.fields.title"
                                        :name="eventForm.fields.title"></sc-paragraph-title>
                    <sc-markitup v-if="eventForm.fields.description"
                                 :content="eventForm.fields.description"></sc-markitup>
                </div>

                <sc-form :item="eventForm"
                         hideTitle hideDescription
                         class="drop-shadow low"/>
            </div>
        </div>
    </div>

</template>

<style scoped>

    .event {
        position: relative;
        overflow: hidden;
    }

    .events-header {
        height: 600px;
    }

    .events-header::before {
        position: absolute;
        content: '';
        background: var(--primary-color-dark);
        opacity: .3;
        width: 100%;
        height: 100%;
    }

    .event-sneak-peek {
        display: block;
        min-width: 20%;
        max-width: calc(25% - 4em);
        margin: 2em 1em;
        box-sizing: border-box;
        background-color: #FFF;
    }

    .event-description {
        background-color: #f4f5f9;
        padding: 4em;
        margin-top: -4em;
        margin-bottom: 2em;
    }

    .form-wrapper {
        background-size: cover;
        padding-bottom: 5em;
    }

    .form-info {
        position: relative;
        padding: 2em;
        box-sizing: border-box;
        background-color: var(--primary-color-dark);
        color: #FFF;
        margin: 5% 0;
    }

    .form-info::before {
        display: block;
        content: '';
        width: 200px;
        position: absolute;
        left: 100%;
        top: 0;
        bottom: 0;
        z-index: 0;
        background-color: var(--primary-color-dark);
    }

    .form-wrapper .sc-form {
        z-index: 1;
    }

    .sneak-peek {
        margin: 5em 0;
        padding-bottom: 2em;
    }

    .sneak-peek .description {
        max-width: 50%;
        text-align: center;
    }

    .topTriangle {
        right: 0;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 768px) {

        .events-header {
            min-height: 350px;
            height: auto;
        }

        .event-description {
            background-color: #f4f5f9;
            margin: 2em 0;
            padding: 2em;
        }

        .event-sneak-peek {
            max-width: calc(50% - 4em);
        }

        .form-info {
            margin-bottom: 0;
            color: initial;
            background-color: initial;
        }

        .form-info::before {
            display: none;
        }

        .form-info .paragraph {
            width: fit-content;
            margin: 0 auto;
        }

        .form-info .markup {
            margin: 1em 0;
            text-align: center;
        }

        .sneak-peek {
            display: flex;
            margin-bottom: initial;
        }

        .sneak-peek .description {
            max-width: 100%;
        }
    }

    @media only screen and (max-width: 640px) {
        .event-sneak-peek {
            max-width: 100%;
            margin: 2em 0;
        }

        .sneak-peek .title {
            max-width: 75%;
            align-self: center !important;
            text-align: center;
        }
    }

    /* Large screens (laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1025px) and (max-width: 1599px) {
    }

    /* Extra large devices (1600px and up) */
    @media only screen and (min-width: 1600px) {
    }

</style>

<script>
  import {mixins} from 'sc-utils'
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  import ScCallToAction from "~/components/sc-call-to-action.vue";
  import ScVideo from "~/components/sc-video.vue";
  import ScQuickFacts from "~/components/sc-quick-facts.vue";

  export default {
    name: 'Event',
    components: {ScQuickFacts, ScVideo, ScCallToAction, ScConnector},
    mixins: [mixins.scMetaEntry],
    data() {
      return {
        item: undefined,
        entries: [],
        assets: [],
        includes: [],
        now: window.moment(new Date()),
        form: undefined,
        mediaSize: 560
      }
    },

    computed: {
      eventTiming() {
        return this.now.isSameOrBefore(this.endDate) ? "pre" : "post"
      },

      eventForm() {
        if (this.eventTiming === "pre" && this.item.fields.preShowForm) {
          return this.item.fields.preShowForm
        } else if (this.eventTiming === "post" && this.item.fields.postShowForm) {
          return this.item.fields.postShowForm
        }
        return undefined;
      },

      eventParagraph() {
        if (this.eventTiming === "pre" && this.item.fields.preShowParagraph) {
          return this.item.fields.preShowParagraph
        } else if (this.eventTiming === "post" && this.item.fields.postShowParagraph) {
          return this.item.fields.postShowParagraph
        }
        return undefined;
      },

      startDate() {
        return window.moment(this.item.fields.startDate)
      },
      endDate() {
        return window.moment(this.item.fields.endDate);
      },
    },

    mounted() {
      this.fetch();
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
          'fields.identifier': 'events',
          ['fields.slug.' + this.$store.getters.getLocaleIso()]: this.$route.params.slug,
          'select': 'sys.id',
          locale: '*',
          order: 'sys.createdAt'
        }).then((res) => {
          if (res.items.length > 0) {
            this.$getEntries({
              content_type: 'events',
              'fields.slug.sys.id': res.items[0].sys.id,
              'fields.title[exists]': true,
              'fields.visibility': 'Public',
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
                }
              })
              .catch((error) => {
                console.error(error)
                // this.$router.push({name: 'NotFound'})
              })
          } else {
            throw new Error("No Matches");
          }
        })
          .catch((err) => {
            console.error(err);
          });
      },

      eventHeaderStyle() {
        let style = {
          backgroundImage: `url(${this.item.fields.image.fields.landscape.fields.file.url}?w=${window.innerWidth})`
        };
        return style;
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

      leftTriangleProps() {
        let result = {};
        result.elemStyle = {
          position: 'absolute',
          left: 125,
          top: 48,
          zIndex: -1,

          transform: {
            rotate: 10,
            scale: 4.5
          }
        };
        result.color = '#F3F3F3';
        return result;
      },

      topTriangleProps() {
        let result = {};
        result.elemStyle = {
          position: 'relative',
          transform: {
            rotate: 45,
            scale: 6
          }
        };
        result.stroke = 10;
        result.solid = false;
        result.opacity = 0.1;
        result.color = 'var(--primary-color-bright)';
        return result;
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
