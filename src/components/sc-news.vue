<template>
    <div class="sc-news width-container" v-touch:swipe="swipeHandler"
         v-observe-visibility="{callback: visibilityChanged, once: true}" ref="parent">

        <!-- TOPIC INFO -->
        <div class="topic-info" v-if="typeof topicInfo !== 'undefined'">
            <transition-group name="slide-up" appear v-if="isVisible">
                <div class="title" key="home-news-topic-info-title">
                    <sc-connector v-if="$mq === 'desktop'"
                                  v-bind="{
                        direction:'horizontal',
                        length: 112,
                        connectorStyle: {
                          position: 'absolute',
                          height: 4,
                          left: -112,
                          top: '16px'
                        }
                      }"/>
                    <h2 class="heading bold medium">
                        {{topicInfo.fields.title}}
                    </h2>
                </div>

                <p class="text wide" key="home-news-topic-info-text">{{topicInfo.fields.description}}</p>
            </transition-group>
        </div>

        <!-- LEFT BUTTON -->
        <svg v-if="originalCount> 2 && isVisible && $mq === 'desktop'" class="prev noselect"
             :style="getNavButtonPosition('left')"
             @click="prevItem()">
            <path d="M25 0 L0 25 L25 50" fill="none" stroke-width="2">
            </path>
        </svg>

        <!-- ITEMS -->
        <div class="sc-news-items " ref="widthContainer">
            <div class="sc-news-items-slider" :style="getSliderStyle()">
                <template v-for="(item, index) in items" v-if="isVisible">
                    <transition @leave="leave" mode="out-in">
                        <div :key="`sc-news-item-${index}-${Math.random()}`"
                             class="sc-news-item"
                             :id="`sc-news-item-${index}`"
                             :style="getItemStyle(item, index)"
                             :data-index="index"
                             @mouseenter="mouseEnter"
                             @mouseleave="mouseLeave"
                             @click="handleClick(item)">

                            <div class="item-wrap drop-shadow low">
                                <div class="item-info">
                                    <h4 class="title bold medium" style="font-size: 2rem;">
                                        {{item.fields.title}}
                                    </h4>
                                    <div class="text" v-if="$mq !== 'phone'"> {{item.fields.shortDescription}}</div>
                                </div>

                                <div class="item-image" :style="getItemWrapStyle(item, index)">
                                    <sc-image :item="item" ></sc-image>
                                </div>

                                <div class="item-button">
                                    <router-link :to="$getRoute(item.fields.slug)"
                                                 class="button">
                                        {{ $store.getters.translation('buttons.read-more') }}
                                    </router-link>
                                </div>
                            </div>

                        </div>
                    </transition>
                </template>
            </div>
        </div>

        <!-- RIGHT BUTTON -->
        <svg v-if="originalCount > 2 && isVisible && $mq === 'desktop'" class="next noselect"
             :style="getNavButtonPosition('right')"
             @click="nextItem()">
            <path d="M0 0 L25 25 L0 50" fill="none" stroke-width="2">
            </path>
        </svg>

        <sc-slider-navigation
                :is-visible="isVisible"
                :count="originalCount"
                :current="current+1"
                :onClick="goTo"

        />

        <sc-triangle v-if="isVisible" v-bind="{
          elemStyle: {
              position: 'absolute',
              bottom: '72px',
              left: '72px',
              zIndex: -1,
              transform: {
                rotate: 10,
                scale: 4
              }
            },
            stroke: 8,
            solid: false,
            opacity: 0.2,
        }"/>

    </div>
</template>

