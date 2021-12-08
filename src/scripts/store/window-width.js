const types = { WINDOW_WIDTH: 'WindowWidth' };

const state = {
  windowWidth: window.innerWidth,
}

const getters = {
  [types.WINDOW_WIDTH]: state => {
    return state.windowWidth;
  },
}

const mutations = {
  [types.WINDOW_WIDTH]: state => {
    state.windowWidth = window.innerWidth;
  },
}

const actions = {
  [types.WINDOW_WIDTH]: ({ commit }) => {
    commit(types.WINDOW_WIDTH);
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}