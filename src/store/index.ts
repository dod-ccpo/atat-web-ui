import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { allPortfolios } from "@/store/mocks/portfoliosMockData";
import { mockTaskOrder } from "@/store/mocks/taskOrderMockData";

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  key: "vuex", // The key to store the state on in the storage provider.
  storage: window.sessionStorage, // or window.sessionStorage or localForage
  // Function that passes the state and returns the state with only the objects you want to store.
  // reducer: state => state,
  // Function that passes a mutation and lets you decide if it should update the state in localStorage.
  // filter: mutation => (true)
});

const wizardStepNames: string[] = [
  "addportfolio",
  "addfunding",
  "addapplication",
  "addteammembers",
  "reviewandsubmit",
];

function generateGuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    loginStatus: false,
    isUserAuthorizedToProvisionCloudResources: false,
    portfolios: allPortfolios,
    taskOrders: mockTaskOrder,
    currentWizardStep: 0,
    wizardNavigation: {},
    selectedCSP: "CSP 1",
  },
  mutations: {
    changeLoginStatus(state, status: boolean) {
      state.loginStatus = status;
    },
    changeisUserAuthorizedToProvisionCloudResources(state, status: boolean) {
      state.isUserAuthorizedToProvisionCloudResources = status;
    },

    setWizardStep(state, stepNumber: number) {
      state.currentWizardStep = stepNumber;
    },
    //provides wizard state handling for next and previous wizard buttons
    //eventually this may be moved to it's own module
    setWizardNavigation(state, stepNumber: number) {
      state.wizardNavigation = {
        action: stepNumber > state.currentWizardStep ? "next" : "previous",
        guid: generateGuid(), // generate a guid in order to trigger state change in the store
        step:
          stepNumber > state.currentWizardStep
            ? wizardStepNames[state.currentWizardStep]
            : wizardStepNames[state.currentWizardStep - 2],
      };
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

    wizardNext({ commit }) {
      if (this.state.currentWizardStep < 5) {
        commit("setWizardNavigation", this.state.currentWizardStep + 1);
      }
    },
    wizardPrevious({ commit }) {
      if (this.state.currentWizardStep > 1) {
        commit("setWizardNavigation", this.state.currentWizardStep - 1);
      }
    },
    updateWizardStep({ commit }, currentStep: number) {
      commit("setWizardStep", currentStep);
    },
    authorizeUser({ commit }) {
      commit("changeisUserAuthorizedToProvisionCloudResources", true);
    },
    unauthorizeUser({ commit }) {
      commit("changeisUserAuthorizedToProvisionCloudResources", false);
    },
  },
  modules: {},
  getters: {
    getLoginStatus(state) {
      return state.loginStatus;
    },
    getisUserAuthorizedToProvisionCloudResources(state) {
      return state.isUserAuthorizedToProvisionCloudResources;
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
    getMockTaskOrders(state) {
      return state.taskOrders;
    },
    getTaskOrderByName: (state) => (id: string) => {
      const values = Object.values(state.taskOrders.details);
      const taskOrderName = values.filter(
        (taskorder) => taskorder.task_order_number === id
      );
      if (taskOrderName.length > 0) {
        return taskOrderName[0];
      } else {
        return {};
      }
    },
    deleteTaskOrderByName: (state) => (id: string) => {
      const values = Object.values(state.taskOrders.details);
      const updatedArray = values.filter(
        (taskorder) => taskorder.task_order_number !== id
      );
      return updatedArray;
    },
  },
});
