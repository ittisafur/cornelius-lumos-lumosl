<template>
  <button
    :class="linkClass"
    class="cart-icon"
    @click.prevent="openAjaxCart()"
  >
    <!-- <i
      class="fa fa-shopping-cart"
      aria-hidden="true"
    /> -->

    <svg
      :class="iconClass"
      viewBox="0 0 23 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.34375 5.77197C8.947 5.77197 8.625 6.07619 8.625 6.45103C8.625 6.82586 8.947 7.13008 9.34375 7.13008H13.2969C13.6936 7.13008 14.0156 6.82586 14.0156 6.45103C14.0156 6.07619 13.6936 5.77197 13.2969 5.77197H9.34375Z"
        fill="#29302E"
      />
      <path
        d="M21.5251 6.37565C21.4849 6.03205 21.1772 5.77197 20.811 5.77197H17.9688C17.572 5.77197 17.25 6.07619 17.25 6.45103C17.25 6.82586 17.572 7.13008 17.9688 7.13008H20.1681L21.5625 18.9266C21.5413 21.599 19.2341 23.7669 16.4008 23.7669H6.59956C3.76589 23.7669 1.45834 21.599 1.4375 18.9266L2.83187 7.13008H5.03125C5.428 7.13008 5.75 6.82586 5.75 6.45103C5.75 6.07619 5.428 5.77197 5.03125 5.77197H2.18895C1.82275 5.77197 1.51513 6.03205 1.47452 6.37565L0.00431219 18.8149C0.00143719 18.8397 0 18.8652 0 18.8903C0 22.3283 2.96053 25.125 6.59956 25.125H16.4008C20.0398 25.125 23 22.3283 23 18.8903C23 18.8652 22.9986 18.84 22.9953 18.8149L21.5251 6.37565Z"
        fill="#29302E"
      />
      <path
        d="M14.6833 9.70232C14.6833 10.3841 15.2706 10.9389 15.9922 10.9389C16.7138 10.9389 17.301 10.3841 17.301 9.70232C17.301 9.27079 17.0653 8.89119 16.7099 8.67016C16.7099 8.66609 16.7113 8.66235 16.7113 8.65794C16.7109 3.80304 14.4221 0 11.5 0C8.58332 0 6.29769 3.78912 6.28943 8.63146C5.93436 8.85283 5.69897 9.23208 5.69897 9.66294C5.69897 10.345 6.28619 10.8998 7.00782 10.8998C7.72944 10.8998 8.31666 10.345 8.31666 9.66294C8.31666 9.23208 8.08163 8.85317 7.72693 8.6318C7.73447 4.68615 9.45911 1.35811 11.5 1.35811C13.5452 1.35811 15.2734 4.70109 15.2734 8.65794C15.2734 8.66201 15.2745 8.66575 15.2749 8.67016C14.9195 8.89153 14.6833 9.27079 14.6833 9.70232Z"
        fill="#29302E"
      />
    </svg>

    <span class="badge w-4 h-4 lg:w-6 lg:h-6">
      <span class="value">{{ numberOfItems }}</span>
    </span>
  </button>
</template>
<script>
  import { mapActions, mapGetters, mapMutations } from 'vuex'

  export default {
    name: "CartIcon",
    props: { iconClass: { type: String, default: "" }, linkClass: { type: String, default: "" } },
    computed:{
      ...mapGetters({
        numberOfItems: 'cart/cartCount'
      }),
    },
    beforeMount: function () {
      this.triggerGetCart();
    },
    methods: {
      openAjaxCart: async function() {
        this.triggerGetCart();
        this.showAjaxCart({ visability: true });
        await this.$nextTick();
        window.toggleScroll();
      },
      ...mapActions({
        triggerGetCart: 'cart/triggerGetCart'
      }),
      ...mapMutations({
        showAjaxCart: 'cart/showAjaxCart'
      })
    }
  }
</script>

<style lang="scss" scoped>
  $color-mint: #BFFAEA;

  .cart-icon {
    position: relative;

    .badge {
      position: absolute;
      left: 0;
      bottom: 0;
      border-radius: 50%;
      background: $color-mint;
      // border: 1px #000 solid;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
