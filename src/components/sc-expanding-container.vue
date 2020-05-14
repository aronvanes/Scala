<template>
    <transition name="expand"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                mode="out-in" appear>
        <slot></slot>
    </transition>

</template>

<script>
  export default {
    name: "sc-expanding-container",

    methods: {
      enter(element) {
        const width = getComputedStyle(element).width;

        element.style.width = width;
        element.style.position = 'absolute';
        element.style.visibility = 'hidden';
        element.style.height = 'auto';
        element.style.opacity = 1;

        const height = getComputedStyle(element).height;

        element.style.width = null;
        element.style.position = null;
        element.style.visibility = null;
        element.style.height = 0;

        // Force repaint to make sure the
        // animation is triggered correctly.
        getComputedStyle(element).height;
        // getComputedStyle(element).width;

        // Trigger the animation.
        // We use `setTimeout` because we need
        // to make sure the browser has finished
        // painting after setting the `height`
        // to `0` in the line above.
        setTimeout(() => {
          element.style.height = height;

        });
      },

      afterEnter(element) {
        element.style.height = 'auto';
      },

      leave(element) {
        const height = getComputedStyle(element).height;

        element.style.height = height;
        element.style.opacity = 0;

        // Force repaint to make sure the
        // animation is triggered correctly.
        getComputedStyle(element).height;

        setTimeout(() => {
          element.style.height = 0;
        });
      }
    }
  }
</script>

<style scoped>
    * {
        will-change: height, width;
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    .expand-enter-active,
    .expand-leave-active {
        transition: all .5s var(--easing);
        overflow: hidden;
    }

    .expand-enter,
    .expand-leave-to {
        height: 0;
        width: 0;

    }
</style>