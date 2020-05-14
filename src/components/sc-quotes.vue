<template>
    <div class="sc-quotes clearfix">
        <div class="wrapper">
            <div class="slider-tracker" v-if="quotes.length > 1">
                <div class="current bold medium">{{quotesCurrent}}</div>
                <div class="total">/{{quotesTotal()}}</div>
            </div>

            <div class="quote-center">
                <div class="slider-nav left" @click="prev()" v-if="quotes.length > 1">
                    <svg class="prev noselect" >
                        <path d="M25 0 L0 25 L25 50" fill="none" stroke-width="2"/>
                    </svg>
                </div>

                <div class="quote bold">
                    {{quotes[currentIndex].fields.quote}}
                </div>

                <div class="slider-nav right" @click="next()" v-if="quotes.length > 1">
                    <svg class="next noselect">
                        <path d="M0 0 L25 25 L0 50" fill="none" stroke-width="2"/>
                    </svg>
                </div>
            </div>

            <div class="quotee">
                <div class="person bold heavy">
                    {{quotes[currentIndex].fields.quotee.split(',')[0]}}
                </div>
                <div class="function">
                    {{quotes[currentIndex].fields.quotee.split(',')[1]}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "sc-quotes",
    props: {
      quotes: {required: true, type: Array }
    },

    data() {
      return {
        currentIndex: 0
      }
    },

    computed: {
      quotesCurrent() {
        let current = this.currentIndex + 1;
        return this.currentIndex < 10 ? ("0" + current) : current;
      }
    },

    methods: {
      quotesTotal() {
        return this.quotes.length < 10 ? ("0" + this.quotes.length) : this.quotes.length;
      },

      next() {
        if (this.quotes.length > 1) {
          if (this.currentIndex + 1 > this.quotes.length -1) {
            this.currentIndex = 0;
          } else {
            this.currentIndex ++;
          }
        }
      },

      prev() {
        if (this.quotes.length > 1) {
          if (this.currentIndex - 1 < 0) {
            this.currentIndex = this.quotes.length - 1;
          } else {
            this.currentIndex --;
          }
        }
      }
    }
  }
</script>

<style scoped>
    .sc-quotes {
        background-image: linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), radial-gradient(rgba(193, 255, 211, .3), rgba(55, 153, 138, .8)),
        url("../assets/images/scala-mesh.jpg");
        background-size: cover;
        padding: 3em 0;
        color: #FFF;
        overflow: hidden;
    }

    .wrapper {
        margin: 0 auto;
        display: flex;
        flex-flow: column;
        width: 800px;
        position: relative;
    }

    .slider-tracker {
        position: relative;
        left: calc(100% - 4em);
        width: fit-content;
        top: 0;
        display: flex;
    }
    .slider-tracker .current {
        font-size: 2em;
    }
    .slider-tracker .total {
        margin-top: -.3em;
    }

    .quote-center {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        margin-bottom: 1em;
        position: relative;
    }

    .quote {
        position: relative;
        text-align: center;
        font-style: italic;
        min-height: 100px;
        /*height: 100px;*/
    }

    .slider-nav {
        width: 1em;
        height: 2em;
        font-size: 2em;
        cursor: pointer;
        transition: all .2s var(--easing);
    }

    .slider-nav:hover {
        transform: scale(1.1);
    }

    .slider-nav svg path {
        transition: all .2s var(--easing);
        stroke: rgba(255,255,255,0.5);
    }

    .slider-nav.dark svg path {
        stroke: rgba(0,0,0,0.5);
    }

    .slider-nav:hover svg path {
        stroke: #FFF;
    }
    .slider-nav.dark:hover svg path {
        stroke: #000;
    }

    .slider-nav.left {
        margin-right: 1em;
    }
    .slider-nav.right {
        margin-left: 1em;
    }

    .quotee {
        text-align: center;
    }

    @media screen and (max-width: 480px) {

        .sc-quotes .wrapper {
            width: initial;
            padding: 0 .5em;
        }

        .sc-quotes .wrapper .quote-center .quote {
            height: initial;
            max-height: initial;
        }
    }

    @media screen and (max-width: 768px) {
        .sc-quotes .wrapper {
            width: initial;
            padding: 0 .5em;
        }

        .sc-quotes .wrapper .quote-center .quote {
            height: initial;
            max-height: initial;
        }
    }

</style>