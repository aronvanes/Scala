<template>
    <div class="cards-list width-container">
        <div class="cards-list-wrapper flex f-wrap" :class="{'f-column': $mq !== 'desktop'}">
            <sc-cards-list-item v-for="(item, index) in items" :type="type" :item="item"
                                :key="'card-list-item-'+index" :orientation="orientation" :hideOverlay="hideOverlay" :disableClick="disableClick" />
        </div>
    </div>
</template>

<script>
  import ScCardsListItem from "~/components/sc-cards-list-item.vue";

  export default {
    name: "sc-cards-list",
    components: {ScCardsListItem},
    props: {
      items: {type: Array, required: true},
      type: {type: String, default: 'cards'},
      orientation: {type: String, required: false, default: 'landscape'},
      hideOverlay: {type: Boolean, required: false, default: false},
      disableClick: {type: Boolean, required: false, default: false}
    },
  }
</script>

<style scoped>
    .cards-list {
        margin-bottom: 6em;
    }

    .cards-list-wrapper {
        background-color: #f4f5f9;
        width: inherit;
        justify-content: space-between;
        padding: 0 calc(100px + 2em) 4em;
        max-width: 1920px;
        box-sizing: border-box;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 375px) {
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .cards-list-wrapper {
            padding: 0 2em 1em;
        }
    }

    /* Large screens (laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1025px) and (max-width: 1599px) {
    }

    /* Extra large devices (1600px and up) */
    @media only screen and (min-width: 1600px) {
    }
</style>