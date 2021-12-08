<template>
  <section
    v-if="getShopifyCheckoutStep === 'contact_information'"
    id="checkout-section"
  >
    <div class="recommended-products">
      <div class="recommended-header">
        We also recommend
      </div>
      <div
        class="recommended-body"
        :class="{loading: recommendedProductsLoading}"
      >
        <svg
          class="loader"
          xmlns:svg="http://www.w3.org/2000/svg"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          version="1.0"
          width="64px"
          height="64px"
          viewBox="0 0 128 128"
          xml:space="preserve"
        >
          <g>
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#000000"
              fill-opacity="1"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#cccccc"
              fill-opacity="0.2"
              transform="rotate(30 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#cccccc"
              fill-opacity="0.2"
              transform="rotate(60 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#cccccc"
              fill-opacity="0.2"
              transform="rotate(90 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#cccccc"
              fill-opacity="0.2"
              transform="rotate(120 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#b2b2b2"
              fill-opacity="0.3"
              transform="rotate(150 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#999999"
              fill-opacity="0.4"
              transform="rotate(180 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#7f7f7f"
              fill-opacity="0.5"
              transform="rotate(210 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#666666"
              fill-opacity="0.6"
              transform="rotate(240 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#4c4c4c"
              fill-opacity="0.7"
              transform="rotate(270 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#333333"
              fill-opacity="0.8"
              transform="rotate(300 64 64)"
            />
            <path
              d="M59.6 0h8v40h-8V0z"
              fill="#191919"
              fill-opacity="0.9"
              transform="rotate(330 64 64)"
            />
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64"
              calcMode="discrete"
              dur="1080ms"
              repeatCount="indefinite"
            />
          </g>
        </svg>
        <AtomRecommendedProduct
          v-for="(product) in currentRecommendations"
          :key="product.id"
          :product-liquid="product"
        />
      </div>
    </div>
  </section>
</template>

<script>
  import { mapState, mapGetters, mapActions } from 'vuex'
  import _ from '../../helpers/lo';
  import AtomRecommendedProduct from './atoms/atom-recommended-product.vue';
  // import helpers from "../../helpers/helpers";

  export default {
    name: "Checkout",
    components: { AtomRecommendedProduct },
    data: function () {
      return {}
    },
    computed:{
      ...mapState({
        // cartJson: state => state['cart'].cartJson,
        // cartLoading: state => state['cart'].cartLoading,
      }),
      ...mapGetters({
        cartProducts: 'cart/cartProducts',
        recommendedProducts: 'recommended-products/recommendedProducts',
        currentRecommendations: 'recommended-products/currentRecommendations',
        recommendedProductsLoading: 'recommended-products/recommendedProductsLoading',
      }),
      getShopifyCheckoutStep: function () {
        return window.Shopify.Checkout.step;
      }
    },
    mounted: function () {
      // this.getRecommendedProducts();
    },
    methods:{
      ...mapActions({
        getRecommendedProducts: 'recommended-products/getRecommendedProducts',
        addItem: 'cart/addItem',
      }),
      isEmptyCurrentRecommendations: function() {
        return _.isEmpty(this.currentRecommendations)
      },
      removeItem(key) {
        this.updateQuantity(key, 0);
      }
    },
  }
</script>

<style lang="scss" scoped>
  #checkout-section{
    .recommended-products {
      // border-top: 1px solid #eceaeb;
      .recommended-header {
        margin-bottom: 5px;
        font-weight: bold;
      }
      .recommended-body {
        position: relative;
        background: rgba(136, 136, 136, 0.07);
        .single-item {
          display: flex;
          padding: 2em 1em;
          .item-img {
            flex: 1 1 10%;
            border: 1px solid transparent;  // rgb(192, 143, 115);
            height: 100%;
            align-self: center;

            img {
              object-fit: cover;
              width: 100%;
            }
          }
          .item-body {
            flex: 1 1 90%;
            margin-left: 1em;
            font-family: Open Sans,sans-serif;
            font-weight: 600!important;
            font-style: normal;
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            font-size: 12px;
            line-height: 18px;
            color: #353535;
            letter-spacing: -.18px;

            .item-title {
              a { font-weight: 700!important; }
            }
            .item-price {
              font-weight: 700!important;
            }
            .item-cta {
              margin-top: 1em;
              .recommended-atc {
                color: rgb(192, 143, 115);
                background-color: rgb(255, 255, 255);
                border: 1px solid rgb(192, 143, 115);
                padding: 0.5em 5em;
                text-transform: uppercase;
                font-weight: bold;
              }
            }
          }
        }

        .loader {
          display: none;
          background: #eceaeb;
        }

        &.loading {
          .loader {
            display: block;
            position: absolute;
            z-index: 0;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }

          &:after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, .1);
          }
        }
      }
    }
  }
</style>
