import { mapActions, mapGetters } from 'vuex';
import axios from "axios";
import helpers from "../helpers/helpers";

export default {
  props: { productLiquid: { type: Object, default: () => {} }, productJsonUrl: { type: String, default: "" }, subscriptionProductHandle: { type: String, default: "" }, metaBoxTitle: { type: String, default: "" }, metaBoxDesc: { type: String, default: "" }, metaSubscriptionsSavingsText: { type: String, default: "" }, metaCf: { type: Object, default: () => {} }, metaGlobal: { type: Object, default: () => {} }, metaSubscriptions: { type: Object, default: () => {} }, metaVendor: { type: Object, default: () => {} }, reviewsStars: { type: String, default: "" }, reviewsWidget: { type: String, default: "" } },
  data: function () {
    return {
      loaded: false,
      product: {},
      supplementarySubscriptionProduct: {},
      currentVariant: {},
      options: {},
      optionOrder: {},
      optionType: { Strength: "box" },
      reChargeInfo: false,
      subscriptionOptions: {},
      purchaseType: 'autodeliver',
      quantity: 1,
      shippingIcon: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.4981 7.15091L19.498 7.1506C18.8253 5.49007 18.0664 4.52825 17.3589 3.98151C16.6504 3.43403 15.9975 3.30599 15.5444 3.30599H13.6898V2.40403C13.6898 1.58843 13.0263 0.925 12.2102 0.925H4.59728C3.78174 0.925 3.11767 1.58841 3.11767 2.40403V2.57414H1H0.925V2.64914V3.14168V3.21668H1H5.43286H5.50785V3.14168V2.64914V2.57414H5.43286H3.75963V2.40403C3.75963 1.94251 4.1357 1.56696 4.5967 1.56696H12.2102C12.6711 1.56696 13.0467 1.94245 13.0467 2.40403V10.5933H8.96536C8.72479 9.80734 7.99997 9.23095 7.13588 9.23095C6.27072 9.23095 5.54528 9.80729 5.30467 10.5933H4.59612C4.13509 10.5933 3.75905 10.2177 3.75905 9.75677V6.29534H6.41736H6.49235V6.22034V5.7278V5.6528H6.41736H1.98566H1.91066V5.7278V6.22034V6.29534H1.98566H3.11767V9.75677C3.11767 10.5724 3.78174 11.2358 4.59728 11.2358H5.2165C5.26038 12.2571 6.10437 13.075 7.13704 13.075C8.16867 13.075 9.01144 12.2571 9.05527 11.2358H13.9066C13.9505 12.2571 14.7945 13.075 15.8266 13.075C16.8588 13.075 17.7023 12.257 17.7455 11.235L18.0398 11.2341L18.0398 11.2346L18.0485 11.2335C18.6458 11.1615 19.0183 10.9367 19.2397 10.6442C19.4597 10.3536 19.5226 10.0068 19.5226 9.70462V7.2709H19.5227L19.5226 7.26817C19.5211 7.22817 19.5131 7.18833 19.4981 7.15091ZM18.3385 7.37765L18.3385 7.37764L18.3377 7.37581C17.9465 6.46015 17.4993 5.73506 17.0264 5.23764C16.5542 4.74085 16.0492 4.46428 15.5441 4.46428H14.4397C14.2628 4.46428 14.1184 4.60784 14.1184 4.78555V8.33879C14.1184 8.51638 14.2621 8.66006 14.4397 8.66006H18.0416C18.2192 8.66006 18.3629 8.51638 18.3629 8.33879V7.50205C18.3629 7.45861 18.3538 7.41623 18.3385 7.37765ZM6.00017 4.18815V4.11315H5.92517H1.49231H1.41731V4.18815V4.68069V4.75569H1.49231H5.92517H6.00017V4.68069V4.18815ZM7.13646 12.4319C6.43092 12.4319 5.85669 11.8581 5.85669 11.1527C5.85669 10.4472 6.43092 9.87349 7.13646 9.87349C7.84076 9.87349 8.4145 10.4471 8.4145 11.1527C8.4145 11.8582 7.84076 12.4319 7.13646 12.4319ZM15.8254 12.4319C15.1199 12.4319 14.5462 11.8582 14.5462 11.1527C14.5462 10.4472 15.1199 9.87349 15.8254 9.87349C16.5303 9.87349 17.1041 10.4472 17.1041 11.1527C17.1041 11.8582 16.5309 12.4319 15.8254 12.4319ZM18.8784 9.70462C18.8784 9.98501 18.8069 10.1845 18.6693 10.3239C18.5311 10.4641 18.3154 10.5543 18.0042 10.5933H17.6555C17.4149 9.80733 16.6901 9.23095 15.8254 9.23095C14.9608 9.23095 14.2354 9.8073 13.9948 10.5933H13.6892V3.94853H15.5438C16.1635 3.94853 16.7703 4.24182 17.338 4.81567C17.9037 5.3876 18.4267 6.23478 18.8778 7.33377L18.8784 9.70462ZM17.7203 8.01752H14.7615V5.10682H15.5441C15.8703 5.10682 16.2459 5.32793 16.6303 5.75843C17.01 6.18363 17.3872 6.80118 17.7203 7.56802V8.01752Z" fill="#29302E" stroke="#29302E" stroke-width="0.15"/></svg>',
      qualityIcon: '<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13.7795 5.16884L12.3978 4.32442C12.321 4.27325 12.2698 4.17089 12.2443 4.06854L12.2187 2.53324C12.2187 2.20059 12.0651 1.89353 11.8092 1.68883C11.5534 1.48412 11.2207 1.38177 10.9137 1.43294L9.32718 1.66324C9.22483 1.68883 9.12248 1.63765 9.0713 1.56089L8.02218 0.383825C7.79188 0.127942 7.48483 0 7.15218 0C6.81953 0 6.51247 0.127942 6.28218 0.383825L5.23306 1.56089C5.15629 1.63765 5.05394 1.66324 4.97717 1.66324L3.41629 1.38177C3.08364 1.33059 2.75099 1.43294 2.52069 1.63765C2.26481 1.84236 2.11128 2.17501 2.11128 2.48206L2.08569 4.01736C2.08569 4.11972 2.03452 4.22207 1.93216 4.27325L0.550396 5.11766C0.268925 5.29678 0.0642181 5.57825 0.0130415 5.9109C-0.0381351 6.24355 0.0642181 6.57619 0.268925 6.83208L1.24128 8.00914C1.31804 8.0859 1.31804 8.18826 1.29246 8.29061L0.780691 9.82591C0.678337 10.133 0.703926 10.4912 0.883044 10.7727C1.06216 11.0541 1.34363 11.2589 1.67628 11.31L3.18599 11.5659C3.28834 11.5915 3.3907 11.6683 3.41629 11.745L3.97923 13.2292C4.10717 13.5362 4.33746 13.7921 4.67011 13.92C4.79805 13.9712 4.926 13.9968 5.05394 13.9968C5.25864 13.9968 5.46335 13.9456 5.61688 13.8433L6.97306 13.05C7.07541 12.9989 7.17777 12.9989 7.28012 13.05L8.6363 13.8433C8.91777 14.0224 9.27601 14.048 9.60865 13.92C9.91571 13.8177 10.1716 13.5618 10.2995 13.2292L10.8625 11.745C10.8881 11.6427 10.9904 11.5659 11.0928 11.5659L12.6025 11.31C12.9351 11.2589 13.2166 11.0541 13.3957 10.7727C13.5748 10.4912 13.6004 10.133 13.4981 9.82591L12.9863 8.29061C12.9607 8.18826 12.9607 8.0859 13.0375 8.00914L14.0098 6.83208C14.2145 6.57619 14.3169 6.24355 14.2657 5.9109C14.2657 5.62943 14.061 5.34795 13.7795 5.16884ZM13.4213 6.32031L12.4234 7.52296C12.1675 7.83002 12.0907 8.23943 12.2187 8.62326L12.7304 10.1586C12.7816 10.2609 12.7304 10.3633 12.7048 10.4144C12.6793 10.4656 12.6281 10.5424 12.5001 10.568L10.9904 10.8239C10.581 10.9006 10.2484 11.1821 10.1204 11.5403L9.55748 13.0244C9.5063 13.1268 9.42954 13.178 9.37836 13.2036C9.32718 13.2292 9.22483 13.2292 9.12248 13.178L7.7663 12.3847C7.40806 12.18 6.97306 12.18 6.61482 12.3847L5.25864 13.178C5.15629 13.2292 5.05394 13.2292 5.00276 13.2036C4.95158 13.178 4.87482 13.1524 4.82364 13.0244L4.2607 11.5403C4.10717 11.1565 3.77452 10.875 3.3907 10.7983L1.88099 10.5424C1.75305 10.5168 1.70187 10.44 1.67628 10.3889C1.65069 10.3377 1.59952 10.2609 1.65069 10.133L2.16246 8.59767C2.2904 8.21384 2.21364 7.80443 1.95775 7.49737L0.985397 6.32031C0.908632 6.21796 0.908632 6.14119 0.908632 6.09002C0.908632 6.03884 0.93422 5.93649 1.03657 5.88531L2.41834 5.04089C2.75099 4.83619 2.9557 4.47795 2.9557 4.09413L2.98128 2.55883C2.98128 2.43089 3.05805 2.37971 3.08364 2.32854C3.10923 2.30295 3.18599 2.25177 3.28834 2.25177C3.31393 2.25177 3.31393 2.25177 3.33952 2.25177L4.926 2.48206C5.30982 2.53324 5.69364 2.4053 5.94953 2.09824L6.99865 0.921179C7.07541 0.844414 7.17777 0.818825 7.22894 0.818825C7.28012 0.818825 7.38247 0.844414 7.45924 0.921179L8.50836 2.09824C8.76424 2.37971 9.14807 2.53324 9.53189 2.48206L11.1184 2.25177C11.2463 2.22618 11.3231 2.27736 11.3487 2.32854C11.3742 2.35412 11.451 2.43089 11.451 2.55883L11.4766 4.09413C11.4766 4.47795 11.6813 4.83619 12.014 5.04089L13.3957 5.88531C13.4981 5.93649 13.5237 6.03884 13.5237 6.09002C13.4725 6.14119 13.4981 6.24355 13.4213 6.32031Z" fill="black"/><path d="M9.48071 4.86178L6.15423 8.67443L4.87482 7.24149C4.72129 7.06237 4.43982 7.06237 4.28629 7.2159C4.10717 7.36943 4.10717 7.6509 4.2607 7.80443L5.87276 9.59561C5.94953 9.69796 6.07747 9.72355 6.17982 9.72355C6.30776 9.72355 6.41012 9.67238 6.48688 9.57002L10.146 5.39913C10.2995 5.22001 10.2739 4.96413 10.0948 4.8106C9.91571 4.65707 9.63424 4.68266 9.48071 4.86178Z" fill="black"/></svg>',
      infoIcon: '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M6.98103 0C10.8509 0 14 3.14905 14 6.98103C14 10.8509 10.8509 14 6.98103 14C3.14905 14 0 10.8509 0 6.98103C0 3.14905 3.14905 0 6.98103 0ZM7.28455 2.69377C7.92954 2.69377 8.42276 3.22493 8.42276 3.83198C8.38482 4.47696 7.8916 4.97019 7.28455 4.97019C6.63957 4.97019 6.14634 4.43902 6.14634 3.83198C6.14634 3.18699 6.67751 2.69377 7.28455 2.69377ZM8.91599 10.3577C8.57453 11.6098 5.23577 11.7236 5.46341 10.0163C5.61518 8.87805 5.84282 7.77778 6.03252 6.67751C6.14634 5.95664 5.69106 6.18428 5.27371 6.03252C5.00813 5.9187 5.00813 5.57724 5.34959 5.50136C5.76694 5.38753 7.24661 5.46341 7.73984 5.46341C8.00542 5.46341 8.15718 5.61518 8.19512 5.88076C8.19512 6.1084 8.15718 6.2981 8.11924 6.52575C7.92954 7.58808 7.66396 8.72629 7.5122 9.78862C7.5122 10.0163 7.55014 10.4336 7.8916 10.3957C8.23306 10.3957 8.38482 10.2439 8.65041 10.1301C8.80217 10.0542 8.95393 10.168 8.91599 10.3577Z" fill="#888888"/></svg>',
      rightArrowIcon: '<svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.2256 6.00025C15.2162 6.21863 15.1362 6.46214 15.0263 6.60235L11.0776 11.6561C10.7405 12.0705 10.1616 12.1047 9.79134 11.7894C9.42104 11.4741 9.36002 10.8369 9.66328 10.4519L12.397 6.94782H1.55707C1.05379 6.94782 0.645803 6.52356 0.645803 6.00025C0.645803 5.47691 1.05379 5.0527 1.55707 5.0527H12.397L9.66328 1.54866C9.36002 1.16366 9.42727 0.534146 9.79134 0.211152C10.1683 -0.12334 10.7744 -0.0467893 11.0776 0.344461L15.0263 5.39815C15.1806 5.59449 15.2132 5.76067 15.2256 6.00025Z" fill="#3991F2"/></svg>',
      listIcon: '<svg width="4" height="9" viewBox="0 0 4 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 1C0.786193 1 3.12941 2.03411 3.12941 4.37647C3.12941 7.01176 0.823529 8 0 8" stroke="#62D4B5"/></svg>',
      ratingStars: '<svg width="64" height="12" viewBox="0 0 64 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.97865 0L7.32094 4.1459H11.6647L8.15052 6.7082L9.49281 10.8541L5.97865 8.2918L2.46449 10.8541L3.80678 6.7082L0.292616 4.1459H4.63636L5.97865 0Z" fill="#7DADA0"/><path d="M19.7752 6.10352e-05L21.1175 4.14596H25.4612L21.9471 6.70826L23.2894 10.8542L19.7752 8.29186L16.2611 10.8542L17.6033 6.70826L14.0892 4.14596H18.4329L19.7752 6.10352e-05Z" fill="#7DADA0"/><path d="M32.6528 6.10352e-05L33.9951 4.14596H38.3388L34.8247 6.70826L36.1669 10.8542L32.6528 8.29186L29.1386 10.8542L30.4809 6.70826L26.9667 4.14596H31.3105L32.6528 6.10352e-05Z" fill="#7DADA0"/><path d="M44.61 6.10352e-05L45.9523 4.14596H50.296L46.7819 6.70826L48.1242 10.8542L44.61 8.29186L41.0958 10.8542L42.4381 6.70826L38.924 4.14596H43.2677L44.61 6.10352e-05Z" fill="#7DADA0"/><path d="M57.4871 6.10352e-05L58.8294 4.14596H63.1731L59.6589 6.70826L61.0012 10.8542L57.4871 8.29186L53.9729 10.8542L55.3152 6.70826L51.801 4.14596H56.1448L57.4871 6.10352e-05Z" fill="#7DADA0"/></svg>'
    }
  },
  computed: {
    ...mapGetters({
      cartProducts: 'cart/cartProducts',
    }),
    showAutoRefills: function () {
      return this.cartProducts.some(p => p.product_id === 6708953645226) && !this.cartProducts.some(p => p.product_id === 7012339843242);
    },
    currentOptionsArray: function () {
      return Object.keys( this.options ).reduce((a, option, idx) => { a[ idx ] = this.options[ option ].value; return a; }, []);
    },
    subscriptionFrequencies: function () {
      return this.subscriptionEnabled ? this.product?.selling_plan_groups[0].selling_plans.map(sell => sell.name) : [];
    },
    subscriptionDiscount: function () {
      return this.subscriptionEnabled ? `${this.product?.selling_plan_groups[0].selling_plans[0]?.price_adjustments[0]?.value}${this.product?.selling_plan_groups[0].selling_plans[0]?.price_adjustments[0]?.value_type === 'percentage' ? '%' : '$'}` : '';
    },
    getATClabel: function () {
      if ( this.purchaseType === "autodeliver" && this.currentVariant.selling_plan_allocations && this.currentVariant.selling_plan_allocations[0].selling_plan_id ) {
        return 'Subscribe - ' + this.formatMoney( this.currentVariant.selling_plan_allocations[0].price ) + ' / ' + this.product?.selling_plan_groups[0].selling_plans[this.subscriptionOptions.idx].options[0].value;
      } else {
        return 'Add to Bag - ' + this.formatMoney( this.currentVariant.price );
      }
    },
    getPrice: function () {
      return this.purchaseType === "autodeliver" && this.currentVariant.selling_plan_allocations && this.currentVariant.selling_plan_allocations[0].price ? this.formatMoney(this.currentVariant.selling_plan_allocations[0].price) : this.formatMoney(this.currentVariant.price);
    },
    subscriptions: function () {
      return this?.product?.selling_plan_groups || this?.data?.product?.selling_plan_groups;
    },
    subscriptionEnabled: function () { return this.product?.selling_plan_groups?.length > 0 },
    subscriptionProductJsonUrl: function () { return this.subscriptionProductHandle ? `/products/${this.subscriptionProductHandle}.js` : ''; },
    subscriptionRequired: function () { return this.product?.requires_selling_plan; }
  },
  watch: {},
  created () {},
  destroyed () {},
  beforeMount: async function () {
    if (this.productJsonUrl) {
      await this.initMainProduct();
    } else if (this.productLiquid) {
      this.product = { ...this.productLiquid, ...{ options: this.transformProductOptions(this.productLiquid.options) } };
      this.initOptions();
      if ( typeof this.completeInit === "function" ) this.completeInit();
    } else if (this.data && this.data.product) {
      this.product = { ...this.data.product, ...{ options: this.transformProductOptions(this.data.product.options) } };
      this.initOptions();
      if ( typeof this.completeInit === "function" ) this.completeInit();
    }

    //NOTE: check for supplementary subscription product upsell:
    if (this.subscriptionProductJsonUrl) this.supplementarySubscriptionProduct = await this.fetchProduct(this.subscriptionProductJsonUrl);

    //NOTE: if the main product has subscription options:
    if (this.subscriptionEnabled) this.subscriptionOptions = { open: false, frequency: this.product?.selling_plan_groups && this.product?.selling_plan_groups[0] && this.product?.selling_plan_groups[0]?.selling_plans ? this.product?.selling_plan_groups[0]?.selling_plans[0]?.name : 0, idx: 0 };
  },
  mounted: function () {
    this.loaded = true;
  },
  methods: {
    ...mapActions({
      addCartItems: 'cart/addCartItems',
      hideModal: 'modal/hide',
      triggerModal: 'modal/trigger',
      toggleModal: 'modal/toggle',
      showModal: 'modal/show',
      setModal: 'modal/set'
    }),
    updateProductQuantity: function (quantity) {
      this.quantity = quantity;
    },
    // subscription logic:
    toggleFrequencySelect: function () { this.subscriptionOptions.open = !this.subscriptionOptions.open; },
    renderSubscriptionFrequency: function ( frequency ) {
      return `<div class="option__name">${ frequency } </div>
              <div class="chevron">
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5176 1L8.26758 7.5L1.01758 1" stroke="black"/></svg>
              </div>`;
    },
    setSubscriptionFrequency: function ( frequency, id )  { this.$set( this.subscriptionOptions, "frequency", frequency ); this.$set( this.subscriptionOptions, "idx", id ); },
    getShippingIntervalUnit: function ( frequency ) { return frequency > 1 ? this.subscriptions.shipping_interval_unit_type : this.subscriptions.shipping_interval_unit_type.slice(0, -1) },
    getOptions: ( product, idx ) => {
      return product.variants.reduce( (a, v) => { if ( Object.keys( a ).indexOf( v.options[idx] ) === -1 ) a[ v.options[idx] ] = v; return a; }, {} );
    },
    filterOption: function ( option, value ) {
      let combinationToCheck = [ ...this.currentOptionsArray ];
      combinationToCheck[ this.product.options.indexOf( option ) ] = value;
      return this.product.variants.find(v => this.arrayEquals( v.options, combinationToCheck ));
    },
    renderCurrentOption: function (option, optionIdx) {
      return `${ this.optionType[option] === 'swatch' ? `<div class="swatch">
                <div class="${this.slugify(option)}" style="background-image: url(${ this.swatchUrl }${ encodeURIComponent(this.currentVariant.options[optionIdx]) }.media); background-size: cover"></div>
              </div>` : '' }
              <div class="option__name">${this.currentVariant.options[optionIdx]}</div>
              <div class="chevron">
                <svg width="16" height="9" viewBox="0 0 16 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.5176 1L8.26758 7.5L1.01758 1" stroke="black"/></svg>
              </div>`;
    },
    transformProductOptions: function (options) {
      return options.reduce((a, o) => {
        let option = "";
        if (typeof o === 'object' && o.name) {
          option = o.name;
        } else {
          option = o;
        }
        a.push(option);
        return a;
      }, []);
    },
    initOptions: function () {
      // NOTE: use $set to ensure reactivity
      // check querysting for variant:
      let urlParams = new URLSearchParams( window.location.search );
      if ( urlParams.has('variant') ) {
        let defaultVariant = urlParams.get('variant');
        let variantOptions = this.product.variants.find( v => v.id === parseInt(defaultVariant) );
        this.product.options.forEach( ( o, i ) => {
          this.$set( this.options, o, { open: false, count: this.product.variants.length, value: variantOptions?.options ? variantOptions?.options[ i ] : variantOptions?.option1 } );
        } );
      } else {
        this.product.options.forEach( ( o, i ) => {
          this.$set( this.options, o, { open: false, count: this.product.variants.length, value: this.product.variants[0]?.options ? this.product.variants[0]?.options[ i ] : this.product.variants[0]?.option1 } );
        } );
      }
      this.setVariant();
    },
    setOption: function ( option, value ) {
      this.$set( this.options, option, Object.assign( {}, this.options[ option ], { value: value } ) );
      this.setVariant( option, value );
    },
    setVariant: function ( option = null, value = null ) {
      let variant = this.product.variants.find(v => this.arrayEquals( v.options ? v.options : [ v.option1 ], this.currentOptionsArray ));
      if ( variant ) {
        this.currentVariant = variant;
      } else if ( option !== null && value !== null ) { //NOTE: auto-select "closest" matching variant:
        let candidate = this.product.variants.find(v => v.options[ this.product.options.indexOf( option ) ] === value );
        candidate.options.forEach((val, idx) => {
          let setOption = this.product.options[ idx ];
          this.$set( this.options, setOption, Object.assign( {}, this.options[ setOption ], { value: val } ) );
        });
        this.currentVariant = candidate;
      }
    },
    arrayEquals: ( a, b ) => {
      return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
    },
    toggleSelect: function ( option, type ) {
      if (type === "select") this.$set( this.options, option, Object.assign( {}, this.options[ option ], { open: !this.options[ option ].open } ) );
    },
    toggleSelectSubscription: function ( option ) {
      this.purchaseType = option;
    },
    calcType: function ( option ) {
      let type = "";
      switch( option ) {
        case "Color" :
          type = "select";
          break;
        default :
          type = "box";
          // type = this.options[ option ] && this.options[ option ].count && this.options[ option ].count > 4 ? "select" : "box";
          break;
      }
      return type;
    },
    getKeyFromValue: function ( obj, value ) {
      return Object.keys(obj).find(key => obj[key] === value);
    },
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
    fetchProductMetafieldGraphQL: async function (handle='', namespace='', key='') {
      const query = `query { 
          productByHandle(handle: "${handle}") { 
            metafield: metafield(namespace: "${namespace}", key: "${key}") {
              value
            }
          }
        }`
      let response = await axios.post(
        `${window.location.origin}/api/graphql.json`,
        { query: query },
        { headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': this.storeFrontAccessToken } }
      ).catch( err => { console.log(err) } );
      
      return response?.data?.data?.productByHandle?.metafield?.value;
    },
    fetchProduct: async function (url) {
      let response = await axios.get( url ).catch( err => { console.log(err) } )
      const product = response?.data?.product || response?.data;
      return { ...product, ...{ options: this.transformProductOptions(product.options) } };
    },
    initMainProduct: async function () {
      this.product = await this.fetchProduct(this.productJsonUrl);
      this.initOptions();
      if ( typeof this.completeInit === "function" ) this.completeInit();
    },
    formatLineBreaks: function (string) {
      return this.$options.filters.formatLineBreaks(string);
    },
  },
}