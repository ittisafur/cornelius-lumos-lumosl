<template>
  <transition name="fade">
    <div v-if="loaded">
      <div class="pale-mint-fill lg:pt-20 pb-8 lg:pb-24 hero curved--bottom--even">
        <div class="container pdp-container">
          <div class="pdp">
            <div class="lg:flex lg:flex-col lg:justify-center lg:items-center h-full">
              <div class="flex justify-center items-start flex-col lg:flex-row lg:w-full">
                <!-- product image slider -->
                <div
                  class="order-2 lg:order-1 grid__item lg:w-1/4 w-full pt-4 lg:pt-0 px-8 lg:px-2 product__description"
                  aria-hidden="true"
                >
                  <div class="text-black capitalize text-2xl">
                    {{ product.title }}
                  </div>
                  <div class="reviews-stars">
                    <div
                      v-if="reviewsStars"
                      v-html="reviewsStars"
                    />
                  </div>
                  <div class="hidden lg:block">
                    <div
                      class="rte"
                      v-html="product.description || product.body_html"
                    />
                    <div class="blue-stroke">
                      <a href="/pages/how-teeth-whitening-works">Learn How Whitening Gels Work</a>
                    </div>
                  </div>
                </div>

                <div
                  class="order-1 lg:order-2 grid__item lg:w-1/2 w-full lg:px-2 product__images"
                  aria-hidden="true"
                > 
                  <div class="dueling-sliders">
                    <div class="product__images--container lg:flex">
                      <div class="w-full max-w-5xl">
                        <VueSlickCarousel
                          ref="slider_main"
                          v-bind="settings.slider_main"
                          class="carousel__main"
                          @init="onInitCarousel"
                        >
                          <div
                            v-for="(image, idx) in product.media"
                            :key="image.id"
                            :data-id="image.id"
                            :data-position="idx"
                          >
                            <ZoomOnHover
                              :key="image.id"
                              :img-normal="image.src"
                              :scale="2"
                            />
                          </div>
                        </VueSlickCarousel>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="order-3 grid__item lg:w-1/4 w-full px-8 lg:px-2 product__info"
                  :class="isDesktop ? '' : 'mobile'"
                >
                  <div class="pdp__sidebar w-full">
                    <div class="sidebar__inner">
                      <div class="rs-product__info p-4 flex justify-center items-center bg-white">
                        <div class="text-center">
                          <div class="name-review">
                            <div
                              ref="productRatingsContainer"
                              class="ratings"
                            />
                            <h3 class="capitalize text-lg lg:text-xl font-medium">
                              {{ metaBoxTitle }}
                            </h3>
                          </div>
                          <div class="price">
                            <template v-if="!subscriptionEnabled || subscriptionEnabled && purchaseType === 'onetime'">
                              <span
                                v-if="currentVariant.compare_at_price"
                                class="compare-at__product__price line-through"
                              >{{ currentVariant.compare_at_price | formatMoney }}</span>
                              <span class="product__price">${{ currentVariant.price | formatMoney }}</span>
                            </template>
                            <template v-if="subscriptionEnabled && purchaseType === 'autodeliver'">
                              <span class="line-through">${{ currentVariant.selling_plan_allocations[0].compare_at_price | formatMoney }}</span>
                              <span class="product__price">${{ currentVariant.selling_plan_allocations[0].per_delivery_price | formatMoney }}</span>
                            </template>
                          </div>
                          <div
                            v-if="currentVariant && currentVariant.available && currentVariant.inventory_management === 'shopify' && currentVariant.inventory_quantity <= 0"
                            class="out-of-stock-block-maytake"
                          >
                            This item may take up to 3 days to ship.
                          </div>
                          <div class="text-gray-500 text-sm">
                            <span v-html="formatLineBreaks(metaBoxDesc)" />
                            <span
                              v-if="false"
                              class="icon-inline cursor-pointer"
                              @click="triggerModal({ component: 'StrengthInfo', data: {} })"
                              v-html="infoIcon"
                            />
                          </div>
                        </div>
                      </div>

                      <form
                        id="add-to-cart-form"
                        action="/cart/add"
                        method="post"
                        enctype="multipart/form-data"
                        class="mt-4"
                      >
                        <div
                          v-if="product && product.variants && product.variants.length <= 1"
                          id="rs-filtervariant"
                          class="js"
                        >
                          <div class="hidden-selectors" />
                        </div>

                        <input
                          type="hidden"
                          name="id"
                          :data-productid="product.id"
                          :value="currentVariant.id"
                        >

                        <div
                          v-if="product.handle === 'teeth-whitening-gel-for-trays'"
                          class="mb-1 text-center"
                        >
                          <div class="text-lg ">
                            Choose Whitening Strength
                          </div>
                          <div>
                            <a
                              class="neon-sky-stroke cursor-pointer text-md"
                              @click="triggerModal({ component: 'StrengthInfo', data: {} })"
                            >Help Me Decide</a>
                          </div>
                        </div>

                        <!-- option selectors -->
                        <div class="flex flex-wrap justify-between">
                          <div
                            v-for="(option, idx) in product.options"
                            v-show="options[option].count > 1"
                            :key="idx"
                            :class="{ 'option__selectors': true, [ slugify(option) ]: true, 'w-full': Object.keys(options).length === 1 }"
                          >
                            <div
                              :class="[ { option__selector: true }, slugify(option), optionType[option], { multiple: Object.keys(options).length > 1 } ]"
                            >
                              <label class="my-2 text-sm">{{ `${ option.toLowerCase() === 'color' ? options.Color.value : option }` }}</label>
                              <div
                                :class="{ open: options[option].open, options__container: true }"
                                @mouseleave="options[ option ].open = false"
                                @click="toggleSelect(option, calcType(option))"
                              >
                                <div
                                  class="current__option option"
                                  v-html="renderCurrentOption(option, idx)"
                                />
                                <div class="options">
                                  <div
                                    v-for="(variant, value) in getOptions(product, idx)"
                                    :key="value"
                                    class="flex justify-center items-center"
                                    :class="{ option: true, selected: options[option].value === value, inactive: !filterOption(option, value) }"
                                    :style="{ width: `calc((100% / ${Object.keys(getOptions(product, idx)).length}) - 0.25rem)` }"
                                    @click="setOption(option, value)"
                                  >
                                    <!-- <img :src="variant.featured_image.src" /> -->
                                    <div
                                      v-if="optionType[option] === 'swatch'"
                                      :class="{ 'swatch': true, 'swatch-middle': optionType[option] === 'swatch' }"
                                    >
                                      <div
                                        v-if="optionType[option] === 'swatch'"
                                        class="swatch-inner"
                                      >
                                        <div
                                          :class="`${slugify(option)}`"
                                          :style="getSwatch(value)"
                                        />
                                      </div>
                                    </div>
                                    <div
                                      class="option__name"
                                      v-html="formatLineBreaks(value)"
                                    />
                                  </div>
                                </div>
                              </div>
                              <label
                                v-if="option.toLowerCase() === 'color'"
                                class="color__label text-md"
                              >{{ option }}</label>
                            </div>
                          </div>
                        </div>

                        <!-- subscription options -->
                        <div
                          v-if="subscriptionEnabled"
                          class="option__selectors"
                        >
                          <div class="option__selector subscription box multiple">
                            <label class="text-sm">Frequency</label>
                            <div
                              :class="{ options__container: true }"
                            >
                              <div
                                v-if="product.selling_plan_groups"
                                class="options"
                              >
                                <div
                                  :class="{ option: true, subscription: true, selected: purchaseType === 'autodeliver' }"
                                  @click="toggleSelectSubscription('autodeliver')"
                                >
                                  <div class="option__name">
                                    Subscribe & Save Additional {{ subscriptionDiscount }}
                                  </div>
                                </div>
                                <div
                                  :class="{ option: true, onetime: true, selected: purchaseType === 'onetime' }"
                                  @click="toggleSelectSubscription('onetime')"
                                >
                                  <div class="option__name">
                                    Buy Once
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="subscriptionEnabled"
                          class="subscription__input flex justify-start mb-4"
                        >
                          <label class="input__container" />
                          <div class="label info">
                            Subscribe and never run out. <a
                              class="cancel__subscription"
                              href="#"
                            >Cancel Anytime!</a>
                          </div>
                          <div class="rc_popup">
                            <div
                              class="rc_popup__hover relative cursor-pointer"
                              @mouseover="reChargeInfo = true"
                              @mouseleave="reChargeInfo = false"
                            >
                              <span v-html="infoIcon" />
                              <div
                                v-if="reChargeInfo"
                                class="rc_popup__block absolute z-1"
                                :class="{ show: reChargeInfo }"
                              >
                                <div class="rc_popup__block__content p-4">
                                  <div
                                    class="rc_popup__close"
                                    style="display: none;"
                                  >
                                    x
                                  </div>
                                  <strong>How subscriptions work</strong>
                                  <br><br>Products are automatically delivered on your schedule. No obligation, modify or cancel your subscription anytime.<br>
                                  <a
                                    class="neon-sky-stroke"
                                    href="/pages/subscription-orders-by-recharge"
                                    target="_blank"
                                    aria-label="Learn more about ReCharge Payments"
                                  >Learn more...</a>
                                </div>
                                <div class="rc_popup__block__footer flex justify-end pb-4">
                                  <a
                                    href="http://rechargepayments.com/subscribe-with-recharge?utm_source=shopify%20store&amp;utm_medium=customer%20link&amp;utm_campaign=Shopify%20store%20back%20link&amp;shop_name=J.L.%20Hufford&amp;shop=j-l-hufford.myshopify.com"
                                    target="_blank"
                                    aria-label="ReCharge Payments homepage"
                                  >
                                    <img
                                      src="//rechargestatic-bootstrapheroes.netdna-ssl.com/static/images/widget/rc_widget__banner@2x.png"
                                      height="28"
                                      width="153"
                                      alt="ReCharge Subscriptions company banner"
                                      class="rc_popup__badge"
                                    >
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div
                          v-if="subscriptionEnabled && subscriptionFrequencies && subscriptionFrequencies.length > 1"
                          class="subscription__options"
                        >
                          <div class="subscription__option">
                            <transition name="subscription__frequency">
                              <div
                                v-if="purchaseType === 'autodeliver'"
                                class="subscription__row"
                              >
                                <label class="input__container" />
                                <div class="option__selectors mb-0">
                                  <div class="subscription__frequency__options option__selector select mb-0">
                                    <div
                                      :class="{ open: subscriptionOptions.open, options__container: true }"
                                      @mouseleave="subscriptionOptions.open = false"
                                      @click="toggleFrequencySelect()"
                                    >
                                      <div
                                        class="current__option option"
                                        v-html="renderSubscriptionFrequency(subscriptionOptions.frequency)"
                                      />
                                      <div class="options">
                                        <div
                                          v-for="(frequency, idx) in subscriptionFrequencies"
                                          :key="idx"
                                          :data-id="idx"
                                          :class="{ option: true, selected: subscriptionOptions.frequency === frequency }"
                                          @click="setSubscriptionFrequency(frequency, idx)"
                                        >
                                          <div class="option__name">
                                            {{ frequency }}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </transition>
                          </div>
                        </div>

                        <!-- ATC -->
                        <AddToCart
                          id="atc__btn"
                          :key="quantity"
                          class="mb-4"
                          :current-variant="currentVariant"
                          :subscription-options="subscriptionOptions"
                          :purchase-type="purchaseType"
                          :init-quantity="quantity"
                          @quantity="updateProductQuantity"
                        />

                        <SocialShare
                          :shop-url="shopUrl"
                          :share-permalink="productUrl"
                          :share-image="product.media && product.media.length && product.media[0].src"
                          :share-description="metaGlobal && metaGlobal.description_tag"
                          :share-title="product.title"
                          class="px-16 md:px-4 xl:px-16 mb-4"
                        />

                        <div
                          v-if="metaSubscriptionsSavingsText"
                          class="mb-4 text-center"
                        >
                          <span
                            class="inline inline__contents"
                            v-html="metaSubscriptionsSavingsText"
                          />
                          <span
                            class="icon-inline cursor-pointer"
                            @click="triggerModal({ component: 'StrengthInfo', data: {} })"
                            v-html="infoIcon"
                          />
                        </div>

                        <AutoRefillsButton
                          v-if="Object.keys(supplementarySubscriptionProduct).length && showAutoRefills"
                          class="mb-4"
                          :product="supplementarySubscriptionProduct"
                        />

                        <div
                          v-if="product.handle !== 'teeth-whitening-gel-for-trays'"
                          class="mb-4 text-xs"
                        >
                          <a
                            href="/products/teeth-whitening-gel-for-trays"
                            class="neon-sky-stroke"
                          >Already have trays and just need whitening gels?</a>
                        </div>
                        <div
                          v-else
                          class="mb-4 text-xs"
                        >
                          <a
                            href="/products/custom-teeth-whitening-trays"
                            class="neon-sky-stroke"
                          >Already have whitening gels and just need new trays?</a>
                        </div>
                        <div class="icon-inline mb-4 text-xs">
                          <span v-html="shippingIcon" />You Get Free Shipping
                        </div>
                        <div class="icon-inline mb-4 text-xs">
                          <span v-html="qualityIcon" />Quality Guarantee
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="block lg:hidden p-8 pdp">
        <div class="product__description">
          <div
            class="rte"
            v-html="product.description || product.body_html"
          />
          <div class="blue-stroke">
            <a href="/pages/how-teeth-whitening-works">Learn How Whitening Gels Work</a>
          </div>
        </div>
      </div>
      <!-- sticky ATC -->
      <div
        class="sticky__atc"
        :class="{ stuck: isStuck }"
        :style="{ top: headerHeight + 'px' }"
      >
        <div class="flex flex-wrap justify-between items-center max-w-screen-xl mx-auto text-xs lg:text-lg">
          <div class="w-1/12 lg:p-4">
            <img :src="currentVariant.featured_image || product.images[0]">
          </div>
          <div class="w-5/12 lg:w-7/12 pl-2 lg:pl-0 lg:p-4">
            <div>{{ product.title }}</div>
            <div>{{ currentVariant.title }}</div>
          </div>
          <AddToCart
            :key="`sticky-${quantity}`"
            class="w-1/2 lg:w-1/3 lg:p-4"
            :current-variant="currentVariant"
            :subscription-options="subscriptionOptions"
            :purchase-type="purchaseType"
            :init-quantity="quantity"
            @quantity="updateProductQuantity"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import { mapGetters } from 'vuex'
  // import _ from '../../helpers/lo';
  import VueSlickCarousel from 'vue-slick-carousel';
  import AddToCart from './add-to-cart.vue';
  import AutoRefillsButton from './auto-refills-button.vue';
  import ZoomOnHover from '../utilities/zoom-on-hover.vue';
  import 'vue-slick-carousel/dist/vue-slick-carousel.css';
  import productOptions from '../../mixins/product-options';
  import SocialShare from './social-share.vue';

  const $mobile = 768;
  const breakpoints = {
    lgl: 1200,
    lg: 1024,
    mdl: 992,
    md: 768,
    sm: 375,
    sms: 320,
  };

  export default {
    name: "RsProduct",
    components: {
      VueSlickCarousel,
      AddToCart,
      AutoRefillsButton,
      ZoomOnHover,
      SocialShare
    },
    mixins: [ productOptions ],
    props: {
      shopUrl: {
        type: String,
        default: ""
      },
      productUrl: {
        type: String,
        default: ""
      }
    },
    data: function () {
      return {
        settings: {
          slider_main: {
            slidesToShow: 1,
            slidesToScroll: 1,
            swipeToSlide: true,
            arrows: false,
            dots: true,
            // fade: true,
          }
        },
        offsetTop: 0,
        isStuck: false,
        headerHeight: 0,
        reChargeInfo: false,
      }
    },
    computed: {
      ...mapGetters({
        windowWidth: 'window-width/WindowWidth'
      }),
      isDesktop: function () {
        return this.windowWidth > breakpoints.mdl
      },
      getPrice: function () {
        return this.purchaseType === "autodeliver" && this.currentVariant.selling_plan_allocations && this.currentVariant.selling_plan_allocations[0].price ? this.formatMoney(this.currentVariant.selling_plan_allocations[0].price) : this.formatMoney(this.currentVariant.price);
      },
      featuredImage: function () {
        //return helpers.getSizedImageUrl(this.product.featured_image, '1024');
        return this.product.featured_image;
      },
    },
    watch: {
      offsetTop () {
        this.callbackFunc()
      }
    },
    created () {
      window.addEventListener('scroll', this.onScroll);
      window.addEventListener('resize', this.scrollListener);
    },
    destroyed () {
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.scrollListener);
    },
    beforeMount: function () {},
    mounted: function () {
      this.headerHeight = document.getElementById('header').clientHeight;
    },
    methods: {
      scrollListener: function () {
        this.headerHeight = document.getElementById('header').clientHeight;
        this.isStuck = false;
        if ( this.windowWidth < $mobile ) {
          window.addEventListener('scroll', this.onScroll);
        } else {
          window.removeEventListener('scroll', this.onScroll);
        }
      },
      onInitCarousel: function () {
        let carousel = this.$refs.slider_main; // || this.$refs.slider_nav;
        if ( carousel && this.currentVariant && this.currentVariant.featured_image ) setTimeout( () => { carousel.goTo(this.currentVariant.featured_image.position - 1 ) }, 500 );
      },
      // mobile sticky ATC:
      onScroll: function () {
        // console.log(e);
        if ( this.headerHeight !== document.getElementById('header').clientHeight ) this.headerHeight = document.getElementById('header').clientHeight;
        this.offsetTop = window.pageYOffset || document.documentElement.scrollTop
      },
      isElementInViewport: function (el) {
        var rect = el.getBoundingClientRect();
        return (
          // rect.top >= 0 &&
          // rect.left >= 0 &&
          // rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          // rect.right <= (window.innerWidth || document.documentElement.clientWidth)
          rect.top < this.headerHeight
        );
      },
      callbackFunc: function () {
        let el = document.getElementById("atc__btn");
        if (this.isElementInViewport(el)) {
          this.isStuck = true;
        } else {
          this.isStuck = false;
        }
      }
    },
  }
