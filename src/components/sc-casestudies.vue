<template>
    <div class="width-container" :class="{'sc-casestudies': items.length > 0}" v-observe-visibility="{
            callback: visibilityChanged,
            once: true
        }" ref="parent" :style="getContainerStyle()"
         v-touch:swipe="swipeHandler">

        <div v-if="$mq !== 'desktop' && items.length > 0" class="mobile-title">
            <h1 class="heading bold medium capitalize">{{ $store.getters.translation('general.casestudies') }}</h1>
        </div>

        <!-- VISUAL -->
        <transition name="slide-ltr" appear v-if="isVisible && items.length > 0">
            <div class="panel visual drop-shadow" :style="panelStyle('left')" @mouseover="timerPause"
                 @mouseout="timerContinue" >
                <div :class="imgFade === true ? 'image fade' : 'image'" :style="getBackgroundImage()"></div>

                <div class="counter" v-if="$mq === 'desktop'">
                    <div class="current bold medium">{{current < 10 ? "0"+(current +1) : (current +1)}}</div>
                    <div class="remaining bold">&nbsp;/ {{items.length < 10 ? "0"+items.length : items.length}}</div>
                </div>

                <div class="content" v-else>
                    <h2 class="heading title upper bold medium text-shadow">{{currentItem.fields.title}}</h2>
                    <sc-markitup class="text f-grow"
                             :content="currentItem.fields.summary"/>
                    <router-link :to="$getRoute(currentItem.fields.slug)" class="button text-button bright">{{ $store.getters.translation('buttons.learn-more') }}</router-link>

                </div>

                <div class="progress" :style="getProgressStyle()"/>
            </div>
        </transition>

        <!-- INFO -->
        <transition name="slide-rtl" appear v-if="isVisible && items.length > 0 && $mq === 'desktop'">
            <div class="panel info drop-shadow" :style="panelStyle('right')" @mouseover="timerPause" @mouseout="timerContinue">
                <sc-triangle v-bind="{
                     stroke: 10,
                         elemStyle: {
                            position: 'absolute',
                            right: 256,
                            top: 64,
                            transform: {
                                rotate: 25,
                                scale: 3.75
                            }
                         },
                         opacity: .05,
                         solid: false,
                        }"/>

                <sc-connector v-if="$mq === 'desktop'" v-bind="{
                    length: 112,
                    direction: 'horizontal',
                    height: '3px',
                    connectorStyle: {
                        position: 'absolute',
                        top: '64px',
                        left: '32px'
                    }}"/>

                <!-- LEFT BUTTON -->
                <svg v-if="items.length > 1 && $mq === 'desktop'" class="prev noselect" @click="timerReset('prev')">
                    <path d="M25 0 L0 25 L25 50" fill="none" stroke-width="2"/>
                </svg>

                <!-- DESCRIPTION -->
                <div class="wrapper">
                    <transition name="text-ltr">
                        <div v-if="items.length > 0" class="content" :key="`item-${currentItem.sys.id}`">
                            <h2 v-if="$mq === 'desktop'" class="heading title upper bold medium">{{currentItem.fields.title}}</h2>
                            <sc-markitup class="text f-grow"
                                         v-if="$mq !== 'phone'"
                                         :content="currentItem.fields.summary"/>
                            <router-link :to="$getRoute(currentItem.fields.slug)" class="button text-button bright">{{ $store.getters.translation('buttons.learn-more') }}</router-link>
                        </div>
                    </transition>
                </div>

                <!-- RIGHT BUTTON -->
                <svg v-if="items.length > 1 && $mq === 'desktop'" class="next noselect" @click="timerReset('next')">
                    <path d="M0 0 L25 25 L0 50" fill="none" stroke-width="2"/>
                </svg>

            </div>
        </transition>

        <sc-slider-navigation v-if="$mq !== 'desktop'"
                :is-visible="isVisible"
                :count="items.length"
                :current="current+1"
                :slider-style="{top: '100%'}"
                :on-click="goTo"
        />

    </div>
</template>

