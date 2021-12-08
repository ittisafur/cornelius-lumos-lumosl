<script>
// #cart-section
import { mapState, mapGetters, mapActions } from 'vuex'
import _ from '../../helpers/lo';
import AtomRecommendedProduct from '../render/atoms/atom-recommended-product.vue';
// import helpers from "../../helpers/helpers";
export default {
  name: 'Cart',
  delimiters: ['#{', '}'],
  components: { AtomRecommendedProduct },
  data: function () {
    return {
      removeIcon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.0489 4.02887C9.73776 3.71776 9.22443 3.71776 8.89776 4.02887L7.04665 5.87999L5.17999 4.02887C4.86887 3.71776 4.35554 3.71776 4.02887 4.02887C3.71776 4.33998 3.71776 4.85332 4.02887 5.17999L5.87999 7.0311L4.02887 8.88221C3.71776 9.19332 3.71776 9.70665 4.02887 10.0333C4.18443 10.1889 4.38665 10.2667 4.60443 10.2667C4.82221 10.2667 5.02443 10.1889 5.17999 10.0333L7.0311 8.18221L8.88221 10.0333C9.03776 10.1889 9.23999 10.2667 9.45776 10.2667C9.65999 10.2667 9.87776 10.1889 10.0333 10.0333C10.3444 9.72221 10.3444 9.20887 10.0333 8.88221L8.18221 7.0311L10.0333 5.17999C10.36 4.85332 10.36 4.33998 10.0489 4.02887Z" fill="#29302E"/><path d="M7 0.466667C10.6089 0.466667 13.5333 3.39111 13.5333 7C13.5333 10.6089 10.6089 13.5333 7 13.5333C3.39111 13.5333 0.466667 10.6089 0.466667 7C0.466667 3.39111 3.39111 0.466667 7 0.466667ZM7 0C3.12667 0 0 3.12667 0 7C0 10.8733 3.12667 14 7 14C10.8733 14 14 10.8733 14 7C14 3.12667 10.8733 0 7 0Z" fill="#29302E"/></svg>',
      loader: '<svg class="loader" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><g><path d="M59.6 0h8v40h-8V0z" fill="#000000" fill-opacity="1"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(30 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(60 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(90 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#cccccc" fill-opacity="0.2" transform="rotate(120 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#b2b2b2" fill-opacity="0.3" transform="rotate(150 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#999999" fill-opacity="0.4" transform="rotate(180 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#7f7f7f" fill-opacity="0.5" transform="rotate(210 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#666666" fill-opacity="0.6" transform="rotate(240 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#4c4c4c" fill-opacity="0.7" transform="rotate(270 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#333333" fill-opacity="0.8" transform="rotate(300 64 64)"/><path d="M59.6 0h8v40h-8V0z" fill="#191919" fill-opacity="0.9" transform="rotate(330 64 64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64" calcMode="discrete" dur="1080ms" repeatCount="indefinite"/></g></svg>',
      lockIcon: '<svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.6427 5.66341H8.80899V3.69712C8.80899 2.71671 8.41952 1.77646 7.72627 1.08321C7.03302 0.389953 6.09277 0.000488281 5.11236 0.000488281C4.13195 0.000488281 3.1917 0.389953 2.49845 1.08321C1.8052 1.77646 1.41573 2.71671 1.41573 3.69712V5.66341H0.582023C0.50559 5.66341 0.429906 5.67846 0.359292 5.70771C0.288678 5.73696 0.224516 5.77983 0.17047 5.83388C0.116425 5.88793 0.073553 5.95209 0.0443037 6.0227C0.0150543 6.09332 0 6.169 0 6.24543V13.4185C0 13.5728 0.0613199 13.7209 0.17047 13.83C0.279621 13.9392 0.427661 14.0005 0.582023 14.0005H9.6427C9.79706 14.0005 9.9451 13.9392 10.0542 13.83C10.1634 13.7209 10.2247 13.5728 10.2247 13.4185V6.24543C10.2247 6.169 10.2097 6.09332 10.1804 6.0227C10.1512 5.95209 10.1083 5.88793 10.0542 5.83388C10.0002 5.77983 9.93604 5.73696 9.86543 5.70771C9.79481 5.67846 9.71913 5.66341 9.6427 5.66341ZM2.20225 3.69712C2.20225 2.92531 2.50885 2.18511 3.0546 1.63936C3.60035 1.09361 4.34055 0.787005 5.11236 0.787005C5.88417 0.787005 6.62437 1.09361 7.17012 1.63936C7.71587 2.18511 8.02247 2.92531 8.02247 3.69712V5.66341H2.20225V3.69712ZM9.4382 13.214H0.786517V6.44993H9.4382V13.214Z" fill="white"/><path d="M5.11227 8.48535C4.9495 8.48564 4.79083 8.53642 4.65815 8.63069C4.52546 8.72496 4.42528 8.85807 4.37144 9.01167C4.31759 9.16527 4.31272 9.33179 4.35751 9.48828C4.40229 9.64476 4.49452 9.7835 4.62148 9.88535V10.6876C4.62859 10.8132 4.68347 10.9313 4.77488 11.0176C4.86629 11.104 4.98729 11.1521 5.11305 11.1521C5.23882 11.1521 5.35982 11.104 5.45123 11.0176C5.54263 10.9313 5.59752 10.8132 5.60463 10.6876V9.88535C5.73169 9.78341 5.82396 9.64454 5.86871 9.4879C5.91345 9.33127 5.90846 9.1646 5.85441 9.01093C5.80037 8.85725 5.69994 8.72415 5.567 8.63001C5.43406 8.53586 5.27517 8.48532 5.11227 8.48535Z" fill="white"/></svg>'
    }
  },
  computed:{
    ...mapState({
      // cartJson: state => state['cart'].cartJson,
      // cartLoading: state => state['cart'].cartLoading,
    }),
    ...mapGetters({
      cartCount: 'cart/cartCount',
      cartProducts: 'cart/cartProducts',
      cartPrice: 'cart/cartPrice',
      cartJson: 'cart/cartJson',
      cartLoading: 'cart/cartLoading',
      checkoutUrl: 'cart/checkoutUrl',
      cartEstimatedCost: 'cart/cartEstimatedCost',
      cartEstimatedSubtotal: 'cart/cartEstimatedSubtotal',
      discountsApplied: 'cart/discountsApplied',
      discountedProduct: 'cart/discountedProduct',
      autoDiscountQualified: 'cart/autoDiscountQualified',
      recommendedProducts: 'recommended-products/recommendedProducts',
      currentRecommendations: 'recommended-products/currentRecommendations',
      recommendedProductsLoading: 'recommended-products/recommendedProductsLoading',
    }),
    cartNote: {
      get: function () {
        return this.$store.state['cart'].cartNote;
      },
      set: function(val) {
        this.$store.commit('cart/updateNote', val);
      }
    },
  },
  mounted: function () {
    this.getRecommendedProducts();
    this.getCart();
  },
  methods:{
    ...mapActions({
      getRecommendedProducts: 'recommended-products/getRecommendedProducts',
      clearCart: 'cart/clearCart',
      updateItem: 'cart/updateItem',
      // updateNote: 'cart/updateNote',
      addItem: 'cart/addItem',
      getCart: 'cart/getCart'
    }),
    isEmptyCart: function() {
      return _.isEmpty(this.cartProducts);
    },
    isEmptyCurrentRecommendations: function() {
      return _.isEmpty(this.currentRecommendations)
    },
    goToCheckout() {
      window.location = this.checkoutUrl;
    },
    // clearCart(){
    //   this.clearCart();
    // },
    updateQuantity(key, quantity) {
      this.updateItem({
        'id': key,
        'quantity': quantity
      });
    },
    removeItem(key) {
      this.updateQuantity(key, 0);
    },
    changeQty(key, currentQuantity, increase) {
      currentQuantity = (increase) ? currentQuantity + 1 : currentQuantity - 1
      this.updateQuantity(key, currentQuantity, increase)
    },
    changeQtyBox: function(key, currentQuantity) {
      this.updateQuantity(key, currentQuantity);
    },
    addRecommendedItem(product) {
      this.addItem({
        id: product.variants[0].id,
        quantity: 1,
        properties: {
          "UHLEP": true
        },
        showCart: false
      });
    }
  },
  render () {
    return this.$scopedSlots.default({
      cartCount: this.cartCount,
      cartProducts: this.cartProducts,
      cartJson: this.cartJson,
      cartPrice: this.cartPrice,
      cartLoading: this.cartLoading,
      recommendedProducts: this.recommendedProducts,
      currentRecommendations: this.currentRecommendations,
      recommendedProductsLoading: this.recommendedProductsLoading,
      cartNote: this.cartNote,
      getRecommendedProducts: this.getRecommendedProducts,
      clearCart: this.clearCart,
      updateItem: this.updateItem,
      addItem: this.addItem,
      isEmptyCart: this.isEmptyCart,
      isEmptyCurrentRecommendations: this.isEmptyCurrentRecommendations,
      goToCheckout: this.goToCheckout,
      updateQuantity: this.updateQuantity,
      removeItem: this.removeItem,
      changeQty: this.changeQty,
      changeQtyBox: this.changeQtyBox,
      addRecommendedItem: this.addRecommendedItem,
      removeIcon: this.removeIcon,
      lockIcon: this.lockIcon
    })
  }
};
</script>
