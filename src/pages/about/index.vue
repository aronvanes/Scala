<template>
    <div class="page about" v-if="ready">
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
                            {{pageTitle}}
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <div class="width-container flex f-row title-paragraph" v-if="titleParagraph">
            <sc-triangle v-if="$mq == 'desktop'" v-bind="{
                    stroke: 10,
                    elemStyle: {
                        position: 'relative',
                        transform: {
                            rotate: 135,
                            scale: 3.5,
                        }
                    },
                    opacity: .1,
                    solid:false,
                    left: '200px',
                    top: '100px',
                    color: 'var(--primary-color-bright'
                }">
            </sc-triangle>
            <sc-markitup :content="titleParagraph.fields.description" class="description"></sc-markitup>
            <sc-image :item="titleParagraph" :height="480" class="image"></sc-image>
        </div>

        <div class="width-container clearfix numbers-paragraph">
            <sc-triangle v-if="$mq == 'desktop'" v-bind="{
                    stroke: 10,
                    elemStyle: {
                        position: 'relative',
                        transform: {
                            rotate: 210,
                            scale: 5,
                        }
                    },
                    opacity: .1,
                    right: '10px',
                    top: '100px'
                }">
            </sc-triangle>

            <div class="image" v-if="numbersParagraph">
                <sc-image :item="numbersParagraph" :height="500"></sc-image>
            </div>

            <div class="numbers">
                <sc-paragraph-title :name="numbersParagraph.fields.title"></sc-paragraph-title>
                <div class="flex f-row f-wrap f-between list">
                    <div v-for="bp in numbersParagraph.fields.bulletPoints" class="flex bullet-point">
                        <div class="icon">
                            <img v-if="bp.fields.icon" :src="bp.fields.icon.fields.file.url"/>
                        </div>
                        <div class="value">
                            {{ bp.fields.value }}
                        </div>
                    </div>
                </div>
            </div>
        </div>


        <div class="width-container" v-if="paragraphs.length > 0">

            <div class="paragraphs f-wrap f-between">
                <div class="paragraph" v-for="paragraph in paragraphs">
                    <h3 class="heading">
                        {{paragraph.fields.title}}
                    </h3>
                    <sc-markitup class="description"
                                 :class="{'column-count-2 column-gap-small': $mq === 'desktop'}"
                                 :content="paragraph.fields.description">
                    </sc-markitup>
                </div>
            </div>

            <sc-triangle v-if="$mq == 'desktop'" v-bind="{
                    stroke: 10,
                    elemStyle: {
                        position: 'relative',
                        transform: {
                            rotate: 10,
                            scale: 3.5,
                        }
                    },
                    opacity: .1,
                    solid:false,
                    right: '400px',
                    top: '200px'
                }">

            </sc-triangle>
        </div>

        <sc-call-to-action v-if="ctaName" :name="ctaName" style="margin-top: 4em;"></sc-call-to-action>
    </div>
</template>

<script>
  import ScCallToAction from "~/components/sc-call-to-action.vue";
  import {mixins} from "sc-utils"

  export default {
    name: "about",
    components: {ScCallToAction},
    mixins: [mixins.scMetaTopic],

    data() {
      return {
        ready: false,
        titleParagraph: undefined,
        numbersParagraph: undefined,
        paragraphs: [],
        ctaName: undefined
      }
    },

    mounted() {
      this.fetchTopic();
    },

    computed: {
      pageTitle() {
        let title = this.$store.getters.translation('general.about-us');
        if (this.titleParagraph) title = this.titleParagraph.fields.title;
        return title
      }
    },

    methods: {
      fetchTopic() {
        this.$getEntries({
          content_type: 'topics',
          'fields.name': 'about',
          include: 2
        })
          .then((res) => {
            if (res.items.length > 0) {
              let topic = res.items[0];

              if (topic.fields.paragraphs) {
                topic.fields.paragraphs.forEach((p) => {
                  if (p.fields.name === 'scala-about-title') {
                    this.titleParagraph = p;

                  } else if (p.fields.name === 'scala-about-numbers') {
                    this.numbersParagraph = p;

                  } else {
                    this.paragraphs.push(p);
                  }
                })
              }

              if (topic.fields.callToAction) {
                this.ctaName = topic.fields.callToAction.fields.name;
              }
            }
          })
          .then(() => {
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
    .title-paragraph .description {
        flex: 1;
        position: relative;
        display: block;
        padding: 4em;
    }

    .title-paragraph .image {
        flex: 1.5;
        transform: translateY(-14em);
        height: 400px;
        margin: 0 2em;
    }

    .numbers-paragraph {
        width: 100%;
        margin-bottom: 4em;
    }

    .numbers-paragraph .image {
        position: relative;
        float: left;
        width: 70%;
        height: 500px;
    }

    .numbers-paragraph .numbers {
        background-color: var(--primary-color-dark);
        color: #FFF;
        float: right;
        box-sizing: border-box;
        padding: 2em;
        width: 50%;
        position: relative;
        margin-top: -20em;
    }

    .numbers .list {
        padding: 0 2em;
    }

    .bullet-point {
        width: 45%;
        margin: 1em 0;
    }

    .bullet-point .icon {
        display: block;
        width: 50px;
        min-width: 50px;
        max-width: 50px;
        margin-right: 1.5em;
    }

    .paragraphs {
        margin: 5em 5em 0;
        display: flex;
        align-items: flex-start;

    }

    .paragraphs .paragraph {
        position: relative;
        max-width: 45%;
        margin-bottom: 4em;
    }

    .paragraphs .paragraph .title {
        color: #333;
        font-size: 1.4em;
        font-weight: 500;
        position: relative;
        margin-bottom: 0.8em;
    }

    @media only screen and (max-width: 768px) {

        .index-header {
            height: auto;
            min-height: 200px;
        }

        .title-paragraph {
            margin: 2em 0;
            flex-flow: column-reverse;
        }

        .title-paragraph .description {
            padding: 2em 1em 0;
        }

        .title-paragraph .image {
            transform: initial;
            margin: 0;
        }

        .numbers-paragraph {
            width: 100%;
        }

        .numbers-paragraph .image {
            position: relative;
            width: 90%;
            height: 500px;
            left: 5%;
        }

        .numbers-paragraph .numbers {
            float: right;
            box-sizing: border-box;
            padding: 2em;
            width: 100%;
            position: relative;
            margin-top: -30em;
        }

        .numbers .list {
            padding: 0 2em;
        }

        .bullet-point {
            width: 45%;
            margin: 1em 0;
        }

        .paragraphs {
            margin: 0 2em;
        }

    }

    @media only screen and (max-width: 480px) {
        .numbers .list {
            flex-flow: column;
        }

        .bullet-point {
            width: 100%;
            margin: 1em 0;
        }

        .paragraphs {
            display: block;
        }
        .paragraphs .paragraph:nth-child(1n) {
            margin: 0 0 2em 0;
            max-width: 100%;
        }
        .paragraphs .paragraph:last-child {
            margin-bottom: initial;
        }
    }
</style>