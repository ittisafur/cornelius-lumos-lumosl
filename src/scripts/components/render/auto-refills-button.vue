<template>
  <div
    class="ar-btns"
  >
    <div
      class="ar-btn flex items-center justify-center"
      @click.prevent="triggerModal({ component: 'AutoRefills', data: { product: { ...product } } })"
    >
      Set Up Auto-Refills
      <svg
        class="ml-2"
        width="16"
        height="12"
        viewBox="0 0 16 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.2256 6.00025C15.2162 6.21863 15.1362 6.46214 15.0262 6.60235L11.0775 11.6561C10.7404 12.0705 10.1616 12.1047 9.79129 11.7894C9.421 11.4741 9.35998 10.8369 9.66324 10.4519L12.397 6.94782H1.55703C1.05375 6.94782 0.645758 6.52356 0.645758 6.00025C0.645758 5.47691 1.05375 5.0527 1.55703 5.0527H12.397L9.66324 1.54866C9.35998 1.16366 9.42722 0.534146 9.79129 0.211152C10.1683 -0.12334 10.7744 -0.0467893 11.0775 0.344461L15.0262 5.39815C15.1805 5.59449 15.2131 5.76067 15.2256 6.00025V6.00025Z"
          fill="#21493E"
        />
      </svg>
    </div>
  </div>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: "AutoRefillsButton",
    props: { product: { type: Object, default: () => {} } },
    data: function () {
      return {}
    },
    computed: {},
    beforeMount: function () {},
    methods: {
      ...mapActions({
        hideModal: 'modal/hide',
        triggerModal: 'modal/trigger',
        toggleModal: 'modal/toggle',
        showModal: 'modal/show',
        setModal: 'modal/set'
      })
    }
  }
</script>

<!--style lang="scss" scoped-->
<style lang="scss" scoped>
  $color-primary: #BFFAEA;
  $color-secondary: #F0F8F6;
  $mint: #BFFAEA;
  $pale-mint: #F0F8F6;
  $blue: #3991F2;
  $blue-hover: #2F83DE;
  $dark-green: #21493E;
  $dark-green-hover: #17332B;
  $sage: #7DADA0;
  $black: #29302E;
  $white: #FFFFFF;
  $mobile: 767px;

  .ar-btns {
    .ar-btn {
      background: $white;
      color: $dark-green;
      border: 1px solid $dark-green;
      cursor: pointer;
      border-radius: 50px;
      padding: .5rem 1rem;
      text-align: center;

      &:hover {
        // background: $dark-green-hover;
        background: $mint;
      }
    }
  }
</style>