<template>
    <div class="paragraph" v-if="typeof name !== 'undefined'">
        <div class="title-wrap" :style="wrapperStyle()">
            <sc-connector v-if="$mq === 'desktop'"
                          v-bind="{
                        direction: direction,
                        length: length,
                        connectorStyle: connectorStyle()
                      }"></sc-connector>

            <div>
                <h1 v-if="first" class="heading bold medium">
                    {{name}}
                </h1>

                <h2 v-else class="heading bold medium">
                    {{name}}
                </h2>
                <sc-connector v-if="$mq !== 'desktop' && subtitle"
                              v-bind="{
                        direction:'horizontal',
                        length: length,
                        connectorStyle: {
                        position: 'relative',
                          height: '4px',
                          top: '-14px',
                          left: '-48px',
                        }
                      }"></sc-connector>
                <p class="subtitle" v-if="subtitle">{{subtitle}}</p>
            </div>

            <sc-connector v-if="$mq !== 'desktop' && !subtitle"
                          v-bind="{
                        direction:'horizontal',
                        length: length,
                        connectorStyle: {
                        position: 'relative',
                          height: '4px',
                          top: '8px',
                          left: '-48px',
                        }
                      }"></sc-connector>
        </div>
    </div>
</template>

<script>
  export default {
    name: "sc-paragraph-title",
    props: {
      name: {
        required: true,
        validator: (value) => {
          return ['string', 'undefined'].includes(typeof value);
        }
      },
      length: {type: Number, required: false, default: 80},
      direction: {type: String, required: false, default: 'horizontal'},
      position: {
        // Only used for direction === 'vertical'
        type: String, required: false, default: 'top', validator: (value) => {
          if (['top', 'bottom'].indexOf(value) === -1) {
            console.warn("Position must be top or bottom");
            return false
          }
          return true;
        },
      },
      first: {type: Boolean, required: false, default: false},
      subtitle: {type: String, required: false}

    },

    methods: {
      wrapperStyle() {
        let style = {};
        if (this.$mq === 'desktop' && this.direction === 'horizontal') {
          style.marginLeft = `${this.length + 16}px`;
        }
        return style;
      },

      connectorStyle() {
        let style = {
          position: 'absolute',
          height: '4px',
        };

        if (this.direction === 'horizontal') {
          style.left = (this.length + 16) * -1 + 'px';
          style.top = this.$mq === 'desktop' ? '16px' : '10px';

        } else {
          style.left = "1.8em";


          let addedDistance = this.position === 'top' ? 3 : 2;
          if (this.$mq !== 'desktop') {
            addedDistance = this.position === 'top' ? 5 : 4;
          }

          let diff = this.length - 80;

          style[this.position] = `calc(calc(-100% - ${addedDistance}em) - ${diff}px)`;
        }

        return style;
      }
    }
  }
</script>

<style scoped>
    .paragraph {
        display: flex;
        flex-direction: column;
        margin: 12px 0;
    }

    .paragraph .title-wrap {
        display: flex;
        flex-flow: row;
        position: relative;
    }

    .paragraph .title-wrap {
        color: currentColor;
    }

    .paragraph .title {
        font-size: 1.1em;
        position: relative;
    }

    .paragraph .subtitle {
        margin-top: -1em;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .paragraph {
            margin: 0 0 1em;
        }

        .paragraph .title-wrap {
            flex-flow: column;
        }

        .paragraph h1 {
            margin-bottom: 1em;
        }
    }
</style>