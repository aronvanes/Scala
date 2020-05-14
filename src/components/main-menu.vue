<template>
    <div class="main-menu" :class="menuClass">
        <transition name="fade-in-transition">
            <div v-if="navVisible"
                 style="position: fixed; width: 100%; height: 100%; z-index: 0; background: rgba(43, 46, 55,0.7);"
                 @click="navVisible = !navVisible"></div>
        </transition>
        <div class="nav width-container" :class="{ visible : navVisible === true, hidden: navVisible === false}"
             ref="parent">

            <div class="nav-button" @click="toggleNav">
                <div class="hamburger hamburger--slider" :class="navVisible ? 'is-active' : ''">
                    <span class="hamburger-box">
                        <span class="hamburger-inner"/>
                    </span>
                </div>

                <span class="button-text" ref="text" style="text-transform:uppercase;">{{ $store.getters.translation('general.menu') }}</span>
            </div>

            <div v-if="navVisible" class="nav-list drop-shadow low" :style="getNavListPos()">
                <div class="nav-item" :class="item.fields.name === 'scala.nav.social' ? 'social' : '' || item.fields.name === 'sys.nav.item.contact' ? 'contact' : ''"
                     v-for="(item, index) in menuItems" :key="`nav-item-${item.sys.id}`">

                    <a v-if="item.fields.name !== 'scala.nav.social'"
                       :style="{animationDelay: 0.6 - (0.1 * index) + 's'}"
                       @click="navigateTo($getRoute(item.fields.slug), $event)"
                       :href="$getRoute(item.fields.slug)"
                       :key="`nav-item-link-${item.sys.id}`"
                       :data-index="index">
                        {{ item.fields.text }}
                    </a>

                    <a v-if="item.fields.name === 'scala.nav.item.products'"
                       v-for="(subItem) in item.fields.subitems"
                       class="nav-item-social"
                       @click="navigateTo($getRoute(subItem.fields.slug), $event)"
                       :href="$getRoute(subItem.fields.slug)"
                       :alt="subItem.fields.text">
                        {{ subItem.fields.text }}
                    </a>

                    <a v-if="item.fields.name === 'scala.nav.social'"
                        v-for="(subItem) in item.fields.subitems"
                        class="nav-item-social"
                        :alt="subItem.fields.text"
                        @click="openSocial(subItem.fields.url, $event)"
                    >
                        <icon-twitter v-if="subItem.fields.name.indexOf('twitter') !== -1" size="32" key="menu-social-twitter"></icon-twitter>
                        <icon-linkedin v-if="subItem.fields.name.indexOf('linkedin') !== -1" size="32" key="menu-social-linkedin"></icon-linkedin>
                        <icon-facebook v-if="subItem.fields.name.indexOf('facebook') !== -1" size="32" key="menu-social-facebook"></icon-facebook>
                    </a>

                </div>

            </div>

            <div class="logo" @click="$router.push($getRoute())">
                <img src="@/images/logo-white.png"/>
            </div>

            <div class="other-buttons contact-search">
                <div class="contact-us">
                    <router-link :to="$getRoute('contact')" class="button">{{$store.getters.translation('general.contact-us')}}</router-link>
                </div>
                <!--<div class="divider"/>-->
                <!--<div class="search-button">-->
                    <!--<img src="@/images/search-icon.png"/>-->
                <!--</div>-->
            </div>
        </div>
    </div>
</template>

<script>

  import IconTwitter from "~/components/icons/icon-twitter.vue";
  import IconLinkedin from "~/components/icons/icon-linkedin.vue";
  import IconFacebook from "~/components/icons/icon-facebook.vue";
  export default {
    components: {IconLinkedin, IconFacebook, IconTwitter},
    data: function () {
      return {
        menuItems: [],
        scrollPosition: 0,
        scrollThreshold: 300,
        navVisible: '',
        initialShow: false
      }
    },

    computed: {
      menuClass() {
        let classNames = "";
        if (this.scrollPosition > this.scrollThreshold
          || classNames === "" && this.$route.name !== 'home') {
          classNames = "scrolling";
        }

        return classNames;
      },
    },

    mounted() {
      this.fetchMenu();
      this.$store.watch((state, getters) => getters.get('locale'), () => {
        this.fetchMenu()
      });

      this.$nextTick(() => {
        this.scrollPosition = window.scrollY;
        window.addEventListener('scroll', (e) => {
          this.scrollPosition = window.scrollY;
          if (this.initialShow === true && this.scrollPosition > (this.scrollThreshold - 100)) {
            this.initialShow = false;
            this.navVisible = false;
          }
        });
      })
    },

    beforeDestroy() {
      clearTimeout(this.navTimer);
    },

    methods: {

      openSocial(route, e) {
        e.preventDefault();
        window.open(route, '_blank');
        this.navVisible = false;
      },

      navigateTo(route, e) {
        e.preventDefault();
        this.$router.push(route);
        this.navVisible = false;
      },

      getNavListPos() {
        let parentRect = this.$refs.parent.getBoundingClientRect();
        let refRect = this.$refs.text.getBoundingClientRect();
        let l = refRect.x - parentRect.x + this.$refs.text.offsetLeft - 202;

        return {left: l + "px"};
      },

      toggleNav() {
        this.initialShow = false;
        if (this.navVisible === '') {
          this.navVisible = true;
        } else {
          this.navVisible = !this.navVisible;
        }
      },

      fetchMenu() {
        let requestParams = {content_type: 'sysNav', 'fields.name': 'scala.nav', include: 2};
        this.$getEntries(requestParams)
          .then((res) => {
            let itemIds = res.items[0].fields.items.map((item) => {
              return item.sys.id
            });
            let result = [];
            for (let i = 0; i < itemIds.length; i++) {
              for (let j = 0; j < res.includes.Entry.length; j++) {
                if (res.includes.Entry[j].sys.id === itemIds[i]) {
                  result.push(res.includes.Entry[j])
                }
              }
            }
            this.menuItems = result;
          })
          .catch((error) => {
            return error
          })
      },
    }
  }
</script>

<style scoped>
    .fade-in-transition-leave-active,
    .fade-in-transition-enter-active {
        transition-property: opacity;
        transition-duration: 0.2s;
        transition-timing-function: ease-in-out;
    }

    .fade-in-transition-leave-to,
    .fade-in-transition-enter {
        opacity: 0;
    }

    .fade-in-transition-leave,
    .fade-in-transition-enter-to {
        opacity: 1;
    }
</style>
