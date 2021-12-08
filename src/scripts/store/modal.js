/**
 * state
 */
const state = {
  visible: false,
  component: "",
  data: {}
}

/**
 * getters
 */
const getters = {
  showModal: function (state) {
    return state.visible;
  },
  getComponent: function (state) {
    return state.component;
  },
  getData: function (state) {
    return state.data;
  }
}

/**
 * mutations
 */
const mutations = {
  TOGGLE (state) {
    state.visible = !state.visible
  },

  SHOW (state) {
    state.visible = true
  },

  HIDE (state) {
    state.visible = false
  },

  SET (state, payload) {
    state.component = payload.component
    state.data = payload.data
  }
}

/**
 * actions
 */
const actions = {
  toggle ({ commit }) {
    commit('TOGGLE')
  },

  show ({ commit }) {
    commit('SHOW')
  },

  hide ({ commit }) {
    commit('HIDE')
  },

  set ({ commit }, payload) {
    commit('SET', payload)
  },

  /* combines set and show */
  trigger: function ({commit}, payload ) {
    commit( 'SET', payload )
    commit( 'SHOW' )
  },
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