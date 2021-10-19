import Vue from "vue";
import Vuex from "vuex";
import VuexPersist from "vuex-persist";
import { Navs } from "../../types/NavItem";
import { Dialog, Toast } from "types/Global";
import {
  Application,
  ApplicationModel,
  EnvironmentModel,
  Operator,
  OperatorModel,
  Portfolio,
  PortfolioDraft,
  TaskOrder,
} from "types/Portfolios";
import PortfolioDraftsApi from "@/api/portfolios";
import { TaskOrderModel } from "types/Wizard";
import { generateUid } from "@/helpers";
import { mockTaskOrders } from "./mocks/taskOrderMockData";
import moment from "moment";

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
      task_order_file: {
        id: model.task_order_file.id,
        name: model.task_order_file.name,
      },
      clins: model.clins.map((clin) => {
        return {
          ...clin,
          total_clin_value: Number(clin.total_clin_value),
          obligated_funds: Number(clin.obligated_funds),
          pop_start_date: moment(clin.pop_start_date).format("YYYY-MM-DD"),
          pop_end_date: moment(clin.pop_end_date).format("YYYY-MM-DD"),
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
      operators: model.operators
        ? model.operators.map((op) => {
            return {
              access: op.access,
              display_name: op.display_name,
              email: op.email,
            };
          })
        : [],
      environments: model.environments.map((env) => {
        return {
          name: env.name,
          operators: env.operators
            ? env.operators.map((op) => {
                return {
                  access: op.access,
                  display_name: op.display_name,
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

const mapOperators = (operatorsModels: OperatorModel[]): Operator[] => {
  return operatorsModels.map((operatorModel: OperatorModel) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...baseModel } = operatorModel;

    const operator: Operator = {
      ...baseModel,
    };

    return operator;
  });
};

const StepModelIndices: Record<number, number> = {
  1: 0,
  2: 1,
  3: 2,
  4: 3,
  5: 4,
};

/*
█████████████████████████████████████████

███████ ████████  █████  ████████ ███████
██         ██    ██   ██    ██    ██
███████    ██    ███████    ██    █████
     ██    ██    ██   ██    ██    ██
███████    ██    ██   ██    ██    ███████

█████████████████████████████████████████
*/

export default new Vuex.Store({
  plugins: [vuexLocalStorage.plugin],
  state: {
    loginStatus: false,
    sideDrawer: false,
    sideDrawerType: "",
    isSideDrawerFocused: false,
    isUserAuthorizedToProvisionCloudResources: false,
    isNavSideBarDisplayed: false,
    dialog: {
      isDisplayed: false,
      type: "",
      setFocus: false,
      width: "",
      height: "",
      props: null,
    },
    portfolioDrafts: [],
    portfolios: [],
    taskOrderModels: [],
    applicationModels: [],
    portfolioOperators: [],
    wizardNavigation: {},
    erroredSteps: [],
    currentStepNumber: 1,
    currentPortfolioId: "",
    currentApplicationId: "",
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
      title: "",
      given_name: "",
      family_name: "",
      email: "",
      phone_number: "",
      service_branch: "",
      citizenship: "",
      dod_id: "",
      designation: "",
    },
    validationStamp: {},
    toast: {
      isDisplayed: false,
      message: "",
      contentClass: "",
    },
  },
  /*
  ███████████████████████████████████████████████████████████████████████████

  ███    ███ ██    ██ ████████  █████  ████████ ██  ██████  ███    ██ ███████
  ████  ████ ██    ██    ██    ██   ██    ██    ██ ██    ██ ████   ██ ██
  ██ ████ ██ ██    ██    ██    ███████    ██    ██ ██    ██ ██ ██  ██ ███████
  ██  ██  ██ ██    ██    ██    ██   ██    ██    ██ ██    ██ ██  ██ ██      ██
  ██      ██  ██████     ██    ██   ██    ██    ██  ██████  ██   ████ ███████

  ███████████████████████████████████████████████████████████████████████████
  */
  mutations: {
    changeLoginStatus(state, status: boolean) {
      state.loginStatus = status;
    },
    changeUser(state, user: any) {
      // These attributes will come across directly and cleanly from the
      // u[stream identity provider and Cognito
      state.user.given_name = user?.given_name ?? "";
      state.user.family_name = user?.family_name ?? "";
      state.user.email = user?.email ?? "Not Provided";
      // This field will have to be a custom Cognito attribute and so
      // the source object may have a different format.
      state.user.dod_id = user?.["custom:dod_id"] ?? "1234567890";
      state.user.citizenship = user?.["custom:citizenship"] ?? "United States";
      state.user.designation = user?.["custom:designation"] ?? "Civilian";
      // This field may not be available from our identity provider
      state.user.phone_number = user?.phone ?? "(555) 555-5555";
      // There is not currently a known way to get this information from
      // the identity provider.
      state.user.service_branch = "U.S. Army";
      state.user.title = "Ms.";
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

      Vue.set(state.portfolioSteps[stepIndex], "model", model);
      Vue.set(state.portfolioSteps[stepIndex], "valid", valid);
      Vue.set(state.portfolioSteps[stepIndex], "touched", true);

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

      Vue.set(state.portfolioSteps[stepIndex], "model", model);
      Vue.set(state.portfolioSteps[stepIndex], "valid", true);
      Vue.set(state.portfolioSteps[stepIndex], "touched", false);
    },
    doUpdateStepModelValidity(state, [stepNumber, valid]) {
      const stepIndex = state.portfolioSteps.findIndex(
        (x) => x.step === stepNumber
      );

      Vue.set(state.portfolioSteps[stepIndex], "valid", valid);
      Vue.set(state.portfolioSteps[stepIndex], "touched", true);

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

        Vue.set(state.portfolioSteps[stepIndex], "model", step.model());
        Vue.set(state.portfolioSteps[stepIndex], "valid", true);
        Vue.set(state.portfolioSteps[stepIndex], "touched", false);
      });

      //clear out task order models
      Vue.set(state, "taskOrderModels", []);
      Vue.set(state, "applicationModels", []);
      Vue.set(state, "portfolioOperators", []);

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
    doSetCurrentPortfolioId(state, id) {
      state.currentPortfolioId = id;
    },
    doSetApplicationId(state, id) {
      state.currentApplicationId = id;
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
          task_order_file: {
            id: taskOrder.task_order_file.id,
            name: taskOrder.task_order_file.name,
            created_at: "",
            updated_at: "",
            size: 0,
            status: "",
          },
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
          operators: application.operators
            ? application.operators.map((operator) => {
                return {
                  ...operator,
                  id: generateUid(),
                };
              })
            : [],
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
    doUpdateEnvironmentOperators(state, [appId, environments]) {
      const index = getEntityIndex(
        state.applicationModels,
        (application: ApplicationModel) => application.id === appId
      );
      const appModel: ApplicationModel = state.applicationModels[index];
      environments.forEach((env: EnvironmentModel) => {
        const envId = env.id;
        const index = getEntityIndex(
          appModel.environments,
          (environment: EnvironmentModel) => environment.id === envId
        );
        const envModel: EnvironmentModel = appModel.environments[index];
        if (Object.prototype.hasOwnProperty.call(envModel, "operators")) {
          envModel.operators.push(...env.operators);
        } else {
          envModel.operators = env.operators;
        }
      });
    },
    doUpdateApplicationOperators(state, [appId, operators]) {
      const index = getEntityIndex(
        state.applicationModels,
        (application: ApplicationModel) => application.id === appId
      );
      const appModel: ApplicationModel = state.applicationModels[index];
      if (Object.prototype.hasOwnProperty.call(appModel, "operators")) {
        appModel.operators.push(...operators);
      } else {
        appModel.operators = operators;
      }
    },

    doUpdateRootAdministrators(state, operators: OperatorModel[]) {
      const rootAdmins: OperatorModel[] = state.portfolioOperators;
      rootAdmins.push(...operators);
    },

    doInitializeRootAdministrators(state) {
      Vue.set(state, "portfolioOperators", []);
    },
    doToast(state, props) {
      state.toast = props;
    },

    doUpdateRootAdminInfo(state, [index, display_name, email]) {
      const portfolioOperators: OperatorModel[] = state.portfolioOperators;
      portfolioOperators[index].display_name = display_name;
      portfolioOperators[index].email = email;
    },
    doUpdateApplicationOperatorInfo(
      state,
      [applicationId, access, display_name, email, originalEmail]
    ) {
      const apps: ApplicationModel[] = state.applicationModels;
      const appIndex = apps.map((a) => a.id).indexOf(applicationId);
      const app: ApplicationModel = apps[appIndex];
      const appOperators: OperatorModel[] = app.operators || [];
      const opIndex = appOperators.map((o) => o.email).indexOf(originalEmail);
      if (opIndex > -1) {
        // if existing, update info
        appOperators[opIndex].display_name = display_name;
        appOperators[opIndex].email = email;
        appOperators[opIndex].access = access;
      } else {
        // if new, push into array
        const newOp: OperatorModel = {
          display_name: display_name,
          email: email,
          access: access,
          id: generateUid(),
        };
        appOperators.push(newOp);
      }
      // remove member from environment-level access if any
      const envs: EnvironmentModel[] = app.environments;
      envs.forEach((env) => {
        const ops: OperatorModel[] = env.operators || [];
        const newOps = ops.filter((o) => {
          o.email !== originalEmail;
        });
        ops.splice(0, ops.length, ...newOps);
      });
    },
    doUpdateEnvironmentOperatorInfo(
      state,
      [applicationId, display_name, email, originalEmail, updatedEnvs]
    ) {
      const apps: ApplicationModel[] = state.applicationModels;
      const appIndex = apps.map((a) => a.id).indexOf(applicationId);
      const app: ApplicationModel = apps[appIndex];
      const appOperators: OperatorModel[] = app.operators || [];
      // remove from application operators if member was previously app operator
      if (appOperators.length) {
        const appOpIndex = appOperators.findIndex(
          (a) => a.email === originalEmail
        );
        if (appOpIndex > -1) {
          appOperators.splice(appOpIndex, 1);
        }
      }
      // assign new environment access
      const envs: EnvironmentModel[] = app.environments || [];
      if (envs.length) {
        envs.forEach((envInModel) => {
          const ops: OperatorModel[] = envInModel.operators || [];
          const opIndex = ops.findIndex((o) => o.email === originalEmail);
          // find env id in updatedEnvs
          const updatedEnvIndex = updatedEnvs.findIndex(
            (u: any) => u.env_id === envInModel.id
          );
          const updatedInfo = updatedEnvs[updatedEnvIndex];
          if (opIndex > -1) {
            if (updatedInfo.role_value === "no_access") {
              // remove if found in operators for this env
              const newOps = ops.filter((o) => o.email !== originalEmail);
              ops.splice(0, ops.length, ...newOps);
            } else {
              // update env operator info
              ops[opIndex].display_name = display_name;
              ops[opIndex].email = email;
              ops[opIndex].access = updatedInfo.role_value;
            }
          } else {
            // add member to this environment operators
            const newOp = {
              display_name: display_name,
              email: email,
              access: updatedInfo.role_value,
              id: generateUid(),
            };
            ops.push(newOp);
          }
        });
      }
    },
  },
  /*
  ██████████████████████████████████████████████████████

   █████   ██████ ████████ ██  ██████  ███    ██ ███████
  ██   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ███████ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██   ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ██   ██  ██████    ██    ██  ██████  ██   ████ ███████

  ██████████████████████████████████████████████████████
  */
  actions: {
    login({ commit }, user) {
      commit("changeLoginStatus", true);
      commit("changeUser", user);
    },
    logout({ commit }) {
      commit("changeLoginStatus", false);
      commit("changeUser", null);
      window.sessionStorage.clear();
    },
    validateStep({ commit }, step: number) {
      commit("setStepValidated", step);
    },
    setCurrentApplicationId({ commit }, applicationId) {
      commit("doSetApplicationId", applicationId);
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
        commit("doInitializeStepModel", [createStepTwoModel(), 2]);

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
        commit("doInitializeStepModel", [createStepThreeModel(), 3]);
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
        case 4:
          await this.dispatch("saveStep4");
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
      const data = {
        name: model.name,
        description: model.description,
        csp: model.csp,
        dod_components: model.dod_components,
        portfolio_managers: [],
      };

      await portfolioDraftsApi.savePortfolio(state.currentPortfolioId, data);
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
      const operators = mapOperators(state.portfolioOperators);

      const data = {
        operators: operators,
        applications: applications,
      };

      await portfolioDraftsApi.saveApplications(state.currentPortfolioId, data);
    },
    async saveStep4({ state }) {
      const applications = mapApplications(state.applicationModels);
      const operators = mapOperators(state.portfolioOperators);

      const data = {
        operators: operators,
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
        commit("doSaveStepModel", [createStepTwoModel(), 2, true]);
      }
    },
    async loadStep3Data({ commit }, draftId: string): Promise<void> {
      const applicationData = await portfolioDraftsApi.getApplications(draftId);
      if (applicationData != null) {
        //store the applications
        commit("setCurrentApplications", applicationData.applications);
        commit("doInitializeRootAdministrators");

        const operators = applicationData.operators.map(
          (operator: Operator) => {
            const operatorModels: OperatorModel = {
              ...operator,
              id: generateUid(),
            };

            return operator;
          }
        );

        commit("doUpdateRootAdministrators", operators);
        commit("doSaveStepModel", [createStepThreeModel(), 3, true]);
      }
    },
    validateOperators(context, applicationModel: ApplicationModel): boolean {
      //todo : fill out this funcationlity
      // const hasAtleastOneRootAdmin = applicationModel.operators &&
      // applicationModel.operators.find((operator: OperatorModel) => operator.access === "administrator") !==  undefined;

      // if(applicationModel.operators || )

      //temporary fix to allow the placeholders
      console.log(context);
      console.log(applicationModel);
      return false;
    },
    openDialog(
      { commit },
      [dialogType, setFocusOnDialog, dialogWidth, dialogHeight, props]
    ) {
      const dialogProps: Dialog = {
        isDisplayed: true,
        type: dialogType,
        setFocus: setFocusOnDialog,
        width: dialogWidth,
        height: dialogHeight,
        props: props,
      };
      commit("changeDialog", dialogProps);
    },
    initDialog({ commit }) {
      const dialogProps: Dialog = {
        isDisplayed: false,
        type: "",
        setFocus: false,
        width: "",
        height: "",
        props: null,
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
    updateEnvironmentOperators({ commit }, [appId, environments]) {
      commit("doUpdateEnvironmentOperators", [appId, environments]);
    },
    updateApplicationOperators({ commit }, [appId, operators]) {
      commit("doUpdateApplicationOperators", [appId, operators]);
    },
    updateRootAdministrators({ commit }, operators: OperatorModel[]) {
      commit("doUpdateRootAdministrators", operators);
    },
    toast({ commit }, [message, contentClass]) {
      const toastProps: Toast = {
        isDisplayed: true,
        message: message,
        contentClass: contentClass,
      };
      commit("doToast", toastProps);
    },
    isStepTouched({ state }, stepNumber: number) {
      const index = StepModelIndices[stepNumber];
      return state.portfolioSteps[index].touched;
    },
    updateRootAdminInfo({ commit }, [index, display_name, email]) {
      commit("doUpdateRootAdminInfo", [index, display_name, email]);
    },
    updateApplicationOperatorInfo(
      { commit },
      [applicationId, access, display_name, email, originalEmail]
    ) {
      commit("doUpdateApplicationOperatorInfo", [
        applicationId,
        access,
        display_name,
        email,
        originalEmail,
      ]);
    },
    updateEnvironmentOperatorInfo(
      { commit },
      [applicationId, display_name, email, originalEmail, envs]
    ) {
      commit("doUpdateEnvironmentOperatorInfo", [
        applicationId,
        display_name,
        email,
        originalEmail,
        envs,
      ]);
    },
  },
  modules: {},
  /*
  ██████████████████████████████████████████████████████████

   ██████  ███████ ████████ ████████ ███████ ██████  ███████
  ██       ██         ██       ██    ██      ██   ██ ██
  ██   ███ █████      ██       ██    █████   ██████  ███████
  ██    ██ ██         ██       ██    ██      ██   ██      ██
   ██████  ███████    ██       ██    ███████ ██   ██ ███████

  ██████████████████████████████████████████████████████████
  */
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
    getNavBarItems(state): Navs {
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
              title: state.user.given_name + " " + state.user.family_name,
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
      const values = Object.values(state.portfolioDrafts);
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
    getPortfolio: (state) => state.portfolioSteps[StepModelIndices[1]].model,
    getCurrentApplication: (state) => {
      const applicationIndex = getEntityIndex(
        state.applicationModels,
        (application: ApplicationModel) =>
          application.id === state.currentApplicationId
      );
      return state.applicationModels[applicationIndex];
    },
    getPortfolioOperators: (state) => state.portfolioOperators,
  },
});
