<template>
    <div class="sc-events-list-item" @click="onClick()" @mouseover="onMouseOver()" @mouseout="onMouseOut()">
        <div class="eli-date border-radius br-small bold upper">
            <div class="eli-date-month bold medium">
                {{getMonth()}}
            </div>
            <div class="eli-date-days">
                {{getDays()}}
            </div>
        </div>
        <div class="eli-info upper">
            <h3 class="eli-title bold medium">{{item.fields.title}}</h3>
            <div class="eli-location">{{item.fields.location}}</div>
        </div>
        <div class="eli-separator"
             v-if="$mq !== 'phone' && typeof item.fields.eventTalks !== 'undefined' && item.fields.eventTalks.length > 0"></div>

        <div class="eli-talk" v-if="$mq !== 'phone' && typeof item.fields.eventTalks !== 'undefined' && item.fields.eventTalks.length > 0">
            <div class="eli-speaker">
                <span class="bold medium" style="margin-right: .5em;">SPEAKER:</span>
                {{item.fields.eventTalks[0].fields.members[0].fields.name}}
            </div>

            <div class="eli-talk-title upper">
                {{item.fields.eventTalks[0].fields.title}}
            </div>
        </div>

    </div>
</template>

<script>
  export default {
    name: "sc-events-list-item",

    props: {
      item: {
        required: true,
        type: Object,
        default: () => {
          return { fields: {
              startDate: '2018-08-10T17:00+02:00',
              endDate: '2018-08-12T17:00+02:00',
              title: 'event name',
              location: 'city, country/state',
              slug: 'slug'
            }
          }
        }
      }
    },

    data() {
      return {
        startDate: new Date(this.item.fields.startDate),
        endDate: new Date(this.item.fields.endDate)
      }
    },

    methods: {
      getMonth() {
        return this.$store.getters.getMonthShort(this.startDate.getMonth());
      },
      getDays() {
        const startDay = this.startDate.getDate();
        const endDay =  this.endDate.getDate();
        return `${startDay}-${endDay}`;
      },
      onClick() {
        this.$router.push( this.$getRoute(this.item.fields.slug) );
      },
      onMouseOver() {
        this.$emit('mouse-over');

      },
      onMouseOut() {
        this.$emit('mouse-out');
      }
    }
  }
</script>

<style scoped>
    .sc-events-list-item {
        position: relative;
        cursor: pointer;
        transition: all .25s ease;
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        /*opacity: 0;*/
    }

    .sc-events-list-item .eli-date {
        color: #FFF;
        background-color: var(--primary-color-dark);
        box-sizing: border-box;
        min-width: 88px;
        width: 88px;
        height: 88px;
        border: 1px solid white;
        margin-right: 2em;
        display: flex;
        flex-flow: column wrap;
        justify-content: center;
        align-items: center;
        letter-spacing: .15em;
        transition: all .3s var(--easing);
    }

    .sc-events-list-item:hover .eli-date {
        color: var(--primary-color-dark);
        background-color: #FFF;
    }

    .sc-events-list-item .eli-info {
        display: inline-block;
        top: 20%;
        left: 128px;
        transition: color .25s ease;
    }

    .sc-events-list-item .eli-info .eli-title {
        font-size: 2rem;
        line-height: 1.2em;
    }

    .sc-events-list-item .eli-info .eli-location {
        font-size: 1.5rem;
        letter-spacing: .05em;
    }

    .sc-events-list-item .eli-separator {
        height: 4em;
        content: " ";
        display: block;
        background-color: #FFF;
        width: 1px;
        min-width: 1px;
        position: relative;
        margin: 0 2em;
    }

    .sc-events-list-item .eli-talk {
        font-size: 1.5em;
        text-align: left;
    }

    @media only screen and (max-width: 1024px) {
        .sc-events-list-item {
            margin: .5em 0;
        }

        .sc-events-list-item .div {
            width: initial;
        }

        .sc-events-list-item .eli-date {
            min-width: 4.5em;
            width: 4.5em;
            max-width: 4.5em;
            min-height: 4.5em;
            height: 4.5em;
            max-height: 4.5em;
            font-size: 1.1em;
            margin-right: 1em;
            line-height: initial;
            letter-spacing: initial;
        }

        .sc-events-list-item .eli-info {
            line-height: initial;
            width: auto;
        }

        .sc-events-list-item .eli-info .eli-location {
            font-size: 1.34em;
        }

        .sc-events-list-item .eli-separator {
            height: 3em;
            margin: 0 1em;
        }
    }

    @media only screen and (min-width: 1025px) and (max-width: 1599px) {

        .sc-events-list-item .eli-date {
            min-width: 5em;
            width: 5em;
            max-width: 5em;
            min-height: 5em;
            height: 5em;
            max-height: 5em;
            font-size: 1.2em;
            margin-right: 1.5em;
        }
        .sc-events-list-item .eli-info,
        .sc-events-list-item .eli-talk {
            font-size: 1em;
        }

        .sc-events-list-item .eli-info {
            max-width: 200px;
        }
        .sc-events-list-item .eli-info .eli-location,
        .sc-events-list-item .eli-talk .eli-speaker,
        .sc-events-list-item .eli-talk .eli-talk-title {
            font-size: 1.4rem;
        }

        .sc-events-list-item .eli-separator {
            margin: 0 1em;
        }
    }

    @media only screen and (max-width: 480px) {
        .sc-events-list-item .eli-info .eli-title {
            font-size: 1.5rem;
            line-height: 1.2em;
        }
    }
</style>