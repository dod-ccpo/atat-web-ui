import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { Dialog } from "types/FormFields";
import {
  Application,
  ApplicationModel,
  Portfolio,
  PortfolioDraft,
  PortFolioDraftDTO,
  TaskOrder,
} from "types/Portfolios";
import PortfolioDraftsApi from "@/api/portfolios";
import { TaskOrderModel } from "types/Wizard";
import { generateUid } from "@/helpers";
import { mockTaskOrders } from "./mocks/taskOrderMockData";
import { VEditDialog } from "vuetify/lib";

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
    id: "",
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
    id: "",
    name: "",
    description: "",
    environments: [
      {
        name: "Development",
        id: generateUid(),
      },
      {
        name: "Testing",
        id: generateUid(),
      },
      {
        name: "Staging",
        id: generateUid(),
      },
      {
        name: "Production",
        id: generateUid(),
      },
    ],
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

const getEntityIndex = <TModel>(
  entities: TModel[],
  predicate: (value: TModel, index: number, obj: TModel[]) => unknown,
  thisArg?: any
): number => {
  return entities.findIndex(predicate);
};

const mapTaskOrders = (taskOrderModels: TaskOrderModel[]): TaskOrder[] => {
  return taskOrderModels.map((model: TaskOrderModel) => {
    //extract all properties except the id
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...baseModel } = model;

    const taskOrders: TaskOrder = {
      ...baseModel,
      clins: model.clins.map((clin) => {
        return {
          ...clin,
          total_clin_value: Number(clin.total_clin_value),
          obligated_funds: Number(clin.obligated_funds),
        };
      }),
    };

    return taskOrders;
  });
};

