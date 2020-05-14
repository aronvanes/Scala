<template>
    <div class="related" :class="{background}">
        <div class="width-container">

            <div class="header">
                <div class="header-name" :style="($mq!=='desktop')?{left:'60px'}:{}">
                    {{this.$store.getters.translation(`general.${title}`)}}
                </div>
                <sc-connector direction="vertical" v-if="$mq==='desktop'"
                              :length="80"
                              :connector-style="{
                                      height: '10px',
                                      display: 'inline-block',
                                      marginRight: '2em',
                                      position: 'relative',
                                      top: '20px',
                                      left: '25px'
                        }"></sc-connector>
                <sc-connector direction="vertical" v-if="$mq!=='desktop'"
                              :length="64"
                              :connector-style="{
                                      height: '10px',
                                      display: 'inline-block',
                                      marginRight: '2em',
                                      position: 'absolute',
                                      top: '-40px',
                                      left: '30px'
                        }"></sc-connector>
            </div>
            <div class="items">
                <sc-related-item v-for="(item,index) in items" :key="index" v-if="index < limit" :item="item"
                                 :class="{first:index === 0, last:index === (items.length -1)}">
                </sc-related-item>
            </div>
        </div>
    </div>
</template>

<script>
  import ScRelatedItem from "~/components/sc-related-item.vue";

  export default {
    name: "sc-related",
    components: {ScRelatedItem},
    props: {
      items: {
        type: Array,
        required: true
      },
      limit: {
        type: Number,
        default: 3
      },
      title: {
        type: String,
        default: 'related'
      },
      background: {
        type: Boolean,
        default: true,
      }
    }
  }
</script>

<style scoped>
    .related {
        min-height: 100px;
        margin-top: 8em;
    }

    .related.background {
        background: #f4f5f8;
    }

    .header {
        transform: translate(15%, -50px);
        position: absolute;
        z-index: 2;
    }

    .header .header-name {
        text-transform: uppercase;
        font-size: 1.4em;
        font-weight: 500;
        position: relative;
    }

    .items {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 2.2em 0;
        box-sizing: border-box;
        margin-left: calc(-2em + 11px);
        margin-right: -2em;
    }

    .background .items {
        padding: 5em 0;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .related {
            margin-top: 4em;
            background: #f4f5f8;
        }

        .header {
            transform: translate(0, 2em);
        }

        .items {
            padding: 4em 0;
        }
    }


</style>