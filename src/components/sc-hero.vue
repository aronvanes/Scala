<template>
    <div class="sc-hero"
         :style="{height: $mq !== 'phone'? componentHeight + 'px' : 'auto'}"
         v-observe-visibility="{
            callback: visibilityChanged,
            once: true,
        }">
        <!-- VIDEO -->
        <div class="video-player" ref="videoPlayer" :style="{top: '-'+ heightOffset + 'px', height: videoHeight + 'px'}"
             :class="{fade: videoFade === true}">
            <video id="video-player" crossorigin playsinline muted></video>
        </div>

        <!-- TAGLINE -->
        <div class="tagline-wrapper" v-if="hero_item.fields">
            <div class="tagline-text" v-if="hero_item.fields.taglineText">
                <template v-if="hero_item.fields.taglineLink">
                    <router-link :to="$getRoute(hero_item.fields.taglineLink.fields.slug)" class="text link">
                        {{hero_item.fields.taglineText}}
                    </router-link>
                </template>
                <div v-else class="text">
                    {{hero_item.fields.taglineText}}
                </div>
            </div>
            <div class="tagline-button-wrap" v-if="hero_item.fields.taglineButtonText && hero_item.fields.taglineLink">
                <router-link class="button" :to="$getRoute(hero_item.fields.taglineLink.fields.slug)">
                    {{hero_item.fields.taglineButtonText}}
                </router-link>
            </div>
        </div>

        <!-- OVERLAY -->
        <div class="overlay" :style="{height:componentHeight+ 'px'}"></div>

        <!-- HERO INFO BLOCK -->
        <!-- MOBILE -->
        <div class="video-info-wrapper-mobile width-container" v-if="$mq === 'phone' && displayHeroInfoWrapper">
            <h1 class="heading upper bold heavy" :key="`videoInfoTitle_${hero_item.fields.name}`">
                {{hero_item.fields.item.fields.title}}
            </h1>
            <router-link :key="`videoInfoButton_${hero_item.fields.name}`" :to="$getRoute('concepts')"
                         class="button text-button dark">{{ $store.getters.translation('buttons.view-more') }}
            </router-link>
        </div>

        <!-- DESKTOP -->
        <div class="video-info-wrapper width-container" v-else-if="displayHeroInfoWrapper && $mq !== 'phone'">
            <!-- UP NEXT LIST -->
            <transition name="hero-ltr" appear v-if="displayUpNext">
                <div class="video-items" v-if="item_titles.length > 1">
                    <h4 class="heading bold title playing">
                        {{ $store.getters.translation('general.playing-now') }}:
                    </h4>
                    <!-- UP NEXT LIST ITEMS-->
                    <transition-group name="hero-ttb" tag="ul">
                        <li v-for="(item, index) in item_titles"
                            class="title"
                            :class="{'now': index === 0}"
                            @click="nextHero(item.title)"
                            :key="item.id">
                            <h3 class="heading bold" v-if="index === 0">{{item.title}}</h3>
                            <h4 class="heading" v-else>{{item.title}}</h4>
                        </li>
                    </transition-group>

                    <!-- CURRENT PROGRESS BAR -->
                    <transition name="hero-ltr" appear v-if="displayProgression">
                        <div :class="progressBarClass()">
                            <svg width="88" height="6">
                                <path d="M0 0 L88 0" stroke="#2B2E37" stroke-width="6" fill="none"/>
                                <path class="progress-bar" d="M0 0 L88 0" stroke="white" stroke-width="6" fill="none"
                                      stroke-dashoffset="88" stroke-dasharray="88"
                                      :style="{animationDuration: videoLength+'s'}"/>
                            </svg>
                        </div>
                    </transition>
                </div>
            </transition>

            <!-- CURRENT INFO -->
            <sc-expanding-container>
                <div class="video-info" :key="`videoInfo_${hero_item.fields.name}`"
                     v-if="Object.keys(hero_item).length > 0 && typeof hero_item.fields.item !== 'undefined'"
                     ref="video-info">
                    <div class="wrapper"
                         :key="`videoInfoButton_${hero_item.fields.name}`"
                         @click="getLink">
                        <!--<h2 class="heading upper bold heavy" :key="`videoInfoTitle_${hero_item.fields.name}`">-->
                        <!--{{ hero_item.fields.item.fields.title }}-->
                        <!--</h2>-->
                        <!--<sc-expanding-container>-->
                        <div class="f-grow text bold" :key="`videoInfoDesc_${hero_item.fields.name}`">
                            {{ hero_item.fields.item.fields.shortDescription ||
                            hero_item.fields.item.fields.introduction }}
                        </div>
                        <!--</sc-expanding-container>-->
                        <div class="button text-button dark">
                            {{$store.getters.translation('buttons.view-more') }}
                        </div>
                    </div>
                </div>
            </sc-expanding-container>
        </div>
        <!-- HERO INFO END -->
    </div>
