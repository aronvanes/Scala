<template>
    <div>
        <div class="index-header">
            <div class="width-container"
                 style="display:flex; flex-flow: row;justify-content: center; align-items:center;">
                <h1 class="heading bold heavy">404</h1>
            </div>
        </div>
        <div class="width-container">
            <sc-call-to-action v-if="ctaName" :name="ctaName"></sc-call-to-action>
        </div>
    </div>
</template>

<script>
  import ScCallToAction from "~/components/sc-call-to-action.vue";
  export default {
    name: "FourOhFour",
    components: {ScCallToAction},
    data() {
      return {
        ctaName: undefined
      }
    },

    mounted() {
      this.fetch()
    },
    methods: {
      fetch() {
        this.$getEntries({
          content_type: 'topics',
          'fields.name': '404',
          select: 'fields.callToAction'
        })
          .then((res) => {
            if (res.items.length === 1) {
              if (res.items[0].fields.callToAction) {
                this.ctaName = res.items[0].fields.callToAction.fields.name;
              } else {
                throw new Error("No Call to Action present");
              }
            } else {
              throw new Error("Topic not found.");
            }
          })
          .catch((err) => {
            console.error(err)
          })
      }
    }
  }
</script>

<style scoped>

</style>