import axios from "axios";
// import _ from '../helpers/lo';
import helpers from "../helpers/helpers";

/**
 * state
 */
const state = {
  cart: [],
  cartJson: {},
  cartLoading: false,
  AjaxCart: {
    visability: false
  },
  discountCode: "gels_off",
  appliedCode: "",
  discountLoading: false,
  cartCreate: false,
  productIdsAutoApplyCode: [ 7012339843242, 6708953645226 ],
  discountedProduct: [ 7012339843242 ],
  storeFrontAccessToken: 'f27e5b851c319cf71ac559d263b6fbaf'
}

/**
 * getters
 */
const getters = {
  cartLoading(state) {
    return state.cartLoading;
  },
  cartPrice(state) {
    return helpers.returnCurrencyFormatted(state.cart.total_price);
  },
  cartJson(state) {
    return state.cartJson;
  },
  cartCount(state) {
    return state.cart && state.cart.items ? state.cart.items.reduce( ( a, v )  => { a += v.quantity; return a; }, 0 ) : 0;
  },
  cartProducts(state) {
    return state.cart.items;
  },
  cartNote(state) {
    return state.cart.note;
  },
  cartEstimatedCost(state) {
    return state?.cartCreate?.cart?.estimatedCost;
  },
  cartEstimatedSubtotal(state) {
    const estSubTotal = state?.cartCreate?.cart?.estimatedCost?.subtotalAmount.amount;
    return estSubTotal ? helpers.returnGraphQLCurrencyFormatted(estSubTotal) : null;
  },
  discountsApplied(state) {
    return state?.cartCreate?.cart?.discountCodes;
  },
  checkoutUrl(state) {
    const cartProdIds = state?.cart?.items?.map(i => i?.product_id);
    const qualified = state?.productIdsAutoApplyCode?.every(pId => cartProdIds?.includes(pId));
    return qualified && state?.cartCreate?.cart?.checkoutUrl ? state?.cartCreate?.cart?.checkoutUrl : '/checkout';
  },
  autoDiscountQualified(state) {
    const cartProdIds = state?.cart?.items?.map(i => i.product_id);
    return state?.productIdsAutoApplyCode?.every(pId => cartProdIds?.includes(pId));
  },
  discountedProduct(state) {
    return state.discountedProduct;
  },
  discountLoading(state) {
    return state.discountLoading;
  },
  cartCreate(state) {
    return state.cartCreate;
  },
  encodeVariantId() {
    // base64 encode gid + variantId for Storefront API calls
    return (variantId) => btoa("gid://shopify/ProductVariant/" + variantId);
  },
  encodeSellingPlanId() {
    // base64 encode gid + variantId for Storefront API calls
    return (sellingPlanId) => btoa("gid://shopify/SellingPlan/" + sellingPlanId);
  },
  cartInput(state, getters) {
    const cartInput = getters.cartProducts.map((product) => {
      const sellingPlanId = product?.selling_plan_allocation?.selling_plan?.id ? getters.encodeSellingPlanId(product?.selling_plan_allocation?.selling_plan?.id) : false;
      let lineItemInput = {
        merchandiseId: getters.encodeVariantId(product.variant_id),
        quantity: product.quantity
      }
      if (sellingPlanId) lineItemInput = { ...lineItemInput, ...{ sellingPlanId: sellingPlanId } };
      return lineItemInput;
    });
    return {
      cartInput: {
        lines: cartInput
      }
    };
  },
  discountCode(state) {
    return state.discountCode;
  },
  productIdsAutoApplyCode(state) {
    return state.productIdsAutoApplyCode;
  },
  storeFrontAccessToken(state) {
    return state.storeFrontAccessToken;
  }
}

/**
 * mutations
 */
