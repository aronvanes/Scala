<template>
    <div :style="oscillationStyle" class="osci" v-if="$mq !== 'phone'">
        <svg class="sc-triangle" :width="size.width" :height="size.height" :style="elemStyle" ref="triangle">
            <path :d="elemPath" :stroke="color" :fill="fillColor()" :opacity="opacity" :stroke-width="stroke"
                  stroke-linejoin="miter"/>
        </svg>
    </div>
</template>

<script>
  export default {
    name: "sc-triangle",
    props: {
      elemStyle: {
        required: false, type: Object, default: () => {
          return {position: 'absolute'}
        }
      },
      size: {
        required: false, type: Object, default: () => {
          return {width: 150, height: 150}
        }
      },
      color: {required: false, type: String, default: "#ADADAD"},
      opacity: {required: false, type: Number, default: 1},
      solid: {required: false, type: Boolean, default: true},
      stroke: {required: false, type: Number, default: 25},
      animate: {required: false, default: true},
      right: {},
      top: {},
      left: {}
    },

    data() {
      return {
        elemColor: this.color,
        elemPath: this.getPath(),
        scrollTop: undefined,
        limit: Math.max(document.body.scrollHeight, document.body.offsetHeight,
          document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight),
        floatLimit: 50,
        amount: 0,
        onScreen: false,
        transform: undefined,
        position: undefined,
        animationId: undefined,
        count: 0,
        oscillationStyle: null,
        oscillationMin: 6000,
        oscillationMax: 8000,
        oscillationDuration: null,
        oscillationRotation: 0,
        oscillationSkew: 0,
        oscillationScale: 1,
        oscillationTop: 0,
        oscillationLeft: 0,
        oscillationInterval: null,
      }
    },

    beforeMount() {
      this.getStyle();
    },

    mounted() {
      if (this.animate === true) {
        this.oscillationDuration = this.rndInt(this.oscillationMin, this.oscillationMax);
        this.startOscillation();
      }
    },

    beforeDestroy() {
      clearInterval(this.oscillationInterval);
    },

    methods: {
      getPath() {
        const offset = this.stroke + 5;
        return `M ${this.size.width - offset} ${offset} v ${this.size.width - offset * 2} h -${this.size.width - offset * 2} Z`;
      },

      getStyle() {
        let result = this.elemStyle;
        if (typeof this.elemStyle.transform !== 'undefined' && typeof this.transform === 'undefined') {
          this.transform = this.elemStyle.transform;
          delete this.elemStyle.transform;

          let transform = "";
          ['rotate', 'scale', 'translate'].forEach((trans) => {
            if (typeof this.transform[trans] !== 'undefined') {
              if (trans === 'rotate') {
                transform += ` rotate(${this.transform[trans]}deg)`
              } else {
                transform += ` ${trans}(${this.transform[trans]})`
              }
            }
          });
          result.transform = transform;
        }

        ['top', 'right', 'bottom', 'left'].forEach((pos) => {
          if (typeof this.elemStyle[pos] !== 'undefined' && (typeof this.position === 'undefined' || typeof this.position[pos] === 'undefined')) {
            if (typeof this.position === 'undefined') this.position = {};
            this.position[pos] = this.elemStyle[pos];
            delete this.elemStyle[pos];
          }

          if (typeof this.position !== 'undefined' && typeof this.position[pos] !== undefined) {
            result[pos] = `${this.position[pos]}px`;
          }
        });

        this.elemStyle = result;
      },

      fillColor() {
        return this.solid ? this.color : 'none';
      },

      oscillate() {
        this.oscillationRotation = this.rndInt(-5, 5);
        this.oscillationSkew = this.rndInt(-10, 10);
        this.oscillationScale = this.rndInt(90, 100) / 100;
        this.oscillationTop = this.rndInt(-30, 30);
        this.oscillationLeft = this.rndInt(-30, 30);

        this.oscillationStyle = {
          transform: `rotate(${this.oscillationRotation}deg) skew(${this.oscillationSkew}deg) scale(${this.oscillationScale}) translate3d(${this.oscillationTop}px, ${this.oscillationLeft}px, 0)`,
          transitionDuration: this.oscillationDuration + 'ms',
          ...(typeof (this.right) !== 'undefined') ? {right: this.right} : {},
          ...(typeof (this.top) !== 'undefined') ? {top: this.top} : {},
          ...(typeof (this.left) !== 'undefined') ? {left: this.left} : {},
        }
      },

      startOscillation() {
        this.oscillate();
        setTimeout(() => {
          this.oscillate();
        }, 100);
        this.oscillationInterval = setInterval(() => {
          this.oscillate();
        }, this.oscillationDuration);
      },

      rndInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
    }
  }
</script>

<style scoped>
    .osci {
        transition-property: transform;
        transition-timing-function: ease-in-out;
        z-index: -1;
        position: absolute;
        transform-origin: center;
    }
</style>
