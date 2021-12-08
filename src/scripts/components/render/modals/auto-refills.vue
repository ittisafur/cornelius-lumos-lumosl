<template>
  <div class="auto-refills">
    <div class="modal-header">
      <slot name="header">
        <div class="py-4 lg:p-4 header text-center">
          <div class="text-lg lg:text-2xl mb-4">
            Set up Auto-Refills
          </div>
          <div class="text-md lg:text-lg uppercase">
            Product &amp; Delivery
          </div>
        </div>
      </slot>
    </div>
    <div class="modal-body">
      <slot name="body">
        <div class="py-4 body text-center w-full lg:w-1/2 lg:mx-auto">
          <div class="py-4 lg:p-4 info-box">
            <div>3 Gel Refills (3 Month Supply)</div>
            <div><span class="line-through">${{ currentVariant.selling_plan_allocations[0].compare_at_price | formatMoney }}</span> ${{ currentVariant.selling_plan_allocations[0].per_delivery_price | formatMoney }}</div>
            <div class="flex items-center justify-center">
              <svg
                class="mr-2"
                width="12"
                height="11"
                viewBox="0 0 12 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.8432 6.92863C10.8568 6.90146 10.8568 6.8607 10.8568 6.83353L11.7262 6.83353C11.9708 6.83353 12.0931 6.54824 11.9164 6.37163L10.5987 5.05384C10.49 4.94516 10.327 4.94516 10.2183 5.05384L8.90049 6.37163C8.72387 6.54824 8.84614 6.83353 9.09068 6.83353H10.0145C9.3488 8.49095 7.74573 9.59137 5.93887 9.59137C4.30862 9.59137 2.81422 8.69473 2.05344 7.24109C1.94475 7.03731 1.70022 6.96939 1.49644 7.06448C1.29265 7.17317 1.22473 7.4177 1.31983 7.62148C2.23005 9.33325 3.99615 10.4065 5.93887 10.4065C8.1397 10.4065 10.1096 9.0072 10.8432 6.92863Z"
                  fill="#3991F2"
                />
                <path
                  d="M1.14322 3.19264C1.12963 3.2334 1.11604 3.26057 1.11604 3.30132H0.273749C0.0292119 3.30132 -0.0930568 3.58662 0.0835536 3.76323L1.40134 5.08101C1.51002 5.1897 1.67305 5.1897 1.78173 5.08101L3.09951 3.76323C3.27613 3.58662 3.15386 3.30132 2.90932 3.30132H1.98551C2.71912 1.79334 4.24069 0.815193 5.93887 0.815193C7.46043 0.815193 8.84614 1.58956 9.66127 2.88018C9.71561 2.96169 9.76995 3.05679 9.81071 3.1383C9.91939 3.34208 10.1639 3.41001 10.3677 3.30132C10.5036 3.2334 10.5851 3.08396 10.5851 2.9481C10.5851 2.88018 10.5715 2.81225 10.5307 2.75791C10.4764 2.64922 10.4221 2.55413 10.3541 2.44544C9.38956 0.910291 7.74573 6.86646e-05 5.93887 6.86646e-05C3.83313 6.86646e-05 1.94475 1.24993 1.14322 3.19264Z"
                  fill="#3991F2"
                />
              </svg>
              {{ subscriptionOptions.frequency }}
            </div>
          </div>
          <div class="py-4 lg:p-4">
            <ul class="mx-auto conditions list-disc mint-markers">
              <li>Save {{ subscriptionDiscount }} on whitening gels</li>
              <li v-if="windowWidth < 768">
                <p>Auto-Refill ships &amp; charges</p><p>{{ new Date().toDateString() }}</p>
              </li>
              <li v-else>
                Auto-Refill ships &amp; charges {{ new Date().toDateString() }}
              </li>
              <li>Cancel or modify anytime</li>
            </ul>
          </div>
          <div class="py-4 lg:p-4">
            <div>Choose Whitening Strength</div>
            <div
              class="cursor-pointer"
              @click="triggerModal({ component: 'StrengthInfo', data: {} })"
            >
              <span class="neon-sky-stroke">Help me decide</span>
              <span
                class="icon-inline cursor-pointer"
                v-html="infoIcon"
              />
            </div>
          </div>
          <div class="py-4 lg:p-4">
            <form
              id="add-to-cart-form"
              action="/cart/add"
              method="post"
              enctype="multipart/form-data"
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
                    <label class="hidden my-2">{{ `${ option.toLowerCase() === 'color' ? options.Color.value : option }` }}</label>
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
                          :class="{ option: true, selected: options[option].value === value, inactive: !filterOption(option, value) }"
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
                v-show="false"
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
                        <label class="input__container hid">
                          <input
                            id="autodeliver"
                            v-model="purchaseType"
                            type="radio"
                            name="purchase_type"
                            value="autodeliver"
                          >
                          <span class="radio" />
                        </label>
                        <div class="radio_ell">
                          <div class="radio_ell_inner" />
                        </div>
                        <div class="option__name">
                          Subscribe & Save Additional {{ subscriptionDiscount }}
                        </div>
                      </div>
                      <div
                        :class="{ option: true, onetime: true, selected: purchaseType === 'onetime' }"
                        @click="toggleSelectSubscription('onetime')"
                      >
                        <label class="input__container hid">
                          <input
                            id="onetime"
                            v-model="purchaseType"
                            type="radio"
                            name="purchase_type"
                            value="onetime"
                          >
                          <span class="radio" />
                        </label>
                        <div class="radio_ell">
                          <div class="radio_ell_inner" />
                        </div>
                        <div class="option__name">
                          Buy Once
                        </div>
                      </div>
                    </div>
                    <!-- <input
                      type="hidden"
                      name="properties[shipping_interval_unit_type]"
                      :value="subscriptions.shipping_interval_unit_type"
                    >
                    <input
                      type="hidden"
                      name="properties[subscription_id]"
                      :value="subscriptions.subscription_id"
                    > -->
                  </div>
                </div>
              </div>

              <div
                v-if="subscriptionEnabled"
                class="subscription__input flex justify-center mb-4"
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
            </form>
            <div class="text-sm">
              Teeth aren’t sensitive, coffee or wine drinker, whitened before
            </div>
          </div>
        </div>
      </slot>
    </div>
    <div class="modal-footer flex-col items-center justify-center">
      <slot name="footer">
        <div class="footer w-full lg:w-1/2 lg:mx-auto text-center">
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
          <button
            class="mx-auto modal-default-button"
            @click="hide"
          >
            No Thanks
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
  import { mapGetters, mapActions, mapMutations } from 'vuex';
  import productOptions from '../../../mixins/product-options';
  import AddToCart from '../add-to-cart.vue';
  export default {
    name: "AutoRefills",
    components: { AddToCart },
    mixins: [ productOptions ],
    props: { data: { type: Object, default: () => {} } },
    data: function () {
      return {
        purchaseType: 'autodeliver'
      }
    },
    computed: {
      ...mapGetters({
        windowWidth: 'window-width/WindowWidth'
      })
    },
    beforeMount: function () {
      if (this.data && this.data.quantity) this.quantity = this.data.quantity;
    },
    methods: {
       ...mapActions({
        toggle: 'modal/toggle',
        show: 'modal/show',
        hide: 'modal/hide'
      }),
      ...mapMutations({
        showNotification: 'notifications/showNotification',
        setNotification: 'notifications/setNotification'
      })
    }
  }
