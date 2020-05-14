<template>
    <div class="width-container sc-quick-facts">
        <div class="sc-qf-title" v-if="showTitle">
            <sc-connector v-if="$mq !== 'phone'" direction="horizontal" :length=96 :connectorStyle="{
                                display: 'inline-block',
                                height: '10px',
                                marginRight: '2em',
                                justifySelf: 'left',
                                paddingTop: '0.9em'
                            }"/>

            <h3 class="heading upper bold">
                {{$store.getters.translation("general.quickfacts")}}
            </h3>
        </div>

        <div class="facts-list" :class="{hasTitle:showTitle}" :style="blockStyle">
            <div v-for="(item, index) in items" :key="'fact-'+index" class="fact"
                 v-if="item.fields && (item.fields.fact || item.fields.value || item.fields.benefit)">
                <template v-if="index < 10">
                    <div class="bold heavy number">0{{index+1}}.</div>
                    <div class="bold">{{item.fields.fact || item.fields.value || item.fields.benefit}}</div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";

  export default {
    name: "sc-quick-facts",
    components: {ScConnector},
    props: {
      items: {required: true, type: Array},
      showTitle: {type: Boolean, default: true},
      blockStyle:{}
    },
  }
</script>

<style scoped>
    .sc-quick-facts {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
    }

    .sc-qf-title {
        margin-right: -3em;
        z-index: 1;
        display: flex;
        flex-flow: row nowrap;
    }

    .facts-list {
        display: flex;
        flex-flow: row wrap;
        padding: 1em;
        background-color: #f4f5f9;
        position: relative;
        width: inherit;

    }

    .hasTitle.facts-list {
        padding-left: 10em;
    }

    .fact {
        width: 33%;
        margin: 2em 0;
        display: flex;
        flex-flow: row nowrap;
    }

    .fact .number {
        margin-right: .5em;
        color: #e0e1e3;
        font-size: 3em;
        text-align: right;
        min-width: 2em;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .sc-quick-facts {
            flex-direction: column;
        }

        .sc-qf-title {
            margin-right: initial;
            margin-bottom: 1em;
        }

        .facts-list {
            padding-left: initial;
        }

        .fact {
            width: 50%;
        }
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 767px) {
        .fact {
            width: 100%;
        }

        .facts-list, .facts-list.hasTitle {
            padding-left: initial;
        }
    }

    /* Large screens (laptops and desktops, 1200px and up) */
    @media only screen and (min-width: 1025px) and (max-width: 1599px) {
    }

    /* Extra large devices (1600px and up) */
    @media only screen and (min-width: 1600px) {
    }

</style>