<template>
    <div v-if="ready">
        <div class="index-header">
            <div class="width-container" style="display:flex; flex-flow: row;justify-content: space-between; align-items:center;">
                <sc-paragraph-title :name="$store.getters.translation('general.privacy-policy')" first></sc-paragraph-title>
            </div>
        </div>
        <div class="width-container">
            <div class="paragraphs f-wrap f-between">
                <div class="paragraph" v-for="paragraph in paragraphs">
                    <h3 class="heading">
                        {{paragraph.fields.title}}
                    </h3>
                    <sc-markitup class="description"
                                 :content="paragraph.fields.description">
                    </sc-markitup>
                </div>
            </div>
        </div>

        <sc-call-to-action v-if="ctaName" :name="ctaName"></sc-call-to-action>
    </div>
</template>

<script>
  import ScCallToAction from "~/components/sc-call-to-action.vue";
  export default {
    name: "privacy-policy",
    components: {ScCallToAction},

    data() {
      return {
        ready: false,
        paragraphs: [],
        ctaName: undefined
      }
    },

    mounted() {
      this.fetchTopic();
    },

    methods: {
      fetchTopic() {
        this.$getEntries({
          'content_type': 'topics',
          'fields.name': 'privacy-policy',
          select: 'fields.paragraphs,fields.callToAction'
        })
          .then((res) => {
            if (res.items.length > 0) {
              this.paragraphs = res.items[0].fields.paragraphs || [];

              if (res.items[0].fields.callToAction) {
                this.ctaName = res.items[0].fields.callToAction.fields.name;
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

    .index-header {
        height: 200px;
        padding-top: 4em;
    }

    .paragraphs {
        margin: 2em 0 0;
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

        .paragraphs {
            margin: 2em 2em 0;
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