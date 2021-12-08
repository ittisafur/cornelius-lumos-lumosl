<template>
  <transition name="modal">
    <div
      v-if="visible"
      class="modal-mask"
      @close="hide"
    >
      <div
        class="modal-wrapper"
        @click="overlayHide"
      >
        <div
          v-if="component"
          class="modal-container"
        >
          <component
            :is="component"
            :data="data"
          />
        </div>

        <div
          v-else
          class="modal-container"
        >
          <div class="modal-header">
            <slot name="header">
              default header
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
              default body
            </slot>
          </div>

          <div class="modal-footer">
            <button
              class="modal-default-button"
              @click="hide"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import AutoRefills from './modals/auto-refills.vue';
  import StrengthInfo from './modals/strength-info.vue';
  import { mapActions, mapGetters } from 'vuex';
  export default {
    name: "Modal",
    components: { AutoRefills, StrengthInfo },
    data: function () {
      return {}
    },
    computed: {
      ...mapGetters({
        component: 'modal/getComponent',
        data: 'modal/getData',
        visible: 'modal/showModal'
      })
    },
    mounted: function () {},
    methods: {
      ...mapActions({
        toggle: 'modal/toggle',
        show: 'modal/show',
        hide: 'modal/hide'
      }),
      overlayHide: function (e) {
        if ( !e.path.some( el => el.classList && el.classList.contains('modal-container') ) ) this.hide();
      }
    }
  }
</script>

<style lang="scss">
  $mint: #BFFAEA;
  $pale-mint: #F0F8F6;
  $sage: #7DADA0;
  $dark-green: #21493E;
  $blue: #3991F2;
  $black: #29302E;
  $white: #FFFFFF;
  $color-success: #189D3D;
  $color-error: #CE0000;

  .modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: table;
    transition: opacity 0.3s ease;
    font-family: "alternate-gothic-no-3-d",sans-serif;

    .modal-wrapper {
      display: table-cell;
      vertical-align: middle;

      .modal-container {
        width: 90vw;
        max-height: 90vh;
        margin: 0px auto;
        padding: 20px 10px;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
        transition: all 0.3s ease;
        font-family: Helvetica, Arial, sans-serif;
        color: #000;

        @media screen and (min-width: 768px) {
          width: 60vw;
          max-height: none;
          padding: 20px 30px;
        }


        .modal-header {
          h3 {
            text-transform: uppercase;
            margin-top: 0;
            color: #000;
            font-size: 3rem;
          }
        }

        .modal-body {
          padding: 12px 16px 10px!important;
          margin: 20px 0;
          max-height: 55vh;
          overflow-y: auto;

          label { margin: 0; }
        }

        .modal-footer {
          display: flex;
          justify-content: center;
          padding: 12px 16px 10px !important;

          button {
            cursor: pointer;

            &.submit {
              background-color: $mint;
              color: $black;

              &:hover {
                background-color: $pale-mint;
              }
            }

            &:hover {
              color: $dark-green;
            }
          }
        }
      }
    }
  }

  /*
  * The following styles are auto-applied to elements with
  * transition="modal" when their visibility is toggled
  * by Vue.js.
  *
  * You can easily play with the modal transition by editing
  * these styles.
  */

  .modal-enter {
    opacity: 0;
  }

  .modal-leave-active {
    opacity: 0;
  }

  .modal-enter .modal-container,
  .modal-leave-active .modal-container {
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>