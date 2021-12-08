<template>
  <transition name="fade">    
    <div
      class="plp grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4"
      :class="{ loaded: isMounted }"
    >
      <div
        v-for="( product, i ) in allProductsJson"
        :key="i"
        class="collection-item w-full"
        :data-product="product.title"
      >
        <div
          class="prod-container"
          itemscope=""
          itemtype="http://schema.org/Product"
        >
          <meta
            itemprop="name"
            :content="product.title"
          >
          <meta
            itemprop="url"
            :content="`${shopUrl}/products/${product.handle}`"
          >
          <meta
            itemprop="brand"
            :content="shopName"
          >
          <meta
            itemprop="image"
            :content="product.images && product.images.length ? product.images[0].src : ''"
          >
          <meta
            itemprop="description"
            :content="description"
          >
          <div class="sticker badge hidden">
            best seller
          </div>
          <div class="prod-image">
            <a
              class="variantLink"
              :href="`/products/${product.handle}`"
              :title="product.title"
            >
              <div class="default">
                <img :src="product.images && product.images.length ? product.images[0].src : ''">
              </div>
              <div class="reveal">
                <img :src="product.images && product.images.length && product.images[1] ? product.images[1].src : ''">
              </div>
            </a>
          </div>
        </div>
        <div class="product-index__info">
          <div class="product-info collection-item__info">
            <div class="collection-item__variantTitle">
              <div class="variantInfo">
                {{ product.product_type }}
              </div>
            </div>
            <a
              :href="`/products/${product.handle}`"
              :title="product.title"
            >
              <h3 class="collection-item__title">{{ product.title }}</h3>
            </a>
            <!-- ratings -->
            <div class="collection-item__swatches swatches flex">
              <div
                v-for="( variant, j ) in product.variants"
                :key="j"
                class="swatch selected visible first-four"
              >
                <div class="swatch-middle">
                  <div class="swatch-inner">
                    <div class="swatch-bg flush-glow-duo luminous-flush" />
                  </div>
                </div>
              </div>
            </div>
            <div class="collection-item__price price">
              <offer
                itemprop="offers"
                itemscope=""
                itemtype="http://schema.org/Offer"
              >
                <meta
                  itemprop="priceCurrency"
                  content="USD"
                >
                <div
                  itemprop="price"
                  class="variantPrice"
                  data-price-element=""
                >
                  from <span class="money">{{ product.price ? product.price : formatMoney(product.variants[0].price) }}</span>
                </div>
              </offer>
            </div>
            <a class="collection-item__quickadd"><div class="quickAdd  link--underlined">Quick Add</div></a>
          </div>
          <!-- wishlist -->
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import _ from '../../helpers/lo';
  import helpers from "../../helpers/helpers";
  import axios from "axios";

  const PRODUCTS_PER_AJAX = 50;
  // const $mobile = 768;
  const breakpoints = {
    lgl: 1200,
    lg: 1024,
    mdl: 992,
    md: 768,
    sm: 375,
    sms: 320,
  };

  export default {
    name: "RsCollection",
    props: { collection: { type: Object, default: () => {} }, description: { type: String, default: "" }, metaCf: { type: Object, default: () => {} }, metaGlobal: { type: Object, default: () => {} }, shopUrl: { type: String, default: "" }, shopName: { type: String, default: "" } },
    data: function () {
      return {
        allProductsJson: [],
        isMounted: false
      }
    },
    computed: {
      ...mapGetters({
        windowWidth: 'window-width/WindowWidth'
      }),
      isDesktop: function() {
        return this.windowWidth > breakpoints.mdl
      },
    },
    watch: {},
    created () {},
    destroyed () {},
    beforeMount: function () {
      this.initCollection();
    },
    mounted: function () {
      document.querySelector( 'body.template-collection' ).classList.add( 'loaded' );
      this.isMounted = true;
    },
    methods: {
      formatMoney: ( price ) => {
        return helpers.returnCurrencyFormatted( price );
      },
      formatPercentage: ( percentage ) => {
        return helpers.returnPercentageFormatted( percentage );
      },
      slugify: ( string ) => {
        string = string.replace(/^\s+|\s+$/g, ''); // trim
        string = string.toLowerCase();
      
        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            string = string.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        string = string.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return string;
      },
      initCollection: function () {
        axios.get(`/collections/${this.collection.handle}/product_count.json`).then( resp => {
          let count = resp.data.collection.products_count,
              numRequests = Math.ceil(count / PRODUCTS_PER_AJAX),
              requests = [],
              data = {};

          for (let page=1; page <= numRequests; page++ ) {
            requests.push( axios.get(`/collections/${this.collection.handle}/products.json?limit=${PRODUCTS_PER_AJAX}&page=${page}`) );
          }

          axios.all(requests).then(axios.spread((...responses) => {
            data.products = responses.reduce( (a, v) => {
              a = a.concat(v.data.products);
              return a;
            }, []);
            this.allProductsJson = data.products;
          })).catch( err => { console.log(err) } )

        }).catch ( err => { console.log(err) } )
      },
    },
  }
