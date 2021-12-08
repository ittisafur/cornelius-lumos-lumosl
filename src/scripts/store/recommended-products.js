
import productRecommendations from '../jsons/product-recommendations';
import helpers from "../helpers/helpers";
import axios from "axios";
import LZString from 'lz-string';

/**
 * state
 */
const state = {
  recommendedProductMatrix: {
    "Kits": ["Gels", "Trays"],
    "Gels": ["Kits", "Trays"],
    "Trays": ["Kits", "Gels"],
  },
  defaultRecommendedProducts: [ 6708956954794, 7012339843242 ], // <= product IDs
  recommendedProducts: [],
  recommendedProductsRaw: [],
  currentRecommendations: [],
  recommendedProductsLoading: false,
  numRecommendations: 1,
  productRecommendations: productRecommendations,
  enableRecommendedProductMatrix: false
}

/**
 * getters
 */
const getters = {
  recommendedProducts(state) {
    return state.recommendedProducts;
  },
  currentRecommendations(state) {
    return state.currentRecommendations;
  },
  recommendedProductsLoading(state) {
    return state.recommendedProductsLoading;
  },
}

/**
 * mutations
 */
const mutations = {
  setRecommendedProducts: function(state) {
    let data = { products: [...state.recommendedProductsRaw] };
    if (data.products && data.products.length) {
      state.recommendedProducts =  data.products.reduce( function ( a, p ) {
        if ( Object.keys(a).indexOf(p.product_type) === -1 ) {
          a[p.product_type] = [];
          a[p.product_type].push(p);
        } else {
          a[p.product_type].push(p);
        }
        return a;
      }, {} );
    }
  },
  setRecommendedProductsRaw: function(state, data) {
    state.recommendedProductsRaw = data.products;
  },
  setRecommendedProductsFromCache: function (state) {
    state.recommendedProductsRaw = JSON.parse(LZString.decompress(sessionStorage.getItem('allProductsJson')));
  },
  setCurrentRecommendations: function (state) {
    state.currentRecommendations = [];
    const cartItems = this?.getters['cart/cartProducts'];
    if (cartItems && cartItems.length && state.recommendedProducts && Object.keys(state.recommendedProducts).length) {
      let cartItemTypes = cartItems.map( item => item.product_type ),
          cartItemHash = cartItemTypes.reduce( (a, v) => { a[v] = 0; return a; }, {} );
      cartItems.sort(
        function (a, b) {
          if (a.final_price > b.final_price) return -1;
          if (b.final_price > a.final_price) return 1;
          return 0;
        }
      );

      loopCartItems:
      for (let i=0; i<cartItems.length; i++) {
        let item = cartItems[i],
            type = Object.keys(state.recommendedProductMatrix).find( t => item.product_type.toLowerCase().indexOf( t.toLowerCase() ) !== -1 );

        if (state.productRecommendations[item.product_id] && state.productRecommendations[item.product_id].rP1 && state.productRecommendations[item.product_id].rP1.pId) {
          let found = state.recommendedProductsRaw.find( p => parseInt(p.id) === parseInt(state.productRecommendations[item.product_id].rP1.pId) );
          if (
            found &&
            !helpers.intersect([cartItems.map(item => item.product_id), state.defaultRecommendedProducts]).length &&
            !state.currentRecommendations.some(elem => elem === found) && // <= check that it's not already being recommended
            !cartItems.some(obj => obj.product_id === found.id) &&        // <= check that it's not already in the cart
            found.title.toLowerCase().indexOf("free") === -1 &&           // <= check that it's not a free gift
            found.variants[0].price !== "0.00" &&                         // <= check that it's not a free gift
            found.variants[0].available === true                          // <= check that it's available
          ) {
            state.currentRecommendations.push( found );
            if (state.currentRecommendations.length >= state.numRecommendations) break loopCartItems;
          }

          if (state.productRecommendations[item.product_id].rP2 && state.productRecommendations[item.product_id].rP2.pId) {
            let found2 = state.recommendedProductsRaw.find( p => parseInt(p.id) === parseInt(state.productRecommendations[item.product_id].rP2.pId) );
            if (
              found2 &&
              !helpers.intersect([cartItems.map(item => item.product_id), state.defaultRecommendedProducts]).length &&
              !state.currentRecommendations.some(elem => elem === found2) && // <= check that it's not already being recommended
              !cartItems.some(obj => obj.product_id === found2.id) &&        // <= check that it's not already in the cart
              found2.title.toLowerCase().indexOf("free") === -1 &&           // <= check that it's not a free gift
              found2.variants[0].price !== "0.00" &&                         // <= check that it's not a free gift
              found2.variants[0].available === true                          // <= check that it's available
            ) {
              state.currentRecommendations.push( found2 );
              if (state.currentRecommendations.length >= state.numRecommendations) break loopCartItems;
            }
          }

        } else if (type && state.recommendedProductMatrix[type] && state.enableRecommendedProductMatrix) {
          loopProdMatrix:
          for (let j=0; j<state.recommendedProductMatrix[type].length; j++) {
            // randomize j (the product category in the matrix)
            // let productType = state.recommendedProductMatrix[type][j];
            let productType = helpers.randomizer(state.recommendedProductMatrix[type]);
            if (state.recommendedProducts[productType]) {
              // loopRecProducts:
              for (let k=0; k<state.recommendedProducts[productType].length; k++) {
                // randomize k (the product in the product category)
                let recommendation = helpers.randomizer(state.recommendedProducts[productType]);
                if (
                  !helpers.intersect([cartItems.map(item => item.product_id), state.defaultRecommendedProducts]).length &&
                  state.recommendedProducts[productType] &&                              // <= check that there are recommended products for the product category (type)
                  !state.currentRecommendations.some(elem => elem === recommendation) && // <= check that it's not already being recommended
                  !cartItems.some(obj => obj.product_id === recommendation.id) &&        // <= check that it's not already in the cart
                  recommendation.title.toLowerCase().indexOf("free") === -1 &&           // <= check that it's not a free gift
                  recommendation.variants[0].price !== "0.00" &&                         // <= check that it's not a free gift
                  recommendation.variants[0].available === true                          // <= check that it's available
                ) {
                  state.currentRecommendations.push(recommendation);
                  cartItemHash[item.product_type]++;
                  if (state.currentRecommendations.length >= state.numRecommendations) break loopCartItems;

                  /********
                  * check if there are other product types available amongst the other cart items, and if there are recommended products available for those types
                  * if yes, then start the loop from the top, to mix up the product recommendations
                  * if no, then offer another recommendation based on the current type
                  **/
                  if (
                    Object.keys(cartItemHash).some( (type) => {
                      let typeAbstract = Object.keys(state.recommendedProductMatrix).find( t => type.toLowerCase().indexOf( t.toLowerCase() ) !== -1 ),
                          recommendedCategories = state.recommendedProductMatrix[typeAbstract]
                      return cartItemHash[type] === 0 && recommendedCategories && recommendedCategories.length && Object.keys(state.recommendedProducts).some( rp => recommendedCategories.indexOf(rp) !== -1 );
                    } )
                  ) {
                    continue loopCartItems;
                  } else {
                    continue loopProdMatrix;
                    // continue loopRecProducts;
                  }

                }
              }
            }
            if (state.currentRecommendations.length >= state.numRecommendations) break loopCartItems;
          }
        }
        if (state.currentRecommendations.length >= state.numRecommendations) break loopCartItems;
      }
      // serve up defaults if 4 recommedations aren't found:
      if (state.currentRecommendations.length < state.numRecommendations) {
        let numToFill = state.numRecommendations - state.currentRecommendations.length,
            filled = 0;
        for (let i=0; i < state.defaultRecommendedProducts.length; i++) {
          let v = state.defaultRecommendedProducts[i],
              found3 = state.recommendedProductsRaw.find( p => parseInt(p.id) === parseInt(v) );
          if (
            found3 &&
            !helpers.intersect([cartItems.map(item => item.product_id), state.defaultRecommendedProducts]).length &&
            !state.currentRecommendations.some(elem => elem === found3) &&  // <= check that it's not already being recommended
            !cartItems.some(obj => obj.product_id === found3.id) &&         // <= check that it's not already in the cart
            found3.title.toLowerCase().indexOf("free") === -1 &&            // <= check that it's not a free gift
            found3.variants[0].price !== "0.00" &&                          // <= check that it's not a free gift
            found3.variants[0].available === true                           // <= check that it's available
          ) {
            state.currentRecommendations.push( found3 );
            filled++;
            if ( filled === numToFill ) break;
          }
        }
      }
    }
  },
  toggleRecommendedProductsLoader: function(state, status) {
    state.recommendedProductsLoading = status;
  },
}

