<template>
    <div class="width-container">
        <h3 v-if="title" class="heading bold medium scala-red">{{title}}</h3>
        <template v-if="description">{{description}}</template>
        <div class="flex f-row f-wrap f-evenly">
            <div class="bullet-point" v-for="(item, index) in bulletPoints">
                <div class="bold medium number"> {{prettyNumber(index)}}.</div>
                <div class="heavy">{{item.fields.value}}</div>
            </div>
        </div>
    </div>
</template>

<script>
  /**
   * This component renders a list of bullet-points as a wrapped row with four columns per row.
   * Optionally display title and description.
   * @vue-prop {string} title - Optional title prop will render if supplied
   * @vue-prop {string} description - Optional description prop will render if supplied
   * @vue-prop {array} bulletPoints - Array of bullet points. Minimal structure of a bullet point = {fields: {value: 'value'}}
   * @vue-prop {number} offset - Default offset is 1, this will offset the index of the bulletPoints array
   */

  export default {
    name: "sc-bullet-points",
    props: {
      "title": { type: String, required: false },
      "description": { type: String, required: false },
      "bulletPoints": { type: Array, required: true },
      offset: { type: Number, required: false, default:  1 }
    },

    methods: {
      /**
       * Add a zero to a number if it's below 10 and return as string.
       * @param {number} index - Value to 'make pretty'
       */
      prettyNumber(index) {
        let number = index + this.offset;
        if (number < 10) number = "0" + number;
        return number;
      },
    }
  }
</script>

<style scoped>
    .bullet-point {
        flex: 1 0 20%;
        margin: 3em 3em 0;
        box-sizing: border-box;
    }

    .bullet-point .number {
        color: #e0e1e3;
        font-size: 4rem;
        margin-bottom: .25em;
    }

    .bullet-point:nth-child(4n) {
        margin-right: 0;
    }
    .bullet-point:nth-child(4n+1) {
        margin-left: 0;
    }

    .sc-bumper-container.no-bg .sc-bumper-content {
        top: 0;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 414px) {}

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .bullet-point {
            flex-basis: 50%;
            margin: 2em 0 1em;
            padding-right: 2em;
        }
    }

    /* Large screens (laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1025px) and (max-width: 1599px) {}

    /* Extra large devices (1600px and up) */
    @media only screen and (min-width: 1600px) {}
</style>