<script>
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  import ScTriangle from '~/components/sc-design-elements/sc-triangle.vue'
  import ScSliderNavigation from "~/components/sc-slider-navigation.vue";

  export default {
    name: "sc-casestudies",
    components: {ScSliderNavigation, ScConnector, ScTriangle},

    data() {
      return {
        items: [],
        current: 0,
        isVisible: false,
        isPlaying: false,
        imgFade: false,
        duration: 100,
        time: 15,
        timer: undefined,
        timerState: "stopped",
        pHeight: 0,
        padding: 0
      }
    },

    computed: {

      currentItem() {
        return this.items[this.current];
      },

      progress() {
        return 100 - ((100 / this.duration) * this.time);
      },
    },

    mounted() {
      this.setSizes();
      this.$events.$on('resize-event', this.setSizes);
    },

    methods: {

      swipeHandler(swipe) {
        if (swipe === 'left') {
            this.timerReset('next');
        } else if (swipe === 'right') {
          this.timerReset('prev');
        }
      },

      goTo(index) {
        index--;
        let diff = 0;
        let dir = 'next';
        if (index > this.current) {
          diff = index - this.current;
        } else if (this.current > index) {
          diff = this.current - index;
          dir = "prev";
        }

        for (let i = 0; i < diff; i++) {
          this.timerReset(dir)
        }
      },


      setSizes() {
        let parent = this.$refs.parent;
        if (typeof parent !== 'undefined') {
          if (this.$mq === 'desktop') {
            let w = parent.clientWidth / 2;
            this.pHeight = w / 16 * 9 + 64;
            this.padding = window.getComputedStyle(parent, null).getPropertyValue('padding-left');
          } else {
            let w = parent.clientWidth;
            this.pHeight = w / 16 * 9;
            // this.padding = '0px';
            this.padding = parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-left').slice(0, -2)) * 2 + 'px';
          }
        }
      },

      panelStyle(dir) {
        let parent = this.$refs.parent;
        let padding = parseInt(this.padding.slice(0, -2));
        let w = (this.$refs.parent.clientWidth - (padding+(padding)/2)) / 2;
        let h = w / 16 * 9;

        if (this.$mq === 'desktop') {
          return `width: ${w}px; height: ${h}px; ${dir}: ${this.padding};`;

        } else {
          let p = parseInt(window.getComputedStyle(parent, null).getPropertyValue('padding-left').slice(0, -2));
          let w = this.$refs.parent.clientWidth - p * 2;
          let h = w / 2 * 3;
          if (this.$refs.parent.clientWidth > 600) {
            h = w / 3 * 2;
          }
          if (this.$mq === 'tablet') {
            h = w / 16 * 9;
          }
          return `width: ${w}px; height: ${h}px;`;
        }
      },

      /*
        VISIBILITY EVENTS
       */
      visibilityChanged(state) {
        if (state && this.items.length === 0)
          this.fetch(state);
      },

      /*
        CONTENT NAVIGATION
       */
      updateCurrent(dir) {
        this.imgFade = true;
        setTimeout(() => {
          this.imgFade = false
        }, 250);

        setTimeout(() => {
          if (dir === "next") {
            this.current = ((this.current + 1 > this.items.length - 1) ? 0 : this.current + 1);
          } else if (dir === "prev") {
            this.current = ((this.current - 1 < 0) ? this.items.length - 1 : this.current - 1);
          }
        }, 50)
      },

      /*
        TIMING
       */
      timerStart() {
        this.timerState = "running";
        this.timer = setInterval(() => {
          if (this.timerState === "running" && this.isVisible) {
            if (this.time > 0) {
              this.time -= 1 / 60;
            } else {
              this.timerReset("next");
            }
          }
        }, 1000 / 60)
      },

      timerPause() {
        this.timerState = "paused";
      },
      timerContinue() {
        this.timerState = "running";
      },
      timerReset(dir) {
        this.updateCurrent(dir);
        this.time = this.duration;
        this.timerState = "paused";
        clearInterval(this.timer);
        this.timerStart();
      },

      /*
        GETTERS
       */

      fetch(state) {
        let query = {content_type: 'promotions', 'fields.title': 'scala-home-casestudies', include: 3};
        this.$getEntries(query)
          .then((res) => {
            for (let item of res.items[0].fields.items) {
              if (item.fields.item.fields.hasOwnProperty('image'))
                this.items.push(item.fields.item);
            }

            setTimeout(() => {
              this.isVisible = state;
              this.isPlaying = true;
              this.timerStart();
            }, 250)
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

      getBackgroundImage() {
        if (this.items[this.current].fields.image.fields.file) {
          return `background-image: url(${this.items[this.current].fields.image.fields.file.url}?fm=jpg);` +
            "background-repeat: no-repeat;" +
            "background-position: 50%;" +
            "background-size: cover;" +
            "height: 100%;width:100%;display:block;"
        }
      },

      getProgressStyle() {
        if (this.isPlaying) {
          let state = "running";
          if (["paused", "stopped"].includes(this.timerState)) {
            state = "paused"
          }

          return {
            width: this.progress + "%"
          }
        } else {
          return {
            width: '0'
          }
        }
      }
    }
  }
</script>