<script>
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  import ScTriangle from "~/components/sc-design-elements/sc-triangle.vue";
  import ScSliderNavigation from "~/components/sc-slider-navigation.vue";
  import ScExpandingContainer from "~/components/sc-expanding-container";

  export default {
    name: 'sc-news',
    components: {ScExpandingContainer, ScSliderNavigation, ScConnector, ScTriangle},

    props: {
      topicInfo: {required: false, type: Object}
    },

    data() {
      return {
        isVisible: false,
        items: [],
        direction: "left",
        itemWidth: undefined,
        // itemHeight: undefined,
        offset: 0,
        categories: ['blog', 'news'],
        displayItems: false,
        duration: 10000,
        disabled: false,
        current: 0,
        originalCount: 0,
        showByIndex: null,
        firstRender: true,
        visibleItemIndex: null
      }
    },

    computed: {
      itemHeight() {
        if (this.itemWidth === undefined) {
          return undefined;
        } else {
          console.log("SHOULD BE: ", (this.itemWidth / 16) * 9 );
          return (this.itemWidth / 16) * 9;
        }
      }
    },

    mounted() {
      this.$events.$on('resize-event', this.setSizes);
    },

    beforeDestroy() {
      if (this.timer !== null || typeof this.timer !== 'undefined') {
        clearInterval(this.timer);
      }
    },

    methods: {
      setSizes() {
        this.firstRender = true;
        this.isVisible = false;
        this.getSliderStyle();
        this.getItemStyle();
        this.getItemWrapStyle();

        setTimeout(() => {
          this.firstRender = false;
          this.isVisible = true;

        }, 250);

      },

      swipeHandler(swipe) {
        if (swipe === 'left') {
          this.nextItem();
        } else if (swipe === 'right') {
          this.prevItem();
        }
      },

      mouseEnter(e) {
        e.target.classList.add("visible");
      },

      mouseLeave(e) {
        e.target.classList.remove("visible");
      },

      visibilityChanged(isVisible, entry) {
        if (isVisible && this.items.length === 0) {
          this.fetchEntries();
        }
      },

      goTo(index) {
        index--;
        let diff = 0;

        if (index > this.current) {
          diff = index - this.current;
          this.direction = "next";
        } else if (this.current > index) {
          diff = this.current - index;
          this.direction = "prev";
        }

        for (let i = 0; i < diff; i++) {
          this.disabled = true;

          let delay = i * 900;

          setTimeout(() => {

            if (this.direction === "next") {
              this.items.push(this.items.shift());
            } else if (this.direction === "prev") {
              this.items.unshift(this.items.pop());
            }

            this.setCurrent();


          }, delay);
          if (i === diff - 1) {
            this.disabled = false;
          }
        }
      },

      setCurrent() {
        let newCurrent = this.current;

        if (this.direction === "next") {
          newCurrent++;
        } else if (this.direction === "prev") {
          newCurrent--;
        }

        if (newCurrent >= this.originalCount) {
          newCurrent -= this.originalCount;
        }
        if (newCurrent < 0) {
          newCurrent = this.originalCount - 1;
        }

        this.current = newCurrent;
      },

      nextItem() {
        if (!this.disabled) {
          this.disabled = true;
          this.direction = "next";
          this.items.push(this.items.shift());
          this.setCurrent();
        }

        setTimeout(() => {
          this.disabled = false
        }, 1000);
      },

      prevItem() {
        if (!this.disabled) {
          this.disabled = true;
          this.direction = "prev";
          this.items.unshift(this.items.pop());
          this.setCurrent();
        }

        setTimeout(() => {
          this.disabled = false
        }, 1000);
      },

      getMultiplier() {
        return ['phone', 'tablet', 'desktop'].indexOf(this.$mq) + 1;
      },

      getSliderStyle() {
        let style = '';
        if (this.$refs.widthContainer) {
          style += 'width: 100%;';

          if (this.items.length > 2) {
            this.offset = this.$refs.widthContainer.clientWidth / this.getMultiplier();
            style += `margin-left: -${this.offset}px`;
          } else {
            style += 'justify-content: center;';
          }

        }
        return style;
      },

      getItemStyle(item, index) {
        let style = "";
        this.itemWidth = this.$refs.widthContainer.clientWidth / this.getMultiplier();
        style += `width: ${this.itemWidth}px; max-width:${this.itemWidth}px;`;
        style += `height: ${this.itemHeight + 124}px; `;

        if (index !== 2 && this.$mq === 'desktop' && this.items.length > 2) {
          style += "margin-top:64px;";
        }

        return style;
      },

      getItemWrapStyle(item, index) {
        let style = "";
        let w = this.itemWidth;
        if (this.$mq === 'desktop') {
          style = `width:calc(${w}px - 48px);height:calc(${(w / 16) * 9}px + 2px);`;
        } else if (this.$mq === 'phone') {
          style = `width: calc(100% - .5em);height:${(w / 16) * 9}px;`;
        } else {
          style = `width: calc(100% - 48px);height:${(w / 16) * 9}px;`;
        }
        return style;
      },

      timerStart() {
        this.timer = setInterval(() => {
          this.nextItem();
        }, this.duration)
      },

      fetchEntries() {
        let processedCount = 0;
        this.categories.forEach((type) => {
          this.$getEntries({
            content_type: type,
            limit: 5,
            order: '-fields.startDate',
            'fields.startDate[lte]': moment().toJSON(),
          })
            .then((res) => {
              this.items = this.items.concat(res.items);
            })
            .finally(() => {
              processedCount++;
              this.checkItems(processedCount);
            })
            .catch((err) => {
              console.error(err);
            })
        });
      },

      checkItems(processedCount) {
        if (processedCount === this.categories.length) {
          // Fill items with a copy of itself to fake 'infinite loop'
          this.originalCount = this.items.length;
          if (this.items.length > 2 && this.items.length < 5) {
            this.items = this.items.concat(this.items);
          }
          setTimeout(() => {
            this.isVisible = true;
            setTimeout(() => {
              this.firstRender = false
            }, 500);
          }, 250);
        }
      },

      leave(el) {
        if (!this.firstRender) {
          const amount = this.direction === 'next' ? this.itemWidth * -1 : this.itemWidth;

          let index = parseInt(el.dataset.index);

          if (index === 2 && this.$mq === 'desktop') {
            el.style.marginTop = '64px';
          }

          if (this.direction === 'next' && index === 3) {
            el.style.marginTop = 0;
          } else if (this.direction === 'prev' && index === 1) {
            el.style.marginTop = 0;
          }

          el.style.transform = `translateX(${amount}px)`;
        }
      },

      getNavButtonPosition(dir) {
        let padding = parseInt(window.getComputedStyle(this.$refs.parent, null).getPropertyValue('padding-left').slice(0, -2));
        let style = {};
        style[dir] = padding - 64 + "px";
        return style;
      },

      handleClick(item) {
        this.$router.push(this.$getRoute(item.fields.slug));
      }
    }
  }
