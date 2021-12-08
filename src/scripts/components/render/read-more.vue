<template>
  <div class="read-more">
    <div
      :id="uid"
      ref="content"
      class="content"
      :class="[collapsed ? 'collapsed' : '']"
    >
      <slot />
    </div>
    <button
      type="button"
      class="rm-toggle"
      aria-expanded="false"
      :aria-controls="uid"
      @click="toggleHandler"
    >
      {{ buttonLabel }}
    </button>
  </div>
</template>

<script>
  import _ from '../../helpers/lo';

  export default {
    name: 'ReadMore',
    props: {
    },
    data: function() {
      return {
        uid: '',
        maxHeight: 3000,
        collapsedHeight: 280,
        collapsed: true,
        buttonLabel: '',
        MORE: 'Read More',
        LESS: 'Read Less',
      }
    },
    watch: {
      collapsed: function() {
        this.calcHeight()
      }
    },
    created () {
      this.uid = `read-more-${_.uniqueId()}`,
      this.buttonLabel = this.MORE;
    },
    mounted () {
      // let el = this.$refs['content']
      this.calcHeight()
    },
    methods: {
      calcHeight: function() {
        let height;
        if (this.collapsed) {
          height = this.collapsedHeight
        } else {
          height = this.maxHeight
        }
        this.$refs['content'].style.maxHeight= `${height}px`
      },
      toggleHandler: function() {
        this.collapsed = !this.collapsed
        if ( this.collapsed ) {
          this.buttonLabel = this.MORE;
        } else {
          this.buttonLabel = this.LESS;
        }
      },
    }
  }
</script>

<style lang='scss'>
// @import "../../../scss/base/colors";
// @import "../../../scss/base/fonts";
// @import "../../../scss/base/variables";

// .read-more {
//   left: 0;
//   visibility: visible;
//   position: relative;

//   .content {
//     overflow: hidden;
//     position: relative;
//     transition: max-height 0.3s ease-out;

//     &.collapsed {
//       &::after {
//         position: absolute;
//         left: 0;
//         top: 0;
//         height: 100%;
//         width: 100%;
//         content: "";
//         background: linear-gradient(to top,
//           rgba(255,255,255, 1) 0%,
//           rgba(255,255,255, 0) 50%
//         );
//         pointer-events: none; /* so the text is still selectable */
//       }
//     }
//   }

//   &.hidden {
//     .content {
//       transition: none;
//     }
//   }
// }

// .rm-toggle {
//   @include OpenSans($weight:700);

//   position: relative;
//   background: transparent;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 0;
//   width: 100%;
//   color: $color-antique-brass;
//   margin-top: 1rem;
//   text-transform: uppercase;
// }
</style>
