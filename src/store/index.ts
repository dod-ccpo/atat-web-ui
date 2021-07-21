import Vue from "vue";
import Vuex from "vuex";
import { allPortfolios } from "@/store/mocks/portfoliosMockData";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    loginStatus: false,
    portfolios: allPortfolios,
  },
  mutations: {
    changeLoginStatus(state, status: boolean) {
      if (status) {
        state.loginStatus = true;
      } else {
        state.loginStatus = false;
      }
    },
  },
  actions: {
    login({ commit }) {
      commit("changeLoginStatus", true);
    },
    logout({ commit }) {
      commit("changeLoginStatus", false);
    },
  },
  modules: {},
  getters: {
    getLoginStatus(state) {
      return state.loginStatus;
    },
    getAllPortfolios(state) {
      return state.portfolios;
    },
  },
});
