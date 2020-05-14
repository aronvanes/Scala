<template>
    <div id="sc-page" class="fill-content" v-if="ready">
        <sc-hero></sc-hero>
        <sc-highlight></sc-highlight>
        <sc-news :topicInfo="paragraphs.filter((p) => p.fields.name === 'scala-home-news')[0]"></sc-news>
        <sc-upcoming-events :title="sueTitle()"></sc-upcoming-events>
        <sc-call-to-action v-if="ctaName" :name="ctaName"></sc-call-to-action>
    </div>
</template>

<script>
  import ScHero from '~/components/sc-hero.vue'
  import ScHighlight from '~/components/sc-highlight.vue'
  import ScNews from '~/components/sc-news.vue'
  import ScUpcomingEvents from '~/components/sc-upcoming-events.vue'
  import ScCallToAction from "~/components/sc-call-to-action.vue";
  import {mixins} from 'sc-utils'

  export default {
    name: 'home',
    mixins: [mixins.scMetaTopic],
    components: {ScCallToAction, ScHero, ScNews, ScHighlight, ScUpcomingEvents},
    data() {
      return {
        ready: false,
        paragraphs: [],
        ctaName: undefined
      }
    },

    created() {
      this.fetch();
    },

    methods: {
      sueTitle () {
        let title = undefined;
        let p = this.paragraphs.filter((p) => p.fields.name === 'scala-home-upcoming-events' );
        if (p.length === 1) {
          title = p[0].fields.title;
        }
        return title;
      },

      fetch() {
        this.$getEntries({
          content_type: 'topics',
          'fields.name': 'home',
          select: ['fields.paragraphs', 'fields.callToAction']
        })
          .then((res) => {
            this.paragraphs = res.items[0].fields.paragraphs;
            if (res.items[0].fields.callToAction) {
              this.ctaName = res.items[0].fields.callToAction.fields.name;
            }
            this.ready = true;
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  }
</script>
