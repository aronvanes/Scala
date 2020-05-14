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

        <sc-cards-list :items="filteredItems" type="products" :disableClick="true"/>
        <sc-call-to-action v-if="ctaName" :name="ctaName"></sc-call-to-action>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScCardsList from "~/components/sc-cards-list.vue";
  import ScCallToAction from "~/components/sc-call-to-action.vue";

  export default {
    name: "software",
    components: {ScCallToAction, ScCardsList},
    mixins: [mixins.scMetaTopic],

    data() {
      return {
        items: [],
        title: 'software',
        subtitle: '',
        ctaName: undefined
      }
    },

    beforeMount() {
      this.fetchTopic();
      this.fetchSoftware();
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
                  this.title = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-software-headertitle')[0].fields.title;
                  this.subtitle = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-software-headertitle')[0].fields.description;
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

      fetchSoftware() {
        this.$getEntries({
          content_type: 'products',
          'fields.slug[exists]': true,
          'fields.title[exists]': true,
          select: 'sys.id,fields.title,fields.slug,fields.image,fields.shortDescription',
          'fields.type': 'software'
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

<style scoped>

</style>