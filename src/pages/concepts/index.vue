<template>
    <div class="concepts">
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
                            {{titleBlock ? titleBlock.fields.title : "Concepts"}}
                        </h1>
                        <p class="text" v-if="titleBlock">
                            {{titleBlock.fields.description}}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <sc-cards-list :items="filteredItems" orientation="portrait"></sc-cards-list>

        <sc-bumper v-if="blockOne"
                   :title="blockOne.fields.title"
                   :description="blockOne.fields.description"
                   :image="blockOne.fields.image"
                   :route="$getRoute('contact')"
                    />

        <sc-bullet-points v-if="blockTwo"
                          :title="blockTwo.fields.title"
                          :description="blockTwo.fields.description"
                          :bulletPoints="blockTwo.fields.bulletPoints"
                          style="margin-bottom:5em;" />

        <sc-call-to-action v-if="topic !== undefined && topic.fields.callToAction" :name="topic.fields.callToAction.fields.name"></sc-call-to-action>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  import ScCallToAction from "~/components/sc-call-to-action.vue"
  import ScBulletPoints from "~/components/sc-bullet-points.vue";
  import ScBumper from "~/components/sc-bumper.vue";
  import ScCardsList from "~/components/sc-cards-list.vue";

  export default {
    name: "concepts",
    components: {ScCardsList, ScBumper, ScBulletPoints, ScCallToAction, ScConnector},
    mixins: [mixins.scMetaTopic],

    data() {
      return {
        items: [],
        title: 'Concepts',
        subtitle: '',
        topic: undefined,
        titleBlock: undefined,
        blockOne: undefined,
        blockTwo: undefined
      }
    },

    beforeMount() {
      this.fetchTopic();
      this.fetchConcepts();
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
          'fields.name': this.$options.name.toLowerCase(),
          include: 2
        })
          .then((res) => {
            if (res.items.length > 0) {
              let response = res.items[0];
              this.topic = response;

              if (typeof response.fields !== 'undefined'
                && typeof response.fields.paragraphs !== 'undefined') {

                response.fields.paragraphs.forEach((p) => {
                  if (p.fields.name === "scala-concepts-headertitle") this.titleBlock = p;
                  if (p.fields.name === "scala-concepts-fullservice") this.blockOne = p;
                  if (p.fields.name === "scala-concepts-bulletpoints") this.blockTwo = p;
                })
              }
            }
          })
          .catch((err) => {
            console.error(err);
          })
      },

      fetchConcepts() {
        this.$getEntries({
          content_type: 'solutions',
          'fields.slug[exists]': true,
          'fields.title[exists]': true,
          'fields.solutionType': 'concept',
          select: 'sys.id,fields.title,fields.slug,fields.shortDescription,fields.image'
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