const mutations = {
  cartLoading: function(state, status) {
    state.cartLoading = status;
  },
  showAjaxCart: function(state, AjaxCart) {
    state.AjaxCart.visability = AjaxCart.visability;
    // AjaxCart.visability ? theme.CartDrawer.open() : theme.CartDrawer.close();
  },
  setCartJson: function (state, data) {
    state.cartJson = data;
  },
  setCart: function(state, data) {
    state.cart = data;

    var subtotal = 0;
    state.cart.items.forEach( item => {
      subtotal += item.line_price;
    });

    state.cart.total_price = subtotal;

    if (state.cart.items) {
      state.cart.items.map(function(item) {
        item.discounted_price = helpers.returnCurrencyFormatted(item.discounted_price);
        item.line_price = helpers.returnCurrencyFormatted(item.line_price);
        item.original_line_price = helpers.returnCurrencyFormatted(item.original_line_price);
        item.original_price = helpers.returnCurrencyFormatted(item.original_price);
        item.price = helpers.returnCurrencyFormatted(item.price);
        item.image_medium = helpers.returnDifferentImageSize(item.image, "medium");
        item.link = helpers.returnSelectedLink(item);
        return item;
      });
    }
  },
  setProduct: function(state, data) {
    state.product = data;
  },
  setDiscountCode: function (state, data) {
    state.discountCode = data;
  },
  setDiscountLoading: function(state, status) {
    state.discountLoading = status;
  },
  cartCreate: function (state, data) {
    state.cartCreate = data;
  },
}

/**
 * actions
 */