</script>

<!--style lang="scss" scoped-->
<style lang="scss">
  $color-primary: #000;
  $color-secondary: #eceaeb;
  $offwhite: #f9f8f7;
  $mobile: 767px;

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  body.template-collection {
    opacity: 0;
    transition: opacity .5s;

    &.loaded {
      opacity: 1;
    }

    .product-index__info {
      display: flex;
      justify-self: space-between;

      .product-info {
        width: calc(100% - 40px);
      }
    }

    .product-favorite {
      width:30px;
      text-align: right;
    }

    #product-loop {
      background: $offwhite;
      max-width: 1340px;
      margin:0 auto;
    }

    .prod-image {
      position: relative;

      .default {
        position: relative;
      }

      .reveal {
        position: absolute;
        top:0;
        left:0;
        z-index: 1;
        display: block;
        opacity: 0;
        transition: ease-in-out 0.2s;
      }

      &:hover {
        .reveal {
          opacity: 1;
        }
      }

      img {
        object-fit: cover;
        width: 100%;
      }
    }
    
    .types {
      margin: 1rem 0;
      justify-content: space-between;
      max-width: 75%;

      div {
        text-align: center;
      }
    }

    .product-grid {
      max-width: none;
      margin: 5rem auto;
    }

    .collection-item{
      padding:20px 60px 70px;
    }

    .collection-item__info .variantInfo,
    .collection-item__title,
    .collection-item__price .variantPrice {
      text-align: left;
    }

    .collection-item__price .variantPrice {
      font-size: 15px;
    }

    .quickAdd {
      padding-top:10px;
      margin: 0px 0 10px;
      font-size: 13px;
      text-transform: uppercase;
    }


    .swatches {
      margin: 1rem 0;
      .swatch {
        width: 21px;
        height: 21px;
        margin: .1rem;
        display:none;

        &.visible {
          display:block;
          position: relative;
        }
      }
    }

    .collection-item__swatches {
      // max-width: 95px;
      position: relative;
      &.expanded{
        max-width: 200px;  
      }
    }

    @media (max-width: $mobile) {
      .product-index__info {
        display: block;
    
        .product-favorite {
          display: none;
        }

        .product-info {
          width: 100%;
        }

        .product-info h3 {
          font-size:18px;
        }
      }

      .product-grid {
        width: 100%;
        margin:0;
      }

      .collection-item {
        text-align: center;
        padding:20px 20px 0;
      }
    
      .collection-item__info .variantInfo,
      .collection-item__title,
      .collection-item__price .variantPrice {
        text-align: center;
      }

      .collection-item__price .variantPrice {
        font-size: 14px;
      }
    
      .collection-item__ratings {
        margin:0 auto;
      }
    
      .collection-item__swatches {
        align-items: center;
        justify-content: center;
        max-width: 95px;
        position: relative;
        margin: 10px auto;

        &.expanded{
          max-width: 95px;
        }
      }

      .collection-item__quickadd {
        text-align: center;
        width: 100%;
      }

      .quickAdd {
        margin: 10px auto;
        font-size: 10px;
      }

    }


  }
</style>