</script>

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

  .auto-refills {
    label { margin: 0; }
    
    .header {
      border-bottom: 1px solid $sage;
    }

    .body {
      .info-box {
        border-radius: 5px;
        border: 1px solid $dark-green;
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
                width: calc(100% - 20px);
              }
            }
            &.qty .option {
              flex-direction: column;
              flex: 0 0 31%;
              .option__name, .option__price, .option__discount {
                margin-bottom: .5em;
                // white-space: nowrap;
                text-align: center!important;
              }
            }
            &.subscription {
              margin-bottom: 0!important;
              .option { 
                flex: 0 0 calc(50% - .25rem);

                .option__name {
                  width: calc(100% - 20px);
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
                  justify-content: space-between;
                  align-items: center;
                  border: 0.5px solid $mint;
                  border-radius: 4px;
                  padding: 2em;
                  cursor: pointer;
                  text-align: center;

                  @media screen and (max-width: 1024px) {
                    padding: 1em;
                  }
                  
                  &:not(.selected) {
                    .option__price { 
                      color: $color-error;
                    }
                  }

                  &:not(:last-of-type) {
                    margin-right: .5rem;
                  }
                  
                  &.selected {
                    .option__price { 
                      color: $white;
                    }
                  }

                  &.selected, &.rc_widget__option--active {
                    border-color: $dark-green;
                    background: $pale-mint;
                    .option__name {
                      color: $black;
                    }
                  }
                  
                  .option__name, .option__price, .option__discount {
                    color: black;
                    font-family: 'apercu', sans-serif;
                    font-size: 12px;
                    font-style: normal;
                    font-weight: 500;
                    line-height: 13px;
                    letter-spacing: 0em;
                    // text-align: left;

                    span { line-height: 1.25rem; }
                  }
                  
                  .option__discount {
                    font-weight: 400!important;
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
              top: -262px!important;
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

                &.hid {
                  display: none;
                }

                input[type="radio"] {
                  cursor: pointer;
                  opacity: 0;
                  height: 0;
                  width: 0;

                  &:checked {
                    & + .radio {
                      background-color: $color-primary;

                      &:after {
                        display: block;
                        top: 2px;
                        left: 7px;
                        width: 12px;
                        height: 9px;
                        content: url("data:image/svg+xml,%3Csvg viewBox='0 0 12 9' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.80928 6.71136L1.14432 4.0464L0 5.19072L3.80928 9L11.665 1.14432L10.5206 0L3.80928 6.71136Z' fill='%23FBF9F6'/%3E%3C/svg%3E");
                      }
                    }
                  }
                }

                .radio {
                  cursor: pointer;
                  position: absolute;
                  top: 0;
                  left: 0;
                  height: 25px;
                  width: 25px;
                  background-color: $white;
                  border-radius: 50%;
                  border: 1px solid $color-primary;
                  margin: 0;

                  &:after {
                    content: "";
                    position: absolute;
                    display: none;
                  }
                }
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

    ul {
      width: fit-content;
      li {
        width: fit-content;
        text-align: left;
      }
    }
  }
</style>