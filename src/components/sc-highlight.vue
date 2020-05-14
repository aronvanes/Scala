<template>
    <div class="sc-highlight width-container" v-observe-visibility="{
            callback: visibilityChanged,
            once: true
        }">
        <div class="hl-wrapper wide" v-if="typeof item !== 'undefined'">
            <div class="hl-column title">
                <sc-connector v-if="$mq === 'desktop'" v-bind="{
                    delay: 2500,
                    length: 196,
                    connectorStyle: {
                        zIndex: 20,
                        position: 'absolute',
                        right: '8px',
                        width: '2px',
                        top: '-224px'
                    }
                }" />
                <sc-triangle v-bind="leftTriangleProps()"/>
                <h1 class="heading bold medium" v-show="fetched && typeof item.fields.title !== 'undefined' && isVisible">{{item.fields.title}}</h1>
            </div>

            <template  v-if="$mq === 'phone'">
                <div class="hl-column">
                    <p class="text" v-show="fetched && typeof item.fields.descriptionMobile !== 'undefined' && isVisible">{{item.fields.descriptionMobile}}</p>
                </div>
            </template>

            <template v-else>
                <div class="hl-column" :class="{'column-count-2 column-gap-large': $mq !== 'tablet'}">
                    <span class="text" v-show="fetched && typeof item.fields.description !== 'undefined' && isVisible">
                        {{item.fields.description}}
                    </span>
                    <sc-triangle :animate="false" v-bind="rightTriangleProps()"/>
                </div>
            </template>
        </div>

    </div>
</template>

<script>
  import scTriangle from '~/components/sc-design-elements/sc-triangle.vue'
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";

  export default {
    name: 'sc-highlight',
    components: {
      scTriangle, ScConnector
    },

    data() {
      return {
        item: undefined,
        fetched: false,
        isVisible: false,
        title: undefined,
        column1: undefined,
        column2: undefined,
        columnMobile: undefined,
      }
    },

    created() {
      if (this.$mq === 'phone') {
        this.fetch();
      }
    },

    methods: {
      visibilityChanged (isVisible, entry) {
        this.fetch();
        setTimeout(() => {
          this.isVisible = isVisible;
        }, 500);
      },
      leftTriangleProps() {
        let result = {};
        result.elemStyle = {
          position: 'absolute',
          left: 125,
          top: 48,
          zIndex: -1,

          transform: {
            rotate: 10,
            scale: 4.5
          }
        };
        result.color = '#F3F3F3';
        return result;
      },

      rightTriangleProps() {
        let result = {};
        result.elemStyle = {
          position: 'absolute',
          right: -200,
          bottom: 10,

          transform: {
            rotate: -105,
            scale: 4
          }
        };
        result.stroke = 10;
        result.solid = false;
        result.opacity = 0.1;
        result.color = '#EE3235';
        return result;
      },

      fetch() {
        this.$getEntries({
          'content_type': 'topics',
          'fields.name': 'home',
          select: 'fields.paragraphs'
        })
          .then((res) => {
            if (res.items.length === 1 && typeof res.items[0].fields.paragraphs !== 'undefined') {
              this.item = res.items[0].fields.paragraphs.filter((p) => p.fields.name === 'scala-home-pitch')[0];
            }
          })
          .finally(() => {
            this.fetched = true;
            this.isVisible = true;
          })
          .catch((err) => {
            console.error(err);
          })

      }
    }
  }
</script>

<style scoped>
    .sc-highlight {
        position: relative;
        height: auto;
        min-height: 300px;
        padding-top: 100px;
        padding-bottom: 50px;
        box-sizing: border-box;
    }

    .sc-highlight .hl-wrapper {
        position: relative;
        width: auto;
        margin: 50px auto 0;
        display: flex;
        justify-content: center;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .sc-highlight .hl-wrapper .hl-column {
        min-width: 320px;
        box-sizing: border-box;
        flex-basis: 0;
        flex-grow: 1;
        margin: 0 64px;
        height: auto;
        position: relative;
    }

    .sc-highlight .hl-wrapper .hl-column p {
        animation: hl-column .5s ease-in-out forwards;
        position: relative;
        z-index: 1;
    }

    @keyframes hl-column {
        from {
            opacity: 0
        }
        to {
            opacity: 1
        }
    }

    .sc-highlight .hl-wrapper .hl-column.title {
        max-width: 360px;
        color: var(--primary-color-bright);
        text-align: right;
        letter-spacing: initial;
    }

    @media only screen and (max-width: 1024px) {
        .sc-highlight {
            height: auto;
        }
        .sc-highlight .hl-wrapper {
            flex-flow: row wrap;
        }
        .sc-highlight .hl-wrapper .hl-column {
            margin: 0;
        }
        .sc-highlight .hl-wrapper .hl-column.title {
            flex-basis: 100%;
            text-align: left;
        }
        .sc-highlight .hl-wrapper .hl-column.middle {
            margin-right: 1em;
        }
        .sc-highlight .hl-wrapper .hl-column.right {
            margin-left: 1em;
        }
    }

    @media only screen and (max-width: 640px) {
        .sc-highlight {
            margin-top: 0;
            padding-top: 0;
            min-height: initial;
        }

        .sc-highlight .hl-wrapper .hl-column {
            min-width: initial;
        }
    }


</style>