</template>

<script>

  import Plyr from 'plyr';
  import ScExpandingContainer from "~/components/sc-expanding-container.vue";

  export default {
    name: 'sc-hero',
    components: {ScExpandingContainer},
    data() {
      return {
        expanded: false,
        componentHeight: 0,
        heightOffset: 0,
        hero_items: [],
        current: 0,
        hero_item: {},
        videoFile: {},
        videoOffset: 0,
        videoHeight: 'auto',
        videoLength: 0,
        videoFade: false,
        videoPlaying: false,
        videoPaused: false,
        clearance: 0,
        displayHeroInfoWrapper: false,
        displayHeroInfo: false,
        displayUpNext: false,
        displayProgression: false,
        initialLoadFinished: false,
        playerInitialized: false
      }
    },

    mounted() {
      this.$nextTick(() => {
        this.initPlayer();

        this.setHeight();
        this.$events.$on('resize-event', this.setHeight);
        this.$events.$on('window-visible', this.visibilityChanged);
        this.fetch();
      });
    },


    computed: {
      item_titles() {
        let result = [];

        if (this.hero_items.length > 0) {
          this.hero_items.forEach((item) => {
            result.push({title: item.fields.name, id: item.sys.id})
          });

          let currentItemTitle = this.hero_items[this.current].fields.name;
          let selectedIndex = result.findIndex((item) => item.title === currentItemTitle);

          for (let i = 0; i < selectedIndex; i++) {
            result.push(result.shift())
          }
        }

        return result;
      },
    },

    methods: {
      getLink() {
        this.$router.push(this.$getRoute(this.hero_item.fields.item.fields.slug));
      },

      visibilityChanged(isVisible, entry) {
        if (Object.keys(this.hero_item).length > 0) {
          if (this.isVideoPresent()) {
            this.videoPaused = isVisible;
            if (this.playerInitialized) {
              if (this.videoPaused) {
                this.player.play();
              } else {
                this.player.pause();
              }
            }
          }
        }
      },

      progressBarClass() {
        let barClass = 'video-progression';
        if (this.videoPlaying) {
          barClass += ' playing';
          if (this.videoPaused) {
            barClass += ' paused';
          }
        }
        return barClass;
      },

      setHeight() {
        let max = window.innerHeight * .8;
        this.componentHeight = this.ratio('height');

        if (this.componentHeight > max) {
          let diff = this.componentHeight - max;
          this.componentHeight = max;
          this.heightOffset = diff / 2;
          this.videoHeight = max + this.heightOffset;

        } else {
          this.videoHeight = this.componentHeight;
          this.heightOffset = 0;
        }

        if (this.$mq !== 'phone') {
          // this.fetch();
          this.displayHeroInfoWrapper = false;
        }
      },

      ratio(dimension) {
        let ratioMultiplier = 9 / 16;
        let value = 0;

        if (dimension === 'height') {
          value = document.documentElement.clientWidth * ratioMultiplier;
        } else {
          value = window.innerWidth;
        }

        return value;
      },

      nextHero(title) {
        if (typeof title === "undefined") {
          if (this.current === (this.hero_items.length - 1)) {
            title = this.hero_items[0].fields.name;
          } else {
            title = this.hero_items[this.current + 1].fields.name;
          }
        }

        this.hero_item = this.hero_items.find((item) => item.fields.name === title);
        this.current = this.hero_items.indexOf(this.hero_item);
        this.videoFile = this.hero_item.fields.video;
        this.changePlayerSource(this.videoFile.fields.video.fields.file.url);
      },

      isVideoPresent() {
        let isPresent = typeof this.hero_item !== 'undefined'
          && typeof this.hero_item.fields !== 'undefined'
          && typeof this.hero_item.fields.video !== 'undefined'
          && typeof this.hero_item.fields.video !== 'undefined'
          && typeof this.hero_item.fields.video.fields.video !== 'undefined'
          && typeof this.hero_item.fields.video.fields.video.fields.file !== 'undefined';

        if (isPresent && !this.playerInitialized) {
          this.initPlayer();
        }

        return isPresent;
      },

      changePlayerSource(url) {
        this.videoPlaying = false;
        this.videoFade = true;
        setTimeout((e) => {
          this.videoFade = false;
        }, 600);
        setTimeout((e) => {
          if (this.playerInitialized) {
            this.player.stop();
            this.player.source = {
              type: 'video',
              sources: [{
                src: url, type: 'video/mp4'
              }]
            };
            if (this.initialLoadFinished && this.isVideoPresent()) {
              this.player.play();
            }
          }
        }, 300);
      },

      initPlayer() {
        this.playerInitialized = true;
        console.log('initializing player');
        this.player = new Plyr('#video-player', {
          controls: [],
          autoplay: false,
        });

        this.player.on('playing', () => {
          console.log('playing');
          this.videoPaused = false;
        });

        this.player.on('pause', () => {
          console.log('paused');
          this.videoPaused = true;
        });

        this.player.on('ended', () => {
          console.log('ended');
          this.nextHero()
        });

        this.player.on('timeupdate', () => {
          this.videoLength = this.player.duration;
          this.videoPaused = false;
          this.videoPlaying = true;
        });
      },

      fetch() {
        this.$getEntries(
          {
            'content_type': 'promotions',
            'fields.title': 'scala-home-hero',
            'include': 3,
            select: 'fields.items',
          })
          .then((res) => {
            if (res.items.length === 1) {
              let now = new moment();

              let items = res.items[0].fields.items.filter((item) => {
                let startDate = new moment(item.fields.startDate);
                let endDate = new moment(item.fields.endDate);
                return now.isAfter(startDate) && now.isBefore(endDate) && item.fields.item && item.fields.video;
              });

              if (this.$mq === 'phone') {
                this.hero_items.push(items[0]);
              } else {
                this.hero_items = items;
              }

              if (this.hero_items.length > 0) {
                this.hero_item = this.hero_items[0];
                if (this.isVideoPresent()) {
                  this.changePlayerSource(this.hero_item.fields.video.fields.video.fields.file.url);
                }
                this.renderInfoWithDelay();
              }
            } else {
              throw('scala-home-hero is missing or there are duplicate promotions.');
            }
          })
          .catch((err) => {
            console.error(err);
          });
      },

      renderInfoWithDelay() {
        if (this.$mq === 'phone') {
          this.displayHeroInfoWrapper = true;
          this.initialLoadFinished = true;

        } else {

          setTimeout(() => {
            this.displayHeroInfoWrapper = true;

            setTimeout(() => {
              this.displayHeroInfo = true;
            }, 600);

            setTimeout(() => {
              this.displayUpNext = true;
            }, 700);

            setTimeout(() => {
              this.displayProgression = true;
              if (this.playerInitialized && this.isVideoPresent()) {
                this.player.play();
              }

              setTimeout(() => {
                this.initialLoadFinished = true;
                this.expanded = true;
              }, 500)

            }, 800);

          }, 1500);
        }
      }
    }
  }
