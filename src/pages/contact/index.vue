<template>
    <div class="contact page" v-if="ready">
        <div class="index-header">
            <div class="width-container" style="display:flex; flex-flow: row;justify-content: space-between; align-items:center;">
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
                            {{contactTitle.fields.title}}
                        </h1>
                    </div>
                </div>
            </div>
        </div>

        <div class="width-container flex f-row f-between form-offices">
            <div class="offices flex f-column">
                <sc-paragraph-title :name="$store.getters.translation('general.offices')"></sc-paragraph-title>

                <div class="region" v-for="region in addresses">
                    <h3 class="heading flex f-row f-between" @click="visibleOffices = region.region">
                        <span>{{region.region}}</span>
                        <span class="chevron" :class="{active: visibleOffices === region.region}"></span>
                    </h3>

                    <div class="list" v-if="visibleOffices.includes(region.region)">
                        <div class="office" v-for="office in region.offices">
                            <p class="name">{{office.title}}</p>
                            <sc-markitup :content="office.address"></sc-markitup>
                            <p v-if="office.phone"> P: {{office.phone}}</p>
                            <p v-if="office.fax"> F: {{office.fax}}</p>
                            <p v-if="office.email"> E: {{office.email}}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="form-wrapper drop-shadow low">
                <sc-triangle v-if="$mq === 'desktop'" v-bind="{
                    stroke: 10,
                    elemStyle: {
                        position: 'absolute',
                        transform: {
                            rotate: 576,
                            scale: 3.5,
                        }
                    },
                    solid: false,
                    right: '10px',
                    top: '500px',
                    opacity: .25
                }">
                </sc-triangle>
                <sc-form v-if="topic" :item="topic.fields.form" hideTitle hideDescription></sc-form>
            </div>
        </div>

        <div class="width-container clearfix" v-if="$mq !== 'phone'">
            <sc-triangle v-if="$mq === 'desktop'" v-bind="{
                    stroke: 10,
                    elemStyle: {
                        position: 'relative',
                        transform: {
                            rotate: 81,
                            scale: 5,
                        }
                    },
                    opacity: .1,
                    solid: false,
                    left: '300px',
                    color: 'var(--primary-color-bright)'
                }">

            </sc-triangle>
            <div class="map drop-shadow low">
                <sc-image :item="contactTitle" :height="540"></sc-image>
            </div>
        </div>

        <div class="width-container flex f-row support-forum">
            <div v-if="supportParagraph" class="support">
                <sc-paragraph-title :name="supportParagraph.fields.title"></sc-paragraph-title>
                <sc-markitup :content="supportParagraph.fields.description"></sc-markitup>
            </div>

            <sc-triangle v-if="$mq !== 'phone'" v-bind="{
                    stroke: 10,
                    elemStyle: {
                        position: 'absolute',
                        transform: {
                            rotate: 15,
                            scale: 3.5,
                        }
                    },
                    left: '50%',
                    top: '100px',
                    opacity: .1
                }">
            </sc-triangle>

            <div v-if="forumParagraph" class="forum">
                <sc-paragraph-title :name="forumParagraph.fields.title"></sc-paragraph-title>
                <sc-markitup :content="forumParagraph.fields.description"></sc-markitup>
            </div>
        </div>
    </div>
</template>

<script>
  import {mixins} from 'sc-utils'
  import ScConnector from "~/components/sc-design-elements/sc-connector.vue";
  import ScCallToAction from "~/components/sc-call-to-action.vue";

  export default {
    name: "Contact",
    components: {ScConnector, ScCallToAction},
    mixins: [mixins.scMetaTopic],

    data() {
      return {
        items: [],
        addresses: [],
        visibleOffices: [],
        title: this.$store.getters.translation('general.contact'),

        contactTitle: undefined,
        supportParagraph: undefined,
        forumParagraph: undefined,
        ready: false,

      }
    },
    beforeMount() {
      this.fetchTopic();
      this.fetchContacts();
    },

    computed: {
      filteredItems() {
        return [...new Set(this.items.map(i => i.fields.region))]
      },
    },
    methods: {
      fetchTopic() {
        this.$getEntries({
          content_type: 'topics',
          'fields.name': 'contact',
          include: 2
        })
          .then((res) => {
            if (res.items.length > 0) {
              let response = res.items[0];
              this.topic = response;

              if (response.fields.paragraphs) {
                this.contactTitle = response.fields.paragraphs.find(p => p.fields.name === 'scala-contact-title');
                this.supportParagraph = response.fields.paragraphs.find(p => p.fields.name === 'scala-contact-support');
                this.forumParagraph = response.fields.paragraphs.find(p => p.fields.name === 'scala-contact-forum');
              }
            }

          })
          .then(() => {
            setTimeout(() => {
              this.ready = true;
            },100)

          })
          .catch((err) => {
            console.error(err);
          })
      },

      fetchContacts() {
        this.$getEntries({
          content_type: 'contacts',
          'fields.title[exists]': true,
          'fields.region[exists]': true
        })
          .then((res) => {
            this.items = res.items;

            let addresses = [];

            /*
             * Format office addresses.
             */
            if (res.items.length > 0) {

              res.items.forEach((i) => {

                let region = i.fields.region;
                let parent = addresses.find(a => a.region === region);

                if (parent) {
                  parent.offices.push(i.fields);
                } else {
                  parent = {region: region, offices: [i.fields]};
                  addresses.push(parent);
                }
              })
            }

            addresses = addresses.sort((a, b) => (a.region > b.region) ? 1 : -1);

            let usIndex = addresses.findIndex(a => a.region.toLowerCase() === 'united states');
            if (usIndex !== -1) {
              let first = addresses.splice(usIndex)[0];
              addresses.unshift(first);
            }

            this.addresses = addresses;
            this.visibleOffices = this.addresses[0].region
          })
          .catch((err) => {
            console.error(err);
          })
      }
    }
  }
</script>

<style scoped>

    .offices {
        background-color: var(--primary-color-dark);
        color: #FFF;
        padding: 3em;
        flex: 1;
        margin: 3em 3em 3em 0;
    }

    .offices .region {
        margin-bottom: 2em;
    }

    .region .heading {
        cursor: pointer;
    }

    .list .office {
        margin-bottom: 2em;
    }

    .list .office:last-child {
        margin-bottom: initial;
    }

    .form-wrapper {
        flex: 1;
        flex-grow: 0;
        margin: -175px 0 0 6em;
        height: fit-content;
        width: fit-content;
    }

    .map {
        float: right;
        width: 60%;
        transform: translateY(-6em);
    }

    .support-forum {
        margin-bottom: 3em;
    }

    .forum, .support {
        flex: 1;
    }

    @media screen and (max-width: 768px) {

        .index-header {
            height: auto;
            min-height: 200px;
        }

        .form-offices {
            flex-flow: column-reverse;
        }

        .offices {
            width: 100%;
            padding: 3em;
            box-sizing: border-box;
            flex: 1;
            margin: initial;
        }

        .offices .paragraph {
            margin-bottom: 2em;
        }

        .form-wrapper {
            margin: -4em 0 4em;
        }

        .map {
            transform: initial;
            margin: 2em 0;
            width: 100%;
        }

        .support-forum {
            margin: 3em 0;
            padding: 0 2em;
            box-sizing: border-box;
            flex-wrap: wrap;
        }

    }

    @media screen and (max-width: 480px) {
        .support-forum {
            flex-flow: column;
        }

        .forum {
            margin-top: 2em;
        }
    }

</style>