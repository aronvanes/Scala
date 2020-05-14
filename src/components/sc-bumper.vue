<template>
    <div class="sc-bumper-container" :class="{'no-bg': !this.image}" :style="getContainerStyle()">
        <div class="width-container">
            <div class="sc-bumper-content drop-shadow ">
                <div class="flex" :class="{'f-column': $mq === 'phone'}">

                    <sc-connector direction="horizontal" :length="100" :connector-style="{
                        height: '10px',
                        marginRight: '2em',
                        justifySelf: 'left',
                        position: 'relative',
                        top: '1.1em'
                    }" />

                    <div class="white">
                        <h2 class="heading bold upper" :style="{margin: $mq !== 'desktop' ? '1.5em 0' : ''}">
                            {{title}}
                        </h2>
                        <p v-if="description" class="text column-gap-large" :class="{'column-count-3': $mq === 'desktop', 'column-count-2': $mq === 'tablet' }">
                            {{description}}
                        </p>
                    </div>
                </div>

                <router-link v-if="route" :to="route"
                             class="button text-button bright " style="float: right;">
                    {{buttonText}}
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
  /**
   * This component displays a bumper with mandatory description.
   * Optionally display title and button.
   * @vue-prop {string} title - Optional title prop will render if supplied
   * @vue-prop {string} description - Optional description prop will render if supplied
   * @vue-prop {Object} image - Optional image prop will render if supplied. Supply a contentful image reference.
   * @vue-prop {String} route - When provided button will be rendered to the provided route
   * @vue-prop {String} buttonText - When provided button will replace de default button text.
   */

  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  export default {
    name: "sc-bumper",
    components: {ScConnector},
    props: {
        "title": { type: String, required: false },
        "description": { type: String, required: true },
        "image": { type: Object, required: false },
        "route": { type: String, required: false },
        "buttonText": { type: String, required: false, default: "learn more" }
    },

    methods: {
      getContainerStyle() {
        let style = {};
        if (this.image && this.image.fields) {
          let url;
          if (this.image.fields.landscape) {
            url = this.image.fields.landscape.fields.file.url;
          } else if (this.image.fields.portrait) {
            url = this.image.fields.portrait.fields.file.url;
          }

          if (url) {
            url += '?q=60';
            style.backgroundImage=  `url(${url})`
          }
        }
        return style;
      }
    }
  }
</script>

<style scoped>

    .sc-bumper-container {
        margin-bottom: 9em;
        background-size: cover;
        background-position: 50%;
    }

    .sc-bumper-content {
        background-color: rgba(0,0,0,.7);
        position: relative;
        top: 3em;
        padding: 3em 13em 4em 5em;
    }

    .sc-bumper-container.no-bg {
        margin-bottom: 5em;
    }

    .sc-bumper-container.no-bg .sc-bumper-content {
        top: 0;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 375px) {}

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .sc-bumper-content {
            padding: 1em 2em 3em;
        }
    }

    /* Large screens (laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1025px) and (max-width: 1599px) {}

    /* Extra large devices (1600px and up) */
    @media only screen and (min-width: 1600px) {}

</style>