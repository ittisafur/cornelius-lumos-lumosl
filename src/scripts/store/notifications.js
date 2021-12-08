/**
 * state
 */
const state = {
  notification: {
    message: "",
    visability: false,
    type: "success",
    timeout: 3000
  },
}

/**
 * getters
 */
const getters = {}

/**
 * mutations
 */
const mutations = {
  showNotification: function(state, notification) {
    state.notification.visability = notification.visability;
  },
  setNotification: function(state, notification) {
    state.notification.message = notification.message;
    state.notification.type = notification.type;
  },
}

/**
 * actions
 */
const actions = {}

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