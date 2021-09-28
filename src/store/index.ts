import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { mockTaskOrder } from "@/store/mocks/taskOrderMockData";
import { Application, Portfolio } from "types/Portfolios";
import PortfolioDraftsApi from "@/api/portfolios";

Vue.use(Vuex);

const portfolioDraftsApi = new PortfolioDraftsApi();

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
    sideDrawer: false,
    isUserAuthorizedToProvisionCloudResources: false,
    portfolios: [],
    taskOrders: mockTaskOrder,
    wizardNavigation: {},
    selectedCSP: "CSP 1", // can get this from portfolioSteps step 1 model.csp
    erroredSteps: [],
    currentStepNumber: 1,
    currentPortfolioId: "",
    currentStepModel: {},
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
    doSetCurrentStepModel(state, model: any) {
      state.currentStepModel = { ...model };
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
    doSetSelectedCSP(state, selectedCSP){
      state.selectedCSP = selectedCSP;
    },
    setPorfolioDraftId(state, id) {
      state.currentPortfolioId = id;
    },
    updatePortfolios(state, portfolios: Portfolio[]) {
      Vue.set(state, "portfolios", [...portfolios]);
    },
    doDeletePortfolioDraft(state, draftId: string) {
      const portfololioIndex = state.portfolios.findIndex(
        (p: Portfolio) => p.id === draftId
      );

      if (portfololioIndex > -1) {
        state.portfolios.splice(portfololioIndex, 1);
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
    setCurrentStepNumber({ getters, commit }, step: number) {
      commit("doSetCurrentStepNumber", step);
      const stepModel = getters.getStepModel(step);
      commit("doSetCurrentStepModel", stepModel);
    },
    setCurrentStepModel({ commit }, model) {
      commit("doSetCurrentStepModel", model);
    },
    async saveStepModel({ commit }, [model, stepNumber, valid]) {
      commit("doSaveStepModel", [model, stepNumber, valid]);
      switch (stepNumber as number) {
        case 1:
          await this.dispatch("saveStep1", model);
      }
    },
    setErroredStep({ commit }, [stepNumber, isErroredStep]) {
      commit("doSetErroredStep", [stepNumber, isErroredStep]);
    },
    async loadPortfolios({ commit }) {
      const portfolios = await portfolioDraftsApi.getAll();
      commit("updatePortfolios", portfolios);
    },
    async saveStep1({ state, commit }, model: any) {
      await portfolioDraftsApi.savePortfolio(state.currentPortfolioId, model);
      commit("doSetSelectedCSP", model.csp);
    },
    async createPortfolioDraft({ commit }): Promise<void> {
      const portfolioDraftId = await portfolioDraftsApi.createDraft();
      commit("setPorfolioDraftId", portfolioDraftId);
    },
    async deletePortfolioDraft({ commit }, draftId: string): Promise<void> {
      await portfolioDraftsApi.deleteDraft(draftId);
      commit("doDeletePortfolioDraft", draftId);
    },
    async loadPortfolioDraft(
      { getters, commit },
      draftId: string
    ): Promise<void> {
      const draft = await portfolioDraftsApi.getDraft(draftId);

      // update step 1 model
      let model: any = getters["getStepModel"](1);

      model = {
        ...model,
        name: draft.name,
        description: draft.description,
        dod_components: draft.dod_component,
      };
      commit("doSaveStepModel", [model, 1, true]);
      commit("doSetCurrentPortfolioId", draftId);
      //todo: will need to update the other models here as well
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
      const portfoliobyId = values.filter(
        (portfolio: Portfolio) => portfolio.id === id
      );
      if (portfoliobyId.length > 0) {
        return portfoliobyId[0];
      } else {
        return {};
      }
    },
    deletePortfolioById: (state) => (id: string) => {
      const values = Object.values(state.portfolios);
      const portfolios = values.filter(
        (portfolio: Portfolio) => portfolio.id === id
      );
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
    getCurrentStepModel: (state) => state.currentStepModel,
    getStepTouched: (state) => (stepNumber: number) => {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      return state.portfolioSteps[stepIndex].touched;
    },
    getApplicationByID: (state) => (id: string) => {
      const portfolio = state.portfolios[11] as Portfolio;
      const application = portfolio.applications.find(
        (app: Application) => app.id === id
      );

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