const mapApplications = (
  applicationModels: ApplicationModel[]
): Application[] => {
  return applicationModels.map((model: ApplicationModel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...baseModel } = model;

    const application: Application = {
      ...baseModel,
      environments: model.environments.map((env) => {
        return {
          name: env.name,
          operators: env.operators
            ? env.operators.map((op) => {
                return {
                  access: op.access,
                  last_name: op.last_name,
                  first_name: op.first_name,
                  email: op.email,
                };
              })
            : [],
        };
      }),
    };

    return application;
  });
};

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    loginStatus: false,
    sideDrawer: false,
    sideDrawerType: "",
    isSideDrawerFocused: false,
    isUserAuthorizedToProvisionCloudResources: false,
    isNavSideBarDisplayed: false,
    dialog: {},
    portfolioDrafts: [],
    portfolios: [],
    taskOrderModels: [],
    applicationModels: [],
    portfolioOperators: [],
    wizardNavigation: {},
    selectedCSP: "CSP 1", // can get this from portfolioSteps step 1 model.csp
    erroredSteps: [],
    currentApplicationId: "2191437477-2820145163-168686896-1617696770",
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
          index: 0, //local guid
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
          id: "",
          name: "",
          description: "",
          operators: [],
          environments: [
            {
              name: "Development",
              id: generateUid(),
            },
            {
              name: "Testing",
              id: generateUid(),
            },
            {
              name: "Staging",
              id: generateUid(),
            },
            {
              name: "Production",
              id: generateUid(),
            },
          ],
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
    changeDialog(state, dialogProps: Dialog) {
      state.dialog = dialogProps;
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
    /**
     * commits set model to the store - does not make api call
     * @param state
     * @param param1
     */
    doInitializeStepModel(state, [model, stepNumber]) {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );
      state.portfolioSteps[stepIndex].model = model;
      state.portfolioSteps[stepIndex].valid = true;
      state.portfolioSteps[stepIndex].touched = false;
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

      //clear out task order models
      Vue.set(state, "taskOrderModels", []);
      Vue.set(state, "applicationModels", []);

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
    updatePortfolioDrafts(state, portfolioDrafts: PortfolioDraft[]) {
      Vue.set(state, "portfolioDrafts", [...portfolioDrafts]);
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
    setCurrentTaskOrders(state, taskOrders: TaskOrder[]) {
      const taskOrderModels = taskOrders.map((taskOrder) => {
        const taskOrderModel: TaskOrderModel = {
          id: generateUid(),
          ...taskOrder,
        };
        return taskOrderModel;
      });

      Vue.set(state, "taskOrderModels", taskOrderModels);
    },
    doAddTaskOrder(state, model: any) {
      state.taskOrderModels.push(model as never);
    },
    doUpdateTaskOrder(state, [index, model]) {
      Vue.set(state.taskOrderModels, index, model);
    },
    doDeleteTaskOrder(state, id: string) {
      const index = getEntityIndex(
        state.taskOrderModels,
        (taskOrder: TaskOrderModel) => taskOrder.id === id
      );

      if (index > -1) {
        state.taskOrderModels.splice(index, 1);
      } else {
        throw new Error("could not delete task order with id: " + id);
      }
    },
    setCurrentApplications(state, applications: Application[]) {
      const applicationModels = applications.map((application) => {
        const applicationModel: ApplicationModel = {
          ...application,
          id: generateUid(),
          environments: application.environments.map((environment) => {
            return {
              ...environment,
              id: generateUid(),
              operators: environment.operators
                ? environment.operators.map((operator) => {
                    return {
                      ...operator,
                      id: generateUid(),
                    };
                  })
                : [],
            };
          }),
        };

        return applicationModel;
      });

      Vue.set(state, "applicationModels", applicationModels);
    },
    doAddApplication(state, model: any) {
      state.applicationModels.push(model as never);
    },
    doUpdateApplication(state, [index, model]) {
      Vue.set(state.applicationModels, index, model);
    },
    doDeleteApplication(state, id: string) {
      const index = getEntityIndex(
        state.applicationModels,
        (application: ApplicationModel) => application.id === id
      );

      if (index > -1) {
        state.applicationModels.splice(index, 1);
      } else {
        throw new Error("could not delete application order with id: " + id);
      }
    },
    doUpdateApplicationEnvironments(state, [appId, environments]) {
      const index = getEntityIndex(
        state.applicationModels,
        (application: ApplicationModel) => application.id === appId
      );
      let appModel: ApplicationModel = state.applicationModels[index];
      appModel.environments = environments;
    }
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
    async addTaskOrder({ commit }, model) {
      commit("doAddTaskOrder", model);
    },
    async updateTaskOrder({ commit }, [index, model]) {
      commit("doUpdateTaskOrder", [index, model]);
    },
    async deleteTaskOrder({ commit, state }, id: string): Promise<void> {
      try {
        commit("doDeleteTaskOrder", id);

        const taskOrders = {
          task_orders: mapTaskOrders(state.taskOrderModels),
        };

        await portfolioDraftsApi.saveFunding(
          state.currentPortfolioId,
          taskOrders
        );
      } catch (error) {
        console.log(error);
      }
    },
    editTaskOrder({ commit, state }, id: string) {
      const taskOrderIndex = getEntityIndex(
        state.taskOrderModels,
        (taskOrder: TaskOrderModel) => taskOrder.id === id
      );

      if (taskOrderIndex === -1) {
        throw new Error("unable to location task order model with id :" + id);
      }
      const taskOrder = state.taskOrderModels[taskOrderIndex];

      commit("doSaveStepModel", [taskOrder, 2, true]);
    },
    addNewTaskOrder({ commit }) {
      const model = { ...createStepTwoModel() };
      commit("doInitializeStepModel", [model, 2]);
    },
    async addApplication({ commit }, model) {
      commit("doAddApplication", model);
    },
    async updateApplication({ commit }, [index, model]) {
      commit("doUpdateApplication", [index, model]);
    },
    async deleteApplication({ commit, state }, id: string): Promise<void> {
      try {
        commit("doDeleteApplication", id);

        const _applications = state.applicationModels.map(
          (model: Application) => {
            const application: Application = {
              ...model,
            };

            return application;
          }
        );

        const data = {
          applications: _applications,
        };

        await portfolioDraftsApi.saveApplications(
          state.currentPortfolioId,
          data
        );
      } catch (error) {
        console.log(error);
      }
    },
    editApplication({ commit, state }, id: string) {
      const entityIndex = getEntityIndex(
        state.applicationModels,
        (entity: ApplicationModel) => entity.id === id
      );

      if (entityIndex === -1) {
        throw new Error("unable to location task order model with id :" + id);
      }
      const applicationModel = state.applicationModels[entityIndex];

      commit("doSaveStepModel", [applicationModel, 3, true]);
    },
    addNewApplication({ commit }) {
      const model = { ...createStepThreeModel() };
      commit("doInitializeStepModel", [model, 3]);
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
        case 3:
          await this.dispatch("saveStep3", step.model);
          break;
      }
    },
    setErroredStep({ commit }, [stepNumber, isErroredStep]) {
      commit("doSetErroredStep", [stepNumber, isErroredStep]);
    },
    async loadPortfolioDrafts({ commit }) {
      const portfolioDrafts = await portfolioDraftsApi.getAll();
      commit("updatePortfolioDrafts", portfolioDrafts);
    },
    async saveStep1({ state, commit }, model: any) {
      // build data from step model
      const data: PortFolioDraftDTO = {
        id: state.currentPortfolioId,
        name: model.name,
        description: model.description,
        csp: model.csp,
        dod_components: model.dod_components,
        portfolio_managers: [],
      };

      await portfolioDraftsApi.savePortfolio(state.currentPortfolioId, data);
      commit("doSetSelectedCSP", model.csp);
    },
    async saveStep2({ state }, model: any) {
      if (model.id === "") {
        model.id = generateUid();
        this.dispatch("addTaskOrder", model);
      } else {
        const taskOrderIndex = getEntityIndex<TaskOrderModel>(
          state.taskOrderModels,
          (taskOrder) => taskOrder.id === model.id
        );

        if (taskOrderIndex === -1) {
          throw new Error(
            "unable to location task order model with id :" + model.id
          );
        }

        this.dispatch("updateTaskOrder", [taskOrderIndex, model]);
      }

      const taskOrders = {
        task_orders: mapTaskOrders(state.taskOrderModels),
      };

      await portfolioDraftsApi.saveFunding(
        state.currentPortfolioId,
        taskOrders
      );
    },
    async saveStep3({ state }, model: any) {
      if (model.id === "") {
        model.id = generateUid();
        this.dispatch("addApplication", model);
      } else {
        const appIndx = getEntityIndex<ApplicationModel>(
          state.applicationModels,
          (application) => application.id === model.id
        );
        if (appIndx === -1) {
          throw new Error(
            "unable to location task order model with id :" + model.id
          );
        }

        this.dispatch("updateApplication", [appIndx, model]);
      }

      const applications = mapApplications(state.applicationModels);

      const data = {
        applications: applications,
      };

      await portfolioDraftsApi.saveApplications(state.currentPortfolioId, data);
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
    async loadPortfolioDraft({ commit }, draftId: string): Promise<void> {
      //initial step model data
      commit("doInitializeSteps");

      //validate that portfolio draft id exists on the server
      const id = await portfolioDraftsApi.getDraft(draftId);

      if (id === null) {
        throw new Error(`unable to locate portfolio draft with ${id}`);
      }

      commit("doSetCurrentPortfolioId", draftId);
      const loadActions = [
        this.dispatch("loadStep1Data", draftId),
        this.dispatch("loadStep2Data", draftId),
        this.dispatch("loadStep3Data", draftId),
      ];

      await Promise.all(loadActions);
    },
    async loadStep1Data({ commit }, draftId: string): Promise<void> {
      const draft = await portfolioDraftsApi.getPortfolio(draftId);
      if (draft) {
        const step1Model = {
          name: draft.name,
          description: draft.description,
          dod_components: draft.dod_components,
          csp: draft.csp,
        };

        // update step 1 model
        commit("doSaveStepModel", [step1Model, 1, true]);
      }
    },
    async loadStep2Data({ commit }, draftId: string): Promise<void> {
      // get funding details
      const taskOrders = await portfolioDraftsApi.getFunding(draftId);

      if (taskOrders !== null) {
        //store the tasks orders
        commit("setCurrentTaskOrders", taskOrders);
      }
    },
    async loadStep3Data({ commit }, draftId: string): Promise<void> {
      const applications = await portfolioDraftsApi.getApplications(draftId);
      if (applications != null) {
        //store the applications
        commit("setCurrentApplications", applications);
      }
    },
    openDialog(
      { commit },
      [dialogType, setFocusOnDialog, dialogWidth, dialogHeight]
    ) {
      const dialogProps: Dialog = {
        isDisplayed: true,
        type: dialogType,
        setFocus: setFocusOnDialog,
        width: dialogWidth,
        height: dialogHeight,
      };
      commit("changeDialog", dialogProps);
    },
    closeSideDrawer({ commit }) {
      commit("changeSideDrawer", false);
    },
    openSideDrawer({ commit }, [drawerType, setFocusOnSideDrawer]) {
      commit("changeSideDrawer", true);
      commit("changeSideDrawerType", drawerType);
      commit("changeFocusOnSideDrawer", setFocusOnSideDrawer);
    },
    updateApplicationEnvironments({commit}, [appId, environments]) {
      commit("doUpdateApplicationEnvironments", [appId, environments]);
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
    getMockTaskOrders() {
      return mockTaskOrders;
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
    getUser: (state) => state.user,
    getSideDrawer: (state) => state.sideDrawer,
    getTaskOrders: (state) => state.taskOrderModels,
    getApplications: (state) => state.applicationModels,
    getCurrentApplicationId: (state) => state.currentApplicationId,
    getCurrentApplication: (state) => {
      // const applicationIndex = getEntityIndex(
      //   state.applicationModels,
      //   (application: ApplicationModel) => 
      //     application.id === state.currentApplicationId);
      // return state.applicationModels[applicationIndex];

      // EJY temp until table wired up with state.currentApplication
      return state.applicationModels[0]; 
    }

  },
});
