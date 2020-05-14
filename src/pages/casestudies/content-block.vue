<template>
    <div class="content-block" :style="`flex-direction:${contentDirection};`">
        <div class="content-image" :ref="refName">
            <sc-image :image="image"></sc-image>
        </div>
        <div class="content-wrapper">
            <h3 class="content-title heading upper bold">
                {{ title }}
            </h3>
            <div class="content-text" :class="{'colum-count-2': $mq !== 'phone', 'column-gap-small': $mq !== 'phone'}">
                <p v-for="pGraph in content.content" style="margin-bottom:1em;">
                    {{ pGraph.content[0].value }}
                </p>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "content-block",

    data() {
      return {
        spacing: 3,
        imgMarginDir: 'right',
        wrapperMarginDir: 'left',
        contentDirection: 'row',
        refName: this.title.split(" ").join("-"),
        imgUrl: undefined
      }
    },
    props: {
      title: {required: true, type: String},
      content: {required: true, type: Object},
      image: {required: false, type: Object},
      imagePosition: {
        required: false, type: String, default: 'left', validator: value => {
          return ['left', 'right'].includes(value)
        }
      }
    },

    mounted() {
      if (this.imagePosition === 'right') {
        this.imgMarginDir = 'left';
        this.wrapperMarginDir = 'right';
        this.contentDirection = 'row-reverse';
      }

      if (this.$mq === 'phone') {
        this.contentDirection = 'column';
      }
    }
  }
</script>

<style scoped>
    .content-block {
        position: relative;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        margin: 2em 0 4em;
    }

    .content-image, .content-wrapper {
        width: 49%;
        box-sizing: border-box;
    }

    .content-wrapper {
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
    }

    .content-title {
        margin-bottom: 1em;
    }

    .content-image-backup {
        background-image: linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.9)), url('../../assets/images/scala-mesh.jpg');
        display: block;
        height: 100%;
        background-size: cover;
    }

    /* TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .content-image, .content-wrapper {
            width: 48%;
            box-sizing: border-box;
        }
    }

    /* MOBILE */
    @media only screen and (max-width: 767px) {
        .content-block {
            margin: 2em 0;
        }

        .content-image, .content-wrapper {
            width: 100%;
            box-sizing: border-box;
        }
    }

    /* Large screens (laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1025px) and (max-width: 1599px) {
    }

    /* Extra large devices (1600px and up) */
    @media only screen and (min-width: 1600px) {
    }

</style>