/**
 * actions
 */
const actions = {
  getRecommendedProducts: async function ({ commit }) {
    if (!sessionStorage.getItem('allProductsJson')) {
      // let PRODUCTS_PER_AJAX = 50;
      // let apiCountUrl = '/collections/all/product_count.json';
      // axios.get(apiCountUrl).then( resp => {
      //   let count = resp.data.collection.products_count,
      //       numRequests = Math.ceil(count / PRODUCTS_PER_AJAX),
      //       requests = [],
      //       data = {};

      //   for (let page=1; page <= numRequests; page++ ) {
      //     requests.push( axios.get(`/collections/all/products.json?limit=${PRODUCTS_PER_AJAX}&page=${page}`) );
      //   }

      //   axios.all(requests).then(axios.spread((...responses) => {
      //     data.products = responses.reduce( (a, v) => {
      //       a = a.concat(v.data.products);
      //       return a;
      //     }, []);
      //     sessionStorage.setItem('allProductsJson', LZString.compress(JSON.stringify(data.products)));
      //     commit("setRecommendedProductsRaw", data);
      //     commit("setRecommendedProducts", data);
      //   })).catch( err => { console.log(err) } )

      // }).catch ( err => { console.log(err) } )

      const payload = await axios.get('/products/teeth-whitening-gel-for-trays.js');
      const payload2 = await axios.get('/products/lumos-smile-whitening-gels-ordered-with-whitening-kit.js');
      const data = { products: [ payload.data, payload2.data ] };
      sessionStorage.setItem('allProductsJson', LZString.compress(JSON.stringify(data.products)));
      commit("setRecommendedProductsRaw", data);
      commit("setRecommendedProducts", data);

    } else {
      commit("setRecommendedProductsFromCache");
      commit("setRecommendedProducts");
    }
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