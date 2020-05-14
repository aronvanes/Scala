<template>
    <div class="checkbox-toggle noselect">
        <input type="checkbox" :id="`input-checkbox-toggle-${uuid}`" :ref="`input-${uuid}`" v-bind:checked="value"
               :disabled="disabled"/>
        <label :for="`input-checkbox-toggle-${uuid}`" @click="changeState" :style="getLabelStyle()">
            <div :style="getTextStyle()">{{stateText}}</div>
        </label>
    </div>
</template>

<script>
  export default {
    name: "input-toggle",
    props: {
      value: {type: Boolean, required: true},
      disabled: {type: Boolean, required: false, default: false},
      textPosition: {type: String, required: false}
    },

    data() {
      return {
        uuid: new Date().getTime()
      }
    },

    computed: {
      stateText() {
        let enabled = this.$store.getters.translation('general.enabled');
        let disabled = this.$store.getters.translation('general.disabled');
        return this.value ? enabled : disabled;
      }
    },

    methods: {
      changeState(e) {
        e.preventDefault();
        if (!this.disabled) this.$emit('update:value', !this.$refs[`input-${this.uuid}`].checked);
      },

      getLabelStyle() {
        if (typeof this.textPosition !== 'undefined') {
          switch (this.textPosition) {
            case 'top':
              return "";
          }
        }
      },

      getTextStyle() {
        if (typeof this.textPosition !== 'undefined') {
          switch (this.textPosition) {
            case 'top':
              return "top: -8px;";
            case 'right':
              return "top: 8px; left: 56px;";
          }
        }
      }
    }
  }
</script>

<style scoped>
    .checkbox-toggle {
        position: relative;
        display: block;
    }

    .checkbox-toggle input {
        opacity: 0;
        position: relative;
    }

    .checkbox-toggle label {
        position: relative;
        display: inline-block;
        cursor: pointer;
        top: 0;
        left: -22px;
        width: 48px;
        height: 28px;
        background: #EE3235;
        box-shadow: inset 0 0 2px 1px rgba(0, 0, 0, 0.1);
        border-radius: 18px;
        content: ' ';
        transition: all .4s ease;
    }

    .checkbox-toggle label::after {
        position: absolute;
        content: '';
        /*Needed for the line-height to take effect*/
        display: inline-block;
        width: 24px;
        height: 24px;
        background: #FFF;
        top: 2px;
        left: 2px;
        transition: all .4s ease;
        border-radius: 50%;
        -webkit-backface-visibility: hidden;
        box-shadow: 2px 1px 3px 0 rgba(0, 0, 0, 0.25);
    }

    .checkbox-toggle input:checked + label {
        background: #02A12D;
    }

    .checkbox-toggle input:checked + label::after {
        left: calc(48px - 26px);
        box-shadow: -2px 1px 3px 0 rgba(0, 0, 0, 0.25);
        content: '';
    }

    .checkbox-toggle label div {
        position: relative;
        top: 36px;
        color: #EE3235;
        transition: all .4s ease;
        text-transform: capitalize;
    }

    .checkbox-toggle input[type="checkbox"]:checked + label div {
        color: #02A12D;
    }

    .checkbox-toggle input:disabled + label {
        opacity: .5;
        cursor: default;
    }
</style>