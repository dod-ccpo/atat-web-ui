import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { mockTaskOrder } from "@/store/mocks/taskOrderMockData";
import { Application, Portfolio } from "types/Portfolios";
import PortfolioDraftsApi from "@/api/portfolios";
import { CLIN } from "types/Wizard";

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

const createStepOneModel = () => {
  return {
    model: {
      name: "",
      description: "",
      dod_components: [],
      csp: "",
    },
  };
};

const createStepTwoModel = () => {
  return {
    task_order_number: "",
    task_order_file: {
      description: "",
      id: "",
      crated_at: "",
      updated_at: "",
      size: 0,
      name: "",
      status: "",
    },
    clins: [],
  };
};

const createStepThreeModel = () => {
  return {
    name: "",
    description: "",
    environments: [],
  };
};

const createStepFourModel = () => {
  return {};
};

const createStepFiveModel = () => {
  return {};
};

const stepsModelInitializer = [
  {
    step: 1,
    model: createStepOneModel,
  },
  {
    step: 2,
    model: createStepTwoModel,
  },
  {
    step: 3,
    model: createStepThreeModel,
  },
  {
    step: 4,
    model: createStepFourModel,
  },
  {
    step: 5,
    model: createStepFiveModel,
  },
];

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    loginStatus: false,
    sideDrawer: false,
    sideDrawerType: "",
    isSideDrawerFocused: false,
    isUserAuthorizedToProvisionCloudResources: false,
    isNavSideBarDisplayed: false,
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
        valid: false,
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
        valid: false,
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
          clins: [],
        },
      },
      {
        step: 3,
        description: "Add Application",
        touched: false,
        valid: false,
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
        valid: false,
        model: {},
      },
      {
        step: 5,
        description: "Review and Submit",
        touched: false,
        valid: false,
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
    validationStamp: {},
  },
  mutations: {
    changeLoginStatus(state, status: boolean) {
      state.loginStatus = status;
    },
    changeSideDrawer(state, status: boolean) {
      state.sideDrawer = status;
    },
    changeSideDrawerType(state, type: string) {
      state.sideDrawerType = type;
    },
    changeFocusOnSideDrawer(state, setFocus: boolean) {
      state.isSideDrawerFocused = setFocus;
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
    /**
     * commits set model to the store - does not make api call
     * @param state
     * @param param1
     */
    doSaveStepModel(state, [model, stepNumber, valid]) {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      state.portfolioSteps[stepIndex].model = model;
      state.portfolioSteps[stepIndex].valid = valid;
      state.portfolioSteps[stepIndex].touched = true;

      const es: number[] = state.erroredSteps;
      const erroredStepIndex = es.indexOf(stepNumber);
      if (erroredStepIndex > -1 && valid) {
        es.splice(erroredStepIndex, 1);
      } else if (erroredStepIndex === -1 && !valid) {
        es.push(stepNumber);
      }
    },
    doUpdateStepModelValidity(state, [stepNumber, valid]) {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      state.portfolioSteps[stepIndex].valid = valid;
      state.portfolioSteps[stepIndex].touched = true;

      const es: number[] = state.erroredSteps;
      const erroredStepIndex = es.indexOf(stepNumber);
      if (erroredStepIndex > -1 && valid) {
        es.splice(erroredStepIndex, 1);
      } else if (erroredStepIndex === -1 && !valid) {
        es.push(stepNumber);
      }
    },
    /**
     * Partially or fully initializes step model
     * @param state
     * @param stepNumber
     */
    doInitializeSteps(state) {
      const initial = [...stepsModelInitializer];

      initial.forEach((step) => {
        const stepIndex = state.portfolioSteps.findIndex(
          (x) => x.step === step.step
        );
        state.portfolioSteps[stepIndex].model = step.model();
        state.portfolioSteps[stepIndex].valid = true;
        state.portfolioSteps[stepIndex].touched = false;
      });

      const es: number[] = state.erroredSteps;
      es.splice(0, es.length);
    },
    doSetErroredStep(state, [stepNumber, isErroredStep]) {
      const es: number[] = state.erroredSteps;
      if (isErroredStep) {
        es.push(stepNumber);
      } else {
        es.splice(stepNumber, 1);
      }
    },
    doSetSelectedCSP(state, selectedCSP) {
      state.selectedCSP = selectedCSP;
    },
    doSetCurrentPortfolioId(state, id) {
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
    setNavSideBarDisplayed(state, routeName: string) {
      if (routeName) {
        const routesWithNoNavSideBar = ["home", "dashboard", "profile"];
        state.isNavSideBarDisplayed = routesWithNoNavSideBar.every(
          (r) => r.toLowerCase() !== routeName.toLowerCase()
        );
      }
    },
    doTriggerValidation(state) {
      state.validationStamp = {
        timeStamp: Date.now(),
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
    validateStep({ commit }, step: number) {
      commit("setStepValidated", step);
    },
    displayNavSideBarDisplayed({ commit }, routeName: string) {
      commit("setNavSideBarDisplayed", routeName);
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
    },
    async updateStepModelValidity({ commit }, [stepNumber, valid]) {
      commit("doUpdateStepModelValidity", [stepNumber, valid]);
    },
    /**
     *
     * saves step data to backend based on step number
     */
    async saveStepData({ state }, stepNumber) {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      const step = state.portfolioSteps[stepIndex];
      switch (stepNumber as number) {
        case 1:
          await this.dispatch("saveStep1", step.model);
          break;
        case 2:
          await this.dispatch("saveStep2", step.model);
          break;
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
    async saveStep2({ state }, model: any) {
      // todo: this will be multiple task orders in the future

      const taskOrders = {
        task_orders: [
          {
            task_order_number: model.task_order_number,
            clins: model.clins.map((clin: CLIN) => {
              return {
                ...clin,
                // the api expects these values to be numbers not strings
                total_clin_value: Number(clin.total_clin_value),
                obligated_funds: Number(clin.obligated_funds),
              };
            }),
            csp: state.selectedCSP,
            task_order_file: {
              id: model.task_order_file.id,
              name: model.task_order_file.name,
            },
          },
        ],
      };

      await portfolioDraftsApi.createFunding(
        state.currentPortfolioId,
        taskOrders
      );
    },
    /**
     * Saves all valid step models with changes
     * @param context
     * @returns boolean value indicating successful save
     */
    async saveAllValidSteps({ state }): Promise<boolean> {
      let saved = false;
      //trigger validation
      // await this.dispatch("triggerValidation");
      // an array of promises to hold each step save api call
      const saveActions: unknown[] = [];
      // iterate over portfolio steps model and push valid models to save actions
      state.portfolioSteps.forEach((step) => {
        // only save models that have changes and are valid
        if (step.touched && step.valid) {
          saveActions.push(this.dispatch("saveStepData", step.step));
        }
      });

      try {
        await Promise.all(saveActions);
        saved = true;
      } catch (error) {
        console.log(error);
      }
      return saved;
    },
    async createPortfolioDraft({ commit }): Promise<void> {
      //initialize steps models
      commit("doInitializeSteps");
      const portfolioDraftId = await portfolioDraftsApi.createDraft();
      commit("doSetCurrentPortfolioId", portfolioDraftId);
    },
    async deletePortfolioDraft({ commit }, draftId: string): Promise<void> {
      await portfolioDraftsApi.deleteDraft(draftId);
      commit("doDeletePortfolioDraft", draftId);
    },
    async loadPortfolioDraft(
      { getters, commit, state },
      draftId: string
    ): Promise<void> {
      //initialize
      commit("doInitializeSteps");

      console.log(state.portfolioSteps);

      //validate portfolio draft id
      const id = await portfolioDraftsApi.getDraft(draftId);

      if (id === null) {
        throw new Error(`unable to locate portfolio draft with ${id}`);
      }

      commit("doSetCurrentPortfolioId", draftId);

      // get draft
      const draft = await portfolioDraftsApi.getPortfolio(draftId);

      if (draft) {
        // update step 1 model
        let step1Model: any = getters["getStepModel"](1);

        const step1StoreModel = {
          ...step1Model,
          name: draft.name,
          description: draft.description,
          dod_components: draft.dod_component,
        };

        // update step 1 model
        commit("doSaveStepModel", [step1StoreModel, 1, true]);
      }

      // get funding details
      const fundingDetails = await portfolioDraftsApi.getFunding(draftId);

      if (fundingDetails !== null) {
        const step2Model: any = getters["getStepModel"](2);

        //todo: will update this later..
        //there's potentially multiple task orders
        const taskOrder = fundingDetails.details[0];

        //update step 2 model with data returned from api
        const step2StoreModel = {
          ...step2Model,
          ...taskOrder,
        };

        const csp = taskOrder.csp ? taskOrder.csp : this.state.selectedCSP;
        const step1Model: any = getters["getStepModel"](1);
        step1Model.csp = csp;
        commit("doSaveStepModel", [step1Model, 1, true]);
        commit("doSetSelectedCSP", csp);
        commit("doSaveStepModel", [step2StoreModel, 2, true]);
      }
    },
    async triggerValidation({ commit }) {
      commit("doTriggerValidation");
    },
    closeSideDrawer({ commit }) {
      commit("changeSideDrawer", false);
    },
    openSideDrawer({ commit }, [drawerType, setFocusOnSideDrawer]) {
      commit("changeSideDrawer", true);
      commit("changeSideDrawerType", drawerType);
      commit("changeFocusOnSideDrawer", setFocusOnSideDrawer);
    },
  },
  modules: {},
  getters: {
    getLoginStatus(state) {
      return state.loginStatus;
    },
    getIsNavSideBarDisplayed(state) {
      return state.isNavSideBarDisplayed;
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
