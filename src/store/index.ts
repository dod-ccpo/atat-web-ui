import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { allPortfolios } from "@/store/mocks/portfoliosMockData";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.sessionStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
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
      window.sessionStorage.clear();
    },
  },
  modules: {},
  getters: {
    getLoginStatus(state) {
      return state.loginStatus;
    },
    getNavBarItems(): Navs {
      return {
        logout: {
          id: "atat-nav__logout",
          title: "logout Nav",
          items: [],
        },
        login: {
          id: "atat-nav__login",
          title: "login Nav",
          items: [
            {
              id: 1,
              cssClass: "atat-header-nav__user-display-name",
              title: "Maria Missionowner",
              url: "#",
              newWindow: false,
              icon: "person",
              iconPlacement: "left",
            },
            {
              id: 2,
              cssClass: "atat-header-nav__support",
              title: "Support",
              url: "#",
              newWindow: false,
              icon: "help_outline",
              iconPlacement: "left",
            },
            {
              id: 3,
              cssClass: "atat-header-nav__logout",
              title: "Logout",
              url: "/",
              newWindow: false,
              icon: "logout",
              iconPlacement: "right",
              action: "logout",
            },
          ],
        },
      };
    },
    getAllPortfolios(state) {
      return state.portfolios;
    },
    getPortfolioById: (state) => (id: string) => {
      const values = Object.values(state.portfolios);
      const portfoliobyId = values.filter((portfolio) => portfolio.id === id);
      if (portfoliobyId.length > 0) {
        return portfoliobyId[0];
      } else {
        return {};
      }
    },
  },
});
