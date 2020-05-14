<template>
    <div class="width-container" :class="{'sc-upcoming-events': items.length > 0}"
         v-observe-visibility="{
        callback: visibilityChanged,
        once: false
    }" ref="parent" :style="getContainerStyle()">

        <template v-if="items.length > 0">
            <!-- VISUAL -->
            <transition name="slide-ltr" appear v-if="isVisible && $mq === 'desktop'">
                <div class="panel visual drop-shadow" :style="panelStyle('left')"/>
            </transition>
            <h1 class="heading bold medium title" v-if="$mq !== 'desktop'">
                {{title}}
            </h1>

            <!-- INFO -->
            <transition name="slide-rtl" appear v-if="isVisible">
                <div class="panel list drop-shadow" :style="panelStyle('right')">
                    <div class="title-wrapper" v-if="$mq === 'desktop'">
                        <sc-paragraph-title :name="title" direction="vertical" position="bottom"></sc-paragraph-title>
                    </div>

                    <!-- TRIANGLE -->
                    <div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow: hidden; display: block; width: 100%; height: 100%">
                        <sc-triangle v-bind="{
                            solid: false,
                            stroke: 10,
                            opacity: .05,
                            elemStyle: {
                                transform: {
                                    scale: 3.75,
                                    rotate: 5
                                }
                            }
                        }"/>
                    </div>

                    <div class="visual"/>

                    <!-- ITEMS -->
                    <transition-group name="staggered-fade"
                                      tag="div"
                                      class="events"
                                      v-on:before-enter="beforeEnter"
                                      v-on:enter="enter"
                                      v-on:leave="leave">
                        <sc-events-list-item v-for="(item, index) in items" :item="item"
                                             :key="`event-list-item-${index}-${item.sys.id}`" :data-index="index"/>
                    </transition-group>
                    <router-link :to="$getRoute('events')" class="button text-button bright">
                        {{ $store.getters.translation('buttons.learn-more') }}
                    </router-link>
                </div>
            </transition>
        </template>
    </div>
</template>

<script>
  import ScEventsListItem from '~/components/sc-events-list-item.vue';
  import ScTriangle from '~/components/sc-design-elements/sc-triangle.vue'
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";

  export default {
    name: 'sc-upcoming-events',

    props: {
      progress: {required: false},
      title: {required: false, type: String, default: 'Upcoming events'}
    },

    components: {ScConnector, ScEventsListItem, ScTriangle},

    data() {
      return {
        isVisible: false,
        items: [],
        key: `sc-upcoming-events-${new Date().toTimeString()}`,
        completed: false,
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth,
        pHeight: 0,
        padding: 0,
        now: new Date().toISOString()
      }
    },

    mounted() {
      this.setSizes();
      this.$events.$on('resize-event', this.setSizes);
    },

    methods: {
      setSizes() {
        let w = this.$refs.parent.clientWidth / 2;
        this.pHeight = w / 16 * 9 + 64;
        this.padding = window.getComputedStyle(this.$refs.parent, null).getPropertyValue('padding-left');
      },

      panelStyle(dir) {
        if (this.$mq === "desktop") {
          let padding = parseInt(this.padding.slice(0, -2));
          let w = (this.$refs.parent.clientWidth - (padding + (padding) / 2)) / 2;
          let h = w / 16 * 9;
          return `width: ${w}px; height: ${h}px; ${dir}: ${this.padding};`;
        }
      },

      /*
        VISIBILITY EVENTS
       */
      visibilityChanged(isVisible, entry) {
        if (isVisible)
          this.fetch();
      },

      fetch() {
        this.$getEntries({
          content_type: 'events',
          limit: 3,
          select: 'sys.id,fields.title,fields.slug,fields.startDate,fields.endDate,fields.location,fields.eventTalks',
          'fields.visibility': 'Public',
          'fields.endDate[gte]': this.now,
          order: 'fields.startDate',
        })
          .then((res) => {
            this.isVisible = true;
            setTimeout(() => {
              this.items = res.items;
            }, 500);
          })
          .catch((err) => {
            console.error(err);
          })
      },

      getContainerStyle() {
        let style = {height: 0};
        if (this.items.length > 0) {
          style.height = this.$mq !== 'desktop' ? 'auto' : this.pHeight + 'px';
        }
        return style
      },

      /* TRANSITION */
      beforeEnter: function (el) {
        el.style.opacity = 0;
        el.style.top = '-75px';
        el.style.transition = "all .5s cubic-bezier(0.17, 0.57, 0.38, 0.95)"
      },

      enter: function (el, done) {
        let delay = (parseInt(el.dataset.index) + 1) * 200;
        setTimeout(() => {
          el.style.opacity = 1;
          el.style.top = 0;
        }, delay)
      },
      leave: function (el, done) {
        let delay = (parseInt(el.dataset.index) + 1) * 200;
        setTimeout(() => {
          el.style.opacity = 0;
          el.style.top = '-75px'
        }, delay)
      }
    }
  }
</script>

<style scoped>
    .sc-upcoming-events {
        display: flex;
        flex-flow: row wrap;
        align-items: center;
        justify-content: center;
        position: relative;
        padding-top: 64px;
        padding-bottom: 64px;
        margin: 168px auto 128px;
    }

    .sc-upcoming-events .panel {
        color: #FFF;
        background-color: var(--primary-color-dark);
        display: block;
        align-self: center;
        box-sizing: border-box;
        flex: 1;
        position: absolute;
        width: 52%;
    }

    .sc-upcoming-events .panel.list {
        z-index: 0;
        right: 0;
        top: 0;
        background: var(--primary-color-dark);
    }

    .sc-upcoming-events .title-wrapper {
        color: var(--primary-color-bright);
        position: absolute;
        top: -6em;
        left: 6em;
    }

    .sc-upcoming-events .panel.list .events {
        padding: 64px;
        display: flex;
        flex-flow: column nowrap;
        box-sizing: border-box;
        justify-content: space-evenly;
        height: inherit;
    }

    .sc-upcoming-events .panel.list .button {
        position: absolute;
        right: 64px;
        bottom: 32px;
    }

    .sc-upcoming-events .panel.visual {
        left: 0;
        top: 64px;
        background-image: url("../assets/images/scala-events.jpg");
        background-size: cover;
    }

    .sc-upcoming-events .panel.visual::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background-color: var(--primary-color-dark);
        opacity: .3;
    }

    @media only screen and (max-width: 1024px) {
        .sc-upcoming-events {
            margin: 2em 0;
            padding-top: 3em;
            padding-bottom: 3em;
            display: block;
        }

        .sc-upcoming-events .heading {
            margin-bottom: 1em;
            color: var(--primary-color-bright);
        }

        .sc-upcoming-events .panel {
            width: 100%;
            position: relative;
        }

        .sc-upcoming-events .panel.list {
            padding: 1em;
            display: flex;
            flex-flow: column wrap;
        }

        .sc-upcoming-events .panel.list .title-wrapper {
            position: relative;
            left: initial;
            top: -100px;
        }

        .sc-upcoming-events .panel.list .events {
            padding: 0;
            height: inherit;
        }

        .sc-upcoming-events .panel.list .button {
            position: relative;
            right: initial;
            bottom: initial;
            justify-self: flex-end;
            align-self: flex-end;
        }
    }

    @media only screen and (min-width: 1025px) and (max-width: 1599px) {
        .sc-upcoming-events .panel.list .events {
            font-size: .8em;
            padding: 2em;
        }
    }
</style>