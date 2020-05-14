<template>
    <div class="casestudies">
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

        <sc-cards-list :items="filteredItems" type="news" />
        <sc-call-to-action v-if="ctaName" :name="ctaName"/>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  import ScCallToAction from "~/components/sc-call-to-action.vue"
  import ScCardsList from "~/components/sc-cards-list.vue";

  export default {
    name: "news",
    components: {ScCardsList, ScCallToAction, ScConnector},
    mixins: [mixins.scMetaTopic],
    data() {
      return {
        items: [],
        title: 'news',
        subtitle: '',
        ctaName: undefined
      }
    },

    beforeMount() {
      this.fetchTopic();
      this.fetchNews();
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
          select: 'fields.paragraphs,fields.callToAction'
        })
          .then((res) => {
            if (res.items.length > 0) {
              let response = res.items[0];
              if (typeof response !== 'undefined') {
                if (typeof response.fields.paragraphs !== 'undefined') {
                  this.title = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-news-headertitle')[0].fields.title;
                  this.subtitle = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-news-headertitle')[0].fields.description;
                }

                if (typeof response.fields.callToAction !== 'undefined') {
                  this.ctaName = response.fields.callToAction.fields.name;
                }
              }
            }
          })
          .catch((err) => {
            console.error(err);
          })
      },

      fetchNews() {
        this.$getEntries({
          content_type: 'news',
          'fields.slug[exists]': true,
          'fields.title[exists]': true,
          order: '-fields.startDate',
          'fields.startDate[lte]': moment().toJSON(),
          select: 'sys.id,fields.title,fields.slug,fields.image,fields.shortDescription,fields.startDate'
        })
          .then((res) => {
            this.items = res.items;
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  }
</script>
