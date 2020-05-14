<template>
    <div class="item" v-if="item && item.fields" @click="$router.push($getRoute(item.fields.slug))">
        <div class="inner">
            <div class="name">
                {{item.fields.title}}
            </div>
            <sc-image class="image" :height="350" :item="item"></sc-image>
        </div>
    </div>
</template>

<script>
  export default {
    name: "sc-related-item",
    props: {
      item: {
        type: Object,
        required: true,
      }
    },

  }
</script>

<style scoped>
    .item {
        width: 100%;
        box-sizing: border-box;
        position: relative;
        max-width: 33%;
    }

    .inner:before {
        content: '';
        background: #202329;
        position: absolute;
        top: 0;
        right: 5px;
        bottom: 0;
        left: 0;
        z-index: -1;
        transform: translate(-16px, 17px);
    }

    .inner {
        position: relative;
        z-index: 1;
        margin: 24px 3em;
        box-sizing: border-box;
        cursor: pointer;
    }

    .item .name {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 3em;
        color: #fff;
        line-height: 1.3em;
        font-size: 1.1em;
        height: 3.9em;
        overflow: hidden;
        font-weight: 600;
        margin: 0.7em 1.2em;
        transition: color .15s ease-in-out;
        z-index: 5;
        text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
    }

    .inner:hover .name {
        color: rgb(255, 149, 153);
    }

    .inner .image:after {
        content: '';
        background: rgba(238, 50, 53, 0.0);
        transition: background .15s ease-in-out;
        position: absolute;
        top: 0px;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 3;
    }

    .inner:hover .image:after {
        background: rgba(238, 50, 53, 0.8);
    }

    .image:before {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.3);
        z-index: 2;
    }

    /* MOBILE & TABLET/SMALL-DESKTOP */
    @media only screen and (max-width: 1024px) {
        .item {
            max-width: 50%;
        }
    }

    @media only screen and (max-width: 600px) {
        .item {
            max-width: 100%;
        }
    }
</style>