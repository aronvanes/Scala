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

        <sc-cards-list :items="items" type="events"/>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScCardsList from "~/components/sc-cards-list.vue";

  export default {
    name: "events",
    components: {ScCardsList},
    mixins: [mixins.scMetaTopic],
    data() {
      return {
        items: [],
        title: 'events',
        subtitle: ''
      }
    },

    mounted() {
      this.fetchTopic();
      this.fetchEvents();
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
                this.title = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-events-header')[0].fields.title;
                this.subtitle = response.fields.paragraphs.filter((p) => p.fields.name === 'scala-events-header')[0].fields.description;
              }
            }
          })
          .catch((err) => {
            console.error(err)
          })
      },

      fetchEvents() {
        this.$getEntries({
          content_type: 'events',
          'fields.slug[exists]': true,
          'fields.title[exists]': true,
          "select": "fields.title,fields.startDate,fields.endDate,fields.image,fields.location,fields.slug",
          'fields.visibility': 'Public',
          'order': 'fields.startDate'
        })
          .then((res) => {
            this.items = res.items;
          })
          .catch((err) => {
            console.error(err);
          })
      },


    }
  }
</script>

<style scoped>

</style>