</script>

<!--style lang="scss" scoped-->
<style lang="scss">
  $color-primary: #BFFAEA;
  $color-secondary: #F0F8F6;
  $mint: #BFFAEA;
  $pale-mint: #F0F8F6;
  $sage: #7DADA0;
  $dark-green: #21493E;
  $blue: #3991F2;
  $black: #29302E;
  $white: #FFFFFF;
  $color-success: #189D3D;
  $color-error: #CE0000;
  $mobile: 767px;
  $desktop: 1023px;

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  section[data-section-type="product"] {
    .pdp {
      .product {
        &__description {
          .brand-logo {
            width: 110px;
          }

          .rte {
            font-size: 16px;
            font-weight: 400;
            div, h3, ul { margin-bottom: 1rem; }
            h3 {
              font-weight: 400;
            }
            ul {
              padding-left: 1rem;
              list-style: initial!important;
              list-style-image: url("data:image/svg+xml,%3Csvg width='4' height='9' viewBox='0 0 4 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 1C0.786193 1 3.12941 2.03411 3.12941 4.37647C3.12941 7.01176 0.823529 8 0 8' stroke='%2362D4B5'/%3E%3C/svg%3E")!important;
              li {
                font-size: 12px;
              }
            }
          }
        }

        &__images {
          .slick-slider {
            .slick-current > div, img {
              border-radius: 6px;
            }
          }

          .carousel__main {
            &.fade {
              .slick-slide {
                visibility: hidden;

                &.slick-active { visibility: visible; }
              }
            }
          }

          .carousel__nav {
            position: relative;
            margin-top: -10px;
            .slick-list {
              max-height: 800px;
            }

            .slick-slide {
              padding: 1rem 0;

              [data-position] {
                display: block!important;
              }
            }

            .slick-current {
              > div { border: 1px solid $color-primary; }
            }

            .slick-arrow {
              position: relative;
              color: transparent;
              background: transparent;
              width: 32px;
              height: 32px;
              line-height: 32px;
              padding: 0;
              margin: 0 auto;
              opacity: 0.7;

              &.slick-prev {
                left: unset!important;
                margin: 20px auto 0 auto!important;
                
                &::before {
                  content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDE2YS40OC40OCwwLDAsMS0uMzQtLjE0TDQuMTcsOC45M2EuNTQuNTQsMCwwLDEsMC0uNzUuNS41LDAsMCwxLC43MSwwaDBMMTIsMTQuNzVsNy4xNC02LjYxYS41LjUsMCwwLDEsLjcxLDBoMGEuNTQuNTQsMCwwLDEsMCwuNzVsLTcuNDksNi45M0EuNS41LDAsMCwxLDEyLDE2WiIvPjwvc3ZnPg==");
                  position: absolute;
                  transform: rotate(180deg);
                  width: 100%;
                  height: 100%;
                  left: 0px;
                }
              }

              &.slick-next {
                right: unset!important;
                margin: 25px auto 0 auto!important;
                
                &::before {
                  content: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyLDE2YS40OC40OCwwLDAsMS0uMzQtLjE0TDQuMTcsOC45M2EuNTQuNTQsMCwwLDEsMC0uNzUuNS41LDAsMCwxLC43MSwwaDBMMTIsMTQuNzVsNy4xNC02LjYxYS41LjUsMCwwLDEsLjcxLDBoMGEuNTQuNTQsMCwwLDEsMCwuNzVsLTcuNDksNi45M0EuNS41LDAsMCwxLDEyLDE2WiIvPjwvc3ZnPg==");
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  left: 0px;
                }
              }
            }

            &.full-width {
              max-width: unset;
              width: 100%;
              // padding: 0 60px;

              .slick-arrow {
                margin: 0;
                position: absolute;
                width: 44px;
                height: 44px;
                top: 30%;

                &.slick-prev {
                  left: 5px;

                  &::before {
                    transform: rotate(90deg);
                  }
                }

                &.slick-next {
                  right: 5px;

                  &::before {
                    transform: rotate(270deg);
                  }
                }
              }

              .slick-current {
                & > div {
                  border: none;
                }
              }

              .slick-dots {
                list-style: none;
                margin: 0;
                text-align: center;
                padding: 0;

                @media (max-width:$mobile) {
                  display: none!important;
                }

                li {
                  position: relative;
                  display: inline-block;
                  padding: 0;

                  button {
                    position: relative;
                    background: transparent;
                    display: block;
                    padding: 20px;
                    cursor: pointer;
                    outline: none;
                    color: transparent;

                    &::after {
                      content: "";
                      position: absolute;
                      width: 8px;
                      height: 8px;
                      background-color: $mint;
                      border: 1px solid $mint;
                      border-radius: 50%;
                    }

                    & + li {
                      margin-left: 1rem;
                    }

                    @media (max-width:$mobile) {
                      padding: 5px;

                      &:after {
                        top: 0;
                        left: 0;
                        transform: translate(-50%, -50%);
                      }

                    }
                  }

                  &.slick-active {
                    button {
                      &::after {
                        background-color: $white;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        &__info {
          .gray-line { margin: 1em 0; }
          .pdp__sidebar {
            .sidebar__inner {
              .rs-product__info {
                // border: 1px solid $sage;
                border-radius: 5px;
                box-shadow: 0 0 5px rgba(0,0,0,0.15);

                div:not(:last-child) { margin-bottom: 1em; }
                .name-review {
                  h1 {
                    font-size: 52px;
                    font-family: 'apercu', serif;
                    line-height: 52px;
                    letter-spacing: 1px;
                    font-weight: 500;
                    @media (max-width:$mobile) {
                      font-size: 28px;
                      line-height: 28px;  
                    }
                  }
                }
                .price {
                  .compare-at__product__price {
                    text-decoration: line-through;
                    margin-right: .5em;
                    opacity: .7;
                  }
                  .product__price {
                    font-weight: 700;
                    font-size: 1.1em;
                    color: $black;
                    letter-spacing: 1px;
                  }
                }
                
                .question__stock {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;

                  .stock {
                    line-height: 26px;
                    margin-bottom: 1px;

                    .stock__status {
                      color: $color-primary;
                    }
                  }

                  .brand-logo {
                    width: 20%;
                    position: relative;

                    img {
                      position: absolute;
                      right: 0;
                      top: 50%;
                      transform: translateY(-50%);
                    }
                  }
                }
              }

              form[action="/cart/add"] {
                .option__selectors {
                  &:not(.mb-0) {
                    margin-bottom: 1em;
                  }

                  .rc_widget__option__selector {
                    display: flex;
                  }
                  
                  .rc_widget__option__input {
                    display: none!important;
                  }

                  .option__selector {
                    width: 100%;

                    &:not(.mb-0) {
                      margin-bottom: 1em;
                    }

                    label { margin-bottom: .5em; }
                    
                    .options {
                      display: flex;
                      justify-content: space-between;
                    }
                    
                    &.type .option { 
                      flex: 0 0 calc(50% - .25rem);

                      .option__name {
                        text-align: center;
                      }
                    }
                    &.qty .option {
                      flex-direction: column;
                      flex: 0 0 31%;
                      .option__name, .option__price, .option__discount {
                        margin-bottom: .5em;
                        // white-space: nowrap;
                        text-align: center;
                      }
                    }
                    &.subscription {
                      margin-bottom: 0!important;
                      .option { 
                        flex: 0 0 calc(50% - .25rem);

                        .option__name {
                          text-align: center;
                        }
                      }
                    }
                    &.qty .option div { padding-left: 0!important; }
                    &.qty .option .option__name { 
                      margin-top: -2px!important;
                    }                             
                    &.qty { display: none!important; }

                    &.error { border: 1px solid $color-primary; }

                    &.subscription__frequency__options {
                      .options__container {
                        .option {
                          .option__name { margin-left: 0!important; }
                        }
                      }
                    }
                    
                    &.select {
                      display: block;

                      &.color {
                        display: flex;
                        align-items: center;

                        label {
                          flex: 25%;
                        }

                        .options__container {
                          flex: 75%;
                        }
                      }

                      label {
                        margin-bottom: .5em;
                      }

                      .options__container {
                        position: relative;

                        &.open {
                          .chevron {
                            svg { transform: rotate(180deg); }
                          }
                          
                          .options {
                            opacity: 1;
                            z-index: 1;
                            max-height: 350px;
                          }
                        }

                        .options {
                          opacity: 0;
                          max-height: 0;
                          transition: all .1s ease-in-out;
                          width: 100%;
                          overflow: auto;
                          position: absolute;
                          z-index: -1;
                          background: $white;
                          border: 1px solid $black;
                          display: block;
                          justify-content: space-between;
                        }

                        .option {
                          padding: 1em;
                          display: flex;
                          align-items: center;
                          cursor: pointer;

                          &:not(.current__option):not(:last-child) {
                            border-bottom: 1px solid $black;
                          }
                          
                          &:not(.current__option):not(.disabled):hover {
                            background: rgba(124, 167, 173, .3);
                          }

                          &.disabled { opacity: .5; }

                          &.current__option {
                            border: 1px solid $black;

                            .option__name {
                              flex: 1 1 95%;
                            }
                            .chevron {
                              flex: 1 1 5%;
                              text-align: center;
                              svg {
                                transition: all .4s ease-in-out;
                              }
                            }
                          }

                          .option__name {
                            flex: 1 1 75%;
                            margin-left: 2em;
                          }
                        }

                      }
                    } // .select

                    &.box {
                      width: 100%;

                      &.multiple {
                        display: inline-block;
                        &:first-child { margin-right: .5em; }
                      }

                      .current__option {
                        display: none;
                      }

                      .options {
                        display: flex;
                        justify-content: space-between;

                        .option, .rc_widget__option {
                          display: flex;
                          justify-content: center;
                          align-items: center;
                          border: 0.5px solid $mint;
                          border-radius: 4px;
                          padding: 1em;
                          cursor: pointer;
                          text-align: center;
                          
                          &:not(.selected) {
                            .option__price { 
                              color: $color-error;
                            }
                          }
                          
                          &.selected {
                            .option__price { 
                              color: $white;
                            }
                          }

                          &.selected, &.rc_widget__option--active {
                            border-color: $dark-green;
                            background: $white;
                            .option__name {
                              color: $black;
                            }
                          }
                          
                          .option__name, .option__price, .option__discount {
                            color: black;
                            font-family: 'apercu', sans-serif;
                            font-size: 12px;
                            font-style: normal;
                            line-height: 13px;
                            letter-spacing: 0em;
                            &:not(.option__discount) {
                              font-weight: 500;
                            }

                            span { line-height: 1.25rem; }
                          }
                          
                          .option__discount {
                            font-weight: 400;
                          }
                          
                          &.rc_widget__option {
                            display: flex;
                            align-items: center;
                            border: 0.5px solid $pale-mint;
                            border-radius: 4px;
                            padding: 1em;
                            margin-bottom: .5em;
                            // width: 48%;
                            cursor: pointer;
                            text-align: center;
                            width: 157px;
                            height: 46px;

                            &.rc_widget__option--active {
                              border-color: $mint;
                              background: $mint;
                              .option__name {
                                color: white;
                              }
                            }
                            
                            .option__name,.option__price {
                              color: $black;
                              font-family: 'apercu', sans-serif;
                              font-size: 12px;
                              font-style: normal;
                              font-weight: 500;
                              line-height: 13px;
                              letter-spacing: 0em;
                              text-align: left;
                            }
                          }
                        }
                      }
                    }

                  }

                } // .option__selectors

                .subscription__input {
                  .rc_popup {
                    padding: 0 0 0 8px!important;

                    &__hover {
                      height: auto!important;
                    }

                    &__block {
                      &:before {
                        left: 260px!important;
                      }
                      top: 30px!important;
                      left: -262px!important;
                      background: $white!important;
                      border: 0.5px solid $pale-mint!important;
                    }

                  }
                  
                  .label {
                    &.info {
                      font-family: 'apercu', sans-serif;
                      font-size: 11px;
                      font-style: normal;
                      font-weight: 400;
                      line-height: 18px;
                      letter-spacing: 0em;
                      text-align: left;
                    }
                  }
                  
                  .rc_container {
                    display: none!important;
                  }
                }

                .subscription__options {
                  // margin-bottom: 1em;

                  .subscription__option {
                    // padding: 1em;

                    // transition for subscription frequency select
                    .subscription__frequency-enter, .subscription__frequency-leave-to {
                      opacity: 0;
                      max-height: 0;
                    }
                    .subscription__frequency-enter-to, .subscription__frequency-leave {
                      opacity: 1;
                      max-height: 10em;
                    }
                    .subscription__frequency-enter-active, .subscription__frequency-leave-active {
                      transition : all .4s ease-in-out;
                    }

                    &.selected {
                      border: 0.5px solid $pale-mint;
                      border-radius: 4px;
                      background: $mint;

                      .subscription__row {
                        .subscription__label {
                          label {
                            font-weight: 700!important;
                          }
                        }
                        .subscription__price {
                          font-weight: 700;
                        }
                      }
                    }

                    &:hover input + .radio {
                      background-color: $pale-mint;
                    }

                    .subscription__row {
                      display: flex;
                      margin: .5em 0;
                      
                      .input__container {
                        position: relative;
                        // flex: 0 1 10%;
                      }
                      .subscription__label {
                        flex: 0 1 75%;
                        display: flex;
                        align-items: center;

                        &.info { font-size: .8em; }

                        .cancel__subscription {
                          margin-left: .5em;
                          text-decoration: underline;
                        }

                        svg {
                          margin-left: .5em;
                        }

                        label {
                          font-weight: normal;
                        }
                      }
                      .subscription__price {
                        flex: 0 1 0%;
                      }
                      .option__selectors {
                        flex: 0 1 100%;
                        justify-content: flex-end;
                      }
                    }
                    
                  }
                } // .subscription__options
              }
            }
          }

          &.mobile {
            margin-top: 1rem;
          }
        }
      }
    }
    .sticky__atc {
      // display: none;
      visibility: hidden;
      opacity: 0;
      z-index: -1;
      top: 0;
      left: 0;
      position: fixed;
      width: 100%;
      background: #fff;
      padding: 1em;
      // border-bottom: 1px solid $color-secondary;
      box-shadow: 0 0 5px rgb(0 0 0 / 15%);
      transition: opacity .4s ease-in-out;

      &.stuck {
        // display: block;
        visibility: visible;
        opacity: 1;
        z-index: 98;

        .flex {
          > div {
            // width: calc(100%/6)!important;
            &.color { width: 30%; }

            @media (max-width:$desktop) {
              &.color { width: 100%; }
            }

            &.option__selectors {
              margin-bottom: 0!important;
              .option__selector { margin-bottom: 0!important; }
            }

            .quantity {
              border: 1px solid $color-primary;

              input#quantity { padding-left: .5em; padding-right: .5em; }

              @media (max-width:$desktop) {
                margin-left: .25rem!important;
                flex: calc(40% - .25rem)!important;
              }
            }

            @media (max-width:$desktop) {
              .atc { flex: 60%!important; }
            }

            @media (max-width:$desktop) {
              &#atc__btn { width: 100%; margin-top: .5em; }
            }
          }
        }
      }
    }
  }
</style>
