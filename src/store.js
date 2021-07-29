import Vue from "nativescript-vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isAuthenticated: false,
    user: null,
  },
  mutations: {
    setAuth(state, value) {
      state.user = value;
      state.isAuthenticated = true;
    },
    clearAuth(state, value) {
      state.user = {};
      state.isAuthenticated = false;
    },
  },
  actions: {},
});
