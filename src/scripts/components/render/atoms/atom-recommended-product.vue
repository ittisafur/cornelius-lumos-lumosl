<template>
  <transition name="fade">
    <div class="recommended-product single-item">
      <div class="item-img">
        <a :href="product.handle">
          <img
            v-if="product && product.featured_image"
            :src="product.featured_image"
            :title="product.title"
          >
        </a>
      </div>
      <div class="item-body">
        <div class="item-title text-sm mb-4 font-bold">
          <a :href="product.handle">
            {{ product.title }}
          </a>
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
                    <div class="option__name">
                      {{ value }}
                    </div>
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
          v-if="subscriptionEnabled && !subscriptionRequired && getPrice !== 'Free'"
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

        <div class="item__info">
          <div class="item-price font-bold">
            <template v-if="!subscriptionEnabled || subscriptionEnabled && purchaseType === 'onetime'">
              <span
                v-if="currentVariant.compare_at_price"
                class="compare-at__product__price product__price line-through"
              >{{ currentVariant.compare_at_price | formatMoney }}</span>
              <span class="product__price text-neon-red">${{ currentVariant.price | formatMoney }}</span>
            </template>
            <template v-if="subscriptionEnabled && purchaseType === 'autodeliver'">
              <span class="line-through">${{ currentVariant.selling_plan_allocations[0].compare_at_price | formatMoney }}</span>
              <span class="product__price text-neon-red">${{ currentVariant.selling_plan_allocations[0].per_delivery_price | formatMoney }}</span>
            </template>
          </div>
          <div class="item-cta">
            <button
              class="recommended-atc"
              @click.prevent="addRecommendedItem(product)"
            >
              {{ atcText }}
            </button>
          </div>
        </div>
      </div>
    </div> 
  </transition>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import productOptions from '../../../mixins/product-options';

  const breakpoints = {
    lgl: 1279,
    lg: 1023,
    mdl: 992,
    md: 767,
    sm: 413,
    sms: 320,
  };

  export default {
    name: "AtomRecommendedProduct",
    mixins: [ productOptions ],
    data: function () {
      return {}
    },
    computed: {
      ...mapGetters({
        windowWidth: 'window-width/WindowWidth'
      }),
      isDesktop: function() {
        return this.windowWidth > breakpoints.mdl
      },
      shopUrl: function () {
        return window.location.origin;
      },
      productUrl: function () {
        return `/products/${this.product.handle}`;
      },
      featuredImage: function() {
        //return helpers.getSizedImageUrl(this.product.featured_image, '1024');
        return this.product.featured_image;
      },
      atcText: function () {
        return this.purchaseType === 'autodeliver' ? 'Add Subscription to Cart' : 'Add to Cart';
      }
    },
    watch: {},
    created () {},
    destroyed () {},
    beforeMount: function () {},
    mounted: function () {
      this.isMounted = true;
    },
    methods: {
      ...mapActions({
        addItem: 'cart/addCartItems',
      }),
      addRecommendedItem() {
        let variantId = this.currentVariant.id,
            properties = { "UHLEP": true },
            cart = { items: [] },

            item = {
              id: variantId,
              quantity: 1,
              properties: properties
            };

        // check for subscriptions:
        if ( this.purchaseType === "autodeliver" && this.currentVariant.selling_plan_allocations && this.subscriptionOptions.idx !== undefined && this.currentVariant.selling_plan_allocations[this.subscriptionOptions.idx] && this.currentVariant.selling_plan_allocations[this.subscriptionOptions.idx].selling_plan_id ) {
          item.selling_plan = this.currentVariant.selling_plan_allocations[this.subscriptionOptions.idx].selling_plan_id;
          item.properties = {...item.properties, ...{ Subscription: this.subscriptionOptions?.frequency }}
        }

        cart.items.push( item );
        this.addCartItems( cart );
      }
    },
  }
</script>

<style lang="scss" scoped>
  $color-primary: #BFFAEA;
  $color-secondary: #F0F8F6;
  $mint: #BFFAEA;
  $pale-mint: #F0F8F6;
  $dark-green: #21493E;
  $sage: #7DADA0;
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

  .blue-stroke { color: $blue; }
  .blue-fill { background: $blue; }
  .mint-stroke { color: $mint; }
  .mint-fill { background: $mint; }

  .recommended-product {
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
</style>