<template>
    <div class="image-wrap" :ref="ref" :style="{height:computedHeight}" :key="ref">
        <img v-if="hasImage"
             class="image"
             :style="`object-fit: ${fit}`"
             :alt="computedImage.fields.title"
             :title="computedImage.fields.title"
             :src="imgUrl"/>
        <img v-if="!hasImage"
             :src="require('../assets/images/scala-mesh.jpg')"
             class="image"
             alt="scala image"
             title="scala image"/>
        <div v-if="!hasImage" class="fallback"></div>
    </div>
</template>

<script>
  export default {
    name: "sc-image",
    props: {
      orientation: {
        type: String, default: 'landscape'
      },
      item: {},
      image: {},
      height: {
        type: Number
      },
      fit: {
        type: String,
        default: 'cover'
      }
    },

    data() {
      return {
        imgUrl: null,
        ref: 'image_' + new Date().getTime()
      }
    },

    computed: {
      hasImage() {
        return this.item && this.item.fields && this.item.fields.image || this.image
      },

      computedImage() {
        if (this.item && this.item.fields && this.item.fields.image) {
          return this.item.fields.image;
        } else if (this.image) {
          return this.image
        }
      },

      computedHeight() {
        if (this.height) {
          if (this.$mq === 'desktop') {
            return this.height + 'px';
          } else {
            return (this.height * 0.6) + 'px';
          }
        } else {
          return '100%'
        }

      }
    },

    mounted() {
      this.$nextTick(() => {
        this.getImage();
      })
    },

    watch: {
      item: {
        handler: function (newVal, oldVal) {
          this.getImage();
        },
      }
    },

    methods: {
      getImage() {
        let url = undefined;

        if (this.$refs[this.ref] && this.computedImage) {
          let w = Math.ceil(this.$refs[this.ref].getBoundingClientRect().width);
          let h = Math.ceil(this.$refs[this.ref].getBoundingClientRect().height);

          if (this.orientation === 'landscape') {
            if (this.computedImage.fields.landscape) {
              url = this.computedImage.fields.landscape.fields.file.url + `?w=${w}`;
            } else if (this.computedImage.fields.portrait) {
              url = this.computedImage.fields.portrait.fields.file.url + `?h=${h}`;
            }
          } else {
            if (this.computedImage.fields.portrait) {
              url = this.computedImage.fields.portrait.fields.file.url;
            } else if (this.computedImage.fields.landscape) {
              url = this.computedImage.fields.landscape.fields.file.url;
            }

            url + `?h=${h}`
          }
        }

        this.imgUrl = url;
      }
    }
  }
</script>

<style scoped>
    .image-wrap {
        position: relative;
        width: 100%;
    }

    .image {
        width: 100%;
        height: inherit;
        position: relative;
        object-fit: cover;
    }

    .fallback {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.9))
    }
</style>