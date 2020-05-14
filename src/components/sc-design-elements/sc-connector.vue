<template>
    <svg class='sc-connecter' :style="getStyle()" v-observe-visibility="{
        callback: visibilityChanged,
        once: true,
    }">
        <path v-if="isVisible"
              :d="getPath()"
              :stroke-width="stroke"
              :stroke="color"
              :style="getPathStyle()"
              >
        </path>
    </svg>
</template>

<script>
  export default {
    name: "sc-connector",
    props: {
      direction:{ required: false, type: String, default: "vertical",
        validator: val => { return ['vertical','horizontal'].includes(val); }
      },
      animate:  { required: false, type: Boolean, default: true},
      delay:    { required: false, type: Number, default: 320 },
      length:   { required: false, type: Number, default: 196 },
      stroke: {required: false, type: Number, default: 4},
      color:    { required: false, type: String, default: "#EE3235" },
      connectorStyle:    { required: true, type: Object },
    },

    data() {
      return {
        isVisible: false,
        style: this.connectorStyle,
      }
    },

    methods: {
      getStyle() {
        let dir = this.direction === 'vertical' ? 'height' : 'width';
        this.style[dir] = this.length;
        this.style["min-" + dir] = this.length + 'px';
        this.style["max-" + dir] = this.length + 'px';
        this.style.display = this.connectorStyle.display || 'block';
        return this.style;
      },

      getPath() {
        let path = "M0 0";

        if (this.direction === "vertical") {
          path += ` V0 ${this.length}`;
        } else {
          path += ` L${this.length} 0`;
        }

        return path;
      },

      getPathStyle() {
        if (this.animate)
            return {
              strokeDasharray: this.length,
              strokeDashoffset: this.length,
              animation: 'straightPathOffset 1s cubic-bezier(0.17, 0.57, 0.38, 0.95) forwards',
              'animation-delay': this.delay+'ms',
            }
      },

      visibilityChanged (isVisible, entry) {
        this.isVisible = isVisible;
      }
    }
  }
</script>
