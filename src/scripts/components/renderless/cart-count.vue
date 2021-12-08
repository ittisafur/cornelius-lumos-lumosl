<script>
// #cart-count
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'CartCount',
  delimiters: ['#{', '}'],
  computed:{
    ...mapGetters({
      numberOfItems: 'cart/cartCount'
    }),
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