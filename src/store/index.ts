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
    sideDrawer: true,
    isUserAuthorizedToProvisionCloudResources: false,
    portfolios: allPortfolios,
    taskOrders: mockTaskOrder,
    wizardNavigation: {},
    selectedCSP: "CSP 1", // can get this from portfolioSteps step 1 model.csp
    erroredSteps: [],
    currentStepNumber: 1,
    portfolioSteps: [
      {
        step: 1,
        description: "Create Portfolio",
        touched: false,
        model: {
          name: "",
          description: "",
          dod_components: [],
          csp: "",
        },
      },
      {
        step: 2,
        description: "Add Funding",
        touched: false,
        model: {
          task_order_number: "",
          task_order_file: {
            description: "",
            id: "",
            created_at: "",
            updated_at: "",
            size: 0,
            name: "",
            status: "",
          },
          clins: [
            {
              clin_number: "0001",
              idiq_clin: "IDIQ CLIN 0001 Unclassified IaaS/PaaS",
              total_clin_value: 200000,
              obligated_funds: 10000,
              pop_start_date: "2021-09-01",
              pop_end_date: "2022-09-01",
            },
          ],
        },
      },
      {
        step: 3,
        description: "Add Application",
        touched: false,
        model: {
          id: "",
          name: "",
          description: "",
          environments: [],
        },
      },
      {
        step: 4,
        description: "Add Team Members",
        touched: false,
        model: {},
      },
      {
        step: 5,
        description: "Review and Submit",
        touched: false,
        model: {},
      },
    ],
    user: {
      title: "Ms.",
      given_name: "Maria",
      family_name: "Missionowner",
      email: "maria.missionowner-civ@mail.mil",
      phone_number: "(555)-555-5555",
      service_branch: "U.S. Army",
      citizenship: "United States",
      dod_id: "1234567890",
      designation: "Civilian",
    },
  },
  mutations: {
    changeLoginStatus(state, status: boolean) {
      state.loginStatus = status;
    },
    changeSideDrawer(state, status: boolean) {
      state.sideDrawer = status;
    },
    changeisUserAuthorizedToProvisionCloudResources(state, status: boolean) {
      state.isUserAuthorizedToProvisionCloudResources = status;
    },
    setStepValidated(state, step: number) {
      state.erroredSteps = state.erroredSteps.filter((es) => es !== step);
    },
    doSetCurrentStepNumber(state, step: number) {
      state.currentStepNumber = step;
    },

    doSaveStepModel(state, [model, stepNumber, valid]) {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      state.portfolioSteps[stepIndex].model = model;
      state.portfolioSteps[stepIndex].touched = true;

      const es: number[] = state.erroredSteps;
      const erroredStepIndex = es.indexOf(stepNumber);
      if (erroredStepIndex > -1 && valid) {
        es.splice(erroredStepIndex, 1);
      } else if (erroredStepIndex === -1 && !valid) {
        es.push(stepNumber);
      }
    },

    doSetErroredStep(state, [stepNumber, isErroredStep]) {
      const es: number[] = state.erroredSteps;
      if (isErroredStep) {
        es.push(stepNumber);
      } else {
        es.splice(stepNumber, 1);
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
    validateStep({ commit }, step: number) {
      commit("setStepValidated", step);
    },
    authorizeUser({ commit }) {
      commit("changeisUserAuthorizedToProvisionCloudResources", true);
    },
    unauthorizeUser({ commit }) {
      commit("changeisUserAuthorizedToProvisionCloudResources", false);
    },
    setCurrentStepNumber({ commit }, step: number) {
      commit("doSetCurrentStepNumber", step);
    },
    saveStepModel({ commit }, [model, stepNumber, valid]) {
      commit("doSaveStepModel", [model, stepNumber, valid]);
    },
    setErroredStep({ commit }, [stepNumber, isErroredStep]) {
      commit("doSetErroredStep", [stepNumber, isErroredStep]);
    },
    closeSideDrawer({ commit }) {
      commit("changeSideDrawer", false);
    },
    openSideDrawer({ commit }) {
      commit("changeSideDrawer", true);
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
              newWindow: false,
              icon: "person",
              iconPlacement: "left",
              action: "profile",
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
    deletePortfolioById: (state) => (id: string) => {
      const values = Object.values(state.portfolios);
      const portfolios = values.filter((portfolio) => portfolio.id === id);
      return portfolios;
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

    getStepModel: (state) => (stepNumber: number) => {
      const step = state.portfolioSteps.find(
        (o: { step: number }) => o.step === stepNumber
      );
      return step?.model;
    },

    getStepTouched: (state) => (stepNumber: number) => {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      return state.portfolioSteps[stepIndex].touched;
    },
    getApplicationByID: (state) => (id: string) => {
      const portfolio = state.portfolios[11];
      const application = portfolio.applications.find((app) => app.id === id);

      if (application) {
        return application;
      } else {
        throw new Error(`unable to locate application with id  ${id}`);
      }
    },
    getUser: (state) => state.user,
    getSideDrawer: (state) => state.sideDrawer,
  },
});