const actions = {
  triggerGetCart: async function({ dispatch }) {
    // fix for ie11 and below to see changes in cart
    if (
      navigator.userAgent.indexOf("MSIE") !== -1 ||
      navigator.appVersion.indexOf("Trident/") > 0
    ) {
      location.reload();
    } else {
      //update cart content
      await dispatch("getCart");
    }
  },
  getCart: async function({ commit, dispatch, getters }) {
    commit("cartLoading", true);
    commit("recommended-products/toggleRecommendedProductsLoader", true, { root: true });
    const response = await axios.get("/cart.js").catch((error) => { console.log(error); });
    commit("setCartJson", { ...response.data });
    commit("cartLoading", false);
    commit("setCart", { ...response.data });
    commit('recommended-products/setCurrentRecommendations', null, { root: true });
    commit("recommended-products/toggleRecommendedProductsLoader", false, { root: true });

    // auto apply discount if Kit:
    if (getters.autoDiscountQualified) {
      await dispatch('applyDiscountCode', getters.discountCode);
    }
  },
  getProduct({ commit }, data) {
    axios
      .get(`/products/${data}.json`)
      .then(function(response) {
        commit("setProduct", response.data.product);
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  clearCart: function({ dispatch, commit }) {
    axios
      .post("/cart/clear.js")
      .then(function() {
        //show notice
        commit("notifications/showNotification", {
          message: `Cart cleared!`,
          visability: true
        }, { root: true });

        //update cart content
        dispatch("triggerGetCart");
      })
      .catch(function() {
        commit("notifications/showNotification", {
          message: `Error when adding to cart (System)!`,
          visability: true
        }, { root: true });
      });
  },
  addItem: function({ dispatch, commit }, data) {
    if (data.id !== undefined && typeof data.id !== 'undefined') {
      let showCart = data.showCart !== undefined ? data.showCart : true;
      let checkout = data.checkout !== undefined ? data.checkout : false;
      let formData = {
        "items": [ 
          {
            "id": data.id,
            "quantity": data.quantity,
            "properties": data.properties
          }
        ]
      };

      axios
        .post("/cart/add.js", formData)
        .then(function(response) {
          
          // console.log(response)
          const productName = response.data.title;
          //show notice
          commit("notifications/showNotification", {
            message: `You have added ${
              data.quantity
            } x ${productName} to your cart!`,
            visability: false
          }, { root: true });

          // fix for ie11 and below to see changes in cart
          if (
            navigator.userAgent.indexOf("MSIE") !== -1 ||
            navigator.appVersion.indexOf("Trident/") > 0
          ) {
            location.reload();
          } else {
            //update cart content
            dispatch("triggerGetCart");
          }

          //show sidebar cart
          commit("showAjaxCart", {
            visability: showCart
          });

          // if checkout make ajax call to checkout to make newly added items "stick":
          if ( checkout ) {
            axios.get(window.location.origin + window.location.pathname);
          }
        })
        .catch(function() {
          commit("notifications/showNotification", {
            message: `Error when adding to cart (System)!`,
            visability: true
          }, { root: true });
        });
    } else {
      commit("notifications/showNotification", {
        message: `Error when adding to cart!`,
        visability: true
      }, { root: true });
    }
  },
  addCartItems: function ( { dispatch, commit }, data ) {
    if ( data && data.items && data.items.length ) {
      let showCart = data.showCart !== undefined ? data.showCart : true;
      let checkout = data.checkout !== undefined ? data.checkout : false;

      axios
        .post( "/cart/add.js", data )
        .then(async function( response ) {
          const productName = response.data.title;
          //show notice
          commit("notifications/showNotification", {
            message: `You have added ${
              data.quantity
            } x ${productName} to your cart!`,
            visability: false
          }, { root: true });

          // fix for ie11 and below to see changes in cart
          if (
            navigator.userAgent.indexOf("MSIE") !== -1 ||
            navigator.appVersion.indexOf("Trident/") > 0
          ) {
            location.reload();
          } else {
            //update cart content
            await dispatch("triggerGetCart");
          }

          //show sidebar cart
          commit("showAjaxCart", {
            visability: showCart
          });

          // if checkout make ajax call to checkout to make newly added items "stick":
          if ( checkout ) {
            axios.get(window.location.origin + window.location.pathname);
          }
        })
        .catch(function() {
          commit("notifications/showNotification", {
            message: `Error when adding to cart (System)!`,
            visability: true
          }, { root: true });
        });
    } else {
      commit("notifications/showNotification", {
        message: `Error when adding to cart!`,
        visability: true
      }, { root: true });
    }
  },
  updateNote: function({ dispatch, commit }, data) {
    // console.log(data);
    axios
      .post("/cart/update.js", {
        note: data.note
      })
      .then(function() {
        dispatch("triggerGetCart");
      })
      .catch(function(error) {
        console.log(error);

        commit("notifications/showNotification", {
          message: `Error when updating cart note (System)!`,
          visability: true
        }, { root: true });
      });
  },
  updateItem: function({ dispatch, commit }, data) {
    if (
      typeof data.id === "undefined" ||
      typeof data.quantity === "undefined"
    ) {
      return;
    }

    axios
      .post("/cart/change.js", {
        id: data.id,
        quantity: data.quantity
      })
      .then(function() {
        commit("notifications/showNotification", {
          message: `You have updated product quantity in your cart!`,
          visability: true
        }, { root: true });

        dispatch("triggerGetCart");
      })
      .catch(function(error) {
        console.log(error);

        commit("notifications/showNotification", {
          message: `Error when adding to cart (System)!`,
          visability: true
        }, { root: true });
      });
  },
  updateCart: function({ dispatch, commit }, data) {
    axios
      .post("/cart/update.js", {
        updates: data
      })
      .then(function() {
        //update cart content
        dispatch("triggerGetCart");
      })
      .catch(function() {
        commit("notifications/showNotification", {
          message: `Error when adding to cart (System)!`,
          visability: true
        }, { root: true });
      });
  },
  updateDiscountCode: function ({ commit }, data) {
    commit("setDiscountCode", data);
  },
  applyDiscountCode: async function ({ dispatch, getters }) {
    let cartInputWithDiscount = getters.cartInput;
    cartInputWithDiscount.cartInput.discountCodes = [ getters.discountCode ];
    await dispatch('createCartGraphQL', cartInputWithDiscount);
  },
  createCartGraphQL: async function ( { commit, getters }, data) {
    const query = `mutation cartCreateMutation($cartInput: CartInput) {
      cartCreate(input: $cartInput) {
        cart {
          id
          discountCodes {
            applicable
            code
          }
          estimatedCost {
            subtotalAmount {
              amount
            }
            totalAmount {
              amount
            }
            totalDutyAmount {
              amount
            }
            totalTaxAmount {
              amount
            }
          }
          checkoutUrl
          lines(first:10) {
            edges {
                node {
                  quantity
                  merchandise {
                    __typename
                    ... on ProductVariant {
                      id
                    }
                  }
                  discountAllocations {
                    discountedAmount {
                      amount
                    }
                  }
                  estimatedCost {
                    subtotalAmount {
                      amount
                    }
                    totalAmount {
                      amount
                    }
                  }
                  sellingPlanAllocation {
                    sellingPlan {
                      id
                      name
                    }
                    priceAdjustments {
                      price {
                        amount
                      }
                      compareAtPrice {
                        amount
                      }
                      perDeliveryPrice {
                        amount
                      }
                    }
                  }
                }
              }
          }
        }
      }
    }`;

    const response = await axios.post(
      `${window.location.origin}/api/2021-10/graphql.json`,
      { query: query, variables: data },
      { headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': getters.storeFrontAccessToken } }
    ).catch( err => { console.log(err) } );
    
    const cartCreate = response?.data?.data?.cartCreate;
    
    if (cartCreate) commit( "cartCreate", cartCreate );
  }
}

/**
 * export
 */
export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}