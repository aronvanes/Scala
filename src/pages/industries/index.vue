<template>
    <div class="products">
        <div class="index-header">
            <div class="width-container"
                 style="display:flex; flex-flow: row;justify-content: space-between; align-items:center;">
                <div class="flex flex-row">
                    <sc-connector direction="horizontal" :length=100 :connectorStyle="{
                        height: '10px',
                        marginRight: '2em',
                        justifySelf: 'left',
                        position: 'relative',
                        top: '1.1em'
                    }"/>
                    <div>
                        <h1 class="heading bold heavy upper" style="margin:0 0 .5em;">
                            {{title}}
                        </h1>
                        <p class="text">
                            {{subtitle}}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- TRIANGLES -->
        <template>
            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 6,
                    elemStyle: {
                        position: 'absolute',
                        transform: {
                            rotate: -120,
                            scale: 3.5,
                            transformX:'100px',
                        }
                    },
                opacity: .1,
                solid:false,
                color:'#ff3c3c',
                top:'50em',
                }">
            </sc-triangle>
            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 6,
                    elemStyle: {
                        position: 'absolute',
                        transform: {
                            rotate: -140,
                            scale: 3.5,
                        }
                    },
                opacity: .1,
                color:'#999',
                top:'90em',
                }">
            </sc-triangle>
            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 6,
                    elemStyle: {
                        position: 'absolute',
                        transform: {
                            rotate: 30,
                            scale: 3.5,
                            transformX:'100px',
                        }
                    },
                opacity: .1,
                color:'#bbb',
                right:'10%',
                top:'60em'
                }">
            </sc-triangle>
            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 6,
                    elemStyle: {
                        position: 'absolute',
                        transform: {
                            rotate: 30,
                            scale: 3.5,
                            transformX:'100px',
                        }
                    },
                opacity: .1,
                color:'#999',
                right:'10%',
                solid:false,
                top:'100em'
                }">
            </sc-triangle>
        </template>

        <div class="width-container " v-if="ready">
            <div class="products-list">
                <div class="block hardware" v-for="item in items">
                    <div class="inner" @click="$router.push($getRoute(item.fields.slug))">
                        <!--<div class="name">{{item.fields.title}}</div>-->
                        <h2 class="heading name bold heavy">{{item.fields.title}}</h2>
                        <sc-image :item="item"></sc-image>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScCardsList from "~/components/sc-cards-list.vue";

  export default {
    name: "industries",
    components: {ScCardsList},
    mixins: [mixins.scMetaTopic],

    data() {
      return {
        items: [],
        title: 'industries',
        subtitle: '',
        ready: false,
      }
    },

    beforeMount() {
      this.fetchTopic();
      this.fetchEntries();
    },

    computed: {
      filteredItems() {
        return this.items;
      }
    },

    methods: {
      fetchTopic() {
        this.$getEntries({
          content_type: 'topics',
          'fields.name': this.$options.name,
          select: 'fields.paragraphs'
        })
          .then((res) => {
            if (res.items.length > 0) {
              let response = res.items[0];
              if (typeof response.fields !== 'undefined'
                && typeof response.fields.paragraphs !== 'undefined') {
                this.title = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-industries-headertitle')[0].fields.title;
                this.subtitle = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-industries-headertitle')[0].fields.description;
              }
            }
          })
          .catch((err) => {
            console.error(err);
          })
      },

      fetchEntries() {
        this.$getEntries({
          content_type: 'industries',
          'fields.slug[exists]': true,
          'fields.title[exists]': true,
          select: 'sys.id,fields.title,fields.slug,fields.image',
        })
          .then((res) => {
            this.items = res.items;
            this.ready = true;
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  }
</script>

<style scoped>
    .products-list {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        background: #f4f5f9;
        position: relative;
        padding: 4em 2em;
        box-sizing: border-box;
        margin-bottom: 8em;
    }

    .block {
        width: 100%;
        max-width: 33.3%;
        height: 500px;
        position: relative;
        box-sizing: border-box;
        padding: 3em;

    }

    .block:nth-child(3n+1),
    .block:nth-child(3n+3) {
        transform: translateY(-13em);
    }

    .block .inner {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        box-sizing: border-box;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
        cursor: pointer;
    }

    .block .name {
        width: 100%;
        position: absolute;
        z-index: 2;
        color: #fff;
        max-width: 80%;
        text-shadow: 0.0em 0.0em 0.5em rgba(0, 0, 0, .2);
        text-align: center;
        line-height: 1em;
    }

    .index-header .text {
        max-width: 50%;
    }

    .block .inner::after {
        position: absolute;
        content: '';
        background: /* top, transparent shark, faked with gradient */ linear-gradient(
            rgba(84, 89, 112, .7),
            rgba(84, 89, 112 , .7)
        );
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        transition: all 10s var(--easing);
    }

    .block .inner:hover::after {
        background: /* top, transparent red, faked with gradient */ linear-gradient(
                rgba(238, 50, 53, .8),
                rgba(238, 50, 53,.8)
        );
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {

        .products-list {
            display: block;
        }

        .index-header .text {
            max-width: 100%;
        }

        .block {
            max-width: 100%;
            height: 200px;
            padding: 2em;
        }

        .software {
            transform: translateY(-100px);
        }

        .block:nth-child(3n+1),
        .block:nth-child(3n+3) {
            transform: translateY(0em);
        }
    }

    @media only screen and (max-width: 600px) {
        .products-list {
            display: block;
        }

        .block {
            height: 150px;
            padding: 1em;
        }
    }
</style>