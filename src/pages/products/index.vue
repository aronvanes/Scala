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
                            {{titleBlock ? titleBlock.fields.title : "Products"}}
                        </h1>
                        <p class="text" v-if="titleBlock">
                            {{titleBlock.fields.description}}
                        </p>
                    </div>
                </div>
            </div>
        </div>


        <div class="width-container " v-if="ready">

            <div class="products-list">
                <sc-triangle v-bind="leftTriangleProps()"/>

                <div class="block hardware" v-if="hardware" @click="$router.push($getRoute('hardware'))">
                    <h2 class="heading name bold heavy">{{hardware.fields.title}}</h2>
                    <sc-image :item="hardware"></sc-image>
                </div>

                <div class="block software" v-if="software" @click="$router.push($getRoute('software'))">
                    <h2 class="heading name bold heavy">{{software.fields.title}}</h2>
                    <sc-image :item="software"></sc-image>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'

  export default {
    name: "products",
    components: {},
    mixins: [mixins.scMetaTopic],

    data() {
      return {
        items: [],
        title: 'products',
        subtitle: '',
        topic: undefined,
        titleBlock: undefined,
        hardware: undefined,
        software: undefined,
        ready: false,
      }
    },

    beforeMount() {
      this.fetchTopic();
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
          select: 'fields.paragraphs',
          include: 2
        })
          .then((res) => {
            if (res.items.length > 0) {
              let response = res.items[0];
              if (typeof response.fields !== 'undefined'
                && typeof response.fields.paragraphs !== 'undefined') {

                response.fields.paragraphs.forEach((p) => {
                  if (p.fields.name === "scala-products-headertitle") this.titleBlock = p;
                  if (p.fields.name === "scala-products-hardware") this.hardware = p;
                  if (p.fields.name === "scala-products-software") this.software = p;
                });
                this.ready = true;

              }
            }
          })
          .catch((err) => {
            console.error(err);
          })
      },

      leftTriangleProps() {
        let result = {};
        result.elemStyle = {
          position: 'absolute',
          left: '100px',
          top: 300,
          zIndex: -1,

          transform: {
            rotate: 100,
            scale: 4
          }
        };
        result.stroke = 10;
        result.solid = false;
        result.opacity = 0.1;
        result.color = '#EE3235';
        return result;
      },

    }
  }
</script>

<style scoped>
    .products-list {
        display: flex;
        width: 100%;
        background: #f4f5f9;
        position: relative;
        margin: 0 0 5em;
        padding: 4em 4em 0;
        box-sizing: border-box;
    }

    .block {
        width: 48%;
        background: #eee;
        height: 250px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);
        position: relative;
        cursor: pointer;
    }

    .block .name {
        position: absolute;
        z-index: 2;
        color: #fff;
        text-shadow: 0.0em 0.0em 0.5em rgba(0, 0, 0, .2);
    }

    .block::after {
        position: absolute;
        content: '';
        background: rgba(139, 116, 116, 0.7);
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1;
        transition: background .15s ease-in-out;
    }

    .block:hover::after {
        background: rgba(211, 47, 50, 0.8);
    }

    .hardware {
        transform: translateY(-100px);
        margin-right: 2%;
    }

    .software {
        transform: translateY(-200px);
        margin-left: 2%;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {

        .products-list {
            display: block;
        }

        .block {
            width: 100%;
            margin: 0 0 30px;
        }

        .software {
            transform: translateY(-100px);
        }
    }

    @media only screen and (max-width: 600px) {
        .products-list {
            display: block;
        }

        .block {
            height: 100px;
        }
    }
</style>