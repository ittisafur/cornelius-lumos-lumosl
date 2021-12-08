<template>
  <div
    v-if="currentVariant && currentVariant.available"
    class="atc-btns"
  >
    <div
      class="atc btn"
      @click.prevent="addToCart()"
    >
      Add to Bag
    </div>
    <div class="quantity">
      <div
        class="quantity__selector quantity__minus"
        @click.prevent="changeQuantity('decrement')"
      />
      <input
        id="quantity"
        v-model.number="quantity"
        type="number"
        name="quantity"
        value="1"
        min="1"
      >
      <div
        class="quantity__selector quantity__plus"
        @click.prevent="changeQuantity('increment')"
      />
    </div>
  </div>
  <div
    v-else
    class="atc-btns"
  >
    <a
      class="oos btn klaviyo-bis-trigger w-full"
      href="#"
      style="text-align: center; margin: 0px;"
    >
      Notify Me When Available
    </a>
  </div>
</template>

<script>
  import { mapActions } from 'vuex'
  import _ from '../../helpers/lo';
  import helpers from "../../helpers/helpers";

  export default {
    name: "AddToCart",
    props: { currentVariant: { type: Object, default: () => {} }, purchaseType: { type: String, default: "" }, subscriptionOptions: { type: Object, default: () => {} }, initQuantity: { type: Number, default: 0 } },
    data: function () {
      return {
        quantity: 1,
      }
    },
    computed: {
      getPrice: function () {
        return this.purchaseType === "autodeliver" && this.currentVariant.selling_plan_allocations && this.currentVariant.selling_plan_allocations[0].price ? this.formatMoney(this.currentVariant.selling_plan_allocations[0].price) : this.formatMoney(this.currentVariant.price);
      }
    },
    watch: {
      quantity: function ( after, before ) {
        if ( after !== before ) {
          if ( _.isUndefined( after ) ) {
            return;
          } else if ( after < 1 ) {
            this.quantity = 1;
          } else if ( after >= 1 && after <= this.currentVariant.inventory_quantity ) {
            this.quantity = after;
          } else if ( after > this.currentVariant.inventory_quantity ) {
            this.quantity = before;
          }
          this.$emit('quantity', this.quantity);
          return;
        }
      },
    },
    beforeMount: function () {
      if (this.initQuantity) this.quantity = this.initQuantity;
    },
    methods: {
      ...mapActions({
        addCartItems: 'cart/addCartItems',
        hideModal: 'modal/hide'
      }),
      formatMoney: ( price ) => {
        return helpers.returnCurrencyFormatted( price );
      },
      addToCart: function () {
        let variantId = this.currentVariant.id,
            properties = {},
            cart = { items: [] },

            item = {
              id: variantId,
              quantity: this.quantity,
              properties: properties
            };

        // check for subscriptions:
        if ( this.purchaseType === "autodeliver" && this.currentVariant.selling_plan_allocations && this.subscriptionOptions.idx !== undefined && this.currentVariant.selling_plan_allocations[this.subscriptionOptions.idx] && this.currentVariant.selling_plan_allocations[this.subscriptionOptions.idx].selling_plan_id ) {
          item.selling_plan = this.currentVariant.selling_plan_allocations[this.subscriptionOptions.idx].selling_plan_id;
          item.properties = {...item.properties, ...{ Subscription: this.subscriptionOptions?.frequency }}
        }

        cart.items.push( item );
        this.addCartItems( cart );
        // reset the quantity selector:
        this.quantity = 1;
        this.hideModal();
      },
      changeQuantity: function ( change ) {
        if ( change === "increment" ) {
          this.quantity++;
        } else {
          this.quantity--;
        }
        this.$emit('quantity', this.quantity);
      },
    },
  }
</script>

<!--style lang="scss" scoped-->
<style lang="scss">
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

  .atc-btns {
    display: flex;

    .quantity {
      flex: calc(30% - 1rem);
      display: flex!important;
      border: 1px solid $color-primary;
      border-radius: 50px;
      margin-left: 1rem;
      background: $white;

      .quantity__selector {
        flex: 1 0 calc(100% / 3);
        cursor: pointer;

        &.quantity__minus {
          position: relative;

          &:after {
            position: absolute;
            content: "\2212";
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        &.quantity__plus {
          position: relative;

          &:after {
            position: absolute;
            content: "\002B";
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }

      input#quantity {
        width: calc(100% / 3);
        text-align: center;
        -moz-appearance: textfield;
        &::-webkit-outer-spin-button, &::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      }
    }

    .btn {
      display: flex;
      flex: 70%;
      justify-content: center;
      background: $dark-green;
      color: $white;
      cursor: pointer;
      border-radius: 50px;
      padding: .5rem 1rem;
      text-align: center;

      &.oos {
        display: block;
        flex: 100%;
      }

      &:hover {
        // background: $dark-green-hover;
        background: lighten($color: $dark-green, $amount: 10);
      }
    }
  }
</style>