</script>

<style src="../css/plyr.css"></style>

<style scoped>
    .sc-hero {
        position: relative;
        margin-bottom: 48px;
        height: 80%;
    }

    .sc-hero .overlay {
        position: relative;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background: rgba(43, 46, 55, .2);
        box-shadow: 0 0 300px rgba(43, 46, 55, 1) inset;
        z-index: 10;
    }

    .sc-hero .video-info-wrapper {
        position: relative;
        height: 272px;
        bottom: 180px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;
        flex-wrap: wrap;
        z-index: 11;
    }

    .sc-hero .video-info-wrapper .video-items,
    .sc-hero .video-info-wrapper .video-info {
        position: relative;
    }

    .tagline-wrapper {
        position: absolute;
        left: 50%;
        z-index: 11;
        top: 50%;
        transform: translate3d(-50%, -50%, 0);
        width: 80%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
    }

    .tagline-wrapper .tagline-text {
        text-align: center;
    }

    .tagline-wrapper .tagline-text .text {
        font-size: 3em;
        color: #fff;
        text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
        font-weight: 800;
        line-height: 1em;
    }

    .tagline-wrapper .tagline-text .text.link {
        text-decoration: none;
        transition-property: text-shadow;
        transition-duration: 0.5s;
        transition-timing-function: var(--easing);
    }

    .tagline-wrapper .tagline-text .text.link:hover {
        text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.3);
    }

    .tagline-wrapper .tagline-button-wrap {
        text-align: center;
        margin-top: 2.2em;
        box-sizing: border-box;
    }

    .sc-hero .video-info {
        z-index: 10;
        width: inherit;
        max-width: 624px;
        background: var(--primary-color-bright);
        color: #fff;
        box-shadow: 1px 1px 25px 0 rgba(0, 0, 0, .15);
        position: relative;
    }

    .sc-hero .video-info .wrapper {
        display: flex;
        flex-direction: column;
        /*height: 100%;*/
        box-sizing: border-box;
        padding: 40px 80px;
        width: fit-content;
    }

    .sc-hero .video-info .wrapper .button {
        align-self: flex-start;
    }

    .sc-hero .video-items {
        text-align: right;
        z-index: 12;
        color: #FFF;
        right: 64px;
        width: 350px;
        top: 4px;
    }

    .sc-hero .video-items ul {
        position: relative;
    }

    .sc-hero .video-items .title {
        opacity: 0.6;
    }

    .sc-hero .video-items li.title {
        display: block;
        transition: all .4s var(--easing);
        cursor: pointer;
    }

    .hero-ttb-move {
        transition: .25s ease-in-out;
        transition-property: opacity, transform;
    }

    .sc-hero .video-items .title.playing {
        margin-bottom: .4em;
    }

    .sc-hero .video-items .title.now {
        opacity: 1;
        cursor: default;
    }

    .sc-hero .video-items li.title:hover {
        opacity: .9;
    }

    .sc-hero .video-items .video-progression {
        width: 88px;
        height: 6px;
        position: absolute;
        padding: 0;
        margin: 0;
        top: 54px;
        right: -112px;
        z-index: 20;
    }

    .sc-hero .video-items .video-progression svg {
        position: absolute;
        top: 0;
        left: 0;
    }

    .sc-hero .video-items .video-progression .progress-bar {
        animation-timing-function: linear;
    }

    .sc-hero .video-items .video-progression.playing .progress-bar {
        animation-name: progress;
    }

    .sc-hero .video-items .video-progression.playing.paused .progress-bar {
        animation-play-state: paused;
    }

    @keyframes progress {
        to {
            stroke-dashoffset: 0;
        }
    }

    .sc-hero .video-player {
        position: absolute;
        width: 100%;
        height: 80%;
        top: 0;
        overflow: hidden;
        opacity: 1;
        transition: opacity .3s var(--easing);
    }

    .sc-hero .video-player.fade {
        opacity: 0;
    }

    .hero-ltr-enter-active {
        position: absolute;
        animation: hero-ltr-enter .5s var(--easing);
    }

    .hero-ltr-leave-active {
        position: absolute;
        animation: hero-ltr-leave .5s var(--easing);
    }

    @keyframes hero-ltr-enter {
        0% {
            transform: translateX(-25%);
            opacity: 0;
        }
        100% {
            transform: translateX(0%);
            opacity: 1;
        }
    }

    @keyframes hero-ltr-leave {
        0% {
            transform: translateX(0%);
            opacity: 1;
        }
        100% {
            transform: translateX(25%);
            opacity: 0;
        }
    }

    @media only screen and (max-width: 768px) {
        .tagline-wrapper {
            margin-top: -21px;
        }

        .tagline-wrapper .tagline-text .text {
            font-size: 2em;
        }

        .tagline-wrapper .tagline-button-wrap .tagline-button {
            font-size: 0.9em;
        }
    }

    @media only screen and (min-width: 768px) and (max-width: 1025px) {
        .tagline-wrapper {
            margin-top: -80px;
        }
    }

</style>