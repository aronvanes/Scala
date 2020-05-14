<template>
    <div class="slider-nav" v-if="isVisible" :style="getStyle()">
        <template v-for="index in count">
            <div :key="`sc-slider-nav-indicator-${index}`"
                 :class="index === current ? 'item-indicator active' : 'item-indicator'"
                 @click="handleIndicatorClick(index)"/>
        </template>
    </div>
</template>

<script>
  export default {
    name: "sc-slider-navigation",
    props: {
      isVisible: {type: Boolean, required: false, default: true},
      count: {type: Number, required: true},
      current: {type: Number, required: true},
      onClick: {type: Function, required: false},
      sliderStyle: {required: false}
    },

    methods: {
      handleIndicatorClick(index) {
        if (typeof this.onClick !== 'undefined')
            this.onClick(index);
      },

      getStyle() {
        if (typeof this.sliderStyle !== 'undefined'
            && (['string', 'object'].includes(typeof this.sliderStyle))) {
          return this.sliderStyle;
        }
      }
    }
  }
</script>

<style scoped>
    .slider-nav {
        position: relative;
        display: flex;
        margin-top: 2em;
        justify-content: center;
        width: inherit;
    }
    .slider-nav:hover {
        transform: initial;
    }

    .item-indicator {
        width: 2.5em;
        height: 2.5em;
        margin: 0 8px;
        cursor: pointer;
    }

    .item-indicator::after {
        display: block;
        content: ' ';
        position: relative;
        width: 100%;
        height: 2px;
        background-color: var(--primary-color-bright);
        top: calc(50% - 1px);
        transition: all .25s var(--easing);
    }

    .active.item-indicator::after {
        background-color: var(--primary-color-dark);
        height: 4px;
        top: calc(50% - 2px);
    }

    .item-indicator:hover::after {
        height: 100%;
        top: 0;
    }
</style>