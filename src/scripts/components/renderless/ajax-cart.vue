<script>
// #CartDrawer
import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
import _ from '../../helpers/lo';
import AtomRecommendedProduct from '../render/atoms/atom-recommended-product.vue';
// import helpers from "../../helpers/helpers";
export default {
  name: 'AjaxCart',
  delimiters: ['#{', '}'],
  components: { AtomRecommendedProduct },
  data: function() {
    return {}
  },
  computed: {
    ...mapState({
      visability: state => state['cart'].AjaxCart.visability,
    }),
    ...mapGetters({
      cartNote: 'cart/cartNote',
      cartCount: 'cart/cartCount',
      cartProducts: 'cart/cartProducts',
      cartJson: 'cart/cartJson',
      cartPrice: 'cart/cartPrice',
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
    isEmptyCart: function(){
      return _.isEmpty(this.cartProducts)
    },
    isEmptyCurrentRecommendations: function(){
      return _.isEmpty(this.currentRecommendations)
    }
  },
  watch: {},
  mounted: function () {
    this.getRecommendedProducts();
  },
  methods:{
    ...mapMutations({
      showAjaxCart: 'cart/showAjaxCart'
    }),
    ...mapActions({
      getRecommendedProducts: 'recommended-products/getRecommendedProducts',
      clearCart: 'cart/clearCart',
      updateItem: 'cart/updateItem',
      updateNote: 'cart/updateNote',
      addItem: 'cart/addItem'
    }),
    closeQuickCart: async function() {
      this.showAjaxCart({
        visability: false
      })
      await this.$nextTick();
      window.toggleScroll();
    },
    goToCart() {
      window.location="/cart"
    },
    goToCheckout() {
      window.location = this.checkoutUrl;
    },
    updateQuantity (key, quantity) {
      this.updateItem({
        'id': key,
        'quantity': quantity
      })
    },
    removeItem(key) {
      this.updateQuantity(key, 0)
    },
    changeQty(key, currentQuantity, increase) {
      currentQuantity = (increase) ? currentQuantity + 1 : currentQuantity - 1
      this.updateQuantity(key, currentQuantity)
    },
  }
};
</script>
