import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import {
  Application,
  ApplicationDTO,
  EntityWrapper,
  Portfolio,
  PortfolioDraft,
  PortFolioDraftDTO,
  TaskOrder,
} from "types/Portfolios";
import PortfolioDraftsApi from "@/api/portfolios";
import { CLIN } from "types/Wizard";
import { allPortfolios } from "./mocks/portfoliosMockData";
import { generateUid } from "@/helpers";
import { mockTaskOrder } from "./mocks/taskOrderMockData";

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

const upwrapEntities = <TModel>(
  entities: EntityWrapper<TModel>[]
): TModel[] => {
  return entities.map((entity) => entity.model);
};

const getEntityIndex = <TModel>(
  entities: EntityWrapper<TModel>[],
  id: string
): number => {
  return entities.findIndex((entity) => entity.id == id);
};

const createTaskOrderEntity = (
  model: any,
  id: string
): EntityWrapper<TaskOrder> => {
  const taskOrder: EntityWrapper<TaskOrder> = {
    id: id,
    model: {
      task_order_number: model.task_order_number,
      clins: model.clins.map((clin: CLIN) => {
        return {
          ...clin,
          // the api expects these values to be numbers not strings
          total_clin_value: Number(clin.total_clin_value),
          obligated_funds: Number(clin.obligated_funds),
        };
      }),
      task_order_file: {
        id: model.task_order_file.id,
        name: model.task_order_file.name,
        // we stub out the props below only to satisfy the typ
        // these values won't be consumed by the api call
        created_at: "",
        updated_at: "",
        size: 0,
        status: "",
      },
    },
  };

  return taskOrder;
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
    portfolioDrafts: [],
    portfolios: [],
    taskOrderModels: [],
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

      //clear out task order models
      Vue.set(state, "taskOrderModels", []);

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
    doTriggerValidation(state) {
      state.validationStamp = {
        timeStamp: Date.now(),
      };
    },
    setCurrentTaskOrders(state, taskOrders: TaskOrder[]) {
      const wrappedTaskOrders = taskOrders.map((taskOrder) => {
        const wrappedTaskOrder: EntityWrapper<TaskOrder> = {
          id: generateUid(),
          model: taskOrder,
        };
        return wrappedTaskOrder;
      });

      Vue.set(state, "taskOrderModels", wrappedTaskOrders);
    },
    doAddTaskOrder(state, model: any) {
      state.taskOrderModels.push(model as never);
    },
    doUpdateTaskOrder(state, [index, model]) {
      Vue.set(state.taskOrderModels, index, model);
    },
    doDeleteTaskOrder(state, id: string) {
      const index = state.taskOrderModels.findIndex(
        (entity: EntityWrapper<TaskOrder>) => entity.id == id
      );
      if (index > -1) {
        state.taskOrderModels.splice(index, 1);
      } else {
        throw new Error("could not delete task order with id: " + id);
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
      debugger;
      // todo: this will be multiple task orders in the future

      const taskOrder =
        model.id === ""
          ? createTaskOrderEntity(model, generateUid())
          : createTaskOrderEntity(model, model.id);

      if (model.id === "") {
        this.dispatch("addTaskOrder", taskOrder);
      } else {
        const taskOrderIndex = getEntityIndex(state.taskOrderModels, model.id);

        if (taskOrderIndex === -1) {
          throw new Error(
            "unable to location task order model with id :" + model.id
          );
        }

        const taskOrder = createTaskOrderEntity(model, model.id);
        this.dispatch("updateTaskOrder", [taskOrderIndex, taskOrder]);
      }

      const task_orders = upwrapEntities<TaskOrder>(this.state.taskOrderModels);

      const taskOrders = {
        task_orders: task_orders,
      };

      await portfolioDraftsApi.saveFunding(
        state.currentPortfolioId,
        taskOrders
      );
    },
    async saveStep3({ state }, model: any) {
      const data: ApplicationDTO[] = [];
      await portfolioDraftsApi.saveApplication(state.currentPortfolioId, data);
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
      await this.dispatch("loadStep1Data", draftId);
      await this.dispatch("loadStep2Data", draftId);
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
        //todo: will update this later..
        //there's potentially multiple task orders

        //store the tasks orders
        commit("setCurrentTaskOrders", taskOrders);

        //todo: in the future this will need to be called for each task order

        //const taskOrderFileId = taskOrder.task_order_file?.id;
        //if (taskOrderFileId) {
        // const taskOrderFile = await portfolioDraftsApi.getTaskOrderFile(
        //   taskOrderFileId
        // );
        // if (taskOrderFile !== null) {
        //   taskOrder.task_order_file = taskOrderFile;
        // }

        //stub out task order file data as endpoint isn't implemented
        // taskOrder.task_order_file = {
        //   id: taskOrder.task_order_file?.id || "",
        //   name: taskOrder.task_order_file?.name || "",
        //   updated_at: "1979-12-08T04:43:33.976Z",
        //   created_at: "1976-06-05T02:43:49.535Z",
        //   size: 88312532.23745316,
        //   status: "pending",
        //};
        //}

        //update step 2 model with data returned from api
        // const step2StoreModel = {
        //   ...taskOrder,
        // };

        // commit("doSaveStepModel", [step2StoreModel, 2, true]);
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
    async deleteTaskOrder({ commit, state }, id: string): Promise<void> {
      try {
        commit("doDeleteTaskOrder", id);
        const taskOrders = upwrapEntities<TaskOrder>(
          this.state.taskOrderModels
        );
        await portfolioDraftsApi.saveFunding(
          state.currentPortfolioId,
          taskOrders
        );
      } catch (error) {
        console.log(error);
      }
    },
    editTaskOrder({ commit, state }, id: string) {
      const taskOrderIndex = getEntityIndex(state.taskOrderModels, id);

      if (taskOrderIndex === -1) {
        throw new Error("unable to find task order with id: " + id);
      }

      const taskOrder: EntityWrapper<TaskOrder> =
        state.taskOrderModels[taskOrderIndex];

      commit("doSaveStepModel", [taskOrder.model, 2, true]);
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
      return mockTaskOrder.details;
    },
    // getTaskOrderByName: (state) => (id: string) => {
    //   const values = Object.values(state.taskOrders.details);
    //   const taskOrderName = values.filter(
    //     (taskorder) => taskorder.task_order_number === id
    //   );
    //   if (taskOrderName.length > 0) {
    //     return taskOrderName[0];
    //   } else {
    //     return {};
    //   }
    // },
    // deleteTaskOrderByName: (state) => (id: string) => {
    //   const values = Object.values(state.taskOrders.details);
    //   const updatedArray = values.filter(
    //     (taskorder) => taskorder.task_order_number !== id
    //   );
    //   return updatedArray;
    // },

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
    getApplicationByID: () => (id: string) => {
      const application = allPortfolios[11].applications.find(
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
