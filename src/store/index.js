import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentHr: JSON.parse(window.sessionStorage.getItem("user")),
  },
  mutations: {
    INIT_CURRENTHR(state, hr) {
      state.currentHr = hr;
    },
  },
  actions: {
  },
  modules: {
  }
})
