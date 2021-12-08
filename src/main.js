/**
 * imports
 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

import { VLazyImagePlugin } from 'v-lazy-image'
import './styles/main.scss'
import 'intersection-observer';
import smoothscroll from 'smoothscroll-polyfill'
/**
*  globally register the smooth scrolling polyfill (mainly fo iOS)
*/
smoothscroll.polyfill();
window.__forceSmoothScrollPolyfill__ = true;

/**
 * declare global scroll handler (mainly b/c of iOS):
 */
window.toggleScroll = () => {
  const drawerOpen = document.getElementsByClassName('mobile-navigation-open').length || document.getElementsByClassName('js-drawer-open').length,
        scrollY = window.scrollY,
        scrollYTo = document.body.style.top;

  if (drawerOpen && document.body.style.position === 'fixed') return;

  if (drawerOpen) {
    document.querySelector('html').classList.remove('overflow-y-scroll');
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';  
  } else {
    document.querySelector('html').classList.add('overflow-y-scroll');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('left');
    document.body.style.removeProperty('right');
    window.scrollTo(0, parseInt(scrollYTo || '0') * -1);
  }
};

/**
 * vue settings
 */
Vue.config.productionTip = false

/**
 * vue components
 * auto-import all vue components
 */
const vueComponents = require.context('./scripts/components/', true, /\.(vue|js)$/)

/**
 * NOTE: we are now registering active components directly to matching DOM elements by classname instead of globally registering all components (see below)
 *
 vueComponents.keys().forEach(key => {
 const component = vueComponents(key).default

  // if a component has a name defined use the name, else use the path as the component name
  const name = component.name
    ? component.name
    : key.replace(/\.(\/|vue|js)/g, '').replace(/(\/|-|_|\s)\w/g, (match) => match.slice(1).toUpperCase())

  Vue.component(name, component)
})
*/

/**
 * vuex
 * auto-import all modules
 */
Vue.use(Vuex)

const vuexModules = require.context('./scripts/store/', true, /\.js$/)
const modules = {}

vuexModules.keys().forEach(key => {
  const name = key.replace(/\.(\/|js)/g, '').replace(/\s/g, '-')
  modules[name] = vuexModules(key).default
})

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules
})

/**
 * vue mixins
 * auto-register all mixins with a 'global' keyword in their filename
 */
const mixins = require.context('./scripts/mixins/', true, /.*global.*\.js$/)

mixins.keys().forEach(key => {
  Vue.mixin(mixins(key).default)
})

/**
 * vue directives
 * auto-register all directives with a 'global' keyword in their filename
 */
const directives = require.context('./scripts/directives/', true, /.*global.*\.js$/)

directives.keys().forEach(key => {
  const directive = directives(key).default
  Vue.directive(directive.name, directive.directive)
})

/**
 * vue filters
 * auto-register all filters with a 'global' keyword in their filename
 */
const filters = require.context('./scripts/filters/', true, /.*global.*\.js$/)

filters.keys().forEach(key => {
  const filter = filters(key).default
  Vue.filter(filter.name, filter.filter)
})

/**
 * vue prototype
 * extend with additional features
 */
Vue.prototype.$axios = axios

/**
 * vue plugins
 * extend with additional features
 */
Vue.use(VLazyImagePlugin)

/**
 * create vue instance
 */
const createApp = ( el, component, name ) => {
  return new Vue({
    el: el,
    comments: true,  // <-- Add this
    store,
    components: {
      [ name ]: component
    }
  });
}

document.addEventListener('shopify:section:load', () => {
  instances.forEach( i => i.instance.$destroy() )
  instances = [];
  createInstances();
});
document.addEventListener('shopify:section:reorder', () => {
  instances.forEach( i => i.instance.$destroy() )
  instances = [];
  createInstances();
});

/**
 * register active components directly on corresponding, matching DOM elements by classname (to allow for multiple component registrations)
 */
var instances = [];
const createInstances = () => {
  vueComponents.keys().forEach(key => {
    const component = vueComponents(key).default

    // if a component has a name defined use the name, else use the path as the component name
    const name = component.name
      ? component.name
      : key.replace(/\.(\/|vue|js)/g, '').replace(/(\/|-|_|\s)\w/g, (match) => match.slice(1).toUpperCase())

    // looking for classes that are "vue-" + filename
    // const selector = `vue-${ key.replace(/\.(\/render\/|\/renderless\/|vue|js)/g, '') }`
    const selector = `vue-${ key.split("/").pop().replace(/\.(vue|js)/g, '') }`

    let elements = document.getElementsByClassName( selector )
    if ( elements && elements.length ) {
      for( let el of elements ) {
        instances.push( { selector: selector, component: component, name: name, element: el, instance: createApp( el, component, name ) } );
      }
    }
  });
  document.dispatchEvent( new CustomEvent("vue:instances:loaded") );
}

createInstances();