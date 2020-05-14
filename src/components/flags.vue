<template>
    <div class="country-flag" :style="`width:${width}px;height:${width}px;`">

        <svg v-if="currentLocale === 'en'" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-gb" v-bind="getAttributes()">
            <g transform="translate(0) scale(.94)">
                <g stroke-width="1pt">
                    <path fill="#006" d="M-256 0H768v512H-256z"/>
                    <path fill="#fff" d="M-256 0v57.2L653.5 512H768v-57.2L-141.5 0H-256zM768 0v57.2L-141.5 512H-256v-57.2L653.5 0H768z"/>
                    <path fill="#fff" d="M170.7 0v512h170.6V0H170.7zM-256 170.7v170.6H768V170.7H-256z"/>
                    <path fill="#c00" d="M-256 204.8v102.4H768V204.8H-256zM204.8 0v512h102.4V0H204.8zM-256 512L85.3 341.3h76.4L-179.7 512H-256zm0-512L85.3 170.7H9L-256 38.2V0zm606.4 170.7L691.7 0H768L426.7 170.7h-76.3zM768 512L426.7 341.3H503l265 132.5V512z"/>
                </g>
            </g>
        </svg>

        <svg v-else-if="currentLocale === 'nl'" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-nl" v-bind="getAttributes()">
            <g fill-rule="evenodd" stroke-width="1pt" transform="scale(1.25 .9375)">
                <rect width="512" height="509.8" fill="#fff" rx="0" ry="0"/>
                <rect width="512" height="169.9" y="342.1" fill="#21468b" rx="0" ry="0"/>
                <path fill="#ae1c28" d="M0 0h512v170H0z"/>
            </g>
        </svg>

        <svg v-else-if="currentLocale === 'de'" xmlns="http://www.w3.org/2000/svg" id="flag-icon-css-de" v-bind="getAttributes()">
            <path fill="#ffce00" d="M0 320h640v160H0z"/>
            <path d="M0 0h640v160H0z"/>
            <path fill="#d00" d="M0 160h640v160H0z"/>
        </svg>

        <svg v-else-if="currentLocale === 'cn'" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="flag-icon-css-cn" v-bind="getAttributes()">
            <defs>
                <path id="a" fill="#ffde00" d="M-.6.8L0-1 .6.8-1-.3h2z"/>
            </defs>
            <path fill="#de2910" d="M0 0h640v480H0z"/>
            <use width="30" height="20" transform="matrix(71.9991 0 0 72 120 120)" xlink:href="#a"/>
            <use width="30" height="20" transform="matrix(-12.33562 -20.5871 20.58684 -12.33577 240.3 48)" xlink:href="#a"/>
            <use width="30" height="20" transform="matrix(-3.38573 -23.75998 23.75968 -3.38578 288 95.8)" xlink:href="#a"/>
            <use width="30" height="20" transform="matrix(6.5991 -23.0749 23.0746 6.59919 288 168)" xlink:href="#a"/>
            <use width="30" height="20" transform="matrix(14.9991 -18.73557 18.73533 14.99929 240 216)" xlink:href="#a"/>
        </svg>

    </div>
</template>

<script>


  export default {
    name: "language-select-flags",

    props: {
      width: {required: true},
      locale: {required: false }
    },

    data() {
      return {
        currentLocale: this.locale || this.$store.getters.getLocale(),
      }
    },

    methods: {
      getAttributes() {
        const width = 640;
        const height = 480;
        let attributes = {viewBox: `0 0 ${width} ${height}`};
        const scale = height / width;
        attributes.width = this.width / scale;
        attributes.height = this.width;
        return attributes;
      }
    }
  }
</script>
