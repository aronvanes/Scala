<template>
    <div v-if="ready">
        <video crossorigin playsinline muted autoplay id="video-player" width="100%" height="100%">
            <source :src="source.fields.video.fields.file.url" type="video/mp4">
            <track v-for="track in translations" :key="track.srclang" :src="track.src" :srclang="track.srclang"
                   :label="track.label">
        </video>
    </div>
</template>

<script>

  import Plyr from 'plyr';

  export default {
    name: 'sc-video',
    props: {
      'source': {required: true, type: Object}
    },

    data() {
      return {
        subtitles: [],
        title: '',
        url: '',
        player: {},
        translations: [],
        ready: false,
      }
    },

    created() {
      if (this.source.fields.hasOwnProperty('subtitle')) {
        this.addSubtitle(this.source.fields.subtitle.fields.file, this.$store.getters.getLocaleIso());
        this.fetchAdditionalSubtitles();
      } else {
        this.setPlayer();
      }
    },

    mounted() {
      console.log(this.source);
    },

    methods: {

      setPlayer() {
        this.ready = true;
        setTimeout(() => {
          this.player = new Plyr('#video-player', {
            tooltips: {
              controls: true
            },
          });
        })
      },

      fetchAdditionalSubtitles() {
        this.$getAsset(this.source.fields.subtitle.sys.id, {
          locale: '*'
        })
          .then((res) => {
            if (res.data.fields !== 'undefined') {
              if (res.data.fields.file !== 'undefined') {
                for (let key in res.data.fields.file) {
                  this.addSubtitle(res.data.fields.file[key], key);
                }
              }
            }
          })
          .finally(() => {
            console.log("getting here?");
            this.setPlayer();
          })
          .catch((err) => {
            console.error(err);
          })
      },

      addSubtitle(subtitle, lang) {
        let exists = this.translations.find((t) => t.srclang === lang);

        if (!exists) {
          this.translations.push({
            label: subtitle.fileName,
            src: subtitle.url,
            srclang: lang,
            kind: 'subtitles'
          })
        }

        console.log("MY SUBTITLES", this.translations)
      }
    }

  }

</script>

<style src="../css/plyr.css"></style>
