<template>
    <div class="recent-posts">
        <div class="post" v-for="item in items"
             v-if="current.fields && current.fields.slug !== item.fields.slug.fields.slug">
            <div class="title bold" @click="$router.push($getRoute(item.fields.slug))">
                {{item.fields.title}}
            </div>
            <div class="publication-date">
                {{localisedDate(item)}}
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "sc-news-recent-posts",
    props: {
      current: {
        type: Object,
      }
    },

    data() {
      return {
        items: null,
      }
    },

    mounted() {
      this.fetch();
    },

    methods: {
      fetch() {
        this.$getEntries({
          content_type: 'news',
          'fields.slug[exists]': true,
          'fields.title[exists]': true,
          // 'fields.image[exists]': true,
          select: 'sys.id,fields.title,fields.slug,fields.startDate',
          limit: 5,
          order: '-fields.startDate',
          'fields.startDate[lte]': moment().toJSON()
        })
          .then((res) => {
            this.items = res.items;
          })
          .catch((err) => {
            console.error(err);
          })
      },

      localisedDate(item) {
        let options = {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        };
        return new Date(item.fields.startDate).toLocaleDateString(this.$store.getters.getLocaleIso(), options);
      },
    }
  }
</script>

<style scoped>
    .post {
        display: flex;
        padding: 1em 2em;
        align-items: center;
        position: relative;
        cursor: pointer;
    }

    .post::before {
        pointer-events: none;
        content: '';
        position: absolute;
        left: 50%;
        right: 50%;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.0);
        transition-property: left, right, background;
        transition-duration: 0.5s;
        transition-timing-function: var(--easing);
    }

    .post:hover::before {
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.05);
    }

    .post::after {
        content: '';
        background: rgba(0, 0, 0, 0.1);
        height: 1px;
        position: absolute;
        bottom: 0;
        left: 20%;
        right: 20%;
    }

    .post:last-child::after {
        display: none;
    }

    .post .title {
        flex: 2;
        font-size: 1em;
    }

    .post .publication-date {
        flex: 1;
        text-align: right;
    }

    @media only screen and (max-width: 768px) {
        .post {
            flex-direction: column;
            align-items: flex-start;
        }
    }
</style>