</script>

<style scoped>
    .sc-news {
        width: 100%;
        padding-top: 64px;
        padding-bottom: 64px;
        margin: 0 auto;
    }

    .sc-news .topic-info {
        text-align: center;
        display: flex;
        flex-direction: column;
        max-width: 20vw;
        align-items: center;
        margin: 0 auto 32px;
        min-height: 100px;
    }

    .sc-news .topic-info .title {
        display: flex;
        flex-flow: row;
        position: relative;
        max-width: 15vw;
        margin: 0 auto;
    }

    .sc-news .topic-info .title {
        color: var(--primary-color-bright);
    }

    .sc-news .topic-info .text {
        font-size: 1.1em;
        position: relative;
    }

    .sc-news .prev,
    .sc-news .next {
        position: absolute;
        cursor: pointer;
        width: 25px;
        height: 50px;
        top: calc(59%);
        z-index: 10;
    }

    .sc-news .prev {
        left: 4px;
    }

    .sc-news .next {
        right: 4px;
    }

    .sc-news .prev path,
    .sc-news .next path {
        display: block;
        transition: stroke .2s var(--easing);
        stroke: rgba(194, 194, 194, .6);
    }

    .sc-news .prev:hover path,
    .sc-news .next:hover path {
        stroke: rgba(194, 194, 194, .9);
    }

    .sc-news-items {
        position: relative;
        margin: 0 auto;
        overflow-x: hidden;
        padding: 0;
        width: 100%;
        cursor: pointer;
    }

    .sc-news-items .sc-news-items-slider {
        position: relative;
        display: flex;
    }

    .sc-news-items .sc-news-item {
        display: inline-flex;
        box-sizing: border-box;
        transition: all .8s var(--easing);
        position: relative;
        flex: 1 0 auto;
        overflow: hidden;
    }

    .sc-news-item .item-wrap {
        width: 100%;
        margin: 24px;
        background-color: var(--primary-color-dark);
    }

    .sc-news-items .sc-news-item .item-info {
        background-color: var(--primary-color-dark);
        padding: 1em 2em;
        color: #FFF;
        transition: all .5s var(--easing);
        position: absolute;
        width: 100%;
        max-width: calc(100% - 48px);
        box-sizing: border-box;
        height: 100px;
        z-index: 1;
    }

    .item-info .text {
        height: 0;
        opacity: 0;
        transition: all .2s var(--easing);
        margin-top: 3em;
        font-size: 1.6rem;
        font-weight: 500;
    }

    .item-image {
        position: absolute;
        top: 124px;
        overflow: hidden;
    }

    .item-button {
        position: absolute;
        display: inline-flex;
        bottom: 1em;
        right: 2.5em;
        z-index: 2;
        overflow: visible;
    }

    .sc-news-item.visible .item-info {
        opacity: 1;
        height: calc(100%);
        background-color: rgba(43, 46, 55, .6);
        box-sizing: border-box;
        width: 100%;
    }

    .sc-news-item.visible .item-info .text {
        opacity: 1;
    }

    @media only screen and (max-width: 1024px) {

        .sc-news {
            margin-bottom: 2em;
        }

        .sc-news .topic-info,
        .sc-news .topic-info .title {
            min-height: initial;
            max-width: initial;
            align-items: flex-start;
            text-align: left;
            margin: initial;
            background-color: initial;
        }

        .sc-news-items .sc-news-item .item-info {
            padding: 1em;
            max-width: calc(100% - 48px);
        }

        .sc-news-item .item-info .title {
            background-color: initial;
        }
        .item-button {
            right: 3em;
        }
    }

    @media only screen and (max-width: 480px) {

        .sc-news {
            padding-top: initial;
            padding-bottom: initial;
        }

        .sc-news-item .item-wrap {
            margin: 0 .25em;
        }
        .sc-news-items .sc-news-item .item-info {
            padding: 1em;
            max-width: calc(100% - .5em);
        }
        .item-image {
            width: calc(100% - .5em);
        }
        .item-button {
            right: 1em;
        }
    }


</style>
